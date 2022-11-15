import {
  Card,
  FooterHelp,
  Link,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
} from "@shopify/polaris";
import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../../../Apirequest/accountsApi";
import { configurationAPI } from "../../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../../services/notify";
import { getAppSettingsURL } from "../../../../../../../../URLs/ConfigurationURL";
import { getCountryName } from "../../../../../../Accounts/NewAccount";
import {
  getAppToEbaySavedData,
  getParsedEbayAccounts,
} from "../Helper/ProductSettingsHelper";
import { countryArray, stateArray } from "../Helper/sampleData";
import AppToEbayNewNew from "./AppToEbayNewNew";
import ShopifyToAppNewNew from "./ShopifyToAppNewNew";

const FinalProductSettingsNewNew = () => {
  const [flag, setflag] = useState(true);
  const [accountsReceived, setAccountsReceived] = useState(false);
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});

  const [shopifyToAppData, setShopifyToAppData] = useState({});

  const extractShopifyWarehouses = (accounts) => {
    let temp = [];
    if (accounts.length) {
      if (accounts[0].warehouses.length > 1) {
        accounts[0].warehouses.forEach((warehouse) => {
          temp.push({
            value: warehouse.name,
            label: warehouse.name,
            disabled: false,
          });
        });
      } else {
        accounts[0].warehouses.forEach((warehouse) => {
          temp.push({
            value: warehouse.name,
            label: warehouse.name,
            disabled: true,
          });
        });
      }
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
      let ebayAccounts = connectedAccountData
        .filter((account) => account["marketplace"] === "ebay")
        .map((account) => {
          let parsedAccountData = {};
          let { site_id, status, user_id } = account["warehouses"][0];
          parsedAccountData["value"] = `${getCountryName(site_id)}-${user_id}`;
          parsedAccountData["siteId"] = site_id;
          parsedAccountData["status"] = status;
          parsedAccountData["shopId"] = account["id"];
          parsedAccountData["checked"] = false;
          return parsedAccountData;
        });
      let shopifyAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "shopify"
      );
      let shopifyWarehouses = extractShopifyWarehouses(shopifyAccounts);
      let parsedEbayAccounts = getParsedEbayAccounts(
        ebayAccounts,
        shopifyWarehouses
      );
      setconnectedAccountsObject(parsedEbayAccounts);
      setAccountsReceived(true);
    } else {
      notify.error(message);
    }
  };

  const parsedData = (data) => {
    let tempObj = {};
    for (const key in data) {
      if (key === "autoDeleteProduct") {
        tempObj["autoProductDelete"] = data[key];
      } else tempObj[key] = data[key];
    }
    setShopifyToAppData(tempObj);
  };

  const getSavedData = async () => {
    let { data, success, message } = await configurationAPI(getAppSettingsURL);
    if (success) {
      setflag(false);
      if (data?.data?.product_settings?.shopify_to_app) {
        parsedData(data?.data?.product_settings?.shopify_to_app);
        // setShopifyToAppData(data?.data?.product_settings?.shopify_to_app);
      }
      if (data?.marketplace?.ebay?.shop) {
        getAppToEbaySavedData(
          data?.marketplace?.ebay?.shop,
          connectedAccountsObject,
          setconnectedAccountsObject
        );
      }
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
    <div>
      <AppToEbayNewNew
        connectedAccountsObject={connectedAccountsObject}
        setconnectedAccountsObject={setconnectedAccountsObject}
      />
      <Divider />
      <ShopifyToAppNewNew shopifyToAppData={shopifyToAppData} />
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=product-configuration-section"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=product-import-configuration-section-2"
        >
          Product Settings
        </Link>
      </FooterHelp>
    </div>
  );
};

export default FinalProductSettingsNewNew;
