import NetworkIcon from "../../styles/network.png";
import { useVnetStore } from "../../store/VnetStore";
import { useUserStore } from "../../store/UserStore";
import FocusModal from "../elements/modals/FocusModal";
import { useEffect, useState } from "react";
import AddButton from "../elements/buttons/AddButton";

function NetworkSidebar() {
  const { vnets, addVnet, setSelectedVnet, selectedVnetId, getSelectedVnet } =
    useVnetStore();
  const { unsavedChanges, setUnsavedChanges } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const [pendingVnetId, setPendingVnetId] = useState<number | null>(null);
  const { userLoginStatus } = useUserStore();

  const newVnet = {
    id: vnets.length > 0 ? Math.max(...vnets.map((v) => v.id)) + 1 : 1,
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
        subnetmask: 25,
        ips: 128,
        range: "10.0.0.0 - 10.0.0.128",
        error: "",
        isStored: false,
      },
    ],
  };

  const handleAddVnet = () => {
    if (!unsavedChanges) {
      addVnet(newVnet);
      setSelectedVnet(newVnet.id);
    }
    setUnsavedChanges(true);
  };

  const handleVnetSelect = (vnetId: number) => {
    if (selectedVnetId !== vnetId) {
      if (unsavedChanges || getSelectedVnet().isStored === false) {
        setPendingVnetId(vnetId);
        setShowModal(true);
      } else {
        setSelectedVnet(vnetId);
      }
    }
  };

  const handleCloseModal = (confirm: boolean) => {
    setShowModal(false);
    if (confirm && pendingVnetId !== null) {
      setSelectedVnet(pendingVnetId);
      setUnsavedChanges(false);
    }
    setPendingVnetId(null);
  };

  useEffect(() => {
    if (vnets.length === 0) addVnet(newVnet); // This is the line that causes the error
    getSelectedVnet();
  }, [userLoginStatus]);

  return (
    <>
      <aside
        id="default-sidebar"
        className="left-0 w-64 h-full sm:translate-x-0 bg-gray-200 rounded-lg"
        aria-label="Sidebar"
      >
        <div className="pt-4 px-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex text-lg font-medium h-10 items-center">
              <h3>Virtuel Networks</h3>
            </div>
            <div className="flex-none">
              {unsavedChanges ? null : (
                <div className="flex flex-1 items-start">
                  <AddButton
                    status={"active"}
                    onClickFunction={handleAddVnet}
                    height="h-10 w-10"
                  ></AddButton>
                </div>
              )}
            </div>
          </div>
          <ul className="space-y-2 font-medium pt-4">
            {vnets.map((vnet) => (
              <li key={vnet.id} onClick={() => handleVnetSelect(vnet.id)}>
                <div
                  className={`flex items-center p-2 rounded-lg  ${
                    selectedVnetId === vnet.id
                      ? "bg-primary text-white font-normal"
                      : "bg-white hover:bg-secondary hover:text-white"
                  }`}
                >
                  <img
                    className="h-6 w-6"
                    src={NetworkIcon}
                    alt="Network Icon"
                  />
                  <div
                    className={`pr-2 flex-1 text-center w-full h-full ${
                      selectedVnetId === vnet.id
                        ? "text-white"
                        : "text-black hover:text-white"
                    }`}
                  >
                    {vnet.name}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {showModal && (
        <FocusModal
          onClose={handleCloseModal}
          message={
            "Are you sure you want to leave your Vnet config without saving?"
          }
        />
      )}
    </>
  );
}

export default NetworkSidebar;
