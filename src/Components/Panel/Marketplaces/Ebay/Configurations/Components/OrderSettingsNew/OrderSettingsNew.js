import React, { useEffect, useState } from "react";
import { CheckboxComponent } from "../ProductSettingsNew/AppToEbayNew";
import { Checkbox, Divider, Image, Tabs, Typography } from "antd";
import { Banner, Button, Card, Stack,SkeletonBodyText, SkeletonPage } from "@shopify/polaris";
import { getConnectedAccounts } from "../../../../../../../Apirequest/accountsApi";
import { getCountryName } from "../../../../../Accounts/NewAccount";
import { notify } from "../../../../../../../services/notify";
import AccountTabContentConfig from "./AccountTabContentConfig";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../../URLs/ConfigurationURL";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
const { TabPane } = Tabs;
const { Title } = Typography;

const OrderSettingsNew = ({ orderSettingsFromSavedAPIData }) => {
  const [flag,setflag]=useState(true);
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  const [accountsReceived, setAccountsReceived] = useState(false);

  // tabs
  const [panes, setPanes] = useState({});

  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const getSavedData = () => {
    // console.log('temp', connectedAccountsObject);
    if (Object.keys(orderSettingsFromSavedAPIData).length) {
      // console.log(orderSettingsFromSavedAPIData);
      let temp = { ...connectedAccountsObject };
      for (const account in orderSettingsFromSavedAPIData) {
        if (account === "default") {
          temp["Default"]["checked"] = true;
          Object.keys(orderSettingsFromSavedAPIData[account]).map((field) => {
            if (field !== "setBuyerNotes") {
              temp["Default"]["fields"][field]["enable"] =
                orderSettingsFromSavedAPIData[account][field]?.["enable"];
            }
            if (
              [
                // "setBuyerNotes",
                "setOrderNote",
                "setOrderTags",
              ].includes(field)
            ) {
              for (const attributeKey in temp["Default"]["fields"][field][
                "attribute"
              ]) {
                temp["Default"]["fields"][field]["attribute"][attributeKey][
                  "value"
                ] =
                  orderSettingsFromSavedAPIData[account][field]["attribute"][
                    attributeKey
                  ]["value"];
              }
            } else if (
              [
                "shippingService",
                "shipmentSync",
                "userRealCustomerDetails",
                "shipmentSync",
                "orderCancelation",
              ].includes(field)
            ) {
              temp["Default"]["fields"][field]["attribute"] =
                orderSettingsFromSavedAPIData[account][field]["attribute"];
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
                if (
                  ["setBuyerNotes", "setOrderNote", "setOrderTags"].includes(
                    field
                  )
                ) {
                  for (const attributeKey in temp[key]["fields"][field][
                    "attribute"
                  ]) {
                    temp[key]["fields"][field]["attribute"][attributeKey][
                      "value"
                    ] =
                      orderSettingsFromSavedAPIData[account][field][
                        "attribute"
                      ][attributeKey]["value"];
                  }
                } else if (
                  [
                    "shippingService",
                    "shipmentSync",
                    "userRealCustomerDetails",
                    "shipmentSync",
                    "orderCancelation",
                  ].includes(field)
                ) {
                  temp[key]["fields"][field]["attribute"] =
                    orderSettingsFromSavedAPIData[account][field]["attribute"];
                }
              }
            }
          }
          // temp[account]["checked"] = true;
        }
      }
      // console.log('temp', temp);
      setconnectedAccountsObject(temp);
    }
  };
  useEffect(() => {
    if (accountsReceived) {
      getSavedData();
    }
  }, [orderSettingsFromSavedAPIData, accountsReceived]);

  useEffect(() => {
    // console.log("connectedAccountsObject", connectedAccountsObject);
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
                />
              ),
            },
          }),
          {}
        );
      setPanes(filteredArray);
      // console.log(connectedAccountsObject);
    }
  }, [connectedAccountsObject]);

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {

      setflag(false)
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let shopifyAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "shopify"
      );
      let ebayAccountsObj = {
        Default: {
          checked: true,
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
              // attribute: {
              //   // includeTax: {
              //   //   label: "Include Tax",
              //   //   type: "boolean",
              //   //   value: "yes",
              //   // },
              //   // trackInventoryFromShopify: {
              //   //   label: "Track Inventory from Shopify",
              //   //   type: "boolean",
              //   //   value: "yes",
              //   // },
              //   // syncWithoutProductdetails: {
              //   //   label: "Sync Without Product details",
              //   //   type: "boolean",
              //   //   value: "yes",
              //   // },
              //   // setOrderNote: {
              //   //   label: "Set Order Note",
              //   //   enable: "yes",
              //   //   type: "textfield",
              //   //   value: "",
              //   // },
              //   // setOrderTags: {
              //   //   label: "Set Order Tags",
              //   //   enable: "yes",
              //   //   type: "textfield",
              //   //   value: "",
              //   // },
              //   // setBuyerNotes: {
              //   //   label: "Set Buyer Notes",
              //   //   enable: "yes",
              //   //   type: "textfield",
              //   //   value: "",
              //   // },
              //   // mappingOfShippingService: {
              //   //   label: "Mapping of shipping Service",
              //   //   enable: "yes",
              //   //   type: "mappingBoolean",
              //   //   value: "yes",
              //   // },
              //   // userRealCustomerDetails: {
              //   //   label: "Use Real Customer Details",
              //   //   enable: "yes",
              //   //   type: "formBoolean",
              //   //   value: "yes",
              //   //   fields: {
              //   //     email: {
              //   //       label: "Email",
              //   //       enable: "yes",
              //   //       type: "textfield",
              //   //       value: "",
              //   //     },
              //   //     name: {
              //   //       label: "Name",
              //   //       enable: "yes",
              //   //       type: "textfield",
              //   //       value: "",
              //   //     },
              //   //   },
              //   // },
              // },
              // type: "segmentedBtn",
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
                "Enable tax details inclusion for your eBay order details.",
            },
            trackInventoryFromShopify: {
              label: "Track Inventory from Shopify",
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
                "Enable the setting to sync the inventory details from Shopify to eBay once in 24 hours",
            },
            syncWithoutProductdetails: {
              label: "Sync Without Product details",
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
                "Synchronizes orders received on eBay even if the product is not available on Shopify",
            },
            setOrderNote: {
              label: "Set Order Note",
              enable: "yes",
              type: "textfield",
              // value: "",
              attribute: {
                orderNote: {
                  value: "",
                },
              },
              description:
                "Add a note for orders received from eBay to Shopify",
            },
            setOrderTags: {
              label: "Set Order Tags",
              enable: "yes",
              type: "textfield",
              // value: "",
              attribute: {
                orderTags: {
                  value: "",
                },
              },
              description:
                "Add tags to orders received on eBay while creating them on Shopify.",
            },
            // setBuyerNotes: {
            //   label: "Set Buyer Notes",
            //   enable: "yes",
            //   type: "textfield",
            //   // value: "",
            //   attribute: {
            //     buyerNotes: {
            //       value: "",
            //     },
            //   },
            // },
            // mappingOfShippingService: {
            //   label: "Mapping of Shipping Service",
            //   enable: "yes",
            //   type: "mappingBoolean",
            //   value: "yes",
            // },

            shippingService: {
              label: "Shipping Service",
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
                mappingOfShippingService: {
                  label: "Mapping of Shipping Service",
                  enable: "yes",
                  type: "mappingBoolean",
                  value: "yes",
                  shippingServiceMapping: {
                    mapping: {
                      "#1": {
                        customAttribute: {
                          label: "Shopify Shipping Service",
                          value: "",
                        },
                        // shopifyAttribute: { label: "Shopify attribute", value: ShippingServiceCodeTypeOptions[0]['value'] },
                        shopifyAttribute: {
                          label: "eBay Shipping Service",
                          value: "",
                        },
                      },
                    },
                    counter: 1,
                  },
                },
              },
              description:
                "Map shipping services for Shopify with the shipping services of eBay. For example; Shopify shipping service USPS can be mapped to eBay FedEx Ground shipping services, in case you use different shipping services Shopify and eBay.",
            },
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
                "Display details like email and Name of customers for Orders received on eBay if don’t want to fetch the order with the buyer's details got in the orders.",
            },
            // userRealCustomerDetails: {
            //   label: "Use Real Customer Details",
            //   enable: "yes",
            //   type: "formBoolean",
            //   value: "yes",
            //   fields: {
            //     email: {
            //       label: "Email",
            //       enable: "yes",
            //       type: "textfield",
            //       value: "",
            //     },
            //     name: {
            //       label: "Name",
            //       enable: "yes",
            //       type: "textfield",
            //       value: "",
            //     },
            //   },
            // },
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
                  label: "Without Tracking details",
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
                  value: "no",
                },
                mappingOfShippingCarrier: {
                  label: "Mapping of Shipping Carrier",
                  enable: "yes",
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
              description:
                "Enable and tick the checkbox (1) to sync order fulfillment from Shopify to ebay irrespective of their tracking details. Also, can tick the checkbox (2) to map the Shopify shipping carriers with eBay shipping carriers.",
            },
            orderCancelation: {
              label: "Order Cancellation Reason",
              enable: "no",
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
                        customAttribute: { label: "Shopify Reason", value: "" },
                        shopifyAttribute: { label: "eBay Reason", value: "" },
                      },
                    },
                    counter: 1,
                  },
                },
              },
              description:
                "Map the reasons for canceling orders on eBay with the reasons available.",
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
            // attribute: {
            //   // includeTax: {
            //   //   label: "Include Tax",
            //   //   type: "boolean",
            //   //   value: "yes",
            //   // },
            //   // trackInventoryFromShopify: {
            //   //   label: "Track Inventory from Shopify",
            //   //   type: "boolean",
            //   //   value: "yes",
            //   // },
            //   // syncWithoutProductdetails: {
            //   //   label: "Sync Without Product details",
            //   //   type: "boolean",
            //   //   value: "yes",
            //   // },
            //   // setOrderNote: {
            //   //   label: "Set Order Note",
            //   //   enable: "yes",
            //   //   type: "textfield",
            //   //   value: "",
            //   // },
            //   // setOrderTags: {
            //   //   label: "Set Order Tags",
            //   //   enable: "yes",
            //   //   type: "textfield",
            //   //   value: "",
            //   // },
            //   // setBuyerNotes: {
            //   //   label: "Set Buyer Notes",
            //   //   enable: "yes",
            //   //   type: "textfield",
            //   //   value: "",
            //   // },
            //   // mappingOfShippingService: {
            //   //   label: "Mapping of shipping Service",
            //   //   enable: "yes",
            //   //   type: "mappingBoolean",
            //   //   value: "yes",
            //   // },
            //   // userRealCustomerDetails: {
            //   //   label: "Use Real Customer Details",
            //   //   enable: "yes",
            //   //   type: "formBoolean",
            //   //   value: "yes",
            //   //   fields: {
            //   //     email: {
            //   //       label: "Email",
            //   //       enable: "yes",
            //   //       type: "textfield",
            //   //       value: "",
            //   //     },
            //   //     name: {
            //   //       label: "Name",
            //   //       enable: "yes",
            //   //       type: "textfield",
            //   //       value: "",
            //   //     },
            //   //   },
            //   // },
            // },
            // type: "segmentedBtn",
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
              "Enable tax details inclusion for your eBay order details.",
          },
          trackInventoryFromShopify: {
            label: "Track Inventory from Shopify",
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
              "Enable the setting to sync the inventory details from Shopify to eBay once in 24 hours",
          },
          syncWithoutProductdetails: {
            label: "Sync Without Product details",
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
              "Synchronizes orders received on eBay even if the product is not available on Shopify",
          },
          setOrderNote: {
            label: "Set Order Note",
            enable: "yes",
            type: "textfield",
            // value: "",
            attribute: {
              orderNote: {
                value: "",
              },
            },
            description: "Add a note for orders received from eBay to Shopify",
          },
          setOrderTags: {
            label: "Set Order Tags",
            enable: "yes",
            type: "textfield",
            // value: "",
            attribute: {
              orderTags: {
                value: "",
              },
            },
            description:
              "Add tags to orders received on eBay while creating them on Shopify.",
          },
          // setBuyerNotes: {
          //   label: "Set Buyer Notes",
          //   enable: "yes",
          //   type: "textfield",
          //   // value: "",
          //   attribute: {
          //     buyerNotes: {
          //       value: "",
          //     },
          //   },
          // },
          // mappingOfShippingService: {
          //   label: "Mapping of Shipping Service",
          //   enable: "yes",
          //   type: "mappingBoolean",
          //   value: "yes",
          // },

          shippingService: {
            label: "Shipping Service",
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
              mappingOfShippingService: {
                label: "Mapping of Shipping Service",
                enable: "yes",
                type: "mappingBoolean",
                value: "yes",
                shippingServiceMapping: {
                  mapping: {
                    "#1": {
                      customAttribute: {
                        label: "Shopify Shipping Service",
                        value: "",
                      },
                      // shopifyAttribute: { label: "Shopify attribute", value: ShippingServiceCodeTypeOptions[0]['value'] },
                      shopifyAttribute: {
                        label: "eBay Shipping Service",
                        value: "",
                      },
                    },
                  },
                  counter: 1,
                },
              },
            },
            description:
              "Map shipping services for Shopify with the shipping services of eBay. For example; Shopify shipping service USPS can be mapped to eBay FedEx Ground shipping services, in case you use different shipping services Shopify and eBay.",
          },
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
              "Display details like email and Name of customers for Orders received on eBay if don’t want to fetch the order with the buyer's details got in the orders.",
          },
          // userRealCustomerDetails: {
          //   label: "Use Real Customer Details",
          //   enable: "yes",
          //   type: "formBoolean",
          //   value: "yes",
          //   fields: {
          //     email: {
          //       label: "Email",
          //       enable: "yes",
          //       type: "textfield",
          //       value: "",
          //     },
          //     name: {
          //       label: "Name",
          //       enable: "yes",
          //       type: "textfield",
          //       value: "",
          //     },
          //   },
          // },
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
                label: "Without Tracking details",
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
                value: "no",
              },
              mappingOfShippingCarrier: {
                label: "Mapping of Shipping Carrier",
                enable: "yes",
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
            description:
              "Enable and tick the checkbox (1) to sync order fulfillment from Shopify to ebay irrespective of their tracking details. Also, can tick the checkbox (2) to map the Shopify shipping carriers with eBay shipping carriers.",
          },
          orderCancelation: {
            label: "Order Cancellation Reason",
            enable: "no",
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
                      customAttribute: { label: "Shopify Reason", value: "" },
                      shopifyAttribute: { label: "eBay Reason", value: "" },
                    },
                  },
                  counter: 1,
                },
              },
            },
            description:
              "Map the reasons for canceling orders on eBay with the reasons available.",
          },
        };
        // temp["fields"] = {
        //   autoOrderSync: {
        //     label: "Auto Order Sync",
        //     enable: "yes",
        //     options: [
        //       {
        //         label: "Yes",
        //         value: "yes",
        //       },
        //       {
        //         label: "No",
        //         value: "no",
        //       },
        //     ],
        //     attribute: {
        //       includeTax: {
        //         label: "Include Tax",
        //         type: "boolean",
        //         value: "yes",
        //       },
        //       trackInventoryFromShopify: {
        //         label: "Track Inventory from Shopify",
        //         type: "boolean",
        //         value: "yes",
        //       },
        //       syncWithoutProductdetails: {
        //         label: "Sync Without Product details",
        //         type: "boolean",
        //         value: "yes",
        //       },
        //       setOrderNote: {
        //         label: "Set Order Note",
        //         enable: "yes",
        //         type: "textfield",
        //         value: "",
        //       },
        //       setOrderTags: {
        //         label: "Set Order Tags",
        //         enable: "yes",
        //         type: "textfield",
        //         value: "",
        //       },
        //       setBuyerNotes: {
        //         label: "Set Buyer Notes",
        //         enable: "yes",
        //         type: "textfield",
        //         value: "",
        //       },
        //       mappingOfShippingService: {
        //         label: "Mapping of shipping Service",
        //         enable: "yes",
        //         type: "mapping",
        //       },
        //       userRealCustomerDetails: {
        //         label: "Use Real Customer Details",
        //         enable: "yes",
        //         type: "formBoolean",
        //         value: "yes",
        //         fields: {
        //           email: {
        //             label: "Email",
        //             enable: "yes",
        //             type: "textfield",
        //             value: "",
        //           },
        //           name: {
        //             label: "Name",
        //             enable: "yes",
        //             type: "textfield",
        //             value: "",
        //           },
        //         },
        //       },
        //     },
        //     type: "segmentedBtn",
        //   },
        //   shipmentSync: {
        //     label: "Shipment Sync",
        //     enable: "yes",
        //     type: "form",
        //     options: [
        //       {
        //         label: "Yes",
        //         value: "yes",
        //       },
        //       {
        //         label: "No",
        //         value: "no",
        //       },
        //     ],
        //     attribute: {
        //       withoutTrackingDetails: {
        //         label: "Without Tracking details",
        //         enable: "yes",
        //         type: "boolean",
        //         options: [
        //           {
        //             label: "Yes",
        //             value: "yes",
        //           },
        //           {
        //             label: "No",
        //             value: "no",
        //           },
        //         ],
        //         value: "yes",
        //       },
        //       // mappingOfShippingCarrier: {
        //       //   label: "Mapping of Shipping Carrier ",
        //       //   enable: "yes",
        //       //   type: "mapping",
        //       //   options: [
        //       //     {
        //       //       label: "Yes",
        //       //       value: "yes",
        //       //     },
        //       //     {
        //       //       label: "No",
        //       //       value: "no",
        //       //     },
        //       //   ],
        //       // },
        //     },
        //     type: "segmentedBtn",
        //   },
        //   orderCancelation: {
        //     label: "Order Cancelation Reason",
        //     enable: "yes",
        //     type: "form",
        //     options: [
        //       {
        //         label: "Yes",
        //         value: "yes",
        //       },
        //       {
        //         label: "No",
        //         value: "no",
        //       },
        //     ],
        //     type: "segmentedBtn",
        //   },
        // };
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
              if (key === "enable") {
                tempObj["order_settings"][
                  connectedAccountsObject[account]["shopId"]
                ][field][key] =
                  connectedAccountsObject[account]["fields"][field][key];
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

  return flag ? 
  (
    <Card sectioned>
    <SkeletonPage fullWidth={true}>
      <Card.Section>
        <SkeletonBodyText lines={2}/>
      </Card.Section>
      <Card.Section>
        <SkeletonBodyText lines={2}/>
      </Card.Section>
      <Card.Section>
        <SkeletonBodyText lines={2} />
      </Card.Section>
      <Card.Section>
        <SkeletonBodyText lines={2} />
      </Card.Section>
    </SkeletonPage>
  </Card>
  ):(
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
              {panes[pane].content}
            </TabPane>
          );
        })}
      </Tabs>
    </Card>
  );
};

export default OrderSettingsNew;
