import React, { useState, useEffect } from "react";
import { useVnetStore } from "../../store/VnetStore";
import SubnetMaskSelect from "../elements/SubnetMaskSelect";
import DeleteButton from "../elements/buttons/DeleteButton";
import {
  getIpaddressesCount,
  getAddressSpace,
} from "../../api/calculatorCalls";
import { useUserStore } from "../../store/UserStore";
import ActionModals from "../elements/modals/NoFocusModal";

interface AddressSpaceProps {
  networkAddress: string;
  subnetMask: number;
  id: number;
  index: number;
  handleAddAddressSpace: () => void;
}

const AddressSpace: React.FC<AddressSpaceProps> = ({
  networkAddress,
  subnetMask,
  id,
}) => {
  const {
    deleteAddressSpace,
    checkIfVnetSubnetMaskIsValid,
    updateAddressSpaceSubnetMask,
    updateAddressSpaceNetworkAddress,
    getAddressSpaceCIDRList,
    deleteSubnetsWithinRange,
    getAddressSpaces,
  } = useVnetStore();
  const { userLoginStatus, setUnsavedChanges } = useUserStore();
  const [IpIsValid, setIpIsValid] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("");
  const [ips, setIps] = useState(256);
  const [showAddressSpaceMaskWarningPop, setAddressSpaceMaskWarningPop] =
    useState(false);

  const addressSpaces = getAddressSpaces();

  const validateAndFetchAddressSpace = async (
    networkAddress: string,
    subnetMask: number,
    id: number
  ) => {
    if (validateIP(networkAddress)) {
      setIpIsValid(true);

      try {
        const otherAddressSpaces = getAddressSpaceCIDRList(id);

        const addressSpace = await getAddressSpace(
          networkAddress + "/" + subnetMask,
          otherAddressSpaces,
          IpIsValid
        );
        setError("");
        setRange(addressSpace);
        const ipCount = await getIpaddressesCount(subnetMask);
        setIps(ipCount);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    } else {
      setIpIsValid(false);
    }
  };

  const handleNetworkAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newNetworkAddress = e.target.value;
    updateAddressSpaceNetworkAddress(id, newNetworkAddress);
    await validateAndFetchAddressSpace(newNetworkAddress, subnetMask, id);
    setUnsavedChanges(true);
  };

  const handleVnetMaskChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSubnetMask = parseInt(e.target.value);

    if (
      (await checkIfVnetSubnetMaskIsValid(networkAddress, newSubnetMask)) ===
      true
    ) {
      updateAddressSpaceSubnetMask(id, newSubnetMask);
      validateAndFetchAddressSpace(networkAddress, newSubnetMask, id);
    } else {
      setAddressSpaceMaskWarningPop(true);
    }
    setUnsavedChanges(true);
  };

  const handleDeleteAddressSpace = () => {
    if (IpIsValid) {
      const cidrRange = `${networkAddress}/${subnetMask}`;
      deleteSubnetsWithinRange(cidrRange);
      deleteAddressSpace(id);
    } else {
      deleteAddressSpace(id);
      setUnsavedChanges(true);
      setError("");
      setIpIsValid(true);
    }
  };

  const validateIP = (ip: string) => {
    const regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  useEffect(() => {
    validateAndFetchAddressSpace(networkAddress, subnetMask, id);
  }, [networkAddress, subnetMask]);

  return (
    <div className="flex flex-1 flex-row space-x-4">
      <div className="flex flex-col flex-1">
        <div className="flex-1 rounded-lg ">
          <input
            type="text"
            placeholder=""
            value={networkAddress}
            className="text-m sm:text-base rounded-lg focus:outline-secondary pl-4 h-10 bg-gray-200 w-full"
            onChange={handleNetworkAddressChange}
          />
        </div>
        <div className="flex-1 pt-1">
          {IpIsValid === false ? (
            <div className="text-warning text-m">Invalid IP Address</div>
          ) : error !== "" ? (
            <div className="text-warning text-m ">{error}</div>
          ) : (
            <div className="text-sky-800 text-m ">{range}</div>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="rounded-lg !bg-gray-200">
          <SubnetMaskSelect
            elementID={"ip_size_input"}
            value={subnetMask}
            tailWindConfig={
              "sm:text-base rounded-lg text-m pl-4 h-10 !bg-gray-200 focus:outline-secondary"
            }
            type="vnet"
            onChangeFunction={handleVnetMaskChange}
          />
        </div>
        <div className="flex-1 text-sky-800 text-m pt-1">{ips}</div>
      </div>
      {userLoginStatus == true ? (
        addressSpaces.length > 1 ? (
          <DeleteButton
            status={"active"}
            onClickFunction={handleDeleteAddressSpace}
            height="h-10 w-10"
          />
        ) : (
          <DeleteButton
            status={"inactive"}
            onClickFunction={handleDeleteAddressSpace}
            height="h-10 w-10"
          />
        )
      ) : null}
      {showAddressSpaceMaskWarningPop === true ? (
        <ActionModals
          message={"Address range cannot be changed if subnets are filled in!"}
          onClose={() => setAddressSpaceMaskWarningPop(false)}
          type={"warning"}
        />
      ) : null}
    </div>
  );
};

export default AddressSpace;
