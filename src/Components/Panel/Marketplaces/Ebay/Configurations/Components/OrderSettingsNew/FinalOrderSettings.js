import React, { useEffect, useState } from "react";
// import { CheckboxComponent } from "../ProductSettingsNew/AppToEbayNew";
import { Checkbox, Divider, Image, Tabs, Typography } from "antd";
import {
  Banner,
  Button,
  Card,
  Stack,
  SkeletonBodyText,
  SkeletonPage,
  Link,
} from "@shopify/polaris";
import { getConnectedAccounts } from "../../../../../../../Apirequest/accountsApi";
import { getCountryName } from "../../../../../Accounts/NewAccount";
import { notify } from "../../../../../../../services/notify";
import AccountTabContentConfig from "./AccountTabContentConfig";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../../URLs/ConfigurationURL";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import FinalAccountTabContentConfig from "./FinalAccountTabContentConfig";
const { TabPane } = Tabs;
const { Title } = Typography;

const FinalOrderSettings = ({ orderSettingsFromSavedAPIData }) => {
  const [flag, setflag] = useState(true);
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  const [accountsReceived, setAccountsReceived] = useState(false);

  // tabs
  const [panes, setPanes] = useState({});

  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const getSavedData = () => {
    if (Object.keys(orderSettingsFromSavedAPIData).length) {
      let temp = { ...connectedAccountsObject };
      for (const account in orderSettingsFromSavedAPIData) {
        if (account === "default") {
          temp["Default"]["checked"] = true;
          Object.keys(orderSettingsFromSavedAPIData[account]).map((field) => {
            if (
              field !== "setBuyerNotes" &&
              field !== "trackInventoryFromShopify" &&
              field !== "shippingService" &&
              field !== "useShopifyProductTitleInOrder" &&
              field !== "orderSourceIdentifier" &&
              field !== "enableOrderUpdate"
            ) {
              temp["Default"]["fields"][field]["enable"] =
                orderSettingsFromSavedAPIData[account][field]?.["enable"];
            }
            if (
              [
                "setBuyerNotes",
                "setOrderNote",
                "setOrderTags",
                "setOrderName",
              ].includes(field)
            ) {
              if (field === "setOrderNote") {
                temp["Default"]["fields"][field]["attribute"][
                  "mappingOfOrderNote"
                ]["orderNoteMapping"] =
                  orderSettingsFromSavedAPIData[account][field]?.[
                    "attribute"
                  ]?.["mappingOfOrderNote"]?.["orderNoteMapping"];
                if (
                  temp["Default"]["fields"][field]["attribute"][
                    "mappingOfOrderNote"
                  ]["orderNoteMapping"] === "default"
                ) {
                  temp["Default"]["fields"][field]["attribute"][
                    "mappingOfOrderNote"
                  ]["default_setting"]["value"] =
                    orderSettingsFromSavedAPIData[account][field]["attribute"][
                      "mappingOfOrderNote"
                    ]["default_setting"]["value"];
                }
              } else if (field === "setOrderTags") {
                temp["Default"]["fields"][field]["attribute"][
                  "mappingOfOrderTag"
                ]["orderTagMapping"] =
                  orderSettingsFromSavedAPIData[account]?.[field]?.[
                    "attribute"
                  ]?.["mappingOfOrderTag"]?.["orderTagMapping"];
                if (
                  temp["Default"]["fields"][field]["attribute"][
                    "mappingOfOrderTag"
                  ]["orderTagMapping"] === "default"
                ) {
                  temp["Default"]["fields"][field]["attribute"][
                    "mappingOfOrderTag"
                  ]["default_setting"]["value"] =
                    orderSettingsFromSavedAPIData[account][field]["attribute"][
                      "mappingOfOrderTag"
                    ]["default_setting"]["value"];
                }
              } else if (field === "setOrderName") {
                temp["Default"]["fields"][field]["attribute"][
                  "mappingOfOrderName"
                ]["orderNameMapping"] =
                  orderSettingsFromSavedAPIData[account][field]["attribute"][
                    "mappingOfOrderName"
                  ]["orderNameMapping"];
                if (
                  temp["Default"]["fields"][field]["attribute"][
                    "mappingOfOrderName"
                  ]["orderNameMapping"] === "default"
                ) {
                  temp["Default"]["fields"][field]["attribute"][
                    "mappingOfOrderName"
                  ]["default_setting"]["value"] =
                    orderSettingsFromSavedAPIData[account][field]["attribute"][
                      "mappingOfOrderName"
                    ]["default_setting"]["value"];
                }
              }
            } else if (
              [
                // "shippingService",
                "shipmentSync",
                "userRealCustomerDetails",
                "shipmentSync",
                "orderCancelation",
              ].includes(field)
            ) {
              temp["Default"]["fields"][field]["attribute"] =
                orderSettingsFromSavedAPIData[account][field]["attribute"];
            }
            if (field === "inventoryBehavioursetting") {
              temp["Default"]["fields"][field]["enable"] = "yes";
              temp["Default"]["fields"][field]["value"] =
                orderSettingsFromSavedAPIData[account][field]?.["value"]
                  ? orderSettingsFromSavedAPIData[account][field]?.["value"]
                  : "decrement_obeying_policy";
            }
          });
        } else {
          for (const key in connectedAccountsObject) {
            if (connectedAccountsObject[key]["shopId"] == account) {
              temp[key]["checked"] = true;
              for (const field in temp[key]["fields"]) {
                if (orderSettingsFromSavedAPIData[account][field]) {
                  temp[key]["fields"][field]["enable"] =
                    orderSettingsFromSavedAPIData[account][field]["enable"];
                }
                // if (
                //   ["setBuyerNotes", "setOrderNote", "setOrderTags"].includes(
                //     field
                //   )
                // ) {
                //   for (const attributeKey in temp[key]["fields"][field][
                //     "attribute"
                //   ]) {
                //     temp[key]["fields"][field]["attribute"][attributeKey][
                //       "value"
                //     ] =
                //       orderSettingsFromSavedAPIData[account][field][
                //         "attribute"
                //       ][attributeKey]["value"];
                //   }
                // }
                console.log(field);
                if (
                  [
                    "setBuyerNotes",
                    "setOrderNote",
                    "setOrderTags",
                    "setOrderName",
                  ].includes(field)
                ) {
                  if (field === "setOrderNote") {
                    temp[key]["fields"][field]["attribute"][
                      "mappingOfOrderNote"
                    ]["orderNoteMapping"] =
                      orderSettingsFromSavedAPIData[account][field][
                        "attribute"
                      ]["mappingOfOrderNote"]?.["orderNoteMapping"];
                    if (
                      temp[key]["fields"][field]["attribute"][
                        "mappingOfOrderNote"
                      ]["orderNoteMapping"] === "default"
                    ) {
                      temp[key]["fields"][field]["attribute"][
                        "mappingOfOrderNote"
                      ]["default_setting"]["value"] =
                        orderSettingsFromSavedAPIData[account][field][
                          "attribute"
                        ]["mappingOfOrderNote"]["default_setting"]["value"];
                    }
                  } else if (field === "setOrderTags") {
                    temp[key]["fields"][field]["attribute"][
                      "mappingOfOrderTag"
                    ]["orderTagMapping"] =
                      orderSettingsFromSavedAPIData[account][field][
                        "attribute"
                      ]["mappingOfOrderTag"]?.["orderTagMapping"];
                    if (
                      temp[key]["fields"][field]["attribute"][
                        "mappingOfOrderTag"
                      ]["orderTagMapping"] === "default"
                    ) {
                      temp[key]["fields"][field]["attribute"][
                        "mappingOfOrderTag"
                      ]["default_setting"]["value"] =
                        orderSettingsFromSavedAPIData[account][field][
                          "attribute"
                        ]["mappingOfOrderTag"]["default_setting"]["value"];
                    }
                  } else if (field === "setOrderName") {
                    temp[key]["fields"][field]["attribute"][
                      "mappingOfOrderName"
                    ]["orderNameMapping"] =
                      orderSettingsFromSavedAPIData[account]?.[field]?.[
                        "attribute"
                      ]?.["mappingOfOrderName"]?.["orderNameMapping"];
                    if (
                      temp[key]["fields"][field]["attribute"][
                        "mappingOfOrderName"
                      ]["orderNameMapping"] === "default"
                    ) {
                      temp[key]["fields"][field]["attribute"][
                        "mappingOfOrderName"
                      ]["default_setting"]["value"] =
                        orderSettingsFromSavedAPIData[account][field][
                          "attribute"
                        ]["mappingOfOrderName"]["default_setting"]["value"];
                    }
                  }
                } else if (
                  [
                    // "shippingService",
                    "shipmentSync",
                    "userRealCustomerDetails",
                    "shipmentSync",
                    "orderCancelation",
                  ].includes(field)
                ) {
                  temp[key]["fields"][field]["attribute"] =
                    orderSettingsFromSavedAPIData[account][field]["attribute"];
                }
                if (field === "inventoryBehavioursetting") {
                  temp[key]["fields"][field]["enable"] = "yes";
                  temp[key]["fields"][field]["value"] =
                    orderSettingsFromSavedAPIData[account][field]?.["value"]
                      ? orderSettingsFromSavedAPIData[account][field]?.["value"]
                      : "decrement_obeying_policy";
                }
              }
            }
          }
        }
      }
      setconnectedAccountsObject(temp);
    }
  };
  useEffect(() => {
    if (accountsReceived) {
      getSavedData();
    }
  }, [orderSettingsFromSavedAPIData, accountsReceived]);

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
                <FinalAccountTabContentConfig
                  account={key}
                  content={connectedAccountsObject[key]}
                  connectedAccountsObject={connectedAccountsObject}
                  setconnectedAccountsObject={setconnectedAccountsObject}
                />
                // <AccountTabContentConfig
                //   account={key}
                //   content={connectedAccountsObject[key]}
                //   connectedAccountsObject={connectedAccountsObject}
                //   setconnectedAccountsObject={setconnectedAccountsObject}
                // />
              ),
            },
          }),
          {}
        );
      setPanes(filteredArray);
    }
  }, [connectedAccountsObject]);

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      setflag(false);
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let shopifyAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "shopify"
      );
      let ebayAccountsObj = {
        Default: {
          checked: true,
          status: "active",
          value: "default",
          shopId: "default",
          label: "Default",
          fields: {
            autoOrderSync: {
              // label: "Auto Order Sync",
              label: "Manage Order",
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
              type: "segmentedBtnWrapper",
            },
            includeTax: {
              label: "Include Tax",
              enable: "yes",
              type: "segmentedBtn",
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
              description:
                "Enable to include taxes in the order subtotal while creating order on Shopify.",
            },
            inventoryBehavioursetting: {
              label: "Inventory Behaviour Setting",
              value: "decrement_obeying_policy",
              enable: "yes",
              type: "dropdown",
              options: [
                {
                  label: "Decrement Ignoring Policy",
                  value: "decrement_ignoring_policy",
                },
                {
                  label: "Decrement Obeying Policy",
                  value: "decrement_obeying_policy",
                },
                {
                  label: "Bypass",
                  value: "bypass",
                },
              ],
              description:
                "Select behaviour to use updating inventory while creating order on Shopify.",
            },
            syncWithoutProductdetails: {
              label: "Sync Without Product details",
              enable: "no",
              type: "segmentedBtn",
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
              description:
                "Enable if you want to create order on Shopify even when order item not found on App/Shopify.",
            },
            setOrderNote: {
              label: "Set Shopify Order Note",
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
              type: "segmentedBtn",
              attribute: {
                mappingOfOrderNote: {
                  label: "Mapping of Order Note",
                  enable: "yes",
                  type: "mappingBoolean",
                  value: "yes",
                  orderNoteMapping: "",
                  default_setting: {
                    value: "",
                  },
                  attributeValue: "",
                },
              },
              description:
                "Set Shopify Order note. you can customise it as per your need.",
            },
            setOrderTags: {
              label: "Set Shopify Order Tag(s)",
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
              type: "segmentedBtn",
              attribute: {
                mappingOfOrderTag: {
                  label: "Mapping of Order Tag",
                  enable: "yes",
                  type: "mappingBoolean",
                  value: "yes",
                  orderTagMapping: "",
                  default_setting: {
                    value: "",
                  },
                  attributeValue: "",
                },
              },
              description:
                "Set Shopify Order Tags. you can customise it as per your need.",
            },
            setOrderName: {
              label: "Set Shopify Order Name",
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
              type: "segmentedBtn",
              attribute: {
                mappingOfOrderName: {
                  label: "Mapping of Order Name",
                  enable: "yes",
                  type: "mappingBoolean",
                  value: "yes",
                  orderNameMapping: "",
                  default_setting: {
                    value: "",
                  },
                  attributeValue: "",
                },
              },
              description:
                "Set Shopify Order Name. you can customise it as per your need.",
            },
            // shippingService: {
            //   label: "Shipping Service",
            //   enable: "yes",
            //   type: "form",
            //   options: [
            //     {
            //       label: "Yes",
            //       value: "yes",
            //     },
            //     {
            //       label: "No",
            //       value: "no",
            //     },
            //   ],
            //   type: "segmentedBtn",
            //   attribute: {
            //     mappingOfShippingService: {
            //       label: "Mapping of Shipping Service",
            //       enable: "yes",
            //       type: "mappingBoolean",
            //       value: "yes",
            //       shippingServiceMapping: {
            //         mapping: {
            //           "#1": {
            //             customAttribute: {
            //               label: "Shopify Shipping Service",
            //               value: "",
            //             },
            //             // shopifyAttribute: { label: "Shopify attribute", value: ShippingServiceCodeTypeOptions[0]['value'] },
            //             shopifyAttribute: {
            //               label: "eBay Shipping Service",
            //               value: "",
            //             },
            //           },
            //         },
            //         counter: 1,
            //       },
            //     },
            //   },
            //   description:
            //     "Map shipping services for Shopify with the shipping services of eBay. For example; Shopify shipping service USPS can be mapped to eBay FedEx Ground shipping services, in case you use different shipping services Shopify and eBay.",
            // },
            userRealCustomerDetails: {
              label: "Use Real Customer Details",
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
              type: "segmentedBtn",
              attribute: {
                email: {
                  label: "Email",
                  enable: "yes",
                  type: "textfield",
                  value: "",
                },
                name: {
                  label: "Name",
                  enable: "yes",
                  type: "textfield",
                  value: "",
                },
              },
              description:
                "Enable this to use ebay customer details for order creation. you can set customer details if you don't want eBay Customer details for Order creation.",
            },
            shipmentSync: {
              label: "Shipment Sync",
              enable: "yes",
              type: "form",
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
              attribute: {
                withoutTrackingDetails: {
                  label: "Sync Tracking details",
                  enable: "yes",
                  type: "boolean",
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
                  value: "yes",
                },
                mappingOfShippingCarrier: {
                  label: "Mapping of Shipping Carrier",
                  enable: "no",
                  type: "mappingBoolean",
                  value: "no",
                  shippingCarrierMapping: {
                    mapping: {
                      "#1": {
                        customAttribute: {
                          label: "Shopify Carrier",
                          value: "",
                        },
                        shopifyAttribute: { label: "eBay Carrier", value: "" },
                      },
                    },
                    counter: 1,
                  },
                },
              },
              type: "segmentedBtn",
              description: (
                <>
                  Enable for syncing the Shipment from Shopify to eBay. You can
                  choose to setting for syncing of tracking details and map
                  Shopify Shipping carrier to eBay Shipping carrier if default
                  value not matched with allowed{" "}
                  <Link
                    external
                    monochrome
                    removeUnderline
                    url={
                      "https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingCarrierCodeType.html"
                    }
                  >
                    <b>{`"eBay Shipping Carrier code"`}</b>
                  </Link>
                </>
              ),
            },
            orderCancelation: {
              label: "Order Cancellation Reason",
              enable: "yes",
              type: "form",
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
              type: "segmentedBtn",
              attribute: {
                mappingOfOrderCancellation: {
                  label: "Mapping of Order Cancellation",
                  enable: "yes",
                  type: "mappingBoolean",
                  value: "yes",
                  orderCancellationReasonMapping: {
                    mapping: {
                      "#1": {
                        customAttribute: {
                          label: "Shopify Reason",
                          value: "Other",
                        },
                        shopifyAttribute: {
                          label: "eBay Reason",
                          value: "UNKNOWN",
                        },
                      },
                    },
                    counter: 1,
                  },
                },
              },
              description:
                "Enable if you want to sync order cancellation from Shopify to eBay. you can also map cancellation reason.",
            },
            // useShopifyProductTitleInOrder: {
            //   label: "Use Shopify Product Title",
            //   enable: "no",
            //   type: "segmentedBtn",
            //   options: [
            //     {
            //       label: "Yes",
            //       value: "yes",
            //     },
            //     {
            //       label: "No",
            //       value: "no",
            //     },
            //   ],
            //   description: "",
            // },
            // orderSourceIdentifier: {
            //   label: "Order Source Identifier",
            //   enable: "yes",
            //   type: "textfield",
            //   // value: "",
            //   attribute: {
            //     orderSourceIdentifier: {
            //       value: "",
            //     },
            //   },
            //   description: "",
            // },
            // enableOrderUpdate: {
            //   label: "Enable Order Update",
            //   enable: "no",
            //   type: "segmentedBtn",
            //   options: [
            //     {
            //       label: "Yes",
            //       value: "yes",
            //     },
            //     {
            //       label: "No",
            //       value: "no",
            //     },
            //   ],
            //   description: "",
            // },
          },
        },
      };
      ebayAccounts.forEach((account, key) => {
        let temp = {};
        temp["value"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["status"] = account["warehouses"][0]["status"];
        temp["shopId"] = account["id"];
        temp["checked"] = false;
        temp["fields"] = {
          autoOrderSync: {
            label: "Manage Order",
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
            type: "segmentedBtnWrapper",
          },
          includeTax: {
            label: "Include Tax",
            enable: "yes",
            type: "segmentedBtn",
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
            description:
              "Enable to include taxes in the order subtotal while creating order on Shopify.",
          },
          inventoryBehavioursetting: {
            label: "Inventory Behaviour Setting",
            value: "decrement_obeying_policy",
            enable: "yes",
            type: "dropdown",
            options: [
              {
                label: "Decrement Ignoring Policy",
                value: "decrement_ignoring_policy",
              },
              {
                label: "Decrement Obeying Policy",
                value: "decrement_obeying_policy",
              },
              {
                label: "Bypass",
                value: "bypass",
              },
            ],
            description:
              "Select behaviour to use updating inventory while creating order on Shopify.",
          },
          syncWithoutProductdetails: {
            label: "Sync Without Product details",
            enable: "no",
            type: "segmentedBtn",
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
            description:
              "Enable if you want to create order on Shopify even when order item not found on App/Shopify.",
          },
          setOrderNote: {
            label: "Set Shopify Order Note",
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
            type: "segmentedBtn",
            attribute: {
              mappingOfOrderNote: {
                label: "Mapping of Order Note",
                enable: "yes",
                type: "mappingBoolean",
                value: "yes",
                orderNoteMapping: "",
                default_setting: {
                  value: "",
                },
                attributeValue: "",
              },
            },
            description:
              "Set Shopify Order note. you can customise it as per your need.",
          },
          setOrderTags: {
            label: "Set Shopify Order Tag(s)",
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
            type: "segmentedBtn",
            attribute: {
              mappingOfOrderTag: {
                label: "Mapping of Order Tag",
                enable: "yes",
                type: "mappingBoolean",
                value: "yes",
                orderTagMapping: "",
                default_setting: {
                  value: "",
                },
                attributeValue: "",
              },
            },
            description:
              "Set Shopify Order Tags. you can customise it as per your need.",
          },
          setOrderName: {
            label: "Set Shopify Order Name",
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
            type: "segmentedBtn",
            attribute: {
              mappingOfOrderName: {
                label: "Mapping of Order Name",
                enable: "yes",
                type: "mappingBoolean",
                value: "yes",
                orderNameMapping: "",
                default_setting: {
                  value: "",
                },
                attributeValue: "",
              },
            },
            description:
              "Set Shopify Order Name. you can customise it as per your need.",
          },
          // shippingService: {
          //   label: "Shipping Service",
          //   enable: "yes",
          //   type: "form",
          //   options: [
          //     {
          //       label: "Yes",
          //       value: "yes",
          //     },
          //     {
          //       label: "No",
          //       value: "no",
          //     },
          //   ],
          //   type: "segmentedBtn",
          //   attribute: {
          //     mappingOfShippingService: {
          //       label: "Mapping of Shipping Service",
          //       enable: "yes",
          //       type: "mappingBoolean",
          //       value: "yes",
          //       shippingServiceMapping: {
          //         mapping: {
          //           "#1": {
          //             customAttribute: {
          //               label: "Shopify Shipping Service",
          //               value: "",
          //             },
          //             // shopifyAttribute: { label: "Shopify attribute", value: ShippingServiceCodeTypeOptions[0]['value'] },
          //             shopifyAttribute: {
          //               label: "eBay Shipping Service",
          //               value: "",
          //             },
          //           },
          //         },
          //         counter: 1,
          //       },
          //     },
          //   },
          //   description:
          //     "Map shipping services for Shopify with the shipping services of eBay. For example; Shopify shipping service USPS can be mapped to eBay FedEx Ground shipping services, in case you use different shipping services Shopify and eBay.",
          // },
          userRealCustomerDetails: {
            label: "Use Real Customer Details",
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
            type: "segmentedBtn",
            attribute: {
              email: {
                label: "Email",
                enable: "yes",
                type: "textfield",
                value: "",
              },
              name: {
                label: "Name",
                enable: "yes",
                type: "textfield",
                value: "",
              },
            },
            description:
              "Enable this to use ebay customer details for order creation. you can set customer details if you don't want eBay Customer details for Order creation.",
          },
          shipmentSync: {
            label: "Shipment Sync",
            enable: "yes",
            type: "form",
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
            attribute: {
              withoutTrackingDetails: {
                label: "Sync Tracking details",
                enable: "yes",
                type: "boolean",
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
                value: "yes",
              },
              mappingOfShippingCarrier: {
                label: "Mapping of Shipping Carrier",
                enable: "no",
                type: "mappingBoolean",
                value: "no",
                shippingCarrierMapping: {
                  mapping: {
                    "#1": {
                      customAttribute: {
                        label: "Shopify Carrier",
                        value: "",
                      },
                      shopifyAttribute: { label: "eBay Carrier", value: "" },
                    },
                  },
                  counter: 1,
                },
              },
            },
            type: "segmentedBtn",
            description: (
              <>
                Enable for syncing the Shipment from Shopify to eBay. You can
                choose to setting for syncing of tracking details and map
                Shopify Shipping carrier to eBay Shipping carrier if default
                value not matched with allowed{" "}
                <Link
                  external
                  monochrome
                  removeUnderline
                  url={
                    "https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingCarrierCodeType.html"
                  }
                >
                  <b>{`"eBay Shipping Carrier code"`}</b>
                </Link>
              </>
            ),
          },
          orderCancelation: {
            label: "Order Cancellation Reason",
            enable: "yes",
            type: "form",
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
            type: "segmentedBtn",
            attribute: {
              mappingOfOrderCancellation: {
                label: "Mapping of Order Cancellation",
                enable: "yes",
                type: "mappingBoolean",
                value: "yes",
                orderCancellationReasonMapping: {
                  mapping: {
                    "#1": {
                      customAttribute: {
                        label: "Shopify Reason",
                        value: "Other",
                      },
                      shopifyAttribute: {
                        label: "eBay Reason",
                        value: "UNKNOWN",
                      },
                    },
                  },
                  counter: 1,
                },
              },
            },
            description:
                "Enable if you want to sync order cancellation from Shopify to eBay. you can also map cancellation reason.",
          },
          // useShopifyProductTitleInOrder: {
          //   label: "Use Shopify Product Title",
          //   enable: "no",
          //   type: "segmentedBtn",
          //   options: [
          //     {
          //       label: "Yes",
          //       value: "yes",
          //     },
          //     {
          //       label: "No",
          //       value: "no",
          //     },
          //   ],
          //   description: "",
          // },
          // orderSourceIdentifier: {
          //   label: "Order Source Identifier",
          //   enable: "yes",
          //   type: "textfield",
          //   // value: "",
          //   attribute: {
          //     orderSourceIdentifier: {
          //       value: "",
          //     },
          //   },
          //   description: "",
          // },
          // enableOrderUpdate: {
          //   label: "Enable Order Update",
          //   enable: "no",
          //   type: "segmentedBtn",
          //   options: [
          //     {
          //       label: "Yes",
          //       value: "yes",
          //     },
          //     {
          //       label: "No",
          //       value: "no",
          //     },
          //   ],
          //   description: "",
          // },
        };
        ebayAccountsObj[
          `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`
        ] = temp;
      });
      setconnectedAccountsObject(ebayAccountsObj);
      setAccountsReceived(true);
    } else {
      notify.error(message);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  const saveData = async () => {
    setSaveBtnLoader(true);
    let tempObj = {
      order_settings: {},
      setting_type: ["order_settings"],
    };
    for (const account in connectedAccountsObject) {
      if (connectedAccountsObject[account]["checked"]) {
        tempObj["order_settings"][connectedAccountsObject[account]["shopId"]] =
          {};
        Object.keys(connectedAccountsObject[account]["fields"]).forEach(
          (field) => {
            tempObj["order_settings"][
              connectedAccountsObject[account]["shopId"]
            ][field] = {};
            for (const key in connectedAccountsObject[account]["fields"][
              field
            ]) {
              if (key === "enable" && field === "inventoryBehavioursetting") {
                tempObj["order_settings"][
                  connectedAccountsObject[account]["shopId"]
                ][field][key] =
                  connectedAccountsObject[account]["fields"][field][key];
                tempObj["order_settings"][
                  connectedAccountsObject[account]["shopId"]
                ][field]["value"] =
                  connectedAccountsObject[account]["fields"][field]["value"];
              }
              if (key === "enable") {
                tempObj["order_settings"][
                  connectedAccountsObject[account]["shopId"]
                ][field][key] =
                  connectedAccountsObject[account]["fields"][field][key];
              }
              // for https://app.clickup.com/t/2me3rh1
              else if (
                key === "attribute" &&
                field === "userRealCustomerDetails" &&
                tempObj["order_settings"][
                  connectedAccountsObject[account]["shopId"]
                ][field]["enable"] === "yes"
              ) {
                tempObj["order_settings"][
                  connectedAccountsObject[account]["shopId"]
                ][field][key] =
                  connectedAccountsObject[account]["fields"][field][key];
                Object.keys(
                  connectedAccountsObject[account]["fields"][field]["attribute"]
                ).forEach((attributeValue) => {
                  tempObj["order_settings"][
                    connectedAccountsObject[account]["shopId"]
                  ][field]["attribute"][attributeValue]["value"] = "";
                });
              } else if (key === "attribute") {
                tempObj["order_settings"][
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
  };

  return flag ? (
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
  ) : (
    <Card
      sectioned
      title={<Title level={3}></Title>}
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
        <Banner>
          <p>
            Select from the available eBay accounts you wish to use for
            publishing your products on eBay. Use the default option to apply
            settings to all accounts.
          </p>
        </Banner>
        <CheckboxComponent
          connectedAccountsObject={connectedAccountsObject}
          setconnectedAccountsObject={setconnectedAccountsObject}
        />
      </Stack>
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
    </Card>
  );
};

export default FinalOrderSettings;

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
            <Stack alignment="fill" spacing="tight">
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
