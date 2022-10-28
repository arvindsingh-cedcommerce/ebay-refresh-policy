import { PageHeader, Select, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import {
  Banner,
  Button,
  Card,
  Modal,
  Select as PolarisSelect,
  Stack,
  Tabs,
} from "@shopify/polaris";
import { withRouter } from "react-router-dom";
import ShippingPolicyGrid from "./PolicyGridComponents/ShippingPolicyGrid";
import PaymentPolicyGrid from "./PolicyGridComponents/PaymentPolicyGrid";
import ReturnPolicyGrid from "./PolicyGridComponents/ReturnPolicyGrid";
import { addPolicyOptions } from "../Template/Helper/TemplateHelper";
import { getCountyrName } from "../Template/Components/TemplateGridComponent";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import { getCountryName } from "../../../Accounts/NewAccount";
import { notify } from "../../../../../services/notify";
import { SyncOutlined } from "@ant-design/icons";
import {
  getPolicies,
  getRefreshPolicies,
} from "../../../../../APIrequests/PoliciesAPI";
import {
  getPoliciesURL,
  refreshPoliciesURL,
} from "../../../../../URLs/PoliciesURL";
import { json } from "../../../../../globalConstant/static-json";

const { Option } = Select;
const { Text } = Typography;

const tabs = [
  {
    id: "Shipping",
    content: "Shipping",
    accessibilityLabel: "Shipping",
    panelID: "Shipping",
  },
  {
    id: "Payment",
    content: "Payment",
    panelID: "Payment",
  },
  {
    id: "Return",
    content: "Return",
    panelID: "Return",
  },
];
export const getDomainName = (siteId) => {
  let countryName = json.flag_country.filter((sites) => sites.value === siteId);
  if (countryName.length) {
    return countryName[0]?.domainName;
  }
  return "-";
};

const FinalPolicyGrid = (props) => {
  const [tabsData, setTabsData] = useState(tabs);
  const [shippingPolicyCount, setShippingPolicyCount] = useState(null);
  const [paymentPolicyCount, setPaymentPolicyCount] = useState(null);
  const [returnPolicyCount, setReturnPolicyCount] = useState(null);
  const [selectedTabId, setSelectedTabId] = useState(0);
  const [addTemplateValue, setAddTemplateValue] = useState(null);
  const [accountSelectionModal, setaccountSelectionModal] = useState({
    active: false,
    siteID: "",
    accountName: "",
    options: [],
    shopID: "",
    selectedPolicyValue: "",
  });
  const [
    refreshPoliciesAccountSelectionModal,
    setRefreshPoliciesAccountSelectionModal,
  ] = useState({
    active: false,
    siteID: "",
    accountName: "",
    options: [],
    shopID: "",
  });
  const [refreshPolicyLoader, setRefreshPolicyLoader] = useState(false);
  const [refreshPolicyBtnClicked, setRefreshPolicyBtnClicked] = useState(false);

  // ebay accounts
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);

  // refresh performed
  const [refreshSuccessStatus, setRefreshSuccessStatus] = useState(false);

  useEffect(() => {
    if (shippingPolicyCount !== null) {
      let temp = [...tabsData];
      temp[0]["content"] = `Shipping (${shippingPolicyCount})`;
      setTabsData(temp);
    }
  }, [shippingPolicyCount]);

  useEffect(() => {
    if (paymentPolicyCount !== null) {
      let temp = [...tabsData];
      temp[1]["content"] = `Payment (${paymentPolicyCount})`;
      setTabsData(temp);
    }
  }, [paymentPolicyCount]);

  useEffect(() => {
    if (returnPolicyCount !== null) {
      let temp = [...tabsData];
      temp[2]["content"] = `Return (${returnPolicyCount})`;
      setTabsData(temp);
    }
  }, [returnPolicyCount]);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTabId(selectedTabIndex),
    []
  );
  const cbFuncShipping = () => {
    getShippingPolicyCount();
  };
  const cbFuncPayment = () => {
    getPaymentPolicyCount();
  };
  const cbFuncReturn = () => {
    getReturnPolicyCount();
  };
  const checkValueHandler=(arr,filterName)=>{
    let countryValue="";
    Object.keys(arr).filter((item,index)=>{
      let indexOfFirstOpeningBracket = item.indexOf("[");
      let indexOfFirstClosingBracket = item.indexOf("]");
      const mainItem=item.substring(
        indexOfFirstOpeningBracket + 1,
        indexOfFirstClosingBracket
      );
      if(mainItem===filterName)
      {
          countryValue= item;
          return ;
      }
    })
    return countryValue;
  }
  const getTabContent = () => {
    switch (selectedTabId) {
      case 0:
        return (
          <ShippingPolicyGrid
            refreshPolicyBtnClicked={refreshPolicyBtnClicked}
            cbFuncCategory={cbFuncShipping}
            refreshSuccessStatus={refreshSuccessStatus}
            setRefreshSuccessStatus={setRefreshSuccessStatus}
            checkValueHandler={checkValueHandler}
          />
        );
      case 1:
        return (
          <PaymentPolicyGrid
            refreshPolicyBtnClicked={refreshPolicyBtnClicked}
            cbFuncCategory={cbFuncPayment}
            refreshSuccessStatus={refreshSuccessStatus}
            setRefreshSuccessStatus={setRefreshSuccessStatus}
            checkValueHandler={checkValueHandler}
          />
        );
      case 2:
        return (
          <ReturnPolicyGrid
            refreshPolicyBtnClicked={refreshPolicyBtnClicked}
            cbFuncCategory={cbFuncReturn}
            refreshSuccessStatus={refreshSuccessStatus}
            setRefreshSuccessStatus={setRefreshSuccessStatus}
            checkValueHandler={checkValueHandler}
          />
        );
      default:
        break;
    }
  };

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    let ebayAccountsObj = [];
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      ebayAccounts.forEach((account, key) => {
        let temp = {};
        temp["value"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        // temp["label"] = account["warehouses"][0]["user_id"];
        temp["label"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["domainName"] = getDomainName(account["warehouses"][0]["site_id"]);
        temp["status"] = account["warehouses"][0]["status"];
        temp["shopID"] = account["id"];
        temp["disabled"] =
          account["warehouses"][0]["status"] === "inactive" ? true : false;
        ebayAccountsObj.push(temp);
      });
      setconnectedAccountsArray(ebayAccountsObj);
      setaccountSelectionModal({
        ...accountSelectionModal,
        options: ebayAccountsObj,
        siteID: "",
        accountName: "",
        shopID: "",
        status: "",
      });
      setRefreshPoliciesAccountSelectionModal({
        ...accountSelectionModal,
        options: ebayAccountsObj,
        // siteID: ebayAccountsObj[0]?.siteID,
        // accountName: ebayAccountsObj[0]?.value,
        // shopID: ebayAccountsObj[0]?.shopID,
      });
    } else {
      notify.error(message);
      props.history.push("/auth/login");
    }
    return ebayAccountsObj;
  };

  const getShippingPolicyCount = async () => {
    let requestData = {
      count: 10,
      activePage: 1,
      "filter[type][1]": "shipping",
    };
    let {
      success,
      data: fetchedPoliciesArray,
      message,
      count,
    } = await getPolicies(getPoliciesURL, { ...requestData });
    if (success) {
      setShippingPolicyCount(count?.[0]?.count ? count?.[0]?.count : 0);
    }
  };

  const getPaymentPolicyCount = async () => {
    let requestData = {
      count: 10,
      activePage: 1,
      "filter[type][1]": "payment",
    };
    let {
      success,
      data: fetchedPoliciesArray,
      message,
      count,
    } = await getPolicies(getPoliciesURL, { ...requestData });
    if (success) {
      setPaymentPolicyCount(count?.[0]?.count ? count?.[0]?.count : 0);
    }
  };

  const getReturnPolicyCount = async () => {
    let requestData = {
      count: 10,
      activePage: 1,
      "filter[type][1]": "return",
    };
    let {
      success,
      data: fetchedPoliciesArray,
      message,
      count,
    } = await getPolicies(getPoliciesURL, { ...requestData });
    if (success) {
      setReturnPolicyCount(count?.[0]?.count ? count?.[0]?.count : 0);
    }
  };
  useEffect(() => {
    getAllConnectedAccounts();
    getShippingPolicyCount();
    getPaymentPolicyCount();
    getReturnPolicyCount();
  }, []);

  const getAllPoliciesRefresh = async (refresh = false) => {
    setRefreshPolicyLoader(true);
    let requestData = {
      multitype: ["shipping", "payment", "return"],
      shop_id: Number(refreshPoliciesAccountSelectionModal.shopID),
      site_id: refreshPoliciesAccountSelectionModal.siteID,
    };
    if (refresh) {
      requestData["refresh"] = refresh;
    }
    let {
      success,
      data: fetchedPoliciesArray,
      message,
    } = await getRefreshPolicies(refreshPoliciesURL, { ...requestData });
    if (success) {
      setRefreshSuccessStatus(true);
      notify.success(message);
      setRefreshPoliciesAccountSelectionModal({
        ...refreshPoliciesAccountSelectionModal,
        active: false,
      });
    } else {
      notify.error(message);
    }
    setRefreshPolicyLoader(false);
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Business Policy"
      ghost={true}
      extra={[
        <Button
          icon={<SyncOutlined />}
          onClick={() => {
            setRefreshPoliciesAccountSelectionModal({
              ...refreshPoliciesAccountSelectionModal,
              active: true,
            });
          }}
        >
          Refresh Policies
        </Button>,
        <>
        {window.innerWidth>=350?
        <Select
          key="addPolicies"
          value={addTemplateValue}
          placeholder={<Text strong>Create Policy</Text>}
          onChange={(selectedPolicyValue) => {
            if (connectedAccountsArray.length === 1) {
              const { domainName } = connectedAccountsArray[0];
              const url = `https://www.bizpolicy.ebay${domainName}/businesspolicy/${selectedPolicyValue}`;
              window.open(url, "_blank");
            } else {
              setaccountSelectionModal({
                ...accountSelectionModal,
                active: true,
                selectedPolicyValue: selectedPolicyValue,
              });
            }
          }}
        >
         
          {addPolicyOptions.map((option) => (
            <Option key={option["value"]} value={option["value"]}>
              {option["label"]}
            </Option>
          ))}
        </Select>
        :<>
        </>}
        </>,
      ]}
    >
        {window.innerWidth<350?
        <Select
          key="addPolicies"
          style={{marginBottom:"0.7rem"}}
          value={addTemplateValue}
          placeholder={<Text strong>Create Policy</Text>}
          onChange={(selectedPolicyValue) => {
            if (connectedAccountsArray.length === 1) {
              const { domainName } = connectedAccountsArray[0];
              const url = `https://www.bizpolicy.ebay${domainName}/businesspolicy/${selectedPolicyValue}`;
              window.open(url, "_blank");
            } else {
              setaccountSelectionModal({
                ...accountSelectionModal,
                active: true,
                selectedPolicyValue: selectedPolicyValue,
              });
            }
          }}
        >
         
          {addPolicyOptions.map((option) => (
            <Option key={option["value"]} value={option["value"]}>
              {option["label"]}
            </Option>
          ))}
        </Select>
        :<>
        </>}
      <Card>
        <Tabs
          tabs={tabsData}
          selected={selectedTabId}
          onSelect={handleTabChange}
        >
          {getTabContent()}
        </Tabs>
      </Card>
      <Modal
        open={refreshPoliciesAccountSelectionModal.active}
        onClose={() =>
          setRefreshPoliciesAccountSelectionModal({
            ...refreshPoliciesAccountSelectionModal,
            active: false,
          })
        }
        title="Select account for refresh policy"
        // primaryAction={{
        //   content: "Refresh",
        //   onAction: () => getAllPoliciesRefresh(),
        //   loading: refreshPolicyLoader,
        //   disabled: !refreshPoliciesAccountSelectionModal.accountName,
        // }}
      >
        <Modal.Section>
          <Banner status="info">
            Please refresh policies on app after creating it on eBay.
          </Banner>
          <br />
          <Stack distribution="center" alignment="center">
            <>
              {getCountyrName(refreshPoliciesAccountSelectionModal.siteID) !==
                "-" &&
                getCountyrName(refreshPoliciesAccountSelectionModal.siteID)}
            </>
            <div style={{ width: "250px" }}>
              <PolarisSelect
                options={refreshPoliciesAccountSelectionModal.options}
                value={refreshPoliciesAccountSelectionModal.accountName}
                placeholder="Please Select..."
                onChange={(e) => {
                  let temp =
                    refreshPoliciesAccountSelectionModal.options.filter(
                      (account) => account["value"] === e
                    );
                  setRefreshPoliciesAccountSelectionModal({
                    ...refreshPoliciesAccountSelectionModal,
                    accountName: temp[0]?.value,
                    siteID: temp[0]?.siteID,
                    shopID: temp[0]?.shopID,
                  });
                }}
              />
            </div>
          </Stack>
          <br />
          <Stack distribution="center">
            <Button
              primary
              disabled={!refreshPoliciesAccountSelectionModal.accountName}
              onClick={() => {
                getAllPoliciesRefresh();
              }}
              loading={refreshPolicyLoader}
            >
              Refresh Policy
            </Button>
          </Stack>
        </Modal.Section>
      </Modal>
      <Modal
        open={accountSelectionModal.active}
        onClose={() =>
          setaccountSelectionModal({ ...accountSelectionModal, active: false })
        }
        title="Create policy on eBay"
        // primaryAction={{
        //   content: "Add",
        //   disabled:
        //     !accountSelectionModal.siteID && !accountSelectionModal.shopID,
        //   url: `https://www.bizpolicy.ebay${accountSelectionModal.domainName}/businesspolicy/${accountSelectionModal.selectedPolicyValue}`,
        //   external: true,
        // }}
      >
        <Modal.Section>
          <Banner status="info">
            {/* Please refresh policies on app after creating it on eBay. */}
            Select account to create policy on eBay
          </Banner>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: "10px" }}>
              {getCountyrName(accountSelectionModal.siteID) !== "-" &&
                getCountyrName(accountSelectionModal.siteID)}
            </div>
            <div style={{ minWidth: "50%" }}>
              <PolarisSelect
                options={accountSelectionModal.options}
                value={accountSelectionModal.accountName}
                placeholder="Please Select..."
                onChange={(e) => {
                  let temp = accountSelectionModal.options.filter(
                    (account) => account["value"] === e
                  );
                  setaccountSelectionModal({
                    ...accountSelectionModal,
                    accountName: temp[0]?.value,
                    siteID: temp[0]?.siteID,
                    shopID: temp[0]?.shopID,
                    domainName: temp[0]?.domainName,
                  });
                }}
              />
            </div>
          </div>
          <br />
          <Stack distribution="center">
            <Button
              primary
              disabled={
                !accountSelectionModal.siteID && !accountSelectionModal.shopID
              }
              onClick={() => {
                setaccountSelectionModal({
                  ...accountSelectionModal,
                  active: false,
                });
                window.open(
                  `https://www.bizpolicy.ebay${accountSelectionModal.domainName}/businesspolicy/${accountSelectionModal.selectedPolicyValue}`
                );
              }}
            >
              Create Policy
            </Button>
          </Stack>
        </Modal.Section>
      </Modal>
    </PageHeader>
  );
};

export default withRouter(FinalPolicyGrid);
