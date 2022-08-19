import {
  Card,
  Col,
  Image,
  PageHeader,
  Row,
  TreeSelect,
  Typography,
  List,
  Modal,
  Alert,
} from "antd";
import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import {
  announcementData,
  blogData,
  newsData,
  recentActivities,
} from "./DashboardData";
import { ResponsiveLine } from "@nivo/line";
import CustomZoomIcon from "../CustomIcons/CustomZoomIcon";
import { TextLoop } from "react-text-loop-next";

const { Title } = Typography;

const Ebaydashboard = () => {
  const [productGraphStoreSelected, setProductGraphStoreSelected] =
    useState("All");
  const [orderGraphStoreSelected, setOrderGraphStoreSelected] = useState("All");
  const [profilesModal, setProfilesModal] = useState({
    status: false,
    title: "Create profile to list your productds on eBay",
    gif: "https://apps.cedcommerce.com/integration/static/modules/walmart/assets/images/gif/Profiling.gif",
  });

  const [templatesModal, setTemplatesModal] = useState({
    status: false,
    title: "Create profile to list your productds on eBay",
    gif: "https://apps.cedcommerce.com/integration/static/modules/walmart/assets/images/gif/Profiling.gif",
  });

  const data = [
    {
      id: "Uploaded",
      label: "Uploaded",
      value: 276,
      color: "hsl(266, 70%, 50%)",
    },
    {
      id: "Not Uploaded",
      label: "Not Uploaded",
      value: 381,
      color: "hsl(145, 70%, 50%)",
    },
    {
      id: "Error",
      label: "Error",
      value: 276,
      color: "hsl(266, 70%, 50%)",
    },
    {
      id: "Ended",
      label: "Ended",
      value: 381,
      color: "hsl(145, 70%, 50%)",
    },
  ];

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

  const orderData = [
    {
      id: "Fulfilled",
      label: "Fulfilled",
      value: 276,
      color: "hsl(266, 70%, 50%)",
    },
    {
      id: "Unfulfilled",
      label: "Unfulfilled",
      value: 381,
      color: "hsl(145, 70%, 50%)",
    },
    {
      id: "Cancelled",
      label: "Cancelled",
      value: 276,
      color: "hsl(266, 70%, 50%)",
    },
    {
      id: "Failed",
      label: "Failed",
      value: 381,
      color: "hsl(145, 70%, 50%)",
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

  useEffect(() => {
    // console.log("productGraphStoreSelected", productGraphStoreSelected);
  }, [productGraphStoreSelected]);

  useEffect(() => {
    // console.log("orderGraphStoreSelected", orderGraphStoreSelected);
  }, [orderGraphStoreSelected]);

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
                size="small"
                style={{ borderRadius: "8px" }}
                bodyStyle={{ padding: "10px 20px 10px 20px" }}
                className="hoverCss"
              >
                <TabsComponent
                  tabContents={{
                    Products: (
                      <Row
                        gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}
                        wrap={true}
                      >
                        <Col sm={16}>
                          <div style={{ height: "250px" }}>
                            <ResponsivePie
                              data={data}
                              margin={{
                                top: 40,
                                right: 80,
                                bottom: 80,
                                left: 80,
                              }}
                              innerRadius={0.5}
                              // padAngle={0.7}
                              padAngle={2}
                              cornerRadius={3}
                              activeOuterRadiusOffset={8}
                              borderWidth={1}
                              borderColor={{
                                from: "color",
                                modifiers: [["darker", 0.2]],
                              }}
                              arcLinkLabelsSkipAngle={10}
                              arcLinkLabelsTextColor="#333333"
                              arcLinkLabelsThickness={2}
                              arcLinkLabelsColor={{ from: "color" }}
                              arcLabelsSkipAngle={10}
                              arcLabelsTextColor={{
                                from: "color",
                                modifiers: [["darker", 2]],
                              }}
                              defs={[
                                {
                                  id: "dots",
                                  type: "patternDots",
                                  background: "inherit",
                                  color: "rgba(255, 255, 255, 0.3)",
                                  size: 4,
                                  padding: 1,
                                  stagger: true,
                                },
                                {
                                  id: "lines",
                                  type: "patternLines",
                                  background: "inherit",
                                  color: "rgba(255, 255, 255, 0.3)",
                                  rotation: -45,
                                  lineWidth: 6,
                                  spacing: 10,
                                },
                              ]}
                              fill={[
                                {
                                  match: {
                                    id: "ruby",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "c",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "go",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "python",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "scala",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "lisp",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "elixir",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "javascript",
                                  },
                                  id: "lines",
                                },
                              ]}
                              legends={[
                                {
                                  anchor: "bottom",
                                  direction: "row",
                                  justify: false,
                                  translateX: 0,
                                  translateY: 56,
                                  itemsSpacing: 0,
                                  itemWidth: 100,
                                  itemHeight: 18,
                                  itemTextColor: "#999",
                                  itemDirection: "left-to-right",
                                  itemOpacity: 1,
                                  symbolSize: 18,
                                  symbolShape: "circle",
                                  effects: [
                                    {
                                      on: "hover",
                                      style: {
                                        itemTextColor: "#000",
                                      },
                                    },
                                  ],
                                },
                              ]}
                            />
                          </div>
                        </Col>
                        <Col sm={8}>
                          <CountryTreeSelectComponent
                            setGraphStoreSelected={setProductGraphStoreSelected}
                            GraphStoreSelected={productGraphStoreSelected}
                          />
                        </Col>
                      </Row>
                    ),
                    Orders: (
                      <Row
                        gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}
                        wrap={true}
                      >
                        <Col sm={16}>
                          <div style={{ height: "250px" }}>
                            <ResponsivePie
                              data={orderData}
                              margin={{
                                top: 40,
                                right: 80,
                                bottom: 80,
                                left: 80,
                              }}
                              innerRadius={0.5}
                              // padAngle={0.7}
                              padAngle={2}
                              cornerRadius={3}
                              activeOuterRadiusOffset={8}
                              borderWidth={1}
                              borderColor={{
                                from: "color",
                                modifiers: [["darker", 0.2]],
                              }}
                              arcLinkLabelsSkipAngle={10}
                              arcLinkLabelsTextColor="#333333"
                              arcLinkLabelsThickness={2}
                              arcLinkLabelsColor={{ from: "color" }}
                              arcLabelsSkipAngle={10}
                              arcLabelsTextColor={{
                                from: "color",
                                modifiers: [["darker", 2]],
                              }}
                              defs={[
                                {
                                  id: "dots",
                                  type: "patternDots",
                                  background: "inherit",
                                  color: "rgba(255, 255, 255, 0.3)",
                                  size: 4,
                                  padding: 1,
                                  stagger: true,
                                },
                                {
                                  id: "lines",
                                  type: "patternLines",
                                  background: "inherit",
                                  color: "rgba(255, 255, 255, 0.3)",
                                  rotation: -45,
                                  lineWidth: 6,
                                  spacing: 10,
                                },
                              ]}
                              fill={[
                                {
                                  match: {
                                    id: "ruby",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "c",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "go",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "python",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "scala",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "lisp",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "elixir",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "javascript",
                                  },
                                  id: "lines",
                                },
                              ]}
                              legends={[
                                {
                                  anchor: "bottom",
                                  direction: "row",
                                  justify: false,
                                  translateX: 0,
                                  translateY: 56,
                                  itemsSpacing: 0,
                                  itemWidth: 100,
                                  itemHeight: 18,
                                  itemTextColor: "#999",
                                  itemDirection: "left-to-right",
                                  itemOpacity: 1,
                                  symbolSize: 18,
                                  symbolShape: "circle",
                                  effects: [
                                    {
                                      on: "hover",
                                      style: {
                                        itemTextColor: "#000",
                                      },
                                    },
                                  ],
                                },
                              ]}
                            />
                          </div>
                        </Col>
                        <Col sm={8}>
                          <CountryTreeSelectComponent
                            setGraphStoreSelected={setOrderGraphStoreSelected}
                            GraphStoreSelected={orderGraphStoreSelected}
                          />
                        </Col>
                      </Row>
                    ),
                    GMV: (
                      <Row
                        gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}
                        wrap={true}
                      >
                        <Col sm={24}>
                          <div style={{ height: "250px" }}>
                            <ResponsiveLine
                              curve="cardinal"
                              data={orderRevenueData}
                              margin={{
                                top: 50,
                                right: 110,
                                bottom: 50,
                                left: 60,
                              }}
                              xScale={{ type: "point" }}
                              yScale={{
                                type: "linear",
                                min: "auto",
                                max: "auto",
                                stacked: true,
                                reverse: false,
                              }}
                              enableSlices={false}
                              yFormat=" >-.2f"
                              axisTop={null}
                              axisRight={null}
                              axisBottom={{
                                orient: "bottom",
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "transportation",
                                legendOffset: 36,
                                legendPosition: "middle",
                              }}
                              axisLeft={{
                                orient: "left",
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "count",
                                legendOffset: -40,
                                legendPosition: "middle",
                              }}
                              pointSize={10}
                              pointColor={{ theme: "background" }}
                              pointBorderWidth={2}
                              pointBorderColor={{ from: "serieColor" }}
                              pointLabelYOffset={-12}
                              useMesh={true}
                              legends={[
                                {
                                  anchor: "bottom-right",
                                  direction: "column",
                                  justify: false,
                                  translateX: 100,
                                  translateY: 0,
                                  itemsSpacing: 0,
                                  itemDirection: "left-to-right",
                                  itemWidth: 80,
                                  itemHeight: 20,
                                  itemOpacity: 0.75,
                                  symbolSize: 12,
                                  symbolShape: "circle",
                                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                                  effects: [
                                    {
                                      on: "hover",
                                      style: {
                                        itemBackground: "rgba(0, 0, 0, .03)",
                                        itemOpacity: 1,
                                      },
                                    },
                                  ],
                                },
                              ]}
                            />
                          </div>
                        </Col>
                      </Row>
                    ),
                    "Available Credits": (
                      <Row
                        gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}
                        wrap={true}
                      >
                        <Col sm={24}>
                          <div style={{ height: "250px" }}>
                            <ResponsivePie
                              data={availableCreditsData}
                              margin={{
                                top: 40,
                                right: 80,
                                bottom: 80,
                                left: 80,
                              }}
                              innerRadius={0.5}
                              // padAngle={0.7}
                              padAngle={2}
                              cornerRadius={3}
                              activeOuterRadiusOffset={8}
                              borderWidth={1}
                              borderColor={{
                                from: "color",
                                modifiers: [["darker", 0.2]],
                              }}
                              arcLinkLabelsSkipAngle={10}
                              arcLinkLabelsTextColor="#333333"
                              arcLinkLabelsThickness={2}
                              arcLinkLabelsColor={{ from: "color" }}
                              arcLabelsSkipAngle={10}
                              arcLabelsTextColor={{
                                from: "color",
                                modifiers: [["darker", 2]],
                              }}
                              defs={[
                                {
                                  id: "dots",
                                  type: "patternDots",
                                  background: "inherit",
                                  color: "rgba(255, 255, 255, 0.3)",
                                  size: 4,
                                  padding: 1,
                                  stagger: true,
                                },
                                {
                                  id: "lines",
                                  type: "patternLines",
                                  background: "inherit",
                                  color: "rgba(255, 255, 255, 0.3)",
                                  rotation: -45,
                                  lineWidth: 6,
                                  spacing: 10,
                                },
                              ]}
                              fill={[
                                {
                                  match: {
                                    id: "ruby",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "c",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "go",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "python",
                                  },
                                  id: "dots",
                                },
                                {
                                  match: {
                                    id: "scala",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "lisp",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "elixir",
                                  },
                                  id: "lines",
                                },
                                {
                                  match: {
                                    id: "javascript",
                                  },
                                  id: "lines",
                                },
                              ]}
                              legends={[
                                {
                                  anchor: "bottom",
                                  direction: "row",
                                  justify: false,
                                  translateX: 0,
                                  translateY: 56,
                                  itemsSpacing: 0,
                                  itemWidth: 100,
                                  itemHeight: 18,
                                  itemTextColor: "#999",
                                  itemDirection: "left-to-right",
                                  itemOpacity: 1,
                                  symbolSize: 18,
                                  symbolShape: "circle",
                                  effects: [
                                    {
                                      on: "hover",
                                      style: {
                                        itemTextColor: "#000",
                                      },
                                    },
                                  ],
                                },
                              ]}
                            />
                          </div>
                        </Col>
                      </Row>
                    ),
                  }}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={<Title level={5}>Profiling</Title>}
                size="small"
                style={{ borderRadius: "8px" }}
                // bodyStyle={{ height: "80px" }}
                className="hoverCss"
              >
                <Row align="middle" gutter={2} style={{ height: "100%" }}>
                  <Col span={20} style={{ height: "100%" }}>
                    Profiling is required to list your products on Walmart.com
                    in the appropriate category. Check out the latest updates we
                    have done in Profiling.
                  </Col>
                  <Col
                    span={4}
                    style={{ height: "100%", position: "relative" }}
                  >
                    <Image
                      width={"100%"}
                      height={"100%"}
                      src={
                        "https://apps.cedcommerce.com/integration/static/modules/walmart/assets/images/gif/Profiling.gif"
                      }
                      preview={false}
                      style={{ display: "block" }}
                    />
                    <CustomZoomIcon
                      passedState={profilesModal}
                      passedSetState={setProfilesModal}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={<Title level={5}>Templates</Title>}
                size="small"
                style={{ borderRadius: "8px" }}
                // bodyStyle={{ height: "80px" }}
                className="hoverCss"
              >
                <Row align="middle" gutter={2} style={{ height: "100%" }}>
                  <Col span={20} style={{ height: "100%" }}>
                    Profiling is required to list your products on Walmart.com
                    in the appropriate category. Check out the latest updates we
                    have done in Profiling.
                  </Col>
                  <Col
                    span={4}
                    style={{ height: "100%" }}
                    style={{ height: "100%", position: "relative" }}
                  >
                    <Image
                      width={"100%"}
                      height={"100%"}
                      src={
                        "https://apps.cedcommerce.com/integration/static/modules/walmart/assets/images/gif/Profiling.gif"
                      }
                      preview={false}
                      style={{ display: "block" }}
                    />
                    <CustomZoomIcon
                      passedState={templatesModal}
                      passedSetState={setTemplatesModal}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Card
                title="Recent Activities"
                extra={<a>View All</a>}
                bordered={true}
                size="small"
                style={{ borderRadius: "8px" }}
                className="hoverCss"
              >
                <List
                  size="small"
                  dataSource={recentActivities.reverse().slice(0, 2)}
                  renderItem={(activity) => (
                    <List.Item>{activity.message}</List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
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

export default Ebaydashboard;

const { TreeNode } = TreeSelect;

export const CountryTreeSelectComponent = ({
  setGraphStoreSelected,
  GraphStoreSelected,
}) => {
  const onChange = (e) => {
    setGraphStoreSelected(e);
  };
  return (
    <TreeSelect
      showSearch
      style={{ width: "100%" }}
      value={GraphStoreSelected}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Please select store"
      allowClear
      treeDefaultExpandAll
      onChange={onChange}
    >
      <TreeNode value="All" title="All" />
      <TreeNode value="US" title={"US"} disabled>
        <TreeNode value="US-1" title="US-1" />
        <TreeNode value="US-2" title="US-2" />
      </TreeNode>
      <TreeNode value="UK" title={"UK"} disabled>
        <TreeNode value="UK-1" title="UK-1" />
        <TreeNode value="UK-2" title="UK-2" />
        <TreeNode value="UK-3" title="UK-3" />
      </TreeNode>
      <TreeNode value="India" title={"India"} disabled>
        <TreeNode value="India-1" title="India-1" />
        <TreeNode value="India-2" title="India-2" />
        <TreeNode value="India-3" title="India-3" />
        <TreeNode value="India-4" title="India-4" />
        <TreeNode value="India-5" title="India-5" />
      </TreeNode>
    </TreeSelect>
  );
};

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
