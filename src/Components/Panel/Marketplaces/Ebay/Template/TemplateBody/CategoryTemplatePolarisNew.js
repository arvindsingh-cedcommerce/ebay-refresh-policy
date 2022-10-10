import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  FormLayout,
  Layout,
  Select,
  Stack,
  TextField,
} from "@shopify/polaris";
import { AutoComplete } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  getAttributesByProductQuery,
  getattributesCategorywise,
  getCategoriesApi,
  getcategoryFeatures,
  getCategoryPredictions,
  getConfigurablesAttributes,
  getEbayUserDetails,
  getMetafields,
  getParentCategories,
  getStoreDetails,
  getTemplatebyId,
} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import { notify } from "../../../../../../services/notify";
import LoadingOverlay from "react-loading-overlay";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";

export function debounce(func, wait, immediate) {
  var timeout;

  return (...args) => {
    var context = this;

    var later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

const CategoryTemplatePolarisNew = (props) => {
  const { id, loader, showSecondaryCategory, siteID, shopID, recieveFormdata } =
    props;
  const [connectedAccountsObject, setconnectedAccountsObject] = useState([]);
  const [accountSelection, setaccountSelection] = useState("");
  const [siteIDSelection, setsiteIDSelection] = useState("");
  const [shopIDSelection, setshopIDSelection] = useState("");

  // form data
  const deselectedOptions = [];
  const [loaderOverlayActive, setLoaderOverlayActive] = useState(true);
  const [
    primaryCategorySearchPredictionOptions,
    setPrimaryCategorySearchPredictionOptions,
  ] = useState(deselectedOptions);
  const [selectedOptions, setSelectedOptions] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [primaryCategoryMapping, setPrimaryCategoryMapping] = useState([]);

  const secondaryDeselectedOptions = [];
  const [
    secondaryCategorySearchPredictionOptions,
    setSecondaryCategorySearchPredictionOptions,
  ] = useState(secondaryDeselectedOptions);
  const [secondarySelectedOptions, setSecondarySelectedOptions] = useState([]);
  const [secondaryInputValue, setSecondaryInputValue] = useState("");
  const [secondaryCategoryMapping, setSecondaryCategoryMapping] = useState([]);

  const [bestofferenabled, setBestofferenabled] = useState(false);
  const [requiredAttributesMapping, setRequiredAttributesMapping] = useState({
    mapping: [],
    counter: 0,
    options: [],
  });
  const [optionalAttributesMapping, setOptionalAttributesMapping] = useState({
    mapping: [],
    counter: 0,
    options: [],
  });
  const [customAttributesMapping, setCustomAttributesMapping] = useState({
    mapping: [],
    counter: 0,
    optionsCheck: [
      {
        label: "Set Shopify Attributes",
        value: "ShopifyAttributes",
      },
      {
        label: "Set Custom",
        value: "Custom",
      },
    ],
  });
  const [showAttributeMapping, setShowAttributeMapping] = useState(false);
  const [category_feature, setCategory_feature] = useState("");
  const [condition_description, setCondition_description] = useState("");
  const [shopifyAttributes, setShopifyAttributes] = useState([]);
  const [configurableAttributes, setConfigurableAttributes] = useState([]);
  const [selectedConfigurableAttributes, setSelectedConfigurableAttributes] =
    useState([]);
  const [attributesLoader, setAttributesLoader] = useState(false);
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);
  const [categoryFeatureOptions, setCategoryFeatureOptions] = useState([]);
  const [barcodeOptions, setBarcodeOptions] = useState([]);
  const [enableSecondaryCategory, setEnableSecondaryCategory] = useState(false);
  const [enableVariationImageSettings, setEnableVariationImageSettings] =
    useState(false);
  const [
    modalEnableVariationImageSettings,
    setModalEnableVariationImageSettings,
  ] = useState(false);
  const [configurableAttributesRecieved, setConfigurableAttributesRecieved] =
    useState(false);

  // account status
  const [accountStatus, setAccountStatus] = useState("active");

  // storefront details
  const [storeFrontList, setStoreFrontList] = useState([]);
  const [storeFrontExists, setStoreFrontExists] = useState(false);
  const [storeFrontSelected, setStoreFrontSelected] = useState("");

  const renderCategoryMapping = (
    categoryTypeMapping,
    setCategoryTypeMapping,
    categoryType
  ) => {
    let structurePrepared = [];
    if (categoryTypeMapping) {
      structurePrepared = categoryTypeMapping.map((level, index) => {
        return (
          <Select
            key={index}
            placeholder="Please Select..."
            label={level?.["label"]}
            options={level?.["options"]}
            value={level?.["value"]}
            onChange={(e) => {
              let tempMapping = [...categoryTypeMapping];
              setBarcodeOptions([]);
              setCategoryFeatureOptions([]);
              tempMapping.splice(index + 1);
              tempMapping[index]["value"] = e;
              tempMapping[index]["value"] &&
                getCategory(
                  {
                    parent_category_id: tempMapping?.[index]?.["value"],
                  },
                  tempMapping,
                  setCategoryTypeMapping,
                  categoryType
                );
              setCategoryTypeMapping(tempMapping);
            }}
          />
        );
      });
    }
    return structurePrepared;
  };
  const renderBarcodeOptions = () => {
    let temparr = [];

    temparr.push(
      <React.Fragment>
        <Stack key={"BestOfferEnabled"}>
          {barcodeOptions.indexOf("BestOfferEnabled") > -1 && (
            <Banner>
              This category has <b>Best Offer Enabled</b>, To enable/disable
              Best Offer on this Category simply uncheck the box shown below
            </Banner>
          )}
        </Stack>
        <br />
        <Stack vertical={false} key={"Barcode-options"}>
          <Checkbox
            key={"BestOffer"}
            checked={bestofferenabled}
            label="Best offer enabled"
            disabled={barcodeOptions.indexOf("BestOfferEnabled") == -1}
            onChange={(e) => {
              setBestofferenabled(e);
            }}
          />
          <Checkbox
            key={"Variation-specific"}
            checked={barcodeOptions.indexOf("VariationsEnabled") > -1}
            label="Variations enabled"
            disabled={true}
            onChange={() => {}}
          />
          <Checkbox
            key={"ISBNenabled"}
            checked={barcodeOptions.indexOf("ISBNEnabled") > -1}
            label="ISBN enabled"
            disabled={true}
            onChange={() => {}}
          />
          <Checkbox
            key={"UPCEnabled"}
            checked={barcodeOptions.indexOf("UPCEnabled") > -1}
            label="UPC enabled"
            disabled={true}
            onChange={() => {}}
          />
          <Checkbox
            key={"EANEnabled"}
            checked={barcodeOptions.indexOf("EANEnabled") > -1}
            label="EAN enabled"
            disabled={true}
            onChange={() => {}}
          />
        </Stack>
      </React.Fragment>
    );

    return temparr;
  };
  const getProductConditionStructure = () => {
    return (
      <FormLayout>
        <Select
          options={categoryFeatureOptions}
          placeholder={"Select.."}
          //   onChange={this.DropdownCategory.bind(this)}
          onChange={(e) => {
            // let temp = { ...formData };
            // temp["primaryCategory"]["category_feature"] = e;
            // setFormData(temp);
            setCategory_feature(e);
          }}
          //   error={
          //     this.state.form_data.primaryCategory.category_feature.length == 0 &&
          //     this.state.dropdownErrorFlag &&
          //     this.state.errors.primaryCategory.category_feature
          //       ? "*required field"
          //       : false
          //   }
          value={category_feature}
        />
        <TextField
          label="Additional condition description"
          key={"Additional condition description"}
          value={condition_description}
          onChange={(e) => {
            // let temp = { ...formData };
            // temp["primaryCategory"]["condition_description"] = e;
            // setFormData(temp);
            setCondition_description(e);
          }}
          multiline={3}
        />
      </FormLayout>
    );
  };
  const renderRequiredAttributeMappingStructure = () => {
    let temp = { ...requiredAttributesMapping };
    let structurePrepared = [];
    structurePrepared = temp["mapping"].map((mappedObject, index) => {
      let filteredObj = requiredAttributesMapping["options"].find(
        (item) =>
          requiredAttributesMapping["mapping"][index]["eBayAttribute"] ===
          item.value
      );
      return (
        <Card.Section title={`# ${index + 1}`} key={index}>
          <FormLayout>
            <FormLayout.Group>
              <Select
                disabled
                label="eBay Attributes"
                options={temp["options"]}
                value={temp["mapping"][index]["eBayAttribute"]}
                onChange={(e) => {
                  // let temp = { ...requiredAttributesMapping };
                  // temp["mapping"][index]["selectedShopifyAttributeValueType"] =
                  //   "";
                  // temp["mapping"][index]["shopifyAttribute"] = "";
                  // temp["mapping"][index]["eBayAttribute"] = e;
                  // setRequiredAttributesMapping(temp);
                }}
              />
              <Select
                placeholder="Please Select..."
                label="Shopify Attributes"
                disabled={temp["mapping"][index]["eBayAttribute"] === ""}
                options={filteredObj?.["optionsCheck"]}
                value={
                  temp["mapping"][index]["selectedShopifyAttributeValueType"]
                }
                onChange={(e) => {
                  let temp = { ...requiredAttributesMapping };
                  temp["mapping"][index]["shopifyAttribute"] = "";
                  temp["mapping"][index]["selectedShopifyAttributeValueType"] =
                    e;
                  setRequiredAttributesMapping(temp);
                }}
              />
            </FormLayout.Group>
            {requiredAttributesMapping["mapping"][index][
              "selectedShopifyAttributeValueType"
            ] === "EbayRecommendedAttributes" ? (
              <Select
                label={"Select eBay Recommendation"}
                placeholder="Please Select..."
                options={filteredObj?.["ebayRecommendedAttributesOptions"]}
                value={temp["mapping"][index]["shopifyAttribute"]}
                onChange={(e) => {
                  let temp = { ...requiredAttributesMapping };
                  temp["mapping"][index]["shopifyAttribute"] = e;
                  setRequiredAttributesMapping(temp);
                }}
              />
            ) : requiredAttributesMapping["mapping"][index][
                "selectedShopifyAttributeValueType"
              ] === "ShopifyAttributes" ? (
              <Select
                label="Select Shopify Attribute"
                placeholder="Please Select..."
                options={filteredObj?.["shopifyAttributesOptions"]}
                value={temp["mapping"][index]["shopifyAttribute"]}
                onChange={(e) => {
                  let temp = { ...requiredAttributesMapping };
                  temp["mapping"][index]["shopifyAttribute"] = e;
                  setRequiredAttributesMapping(temp);
                }}
              />
            ) : (
              requiredAttributesMapping["mapping"][index][
                "selectedShopifyAttributeValueType"
              ] === "Custom" && (
                <TextField
                  label="Set Custom Value"
                  value={temp["mapping"][index]["shopifyAttribute"]}
                  onChange={(e) => {
                    let temp = { ...requiredAttributesMapping };
                    temp["mapping"][index]["shopifyAttribute"] = e;
                    setRequiredAttributesMapping(temp);
                  }}
                />
              )
            )}
          </FormLayout>
        </Card.Section>
      );
    });
    return structurePrepared;
  };
  // useEffect(() => {
  //   console.log("367");
  //   if (enableSecondaryCategory) {
  //     getCategory(
  //       { level: 1 },
  //       secondaryCategoryMapping,
  //       setSecondaryCategoryMapping,
  //       "secondaryCategory"
  //     );
  //   } else {
  //     setSecondaryCategoryMapping([]);
  //   }
  // }, [enableSecondaryCategory]);

  const addOptionalAttribute = (categoryType) => {
    let temp = { ...optionalAttributesMapping };
    let createdArr = [];
    let tempObject = {
      eBayAttribute: "",
      shopifyAttribute: "",
      selectedShopifyAttributeValueType: "",
    };
    createdArr.push(tempObject);
    temp["mapping"] = [...temp["mapping"], ...createdArr];
    setOptionalAttributesMapping(temp);
  };
  const addCustomAttribute = (categoryType) => {
    let temp = { ...customAttributesMapping };
    let createdArr = [];
    let tempObject = {
      customAttribute: "",
      shopifyAttribute: "",
      selectedShopifyAttributeValueType: "",
    };
    createdArr.push(tempObject);
    temp["mapping"] = [...temp["mapping"], ...createdArr];
    setCustomAttributesMapping(temp);
  };
  const removeOptionalAttributeMapping = (attribute, categoryType) => {
    let temp = { ...optionalAttributesMapping };
    temp["mapping"].splice(attribute, 1);
    setOptionalAttributesMapping(temp);
  };
  const removeCustomAttributeMapping = (attribute, categoryType) => {
    let temp = { ...customAttributesMapping };
    temp["mapping"].splice(attribute, 1);
    setCustomAttributesMapping(temp);
  };
  const renderOptionalAttributeMappingStructure = (categoryType) => {
    let temp = { ...optionalAttributesMapping };

    return (
      <>
        {temp["mapping"].length === 0 ? (
          <Banner status="info">
            <p>
              Optional attributes can be added by clicking Add attribute above
            </p>
          </Banner>
        ) : (
          temp["mapping"].map((mappedObject, index) => {
            let filteredObj = optionalAttributesMapping["options"].find(
              (item) =>
                optionalAttributesMapping["mapping"][index]["eBayAttribute"] ===
                item.value
            );
            return (
              <Card
                sectioned
                title={`# ${index + 1}`}
                actions={[
                  {
                    content: "Delete",
                    onAction: () =>
                      removeOptionalAttributeMapping(index, "primaryCategory"),
                  },
                ]}
                key={index}
              >
                <FormLayout>
                  <FormLayout.Group>
                    <Select
                      placeholder="Please Select..."
                      label="eBay Attributes"
                      options={temp["options"]}
                      value={temp["mapping"][index]["eBayAttribute"]}
                      onChange={(e) => {
                        let temp = { ...optionalAttributesMapping };
                        temp["mapping"][index][
                          "selectedShopifyAttributeValueType"
                        ] = "";
                        temp["mapping"][index]["shopifyAttribute"] = "";
                        temp["mapping"][index]["eBayAttribute"] = e;
                        setOptionalAttributesMapping(temp);
                      }}
                    />
                    <Select
                      placeholder="Please Select..."
                      label="Shopify Attributes"
                      disabled={temp["mapping"][index]["eBayAttribute"] === ""}
                      options={filteredObj?.["optionsCheck"]}
                      value={
                        temp["mapping"][index][
                          "selectedShopifyAttributeValueType"
                        ]
                      }
                      onChange={(e) => {
                        let temp = { ...optionalAttributesMapping };
                        temp["mapping"][index]["shopifyAttribute"] = "";
                        temp["mapping"][index][
                          "selectedShopifyAttributeValueType"
                        ] = e;
                        setOptionalAttributesMapping(temp);
                      }}
                    />
                  </FormLayout.Group>
                  {optionalAttributesMapping["mapping"][index][
                    "selectedShopifyAttributeValueType"
                  ] === "EbayRecommendedAttributes" ? (
                    <Select
                      label={"Select eBay Recommendation"}
                      placeholder="Please Select..."
                      options={
                        filteredObj?.["ebayRecommendedAttributesOptions"]
                      }
                      value={temp["mapping"][index]["shopifyAttribute"]}
                      onChange={(e) => {
                        let temp = { ...optionalAttributesMapping };
                        temp["mapping"][index]["shopifyAttribute"] = e;
                        setOptionalAttributesMapping(temp);
                      }}
                    />
                  ) : optionalAttributesMapping["mapping"][index][
                      "selectedShopifyAttributeValueType"
                    ] === "ShopifyAttributes" ? (
                    <Select
                      label="Select Shopify Attribute"
                      placeholder="Please Select..."
                      options={filteredObj?.["shopifyAttributesOptions"]}
                      value={temp["mapping"][index]["shopifyAttribute"]}
                      onChange={(e) => {
                        let temp = { ...optionalAttributesMapping };
                        temp["mapping"][index]["shopifyAttribute"] = e;
                        setOptionalAttributesMapping(temp);
                      }}
                    />
                  ) : (
                    optionalAttributesMapping["mapping"][index][
                      "selectedShopifyAttributeValueType"
                    ] === "Custom" && (
                      <TextField
                        label="Set Custom Value"
                        value={temp["mapping"][index]["shopifyAttribute"]}
                        onChange={(e) => {
                          let temp = { ...optionalAttributesMapping };
                          temp["mapping"][index]["shopifyAttribute"] = e;
                          setOptionalAttributesMapping(temp);
                        }}
                      />
                    )
                  )}
                </FormLayout>
              </Card>
            );
          })
        )}
      </>
    );
  };
  const renderCustomAttributeMappingStructure = (categoryType) => {
    let temp = { ...customAttributesMapping };
    return (
      <>
        {temp["mapping"].length === 0 ? (
          <Banner status="info">
            <p>
              Custom attributes can be added by clicking Add attribute above
            </p>
          </Banner>
        ) : (
          temp["mapping"].map((mappedObject, index) => {
            return (
              <Card
                sectioned
                title={`# ${index + 1}`}
                actions={[
                  {
                    content: "Delete",
                    onAction: () =>
                      removeCustomAttributeMapping(index, "primaryCategory"),
                  },
                ]}
                key={index}
              >
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      placeholder="Create..."
                      label={"Custom attribute"}
                      value={mappedObject["customAttribute"]}
                      onChange={(e) => {
                        let temp = { ...customAttributesMapping };
                        temp["mapping"][index][
                          "selectedShopifyAttributeValueType"
                        ] = "";
                        temp["mapping"][index]["customAttribute"] = e;
                        setCustomAttributesMapping(temp);
                      }}
                    />
                    <Select
                      placeholder="Please Select..."
                      label={"Shopify attributes"}
                      disabled={mappedObject["customAttribute"] === ""}
                      options={customAttributesMapping["optionsCheck"]}
                      value={mappedObject["selectedShopifyAttributeValueType"]}
                      onChange={(e) => {
                        let temp = { ...customAttributesMapping };
                        temp["mapping"][index]["shopifyAttribute"] = "";
                        temp["mapping"][index][
                          "selectedShopifyAttributeValueType"
                        ] = e;
                        setCustomAttributesMapping(temp);
                      }}
                    />
                  </FormLayout.Group>
                  {customAttributesMapping["mapping"][index][
                    "selectedShopifyAttributeValueType"
                  ] === "ShopifyAttributes" ? (
                    <Select
                      label="Select Shopify Attribute"
                      placeholder="Please Select..."
                      options={shopifyAttributes}
                      value={mappedObject["shopifyAttribute"]}
                      onChange={(e) => {
                        let temp = { ...customAttributesMapping };
                        temp["mapping"][index]["shopifyAttribute"] = e;
                        setCustomAttributesMapping(temp);
                      }}
                    />
                  ) : (
                    customAttributesMapping["mapping"][index][
                      "selectedShopifyAttributeValueType"
                    ] === "Custom" && (
                      <TextField
                        label="Set Custom Value"
                        value={mappedObject["shopifyAttribute"]}
                        onChange={(e) => {
                          let temp = { ...customAttributesMapping };
                          temp["mapping"][index]["shopifyAttribute"] = e;
                          setCustomAttributesMapping(temp);
                        }}
                      />
                    )
                  )}
                </FormLayout>
              </Card>
            );
          })
        )}
      </>
    );
  };

  const getExtractedDataForCategory = (categoryData) => {
    let temp = [];
    temp = categoryData.map((data) => {
      return {
        label: data?.name,
        value: data?.marketplace_id,
        level: data?.level,
        choices: [],
        default_condition: "",
      };
    });
    return temp;
  };

  const extractEbayRecommendedAttributes = (data) => {
    let temp = Object.keys(data).map((e) => {
      return {
        label: data[e],
        value: e,
      };
    });
    return temp;
  };
  const getExtractedDataForAttribute = (
    attributeData,
    shopifyAttrOptions = []
  ) => {
    let requiredAttributes = [];
    let optionalAttributes = [];
    attributeData.forEach((data) => {
      let tempObj = {
        label: data?.name,
        value: data?.code,
        variation: data?.variation,
        ebayRecommendedAttributesOptions: extractEbayRecommendedAttributes(
          data?.values
        ),
        shopifyAttributesOptions: shopifyAttributes.length
          ? shopifyAttributes
          : shopifyAttrOptions,
        optionsCheck: [
          {
            label: "Set eBay Recommended Attributes",
            value: "EbayRecommendedAttributes",
          },
          {
            label: "Set Shopify Attributes",
            value: "ShopifyAttributes",
          },
          {
            label: "Set Custom",
            value: "Custom",
          },
        ],
        selectedShopifyAttributeValueType: "",
        selectedShopifyAttributeValue: "",
      };
      if (data?.required) {
        tempObj["attributeNumber"] = data?.sort_order;
        requiredAttributes.push(tempObj);
      } else {
        optionalAttributes.push(tempObj);
      }
    });
    return { requiredAttributes, optionalAttributes };
  };

  const extractBarcodeCategoryOptions = (dataCategoryFeatures) => {
    let barcode_options = [];
    let categoryFeature_options = [];
    let isBestOfferEnabled = false;
    if (dataCategoryFeatures) {
      Object.keys(dataCategoryFeatures).map((key) => {
        switch (key) {
          case "BestOfferEnabled":
            if (dataCategoryFeatures[key]) {
              barcode_options.push("BestOfferEnabled");
              isBestOfferEnabled = true;
            }
            break;
          case "VariationsEnabled":
            if (dataCategoryFeatures[key]) {
              barcode_options.push("VariationsEnabled");
            }
            break;
          case "ISBNEnabled":
            barcode_options.push("ISBNEnabled");
            break;
          case "UPCEnabled":
            barcode_options.push("UPCEnabled");
            break;
          case "EANEnabled":
            barcode_options.push("EANEnabled");
            break;
          case "ConditionEnabled":
            if (
              dataCategoryFeatures[key] === "Required" ||
              dataCategoryFeatures[key] === "Enabled"
            ) {
              if (
                dataCategoryFeatures["ConditionValues"] &&
                dataCategoryFeatures["ConditionValues"]["Condition"]
              )
                dataCategoryFeatures["ConditionValues"]["Condition"].forEach(
                  (value, index) => {
                    categoryFeature_options.push({
                      label: value.DisplayName,
                      value: value.ID.toString(),
                    });
                  }
                );
            }
            break;
        }
      });
    }
    if (categoryFeature_options.length) {
      categoryFeature_options.unshift({
        label: "Unselect",
        value: "",
      });
    }
    setBarcodeOptions(barcode_options);
    setCategoryFeatureOptions(categoryFeature_options);
  };
  const getCategory = async (
    requestObj,
    categoryTypeMapping,
    setCategoryTypeMapping,
    categoryType
  ) => {
    setLoaderOverlayActive(true);
    let {
      success: successMappingCategorywise,
      data: mappingCategorywise,
      message,
      code,
    } = await getCategoriesApi({
      ...requestObj,
      site_id: siteID,
      shop_id: shopID,
    });
    if (successMappingCategorywise) {
      if (
        Array.isArray(mappingCategorywise) &&
        mappingCategorywise.length > 0
      ) {
        let extractData = getExtractedDataForCategory(mappingCategorywise);
        let temp = [...categoryTypeMapping];
        temp.push({
          options: extractData,
          label: `Category Level ${extractData[0]["level"]}`,
          value: "",
          levelNumber: extractData[0]["level"],
        });
        setCategoryTypeMapping(temp);
      } else if (
        categoryType === "primaryCategory" &&
        Array.isArray(mappingCategorywise) &&
        mappingCategorywise.length == 0
      ) {
        setAttributesLoader(true);
        const temp = [...categoryTypeMapping];
        const lastLevel = { ...temp.at(temp.length - 1) };
        const lastLevelValue = lastLevel?.["value"];
        setLoaderOverlayActive(true);
        let dataCategoryFeatures = await getcategoryFeatures({
          category_id: lastLevelValue,
          site_id: siteID,
          shop_id: shopID,
        });
        if (
          dataCategoryFeatures.success &&
          dataCategoryFeatures?.data?.length
        ) {
          if (dataCategoryFeatures["data"][0]) {
            extractBarcodeCategoryOptions(dataCategoryFeatures["data"][0]);
          }
        }
        // if (Object.keys(dataCategoryFeatures).length) {
        //   if (dataCategoryFeatures["0"]) {
        //     extractBarcodeCategoryOptions(dataCategoryFeatures["0"]);
        //   }
        // }
        // console.log("here");
        setLoaderOverlayActive(true);
        let {
          success: successattribCategorywise,
          data: attributeCategorywise,
          message: attributeMsg,
        } = await getattributesCategorywise({
          category_id: lastLevelValue,
          site_id: siteID,
          shop_id: shopID,
        });
        if (
          successattribCategorywise &&
          Array.isArray(attributeCategorywise) &&
          attributeCategorywise.length > 0
        ) {
          let extractData = getExtractedDataForAttribute(attributeCategorywise);

          let createdArr = [];
          extractData.requiredAttributes.forEach((attribute) => {
            let tempObject = {
              eBayAttribute: attribute.value,
              shopifyAttribute: "",
              selectedShopifyAttributeValueType: "",
            };
            createdArr.push(tempObject);
          });

          setRequiredAttributesMapping({
            ...requiredAttributesMapping,
            mapping: createdArr,
            options: extractData?.requiredAttributes,
          });
          setOptionalAttributesMapping({
            ...optionalAttributesMapping,
            options: extractData?.optionalAttributes,
          });
          setShowAttributeMapping(true);
        } else {
          setRequiredAttributesMapping({
            mapping: [],
            counter: 0,
            options: [],
          });
          setOptionalAttributesMapping({
            mapping: [],
            counter: 0,
            options: [],
          });
        }
        setAttributesLoader(false);
      }
    } else if (code === "token_expired") {
      notify.error(message);
      redirect("/auth/login");
    }
    setLoaderOverlayActive(false);
  };

  const getShopifyAttributes = async (categoryType, data) => {
    let { success, data: apiData } = await getAttributesByProductQuery({
      marketplace: "shopify",
      query: "(price>-1)",
    });
    if (success) {
      let temp = [];
      temp = apiData.map((attribute) => {
        return {
          label: attribute?.title,
          value: attribute?.code,
        };
      });
      let { success: metaFieldsSuccess, data: metaFieldsData } =
        await getMetafields();
      if (metaFieldsSuccess) {
        Object.values(metaFieldsData).forEach((meta) => {
          temp.push({ label: meta, value: meta });
        });
      }
      if (data?.data) {
        extractDataFromSavedTemplate(data?.data, temp);
      } else {
        setLoaderOverlayActive(false);
      }
      setShopifyAttributes(temp);
    }
    // setShopifyAttribute(data, categoryType);
  };

  const getConfigurableAttributes = async () => {
    let { data, success } = await getConfigurablesAttributes();
    if (success) {
      let temp = [];
      temp = data.map((attribute) => {
        return {
          label: attribute,
          value: attribute,
          checked: false,
        };
      });
      setConfigurableAttributes(temp);
      if (temp.length) {
        setConfigurableAttributesRecieved(true);
      }
    }
  };
  const populateCategoryMapping = async (
    mappingData,
    categoryTypeMapping,
    setCategoryTypeMapping,
    mappingType,
    attributeMappingData,
    shopifyAttrOptions = []
  ) => {
    if (mappingData.length) {
      let {
        success: successMappingCategorywise,
        data: mappingCategorywise,
        message,
      } = await getCategoriesApi({
        level: 1,
        site_id: siteID,
        shop_id: shopID,
      });
      let temp = [...categoryTypeMapping];
      if (successMappingCategorywise) {
        if (mappingCategorywise.length) {
          let extractData = getExtractedDataForCategory(mappingCategorywise);
          temp.push({
            options: extractData,
            label: `Category Level ${extractData[0]["level"]}`,
            value: mappingData[0].value,
            levelNumber: extractData[0]["level"],
          });
        }
      }
      const test = mappingData.map(async (data, index) => {
        let tempObj = {};
        tempObj["parent_category_id"] = data["value"];
        return await getCategoriesApi({
          ...tempObj,
          site_id: siteID,
          shop_id: shopID,
        });
      });
      const allPromise = Promise.all(test);
      allPromise
        .then((values) => {
          const test = values.map((value, index) => {
            const { success, data } = value;
            if (success) {
              if (data.length) {
                let extractData = getExtractedDataForCategory(data);
                temp.push({
                  options: extractData,
                  label: `Category Level ${extractData[0]["level"]}`,
                  value: mappingData[index + 1].value,
                  levelNumber: extractData[0]["level"],
                });
              }
            }
          });
          if (mappingType === "primary") {
            const {
              requiredAttributesMapping: requiredAttributesMappingData,
              optionalAttributesMapping: optionalAttributesMappingData,
              customAttributesMapping: customAttributesMappingData,
            } = attributeMappingData;
            populateRequiredAttributeMapping(
              requiredAttributesMappingData,
              requiredAttributesMapping,
              setRequiredAttributesMapping,
              temp,
              shopifyAttrOptions,
              "requiredAttributes"
            );
            populateRequiredAttributeMapping(
              optionalAttributesMappingData,
              optionalAttributesMapping,
              setOptionalAttributesMapping,
              temp,
              shopifyAttrOptions,
              "optionalAttributes"
            );
            populateRequiredAttributeMapping(
              customAttributesMappingData,
              customAttributesMapping,
              setCustomAttributesMapping,
              temp,
              shopifyAttrOptions,
              "customAttributes"
            );
          }
          setCategoryTypeMapping(temp);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    await setLoaderOverlayActive(false);
  };
  const populateRequiredAttributeMapping = async (
    attributeData,
    attributeTypeMapping,
    setAttributeTypeMapping,
    temp,
    shopifyAttrOptions,
    attributeType
  ) => {
    const lastLevel = { ...temp.at(temp.length - 1) };
    const lastLevelValue = lastLevel?.["value"];
    let dataCategoryFeatures = await getcategoryFeatures({
      category_id: lastLevelValue,
      site_id: siteID,
      shop_id: shopID,
    });
    // console.log(dataCategoryFeatures);
    if (dataCategoryFeatures.success && dataCategoryFeatures?.data?.length) {
      if (dataCategoryFeatures["data"][0]) {
        extractBarcodeCategoryOptions(dataCategoryFeatures["data"][0]);
      }
    }
    // if (Object.keys(dataCategoryFeatures).length) {
    //   if (dataCategoryFeatures["0"]) {
    //     extractBarcodeCategoryOptions(dataCategoryFeatures["0"]);
    //   }
    // }
    let {
      success: successattribCategorywise,
      data: attributeCategorywise,
      message: attributeMsg,
    } = await getattributesCategorywise({
      category_id: lastLevelValue,
      site_id: siteID,
      shop_id: shopID,
    });
    if (
      successattribCategorywise &&
      Array.isArray(attributeCategorywise) &&
      attributeCategorywise.length > 0
    ) {
      let extractData = getExtractedDataForAttribute(
        attributeCategorywise,
        shopifyAttrOptions
      );
      let createdArr = [];
      if (attributeType === "requiredAttributes") {
        extractData[attributeType].forEach((attribute, index) => {
          let tempObject = {
            eBayAttribute: attribute.value,
            shopifyAttribute: attributeData[index]?.shopifyAttribute,
            selectedShopifyAttributeValueType:
              attributeData[index]?.selectedShopifyAttributeValueType,
          };
          createdArr.push(tempObject);
        });
      } else if (attributeType === "optionalAttributes") {
        attributeData.forEach((attribute, index) => {
          let tempObject = {
            eBayAttribute: attribute.eBayAttribute,
            shopifyAttribute: attribute.shopifyAttribute,
            selectedShopifyAttributeValueType:
              attribute.selectedShopifyAttributeValueType,
          };
          createdArr.push(tempObject);
        });
      } else if (attributeType === "customAttributes") {
        attributeData.forEach((attribute, index) => {
          let tempObject = {
            customAttribute: attribute.customAttribute,
            shopifyAttribute: attribute.shopifyAttribute,
            selectedShopifyAttributeValueType:
              attribute.selectedShopifyAttributeValueType,
          };
          createdArr.push(tempObject);
        });
      }
      setAttributeTypeMapping({
        ...attributeTypeMapping,
        mapping: createdArr,
        options: extractData?.[attributeType],
      });
    } else {
    }
  };
  const extractDataFromSavedTemplate = (data, temp) => {
    const primaryCategoryMappingData = data?.primaryCategoryMapping;
    const secondaryCategoryMappingData = data?.secondaryCategoryMapping;
    const attributeMappingData = data?.attributeMapping;
    if (data?.storefront_category) {
      setStoreFrontSelected(data.storefront_category)
    }
    if (data?.enableSecondaryCategory) {
      setEnableSecondaryCategory(data.enableSecondaryCategory);
    }
    if (data?.bestofferenabled) {
      setBestofferenabled(data.bestofferenabled);
    }
    if (data?.category_feature) {
      setCategory_feature(data.category_feature);
    }
    if (data?.condition_description) {
      setCondition_description(data.condition_description);
    }
    if (data?.selectedConfigurableAttributes) {
      let temp = configurableAttributes.map((attribute) => {
        if (data.selectedConfigurableAttributes.includes(attribute["value"])) {
          attribute["checked"] = true;
          return attribute;
        } else {
          return attribute;
        }
      });
      data.selectedConfigurableAttributes.length &&
        setEnableVariationImageSettings(true);
      setSelectedConfigurableAttributes(data.selectedConfigurableAttributes);
      setConfigurableAttributes(temp);
    }
    populateCategoryMapping(
      primaryCategoryMappingData,
      primaryCategoryMapping,
      setPrimaryCategoryMapping,
      "primary",
      attributeMappingData,
      temp
    );
    populateCategoryMapping(
      secondaryCategoryMappingData,
      secondaryCategoryMapping,
      setSecondaryCategoryMapping,
      "secondary"
    );
  };
  const getTemplate = async () => {
    if (id) {
      let { success, data, message, code } = await getTemplatebyId(id);
      if (success) {
        getShopifyAttributes("primaryCategory", data);
        // getConfigurableAttributes();
      } else if (code === "token_expired" || code === "invalid_token") {
        notify.error(message);
        redirect("/auth/login");
      }
    } else {
      siteID &&
        getCategory(
          { level: 1 },
          primaryCategoryMapping,
          setPrimaryCategoryMapping,
          "primaryCategory"
        );
      getShopifyAttributes("primaryCategory");
      getConfigurableAttributes();
    }
    // getShopifyAttributes("primaryCategory");
    // getConfigurableAttributes();
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
        if (account?.id == shopID) {
          setAccountStatus(account["warehouses"][0]["status"]);
        }
      });
    } else {
      // notify.error(message);
      // props.history.push("/auth/login");
    }
  };

  const extractChildCategoryData = (data) => {
    // console.log(data);
    let tempData = data.map((category) => ({
      label: category.Name,
      value: category.CategoryID.toString(),
    }));
    return tempData;
  };

  const extractStoreFrontCategories = (data) => {
    const tempStoreFrontList = data.map((category) => {
      let tempObj = {};
      if (
        category?.ChildCategory &&
        Array.isArray(category.ChildCategory) &&
        category.ChildCategory.length
      ) {
        tempObj = {
          title: category.Name,
          options: [...extractChildCategoryData(category.ChildCategory)],
        };
      } else {
        tempObj = {
          label: category.Name,
          value: category.CategoryID.toString(),
        };
      }
      return tempObj;
    });
    setStoreFrontList(tempStoreFrontList);
  };

  const renderStoreFrontCategoryStructure = () => {
    return (
      <Select
        placeholder="Please select..."
        options={storeFrontList}
        value={storeFrontSelected}
        onChange={(e) => setStoreFrontSelected(e)}
      />
    );
  };
  const getStorefrontcategory = async (refresh = false) => {
    // console.log(siteID, shopID);
    // let { success, data } = await getEbayUserDetails({
    //   site_id: siteID,
    //   shop_id: shopID,
    // });
    const postData = {
      shop_id: shopID,
    };
    if (refresh) postData["refresh"] = refresh;
    let { success, data } = await getStoreDetails(postData);
    if (success) {
      if (
        data?.CustomCategories?.CustomCategory &&
        Array.isArray(data?.CustomCategories?.CustomCategory) &&
        data?.CustomCategories?.CustomCategory.length
      ) {
        // console.log('data',data);
        setStoreFrontExists(true);
        extractStoreFrontCategories(data?.CustomCategories?.CustomCategory);
      }
    }
    // if (success) this.extractStoreFrontcategory(data);
    // else {
    //   form_data.storefront_category_exists = false;
    //   this.setState({ form_data });
    // }
  };

  const callAPIs = async () => {
    await getTemplate();
    await getConfigurableAttributes();
    await getAllConnectedAccounts();
  };
  useEffect(() => {
    // console.log("1185");
    setsiteIDSelection(siteID);
    setshopIDSelection(shopID);
    // getTemplate();
    callAPIs();
    // getTemplate();
    // getConfigurableAttributes();
    // getAllConnectedAccounts();
    getStorefrontcategory();
  }, []);
  useEffect(() => {
    // console.log("1196");
    if (configurableAttributes.length) {
      if (configurableAttributesRecieved) {
        getTemplate();
      }
    }
  }, [configurableAttributesRecieved]);

  const getWholeNamePrimaryCategoryMapping = () => {
    let categoryMappingName = "";
    primaryCategoryMapping.forEach((mapping, index) => {
      const matchedValue = mapping.options.find(
        (option) => option.value === mapping.value
      );
      if (matchedValue) {
        if (index === primaryCategoryMapping.length - 1) {
          categoryMappingName += matchedValue["label"];
        } else categoryMappingName += matchedValue["label"] + ">>";
      }
    });
    return categoryMappingName;
  };
  const prepareDataForSave = () => {
    let lastLevel = primaryCategoryMapping.at(
      primaryCategoryMapping.length - 1
    );
    const primaryCategoryMappingName = getWholeNamePrimaryCategoryMapping();
    let name = lastLevel.options.find(
      (option) => option.value === lastLevel.value
    );
    let postData = {};
    postData["storefront_category"] = storeFrontSelected;
    postData["selectedConfigurableAttributes"] = selectedConfigurableAttributes;
    postData["site_id"] = siteID;
    postData["shop_id"] = shopID;
    postData["name"] = name?.label;
    postData["primaryCategoryMappingName"] = primaryCategoryMappingName;
    postData["primaryCategoryMapping"] = primaryCategoryMapping.map(
      (mapping) => {
        return { value: mapping.value, levelNumber: mapping.levelNumber };
      }
    );
    postData["enableSecondaryCategory"] = enableSecondaryCategory;
    postData["secondaryCategoryMapping"] = secondaryCategoryMapping.map(
      (mapping) => {
        return { value: mapping.value, levelNumber: mapping.levelNumber };
      }
    );
    postData["attributeMapping"] = {
      requiredAttributesMapping: [],
      optionalAttributesMapping: [],
      customAttributesMapping: [],
    };
    postData["bestofferenabled"] = bestofferenabled;
    postData["category_feature"] = category_feature;
    postData["condition_description"] = condition_description;
    postData["attributeMapping"]["requiredAttributesMapping"] = [
      ...requiredAttributesMapping.mapping,
    ];
    postData["attributeMapping"]["optionalAttributesMapping"] = [
      ...optionalAttributesMapping.mapping,
    ];
    postData["attributeMapping"]["customAttributesMapping"] = [
      ...customAttributesMapping.mapping,
    ];
    return postData;
  };

  const redirect = (url) => {
    props.history.push(url);
  };

  // const validateData = (data) => {
  //   console.log(data);
  // };

  const saveFormdata = async () => {
    setSaveBtnLoader(true);
    const postData = prepareDataForSave();
    // validateData(postData);
    const data = {
      marketplace: "ebay",
      type: "category",
      data: postData,
      title: postData["name"],
      site_id: siteID,
      shop_id: shopID,
    };
    if (id) {
      data["_id"] = id;
    }
    let returnedResponse = await props.recieveFormdata(data);
    if (returnedResponse) {
      redirect("/panel/ebay/templates");
    } else {
      // notify.error(message);
      notify.error("Kindly fill all the required fields with proper values");
    }
    setSaveBtnLoader(false);
  };
  const hitPredictionAPI = async (passedObj, value, setState) => {
    setState([]);
    setLoaderOverlayActive(true);
    let { success, data, message } = await getCategoryPredictions({
      ...passedObj,
    });
    if (success) {
      let temp = data.map((suggestion) => {
        let returnedObj = {};
        returnedObj.value = suggestion.path;
        returnedObj.label = suggestion.path;
        returnedObj.marketplace_id = suggestion.marketplace_id;
        return returnedObj;
      });
      setTimeout(() => {
        setState(temp);
      }, 1000);
    } else {
      setTimeout(() => {
        setLoaderOverlayActive(false);
        notify.error(message);
      }, 1000);
    }
  };
  useEffect(() => {
    // console.log("1307");
    if (primaryCategorySearchPredictionOptions.length) {
      setLoaderOverlayActive(false);
    }
  }, [primaryCategorySearchPredictionOptions]);
  useEffect(() => {
    // console.log("1313");
    if (secondaryCategorySearchPredictionOptions.length) {
      setLoaderOverlayActive(false);
    }
  }, [secondaryCategorySearchPredictionOptions]);
  const verify = useCallback(
    debounce((value) => {
      let checkVar = value;
      checkVar = checkVar.replaceAll("(", "\\(");
      checkVar = checkVar.replaceAll(")", "\\)");
      let passedObj = {
        site_id: siteID,
        shop_id: shopID,
      };
      if (value.includes(">>")) {
        passedObj = {
          ...passedObj,
          ...{
            path: checkVar,
          },
        };
      } else {
        passedObj = {
          ...passedObj,
          ...{
            category_name: value,
          },
        };
      }
      hitPredictionAPI(
        passedObj,
        value,
        setPrimaryCategorySearchPredictionOptions
      );
      setInputValue(value);
    }, 200),
    []
  );
  useEffect(() => {
    // console.log("1352");
    if (inputValue !== "") {
      verify(inputValue);
    }
  }, [inputValue]);
  const verifySecondary = useCallback(
    debounce((value) => {
      let checkVar = value;
      checkVar = checkVar.replaceAll("(", "\\(");
      checkVar = checkVar.replaceAll(")", "\\)");
      let passedObj = {
        site_id: siteID,
        shop_id: shopID,
      };
      if (value.includes(">>")) {
        passedObj = {
          ...passedObj,
          ...{
            // path: value,
            path: checkVar,
          },
        };
      } else {
        passedObj = {
          ...passedObj,
          ...{
            category_name: value,
          },
        };
      }
      hitPredictionAPI(
        passedObj,
        value,
        setSecondaryCategorySearchPredictionOptions
      );
      setSecondaryInputValue(value);
    }, 200),
    []
  );
  useEffect(() => {
    // console.log("1392");
    if (secondaryInputValue !== "") {
      verifySecondary(secondaryInputValue);
    }
  }, [secondaryInputValue]);
  useEffect(() => {
    // console.log("1398");
    if (enableSecondaryCategory) {
      getCategory(
        { level: 1 },
        secondaryCategoryMapping,
        setSecondaryCategoryMapping,
        "secondaryCategory"
      );
    } else {
      setSecondaryCategoryMapping([]);
    }
  }, [enableSecondaryCategory]);
  const hitAttributeMappingAfterPrediction = async (lastLevelValue) => {
    setAttributesLoader(true);
    setLoaderOverlayActive(true);
    let dataCategoryFeatures = await getcategoryFeatures({
      category_id: lastLevelValue,
      site_id: siteID,
      shop_id: shopID,
    });
    if (dataCategoryFeatures.success && dataCategoryFeatures?.data?.length) {
      if (dataCategoryFeatures["data"][0]) {
        // console.log(dataCategoryFeatures["data"][0]);
        extractBarcodeCategoryOptions(dataCategoryFeatures["data"][0]);
      }
    }
    // if (Object.keys(dataCategoryFeatures).length) {
    //   if (dataCategoryFeatures["0"]) {
    //     extractBarcodeCategoryOptions(dataCategoryFeatures["0"]);
    //   }
    // }
    // console.log("this");
    setLoaderOverlayActive(true);
    let {
      success: successattribCategorywise,
      data: attributeCategorywise,
      message: attributeMsg,
    } = await getattributesCategorywise({
      category_id: lastLevelValue,
      site_id: siteID,
      shop_id: shopID,
    });
    if (
      successattribCategorywise &&
      Array.isArray(attributeCategorywise) &&
      attributeCategorywise.length > 0
    ) {
      let extractData = getExtractedDataForAttribute(attributeCategorywise);

      let createdArr = [];
      extractData.requiredAttributes.forEach((attribute) => {
        let tempObject = {
          eBayAttribute: attribute.value,
          shopifyAttribute: "",
          selectedShopifyAttributeValueType: "",
        };
        createdArr.push(tempObject);
      });

      setRequiredAttributesMapping({
        ...requiredAttributesMapping,
        mapping: createdArr,
        options: extractData?.requiredAttributes,
      });
      setOptionalAttributesMapping({
        ...optionalAttributesMapping,
        options: extractData?.optionalAttributes,
      });
    } else {
    }
    setAttributesLoader(false);
    setLoaderOverlayActive(false);
  };
  const hitGetParentCategoriesFromPrediction = async (
    selectedPrediction,
    categoryTypeMapping,
    setCategoryTypeMapping,
    mappingType
  ) => {
    let passedObj = {
      category_id: selectedPrediction.marketplace_id,
      site_id: siteID,
      shop_id: shopID,
    };
    let { success, data } = await getParentCategories({ ...passedObj });
    if (success) {
      let tempMapping = [...categoryTypeMapping];
      setBarcodeOptions([]);
      setCategoryFeatureOptions([]);
      tempMapping.splice(1);
      data.forEach((dataAtLevel, index) => {
        if (!tempMapping[index]) {
          tempMapping[index] = {};
          let extractData = getExtractedDataForCategory(
            dataAtLevel?.same_level_categories
          );
          tempMapping[index]["options"] = extractData;
        } else {
        }
        tempMapping[index]["label"] = `Category Level ${index + 1}`;
        tempMapping[index]["value"] = dataAtLevel?.category?.marketplace_id;
        tempMapping[index]["levelNumber"] = `${index + 1}`;
      });
      let checkLastNodeLeafValue = data.at(data.length - 1)?.category?.leaf;
      let lastLevel = data.at(data.length - 1)?.category?.marketplace_id;
      getCategory(
        {
          parent_category_id: lastLevel,
        },
        tempMapping,
        setCategoryTypeMapping,
        mappingType
      );
      if (mappingType === "primary" && checkLastNodeLeafValue) {
        hitAttributeMappingAfterPrediction(lastLevel);
      }
      setCategoryTypeMapping(tempMapping);
    }
  };
  const renderCategorySearchPrediction = () => {
    return (
      <AutoComplete
        allowClear
        autoFocus
        label="Category Search"
        options={primaryCategorySearchPredictionOptions}
        style={{
          width: "100%",
          fontSize: "1.4rem !important",
          lineHeight: "2.4rem !important",
        }}
        onSelect={(data) => {
          let selected = [data];
          const selectedValue = primaryCategorySearchPredictionOptions.find(
            (option) => option.value === data
          );
          hitGetParentCategoriesFromPrediction(
            // selectedValue[0],
            selectedValue,
            primaryCategoryMapping,
            setPrimaryCategoryMapping,
            "primary"
          );
          setSelectedOptions(selected);
          setInputValue(selectedValue.label);
        }}
        onSearch={(e) => {
          setInputValue(e);
        }}
        placeholder="Search"
      />
    );
  };
  const renderSecondaryCategorySearchPrediction = () => {
    return (
      <AutoComplete
        allowClear
        autoFocus
        label="Category Search"
        options={secondaryCategorySearchPredictionOptions}
        style={{
          width: "100%",
          fontSize: "1.4rem !important",
          lineHeight: "2.4rem !important",
        }}
        onSelect={(data) => {
          let selected = [data];
          const selectedValue = secondaryCategorySearchPredictionOptions.find(
            (option) => option.value === data
          );
          hitGetParentCategoriesFromPrediction(
            // selectedValue[0],
            selectedValue,
            secondaryCategoryMapping,
            setSecondaryCategoryMapping,
            "secondary"
          );
          setSecondarySelectedOptions(selected);
          setSecondaryInputValue(selectedValue.label);
        }}
        onSearch={(e) => {
          setSecondaryInputValue(e);
        }}
        placeholder="Search"
      />
    );
  };
  const getCategoryStructure = (categoryType) => {
    if (categoryType === "secondary")
      return (
        <Layout>
          <Layout.AnnotatedSection
            id={`${categoryType}CategoryMapping`}
            title={`${categoryType[0].toUpperCase()}${categoryType.slice(
              1
            )} Category Mapping`}
            description={
              "Select the secondary category for eBay Listng. It is optional and chargable on eBay. Also it should be related to primary category because attributes/ item specifics will be shared."
            }
          >
            <Card sectioned title="Category Mapping">
              <Stack vertical spacing="tight">
                <ButtonGroup segmented>
                  <Button
                    pressed={enableSecondaryCategory}
                    onClick={(e) => {
                      setEnableSecondaryCategory(true);
                    }}
                    primary={enableSecondaryCategory}
                  >
                    Yes
                  </Button>
                  <Button
                    pressed={!enableSecondaryCategory}
                    onClick={(e) => {
                      setEnableSecondaryCategory(false);
                    }}
                    primary={!enableSecondaryCategory}
                  >
                    No
                  </Button>
                </ButtonGroup>
                {enableSecondaryCategory && (
                  <>
                    {renderSecondaryCategorySearchPrediction()}
                    {renderCategoryMapping(
                      secondaryCategoryMapping,
                      setSecondaryCategoryMapping,
                      "secondaryCategory"
                    )}
                  </>
                )}
              </Stack>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      );
    return (
      <Layout>
        <>
          <Layout.AnnotatedSection
            id="primaryCategoryMapping"
            title={`${categoryType[0].toUpperCase()}${categoryType.slice(
              1
            )} Category Mapping`}
            description={
              "Select the Primary category for eBay listings. Search option is available."
            }
          >
            <Card sectioned title="Category Mapping">
              <Stack vertical spacing="tight">
                {renderCategorySearchPrediction()}
                {renderCategoryMapping(
                  primaryCategoryMapping,
                  setPrimaryCategoryMapping,
                  "primaryCategory"
                )}
              </Stack>
            </Card>
          </Layout.AnnotatedSection>
          {barcodeOptions.length > 0 && (
            <Layout.AnnotatedSection
              id="additionalInformation"
              title="Additional Information"
              description={
                "Checked options are available for this selected category"
              }
            >
              <Card sectioned>{renderBarcodeOptions()}</Card>
            </Layout.AnnotatedSection>
          )}
          {/* {!attributesLoader ? (
            Object.keys(
              formData.primaryCategory.attributeMapping?.requiredAttributes
            ).length > 0 && (
              <Layout.AnnotatedSection
                id="additionalInformation"
                title="Additional Information"
                description={""}
              >
                <Card sectioned>{renderBarcodeOptions()}</Card>
              </Layout.AnnotatedSection>
            )
          ) : (
            <Spin tip="Fetching Attributes" size="large" />
          )} */}
          {requiredAttributesMapping?.options?.length > 0 && (
            <Layout.AnnotatedSection
              id="requiredAttributeMapping"
              title="Required Attributes (Item Specifics)"
              description={
                "These attributes are required for product listing on eBay."
              }
            >
              <Stack distribution="trailing">
                <Button
                  primary
                  onClick={async () => {
                    setLoaderOverlayActive(true);
                    setRequiredAttributesMapping({
                      mapping: [],
                      counter: 0,
                      options: [],
                    });
                    setOptionalAttributesMapping({
                      mapping: [],
                      counter: 0,
                      options: [],
                    });
                    const temp = [...primaryCategoryMapping];
                    const lastLevel = { ...temp.at(temp.length - 1) };
                    const lastLevelValue = lastLevel?.["value"];
                    let {
                      success: successattribCategorywise,
                      data: attributeCategorywise,
                      message: attributeMsg,
                    } = await getattributesCategorywise({
                      category_id: lastLevelValue,
                      site_id: siteID,
                      shop_id: shopID,
                    });
                    if (
                      successattribCategorywise &&
                      Array.isArray(attributeCategorywise) &&
                      attributeCategorywise.length > 0
                    ) {
                      let extractData = getExtractedDataForAttribute(
                        attributeCategorywise
                      );

                      let createdArr = [];
                      extractData.requiredAttributes.forEach((attribute) => {
                        let tempObject = {
                          eBayAttribute: attribute.value,
                          shopifyAttribute: "",
                          selectedShopifyAttributeValueType: "",
                        };
                        createdArr.push(tempObject);
                      });
                      setRequiredAttributesMapping({
                        ...requiredAttributesMapping,
                        mapping: createdArr,
                        options: extractData?.requiredAttributes,
                      });
                      setOptionalAttributesMapping({
                        ...optionalAttributesMapping,
                        options: extractData?.optionalAttributes,
                      });
                      setShowAttributeMapping(true);
                    } else {
                      setRequiredAttributesMapping({
                        mapping: [],
                        counter: 0,
                        options: [],
                      });
                      setOptionalAttributesMapping({
                        mapping: [],
                        counter: 0,
                        options: [],
                      });
                    }
                    setLoaderOverlayActive(false);
                  }}
                >
                  Refresh eBay Attributes
                </Button>
              </Stack>
              <br />
              <Card sectioned>{renderRequiredAttributeMappingStructure()}</Card>
            </Layout.AnnotatedSection>
          )}
          {optionalAttributesMapping?.options?.length > 0 && (
            <Layout.AnnotatedSection
              id="optionalAttributeMapping"
              title="Optional Attributes (Item Specifics)"
              description={
                "These attributes are optional and can be used for enhancing the product's specification on eBay."
              }
            >
              <Card
                sectioned
                actions={[
                  {
                    content: "Add Attribute",
                    onAction: () => addOptionalAttribute("primaryCategory"),
                  },
                ]}
              >
                {renderOptionalAttributeMappingStructure("primaryCategory")}
              </Card>
            </Layout.AnnotatedSection>
          )}
          {optionalAttributesMapping?.options?.length > 0 && (
            // showAttributeMapping &&
            <Layout.AnnotatedSection
              id="customAttributeMapping"
              title="Custom Attributes (Item Specifics)"
              description={
                "Apart from eBay attributes you can set your own attributes/ item specifics for eBay listing."
              }
            >
              <Card
                sectioned
                actions={[
                  {
                    content: "Add Attribute",
                    onAction: () => addCustomAttribute("primaryCategory"),
                  },
                ]}
              >
                {renderCustomAttributeMappingStructure("primaryCategory")}
              </Card>
            </Layout.AnnotatedSection>
          )}
          {categoryFeatureOptions.length > 0 && (
            <Layout.AnnotatedSection
              id="productCondition"
              title="Product condition"
              description={
                "Most eBay listing categories require an item condition. It ensures the product's condition."
              }
            >
              <Card sectioned>{getProductConditionStructure()}</Card>
            </Layout.AnnotatedSection>
          )}
          {storeFrontExists && (
            <Layout.AnnotatedSection
              id="storeFront"
              title="eBay Store Front Category"
            >
              <Card sectioned>{renderStoreFrontCategoryStructure()}</Card>
            </Layout.AnnotatedSection>
          )}
          {configurableAttributesRecieved && (
            <Layout.AnnotatedSection
              id="variationImageSettings"
              title="Variation Image Settings"
              description={
                "Select attribute which you want to use for variation product's image."
              }
            >
              <Card sectioned>{renderVariationImageSettings()}</Card>
            </Layout.AnnotatedSection>
          )}
        </>
      </Layout>
    );
  };
  const renderVariationImageSettings = () => {
    return (
      <Stack vertical>
        <ButtonGroup segmented>
          <Button
            pressed={enableVariationImageSettings}
            // pressed={
            //   enableVariationImageSettings ||
            //   (configurableAttributes.find(
            //     (attribute) => attribute["checked"]
            //   ) &&
            //     selectedConfigurableAttributes.length > 0)
            // }
            onClick={(e) => {
              setEnableVariationImageSettings(true);
              // setModalEnableVariationImageSettings(true);
            }}
            primary={enableVariationImageSettings}
            // primary={
            //   enableVariationImageSettings ||
            //   (configurableAttributes.find(
            //     (attribute) => attribute["checked"]
            //   ) &&
            //     selectedConfigurableAttributes.length > 0)
            // }
          >
            Yes
          </Button>
          <Button
            pressed={!enableVariationImageSettings}
            // pressed={
            //   (!enableVariationImageSettings &&
            //     !configurableAttributes.find(
            //       (attribute) => attribute["checked"]
            //     )) ||
            //   selectedConfigurableAttributes.length === 0
            // }
            onClick={(e) => {
              setEnableVariationImageSettings(false);
              setSelectedConfigurableAttributes([]);
              let temp = [...configurableAttributes];
              temp = configurableAttributes.map((attribute) => {
                attribute["checked"] = false;
                return attribute;
              });
              setConfigurableAttributes(temp);
              // getConfigurableAttributes();
            }}
            primary={!enableVariationImageSettings}
            // primary={
            //   (!enableVariationImageSettings &&
            //     !configurableAttributes.find(
            //       (attribute) => attribute["checked"]
            //     )) ||
            //   selectedConfigurableAttributes.length === 0
            // }
          >
            No
          </Button>
        </ButtonGroup>
        {enableVariationImageSettings && (
          <Stack distribution="fillEvenly">
            {configurableAttributes.map((attribute, index) => {
              return (
                <Checkbox
                  label={attribute.label}
                  checked={attribute.checked}
                  onChange={(e) => {
                    let tempAttributes = [...selectedConfigurableAttributes];
                    let temp = [...configurableAttributes];
                    temp[index]["checked"] = e;
                    if (temp[index]["checked"]) {
                      tempAttributes.push(temp[index]["value"]);
                    }
                    setSelectedConfigurableAttributes(tempAttributes);
                    setConfigurableAttributes(temp);
                  }}
                />
              );
            })}
          </Stack>
        )}
      </Stack>
    );
  };
  return (
    <LoadingOverlay
      active={loaderOverlayActive}
      spinner
      text="Loading your content..."
    >
      <div
        style={
          accountStatus === "inactive"
            ? {
                pointerEvents: "none",
                opacity: 0.8,
              }
            : {}
        }
      >
        <Card
          title="Category template"
          sectioned
          primaryFooterAction={{
            content: "Save",
            onAction: saveFormdata,
            loading: saveBtnLoader,
          }}
        >
          <Banner status="info">
            <p>
              Set category related components for eBay listing. Here you can set
              primary category and it's attributes. You can set product
              condition, store front category and secondary category also.
            </p>
          </Banner>
          <Card.Section>{getCategoryStructure("primary")}</Card.Section>
          <Card.Section>{getCategoryStructure("secondary")}</Card.Section>
        </Card>
      </div>
    </LoadingOverlay>
  );
};

export default withRouter(CategoryTemplatePolarisNew);
