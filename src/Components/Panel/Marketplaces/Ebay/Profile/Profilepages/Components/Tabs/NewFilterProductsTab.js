import {
  Banner,
  Button,
  Card,
  FormLayout,
  Icon,
  Layout,
  Select,
  Stack,
  TextField,
} from "@shopify/polaris";
import { CancelSmallMinor, MarketingMajorFilled } from "@shopify/polaris-icons";
import { Image } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useEffect, useState } from "react";
import {
  getFilterAttributes,
  getProductsbyquery,
} from "../../../../../../../../Apirequest/ebayApirequest/profileApi";
import { getImportAttribute } from "../../../../../../../../Apirequest/registrationApi";
import { notify } from "../../../../../../../../services/notify";
import NoProductImage from "../../../../../../../../assets/notfound.png";
import {
  getVariantsCountDetails,
  trimTitle,
} from "../../../../Products/helperFunctions/commonHelper";
import NestedTableComponent from "../../../../../../../AntDesignComponents/NestedTableComponent";
import PaginationComponent from "../../../../../../../AntDesignComponents/PaginationComponent";

const filterConditionsforDropdown = [{ label: "Equals", value: "==" }];

const filterConditionsforQueryString = [
  { label: "Equals", value: "==" },
  { label: "Not Equals", value: "!=" },
  { label: "Contains", value: "%LIKE%" },
  { label: "Does Not Contains", value: "!%LIKE%" },
];

const filterConditionsforQueryNumber = [
  { label: "Equals", value: "==" },
  { label: "Not Equals", value: "!=" },
  { label: "Greater Than", value: ">" },
  { label: "Less Than", value: "<" },
  { label: "Greater Than Equal To", value: ">=" },
  { label: "Less Than Equal To", value: "<=" },
];

const allfilterConditions = [
  { label: "Equals", value: "==" },
  { label: "Not Equals", value: "!=" },
  { label: "Contains", value: "%LIKE%" },
  { label: "Does Not Contains", value: "!%LIKE%" },
  { label: "Greater Than", value: ">" },
  { label: "Less Than", value: "<" },
  { label: "Greater Than Equal To", value: ">=" },
  { label: "Less Than Equal To", value: "<=" },
];

const NewFilterProductsTab = ({
  setMinProductFlag,
  setPrepareQuery,
  savedQuery,
}) => {
  const [filtersArrayGroup, setFiltersArrayGroup] = useState([
    [{ attribute: "", condition: "", value: "" }],
  ]);
  const [filterAttributes, setFilterAttributes] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  const [query, setQuery] = useState("");
  const [sentenceQuery, setSentenceQuery] = useState("");
  const [errorsArray, setErrorsArray] = useState([]);
  const [testQueryLoader, setTestQueryLoader] = useState(false);
  const [productData, setProductData] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [productColumns, setProductColumns] = useState([
    {
      title: <center>Image</center>,
      dataIndex: "image",
      key: "image",
      width: 80,
      className: "show",
      label: "Image",
      value: "Image",
      checked: true,
      editable: true,
      fixed: window.innerWidth <= 768 ? false : "left",
    },
    {
      title: <center>Title</center>,
      dataIndex: "title",
      key: "title",
      className: "show",
      label: "Title",
      value: "Title",
      checked: true,
      editable: true,
      onCell: () => {},
      width: 250,
      fixed: window.innerWidth <= 768 ? false : "left",
    },
    // {
    //   title: <center>Status</center>,
    //   dataIndex: "productStatus",
    //   key: "productStatus",
    //   className: "show",
    //   label: "Status",
    //   value: "status",
    //   checked: true,
    //   editable: true,
    //   onCell: () => {},
    //   width: 250,
    // },
    // {
    //   title: <center>Inventory</center>,
    //   dataIndex: "variantsCount",
    //   key: "variantsCount",
    //   className: "show",
    //   label: "Variant Count",
    //   value: "Variant Count",
    //   checked: true,
    //   editable: true,
    // },
    {
      title: <center>Profile</center>,
      dataIndex: "profile",
      key: "profile",
      className: "show",
      label: "Profile",
      value: "Profile",
      checked: true,
      editable: true,
    },
    {
      title: <center>Product Type</center>,
      dataIndex: "productType",
      key: "productType",
      className: "show",
      label: "Product Type",
      value: "Product Type",
      checked: true,
      editable: true,
    },
    // {
    //   title: <center>Variant Attributes</center>,
    //   dataIndex: "variantAttributes",
    //   key: "variantAttributes",
    //   className: "show",
    //   label: "Variant Attributes",
    //   value: "Variant Attributes",
    //   checked: true,
    //   editable: true,
    // },
    {
      title: <center>Vendor</center>,
      dataIndex: "vendor",
      key: "vendor",
      className: "show",
      label: "Vendor",
      value: "Vendor",
      checked: true,
      editable: true,
    },
  ]);

  const hitFilterAttributes = async () => {
    let { success, data } = await getFilterAttributes({
      marketplace: "shopify",
    });
    if (success && data && Array.isArray(data) && data.length) {
      const modifiedAttributeData = data.map((attributeObj) => {
        const { code, title } = attributeObj;
        let returnedObj = {};
        returnedObj = { label: title, value: code };
        return returnedObj;
      });
      setFilterAttributes(modifiedAttributeData);
    }
  };

  const hitProductTypeVendors = async () => {
    let { success, data } = await getImportAttribute();
    if (success && data) {
      const { product_type, vendor } = data;
      const productTypeList = product_type.map((type) => {
        return { label: type, value: type };
      });
      const vendorList = vendor.map((type) => {
        return { label: type, value: type };
      });
      setProductTypeList(productTypeList);
      setVendorList(vendorList);
    }
  };

  const getSavedQuery = () => {
    const { queryArray, query, querySentence } = savedQuery;
    if (queryArray && Array.isArray(queryArray) && queryArray.length) {
      let temp = filtersArrayGroup;
      temp = [...queryArray];
      prepareQuery();
      setQuery(query);
      setSentenceQuery(querySentence);
      setFiltersArrayGroup(temp);
    }
  };

  useEffect(() => {
    getSavedQuery();
  }, [savedQuery]);

  useEffect(() => {
    hitFilterAttributes();
    hitProductTypeVendors();
  }, []);

  const changeHandler = (value, index, innerIndex, fieldType) => {
    let tempFiltersArrayGroup = [...filtersArrayGroup];
    let tempError = [...errorsArray];
    if (fieldType) {
      switch (fieldType) {
        case "attribute":
          if (tempError?.[index]?.[innerIndex]?.["attribute"]) {
            tempError[index][innerIndex]["attribute"] = false;
          }
          tempFiltersArrayGroup[index][innerIndex]["attribute"] = "";
          tempFiltersArrayGroup[index][innerIndex]["condition"] = "";
          tempFiltersArrayGroup[index][innerIndex]["value"] = "";
          break;
        case "condition":
          if (tempError?.[index]?.[innerIndex]?.["condition"]) {
            tempError[index][innerIndex]["condition"] = false;
          }
          tempFiltersArrayGroup[index][innerIndex]["condition"] = "";
          tempFiltersArrayGroup[index][innerIndex]["value"] = "";
          break;
        case "value":
          if (tempError?.[index]?.[innerIndex]?.["value"]) {
            tempError[index][innerIndex]["value"] = false;
          }
          tempFiltersArrayGroup[index][innerIndex]["value"] = "";
          break;
      }
      if (
        fieldType === "attribute" &&
        ["brand", "product_type"].includes(value)
      ) {
        tempFiltersArrayGroup[index][innerIndex]["condition"] = "==";
      }
      tempFiltersArrayGroup[index][innerIndex][fieldType] = value;
      setFiltersArrayGroup(tempFiltersArrayGroup);
      setErrorsArray(tempError);
      setQuery("");
    }
  };

  const getAndStructure = (index) => {
    let andArray = filtersArrayGroup[index].map((arrayGroup, innerIndex) => {
      return (
        <FormLayout>
          <FormLayout.Group>
            <Select
              label="Attribute Selection"
              value={arrayGroup["attribute"]}
              options={filterAttributes}
              placeholder="Please Select..."
              onChange={(value) =>
                changeHandler(value, index, innerIndex, "attribute")
              }
              error={errorsArray?.[index]?.[innerIndex]?.["attribute"]}
            />
            <Select
              label="Condition Selection"
              value={arrayGroup["condition"]}
              options={
                ["brand", "product_type"].includes(arrayGroup["attribute"])
                  ? filterConditionsforDropdown
                  : ["title", "tags", "description"].includes(
                      arrayGroup["attribute"]
                    )
                  ? filterConditionsforQueryString
                  : ["price", "quantity"].includes(arrayGroup["attribute"]) &&
                    filterConditionsforQueryNumber
              }
              placeholder="Please Select..."
              onChange={(value) =>
                changeHandler(value, index, innerIndex, "condition")
              }
              disabled={
                arrayGroup["attribute"] === "" ||
                ["brand", "product_type"].includes(arrayGroup["attribute"])
              }
              error={errorsArray?.[index]?.[innerIndex]?.["condition"]}
            />
            {["brand", "product_type"].includes(arrayGroup["attribute"]) ? (
              <Select
                label="Value"
                value={arrayGroup["value"]}
                options={
                  arrayGroup["attribute"] === "product_type"
                    ? productTypeList
                    : arrayGroup["attribute"] === "brand" && vendorList
                }
                placeholder="Please Select..."
                onChange={(value) =>
                  changeHandler(value, index, innerIndex, "value")
                }
                disabled={
                  arrayGroup["attribute"] === "" ||
                  arrayGroup["condition"] === ""
                }
                error={errorsArray?.[index]?.[innerIndex]?.["value"]}
              />
            ) : (
              <TextField
                label="Value"
                value={arrayGroup["value"]}
                onChange={(value) =>
                  changeHandler(value, index, innerIndex, "value")
                }
                disabled={
                  arrayGroup["attribute"] === "" ||
                  arrayGroup["condition"] === ""
                }
                error={errorsArray?.[index]?.[innerIndex]?.["value"]}
              />
            )}
            {filtersArrayGroup[index].length > 1 && (
              <Button
                destructive
                icon={<Icon source={CancelSmallMinor} color="base" />}
                onClick={() => {
                  let tempFiltersArrayGroup = [...filtersArrayGroup];
                  tempFiltersArrayGroup[index].splice(innerIndex, 1);
                  setFiltersArrayGroup(tempFiltersArrayGroup);
                  setQuery("");
                  setProductData([]);
                  setTotalProductsCount(0);
                  setMinProductFlag(false);
                }}
              >
                Remove
              </Button>
            )}
          </FormLayout.Group>
        </FormLayout>
      );
    });
    return andArray;
  };

  const getOrStructure = () => {
    let orArray = filtersArrayGroup.map((arrayGroup, index) => {
      return (
        <Card.Section
          key={index}
          // sectioned
          actions={[
            {
              content: "Add More",
              onAction: () => {
                let tempFiltersArrayGroup = [...filtersArrayGroup];
                let tempObj = { attribute: "", condition: "", value: "" };
                tempFiltersArrayGroup[index].push(tempObj);
                setFiltersArrayGroup(tempFiltersArrayGroup);
                setQuery("");
                setProductData([]);
                setTotalProductsCount(0);
                setMinProductFlag(false);
              },
            },
            {
              content: "Remove",
              destructive: true,
              onAction: () => {
                let tempFiltersArrayGroup = [...filtersArrayGroup];
                tempFiltersArrayGroup.splice(index, 1);
                setFiltersArrayGroup(tempFiltersArrayGroup);
                setQuery("");
                setProductData([]);
                setTotalProductsCount(0);
                setMinProductFlag(false);
              },
              disabled: filtersArrayGroup.length === 1,
            },
          ]}
        >
          {getAndStructure(index)}
        </Card.Section>
      );
    });
    return orArray;
  };

  useEffect(() => {
    if (totalProductsCount) {
      runQuery();
    }
  }, [activePage, pageSize]);

  useEffect(() => {
    getParsedQuerySentence();
  }, [filtersArrayGroup]);

  const runQuery = async () => {
    setTestQueryLoader(true);
    let { success, data, rows } = await getProductsbyquery({
      query: query,
      marketplace: "shopify",
      count: pageSize,
      activePage: activePage,
    });
    if (success && rows && Array.isArray(rows)) {
      let tempProductData = [];
      tempProductData = rows.map((row, index) => {
        let {
          main_image,
          title,
          product_type,
          variant_attributes,
          variants,
          container_id,
          brand,
          profile_name,
          source_product_id,
          edited,
        } = row;
        let tempObject = {};
        tempObject["source_product_id"] = source_product_id;
        tempObject["key"] = index;
        tempObject["image"] = (
          <center>
            {main_image ? (
              <Image width={30} src={main_image} />
            ) : (
              <Image width={30} preview={false} src={NoProductImage} />
            )}
          </center>
        );
        tempObject["title"] = (
          <Stack spacing="extraTight" wrap={true} vertical={false}>
            <Text strong title={title}>
              {trimTitle(title)}
            </Text>
            <Text
              copyable={{
                text: title,
              }}
            />
          </Stack>
        );
        // tempObject["productStatus"] = (
        //   <Stack alignment="center" distribution="center">
        //     <PopoverProduct>{getProductStatus(edited)}</PopoverProduct>
        //   </Stack>
        // );
        tempObject["productType"] = (
          <center>
            <Text>{product_type}</Text>
          </center>
        );
        tempObject["vendor"] = (
          <center>
            <Text>{brand}</Text>
          </center>
        );
        tempObject["profile"] = (
          <center>
            <Text>{profile_name}</Text>
          </center>
        );
        // tempObject["variantAttributes"] = (
        //   <center>
        //     <Text copyable={variant_attributes.length && true}>
        //       {variant_attributes.map((attibute) => attibute).join(", ")}
        //     </Text>
        //   </center>
        // );
        // tempObject["variantsCount"] = (
        //   <center>
        //     <Text>{getVariantsCountDetails(variants, variant_attributes)}</Text>
        //   </center>
        // );
        tempObject["variantsData"] = variants;
        tempObject["container_id"] = container_id;
        return tempObject;
      });
      setProductData(tempProductData);
      setTotalProductsCount(data);
      if (rows.length === 0) {
        setMinProductFlag(false);
      } else {
        setMinProductFlag(true);
      }
      setPrepareQuery({
        query: query,
        querySentence: sentenceQuery,
        queryArray: filtersArrayGroup,
      });
      if (rows.length == 0) {
        notify.warn(
          "No product(s) lie under the given conditions, Please try something different"
        );
      }
    }
    setTestQueryLoader(false);
  };

  useEffect(() => {
    if (query) {
      runQuery();
    }
  }, [query]);

  const prepareQuery = () => {
    let temp = [...filtersArrayGroup];
    let resStr = "";
    temp.forEach((orCondtionDataArray, index) => {
      if (index > 0) {
        resStr += " || ";
      }
      resStr += "(";
      orCondtionDataArray.forEach((andConditionDataObj, innerIndex) => {
        if (innerIndex > 0) {
          resStr += " && ";
        }
        Object.keys(andConditionDataObj).forEach((key, innerMostIndex) => {
          resStr += andConditionDataObj[key];
          if (innerMostIndex < 2) {
            resStr += " ";
          }
        });
      });
      resStr += ")";
    });
    setQuery(resStr);
  };

  const validorFilterProducts = () => {
    let errorCount = 0;
    let temp = [...filtersArrayGroup];
    const tempError = [];
    temp.forEach((orArray, index) => {
      tempError[index] = [];
      if (orArray && Array.isArray(orArray) && orArray.length) {
        orArray.forEach((andObj, innerIndex) => {
          tempError[index][innerIndex] = {};
          Object.keys(andObj).forEach((key, innerMostIndex) => {
            if (andObj[key] === "") {
              errorCount++;
              tempError[index][innerIndex][key] = "*required";
            } else {
              tempError[index][innerIndex][key] = false;
            }
          });
        });
      }
    });
    setErrorsArray(tempError);
    return errorCount;
  };

  const getParsedQuerySentence = () => {
    let resStr = "";
    let temp = [...filtersArrayGroup];
    temp.forEach((orCondtionDataArray, index) => {
      if (index > 0) {
        resStr += " OR ";
      }
      if (orCondtionDataArray[0]["attribute"] !== "") {
        resStr += "(";
      }
      orCondtionDataArray.forEach((andConditionDataObj, innerIndex) => {
        if (innerIndex > 0) {
          resStr += " AND ";
        }
        Object.keys(andConditionDataObj).forEach((key, innerMostIndex) => {
          switch (key) {
            case "attribute":
              let attributeLabel = filterAttributes.find(
                (attribute) => attribute.value === andConditionDataObj[key]
              )?.["label"];
              if (attributeLabel) {
                resStr += attributeLabel;
              } else {
                resStr += "";
              }
              break;
            case "condition":
              let conditionLabel = allfilterConditions.find(
                (attribute) => attribute.value === andConditionDataObj[key]
              )?.["label"];
              if (conditionLabel) {
                resStr += conditionLabel;
              } else {
                resStr += "";
              }
              break;
            case "value":
              let valueLabel = andConditionDataObj[key];
              if (valueLabel) {
                resStr += valueLabel;
              } else {
                resStr += "";
              }
              break;
          }
          if (innerMostIndex < 2) {
            resStr += " ";
          }
        });
      });
      if (orCondtionDataArray[0]["value"] !== "") {
        resStr += ")";
      }
    });
    setSentenceQuery(resStr);
  };

  return (
    <Card sectioned>
      <Layout>
        <Layout.AnnotatedSection
          id="filterProducts"
          title="Filter Products"
          // description="Create rules to filter, group and assign Shopify Products to this newly created Template."
          description={
            <>
              <>
                Create rules to filter, group and assign Shopify Products to
                this newly created Template.
              </>
              <Card.Section title="Add Group">
                <p>
                  Add Group corresponds to || (OR) condition . i.e. If any one
                  group condition is true then results will be shown based on
                  applied filters
                </p>
              </Card.Section>
              <Card.Section title="Add More">
                <p>
                  Add More corresponds to && (AND) condition. i.e. If all the
                  conditions within that one group are true then results will be
                  shown based on applied filters
                </p>
              </Card.Section>
            </>
          }
        >
          <Card
            primaryFooterAction={{
              content: "Test Query",
              // disabled: query === "",
              onAction: () => {
                const validatorFlag = validorFilterProducts();
                if (!validatorFlag) {
                  prepareQuery();
                } else {
                  notify.error(
                    "Kindly fill all the required fields with proper values"
                  );
                }
              },
              loading: testQueryLoader,
            }}
          >
            {/* <Card.Section>
              <Banner title="Add Group" status="info">
                <p>
                  Add Group corresponds to || (OR) condition . i.e. If any one
                  group condition is true then results will be shown based on
                  applied filters
                </p>
              </Banner>
              <Banner title="Add More" status="info">
                <p>
                  Add More corresponds to && (AND) condition. i.e. If all the
                  conditions within that one group are true then results will be
                  shown based on applied filters
                </p>
              </Banner>
            </Card.Section> */}
            {sentenceQuery !== "  " && (
              <Card.Section>
                <Banner status="info" icon={MarketingMajorFilled}>
                  {sentenceQuery}
                </Banner>
              </Card.Section>
            )}
            <Card.Section
              title="Group products by applying conditions"
              actions={[
                {
                  content: "Add Group",
                  onAction: () => {
                    let tempFiltersArrayGroup = [...filtersArrayGroup];
                    tempFiltersArrayGroup.push([
                      { attribute: "", condition: "", value: "" },
                    ]);
                    setFiltersArrayGroup(tempFiltersArrayGroup);
                    setQuery("");
                    setProductData([]);
                    setTotalProductsCount(0);
                    setMinProductFlag(false);
                  },
                },
              ]}
            >
              {getOrStructure()}
            </Card.Section>
            {query !== "" && !testQueryLoader && (
              <Card.Section>
                <Banner status="warning" icon={MarketingMajorFilled}>
                  Total {totalProductsCount} product(s) are filtered under
                  applied condition
                </Banner>
              </Card.Section>
            )}
            {query !== "" && !testQueryLoader && totalProductsCount > 0 && (
              <Card.Section>
                <Stack vertical spacing="extraTight">
                  <PaginationComponent
                    totalCount={totalProductsCount}
                    pageSizeOptions={pageSizeOptions}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    size={"default"}
                    simple={false}
                  />
                  <NestedTableComponent
                    loading={testQueryLoader}
                    size={"small"}
                    pagination={false}
                    columns={productColumns}
                    dataSource={productData}
                    scroll={{ x: 900, y: 500 }}
                  />
                </Stack>
              </Card.Section>
            )}
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Card>
  );
};

export default NewFilterProductsTab;
