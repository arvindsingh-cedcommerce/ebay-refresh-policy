import { Card, Layout, Page } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../Apirequest/accountsApi";
import AppAccountDetailsComponent from "./AccountTabsComponent/AppAccountDetailsComponent";
import ImageUpload from "./ImageUpload";

const ShopifyAccount = (props) => {
  const { shopifyAccountData } = props;
  const [shopifyData, setShopifyData] = useState({});

  // useEffect(() => {
  //   if (shopifyAccountData && Object.keys(shopifyAccountData).length) {
  //     console.log(shopifyAccountData);
  //     let testObj = {};
  //     testObj["name"] = shopifyAccountData["name"];
  //     testObj["phone"] = shopifyAccountData["phone"];
  //     testObj["email"] = shopifyAccountData["email"];
  //     testObj["currency"] = shopifyAccountData["shop_details"]["currency"];
  //     testObj["email"] = shopifyAccountData["shop_details"]["email"];
  //     testObj["plan display name"] =
  //       shopifyAccountData["shop_details"]["plan_display_name"];
  //     testObj["address1"] = shopifyAccountData["shop_details"]["address1"];
  //     setShopifyData(testObj);
  //   }
  // }, []);

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (
      accountConnectedSuccess &&
      Array.isArray(connectedAccountData) &&
      connectedAccountData.length
    ) {
      let shopifyAccountData = connectedAccountData.find(
        (account) => account["marketplace"] === "shopify"
      );
      console.log(shopifyAccountData);
      //   for shopify
      let testObj = {};
      testObj["name"] = shopifyAccountData["name"];
      testObj["phone"] = shopifyAccountData["phone"];
      testObj["email"] = shopifyAccountData["email"];
      testObj["currency"] = shopifyAccountData["shop_details"]["currency"];
      testObj["email"] = shopifyAccountData["shop_details"]["email"];
      testObj["plan display name"] =
        shopifyAccountData["shop_details"]["plan_display_name"];
      testObj["address1"] = shopifyAccountData["shop_details"]["address1"];

      setShopifyData(testObj);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  return (
    <Page fullWidth={false} title="User Profile">
      <Layout>
        <Layout.Section secondary>
          <ImageUpload />
        </Layout.Section>
        <Layout.Section>
          <AppAccountDetailsComponent shopifyData={shopifyData} />
          <Card></Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopifyAccount;
