import { FilterOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Banner,
  Button,
  Card,
  FooterHelp,
  Icon,
  Link,
  Modal,
  Pagination,
  Stack,
  Tag,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import {
  AlertMinor,
  CircleAlertMajorFilled,
  CircleCancelMinor,
  CircleChevronDownMinor,
  CircleTickMajorFilled,
  CircleTickOutlineMinor,
  ImportMinor,
} from "@shopify/polaris-icons";
import {
  Alert,
  Badge,
  Col,
  Image,
  PageHeader,
  Progress,
  Row,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getAllNotifications } from "../../../../../APIrequests/ActivitiesAPI";
import { notify } from "../../../../../services/notify";
import { Button as AntButton } from "antd";
import {
  allNotificationsURL,
  clearActivitiesURL,
} from "../../../../../URLs/ActivitiesURL";
import FilterComponent from "../../../../AntDesignComponents/FilterComponent";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import PaginationComponent from "../../../../AntDesignComponents/PaginationComponent";
import {
  numberOperatorOptions,
  stringOperatorOptions,
} from "../Products/NewProductsNewFilters";
import { queuedActivities } from "../Products/SampleProductData";
import { debounce } from "../Template/TemplateBody/CategoryTemplatePolarisNew";
import LoaderImage from "../../../../../assets/loader/bannerActivityLoader.gif";
import { tokenExpireValues } from "../../../../../HelperVariables";
const { Title, Text } = Typography;
const filtersFields = [
  {
    label: "Account",
    value: "country",
    searchType: "dropdown",
    inputValue: "",
    operator: "1",
    dataType: "string",
  },
];

const getFitersInitially = () => {
  let tempObj = {};
  filtersFields.forEach((field) => {
    tempObj[field["value"]] = {
      operator: field["operator"],
      value: field["inputValue"],
      label: field["label"],
      dataType: field["dataType"],
    };
    if (field?.["searchType"] === "dropdown") {
      tempObj[field["value"]]["options"] = [];
    }
  });
  return tempObj;
};

const ActivityGrid = (props) => {
  const [gridColumns, setGridColumns] = useState([
    {
      title: "",
      dataIndex: "message",
      key: "message",
      width: "80%",
    },
    {
      title: "",
      dataIndex: "created_at",
      key: "created_at",
    },
    // {
    //   title: "View Report",
    //   dataIndex: "viewReport",
    //   key: "viewReport",
    // },
  ]);
  const [activityGridData, setActivityGridData] = useState([]);
  const [queuedTasks, setQueuedTasks] = useState([]);
  // pagination
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // row selection
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // filters
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
  const [filters, setFilters] = useState(getFitersInitially());
  const [filtersToPass, setFiltersToPass] = useState("");
  const [filterName, setFilterName] = useState("");
  const [selected, setSelected] = useState({
    country: [],
  });

  // loader
  const [gridLoader, setGridLoader] = useState(false);

  // modal
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });
  const [btnLoader, setBtnLoader] = useState(false);

  const [refreshBtnLoader, setRefreshBtnLoader] = useState(false);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };
  const getAlLActivities = (activityData) => {
    let tempActivityData = [];
    tempActivityData = activityData["rows"].map((activity, index) => {
      let tempObject = {};
      tempObject["key"] = index;
      // tempObject["message"] = <Banner
      //     title={activity["message"]}
      //     status={activity["severity"]} />
      tempObject["message"] = (
        <Stack alignment="center" spacing="tight" wrap={false}>
          <>{getSeverityIcon(activity["severity"])}</>
          <>
            {activity["message"].length <= 160 ? (
              activity["message"]
            ) : (
              <Tooltip content={activity["message"]}>
                <div>{`${activity["message"].substring(0, 160)}...`}</div>
              </Tooltip>
            )}
          </>
          {activity["url"] && (
            <Tooltip content={"Download Report"}>
              <div
                style={{ cursor: "pointer", fontSize: "0.25rem" }}
                title="Download Report"
              >
                <Link url={activity["url"]} external>
                  <Icon source={ImportMinor} color={"blueDark"} />
                </Link>
              </div>
            </Tooltip>
          )}
        </Stack>
      );
      tempObject["created_at"] = activity["created_at"];
      // tempObject["viewReport"] = <Link url={activity["url"]}>Report</Link>;
      return tempObject;
    });
    setActivityGridData(tempActivityData);
    setTotalProductsCount(activityData?.count);
  };
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "success":
        return <Icon source={CircleTickMajorFilled} color="success" />;
      case "failed":
        return <Icon source={CircleTickMajorFilled} color="critical" />;
      case "error":
        return <Icon source={CircleAlertMajorFilled} color="critical" />;
      default:
        break;
    }
  };

  const hitRefresh = async () => {
    setRefreshBtnLoader(true);
    await hitGetActivitiesAPI();
    setRefreshBtnLoader(false);
  };

  const hitGetActivitiesAPI = async () => {
    setGridLoader(true);
    const tempFilters = {};
    for (const key in filtersToPass) {
      if (filtersToPass[key]) tempFilters[key] = filtersToPass[key];
    }
    let dataToPost = {
      count: pageSize,
      activePage: activePage,
      // ...filtersToPass,
      ...tempFilters,
    };
    let {
      success: activityDataSuccess,
      data: activityData,
      message,
      code,
    } = await getAllNotifications(allNotificationsURL, dataToPost);
    if (activityDataSuccess) {
      const { queuedTask } = activityData;
      getAlLActivities(activityData);
      getQueuedActivities(queuedTask);
    } else {
      notify.error(message);
      if (tokenExpireValues.includes(code)) props.history.push("/auth/login");
    }
    setGridLoader(false);
  };
  const getQueuedActivities = (tasks) => {
    const queuedTasks = tasks.map((task, index) => {
      return {
        message: task["message"],
        progress: task["progress"],
        id: index,
        progressBar: task["progressBar"] ? task["progressBar"] : false,
      };
    });
    setQueuedTasks(queuedTasks);
  };
  const clearActivitiesAPI = async () => {
    const { success, message } = await getAllNotifications(clearActivitiesURL);
    if (success) {
      notify.success(message);
      // hitGetActivitiesAPI();
    } else {
      notify.error(message);
    }
  };
  useEffect(() => {
    hitGetActivitiesAPI();
  }, [activePage, filtersToPass]);

  useEffect(() => {
    // hitGetActivitiesAPI();
    const activityInterval = setInterval(() => {
      hitGetActivitiesAPI();
    }, 60000);
    return () => {
      clearInterval(activityInterval);
    };
  }, [activePage, filtersToPass]);

  // useEffect(() => {
  //   console.log('called', activePage);
  //   // setInterval(() => {
  //   //   hitGetActivitiesAPI();
  //   // }, 6000);
  // }, []);

  const verify = useCallback(
    debounce((value) => {
      let type = "";
      type = "filter[message][3]";
      let titleFilterObj = {};
      titleFilterObj[type] = value;
      setFiltersToPass({ ...filtersToPass, ...titleFilterObj });
    }, 200),
    [filtersToPass]
  );

  useEffect(() => {
    // if (filterName !== "") {
    verify(filterName);
    // }
  }, [filterName]);

  const renderActivitySearchQuery = () => {
    return (
      <TextField
        value={filterName}
        onChange={(e) => {
          setFilterName(e);
        }}
        placeholder={"Search activity..."}
      />
    );
  };

  const getFieldValue = (field) => {
    switch (field) {
      case "message":
        return "Activity";
      case "country":
        return "Country";
    }
  };

  const getOperatorLabel = (operator) => {
    let findValue = stringOperatorOptions.find(
      (option) => option["value"] === operator
    );
    let value = "";
    if (findValue) {
      value = findValue["label"];
    } else {
      findValue = numberOperatorOptions.find(
        (option) => option["value"] === operator
      );
      value = findValue["label"];
    }
    return value;
  };

  const tagMarkup = () => {
    return Object.keys(filtersToPass).map((filter, index) => {
      if (filtersToPass[filter]) {
        let indexOfFirstOpeningBracket = filter.indexOf("[");
        let indexOfFirstClosingBracket = filter.indexOf("]");
        let indexOfSecondOpeningBracket = filter.indexOf(
          "[",
          indexOfFirstOpeningBracket + 1
        );
        let indexOfSecondClosingBracket = filter.indexOf(
          "]",
          indexOfFirstClosingBracket + 1
        );
        let fieldValue = filter.substring(
          indexOfFirstOpeningBracket + 1,
          indexOfFirstClosingBracket
        );
        let operatorValue = filter.substring(
          indexOfSecondOpeningBracket + 1,
          indexOfSecondClosingBracket
        );
        return (
          <Tag
            key={index}
            onRemove={() => {
              const temp = Object.keys(filtersToPass).reduce((object, key) => {
                if (key !== filter) {
                  object[key] = filtersToPass[key];
                }
                return object;
              }, {});
              let tempObj = { ...filters };
              Object.keys(tempObj).forEach((object) => {
                if (object === fieldValue) {
                  tempObj[object]["value"] = "";
                }
              });
              setFilterName("");
              setFilters(tempObj);
              setFiltersToPass(temp);
              setSelected({ ...selected, [fieldValue]: [] });
            }}
          >
            {getFieldValue(fieldValue)} {getOperatorLabel(operatorValue)}{" "}
            {filtersToPass[filter]}
          </Tag>
        );
      }
    });
  };
  useEffect(() => {
    document.title = "Activity | Integration for eBay";
    document.description = "Activity";
    if(!document.title.includes(localStorage.getItem('shop_url'))) {
      document.title += localStorage.getItem('shop_url') ? " " + localStorage.getItem('shop_url') : "";
    }
  }, []);
  return (
    <PageHeader
      className="site-page-header-responsive"
      title={"Activity"}
      ghost={true}
      // extra={
      //   queuedTasks.length > 0 && [
      //     <Button
      //       key="1"
      //       // type="primary"
      //       primary
      //       onClick={() => {
      //         // hitGetActivitiesAPI();
      //         hitRefresh();
      //       }}
      //       loading={refreshBtnLoader}
      //     >
      //       {" "}
      //       Refresh
      //     </Button>,
      //   ]
      // }
    >
      {queuedTasks.length > 0 && (
        <Card
          sectioned
          title="Currently Running Processes"
          actions={[
            {
              content: (
                <AntButton
                  type="text"
                  key="1"
                  icon={<SyncOutlined style={{ color: "rgb(0 0 0 / 45%)" }} />}
                  onClick={() => {
                    // hitGetActivitiesAPI();
                    hitRefresh();
                  }}
                  loading={refreshBtnLoader}
                >
                  <Text type="secondary">Refresh</Text>
                </AntButton>
              ),
            },
          ]}
        >
          {queuedTasks.length > 0 ? (
            <>
              {/* <Banner
            title={
              "Processes will keep running in background. It may take some time. You can close the app and do any other thing in mean time."
            }
            status="info"
          />
          <br /> */}
              <Stack vertical>
                {queuedTasks.map((task) => {
                  return task["progressBar"] ? (
                    // <Alert message={task["message"]} type="info">
                    <Card.Section title={task["message"]}>
                      <Stack key={task["id"]} alignment="center">
                        <Progress
                          type="circle"
                          percent={Math.floor(task["progress"])}
                          width={50}
                        />
                        <Stack.Item fill>
                          <Stack vertical spacing="extraTight">
                            {/* <>{task["message"]}</> */}
                            <Progress percent={Math.floor(task["progress"])} />
                          </Stack>
                        </Stack.Item>
                      </Stack>
                    </Card.Section>
                  ) : (
                    // {/* </Alert> */}
                    // <img
                    //   width={"100%"}
                    //   style={{borderRadius: '10px'}}
                    //   src={LoaderImage}
                    //   alt=""
                    // />
                    // <Banner title={task["message"]} status="info">
                    <Card.Section title={task["message"]}>
                      <Stack vertical spacing="extraTight">
                        {/* <p>{task["created_at"]}</p> */}
                        <div>
                          Processes will keep running in background. It may take
                          some time.
                        </div>
                        <img
                          width={"100%"}
                          style={{ borderRadius: "15px" }}
                          src={LoaderImage}
                          alt=""
                        />
                        {/* </Banner> */}
                      </Stack>
                    </Card.Section>
                  );
                })}
              </Stack>
              {/* {queuedActivities.map((activity) => {
              return (
                <Row justify="space-around">
                  <Col span={1}>
                    <Progress type="circle" percent={75} width={50} />
                  </Col>
                  <Col span={22}>
                    <Row>
                      <Col span={24}>{activity["message"]}</Col>
                      <Col span={24}>
                        <Progress percent={30} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              );
            })} */}
            </>
          ) : (
            <Alert
              message={"No processes running currently"}
              type="info"
              showIcon
              style={{ marginBottom: "10px" }}
            />
          )}
        </Card>
      )}
      <Card
        sectioned
        title="Recent Activities"
        actions={[
          {
            content: <Button>Clear All Activites</Button>,
            // onAction: clearActivitiesAPI,
            onAction: () => {
              setModal({
                ...modal,
                active: true,
                content: "Clear All Activites",
                actionName: getAllNotifications,
                actionPayload: {},
                api: clearActivitiesURL,
              });
            },
          },
        ]}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Stack wrap>
              <Stack.Item fill>{renderActivitySearchQuery()}</Stack.Item>
              <Stack.Item>
                {/* {renderChoiceListForProfilenameCountry()} */}
              </Stack.Item>
            </Stack>
            <Stack spacing="tight">
              {Object.keys(filtersToPass).length > 0 && tagMarkup()}
            </Stack>
          </div>
        </div>
        <FilterComponent
          setFiltersDrawerVisible={setFiltersDrawerVisible}
          filtersDrawerVisible={filtersDrawerVisible}
          // gatherAllFilters={gatherAllFilters}
          filtersSource={"activities"}
        />
        <NestedTableComponent
          loading={gridLoader}
          size={"small"}
          columns={gridColumns}
          dataSource={activityGridData}
          scroll={{ x: 1000, y: "60vh" }}
          bordered={false}
          pagination={false}
        />
        <br />
        <Stack distribution="center">
          <Pagination
            label="Activities"
            nextTooltip="See more activities"
            previousTooltip="See previous activities"
            hasPrevious={activePage > 1 ? true : false}
            onPrevious={() => {
              setActivePage(activePage - 1);
            }}
            hasNext={activePage * pageSize < totalProductsCount}
            onNext={() => {
              setActivePage(activePage + 1);
            }}
          />
        </Stack>
        {/* <Button onClick={() => setActivePage(activePage+1)}>See More</Button> */}
      </Card>
      <Modal
        open={modal.active}
        onClose={() => setModal({ ...modal, active: false })}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>Are you sure you want to {modal.content} ?</p>
            <Stack distribution="center" spacing="tight">
              <Button onClick={() => setModal({ ...modal, active: false })}>
                Cancel
              </Button>
              <Button
                primary
                loading={btnLoader}
                onClick={async () => {
                  setBtnLoader(true);
                  let { success, message, data } = await modal.actionName(
                    modal.api,
                    modal.actionPayload
                  );
                  if (success) {
                    notify.success(message ? message : data);
                    setModal({ ...modal, active: false });
                    hitGetActivitiesAPI();
                  } else {
                    notify.error(message ? message : data);
                    setModal({ ...modal, active: false });
                  }
                  setBtnLoader(false);
                }}
              >
                OK
              </Button>
            </Stack>
          </Stack>
        </Modal.Section>
      </Modal>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=activities-section-of-the-app-2"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=activities-section-of-the-app-4"
        >
          Activities
        </Link>
      </FooterHelp>
    </PageHeader>
  );
};

export default ActivityGrid;
