import iVnet from "../../../interfaces/iVnet";
import { useState, useEffect, useRef } from "react";
import { useVnetStore } from "../../../store/VnetStore";

function JsonField() {
  const { getSelectedVnet } = useVnetStore();
  const selectedVnet = getSelectedVnet();

  const selectedFields = ["name", "addressspaces", "subnets"];
  const [exportType, setExportType] = useState("json");
  const [output, setOutput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const excludedFields = [
    "id",
    "isStored",
    "ips",
    "range",
    "error",
    "created_at",
    "updated_at",
  ];

  const transformToJSON = (vnet: iVnet, fields: string[]): string => {
    const selectedFields = fields.reduce(
      (obj: Record<string, any>, field: string) => {
        if (field in vnet) {
          if (Array.isArray(vnet[field as keyof iVnet])) {
            obj[field] = (vnet[field as keyof iVnet] as any[]).map(
              (item: any) => {
                return Object.keys(item).reduce(
                  (filteredItem: Record<string, any>, key: string) => {
                    if (!excludedFields.includes(key)) {
                      filteredItem[key] = item[key];
                    }
                    return filteredItem;
                  },
                  {}
                );
              }
            );
          } else {
            obj[field] = vnet[field as keyof iVnet];
          }
        }
        return obj;
      },
      {}
    );

    return JSON.stringify(selectedFields, null, 2);
  };

  const transformToTerraform = (vnet: iVnet): string => {
    let terraformConfig = `resource "azurerm_virtual_network" "${vnet.name}" {
  name                = "${vnet.name}"
  address_space       = [${vnet.addressspaces.map(
    (as) => `"${as.networkaddress}/${as.subnetmask}"`
  )}]
  location            = "West Europe" # Change as necessary
  resource_group_name = "example-resources" # Change as necessary
`;

    vnet.subnets.forEach((subnet) => {
      terraformConfig += `
  subnet {
    name           = "${subnet.name}"
    address_prefix = "${subnet.range}"
  }`;
    });

    terraformConfig += `
}`;

    return terraformConfig;
  };

  const transformToARM = (vnet: iVnet): string => {
    const armConfig = {
      $schema:
        "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      contentVersion: "1.0.0.0",
      resources: [
        {
          type: "Microsoft.Network/virtualNetworks",
          apiVersion: "2020-06-01",
          name: vnet.name,
          location: "West Europe", // Change as necessary
          properties: {
            addressSpace: {
              addressPrefixes: vnet.addressspaces.map(
                (as) => `${as.networkaddress}/${as.subnetmask}`
              ),
            },
            subnets: vnet.subnets.map((subnet) => ({
              name: subnet.name,
              properties: {
                addressPrefix: subnet.range,
              },
            })),
          },
        },
      ],
    };

    return JSON.stringify(armConfig, null, 2);
  };

  const transformToBicep = (vnet: iVnet): string => {
    let bicepConfig = `resource symbolicname 'Microsoft.Network/virtualNetworks@2023-11-01' = {
  name: '${vnet.name}'
  location: 'West Europe' // Change as necessary
  properties: {
    addressSpace: {
      addressPrefixes: [
        ${vnet.addressspaces
          .map((as) => `'${as.networkaddress}/${as.subnetmask}'`)
          .join(", ")}
      ]
    }
    subnets: [
      ${vnet.subnets
        .map(
          (subnet) => `{
        name: '${subnet.name}'
        properties: {
          addressPrefix: '${subnet.range}'
        }
      }`
        )
        .join(", ")}
    ]
  }
}`;

    return bicepConfig;
  };

  const handleExport = () => {
    let transformedOutput = "";
    switch (exportType) {
      case "json":
        transformedOutput = transformToJSON(selectedVnet, selectedFields);
        break;
      case "terraform":
        transformedOutput = transformToTerraform(selectedVnet);
        break;
      case "arm":
        transformedOutput = transformToARM(selectedVnet);
        break;
      case "bicep":
        transformedOutput = transformToBicep(selectedVnet);
        break;
      default:
        transformedOutput = transformToJSON(selectedVnet, selectedFields);
    }
    setOutput(transformedOutput);
  };

  const downloadFile = (
    content: string,
    fileName: string,
    contentType: string
  ) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    let fileName = ``;
    let contentType = "text/plain";

    switch (exportType) {
      case "json":
        contentType = "application/json";
        fileName = `${selectedVnet.name}.json`;
        break;
      case "terraform":
        contentType = "text/plain";
        fileName = `${selectedVnet.name}.tf`;
        break;
      case "arm":
        contentType = "application/json";
        fileName = `${selectedVnet.name}.json`;
        break;
      case "bicep":
        contentType = "text/plain";
        fileName = `${selectedVnet.name}.bicep`;
        break;
    }

    downloadFile(output, fileName, contentType);
  };

  useEffect(() => {
    handleExport();
  }, [exportType, selectedVnet]);

  return (
    <div className="flex flex-col space-y-4 pb-10 ">
      <div className="flex flex-row space-x-4 items-center pt-4 ">
        <div className="flex-start pl-4 font-medium">Type:</div>
        <div className="flex-start">
          <select
            id="subnetexports"
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="bg-gray-200 rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5"
          >
            <option value="json">JSON</option>
            <option value="terraform">Terraform</option>
            <option value="bicep">Bicep</option>
            <option value="arm">Azure Resource Manager</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center content-center w-full ">
        <div className="flex justify-center content-center w-full">
          <textarea
            ref={textareaRef}
            value={output}
            className="border border-sky-800 flex w-full bg-white rounded-lg min-h-[500px] resize-none p-4"
            readOnly
          ></textarea>
        </div>
      </div>
      <div className="flex justify-center mt-4 pb-2">
        <button
          className="inline-flex items-center justify-center w-10 h-10 mr-2 text-slate-50 duration-150 bg-sky-800 rounded-lg focus:shadow-outline hover:bg-secondary hover:scale-110 transition"
          onClick={handleDownload}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              d="M13 11L21.2 2.80005"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 6.8V2H17.2"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default JsonField;
