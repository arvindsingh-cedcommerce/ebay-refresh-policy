import { Button, Card, Stack } from "@shopify/polaris";
import { Checkbox, message } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { configurationAPI } from "../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../services/notify";
import { getAppSettingsURL, saveAppSettingsShopifyToAppURL } from "../../../../../../URLs/ConfigurationURL";
import { getCountryName } from "../../../../Accounts/NewAccount";
import AppToEbay from "./ProductSettings/AppToEbay";
import ShopifyToApp from "./ProductSettings/ShopifyToApp";

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
const ProductSettingsDependent = () => {
  const [optionsVar, setOptionsVar] = useState({
    autoProductSync: {
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
    autoProfiling: {
      label: "Auto End Product",
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
    resetEditedFields: {
      label: "Reset All Edited fields",
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
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let ebayAccountsObj = {
        Global: {
          checked: false,
          value: "all",
          shopId: "all",
          label: "Global",
          fields: {
            autoProductSync: {
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
              },
            },
            autoEndProduct: {
              label: "Auto End product",
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
            autoListProduct: {
              label: "Auto List product",
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
              label: "Auto product Create",
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
            locationOrShopifyWarehouseSetting: {
              label: "Location or Shopify Warehouse setting",
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
          autoProductSync: {
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
            },
          },
          autoEndProduct: {
            label: "Auto End product",
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
          autoListProduct: {
            label: "Auto List product",
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
            label: "Auto product Create",
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
          locationOrShopifyWarehouseSetting: {
            label: "Location or Shopify Warehouse setting",
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
        };
        ebayAccountsObj[
          `${getCountryName(account["warehouses"][0]["site_id"])}-${account["warehouses"][0]["user_id"]
          }`
        ] = temp;
      });
      setconnectedAccountsObject(ebayAccountsObj);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  const getSavedData = async () => {
    let { data, success } = await configurationAPI(getAppSettingsURL);
    if (success) {
      if (data?.marketplace?.shopify?.shop) {
        let temp = { ...optionsVar };
        Object.keys(data.marketplace.shopify.shop).forEach(id => {
          for (const key in temp) {
            temp[key]["enable"] =
              data.marketplace.shopify.shop[id]['data']['product_settings']['shopify_to_ebay'][key]["enable"];
            if (key === "autoProductSync") {
              for (const attributeKey in temp[key]["attribute"]) {
                temp[key]["attribute"][attributeKey]["value"] =
                  data.marketplace.shopify.shop[id]['data']['product_settings']['shopify_to_ebay'][key]["attribute"][attributeKey];
              }
            }
          }
        })
        setOptionsVar(temp);
      }
      if (data?.marketplace?.ebay?.shop) {
        let temp = { ...connectedAccountsObject }
        if (Object.keys(temp).length - 1 === Object.keys(data?.marketplace?.ebay?.shop).length) {
          console.log(data?.marketplace?.ebay?.shop);
        }
        // Object.keys(data.marketplace.ebay.shop).forEach(id => {
        //   console.log(id, data.marketplace.ebay.shop[id]);
        // })
      }
    }
  };

  const checkFunc = () => {
    let temp = { ...connectedAccountsObject };
    let flag = false;
    let demo = Object.keys(temp).filter(
      (account) => account !== "Global" && temp[account]["checked"]
    );
    if (demo.length === Object.keys(temp).length - 1) {
      flag = true;
    }
    return flag;
  };

  useEffect(() => {
    if (checkFunc()) {
      let temp = { ...connectedAccountsObject };
      temp["Global"]["checked"] = true;
      setconnectedAccountsObject(temp);
    }
  }, [checkFunc()]);

  useEffect(() => {
    if (Object.keys(connectedAccountsObject).length) getSavedData();
  }, [Object.keys(connectedAccountsObject).length]);

  const saveDataAppToEbay = async () => {
    console.log(connectedAccountsObject);
    let tempObj = {
      app_to_ebay: {
      },
      setting_type: 'product_settings'
    };
    if (connectedAccountsObject['Global']['checked']) {
      tempObj['app_to_ebay'] = {
        Global: {
          product_settings: {

          }
        }
      }
      Object.keys(connectedAccountsObject['Global']['fields']).forEach(field => {
        tempObj['app_to_ebay']['Global']['product_settings'][field] = {}
        for (const key in connectedAccountsObject['Global']['fields'][field]) {
          if (key === 'enable') {
            tempObj['app_to_ebay']['Global']['product_settings'][field][key] = connectedAccountsObject['Global']['fields'][field][key]
          } else if (key === 'attribute') {
            tempObj['app_to_ebay']['Global']['product_settings'][field][key] = {}
            for (const attribute1 in connectedAccountsObject['Global']['fields'][field][key]) {
              tempObj['app_to_ebay']['Global']['product_settings'][field][key][attribute1] = connectedAccountsObject['Global']['fields'][field][key][attribute1]['value']
            }
          }
        }
      })
    } else {
      for (const account in connectedAccountsObject) {
        if (account !== 'Global' && connectedAccountsObject[account]['checked']) {
          tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]] = {
            product_settings: {}
          }
          Object.keys(connectedAccountsObject[account]['fields']).forEach(field => {
            tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]]['product_settings'][field] = {}
            for (const key in connectedAccountsObject[account]['fields'][field]) {
              if (key === 'enable') {
                tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]]['product_settings'][field][key] = connectedAccountsObject[account]['fields'][field][key]
              } else if (key === 'attribute') {
                tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]]['product_settings'][field][key] = {}
                for (const attribute1 in connectedAccountsObject[account]['fields'][field][key]) {
                  tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]]['product_settings'][field][key][attribute1] = connectedAccountsObject[account]['fields'][field][key][attribute1]['value']
                }
              }
            }
          })
        }
      }
    }
    // console.log(tempObj);
    let { success, message } = await configurationAPI(saveAppSettingsShopifyToAppURL, tempObj);
    if (success) {
      notify.success(message)
    }
  }

  return (
    <>
      <ShopifyToApp optionsVar={optionsVar} setOptionsVar={setOptionsVar} />
      <br />
      <Card sectioned>
        <Stack alignment="baseline">
          <CheckboxComponent
            connectedAccountsObject={connectedAccountsObject}
            setconnectedAccountsObject={setconnectedAccountsObject}
          />
          <Button primary onClick={() => { saveDataAppToEbay() }}>
            Save
          </Button>
        </Stack>
        {connectedAccountsObject.Global?.checked && (
          <Card.Section title={`From App to eBay Global`}>
            <AppToEbay
              connectedAccountsObject={connectedAccountsObject}
              setconnectedAccountsObject={setconnectedAccountsObject}
              account={"Global"}
            />
          </Card.Section>
        )}
        {!connectedAccountsObject.Global?.checked &&
          Object.keys(connectedAccountsObject).map((account) => {
            return (
              connectedAccountsObject[account]["checked"] && (
                <Card.Section title={`From App to eBay ${account}`}>
                  <AppToEbay
                    connectedAccountsObject={connectedAccountsObject}
                    setconnectedAccountsObject={setconnectedAccountsObject}
                    account={account}
                  />
                </Card.Section>
              )
            );
          })}
      </Card>
    </>
  );
};

export default ProductSettingsDependent;

export const CheckboxComponent = ({
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  const clickHandler = (e, account) => {
    {
      let temp = { ...connectedAccountsObject };
      temp[account]["checked"] = e.target.checked;
      if (account !== "Global") {
        temp["Global"]["checked"] = false;
      } else if (
        account === "Global" &&
        !connectedAccountsObject[account]["checked"]
      ) {
        for (const key in temp) {
          temp[key]["checked"] = false;
        }
      } else if (
        account === "Global" &&
        connectedAccountsObject["Global"]["checked"]
      ) {
        for (const key in temp) {
          temp[key]["checked"] = true;
        }
      }
      if (!connectedAccountsObject[account]["checked"]) {
        Object.keys(temp[account]["fields"]).forEach((attribute) => {
          temp[account]["fields"][attribute]["enable"] = "no";
          if (connectedAccountsObject[account]['fields']["autoProductSync"]["enable"] === "no") {
            Object.keys(temp[account]['fields']["autoProductSync"]["attribute"]).forEach((attribute1) => {
              temp[account]['fields']["autoProductSync"]["attribute"][attribute1]["value"] = "no";
            });
          }
        });
      }
      setconnectedAccountsObject(temp);
    }
  };
  return (
    <Stack>
      <>Account Selection-:</>
      {connectedAccountsObject &&
        Object.keys(connectedAccountsObject).map((account, index) => {
          return (
            <Checkbox
              checked={connectedAccountsObject[account]["checked"]}
              onChange={(e) => clickHandler(e, account)}
            >
              {account}
            </Checkbox>
          );
        })}
    </Stack>
  );
};
