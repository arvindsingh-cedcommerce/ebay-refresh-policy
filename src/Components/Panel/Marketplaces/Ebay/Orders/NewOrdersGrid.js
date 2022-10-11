import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  Menu,
  PageHeader,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import React, { useState, useEffect, useCallback } from "react";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import ModalComponent from "../../../../AntDesignComponents/ModalComponent";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import { getCountryName, getSiteID } from "../../../Accounts/NewAccount";
import {
  getOrders,
  importOrders,
  massAction,
} from "../../../../../APIrequests/OrdersAPI";
import {
  cancelOrdersURl,
  deleteOrdersURL,
  getOrdersURL,
  importOrdersURL,
  removeOrdersURL,
  syncShipmentURL,
} from "../../../../../URLs/OrdersURL";
import PaginationComponent from "../../../../AntDesignComponents/PaginationComponent";
import { operatorOptions } from "../../../../AntDesignComponents/FilterComponent";
import { notify } from "../../../../../services/notify";
import {
  Stack,
  Tag as PolarisTag,
  Badge as PolarisBadge,
  Card,
  Button as ShopifyButton,
  TextField,
  ButtonGroup,
  Popover,
  ChoiceList,
  Icon,
  Modal,
  TextContainer,
  Banner,
  Badge,
  Tooltip,
} from "@shopify/polaris";
import { FilterMajorMonotone, QuestionMarkMinor } from "@shopify/polaris-icons";
import { debounce } from "../Template/TemplateBody/CategoryTemplatePolarisNew";
import NewFilterComponentSimilarPolaris from "../Products/NewFilterComponentSimilarPolaris";
import { stringOperatorOptions } from "../Products/NewProductsNewFilters";
import OrderMassMenu from "../Products/OrderMassMenu";
import NewFilterComponentSimilarPolarisOrders from "./NewFilterComponentSimilarPolarisOrders";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../../../../APIrequests/DashboardAPI";
import { dashboardAnalyticsURL } from "../../../../../URLs/DashboardURL";

const { Text } = Typography;
let demo = {
  syncShipment: {
    status: false,
    title: "Sync Shipment",
  },
  removeForApp: {
    status: false,
    title: "Remove for App",
  },
  cancel: {
    status: false,
    title: "Cancel eBay Order",
  },
  delete: {
    status: false,
    title: "Delete Shopify Order",
  },
};

const importOrderFilterOptions = [
  // { label: "Days", value: "days" },
  { label: "Order Ids", value: "orderIds" },
  { label: "Order Created At", value: "orderCreatedAt" },
  { label: "Order Modified At", value: "orderModifiedAt" },
];

const filtersFields = [
  // {
  //   label: "eBay Order Id",
  //   value: "source_order_id",
  //   searchType: "textField",
  //   inputValue: "",
  //   operator: "3",
  // },
  {
    label: "Shopify Order Name",
    value: "shopify_order_name",
    searchType: "textField",
    inputValue: "",
    operator: "3",
    dataType: "string",
  },
  {
    label: "Shopify Order Id",
    value: "target_order_id",
    searchType: "textField",
    inputValue: "",
    operator: "3",
    dataType: "string",
  },
  // {
  //   label: "Customer Name",
  //   // value: "client_details.name",
  //   value: "customer.first_name",
  //   searchType: "textField",
  //   inputValue: "",
  //   operator: "3",
  //   dataType: "string",
  // },
];

export const getFitersInitially = () => {
  let tempObj = {};
  filtersFields.forEach((field) => {
    tempObj[field["value"]] = {
      operator: field["operator"],
      value: field["inputValue"],
      label: field["label"],
      dataType: field["dataType"],
    };
  });
  return tempObj;
};
const NewOrdersGrid = (props) => {
  const reduxState = useSelector((state) => {
    return state.orderFilterReducer.reduxFilters;
  });
  const dispatch = useDispatch();

  const [tab, setTab] = useState("0");
  const [orderColumns, setOrderColumns] = useState([
    {
      title: (
        <center>
          <Text>eBay Order ID</Text>
        </center>
      ),
      dataIndex: "eBayOrderId",
      key: "eBayOrderId",
      fixed: "left",
    },
    {
      title: (
        <center>
          <Text>Account Connected</Text>
        </center>
      ),
      dataIndex: "accountConnected",
      key: "accountConnected",
    },
    {
      title: (
        <center>
          <Text>Order Status</Text>
        </center>
      ),
      dataIndex: "fulfillment",
      key: "fulfillment",
    },
    {
      title: (
        <center>
          <Text>Shopify Order Name</Text>
        </center>
      ),
      dataIndex: "shopifyOrderName",
      key: "shopifyOrderName",
    },
    {
      title: (
        <center>
          <Text>Shopify Order ID</Text>
        </center>
      ),
      dataIndex: "shopifyOrderId",
      key: "shopifyOrderId",
    },
    // {
    //   title: (
    //     <center>
    //       <Text>Customer Name</Text>
    //     </center>
    //   ),
    //   dataIndex: "customerName",
    //   key: "customerName",
    // },
    {
      title: (
        <center>
          <Text>Imported At</Text>
        </center>
      ),
      dataIndex: "importedAt",
      key: "importedAt",
    },
    {
      title: (
        <center>
          <Text>Date Created At</Text>
        </center>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ]);
  const [orderData, setOrderData] = useState([]);
  const [
    importEbayOrderMoreFilterCheckbox,
    setImportEbayOrderMoreFilterCheckbox,
  ] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [massActionsOptions, setMassActionsOptions] = useState([]);
  const [massActionsModal, setMassActionsModal] = useState([]);
  const [massActionSelected, setMassActionSelected] = useState("");

  // accounts state
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);

  // import filter
  const [siteID, setSiteID] = useState("");
  const [shopId, setShopId] = useState("");
  const [importEbayOrdersModal, setImportEbayOrdersModal] = useState(false);
  const [selectedImportedOrderFilter, setSelectedImportedOrderFilter] =
    useState("orderIds");
  const [numberOfDatesForSync, setNumberOfDatesForSync] = useState(1);
  const [multipleOrderIds, setMultipleOrderIds] = useState("");
  const [orderCreatedAtStartDate, setOrderCreatedAtStartDate] = useState("");
  const [orderCreatedAtEndDate, setOrderCreatedAtEndDate] = useState("");
  const [orderModifiedAtStartDate, setOrderModifiedAtStartDate] = useState("");
  const [orderModifiedAtEndDate, setOrderModifiedAtEndDate] = useState("");

  // pagination

  const [activePage, setActivePage] = useState(1);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  // const [pageSizeOptions, setPageSizeOptions] = useState([1, 2, 3]);
  const [pageSize, setPageSize] = useState(25);
  // const [pageSize, setPageSize] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  // filters
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
  const [filters, setFilters] = useState(getFitersInitially());
  const [filtersToPass, setFiltersToPass] = useState("");

  // const [filters, setFilters] = useState({});
  // const [filtersText, setFiltersText] = useState([]);
  // const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
  const [filtersChecked, setFiltersChecked] = useState(false);
  const [gridLoader, setGridLoader] = useState(false);

  // filters
  const [ebayOrderId, setEbayOrderId] = useState("");
  const [popOverStatus, setPopOverStatus] = useState({
    country: false,
    status: false,
  });
  const [selected, setSelected] = useState({
    country: [],
    status: [],
  });
  const [status, setStatus] = useState([
    { label: "Unfulfilled", value: "unfulfilled" },
    { label: "Fulfilled", value: "fulfilled" },
    { label: "Failed", value: "failed" },
    { label: "Cancelled", value: "cancelled" },
  ]);
  const [filterTitleORsku, setFilterTitleORsku] = useState("");

  // loader
  const [syncBtnLoader, setSyncBtnLoader] = useState(false);

  // error msg
  const [targetMsg, setTargetMsg] = useState({
    show: false,
    msg: "",
    id: "",
  });

  // order credits
  const [orderCredits, setOrderCredits] = useState({
    available: "",
    total: "",
  });

  const getAllOrders = (ordersData) => {
    let tempOrderData = [];
    tempOrderData = ordersData["rows"].map((order, index) => {
      let trackingNumberArray = [];
      let trackingURLArray = [];
      let shippedDateArray = [];
      let targetStatus = "";
      let progressBarStatus = "";
      switch (order?.target_status.toLowerCase()) {
        case "fulfilled":
          targetStatus = "success";
          progressBarStatus = "complete";
          break;
        case "unfulfilled":
          targetStatus = "warning";
          progressBarStatus = "incomplete";
          break;
        case "refunded":
          targetStatus = "attention";
          progressBarStatus = "partiallyComplete";
          break;
        case "cancelled":
          targetStatus = "attention";
          progressBarStatus = "partiallyComplete";
          break;
        case "failed":
          targetStatus = "critical";
          break;
        case "error":
          targetStatus = "critical";
          break;
        default:
          break;
      }
      shippedDateArray = order?.["fulfillments"]?.map(
        (fulfillment) => fulfillment?.created_at
      );
      trackingNumberArray = order?.["fulfillments"]?.map(
        (fulfillment) => fulfillment?.tracking_number
      );
      trackingURLArray = order?.["fulfillments"]?.map(
        (fulfillment) => fulfillment?.tracking_url
      );
      let tempObject = {};
      tempObject["key"] = index;
      tempObject["eBayOrderId"] = (
        <center>
          <Text
            strong
            onClick={(e) => {
              return props.history.push(
                `/panel/ebay/orders/vieworders?id=${order["source_order_id"]}`
              );
            }}
            style={{ cursor: "pointer" }}
          >
            {order["source_order_id"]}
            <Text
              copyable={{
                text: order["source_order_id"],
              }}
            />
          </Text>
        </center>
      );
      tempObject["shopId"] = order["shop_id"];
      tempObject["shopifyOrderName"] = (
        <center>
          {order["shopify_order_name"] ? (
            <>
              {order["shopify_order_name"]}
              <Text
                copyable={{
                  text: order["shopify_order_name"],
                }}
              />
            </>
          ) : (
            "-"
          )}{" "}
        </center>
      );
      tempObject["shopifyOrderId"] = (
        <center>
          {order["target_order_id"] ? (
            <>
              {order["target_order_id"]}
              <Text
                copyable={{
                  text: order["target_order_id"],
                }}
              />
            </>
          ) : (
            "-"
          )}
        </center>
      );
      tempObject["ebayOrderId1"] = order["source_order_id"];
      tempObject["shopifyOrderId1"] = order["target_order_id"];
      tempObject["accountConnected"] = (
        <center>
          <Image
            preview={false}
            width={25}
            src={
              order["site_id"] &&
              require(`../../../../../assets/flags/${order["site_id"]}.png`)
            }
            style={{ borderRadius: "50%" }}
          />
        </center>
      );
      tempObject["targetErrorMessage"] = order["target_error_message"];
      tempObject["orderStatus"] = ["error", "failed"].includes(
        order?.target_status
      )
        ? order?.target_status
        : order?.target_status;
      tempObject["fulfillment"] = (
        <center
          onClick={() =>
            order?.["target_error_message"] &&
            setTargetMsg({
              show: true,
              msg: order["target_error_message"],
              id: order["source_order_id"],
            })
          }
          style={{ cursor: "pointer" }}
        >
          <PolarisBadge status={targetStatus} progress={progressBarStatus}>
            {["error", "failed"].includes(order?.target_status) ? (
              <div
                style={{ cursor: "pointer", borderBottom: "2px solid black" }}
              >
                Failed
              </div>
            ) : (
              order?.target_status.slice(0, 1).toUpperCase() +
              order?.target_status.slice(1)
            )}
          </PolarisBadge>
        </center>
      );
      tempObject["customerName"] = (
        <center>{order["customer"]?.["first_name"]}</center>
      );
      tempObject["importedAt"] = <center>{order["imported_at"]}</center>;
      tempObject["createdAt"] = <center>{order["created_at"]}</center>;
      tempObject["shippedDate"] = shippedDateArray?.map(
        (shippedDate) => shippedDate
      );
      tempObject["trackingNumber"] = trackingNumberArray?.map(
        (trackingNumber) => trackingNumber
      );
      tempObject["trackingURL"] = trackingURLArray?.map(
        (trackingURL) => trackingURL
      );
      return tempObject;
    });
    setOrderData(tempOrderData);
  };

  const hitGetOrdersAPI = async () => {
    setGridLoader(true);
    let filterPostData = {};
    for (const key in filtersToPass) {
      if (key === "filter[country][1]") {
        let matchedAccoount = connectedAccountsArray.find(
          (connectedAccount) =>
            connectedAccount["value"] === filtersToPass["filter[country][1]"]
        );
        filterPostData["filter[shop_id][1]"] = matchedAccoount?.["shopId"];
      } else if (key === "filter[status][1]") {
        filterPostData["filter[target_status][1]"] =
          filtersToPass["filter[status][1]"];
      } else {
        filterPostData[key] = filtersToPass[key];
      }
    }
    let postData = {
      count: pageSize,
      activePage: activePage,
      markteplace: "ebay",
      // ...filters,
      // ...filtersToPass,
      ...filterPostData,
    };
    if (filtersToPass && Object.keys(filtersToPass).length) {
      postData["activePage"] = 1;
    }
    let { success: ordersDataSuccess, data: ordersData } = await getOrders(
      getOrdersURL,
      postData
    );
    if (ordersDataSuccess) {
      setTotalOrdersCount(ordersData.count);
      getAllOrders(ordersData);
    }
    setGridLoader(false);
  };

  useEffect(() => {
    hitGetOrdersAPI();
  }, [activePage, pageSize, filtersToPass]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(selectedRows)
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };
  // useEffect(() => {
  //   console.log(selectedRows);
  // }, [selectedRows])

  useEffect(() => {
    let test = [];
    Object.keys(demo).forEach((massAction) => {
      if (massAction === massActionSelected) {
        test.push({ ...demo[massAction], status: true });
      }
    });
    setMassActionsModal(test);
  }, [massActionSelected]);

  const hitDashoboardAPI = async () => {
    let { success, data } = await getDashboardData(dashboardAnalyticsURL);
    if (success) {
      const { available_credits, total_used_credits, service_credits } =
        data?.planDetails?.orderCredits?.prepaid;
      let temp = { ...orderCredits };
      temp["available"] = available_credits;
      temp["total"] = service_credits;
      setOrderCredits(temp);
    }
  };

  useEffect(() => {
    document.title = "Orders | Integration for eBay";
    document.description =
      "Order section helps you to keep a track of your orders (Fulfilled/Unfulfilled/Failed/Cancelled). It updates you about each new order received on eBay.";
    getAllConnectedAccounts();
    hitDashoboardAPI();
  }, []);

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
          label: (
            <Stack alignment="fill" spacing="tight">
              <Image
                preview={false}
                width={18}
                src={
                  account["warehouses"][0]["site_id"] &&
                  require(`../../../../../assets/flags/${account["warehouses"][0]["site_id"]}.png`)
                }
                style={{ borderRadius: "50%" }}
              />
              <>{account["warehouses"][0]["user_id"]}</>
            </Stack>
          ),
          value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          siteID: account["warehouses"][0]["site_id"],
          shopId: account["id"],
          disabled:
            account["warehouses"][0]["status"] === "inactive" ? true : false,
        };
        return accountName;
      });

      setconnectedAccountsArray(tempArr);
    } else {
      notify.error(message);
      props.history.push("/auth/login");
    }
  };

  const getLabelForFilter = () => {
    return importOrderFilterOptions.filter(
      (option) => option["value"] === selectedImportedOrderFilter
    )[0]["label"];
  };

  const gatherAllFilters = () => {
    let temp = {};
    Object.keys(filters).forEach((filter) => {
      if (filters[filter]["value"]) {
        temp[`filter[${filter}][${filters[filter]["operator"]}]`] =
          filters[filter]["value"];
      }
    });
    let filtersToPassTemp = { ...filtersToPass };
    if (Object.keys(filtersToPassTemp).length) {
      for (const key in filtersToPassTemp) {
        for (const key1 in temp) {
          if (key.split("[")[1] === key1.split("[")[1]) {
            delete filtersToPassTemp[key];
          }
        }
      }
    }
    if (Object.keys(temp).length > 0) {
      setFiltersToPass({ ...filtersToPassTemp, ...temp });
    } else {
      notify.warn("No filters applied");
    }
  };

  const getFormElement = () => {
    let returnFormElement = <></>;
    switch (selectedImportedOrderFilter) {
      case "orderIds":
        returnFormElement = (
          <Input
            value={multipleOrderIds}
            onChange={(e) => setMultipleOrderIds(e.target.value)}
            placeholder="multiple order IDs allow in ,(comma) separated form"
          />
        );
        break;
      case "orderCreatedAt":
        returnFormElement = (
          <Row gutter={16}>
            <Col span={12}>
              <>From</>
              <Input
                placeholder="Start Date"
                type={"date"}
                value={orderCreatedAtStartDate}
                onChange={(e) => {
                  setOrderCreatedAtStartDate(e.target.value);
                }}
              />
            </Col>
            <Col span={12}>
              <>To</>
              <Input
                placeholder="End Date"
                type={"date"}
                value={orderCreatedAtEndDate}
                onChange={(e) => {
                  setOrderCreatedAtEndDate(e.target.value);
                }}
              />
            </Col>
          </Row>
        );
        break;
      case "orderModifiedAt":
        returnFormElement = (
          <Row gutter={16}>
            <Col span={12}>
              <>From</>
              <Input
                placeholder="Start Date"
                type={"date"}
                value={orderModifiedAtStartDate}
                onChange={(e) => {
                  setOrderModifiedAtStartDate(e.target.value);
                }}
              />
            </Col>
            <Col span={12}>
              <>To</>
              <Input
                placeholder="End Date"
                type={"date"}
                value={orderModifiedAtEndDate}
                onChange={(e) => {
                  setOrderModifiedAtEndDate(e.target.value);
                }}
              />
            </Col>
          </Row>
        );
        break;
      default:
        break;
    }
    return returnFormElement;
  };

  const getDisabledSync = () => {
    let disabledValue = !selectedAccount;
    return disabledValue;
  };

  useEffect(() => {
    if (selectedAccount) {
      let { siteID, shopId } = getSiteID(
        selectedAccount,
        connectedAccountsArray
      );
      setSiteID(siteID);
      setShopId(shopId);
    }
  }, [selectedAccount]);

  const hitDesiredAPI = async (value) => {
    let shopifyOrdersIdsToPost = selectedRows.map(
      (selectedRow) => selectedRow["shopifyOrderId"]
    );
    let ebayOrdersIdsToPost = selectedRows.map((selectedRow) => {
      return {
        order_id: selectedRow["ebayOrderId1"],
        shop_id: selectedRow["shopId"],
      };
    });
    switch (value) {
      case "Sync Shipment":
        let {} = await massAction(syncShipmentURL, {
          order_ids: shopifyOrdersIdsToPost,
        });
        break;
      case "Remove for App":
        let {} = await massAction(removeOrdersURL, {
          order_ids: ebayOrdersIdsToPost,
        });
        break;
      case "Cancel eBay Order":
        let {} = await massAction(cancelOrdersURl, {
          order_ids: ebayOrdersIdsToPost,
        });
        break;
      case "Delete Shopify Order":
        let {} = await massAction(deleteOrdersURL, {
          order_ids: shopifyOrdersIdsToPost,
        });
        break;
      default:
        break;
    }
  };

  const getFieldValue = (field) => {
    switch (field) {
      case "country":
        return "Account";
      case "source_order_id":
        return "Ebay Order Id";
      case "status":
        return "Order Status";
      default:
        return filtersFields.find((option) => option["value"] === field)?.[
          "label"
        ];
    }
  };
  const getOperatorLabel = (operator) => {
    return operatorOptions.find((option) => option["value"] === operator)[
      "label"
    ];
  };
  const tagMarkup = () => {
    return Object.keys(filtersToPass).map((filter, index) => {
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
        <PolarisTag
          key={filter}
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
            // setFilterTitleORsku("");
            // setEbayOrderId("");
            ["source_order_id"].includes(fieldValue) && setEbayOrderId("");
            setFilters(tempObj);
            setFiltersToPass(temp);
            setSelected({ ...selected, [fieldValue]: [] });
          }}
        >
          {getFieldValue(fieldValue)} {getOperatorLabel(operatorValue)}{" "}
          {filtersToPass[filter]}
        </PolarisTag>
      );
    });
  };

  const verify = useCallback(
    debounce((value) => {
      let type = "";
      // if (ebayOrderId) {
      type = "filter[source_order_id][3]";
      // } else {
      //   type = "filter[sku][3]";
      // }
      let ebayOrderIdFilterObj = {};
      ebayOrderIdFilterObj[type] = value;
      if (ebayOrderIdFilterObj[type] !== "") {
        setFiltersToPass({ ...filtersToPass, ...ebayOrderIdFilterObj });
      } else if (filtersToPass.hasOwnProperty("filter[source_order_id][3]")) {
        let temp = { ...filtersToPass };
        delete temp["filter[source_order_id][3]"];
        setFiltersToPass(temp);
      }
      // setFiltersToPass({ ...filtersToPass, ...ebayOrderIdFilterObj });
    }, 200),
    [filtersToPass]
  );
  useEffect(() => {
    // if (ebayOrderId !== "") {
    verify(ebayOrderId);
    // }
  }, [ebayOrderId]);
  const renderEbayOrderId = () => {
    return (
      <TextField
        value={ebayOrderId}
        onChange={(e) => {
          setEbayOrderId(e);
        }}
        placeholder={"Search with ebay order id"}
      />
    );
  };
  const popOverHandler = (type) => {
    let temp = { ...popOverStatus };
    temp[type] = !popOverStatus[type];
    setPopOverStatus(temp);
  };
  const countryActivator = (
    <ShopifyButton disclosure onClick={() => popOverHandler("country")}>
      Account
    </ShopifyButton>
  );
  const statusActivator = (
    <ShopifyButton disclosure onClick={() => popOverHandler("status")}>
      Status
    </ShopifyButton>
  );
  const handleChange = (value, selectedType) => {
    let type = `filter[${selectedType}][1]`;
    let filterObj = {};
    filterObj[type] = value[0];
    setFiltersToPass({ ...filtersToPass, ...filterObj });
    setSelected({ ...selected, [selectedType]: value });
  };
  const renderOtherFilters = () => {
    return (
      <Stack wrap>
        <ButtonGroup segmented>
          <Popover
            active={popOverStatus["country"]}
            activator={countryActivator}
            onClose={() => popOverHandler("country")}
          >
            <div style={{ margin: "10px" }}>
              <ChoiceList
                choices={connectedAccountsArray}
                selected={selected["country"]}
                onChange={(value) => handleChange(value, "country")}
              />
            </div>
          </Popover>
          <Popover
            active={popOverStatus["status"]}
            activator={statusActivator}
            onClose={() => popOverHandler("status")}
          >
            <div style={{ margin: "10px" }}>
              <ChoiceList
                choices={status}
                selected={selected["status"]}
                onChange={(value) => handleChange(value, "status")}
              />
            </div>
          </Popover>
        </ButtonGroup>
        <ShopifyButton
          icon={<Icon source={FilterMajorMonotone} color="base" />}
          onClick={() => {
            setFiltersDrawerVisible(true);
          }}
        >
          More Filters
        </ShopifyButton>
      </Stack>
    );
  };
  const rowSelectionFunc = () => {
    return {
      type: selectionType,
      ...rowSelection,
    };
  };
  useEffect(() => {
    if (filtersToPass) {
      dispatch({ type: "orderFilter", payload: filtersToPass });
    }
  }, [filtersToPass]);
  useEffect(() => {
    if (reduxState && connectedAccountsArray.length) {
      setFiltersToPass(reduxState);
    }
  }, [connectedAccountsArray]);
  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Orders"
      ghost={true}
      subTitle={
        orderCredits.total && (
          <Badge>
            <Text strong>
              <Stack spacing="extraTight" alignment="center">
                <>{`${orderCredits.available}/${orderCredits.total} order credits available`}</>
                <div style={{ cursor: "pointer" }}>
                  <Tooltip content="1 Order credit means 1 eBay Order can be managed from Shopify through the app">
                    <Icon source={QuestionMarkMinor} />
                  </Tooltip>
                </div>
              </Stack>
            </Text>
          </Badge>
        )
      }
      extra={[
        // <OrderMassMenu
        //   selectedRows={selectedRows}
        //   setSelectedRows={setSelectedRows}
        //   setSelectedRowKeys={setSelectedRowKeys}
        //   hitGetOrdersAPI={hitGetOrdersAPI}
        //   rowSelectionPassed={rowSelectionFunc}
        // />,
        <ShopifyButton primary onClick={() => setImportEbayOrdersModal(true)}>
          Import eBay Order(s)
        </ShopifyButton>,
      ]}
    >
      <Banner status={"info"}>
        <ul>
          <li>
            New Order(s), whose payment has been done, is synced from eBay to
            Shopify within 30 minutes.
          </li>
          <li>
            For syncing old order(s){" "}
            <span
              style={{ color: "#0000FF", cursor: "pointer" }}
              onClick={() => {
                props.history.push("/panel/ebay/contactUs");
              }}
            >
              contact us
            </span>
            .
          </li>
          <li>
            It is recommended that sellers must fulfill orders after 1 hour of
            their creation.
          </li>
        </ul>
      </Banner>
      <br />
      <Card sectioned>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Stack wrap>
              <Stack.Item fill>{renderEbayOrderId()}</Stack.Item>
              <Stack.Item>{renderOtherFilters()}</Stack.Item>
            </Stack>
            <Stack spacing="tight">
              {filtersToPass &&
                Object.keys(filtersToPass).length > 0 &&
                tagMarkup()}
            </Stack>
          </div>
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            justify="space-between"
            style={{ marginBottom: 10 }}
          >
            <Col className="gutter-row" span={6}>
              {/* <ProductMassMenu selectedRows={selectedRows} /> */}
              <OrderMassMenu
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                setSelectedRowKeys={setSelectedRowKeys}
                hitGetOrdersAPI={hitGetOrdersAPI}
                rowSelectionPassed={rowSelectionFunc}
              />
            </Col>
            <Col className="gutter-row" span={18}>
              <Stack distribution="trailing">
                <PaginationComponent
                  totalCount={totalOrdersCount}
                  pageSizeOptions={pageSizeOptions}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  size={"default"}
                  simple={false}
                />
              </Stack>
            </Col>
          </Row>
        </div>
        <NestedTableComponent
          pagination={false}
          columns={orderColumns}
          dataSource={orderData}
          // rowSelection={{
          //   type: selectionType,
          //   ...rowSelection,
          // }}
          rowSelection={rowSelectionFunc()}
          scroll={{
            x: 1500,
            y: 500,
          }}
          loading={gridLoader}
        />
      </Card>
      <NewFilterComponentSimilarPolarisOrders
        setFiltersDrawerVisible={setFiltersDrawerVisible}
        filtersDrawerVisible={filtersDrawerVisible}
        filters={filters}
        stringOperatorOptions={stringOperatorOptions}
        // numberOperatorOptions={numberOperatorOptions}
        setFilters={setFilters}
        gatherAllFilters={gatherAllFilters}
        setFiltersToPass={setFiltersToPass}
        setFilterTitleORsku={setEbayOrderId}
        setSelected={setSelected}
      />
      <ModalComponent
        title={massActionsModal.length && massActionsModal[0]["title"]}
        isModalVisible={
          massActionsModal.length && massActionsModal[0]["status"]
        }
        handleCancel={() => setMassActionsModal(false)}
        handleOk={() => {
          hitDesiredAPI(massActionsModal[0]["title"]);
          setMassActionsModal(false);
        }}
        modalContent={
          <Row justify="center" align="middle" gutter={0}>
            <Col span={24}>You have selected {selectedRows.length} Orders</Col>
            <Col span={24}>
              Do you want to Sync their Status on App from Shopify?
            </Col>
          </Row>
        }
      />
      <Modal
        open={targetMsg.show}
        onClose={() => setTargetMsg({ show: false, msg: "", id: "" })}
        title={`Order ID: ${targetMsg.id}`}
      >
        <Modal.Section>
          <Banner status="critical">{targetMsg.msg}</Banner>
        </Modal.Section>
      </Modal>
      <ModalComponent
        title="Import Orders"
        isModalVisible={importEbayOrdersModal}
        handleCancel={() => {
          setImportEbayOrdersModal(false);
          setSelectedAccount(null);
        }}
        handleOk={() => {}}
        modalContent={
          <>
            <Stack vertical distribution="center">
              <Form
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Select Account"
                  name="accounts"
                  rules={[
                    { required: true, message: "Please select your account!" },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    onChange={(accountValue) => {
                      setSelectedAccount(accountValue);
                    }}
                    value={selectedAccount}
                    options={connectedAccountsArray}
                    placeholder="Select to add account"
                  />
                </Form.Item>
                <Row gutter={{ sm: 8 }}>
                  <Col>
                    <Checkbox
                      checked={filtersChecked}
                      onChange={() => setFiltersChecked(!filtersChecked)}
                      disabled={!selectedAccount}
                    />
                  </Col>
                  <Col>
                    <p>Filters</p>
                  </Col>
                </Row>
                {selectedAccount && filtersChecked && (
                  <Form.Item name="filters">
                    <Radio.Group
                      onChange={(e) => {
                        setSelectedImportedOrderFilter(e.target.value);
                      }}
                      value={selectedImportedOrderFilter}
                      options={importOrderFilterOptions}
                      defaultValue={"orderIds"}
                    />
                  </Form.Item>
                )}
                {selectedAccount &&
                  filtersChecked &&
                  selectedImportedOrderFilter && (
                    <Form.Item
                      label={getLabelForFilter()}
                      name={getLabelForFilter()}
                      rules={[
                        { required: true, message: "Please select any option" },
                      ]}
                    >
                      {getFormElement()}
                    </Form.Item>
                  )}
              </Form>
              <Stack distribution="center">
                <ShopifyButton
                  primary
                  // key="back"
                  onClick={async () => {
                    setSyncBtnLoader(true);
                    let postData = {
                      shop_id: String(shopId),
                      site_id: Number(siteID),
                    };
                    if (filtersChecked) {
                      switch (selectedImportedOrderFilter) {
                        case "orderIds":
                          postData["order_ids"] = multipleOrderIds;
                          break;
                        case "orderCreatedAt":
                          postData["create_time_from"] =
                            orderCreatedAtStartDate;
                          postData["create_time_to"] = orderCreatedAtEndDate;
                          break;
                        case "orderModifiedAt":
                          postData["mod_time_from"] = orderModifiedAtStartDate;
                          postData["mod_time_to"] = orderModifiedAtEndDate;
                          break;
                        default:
                          break;
                      }
                    }
                    let { success, message } = await importOrders(
                      importOrdersURL,
                      postData
                    );
                    if (success) {
                      notify.success(message);
                    } else {
                      notify.error(message);
                    }
                    setSyncBtnLoader(false);
                    setImportEbayOrdersModal(false);
                    hitGetOrdersAPI();
                  }}
                  disabled={getDisabledSync()}
                  loading={syncBtnLoader}
                >
                  Import
                </ShopifyButton>
              </Stack>
            </Stack>
          </>
        }
      />
    </PageHeader>
  );
};

export default NewOrdersGrid;
