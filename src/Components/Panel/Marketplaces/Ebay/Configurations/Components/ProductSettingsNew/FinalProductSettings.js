import {
  Button,
  Card,
  Stack,
  SkeletonBodyText,
  SkeletonPage,
  SkeletonDisplayText,
} from "@shopify/polaris";
import { Checkbox, Divider, message } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../../Apirequest/accountsApi";
// import { getEbayshopSettings } from "../../../../../../../Apirequest/ebayApirequest/policiesApi";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../services/notify";
import { getAppSettingsURL } from "../../../../../../../URLs/ConfigurationURL";
import { getCountryName } from "../../../../../Accounts/NewAccount";
import AppToEbay from "../ProductSettings/AppToEbay";
import ShopifyToApp from "../ProductSettings/ShopifyToApp";
import AppToEbayNew from "./AppToEbayNew";
import { countryArray, packageTypeArray, stateArray } from "./countryData";
import ShopifyToAppNew from "./ShopifyToAppNew";

const FinalProductSettings = () => {
  const [flag, setflag] = useState(true);
  const [optionsVar, setOptionsVar] = useState({
    autoProductSync: {
      label: "Auto Product Syncing",
      enable: "yes",
      description:
        "Enable the option to automatic sync selected attributes of the product from shopify on app. You can unselect the attribute if you don't want to sync the value.",
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
        title: {
          label: "Title",
          value: "yes",
        },
        // type: {
        //   label: "Type",
        //   value: "yes",
        // },
        vendor: {
          label: "Vendor",
          value: "yes",
        },
        price: {
          label: "Price",
          value: "yes",
        },
        quantity: {
          label: "Quantity",
          value: "yes",
        },
        weight: {
          label: "Weight",
          value: "yes",
        },
        weight_unit: {
          label: "Weight Unit",
          value: "yes",
        },
        sku: {
          label: "SKU",
          value: "yes",
        },
        product_type: {
          label: "Product Type",
          value: "yes",
        },
        images: {
          label: "Images",
          value: "yes",
        },
        tags: {
          label: "Tags",
          value: "yes",
        },
      },
    },
    autoDeleteProduct: {
      label: "Auto Delete Product",
      enable: "yes",
      description:
        "Enable the option to allow automatic delete product from app. Which means if the product delated on Shopify then it will automatically deleted on app as well.",
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
    autoProductCreate: {
      label: "Auto Product Create",
      enable: "yes",
      description:
        "Enable the option to import new products automatically on the App when created on Shopify. i.e. importing process will consider the product import settings but not for collection based import settings.",
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
    // resetEditedFields: {
    //   label: "Update Edited fields",
    //   enable: "no",
    //   description:
    //     "Enable the option to disable the Shopify to app syncing for the fields edited in the app. ",
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
    // },

    // match_from_ebay: {
    //   label: "Match products from eBay",
    //   enable: "yes",
    //   description:
    //     "Set the attribute preference between Title or SKU to map the already existing eBay linting to  Shopify listings.",
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
    //   attributeMapping: [
    //     {
    //       shopify_attribute: "title",
    //       ebay_attribute: "Title",
    //     },
    //     {
    //       shopify_attribute: "sku",
    //       ebay_attribute: "SKU",
    //     },
    //   ],
    // },
  });
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  const [accountsReceived, setAccountsReceived] = useState(false);

  // get shopify to app data

  const getSavedData = async () => {
    let { data, success, message } = await configurationAPI(getAppSettingsURL);
    if (success) {
      setflag(false);
      // if (data?.data?.product_settings?.match_from_ebay) {
      //   let temp = { ...optionsVar };
      //   temp["match_from_ebay"]["enable"] =
      //     data.data.product_settings.match_from_ebay["enable"];
      //   temp["match_from_ebay"]["attributeMapping"] =
      //     data.data.product_settings.match_from_ebay["attributeMapping"];
      //   setOptionsVar(temp);
      // }
      if (data?.data?.product_settings?.shopify_to_app) {
        let temp = { ...optionsVar };
        Object.keys(data.data.product_settings.shopify_to_app).forEach((id) => {
          if (id !== "resetEditedFields") {
            temp[id]["enable"] =
              data.data.product_settings.shopify_to_app[id]["enable"];
            if (id === "autoProductSync") {
              for (const attributeKey in temp[id]["attribute"]) {
                temp[id]["attribute"][attributeKey]["value"] =
                  data.data.product_settings.shopify_to_app[id]["attribute"][
                    attributeKey
                  ];
              }
            }
          }
          // else if (id === "match_from_ebay") {
          //   temp[id]["attributeMapping"] =
          //     data.data.product_settings.shopify_to_app[id]["attributeMapping"];
          // }
        });
        setOptionsVar(temp);
      }
      // if (data?.data?.product_settings?.app_to_ebay) {
      //   let temp = { ...connectedAccountsObject };
      //   temp["Default"]["checked"] = true;
      //   Object.keys(data.data.product_settings.app_to_ebay).forEach((id) => {
      //     if (id !== "match_from_ebay") {
      //       temp["Default"]["fields"][id]["enable"] =
      //         data.data.product_settings.app_to_ebay[id]["enable"];
      //       if (
      //         [
      //           "autoProductSync",
      //           "vatDetails",
      //           "currencyConversion",
      //           "itemLocation",
      //         ].includes(id)
      //       ) {
      //         for (const attributeKey in temp["Default"]["fields"][id][
      //           "attribute"
      //         ]) {
      //           temp["Default"]["fields"][id]["attribute"][attributeKey][
      //             "value"
      //           ] =
      //             data.data.product_settings.app_to_ebay[id]["attribute"][
      //               attributeKey
      //             ];
      //         }
      //       } else if (id === "shopifyWarehouses") {
      //         temp["Default"]["fields"][id]["shopifyWarehouseValue"] =
      //           data.data.product_settings.app_to_ebay[id][
      //             "shopifyWarehouseValue"
      //           ];
      //       }
      //     } else {
      //       console.log(id, data.data.product_settings.app_to_ebay[id]);
      //       temp["Default"]["fields"][id]["enable"] =
      //         data.data.product_settings.app_to_ebay[id]["enable"];
      //       if (data.data.product_settings.app_to_ebay[id]["match_from_ebay"])
      //         temp["Default"]["fields"][id]["match_from_ebay"] =
      //           data.data.product_settings.app_to_ebay[id]["match_from_ebay"];
      //     }
      //   });
      //   setconnectedAccountsObject(temp);
      // }
      if (data?.marketplace?.ebay?.shop) {
        let temp = { ...connectedAccountsObject };
        Object.keys(data.marketplace.ebay.shop).forEach((id) => {
          if (data.marketplace.ebay.shop[id]?.data?.product_settings) {
            for (const key in temp) {
              if (temp[key]["shopId"] == id) {
                temp[key]["checked"] = true;
                for (const field in temp[key]["fields"]) {
                  if (
                    data?.marketplace?.ebay?.shop[id]?.data?.product_settings
                      ?.app_to_ebay[field]
                  ) {
                    temp[key]["fields"][field]["enable"] =
                      data.marketplace.ebay.shop[
                        id
                      ].data.product_settings.app_to_ebay[field]["enable"];
                  }
                  if (
                    [
                      "autoProductSync",
                      "salesTaxDetails",
                      "vatDetails",
                      "currencyConversion",
                      "itemLocation",
                      "vehicleDetails",
                    ].includes(field)
                  ) {
                    for (const key1 in temp[key]["fields"][field][
                      "attribute"
                    ]) {
                      temp[key]["fields"][field]["attribute"][key1]["value"] =
                        data.marketplace.ebay.shop[id]["data"][
                          "product_settings"
                        ]?.["app_to_ebay"]?.[field]?.["attribute"]?.[key1];
                    }
                  } else if (field === "shopifyWarehouses") {
                    temp[key]["fields"][field]["shopifyWarehouseValue"] =
                      data.marketplace.ebay.shop[id]["data"][
                        "product_settings"
                      ]["app_to_ebay"][field]["shopifyWarehouseValue"];
                  } else if (field === "match_from_ebay") {
                    temp[key]["fields"][field]["attributeMapping"] = data
                      .marketplace.ebay.shop[id]["data"]["product_settings"][
                      "app_to_ebay"
                    ][field]["attributeMapping"]
                      ? data.marketplace.ebay.shop[id]["data"][
                          "product_settings"
                        ]["app_to_ebay"][field]["attributeMapping"]
                      : [];
                  } 
                  // else if (field === "packageType") {
                  //   temp[key]["fields"][field]["packageTypeValue"] =
                  //     data.marketplace.ebay.shop[id]["data"][
                  //       "product_settings"
                  //     ]?.["app_to_ebay"]?.[field]?.["packageTypeValue"];
                  // }
                }
              }
            }
          }
        });
        setconnectedAccountsObject(temp);
      }
    } else {
      notify.error(message);
    }
  };

  const extractShopifyWarehouses = (accounts) => {
    let temp = [];
    if (accounts.length) {
      accounts[0].warehouses.forEach((warehouse) => {
        temp.push({
          value: warehouse.name,
          label: warehouse.name,
        });
      });
    }
    return temp;
  };

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let shopifyAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "shopify"
      );
      let shopifyWarehouses = extractShopifyWarehouses(shopifyAccounts);
      // console.log(shopifyWarehouses);
      // console.log(shopifyWarehouses.map(warehouse => warehouse.value));
      let ebayAccountsObj = {
        // Default: {
        //   checked: true,
        //   value: "default",
        //   shopId: "default",
        //   label: "Default",
        //   fields: {
        //     autoProductSync: {
        //       label: "Product Syncing",
        //       enable: "yes",
        //       description:
        //         "Enable the option to sync the details of the product automatically, also, you can select the respective fields for which you want to enable the auto-syncing from App to the eBay Marketplace.",
        //       options: [
        //         {
        //           label: "Yes",
        //           value: "yes",
        //         },
        //         {
        //           label: "No",
        //           value: "no",
        //         },
        //       ],
        //       attribute: {
        //         title: {
        //           label: "Title",
        //           value: "yes",
        //         },
        //         description: {
        //           label: "Description",
        //           value: "yes",
        //         },
        //         main_image: {
        //           label: "Main Image",
        //           value: "yes",
        //         },
        //         weight: {
        //           label: "Weight",
        //           value: "yes",
        //         },
        //         item_specifics: {
        //           label: "Item Specifics",
        //           value: "yes",
        //         },
        //         variation_pictures: {
        //           label: "Variation Pictures",
        //           value: "yes",
        //         },
        //         quantity: {
        //           label: "Quantity",
        //           value: "yes",
        //         },
        //         price: {
        //           label: "Price",
        //           value: "yes",
        //         },
        //       },
        //       type: "segmentedBtn",
        //     },
        //     autoEndProduct: {
        //       label: "End product",
        //       enable: "no",
        //       description:
        //         "Enable to automatically end product listing on eBay once the product is deleted from the App.",
        //       options: [
        //         {
        //           label: "Yes",
        //           value: "yes",
        //         },
        //         {
        //           label: "No",
        //           value: "no",
        //         },
        //       ],
        //       type: "segmentedBtn",
        //     },
        //     autoListProduct: {
        //       label: "Auto List product",
        //       enable: "no",
        //       description:
        //         "Enable to automatically upload the listings on eBay once imported to the app.",
        //       options: [
        //         {
        //           label: "Yes",
        //           value: "yes",
        //         },
        //         {
        //           label: "No",
        //           value: "no",
        //         },
        //       ],
        //       type: "segmentedBtn",
        //     },
        //     vatDetails: {
        //       label: "Vat Details",
        //       enable: "yes",
        //       type: "form",
        //       description:
        //         "VAT is calculated based on the difference between the cost of the product and its price for a buyer. Enter your VAT percentage after confirming whether you are a Business seller and the account is only for business.",
        //       options: [
        //         {
        //           label: "Yes",
        //           value: "yes",
        //         },
        //         {
        //           label: "No",
        //           value: "no",
        //         },
        //       ],
        //       attribute: {
        //         businessSeller: {
        //           label: "Business seller",
        //           enable: "yes",
        //           type: "dropdown",
        //           value: "no",
        //           options: [
        //             { label: "Yes", value: "yes" },
        //             { label: "No", value: "no" },
        //           ],
        //         },
        //         restrictedToBusiness: {
        //           label: "Restricted to business",
        //           enable: "yes",
        //           type: "dropdown",
        //           value: "yes",
        //           options: [
        //             { label: "Yes", value: "yes" },
        //             { label: "No", value: "no" },
        //           ],
        //         },
        //         vatPercentage: {
        //           label: "VAT Percentage",
        //           enable: "yes",
        //           type: "textfield",
        //           value: "",
        //         },
        //       },
        //     },
        //     itemLocation: {
        //       label: "Item Location",
        //       enable: "yes",
        //       type: "form",
        //       description:
        //         "Item location information is to accurately state where the item will be shipped from. Set the Item location for the products by selecting a country and providing a ZIP code.",
        //       options: [
        //         {
        //           label: "Yes",
        //           value: "yes",
        //         },
        //         {
        //           label: "No",
        //           value: "no",
        //         },
        //       ],
        //       attribute: {
        //         country: {
        //           label: "Country",
        //           enable: "yes",
        //           type: "dropdown",
        //           value: countryArray[10]["value"],
        //           options: countryArray,
        //         },
        //         zipcode: {
        //           label: "Zip Code",
        //           enable: "yes",
        //           type: "textfield",
        //           value: "",
        //         },
        //         location: {
        //           label: "Location",
        //           enable: "yes",
        //           type: "textfield",
        //           value: "",
        //         },
        //       },
        //     },
        //     shopifyWarehouses: {
        //       label: "Shopify Warehouses",
        //       enable: "yes",
        //       type: "form",
        //       options: shopifyWarehouses,
        //       description:
        //         "Select from the available warehouses on Shopify to be used for fulfilling eBay orders.",
        //       shopifyWarehouseValue: [],
        //     },
        //     currencyConversion: {
        //       label: "Currency Converter",
        //       enable: "yes",
        //       type: "segmentedBtn",
        //       options: [
        //         {
        //           label: "Yes",
        //           value: "yes",
        //         },
        //         {
        //           label: "No",
        //           value: "no",
        //         },
        //       ],
        //       attribute: {
        //         shopifyCurrency: {
        //           label: "Shopify Currency",
        //           enable: "yes",
        //           type: "textfield",
        //           value: "",
        //           disabled: true,
        //         },
        //         ebayCurrency: {
        //           label: "eBay Currency",
        //           enable: "yes",
        //           type: "textfield",
        //           value: "",
        //           numberType: "number",
        //         },
        //       },
        //       description:
        //         "Convert the Shopify store currency to eBay account currency.",
        //     },
        //     match_from_ebay: {
        //       label: "Match products from eBay",
        //       enable: "yes",
        //       type: "segmentedBtn",
        //       description:
        //         "Set the attribute preference between Title or SKU to map the already existing eBay linting to  Shopify listings.",
        //       match_from_ebay: [
        //         {
        //           shopify_attribute: "title",
        //           ebay_attribute: "Title",
        //         },
        //         {
        //           shopify_attribute: "sku",
        //           ebay_attribute: "SKU",
        //         },
        //       ],
        //     },
        //   },
        // },
      };
      // const extractCountryDetails = (CountryDetails) => {
      //   let temp = [];
      //   temp = CountryDetails.map((country) => {
      //     return { label: country["Description"], value: country["Country"] };
      //   });
      //   return temp;
      // };

      // const getEbayDetails = async (site_id, shop_id) => {
      //   let { success, data } = await getEbayshopSettings({ site_id, shop_id });
      //   if (success) {
      //     console.log(data);
      //     if (data?.CountryDetails) {
      //       return extractCountryDetails(data.CountryDetails);
      //     }
      //   }
      // };

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
          autoProductSync: {
            label: "Product Syncing",
            enable: "yes",
            description:
              "Enable the option to sync selected attributes of the product on eBay.You can unselect the attribute if you don't want sync the value.",
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
              title: {
                label: "Title",
                value: "yes",
              },
              description: {
                label: "Description",
                value: "yes",
              },
              main_image: {
                label: "Main Image",
                value: "yes",
              },
              weight: {
                label: "Weight",
                value: "yes",
              },
              item_specifics: {
                label: "Item Specifics",
                value: "yes",
              },
              variation_pictures: {
                label: "Variation Pictures",
                value: "yes",
              },
              quantity: {
                label: "Quantity",
                value: "yes",
              },
              price: {
                label: "Price",
                value: "yes",
              },
            },
            type: "segmentedBtn",
          },
          autoEndProduct: {
            label: "End product",
            enable: "yes",
            description:
              "Enable the option to allow end listing action on eBay.",
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
          },
          autoListProduct: {
            label: "Auto List product",
            enable: "no",
            description:
              "Enable the option to allow automatic listing of products on eBay whenever any product imported on app and fall under any available product-profile.",
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
          },
          salesTaxDetails: {
            label: "Sales Tax Details",
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
              useEbayTaxRateTable: {
                label: "Use eBay tax rate table",
                enable: "yes",
                type: "dropdown",
                value: "no",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ],
              },
              state: {
                label: "State",
                enable: "yes",
                type: "dropdownDependent",
                value: stateArray[10]["value"],
                options: stateArray,
              },
              taxPercentage: {
                label: "Tax Percentage",
                enable: "yes",
                type: "textfield",
                value: "",
              },
              alsoApplyToShippingAndHandlingCosts: {
                label: "Also apply to shipping and handling costs",
                enable: "yes",
                type: "checkbox",
                value: false,
              },
            },
          },
          vehicleDetails: {
            label: "Vehicle Details",
            enable: "yes",
            type: "form",
            description: "",
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
              vehicleIdentificationNumber: {
                label: "Vehicle Identification Number",
                enable: "yes",
                type: "textfield",
                value: "",
              },
              restrictedToBusiness: {
                label: "Vehicle Registration Mark",
                enable: "yes",
                type: "textfield",
                value: "",
              },
            },
          },
          vatDetails: {
            label: "Vat Details",
            enable: "yes",
            type: "form",
            description:
              "VAT is not applicable to all countries. Allowed VAT percentage rates can vary by region/country, so sellers should be aware of the rates they are legally required/allowed to charge. Sellers must be registered as Business Sellers on the site they are selling on in order to use the Business Seller-related fields.",
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
              businessSeller: {
                label: "Business seller",
                enable: "yes",
                type: "dropdown",
                value: "no",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ],
              },
              restrictedToBusiness: {
                label: "Restricted to business",
                enable: "yes",
                type: "dropdown",
                value: "yes",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ],
              },
              vatPercentage: {
                label: "VAT Percentage",
                enable: "yes",
                type: "textfield",
                value: "",
              },
            },
          },
          itemLocation: {
            label: "Item Location",
            enable: "yes",
            type: "form",
            description:
              "Indicates the geographical location of the item on eBay.",
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
              country: {
                label: "Country",
                enable: "yes",
                type: "dropdown",
                value: countryArray[10]["value"],
                options: countryArray,
              },
              zipcode: {
                label: "Zip Code",
                enable: "yes",
                type: "textfield",
                value: "",
              },
              location: {
                label: "Location",
                enable: "yes",
                type: "textfield",
                value: "",
              },
            },
            // description:
            //   "Zip code is the postal code of the place where the item is located. This value is used for proximity searches",
          },
          // packageType: {
          //   label: "Package Type",
          //   enable: "yes",
          //   type: "dropdown",
          //   description: "",
          //   options: packageTypeArray,
          //   packageTypeValue: packageTypeArray[0]["value"],
          // },
          shopifyWarehouses: {
            label: "Shopify Warehouses",
            enable: "yes",
            type: "form",
            options: shopifyWarehouses,
            description:
              "Choose shopify location to use location's inventory for eBay listing.",
            shopifyWarehouseValue: shopifyWarehouses.map(
              (warehouse) => warehouse.value
            ),
          },
          currencyConversion: {
            label: "Currency Converter",
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
              "Convert the Shopify store currency to eBay account currency.",
            attribute: {
              shopifyCurrency: {
                label: "Shopify Currency",
                enable: "yes",
                type: "textfield",
                value: "",
                disabled: true,
              },
              ebayCurrency: {
                label: "eBay Currency",
                enable: "yes",
                type: "textfield",
                value: "",
                numberType: "number",
              },
            },
          },
          match_from_ebay: {
            label: "Match products from eBay",
            enable: "yes",
            type: "segmentedBtn",
            description:
              "Set the attribute preference between Title or SKU to map the already existing eBay linting to  Shopify listings.",
            attributeMapping: [
              {
                shopify_attribute: "title",
                ebay_attribute: "Title",
              },
              {
                shopify_attribute: "sku",
                ebay_attribute: "SKU",
              },
            ],
          },
        };
        // if (
        //   ["United States"].includes(
        //     getCountryName(account["warehouses"][0]["site_id"])
        //   )
        // ) {
        //   delete temp["fields"]["vatDetails"];
        // }
        if (
          !["United States", "Canada (Eng)"].includes(
            getCountryName(account["warehouses"][0]["site_id"])
          )
        ) {
          delete temp["fields"]["salesTaxDetails"];
        }
        if (
          !["Motors"].includes(
            getCountryName(account["warehouses"][0]["site_id"])
          )
        ) {
          delete temp["fields"]["vehicleDetails"];
        }
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
    if (accountsReceived) {
      getSavedData();
    }
  }, [accountsReceived]);

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  return flag ? (
    <Card sectioned>
      <SkeletonPage
        fullWidth={true}
        title={<SkeletonDisplayText size="small" />}
      >
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
    <>
      <AppToEbayNew
        connectedAccountsObject={connectedAccountsObject}
        setconnectedAccountsObject={setconnectedAccountsObject}
      />
      <Divider />
      <ShopifyToAppNew optionsVar={optionsVar} setOptionsVar={setOptionsVar} />
    </>
  );
};

export default FinalProductSettings;
