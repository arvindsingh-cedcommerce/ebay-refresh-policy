import {
  Button,
  Card,
  Form,
  FormLayout,
  Select,
  Stack,
} from "@shopify/polaris";
import { Checkbox, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { getCountryName } from "../../../../Accounts/NewAccount";
import AppToEbayBackup from "./OrderSettings/AppToEbayBackup";

const shopifyOptions = [
  {
    label: "Customer changed/canceled order",
    value: "customer",
  },
  {
    label: "Fraudulent order",
    value: "fraud",
  },
  {
    label: "Items unavailable",
    value: "inventory",
  },
  {
    label: "Payment declined",
    value: "declined",
  },
  {
    label: "Other",
    value: "other",
  },
];
const ebayOptions = [
  {
    label: "Buyer canceled or wrong address",
    value: "BUYER_CANCEL_OR_ADDRESS_ISSUE",
  },
  {
    label: "Item out of stock or cannot fulfill",
    value: "OUT_OF_STOCK_OR_CANNOT_FULFILL",
  },
];

const OrderSettingsBackup = () => {
  const getOrderCancellationSettings = () => {
    return (
      <FormLayout.Group>
        {shopifyOptions.map((shopifyOption) => {
          return (
            <Select label={shopifyOption["label"]} options={ebayOptions} />
          );
        })}
      </FormLayout.Group>
    );
  };
  const ebayV3OrderSettings = () => {
    return (
      <Form onSubmit={() => {}}>
        <FormLayout>{getOrderCancellationSettings()}</FormLayout>
      </Form>
    );
  };

  // for checkbox
  const [ebayAccountsArrayCopy, setEbayAccountsArrayCopy] = useState([]);
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  const [checkedList, setCheckedList] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let ebayAccountsArray = ebayAccounts.map((account, key) => {
        return `${getCountryName(account["warehouses"][0]["site_id"])}-${
          account["warehouses"][0]["user_id"]
        }`;
      });
      let ebayAccountsObj = {
        Default: {
          checked: true,
          value: "default",
          shopId: "default",
          label: "Default",
          fields: {
            autoOrderSync: {
              label: "Auto Order Sync",
              enable: "yes",
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            setNote: {
              label: "Set Note",
              enable: "no",
              type: "textfield",
              value: '',
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            setTags: {
              label: "Set Tags",
              enable: "no",
              type: "textfield",
              value: '',
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            setBuyerNote: {
              label: "Set Buyer Note",
              enable: "no",
              type: "textfield",
              value: '',
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            autoShipmentSync: {
              label: "Auto Shipment Sync",
              enable: "yes",
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            WithoutTrackingDetails: {
              label: "Without Tracking Details",
              enable: "yes",
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            autoOrderCancelation: {
              label: "Auto Order Cancelation",
              enable: "yes",
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            trackInventoryFromShopify: {
              label: "Track Inventory from Shopify",
              enable: "yes",
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            includeTax: {
              label: "Include Tax",
              enable: "yes",
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            orderSyncIfProductNotMatched: {
              label: "Order Sync if product not matched",
              enable: "yes",
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            mappingOfShippingCarrier: {
              label: "Mapping of Shipping Carrier (eBay and Shopify)",
              enable: "yes",
              sourceTarget: {},
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
            mapOrderCancellationReason: {
              label: "Map Order Cancellation Reason",
              enable: "no",
              sourceTarget: {},
              options: [
                {
                  label: "Yes",
                  value: "yes",
                },
                {
                  label: "No",
                  value: "no",
                },
              ],
            },
          },
        },
      };

      ebayAccounts.forEach((account, key) => {
        let temp = {};
        temp["value"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["shopId"] = account["id"];
        temp["checked"] = false;
        temp["fields"] = {
          autoOrderSync: {
            label: "Auto Order Sync",
            enable: "yes",
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          setNote: {
            label: "Set Note",
            enable: "no",
            type: "textfield",
            value: '',
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          setTags: {
            label: "Set Tags",
            enable: "no",
            type: "textfield",
            value: '',
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          setBuyerNote: {
            label: "Set Buyer Note",
            enable: "no",
            type: "textfield",
            value: '',
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          autoShipmentSync: {
            label: "Auto Shipment Sync",
            enable: "yes",
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          WithoutTrackingDetails: {
            label: "Without Tracking Details",
            enable: "yes",
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          autoOrderCancelation: {
            label: "Auto Order Cancelation",
            enable: "yes",
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          trackInventoryFromShopify: {
            label: "Track Inventory from Shopify",
            enable: "yes",
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          includeTax: {
            label: "Include Tax",
            enable: "yes",
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          orderSyncIfProductNotMatched: {
            label: "Order Sync if product not matched",
            enable: "yes",
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          mappingOfShippingCarrier: {
            label: "Mapping of Shipping Carrier (eBay and Shopify)",
            enable: "yes",
            sourceTarget: {},
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
          mapOrderCancellationReason: {
            label: "Map Order Cancellation Reason",
            enable: "yes",
            sourceTarget: {},
            options: [
              {
                label: "Yes",
                value: "yes",
              },
              {
                label: "No",
                value: "no",
              },
            ],
          },
        };
        ebayAccountsObj[
          `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`
        ] = temp;
      });
      setconnectedAccountsObject(ebayAccountsObj);
      setEbayAccountsArrayCopy(ebayAccountsArray);
    }
  };

  // useEffect(() => {
  //   console.log(connectedAccountsObject);
  // }, [connectedAccountsObject])

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  const saveAppToEbay = () => {
    console.log(connectedAccountsObject);
  };

  return (
    <Card sectioned>
      <Stack alignment="baseline">
        <CheckboxComponent
          connectedAccountsObject={connectedAccountsObject}
          setconnectedAccountsObject={setconnectedAccountsObject}
        />
        <Button primary onClick={() => saveAppToEbay()}>
          Save
        </Button>
      </Stack>
      {/* {
        !checkAll && checkedList.map(account => callAppToEbay(account))
      }
      {
        checkAll && callAppToEbay('Default')
      } */}

      {Object.keys(connectedAccountsObject).map((account) => {
        return (
          connectedAccountsObject[account]["checked"] && (
            <AppToEbayBackup
              account={account}
              checkedList={checkedList}
              checkAll={checkAll}
              connectedAccountsObject={connectedAccountsObject}
              setconnectedAccountsObject={setconnectedAccountsObject}
            />
          )
        );
      })}
    </Card>
  );
};

export default OrderSettingsBackup;

export const CheckboxComponent = ({
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  return (
    <Stack>
      <>Account Selection-:</>
      {connectedAccountsObject &&
        Object.keys(connectedAccountsObject).map((account, index) => {
          return (
            <Checkbox
              checked={connectedAccountsObject[account]["checked"]}
              onChange={(e) => {
                let temp = { ...connectedAccountsObject };
                temp[account]["checked"] = e.target.checked;
                setconnectedAccountsObject(temp);
              }}
            >
              {account}
            </Checkbox>
          );
        })}
    </Stack>
  );
};
