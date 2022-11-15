import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  PageHeader,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  getConnectedAccounts,
  updateactiveInactiveAccounts,
  viewUserDetailsEbay,
} from "../../../Apirequest/accountsApi";
import { environment } from "../../../environment/environment";
import { json } from "../../../globalConstant/static-json";
import { globalState } from "../../../services/globalstate";
import ModalComponent from "../../AntDesignComponents/ModalComponent";
import NestedTableComponent from "../../AntDesignComponents/NestedTableComponent";
import TabsComponent from "../../AntDesignComponents/TabsComponent";
import AppAccountDetailsComponent from "./AccountTabsComponent/AppAccountDetailsComponent";
import EbayMessagesComponent from "./AccountTabsComponent/EbayMessagesComponent";
import { notify } from "../../../services/notify";
import {
  Button as ShopifyButton,
  ButtonGroup,
  Card as ShopifyCard,
  Modal,
  Stack,
  Select as ShopifySelect,
  SkeletonBodyText,
  Tooltip,
  FooterHelp,
  Link,
  Badge,
} from "@shopify/polaris";
import { getDashboardData } from "../../../APIrequests/DashboardAPI";
import { dashboardAnalyticsURL, ebayDetails } from "../../../URLs/DashboardURL";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { ebayAccountGifs } from "../Marketplaces/Ebay/Help/gifHelper";
import { tokenExpireValues } from "../../../HelperVariables";
import { publicIpv4 } from "public-ip";

export const getCountryName = (site_id) => {
  let countryName = json.flag_country.filter(
    (country) => country["value"] === site_id
  );
  return countryName.length && countryName[0]["label"];
};

export const getAbbreviatedName = (site_id) => {
  let countryName = json.flag_country.filter(
    (country) => country["value"] === site_id
  );
  return countryName.length && countryName[0]["abbreviation"];
};

// export const getFlagImage = (siteID) => {
//   console.log(siteID);
//   console.log(flags);

//   // let flag = json.flag_country.filter(
//   //   (country) => country["label"] === accountName.split("-")[0]
//   // );
//   // console.log('flags', accountName.length && flag[0]["flag"]);
//   // return accountName.length && flag[0]["flag"];
//   return siteID
// };

export const getSiteID = (selectedAccount, connectedAccountsArray) => {
  let test = connectedAccountsArray.filter(
    (account) => account["label"] === selectedAccount
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

const { Text } = Typography;

const NewAccount = (props) => {
  const [gridLoader, setGridLoader] = useState(false);
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
  //   add account modal
  const [addAccountModalStatus, setaddAccountModalStatus] = useState(false);
  const [selectedAddAccountType, setSelectedAddAccountType] = useState(
    selectedAddAccountTypeOptions[0]["value"]
  );
  const [selectedAddAccountCountry, setSelectedAddAccountCountry] = useState({
    countryName: json.flag_country[0]["value"],
    flagURL: json.flag_country[0]["flag"],
    siteID: json.flag_country[0]["value"],
  });

  //   shopify data
  const [shopifyData, setShopifyData] = useState({});

  //   reconnect
  const [reconnectModalStatus, setReconnectModalStatus] = useState(false);
  const [mode, setMode] = useState("");
  const [siteId, setSiteId] = useState("");

  // account grid
  const [connectedAccountsGridData, setConnectedAccountsGridData] = useState(
    []
  );

  // add account restrict
  const [addAccountRestrictionFlag, setAddAccountRestrictionFlag] =
    useState(false);

  const [addAccountLoader, setAddAccountLoader] = useState(false);
  const [reconnectAccountLoader, setReconnectAccountLoader] = useState(false);

  const [getDetailsBtnLoader, setGetDetailsBtnLoader] = useState(false);
  // modal video
  const [isOpenModalVideo, setIsOpenModalVideo] = useState(false);
  // gif modal
  const [isOpenGifModal, setIsOpenGifModal] = useState({
    active: false,
    title: "",
    url: "",
  });

  const hitAPIFunc = async (record) => {
    let { success, message } = await updateactiveInactiveAccounts({
      marketplace: "ebay",
      state: record["accountStatus"] === "active" ? "inactive" : "active",
      shop_id: record["shopId"],
    });
    if (success) {
      notify.success(message);
    }
  };

  const updateShopStatusFunc = (record) => {
    setConnectedAccountsGridData((pre) => {
      return pre.map((each) => {
        if (each["key"] === record["key"]) {
          if (record["accountStatus"] === "active") {
            hitAPIFunc(record);
            return { ...each, accountStatus: "inactive" };
          } else {
            hitAPIFunc(record);
            return { ...each, accountStatus: "active" };
          }
        } else {
          return { ...each };
        }
      });
    });
  };

  const [gridColumns, setGridColumns] = useState([
    // {
    //   title: "Icon",
    //   dataIndex: "accountImage",
    //   key: "accountImage",
    //   width: 200,
    // },
    {
      title: "Country",
      dataIndex: "countryName",
      key: "countryName",
    },
    {
      title: "User Name",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 400,
      render: (text, record) => {
        return (
          <Space size="middle">
            <ShopifyButton
              onClick={() => {
                let { mode, siteId, shopId } = record;
                setSiteId(siteId);
                setMode(mode);
                setReconnectModalStatus(true);
              }}
            >
              Reconnect
            </ShopifyButton>
            <ButtonGroup segmented>
              <ShopifyButton
                pressed={record["accountStatus"] === "active"}
                primary={record["accountStatus"] === "active"}
                onClick={(e) => {
                  updateShopStatusFunc(record);
                }}
              >
                Active
              </ShopifyButton>
              <ShopifyButton
                pressed={record["accountStatus"] === "inactive"}
                primary={record["accountStatus"] === "inactive"}
                onClick={(e) => {
                  updateShopStatusFunc(record);
                }}
              >
                Inactive
              </ShopifyButton>
            </ButtonGroup>
            {/* <Radio.Group
              defaultValue="a"
              buttonStyle="solid"
              onChange={(e) => {
                updateShopStatusFunc(record);
              }}
              value={record["accountStatus"]}
            >
              <Radio.Button value="active">Active</Radio.Button>
              <Radio.Button value="inactive">Inactive</Radio.Button>
            </Radio.Group> */}
          </Space>
        );
      },
    },
  ]);

  // ip
  const [ip, setIp] = useState("");

  const getAPI = async () => {
    let recievedIP = await publicIpv4();
    setIp(recievedIP);
  };

  const getAllConnectedAccounts = async () => {
    setGridLoader(true);
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
      code,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let shopifyAccount = connectedAccountData.filter(
        (account) => account["marketplace"] === "shopify"
      );
      //   for shopify
      let testObj = {};
      testObj["name"] =
        shopifyAccount[0] && shopifyAccount[0]["shop_details"]["name"];
      testObj["phone"] =
        shopifyAccount[0] && shopifyAccount[0]["shop_details"]["phone"];
      testObj["email"] =
        shopifyAccount[0] && shopifyAccount[0]["shop_details"]["email"];

      // for ebay
      let tempAccountGridData = [];
      tempAccountGridData = ebayAccounts.map((account, index) => {
        let tempObject = {};
        tempObject["key"] = index;
        // tempObject["accountName"] = `${getCountryName(
        //   account["warehouses"][0]["site_id"]
        // )}-${account["warehouses"][0]["user_id"]}`;
        tempObject["accountName"] = account["warehouses"][0]["user_id"];
        tempObject["countryName"] = (
          <Row align="middle" gutter={{ xs: 8, sm: 16 }}>
            <Col>
              <Image
                preview={false}
                width={40}
                // src={`${getFlagImage(
                //   `${getCountryName(account["warehouses"][0]["site_id"])}-${
                //     account["warehouses"][0]["user_id"]
                //   }`
                // )}`}
                // src={getFlagImage(account["warehouses"][0]["site_id"])}
                src={require(`../../../assets/flags/${account["warehouses"][0]["site_id"]}.png`)}
              />
            </Col>
            <Col>{getCountryName(account["warehouses"][0]["site_id"])}</Col>
          </Row>
        );
        // tempObject["accountImage"] = (
        //   <Image
        //     preview={false}
        //     width={40}
        //     src={`${getFlagImage(
        //       `${getCountryName(account["warehouses"][0]["site_id"])}-${
        //         account["warehouses"][0]["user_id"]
        //       }`
        //     )}`}
        //   />
        // );
        tempObject["siteId"] = account["warehouses"][0]["site_id"];
        tempObject["shopId"] = account["id"];
        tempObject["mode"] =
          account["warehouses"][0]["sandbox"] == 1 ? "sandbox" : "production";
        tempObject["accountStatus"] = account["warehouses"][0]["status"];
        tempObject["marketplace"] = account["marketplace"];
        return tempObject;
      });
      setConnectedAccountsGridData(tempAccountGridData);
      setShopifyData(testObj);
    } else {
      notify.error(message);
      if (tokenExpireValues.includes(code)) redirect("/auth/login");
    }
    setGridLoader(false);
  };

  const redirect = (url) => {
    props.history.push(url);
  };

  const hitDashboard = async () => {
    let { success, data } = await getDashboardData(dashboardAnalyticsURL);
    if (success) {
      if (
        data?.planDetails?.accountConnectivity?.prepaid?.service_credits <=
        connectedAccountsGridData.length
      ) {
        setAddAccountRestrictionFlag(true);
      }
    }
  };

  useEffect(() => {
    document.title = "Accounts | Integration for eBay";
    document.description = "Accounts";
    getAllConnectedAccounts();
    getAPI();
  }, []);

  // useEffect(() => {
  //   if (connectedAccountsGridData.length) {
  //     hitDashboard();
  //   }
  // }, [connectedAccountsGridData]);

  return (
    <PageHeader
      className="site-page-header-responsive"
      title={"eBay Accounts"}
      ghost={true}
      subTitle={
        <div
          onClick={() => setIsOpenModalVideo(true)}
          style={{ cursor: "pointer" }}
        >
          <Badge status="info">Need Help?</Badge>
        </div>
      }
      extra={[
        <ShopifyButton
          key="1"
          primary
          onClick={() => setaddAccountModalStatus(true)}
          // disabled={addAccountRestrictionFlag}
        >
          {connectedAccountsArray.length > 0
            ? "Add more accounts"
            : "Add Account"}
        </ShopifyButton>,
      ]}
    >
      {/* <TabsComponent
        totalTabs={3}
        tabContents={{
          Accounts: ( */}
      <ShopifyCard sectioned>
        <NestedTableComponent
          loading={gridLoader}
          size={"small"}
          pagination={false}
          columns={gridColumns}
          dataSource={connectedAccountsGridData}
          scroll={{ x: 1000 }}
          // bordered={true}
          expandable={{
            expandedRowRender: (record, index, indent, expanded) => {
              return (
                <TabsComponent
                  totalTabs={2}
                  tabContents={{
                    "eBay Account Details": (
                      <EbayAccountDetails
                        accountDetails={record}
                        getDetailsBtnLoader={getDetailsBtnLoader}
                        setGetDetailsBtnLoader={setGetDetailsBtnLoader}
                      />
                    ),
                    "eBay Messages": <EbayMessagesComponent />,
                  }}
                />
              );
            },
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <Tooltip content="Hide Details">
                  <CaretUpOutlined onClick={(e) => onExpand(record, e)} />
                </Tooltip>
              ) : (
                <Tooltip content="View Details">
                  <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                </Tooltip>
              ),
          }}
        />
      </ShopifyCard>
      {/* //     ),
      //     "App Account Details": (
      //       <AppAccountDetailsComponent shopifyData={shopifyData} />
      //     ),
      //   }}
      // /> */}
      <Modal
        open={addAccountModalStatus}
        onClose={() => setaddAccountModalStatus(false)}
        title="Authorization Form"
      >
        <Modal.Section>
          <Stack vertical spacing="extraLoose">
            <center>
              <Image
                preview={false}
                width={"40%"}
                style={{ marginBottom: "70px" }}
                src="https://ebay.sellernext.com/marketplace-logos/ebay.png"
              />
            </center>
            <Row justify="space-around" align="middle">
              <Col span={8}>
                <ShopifySelect
                  // style={{ width: "100%" }}
                  options={selectedAddAccountTypeOptions}
                  value={selectedAddAccountType}
                  onChange={(accountType) =>
                    setSelectedAddAccountType(accountType)
                  }
                  disabled={ip !== "103.97.184.106"}
                  // size="large"
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
                <ShopifySelect
                  // style={{ width: "100%" }}
                  // size="large"
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
            <Stack distribution="center" spacing="tight">
              <ShopifyButton onClick={() => setaddAccountModalStatus(false)}>
                Cancel
              </ShopifyButton>
              <ShopifyButton
                primary
                loading={addAccountLoader}
                onClick={() => {
                  setAddAccountLoader(true);
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
                }}
              >
                OK
              </ShopifyButton>
            </Stack>
          </Stack>
        </Modal.Section>
      </Modal>
      {/* <ModalComponent
        title={"Authorization Form"}
        isModalVisible={addAccountModalStatus}
        modalContent={
          <>
            <Row justify="center">
              <Col span={12}>
                <Image
                  preview={false}
                  width={"100%"}
                  src="https://ebay.sellernext.com/marketplace-logos/ebay.png"
                />
              </Col>
            </Row>
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
          </>
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
      /> */}
      <Modal
        open={reconnectModalStatus}
        onClose={() => setReconnectModalStatus(false)}
        title="Permission Required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>Do you want to reconnect the eBay account?</p>
            <Stack distribution="center" spacing="tight">
              <ShopifyButton onClick={() => setReconnectModalStatus(false)}>
                Cancel
              </ShopifyButton>
              <ShopifyButton
                primary
                loading={reconnectAccountLoader}
                onClick={() => {
                  setReconnectAccountLoader(true);
                  window.open(
                    `${
                      environment.API_ENDPOINT
                    }connector/get/installationForm?code=ebay&site_id=${siteId}&mode=${mode}&bearer=${globalState.getLocalStorage(
                      "auth_token"
                    )}`,
                    "_parent"
                  );
                }}
              >
                OK
              </ShopifyButton>
            </Stack>
          </Stack>
        </Modal.Section>
      </Modal>
      {/* <ModalComponent
        title={"Permission Required"}
        isModalVisible={reconnectModalStatus}
        modalContent={"Do you want to reconnect the eBay account"}
        handleOk={() => {
          window.open(
            `${
              environment.API_ENDPOINT
            }connector/get/installationForm?code=ebay&site_id=${siteId}&mode=${mode}&bearer=${globalState.getLocalStorage(
              "auth_token"
            )}`,
            "_parent"
          );
        }}
        handleCancel={() => setReconnectModalStatus(false)}
      /> */}
      <Modal
        open={isOpenModalVideo}
        onClose={() => setIsOpenModalVideo(false)}
        title="How Can I Help?"
      >
        <Modal.Section>
          {ebayAccountGifs.map((gif, index) => {
            return (
              <>
                <Stack distribution="equalSpacing">
                  <>{gif.title}</>
                  <ShopifyButton
                    plain
                    onClick={() => {
                      setIsOpenModalVideo(false);
                      setIsOpenGifModal({
                        active: true,
                        title: gif.title,
                        url: gif.url,
                      });
                    }}
                  >
                    Watch
                  </ShopifyButton>
                </Stack>
                {index == ebayAccountGifs.length - 1 ? <></> : <Divider />}
              </>
            );
          })}
          <Divider />
          <center>
            <ShopifyButton primary onClick={() => setIsOpenModalVideo(false)}>
              Close
            </ShopifyButton>
          </center>
        </Modal.Section>
      </Modal>
      <Modal
        open={isOpenGifModal.active}
        onClose={() =>
          setIsOpenGifModal({
            active: false,
            title: "",
          })
        }
        title={isOpenGifModal.title}
      >
        <Modal.Section>
          <img src={isOpenGifModal.url} style={{ width: "100%" }} />
          <Divider />
          <center>
            <ShopifyButton
              primary
              onClick={() =>
                setIsOpenGifModal({
                  active: false,
                  title: "",
                })
              }
            >
              Close
            </ShopifyButton>
          </center>
        </Modal.Section>
      </Modal>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=managing-ebay-accounts-on-app"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=ebay-accounts-4"
        >
          eBay Accounts
        </Link>
      </FooterHelp>
    </PageHeader>
  );
};

export default NewAccount;

export const EbayAccountDetails = ({
  accountDetails,
  setGetDetailsBtnLoader,
  getDetailsBtnLoader,
}) => {
  const [marketplaceAccountData, setMarketplaceAccountData] = useState({});
  const [showMoreDetailsStatus, setShowMoreDetailsStatus] = useState(false);

  // skeletonFlag
  const [showSkeleton, setShowSkeleton] = useState(true);

  const getUserDetails = async (refresh) => {
    let dataToPost = {
      // marketplace: accountDetails["marketplace"],
      shop_id: accountDetails["shopId"],
    };
    if (refresh === "refresh") {
      dataToPost["refresh"] = true;
    }
    let { success, data, message } = await viewUserDetailsEbay(dataToPost);
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
      notify.success(message);
    } else {
      notify.error(message);
    }
    setShowSkeleton(false);
  };

  const fetchRows = (field, marketplaceAccountData) => {
    return (
      <Row justify="space-between" align="middle">
        <Col span={12}>
          <Text strong>{field}</Text>
        </Col>
        <Col span={12}>
          {marketplaceAccountData[field]
            ? marketplaceAccountData[field]
            : "Not available"}
        </Col>
      </Row>
    );
  };

  const showMoreDetailsSection = () => {
    let stopIndex = 12;
    let filteredData = Object.keys(marketplaceAccountData).map((field, index) =>
      !showMoreDetailsStatus
        ? index < stopIndex && fetchRows(field, marketplaceAccountData)
        : fetchRows(field, marketplaceAccountData)
    );
    return filteredData;
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <Card
      bordered={false}
      extra={
        <ShopifyButton
          primary
          loading={getDetailsBtnLoader}
          onClick={() => {
            getUserDetails("refresh");
            // setGetDetailsBtnLoader(true);
            // let { success, data, message } = await getDashboardData(
            //   ebayDetails,
            //   {
            //     shop_id: accountDetails["shopId"],
            //     refresh: true,
            //   }
            // );
            // if (success) {
            //   notify.success(message);
            // } else {
            //   notify.error(message);
            // }
            // setGetDetailsBtnLoader(false);
          }}
        >
          Refresh Details
        </ShopifyButton>
      }
    >
      {showSkeleton ? (
        <SkeletonBodyText lines={4} />
      ) : (
        marketplaceAccountData && showMoreDetailsSection()
      )}
      <br />
      {Object.keys(marketplaceAccountData).length > 0 && !showSkeleton && (
        <Text
          style={{ cursor: "pointer", color: "#096dd9" }}
          onClick={() => setShowMoreDetailsStatus(!showMoreDetailsStatus)}
        >
          {!showMoreDetailsStatus ? "More" : "Less"} Details
        </Text>
      )}
    </Card>
  );
};
