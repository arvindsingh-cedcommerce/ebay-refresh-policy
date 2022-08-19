import {
  // Card,
  Col,
  Image,
  PageHeader,
  Row,
  TreeSelect,
  Typography,
  List,
  Modal,
  Alert,
  Select as AntSelect,
  Progress
} from "antd";
import React, { useEffect, useState } from "react";
import { announcementData, blogData, newsData } from "./DashboardData";
import { TextLoop } from "react-text-loop-next";
import { getDashboardData } from "../../../../../APIrequests/DashboardAPI";
import { Line, RingProgress, Column, Sunburst } from '@ant-design/plots';
import {
  dashboardURL,
  orderAnalyticsURL,
  productAnalyticsURL,
} from "../../../../../URLs/DashboardURL";
import { Banner, Select, Card, Stack, Link, DisplayText } from "@shopify/polaris";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import { getCountryName } from "../../../Accounts/NewAccountGrid";
import { getSiteID } from "../../../Accounts/NewAccount";
import { getAllNotifications } from "../../../../../APIrequests/ActivitiesAPI";
import { allNotificationsURL } from "../../../../../URLs/ActivitiesURL";
import { notify } from "../../../../../services/notify";

const { Title } = Typography;
const data=[
  {
    "name": "Account1",
    "year": "2000",
    "orderCount": 44
  },
  {
    "name": "Account1",
    "year": "2001",
    "orderCount": 22
  },
  {
    "name": "Account1",
    "year": "2002",
    "orderCount": 10
  },
  {
    "name": "Account1",
    "year": "2003",
    "orderCount": 25
  },
  {
    "name": "Account1",
    "year": "2004",
    "orderCount": 60
  },
  {
    "name": "Account1",
    "year": "2005",
    "orderCount": 45
  },
  {
    "name": "Account1",
    "year": "2006",
    "orderCount": 23
  },
  {
    "name": "Account1",
    "year": "2007",
    "orderCount": 46
  },
  {
    "name": "Account1",
    "year": "2008",
    "orderCount": 17
  },
  {
    "name": "Account1",
    "year": "2009",
    "orderCount": 35
  },
  {
    "name": "Account1",
    "year": "2010",
    "orderCount": 45
  },
  {
    "name": "Account1",
    "year": "2011",
    "orderCount": 65
  },
  {
    "name": "Account1",
    "year": "2012",
    "orderCount": 75
  },
  {
    "name": "Account22",
    "year": "2000",
    "orderCount": 10
  },
  {
    "name": "Account22",
    "year": "2001",
    "orderCount": 15
  },
  {
    "name": "Account22",
    "year": "2002",
    "orderCount": 18
  },
  {
    "name": "Account22",
    "year": "2003",
    "orderCount": 25
  },
  {
    "name": "Account22",
    "year": "2004",
    "orderCount": 35
  },
  {
    "name": "Account22",
    "year": "2005",
    "orderCount": 20
  },
  {
    "name": "Account22",
    "year": "2006",
    "orderCount": 40
  },
  {
    "name": "Account22",
    "year": "2007",
    "orderCount": 25
  },
  {
    "name": "Account22",
    "year": "2008",
    "orderCount": 20
  },
  {
    "name": "Account22",
    "year": "2009",
    "orderCount": 35
  },
  {
    "name": "Account22",
    "year": "2010",
    "orderCount": 45
  },
  {
    "name": "Account22",
    "year": "2011",
    "orderCount": 50
  },
  {
    "name": "Account22",
    "year": "2012",
    "orderCount": 55
  },
  {
    "name": "Account333",
    "year": "2000",
    "orderCount": 15
  },
  {
    "name": "Account333",
    "year": "2001",
    "orderCount": 18
  },
  {
    "name": "Account333",
    "year": "2002",
    "orderCount": 25
  },
  {
    "name": "Account333",
    "year": "2003",
    "orderCount": 30
  },
  {
    "name": "Account333",
    "year": "2004",
    "orderCount": 20
  },
  {
    "name": "Account333",
    "year": "2005",
    "orderCount": 50
  },
  {
    "name": "Account333",
    "year": "2006",
    "orderCount": 55
  },
  {
    "name": "Account333",
    "year": "2007",
    "orderCount": 65
  },
  {
    "name": "Account333",
    "year": "2008",
    "orderCount": 70
  },
  {
    "name": "Account333",
    "year": "2009",
    "orderCount": 55
  },
  {
    "name": "Account333",
    "year": "2010",
    "orderCount": 45
  },
  {
    "name": "Account333",
    "year": "2011",
    "orderCount": 38
  },
  {
    "name": "Account333",
    "year": "2012",
    "orderCount": 32
  },
  {
    "name": "Account4444",
    "year": "2000",
    "orderCount": 11
  },
  {
    "name": "Account4444",
    "year": "2001",
    "orderCount": 22
  },
  {
    "name": "Account4444",
    "year": "2002",
    "orderCount": 31
  },
  {
    "name": "Account4444",
    "year": "2003",
    "orderCount": 43
  },
  {
    "name": "Account4444",
    "year": "2004",
    "orderCount": 27
  },
  {
    "name": "Account4444",
    "year": "2005",
    "orderCount": 38
  },
  {
    "name": "Account4444",
    "year": "2006",
    "orderCount": 44
  },
  {
    "name": "Account4444",
    "year": "2007",
    "orderCount": 59
  },
  {
    "name": "Account4444",
    "year": "2008",
    "orderCount": 65
  },
  {
    "name": "Account4444",
    "year": "2009",
    "orderCount": 75
  },
  {
    "name": "Account4444",
    "year": "2010",
    "orderCount": 80
  },
  {
    "name": "Account4444",
    "year": "2011",
    "orderCount": 82
  },
  {
    "name": "Account4444",
    "year": "2012",
    "orderCount": 85
  }
]

const SunburstData={
  name: "root",
  children: [
    {
      name: "Account1",
      children: [
        {
          name: "Uploaded",
          value: 12
        },
        {
          name: "Not Uploaded",
          value: 5
        },
        {
          name: "Unpublished",
          value: 9
        }
      ]
    },
    {
      name: "Account22",
      children: [
        {
          name: "Uploaded",
          value: 15
        },
        {
          name: "Not Uploaded",
          value: 10
        },
        {
          name: "Unpublished",
          value: 5
        }
      ]
    },
    {
      name: "Account333",
      children: [
        {
          name: "Uploaded",
          value: 12
        },
        {
          name: "Not Uploaded",
          value: 8
        },
        {
          name: "Unpublished",
          value: 7
        }
      ]
    }
  ]
}

const DashboardPolaris = () => {
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);

  const [profilesModal, setProfilesModal] = useState({
    status: false,
    title: "Create profile to list your productds on eBay",
    gif: "https://apps.cedcommerce.com/integration/static/modules/walmart/assets/images/gif/Profiling.gif",
  });

  // product analytics data
  const [productAnalyticsData, setProductAnalyticsData] = useState([]);
  const [productGraphStoreSelected, setProductGraphStoreSelected] = useState();
  const [productAnalyticsShopId, setProductAnalyticsShopId] = useState("");

  // order analytics data
  const [orderAnalyticsData, setOrderAnalyticsData] = useState([]);
  const [orderGraphStoreSelected, setOrderGraphStoreSelected] = useState();
  const [orderAnalyticsShopId, setOrderAnalyticsShopId] = useState("");

  // activities
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    productAnalyticsShopId && getProductAnalyticsData();
  }, [productAnalyticsShopId]);

  useEffect(() => {
    orderAnalyticsShopId && getOrderAnalyticsData();
  }, [orderAnalyticsShopId]);

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

  const getProductAnalyticsData = async () => {
    let postData = {};
    if (productAnalyticsShopId) {
      postData = {
        shop_id: productAnalyticsShopId,
      };
    }
    // let {} = await getDashboardData(dashboardURL);
    let { success, productAnalytics } = await getDashboardData(
      productAnalyticsURL,
      postData
    );
    if (success) {
      let productData = [];
      Object.keys(productAnalytics).forEach((status) => {
        let temp = {};
        temp["id"] = status;
        temp["label"] = status;
        temp["value"] = productAnalytics[status];
        temp["color"] = "hsl(266, 70%, 50%)";
        productData.push(temp);
      });
      setProductAnalyticsData(productData);
    }
  };

  const getOrderAnalyticsData = async () => {
    let postData = {};
    if (orderAnalyticsShopId) {
      postData = {
        shop_id: orderAnalyticsShopId,
      };
    }
    let { success, orderAnalytics } = await getDashboardData(
      orderAnalyticsURL,
      postData
    );
    if (success) {
      let orderData = [];
      Object.keys(orderAnalytics).forEach((status) => {
        let temp = {};
        temp["id"] = status;
        temp["label"] = status;
        temp["value"] = orderAnalytics[status];
        temp["color"] = "hsl(266, 70%, 50%)";
        orderData.push(temp);
      });
      setOrderAnalyticsData(orderData);
    }
  };

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );

      let tempArr = ebayAccounts.map((account, key) => {
        let accountName = {
          // label: `${getCountryName(account["warehouses"][0]["site_id"])}-${
          //   account["warehouses"][0]["user_id"]
          // }`,
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
              <>{account["warehouses"][0]["user_id"]}</>
            </Stack>
          ),
          value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          siteID: account["warehouses"][0]["site_id"],
          shopId: account["id"],
        };
        return accountName;
      });
      // tempArr.unshift({ label: "All", value: "all" });
      setconnectedAccountsArray([...tempArr]);
      setProductGraphStoreSelected(tempArr[0]["value"]);
      setOrderGraphStoreSelected(tempArr[0]["value"]);
    } else {
      notify.error(message);
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
      let { rows } = data;
      let temp = rows.map((row) => {
        let testObj = {};
        if (row.hasOwnProperty("message") && row["message"] !== null) {
          testObj["message"] =
            typeof row["message"] === "object"
              ? row["message"]["message"]
              : row["message"];
          testObj["createdAt"] = row["created_at"];
          testObj["severity"] = row["severity"];
          testObj["url"] = row?.["url"];
        }
        return testObj;
      });
      setAllNotifications(temp);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
    hitGetNotifications();
  }, []);

  const orderRevenueData = [
    {
      id: "japan",
      color: "hsl(213, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 37,
        },
        {
          x: "helicopter",
          y: 260,
        },
        {
          x: "boat",
          y: 138,
        },
        {
          x: "train",
          y: 98,
        },
        {
          x: "subway",
          y: 220,
        },
        {
          x: "bus",
          y: 171,
        },
        {
          x: "car",
          y: 14,
        },
        {
          x: "moto",
          y: 12,
        },
        {
          x: "bicycle",
          y: 275,
        },
        {
          x: "horse",
          y: 44,
        },
        {
          x: "skateboard",
          y: 297,
        },
        {
          x: "others",
          y: 290,
        },
      ],
    },
    {
      id: "france",
      color: "hsl(64, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 140,
        },
        {
          x: "helicopter",
          y: 92,
        },
        {
          x: "boat",
          y: 40,
        },
        {
          x: "train",
          y: 265,
        },
        {
          x: "subway",
          y: 277,
        },
        {
          x: "bus",
          y: 217,
        },
        {
          x: "car",
          y: 45,
        },
        {
          x: "moto",
          y: 136,
        },
        {
          x: "bicycle",
          y: 185,
        },
        {
          x: "horse",
          y: 98,
        },
        {
          x: "skateboard",
          y: 66,
        },
        {
          x: "others",
          y: 63,
        },
      ],
    },
  ];

  const availableCreditsData = [
    {
      id: "Products",
      label: "Products",
      value: 276,
      color: "hsl(266, 70%, 50%)",
    },
    {
      id: "Orders",
      label: "Orders",
      value: 381,
      color: "hsl(145, 70%, 50%)",
    },
  ];

  const config={
    data,
    xField: 'year',
    yField: 'orderCount',
    seriesField: 'name',
    yAxis: {
      label: {
        formatter: (v) => v,
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 3000,
      }
    } 
  }

  // const RingconfigProducts = {
  //   height: 100,
  //   width: 100,
  //   autoFit: false,
  //   percent: 0.7,
  //   color: ['#5B8FF9', '#E8EDF3'],
  // };

  // const RingconfigOrders = {
  //   height: 100,
  //   width: 100,
  //   autoFit: false,
  //   percent: 0.4,
  //   color: ['#5B8FF9', '#E8EDF3'],
  // };

  // const RingconfigAccounts = {
  //   height: 100,
  //   width: 100,
  //   autoFit: false,
  //   statusbar:"xyz",
  //   percent: 0.4,
  //   color: ['#5B8FF9', '#E8EDF3'],
  // };

  const configSunBurst = {
    data:SunburstData,
    innerRadius: 0.3,
    label:{
      layout:[
        {
          value: 'interval-adjust-position',
        }
      ]
    },
    theme: {
        colors10: [
          '#FF6B3B',
          '#626681',
          '#FFC100',
          '#9FB40F',
          '#76523B',
          '#DAD5B5',
          '#0E8E89',
          '#E19348',
          '#F383A2',
          '#247FEA',
        ]
    },
    legend: {
      position: 'top',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ]
  };

  const configStackedBar = {
    data,
    isStack: true,
    xField: 'year',
    yField: 'orderCount',
    seriesField: 'name',
    label: {
      position: 'middle',
      layout: [
        {
          name: 'interval-adjust-position',
        },
        {
          name: 'interval-hide-overlap',
        },
        {
          name: 'adjust-color',
        },
      ],
    },
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      ghost={true}
      style={{ padding: "0px 10px 10px 10px" }}
    >
      <Row gutter={[8, 0]}>
        <Col span={16}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Card
                sectioned
                size="small"
                style={{ borderRadius: "8px" }}
                bodyStyle={{ padding: "10px 20px 10px 20px" }}
                className="hoverCss"
              >
              <Stack vertical={false} distribution="fill">
                 <Card title="Connected Accounts" bordered={false}>
                   <Stack distribution="center"><div style={{marginTop:"20px",marginBottom:"10px"}}><Progress type="circle" width={80} format={() => "4/6"} percent={66} strokeWidth={8}/></div></Stack>
                  </Card>
                  <Card title="Product Credits Used" bordered={false}>
                  <Stack distribution="center"><div style={{marginTop:"20px",marginBottom:"10px"}}><Progress type="circle" width={80} percent={70} strokeWidth={8}/></div></Stack>
                  </Card>
                  <Card title="Order Credits Used" bordered={false}>
                  <Stack distribution="center"><div style={{marginTop:"20px",marginBottom:"10px"}}><Progress type="circle" width={80} percent={40} strokeWidth={8}/></div></Stack>
                  </Card>
              </Stack>
              </Card>
            </Col>
            <Col span={24}>
              <Card
                sectioned
                title={<Title level={5}>Order Counts of Accounts based on Year</Title>}
                size="small"
                style={{ borderRadius: "8px" }}
                className="hoverCss"
              >
                <Line height={200} {...config} />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                sectioned
                title={<Title level={5}>Revenue of Accounts based on Year</Title>}
                size="small"
                style={{ borderRadius: "8px" }}
                className="hoverCss"
              >
              <Column height={200} {...configStackedBar} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Card
                sectioned
                title="Product Counts"
                extra={<a>View All</a>}
                bordered={true}
                size="small"
                style={{ borderRadius: "8px" }}
                className="hoverCss"
              >
                {/* {allNotifications
                  // reverse().
                  .slice(0, 2)
                  .map((activity) => {
                    return (
                      <Banner
                        title={activity["message"]}
                        status={activity["severity"]}
                      >
                        <Stack vertical>
                          <>{activity["createdAt"]}</>
                          {activity["url"] && (
                            <Link url={activity["url"]}>View Report</Link>
                          )}
                        </Stack>
                      </Banner>
                    );
                  })} */}

                  <Sunburst {...configSunBurst} />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                sectioned
                title="Announcements"
                bordered={true}
                size="small"
                style={{ borderRadius: "8px" }}
                className="hoverCss"
              >
                <Alert
                  banner
                  message={
                    <TextLoop
                      mask
                      interval={3000}
                      delay={1}
                      noWrap={false}
                      springConfig={{ stiffness: 180, damping: 8 }}
                    >
                      {announcementData.map((data) => {
                        return (
                          <div>{`${data["date"]}- ${data["title"]}: ${data["content"]}`}</div>
                        );
                      })}
                    </TextLoop>
                  }
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                sectioned
                title="News"
                extra={<a>View All</a>}
                size="small"
                style={{ borderRadius: "8px" }}
                className="hoverCss"
              >
                <List
                  size="small"
                  dataSource={newsData.reverse().slice(0, 2)}
                  renderItem={(news) => (
                    <List.Item>
                      <React.Fragment>
                        <Row>
                          <Col span={24}>
                            <Typography.Text>{news.title}</Typography.Text>
                          </Col>
                        </Row>
                      </React.Fragment>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                sectioned
                title="Blogs"
                extra={<a>View All</a>}
                size="small"
                style={{ borderRadius: "8px" }}
                className="hoverCss"
              >
                <List
                  size="small"
                  dataSource={blogData.reverse().slice(0, 2)}
                  renderItem={(blogs) => (
                    <List.Item>
                      <React.Fragment>
                        <Row>
                          <Col span={24}>
                            <Typography.Text>{blogs.title}</Typography.Text>
                          </Col>
                        </Row>
                      </React.Fragment>
                    </List.Item>
                  )}
                />
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

export default DashboardPolaris;

const { TreeNode } = TreeSelect;

export const TestModalComponent = ({ passedState, passedSetState }) => {
  return (
    <Modal
      title={passedState["title"]}
      visible={passedState["status"]}
      // onOk={handleOk}
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
