import { Banner, Button, Card, Stack } from "@shopify/polaris";
import { Checkbox, Col, Layout, Row } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { configurationAPI } from "../../../../../../APIrequests/ConfigurationAPI";
import {
  getAppSettingsURL,
  saveAppSettingsShopifyToAppURL,
} from "../../../../../../URLs/ConfigurationURL";
import { getCountryName } from "../../../../Accounts/NewAccount";
import FieldsComponent from "./AppSettings/FieldsComponent";
import ShopifyToApp from "./AppSettings/ShopifyToApp";

// export const fields = { // puchna hai zaidi se
//   Title: false,
//   Description: false,
//   "Main Image": false,
//   Weight: false,
//   "Item Specifics": false,
//   "Variation Pictures": false,
//   Quantity: false,
//   Price: false,
// };

export const shippingPackageType = [
  { label: "Unselect", value: "" },
  { label: "Bulky Goods", value: "C_BULKY_GOODS" },
  { label: "Caravan", value: "C_CARAVAN" },
  { label: "Cars", value: "C_CARS" },
  { label: "Custom Code", value: "C_CUSTOM_CODE" },
  { label: "Europallet", value: "C_EUROPALLET" },
  { label: "Expandable Tough Bags", value: "C_EXPANDABLE_TOUGH_BAGS" },
  { label: "ExtraLargePack", value: "C_EXTRA_LARGE_PACK" },
  { label: "Furniture", value: "C_FURNITURE" },
  { label: "Industry Vehicles", value: "C_INDUSTRY_VEHICLES" },
  { label: "Large Canada PostBox", value: "C_LARGE_CANADA_POST_BOX" },
  {
    label: "Large Canada Post Bubble Mailer",
    value: "C_LARGE_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "Large Envelope", value: "C_LARGE_ENVELOPE" },
  { label: "Letter", value: "C_LETTER" },
  { label: "MailingBoxes", value: "C_MAILING_BOXES" },
  { label: "MediumCanadaPostBox", value: "C_MEDIUM_CANADA_POST_BOX" },
  {
    label: "MediumCanadaPostBubbleMailer",
    value: "C_MEDIUM_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "Motorbikes", value: "C_MOTORBIKES" },
  { label: "None", value: "C_NONE" },
  { label: "One Way Pallet", value: "C_ONE_WAY_PALLET" },
  { label: "Package Thick Envelope", value: "C_PACKAGE_THICK_ENVELOPE" },
  { label: "Padded Bags", value: "C_PADDED_BAGS" },
  { label: "Parcel Or Padded Envelope", value: "C_PARCEL_OR_PADDED_ENVELOPE" },
  { label: "Roll", value: "C_ROLL" },
  { label: "Small Canada PostBox", value: "C_SMALL_CANADA_POST_BOX" },
  {
    label: "Small Canada Post BubbleMailer",
    value: "C_SMALL_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "Tough Bags", value: "C_TOUGH_BAGS" },
  { label: "UPS Letter", value: "C_UPS_LETTER" },
  { label: "USPS Flat Rate Envelope", value: "C_USPS_FLAT_RATE_ENVELOPE" },
  { label: "USPS Large Pack", value: "C_USPS_LARGE_PACK" },
  { label: "Very Large Pack", value: "C_VERY_LARGE_PACK" },
  { label: "Winepak", value: "C_WINEPAK" },
];
const AppSettings = () => {
  // accounts
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  const [optionsVar, setOptionsVar] = useState({
    auto_product_sync: {
      label: "Auto product syncing",
      enable: "no",
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
          value: "no",
        },
        type: {
          label: "Type",
          value: "no",
        },
        vendor: {
          label: "Vendor",
          value: "no",
        },
        price: {
          label: "Price",
          value: "no",
        },
        quantity: {
          label: "Quantity",
          value: "no",
        },
        weight: {
          label: "Weight",
          value: "no",
        },
        weight_unit: {
          label: "Weight Unit",
          value: "no",
        },
        sku: {
          label: "SKU",
          value: "no",
        },
        product_type: {
          label: "Product Type",
          value: "no",
        },
        images: {
          label: "Images",
          value: "no",
        },
        tags: {
          label: "Tags",
          value: "no",
        },
      },
    },
    autoOrderSyncing: {
      label: "Auto order syncing",
      enable: "no",
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
    auto_inventory_sync: {
      label: "Auto inventory syncing",
      enable: "no",
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
      label: "Auto product create",
      enable: "no",
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
    trackInventoryFromShipping: {
      label: "Track inventory from Shopify",
      enable: "no",
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
    packageType: {
      label: "Package Type",
      enable: "",
      options: shippingPackageType,
    },
    updatedEditedFields: {
      label: "Update Edited fields",
      enable: "no",
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
  });

  const [shopifyToAppFieldsAll, setShopifyToAppFieldsAll] = useState(false);

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let ebayAccountsObj = {
        Global: {
          value: "all",
          checked: false,
          fields: {
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
          shopId: "all",
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
          title: {
            label: "Title",
            value: "no",
          },
          description: {
            label: "Description",
            value: "no",
          },
          main_image: {
            label: "Main Image",
            value: "no",
          },
          weight: {
            label: "Weight",
            value: "no",
          },
          item_specifics: {
            label: "Item Specifics",
            value: "no",
          },
          variation_pictures: {
            label: "Variation Pictures",
            value: "no",
          },
          quantity: {
            label: "Quantity",
            value: "no",
          },
          price: {
            label: "Price",
            value: "no",
          },
        };
        ebayAccountsObj[
          `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`
        ] = temp;
      });
      setconnectedAccountsObject(ebayAccountsObj);
    }
  };

  const getSavedData = async () => {
    let { data, success } = await configurationAPI(getAppSettingsURL);
    if (success) {
      if (data.data.product_settings.shopify_to_app) {
        let temp = { ...optionsVar };
        for (const key in temp) {
          temp[key]["enable"] =
            data.data.product_settings.shopify_to_app[key]["enable"];
          if (key === "auto_product_sync") {
            for (const attributeKey in temp[key]["attribute"]) {
              temp[key]["attribute"][attributeKey]["value"] =
                data.data.product_settings.shopify_to_app[key]["attribute"][
                  attributeKey
                ];
            }
          }
        }
        setOptionsVar(temp);
      }
      if (data.marketplace.ebay.shop) {
        let temp = { ...connectedAccountsObject };
        for (const account in connectedAccountsObject) {
          for (const shopId in data.marketplace.ebay.shop) {
            if (shopId == connectedAccountsObject[account]["shopId"]) {
              console.log(data.marketplace.ebay.shop, connectedAccountsObject);
              connectedAccountsObject[account]["checked"] = true;
            }
          }
        }
        // setconnectedAccountsObject(temp)
      }
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  useEffect(() => {
    // if (Object.keys(connectedAccountsObject).length) getSavedData();
  }, [connectedAccountsObject]);

  const saveData = async (postData) => {
    let {} = await configurationAPI(saveAppSettingsShopifyToAppURL, postData);
  };

  return (
    <>
      <ShopifyToApp
        optionsVar={optionsVar}
        setOptionsVar={setOptionsVar}
        shopifyToAppFieldsAll={shopifyToAppFieldsAll}
        setShopifyToAppFieldsAll={setShopifyToAppFieldsAll}
      />
      <br />
      <Stack alignment="baseline">
        <CheckboxComponent
          connectedAccountsObject={connectedAccountsObject}
          setconnectedAccountsObject={setconnectedAccountsObject}
        />
        <Button
          primary
          onClick={() => {
            let tempObj = {
              app_to_ebay: {
                auto_product_sync: {
                  // shops: {},
                },
              },
            };
            Object.keys(connectedAccountsObject).forEach((account) => {
              if (connectedAccountsObject[account]["checked"]) {
                let tempAttributeObj = {};
                for (const key in connectedAccountsObject[account]["fields"]) {
                  tempAttributeObj[key] =
                    connectedAccountsObject[account]["fields"][key]["value"];
                }
                if (connectedAccountsObject[account]["shopId"]) {
                  tempObj["app_to_ebay"]["auto_product_sync"][
                    connectedAccountsObject[account]["shopId"]
                  ] = {
                    // data: {
                    // product_settings: {
                    //   product_sync: {
                    //     enable: "yes",
                    attribute: { ...tempAttributeObj },
                    //   },
                    // },
                    // },
                  };
                } else {
                  tempObj["app_to_ebay"]["auto_product_sync"]["all"] = {
                    // product_settings: {
                    // product_sync: {
                    // enable: "yes",
                    attribute: { ...tempAttributeObj },
                    //   },
                    // },
                  };
                }
              }
            });
            saveData(tempObj);
          }}
        >
          Save
        </Button>
      </Stack>
      <br />
      {Object.keys(connectedAccountsObject).map((account) => {
        return (
          connectedAccountsObject[account]["checked"] && (
            <Card sectioned title={`From App to eBay ${account}`}>
              <Card.Section>
                <FieldsComponent
                  connectedAccountsObject={connectedAccountsObject}
                  setconnectedAccountsObject={setconnectedAccountsObject}
                  account={account}
                />
              </Card.Section>
            </Card>
          )
        );
      })}
    </>
  );
};

export default AppSettings;

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
