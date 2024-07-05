import { create } from "zustand";
import { compareVnetRangeWithSubnetRangeUsed } from "../api/calculatorCalls";
import iVnet from "../interfaces/iVnet";
import iSubnet from "../interfaces/iSubnet";
import iAddressSpace from "../interfaces/iAddressSpace";
import { Address4, Address6 } from "ip-address";

interface iVnetStore {
  vnets: iVnet[];
  selectedVnetId: number;
  addVnet: (vnet: iVnet) => void;
  setSelectedVnet: (id: number) => void;
  getSelectedVnet: () => iVnet;
  getVnetIdByIndex: (index: number) => number | null;
  updateVnet: (index: number, vnet: iVnet) => void;
  updateSelectedVnetName: (newName: string) => void;
  removeVnetByIndex: (index: number) => void;
  removeVnetById: (id: number) => void;
  clearVnets: () => void;

  // Subnet Operations
  addSubnet: (subnet: iSubnet) => void;
  deleteSubnet: (subnetId: number) => void;
  deleteSubnetsWithinRange: (cidrRange: string) => void;
  updateSubnet: (subnet: iSubnet) => void;
  deleteAllSubnets: () => void;
  getSubnets: () => iSubnet[];
  getSubnetsExcludingID: (id: number) => iSubnet[];
  setError: (id: number, error: string) => void;
  checkErrorInEntries: () => boolean;

  // AddressSpace Operations
  addAddressSpace: (addressSpace: iAddressSpace) => void;
  deleteAddressSpace: (addressSpaceId: number) => void;
  updateAddressSpace: (addressSpace: iAddressSpace) => void;
  updateAddressSpaceNetworkAddress: (
    id: number,
    newNetworkAddress: string
  ) => void;
  updateAddressSpaceSubnetMask: (id: number, newSubnetMask: number) => void;
  getAddressSpaces: () => iAddressSpace[];
  getAddressSpaceCIDRList: (currentAddressSpaceId: number) => string[];

  // VNet Validation
  checkIfVnetSubnetMaskIsValid: (
    networkaddress: string,
    subnetmask: number
  ) => Promise<boolean>;
}

const defaultVnet: iVnet = {
  id: 0,
  name: "VnetName",
  isStored: false,
  addressspaces: [
    {
      id: 0,
      networkaddress: "10.0.0.0",
      subnetmask: 24,
      isStored: false,
    },
  ],
  subnets: [
    {
      id: 0,
      name: "SubnetName",
      isStored: false,
      subnetmask: 25,
      ips: 128,
      range: "10.0.0.0 - 10.0.0.127",
      error: "",
    },
  ],
};

const vnetStore = create<iVnetStore>((set, get) => ({
  vnets: [defaultVnet],
  selectedVnetId: defaultVnet.id,
  // VNet Operations
  addVnet: (vnet) => set((state) => ({ vnets: [...state.vnets, vnet] })),
  setSelectedVnet: (id) => set(() => ({ selectedVnetId: id })),
  getSelectedVnet: () => {
    const { selectedVnetId, vnets } = get();
    return vnets.find((vnet) => vnet.id === selectedVnetId) || defaultVnet;
  },
  getVnetIdByIndex: (index) => {
    const { vnets } = get();
    return vnets[index] ? vnets[index].id : null;
  },
  updateVnet: (index, vnet) =>
    set((state) => ({
      vnets: state.vnets.map((currentVnet, i) =>
        i === index ? vnet : currentVnet
      ),
    })),
  updateSelectedVnetName: (newName: string) => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((v) =>
      v.id === selectedVnetId ? { ...v, name: newName } : v
    );
    set(() => ({
      vnets: updatedVnets,
    }));
  },
  removeVnetByIndex: (index) =>
    set((state) => ({
      vnets: state.vnets.filter((_, i) => i !== index),
    })),
  removeVnetById: (id) =>
    set((state) => ({
      vnets: state.vnets.filter((vnet) => vnet.id !== id),
    })),
  clearVnets: () => set(() => ({ vnets: [] })),

  // Subnet Operations
  addSubnet: (subnet) =>
    set((state) => {
      const selectedVnet = state.vnets.find(
        (vnet) => vnet.id === state.selectedVnetId
      );
      if (selectedVnet) {
        selectedVnet.subnets.push(subnet);
      }
      return { vnets: [...state.vnets] };
    }),
  updateSubnet: (updatedSubnet) =>
    set((state) => {
      const selectedVnet = state.vnets.find(
        (vnet) => vnet.id === state.selectedVnetId
      );
      if (selectedVnet) {
        selectedVnet.subnets = selectedVnet.subnets.map((subnet) =>
          subnet.id === updatedSubnet.id
            ? { ...subnet, ...updatedSubnet }
            : subnet
        );
      }
      return { vnets: [...state.vnets] };
    }),
  deleteSubnet: (subnetId) => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((vnet) =>
      vnet.id === selectedVnetId
        ? {
            ...vnet,
            subnets: vnet.subnets.filter((subnet) => subnet.id !== subnetId),
          }
        : vnet
    );
    set(() => ({ vnets: updatedVnets }));
  },
  deleteAllSubnets: () => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((vnet) =>
      vnet.id === selectedVnetId ? { ...vnet, subnets: [] } : vnet
    );
    set(() => ({ vnets: updatedVnets }));
  },
  deleteSubnetsWithinRange: (cidrRange: string) => {
    const { selectedVnetId, vnets } = get();
    const network = new Address4(cidrRange); // Use Address4 or Address6 based on your IP version

    const updatedVnets = vnets.map((vnet) => {
      if (vnet.id === selectedVnetId) {
        const updatedSubnets = vnet.subnets.filter((subnet) => {
          const subnetCidr = `${subnet.range.split(" - ")[0]}/${
            subnet.subnetmask
          }`;
          const subnetNetwork = new Address4(subnetCidr); // Use Address4 or Address6 based on your IP version

          return !subnetNetwork.isInSubnet(network);
        });
        return { ...vnet, subnets: updatedSubnets };
      }
      return vnet;
    });
    set({ vnets: updatedVnets });
  },
  getSubnets: () => {
    const selectedVnet = get().getSelectedVnet();
    return selectedVnet ? selectedVnet.subnets : [];
  },
  getSubnetsExcludingID: (id) => {
    const selectedVnet = get().getSelectedVnet();
    return selectedVnet
      ? selectedVnet.subnets.filter((subnet) => subnet.id !== id)
      : [];
  },
  setError: (id, error) => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((vnet) =>
      vnet.id === selectedVnetId
        ? {
            ...vnet,
            subnets: vnet.subnets.map((subnet) =>
              subnet.id === id ? { ...subnet, error } : subnet
            ),
          }
        : vnet
    );
    set(() => ({ vnets: updatedVnets }));
  },
  checkErrorInEntries: () => {
    const selectedVnet = get().getSelectedVnet();
    return selectedVnet
      ? selectedVnet.subnets.some((subnet) => subnet.error !== "")
      : false;
  },

  // AddressSpace Operations
  addAddressSpace: (addressSpace) => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((vnet) =>
      vnet.id === selectedVnetId
        ? {
            ...vnet,
            addressspaces: [...vnet.addressspaces, addressSpace],
          }
        : vnet
    );
    set(() => ({ vnets: updatedVnets }));
  },
  deleteAddressSpace: (addressSpaceId) => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((vnet) =>
      vnet.id === selectedVnetId
        ? {
            ...vnet,
            addressspaces: vnet.addressspaces.filter(
              (addressSpace) => addressSpace.id !== addressSpaceId
            ),
          }
        : vnet
    );
    set(() => ({ vnets: updatedVnets }));
  },
  getAddressSpaceCIDRList: (currentAddressSpaceId) => {
    const selectedVnet = get().getSelectedVnet();
    return selectedVnet
      ? selectedVnet.addressspaces
          .filter((addressSpace) => addressSpace.id !== currentAddressSpaceId)
          .map(
            (addressSpace) =>
              `${addressSpace.networkaddress}/${addressSpace.subnetmask}`
          )
      : [];
  },

  updateAddressSpace: (updatedAddressSpace) => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((vnet) =>
      vnet.id === selectedVnetId
        ? {
            ...vnet,
            addressspaces: vnet.addressspaces.map((addressSpace) =>
              addressSpace.id === updatedAddressSpace.id
                ? updatedAddressSpace
                : addressSpace
            ),
          }
        : vnet
    );
    set(() => ({ vnets: updatedVnets }));
  },
  updateAddressSpaceNetworkAddress: (id, newNetworkAddress) => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((vnet) =>
      vnet.id === selectedVnetId
        ? {
            ...vnet,
            addressspaces: vnet.addressspaces.map((addressSpace) =>
              addressSpace.id === id
                ? { ...addressSpace, networkaddress: newNetworkAddress }
                : addressSpace
            ),
          }
        : vnet
    );
    set(() => ({ vnets: updatedVnets }));
  },
  updateAddressSpaceSubnetMask: (id, newSubnetMask) => {
    const { selectedVnetId, vnets } = get();
    const updatedVnets = vnets.map((vnet) =>
      vnet.id === selectedVnetId
        ? {
            ...vnet,
            addressspaces: vnet.addressspaces.map((addressSpace) =>
              addressSpace.id === id
                ? { ...addressSpace, subnetmask: newSubnetMask }
                : addressSpace
            ),
          }
        : vnet
    );
    set(() => ({ vnets: updatedVnets }));
  },
  getAddressSpaces: () => {
    const selectedVnet = get().getSelectedVnet();
    return selectedVnet ? selectedVnet.addressspaces : [];
  },

  // VNet Validation
  checkIfVnetSubnetMaskIsValid: async (
    networkAddress: string,
    subnetmask: number
  ) => {
    try {
      const selectedVnet = get().getSelectedVnet();
      if (!selectedVnet) return false;

      const usedRanges = get()
        .getSubnets()
        .map((entry) => {
          const firstIp = entry.range.split(" - ")[0];
          return `${firstIp}/${entry.subnetmask}`;
        });

      // Temporarily add the new subnet mask for validation
      const vnetCidrs = selectedVnet.addressspaces.map((addressSpace) =>
        addressSpace.networkaddress === networkAddress
          ? `${addressSpace.networkaddress}/${subnetmask}`
          : `${addressSpace.networkaddress}/${addressSpace.subnetmask}`
      );

      const isValid = await compareVnetRangeWithSubnetRangeUsed(
        vnetCidrs,
        usedRanges
      );

      return isValid;
    } catch (error) {
      console.error("Error validating subnet mask:", error);
      return false; // Default to false on error
    }
  },
}));

export const useVnetStore = () => {
  const {
    vnets,
    selectedVnetId,
    addVnet,
    setSelectedVnet,
    getSelectedVnet,
    getVnetIdByIndex,
    updateVnet,
    updateSelectedVnetName,
    removeVnetByIndex,
    removeVnetById,
    clearVnets,

    addSubnet,
    deleteSubnet,
    updateSubnet,
    deleteAllSubnets,
    deleteSubnetsWithinRange,
    getSubnets,
    getSubnetsExcludingID,
    setError,
    checkErrorInEntries,

    addAddressSpace,
    deleteAddressSpace,
    updateAddressSpace,
    updateAddressSpaceNetworkAddress,
    updateAddressSpaceSubnetMask,
    getAddressSpaces,
    getAddressSpaceCIDRList,

    checkIfVnetSubnetMaskIsValid,
  } = vnetStore();

  return {
    vnets,
    selectedVnetId,
    addVnet,
    setSelectedVnet,
    getSelectedVnet,
    getVnetIdByIndex,
    updateVnet,
    updateSelectedVnetName,
    removeVnetByIndex,
    removeVnetById,
    clearVnets,

    addSubnet,
    deleteSubnet,
    updateSubnet,
    deleteAllSubnets,
    deleteSubnetsWithinRange,
    getSubnets,
    getSubnetsExcludingID,
    setError,
    checkErrorInEntries,

    addAddressSpace,
    deleteAddressSpace,
    updateAddressSpace,
    updateAddressSpaceNetworkAddress,
    updateAddressSpaceSubnetMask,
    getAddressSpaces,
    getAddressSpaceCIDRList,

    checkIfVnetSubnetMaskIsValid,
  };
};
