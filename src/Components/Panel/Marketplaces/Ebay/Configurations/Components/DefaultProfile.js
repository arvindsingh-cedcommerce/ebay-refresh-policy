import { Banner, Card, Select, Stack } from "@shopify/polaris";
import { Checkbox, Col, Layout, Row, Button } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { configurationAPI } from "../../../../../../APIrequests/ConfigurationAPI";
import { getTemplates } from "../../../../../../APIrequests/TemplatesAPI";
import { notify } from "../../../../../../services/notify";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../URLs/ConfigurationURL";
import { getTemplatesURL } from "../../../../../../URLs/TemplateURLS";
import { getCountryName } from "../../../../Accounts/NewAccount";
import PackageTypeComponent from "./Default/PackageTypeComponent";
import Policy from "./Default/Policy";
import Template from "./Default/Template";

const DefaultProfile = () => {
  // accounts
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  // templates
  const [templateOptions, setTemplateOptions] = useState({});

  useEffect(() => {
    Object.keys(connectedAccountsObject).length > 0 && hitTemplateAPI();
  }, [Object.keys(connectedAccountsObject).length > 0]);

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let ebayAccountsObj = {};
      ebayAccounts.forEach((account, key) => {
        let temp = {};
        temp["value"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["shopId"] = account["id"];
        temp["checked"] = false;
        temp["categoryTemplate"] = "";
        temp["inventoryTemplate"] = "";
        temp["titleTemplate"] = "";
        temp["priceTemplate"] = "";
        temp["paymentPolicy"] = "";
        temp["shippingPolicy"] = "";
        temp["returnPolicy"] = "";
        temp["packageType"] = "";
        ebayAccountsObj[
          `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`
        ] = temp;
      });
      setconnectedAccountsObject(ebayAccountsObj);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  const hitTemplateAPI = async () => {
    let requestData = {
      multitype: ["category", "price", "inventory", "title"],
      marketplace: "ebay",
    };
    let { success, data: fetchedTemplatesArray } = await getTemplates(
      getTemplatesURL,
      requestData
    );
    if (success) {
      let test = {};
      let categoryTemplate = [];
      let titleTemplate = [];
      let inventoryTemplate = [];
      let priceTemplate = [];
      fetchedTemplatesArray.forEach((template) => {
        switch (template["type"]) {
          case "category":
            categoryTemplate.push({
              label: template["title"],
              value: template["_id"].toString(),
              account: Object.keys(connectedAccountsObject).filter(
                (account) =>
                  connectedAccountsObject[account]["siteID"] ===
                  template["data"]["site_id"]
              )[0],
            });
            break;
          case "title":
            titleTemplate.push({
              label: template["title"],
              value: template["_id"].toString(),
            });
            break;
          case "inventory":
            inventoryTemplate.push({
              label: template["title"],
              value: template["_id"].toString(),
            });
            break;
          case "price":
            priceTemplate.push({
              label: template["title"],
              value: template["_id"].toString(),
            });
            break;
          default:
            break;
        }
      });
      test["categoryTemplate"] = categoryTemplate;
      test["titleTemplate"] = titleTemplate;
      test["inventoryTemplate"] = inventoryTemplate;
      test["priceTemplate"] = priceTemplate;
      setTemplateOptions(test);
    }
  };
  const extractData = () => {
    let filteredData = {
      "setting_type": "default_profile",
      "default_profile": {}
    };
    for (const account in connectedAccountsObject) {
      if (connectedAccountsObject[account]["checked"]) {
        filteredData['default_profile'][connectedAccountsObject[account]["shopId"]] = {};
        for (const field in connectedAccountsObject[account]) {
          switch (field) {
            case "checked":
              break;
            case "shopId":
              break;
            case "siteID":
              break;
            case "value":
              break;
            default:
              filteredData['default_profile'][connectedAccountsObject[account]["shopId"]][field] =
                connectedAccountsObject[account][field];
              break;
          }
        }
      }
    }
    return filteredData;
  };
  const saveDefaultProfile = async (filteredDataToPost) => {
    let { success, message } = await configurationAPI(
      saveAppSettingsShopifyToAppURL,
      filteredDataToPost
    );
    if (success) {
      notify.success(message);
    }
  };
  return (
    <Card sectioned>
      <Banner status="info">
        Default Profile will use at the time of product upload on eBay. Make
        sure Shipping, Return, Payment Policies and Category Template are not
        empty
      </Banner>
      <br />
      <Stack alignment="baseline" distribution="equalSpacing">
        <CheckboxComponent
          connectedAccountsObject={connectedAccountsObject}
          setconnectedAccountsObject={setconnectedAccountsObject}
        />
        <Button
          type="primary"
          onClick={() => {
            let filteredDataToPost = extractData();
            saveDefaultProfile(filteredDataToPost);
          }}
        >
          Save
        </Button>
      </Stack>
      <br />
      {Object.keys(connectedAccountsObject).map((account, index) => {
        return (
          connectedAccountsObject[account]["checked"] && (
            <Card sectioned title={account} key={account}>
              <Card.Section>
                <Policy
                  label={account}
                  value={connectedAccountsObject[account]}
                  connectedAccountsObject={connectedAccountsObject}
                  setconnectedAccountsObject={setconnectedAccountsObject}
                />
              </Card.Section>
              <Card.Section>
                <Template
                  templateOptions={templateOptions}
                  connectedAccountsObject={connectedAccountsObject}
                  account={account}
                  setconnectedAccountsObject={setconnectedAccountsObject}
                />
              </Card.Section>
              <Card.Section>
                <PackageTypeComponent
                  connectedAccountsObject={connectedAccountsObject}
                  account={account}
                  setconnectedAccountsObject={setconnectedAccountsObject}
                />
              </Card.Section>
            </Card>
          )
        );
      })}
    </Card>
  );
};

export default DefaultProfile;

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
