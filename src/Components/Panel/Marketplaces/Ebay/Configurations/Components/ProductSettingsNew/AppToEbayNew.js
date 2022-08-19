import {
  Banner,
  Button,
  Card,
  Stack,
  Thumbnail,
  Tooltip,
} from "@shopify/polaris";
import { Checkbox, Divider, Image, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../../Apirequest/accountsApi";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../services/notify";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../../URLs/ConfigurationURL";
import { getCountryName } from "../../../../../Accounts/NewAccount";
import AccountTabContent from "../../../Profile/Profilepages/Components/AccountTabContent";
import AccountTabContentConfig from "./AccountTabContentConfig";
import { countryArray, stateArray } from "./countryData";

const { TabPane } = Tabs;
const { Text, Title } = Typography;

const AppToEbayNew = ({
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  // const [connectedAccountsObject, setconnectedAccountsObject] = useState({});

  // tabs
  const [panes, setPanes] = useState({});

  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const [connectedAccountsObjectErrors, setConnectedAccountsObjectErrors] =
    useState({});

  useEffect(() => {
    if (Object.keys(connectedAccountsObject).length > 0) {
      const filteredArray = Object.keys(connectedAccountsObject)
        .filter((account) => {
          return connectedAccountsObject[account]["checked"];
        })
        .reduce(
          (obj, key) => ({
            ...obj,
            [key]: {
              ...connectedAccountsObject[key],
              content: (
                <AccountTabContentConfig
                  account={key}
                  content={connectedAccountsObject[key]}
                  connectedAccountsObject={connectedAccountsObject}
                  setconnectedAccountsObject={setconnectedAccountsObject}
                  connectedAccountsObjectErrors={connectedAccountsObjectErrors}
                />
              ),
            },
          }),
          {}
        );
      setPanes(filteredArray);
    }
  }, [connectedAccountsObject, connectedAccountsObjectErrors]);

  const validate = () => {
    let errorCount = 0;
    let tempObjError = {
      // product_settings: {
      //   app_to_ebay: {},
      // },
      // setting_type: ["product_settings"],
    };
    for (const account in connectedAccountsObject) {
      if (connectedAccountsObject[account]["checked"]) {
        tempObjError
        // ["product_settings"]["app_to_ebay"]
        [
          connectedAccountsObject[account]["value"]
        ] = { fields: {} };
        Object.keys(connectedAccountsObject[account]["fields"]).forEach(
          (field) => {
            if (field === "itemLocation") {
              tempObjError
              // ["product_settings"]["app_to_ebay"]
              [
                connectedAccountsObject[account]["value"]
              ]["fields"][field] = {};
              for (const key in connectedAccountsObject[account]["fields"][
                field
              ]) {
                if (key === "enable") {
                  tempObjError
                  // ["product_settings"]["app_to_ebay"]
                  [
                    connectedAccountsObject[account]["value"]
                  ]["fields"][field][key] =
                    connectedAccountsObject[account]["fields"][field][key];
                } else if (key === "attribute") {
                  tempObjError
                  // ["product_settings"]["app_to_ebay"]
                  [
                    connectedAccountsObject[account]["value"]
                  ]["fields"][field][key] = {};
                  for (const attribute1 in connectedAccountsObject[account][
                    "fields"
                  ][field][key]) {
                    if (
                      !connectedAccountsObject[account]["fields"][field][key][
                        attribute1
                      ]["value"]
                    ) {
                      errorCount++;
                    }
                    tempObjError
                    // ["product_settings"]["app_to_ebay"]
                    [
                      connectedAccountsObject[account]["value"]
                    ]["fields"][field][key][attribute1] =
                      connectedAccountsObject[account]["fields"][field][key][
                        attribute1
                      ]["value"]
                        ? false
                        : "*required";
                  }
                } else if (key === "shopifyWarehouseValue") {
                  tempObjError
                  // ["product_settings"]["app_to_ebay"]
                  [
                    connectedAccountsObject[account]["value"]
                  ]["fields"][field][key] = [];
                  tempObjError
                  // ["product_settings"]["app_to_ebay"]
                  [
                    connectedAccountsObject[account]["value"]
                  ]["fields"][field][key] =
                    connectedAccountsObject[account]["fields"][field][key];
                } else if (key === "match_from_ebay") {
                  tempObjError
                  // ["product_settings"]["app_to_ebay"]
                  [
                    connectedAccountsObject[account]["value"]
                  ]["fields"][field][key] =
                    connectedAccountsObject[account]["fields"][field][key];
                }
              }
            }
          }
        );
      }
    }
    // console.log(tempObjError);
    // console.log(errorCount);
    setConnectedAccountsObjectErrors(tempObjError);
    return errorCount;
  };
  const saveData = async () => {
    const validatedValue = validate();
    if (validatedValue === 0) {
      setSaveBtnLoader(true);
      let tempObj = {
        product_settings: {
          app_to_ebay: {},
        },
        setting_type: ["product_settings"],
      };
      for (const account in connectedAccountsObject) {
        if (connectedAccountsObject[account]["checked"]) {
          tempObj["product_settings"]["app_to_ebay"][
            connectedAccountsObject[account]["shopId"]
          ] = {};
          Object.keys(connectedAccountsObject[account]["fields"]).forEach(
            (field) => {
              tempObj["product_settings"]["app_to_ebay"][
                connectedAccountsObject[account]["shopId"]
              ][field] = {};
              for (const key in connectedAccountsObject[account]["fields"][
                field
              ]) {
                if (key === "enable") {
                  tempObj["product_settings"]["app_to_ebay"][
                    connectedAccountsObject[account]["shopId"]
                  ][field][key] =
                    connectedAccountsObject[account]["fields"][field][key];
                } else if (key === "attribute") {
                  tempObj["product_settings"]["app_to_ebay"][
                    connectedAccountsObject[account]["shopId"]
                  ][field][key] = {};
                  for (const attribute1 in connectedAccountsObject[account][
                    "fields"
                  ][field][key]) {
                    tempObj["product_settings"]["app_to_ebay"][
                      connectedAccountsObject[account]["shopId"]
                    ][field][key][attribute1] =
                      connectedAccountsObject[account]["fields"][field][key][
                        attribute1
                      ]["value"];
                  }
                } else if (key === "shopifyWarehouseValue") {
                  tempObj["product_settings"]["app_to_ebay"][
                    connectedAccountsObject[account]["shopId"]
                  ][field][key] = [];
                  tempObj["product_settings"]["app_to_ebay"][
                    connectedAccountsObject[account]["shopId"]
                  ][field][key] =
                    connectedAccountsObject[account]["fields"][field][key];
                } else if (key === "attributeMapping") {
                  tempObj["product_settings"]["app_to_ebay"][
                    connectedAccountsObject[account]["shopId"]
                  ][field][key] =
                    connectedAccountsObject[account]["fields"][field][key];
                } else if (key === "packageTypeValue") {
                  tempObj["product_settings"]["app_to_ebay"][
                    connectedAccountsObject[account]["shopId"]
                  ][field][key] =
                    connectedAccountsObject[account]["fields"][field][key];
                }
              }
            }
          );
        }
      }
      let { success, message } = await configurationAPI(
        saveAppSettingsShopifyToAppURL,
        tempObj
      );
      if (success) {
        notify.success(message);
      } else {
        notify.error(message);
      }
      setSaveBtnLoader(false);
    } else {
      notify.error("Kindly fill all required details");
    }
  };

  return (
    <Card
      sectioned
      title={
        <Title
          level={4}
          // title="Configure settings to manage the  product details from the App to eBay"
        >
          App To eBay
        </Title>
      }
      actions={[
        {
          content: (
            <Button primary onClick={saveData} loading={saveBtnLoader}>
              Save
            </Button>
          ),
        },
      ]}
    >
      <Stack vertical>
        {/* <Banner>
          <p>
            Default settings will be applied to all the accounts connected with
            the app. And Select eBay accounts you wish to have different
            settings from the default one.
          </p>
        </Banner> */}
        <CheckboxComponent
          connectedAccountsObject={connectedAccountsObject}
          setconnectedAccountsObject={setconnectedAccountsObject}
        />
        {panes.length > 0 && <Divider />}
        <>Selected Accounts</>
        <Tabs onChange={() => {}} type="card">
          {Object.keys(panes).map((pane) => {
            return (
              <TabPane
                tab={
                  panes[pane]["siteID"] ? (
                    <Stack alignment="fill" spacing="tight">
                      <Image
                        preview={false}
                        width={25}
                        src={
                          panes[pane]["siteID"] &&
                          require(`../../../../../../../assets/flags/${panes[pane]["siteID"]}.png`)
                        }
                        style={{ borderRadius: "50%" }}
                      />
                      <>{pane.split("-")[1]}</>
                    </Stack>
                  ) : (
                    <p>{pane}</p>
                  )
                }
                key={panes[pane].shopId}
              >
                <div
                  style={
                    panes[pane]["status"] === "inactive"
                      ? {
                          pointerEvents: "none",
                          opacity: 0.8,
                        }
                      : {}
                  }
                >
                  {panes[pane].content}
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </Stack>
    </Card>
  );
};

export default AppToEbayNew;

export const CheckboxComponent = ({
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  const getDisbledLength = () => {
    let checkedAccountsLength = 0;
    Object.keys(connectedAccountsObject).forEach((account) => {
      if (
        connectedAccountsObject[account].checked &&
        connectedAccountsObject[account].status === "active"
      ) {
        checkedAccountsLength++;
      }
    });
    if (checkedAccountsLength === 1) {
      return true;
    } else return false;
  };
  return (
    <Stack>
      <>Account for Selection</>
      {connectedAccountsObject &&
        Object.keys(connectedAccountsObject).map((account, index) => {
          return (
            <Stack alignment="fill" spacing="tight">
              <Checkbox
                key={index}
                disabled={
                  (connectedAccountsObject[account]["checked"] &&
                    getDisbledLength()) ||
                  (connectedAccountsObject[account]["status"] === "inactive"
                    ? true
                    : false)
                }
                checked={connectedAccountsObject[account]["checked"]}
                onChange={(e) => {
                  let temp = { ...connectedAccountsObject };
                  temp[account]["checked"] = e.target.checked;
                  setconnectedAccountsObject(temp);
                }}
              ></Checkbox>
              {connectedAccountsObject[account]["siteID"] ? (
                <Stack alignment="fill" spacing="tight">
                  <Image
                    preview={false}
                    width={25}
                    src={
                      connectedAccountsObject[account]["siteID"] &&
                      require(`../../../../../../../assets/flags/${connectedAccountsObject[account]["siteID"]}.png`)
                    }
                    style={{ borderRadius: "50%" }}
                  />
                  <>{account.split("-")[1]}</>
                </Stack>
              ) : (
                <p>{account}</p>
              )}
            </Stack>
          );
        })}
    </Stack>
  );
};
