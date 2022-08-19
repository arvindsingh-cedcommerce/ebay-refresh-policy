import { Card, Checkbox, Select, Stack } from "@shopify/polaris";
import { Radio } from "antd";
import React, { useEffect } from "react";

const AppToEbay = ({
  connectedAccountsObject,
  setconnectedAccountsObject,
  account,
}) => {
  const clickHandler = (e, account, field) => {
    let temp = { ...connectedAccountsObject };
    temp[account]["fields"][field]["enable"] = e.target.value;
    // console.log(temp);
    if (connectedAccountsObject[account]['fields']["autoProductSync"]["enable"] === "no") {
      Object.keys(temp[account]['fields']["autoProductSync"]["attribute"]).forEach((attribute1) => {
        temp[account]['fields']["autoProductSync"]["attribute"][attribute1]["value"] = "no";
      });
    }
    setconnectedAccountsObject(temp);
  };
  return (
    <Stack>
      {Object.keys(connectedAccountsObject[account]["fields"]).map((field) => {
        return (
          <Stack vertical spacing="extraTight">
            <>{connectedAccountsObject[account]["fields"][field]["label"]}</>
            <Radio.Group
              defaultValue="a"
              buttonStyle="solid"
              onChange={(e) => clickHandler(e, account, field)}
              value={
                connectedAccountsObject[account]["fields"][field]["enable"]
              }
            >
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Stack>
        );
      })}
      {connectedAccountsObject[account]["fields"]["autoProductSync"][
        "enable"
      ] === "yes" && (
        <Card title="Fields" sectioned>
          <Stack>
            {Object.keys(
              connectedAccountsObject[account]["fields"]["autoProductSync"][
                "attribute"
              ]
            ).map((attribute1) => {
              return (
                <Checkbox
                  label={
                    connectedAccountsObject[account]["fields"][
                      "autoProductSync"
                    ]["attribute"][attribute1]["label"]
                  }
                  checked={
                    connectedAccountsObject[account]["fields"][
                      "autoProductSync"
                    ]["attribute"][attribute1]["value"] === "yes"
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    let parsedValue = e ? "yes" : "no";
                    let temp = { ...connectedAccountsObject };
                    temp[account]["fields"]["autoProductSync"]["attribute"][
                      attribute1
                    ]["value"] = parsedValue;
                    setconnectedAccountsObject(temp);
                  }}
                />
              );
            })}
          </Stack>
        </Card>
      )}
    </Stack>
  );
};

export default AppToEbay;
