import {
  Banner,
  Button,
  Card,
  Checkbox,
  ChoiceList,
  FormLayout,
  Layout,
  Select,
  Stack,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import { Col, Image, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  getAttributesByProductQuery,
  getattributesCategorywise,
  getCategoriesApi,
  getTemplatebyId,
} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import { notify } from "../../../../../../services/notify";

const CategoryTemplatePolaris = (props) => {
  const { id, loader, showSecondaryCategory, siteID, shopID, recieveFormdata } =
    props;
  const [connectedAccountsObject, setconnectedAccountsObject] = useState([]);
  const [accountSelection, setaccountSelection] = useState("");
  const [siteIDSelection, setsiteIDSelection] = useState("");
  const [shopIDSelection, setshopIDSelection] = useState("");

  // form data
  const [formData, setFormData] = useState({
    primaryCategory: {
      // categoryMapping: {},
      categoryMapping: [],
      attributeMapping: {
        requiredAttributes: {},
        optionalAttributes: {
          // mapping: {},
          mapping: [],
          counter: 0,
        },
        customAttributes: {
          mapping: {},
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
        },
        shopifyAttributes: {},
      },
    },
  });
  const [attributesLoader, setAttributesLoader] = useState(false);
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const renderCategoryMapping = (categoryType) => {
    let temp = { ...formData };
    let structurePrepared = temp?.[categoryType]?.["categoryMapping"].map(
      (level, index) => {
        return (
          <Select
            key={index}
            placeholder="Please Select..."
            label={level?.["label"]}
            options={level?.["options"]}
            value={level?.["value"]}
            onChange={(e) => {
              let test = { ...formData };
              test[categoryType]["categoryMapping"].splice(index + 1);
              test[categoryType]["attributeMapping"]["requiredAttributes"] = [];
              test[categoryType]["attributeMapping"]["optionalAttributes"] = {
                mapping: [],
                counter: 0,
              };
              test[categoryType]["attributeMapping"]["customAttributes"] = {
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
              };
              test[categoryType]["categoryMapping"][index]["value"] = e;
              test[categoryType]["categoryMapping"][index]["value"] &&
                getCategory({
                  parent_category_id:
                    temp[categoryType]?.["categoryMapping"]?.[index]?.["value"],
                });
              setFormData(test);
            }}
          />
        );
      }
    );
    return structurePrepared;
  };
  // const renderCategoryMapping = (categoryType) => {
  //   let temp = { ...formData };
  //   let structurePrepared = Object.keys(
  //     temp[categoryType]["categoryMapping"]
  //   ).map((level, index) => {
  //     return (
  //       <Select
  //         key={index}
  //         placeholder="Please Select..."
  //         label={temp[categoryType]?.["categoryMapping"]?.[level]?.["label"]}
  //         options={
  //           temp[categoryType]?.["categoryMapping"]?.[level]?.["options"]
  //         }
  //         value={temp[categoryType]?.["categoryMapping"]?.[level]?.["value"]}
  //         onChange={(e) => {
  //           let test = { ...formData };
  //           // console.log(e, level, formData);
  //           // Object.keys(test[categoryType]["categoryMapping"]).map((element, index)=>{
  //           //   // console.log(element, index);
  //           //   if(element === level) {
  //           //     let check = parseInt(element.split('-')[1])+index+2
  //           //     let checkMod = `level-${check}`
  //           //     Object.keys(formData[categoryType]["categoryMapping"]).map((element1) => {
  //           //       // if(element1 !== level)
  //           //       delete temp[categoryType]["categoryMapping"][checkMod]
  //           //       setFormData({...formData['primaryCategory']['categoryMapping'], temp})
  //           //     })
  //           //   }
  //           // })
  //           test[categoryType]["categoryMapping"][level]["value"] = e;
  //           temp[categoryType]?.["categoryMapping"]?.[level]?.["value"] &&
  //             getCategory({
  //               parent_category_id:
  //                 temp[categoryType]?.["categoryMapping"]?.[level]?.["value"],
  //             });
  //           setFormData(temp);
  //         }}
  //       />
  //     );
  //   });
  //   return structurePrepared;
  // };

  const renderRequiredAttributeMapping = (categoryType) => {
    let temp = { ...formData };
    let structurePrepared = [];
    if (
      Object.keys(
        temp?.[categoryType]?.["attributeMapping"]?.["requiredAttributes"]
      ).length > 0
    ) {
      structurePrepared = temp[categoryType]["attributeMapping"][
        "requiredAttributes"
      ].map((attribute, index) => {
        return (
          <Card.Section
            title={`# ${attribute?.["attributeNumber"]}`}
            key={index}
          >
            <Stack vertical>
              <FormLayout>
                <FormLayout.Group>
                  <Select
                    disabled
                    label="eBay attributes"
                    value={attribute?.value}
                    options={
                      temp[categoryType]["attributeMapping"][
                        "requiredAttributes"
                      ]
                    }
                  />
                  <Select
                    label="Shopify attributes"
                    placeholder="Select..."
                    value={attribute?.["selectedShopifyAttributeValueType"]}
                    onChange={(e1) => {
                      let temp1 = { ...formData };
                      temp1[categoryType]["attributeMapping"][
                        "requiredAttributes"
                      ][index]["selectedShopifyAttributeValue"] = "";
                      let filteredAttr = temp1[categoryType][
                        "attributeMapping"
                      ]["requiredAttributes"].map((e, i) => {
                        if (e.value === attribute.value) {
                          e["selectedShopifyAttributeValueType"] = e1;
                          return e;
                        } else {
                          return e;
                        }
                      });
                      temp1[categoryType]["attributeMapping"][
                        "requiredAttributes"
                      ] = [...filteredAttr];
                      setFormData(temp1);
                    }}
                    options={attribute?.["optionsCheck"]}
                  />
                </FormLayout.Group>
              </FormLayout>
              {attribute?.["selectedShopifyAttributeValueType"] ===
                "EbayRecommendedAttributes" && (
                <Select
                  placeholder="Please Select..."
                  label="Select eBay Recommendation"
                  options={attribute?.["ebayRecommendedAttributesOptions"]}
                  value={attribute?.["selectedShopifyAttributeValue"]}
                  onChange={(e1) => {
                    let temp1 = { ...formData };
                    let filteredAttr = temp1[categoryType]["attributeMapping"][
                      "requiredAttributes"
                    ].map((e, i) => {
                      if (e.value === attribute.value) {
                        e["selectedShopifyAttributeValue"] = e1;
                        return e;
                      } else {
                        return e;
                      }
                    });
                    temp1[categoryType]["attributeMapping"][
                      "requiredAttributes"
                    ] = [...filteredAttr];
                    setFormData(temp1);
                  }}
                />
              )}
              {attribute?.["selectedShopifyAttributeValueType"] ===
                "ShopifyAttributes" && (
                <Select
                  placeholder="Please Select..."
                  label="Select Shopify Attribute"
                  options={attribute?.["shopifyAttributesOptions"]}
                  value={attribute?.["selectedShopifyAttributeValue"]}
                  onChange={(e1) => {
                    let temp1 = { ...formData };
                    let filteredAttr = temp1[categoryType]["attributeMapping"][
                      "requiredAttributes"
                    ].map((e, i) => {
                      if (e.value === attribute.value) {
                        e["selectedShopifyAttributeValue"] = e1;
                        return e;
                      } else {
                        return e;
                      }
                    });
                    temp1[categoryType]["attributeMapping"][
                      "requiredAttributes"
                    ] = [...filteredAttr];
                    setFormData(temp1);
                  }}
                />
              )}
              {attribute?.["selectedShopifyAttributeValueType"] ===
                "Custom" && (
                <TextField
                  placeholder="Please Select..."
                  label="Set Custom Value"
                  value={attribute?.["selectedShopifyAttributeValue"]}
                  onChange={(e1) => {
                    let temp1 = { ...formData };
                    let filteredAttr = temp1[categoryType]["attributeMapping"][
                      "requiredAttributes"
                    ].map((e, i) => {
                      if (e.value === attribute.value) {
                        e["selectedShopifyAttributeValue"] = e1;
                        return e;
                      } else {
                        return e;
                      }
                    });
                    temp1[categoryType]["attributeMapping"][
                      "requiredAttributes"
                    ] = [...filteredAttr];
                    setFormData(temp1);
                  }}
                />
              )}
            </Stack>
          </Card.Section>
        );
      });
    }
    return structurePrepared;
  };
  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  const addOptionalAttribute = (categoryType) => {
    let temp = { ...formData };
    // temp[categoryType]["attributeMapping"]["optionalAttributes"]["counter"]++;
    // let createdObject = {};
    let createdArr = [];
    let tempObject = {
      customAttribute: { label: "eBay attributes", value: "" },
      shopifyAttribute: { label: "Shopify attributes", value: "" },
      selectedShopifyAttributeValueType: "",
    };
    createdArr.push(tempObject);
    // createdObject[
    //   `#${temp[categoryType]["attributeMapping"]["optionalAttributes"]["counter"]}`
    // ] = tempObject;
    temp[categoryType]["attributeMapping"]["optionalAttributes"]["mapping"] = [
      ...temp[categoryType]["attributeMapping"]["optionalAttributes"][
        "mapping"
      ],
      ...createdArr,
    ];
    setFormData(temp);
  };
  const addCustomAttribute = (categoryType) => {
    let temp = { ...formData };
    // temp[categoryType]["attributeMapping"]["customAttributes"]["counter"]++;
    // let createdObject = {};
    let createdArr = [];
    let tempObject = {
      customAttribute: { label: "eBay attributes", value: "" },
      shopifyAttribute: { label: "Shopify attributes", value: "" },
      selectedShopifyAttributeValueType: "",
    };
    createdArr.push(tempObject);
    // createdObject[
    //   `#${temp[categoryType]["attributeMapping"]["customAttributes"]["counter"]}`
    // ] = tempObject;
    temp[categoryType]["attributeMapping"]["customAttributes"]["mapping"] = [
      ...temp[categoryType]["attributeMapping"]["customAttributes"]["mapping"],
      ...createdArr,
    ];
    setFormData(temp);
  };
  const removeOptionalAttributeMapping = (attribute, categoryType) => {
    let temp = { ...formData };
    temp[categoryType]["attributeMapping"]["optionalAttributes"][
      "mapping"
    ].splice(attribute, 1);
    setFormData(temp);
    // if (
    //   attribute.substring(1) ==
    //   temp[categoryType]["attributeMapping"]["optionalAttributes"]["counter"]
    // ) {
    //   temp[categoryType]["attributeMapping"]["optionalAttributes"]["counter"]--;
    //   delete temp[categoryType]["attributeMapping"]["optionalAttributes"][
    //     "mapping"
    //   ][attribute];
    //   setFormData(temp);
    // } else if (
    //   attribute.substring(1) <
    //   temp[categoryType]["attributeMapping"]["optionalAttributes"]["counter"]
    // ) {
    // }
  };
  const removeCustomAttributeMapping = (attribute, categoryType) => {
    let temp = { ...formData };
    temp[categoryType]["attributeMapping"]["customAttributes"][
      "mapping"
    ].splice(attribute, 1);
    setFormData(temp);
    // if (
    //   attribute.substring(1) ==
    //   temp[categoryType]["attributeMapping"]["customAttributes"]["counter"]
    // ) {
    //   temp[categoryType]["attributeMapping"]["customAttributes"]["counter"]--;
    //   delete temp[categoryType]["attributeMapping"]["customAttributes"][
    //     "mapping"
    //   ][attribute];
    //   setFormData(temp);
    // }
  };
  const renderOptionalAttributeMappingStructure = (categoryType) => {
    let temp = { ...formData };
    let optionalAttributeMapping =
      temp[categoryType]["attributeMapping"]["optionalAttributes"];

    return (
      <>
        {Object.keys(optionalAttributeMapping["mapping"]).length === 0 && (
          <Banner status="info">
            <p>
              Optional attributes can be added by clicking Add attribute above
            </p>
          </Banner>
        )}
        {Object.keys(optionalAttributeMapping["mapping"]).map(
          (attribute, index) => {
            let filteredObj = optionalAttributeMapping["options"].filter(
              (item) =>
                optionalAttributeMapping["mapping"][attribute][
                  "customAttribute"
                ]["value"] === item.value
            )[0];
            let titleName = `#${parseInt(attribute) + 1}`;
            return (
              <Card
                sectioned
                title={titleName}
                actions={[
                  {
                    content: "Delete",
                    onAction: () =>
                      removeOptionalAttributeMapping(
                        attribute,
                        "primaryCategory"
                      ),
                  },
                ]}
                key={index}
              >
                <Stack vertical>
                  <FormLayout>
                    <FormLayout.Group>
                      <Select
                        placeholder="Please Select..."
                        label={
                          optionalAttributeMapping["mapping"][attribute][
                            "customAttribute"
                          ]["label"]
                        }
                        options={optionalAttributeMapping?.["options"]}
                        value={
                          optionalAttributeMapping["mapping"][attribute][
                            "customAttribute"
                          ]["value"]
                        }
                        onChange={(e) => {
                          temp[categoryType]["attributeMapping"][
                            "optionalAttributes"
                          ]["mapping"][attribute]["shopifyAttribute"]["value"] =
                            "";
                          temp[categoryType]["attributeMapping"][
                            "optionalAttributes"
                          ]["mapping"][attribute]["customAttribute"]["value"] =
                            e;
                          setFormData(temp);
                        }}
                      />
                      <Select
                        placeholder="Please Select..."
                        disabled={
                          optionalAttributeMapping["mapping"][attribute][
                            "customAttribute"
                          ]["value"] === ""
                        }
                        label={
                          optionalAttributeMapping["mapping"][attribute][
                            "shopifyAttribute"
                          ]["label"]
                        }
                        options={filteredObj?.["optionsCheck"]}
                        value={
                          filteredObj?.["selectedShopifyAttributeValueType"]
                        }
                        onChange={(e) => {
                          temp[categoryType]["attributeMapping"][
                            "optionalAttributes"
                          ]["mapping"][attribute]["shopifyAttribute"]["value"] =
                            "";
                          let test = temp[categoryType]["attributeMapping"][
                            "optionalAttributes"
                          ]["options"].map((e1) => {
                            if (e1.value === filteredObj.value) {
                              e1["selectedShopifyAttributeValue"] = "";
                              return {
                                ...e1,
                                selectedShopifyAttributeValueType: e,
                              };
                            } else return e1;
                          });
                          temp[categoryType]["attributeMapping"][
                            "optionalAttributes"
                          ]["mapping"][attribute][
                            "selectedShopifyAttributeValueType"
                          ] = e;
                          temp[categoryType]["attributeMapping"][
                            "optionalAttributes"
                          ]["options"] = test;
                          setFormData(temp);
                        }}
                      />
                    </FormLayout.Group>
                  </FormLayout>
                  {filteredObj?.["selectedShopifyAttributeValueType"] ===
                    "EbayRecommendedAttributes" && (
                    <Select
                      placeholder="Please Select..."
                      options={
                        filteredObj?.["ebayRecommendedAttributesOptions"]
                      }
                      label={"Select eBay Recommendation"}
                      value={filteredObj?.selectedShopifyAttributeValue}
                      onChange={(e) => {
                        temp[categoryType]["attributeMapping"][
                          "optionalAttributes"
                        ]["mapping"][attribute]["shopifyAttribute"]["value"] =
                          e;
                        let test = temp[categoryType]["attributeMapping"][
                          "optionalAttributes"
                        ]["options"].map((e1) => {
                          if (e1.value === filteredObj.value) {
                            return {
                              ...e1,
                              selectedShopifyAttributeValue: e,
                            };
                          } else return e1;
                        });
                        temp[categoryType]["attributeMapping"][
                          "optionalAttributes"
                        ]["options"] = test;
                        setFormData(temp);
                      }}
                    />
                  )}
                  {filteredObj?.["selectedShopifyAttributeValueType"] ===
                    "ShopifyAttributes" && (
                    <Select
                      placeholder="Please Select..."
                      options={filteredObj?.["shopifyAttributesOptions"]}
                      label={"Select Shopify Attribute"}
                      value={filteredObj?.selectedShopifyAttributeValue}
                      onChange={(e) => {
                        temp[categoryType]["attributeMapping"][
                          "optionalAttributes"
                        ]["mapping"][attribute]["shopifyAttribute"]["value"] =
                          e;
                        let test = temp[categoryType]["attributeMapping"][
                          "optionalAttributes"
                        ]["options"].map((e1) => {
                          if (e1.value === filteredObj.value) {
                            return {
                              ...e1,
                              selectedShopifyAttributeValue: e,
                            };
                          } else return e1;
                        });
                        temp[categoryType]["attributeMapping"][
                          "optionalAttributes"
                        ]["options"] = test;
                        setFormData(temp);
                      }}
                    />
                  )}
                  {filteredObj?.["selectedShopifyAttributeValueType"] ===
                    "Custom" && (
                    <TextField
                      placeholder="Please Select..."
                      label="Set Custom Value"
                      value={filteredObj?.["selectedShopifyAttributeValue"]}
                      onChange={(e1) => {
                        let temp1 = { ...formData };
                        temp1[categoryType]["attributeMapping"][
                          "optionalAttributes"
                        ]["mapping"][attribute]["shopifyAttribute"]["value"] =
                          e1;
                        let filteredAttr = temp1[categoryType][
                          "attributeMapping"
                        ]["optionalAttributes"]["options"].map((e) => {
                          if (e.value === filteredObj.value) {
                            e["selectedShopifyAttributeValue"] = e1;
                            return e;
                          } else {
                            return e;
                          }
                        });
                        temp1[categoryType]["attributeMapping"][
                          "optionalAttributes"
                        ]["options"] = [...filteredAttr];
                        setFormData(temp1);
                      }}
                    />
                  )}
                </Stack>
              </Card>
            );
          }
        )}
      </>
    );
  };
  const renderCustomAttributeMappingStructure = (categoryType) => {
    let temp = { ...formData };
    let customAttributeMapping =
      temp[categoryType]["attributeMapping"]["customAttributes"];

    return (
      <Stack vertical>
        {Object.keys(customAttributeMapping["mapping"]).length === 0 && (
          <Banner status="info">
            <p>
              Custom attributes can be added by clicking Add attribute above
            </p>
          </Banner>
        )}
        {Object.keys(customAttributeMapping["mapping"]).map(
          (attribute, index) => {
            let titleName = `#${parseInt(attribute) + 1}`;
            return (
              <Card
                sectioned
                title={titleName}
                actions={[
                  {
                    content: "Delete",
                    onAction: () =>
                      removeCustomAttributeMapping(
                        attribute,
                        "primaryCategory"
                      ),
                  },
                ]}
                key={index}
              >
                <Stack vertical>
                  <FormLayout>
                    <FormLayout.Group>
                      <TextField
                        placeholder="Please Select..."
                        label={
                          customAttributeMapping["mapping"][attribute][
                            "customAttribute"
                          ]["label"]
                        }
                        value={
                          customAttributeMapping["mapping"][attribute][
                            "customAttribute"
                          ]["value"]
                        }
                        onChange={(e) => {
                          temp[categoryType]["attributeMapping"][
                            "customAttributes"
                          ]["mapping"][attribute]["customAttribute"]["value"] =
                            e;
                          setFormData(temp);
                        }}
                      />
                      <Select
                        label="Shopify attributes"
                        placeholder="Please Select..."
                        disabled={
                          customAttributeMapping["mapping"][attribute][
                            "customAttribute"
                          ]["value"] === ""
                        }
                        options={customAttributeMapping["optionsCheck"]}
                        value={
                          customAttributeMapping["mapping"][attribute][
                            "selectedShopifyAttributeValueType"
                          ]
                        }
                        onChange={(e) => {
                          let test = { ...formData };
                          test[categoryType]["attributeMapping"][
                            "customAttributes"
                          ]["mapping"][attribute]["shopifyAttribute"]["value"] =
                            "";
                          test[categoryType]["attributeMapping"][
                            "customAttributes"
                          ]["mapping"][attribute][
                            "selectedShopifyAttributeValueType"
                          ] = e;
                          setFormData(test);
                        }}
                      />
                    </FormLayout.Group>
                  </FormLayout>
                  {customAttributeMapping["mapping"][attribute][
                    "selectedShopifyAttributeValueType"
                  ] === "ShopifyAttributes" && (
                    <Select
                      placeholder="Please Select..."
                      options={
                        temp[categoryType]["attributeMapping"]?.[
                          "shopifyAttributes"
                        ]
                      }
                      label={"Select Shopify Attribute"}
                      value={
                        customAttributeMapping["mapping"][attribute][
                          "shopifyAttribute"
                        ]["value"]
                      }
                      onChange={(e) => {
                        let test = { ...formData };
                        test[categoryType]["attributeMapping"][
                          "customAttributes"
                        ]["mapping"][attribute]["shopifyAttribute"]["value"] =
                          e;
                        setFormData(temp);
                      }}
                    />
                  )}
                  {customAttributeMapping["mapping"][attribute][
                    "selectedShopifyAttributeValueType"
                  ] === "Custom" && (
                    <TextField
                      placeholder="Please Select..."
                      label={"Set Custom Value"}
                      value={
                        customAttributeMapping["mapping"][attribute][
                          "shopifyAttribute"
                        ]["value"]
                      }
                      onChange={(e) => {
                        let test = { ...formData };
                        test[categoryType]["attributeMapping"][
                          "customAttributes"
                        ]["mapping"][attribute]["shopifyAttribute"]["value"] =
                          e;
                        setFormData(temp);
                      }}
                    />
                  )}
                </Stack>
              </Card>
            );
          }
        )}
      </Stack>
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
  const getExtractedDataForAttribute = (attributeData) => {
    let requiredAttributes = [];
    let optionalAttributes = [];
    attributeData.forEach((data) => {
      let tempObj = {
        label: data?.name,
        value: data?.code,
        variation: data?.variation,
        // attributeNumber: data?.sort_order,
        ebayRecommendedAttributesOptions: extractEbayRecommendedAttributes(
          data?.values
        ),
        shopifyAttributesOptions:
          formData["primaryCategory"]["attributeMapping"]["shopifyAttributes"],
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

  const getCategory = async (requestObj) => {
    let {
      success: successMappingCategorywise,
      data: mappingCategorywise,
      message,
    } = await getCategoriesApi({
      ...requestObj,
      site_id: siteID,
      shop_id: shopID,
      // site_id: siteIDSelection,
      // shop_id: shopIDSelection,
    });
    if (successMappingCategorywise) {
      if (
        Array.isArray(mappingCategorywise) &&
        mappingCategorywise.length > 0
      ) {
        let extractData = getExtractedDataForCategory(mappingCategorywise);
        let temp = { ...formData };
        temp["primaryCategory"]["categoryMapping"].push({
          options: extractData,
          label: `Category Level ${extractData[0]["level"]}`,
          value: "",
          levelNumber: extractData[0]["level"],
        });
        // temp["primaryCategory"]["categoryMapping"][
        //   `level-${extractData[0]["level"]}`
        // ] = {
        //   options: extractData,
        //   label: `Category Level ${extractData[0]["level"]}`,
        //   value: "",
        //   levelNumber: extractData[0]["level"],
        // };
        setFormData(temp);
      } else if (
        Array.isArray(mappingCategorywise) &&
        mappingCategorywise.length == 0
      ) {
        setAttributesLoader(true);
        const temp = { ...formData?.primaryCategory?.["categoryMapping"] };
        const lastLevel = Object.keys(temp).pop();
        const lastLevelValue =
          formData?.primaryCategory?.["categoryMapping"]?.[lastLevel]?.[
            "value"
          ];
        let {
          success: successattribCategorywise,
          data: attributeCategorywise,
          message: attributeMsg,
        } = await getattributesCategorywise({
          category_id: lastLevelValue,
          site_id: siteID,
          shop_id: shopID,
          // site_id: siteIDSelection,
          // shop_id: shopIDSelection,
        });
        if (
          successattribCategorywise &&
          Array.isArray(attributeCategorywise) &&
          attributeCategorywise.length > 0
        ) {
          let extractData = getExtractedDataForAttribute(attributeCategorywise);
          let temp = { ...formData };
          temp["primaryCategory"]["attributeMapping"]["requiredAttributes"] = [
            ...extractData?.requiredAttributes,
          ];
          temp["primaryCategory"]["attributeMapping"]["optionalAttributes"][
            "options"
          ] = [...extractData?.optionalAttributes];
          setFormData(temp);
        } else {
          // notify.error(attributeMsg);
        }
        setAttributesLoader(false);
      }
    } else {
      // notify.error(message);
    }
  };

  const setShopifyAttribute = (data, categoryType) => {
    let temp = [];
    temp = data.map((attribute) => {
      return {
        label: attribute?.title,
        value: attribute?.code,
      };
    });
    let tempFormData = { ...formData };
    tempFormData["primaryCategory"]["attributeMapping"]["shopifyAttributes"] = [
      ...temp,
    ];
    setFormData(tempFormData);
  };

  const getShopifyAttributes = async (categoryType) => {
    let { success, data } = await getAttributesByProductQuery({
      marketplace: "shopify",
      query: "(price>-1)",
    });
    if (success) setShopifyAttribute(data, categoryType);
  };

  useEffect(() => {
    console.log(siteIDSelection);
    siteIDSelection && getCategory({ level: 1 });
  }, [siteIDSelection]);

  const getTemplateData = async (id) => {
    if (id) {
      let { success, data } = await getTemplatebyId(id);
      if (success) {
        let temp = { ...formData };
        temp = { ...data.data };
        let extractData = getModifiedDataFromSavedTemplate(temp);
        // setFormData(temp);
      }
    }
  };

  const getModifiedDataFromSavedTemplate = (data) => {
    let primaryCategoryData =
      getModifiedDataFromSavedTemplateForPrimaryCategory(data?.primaryCategory);
  };

  const getModifiedDataFromSavedTemplateForPrimaryCategory = (data) => {
    console.log(data);
    console.log(formData);
    let temp = { ...formData };
    if (data?.category_mapping) {
      let arrOfObj = [];
      Object.keys(data.category_mapping).forEach((key, index) => {
        let obj = {};
        obj["label"] = `Category Level ${key}`;
        obj["value"] = data.category_mapping[key];
        obj["levelNumber"] = key;
        obj["options"] = data.category_mapping_options[key];
        arrOfObj.push(obj);
      });
      temp.primaryCategory.categoryMapping = arrOfObj;
      setFormData(temp);
    }
  };
  const getTemplate = async () => {
    if (id) {
      await getTemplateData(id);
      // this.getAttribute("primaryCategory");
      // this.getAttribute("secondaryCategory");
    } else {
      // this.prepareCategoryandAttributes();
      siteID && getCategory({ level: 1 });
      getShopifyAttributes("primaryCategory");
    }
  };

  useEffect(() => {
    // getAllConnectedAccounts();
    setsiteIDSelection(siteID);
    setshopIDSelection(shopID);
    // getTemplate();
  }, []);

  const getCategoryName = (category) => {
    let categoryName = category.options.find(
      (option) => option.value === category.value
    );
    let categoryOptions = category.options.map((option) => {
      let { level, ...rest } = option;
      return rest;
    });
    return { categoryName: categoryName.label, categoryOptions };
  };
  const modifyDataForCategoryMappingSave = (categoryMapping) => {
    let test = [...categoryMapping];
    let postData = {
      category_mapping: {},
      category_mapping_name: {},
      category_mapping_options: {},
      optional_attribute_count: 0,
      required_attribute_count: 0,
      show_Attribute_mapping: true,
      category_feature: "",
    };
    test.forEach((categoryLevel, index) => {
      postData["category_mapping"][index + 1] = categoryLevel["value"];
      postData["category_mapping_name"][index + 1] =
        getCategoryName(categoryLevel)["categoryName"];
      postData["category_mapping_options"][index + 1] =
        getCategoryName(categoryLevel)["categoryOptions"];
    });
    return postData;
  };
  const modifyDataForAttributeMappingSave = (attributeMapping) => {
    let test = [...attributeMapping.requiredAttributes];
    let postData = {
      attribute_mapping: {
        customShopifyAttrib: [],
        optional_map: [],
        required_map: [],
        custom_map: [],
        ebayAttrib: [],
        shopifyAttrib: [],
        used_ebay_attrib: [],
        ebayAttribInfo: {},
      },
      attributes_minmax: {},
    };
    // for attributes_minmax
    attributeMapping.requiredAttributes.map((attribute, index) => {
      postData["attributes_minmax"][attribute.value] = 2;
    });
    attributeMapping.optionalAttributes.options.map((attribute, index) => {
      postData["attributes_minmax"][attribute.value] = 2;
    });
    // for required_map
    test.forEach((attribute, index) => {
      let testObj = {};
      testObj["ebayAttrib"] = attribute["value"];
      if (
        attribute["selectedShopifyAttributeValueType"] === "ShopifyAttributes"
      ) {
        testObj["shopifyAttrib"] = attribute["selectedShopifyAttributeValue"];
        testObj["recommendation"] = "";
        testObj["defaultText"] = "";
      } else if (attribute["selectedShopifyAttributeValueType"] === "Custom") {
        testObj["shopifyAttrib"] = "recommendation";
        testObj["recommendation"] = "custom";
        testObj["defaultText"] = attribute["selectedShopifyAttributeValue"];
      } else if (
        attribute["selectedShopifyAttributeValueType"] ===
        "EbayRecommendedAttributes"
      ) {
        testObj["shopifyAttrib"] = "recommendation";
        testObj["recommendation"] = attribute["selectedShopifyAttributeValue"];
        testObj["defaultText"] = "";
      }
      postData["attribute_mapping"]["required_map"].push(testObj);
    });
    // for optional_map
    attributeMapping.optionalAttributes.mapping.forEach((attribute, index) => {
      let testObj = {};
      testObj["ebayAttrib"] = attribute["customAttribute"]["value"];
      if (
        attribute["selectedShopifyAttributeValueType"] === "ShopifyAttributes"
      ) {
        testObj["shopifyAttrib"] = attribute["shopifyAttribute"]["value"];
        testObj["recommendation"] = "";
        testObj["defaultText"] = "";
      } else if (
        attribute["selectedShopifyAttributeValueType"] ===
        "EbayRecommendedAttributes"
      ) {
        testObj["shopifyAttrib"] = "recommendation";
        testObj["recommendation"] = attribute["shopifyAttribute"]["value"];
        testObj["defaultText"] = "";
      } else if (attribute["selectedShopifyAttributeValueType"] === "Custom") {
        testObj["shopifyAttrib"] = "recommendation";
        testObj["recommendation"] = "custom";
        testObj["defaultText"] = attribute["shopifyAttribute"]["value"];
      }
      postData["attribute_mapping"]["optional_map"].push(testObj);
    });

    // for used_ebay_attrib
    postData["attribute_mapping"]["optional_map"].forEach((attribute) => {
      postData["attribute_mapping"]["used_ebay_attrib"].push(
        attribute.ebayAttrib
      );
    });

    // for custom_map
    attributeMapping.customAttributes.mapping.forEach((attribute, index) => {
      let testObj = {};
      testObj["customAttrib"] = attribute["customAttribute"]["value"];
      if (
        attribute["selectedShopifyAttributeValueType"] === "ShopifyAttributes"
      ) {
        testObj["shopifyAttrib"] = attribute["shopifyAttribute"]["value"];
        testObj["defaultText"] = "";
      } else if (attribute["selectedShopifyAttributeValueType"] === "Custom") {
        testObj["shopifyAttrib"] = "custom";
        testObj["defaultText"] = attribute["shopifyAttribute"]["value"];
      }
      postData["attribute_mapping"]["custom_map"].push(testObj);
    });

    // for shopifyAttrib
    postData["attribute_mapping"]["shopifyAttrib"] =
      attributeMapping.shopifyAttributes.map((attribute) => {
        return { ...attribute, choices: [], default_condition: "" };
      });
    postData["attribute_mapping"]["shopifyAttrib"].unshift({
      label: "Set a custom",
      value: "custom",
    });

    // for customShopifyAttrib
    postData["attribute_mapping"]["customShopifyAttrib"] =
      attributeMapping.shopifyAttributes.map((attribute) => {
        return { ...attribute, choices: [], default_condition: "" };
      });
    postData["attribute_mapping"]["customShopifyAttrib"].unshift(
      { label: "Set a custom", value: "custom" },
      { label: "Tags", value: "tags" }
    );

    // for ebayAttrib
    let ebayAttribRequiredTempOptions = [];
    ebayAttribRequiredTempOptions = attributeMapping.requiredAttributes.map(
      (attribute, index) => {
        let testObj = {};
        testObj["label"] = attribute["label"];
        testObj["value"] = attribute["value"];
        testObj["disabled"] = true;
        testObj["enableforvariation"] = attribute["variation"];
        return testObj;
      }
    );
    let ebayAttribOptionalTempOptions = [];
    ebayAttribOptionalTempOptions =
      attributeMapping.optionalAttributes.options.map((attribute, index) => {
        let testObj = {};
        testObj["label"] = attribute["label"];
        testObj["value"] = attribute["value"];
        testObj["disabled"] = false;
        testObj["enableforvariation"] = attribute["variation"];
        return testObj;
      });
    let ebayAttribRequiredTemp = {};
    ebayAttribRequiredTemp["options"] = [...ebayAttribRequiredTempOptions];
    ebayAttribRequiredTemp["title"] = "Required";
    let ebayAttribOptionalTemp = {};
    ebayAttribOptionalTemp["options"] = [...ebayAttribOptionalTempOptions];
    ebayAttribOptionalTemp["title"] = "Optional";

    let ebayAttribTemp = [];
    ebayAttribTemp.push(ebayAttribRequiredTemp, ebayAttribOptionalTemp);
    postData["attribute_mapping"]["ebayAttrib"] = [...ebayAttribTemp];

    // for ebayAttribInfo
    let ebayAttribInfoTemp = {};
    attributeMapping.requiredAttributes.map((attribute, index) => {
      let testObj = {};
      testObj["required"] = true;
      testObj["recommendedoptions"] =
        attribute.ebayRecommendedAttributesOptions;
      testObj["recommendedoptions"].unshift({
        label: "Set a custom",
        value: "custom",
      });
      ebayAttribInfoTemp[attribute.value] = { ...testObj };
    });
    attributeMapping.optionalAttributes.options.map((attribute, index) => {
      let testObj = {};
      testObj["required"] = false;
      testObj["recommendedoptions"] =
        attribute.ebayRecommendedAttributesOptions;
      testObj["recommendedoptions"].unshift({
        label: "Set a custom",
        value: "custom",
      });
      ebayAttribInfoTemp[attribute.value] = { ...testObj };
    });
    postData["attribute_mapping"]["ebayAttribInfo"] = { ...ebayAttribInfoTemp };
    return postData;
  };
  const saveFormdata = async () => {
    setSaveBtnLoader(true);
    let postData = {
      primaryCategory: {},
      site_id: siteID,
      shop_id: shopID,
      // site_id: siteIDSelection,
      // shop_id: shopIDSelection,
    };
    postData["primaryCategory"] = {
      ...modifyDataForCategoryMappingSave(
        formData?.["primaryCategory"]?.["categoryMapping"]
      ),
      ...modifyDataForAttributeMappingSave(
        formData?.["primaryCategory"]?.["attributeMapping"]
      ),
    };
    let tempObj = {
      title: formData.primaryCategory.categoryMapping.at(-1).value,
      type: "category",
      data: postData,
      site_id: siteID,
      // siteIDSelection,
      shop_id: shopID,
      // shopIDSelection,
    };
    let { message, success } = await recieveFormdata(tempObj);
    if (success) {
      redirect("/panel/ebay/templatesUS");
    } else {
      notify.error(message);
    }
    setSaveBtnLoader(false);
  };

  const redirect = (url) => {
    props.history.push(url);
  };
  return (
    <Card
      title="Category template"
      sectioned
      // actions={[{ content: "Save", onAction: saveFormdata }]}
      primaryFooterAction={{
        content: "Save",
        onAction: saveFormdata,
        loading: saveBtnLoader,
      }}
    >
      <Banner status="info">
        <p>
          Category template is used for assigning a category to your product
          along with the required and optional attributes which you commonly use
          for listing on eBay.
        </p>
      </Banner>
      <Card.Section>
        <Layout>
          <>
            <Layout.AnnotatedSection
              id="primaryCategoryMapping"
              title="Primary Category Mapping"
              description={
                "Set eBay Category / Browse Node for a product, to set the Searchability & browsing hierarchy on eBay Marketplace."
              }
            >
              <Card sectioned title="Category Mapping">
                <Stack vertical spacing="tight">
                  {renderCategoryMapping("primaryCategory")}
                </Stack>
              </Card>
            </Layout.AnnotatedSection>
            {!attributesLoader ? (
              Object.keys(
                formData.primaryCategory.attributeMapping?.requiredAttributes
              ).length > 0 && (
                <Layout.AnnotatedSection
                  id="requiredAttributeMapping"
                  title="Required Attribute"
                  description={
                    "Map your eBay attributes with that of Shopify store’s attributes before uploading the product on Amazon."
                  }
                >
                  <Card sectioned>
                    {renderRequiredAttributeMapping("primaryCategory")}
                  </Card>
                </Layout.AnnotatedSection>
              )
            ) : (
              <Spin tip="Fetching Attributes" size="large" />
            )}
            {formData.primaryCategory.attributeMapping?.optionalAttributes
              ?.options && (
              <Layout.AnnotatedSection
                id="optionalAttributeMapping"
                title="Optional Attribute"
                description={""}
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
            {formData.primaryCategory.attributeMapping?.optionalAttributes
              ?.options && (
              <Layout.AnnotatedSection
                id="customAttributeMapping"
                title="Custom Attribute"
                description={""}
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
          </>
        </Layout>
      </Card.Section>
    </Card>
  );
};

export default withRouter(CategoryTemplatePolaris);
