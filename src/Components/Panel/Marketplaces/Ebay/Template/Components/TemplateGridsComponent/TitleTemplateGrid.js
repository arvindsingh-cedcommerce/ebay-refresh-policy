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
import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { getTemplates } from "../../../../../../../APIrequests/TemplatesAPI";
import { notify } from "../../../../../../../services/notify";
import { getTemplatesURL } from "../../../../../../../URLs/TemplateURLS";
import NestedTableComponent from "../../../../../../AntDesignComponents/NestedTableComponent";
import PaginationComponent from "../../../../../../AntDesignComponents/PaginationComponent";
import NewFilterComponentSimilarPolaris from "../../../Products/NewFilterComponentSimilarPolaris";
import {
  numberOperatorOptions,
  stringOperatorOptions,
} from "../../../Products/NewProductsNewFilters";
import { capitalizeFirstLetterofWords } from "../../Helper/TemplateHelper";
import { debounce } from "../../TemplateBody/CategoryTemplatePolarisNew";
import { AttributeMapoptions } from "../../TemplateBody/TitleTemplatePolaris";
import ActionPopoverTemplate from "../ActionPopoverTemplate";

const filtersFields = [
  {
    label: "Title Mapping",
    value: "titleMapping",
    searchType: "dropdown",
    inputValue: "",
    operator: "1",
    dataType: "string",
  },
  {
    label: "Description Mapping",
    value: "descriptionMapping",
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

const TitleTemplateGrid = (props) => {
  const reduxState = useSelector(
    (state) => state.titleGridFilterReducer.reduxFilters
  );
  const dispatch = useDispatch();
  const titleMappingTypeValue= reduxState[props.checkValueHandler(reduxState,"titleMapping")];
   const descriptionMappingTypeValue=reduxState[props.checkValueHandler(reduxState,"descriptionMapping")];
   const { cbFuncTitle } = props;
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
      title: <center>Title Mapping</center>,
      dataIndex: "titleMapping",
      key: "titleMapping",
    },
    {
      title: <center>Description Mapping</center>,
      dataIndex: "descriptionMapping",
      key: "descriptionMapping",
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
              hitRequiredFuncs={getTemplatesList}
              cbFunc={cbFuncTitle}
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
    titleMapping: false,
    descriptionMapping: false,
  });
  const [selected, setSelected] = useState({
    titleMapping: [],
    descriptionMapping: [],
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

  const getTemplatesList = async (activePageNumber,activePageSize) => {
    setGridLoader(true);
    const postData = {
      "filter[type][1]": "title",
      count: activePageSize,
      activePage: activePageNumber,
      ...filtersToPass,
    };
    // if (Object.keys(filtersToPass).length) {
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
            templateType: capitalizeFirstLetterofWords(template["type"]),
            titleMapping: (
              <center>
                {
                  AttributeMapoptions.find(
                    (mapOption) =>
                      mapOption["value"] ===
                      template["data"]?.["title"]?.["selected"]
                  )?.["label"]
                }
              </center>
            ),
            descriptionMapping: (
              <center>
                {
                  AttributeMapoptions.find(
                    (mapOption) =>
                      mapOption["value"] ===
                      template["data"]?.["description"]?.["selected"]
                  )?.["label"]
                }
              </center>
            ),
            templateName: (
              <center>
                <Text
                  strong
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (template["type"] === "category") {
                      props.history.push(
                        `/panel/ebay/templates/handler?type=${template[
                          "type"
                        ].toLowerCase()}&id=${template["_id"]}&siteID=${
                          template["data"]?.site_id
                        }&shopID=${template["data"]?.shop_id}`
                      );
                    } else {
                      if (template["_id"]) {
                        props.history.push(
                          `/panel/ebay/templates/handler?type=${capitalizeFirstLetterofWords(
                            template["type"]
                          ).toLowerCase()}&id=${template["_id"]}`
                        );
                      }
                    }
                  }}
                >
                  {template["title"]
                    ? capitalizeFirstLetterofWords(template["title"])
                    : ""}
                </Text>
              </center>
            ),
            templateId: template["_id"],
          };
          return filteredTemplateData;
        }
      );
      let temp = { ...filters };
      temp["titleMapping"]["options"] = [...AttributeMapoptions];
      temp["descriptionMapping"]["options"] = [...AttributeMapoptions];
      setFilters(temp);
      setCategoryTemplates(overAllFilteredTemplateData);
    }
    setGridLoader(false);
  };

  useEffect(() => {
    if(filtersToPass)
    getTemplatesList(activePage, pageSize);
  }, [ filtersToPass]);

  const verify = useCallback(
    debounce((value) => {
      let type = "";
      type = "filter[title][3]";
      let titleFilterObj = {};
      titleFilterObj[type] = value;
      if (titleFilterObj[type] !== "") {
        setFiltersToPass({ ...filtersToPass, ...titleFilterObj,filtersPresent:true });
      } else if (filtersToPass.hasOwnProperty("filter[title][3]")) {
        let temp = { ...filtersToPass,filtersPresent:true };
        delete temp["filter[title][3]"];
        setFiltersToPass(temp);
      }
    }, 200),
    [filtersToPass]
  );

  useEffect(() => {
    verify(filterCategoryTemplateName);
  }, [filterCategoryTemplateName]);

  const renderCategorySearch = () => {
    return (
      <TextField
        value={filterCategoryTemplateName}
        onChange={(e) => {
          setFilterCategoryTemplateName(e);
        }}
        placeholder={"Search with category name"}
      />
    );
  };

  const getFieldValue = (field) => {
    switch (field) {
      case "title":
        return "Name";
      case "titleMapping":
        return "Title Mapping";
      case "descriptionMapping":
        return "Description Mapping";
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
            ["title"].includes(fieldValue) && setFilterCategoryTemplateName("");
            setFilters(tempObj);
            setFiltersToPass(temp);
            setSelected({ ...selected, [fieldValue]: [] });
          }}
        >
          {getFieldValue(fieldValue)} {getOperatorLabel(operatorValue)}{" "}
          {filtersToPass[filter]}
        </Tag>
      );
    });
  };

  const titleMappingActivator = (
    <Button fullWidth disclosure onClick={() => popOverHandler("titleMapping")}>
      Title Mapping
    </Button>
  );
  const descriptionMappingActivator = (
    <Button
      fullWidth
      disclosure
      onClick={() => popOverHandler("descriptionMapping")}
    >
      Description Mapping
    </Button>
  );

  const popOverHandler = (type) => {
    let temp = { ...popOverStatus };
    temp[type] = !popOverStatus[type];
    setPopOverStatus(temp);
  };
  const handleChange = (value, selectedType) => {
    let type = `filter[${selectedType}][1]`;
    let filterObj = {};
    filterObj[type] = value[0];
    setFiltersToPass({ ...filtersToPass, ...filterObj });
    setSelected({ ...selected, [selectedType]: value });
  };
  const renderOtherFilters = () => {
    const titleMappingTypeObj=AttributeMapoptions?.filter((connectedAccount,index)=> connectedAccount.value===titleMappingTypeValue);
    const descriptionMappingTypeObj=AttributeMapoptions?.filter((connectedAccount,index)=> connectedAccount.value===descriptionMappingTypeValue);
    return (
      <ButtonGroup segmented>
        <Popover
          active={popOverStatus["titleMapping"]}
          activator={titleMappingActivator}
          onClose={() => popOverHandler("titleMapping")}
        >
          <div style={{ margin: "10px" }}>
            <ChoiceList
              choices={AttributeMapoptions}
              selected={titleMappingTypeObj[0]?[titleMappingTypeObj[0].value]:selected["titleMapping"]}
              onChange={(value) => handleChange(value, "titleMapping")}
            />
          </div>
        </Popover>
        <Popover
          active={popOverStatus["descriptionMapping"]}
          activator={descriptionMappingActivator}
          onClose={() => popOverHandler("descriptionMapping")}
        >
          <div style={{ margin: "10px" }}>
            <ChoiceList
              choices={AttributeMapoptions}
              selected={descriptionMappingTypeObj[0]?[descriptionMappingTypeObj[0].value]:selected["descriptionMapping"]}
              onChange={(value) => handleChange(value, "descriptionMapping")}
            />
          </div>
        </Popover>
      </ButtonGroup>
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
      dispatch({ type: "titleFilter", payload: filtersToPass });
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
            <Stack.Item>{renderOtherFilters()}</Stack.Item>
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

export default withRouter(TitleTemplateGrid);
