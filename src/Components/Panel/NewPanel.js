import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Accounts from "./Accounts/accounts";
import ebayactivity from "./Marketplaces/Ebay/Activity/ebayactivity";
import Ebayconfiguration from "./Marketplaces/Ebay/Configurations/ebayconfiguration";
import Ebaydashboard from "./Marketplaces/Ebay/Dashboard/Ebaydashboard";
import Ebayhelp from "./Marketplaces/Ebay/Help/ebayhelp";
import Ebaymessage from "./Marketplaces/Ebay/Message/ebaymessage";
import Ebayorders from "./Marketplaces/Ebay/Orders/ebayorders";
import Ebayorderview from "./Marketplaces/Ebay/Orders/ebayorderview";
import Ebaypolicieslist from "./Marketplaces/Ebay/Policies/ebaypolicieslist";
import EbayPolicyHandler from "./Marketplaces/Ebay/Policies/ebayPolicyHandler";
import Ebaypricing from "./Marketplaces/Ebay/Pricing/ebaypricing";
import Ebayprofile from "./Marketplaces/Ebay/Profile/ebayprofile";
import EbayCreateprofile from "./Marketplaces/Ebay/Profile/Profilepages/ebayCreateprofile";
import Ebaytemplate from "./Marketplaces/Ebay/Template/ebaytemplate";
import {
  Layout,
  Menu,
  Breadcrumb,
  Image,
  Col,
  Row,
  Avatar,
  Drawer,
  Typography,
  Button,
  Badge,
  Popover,
} from "antd";
import { userDetails } from "./PanelData";
import Logo from "../../assets/ced-ebay-logo.png";
import CollapsedLogo from "../../assets/cedcommercelogoCollapsed.png";

import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  PhoneOutlined,
  BarChartOutlined,
  TagOutlined,
  DownloadOutlined,
  ProfileOutlined,
  FileTextOutlined,
  LinkOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  ContactsOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  BellOutlined,
} from "@ant-design/icons";
import PlansComponentAnt from "../Registration/PlansComponentAnt";
import { plansSample } from "../Registration/NewRegistrationhelper";
import OrdersComponent from "./Marketplaces/Ebay/Orders/OrdersComponent";
import TemplateComponent from "./Marketplaces/Ebay/Template/TemplateComponent";
import PolicyGridComponent from "./Marketplaces/Ebay/Policies/PolicyGridComponent";
import ProfileGridComponent from "./Marketplaces/Ebay/Profile/ProfileGridComponent";
import Createprofile from "./Marketplaces/Ebay/Profile/Profilepages/CreateProfile";
import PolicyHandler from "./Marketplaces/Ebay/Policies/PolicyHandler";
import ebayproducts from "./Marketplaces/Ebay/Products/ebayproducts";
import Ebayproductview from "./Marketplaces/Ebay/Products/ebayproductview";
import ViewOrders from "./Marketplaces/Ebay/Orders/ViewOrders";
import EbayHelpComponent from "./Marketplaces/Ebay/Help/EbayHelpComponent";
import Configuration from "./Marketplaces/Ebay/Configurations/Configuration";
import ContactUs from "./Marketplaces/Ebay/Help/ContactUs";
import NewAccountGrid from "./Accounts/NewAccountGrid";
import ShopifyAccount from "./Accounts/ShopifyAccount";
import NewProducts from "./Marketplaces/Ebay/Products/NewProducts";
import ViewOrdersPolaris from "./Marketplaces/Ebay/Orders/ViewOrdersPolaris";
import ProductViewPolaris from "./Marketplaces/Ebay/Products/ProductViewPolaris";
import ActivityPolaris from "./Marketplaces/Ebay/Activity/ActivityPolaris";
import DashboardPolaris from "./Marketplaces/Ebay/Dashboard/DashboardPolaris";
import ActivityGrid from "./Marketplaces/Ebay/Activity/ActivityGrid";
import CreateProfilePolaris from "./Marketplaces/Ebay/Profile/Profilepages/CreateProfilePolaris";
import ProductViewPolarisNew from "./Marketplaces/Ebay/Products/ProductViewPolarisNew";
import {
  Icon,
  Stack,
  Popover as ShopifyPopover,
  Button as ShopifyButton,
  ActionList,
  Banner,
} from "@shopify/polaris";
import ViewOrdersPolarisNew from "./Marketplaces/Ebay/Orders/ViewOrdersPolarisNew";
import {
  CircleCancelMinor,
  CircleTickOutlineMinor,
  MobileHamburgerMajorMonotone,
  NotificationMajorMonotone,
  PhoneMajorMonotone,
} from "@shopify/polaris-icons";
import ProductViewPolarisNewBKP from "./Marketplaces/Ebay/Products/ProductViewPolarisNewBKP";
import NewProductsNewFilters from "./Marketplaces/Ebay/Products/NewProductsNewFilters";
import DisabledProducts from "./Marketplaces/Ebay/Products/DisabledProducts";
import FinalProductGrid from "./Marketplaces/Ebay/Products/FinalProductGrid";
import FinalPolicyGrid from "./Marketplaces/Ebay/Policies/FinalPolicyGrid";
import { getAllNotifications } from "../../APIrequests/ActivitiesAPI";
import { allNotificationsURL } from "../../URLs/ActivitiesURL";
import FinalDashboard from "./Marketplaces/Ebay/Dashboard/FinalDashboard";
import { notify } from "../../services/notify";
import { getConnectedAccounts } from "../../Apirequest/accountsApi";
// import DashboardPolaris2 from "./Marketplaces/Ebay/Dashboard/DashboardPolaris2";

const { Text } = Typography;

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const NewPanel = (props) => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [drawerVisible, setdrawerVisible] = useState(false);

  // activities
  const [allNotifications, setAllNotifications] = useState([]);
  const [bellClicked, setBellClicked] = useState(false);

  // currently running activities
  const [queuedTasks, setQueuedTasks] = useState([]);

  // shopUrl
  const [shopURL, setShopURL] = useState("");
  // shopifyAccountData
  const [shopifyAccountData, setShopifyAccountData] = useState({});

  const handleClick = (menu) => {
    props.history.push(`/panel/ebay/${menu["key"]}`);
  };

  const getQueuedActivities = (tasks) => {
    const queuedTasks = tasks.map((task, index) => {
      if (index < 3) {
        return {
          message: task["message"],
          id: index,
        };
      }
    });
    let dummyTasksData = [];
    for (let i = 1; i <= 3; i++) {
      dummyTasksData.push({
        message: `message${i}`,
        id: i,
      });
    }
    setQueuedTasks(queuedTasks);
    // setQueuedTasks(dummyTasksData);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "success":
        return <Icon source={CircleTickOutlineMinor} color="success" />;
      case "error":
        return <Icon source={CircleCancelMinor} color="critical" />;
      default:
        break;
    }
  };

  const hitGetNotifications = async () => {
    let dataToPost = {
      count: 3,
      activePage: 1,
    };
    let { success, data } = await getAllNotifications(
      allNotificationsURL,
      dataToPost
    );
    if (success) {
      let { rows, queuedTask } = data;
      let temp = rows.map((row) => {
        let testObj = {};
        if (row.hasOwnProperty("message") && row["message"] !== null) {
          // testObj["message"] =
          //   typeof row["message"] === "object"
          //     ? row["message"]["message"]
          //     : row["message"];
          // testObj["createdAt"] = row["created_at"];
          // testObj["severity"] = row["severity"];
          // testObj["url"] = row?.["url"];
          testObj["content"] = (
            <Stack alignment="center" spacing="extraTight" wrap={false}>
              <>{getSeverityIcon(row["severity"])}</>
              <>{row["message"]}</>
              {/* <Tooltip content={"Download Report"}>
                <div style={{ cursor: "pointer", fontSize: "0.25rem" }}>
                  <Link url={activity["url"]} external>
                    <Icon source={ImportMinor} color={"blueDark"} />
                  </Link>
                </div>
              </Tooltip> */}
            </Stack>
            // <Banner title={row["message"]} status={row["severity"]}>
            //   <p>{row["created_at"]}.</p>
            // </Banner>
          );
        }
        return testObj;
      });
      getQueuedActivities(queuedTask);
      setAllNotifications(temp);
    }
  };

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let shopifyAccount = connectedAccountData.find(
        (account) => account.marketplace === "shopify"
      );
      if (shopifyAccount) {
        const { shop_url } = shopifyAccount;
        setShopURL(shop_url);
        setShopifyAccountData(shopifyAccount);
      }
    } else {
      notify.error(message);
      props.history.push("/auth/login");
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setBellClicked(false);
    });
    hitGetNotifications();
    return window.removeEventListener("scroll", () => {});
  }, []);

  const activator = (
    <BellOutlined
      className="floating-right-bottom-btn"
      style={{
        color: "#000",
        fontSize: "2rem",
        padding: "9px",
        borderRadius: "50%",
        border: "1px solid #fff",
        backgroundColor: "rgb(255 245 234)",
      }}
      onClick={(e) => {
        setBellClicked(!bellClicked);
      }}
    />
    // <Badge
    //   // count={allNotifications.length}
    //   size="small"
    //   // style={{ cursor: "pointer" }}
    // onClick={(e) => {
    //   setBellClicked(!bellClicked);
    // }}
    // >
    //   {/* <Icon source={NotificationMajorMonotone} color="base" /> */}
    //   {/* <Avatar
    //     style={{ backgroundColor: "rgb(117 152 205)" }}
    //     size="small"
    //     icon={<BellOutlined />}
    //   /> */}
    // {/* </Badge> */}
  );
  return (
    <div>
      <Layout className="layout">
        {window.innerWidth <= 768 ? (
          <Drawer
            placement={"left"}
            closable={true}
            maskClosable={true}
            onClose={() => setdrawerVisible(!drawerVisible)}
            visible={drawerVisible}
            key={"left"}
            width={drawerVisible ? "80" : "200"}
          >
            <Sider
              style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                width: "200px",
                top: 0,
                bottom: 0,
                zIndex: "100",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "16px 0px",
                }}
              >
                <Image
                  src={menuCollapsed ? CollapsedLogo : Logo}
                  preview={false}
                  width={menuCollapsed ? "30px" : "140px"}
                  style={
                    menuCollapsed
                      ? {
                          height: "30px",
                        }
                      : {
                          height: "32px",
                        }
                  }
                />
              </div>
              <Menu
                mode="inline"
                defaultSelectedKeys={["0"]}
                onClick={handleClick}
                theme="dark"
              >
                <Menu.Item
                  key="dashboard"
                  icon={<BarChartOutlined style={{ fontSize: "22px" }} />}
                  style={{ margin: "0px" }}
                >
                  Dashboard
                </Menu.Item>
                <SubMenu
                  key="sub1"
                  icon={<TagOutlined style={{ fontSize: "22px" }} />}
                  title="Products"
                >
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="products"
                    icon={<UploadOutlined style={{ fontSize: "16px" }} />}
                  >
                    Manage Products
                  </Menu.Item>
                  {/* <Menu.Item
                style={{ margin: "0px" }}
                key="productsPS"
                icon={<UploadOutlined style={{ fontSize: "16px" }} />}
              >
                 Products PS
              </Menu.Item> */}
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="profilesUS"
                    icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                  >
                    Profiles
                  </Menu.Item>
                  {/* <Menu.Item
                style={{ margin: "0px" }}
                key="profiles"
                icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
              >
                Profiles PS
              </Menu.Item> */}
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="policiesUS"
                    icon={<FileTextOutlined style={{ fontSize: "16px" }} />}
                  >
                    Business Policy
                  </Menu.Item>
                  {/* <Menu.Item
                style={{ margin: "0px" }}
                key="policies"
                icon={<FileTextOutlined style={{ fontSize: "16px" }} />}
              >
                Business Policy PS
              </Menu.Item> */}
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="templatesUS"
                    icon={<LinkOutlined style={{ fontSize: "16px" }} />}
                  >
                    Templates
                  </Menu.Item>
                  {/* <Menu.Item
                    style={{ margin: "0px" }}
                    key="templates"
                    icon={<LinkOutlined style={{ fontSize: "16px" }} />}
                  >
                    Templates PS
                  </Menu.Item> */}
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="disabledproducts"
                    icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
                  >
                    Disabled Products
                  </Menu.Item>
                </SubMenu>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="orders"
                  icon={<DownloadOutlined style={{ fontSize: "22px" }} />}
                >
                  Orders
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="configurations"
                  icon={<SettingOutlined style={{ fontSize: "22px" }} />}
                >
                  Configuration
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="activity"
                  icon={
                    <ExclamationCircleOutlined style={{ fontSize: "22px" }} />
                  }
                >
                  Activities
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="help"
                  icon={<QuestionCircleOutlined style={{ fontSize: "22px" }} />}
                >
                  Help
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="pricing"
                  icon={<DollarOutlined style={{ fontSize: "22px" }} />}
                >
                  Plans
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="contactUs"
                  icon={<ContactsOutlined style={{ fontSize: "22px" }} />}
                >
                  Contact Us
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="accounts"
                  icon={<UserOutlined style={{ fontSize: "22px" }} />}
                >
                  eBay Accounts
                </Menu.Item>
              </Menu>
            </Sider>
          </Drawer>
        ) : (
          <Sider
            collapsible
            collapsed={menuCollapsed}
            onCollapse={() => setMenuCollapsed(!menuCollapsed)}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              width: "200px",
              top: 0,
              bottom: 0,
              zIndex: "100",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "16px 0px",
              }}
            >
              <Image
                src={menuCollapsed ? CollapsedLogo : Logo}
                preview={false}
                width={menuCollapsed ? "30px" : "140px"}
                style={
                  menuCollapsed
                    ? {
                        height: "30px",
                      }
                    : {
                        height: "32px",
                      }
                }
              />
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={["0"]}
              onClick={handleClick}
              theme="dark"
            >
              <Menu.Item
                key="dashboard"
                icon={<BarChartOutlined style={{ fontSize: "22px" }} />}
                style={{ margin: "0px" }}
              >
                Dashboard
              </Menu.Item>
              {/* <Menu.Item
                key="dashboard2"
                icon={<BarChartOutlined style={{ fontSize: "22px" }} />}
                style={{ margin: "0px" }}
              >
                Dashboard2
              </Menu.Item> */}
              <SubMenu
                key="sub1"
                icon={<TagOutlined style={{ fontSize: "22px" }} />}
                title="Products"
              >
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="products"
                  icon={<UploadOutlined style={{ fontSize: "16px" }} />}
                >
                  Manage Products
                </Menu.Item>
                {/* <Menu.Item
            style={{ margin: "0px" }}
            key="productsPS"
            icon={<UploadOutlined style={{ fontSize: "16px" }} />}
          >
             Products PS
          </Menu.Item> */}
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="profilesUS"
                  icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                >
                  Profiles
                </Menu.Item>
                {/* <Menu.Item
            style={{ margin: "0px" }}
            key="profiles"
            icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
          >
            Profiles PS
          </Menu.Item> */}
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="policiesUS"
                  icon={<FileTextOutlined style={{ fontSize: "16px" }} />}
                >
                  Business Policy
                </Menu.Item>
                {/* <Menu.Item
            style={{ margin: "0px" }}
            key="policies"
            icon={<FileTextOutlined style={{ fontSize: "16px" }} />}
          >
            Business Policy PS
          </Menu.Item> */}
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="templatesUS"
                  icon={<LinkOutlined style={{ fontSize: "16px" }} />}
                >
                  Templates
                </Menu.Item>
                {/* <Menu.Item
                style={{ margin: "0px" }}
                key="templates"
                icon={<LinkOutlined style={{ fontSize: "16px" }} />}
              >
                Templates PS
              </Menu.Item> */}
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="disabledproducts"
                  icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
                >
                  Disabled Products
                </Menu.Item>
              </SubMenu>
              <Menu.Item
                style={{ margin: "0px" }}
                key="orders"
                icon={<DownloadOutlined style={{ fontSize: "22px" }} />}
              >
                Orders
              </Menu.Item>
              <Menu.Item
                style={{ margin: "0px" }}
                key="configurations"
                icon={<SettingOutlined style={{ fontSize: "22px" }} />}
              >
                Configuration
              </Menu.Item>
              <Menu.Item
                style={{ margin: "0px" }}
                key="activity"
                icon={
                  <ExclamationCircleOutlined style={{ fontSize: "22px" }} />
                }
              >
                Activities
              </Menu.Item>
              <Menu.Item
                style={{ margin: "0px" }}
                key="help"
                icon={<QuestionCircleOutlined style={{ fontSize: "22px" }} />}
              >
                Help
              </Menu.Item>
              <Menu.Item
                style={{ margin: "0px" }}
                key="pricing"
                icon={<DollarOutlined style={{ fontSize: "22px" }} />}
              >
                Plans
              </Menu.Item>
              <Menu.Item
                style={{ margin: "0px" }}
                key="contactUs"
                icon={<ContactsOutlined style={{ fontSize: "22px" }} />}
              >
                Contact Us
              </Menu.Item>
              <Menu.Item
                style={{ margin: "0px" }}
                key="accounts"
                icon={<UserOutlined style={{ fontSize: "22px" }} />}
              >
                eBay Accounts
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout
        // style={{ marginLeft: 200 }}
        // style={
        //   menuCollapsed ? { marginLeft: "80px" } : { marginLeft: "200px" }
        // }
        >
          <Header
            // className="headerCSS"
            // style={{width: `calc(100% / ${yourVariable})`}}
            theme={"dark"}
            // style={
            //   menuCollapsed ? { marginLeft: "80px" } : { marginLeft: "200px" }
            // }
            style={
              menuCollapsed
                ? {
                    padding: "0px",
                    position: "fixed",
                    width: "calc(100% - 80px)",
                    zIndex: "100",
                    marginLeft: "80px",
                  }
                : {
                    padding: "0px",
                    position: "fixed",
                    width:
                      window.innerWidth > 768
                        ? "calc(100% - 200px)"
                        : "calc(100% - 0px)",
                    zIndex: "100",
                    marginLeft: window.innerWidth > 768 ? "200px" : "0px",
                  }
            }
          >
            <div style={{ paddingRight: 40, cursor: "pointer" }}>
              <Stack distribution="trailing" alignment="center">
                <div style={{ marginBottom: "-8px" }}>
                  <ShopifyPopover
                    active={bellClicked}
                    activator={activator}
                    onClose={(e) => setBellClicked(!bellClicked)}
                  >
                    <ActionList
                      actionRole="menuitem"
                      items={allNotifications}
                    />
                  </ShopifyPopover>
                </div>
                <div
                  onClick={() => props.history.push("/panel/ebay/appaccount")}
                >
                  <Stack distribution="trailing" alignment="center">
                    <Avatar
                      style={{
                        color: "#084e8a",
                        backgroundColor: "rgb(206 224 237 / 1)",
                      }}
                    >
                      {shopURL?.[0]?.toUpperCase()}
                    </Avatar>
                    <div style={{ color: "#fff" }}>
                      {shopURL?.split(".")?.[0]}
                    </div>
                  </Stack>
                </div>
              </Stack>
            </div>
            {/* <Row>
              {window.innerWidth <= 768 ? (
                <Col span={2}>
                  <Button onClick={() => setdrawerVisible(!drawerVisible)}>
                    <Icon source={MobileHamburgerMajorMonotone} color="base" />
                  </Button>
                </Col>
              ) : null}
              <Col span={5} offset={15} style={{ color: "#fff" }}>
                <Row justify="end">
                  <Col span={4}>
                    <PhoneOutlined />
                  </Col>
                  <Col
                    span={20}
                    onClick={() => props.history.push("/panel/ebay/appaccount")}
                  >
                    <Stack vertical={false} spacing="tight">
                      <Avatar
                        style={{
                          color: "#084e8a",
                          backgroundColor: "rgb(206 224 237 / 1)",
                        }}
                      >
                        {userDetails["username"][0].toUpperCase()}
                      </Avatar>
                      {window.innerWidth > 768 ? (
                        <Text strong style={{ color: "#fff" }}>
                          {userDetails["username"]}
                        </Text>
                      ) : null}
                    </Stack>
                  </Col>
                </Row>
              </Col>
            </Row> */}
          </Header>
          <Content
            // style={{ marginTop: "64px" }}

            style={
              menuCollapsed
                ? // ? { marginLeft:"80px", marginTop: "64px !important" }
                  // : { marginLeft: window.innerWidth<=768 ? "200px" : "", marginTop: "64px !important" }
                  {
                    marginLeft: window.innerWidth > 768 ? "80px" : "0px",
                    marginTop: "64px",
                  }
                : {
                    marginLeft: window.innerWidth > 768 ? "200px" : "0px",
                    marginTop: "64px",
                  }
            }
          >
            <Switch>
              <Route
                exact
                path="/panel"
                render={() => <Redirect to="/panel/ebay/dashboard" />}
              />
              {/* <Route path="/panel/ebay/dashboard1" component={Ebaydashboard} /> */}
              {/* <Route path="/panel/ebay/dashboard" component={FinalDashboard} /> */}
              <Route
                path="/panel/ebay/dashboard"
                render={(props) => (
                  <FinalDashboard queuedTasks={queuedTasks} {...props} />
                )}
              />
              {/* <Route
                path="/panel/ebay/dashboard"
                component={DashboardPolaris}
              /> */}
              {/* <Route
                path="/panel/ebay/dashboard2"
                component={DashboardPolaris2}
              /> */}
              {/* <Route path='/panel/ebay/productsPS' component={ebayproducts}/> */}
              {/* <Route path="/panel/ebay/products" component={NewProducts} /> */}
              <Route
                path="/panel/ebay/products"
                component={NewProductsNewFilters}
              />
              {/* <Route path="/panel/ebay/products" component={FinalProductGrid} /> */}
              <Route
                path="/panel/ebay/disabledproducts"
                component={DisabledProducts}
              />
              {/* <Route path='/panel/ebay/products' component={Products} /> */}
              {/* <Route path="/panel/ebay/accounts" component={Accounts} /> */}
              <Route path="/panel/ebay/accounts" component={NewAccountGrid} />
              <Route
                path="/panel/ebay/appaccount"
                render={(props) => (
                  <ShopifyAccount
                    shopifyAccountData={shopifyAccountData}
                    {...props}
                  />
                )}
                // component={ShopifyAccount}
              />
              <Route
                path="/panel/ebay/viewproductsprev"
                component={ProductViewPolaris}
              />
              <Route
                path="/panel/ebay/viewproducts"
                component={ProductViewPolarisNew}
                // component={ProductViewPolarisNewBKP}
              />
              {/* <Route
                path="/panel/ebay/viewproductsPS"
                component={Ebayproductview}
              /> */}
              {/* <Route path="/panel/ebay/ordersPS" component={Ebayorders} /> */}
              <Route path="/panel/ebay/orders" component={OrdersComponent} />
              {/* <Route
                path="/panel/ebay/viewordersPS"
                component={Ebayorderview}
              /> */}
              {/* <Route path="/panel/ebay/vieworders1" component={ViewOrders} /> */}
              <Route
                path="/panel/ebay/vieworders1"
                component={ViewOrdersPolaris}
              />
              <Route
                path="/panel/ebay/vieworders"
                component={ViewOrdersPolarisNew}
              />
              <Route path="/panel/ebay/profiles" component={Ebayprofile} />
              <Route
                path="/panel/ebay/profilesUS"
                component={ProfileGridComponent}
              />
              <Route
                path="/panel/ebay/createprofile1"
                component={Createprofile}
              />
              {/* <Route
                path="/panel/ebay/createprofileUS"
                component={Createprofile}
              /> */}
              <Route
                path="/panel/ebay/createprofileUS"
                component={CreateProfilePolaris}
              />
              {/* <Route
                path="/panel/ebay/policiesUS"
                component={PolicyGridComponent}
              /> */}
              <Route
                path="/panel/ebay/policiesUS"
                component={FinalPolicyGrid}
              />
              <Route path="/panel/ebay/policies" component={Ebaypolicieslist} />
              <Route path="/panel/ebay/message" component={Ebaymessage} />
              <Route
                path="/panel/ebay/policy/handler"
                component={EbayPolicyHandler}
              />
              <Route
                path="/panel/ebay/policyUS/handler"
                component={PolicyHandler}
              />
              <Route path="/panel/ebay/templates" component={Ebaytemplate} />
              <Route
                path="/panel/ebay/templatesUS"
                component={TemplateComponent}
              />
              {/* <Route path="/panel/ebay/pricing" component={Ebaypricing} /> */}
              <Route
                path="/panel/ebay/pricing"
                // component=
                // {<PlansComponent plans={plansSample}/>}
                render={() => (
                  // <PlansComponent
                  //   plans={plansSample}
                  //   fromOnBoarding={false}
                  // />
                  <PlansComponentAnt
                    // plans={plansSample}
                    fromOnBoarding={false}
                  />
                )}
              />
              {/* <Route
                path="/panel/ebay/configurations"
                component={Ebayconfiguration}
              /> */}
              <Route
                path="/panel/ebay/configurations"
                component={Configuration}
              />
              {/* <Route path="/panel/ebay/activity1" component={ebayactivity} /> */}
              <Route path="/panel/ebay/activity1" component={ActivityPolaris} />
              <Route path="/panel/ebay/activity" component={ActivityGrid} />
              <Route path="/panel/ebay/help1" component={Ebayhelp} />
              <Route path="/panel/ebay/help" component={EbayHelpComponent} />
              <Route path="/panel/ebay/contactUs" component={ContactUs} />
              {/* <Route path="/panel/ebay/accounts" component={NewAccount} /> */}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default NewPanel;
