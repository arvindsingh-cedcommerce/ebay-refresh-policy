import { LineOutlined } from "@ant-design/icons";
import {
  Button,
  ButtonGroup,
  Card,
  ChoiceList,
  Icon,
  Popover,
  Stack,
  Tag,
  TextField,
} from "@shopify/polaris";
import { FilterMajorMonotone } from "@shopify/polaris-icons";
import { Col, Image, Row } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { getConnectedAccounts } from "../../../../../../../Apirequest/accountsApi";
import { getTemplates } from "../../../../../../../APIrequests/TemplatesAPI";
import { json } from "../../../../../../../globalConstant/static-json";
import { notify } from "../../../../../../../services/notify";
import { getTemplatesURL } from "../../../../../../../URLs/TemplateURLS";
import NestedTableComponent from "../../../../../../AntDesignComponents/NestedTableComponent";
import PaginationComponent from "../../../../../../AntDesignComponents/PaginationComponent";
import { getCountryName } from "../../../../../Accounts/NewAccount";
import NewFilterComponentSimilarPolaris from "../../../Products/NewFilterComponentSimilarPolaris";
import {
  numberOperatorOptions,
  stringOperatorOptions,
} from "../../../Products/NewProductsNewFilters";
import { capitalizeFirstLetterofWords } from "../../Helper/TemplateHelper";
import { debounce } from "../../TemplateBody/CategoryTemplatePolarisNew";
import ActionPopoverTemplate from "../ActionPopoverTemplate";

const getCountyrName = (siteId) => {
  let countryName = json.flag_country.filter((sites) => sites.value === siteId);
  if (countryName.length) {
    return (
      <Image
        preview={false}
        width={25}
        src={
          siteId && require(`../../../../../../../assets/flags/${siteId}.png`)
        }
        style={{ borderRadius: "50%" }}
      />
    );
  }
  return "-";
};

const getUsername = (shopid, username) => {
  if (shopid && username.length) {
    let test = username.find((user) => user.shopID == shopid);
    return test?.label;
  }
};

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

const CategoryTemplateGrid = (props) => {
  const reduxState = useSelector(
    (state) => state.categoryGridFilterReducer.reduxFilters
  );
  const dispatch = useDispatch();

  const initialCountryValue=reduxState[props.checkValueHandler(reduxState,"country")];
 
  const { cbFuncCategory } = props;
  const [accountSelectionModal, setaccountSelectionModal] = useState({
    active: false,
    siteID: "",
    accountName: "",
    options: [],
    shopID: "",
  });
  const [gridLoader, setGridLoader] = useState(false);
  const [categoryTemplates, setCategoryTemplates] = useState([]);
  const [templateGridColumns, setTemplateGridColumns] = useState([
    {
      title: <center>Name</center>,
      dataIndex: "templateName",
      key: "templateName",
    },
    {
      title: <center>Account</center>,
      dataIndex: "templateConnectedAccount",
      key: "account",
    },
    {
      title: <center>Category Mapping</center>,
      dataIndex: "primaryCategoryMappingName",
      key: "primaryCategoryMappingName",
    },
    {
      title: <center>Actions</center>,
      key: "action",
      dataIndex: "templateAction",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return (
          <center>
            <ActionPopoverTemplate
              record={record}
              hitRequiredFuncs={getAllConnectedAccounts}
              cbFunc={cbFuncCategory}
            />
          </center>
        );
      },
    },
  ]);

  // filters
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
  const [filters, setFilters] = useState(getFitersInitially());
  const [filtersToPass, setFiltersToPass] = useState("");
  const [filterCategoryTemplateName, setFilterCategoryTemplateName] =
    useState("");
  const [popOverStatus, setPopOverStatus] = useState({
    country: false,
  });
  const [selected, setSelected] = useState({
    country: [],
  });

  // pagination
  const [activePage, setActivePage] = useState(1);
  // const [pageSizeOptions, setPageSizeOptions] = useState([5, 10, 20]);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  // const [pageSize, setPageSize] = useState(5);
  const [pageSize, setPageSize] = useState(25);
  const [totalCategoryTemplateCount, setTotalCategoryTemplateCount] =
    useState(0);

  // countries
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);

  // searchToggleTitleMapping
  const [searchWithTitle, setSearchWithTitle] = useState(true);
  const [filterTitleORCategoryMapping, setFilterTitleORCategoryMapping] =
    useState("");
    const [prevPage,setPrevPage]=useState(1);
 
  const getTemplatesList = async (activePageNumber, activePageSize) => {
    setGridLoader(true);
    let filterPostData = {};
    for (const key in filtersToPass) {
      if (key === "filter[country][1]") {
        let matchedAccoount = connectedAccountsArray.find(
          (connectedAccount) =>
            connectedAccount["value"] === filtersToPass["filter[country][1]"]
        );
        filterPostData["filter[shop_id][1]"] = matchedAccoount?.["shopID"];
      } else if (key !== "filter[primaryCategoryMappingName][3]") {
        filterPostData[key] = filtersToPass[key];
      }
      if (key === "filter[primaryCategoryMappingName][3]") {
        filterPostData["filter[data.primaryCategoryMappingName][3]"] =
          filtersToPass[key];
      }
    }
    const postData = {
      "filter[type][1]": "category",
      count: activePageSize,
      activePage: activePageNumber,
      ...filterPostData,
    };
    // if (Object.keys(filterPostData).length) {
    //   postData["activePage"] = 1;
    // }
    const {
      success,
      data: fetchedTemplatesArray,
      message,
    } = await getTemplates(getTemplatesURL, postData);
    if (success) {
      const overAllFilteredTemplateData = fetchedTemplatesArray.map(
        (template, index) => {
          const filteredTemplateData = {
            templateUniqueKey: index,
            accountStatus: connectedAccountsArray.find(
              (account) => account.shopID == template["data"]["shop_id"]
            )?.["status"],
            templateType:
              template["type"] !== null
                ? capitalizeFirstLetterofWords(template["type"])
                : "",
            templateName: (
              <center>
                <Text
                  strong
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (template["type"] === "category") {
                      if (template["_id"]) {
                        props.history.push(
                          `/panel/ebay/templates/handler?type=${template[
                            "type"
                          ].toLowerCase()}&id=${template["_id"]}&siteID=${
                            template["data"]?.site_id
                          }&shopID=${template["data"]?.shop_id}`
                        );
                      }
                    } else {
                      props.history.push(
                        `/panel/ebay/templates/handler?type=${capitalizeFirstLetterofWords(
                          template["type"]
                        ).toLowerCase()}&id=${template["_id"]}`
                      );
                    }
                  }}
                >
                  {template["title"]
                    // ? capitalizeFirstLetterofWords(template["title"])
                    ? template["title"]
                    : ""}
                </Text>
              </center>
            ),
            siteID: template["data"]?.site_id,
            shopID: template["data"]?.shop_id,
            primaryCategoryMappingName: (
              <center>
                {template["data"]?.["primaryCategoryMappingName"]}
              </center>
            ),
            templateConnectedAccount:
              Object.keys(template["data"]).length > 0 ? (
                <Stack distribution="center" alignment="center" spacing="tight">
                  <>{getCountyrName(template["data"]["site_id"])}</>
                  <>
                    {getUsername(
                      template["data"]["shop_id"],
                      connectedAccountsArray
                    )}
                  </>
                </Stack>
              ) : (
                <center>
                  <Text>
                    {" "}
                    <LineOutlined style={{ color: "#000" }} />
                  </Text>
                </center>
              ),
            templateId: template["_id"],
          };
          return filteredTemplateData;
        }
      );
      setCategoryTemplates(overAllFilteredTemplateData);
    }
    setGridLoader(false);
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
        temp["label"] = account["warehouses"][0]["user_id"];
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["status"] = account["warehouses"][0]["status"];
        temp["shopID"] = account["id"];
        ebayAccountsObj.push(temp);
      });
      let ebayAccountsObjFilter = [];
      ebayAccounts.forEach((account, key) => {
        let temp = {};
        temp["value"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["label"] = (
          <Stack alignment="center" spacing="tight">
            <>{getCountyrName(account["warehouses"][0]["site_id"])}</>
            <>{account["warehouses"][0]["user_id"]}</>
          </Stack>
        );
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["shopID"] = account["id"];
        ebayAccountsObjFilter.push(temp);
      });
      let temp = { ...filters };
      temp["country"]["options"] = ebayAccountsObjFilter;
      setFilters(temp);
      setaccountSelectionModal({
        ...accountSelectionModal,
        options: ebayAccountsObj,
        siteID: ebayAccountsObj[0]?.siteID,
        accountName: ebayAccountsObj[0]?.value,
        shopID: ebayAccountsObj[0]?.shopID,
      });
      setconnectedAccountsArray(ebayAccountsObj);
    } else {
      notify.error(message);
      // props.history.push("/auth/login");
    }
    return ebayAccountsObj;
  };
  useEffect(() => {
    if (filtersToPass && (activePage>1 && activePage!==prevPage)) {
      getTemplatesList(1, pageSize);
      setActivePage(1);
    }
    else if(filtersToPass)
    {
      getTemplatesList(activePage,pageSize);
    }
  }, [filtersToPass]);
  useEffect(() => {
    if (connectedAccountsArray.length) {
      getTemplatesList(activePage, pageSize);
    }
  }, [ connectedAccountsArray]);

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);
  // useEffect(() => {
  //   if (connectedAccountsArray.length) {
  //     getTemplatesList();
  //   }
  // }, [connectedAccountsArray]);

  const verify = useCallback(
    debounce((value) => {
      let type = "";
      if (searchWithTitle) {
        type = "filter[title][3]";
      } else {
        type = "filter[primaryCategoryMappingName][3]";
      }
      // type = "filter[title][3]";
      let titleFilterObj = {};
      titleFilterObj[type] = value;
      if (titleFilterObj[type] !== "") {
        setFiltersToPass({ ...filtersToPass, ...titleFilterObj,filtersPresent:true });
      } else if (filtersToPass.hasOwnProperty("filter[title][3]")) {
        let temp = { ...filtersToPass,filtersPresent:true };
        delete temp["filter[title][3]"];
        setFiltersToPass(temp);
      } else if (
        filtersToPass.hasOwnProperty("filter[primaryCategoryMappingName][3]")
      ) {
        let temp = { ...filtersToPass,filtersPresent:true };
        delete temp["filter[primaryCategoryMappingName][3]"];
        setFiltersToPass(temp);
      }
    }, 200),
    [searchWithTitle, filtersToPass]
  );

  useEffect(() => {
    verify(filterTitleORCategoryMapping);
  }, [filterTitleORCategoryMapping, searchWithTitle]);

  const renderCategorySearch = () => {
    return (
      <TextField
        value={filterTitleORCategoryMapping}
        onChange={(e) => {
          setFilterTitleORCategoryMapping(e);
        }}
        placeholder={
          fetchCurrentSearchWithCategoryTemplate()
            ? "Search with category name"
            : "Search with category mapping"
        }
      />
    );
  };

  const getFieldValue = (field) => {
    switch (field) {
      case "title":
        return "Name";
      case "country":
        return "Country";
      case "primaryCategoryMappingName":
        return "Category Mapping";
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
            // setFilterCategoryTemplateName("");
            ["title", "primaryCategoryMappingName"].includes(fieldValue) &&
              setFilterTitleORCategoryMapping("");
            setFilters(tempObj);
            setFiltersToPass(temp);
            setSelected({ ...selected, [fieldValue]: [] });
          }}
        >
          {getFieldValue(fieldValue)} {getOperatorLabel(operatorValue)}{" "}
          {filtersToPass[filter]}
        </Tag>
      );
  }});
  };

  const handleChange = (value, selectedType) => {
    let type = `filter[${selectedType}][1]`;
    let filterObj = {};
    filterObj[type] = value[0];
    setFiltersToPass({ ...filtersToPass, ...filterObj });
    setSelected({ ...selected, [selectedType]: value });
  };
  const popOverHandler = (type) => {
    let temp = { ...popOverStatus };
    temp[type] = !popOverStatus[type];
    setPopOverStatus(temp);
  };
  const countryActivator = (
    <Button fullWidth disclosure onClick={() => popOverHandler("country")}>
      Account
    </Button>
  );
  const renderChoiceListForNameCategoryMapping = () => {
    return (
      <ButtonGroup segmented>
        <Button
          primary={fetchCurrentSearchWithCategoryTemplate()}
          pressed={fetchCurrentSearchWithCategoryTemplate()}
          onClick={(e) => {
            let temp = { ...filtersToPass };
            if (temp.hasOwnProperty("filter[primaryCategoryMappingName][3]")) {
              delete temp["filter[primaryCategoryMappingName][3]"];
            }
            setFiltersToPass(temp);
            setFilterTitleORCategoryMapping("");
            setSearchWithTitle(true);
          }}
        >
          Title
        </Button>
        <Button
          primary={!fetchCurrentSearchWithCategoryTemplate()}
          pressed={!fetchCurrentSearchWithCategoryTemplate()}
          onClick={(e) => {
            let temp = { ...filtersToPass };
            if (temp.hasOwnProperty("filter[title][3]")) {
              delete temp["filter[title][3]"];
            }
            setFiltersToPass(temp);
            setFilterTitleORCategoryMapping("");
            setSearchWithTitle(false);
          }}
        >
          Category Mapping
        </Button>
      </ButtonGroup>
    );
  };
  const renderOtherFilters = () => {
    const initialCountryObj=connectedAccountsArray?.filter((connectedAccount,index)=> connectedAccount.value===initialCountryValue);
   
    return (
      <Popover
        active={popOverStatus["country"]}
        activator={countryActivator}
        onClose={() => popOverHandler("country")}
      >
        <div style={{ margin: "10px", width: "200px" }}>
          <ChoiceList
            choices={filters.country.options}
            selected={initialCountryObj[0]?[initialCountryObj[0].value]:selected["country"]}
            onChange={(value) => handleChange(value, "country")}
          />
        </div>
      </Popover>
      // <Stack wrap>
      //   <Button
      //     icon={<Icon source={FilterMajorMonotone} color="base" />}
      //     onClick={() => {
      //       setFiltersDrawerVisible(true);
      //     }}
      //   >
      //     More Filters
      //   </Button>
      // </Stack>
    );
  };
  const fetchCurrentSearchWithCategoryTemplate=()=>{
    if(filtersToPass)
    {
    if(filtersToPass.hasOwnProperty("filter[primaryCategoryMappingName][3]") && searchWithTitle || filtersToPass.hasOwnProperty("filter[title][3]") && !searchWithTitle)
       return !searchWithTitle;
    else
    return searchWithTitle;
    }
    return searchWithTitle;
  }
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
      setFiltersToPass({filtersPresent:false})
    }
  };

  useEffect(() => {
    if (filtersToPass) {
      dispatch({ type: "categoryFilter", payload: filtersToPass });
    }
  }, [filtersToPass]);
  useEffect(() => {
    if (reduxState) setFiltersToPass(reduxState);
  }, []);
  return (
    <Card.Section>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Stack wrap>
            <Stack.Item fill>{renderCategorySearch()}</Stack.Item>
            <Stack.Item>{renderChoiceListForNameCategoryMapping()}</Stack.Item>
            <Stack.Item>
              {/* <div style={{ width: 200 }}>{renderOtherFilters()}</div> */}
              {renderOtherFilters()}
            </Stack.Item>
          </Stack>
          <Stack spacing="tight">
            {Object.keys(filtersToPass).length > 0 && tagMarkup()}
          </Stack>
        </div>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          justify="space-between"
          style={{ marginBottom: 10 }}
        >
          <Col className="gutter-row" span={18}>
            <PaginationComponent
              totalCount={totalCategoryTemplateCount}
              hitGetProductsAPI={getTemplatesList}
              pageSizeOptions={pageSizeOptions}
              activePage={activePage}
              setActivePage={setActivePage}
              setPrevPage={setPrevPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              size={"default"}
              simple={false}
            />
          </Col>
        </Row>
      </div>
      <NestedTableComponent
        columns={templateGridColumns}
        dataSource={categoryTemplates}
        scroll={{
          x: 1000,
        }}
        bordered={false}
        loading={gridLoader}
        size={"small"}
        pagination={false}
      />
      <NewFilterComponentSimilarPolaris
        setFiltersDrawerVisible={setFiltersDrawerVisible}
        filtersDrawerVisible={filtersDrawerVisible}
        filters={filters}
        stringOperatorOptions={stringOperatorOptions}
        numberOperatorOptions={numberOperatorOptions}
        setFilters={setFilters}
        gatherAllFilters={gatherAllFilters}
        setFiltersToPass={setFiltersToPass}
        setFilterTitleORsku={setFilterCategoryTemplateName}
        setSelected={setSelected}
      />
    </Card.Section>
  );
};

export default withRouter(CategoryTemplateGrid);
