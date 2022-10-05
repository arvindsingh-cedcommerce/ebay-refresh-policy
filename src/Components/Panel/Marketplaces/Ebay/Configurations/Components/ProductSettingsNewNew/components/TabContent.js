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
import { currencyFunc } from "../../../../../../../../APIrequests/ConfigurationAPI";
import { currencyConvertorURL } from "../../../../../../../../URLs/ConfigurationURL";
import { countryArray, stateArray } from "../Helper/sampleData";
const { Text, Title } = Typography;

let matchfromEbayOptions = [
  { label: "Title", value: "Title" },
  { label: "Sku", value: "SKU" },
];

let matchfromShopifyOptions = [
  { label: "Title", value: "title" },
  { label: "Sku", value: "sku" },
];

const salesTaxDetailsOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const businessSellerOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const restrictedToBusinessOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const yesNoButtonList = [
  "autoProductSync",
  "autoEndProduct",
  "autoListProduct",
  "match_from_ebay",
];

const TabContent = ({
  account,
  content,
  connectedAccountsObject,
  setconnectedAccountsObject,
  errorsData,
  setErrorsData,
}) => {
  let { fields, value } = content;
  const [currencyLoader, setCurrencyLoader] = useState(false);
  const handleBtnPres = (value, field, innerField) => {
    let temp = { ...connectedAccountsObject };
    if (innerField) {
      temp[account]["fields"][field][innerField] = value;
    } else {
      if (field === "match_from_ebay" && value) {
        temp[account]["fields"][field]["value"] = [
          {
            shopify_attribute: "title",
            ebay_attribute: "Title",
          },
        ];
      } else temp[account]["fields"][field]["value"] = value;
    }
    setconnectedAccountsObject(temp);
  };

  const matchFromEbayHandler = (e, field, index, attributeType) => {
    let temp = { ...connectedAccountsObject };
    temp[account]["fields"][field]["value"][index][attributeType] = e;
    setconnectedAccountsObject(temp);
  };

  const getMatchProductsStructure = (field) => {
    return (
      <React.Fragment>
        <br />
        <Card
          actions={[
            {
              content: (
                <Button
                  onClick={(e) => {
                    let tempAccounts = {
                      ...connectedAccountsObject,
                    };
                    tempAccounts[account]["fields"][field]["value"].push({
                      shopify_attribute: "",
                      ebay_attribute: "",
                    });
                    setconnectedAccountsObject(tempAccounts);
                  }}
                  disabled={fields?.[field]?.["value"]?.length === 2}
                >
                  Add Attribute
                </Button>
              ),
            },
          ]}
        >
          {fields[field]["value"].map((mappingData, index) => {
            const { shopify_attribute, ebay_attribute } = mappingData;
            return (
              <Card.Section
                title={`#${index + 1}`}
                actions={[
                  {
                    content: "Delete",
                    onAction: (e) => {
                      let tempAccounts = { ...connectedAccountsObject };
                      tempAccounts[account]["fields"][field]["value"].splice(
                        index,
                        1
                      );
                      setconnectedAccountsObject(tempAccounts);
                    },
                    disabled: fields[field]["value"].length < 2,
                  },
                ]}
              >
                <FormLayout>
                  <FormLayout.Group>
                    <Select
                      label="Shopify Reason"
                      value={shopify_attribute}
                      options={matchfromShopifyOptions}
                      onChange={(e) =>
                        matchFromEbayHandler(
                          e,
                          field,
                          index,
                          "shopify_attribute"
                        )
                      }
                    />
                    <Select
                      label="eBay Reason"
                      value={ebay_attribute}
                      options={matchfromEbayOptions}
                      onChange={(e) =>
                        matchFromEbayHandler(e, field, index, "ebay_attribute")
                      }
                    />
                  </FormLayout.Group>
                </FormLayout>
              </Card.Section>
            );
          })}
        </Card>
      </React.Fragment>
    );
  };

  const getAttributeLabel = (attribute) => {
    let label = "";
    switch (attribute) {
      case "title":
        label = "Title";
        break;
      case "description":
        label = "Description";
        break;
      case "main_image":
        label = "Main Image";
        break;
      case "weight":
        label = "Weight";
        break;
      case "item_specifics":
        label = "Item Specifics";
        break;
      case "variation_pictures":
        label = "Variation Pictures";
        break;
      case "quantity":
        label = "Quantity";
        break;
      case "price":
        label = "Price";
        break;
      default:
        break;
    }
    return label;
  };

  const getCurrencyFunc = async () => {
    setCurrencyLoader(true);
    let temp = { ...connectedAccountsObject };
    let { success, data: currencyData } = await currencyFunc(
      currencyConvertorURL,
      {
        site_id: temp[account]["siteId"],
      }
    );
    if (success) {
      const { source, rate } = currencyData;
      temp[account]["fields"]["currencyConversion"]["shopifyCurrencyName"] =
        source["shopify"];
      temp[account]["fields"]["currencyConversion"]["shopifyCurrencyValue"] =
        source["amount"];
      temp[account]["fields"]["currencyConversion"]["ebayCurrencyName"] =
        source["ebay"];
      temp[account]["fields"]["currencyConversion"]["ebayCurrencyValue"] = rate;
    }
    // else if (currencyData === "Both Currency Are Same") {
    //   temp[account]["fields"]["currencyConversion"]["shopifyCurrencyName"] =
    //     "same";
    //   temp[account]["fields"]["currencyConversion"]["shopifyCurrencyValue"] =
    //     "same";
    //   temp[account]["fields"]["currencyConversion"]["ebayCurrencyName"] =
    //     "same";
    //   temp[account]["fields"]["currencyConversion"]["ebayCurrencyValue"] =
    //     "same";
    // }
    if (
      errorsData?.[account]?.["fields"]?.["currencyConversion"]?.[
        "ebayCurrencyValue"
      ] &&
      temp[account]["fields"]["currencyConversion"]["ebayCurrencyValue"]
    ) {
      let tempErrorData = { ...errorsData };
      tempErrorData[account]["fields"]["currencyConversion"][
        "ebayCurrencyValue"
      ] = false;
      setErrorsData(tempErrorData);
    }
    setconnectedAccountsObject(temp);
    setCurrencyLoader(false);
  };

  useEffect(() => {
    const {
      shopifyCurrencyName,
      shopifyCurrencyValue,
      ebayCurrencyName,
      ebayCurrencyValue,
    } = connectedAccountsObject[account]["fields"]["currencyConversion"];
    if (!shopifyCurrencyName || !shopifyCurrencyValue || !ebayCurrencyName) {
      getCurrencyFunc();
    }
  }, [connectedAccountsObject]);

  const removeErrors = (value, field, innerField) => {
    let temp = { ...errorsData };
    if (value && innerField) {
      if (temp?.[account]?.["fields"]?.[field]?.[innerField]) {
        temp[account]["fields"][field][innerField] = false;
        setErrorsData(temp);
      }
    }
  };

  return (
    <FormLayout>
      {Object.keys(fields).map((field, outerIndex) => {
        return (
          <Layout key={outerIndex}>
            {field === "currencyConversion" && currencyLoader && (
              <Layout.AnnotatedSection
                id={field}
                title={fields[field]["label"]}
                description={fields[field]["description"]}
              >
                <Card sectioned>
                  <FormLayout>
                    <SkeletonBodyText lines={2} />
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            )}
            {field === "currencyConversion" &&
              !currencyLoader &&
              fields[field]["shopifyCurrencyName"] !==
                fields[field]["ebayCurrencyName"] && (
                <Layout.AnnotatedSection
                  id={field}
                  title={fields[field]["label"]}
                  description={fields[field]["description"]}
                >
                  <Card sectioned>
                    <FormLayout>
                      <Stack distribution="fill">
                        <TextField
                          placeholder={"Shopify Currency"}
                          prefix={fields[field]["shopifyCurrencyName"]}
                          value={String(fields[field]["shopifyCurrencyValue"])}
                          disabled
                          type="number"
                        />
                        <TextField
                          placeholder={"eBay Currency"}
                          prefix={fields[field]["ebayCurrencyName"]}
                          value={String(fields[field]["ebayCurrencyValue"])}
                          type="number"
                          onChange={(e) => {
                            let temp = { ...connectedAccountsObject };
                            temp[account]["fields"][field][
                              "ebayCurrencyValue"
                            ] = e;
                            if (
                              e &&
                              errorsData?.[account]?.["fields"]?.[
                                "currencyConversion"
                              ]?.["ebayCurrencyValue"]
                            ) {
                              let tempErrorData = { ...errorsData };
                              tempErrorData[account]["fields"][
                                "currencyConversion"
                              ]["ebayCurrencyValue"] = false;
                              setErrorsData(tempErrorData);
                            }
                            setconnectedAccountsObject(temp);
                          }}
                          error={
                            errorsData?.[account]?.["fields"]?.[field]?.[
                              "ebayCurrencyValue"
                            ]
                          }
                        />
                        <Button onClick={() => getCurrencyFunc()}>
                          <Icon source={RefreshMinor} color="base" />
                        </Button>
                      </Stack>
                    </FormLayout>
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
                      {yesNoButtonList.includes(field) && (
                        <ButtonGroup segmented>
                          <Button
                            primary={fields[field]["value"]}
                            pressed={fields[field]["value"]}
                            onClick={(e) => handleBtnPres(true, field)}
                          >
                            Yes
                          </Button>
                          <Button
                            primary={!fields[field]["value"]}
                            pressed={!fields[field]["value"]}
                            onClick={(e) => handleBtnPres(false, field)}
                          >
                            No
                          </Button>
                        </ButtonGroup>
                      )}
                      {field === "autoProductSync" && fields[field]["value"] && (
                        <React.Fragment>
                          <br />
                          <Stack spacing="tight" distribution="fill">
                            {Object.keys(fields[field]["attributes"]).map(
                              (attribute, index) => {
                                return (
                                  <Checkbox
                                    label={getAttributeLabel(attribute)}
                                    checked={
                                      fields[field]["attributes"][attribute]
                                    }
                                    onChange={(e) => {
                                      let temp = { ...connectedAccountsObject };
                                      temp[account]["fields"][field][
                                        "attributes"
                                      ][attribute] = e;
                                      setconnectedAccountsObject(temp);
                                    }}
                                  />
                                );
                              }
                            )}
                          </Stack>
                        </React.Fragment>
                      )}
                      {field === "salesTaxDetails" && (
                        <FormLayout>
                          <Select
                            label="Use eBay tax rate table"
                            value={fields[field]["useEbayTaxRateTable"]}
                            onChange={() =>
                              handleBtnPres(
                                !fields[field]["useEbayTaxRateTable"],
                                field,
                                "useEbayTaxRateTable"
                              )
                            }
                            options={salesTaxDetailsOptions}
                          />
                          {!fields[field]["useEbayTaxRateTable"] && (
                            <Select
                              label="State"
                              value={fields[field]["state"]}
                              onChange={(value) =>
                                handleBtnPres(value, field, "state")
                              }
                              options={stateArray}
                            />
                          )}
                          {!fields[field]["useEbayTaxRateTable"] && (
                            <TextField
                              label="Tax Percentage"
                              type="number"
                              value={fields[field]["taxPercentage"]}
                              onChange={(value) =>
                                handleBtnPres(value, field, "taxPercentage")
                              }
                            />
                          )}
                          {!fields[field]["useEbayTaxRateTable"] && (
                            <Checkbox
                              checked={
                                fields[field][
                                  "alsoApplyToShippingAndHandlingCosts"
                                ]
                              }
                              label="Also apply to shipping and handling costs"
                              onChange={(value) =>
                                handleBtnPres(
                                  value,
                                  field,
                                  "alsoApplyToShippingAndHandlingCosts"
                                )
                              }
                            />
                          )}
                        </FormLayout>
                      )}
                      {field === "vehicleDetails" && (
                        <FormLayout>
                          <TextField
                            label="Vehicle Identification Number"
                            value={fields[field]["vehicleIdentificationNumber"]}
                            onChange={(value) =>
                              handleBtnPres(
                                value,
                                field,
                                "vehicleIdentificationNumber"
                              )
                            }
                          />
                          <TextField
                            label="Vehicle Registration Mark"
                            value={fields[field]["restrictedToBusiness"]}
                            onChange={(value) =>
                              handleBtnPres(
                                value,
                                field,
                                "restrictedToBusiness"
                              )
                            }
                          />
                        </FormLayout>
                      )}
                      {field === "vatDetails" && (
                        <FormLayout>
                          <FormLayout.Group>
                            <Select
                              label="Business seller"
                              value={fields[field]["businessSeller"]}
                              onChange={() =>
                                handleBtnPres(
                                  !fields[field]["businessSeller"],
                                  field,
                                  "businessSeller"
                                )
                              }
                              options={businessSellerOptions}
                            />
                            <Select
                              label="Restricted to business"
                              value={fields[field]["restrictedToBusiness"]}
                              onChange={() =>
                                handleBtnPres(
                                  !fields[field]["restrictedToBusiness"],
                                  field,
                                  "restrictedToBusiness"
                                )
                              }
                              options={restrictedToBusinessOptions}
                            />
                            <TextField
                              label="VAT Percentage"
                              value={fields[field]["vatPercentage"]}
                              onChange={(value) =>
                                {
                                if(  errorsData?.[account]?.["fields"]?.[field]?.[
                                  "vatPercentage"
                                ] && (value>=0 && value<=30))
                                  {
                                    removeErrors(value, field, "vatPercentage");
                                  }
                                handleBtnPres(value, field, "vatPercentage")
                                }
                              }
                              type="number"
                              error={
                                errorsData?.[account]?.["fields"]?.[field]?.[
                                  "vatPercentage"
                                ]
                              ?"Value should be greater than or equal to 0 and less than or equal to 30":false}
                            />
                          </FormLayout.Group>
                        </FormLayout>
                      )}
                      {field === "itemLocation" && (
                        <FormLayout>
                          <FormLayout.Group>
                            <Select
                              value={fields[field]["country"]}
                              onChange={(value) => {
                                removeErrors(value, field, "country");
                                handleBtnPres(value, field, "country");
                              }}
                              options={countryArray}
                              error={
                                errorsData?.[account]?.["fields"]?.[field]?.[
                                  "country"
                                ]
                              }
                            />
                            <TextField
                              placeholder="Zip Code"
                              value={fields[field]["zipcode"]}
                              onChange={(value) => {
                                removeErrors(value, field, "zipcode");
                                handleBtnPres(value, field, "zipcode");
                              }}
                              error={
                                errorsData?.[account]?.["fields"]?.[field]?.[
                                  "zipcode"
                                ]
                              }
                            />
                            <TextField
                              placeholder="Location"
                              value={fields[field]["location"]}
                              onChange={(value) => {
                                removeErrors(value, field, "location");
                                handleBtnPres(value, field, "location");
                              }}
                              error={
                                errorsData?.[account]?.["fields"]?.[field]?.[
                                  "location"
                                ]
                              }
                            />
                          </FormLayout.Group>
                        </FormLayout>
                      )}
                      {field === "shopifyWarehouses" && (
                        <Stack vertical spacing="extraTight">
                          <ChoiceList
                            allowMultiple
                            choices={fields[field]["options"]}
                            selected={fields[field]["value"]}
                            onChange={(e) => {
                              let temp = { ...connectedAccountsObject };
                              if (e.length == 1) {
                                temp[account]["fields"][field]["options"] =
                                  connectedAccountsObject[account]["fields"][
                                    field
                                  ]["options"].map((option) => {
                                    if (option["value"] == e[0]) {
                                      return { ...option, disabled: true };
                                    } else {
                                      return { ...option, disabled: false };
                                    }
                                  });
                              } else {
                                temp[account]["fields"][field]["options"] =
                                  connectedAccountsObject[account]["fields"][
                                    field
                                  ]["options"].map((option) => {
                                    return { ...option, disabled: false };
                                  });
                              }
                              temp[account]["fields"][field]["value"] = e;
                              setconnectedAccountsObject(temp);
                            }}
                          />
                        </Stack>
                      )}
                      {/* {field === "currencyConversion" && currencyLoader && (
                        <SkeletonBodyText lines={2} />
                      )}
                      {field === "currencyConversion" && !currencyLoader &&
                        fields[field]["shopifyCurrencyName"] !== fields[field]["ebayCurrencyName"] && (
                        <Stack distribution="fill">
                          <TextField
                            placeholder={"Shopify Currency"}
                            prefix={fields[field]["shopifyCurrencyName"]}
                            value={String(
                              fields[field]["shopifyCurrencyValue"]
                            )}
                            disabled
                            type="number"
                          />
                          <TextField
                            placeholder={"eBay Currency"}
                            prefix={fields[field]["ebayCurrencyName"]}
                            value={String(fields[field]["ebayCurrencyValue"])}
                            type="number"
                            onChange={(e) => {
                              let temp = { ...connectedAccountsObject };
                              temp[account]["fields"][field][
                                "ebayCurrencyValue"
                              ] = e;
                              if (
                                e &&
                                errorsData?.[account]?.["fields"]?.[
                                  "currencyConversion"
                                ]?.["ebayCurrencyValue"]
                              ) {
                                let tempErrorData = { ...errorsData };
                                tempErrorData[account]["fields"][
                                  "currencyConversion"
                                ]["ebayCurrencyValue"] = false;
                                setErrorsData(tempErrorData);
                              }
                              setconnectedAccountsObject(temp);
                            }}
                            error={
                              errorsData?.[account]?.["fields"]?.[field]?.[
                                "ebayCurrencyValue"
                              ]
                            }
                          />
                          <Button onClick={() => getCurrencyFunc()}>
                            <Icon source={RefreshMinor} color="base" />
                          </Button>
                        </Stack>
                      )} */}
                      {field === "match_from_ebay" &&
                        fields[field]["value"] &&
                        getMatchProductsStructure(field)}
                    </Stack>
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            )}
          </Layout>
        );
      })}
    </FormLayout>
  );
};

export default TabContent;
