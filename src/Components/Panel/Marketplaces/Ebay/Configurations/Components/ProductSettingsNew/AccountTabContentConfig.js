import {
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  Layout,
  Stack,
  Checkbox,
  TextField,
  Banner,
  ChoiceList,
  Select,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  Icon,
} from "@shopify/polaris";
import { RefreshMinor } from "@shopify/polaris-icons";
import { Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { currencyFunc } from "../../../../../../../APIrequests/ConfigurationAPI";
import { currencyConvertorURL } from "../../../../../../../URLs/ConfigurationURL";
const { Text, Title } = Typography;

let matchfromEbayOptions = [
  { label: "Title", value: "Title" },
  { label: "Sku", value: "SKU" },
];

let matchfromShopifyOptions = [
  { label: "Title", value: "title" },
  { label: "Sku", value: "sku" },
];

const AccountTabContentConfig = ({
  account,
  content,
  connectedAccountsObject,
  setconnectedAccountsObject,
  connectedAccountsObjectErrors,
  setConnectedAccountsObjectErrors,
}) => {
  let { fields, value } = content;
  const [currencyLoader, setCurrencyLoader] = useState(false);

  const handleBtnPres = (e, field, innerFieldLevel1 = "") => {
    let temp = { ...connectedAccountsObject };
    if (innerFieldLevel1) {
      if (
        field === "vatDetails" ||
        field === "itemLocation" ||
        field === "salesTaxDetails" ||
        field === "currencyConversion" ||
        field === "vehicleDetails"
      ) {
        temp[account]["fields"][field]["attribute"][innerFieldLevel1]["value"] =
          e;
      } else {
        temp[account]["fields"][field]["attribute"][innerFieldLevel1]["value"] =
          temp[account]["fields"][field]["attribute"][innerFieldLevel1][
            "value"
          ] === "yes"
            ? "no"
            : "yes";
      }
    } else {
      if (field === "packageType") {
        temp[account]["fields"][field]["packageTypeValue"] = e;
      } else {
        temp[account]["fields"][field]["enable"] =
          temp[account]["fields"][field]["enable"] === "yes" ? "no" : "yes";
      }
    }
    setconnectedAccountsObject(temp);
  };
  // useEffect(() => {
  //   console.log(connectedAccountsObject);
  // }, [connectedAccountsObject]);

  const handleAdd = (userPreference = "attributeMapping") => {
    switch (userPreference) {
      case "attributeMapping":
        let tempObj = {};
        let attributeAdded = "";
        tempObj = Object.assign({}, fields.match_from_ebay.attributeMapping);
        let tempArr = [];
        let ObjtoAdd = { shopify_attribute: "", ebay_attribute: "" };
        tempArr.push(ObjtoAdd);
        let test = { ...connectedAccountsObject };
        test[account].fields.match_from_ebay.attributeMapping.push(ObjtoAdd);
        setconnectedAccountsObject(test);
        break;
    }
  };

  const handleRemove = (userPreference = "attributeMapping", key) => {
    let test = { ...connectedAccountsObject };
    switch (userPreference) {
      case "attributeMapping":
        let temp = { ...connectedAccountsObject };
        temp[account]["fields"]["match_from_ebay"]["attributeMapping"].splice(
          key,
          1
        );
        setconnectedAccountsObject(test);
        break;
    }
  };

  const getCurrencyFunc = async () => {
    setCurrencyLoader(true);
    let temp = { ...connectedAccountsObject };
    let { success, data: currencyData } = await currencyFunc(
      currencyConvertorURL,
      {
        site_id: temp[account]["siteID"],
      }
    );
    // console.log(currencyData);
    // if (temp[account]["siteID"] == 2) {
    //   temp[account]["fields"]["currencyConversion"]["enable"] = "no";
    // } else 
    if (currencyData === "Both Currency Are Same") {
      temp[account]["fields"]["currencyConversion"]["enable"] = "no";
    } else if (success) {
      const { source, rate } = currencyData;
      if (source["shopify"] !== source["ebay"]) {
        temp[account]["fields"]["currencyConversion"]["attribute"][
          "shopifyCurrency"
        ]["shopifyCurrencyName"] = source["shopify"];
        temp[account]["fields"]["currencyConversion"]["attribute"][
          "shopifyCurrency"
        ]["shopifyCurrencyValue"] = source["amount"];

        temp[account]["fields"]["currencyConversion"]["attribute"][
          "ebayCurrency"
        ]["ebayCurrencyName"] = source["ebay"];
        temp[account]["fields"]["currencyConversion"]["attribute"][
          "ebayCurrency"
        ]["ebayCurrencyValue"] = rate ? rate : "";

        // if has Error
        if (
          connectedAccountsObjectErrors?.[account]?.["fields"]?.[
            "currencyConversion"
          ]?.["attribute"]?.["ebayCurrency"]?.["ebayCurrencyValue"]
        ) {
          let tempObjError = { ...connectedAccountsObjectErrors };
          tempObjError[account]["fields"]["currencyConversion"]["attribute"][
            "ebayCurrency"
          ]["ebayCurrencyValue"] = false;
          setConnectedAccountsObjectErrors(tempObjError);
        }
      } else {
        temp[account]["fields"]["currencyConversion"]["enable"] = "no";
      }
    }
    setconnectedAccountsObject(temp);
    setCurrencyLoader(false);
  };

  useEffect(() => {
    // console.log(connectedAccountsObject[account]);
    const { shopifyCurrencyName, shopifyCurrencyValue } =
      connectedAccountsObject[account]["fields"]["currencyConversion"][
        "attribute"
      ]["shopifyCurrency"];
    // console.log(
    //   connectedAccountsObject[account]["fields"]["currencyConversion"][
    //     "attribute"
    //   ]["ebayCurrency"]
    // );
    const { ebayCurrencyName, ebayCurrencyValue } =
      connectedAccountsObject[account]["fields"]["currencyConversion"][
        "attribute"
      ]["ebayCurrency"];

    if (
      !shopifyCurrencyName ||
      !shopifyCurrencyValue ||
      !ebayCurrencyName
      // ||
      // !ebayCurrencyValue
    ) {
      getCurrencyFunc();
    }
  }, [connectedAccountsObject]);

  const currencyHandler = (
    value,
    field,
    attribute,
    currencyType,
    currencyValue
  ) => {
    let tempAccounts = { ...connectedAccountsObject };
    tempAccounts[account]["fields"][field][attribute][currencyType][
      currencyValue
    ] = value;

    if (currencyType === "ebayCurrencyValue") {
      let tempObjError = { ...connectedAccountsObjectErrors };
      tempObjError[account]["fields"][field]["attribute"]["ebayCurrency"][
        "ebayCurrencyValue"
      ] = false;
      setConnectedAccountsObjectErrors(tempObjError);
    }
    setconnectedAccountsObject(tempAccounts);
  };
  return (
    <FormLayout>
      {Object.keys(fields).map((field, outerIndex) => {
        return (
          <Layout key={outerIndex}>
            {field === "currencyConversion" &&
              fields[field]["enable"] === "yes" && (
                <Layout.AnnotatedSection
                  id={field}
                  title={fields[field]["label"]}
                  description={fields[field]["description"]}
                >
                  <Card sectioned>
                    {currencyLoader && field === "currencyConversion" ? (
                      <SkeletonBodyText lines={2} />
                    ) : (
                      fields[field]["label"] === "Currency Converter" &&
                      fields[field]["enable"] === "yes" && (
                        <>
                          <br />
                          <FormLayout>
                            <FormLayout.Group condensed>
                              <TextField
                                placeholder={
                                  fields[field]["attribute"]["shopifyCurrency"][
                                    "label"
                                  ]
                                }
                                prefix={
                                  fields[field]["attribute"]["shopifyCurrency"][
                                    "shopifyCurrencyName"
                                  ]
                                }
                                value={String(
                                  fields[field]["attribute"]["shopifyCurrency"][
                                    "shopifyCurrencyValue"
                                  ]
                                )}
                                disabled
                                type="number"
                                onChange={(value) =>
                                  currencyHandler(
                                    value,
                                    field,
                                    "attribute",
                                    "shopifyCurrency",
                                    "shopifyCurrencyValue"
                                  )
                                }
                              />
                              <TextField
                                placeholder={
                                  fields[field]["attribute"]["ebayCurrency"][
                                    "label"
                                  ]
                                }
                                prefix={
                                  fields[field]["attribute"]["ebayCurrency"][
                                    "ebayCurrencyName"
                                  ]
                                }
                                value={String(
                                  fields[field]["attribute"]["ebayCurrency"][
                                    "ebayCurrencyValue"
                                  ]
                                )}
                                type="number"
                                onChange={(value) =>
                                  currencyHandler(
                                    value,
                                    field,
                                    "attribute",
                                    "ebayCurrency",
                                    "ebayCurrencyValue"
                                  )
                                }
                                error={
                                  connectedAccountsObjectErrors?.[account]?.[
                                    "fields"
                                  ]?.[field]?.["attribute"]?.["ebayCurrency"]?.[
                                    "ebayCurrencyValue"
                                  ]
                                }
                              />
                              <Button onClick={() => getCurrencyFunc()}>
                                <Icon source={RefreshMinor} color="base" />
                              </Button>
                            </FormLayout.Group>
                          </FormLayout>
                        </>
                      )
                    )}
                  </Card>
                </Layout.AnnotatedSection>
              )}
            {field !== "currencyConversion" && (
              <Layout.AnnotatedSection
                id={field}
                title={fields[field]["label"]}
                description={fields[field]["description"]}
              >
                <Card sectioned>
                  <FormLayout>
                    <Stack vertical spacing="extraTight">
                      {fields[field]["type"] === "segmentedBtn" && (
                        <ButtonGroup segmented>
                          <Button
                            primary={
                              fields[field]["enable"] === "yes" ? true : false
                            }
                            pressed={
                              fields[field]["enable"] === "yes" ? true : false
                            }
                            onClick={(e) => handleBtnPres(e, field)}
                          >
                            Yes
                          </Button>
                          <Button
                            primary={
                              fields[field]["enable"] === "no" ? true : false
                            }
                            pressed={
                              fields[field]["enable"] === "no" ? true : false
                            }
                            onClick={(e) => {
                              handleBtnPres(e, field);
                            }}
                          >
                            No
                          </Button>
                        </ButtonGroup>
                      )}
                      {fields[field]["label"] === "Vat Details" && (
                        <FormLayout>
                          <FormLayout.Group>
                            {Object.keys(fields[field]["attribute"]).map(
                              (innerFieldLevel1, index) => {
                                if (
                                  fields[field]["attribute"][innerFieldLevel1][
                                    "type"
                                  ] === "dropdown"
                                ) {
                                  return (
                                    <Select
                                      key={index}
                                      label={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["label"]
                                      }
                                      value={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["value"]
                                      }
                                      options={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["options"]
                                      }
                                      onChange={(e) =>
                                        handleBtnPres(
                                          e,
                                          field,
                                          innerFieldLevel1
                                        )
                                      }
                                    />
                                  );
                                } else {
                                  return (
                                    <TextField
                                      key={index}
                                      label={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["label"]
                                      }
                                      value={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["value"]
                                      }
                                      onChange={(e) =>
                                        handleBtnPres(
                                          e,
                                          field,
                                          innerFieldLevel1
                                        )
                                      }
                                      type="number"
                                    />
                                  );
                                }
                              }
                            )}
                          </FormLayout.Group>
                        </FormLayout>
                      )}
                      {fields[field]["label"] === "Sales Tax Details" && (
                        <FormLayout>
                          {Object.keys(fields[field]["attribute"]).map(
                            (innerFieldLevel1, index) => {
                              if (
                                fields[field]["attribute"][innerFieldLevel1][
                                  "type"
                                ] === "dropdown"
                              ) {
                                return (
                                  <Select
                                    key={index}
                                    label={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["label"]
                                    }
                                    value={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["value"]
                                    }
                                    options={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["options"]
                                    }
                                    onChange={(e) =>
                                      handleBtnPres(e, field, innerFieldLevel1)
                                    }
                                  />
                                );
                              } else if (
                                fields[field]["attribute"][innerFieldLevel1][
                                  "type"
                                ] === "dropdownDependent" &&
                                fields[field]["attribute"][
                                  "useEbayTaxRateTable"
                                ]["value"] === "no"
                              ) {
                                return (
                                  <Select
                                    key={index}
                                    label={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["label"]
                                    }
                                    value={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["value"]
                                    }
                                    options={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["options"]
                                    }
                                    onChange={(e) =>
                                      handleBtnPres(e, field, innerFieldLevel1)
                                    }
                                  />
                                );
                              } else if (
                                fields[field]["attribute"][innerFieldLevel1][
                                  "type"
                                ] === "checkbox" &&
                                fields[field]["attribute"][
                                  "useEbayTaxRateTable"
                                ]["value"] === "no"
                              ) {
                                return (
                                  <Checkbox
                                    key={index}
                                    label={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["label"]
                                    }
                                    checked={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["value"]
                                    }
                                    onChange={(e) =>
                                      handleBtnPres(e, field, innerFieldLevel1)
                                    }
                                  />
                                );
                              } else if (
                                fields[field]["attribute"][
                                  "useEbayTaxRateTable"
                                ]["value"] === "no"
                              ) {
                                return (
                                  <TextField
                                    key={index}
                                    label={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["label"]
                                    }
                                    value={
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["value"]
                                    }
                                    onChange={(e) =>
                                      handleBtnPres(e, field, innerFieldLevel1)
                                    }
                                  />
                                );
                              }
                            }
                          )}
                        </FormLayout>
                      )}
                      {fields[field]["label"] === "Vehicle Details" && (
                        <FormLayout>
                          {Object.keys(fields[field]["attribute"]).map(
                            (innerFieldLevel1, index) => {
                              return (
                                <TextField
                                  key={index}
                                  placeholder="..."
                                  label={
                                    fields[field]["attribute"][
                                      innerFieldLevel1
                                    ]["label"]
                                  }
                                  value={
                                    fields[field]["attribute"][
                                      innerFieldLevel1
                                    ]["value"]
                                  }
                                  onChange={(e) =>
                                    handleBtnPres(e, field, innerFieldLevel1)
                                  }
                                />
                              );
                            }
                          )}
                        </FormLayout>
                      )}
                      {fields[field]["label"] === "Item Location" && (
                        <FormLayout>
                          <FormLayout.Group>
                            {Object.keys(fields[field]["attribute"]).map(
                              (innerFieldLevel1, index) => {
                                if (
                                  fields[field]["attribute"][innerFieldLevel1][
                                    "type"
                                  ] === "dropdown"
                                ) {
                                  return (
                                    <Select
                                      key={index}
                                      placeholder={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["label"]
                                      }
                                      value={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["value"]
                                      }
                                      error={
                                        connectedAccountsObjectErrors?.[
                                          value
                                        ]?.["fields"]?.[field]?.["attribute"]?.[
                                          innerFieldLevel1
                                        ]
                                      }
                                      options={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["options"]
                                      }
                                      onChange={(e) =>
                                        handleBtnPres(
                                          e,
                                          field,
                                          innerFieldLevel1
                                        )
                                      }
                                    />
                                  );
                                } else {
                                  return (
                                    <TextField
                                      key={index}
                                      placeholder={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["label"]
                                      }
                                      value={
                                        fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["value"]
                                      }
                                      onChange={(e) =>
                                        handleBtnPres(
                                          e,
                                          field,
                                          innerFieldLevel1
                                        )
                                      }
                                      error={
                                        connectedAccountsObjectErrors?.[
                                          value
                                        ]?.["fields"]?.[field]?.["attribute"]?.[
                                          innerFieldLevel1
                                        ]
                                      }
                                    />
                                  );
                                }
                              }
                            )}
                          </FormLayout.Group>
                        </FormLayout>
                      )}
                      {fields[field]["label"] === "Package Type" && (
                        <>
                          <FormLayout>
                            <FormLayout.Group>
                              <Select
                                value={fields[field]["packageTypeValue"]}
                                options={fields[field]["options"]}
                                onChange={(e) => {
                                  handleBtnPres(e, field);
                                }}
                              />
                            </FormLayout.Group>
                          </FormLayout>
                        </>
                      )}
                      {fields[field]["label"] === "Shopify Warehouses" && (
                        <FormLayout>
                          <FormLayout.Group>
                            <ChoiceList
                              allowMultiple
                              choices={fields[field]["options"]}
                              selected={fields[field]["shopifyWarehouseValue"]}
                              onChange={(e) => {
                                let temp = { ...connectedAccountsObject };
                                // console.log('ji', temp[account]["fields"][field]);
                                temp[account]["fields"][field][
                                  "shopifyWarehouseValue"
                                ] = e;
                                setconnectedAccountsObject(temp);
                              }}
                            />
                          </FormLayout.Group>
                        </FormLayout>
                      )}
                      {/* {currencyLoader && field === "currencyConversion" ? (
                      <SkeletonBodyText lines={2} />
                    ) : (
                      fields[field]["label"] === "Currency Converter" &&
                      fields[field]["enable"] === "yes" && (
                        <>
                          <br />
                          <FormLayout>
                            <FormLayout.Group condensed>
                              <TextField
                                placeholder={
                                  fields[field]["attribute"]["shopifyCurrency"][
                                    "label"
                                  ]
                                }
                                prefix={
                                  fields[field]["attribute"]["shopifyCurrency"][
                                    "shopifyCurrencyName"
                                  ]
                                }
                                value={String(
                                  fields[field]["attribute"]["shopifyCurrency"][
                                    "shopifyCurrencyValue"
                                  ]
                                )}
                                disabled
                                type="number"
                                onChange={(value) =>
                                  currencyHandler(
                                    value,
                                    field,
                                    "attribute",
                                    "shopifyCurrency",
                                    "shopifyCurrencyValue"
                                  )
                                }
                              />
                              <TextField
                                placeholder={
                                  fields[field]["attribute"]["ebayCurrency"][
                                    "label"
                                  ]
                                }
                                prefix={
                                  fields[field]["attribute"]["ebayCurrency"][
                                    "ebayCurrencyName"
                                  ]
                                }
                                value={String(
                                  fields[field]["attribute"]["ebayCurrency"][
                                    "ebayCurrencyValue"
                                  ]
                                )}
                                type="number"
                                onChange={(value) =>
                                  currencyHandler(
                                    value,
                                    field,
                                    "attribute",
                                    "ebayCurrency",
                                    "ebayCurrencyValue"
                                  )
                                }
                                error={
                                  connectedAccountsObjectErrors?.[account]?.[
                                    "fields"
                                  ]?.[field]?.["attribute"]?.["ebayCurrency"]?.[
                                    "ebayCurrencyValue"
                                  ]
                                }
                              />
                              <Button onClick={() => getCurrencyFunc()}>
                                <Icon source={RefreshMinor} color="base" />
                              </Button>
                            </FormLayout.Group>
                          </FormLayout>
                        </>
                      )
                    )} */}
                      {fields[field]["label"] === "Match products from eBay" &&
                        fields[field]["enable"] === "yes" && (
                          <Card.Section
                            actions={{
                              content: (
                                <Button
                                  onClick={(e) => {
                                    handleAdd("attributeMapping");
                                  }}
                                  disabled={
                                    fields?.[field]?.["attributeMapping"]
                                      ?.length === 2
                                  }
                                >
                                  Add Attribute
                                </Button>
                              ),
                            }}
                          >
                            <FormLayout>
                              {fields?.[field]?.["attributeMapping"] &&
                                Object.keys(
                                  fields?.[field]?.["attributeMapping"]
                                ).map((preferenceKey, index) => {
                                  return (
                                    <Card.Section>
                                      <Card
                                        actions={{
                                          content: "Remove",
                                          onAction: (e) => {
                                            handleRemove(
                                              "attributeMapping",
                                              index
                                            );
                                          },
                                          disabled:
                                            fields?.[field]?.[
                                              "attributeMapping"
                                            ].length < 2,
                                        }}
                                      >
                                        <Card.Section
                                          title={`Preference # ${index + 1}`}
                                        >
                                          <Stack
                                            vertical={false}
                                            distribution={"fillEvenly"}
                                          >
                                            <Select
                                              placeholder={"Select..."}
                                              label={`eBay attribute`}
                                              options={matchfromEbayOptions}
                                              onChange={(e) => {
                                                let test = {
                                                  ...connectedAccountsObject,
                                                };
                                                test[account][
                                                  "fields"
                                                ].match_from_ebay.attributeMapping[
                                                  index
                                                ]["ebay_attribute"] = e;
                                                setconnectedAccountsObject(
                                                  test
                                                );
                                              }}
                                              value={
                                                fields[field][
                                                  "attributeMapping"
                                                ][preferenceKey][
                                                  "ebay_attribute"
                                                ]
                                              }
                                            />
                                            <Select
                                              placeholder={"Select..."}
                                              label={`Shopify attribute`}
                                              options={matchfromShopifyOptions}
                                              onChange={(e) => {
                                                let test = {
                                                  ...connectedAccountsObject,
                                                };
                                                test[account][
                                                  "fields"
                                                ].match_from_ebay.attributeMapping[
                                                  index
                                                ]["shopify_attribute"] = e;
                                                setconnectedAccountsObject(
                                                  test
                                                );
                                              }}
                                              value={
                                                fields[field][
                                                  "attributeMapping"
                                                ][preferenceKey][
                                                  "shopify_attribute"
                                                ]
                                              }
                                            />
                                          </Stack>
                                        </Card.Section>
                                      </Card>
                                    </Card.Section>
                                  );
                                })}
                            </FormLayout>
                          </Card.Section>
                        )}
                    </Stack>
                  </FormLayout>
                  {fields[field]["label"] === "Product Syncing" &&
                    fields[field]["enable"] === "yes" && (
                      <Card.Section
                      // title="Fields"
                      >
                        <Stack>
                          {Object.keys(fields[field]["attribute"]).map(
                            (innerFieldLevel1, index) => {
                              return (
                                <Checkbox
                                  key={index}
                                  label={
                                    fields[field]["attribute"][
                                      innerFieldLevel1
                                    ]["label"]
                                  }
                                  checked={
                                    fields[field]["attribute"][
                                      innerFieldLevel1
                                    ]["value"] === "yes"
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    handleBtnPres(e, field, innerFieldLevel1);
                                    // let parsedValue = e ? "yes" : "no";
                                    // let temp = { ...optionsVar };
                                    // temp["autoProductSync"]["attribute"][field][
                                    //   "value"
                                    // ] = parsedValue;
                                    // setOptionsVar(temp);
                                  }}
                                />
                              );
                            }
                          )}
                        </Stack>
                      </Card.Section>
                    )}
                </Card>
              </Layout.AnnotatedSection>
            )}
          </Layout>
        );
      })}
    </FormLayout>
  );
};

export default AccountTabContentConfig;
