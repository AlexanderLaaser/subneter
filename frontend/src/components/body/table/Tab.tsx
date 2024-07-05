import React, { useEffect, useState } from "react";
import Table from "./SubnetsTab";

import JsonField from "./ExportTab";
import { useUserStore } from "../../../store/UserStore";

function Tab() {
  const [activeTab, setActiveTab] = useState("calculator-tab");
  const { userLoginStatus } = useUserStore();

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab("calculator-tab");
  }, [userLoginStatus]);

  return (
    <>
      <div className="flex flex-1 justify-center content-center flex-col">
        <div className="flex justify-center content-center w-full">
          <div className="w-full pt-4 ">
            <ul
              className="flex space-x-4 flex-wrap -mb-px text-sm text-center text-zinc-950 border-b border-zinc-950 dark:border-zinc-950"
              id="default-tab"
              data-tabs-toggle="#default-Subnet-calculator-tab"
              role="tablist"
            >
              <li className="me-2" role="presentation">
                <button
                  className={`text-lg inline-block border-b-2 pb-2 rounded-t-lg hover:border-secondary hover:text-secondary ${
                    activeTab === "calculator-tab"
                      ? "text-primary border-primary font-medium"
                      : ""
                  }`}
                  id="calculator-tab"
                  data-tabs-target="#calculator"
                  type="button"
                  role="tab"
                  aria-controls="calculator"
                  aria-selected={activeTab === "calculator-tab"}
                  onClick={() => handleTabClick("calculator-tab")}
                >
                  Subnets
                </button>
              </li>
              {userLoginStatus && (
                <li className="me-2" role="presentation">
                  <button
                    className={`text-lg inline-block border-b-2 pb-2 rounded-t-lg hover:border-secondary hover:text-secondary ${
                      activeTab === "json-tab"
                        ? "text-primary border-primary font-medium"
                        : ""
                    }`}
                    id="json-tab"
                    data-tabs-target="#json"
                    type="button"
                    role="tab"
                    aria-controls="json"
                    aria-selected={activeTab === "json-tab"}
                    onClick={() => handleTabClick("json-tab")}
                  >
                    Export
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div id="default-tab-content">
          <div
            className={`  ${activeTab !== "calculator-tab" ? "hidden" : ""}`}
            id="calculator"
            role="tabpanel"
            aria-labelledby="calculator-tab"
          >
            <Table />
          </div>
          <div
            className={`flex flex-col ${
              activeTab !== "json-tab" ? "hidden" : ""
            }`}
            id="json"
            role="tabpanel"
            aria-labelledby="json-tab"
          >
            <JsonField></JsonField>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tab;
