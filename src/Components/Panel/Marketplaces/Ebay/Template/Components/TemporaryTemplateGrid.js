import {
    Col,
    Image,
    PageHeader,
    Row,
    Select,
    Space,
    Tooltip,
    Typography,
  } from "antd";
  import React, { useCallback, useEffect, useState } from "react";
  import {
    deleteTemplateID,
    getTemplates,
  } from "../../../../../../APIrequests/TemplatesAPI";
  import { json } from "../../../../../../globalConstant/static-json";
  import {
    deleteTempalteURL,
    getTemplatesURL,
  } from "../../../../../../URLs/TemplateURLS";
  import NestedTableComponent from "../../../../../AntDesignComponents/NestedTableComponent";
  import TabsComponent from "../../../../../AntDesignComponents/TabsComponent";
  import {
    getTemplatesCountTabLabel,
    capitalizeFirstLetterofWords,
    addTemplatesOptions,
  } from "../Helper/TemplateHelper";
  import {
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    LineOutlined,
  } from "@ant-design/icons";
  import { notify } from "../../../../../../services/notify";
  import {
    Button,
    Card,
    ChoiceList,
    Icon,
    Modal,
    Popover,
    Select as PolarisSelect,
    Stack,
    Tag,
    TextField,
  } from "@shopify/polaris";
  import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
  import { getCountryName } from "../../../../Accounts/NewAccount";
  import { showingGridRange } from "../../../../../../Subcomponents/Aggrid/showgridrange";
  import { AttributeMapoptions } from "../TemplateBody/TitleTemplatePolaris";
  import PaginationComponent from "../../../../../AntDesignComponents/PaginationComponent";
  import { FilterMajorMonotone } from "@shopify/polaris-icons";
  import NewFilterComponentSimilarPolaris from "../../Products/NewFilterComponentSimilarPolaris";
  import { debounce } from "../TemplateBody/CategoryTemplatePolarisNew";
  
  const { Option } = Select;
  const { Title, Text } = Typography;
  
  const stringOperatorOptions = [
    { label: "equals", value: "1" },
    { label: "not equals", value: "2" },
    { label: "contains", value: "3" },
    { label: "does not contains", value: "4" },
    { label: "starts with", value: "5" },
    { label: "ends with", value: "6" },
  ];
  
  const numberOperatorOptions = [
    { label: "equals", value: "1" },
    { label: "not equals", value: "2" },
    { label: "greater than or equal to", value: "8" },
    { label: "less than or equal to", value: "9" },
  ];
  const sellingFormatOptions = [
    { label: "Fixed Price", value: "fixed_price" },
    { label: "Auction-style", value: "auction_style" },
  ];
  
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
  
  export const getFitersInitially = () => {
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
  
  export const getCountyrName = (siteId) => {
    let countryName = json.flag_country.filter((sites) => sites.value === siteId);
    if (countryName.length) {
      return (
        <Image
          preview={false}
          width={25}
          src={siteId && require(`../../../../../../assets/flags/${siteId}.png`)}
          style={{ borderRadius: "50%" }}
        />
      );
    }
    return "-";
  };
  
  const TemporaryTemplateGrid = (props) => {
    const [templateGridColumns, setTemplateGridColumns] = useState([
      {
        title: "Name",
        dataIndex: "templateName",
        key: "templateName",
        sorter: (a, b) => {
          return a.templateName.props.children.localeCompare(
            b.templateName.props.children
          );
        },
      },
      // {
      //   title: "Type",
      //   dataIndex: "templateType",
      //   key: "type",
      // },
      {
        title: "Account",
        dataIndex: "templateConnectedAccount",
        key: "account",
      },
      {
        title: "Category Mapping",
        dataIndex: "primaryCategoryMappingName",
        key: "primaryCategoryMappingName",
      },
      {
        title: "Listing Type",
        dataIndex: "listingType",
        key: "listingType",
      },
      {
        title: "Title Mapping",
        dataIndex: "titleMapping",
        key: "titleMapping",
      },
      {
        title: "Description Mapping",
        dataIndex: "descriptionMapping",
        key: "descriptionMapping",
      },
      {
        title: "Actions",
        key: "action",
        dataIndex: "templateAction",
        render: (text, record) => {
          return (
            <Space size="middle">
              <Tooltip title="Edit">
                <EditOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let { templateId, templateType, siteID, shopID } = record;
                    if (templateType === "Category") {
                      props.history.push(
                        `/panel/ebay/templatesUS/handler?type=${templateType.toLowerCase()}&id=${templateId}&siteID=${siteID}&shopID=${shopID}`
                      );
                    } else {
                      props.history.push(
                        `/panel/ebay/templatesUS/handler?type=${templateType.toLowerCase()}&id=${templateId}`
                      );
                    }
                  }}
                />
              </Tooltip>
              {/* <Tooltip title="Duplicate">
                <CopyOutlined style={{ cursor: "pointer" }} />
              </Tooltip> */}
              <Tooltip title="Delete">
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    deleteTemplate(record);
                  }}
                />
              </Tooltip>
            </Space>
          );
        },
      },
    ]);
    const [alltemplates, setAllTemplates] = useState([]);
    const [priceTemplates, setPriceTemplates] = useState([]);
    const [categoryTemplates, setCategoryTemplates] = useState([]);
    const [inventoryTemplates, setInventoryTemplates] = useState([]);
    const [titleTemplates, setTitleTemplates] = useState([]);
    const [addTemplateValue, setAddTemplateValue] = useState(null);
    const [gridLoader, setGridLoader] = useState(false);
    const [accountSelectionModal, setaccountSelectionModal] = useState({
      active: false,
      siteID: "",
      accountName: "",
      options: [],
      shopID: "",
    });
  
    // filters
    const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
    const [filters, setFilters] = useState(getFitersInitially());
  
    const [filterCategoryName, setFilterCategoryName] = useState("");
    const [filterInventoryName, setFilterInventoryName] = useState("");
    const [filterPriceName, setFilterPriceName] = useState("");
    const [filterTitleName, setFilterTitleName] = useState("");
    const [popOverStatus, setPopOverStatus] = useState({
      country: false,
    });
    const [selected, setSelected] = useState({
      country: [],
    });
    const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
    const [filtersToPass, setFiltersToPass] = useState("");
  
    const deleteTemplate = async (record) => {
      let { templateId } = record;
      let { success, message } = await deleteTemplateID(deleteTempalteURL, {
        templateId,
      });
      if (success) {
        notify.success(message);
        // await getTemplatesList();
        hitRequiredFuncs();
      } else {
        notify.error(message);
        // await getTemplatesList();
        hitRequiredFuncs();
      }
    };
  
    const getUsername = (siteid, username) => {
      if (siteid) {
        let test = username.find((user) => user.siteID === siteid);
        return test.label;
      }
    };
    const getTemplatesList = async (ebayAccountsObj) => {
      setGridLoader(true);
      let postData = {
        marketplace: "ebay",
        multitype: ["category", "price", "inventory", "title"],
        ...filtersToPass,
      }
      const {
        success,
        data: fetchedTemplatesArray,
        message,
      } = await getTemplates(getTemplatesURL, postData);
      if (success) {
        // setTimeout(() => {
        const overAllFilteredTemplateData = fetchedTemplatesArray.map(
          (template, index) => {
            const filteredTemplateData = {
              templateUniqueKey: index,
              templateType: capitalizeFirstLetterofWords(template["type"]),
              filterName: template["title"],
              templateName: (
                <Text
                  strong
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (template["type"] === "category") {
                      props.history.push(
                        `/panel/ebay/templatesUS/handler?type=${template[
                          "type"
                        ].toLowerCase()}&id=${template["_id"]}&siteID=${
                          template["data"]?.site_id
                        }&shopID=${template["data"]?.shop_id}`
                      );
                    } else {
                      props.history.push(
                        `/panel/ebay/templatesUS/handler?type=${capitalizeFirstLetterofWords(
                          template["type"]
                        ).toLowerCase()}&id=${template["_id"]}`
                      );
                    }
                  }}
                >
                  {capitalizeFirstLetterofWords(template["title"])}
                </Text>
              ),
              siteID: template["data"]?.site_id,
              shopID: template["data"]?.shop_id,
              primaryCategoryMappingName:
                template["data"]?.["primaryCategoryMappingName"],
              listingType: sellingFormatOptions.find(
                (formatOption) =>
                  formatOption["value"] ===
                  template["data"]?.["selling_details"]?.format
              )?.["label"],
              titleMapping: AttributeMapoptions.find(
                (mapOption) =>
                  mapOption["value"] === template["data"]?.["title"]?.["selected"]
              )?.["label"],
              descriptionMapping: AttributeMapoptions.find(
                (mapOption) =>
                  mapOption["value"] ===
                  template["data"]?.["description"]?.["selected"]
              )?.["label"],
              templateConnectedAccount:
                Object.keys(template["data"]).length > 0 ? (
                  <Stack alignment="center" spacing="tight">
                    <>{getCountyrName(template["data"]["site_id"])}</>
                    <>
                      {getUsername(template["data"]["site_id"], ebayAccountsObj)}
                    </>
                  </Stack>
                ) : (
                  <Text>
                    {" "}
                    <LineOutlined style={{ color: "#000" }} />
                  </Text>
                ),
              templateId: template["_id"],
            };
            return filteredTemplateData;
          }
        );
        setAllTemplates(overAllFilteredTemplateData);
        // }, 1000);
      } else {
        notify.error(message);
        redirect("/auth/login");
      }
      setGridLoader(false);
    };
  
    const redirect = (url) => {
      props.history.push(url);
    };
  
    useEffect(() => {
      let categoryTemplatesTemp = [];
      let priceTemplatesTemp = [];
      let titleTemplatesTemp = [];
      let inventoryTemplatesTemp = [];
  
      alltemplates.forEach((template) => {
        switch (template["templateType"]) {
          case "Category":
            categoryTemplatesTemp.push(template);
            break;
          case "Price":
            priceTemplatesTemp.push(template);
            break;
          case "Title":
            titleTemplatesTemp.push(template);
            break;
          case "Inventory":
            inventoryTemplatesTemp.push(template);
            break;
          default:
            break;
        }
      });
      setCategoryTemplates(categoryTemplatesTemp);
      setPriceTemplates(priceTemplatesTemp);
      setTitleTemplates(titleTemplatesTemp);
      setInventoryTemplates(inventoryTemplatesTemp);
    }, [alltemplates]);
  
    const getAllConnectedAccounts = async () => {
      let {
        success: accountConnectedSuccess,
        data: connectedAccountData,
        message,
      } = await getConnectedAccounts();
      let ebayAccountsObj = [];
      let ebayAccountsObjFilter = [];
      if (accountConnectedSuccess) {
        let ebayAccounts = connectedAccountData.filter(
          (account) => account["marketplace"] === "ebay"
        );
        let ebayAccountsFilter = [...ebayAccounts];
        ebayAccounts.forEach((account, key) => {
          let temp = {};
          temp["value"] = `${getCountryName(
            account["warehouses"][0]["site_id"]
          )}-${account["warehouses"][0]["user_id"]}`;
          temp["label"] = account["warehouses"][0]["user_id"];
          temp["siteID"] = account["warehouses"][0]["site_id"];
          temp["shopID"] = account["id"];
          ebayAccountsObj.push(temp);
        });
        ebayAccountsFilter.forEach((account, key) => {
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
        setaccountSelectionModal({
          ...accountSelectionModal,
          options: ebayAccountsObj,
          siteID: ebayAccountsObj[0]?.siteID,
          accountName: ebayAccountsObj[0]?.value,
          shopID: ebayAccountsObj[0]?.shopID,
        });
        let temp = { ...filters };
        temp["country"]["options"] = ebayAccountsObjFilter;
        setFilters(temp);
        setconnectedAccountsArray(ebayAccountsObjFilter);
      } else {
        notify.error(message);
      }
      return ebayAccountsObj;
    };
  
    const verify = useCallback(
      debounce((value) => {
        let type = "";
        type = "filter[categoryName][3]";
        let titleFilterObj = {};
        titleFilterObj[type] = value;
        setFiltersToPass({ ...filtersToPass, ...titleFilterObj });
      }, 200),
      [filtersToPass]
    );
    useEffect(() => {
      if (filterCategoryName !== "") {
        verify(filterCategoryName);
      }
    }, [filterCategoryName]);
  
    const hitRequiredFuncs = async () => {
      let ebayAccountsObj = await getAllConnectedAccounts();
      await getTemplatesList(ebayAccountsObj);
    };
  
    useEffect(() => {
      hitRequiredFuncs();
    }, [filtersToPass]);
  
    const getColumns = (templateName) => {
      let columns = templateGridColumns;
      switch (templateName) {
        case "Category":
          columns = columns.filter(
            (col) =>
              col["dataIndex"] !== "listingType" &&
              col["dataIndex"] !== "titleMapping" &&
              col["dataIndex"] !== "descriptionMapping"
          );
          return columns;
        case "Price":
          columns = columns.filter(
            (col) =>
              col["dataIndex"] !== "templateConnectedAccount" &&
              col["dataIndex"] !== "titleMapping" &&
              col["dataIndex"] !== "descriptionMapping"&&
              col["dataIndex"] !== "primaryCategoryMappingName"
          );
          return columns;
        case "Title":
          columns = columns.filter(
            (col) =>
              col["dataIndex"] !== "templateConnectedAccount" &&
              col["dataIndex"] !== "listingType" &&
              col["dataIndex"] !== "primaryCategoryMappingName"
          );
          return columns;
        default:
          columns = columns.filter(
            (col) =>
              col["dataIndex"] !== "templateConnectedAccount" &&
              col["dataIndex"] !== "listingType" &&
              col["dataIndex"] !== "titleMapping" &&
              col["dataIndex"] !== "descriptionMapping" &&
              col["dataIndex"] !== "primaryCategoryMappingName"
          );
          return columns;
      }
      // if (templateName === "All") {
      //   columns = templateGridColumns;
      //   return columns;
      // } else {
      //   // columns = templateGridColumns.filter(
      //   //   (column) => column["dataIndex"] !== "templateType"
      //   // );
      //   if (templateName !== "Category") {
      //     columns = columns.filter(
      //       (col) => col["dataIndex"] !== "templateConnectedAccount"
      //     );
      //     return columns;
      //   } else {
      //     return columns;
      //   }
      // }
    };
  
    const renderName = (templateName) => {
      if (templateName === "Category") {
        return (
          <TextField
            key="templateName"
            autoFocus
            value={filterCategoryName}
            onChange={(e) => {
              // let categoryTemplatesTemp = [];
              // categoryTemplates.forEach((categoryTemplate) => {
              //   if (categoryTemplate["filterName"].toLowerCase().includes(e)) {
              //     categoryTemplatesTemp.push(categoryTemplate);
              //   }
              // });
              // let type = "filter[categoryName][3]";
              // let titleFilterObj = {};
              // titleFilterObj[type] = e;
              // setFiltersToPass({ ...filtersToPass, ...titleFilterObj });
              // setCategoryTemplates(categoryTemplatesTemp);
              setFilterCategoryName(e);
            }}
            placeholder={"Search with name"}
          />
        );
      } else if (templateName === "Inventory") {
        return (
          <TextField
            autoFocus
            value={filterInventoryName}
            onChange={(e) => {
              let inventoryTemplatesTemp = [];
              inventoryTemplates.forEach((inventoryTemplate) => {
                if (inventoryTemplate["filterName"].toLowerCase().includes(e)) {
                  inventoryTemplatesTemp.push(inventoryTemplate);
                }
              });
              let type = "filter[name][3]";
              let titleFilterObj = {};
              titleFilterObj[type] = e;
              setFiltersToPass({ ...filtersToPass, ...titleFilterObj });
              setInventoryTemplates(inventoryTemplatesTemp);
              setFilterInventoryName(e);
            }}
            placeholder={"Search with name"}
          />
        );
      } else if (templateName === "Price") {
        return (
          <TextField
            value={filterPriceName}
            onChange={(e) => {
              setFilterPriceName(e);
            }}
            placeholder={"Search with name"}
          />
        );
      } else if (templateName === "Title") {
        return (
          <TextField
            value={filterTitleName}
            onChange={(e) => {
              setFilterTitleName(e);
            }}
            placeholder={"Search with name"}
          />
        );
      }
    };
    const popOverHandler = (type) => {
      let temp = { ...popOverStatus };
      temp[type] = !popOverStatus[type];
      setPopOverStatus(temp);
    };
    const countryActivator = (
      <Button disclosure onClick={() => popOverHandler("country")}>
        Account
      </Button>
    );
    const handleChange = (value, selectedType) => {
      let type = `filter[${selectedType}][1]`;
      let filterObj = {};
      filterObj[type] = value[0];
      setFiltersToPass({ ...filtersToPass, ...filterObj });
      setSelected({ ...selected, [selectedType]: value });
    };
    const renderChoiceListForTemplatenameCountry = () => (
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
    );
  
    const getFieldValue = (field) => {
      switch (field) {
        case "categoryName":
          return "Name";
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
  
    const tagMarkup = (templateName) => {
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
              // setFilterProfileNameORCountry("");
              setFilterCategoryName("");
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
  
    const renderCategoryOtherFilters = () => {
      return (
        <Stack wrap>
          <Button
            icon={<Icon source={FilterMajorMonotone} color="base" />}
            onClick={() => {
              setFiltersDrawerVisible(true);
            }}
          >
            More Filters
          </Button>
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
      setFiltersToPass({ ...filtersToPassTemp, ...temp });
      // setFiltersToPass({ ...temp });
    };
    const getTabContent = () => {
      let content = {};
      let templatestTabObject = {
        // All: alltemplates,
        Category: categoryTemplates,
        Inventory: inventoryTemplates,
        Price: priceTemplates,
        Title: titleTemplates,
      };
      Object.keys(templatestTabObject).forEach((templateName) => {
        content[
          getTemplatesCountTabLabel(
            templatestTabObject[templateName],
            templateName
          )
        ] = (
          <Card sectioned>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Stack wrap>
                  <Stack.Item fill>{renderName(templateName)}</Stack.Item>
                  {templateName === "Category" && (
                    <Stack.Item>
                      {/* {renderChoiceListForTemplatenameCountry()} */}
                      {renderCategoryOtherFilters()}
                    </Stack.Item>
                  )}
                </Stack>
                {templateName === "Category" && (
                  <Stack spacing="tight">
                    {Object.keys(filtersToPass).length > 0 &&
                      tagMarkup(templateName)}
                  </Stack>
                )}
              </div>
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                justify="space-between"
                style={{ marginBottom: 10 }}
              >
                <Col className="gutter-row" span={18}>
                  {/* <PaginationComponent
                    totalCount={totalProductsCount}
                    pageSizeOptions={pageSizeOptions}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    size={"default"}
                    simple={false}
                  /> */}
                </Col>
              </Row>
            </div>
            <NestedTableComponent
              columns={getColumns(templateName)}
              dataSource={templatestTabObject[templateName]}
              loading={gridLoader}
              size={"small"}
              pagination={false}
            />
          </Card>
        );
      });
      return content;
    };
    return (
      <PageHeader
        className="site-page-header-responsive"
        title="Templates"
        ghost={true}
        extra={[
          <Select
            key="addTemplates"
            value={addTemplateValue}
            placeholder={<Text strong>Add Templates</Text>}
            onChange={(selectedTemplateValue) => {
              if (selectedTemplateValue === "category") {
                setaccountSelectionModal({
                  ...accountSelectionModal,
                  active: true,
                });
              } else {
                props.history.push(
                  `/panel/ebay/templatesUS/handler?type=${selectedTemplateValue}`
                );
              }
            }}
          >
            {addTemplatesOptions.map((option) => (
              <Option key={option["value"]} value={option["value"]}>
                {option["label"]}
              </Option>
            ))}
          </Select>,
        ]}
      >
        {/* <Card sectioned> */}
        <TabsComponent totalTabs={5} tabContents={getTabContent()} />
        {/* </Card> */}
        <Modal
          open={accountSelectionModal.active}
          onClose={() =>
            setaccountSelectionModal({ ...accountSelectionModal, active: false })
          }
          title="Select account for category template"
          primaryAction={{
            content: "Add",
            onAction: () => {
              props.history.push(
                `/panel/ebay/templatesUS/handler?type=category&siteID=${accountSelectionModal.siteID}&shopID=${accountSelectionModal.shopID}`
              );
            },
          }}
        >
          <Modal.Section>
            <Stack distribution="center" alignment="center">
              <>
                {getCountyrName(accountSelectionModal.siteID) !== "-" &&
                  getCountyrName(accountSelectionModal.siteID)}
              </>
              <PolarisSelect
                options={accountSelectionModal.options}
                value={accountSelectionModal.accountName}
                placeholder="Please Select..."
                onChange={(e) => {
                  let temp = accountSelectionModal.options.filter(
                    (account) => account["value"] === e
                  );
                  setaccountSelectionModal({
                    ...accountSelectionModal,
                    accountName: temp[0]?.value,
                    siteID: temp[0]?.siteID,
                    shopID: temp[0]?.shopID,
                  });
                }}
              />
            </Stack>
          </Modal.Section>
        </Modal>
        <NewFilterComponentSimilarPolaris
          setFiltersDrawerVisible={setFiltersDrawerVisible}
          filtersDrawerVisible={filtersDrawerVisible}
          filters={filters}
          // operatorOptions={operatorOptions}
          stringOperatorOptions={stringOperatorOptions}
          numberOperatorOptions={numberOperatorOptions}
          setFilters={setFilters}
          gatherAllFilters={gatherAllFilters}
          setFiltersToPass={setFiltersToPass}
          setFilterTitleORsku={setFilterCategoryName}
          setSelected={setSelected}
        />
      </PageHeader>
    );
  };
  
  export default TemporaryTemplateGrid;
  