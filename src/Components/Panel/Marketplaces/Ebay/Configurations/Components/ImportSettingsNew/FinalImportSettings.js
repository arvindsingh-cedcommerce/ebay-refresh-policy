import {
  Button,
  ButtonGroup,
  Card,
  ChoiceList,
  FormLayout,
  Layout,
  Select,
  Stack,
  SkeletonBodyText,
  SkeletonPage,
  TextField,
  SkeletonDisplayText,
  FooterHelp,
  Link,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import {
  getImportAttribute,
  initiateVendorProductTypeFetch,
} from "../../../../../../../Apirequest/registrationApi";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import { getrequest } from "../../../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../../../services/notify";
import {
  collectionFetchURL,
  saveAppSettingsShopifyToAppURL,
} from "../../../../../../../URLs/ConfigurationURL";
import {
  importCollectionProductURL,
  importProductURL,
} from "../../../../../../../URLs/ProductsURL";
import { withRouter } from "react-router-dom";

const publishedStatusOptions = [
  {
    label: "Please Select...",
    value: "",
  },
  { label: "All", value: "any" },
  { label: "Published", value: "published" },
  { label: "Unpublished", value: "unpublished" },
];
const productStatusOptions = [
  {
    label: "Please Select...",
    value: "",
  },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
  { label: "Draft", value: "draft" },
];

const FinalImportSettings = ({ importSettingsFromSavedAPIData, ...props }) => {
  const [flag, setflag] = useState(true);
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const [importProductFilters, setImportProductFilters] = useState({
    importAndReplaceProduct: {
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      label: "Import and replace product",
      enable: "yes",
      type: "segmentedBtn",
      description:
        "The option imports the products from Shopify based on the applied filters given below and replaces /removes the other existing products from the app.",
    },
    productType: {
      options: [{ label: "Please Select...", value: "" }],
      label: "Product Type",
      enable: "yes",
      type: "dropdown",
      value: "",
      description:
        "Select the product type you wish to import from Shopify to the App. By default, all product types are imported.",
    },
    vendor: {
      options: [{ label: "Please Select...", value: "" }],
      label: "Vendor",
      enable: "yes",
      type: "dropdown",
      value: "",
      description:
        "Select the vendor you wish to import from Shopify to the App. By default, products of all vendors are imported.",
    },
    publishedStatus: {
      options: publishedStatusOptions,
      label: "Published Status",
      enable: "yes",
      type: "dropdown",
      value: publishedStatusOptions[0]["value"],
      description:
        "Select the products with the required published status you wish to import from Shopify to the App. By default, products with all published status are imported.",
    },
    productStatus: {
      options: productStatusOptions,
      label: "Product Status",
      enable: "yes",
      type: "dropdown",
      value: productStatusOptions[0]["value"],
      description:
        "Select the products with the required product status you wish to import from Shopify to the App. By default, the active product statuses are imported.",
    },
    import_collection: {
      label: "Import Collection products",
      enable: "yes",
      type: "choicelist",
      description:
        "Products can be imported in the app based on the selected Shopify collections, you can select the checkbox shown next to the imported Shopify collections.",
      collections_options: [],
      selected_collection: [],
    },
    // productID: {
    //   options: [],
    //   label: "",
    //   enable: "yes",
    //   type: "textfield",
    //   value: "",
    //   description: "",
    // },
  });

  const [
    refreshProductTypeVendorBtnLoader,
    setRefreshProductTypeVendorBtnLoader,
  ] = useState(false);

  // import by filters
  const [importProductModalActive, setImportProductModalActive] =
    useState(false);
  const [importProductLoader, setImportProductLoader] = useState(false);
  const [importProductModalData, setImportProductModalData] = useState({});

  // import by collection
  const [importCollectionModalActive, setImportCollectionModalActive] =
    useState(false);
  const [importCollectionLoader, setImportCollectionLoader] = useState(false);

  const [refreshCollectionBtnLoader, setRefreshCollectionBtnLoader] =
    useState(false);

  const handleBtnPres = (e, field, innerFieldLevel1 = "") => {
    let temp = { ...importProductFilters };
    if (innerFieldLevel1) {
    } else {
      temp[field]["enable"] = temp[field]["enable"] === "yes" ? "no" : "yes";
    }
    if (field === "match_from_ebay" && temp[field]["enable"] === "no") {
      temp[field]["match_from_ebay"] = [];
    }
    setImportProductFilters(temp);
  };

  useEffect(() => {
    if (Object.keys(importSettingsFromSavedAPIData).length) {
      let temp = { ...importProductFilters };
      Object.keys(importSettingsFromSavedAPIData).forEach((field) => {
        // if (field !== "match_from_ebay" && field !== "productID") {
        // temp[field]["enable"] = importSettingsFromSavedAPIData[field]["enable"];
        temp[field]["enable"] = "yes";
        switch (field) {
          case "import_collection":
            temp[field]["selected_collection"] = importSettingsFromSavedAPIData[
              field
            ]
              ? importSettingsFromSavedAPIData[field]
              : [];
            break;
          case "importAndReplaceProduct":
            temp[field]["value"] = importSettingsFromSavedAPIData[field]
              ? "yes"
              : "no";
            temp[field]["enable"] = importSettingsFromSavedAPIData[field]
              ? "yes"
              : "no";
            break;
          default:
            temp[field]["value"] = importSettingsFromSavedAPIData[field];
            break;
        }
        setImportProductFilters(temp);
        // }
      });
    }
    setflag(false);
  }, [importSettingsFromSavedAPIData]);

  const prepareOptions = (data) => {
    data
      .sort((a, b) => b.localeCompare(a, "es", { sensitivity: "base" }))
      .reverse();
    const options = data.map((value) => {
      let tempObj = {};
      tempObj["label"] = value;
      tempObj["value"] = value;
      return tempObj;
    });
    options.unshift({ label: "Please Select...", value: "" });
    return options;
  };

  function sortPropertiesByValue(object) {
    const keys = Object.keys(object);
    keys
      .sort((a, b) => b.localeCompare(a, "es", { sensitivity: "base" }))
      .reverse();
    const valuesIndex = keys.map((key) => ({ key, value: object[key] }));
    // valuesIndex.sort((a, b) => b.value - a.value); // reverse sort

    const newObject = {};

    for (const item of valuesIndex) {
      newObject[item.key] = item.value;
    }
    return newObject;
  }

  const hitAPIsInitialRender = async () => {
    let { success, data } = await getImportAttribute();
    if (success) {
      let temp = { ...importProductFilters };
      if (data?.product_type) {
        let productTypeList = [...data.product_type];
        // if (data?.product_type) {
        //   productTypeList = data.product_type.filter(
        //     (val) => val !== "Apparel & Accessories"
        //   );
        // }
        temp["productType"]["options"] = prepareOptions(data?.product_type);
        if (
          temp["productType"]["value"] &&
          !productTypeList.includes(temp["productType"]["value"])
        ) {
          temp["productType"]["enable"] = "no";
          temp["productType"]["value"] = "";
          setImportProductFilters(temp);
          saveData(true);
        }
      }
      if (data?.vendor) {
        let vendorList = [...data.vendor];
        // if (data?.vendor) {
        //   vendorList = data.vendor.filter((val) => val !== "Aglini");
        // }
        temp["vendor"]["options"] = prepareOptions(vendorList);
        if (
          temp["vendor"]["value"] &&
          !vendorList.includes(temp["vendor"]["value"])
        ) {
          temp["vendor"]["enable"] = "no";
          temp["vendor"]["value"] = "";
          setImportProductFilters(temp);
          saveData(true);
        }
      }
      if (data?.collection) {
        let collectionList = { ...data.collection };
        let newTemp = {};
        for (const key in data.collection) {
          newTemp[data.collection[key]] = key;
        }
        let sortedCollectionList = sortPropertiesByValue(newTemp);
        let collectionList1 = Object.keys(sortedCollectionList)
          // .filter((val) => !["155237777487", "155728478287"].includes(val))
          .map((val) => {
            return { [sortedCollectionList[val]]: val };
          });
        collectionList = Object.keys(data.collection)
          // .filter((val) => !["155237777487", "155728478287"].includes(val))
          .map((val) => ({ [val]: data.collection[val] }));

        const options = collectionList.map((key) => {
          let tempObj = {};
          tempObj["value"] = Object.keys(key)[0];
          tempObj["label"] = key[Object.keys(key)[0]];
          return tempObj;
        });
        const options1 = collectionList1.map((key) => {
          let tempObj = {};
          tempObj["value"] = Object.keys(key)[0];
          tempObj["label"] = key[Object.keys(key)[0]];
          return tempObj;
        });

        temp["import_collection"]["collections_options"] = options1;

        let uniquesValuesArr = getMatchedCollectionValues(
          options1,
          temp["import_collection"]["selected_collection"]
        );
        if (temp["import_collection"]["selected_collection"].length > 0) {
          if (uniquesValuesArr.length > 0)
            temp["import_collection"]["enable"] = "yes";
          else temp["import_collection"]["enable"] = "no";
          temp["import_collection"]["selected_collection"] = [
            ...uniquesValuesArr,
          ];
          setImportProductFilters(temp);
          let tempCollectionList = collectionList.map((e) => {
            return Object.keys(e)[0];
          });
          // temp["import_collection"]["selected_collection"] = [1, 2, 3]
          let matchedValues = temp["import_collection"][
            "selected_collection"
          ].every((e) => tempCollectionList.includes(e));
          if (!matchedValues) {
            saveData(true);
          }
          // saveData(true);
        }
      }
      setImportProductFilters(temp);
    }
  };

  const getMatchedCollectionValues = (options, selectedCollections) => {
    // let matchedValuesFlag = false;
    let uniquesValuesArr = [];
    for (let i = 0; i < selectedCollections.length; i++) {
      let matchedValuesFlag1 = false;
      for (let j = 0; j < options.length; j++) {
        if (selectedCollections[i] == options[j]["value"]) {
          matchedValuesFlag1 = true;
          break;
        }
      }
      if (matchedValuesFlag1) {
        uniquesValuesArr.push(selectedCollections[i]);
      } else {
      }
    }
    // console.log("uniquesValuesArr", uniquesValuesArr, uniquesValuesArr.length);
    // return uniquesValuesArr.length > 0 ? true : false;
    return uniquesValuesArr;
    // options.forEach((option) => {
    //   if (selectedCollections.includes(option["value"])) {
    //     matchedValuesFlag = true;
    //   }
    // });
    // return matchedValuesFlag;
  };

  useEffect(() => {
    hitAPIsInitialRender();
  }, []);

  const importCollections = async () => {
    setRefreshCollectionBtnLoader(true);
    const { success, message } = await configurationAPI(collectionFetchURL);
    if (success) {
      notify.success(message);
    } else {
      notify.error(message);
    }
    await hitAPIsInitialRender();
    setRefreshCollectionBtnLoader(false);
  };

  const saveData = async (force = false, importType) => {
    if (!["importProduct", "importCollection"].includes(importType))
      !force && setSaveBtnLoader(true);
    let tempObj = {
      import_settings: {},
      setting_type: ["import_settings"],
    };
    for (const key in importProductFilters) {
      tempObj["import_settings"][key] = {};
      for (const key1 in importProductFilters[key]) {
        if (key1 === "enable") {
          tempObj["import_settings"][key][key1] =
            importProductFilters[key][key1];
        } else if (
          key1 === "value" ||
          key1 === "selected_collection" ||
          key1 === "match_from_ebay"
        ) {
          tempObj["import_settings"][key][key1] =
            importProductFilters[key][key1];
        }
        if (
          ["value", "match_from_ebay", "selected_collection"].includes(key1)
        ) {
          if (
            importProductFilters[key][key1] === "" ||
            (Array.isArray(importProductFilters[key][key1]) &&
              importProductFilters[key][key1].length === 0) ||
            (Object.getPrototypeOf(importProductFilters[key][key1]) ===
              Object.prototype &&
              Object.keys(importProductFilters[key][key1]).length === 0)
          ) {
            tempObj["import_settings"][key]["enable"] = "no";
          }
        }
      }
    }
    const parsedData = {
      import_settings: getParsedData(tempObj),
      setting_type: ["import_settings"],
    };
    let { success, message } = await configurationAPI(
      saveAppSettingsShopifyToAppURL,
      parsedData
    );
    if (success) {
      !force && notify.success(message);
      if (importType === "importProduct") {
        setImportProductLoader(true);
        let { success, message, data } = await getrequest(importProductURL);
        if (success) {
          notify.success(message ? message : data);
          props.history.push("/panel/ebay/activity");
        } else {
          notify.error(message ? message : data);
          setImportProductModalActive(false);
        }
        setImportProductLoader(false);
      }
      if (importType === "importCollection") {
        setImportCollectionLoader(true);
        let { success, message, data } = await getrequest(
          importCollectionProductURL
        );
        if (success) {
          notify.success(message ? message : data);
          props.history.push("/panel/ebay/activity");
        } else {
          notify.error(message ? message : data);
          setImportCollectionModalActive(false);
        }
        setImportCollectionLoader(false);
      }
    } else {
      notify.error(message);
    }
    if (!["importProduct", "importCollection"].includes(importType))
      !force && setSaveBtnLoader(false);
  };

  const getParsedData = (data) => {
    let tempParsedData = {};
    for (const key in data["import_settings"]) {
      if (key === "importAndReplaceProduct") {
        tempParsedData[key] =
          data["import_settings"][key]["enable"] === "yes" ? true : false;
      } else if (key === "import_collection") {
        tempParsedData[key] =
          data["import_settings"][key]["selected_collection"].length > 0
            ? data["import_settings"][key]["selected_collection"]
            : false;
      } else
        tempParsedData[key] = data["import_settings"][key]["value"]
          ? data["import_settings"][key]["value"]
          : false;
    }
    return tempParsedData;
  };

  const getDropDownStructure = (importProductFilterSetting) => {
    return (
      <Select
        label={importProductFilters[importProductFilterSetting]["label"]}
        options={importProductFilters[importProductFilterSetting]["options"]}
        value={importProductFilters[importProductFilterSetting]["value"]}
        onChange={(e) => {
          let temp = { ...importProductFilters };
          temp[importProductFilterSetting]["value"] = e;
          if (e) {
            temp[importProductFilterSetting]["enable"] = "yes";
          } else {
            temp[importProductFilterSetting]["enable"] = "no";
          }
          setImportProductFilters(temp);
        }}
      />
    );
  };

  const getImportByFiltersStructure = () => {
    let resultArr1 = (
      <Stack distribution="fillEvenly">
        {Object.keys(importProductFilters).map(
          (importProductFilterSetting, index1) => {
            switch (importProductFilterSetting) {
              case "publishedStatus":
                return getDropDownStructure(importProductFilterSetting);
              case "productStatus":
                return getDropDownStructure(importProductFilterSetting);
            }
          }
        )}
      </Stack>
    );
    let resultArr2 = (
      <Stack distribution="fillEvenly">
        {Object.keys(importProductFilters).map(
          (importProductFilterSetting, index1) => {
            switch (importProductFilterSetting) {
              case "vendor":
                return getDropDownStructure(importProductFilterSetting);
              case "productType":
                return getDropDownStructure(importProductFilterSetting);
              default:
                break;
            }
          }
        )}
      </Stack>
    );

    const importProductTypeVendor = async () => {
      setRefreshProductTypeVendorBtnLoader(true);
      let { success, message } = await initiateVendorProductTypeFetch();
      if (success) {
        notify.success(message);
        hitAPIsInitialRender();
      } else {
        notify.error(message);
      }
      setRefreshProductTypeVendorBtnLoader(false);
    };

    return (
      <Card
        sectioned
        actions={[
          {
            content: (
              <Stack>
                <Button
                  pressed
                  // primary
                  onClick={() => {
                    let parsedData =
                      parseImportProductData(importProductFilters);
                    setImportProductModalData(parsedData);
                    setImportProductModalActive(true);
                  }}
                >
                  Import Products
                </Button>
                {/* <Button
                  onClick={importProductTypeVendor}
                  loading={refreshProductTypeVendorBtnLoader}
                >
                  Refresh Product Type & Vendor
                </Button> */}
              </Stack>
            ),
            // {/* ),
            // onAction: () => {
            //   let parsedData = parseImportProductData(importProductFilters);
            //   setImportProductModalData(parsedData);
            //   setImportProductModalActive(true);
            // },
          },
        ]}
      >
        <Card.Section>{resultArr1}</Card.Section>
        <Card.Section
          title="Additional Filters"
          actions={[
            {
              content:
                // <Tooltip content="If all options not listed then please wait while data fetching process running you can reload the page to check the options">
                //   <Icon source={QuestionMarkMinor} color="base" />
                // </Tooltip>
                // <Button
                //   onClick={importProductTypeVendor}
                //   loading={refreshProductTypeVendorBtnLoader}
                // >
                "Refresh Product Type & Vendor",
              // {/* </Button> */}
              onClick: importProductTypeVendor,
              loading: refreshProductTypeVendorBtnLoader,
            },
          ]}
        >
          {resultArr2}
        </Card.Section>
      </Card>
    );
  };

  const getImportByCollectionStructure = () => {
    return (
      <Card
        sectioned
        actions={[
          {
            content: "Refresh Collections",
            onAction: importCollections,
            loading: refreshCollectionBtnLoader,
          },
          {
            content: (
              <Stack>
                <Button
                  // primary
                  pressed
                  onClick={() => {
                    let parsedData =
                      parseImportProductData(importProductFilters);
                    setImportCollectionModalActive(true);
                  }}
                >
                  Import Collection Products
                  {/* onAction: () => {
            setImportCollectionModalActive(true);
          }, */}
                </Button>
                {/* <Button
                onClick={importCollections}
                loading={refreshCollectionBtnLoader}
              >
                Refresh Collections
              </Button> */}
              </Stack>
            ),
          },
        ]}
        // secondaryFooterActions={[
        //   {
        //     content: "Refresh Collections",
        //     onAction: importCollections,
        //     loading: refreshCollectionBtnLoader,
        //   },
        // ]}
      >
        <div style={{ maxHeight: 400, overflowY: "scroll" }}>
          <ChoiceList
            e={""}
            choices={
              importProductFilters["import_collection"]["collections_options"]
            }
            selected={
              importProductFilters["import_collection"]["selected_collection"]
            }
            onChange={(e) => {
              let temp = { ...importProductFilters };
              temp["import_collection"]["selected_collection"] = e;
              if (e.length) {
                temp["import_collection"]["enable"] = "yes";
              } else {
                temp["import_collection"]["enable"] = "no";
              }
              setImportProductFilters(temp);
            }}
            allowMultiple={true}
          />
        </div>
      </Card>
    );
  };

  const getImportByProductID = () => {
    return (
      <Card sectioned>
        <TextField
          value={importProductFilters["productID"]["value"]}
          placeholder="Enter Source Product ID"
          onChange={(e) => {
            let temp = { ...importProductFilters };
            temp["productID"]["value"] = e;
            setImportProductFilters(temp);
          }}
        />
      </Card>
    );
  };

  const parseImportProductData = (data) => {
    let parsedData = {};
    let importByFiltersList = [
      "publishedStatus",
      "productStatus",
      "productType",
      "vendor",
    ];
    for (const key in data) {
      if (importByFiltersList.includes(key) && data[key]["value"]) {
        if (key === "publishedStatus") {
          let findValue = publishedStatusOptions.find(
            (option) => option.value === data[key]["value"]
          )["label"];
          parsedData["Published Status"] = findValue;
        }
        if (key === "productStatus") {
          let findValue = productStatusOptions.find(
            (option) => option.value === data[key]["value"]
          )["label"];
          parsedData["Product Status"] = findValue;
        }
        if (key === "productType") {
          let findValue = data[key]["options"].find(
            (option) => option.value === data[key]["value"]
          )["label"];
          parsedData["Product Type"] = findValue;
        }
        if (key === "vendor") {
          let findValue = data[key]["options"].find(
            (option) => option.value === data[key]["value"]
          )["label"];
          parsedData["Vendor"] = findValue;
        }
      }
    }
    return parsedData;
  };

  return flag ? (
    <>
      <Card sectioned>
        <SkeletonPage
          fullWidth={true}
          title={<SkeletonDisplayText size="small" />}
        >
          <Card.Section>
            <SkeletonBodyText lines={2} />
          </Card.Section>
          <Card.Section>
            <SkeletonBodyText lines={2} />
          </Card.Section>
          <Card.Section>
            <SkeletonBodyText lines={2} />
          </Card.Section>
          <Card.Section>
            <SkeletonBodyText lines={2} />
          </Card.Section>
        </SkeletonPage>
      </Card>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=import-configuration-section"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=product-import-configuration-section-3"
        >
          Product Import Settings
        </Link>
      </FooterHelp>
    </>
  ) : (
    <>
      <Card
        sectioned
        title={<Title level={4}>Shopify To App</Title>}
        actions={[
          {
            content: (
              <Button
                primary
                onClick={() => saveData(false)}
                loading={saveBtnLoader}
              >
                Save
              </Button>
            ),
          },
        ]}
      >
        <FormLayout>
          <Layout>
            <Layout.AnnotatedSection
              title="Import by Filters"
              id="importByFilters"
              description={
                <span>
                  The <b>import by filter</b> settings lets you set the
                  condition for you to import the products from the Shopify
                  store to app. It can be done on the following basis :
                  Published status, Product status, Vendor & Product Type.
                </span>
              }
            >
              {getImportByFiltersStructure()}
            </Layout.AnnotatedSection>
          </Layout>
          <Layout>
            <Layout.AnnotatedSection
              title="Import by Collection"
              id="importByCollection"
              description={
                <span>
                  Products can be imported in the app based on the selected
                  Shopify collections, you can select the checkbox shown before
                  to the imported Shopify collections. And when you make any
                  changes to your collections or when collections seem to be
                  missing in the app, you can use <b>refresh collection</b>{" "}
                  button so keep the collections updated in the app.
                </span>
              }
            >
              {getImportByCollectionStructure()}
            </Layout.AnnotatedSection>
          </Layout>
          {/* <Layout>
          <Layout.AnnotatedSection
            title="Import by Product ID"
            id="importByCollection"
          >
            {getImportByProductID()}
          </Layout.AnnotatedSection>
        </Layout> */}
          <Layout>
            <Layout.AnnotatedSection
              title="Import and replace product"
              id="importAndReplaceProduct"
              description={
                <span>
                  This option imports the products from Shopify based on the
                  applied filters and replaces /removes the existing products
                  from the app. By default, the setting is <b>No</b>, but before
                  initiating the import you can set the setting to <b>Yes</b> if
                  you want to remove all the existing products from the app.
                </span>
              }
            >
              <Card sectioned>
                <ButtonGroup segmented>
                  <Button
                    primary={
                      importProductFilters["importAndReplaceProduct"][
                        "enable"
                      ] === "yes"
                        ? true
                        : false
                    }
                    pressed={
                      importProductFilters["importAndReplaceProduct"][
                        "enable"
                      ] === "yes"
                        ? true
                        : false
                    }
                    onClick={(e) => {
                      handleBtnPres(e, "importAndReplaceProduct");
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    primary={
                      importProductFilters["importAndReplaceProduct"][
                        "enable"
                      ] === "no"
                        ? true
                        : false
                    }
                    pressed={
                      importProductFilters["importAndReplaceProduct"][
                        "enable"
                      ] === "no"
                        ? true
                        : false
                    }
                    onClick={(e) => {
                      handleBtnPres(e, "importAndReplaceProduct");
                    }}
                  >
                    No
                  </Button>
                </ButtonGroup>
              </Card>
            </Layout.AnnotatedSection>
          </Layout>
        </FormLayout>
      </Card>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=import-configuration-section"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=product-import-configuration-section-3"
        >
          Product Import Settings
        </Link>
      </FooterHelp>
      <Modal
        open={importProductModalActive}
        onClose={() => setImportProductModalActive(false)}
        title="Permission required"
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Are you sure you want to initiate Import Products action for the
              following filters ?
            </p>
            <center>
              <Stack vertical spacing="extraTight">
                {Object.keys(importProductModalData).map((key) => {
                  return (
                    <Stack distribution="center">
                      <>{key} - </>
                      <>{importProductModalData[key]}</>
                    </Stack>
                  );
                })}
              </Stack>
            </center>
            <Stack distribution="center" spacing="tight">
              <Button onClick={() => setImportProductModalActive(false)}>
                Cancel
              </Button>
              <Button
                primary
                loading={importProductLoader}
                onClick={async () => {
                  saveData(false, "importProduct");
                }}
              >
                OK
              </Button>
            </Stack>
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Modal
        open={importCollectionModalActive}
        onClose={() => setImportCollectionModalActive(false)}
        title="Permission required"
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Are you sure you want to initiate Import Collection Products
              action ?
            </p>
            <Stack distribution="center" spacing="tight">
              <Button onClick={() => setImportCollectionModalActive(false)}>
                Cancel
              </Button>
              <Button
                primary
                loading={importCollectionLoader}
                onClick={async () => {
                  saveData(false, "importCollection");
                }}
              >
                OK
              </Button>
            </Stack>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </>
  );
};

export default withRouter(FinalImportSettings);
