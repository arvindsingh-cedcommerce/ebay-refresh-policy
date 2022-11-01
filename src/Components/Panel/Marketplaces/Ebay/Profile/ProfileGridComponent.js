import {
  Stack,
  Button as ShopifyButton,
  TextField,
  Tag,
  ChoiceList,
  Popover,
  Card,
  Icon,
  TextStyle,
  Tooltip,
  Banner,
  ButtonGroup,
  Button,
  Link,
  FooterHelp,
  Badge,
  Modal,
} from "@shopify/polaris";
import { FilterMajorMonotone } from "@shopify/polaris-icons";
import {
  Alert,
  Col,
  Divider,
  Image,
  Input,
  List,
  PageHeader,
  Row,
  Select,
  Typography,
} from "antd";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import { getProfiles } from "../../../../../APIrequests/ProfilesAPI";
import { getpaginationInfo } from "../../../../../services/helperFunction";
import { notify } from "../../../../../services/notify";
import { prepareChoiceoption } from "../../../../../Subcomponents/Aggrid/gridHelper";
import { showingGridRange } from "../../../../../Subcomponents/Aggrid/showgridrange";
import { getProfilesURLFilter } from "../../../../../URLs/ProfilesURL";
import BasicPaginationComponent from "../../../../AntDesignComponents/BasicPaginationComponent";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import PaginationComponent from "../../../../AntDesignComponents/PaginationComponent";
import { profileGifs } from "../Help/gifHelper";
import { mappingShopIDwithCountry } from "../Orders/SampleOrderData";
import NewFilterComponentSimilarPolaris from "../Products/NewFilterComponentSimilarPolaris";
import {
  numberOperatorOptions,
  stringOperatorOptions,
} from "../Products/NewProductsNewFilters";
import { getCountyrName } from "../Template/Components/TemplateGridComponent";
import { getCountryName } from "../Template/Components/TemplatesType/CategoryTemplateComponent";
import { debounce } from "../Template/TemplateBody/CategoryTemplatePolarisNew";
import ActionPopoverProfileGrid from "./ActionPopoverProfileGrid";
import {
  filterConditions,
  filterOptions,
  pageSizeOptionProfile,
} from "./ebayprofilehelper";

const { Text } = Typography;

export const filtersFields = [
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

const ProfileGridComponent = (props) => {
  const reduxState = useSelector(
    (state) => state.profileFilterReducer.reduxFilters
  );
  const dispatch = useDispatch();
  let initialMoreFiltersObj = {};
  const { Option } = Select;
  const checkValueHandler = (arr, filterName) => {
    let countryValue = "";
    Object.keys(arr).filter((item, index) => {
      let indexOfFirstOpeningBracket = item.indexOf("[");
      let indexOfFirstClosingBracket = item.indexOf("]");
      const mainItem = item.substring(
        indexOfFirstOpeningBracket + 1,
        indexOfFirstClosingBracket
      );
      if (mainItem === filterName) {
        countryValue = item;
        return;
      }
    });
    return countryValue;
  };
  const initialCountryValue =
    reduxState[checkValueHandler(reduxState, "country")];

  const profileGridColumns = [
    {
      title: <center>Name</center>,
      dataIndex: "profileName",
      key: "name",
    },
    {
      title: <center>Account(s)</center>,
      dataIndex: "profileConnectedAccount",
      key: "account",
    },
    {
      title: <center>Query</center>,
      dataIndex: "profileQuery",
      key: "profileQuery",
    },
    {
      title: <center>Product Count</center>,
      dataIndex: "productCount",
      key: "productCount",
    },
    {
      title: <center>Actions</center>,
      key: "action",
      dataIndex: "templateAction",
      fixed: "right",
      width: 100,
      render: (text, record) => {
        return (
          <Stack distribution="equalSpacing" alignment="leading">
            <ActionPopoverProfileGrid
              record={record}
              getAllProfiles={getAllProfiles}
            />
          </Stack>
        );
      },
    },
  ];
  const [allProfiles, setAllProfiles] = useState([]);
  const [filterCollapsible, setFilterCollapsibles] = useState(false);
  const [jumpToActivePage, setJumpToActivePage] = useState(0);
  const [filtersProps, setFiltersProps] = useState({
    attributeoptions: [],
    filters: [],
    filterCondition: filterConditions,
  });
  // const [paginationProps, setPaginationProps] = useState({
  //   pageSizeOptions: pageSizeOptionProfile,
  //   activePage: 1,
  //   pageSize: pageSizeOptionProfile[0],
  //   pages: 0,
  //   totalrecords: 0,
  // });

  const [gridLoader, setGridLoader] = useState(false);

  // countries
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);

  // filters
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
  const [filters, setFilters] = useState(getFitersInitially());

  const [searchWithProfileName, setSearchWithProfileName] = useState(true);
  const [filterNameORQuery, setFilterNameORQuery] = useState("");

  const [filtersToPass, setFiltersToPass] = useState("");
  // const [searchWithProfileName, setSearchWithProfileName] = useState(true);
  const [filterProfileNameORQuery, setFilterProfileNameORQuery] = useState("");
  const [popOverStatus, setPopOverStatus] = useState({
    country: false,
  });
  const [selected, setSelected] = useState({
    country: [],
  });

  // pagination
  const [activePage, setActivePage] = useState(1);
  const [pageSizeOptions, setPageSizeOptions] = useState([5, 10, 20]);
  const [responsivePageSizeOptions, setResponsivePageSizeOptions] = useState([
    { label: " 5 / page ", value: 5 },
    { label: " 10 / page ", value: 10 },
    { label: " 20 / page ", value: 20 },
  ]);

  // const [pageSizeOptions, setPageSizeOptions] = useState([1,2]);
  // const [pageSize, setPageSize] = useState(5);
  const [pageSize, setPageSize] = useState(5);

  const [prevPage, setPrevPage] = useState(1);
  const [totalShippingPolicyCount, setTotalShippingPolicyCount] = useState(0);

  // modal video
  const [isOpenModalVideo, setIsOpenModalVideo] = useState(false);
  // gif modal
  const [isOpenGifModal, setIsOpenGifModal] = useState({
    active: false,
    title: "",
    url: "",
  });

  const handleSelectChange = useCallback((value) => {
    setPageSize(value);

    getAllProfiles(activePage, value);
  }, []);

  useEffect(() => {
    if (filtersToPass && activePage > 1 && activePage !== prevPage) {
      getAllProfiles(1, pageSize);
      setActivePage(1);
    } else if (filtersToPass) {
      getAllProfiles(activePage, pageSize);
    }
  }, [filtersToPass]);

  const filterData = (componentFilters) => {
    let temp = { ...filtersProps };
    temp["filters"] = [...componentFilters];
    setFiltersProps(temp);
  };

  const getFlag = (country) => {
    let testArr = Object.keys(mappingShopIDwithCountry).filter((siteId) => {
      return mappingShopIDwithCountry[siteId] === country;
    });
    return testArr[0];
  };
  const showTotal = (total, range) => {
    if (range[0] > range[1]) {
      range[0] = 1;
    }
    if (range[1] > total) {
      range[1] = totalShippingPolicyCount;
    }
    if (totalShippingPolicyCount)
      return (
        <div
          style={{ display: "flex", justifyContent: "end", fontWeight: "bold" }}
        >{`Showing ${range[0]}-${range[1]} of ${total} Profile(s)`}</div>
      );
  };
  const showJumpToPage = () => {
    return (
      <Input
        style={{ width: "6rem" }}
        value={jumpToActivePage ? jumpToActivePage : ""}
        onChange={(e) => {
          setJumpToActivePage(Number(e.target.value));
        }}
        onPressEnter={(e) => {
          let numOfPages = totalShippingPolicyCount / pageSize;
          if (totalShippingPolicyCount % pageSize > 0) {
            numOfPages += 1;
          }
          if (jumpToActivePage > 0 && jumpToActivePage <= numOfPages) {
            setActivePage(jumpToActivePage);
            setPrevPage(activePage);
            getAllProfiles(jumpToActivePage, pageSize);
          }
        }}
      />
    );
  };
  const getAccounts = async () => {
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
            <Stack alignment="center" spacing="tight">
              <>{getCountyrName(account["warehouses"][0]["site_id"])}</>
              <>{account["warehouses"][0]["user_id"]}</>
            </Stack>
          ),
          value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          siteID: account["warehouses"][0]["site_id"],
          status: account["warehouses"][0]["status"],
          shopId: account["id"],
          image: getCountyrName(account["warehouses"][0]["site_id"]),
        };
        return accountName;
      });
      let temp = { ...filters };
      temp["country"]["options"] = tempArr;
      setFilters(temp);
      setconnectedAccountsArray(tempArr);
    } else {
      notify.error(message);
      props.history.push("/auth/login");
    }
  };

  const extractShopIDs = (data) => {
    let shopIds = [];
    for (const key in data) {
      const { shops } = data[key];
      for (const shopid in shops) {
        shopIds.push(Number(shopid));
      }
    }
    let status = "active";
    connectedAccountsArray.forEach((account) => {
      if (
        shopIds.includes(account["shopId"]) &&
        account["status"] === "inactive"
      ) {
        status = "inactive";
      }
    });
    return status;
  };

  const callAfterAPI = (success, data, message, count) => {
    if (success) {
      let { rows, count: totalRecords } = data;
      // let paginationInformation = getpaginationInfo(totalRecords, count);
      // let tempPaginationProps = {
      //   ...paginationProps,
      //   ...paginationInformation,
      // };

      let tempProfilesArray = [];
      if (rows.length) {
        // let { rows } = data;
        rows.forEach((row) => {
          let tempProfilesObj = {};
          let test;
          if (row.target) {
            test = Object.keys(row?.target).map((country) => getFlag(country));
            tempProfilesObj["productCount"] = (
              <center>
                {row["product_count"] == 0 ? (
                  <Text type="danger">{row["product_count"]}</Text>
                ) : (
                  row["product_count"]
                )}
              </center>
            );
            tempProfilesObj["productCountValue"] = row["product_count"];
            tempProfilesObj["accountStatus"] = extractShopIDs(row.target);
            tempProfilesObj["profileName"] = (
              <center>
                <Text
                  strong
                  onClick={(e) => {
                    if (row["profile_id"]) {
                      return props.history.push(
                        `/panel/ebay/profiles/edit?id=${row["profile_id"]}`
                      );
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {row["name"]}
                </Text>
              </center>
            );
          }
          tempProfilesObj["profileQuery"] = (
            <center>{row["prepareQuery"]["querySentence"]}</center>
          );
          tempProfilesObj["profile_id"] = row["profile_id"];
          tempProfilesObj["id"] = row["profile_id"];
          if (test) {
            tempProfilesObj["profileConnectedAccount"] = (
              // <Stack spacing="tight">
              <center>
                {test.map((id, index) => {
                  return (
                    <span style={{ marginRight: "10px" }}>
                      <Image
                        preview={false}
                        width={25}
                        src={
                          id && require(`../../../../../assets/flags/${id}.png`)
                        }
                        style={{ borderRadius: "50%" }}
                        key={index}
                      />
                    </span>
                  );
                })}
              </center>
              // </Stack>
            );
          }
          tempProfilesArray = [...tempProfilesArray, tempProfilesObj];
        });
      }
      setAllProfiles(tempProfilesArray);
      //setPaginationProps(tempPaginationProps);
    } else {
      notify.error(message);
    }
  };
  const getAllProfiles = async (activePageNumber, activePageSize) => {
    setGridLoader(true);
    let { filters } = filtersProps;
    //let { pageSize: count, activePage } = paginationProps;
    let filterPostData = {};
    // for (const key in filtersToPass) {
    //   if (key === "filter[country][1]") {
    //     let matchedAccoount = connectedAccountsArray.find(
    //       (connectedAccount) =>
    //         connectedAccount["value"] === filtersToPass["filter[country][1]"]
    //     );
    //     filterPostData["filter[profile_shop_id][1]"] =
    //       matchedAccoount?.["shopId"];
    //   } else {
    //     filterPostData[key] = filtersToPass[key];
    //   }
    // }
    if (filtersToPass.hasOwnProperty("filter[country][1]")) {
      let matchedAccoount = connectedAccountsArray.find(
        (connectedAccount) =>
          connectedAccount["value"] === filtersToPass["filter[country][1]"]
      );
      filterPostData["filter[profile_shop_id][1]"] =
        matchedAccoount?.["shopId"];
      filterPostData["site_id"] = Number(matchedAccoount?.["siteID"]);
    }
    if (filtersToPass.hasOwnProperty("filter[name][3]")) {
      filterPostData["filter[name][3]"] = filtersToPass["filter[name][3]"];
    }
    if (filtersToPass.hasOwnProperty("filter[querySentence][3]")) {
      filterPostData["filter[prepareQuery.querySentence][3]"] =
        filtersToPass["filter[querySentence][3]"];
    }

    let dataToPost = {
      count: activePageSize,
      activePage: activePageNumber,
      ...filterPostData,
      marketplace: "ebay",
    };
    // if (Object.keys(filterPostData).length) {
    //   dataToPost["activePage"] = 1;
    // }
    let { success, data, message, count } = await getProfiles(
      getProfilesURLFilter,
      {
        ...dataToPost,
        ...filterPostData,
      }
    );
    if (data.count) {
      setTotalShippingPolicyCount(data.count);
    }
    callAfterAPI(success, data, message, activePageSize);
    setGridLoader(false);
  };

  useEffect(() => {
    // getAllProfiles();
    prepareFilters();
    getAccounts();
  }, []);

  // const onPaginationChange = (paginationProps) => {
  //   setPaginationProps(paginationProps);
  // };

  const prepareFilters = () => {
    filtersProps["attributeoptions"] = [
      ...prepareChoiceoption(filterOptions, "headerName", "field"),
    ];
    setFiltersProps(filtersProps);
  };

  const getFieldValue = (field) => {
    switch (field) {
      case "name":
        return "Name";
      case "querySentence":
        return "Query";
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
      if (
        !filter.includes("filtersPresent") ||
        (filter.includes("filtersPresent") && filter["filtersPresent"])
      ) {
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
              // setFilterProfileNameORQuery("");
              ["querySentence", "name"].includes(fieldValue) &&
                setFilterProfileNameORQuery("");
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

  const verify = useCallback(
    debounce((value) => {
      let type = "";
      if (searchWithProfileName) {
        type = "filter[name][3]";
      } else {
        type = "filter[querySentence][3]";
      }
      let titleFilterObj = {};
      titleFilterObj[type] = value;
      if (titleFilterObj[type] !== "") {
        setFiltersToPass({
          ...filtersToPass,
          ...titleFilterObj,
          filtersPresent: true,
        });
      } else if (filtersToPass.hasOwnProperty("filter[name][3]")) {
        let temp = { ...filtersToPass, filtersPresent: true };
        delete temp["filter[name][3]"];
        setFiltersToPass(temp);
      } else if (filtersToPass.hasOwnProperty("filter[querySentence][3]")) {
        let temp = { ...filtersToPass, filtersPresent: true };
        delete temp["filter[querySentence][3]"];
        setFiltersToPass(temp);
      }
      // setFiltersToPass({ ...filtersToPass, ...titleFilterObj });
    }, 200),
    [searchWithProfileName, filtersToPass]
  );
  const renderTitleOrSKU = () => {
    return (
      <TextField
        value={filterProfileNameORQuery}
        onChange={(e) => {
          setFilterProfileNameORQuery(e);
        }}
        placeholder={
          searchWithProfileName ? "Search with name" : "Search with query"
        }
      />
    );
  };

  const popOverHandler = (type) => {
    let temp = { ...popOverStatus };
    temp[type] = !popOverStatus[type];
    setPopOverStatus(temp);
  };
  const countryActivator = (
    <ShopifyButton
      fullWidth
      disclosure
      onClick={() => popOverHandler("country")}
    >
      Account
    </ShopifyButton>
  );

  const handleChange = (value, selectedType) => {
    let type = `filter[${selectedType}][1]`;
    let filterObj = {};
    filterObj[type] = value[0];
    setFiltersToPass({ ...filtersToPass, ...filterObj });
    setSelected({ ...selected, [selectedType]: value });
  };
  const renderChoiceListForProfilenameCountry = () => {
    const initialCountryObj = connectedAccountsArray?.filter(
      (connectedAccount, index) =>
        connectedAccount.value === initialCountryValue
    );
    return (
      <Popover
        active={popOverStatus["country"]}
        activator={countryActivator}
        onClose={() => popOverHandler("country")}
      >
        <div style={{ margin: "10px", width: "200px" }}>
          <ChoiceList
            choices={connectedAccountsArray}
            selected={
              initialCountryObj[0]
                ? [initialCountryObj[0]?.value]
                : selected["country"]
            }
            onChange={(value) => handleChange(value, "country")}
          />
        </div>
      </Popover>
    );
  };

  useEffect(() => {
    verify(filterProfileNameORQuery);
  }, [filterProfileNameORQuery, searchWithProfileName]);

  const renderChoiceListForNameQuery = () => (
    <ButtonGroup segmented>
      <Button
        primary={searchWithProfileName}
        pressed={searchWithProfileName}
        onClick={(e) => {
          let temp = { ...filtersToPass };
          if (temp.hasOwnProperty("filter[querySentence][3]")) {
            delete temp["filter[querySentence][3]"];
          }
          setFiltersToPass(temp);
          setFilterProfileNameORQuery("");
          setSearchWithProfileName(true);
        }}
      >
        Name
      </Button>
      <Button
        primary={!searchWithProfileName}
        pressed={!searchWithProfileName}
        onClick={(e) => {
          let temp = { ...filtersToPass };
          if (temp.hasOwnProperty("filter[name][3]")) {
            delete temp["filter[name][3]"];
          }
          setFiltersToPass(temp);
          setFilterProfileNameORQuery("");
          setSearchWithProfileName(false);
        }}
      >
        Query
      </Button>
    </ButtonGroup>
  );

  const renderOtherFilters = () => {
    return (
      <Stack wrap>
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
      //notify.warn("No filters applied");
      setFiltersToPass({ filtersPresent: false });
    }
  };

  useEffect(() => {
    if (filtersToPass) {
      dispatch({ type: "profileFilter", payload: filtersToPass });
    }
  }, [filtersToPass]);
  useEffect(() => {
    if (reduxState && connectedAccountsArray.length)
      setFiltersToPass(reduxState);
  }, [connectedAccountsArray]);
  return (
    <PageHeader
      className="site-page-header-responsive"
      title={
        // <Tooltip
        //   content="For creating listings on eBay, profile is mandatory"
        //   // content="To create listings on eBay, profile is mandatory"
        //   preferredPosition="above"
        // >
        //   <TextStyle variation="strong">
        //     <span
        //       style={{
        //         borderBottomStyle: "dashed",
        //         borderColor: "#00000069",
        //       }}
        //     >
        "Profiles"
        //     </span>
        //   </TextStyle>
        // </Tooltip>
      }
      subTitle={
        <div
          onClick={() => setIsOpenModalVideo(true)}
          style={{ cursor: "pointer" }}
        >
          <Badge status="info">Need Help?</Badge>
        </div>
      }
      ghost={true}
      extra={[
        <ShopifyButton
          primary
          onClick={() => props.history.push("/panel/ebay/profiles/edit")}
        >
          Profile Create
        </ShopifyButton>,
      ]}
    >
      <Alert
        style={{ borderRadius: "7px" }}
        message={<>For creating listings on eBay, profile is mandatory</>}
        type="info"
        showIcon
      />
      {/* <Banner status="info">
        <>For creating listings on eBay, profile is mandatory</>
      </Banner> */}
      <br />
      <Card sectioned>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Stack wrap>
              <Stack.Item fill>{renderTitleOrSKU()}</Stack.Item>
              <Stack.Item>{renderChoiceListForNameQuery()}</Stack.Item>
              {/* <Stack.Item>{renderOtherFilters()}</Stack.Item> */}
              <Stack.Item>
                {/* <div style={{ width: 200 }}> */}
                {renderChoiceListForProfilenameCountry()}
                {/* </div> */}
              </Stack.Item>
            </Stack>
            <Stack spacing="tight">
              {filtersToPass &&
                Object.keys(filtersToPass).length > 0 &&
                tagMarkup()}
            </Stack>
          </div>
          <Row justify="space-between" gutter={[8, 8]}>
            {window.innerWidth >= 768 ? (
              <>
                <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}>
                  <p style={{ paddingTop: 5, fontWeight: "bold" }}>
                    {/* {showingGridRange(paginationProps, "Profile(s)")} */}
                  </p>
                </Col>

                <PaginationComponent
                  totalCount={totalShippingPolicyCount}
                  hitGetProductsAPI={getAllProfiles}
                  pageSizeOptions={pageSizeOptions}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  setPrevPage={setPrevPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  size={"default"}
                  simple={false}
                />
              </>
            ) : (
              <>
                <Col
                  span={6}
                  xs={8}
                  sm={8}
                  md={10}
                  lg={4}
                  xl={5}
                  xxl={5}
                  style={{ display: "flex", justifyContent: "start" }}
                >
                  {showTotal(totalShippingPolicyCount, [
                    (activePage - 1) * pageSize + 1,
                    activePage * pageSize,
                  ])}
                </Col>
                <Col
                  span={10}
                  xs={16}
                  sm={16}
                  md={14}
                  lg={10}
                  xl={9}
                  xxl={9}
                  style={{ display: "flex", justifyContent: "end" }}
                >
                  <BasicPaginationComponent
                    totalCount={totalShippingPolicyCount}
                    hitGetProductsAPI={getAllProfiles}
                    responsivePageSizeOptions={responsivePageSizeOptions}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    setPrevPage={setPrevPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    size={"default"}
                    simple={false}
                  />
                </Col>
                <Col
                  span={4}
                  xs={12}
                  sm={16}
                  md={16}
                  lg={5}
                  xl={5}
                  xxl={5}
                  style={{ display: "flex", justifyContent: "end" }}
                >
                  {/* <Select
      label=""
      options={pageSizeOptions}
      onChange={handleSelectChange}
      value={pageSize}
    
    /> */}
                  <Select
                    defaultValue="5 / page"
                    style={{
                      width: "11rem",
                    }}
                    onChange={handleSelectChange}
                  >
                    {responsivePageSizeOptions.map((pageSizeOption, index) => (
                      <Option value={Number(pageSizeOption.value)}>
                        {pageSizeOption.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col
                  span={5}
                  xs={12}
                  sm={8}
                  md={8}
                  lg={5}
                  xl={5}
                  xxl={5}
                  style={{ display: "flex", justifyContent: "end" }}
                >
                  <div>Go To {showJumpToPage()} Page</div>
                </Col>
              </>
            )}
          </Row>
        </div>
        <NestedTableComponent
          columns={profileGridColumns}
          dataSource={allProfiles}
          size={"small"}
          loading={gridLoader}
          pagination={false}
          scroll={{
            x: 1500,
            y: 500,
          }}
        />
      </Card>
      <NewFilterComponentSimilarPolaris
        setFiltersDrawerVisible={setFiltersDrawerVisible}
        filtersDrawerVisible={filtersDrawerVisible}
        filters={filters}
        stringOperatorOptions={stringOperatorOptions}
        initialMoreFiltersObj={initialMoreFiltersObj}
        numberOperatorOptions={numberOperatorOptions}
        setFilters={setFilters}
        gatherAllFilters={gatherAllFilters}
        setFiltersToPass={setFiltersToPass}
        setFilterTitleORsku={setFilterProfileNameORQuery}
        setSelected={setSelected}
      />
      <Modal
        open={isOpenModalVideo}
        onClose={() => setIsOpenModalVideo(false)}
        title="How Can I Help?"
      >
        <Modal.Section>
          {profileGifs.map((gif, index) => {
            return (
              <>
                <Stack distribution="equalSpacing">
                  <>{gif.title}</>
                  <Button
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
                  </Button>
                </Stack>
                {index == profileGifs.length - 1 ? <></> : <Divider />}
              </>
            );
          })}
          <Divider />
          <center>
            <Button primary onClick={() => setIsOpenModalVideo(false)}>
              Close
            </Button>
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
            <Button
              primary
              onClick={() =>
                setIsOpenGifModal({
                  active: false,
                  title: "",
                })
              }
            >
              Close
            </Button>
          </center>
        </Modal.Section>
      </Modal>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=profiling-section-of-the-application"
        >
          Profiles
        </Link>
      </FooterHelp>
    </PageHeader>
  );
};

export default ProfileGridComponent;
