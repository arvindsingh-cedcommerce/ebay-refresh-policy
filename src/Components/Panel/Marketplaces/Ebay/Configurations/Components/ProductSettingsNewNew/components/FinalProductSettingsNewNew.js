import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../../../Apirequest/accountsApi";
import { notify } from "../../../../../../../../services/notify";
import { getCountryName } from "../../../../../../Accounts/NewAccount";
import { getParsedEbayAccounts } from "../Helper/ProductSettingsHelper";
import { countryArray, stateArray } from "../Helper/sampleData";
import AppToEbayNewNew from "./AppToEbayNewNew";
import ShopifyToAppNewNew from "./ShopifyToAppNewNew";

const FinalProductSettingsNewNew = () => {
  const [accountsReceived, setAccountsReceived] = useState(false);
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});

  const extractShopifyWarehouses = (accounts) => {
    let temp = [];
    if (accounts.length) {
      accounts[0].warehouses.forEach((warehouse) => {
        // temp.push(warehouse)
        temp.push({
          // value: warehouse.name,
          value: true,
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
      // console.log(shopifyWarehouses);
      // console.log(parsedEbayAccounts);
      setconnectedAccountsObject(parsedEbayAccounts);
      setAccountsReceived(true);
    } else {
      notify.error(message);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  return (
    <div>
      <AppToEbayNewNew
        connectedAccountsObject={connectedAccountsObject}
        setconnectedAccountsObject={setconnectedAccountsObject}
      />
      <Divider />
      <ShopifyToAppNewNew />
    </div>
  );
};

export default FinalProductSettingsNewNew;
