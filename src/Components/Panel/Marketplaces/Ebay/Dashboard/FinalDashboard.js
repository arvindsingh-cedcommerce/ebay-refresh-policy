import {
  Col,
  Image,
  PageHeader,
  Row,
  Typography,
  Modal,
  Steps,
  Alert,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { blogData, newsData } from "./DashboardData";
import {
  getDashboardData,
  getMethod,
} from "../../../../../APIrequests/DashboardAPI";
import {
  dashboardAnalyticsURL,
  newsBlogsURL,
} from "../../../../../URLs/DashboardURL";
import { TextLoop } from "react-text-loop-next";
import {
  Select,
  Card,
  Stack,
  Tabs,
  Thumbnail,
  Link,
  ResourceList,
  TextStyle,
  Label,
  Icon,
  Banner,
  SkeletonBodyText,
  SkeletonDisplayText,
  Tooltip,
  Scrollable,
} from "@shopify/polaris";
import { Button as AntButton } from "antd";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import {
  getAbbreviatedName,
  getCountryName,
} from "../../../Accounts/NewAccountGrid";
import { getSiteID } from "../../../Accounts/NewAccount";
import { notify } from "../../../../../services/notify";
import MyResponsivePieChild from "./MyResponsiveChild";
import { withRouter } from "react-router-dom";
import MyResponsivePie2 from "./MyResponsivePie2";
import CarouselComponent from "./CarouselComponent";
import { getParsedOrderAnalyticsDataAntD } from "./OrderAnalyticsHelper";
import { getParsedRevenueAnalyticsDataAntD } from "./RevenueAnalyticsHelper";
import StackedBarAnt from "./StackedBarAnt";
import StackedLineAnt from "./StackedLineAnt";
import MyResponsivePie2TotalOrder from "./MyResponsivePie2TotalOrder";
import MyResponsiveChildOrders from "./MyResponsiveChildOrders";
import { ArrowDownMinor, ArrowUpMinor } from "@shopify/polaris-icons";
import { SyncOutlined } from "@ant-design/icons";
import { faqs } from "../Products/SampleProductData";
import { getParsedProductAnalyticsDataAntD } from "./ProductCountAnalyticsHelper";
import WhatsApp from "../../../../../assets/whatsapp.png";
import Skype from "../../../../../assets/skype.png";
import Mail from "../../../../../assets/mail.png";
import { faqAPI } from "../../../../../APIrequests/HelpAPI";

const { Title, Text } = Typography;
const { Step } = Steps;

const FinalDashboard = (props) => {
  const {
    queuedTasks,
    refresh,
    marqueeData,
    setMarqueeData,
    hitGetNotifications,
  } = props;
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
  const [activeAccounts, setActiveAccounts] = useState(0);

  const [profilesModal, setProfilesModal] = useState({
    status: false,
    title: "Create profile to list your productds on eBay",
    gif: "https://apps.cedcommerce.com/integration/static/modules/walmart/assets/images/gif/Profiling.gif",
  });

  // product analytics data
  const [productAnalyticsData, setProductAnalyticsData] = useState([]);
  const [productCountAnalyticsDataAnt, setProductCountAnalyticsDataAnt] =
    useState([]);
  const [productGraphStoreSelected, setProductGraphStoreSelected] = useState();
  const [productAnalyticsShopId, setProductAnalyticsShopId] = useState("");

  // order analytics data
  const [orderAnalyticsData, setOrderAnalyticsData] = useState([]);
  const [orderGraphStoreSelected, setOrderGraphStoreSelected] = useState();
  const [orderAnalyticsShopId, setOrderAnalyticsShopId] = useState("");

  // activities
  const [allNotifications, setAllNotifications] = useState([]);

  // colorsArray
  const [uniquesColors, setUniquesColors] = useState([]);
  const [accountClicked, setAccountClicked] = useState({});
  const [accountClickedOrders, setAccountClickedOrders] = useState({});
  const [productDataInnerUse, setProductDataInnerUse] = useState([]);
  const [accountClickedDetails, setAccountClickedDetails] = useState({});
  const [accountClickedDetailsOrders, setAccountClickedDetailsOrders] =
    useState({});

  // tabs
  const [selected, setSelected] = useState(0);

  // order
  const [
    orderAnalyticsYearlyMonthlyWeekly,
    setorderAnalyticsYearlyMonthlyWeekly,
  ] = useState("weekly");
  const [orderAnalyticsDataAllTypes, setOrderAnalyticsDataAllTypes] = useState(
    {}
  );
  const [revenueAnalyticsDataAllTypes, setRevenuAnalyticsDataAllTypes] =
    useState({});

  // ShopifyUsername
  const [shopifyUsername, setShopifyUsername] = useState("");
  const [shopifyCurrencyName, setShopifyCurrencyName] = useState("");

  // faqs
  const [faqsData, setFaqsData] = useState([]);

  // skype, whatsapp, email
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    skype: "https://join.skype.com/GbdPBTuVsNgN",
    whatsApp: "https://chat.whatsapp.com/HPbJm00yENw6QhWfskNWLa",
    email: "mailto:ebay_support@cedcommerce.com",
  });

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  // reqiuredCurrentStep
  const [reqiuredCurrentStep, setReqiuredCurrentStep] = useState(-1);
  const [orderManagementDisabledCount, setOrderManagementDisabledCount] =
    useState(0);
  const [productManagementDisabledCount, setProductManagementDisabledCount] =
    useState(0);

  // planDetails
  const [currentPlanDetails, setCurrentPlanDetails] = useState({
    "Current Plan": "Free",
    "Current Plan Price": "$ 0",
    "Plan Activated Date": "05-08-2022",
    "Next Billing Date": "05-09-2022",
    Validity: "30 days",
  });

  // blogs & news
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);

  // notprofiledproduct count
  const [notProfiledProductCount, setNotProfiledProductCount] = useState(null);

  // lifetime revenue
  const [lifetimeRevenue, setLifetimeRevenue] = useState(0);
  const [percentageDiff, setPercentageDiff] = useState(0);
  const [showPercentDiff, setShowPercentDiff] = useState(false);

  // remaining credits
  const [remainingProductCredits, setRemainingProductCredits] = useState(0);
  const [
    remainingProductCreditsFormatted,
    setRemainingProductCreditsFormatted,
  ] = useState("");
  const [remainingOrderCredits, setRemainingOrderCredits] = useState(0);
  const [remainingOrderCreditsFormatted, setRemainingOrderCreditsFormatted] =
    useState("");
  const [availableOrderCredits, setAvailableOrderCredits] = useState(10);
  const [totalOrderCredits, setTotalOrderCredits] = useState(10);

  const [availableProductCredits, setAvailableProductCredits] = useState(50);
  const [totalProductCredits, setTotalProductCredits] = useState(50);

  // number of acounts to connect
  const [accountConnectionCount, setAccountConnectionCount] = useState(2);

  const [refreshDashboardStatsBtnLoader, setRefreshDashboardStatsBtnLoader] =
    useState(false);

  // skeleton
  const [dashboardSkeleton, setDashboardSkeleton] = useState(true);

  // note
  const [note, setNote] = useState("");

  // faqloader
  const [faqLoader, setFaqLoader] = useState(false);

  const getAllFAQs = async () => {
    setFaqLoader(true);
    let { success, data } = await getMethod(faqAPI, {
      type: "FAQ",
    });
    if (success) {
      let temp = data
        .map((faq) => {
          return faq.data;
        })
        .filter((faq) => faq.showInApp === "Dashboard")
        .slice(0, 3)
        .map((faq) => {
          return {
            title: faq.title,
          };
        });
      // console.log(temp);
      setFaqsData(temp)
      // let parsedData = getParseFaqData(data);
      // setFaqData(parsedData);
    }
    setFaqLoader(false);
  };

  useEffect(() => {
    // document.title =
    //   "Sell on eBay with eBay Marketplace Integration App | CedCommerce";
    document.title =
      "Sell on eBay with eBay Marketplace Integration App | Integration for eBay";
    document.description =
      "CedCommerce introduces the eBay Marketplace Integration App enabling the Shopify merchants to sell on eBay by helping them to manage their products & orders.";
    getAllConnectedAccounts();
    getAllFAQs();
    // hitNews();
    // hitBlogs();
    // hitFAQs();
  }, []);

  useEffect(() => {
    if (productGraphStoreSelected) {
      let { siteID, shopId } = getSiteID(
        productGraphStoreSelected,
        connectedAccountsArray
      );
      setProductAnalyticsShopId(shopId);
    }
  }, [productGraphStoreSelected]);

  useEffect(() => {
    if (orderGraphStoreSelected) {
      let { siteID, shopId } = getSiteID(
        orderGraphStoreSelected,
        connectedAccountsArray
      );
      setOrderAnalyticsShopId(shopId);
    }
  }, [orderGraphStoreSelected]);

  const [templatesModal, setTemplatesModal] = useState({
    status: false,
    title: "Create profile to list your productds on eBay",
    gif: "https://apps.cedcommerce.com/integration/static/modules/walmart/assets/images/gif/Profiling.gif",
  });

  const getAllConnectedAccounts = async () => {
    const colors = [
      "#40e0d0",
      "#4169e1",
      "#6a5acd",
      "#0047ab",
      "#add8e6",
      "#89CFF0",
      "#0abab5",
      "#003366",
      "#0073cf",
      "#6495ed",
    ];
    let colorsArr = [];
    for (let i = 0; i < 10; i++) {
      const color = colors[i];
      if (colorsArr.indexOf(color) === -1) colorsArr.push(color);
    }
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      if (Array.isArray(connectedAccountData) && connectedAccountData.length) {
        let shopifyAccount = connectedAccountData.find(
          (account) => account.marketplace === "shopify"
        );
        if (shopifyAccount?.userCustomData?.userData) {
          const { skypeLink, whatsAppLink, email } =
            shopifyAccount?.userCustomData?.userData;
          if (skypeLink) {
            setSocialMediaLinks({ ...socialMediaLinks, skype: skypeLink });
          }
          if (whatsAppLink) {
            setSocialMediaLinks({
              ...socialMediaLinks,
              whatsApp: whatsAppLink,
            });
          }
          if (email) {
            setSocialMediaLinks({ ...socialMediaLinks, email: email });
          }
          // setSocialMediaLinks({
          //   skype: skypeLink,
          //   whatsApp: whatsAppLink,
          //   email: email,
          // });
        }
        if (shopifyAccount?.shop_details?.currency) {
          setShopifyCurrencyName(shopifyAccount.shop_details.currency);
        }
        setShopifyUsername(shopifyAccount.name);
        let ebayAccounts = connectedAccountData.filter(
          (account) => account["marketplace"] === "ebay"
        );

        let tempArr = ebayAccounts.map((account, key) => {
          let accountName = {
            label: (
              <Stack alignment="center" spacing="tight">
                <Image
                  preview={false}
                  width={20}
                  src={
                    account["warehouses"][0]["site_id"] &&
                    require(`../../../../../assets/flags/${account["warehouses"][0]["site_id"]}.png`)
                  }
                  style={{ borderRadius: "50%", marginTop: "5px" }}
                />
                ,
                <>{`${account["warehouses"][0]["site_id"]}-${account["warehouses"][0]["user_id"]}`}</>
              </Stack>
            ),
            value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
              account["warehouses"][0]["user_id"]
            }`,
            siteID: account["warehouses"][0]["site_id"],
            shopId: account["id"],
            color: colorsArr[key],
            isActive: account["warehouses"][0]["status"],
            abbreviatedName: `${getAbbreviatedName(
              account["warehouses"][0]["site_id"]
            )}-${account["warehouses"][0]["user_id"]}`,
            flag: (
              <Stack alignment="center" spacing="tight">
                <Image
                  preview={false}
                  width={20}
                  src={
                    account["warehouses"][0]["site_id"] &&
                    require(`../../../../../assets/flags/${account["warehouses"][0]["site_id"]}.png`)
                  }
                  style={{ borderRadius: "50%", marginTop: "5px" }}
                />
                <>{account["warehouses"][0]["user_id"]}</>
              </Stack>
            ),
          };
          return accountName;
        });
        // tempArr.unshift({ label: "All", value: "all" });
        let activeAccounts = 0;
        tempArr.forEach((account) => {
          if (account.isActive === "active") {
            activeAccounts += 1;
          }
        });
        setActiveAccounts(activeAccounts);
        setconnectedAccountsArray([...tempArr]);
        setProductGraphStoreSelected(tempArr[0]["value"]);
        setOrderGraphStoreSelected(tempArr[0]["value"]);
      } else {
        notify.warn("No Accounts Found");
      }
    } else {
      notify.error(message);
      props.history.push("/auth/login");
    }
  };

  const hitNews = async () => {
    const searchQuery = {
      type: "news",
      count: 2,
      activePage: 1,
    };
    let { success, data } = await getDashboardData(newsBlogsURL, searchQuery);
    if (success) {
      // setNews(data);
      setNews(newsData.slice(0, 3));
    }
  };
  const hitBlogs = async () => {
    const searchQuery = {
      type: "blog",
      count: 2,
      activePage: 1,
    };
    let { success, data } = await getDashboardData(newsBlogsURL, searchQuery);
    if (success) {
      // setBlogs(data);
      setBlogs(blogData.slice(0, 3));
    }
  };

  const hitFAQs = () => {
    let temp = faqs.slice(0, 3).map((faq) => {
      return {
        title: faq.ques,
      };
    });
    setFaqsData(temp);
  };

  const parsedProductAnalyticsData = (
    productAnalytics,
    connectedAccount,
    tempAccounts,
    index
  ) => {
    if (
      Object.keys(productAnalytics).find(
        (shopid) => (shopid = connectedAccount.shopId)
      )
    ) {
      let sumTotalProducts = 0;
      let uploaded = 0;
      let not_uploaded = 0;
      let ended = 0;
      let error = 0;

      let hasProducts = false;

      for (const key in productAnalytics[connectedAccount.shopId]) {
        sumTotalProducts += productAnalytics[connectedAccount.shopId][key];
        switch (key) {
          case "uploaded":
            uploaded = productAnalytics[connectedAccount.shopId][key];
            if (productAnalytics[connectedAccount.shopId][key] > 0) {
              hasProducts = true;
            }
            break;
          case "not_uploaded":
            not_uploaded = productAnalytics[connectedAccount.shopId][key];
            if (productAnalytics[connectedAccount.shopId][key] > 0) {
              hasProducts = true;
            }
            break;
          case "ended":
            ended = productAnalytics[connectedAccount.shopId][key];
            if (productAnalytics[connectedAccount.shopId][key] > 0) {
              hasProducts = true;
            }
            break;
          case "error":
            error = productAnalytics[connectedAccount.shopId][key];
            if (productAnalytics[connectedAccount.shopId][key] > 0) {
              hasProducts = true;
            }
            break;
          default:
            break;
        }
      }
      tempAccounts[index] = {
        ...connectedAccount,
        id: connectedAccount["abbreviatedName"],
        label: connectedAccount["label"],
        innerLabel: connectedAccount["value"],
        value: sumTotalProducts,
        color: "hsl(266, 70%, 50%)",
        uploaded: uploaded,
        notUploaded: not_uploaded,
        error: error,
        ended: ended,
        hasProducts: hasProducts,
        flag: connectedAccount["flag"],
      };
    }
  };
  const parsedTotalOrderAnalyticsData = (
    orderAnalytics,
    connectedAccount,
    tempAccountsOrders,
    index
  ) => {
    if (
      Object.keys(orderAnalytics).find(
        (shopid) => (shopid = connectedAccount.shopId)
      )
    ) {
      let sumTotalOrders = 0;
      let fulfilled_orders = 0;
      let unfulfilled_orders = 0;
      let cancelled_orders = 0;
      let failed_orders = 0;

      let hasOrders = false;
      for (const key in orderAnalytics[connectedAccount.shopId]) {
        sumTotalOrders += orderAnalytics[connectedAccount.shopId][key];
        switch (key) {
          case "fulfilled_orders":
            fulfilled_orders = orderAnalytics[connectedAccount.shopId][key];
            if (orderAnalytics[connectedAccount.shopId][key] > 0) {
              hasOrders = true;
            }
            break;
          case "unfulfilled_orders":
            unfulfilled_orders = orderAnalytics[connectedAccount.shopId][key];
            if (orderAnalytics[connectedAccount.shopId][key] > 0) {
              hasOrders = true;
            }
            break;
          case "cancelled_orders":
            cancelled_orders = orderAnalytics[connectedAccount.shopId][key];
            if (orderAnalytics[connectedAccount.shopId][key] > 0) {
              hasOrders = true;
            }
            break;
          case "failed_orders":
            failed_orders = orderAnalytics[connectedAccount.shopId][key];
            if (orderAnalytics[connectedAccount.shopId][key] > 0) {
              hasOrders = true;
            }
            break;
          default:
            break;
        }
      }
      tempAccountsOrders[index] = {
        ...connectedAccount,
        id: connectedAccount["abbreviatedName"],
        label: connectedAccount["label"],
        innerLabel: connectedAccount["value"],
        value: sumTotalOrders,
        color: "hsl(266, 70%, 50%)",
        fulfilledOrders: fulfilled_orders,
        unfulfilledOrders: unfulfilled_orders,
        cancelledOrders: cancelled_orders,
        failedOrders: failed_orders,
        hasOrders: hasOrders,
      };
    }
  };

  const checkRequiredStep = (requirements) => {
    if (requirements) {
      const {
        profile,
        categoryTemplate,
        policy,
        notConForOrder,
        notConForProduct,
      } = requirements;
      if (policy) {
        setReqiuredCurrentStep(0);
      }
      if (policy && categoryTemplate) {
        setReqiuredCurrentStep(1);
      }
      if (policy && categoryTemplate && profile) {
        setReqiuredCurrentStep(2);
      }
      if (
        policy &&
        categoryTemplate &&
        profile &&
        (notConForOrder > 0 || notConForProduct > 0)
      ) {
        setReqiuredCurrentStep(3);
        if (notConForOrder) {
          setOrderManagementDisabledCount(notConForOrder);
        }
        if (notConForProduct) {
          setProductManagementDisabledCount(notConForProduct);
        }
      }
    }
  };

  const truncateDecimals = (number, digits) => {
    let multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);

    return truncatedNum / multiplier;
  };
  const format = (input) => {
    var datePart = input.match(/\d+/g),
      year = datePart[0],
      month = datePart[1],
      day = datePart[2];

    return day + "-" + month + "-" + year;
  };
  useEffect(() => {
    if (note) {
      setMarqueeData([...marqueeData, { Note: note }]);
    }
  }, [note]);
  const hitDashoboardAPI = async (refresh, msg = true) => {
    setDashboardSkeleton(true);
    let postData = {};
    if (refresh) {
      postData = { refreshDashboard: true };
      msg && setRefreshDashboardStatsBtnLoader(true);
    }
    let { success, data } = await getDashboardData(
      dashboardAnalyticsURL,
      postData
    );
    if (success) {
      setDashboardSkeleton(false);
      if (refresh) {
        msg && notify.success("Dashboard data refreshed");
      }
      const {
        productAnalytics,
        orderByTimeLine,
        revenueByTimeLine,
        orderAnalytics,
        requirements,
        notProfiledProduct,
        planDetails,
        note: recievedNote,
      } = data;
      const { totalRevenue, percentageDiff: diff } = revenueByTimeLine;
      if (diff) {
        setPercentageDiff(diff);
        setShowPercentDiff(true);
      }
      if (recievedNote) {
        setNote(recievedNote);
      }
      if (planDetails) {
        const {
          activePlan,
          orderCredits,
          productCredits,
          accountConnectivity,
        } = planDetails;
        if (activePlan) {
          const { plan_details, created_at } = activePlan;
          let tempPlanDetails = { ...currentPlanDetails };
          const { title, custom_price, activated_on, validity } = plan_details;
          tempPlanDetails["Current Plan"] = title;
          tempPlanDetails["Current Plan Price"] = "$ " + custom_price;
          let currTempDate = new Date(created_at?.split(" ")[0]);
          const futureTempDate = new Date(
            currTempDate.setDate(currTempDate.getDate() + Number(validity))
          );
          tempPlanDetails["Plan Activated Date"] = format(
            created_at?.split(" ")[0]
          );
          tempPlanDetails["Next Billing Date"] = format(
            futureTempDate.toISOString().split("T")[0]
          );
          tempPlanDetails["Validity"] = validity + " days";
          setCurrentPlanDetails(tempPlanDetails);
        } else {
          // let tempPlanDetails = { ...currentPlanDetails };
          // tempPlanDetails["Current Plan"] = "Free";
          // tempPlanDetails["Current Plan Price"] = "$ 0";
          // tempPlanDetails["Plan Activated On"] = "26-07-2022";
          // tempPlanDetails["Validity"] = "30 days";
          // setCurrentPlanDetails(tempPlanDetails);
        }
        if (orderCredits) {
          const { available_credits, service_credits } = orderCredits?.prepaid;
          let remainingCredits = (available_credits * 100) / service_credits;
          let truncatedRemainingCredits = truncateDecimals(remainingCredits, 2);
          setRemainingOrderCredits(truncatedRemainingCredits);
          setAvailableOrderCredits(available_credits);
          setTotalOrderCredits(service_credits);
          setRemainingOrderCreditsFormatted(
            `${available_credits}/${service_credits}`
          );
        }
        if (productCredits) {
          const { available_credits, service_credits } =
            productCredits?.prepaid;
          let remainingCredits = (available_credits * 100) / service_credits;
          let truncatedRemainingCredits = truncateDecimals(remainingCredits, 2);
          setRemainingProductCredits(truncatedRemainingCredits);
          setAvailableProductCredits(available_credits);
          setTotalProductCredits(service_credits);
          setRemainingProductCreditsFormatted(
            `${available_credits}/${service_credits}`
          );
        }
        if (accountConnectivity?.prepaid) {
          const { service_credits } = accountConnectivity?.prepaid;
          setAccountConnectionCount(service_credits);
        }
      }
      if (totalRevenue) {
        // setLifetimeRevenue(totalRevenue);
        setLifetimeRevenue(totalRevenue.toFixed(2));
      }

      checkRequiredStep(requirements);
      let tempAccounts = [...connectedAccountsArray];
      let tempAccountsOrders = [...connectedAccountsArray];
      connectedAccountsArray.forEach((connectedAccount, index) => {
        parsedProductAnalyticsData(
          productAnalytics,
          connectedAccount,
          tempAccounts,
          index
        );
        parsedTotalOrderAnalyticsData(
          orderAnalytics,
          connectedAccount,
          tempAccountsOrders,
          index
        );
      });
      const parsedProductCountAnalytics = getParsedProductAnalyticsDataAntD(
        productAnalytics,
        connectedAccountsArray
      );
      const parsedOrderAnalyticsData = getParsedOrderAnalyticsDataAntD(
        orderByTimeLine,
        connectedAccountsArray
      );
      const parsedRevenueAnalyticsData = getParsedRevenueAnalyticsDataAntD(
        revenueByTimeLine,
        connectedAccountsArray
      );
      setProductCountAnalyticsDataAnt(parsedProductCountAnalytics);
      setOrderAnalyticsDataAllTypes(parsedOrderAnalyticsData);
      setRevenuAnalyticsDataAllTypes(parsedRevenueAnalyticsData);
      setProductAnalyticsData(tempAccounts);
      setOrderAnalyticsData(tempAccountsOrders);
      setProductDataInnerUse(productAnalytics);
      setNotProfiledProductCount(notProfiledProduct);
    }
    setRefreshDashboardStatsBtnLoader(false);
  };

  useEffect(() => {
    if (connectedAccountsArray.length) {
      get21uniqueColors();
      refresh ? hitDashoboardAPI(refresh, false) : hitDashoboardAPI();
      hitNews();
      hitBlogs();
      // hitFAQs();
    }
  }, [connectedAccountsArray]);

  const get21uniqueColors = () => {
    let arr = [];
    const colors = [
      "#92b6f0",
      "#d47da2",
      "#f5b7b5",
      "#f2caa2",
      "#eddd93",
      "#a5ed93",
      "#93edec",
      "#93a7ed",
      "#cfaae6",
      "#e6aaab",
      "#bcccd6",
      "#ced4cb",
    ];
    for (let i = 0; i < 12; i++) {
      const color = colors[i];
      if (arr.indexOf(color) === -1) arr.push(color);
    }
    setUniquesColors(arr);
  };

  const tabs = [
    {
      id: "orderCount",
      content: "Count",
      panelID: "all-customers-content-1",
    },
    {
      id: "revenue",
      content: "Revenue",
      panelID: "accepts-marketing-content-1",
    },
  ];

  const getTabContent = () => {
    switch (selected) {
      case 0:
        return (
          <div style={{ height: 250 }}>
            <StackedBarAnt
              orderAnalyticsDataAllTypes={orderAnalyticsDataAllTypes}
              orderAnalyticsYearlyMonthlyWeekly={
                orderAnalyticsYearlyMonthlyWeekly
              }
            />
          </div>
        );
      case 1:
        return (
          <div style={{ height: 250 }}>
            <StackedLineAnt
              revenueAnalyticsDataAllTypes={revenueAnalyticsDataAllTypes}
              orderAnalyticsYearlyMonthlyWeekly={
                orderAnalyticsYearlyMonthlyWeekly
              }
            />
          </div>
        );
    }
  };
  const getButton = () => {
    switch (reqiuredCurrentStep) {
      case -1:
        return "Create Business Policy";
      case 0:
        return "Create Template";
      case 1:
        return "Create Profile";
    }
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Dashboard"
      ghost={true}
      extra={[
        <AntButton
          type="text"
          icon={<SyncOutlined style={{ color: "rgb(0 0 0 / 45%)" }} />}
          onClick={() => hitDashoboardAPI(true)}
          loading={refreshDashboardStatsBtnLoader}
        >
          <Text type="secondary">Refresh Dashboard Stats</Text>
        </AntButton>,
      ]}
    >
      <Row gutter={[0, 24]}>
        {/* {queuedTasks.length > 0 && (
          <Col span={24}>
            <Banner status="warning">
             <Stack>
                < Text strong>Currently Running Activities:</Text>
                <TextLoop interval={3000}>
                  {queuedTasks[0] && <span>{queuedTasks[0]?.message}</span>}
                  {queuedTasks[1] && <span>{queuedTasks[1]?.message}</span>}
                  {queuedTasks[2] && <span>{queuedTasks[2]?.message}</span>}
                </TextLoop>
              </Stack>
            </Banner>
          </Col>
        )} */}
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col
              span={16}
              xs={24}
              sm={24}
              md={24}
              lg={16}
              className={window.innerWidth >= 768 ? "welcome-box" : "welcome-box-small"}
            >
              <Card sectioned>
                <Card.Section>
                  {dashboardSkeleton ? (
                    <SkeletonBodyText size="Large" />
                  ) : (
                    <Stack vertical spacing="tight">
                      <Title level={1} style={{ margin: 0 }}>
                        Welcome, {shopifyUsername}
                      </Title>
                    </Stack>
                  )}
                </Card.Section>
                <Card.Section>
                  {dashboardSkeleton ? (
                    <SkeletonBodyText lines={3} />
                  ) : (
                    <>
                      {reqiuredCurrentStep < 2 && (
                        <div style={{ marginBottom: "12px" }}>
                          <Text strong>
                            Before Start Listing Products on eBay you need to
                            complete following steps,
                          </Text>
                        </div>
                      )}
                      {reqiuredCurrentStep >= 2 ? (
                        <>
                          {reqiuredCurrentStep === 3 ? (
                            <Stack wrap={false} vertical>
                              <Text strong>
                                Complete{" "}
                                <Link
                                  removeUnderline
                                  onClick={() =>
                                    props.history.push("configurations")
                                  }
                                >
                                  configuration
                                </Link>{" "}
                                related with your connected eBay Account(s) in
                                app.
                              </Text>
                              {orderManagementDisabledCount && (
                                <Text strong>
                                  Order Management is disabled on{" "}
                                  {orderManagementDisabledCount} account(s). If
                                  you want to enable then check your{" "}
                                  <Link
                                    removeUnderline
                                    onClick={() =>
                                      props.history.push("configurations")
                                    }
                                  >
                                    configuration
                                  </Link>{" "}
                                </Text>
                              )}
                              {productManagementDisabledCount && (
                                <Text strong>
                                  Product Management is disabled on{" "}
                                  {productManagementDisabledCount} account(s).
                                  If you want to enable then check your{" "}
                                  <Link
                                    removeUnderline
                                    onClick={() =>
                                      props.history.push("configurations")
                                    }
                                  >
                                    configuration
                                  </Link>{" "}
                                </Text>
                              )}
                            </Stack>
                          ) : notProfiledProductCount > 0 ? (
                            <>
                              <Text strong>{notProfiledProductCount}</Text>
                              <Text>
                                {" "}
                                product(s) are not profiled on app. Please{" "}
                                <Link
                                  onClick={() => props.history.push("profiles")}
                                >
                                  create profile
                                </Link>{" "}
                                if you want to manage those products.
                              </Text>
                            </>
                          ) : (
                            <Stack
                              distribution="equalSpacing"
                              alignment="center"
                              wrap={true}
                            >
                              <Text strong>
                                App setup seems to be fine. If you still have
                                any queries please contact us now.
                              </Text>
                              <Stack>
                                <Link url={socialMediaLinks.whatsApp} external>
                                  <Image
                                    src={WhatsApp}
                                    width={50}
                                    preview={false}
                                  />
                                </Link>
                                <Link url={socialMediaLinks.skype} external>
                                  <Image
                                    src={Skype}
                                    width={50}
                                    preview={false}
                                  />
                                </Link>
                                <a
                                  style={{ color: "black" }}
                                  href={"mailto:ebay_support@cedcommerce.com"}
                                >
                                  <Image
                                    src={Mail}
                                    width={50}
                                    preview={false}
                                  />
                                </a>
                              </Stack>
                            </Stack>
                          )}
                        </>
                      ) : (
                        <Steps progressDot current={reqiuredCurrentStep}>
                          <Step
                            title={
                              reqiuredCurrentStep === -1 ? (
                                <Link removeUnderline>
                                  Create Business Policy
                                </Link>
                              ) : (
                                "Create Business Policy"
                              )
                            }
                            onClick={() =>
                              reqiuredCurrentStep === -1
                                ? props.history.push("policy")
                                : ""
                            }
                          />
                          <Step
                            title={
                              reqiuredCurrentStep === 0 ? (
                                <Link removeUnderline>
                                  Create Category Template
                                </Link>
                              ) : (
                                "Create Category Template"
                              )
                            }
                            onClick={() =>
                              reqiuredCurrentStep === 0
                                ? props.history.push("templates")
                                : ""
                            }
                          />
                          <Step
                            title={
                              reqiuredCurrentStep === 1 ? (
                                <Link removeUnderline>Create Profile</Link>
                              ) : (
                                "Create Profile"
                              )
                            }
                            onClick={() =>
                              reqiuredCurrentStep === 1
                                ? props.history.push("profiles")
                                : ""
                            }
                          />
                        </Steps>
                      )}
                    </>
                  )}
                </Card.Section>
              </Card>
            </Col>
            {/* <Col
              span={8}
              xs={24}
              sm={24}
              md={24}
              lg={8}
              className="carousel-box"
            >
              <CarouselComponent */}
            <Col
              span={8}
              className="carousel-box"
              xs={24}
              sm={24}
              md={24}
              lg={8}
            >
              {dashboardSkeleton ? (
                <SkeletonBodyText lines={11} />
              ) : (
                <CarouselComponent
                  reqiuredCurrentStep={reqiuredCurrentStep}
                  notProfiledProductCount={notProfiledProductCount}
                  orderManagementDisabledCount={orderManagementDisabledCount}
                  productManagementDisabledCount={
                    productManagementDisabledCount
                  }
                />
              )}
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col span={6} xs={24} sm={24} md={8} lg={8} xl={6}>
              <Card
                title={
                  <Tooltip content="Number of active accounts connected on app">
                    <TextStyle variation="strong">
                      <span
                        style={{
                          borderBottomStyle: "dashed",
                          borderColor: "#00000069",
                        }}
                      >
                        Active Account(s)
                      </span>
                    </TextStyle>
                  </Tooltip>
                }
                bordered={false}
                sectioned={dashboardSkeleton ? true : false}
              >
                {dashboardSkeleton ? (
                  <div style={{ padding: "36px 0px" }}>
                    <SkeletonBodyText lines={3} />
                  </div>
                ) : (
                  <Stack distribution="center">
                    <div style={{ padding: "36px 0px" }}>
                      <Title
                        level={1}
                        style={{ marginBottom: "-15px", fontSize: "65px" }}
                      >
                        {activeAccounts}
                      </Title>
                      <Text
                        type="secondary"
                        style={{ fontSize: "18px", marginLeft: "5px" }}
                      >
                        out of {connectedAccountsArray.length}
                      </Text>
                    </div>
                  </Stack>
                )}
              </Card>
            </Col>
            <Col span={6} xs={24} sm={24} md={8} lg={8} xl={6}>
              <Card
                title={
                  <Tooltip content="Number of products can list on eBay from app">
                    <TextStyle variation="strong">
                      <span
                        style={{
                          borderBottomStyle: "dashed",
                          borderColor: "#00000069",
                        }}
                      >
                        Product Credits
                      </span>
                    </TextStyle>
                  </Tooltip>
                }
                sectioned={dashboardSkeleton ? true : false}
                bordered={false}
              >
                {dashboardSkeleton ? (
                  <div style={{ padding: "36px 0px" }}>
                    <SkeletonBodyText lines={3} />
                  </div>
                ) : (
                  <Stack distribution="center">
                    <div style={{ padding: "36px 0px" }}>
                      <Title
                        level={1}
                        style={{ marginBottom: "-15px", fontSize: "65px" }}
                        type={
                          (20 * totalProductCredits) / 100 >=
                            availableProductCredits && "danger"
                        }
                      >
                        {availableProductCredits}
                      </Title>
                      <Text
                        type="secondary"
                        style={{ fontSize: "18px", marginLeft: "5px" }}
                      >
                        left of {totalProductCredits}/month
                      </Text>
                    </div>
                  </Stack>
                )}
              </Card>
            </Col>
            <Col span={6} xs={24} sm={24} md={8} lg={8} xl={6}>
              <Card
                title={
                  <Tooltip content="Number of orders can create on Shopify">
                    <TextStyle variation="strong">
                      <span
                        style={{
                          borderBottomStyle: "dashed",
                          borderColor: "#00000069",
                        }}
                      >
                        Order Credits
                      </span>
                    </TextStyle>
                  </Tooltip>
                }
                sectioned={dashboardSkeleton ? true : false}
                bordered={false}
              >
                {dashboardSkeleton ? (
                  <div style={{ padding: "36px 0px" }}>
                    <SkeletonBodyText lines={3} />
                  </div>
                ) : (
                  <Stack distribution="center">
                    <div style={{ padding: "36px 0px" }}>
                      <Title
                        level={1}
                        style={{ marginBottom: "-15px", fontSize: "65px" }}
                        type={
                          (20 * totalOrderCredits) / 100 >=
                            availableOrderCredits && "danger"
                        }
                      >
                        {availableOrderCredits}
                      </Title>
                      <Text
                        type="secondary"
                        style={{ fontSize: "18px", marginLeft: "5px" }}
                      >
                        left of {totalOrderCredits}/month
                      </Text>
                    </div>
                  </Stack>
                )}
              </Card>
            </Col>
            <Col
              span={6}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={6}
              style={{ height: "194px" }}
            >
              <Card sectioned title="Plan Details">
                {dashboardSkeleton ? (
                  <div style={{ padding: "36px 0px" }}>
                    <SkeletonBodyText lines={3} />
                  </div>
                ) : (
                  <Scrollable shadow style={{ height: "126px" }} focusable>
                    <Stack vertical spacing="extraTight">
                      {Object.keys(currentPlanDetails).map((planDetail) => {
                        return (
                          <Stack distribution="equalSpacing">
                            <Text>{planDetail}</Text>
                            <Text strong>{currentPlanDetails[planDetail]}</Text>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Scrollable>
                )}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col
              span={12}
              xs={24}
              sm={24}
              md={24}
              lg={12}
              className="analytics-box"
            >
              <Card
                sectioned
                size="small"
                title={
                  <Tooltip content="Check eBay product status with account specification">
                    <TextStyle variation="strong">
                      <span
                        style={{
                          borderBottomStyle: "dashed",
                          borderColor: "#00000069",
                        }}
                      >
                        Product Analytics
                      </span>
                    </TextStyle>
                  </Tooltip>
                }
                style={{ borderRadius: "8px" }}
                bodyStyle={{ padding: "10px 20px 10px 20px" }}
                className="hoverCss"
                actions={
                  accountClicked &&
                  accountClicked.status && [
                    {
                      content: "View All",
                      onClick: () => {
                        setAccountClicked({ ...accountClicked, status: false });
                      },
                    },
                  ]
                }
              >
                <div style={{ height: 300 }}>
                  {dashboardSkeleton ? (
                    <div style={{ padding: "36px 0px", margin: "0px auto" }}>
                      <SkeletonBodyText lines={8} />
                    </div>
                  ) : (
                    <>
                      {accountClicked && !accountClicked.status && (
                        <MyResponsivePie2
                          productAnalyticsData={productAnalyticsData}
                          uniquesColors={uniquesColors}
                          accountClicked={accountClicked}
                          setAccountClicked={setAccountClicked}
                          accountClickedDetails={accountClickedDetails}
                        />
                      )}
                      {accountClicked && accountClicked.status && (
                        <>
                          {accountClicked.data.flag}
                          <MyResponsivePieChild
                            accountClicked={accountClicked}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </Col>
            <Col
              span={12}
              xs={24}
              sm={24}
              md={24}
              lg={12}
              className="analytics-box"
            >
              <Card
                sectioned
                size="small"
                title={
                  <Tooltip content="Check shopify order status with account specification">
                    <TextStyle variation="strong">
                      <span
                        style={{
                          borderBottomStyle: "dashed",
                          borderColor: "#00000069",
                        }}
                      >
                        Order Analytics
                      </span>
                    </TextStyle>
                  </Tooltip>
                }
                style={{ borderRadius: "8px" }}
                bodyStyle={{ padding: "10px 20px 10px 20px" }}
                className="hoverCss"
                actions={
                  accountClickedOrders &&
                  accountClickedOrders.status && [
                    {
                      content: "View All",
                      onClick: () => {
                        setAccountClickedOrders({
                          ...accountClickedOrders,
                          status: false,
                        });
                      },
                    },
                  ]
                }
              >
                <div style={{ height: 300 }}>
                  {dashboardSkeleton ? (
                    <div style={{ padding: "36px 0px", margin: "0px auto" }}>
                      <SkeletonBodyText lines={8} />
                    </div>
                  ) : (
                    <>
                      {accountClickedOrders && !accountClickedOrders.status && (
                        <MyResponsivePie2TotalOrder
                          orderAnalyticsData={orderAnalyticsData}
                          uniquesColors={uniquesColors}
                          accountClickedOrders={accountClickedOrders}
                          setAccountClickedOrders={setAccountClickedOrders}
                          accountClickedDetailsOrders={
                            accountClickedDetailsOrders
                          }
                        />
                      )}
                      {accountClickedOrders && accountClickedOrders.status && (
                        <>
                          {accountClickedOrders.data.flag}
                          <MyResponsiveChildOrders
                            accountClickedOrders={accountClickedOrders}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col
              span={16}
              xs={24}
              sm={24}
              md={24}
              lg={16}
              className="order-static-box"
            >
              {/* <Col span={16} > */}
              <Card
                sectioned
                title={
                  <Stack distribution="equalSpacing" alignment="center">
                    <b>{"Order Statistics"}</b>
                    <Select
                      value={orderAnalyticsYearlyMonthlyWeekly}
                      options={[
                        { label: "Yearly", value: "yearly" },
                        { label: "Monthly", value: "monthly" },
                        { label: "Last 6 Week", value: "weekly" },
                      ]}
                      onChange={(e) => setorderAnalyticsYearlyMonthlyWeekly(e)}
                    />
                  </Stack>
                }
              >
                <Tabs
                  tabs={tabs}
                  selected={selected}
                  onSelect={handleTabChange}
                >
                  <Card.Section>
                    {dashboardSkeleton ? (
                      <div style={{ padding: "36px 0px", margin: "0px auto" }}>
                        <SkeletonBodyText lines={8} />
                      </div>
                    ) : (
                      <>{getTabContent()}</>
                    )}
                  </Card.Section>
                </Tabs>
              </Card>
            </Col>
            <Col span={8} xs={24} sm={24} md={24} lg={8}>
              <Card
                title={
                  <Tooltip content="Total revenue of orders created on Shopify">
                    <TextStyle variation="strong">
                      <span
                        style={{
                          borderBottomStyle: "dashed",
                          borderColor: "#00000069",
                        }}
                      >
                        Lifetime Revenue
                      </span>
                    </TextStyle>
                  </Tooltip>
                }
                sectioned={dashboardSkeleton ? true : false}
                bordered={false}
              >
                {dashboardSkeleton ? (
                  <div style={{ padding: "36px 0px" }}>
                    <SkeletonBodyText lines={3} />
                  </div>
                ) : (
                  <Stack distribution="center">
                    <div style={{ padding: "42px 0" }}>
                      <Title level={1} style={{ marginBottom: "-10px" }}>
                        {shopifyCurrencyName} {lifetimeRevenue}
                      </Title>
                      {showPercentDiff && (
                        <Text
                          strong
                          type={percentageDiff > 0 ? "success" : "danger"}
                        >
                          <Stack spacing="extraTight">
                            {percentageDiff > 0 ? (
                              <Icon source={ArrowUpMinor} color="success" />
                            ) : (
                              <Icon source={ArrowDownMinor} color="critical" />
                            )}
                            <>
                              {Math.abs(percentageDiff)}%
                              <span>
                                {" "}
                                <Text type="secondary"> in last 30days</Text>
                              </span>
                            </>
                          </Stack>
                        </Text>
                      )}
                    </div>
                  </Stack>
                )}
              </Card>
              <Card
                title="FAQ(s)"
                actions={{
                  content: "See All",
                  onAction: () => props.history.push("help"),
                }}
                sectioned={dashboardSkeleton}
              >
                {/* <Scrollable shadow style={{ height: "200px" }} focusable> */}
                {
                  dashboardSkeleton ? <SkeletonBodyText lines={6} /> :
                <Scrollable shadow style={{ height: "217px" }} focusable>
                  <ResourceList
                    items={faqsData}
                    renderItem={(item) => {
                      const { title } = item;
                      return (
                        <ResourceList.Item
                          onClick={(e) => props.history.push(`help?question=${title}`)}
                          accessibilityLabel={`View details for ${title}`}
                        >
                          <h3>
                            <TextStyle variation="strong">{title}</TextStyle>
                          </h3>
                        </ResourceList.Item>
                      );
                    }}
                  />
                </Scrollable>
                }
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col span={8} xs={24} sm={24} md={24} lg={8}>
              <Card
                sectioned
                title="News"
                size="small"
                style={{ borderRadius: "8px" }}
              >
                <Scrollable shadow style={{ height: "280px" }} focusable>
                  <ResourceList
                    items={news}
                    renderItem={(item) => {
                      const { content_link, title, description, image_url } =
                        item;

                      return (
                        <a
                          href={content_link}
                          target="_blank"
                          style={{ textDecoration: "none", color: "#000" }}
                        >
                          <ResourceList.Item
                            media={
                              <Thumbnail source={image_url} alt="News Logo" />
                            }
                            accessibilityLabel={`View details for ${title}`}
                          >
                            <h3>
                              <TextStyle variation="strong">{title}</TextStyle>
                            </h3>
                            <label>{description}</label>
                          </ResourceList.Item>
                        </a>
                      );
                    }}
                  />
                </Scrollable>
              </Card>
            </Col>
            <Col span={8} xs={24} sm={24} md={24} lg={8}>
              <Card
                sectioned
                title="Blogs"
                size="small"
                style={{ borderRadius: "8px" }}
                actions={[
                  {
                    content: "See All",
                    url: "https://cedcommerce.com/blog/?s=ebay",
                    external: true,
                  },
                ]}
              >
                <Scrollable shadow style={{ height: "280px" }} focusable>
                  <ResourceList
                    items={blogs}
                    renderItem={(item) => {
                      const { content_link, title, image_url, description } =
                        item;

                      return (
                        <a
                          href={content_link}
                          target="_blank"
                          style={{ textDecoration: "none", color: "#000" }}
                        >
                          <ResourceList.Item
                            media={
                              <Thumbnail source={image_url} alt="News Logo" />
                            }
                            accessibilityLabel={`View details for ${title}`}
                          >
                            <h3>
                              <TextStyle variation="strong">{title}</TextStyle>
                            </h3>
                            <label>{description}</label>
                          </ResourceList.Item>
                        </a>
                      );
                    }}
                  />
                </Scrollable>
              </Card>
            </Col>
            <Col span={8} xs={24} sm={24} md={24} lg={8}>
              <Card
                title="Recommended Apps"
                sectioned={true}
                actions={[
                  {
                    content: "See all",
                    url: "https://apps.shopify.com/partners/cedcommerce",
                    external: true,
                  },
                ]}
              >
                <Scrollable shadow style={{ height: "280px" }} focusable>
                  <ResourceList
                    items={[
                      {
                        url: "https://apps.shopify.com/amazon-by-cedcommerce",
                        name: "Amazon by CedCommerce",
                        description:
                          "Selling on Amazon becomes easy with the Amazon sales channel",
                        media: (
                          <Thumbnail
                            source="https://cdn.shopify.com/app-store/listing_images/0632f97b04f3464ee3d9148e7b84c9a9/icon/CMP07ajunPQCEAE=.png?height=50&width=50"
                            alt="Amazon by CedCommerce logo"
                          />
                        ),
                      },
                      {
                        url: "https://apps.shopify.com/etsy-marketplace-integration",
                        name: "Etsy Marketplace Integration",
                        description:
                          "Easily manage listings, inventory, orders & more on Etsy.com",
                        media: (
                          <Thumbnail
                            source="https://cdn.shopify.com/app-store/listing_images/2fa150931ca28a5ed6a17dc69c40477b/icon/CNLtvLz0lu8CEAE=.png?height=50&amp;width=50"
                            alt="Etsy Marketplace Integration logo"
                          />
                        ),
                      },
                      {
                        url: "https://apps.shopify.com/facebook-marketplace-connector",
                        name: "Facebook & Instagram Shopping",
                        description:
                          "Sell on Facebook & Instagram, list products and manage orders.",
                        media: (
                          <Thumbnail
                            source="https://cdn.shopify.com/app-store/listing_images/8e58c700f1ecc2539682f6a04a8852c7/icon/CNyDx+T0lu8CEAE=.png?height=50&width=50"
                            alt="facebook marketplace connector"
                          />
                        ),
                      },
                    ]}
                    renderItem={(item) => {
                      const { url, name, media, description } = item;

                      return (
                        <a
                          href={url}
                          target="_blank"
                          style={{ textDecoration: "none", color: "#000" }}
                        >
                          <ResourceList.Item
                            media={media}
                            accessibilityLabel={`View details for ${name}`}
                          >
                            <h3>
                              <TextStyle variation="strong">{name}</TextStyle>
                            </h3>
                            <Label>{description}</Label>
                          </ResourceList.Item>
                        </a>
                      );
                    }}
                  />
                </Scrollable>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <TestModalComponent
        passedState={profilesModal}
        passedSetState={setProfilesModal}
      />
      <TestModalComponent
        passedState={templatesModal}
        passedSetState={setTemplatesModal}
      />
    </PageHeader>
  );
};

export default withRouter(FinalDashboard);

export const TestModalComponent = ({ passedState, passedSetState }) => {
  return (
    <Modal
      title={passedState["title"]}
      visible={passedState["status"]}
      footer={null}
      onCancel={() => passedSetState({ ...passedState, status: false })}
    >
      <Image
        width={"100%"}
        height={"100%"}
        src={passedState["gif"]}
        preview={false}
      />
    </Modal>
  );
};
