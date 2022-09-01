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
        value: [],
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
