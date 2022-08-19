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
} from "@shopify/polaris";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import {
  getImportAttribute,
  initiateVendorProductTypeFetch,
} from "../../../../../../../Apirequest/registrationApi";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../services/notify";
import {
  collectionFetchURL,
  saveAppSettingsShopifyToAppURL,
} from "../../../../../../../URLs/ConfigurationURL";

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

const FinalImportSettings = ({ importSettingsFromSavedAPIData }) => {
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
      options: [],
      label: "Product Type",
      enable: "yes",
      type: "dropdown",
      value: "",
      description:
        "Select the product type you wish to import from Shopify to the App. By default, all product types are imported.",
    },
    vendor: {
      options: [],
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

  const [refreshProductTypeVendorBtnLoader, setRefreshProductTypeVendorBtnLoader] = useState(false)
  const [refreshCollectionBtnLoader, setRefreshCollectionBtnLoader] = useState(false)

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
      setflag(false);
      let temp = { ...importProductFilters };
      Object.keys(importSettingsFromSavedAPIData).forEach((field) => {
        if (field !== "match_from_ebay" && field !== "productID") {
          temp[field]["enable"] =
            importSettingsFromSavedAPIData[field]["enable"];
          switch (field) {
            case "import_collection":
              temp[field]["selected_collection"] =
                importSettingsFromSavedAPIData[field]["selected_collection"];
              break;
            case "importAndReplaceProduct":
              break;
            default:
              temp[field]["value"] =
                importSettingsFromSavedAPIData[field]["value"];
              break;
          }
          setImportProductFilters(temp);
        }
      });
    }
  }, [importSettingsFromSavedAPIData]);

  const prepareOptions = (data) => {
    const options = data.map((value) => {
      let tempObj = {};
      tempObj["label"] = value;
      tempObj["value"] = value;
      return tempObj;
    });
    options.unshift({ label: "Please Select...", value: "" });
    return options;
  };

  const hitAPIsInitialRender = async () => {
    let { success, data } = await getImportAttribute();
    if (success) {
      let temp = { ...importProductFilters };
      if (data?.product_type)
        temp["productType"]["options"] = prepareOptions(data?.product_type);
      if (data?.vendor)
        temp["vendor"]["options"] = prepareOptions(data?.vendor);
      if (data?.collection) {
        const options = Object.keys(data.collection).map((key) => {
          let tempObj = {};
          tempObj["label"] = data.collection[key];
          tempObj["value"] = key;
          return tempObj;
        });
        temp["import_collection"]["collections_options"] = options;
      }
      setImportProductFilters(temp);
    }
  };

  useEffect(() => {
    hitAPIsInitialRender();
  }, []);

  const importCollections = async () => {
    setRefreshCollectionBtnLoader(true)
    const { success, message } = await configurationAPI(collectionFetchURL);
    if (success) {
      notify.success(message);
    } else {
      notify.error(message);
    }
    setRefreshCollectionBtnLoader(false)
  };

  const saveData = async () => {
    setSaveBtnLoader(true);
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
    console.log("tempObj", tempObj);
    let { success, message } = await configurationAPI(
      saveAppSettingsShopifyToAppURL,
      tempObj
    );
    if (success) {
      notify.success(message);
    } else {
      notify.error(message);
    }
    setSaveBtnLoader(false);
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
            }
          }
        )}
      </Stack>
    );

    const importProductTypeVendor = async () => {
      setRefreshProductTypeVendorBtnLoader(true)
      let { success, message } = await initiateVendorProductTypeFetch();
      if (success) {
        notify.success(message);
      } else {
        notify.error(message);
      }
      setRefreshProductTypeVendorBtnLoader(false)
    };

    return (
      <Card
        sectioned
        actions={{
          content: (
            <Button onClick={importProductTypeVendor} loading={refreshProductTypeVendorBtnLoader}>
              Refresh Product Type & Vendor
            </Button>
          ),
        }}
      >
        <Card.Section>{resultArr1}</Card.Section>
        <Card.Section
          title="Additional Filters"
          // actions={[
          //   {
          //     content: (
          //       <Tooltip content="If all options not listed then please wait while data fetching process running you can reload the page to check the options">
          //         <Icon source={QuestionMarkMinor} color="base" />
          //       </Tooltip>
          //     ),
          //   },
          // ]}
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
        actions={{
          content: (
            <Button onClick={importCollections} loading={refreshCollectionBtnLoader}>Refresh Collections</Button>
          ),
        }}
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

  return flag ? (
    <Card sectioned>
      <SkeletonPage fullWidth={true} title={<SkeletonDisplayText size="small" />}>
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
  ) : (
    <Card
      sectioned
      title={<Title level={4}>Shopify To App</Title>}
      actions={[
        {
          content: (
            <Button primary onClick={saveData} loading={saveBtnLoader}>
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
          >
            {getImportByFiltersStructure()}
          </Layout.AnnotatedSection>
        </Layout>
        <Layout>
          <Layout.AnnotatedSection
            title="Import by Collection"
            id="importByCollection"
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
  );
};

export default FinalImportSettings;
