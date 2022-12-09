import { Select, Stack } from "@shopify/polaris";
import React from "react";

const Template = ({
  templateOptions,
  connectedAccountsObject,
  account,
  setconnectedAccountsObject,
}) => {
  const handleChange = (e, templateOption) => {
    let temp = { ...connectedAccountsObject };
    temp[account][templateOption] = e;
    setconnectedAccountsObject(temp);
  };
  return (
    <Stack distribution="fill">
      {Object.keys(templateOptions).map((templateOption) => {
        return (
          <Select
            options={
              templateOption !== "categoryTemplate"
                ? templateOptions[templateOption]
                : templateOptions[templateOption].filter(
                    (template) => template["account"] === account
                  )
            }
            label={templateOption.toUpperCase()}
            onChange={(e) => handleChange(e, templateOption)}
            placeholder="Please Select..."
            value={connectedAccountsObject[account][templateOption]}
            key={templateOption}
          />
        );
      })}
    </Stack>
  );
};

export default Template;
