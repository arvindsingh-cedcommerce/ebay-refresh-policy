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
import { configurationAPI } from "../../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../../services/notify";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../../../URLs/ConfigurationURL";
import TabContent from "./TabContent";

const { TabPane } = Tabs;
const { Text, Title } = Typography;

const AppToEbayNewNew = ({
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  // const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  const [errorsData, setErrorsData] = useState({});

  // tabs
  const [panes, setPanes] = useState({});

  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

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
                <TabContent
                  account={key}
                  content={connectedAccountsObject[key]}
                  connectedAccountsObject={connectedAccountsObject}
                  setconnectedAccountsObject={setconnectedAccountsObject}
                  errorsData={errorsData}
                  setErrorsData={setErrorsData}
                />
              ),
            },
          }),
          {}
        );
      setPanes(filteredArray);
    }
  }, [connectedAccountsObject, errorsData]);

  const getCheckedAccounts = () => {
    let checkedAccounts = {};
    for (const account in connectedAccountsObject) {
      if (connectedAccountsObject[account]["checked"]) {
        checkedAccounts[account] = { ...connectedAccountsObject[account] };
      }
    }
    return checkedAccounts;
  };

  const checkErrors = (data) => {
    // console.log(data);
    let errorCount = 0;
    const errorData = {};
    for (const account in data) {
      errorData[account] = {};
      for (const attribute in data[account]) {
        if (attribute === "fields") {
          errorData[account][attribute] = {};
          for (const field in data[account][attribute]) {
            if (field === "itemLocation") {
              errorData[account][attribute][field] = {};
              if (!data[account][attribute][field]["country"]) {
                errorData[account][attribute][field]["country"] = true;
                errorCount++;
              }
              if (!data[account][attribute][field]["zipcode"]) {
                errorData[account][attribute][field]["zipcode"] = true;
                errorCount++;
              }
              if (!data[account][attribute][field]["location"]) {
                errorData[account][attribute][field]["location"] = true;
                errorCount++;
              }
            }
            if (field === "currencyConversion") {
              errorData[account][attribute][field] = {};
              if (!data[account][attribute][field]["ebayCurrencyValue"]) {
                errorData[account][attribute][field][
                  "ebayCurrencyValue"
                ] = true;
                errorCount++;
              }
            }
            // else errorData[account][attribute][field] = false;
          }
        }
      }
    }
    // console.log(errorData);
    setErrorsData(errorData);
    return errorCount;
  };
  const getParsedData = (data) => {
    const parsedData = {};
    for (const account in data) {
      const shopId = data[account]["shopId"];
      parsedData[shopId] = {};
      const { fields } = data[account];
      for (const field in fields) {
        if (field === "autoProductSync" && fields[field]["value"]) {
          parsedData[shopId][field] = { ...fields[field]["attributes"] };
        } else if (
          [
            "salesTaxDetails",
            "vehicleDetails",
            "vatDetails",
            "itemLocation",
          ].includes(field)
        ) {
          const { label, description, ...remainingKeys } = fields[field];
          parsedData[shopId][field] = { ...remainingKeys };
        } else if (["match_from_ebay"].includes(field)) {
          const { value } = fields[field];
          parsedData[shopId][field] = Array.isArray(value) ? [...value] : value;
        } else if (["shopifyWarehouses"].includes(field)) {
          const { options } = fields[field];
          parsedData[shopId][field] = options
            .filter((option) => option.value)
            .map((option) => option.label);
        } else if (["currencyConversion"].includes(field)) {
          const { ebayCurrencyValue } = fields[field];
          if (ebayCurrencyValue === "same") {
            parsedData[shopId][field] = false;
          } else {
            const { label, description, ...remainingKeys } = fields[field];
            parsedData[shopId][field] = {...remainingKeys}
          }
        } else parsedData[shopId][field] = fields[field]["value"];
      }
    }
    return parsedData;
  };
  const saveData = async () => {
    const checkedAccounts = getCheckedAccounts();
    const errorCount = checkErrors(checkedAccounts);
    if (errorCount > 0) {
      notify.error("Please fill all required fields!");
    } else {
      setSaveBtnLoader(true);
      const parsedData = getParsedData(checkedAccounts);
      let tempObj = {
        product_settings: {
          app_to_ebay: { ...parsedData },
        },
        setting_type: ["product_settings"],
      };
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
    }
  };

  return (
    <Card
      sectioned
      title={<Title level={4}>App To eBay</Title>}
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
                  panes[pane]["siteId"] ? (
                    <Stack alignment="fill" spacing="tight">
                      <Image
                        preview={false}
                        width={25}
                        src={
                          panes[pane]["siteId"] &&
                          require(`../../../../../../../../assets/flags/${panes[pane]["siteId"]}.png`)
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

export default AppToEbayNewNew;

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
            <Stack alignment="fill" spacing="tight" key={index}>
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
              {connectedAccountsObject[account]["siteId"] ? (
                <div
                style={connectedAccountsObject[account]["status"] === "inactive" ? {
                  pointerEvents: "none",
                  opacity: 0.4,
                }: {}}
                >
                <Stack alignment="fill" spacing="tight">
                  <Image
                    preview={false}
                    width={25}
                    src={
                      connectedAccountsObject[account]["siteId"] &&
                      require(`../../../../../../../../assets/flags/${connectedAccountsObject[account]["siteId"]}.png`)
                    }
                    style={{ borderRadius: "50%" }}
                  />
                  <>{account.split("-")[1]}</>
                </Stack>
                </div>
              ) : (
                <p>{account}</p>
              )}
            </Stack>
          );
        })}
    </Stack>
  );
};
