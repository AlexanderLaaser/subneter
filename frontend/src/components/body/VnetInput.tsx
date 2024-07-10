import React, { useEffect, useState } from "react";
import { useVnetStore } from "../../store/VnetStore";
import { getAllVnets } from "../../api/persistenceCalls";
import { useUserStore } from "../../store/UserStore";
import { getCurrentUser } from "../../api/userCalls";
import AddressSpace from "../body/AddressSpace";
import iVnet from "../../interfaces/iVnet";
import AddButton from "../elements/buttons/AddButton";

function VnetInput() {
  const {
    addVnet,
    getSelectedVnet,
    setSelectedVnet,
    selectedVnetId,
    updateSelectedVnetName,
    addAddressSpace,
    getAddressSpaces,
    clearVnets,
    getVnetIdByIndex,
  } = useVnetStore();

  const {
    userLoginStatus,
    setuserLoginStatus,
    setFirstname,
    setLastname,
    setEmail,
    setUnsavedChanges,
  } = useUserStore();

  const [IpIsValid, setIpIsValid] = useState(true);
  const [nameError, setNameError] = useState("");
  const addressSpaces = getAddressSpaces();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    updateSelectedVnetName(newName);

    // Check if the name is empty and set the error state
    if (!newName.trim()) {
      setNameError("Virtuel Network Name is required");
    } else {
      setNameError("");
    }

    //Setting a true value in the unsavedChanges state to enable model in case user didnt save changes
    setUnsavedChanges(true);
  };

  const handleAddAddressSpace = () => {
    addAddressSpace({
      id: Math.random(),
      networkaddress: "",
      subnetmask: 24,
      isStored: false,
    });
    setUnsavedChanges(true);
  };

  const fetchAddressSpace = async () => {
    try {
      const selectedVnet = getSelectedVnet();
      if (!selectedVnet) return;
    } catch (error) {
      if (error instanceof Error) {
      }
    }
  };

  const loadAllStoredVnets = async (): Promise<void> => {
    try {
      const vnetConfig = await getAllVnets(userLoginStatus);
      if (vnetConfig.length !== 0 && Array.isArray(vnetConfig)) {
        const updatedVnets = vnetConfig.map((vnet: iVnet) => ({
          ...vnet,
          isStored: true, // Set the isStored value to true
        }));
        clearVnets();
        updatedVnets.forEach((vnet: iVnet) => {
          addVnet(vnet);
        });
      } else {
        setIpIsValid(true);
      }
    } catch (error) {
      setIpIsValid(true);
    }
  };

  async function setUserData() {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setuserLoginStatus(true);
        setFirstname(userData.user.first_name);
        setLastname(userData.user.last_name);
        setEmail(userData.user.email);
      } else {
        setuserLoginStatus(false);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      setuserLoginStatus(false);
    }
  }

  async function setFirstVnetAsSelected() {
    const firstVnetId = getVnetIdByIndex(0);
    if (firstVnetId !== null) {
      setSelectedVnet(firstVnetId);
    }
  }

  useEffect(() => {
    setUserData();
  }, []);

  useEffect(() => {
    if (userLoginStatus === true) {
      loadAllStoredVnets().then(() => {
        setFirstVnetAsSelected();
      });
    }
  }, [userLoginStatus]);

  useEffect(() => {
    const selectedVnet = getSelectedVnet();
    if (selectedVnet && IpIsValid) {
      fetchAddressSpace();
    }
    if (getSelectedVnet().isStored === true) {
      loadAllStoredVnets();
    }
  }, [selectedVnetId, IpIsValid]);

  return (
    <>
      <div className="flex flex-1 sm:flex-col pt-16 xl:space-x-10 xl:flex-row font-sans">
        <div className="flex flex-1 flex-col space-y-4" id="vnetconfig">
          <div
            className="flex-start text-lg text-primary font-medium h-10 w-10"
            id="vnetname"
          >
            Networkname
          </div>
          <div className="flex-start rounded-lg ">
            <input
              id="vnetInput"
              placeholder=""
              type="text"
              value={getSelectedVnet()?.name || ""}
              className="bg-gray-200 text-sm sm:text-base hover:outline-secondary focus:outline-secondary pl-4 pr-4 rounded-lg h-10 w-full "
              onChange={handleNameChange}
            ></input>
            {nameError && (
              <div className="text-warning font-normal text-m pt-1">
                {nameError}
              </div>
            )}
          </div>
          <div className="flex-1"></div>
        </div>
        <div
          className="flex flex-1 flex-col space-y-4"
          id="addressspaceNetworkAddress"
        >
          <div
            className=" flex flex-row flex-1 text-lg font-medium text-primary"
            id="vnetname"
          >
            <div className="flex-1 font-primary">Address space</div>
            <div className="flex flex-end">
              <div className="flex flex-col content-center " id="addbutton">
                <div className="flex flex-1 items-start">
                  <AddButton
                    status={"active"}
                    onClickFunction={handleAddAddressSpace}
                    height="h-10 w-10"
                  ></AddButton>
                </div>
              </div>
            </div>
          </div>
          {addressSpaces.map((addressSpace, index) => (
            <AddressSpace
              key={addressSpace.id}
              id={addressSpace.id || 0}
              networkAddress={addressSpace.networkaddress}
              subnetMask={addressSpace.subnetmask}
              index={index}
              handleAddAddressSpace={handleAddAddressSpace}
            />
          ))}
          <div className="flex-1"></div>
        </div>
      </div>
    </>
  );
}

export default VnetInput;
