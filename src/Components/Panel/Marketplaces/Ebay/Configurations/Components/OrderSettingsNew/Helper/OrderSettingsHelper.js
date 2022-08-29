import { Link } from "@shopify/polaris";
import React from "react";

export const getParsedEbayAccounts = (ebayAccounts) => {
  let parsedEbayAccountsData = {};
  ebayAccounts.forEach((ebayAccount) => {
    const { value } = ebayAccount;
    ebayAccount["fields"] = {
      autoOrderSync: {
        label: "Manage Order",
        value: true,
      },
      includeTax: {
        label: "Include Tax",
        value: true,
        description:
          "Enable to include taxes in the order subtotal while creating order on Shopify.",
      },
      inventoryBehavioursetting: {
        label: "Inventory Behaviour",
        value: "decrement_obeying_policy",
        description:
          "Select behaviour to use updating inventory while creating order on Shopify.",
      },
      syncWithoutProductdetails: {
        label: "Sync Without Product details",
        value: false,
        description:
          "Enable if you want to create order on Shopify even when order item not found on App/Shopify.",
      },
      setOrderNote: {
        label: "Set Shopify Order Note",
        value: "default",
        customValue: "",
        description:
          "Set Shopify Order Note. You can customise it as per your need.",
      },
      setOrderTags: {
        label: "Set Shopify Order Tag(s)",
        value: "default",
        customValue: "",
        description:
          "Set Shopify Order Tags. You can customise it as per your need.",
      },
      setOrderName: {
        label: "Set Shopify Order Name",
        value: "default",
        customValue: "",
        description:
          "Set Shopify Order Name. You can customise it as per your need.",
      },
      useEbayCustomerDetails: {
        label: "Use eBay Customer Details",
        value: true,
        email: "",
        name: "",
        description:
          "Enable this to use ebay customer details for order creation. You can set custom customer details if you don't want eBay customer details for Order creation.",
      },
      shipmentSync: {
        label: "Shipment Sync",
        value: true,
        withoutTrackingDetails: true,
        mappingOfShippingCarrier: [
          {
            shopifyAttribute: "",
            ebayAttribute: "",
          },
        ],
        description: (
          <>
            Enable for syncing the Shipment from Shopify to eBay. You can choose
            to setting for syncing of tracking details and map Shopify Shipping
            carrier to eBay Shipping carrier if default value not matched with
            allowed{" "}
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
        type: "segmentedBtn",
      },
      orderCancelation: {
        label: "Order Cancellation Reason",
        value: [
          {
            shopifyAttribute: "Other",
            ebayAttribute: "UNKNOWN",
          },
        ],
        description:
          "Enable if you want to sync order cancellation from Shopify to eBay. You can also map cancellation reason.",
      },
    };
    parsedEbayAccountsData[value] = { ...ebayAccount };
  });
  return parsedEbayAccountsData;
};

export const getSavedData = (
  orderSettingsFromSavedAPIData,
  connectedAccountsObject,
  setconnectedAccountsObject
) => {
  console.log(orderSettingsFromSavedAPIData);
  if (Object.keys(orderSettingsFromSavedAPIData).length) {
    let temp = { ...connectedAccountsObject };
    // console.log(temp);
    for (const shopIdFromAPI in orderSettingsFromSavedAPIData) {
      // console.log(shopIdFromAPI);
      for (const account in temp) {
        if (shopIdFromAPI == temp[account]["shopId"]) {
          temp[account]["checked"] = true;
          for (const field in temp[account]["fields"]) {
            if (
              field === "shipmentSync" &&
              orderSettingsFromSavedAPIData[shopIdFromAPI][field]
            ) {
              temp[account]["fields"][field]["withoutTrackingDetails"] =
                orderSettingsFromSavedAPIData[shopIdFromAPI][field][
                  "withoutTrackingDetails"
                ];
              temp[account]["fields"][field]["mappingOfShippingCarrier"] =
                orderSettingsFromSavedAPIData[shopIdFromAPI][field][
                  "mappingOfShippingCarrier"
                ];
            }
            if (
              field === "useEbayCustomerDetails" &&
              orderSettingsFromSavedAPIData[shopIdFromAPI][field] &&
              Object.keys(orderSettingsFromSavedAPIData[shopIdFromAPI][field])
                .length > 0
            ) {
              temp[account]["fields"][field]["value"] = false;
              temp[account]["fields"][field]["email"] =
                orderSettingsFromSavedAPIData[shopIdFromAPI][field]["email"];
              temp[account]["fields"][field]["name"] =
                orderSettingsFromSavedAPIData[shopIdFromAPI][field]["name"];
            } else if (
              ["setOrderNote", "setOrderTags", "setOrderName"].includes(field)
            ) {
              if (
                orderSettingsFromSavedAPIData?.[shopIdFromAPI]?.[field] &&
                orderSettingsFromSavedAPIData?.[shopIdFromAPI]?.[
                  field
                ].hasOwnProperty("custom")
              ) {
                temp[account]["fields"][field]["value"] = "custom";
                temp[account]["fields"][field]["customValue"] =
                  orderSettingsFromSavedAPIData[shopIdFromAPI][field]["custom"];
              } else
                temp[account]["fields"][field]["value"] =
                  orderSettingsFromSavedAPIData[shopIdFromAPI][field];
            } else
              temp[account]["fields"][field]["value"] =
                orderSettingsFromSavedAPIData[shopIdFromAPI][field];
          }
        }
      }
    }
    console.log(temp);
    setconnectedAccountsObject(temp);
  }
};