import { Button, Col, Image, PageHeader, Row, Select, Tabs } from "antd";
import React, { useState, useEffect } from "react";
import {
  getConnectedAccounts,
  viewUserDetailsEbay,
} from "../../../Apirequest/accountsApi";
import { environment } from "../../../environment/environment";
import { json } from "../../../globalConstant/static-json";
import { globalState } from "../../../services/globalstate";
import ModalComponent from "../../AntDesignComponents/ModalComponent";
import TabsComponent from "../../AntDesignComponents/TabsComponent";
import AccountConnection from "./AccountTabsComponent/AccountConnection";
import AppAccountDetailsComponent from "./AccountTabsComponent/AppAccountDetailsComponent";
import EbayMessagesComponent from "./AccountTabsComponent/EbayMessagesComponent";

export const getCountryName = (site_id) => {
  let countryName = json.flag_country.filter(
    (country) => country["value"] === site_id
  );
  return countryName.length && countryName[0]["label"];
};

export const getFlagImage = (accountName) => {
  let flag = json.flag_country.filter(
    (country) => country["label"] === accountName.split("-")[0]
  );
  return accountName.length && flag[0]["flag"];
};

export const getSiteID = (selectedAccount, connectedAccountsArray) => {
  let test = connectedAccountsArray.filter(
    (account) => account["value"] === selectedAccount
  );
  return {
    siteID: test.length && test[0]["siteID"],
    mode: test.length && test[0]["mode"],
    shopId: test.length && test[0]["shopId"],
  };
};
export const selectedAddAccountTypeOptions = [
  { label: "Live", value: "live" },
  { label: "Sandbox", value: "sandbox" },
];

const NewAccount = (props) => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
  const [siteID, setSiteID] = useState("");
  const [mode, setMode] = useState("");
  const [shopId, setShopId] = useState("");
  const [addAccountModalStatus, setaddAccountModalStatus] = useState(false);
  const [selectedAddAccountType, setSelectedAddAccountType] = useState(
    selectedAddAccountTypeOptions[0]["value"]
  );
  const [selectedAddAccountCountry, setSelectedAddAccountCountry] = useState({
    countryName: json.flag_country[0]["value"],
    flagURL: json.flag_country[0]["flag"],
    siteID: json.flag_country[0]["value"],
  });
  const [marketplaceAccountData, setMarketplaceAccountData] = useState(null);
  const [shopifyData, setShopifyData] = useState({});
  const [activeInactiveStatus, setActiveInactiveStatus] = useState("");

  const getMarketplaceAppData = async (dataToPost) => {
    let { success, data } = await viewUserDetailsEbay(dataToPost);
    if (success) {
      let filteredDataToPass = {};
      filteredDataToPass["UserID"] = data["UserID"];
      filteredDataToPass["Email"] = data["Email"];
      filteredDataToPass["UserIDLastChanged"] = data["UserIDLastChanged"];
      filteredDataToPass["RegistrationDate"] = data["RegistrationDate"];
      filteredDataToPass["Site"] = data["Site"];
      filteredDataToPass["StoreURL"] = data["StoreURL"];
      filteredDataToPass["PayPalAccountType"] = data["PayPalAccountType"];
      filteredDataToPass["MOTORS_DEALER"] =
        data["MOTORS_DEALER"] === "false" ? "No" : "";
      filteredDataToPass["BusinessRole"] = data["BusinessRole"];
      filteredDataToPass["PayPalAccountLevel"] = data["PayPalAccountLevel"];
      filteredDataToPass["PayPalAccountStatus"] = data["PayPalAccountStatus"];
      filteredDataToPass["VATStatus"] = data["VATStatus"];
      filteredDataToPass["UNIQUE_NEGATIVE_FEEDBACK_COUNT"] = data[
        "UNIQUE_NEGATIVE_FEEDBACK_COUNT"
      ]
        ? data["UNIQUE_NEGATIVE_FEEDBACK_COUNT"]
        : "";
      filteredDataToPass["UniquePositiveFeedbackCount"] =
        data["UniquePositiveFeedbackCount"];
      filteredDataToPass["SellerInfo"] = data["SellerInfo"]["StoreOwner"];
      filteredDataToPass["SellerBusinessType"] =
        data["SellerInfo"]["SellerBusinessType"];
      filteredDataToPass["PaymentMethod"] = data["SellerInfo"]["PaymentMethod"];
      filteredDataToPass["Status"] = data["Status"];
      filteredDataToPass["EnterpriseSeller"] = data["EnterpriseSeller"];
      filteredDataToPass["FeedbackRatingStar"] = data["FeedbackRatingStar"];
      filteredDataToPass["IDVerified"] = data["IDVerified"];
      filteredDataToPass["NewUser"] = data["NewUser"];
      filteredDataToPass["PositiveFeedbackPercent"] =
        data["PositiveFeedbackPercent"];
      filteredDataToPass["StoreName"] = data["Store"] && data["Store"]["Name"];
      filteredDataToPass["StoreSubscriptionLevel"] =
        data["Store"] && data["Store"]["SubscriptionLevel"];

      setMarketplaceAccountData(filteredDataToPass);
    }
  };

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let shopifyAccount = connectedAccountData.filter(
        (account) => account["marketplace"] === "shopify"
      );
      let testObj = {};
      testObj["name"] =
        shopifyAccount[0] && shopifyAccount[0]["shop_details"]["name"];
      testObj["phone"] =
        shopifyAccount[0] && shopifyAccount[0]["shop_details"]["phone"];
      testObj["email"] =
        shopifyAccount[0] && shopifyAccount[0]["shop_details"]["email"];

      let tempArr = ebayAccounts.map((account, key) => {
        let accountName = {
          label: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          siteID: account["warehouses"][0]["site_id"],
          mode:
            account["warehouses"][0]["sandbox"] == 1 ? "sandbox" : "production",
          shopId: account["id"],
          marketplace: account["marketplace"],
          status: account["warehouses"][0]["status"],
        };
        return accountName;
      });

      setconnectedAccountsArray(tempArr);
      setShopifyData(testObj);
      setSelectedAccount(tempArr[0]["label"]);
      getMarketplaceAppData({
        marketplace: tempArr[0]["marketplace"],
        shop_id: tempArr[0]["shopId"],
      });
      setActiveInactiveStatus(tempArr[0]["status"]);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  useEffect(() => {
    let { siteID, mode, shopId } = getSiteID(
      selectedAccount,
      connectedAccountsArray
    );
    setSiteID(siteID);
    setMode(mode);
    setShopId(shopId);
  }, [selectedAccount]);

  useEffect(() => {
    // console.log("activeInactiveStatus", activeInactiveStatus);
    // getAllConnectedAccounts();
  }, [activeInactiveStatus]);

  return (
    <PageHeader
      className="site-page-header-responsive"
      title={"Accounts"}
      ghost={true}
      extra={[
        <Select
          style={{ width: 300 }}
          onChange={(accountValue) => {
            let filtered = connectedAccountsArray.filter(
              (account) => account["value"] === accountValue
            );
            let dataPostForMarketplaceAppDetails = {
              marketplace: filtered[0]["marketplace"],
              shop_id: filtered[0]["shopId"],
            };
            setSelectedAccount(accountValue);
            setActiveInactiveStatus(filtered[0]["status"]);
            getMarketplaceAppData(dataPostForMarketplaceAppDetails);
          }}
          value={selectedAccount}
          options={connectedAccountsArray}
          placeholder="Select to add account"
          // defaultValue={connectedAccountsArray.length && connectedAccountsArray[0]['value']}
        />,
        <Button
          key="1"
          type="primary"
          onClick={() => setaddAccountModalStatus(true)}
        >
          {connectedAccountsArray.length > 0
            ? "Add more accounts"
            : "Add Account"}
        </Button>,
      ]}
    >
      <TabsComponent
        totalTabs={3}
        tabContents={{
          "Reconnect Account": (
            <AccountConnection
              selectedAccount={selectedAccount}
              siteID={siteID}
              mode={mode}
              shopId={shopId}
              status={activeInactiveStatus}
              cbFunc={setActiveInactiveStatus}
              marketplaceAccountData={marketplaceAccountData}
            />
          ),
          "eBay Messages": <EbayMessagesComponent />,
          "App Account Details": (
            <AppAccountDetailsComponent shopifyData={shopifyData} />
          ),
        }}
      />
      <ModalComponent
        title={"Authorization Form"}
        isModalVisible={addAccountModalStatus}
        modalContent={
          <Row justify="space-around" align="middle">
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                options={selectedAddAccountTypeOptions}
                value={selectedAddAccountType}
                onChange={(accountType) =>
                  setSelectedAddAccountType(accountType)
                }
                size="large"
              />
            </Col>
            <Col span={2}>
              <Image
                width={"100%"}
                preview={false}
                src={selectedAddAccountCountry["flagURL"]}
              />
            </Col>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                size="large"
                options={json.flag_country}
                value={selectedAddAccountCountry["countryName"]}
                onChange={(country) =>
                  setSelectedAddAccountCountry({
                    countryName: country,
                    flagURL: json.flag_country.filter(
                      (e) => e["value"] === country
                    )[0]["flag"],
                    siteID: json.flag_country.filter(
                      (e) => e["value"] === country
                    )[0]["value"],
                  })
                }
              />
            </Col>
          </Row>
        }
        handleCancel={() => setaddAccountModalStatus(false)}
        handleOk={() => {
          window.open(
            `${
              environment.API_ENDPOINT
            }/connector/get/installationForm?code=ebay&site_id=${
              selectedAddAccountCountry["siteID"]
            }&mode=${selectedAddAccountType}&bearer=${globalState.getLocalStorage(
              "auth_token"
            )}`,
            "_parent"
          );
          setaddAccountModalStatus(false);
        }}
      />
    </PageHeader>
  );
};

export default NewAccount;