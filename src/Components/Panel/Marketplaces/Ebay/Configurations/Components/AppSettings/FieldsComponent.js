import { Checkbox, Stack } from "@shopify/polaris";
import React from "react";

const FieldsComponent = ({
  connectedAccountsObject,
  setconnectedAccountsObject,
  account,
}) => {
  return (
    <Stack>
      {Object.keys(connectedAccountsObject[account]["fields"]).map((field) => {
        return (
          <Checkbox
            label={connectedAccountsObject[account]["fields"][field]['label']}
            checked={connectedAccountsObject[account]["fields"][field]['value'] === 'yes' ? true : false}
            onChange={(e) => {
              let temp = { ...connectedAccountsObject };
              temp[account]["fields"][field]['value'] = e ? 'yes' : 'no';
              setconnectedAccountsObject(temp);
            }}
          />
        );
      })}
    </Stack>
  );
};

export default FieldsComponent;
