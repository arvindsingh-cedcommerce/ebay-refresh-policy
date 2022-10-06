import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Ebaymessage from "./Marketplaces/Ebay/Message/ebaymessage";
import { Layout, Menu, Image, Avatar, Drawer } from "antd";
import Logo from "../../assets/ced-ebay-logo.png";
import CollapsedLogo from "../../assets/cedcommercelogoCollapsed.png";

import {
  UserOutlined,
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
  EyeInvisibleOutlined,
  DropboxOutlined,
  GroupOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import PlansComponentAnt from "../Registration/PlansComponentAnt";
import OrdersComponent from "./Marketplaces/Ebay/Orders/OrdersComponent";
import TemplateComponent from "./Marketplaces/Ebay/Template/TemplateComponent";
import EbayHelpComponent from "./Marketplaces/Ebay/Help/EbayHelpComponent";
import Configuration from "./Marketplaces/Ebay/Configurations/Configuration";
import ContactUs from "./Marketplaces/Ebay/Help/ContactUs";
import NewAccountGrid from "./Accounts/NewAccountGrid";
import ShopifyAccount from "./Accounts/ShopifyAccount";
import ActivityGrid from "./Marketplaces/Ebay/Activity/ActivityGrid";
import {
  Icon,
  Stack,
  Popover as ShopifyPopover,
  ActionList,
  Button,
} from "@shopify/polaris";
import {
  CircleCancelMinor,
  CircleTickOutlineMinor,
  FilterMajorMonotone,
} from "@shopify/polaris-icons";
import { getAllNotifications } from "../../APIrequests/ActivitiesAPI";
import { allNotificationsURL } from "../../URLs/ActivitiesURL";
import FinalDashboard from "./Marketplaces/Ebay/Dashboard/FinalDashboard";
import { notify } from "../../services/notify";
import { getConnectedAccounts } from "../../Apirequest/accountsApi";
import ProfileComponent from "./Marketplaces/Ebay/Profile/ProfileComponent";
import PolicyComponent from "./Marketplaces/Ebay/Policies/PolicyComponent";
import NewProductsComponent from "./Marketplaces/Ebay/Products/NewProductsComponent";
import DisbaledProductsWrapper from "./Marketplaces/Ebay/Products/DisbaledProductsWrapper";

const { Header, Content, Sider } = Layout;
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
          testObj["content"] = (
            <Stack alignment="center" spacing="extraTight" wrap={false}>
              <>{getSeverityIcon(row["severity"])}</>
              <>{row["message"]}</>
            </Stack>
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
                    icon={<DropboxOutlined style={{ fontSize: "16px" }} />}
                  >
                    Manage Products
                  </Menu.Item>
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="profiles"
                    icon={<GroupOutlined style={{ fontSize: "16px" }} />}
                  >
                    Profiles
                  </Menu.Item>
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="policy"
                    icon={<FileTextOutlined style={{ fontSize: "16px" }} />}
                  >
                    Business Policy
                  </Menu.Item>
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="templates"
                    icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                  >
                    Templates
                  </Menu.Item>
                  <Menu.Item
                    style={{ margin: "0px" }}
                    key="disabledproducts"
                    icon={<EyeInvisibleOutlined style={{ fontSize: "16px" }} />}
                  >
                    Disabled Products
                  </Menu.Item>
                </SubMenu>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="orders"
                  icon={<PieChartOutlined style={{ fontSize: "22px" }} />}
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
                  icon={<BellOutlined style={{ fontSize: "22px" }} />}
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
                <Menu.Item
                  style={{ margin: "0px", pointerEvents: "none" }}
                  key="forSider"
                ></Menu.Item>
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
              defaultSelectedKeys={["dashboard"]}
              onClick={handleClick}
              theme="dark"
              selectedKeys={[props.location.pathname.split("/")[3]]}
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
                  icon={<DropboxOutlined style={{ fontSize: "16px" }} />}
                >
                  Manage Products
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="profiles"
                  icon={<GroupOutlined style={{ fontSize: "16px" }} />}
                >
                  Profiles
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="policy"
                  icon={<FileTextOutlined style={{ fontSize: "16px" }} />}
                >
                  Business Policy
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="templates"
                  icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                >
                  Templates
                </Menu.Item>
                <Menu.Item
                  style={{ margin: "0px" }}
                  key="disabledproducts"
                  icon={<EyeInvisibleOutlined style={{ fontSize: "16px" }} />}
                >
                  Disabled Products
                </Menu.Item>
              </SubMenu>
              <Menu.Item
                style={{ margin: "0px" }}
                key="orders"
                icon={<PieChartOutlined style={{ fontSize: "22px" }} />}
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
                icon={<BellOutlined style={{ fontSize: "22px" }} />}
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
              <Menu.Item
                style={{ margin: "0px", pointerEvents: "none" }}
                key="forSider"
              ></Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout>
          <Header
            theme={"dark"}
            style={
              menuCollapsed
                ? {
                    padding: "0px",
                    position: "fixed",
                    width: "calc(100% - 80px)",
                    zIndex: "1090",
                    marginLeft: "80px",
                  }
                : {
                    padding: "0px",
                    position: "fixed",
                    width:
                      window.innerWidth > 768
                        ? "calc(100% - 200px)"
                        : "calc(100% - 0px)",
                    zIndex: "1090",
                    marginLeft: window.innerWidth > 768 ? "200px" : "0px",
                  }
            }
          >
            <div style={{ paddingRight: 40, cursor: "pointer" }}>
              {/* <Button
                icon={<Icon source={FilterMajorMonotone} color="base" />}
                // onClick={() => {
                //   setFiltersDrawerVisible(true);
                // }}
              >
                More Filters
              </Button> */}
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
              <Route
                path="/panel/ebay/dashboard"
                render={(props) => {
                  let refresh = false;
                  if (props.location.state) {
                    refresh = props.location.state?.refresh;
                  }
                  return (
                    <FinalDashboard
                      queuedTasks={queuedTasks}
                      refresh={refresh}
                      {...props}
                    />
                  );
                }}
              />
              <Route
                path="/panel/ebay/products"
                component={NewProductsComponent}
              />
              <Route path="/panel/ebay/accounts" component={NewAccountGrid} />
              <Route
                path="/panel/ebay/appaccount"
                render={(props) => (
                  <ShopifyAccount
                    shopifyAccountData={shopifyAccountData}
                    {...props}
                  />
                )}
              />
              <Route path="/panel/ebay/profiles" component={ProfileComponent} />
              <Route path="/panel/ebay/policy" component={PolicyComponent} />
              <Route
                path="/panel/ebay/templates"
                component={TemplateComponent}
              />
              <Route
                path="/panel/ebay/disabledproducts"
                component={DisbaledProductsWrapper}
              />
              <Route path="/panel/ebay/orders" component={OrdersComponent} />
              <Route
                path="/panel/ebay/configurations"
                component={Configuration}
              />
              <Route path="/panel/ebay/message" component={Ebaymessage} />
              <Route
                path="/panel/ebay/pricing"
                render={() => <PlansComponentAnt fromOnBoarding={false} />}
              />
              <Route path="/panel/ebay/activity" component={ActivityGrid} />
              <Route path="/panel/ebay/help" component={EbayHelpComponent} />
              <Route path="/panel/ebay/contactUs" component={ContactUs} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default NewPanel;