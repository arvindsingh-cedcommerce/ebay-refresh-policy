import {
  Banner,
  Button,
  Card,
  FooterHelp,
  Link,
  SkeletonBodyText,
  SkeletonPage,
  Stack,
} from "@shopify/polaris";
import { Checkbox, Divider, Image, Tabs } from "antd";
import Title from "antd/lib/skeleton/Title";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../../Apirequest/accountsApi";
import {
  configurationAPI,
  currencyFunc,
} from "../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../services/notify";
import {
  currencyConvertorURL,
  saveAppSettingsShopifyToAppURL,
} from "../../../../../../../URLs/ConfigurationURL";
import { getCountryName } from "../../../../../Accounts/NewAccount";
import FinalAccountTabContentConfig from "./FinalAccountTabContentConfig";
import {
  getParsedEbayAccounts,
  getSavedData,
} from "./Helper/OrderSettingsHelper";
import TabContent from "./TabContent/TabContent";

const { TabPane } = Tabs;

const FinalOrderSettingsNew = ({ orderSettingsFromSavedAPIData }) => {
  const [accountsReceived, setAccountsReceived] = useState(false);
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  const [skeletonFlag, setSkeletonFlag] = useState(true);
  const [errorsData, setErrorsData] = useState({});
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  // tabs
  const [panes, setPanes] = useState({});

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData
        .filter((account) => account["marketplace"] === "ebay")
        .map((account) => {
          let parsedAccountData = {};
          let { site_id, status, user_id } = account["warehouses"][0];
          parsedAccountData["value"] = `${getCountryName(site_id)}-${user_id}`;
          parsedAccountData["siteId"] = site_id;
          parsedAccountData["status"] = status;
          parsedAccountData["shopId"] = account["id"];
          parsedAccountData["checked"] = false;
          return parsedAccountData;
        });
      let shopifyAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "shopify"
      );
      ebayAccounts.unshift({
        value: "Default",
        status: "active",
        shopId: "default",
        checked: true,
      });
      let parsedEbayAccounts = getParsedEbayAccounts(ebayAccounts);
      // console.log(parsedEbayAccounts);
      setconnectedAccountsObject(parsedEbayAccounts);
      setAccountsReceived(true);
      setSkeletonFlag(false);
    } else {
      notify.error(message);
    }
  };

  const getCurrencyFunc = async (account) => {
    let temp = { ...connectedAccountsObject };
    let { success, data: currencyData } = await currencyFunc(
      currencyConvertorURL,
      {
        site_id: temp[account]["siteId"],
      }
    );
    if (success) {
      const { source, rate } = currencyData;
      temp[account]["fields"]["currencyConversion"]["shopifyCurrencyName"] =
        source["shopify"];
      temp[account]["fields"]["currencyConversion"]["shopifyCurrencyValue"] =
        source["amount"];
      temp[account]["fields"]["currencyConversion"]["ebayCurrencyName"] =
        source["ebay"];
      temp[account]["fields"]["currencyConversion"]["ebayCurrencyValue"] = rate;
    }
    if (
      errorsData?.[account]?.["fields"]?.["currencyConversion"]?.[
        "ebayCurrencyValue"
      ] &&
      temp[account]["fields"]["currencyConversion"]["ebayCurrencyValue"]
    ) {
      let tempErrorData = { ...errorsData };
      tempErrorData[account]["fields"]["currencyConversion"][
        "ebayCurrencyValue"
      ] = false;
      setErrorsData(tempErrorData);
    }
    setconnectedAccountsObject(temp);
  };

  useEffect(() => {
    if (accountsReceived) {
      getSavedData(
        orderSettingsFromSavedAPIData,
        connectedAccountsObject,
        setconnectedAccountsObject
      );
    }
  }, [orderSettingsFromSavedAPIData, accountsReceived]);

  useEffect(() => {
    if (Object.keys(connectedAccountsObject).length > 0) {
      let checkedAccounts = {};
      for (const account in connectedAccountsObject) {
        if (connectedAccountsObject[account]["checked"]) {
          const currencyItem =
            connectedAccountsObject[account]["fields"]["currencyConversion"];
          if (
            account !== "Default" &&
            !currencyItem["ebayCurrencyName"] &&
            !currencyItem["shopifyCurrencyValue"] &&
            !currencyItem["shopifyCurrencyName"]
          )
            getCurrencyFunc(account);
          checkedAccounts[account] = { ...connectedAccountsObject[account] };
          checkedAccounts[account]["content"] = (
            <TabContent
              account={account}
              content={connectedAccountsObject[account]}
              connectedAccountsObject={connectedAccountsObject}
              setconnectedAccountsObject={setconnectedAccountsObject}
              key={account}
              errorsData={errorsData}
              setErrorsData={setErrorsData}
            />
          );
        }
      }
      setPanes(checkedAccounts);
    }
  }, [connectedAccountsObject, errorsData]);

  const getCheckedAccounts = () => {
    // console.log(connectedAccountsObject);
    let checkedAccounts = {};
    for (const account in connectedAccountsObject) {
      if (connectedAccountsObject[account]["checked"]) {
        checkedAccounts[account] = { ...connectedAccountsObject[account] };
      }
    }
    return checkedAccounts;
  };

  const checkErrors = (data) => {
    let errorCount = 0;
    const errorData = {};
    for (const account in data) {
      errorData[account] = {};
      for (const attribute in data[account]) {
        if (attribute === "fields") {
          errorData[account][attribute] = {};
          for (const field in data[account][attribute]) {
            if (
              field === "orderCancelation" &&
              data[account][attribute][field]["value"] &&
              Array.isArray(data[account][attribute][field]["value"]) &&
              data[account][attribute][field]["value"].length > 0
            ) {
              errorData[account][attribute][field] = {};
              errorData[account][attribute][field]["value"] = [];
              data[account][attribute][field]["value"].forEach(
                (mapping, index) => {
                  errorData[account][attribute][field]["value"][index] = {};
                  if (!mapping["shopifyAttribute"]) {
                    errorData[account][attribute][field]["value"][index][
                      "shopifyAttribute"
                    ] = true;
                    errorCount++;
                  } else {
                    errorData[account][attribute][field]["value"][index][
                      "shopifyAttribute"
                    ] = false;
                  }
                  if (!mapping["ebayAttribute"]) {
                    errorData[account][attribute][field]["value"][index][
                      "ebayAttribute"
                    ] = true;
                    errorCount++;
                  } else {
                    errorData[account][attribute][field]["value"][index][
                      "ebayAttribute"
                    ] = false;
                  }
                }
              );
            } else if (
              field === "shipmentSync" &&
              data[account][attribute][field]["value"]
            ) {
              errorData[account][attribute][field] = {};
              errorData[account][attribute][field][
                "syncTrackingDetails"
              ] = false;
              errorData[account][attribute][field][
                "mappingOfShippingCarrier"
              ] = false;
              if (
                Array.isArray(
                  data[account][attribute][field]["mappingOfShippingCarrier"]
                ) &&
                data[account][attribute][field]["mappingOfShippingCarrier"]
                  .length > 0
              ) {
                errorData[account][attribute][field][
                  "mappingOfShippingCarrier"
                ] = [];
                data[account][attribute][field][
                  "mappingOfShippingCarrier"
                ].forEach((mapping, index) => {
                  errorData[account][attribute][field][
                    "mappingOfShippingCarrier"
                  ][index] = {};
                  if (!mapping["shopifyAttribute"]) {
                    errorData[account][attribute][field][
                      "mappingOfShippingCarrier"
                    ][index]["shopifyAttribute"] = true;
                    errorCount++;
                  } else {
                    errorData[account][attribute][field][
                      "mappingOfShippingCarrier"
                    ][index]["shopifyAttribute"] = false;
                  }
                  if (!mapping["ebayAttribute"]) {
                    errorData[account][attribute][field][
                      "mappingOfShippingCarrier"
                    ][index]["ebayAttribute"] = true;
                    errorCount++;
                  } else {
                    errorData[account][attribute][field][
                      "mappingOfShippingCarrier"
                    ][index]["ebayAttribute"] = false;
                  }
                });
              }
            } else if (
              field === "useEbayCustomerDetails" &&
              !data[account][attribute][field]["value"]
            ) {
              errorData[account][attribute][field] = {};
              if (!data[account][attribute][field]["email"]) {
                errorData[account][attribute][field]["email"] = true;
                errorCount++;
              } else errorData[account][attribute][field]["email"] = false;
              // if (!data[account][attribute][field]["name"]) {
              //   errorData[account][attribute][field]["name"] = true;
              //   errorCount++;
              // } else errorData[account][attribute][field]["name"] = false;
            } else if (
              field === "setOrderName" &&
              data?.[account]?.[attribute]?.[field]?.["value"] === "custom" &&
              !data?.[account]?.[attribute]?.[field]?.["customValue"].includes(
                "{{ebay_order_id}}"
              )
            ) {
              errorData[account][attribute][field] = {};
              errorData[account][attribute][field]["customValue"] =
                "must contain ebay order id";
              errorCount++;
            } else if (
              field === "currencyConversion" &&
              account !== "Default"
            ) {
              errorData[account][attribute][field] = {};
              if (!data[account][attribute][field]["ebayCurrencyValue"]) {
                errorData[account][attribute][field][
                  "ebayCurrencyValue"
                ] = true;
                errorCount++;
              }
            } else {
              errorData[account][attribute][field] = false;
            }
          }
        } else {
          errorData[account][attribute] = data[account][attribute];
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
        if (field === "shipmentSync" && fields[field]["value"]) {
          let shipmentSyncContainerObj = {};
          shipmentSyncContainerObj["syncTrackingDetails"] =
            fields[field]["syncTrackingDetails"];
          if (fields[field]["mappingOfShippingCarrier"]) {
            shipmentSyncContainerObj["mappingOfShippingCarrier"] = [
              ...fields[field]["mappingOfShippingCarrier"],
            ];
          } else {
            shipmentSyncContainerObj["mappingOfShippingCarrier"] =
              fields[field]["mappingOfShippingCarrier"];
          }
          parsedData[shopId][field] = { ...shipmentSyncContainerObj };
        } else if (
          field === "useEbayCustomerDetails" &&
          !fields[field]["value"]
        ) {
          parsedData[shopId][field] = {};
          parsedData[shopId][field]["email"] = fields[field]["email"];
          // parsedData[shopId][field]["name"] = fields[field]["name"];
        } else if (
          ["setOrderNote", "setOrderTags", "setOrderName"].includes(field)
        ) {
          if (fields[field]["value"] === "custom") {
            parsedData[shopId][field] = {};
            parsedData[shopId][field]["custom"] = fields[field]["customValue"];
          } else parsedData[shopId][field] = fields[field]["value"];
        } else if (field === "currencyConversion") {
          const {
            ebayCurrencyName,
            ebayCurrencyValue,
            shopifyCurrencyName,
            shopifyCurrencyValue,
          } = { ...fields[field] };
          parsedData[shopId][field] = {
            ebayCurrencyName: ebayCurrencyName,
            ebayCurrencyValue: ebayCurrencyValue,
            shopifyCurrencyName: shopifyCurrencyName,
            shopifyCurrencyValue: shopifyCurrencyValue,
          };
        } else parsedData[shopId][field] = fields[field]["value"];
      }
    }
    console.log(parsedData);
    return parsedData;
  };

  const callSaveData = async () => {
    setSaveBtnLoader(true);
    const checkedAccounts = getCheckedAccounts();
    const errorCount = checkErrors(checkedAccounts);
    if (errorCount > 0) {
      notify.error("Please fill all required fields!");
    } else {
      const parsedData = getParsedData(checkedAccounts);
      // console.log('parsedData', parsedData);
      let { success, message } = await configurationAPI(
        saveAppSettingsShopifyToAppURL,
        {
          order_settings: { ...parsedData },
          setting_type: ["order_settings"],
        }
      );
      if (success) {
        notify.success(message);
      } else {
        notify.error(message);
      }
    }
    setSaveBtnLoader(false);
  };

  return skeletonFlag ? (
    <>
      <Card sectioned>
        <SkeletonPage fullWidth={true}>
          <Card.Section>
            <SkeletonBodyText lines={2} />
          </Card.Section>
          <Card.Section>
            <SkeletonBodyText lines={2} />
          </Card.Section>
          <Card.Section>
            <SkeletonBodyText lines={2} />
          </Card.Section>
          <Card.Section>
            <SkeletonBodyText lines={2} />
          </Card.Section>
        </SkeletonPage>
      </Card>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=order-configuration-of-the-app"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=order-configuration-of-the-app-3"
        >
          Order Settings
        </Link>
      </FooterHelp>
    </>
  ) : (
    <>
      <Card
        sectioned
        actions={[
          {
            content: (
              <Button primary onClick={callSaveData} loading={saveBtnLoader}>
                Save
              </Button>
            ),
          },
        ]}
      >
        <Stack vertical>
          {/* <Banner>
          <p>
            Select from the available eBay accounts you wish to use for
            publishing your products on eBay. Use the default option to apply
            settings to all accounts.
          </p>
        </Banner> */}
          <CheckboxComponent
            connectedAccountsObject={connectedAccountsObject}
            setconnectedAccountsObject={setconnectedAccountsObject}
          />
          {/* </Stack> */}
          {panes.length > 0 && <Divider />}
          <>Selected Accounts</>
          {/* <Card.Section> */}
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
                            require(`../../../../../../../assets/flags/${panes[pane]["siteId"]}.png`)
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
                    {panes?.[pane]?.["content"]}
                  </div>
                </TabPane>
              );
            })}
          </Tabs>
          {/* </Card.Section> */}
        </Stack>
      </Card>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=order-configuration-of-the-app"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=order-configuration-of-the-app-3"
        >
          Order Settings
        </Link>
      </FooterHelp>
    </>
  );
};

export default FinalOrderSettingsNew;

const CheckboxComponent = ({
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  return (
    <Stack>
      <>Account for Selection</>
      {connectedAccountsObject &&
        Object.keys(connectedAccountsObject).map((account, index) => {
          return (
            <Stack alignment="fill" spacing="tight" key={account}>
              <Checkbox
                key={index}
                disabled={
                  account === "Default" ||
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
              >
                {connectedAccountsObject[account]["siteId"] ? (
                  <div
                    style={
                      connectedAccountsObject[account]["status"] === "inactive"
                        ? {
                            pointerEvents: "none",
                            opacity: 0.4,
                          }
                        : {}
                    }
                  >
                    <Stack alignment="fill" spacing="tight">
                      <Image
                        preview={false}
                        width={25}
                        src={
                          connectedAccountsObject[account]["siteId"] &&
                          require(`../../../../../../../assets/flags/${connectedAccountsObject[account]["siteId"]}.png`)
                        }
                        style={{ borderRadius: "50%" }}
                      />
                      <>{account.split("-")[1]}</>
                    </Stack>
                  </div>
                ) : (
                  <p>{account}</p>
                )}
              </Checkbox>
            </Stack>
          );
        })}
    </Stack>
  );
};
