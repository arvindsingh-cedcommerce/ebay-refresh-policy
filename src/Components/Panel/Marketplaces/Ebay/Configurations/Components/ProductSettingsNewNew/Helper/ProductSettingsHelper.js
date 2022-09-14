import { Link } from "@shopify/polaris";
import React from "react";
import { getCountryName } from "../../../../../../Accounts/NewAccount";
import { stateArray } from "./sampleData";

export const getParsedEbayAccounts = (ebayAccounts, shopifyWarehouses) => {
  let parsedEbayAccountsData = {};
  ebayAccounts.forEach((ebayAccount) => {
    const { value, siteId } = ebayAccount;
    ebayAccount["fields"] = {
      autoProductSync: {
        label: "Product Syncing",
        value: true,
        description:
          "Enable the option to sync selected attributes of the product on eBay.You can unselect the attribute if you don't want sync the value.",
        attributes: {
          title: true,
          description: true,
          main_image: true,
          weight: true,
          item_specifics: true,
          variation_pictures: true,
          quantity: true,
          price: true,
        },
      },
      autoEndProduct: {
        label: "End product",
        value: true,
        description: "Enable the option to allow end listing action on eBay.",
      },
      autoListProduct: {
        label: "Auto List product",
        value: false,
        description:
          "Enable the option to allow automatic listing of products on eBay whenever any product imported on app and fall under any available product-profile.",
      },
      salesTaxDetails: {
        label: "Sales Tax Details",
        useEbayTaxRateTable: false,
        state: stateArray[0]["value"],
        taxPercentage: "",
        alsoApplyToShippingAndHandlingCosts: false,
      },
      vehicleDetails: {
        label: "Vehicle Details",
        description: "",
        vehicleIdentificationNumber: "",
        restrictedToBusiness: "",
      },
      vatDetails: {
        label: "Vat Details",
        description:
          "VAT is not applicable to all countries, including the US.Allowed VAT percentage rates can vary by region/country, so sellers should be aware of the rates they are legally required/allowed to charge. Sellers must be registered as Business Sellers on the site they are selling on in order to use the Business Seller-related fields.",
        businessSeller: false,
        restrictedToBusiness: true,
        vatPercentage: "",
      },
      itemLocation: {
        label: "Item Location",
        description: "Indicates the geographical location of the item on eBay.",
        country: "",
        zipcode: "",
        location: "",
      },
      shopifyWarehouses: {
        label: "Shopify Warehouses",
        options: shopifyWarehouses,
        description:
          "Choose shopify location to use location's inventory for eBay listing.",
        value: shopifyWarehouses.map((warehouse) => warehouse.value),
      },
      currencyConversion: {
        label: "Currency Converter",
        description:
          "Convert the Shopify store currency to eBay account currency.",
        shopifyCurrencyName: "",
        shopifyCurrencyValue: "",
        ebayCurrencyName: "",
        ebayCurrencyValue: "",
      },
      match_from_ebay: {
        label: "Match products from eBay",
        value: [
          {
            shopify_attribute: "title",
            ebay_attribute: "Title",
          },
        ],
        description:
          "Set the attribute preference between Title or SKU to map the already existing eBay linting to  Shopify listings.",
      },
    };
    if (!["United States", "Canada (Eng)"].includes(getCountryName(siteId))) {
      delete ebayAccount["fields"]["salesTaxDetails"];
    }
    if (!["Motors"].includes(getCountryName(siteId))) {
      delete ebayAccount["fields"]["vehicleDetails"];
    }
    parsedEbayAccountsData[value] = { ...ebayAccount };
  });
  // console.log(parsedEbayAccountsData);
  return parsedEbayAccountsData;
};

export const getSavedData = (data, fields, setFields) => {
  // console.log(data, fields);
  let temp = { ...fields };
  for (const field in data) {
    if (field === "autoProductSync" && Object.keys(data[field]).length) {
      temp[field]["attributes"] = data[field];
    } else temp[field]["value"] = data[field];
  }
  setFields(temp);
};

export const getParsedData = (data) => {
  let parsedData = {};
  for (const key in data) {
    if (key === "autoProductSync" && data[key]["value"]) {
      parsedData[key] = { ...data[key]["attributes"] };
    } else parsedData[key] = data[key]["value"];
  }
  return parsedData;
};

export const getAppToEbaySavedData = (
  data,
  connectedAccountsObject,
  setconnectedAccountsObject
) => {
  let temp = { ...connectedAccountsObject };
  for (const account in connectedAccountsObject) {
    for (const shopid in data) {
      if (connectedAccountsObject[account]["shopId"] == shopid) {
        // temp[account]["checked"] = true;
        for (const field in data?.[shopid]?.["data"]?.["product_settings"]?.[
          "app_to_ebay"
        ]) {
          temp[account]["checked"] = true;
          if (
            field === "autoProductSync" &&
            Object.keys(
              data[shopid]["data"]["product_settings"]["app_to_ebay"][field]
            ).length
          ) {
            temp[account]["fields"][field]["attributes"] = {
              ...data[shopid]["data"]["product_settings"]["app_to_ebay"][field],
            };
          } else if (field === "currencyConversion") {
            const {
              ebayCurrencyName,
              ebayCurrencyValue,
              shopifyCurrencyName,
              shopifyCurrencyValue,
            } = data[shopid]["data"]["product_settings"]["app_to_ebay"][field];
            temp[account]["fields"][field]["ebayCurrencyName"] =
              ebayCurrencyName;
            temp[account]["fields"][field]["ebayCurrencyValue"] =
              ebayCurrencyValue;
            temp[account]["fields"][field]["shopifyCurrencyName"] =
              shopifyCurrencyName;
            temp[account]["fields"][field]["shopifyCurrencyValue"] =
              shopifyCurrencyValue;
          } else if (field === "itemLocation") {
            const { country, location, zipcode } =
              data[shopid]["data"]["product_settings"]["app_to_ebay"][field];
            temp[account]["fields"][field]["country"] = country;
            temp[account]["fields"][field]["location"] = location;
            temp[account]["fields"][field]["zipcode"] = zipcode;
          } else if (field === "salesTaxDetails") {
            const {
              useEbayTaxRateTable,
              state,
              taxPercentage,
              alsoApplyToShippingAndHandlingCosts,
            } = data[shopid]["data"]["product_settings"]["app_to_ebay"][field];
            temp[account]["fields"][field]["useEbayTaxRateTable"] =
              useEbayTaxRateTable;
            temp[account]["fields"][field]["state"] = state;
            temp[account]["fields"][field]["taxPercentage"] = taxPercentage;
            temp[account]["fields"][field][
              "alsoApplyToShippingAndHandlingCosts"
            ] = alsoApplyToShippingAndHandlingCosts;
          } else if (field === "vatDetails") {
            const { businessSeller, restrictedToBusiness, vatPercentage } =
              data[shopid]["data"]["product_settings"]["app_to_ebay"][field];
            temp[account]["fields"][field]["businessSeller"] = businessSeller;
            temp[account]["fields"][field]["restrictedToBusiness"] =
              restrictedToBusiness;
            temp[account]["fields"][field]["vatPercentage"] = vatPercentage;
          } else if (field === "match_from_ebay") {
            temp[account]["fields"][field]["value"] = [
              ...data[shopid]["data"]["product_settings"]["app_to_ebay"][field],
            ];
          } else if (field === "shopifyWarehouses") {
            temp[account]["fields"][field]["value"] =
              data[shopid]["data"]["product_settings"]["app_to_ebay"][field];
          } else if (field === "vehicleDetails") {
            const { vehicleIdentificationNumber, restrictedToBusiness } =
              data[shopid]["data"]["product_settings"]["app_to_ebay"][field];
            temp[account]["fields"][field]["vehicleIdentificationNumber"] =
              vehicleIdentificationNumber;
            temp[account]["fields"][field]["restrictedToBusiness"] =
              restrictedToBusiness;
          } else if (
            ["autoProductSync", "autoListProduct", "autoEndProduct"].includes(
              field
            )
          ) {
            temp[account]["fields"][field]["value"] =
              data[shopid]["data"]["product_settings"]["app_to_ebay"][field];
          }
        }
      }
    }
  }
  // console.log(temp);
  setconnectedAccountsObject(temp);
};
