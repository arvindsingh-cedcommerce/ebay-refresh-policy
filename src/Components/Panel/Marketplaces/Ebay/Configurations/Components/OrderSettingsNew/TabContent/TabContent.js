import {
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
import { Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Title } = Typography;
const yesNoButtonList = [
  "includeTax",
  "syncWithoutProductdetails",
  "useEbayCustomerDetails",
  "shipmentSync",
];
const shopifyOrderNoteTagsNameList = [
  "setOrderName",
  "setOrderNote",
  "setOrderTags",
];

const inventoryBehavioursettingOptions = [
  {
    label: "Decrement Obeying Policy",
    value: "decrement_obeying_policy",
  },
  {
    label: "Decrement Ignoring Policy",
    value: "decrement_ignoring_policy",
  },
  {
    label: "Bypass",
    value: "bypass",
  },
];
const shopifyOrderNoteTagsNameOptions = [
  {
    label: "eBay Order Id",
    value: "ebayOrderId",
  },
  {
    label: "Set default value",
    value: "default",
  },
  {
    label: "Set custom value",
    value: "custom",
  },
];
const shopifyOrderNoteTagsNameCustomAttributeOptions = [
  {
    label: "Please Select...",
    value: "",
  },
  {
    label: "eBay Order Id",
    value: "ebay_order_id",
  },
];
const OrderCancellationReasonShopifyOptions = [
  { label: "Please Select", value: "" },
  { label: "Customer", value: "Customer" },
  { label: "Inventory", value: "Inventory" },
  { label: "Fraud", value: "Fraud" },
  { label: "Declined", value: "Declined" },
  { label: "Other", value: "Other" },
];
const OrderCancellationReasonEbayOptions = [
  { label: "Please Select", value: "" },
  { label: "ADDRESS_ISSUES", value: "ADDRESS_ISSUES" },
  { label: "BUYER_ASKED_CANCEL", value: "BUYER_ASKED_CANCEL" },
  { label: "FOUND_CHEAPER_PRICE", value: "FOUND_CHEAPER_PRICE" },
  { label: "ORDER_MISTAKE", value: "ORDER_MISTAKE" },
  { label: "ORDER_UNPAID", value: "ORDER_UNPAID" },
  {
    label: "OUT_OF_STOCK_OR_CANNOT_FULFILL",
    value: "OUT_OF_STOCK_OR_CANNOT_FULFILL",
  },
  { label: "UNKNOWN", value: "UNKNOWN" },
  { label: "WONT_ARRIVE_IN_TIME", value: "WONT_ARRIVE_IN_TIME" },
  { label: "WRONG_PAYMENT_METHOD", value: "WRONG_PAYMENT_METHOD" },
  { label: "WRONG_SHIPPING_ADDRESS", value: "WRONG_SHIPPING_ADDRESS" },
  { label: "WRONG_SHIPPING_METHOD", value: "WRONG_SHIPPING_METHOD" },
];

const TabContent = ({
  account,
  content,
  connectedAccountsObject,
  setconnectedAccountsObject,
  errorsData,
  setErrorsData,
}) => {
  let { fields } = content;

  const [
    shopifyOrderNameCustomAttributeValue,
    setShopifyOrderNameCustomAttributeValue,
  ] = useState("");
  const [
    shopifyOrderNoteCustomAttributeValue,
    setShopifyOrderNoteCustomAttributeValue,
  ] = useState("");
  const [
    shopifyOrderTagsCustomAttributeValue,
    setShopifyOrderTagsCustomAttributeValue,
  ] = useState("");

  const handleBtnPres = (value, field, innerField) => {
    let temp = { ...connectedAccountsObject };
    if (innerField) {
      if (innerField === "mappingOfShippingCarrier") {
        temp[account]["fields"][field]["mappingOfShippingCarrier"] = value
          ? [
              {
                shopifyAttribute: "",
                ebayAttribute: "",
              },
            ]
          : value;
      } else temp[account]["fields"][field][innerField] = value;
    } else temp[account]["fields"][field]["value"] = value;
    setconnectedAccountsObject(temp);
  };

  const getCustomStructure = (field) => {
    return (
      <Stack vertical={false}>
        <Stack.Item>
          <Select
            label="Choose to add attribute"
            options={shopifyOrderNoteTagsNameCustomAttributeOptions}
            value={
              field === "setOrderName"
                ? shopifyOrderNameCustomAttributeValue
                : field === "setOrderNote"
                ? shopifyOrderNoteCustomAttributeValue
                : shopifyOrderTagsCustomAttributeValue
            }
            onChange={(e) => {
              let tempAccounts = { ...connectedAccountsObject };
              if (e) {
                tempAccounts[account]["fields"][field][
                  "customValue"
                ] += `{{${e}}}`;
                setconnectedAccountsObject(tempAccounts);
              }
              if (field === "setOrderName")
                setShopifyOrderNameCustomAttributeValue(e);
              else if (field === "setOrderNote")
                setShopifyOrderNoteCustomAttributeValue(e);
              else setShopifyOrderTagsCustomAttributeValue(e);
              // if (tempAccounts[account]["fields"][field]["customValue"]) {
              //   let tempErrorData = { ...errorsData };
              //   tempErrorData[account]["fields"][field]["customValue"] = false;
              //   setErrorsData(tempErrorData);
              // }
            }}
            // error={errorsData?.[account]?.["fields"]?.[field]?.["customValue"]}
          />
        </Stack.Item>
        <Stack.Item fill>
          <TextField
            label={"Value"}
            value={fields[field]["customValue"]}
            onChange={(e) => {
              let tempAccounts = { ...connectedAccountsObject };
              tempAccounts[account]["fields"][field]["customValue"] = e;
              if (
                tempAccounts?.[account]?.["fields"]?.[field]?.["customValue"]
              ) {
                let tempErrorData = { ...errorsData };
                if (
                  tempErrorData?.[account]?.["fields"]?.[field]?.["customValue"]
                ) {
                  tempErrorData[account]["fields"][field][
                    "customValue"
                  ] = false;
                  setErrorsData(tempErrorData);
                }
              }
              setconnectedAccountsObject(tempAccounts);
            }}
            error={errorsData?.[account]?.["fields"]?.[field]?.["customValue"]}
          />
        </Stack.Item>
      </Stack>
    );
  };

  const shippingCarrierDataHandler = (value, field, index, attributeType) => {
    let tempAccounts = { ...connectedAccountsObject };
    let tempErrorData = { ...errorsData };
    tempAccounts[account]["fields"][field]["mappingOfShippingCarrier"][index][
      attributeType
    ] = value;
    if (value) {
      if (
        tempErrorData?.[account]?.["fields"]?.[field]?.[
          "mappingOfShippingCarrier"
        ]?.[index]?.[attributeType]
      ) {
        tempErrorData[account]["fields"][field]["mappingOfShippingCarrier"][
          index
        ][attributeType] = false;
        setErrorsData(tempErrorData);
      }
    }
    setconnectedAccountsObject(tempAccounts);
  };

  const getShippingCarrierStructure = (field) => {
    return (
      <Card>
        {fields[field]["mappingOfShippingCarrier"].map((mappingData, index) => {
          return (
            <Card.Section
              title={`#${index + 1}`}
              actions={[
                {
                  content: "Delete",
                  onAction: (e) => {
                    let tempAccounts = { ...connectedAccountsObject };
                    tempAccounts[account]["fields"][field][
                      "mappingOfShippingCarrier"
                    ].splice(index, 1);
                    setconnectedAccountsObject(tempAccounts);
                  },
                  disabled:
                    fields[field]["mappingOfShippingCarrier"].length < 2,
                },
              ]}
            >
              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    label="Shopify Carrier"
                    value={mappingData["shopifyAttribute"]}
                    onChange={(value) =>
                      shippingCarrierDataHandler(
                        value,
                        field,
                        index,
                        "shopifyAttribute"
                      )
                    }
                    error={
                      errorsData?.[account]?.["fields"]?.[field]?.[
                        "mappingOfShippingCarrier"
                      ]?.[index]?.["shopifyAttribute"]
                    }
                  />
                  <TextField
                    label="eBay Carrier"
                    value={mappingData["ebayAttribute"]}
                    onChange={(value) =>
                      shippingCarrierDataHandler(
                        value,
                        field,
                        index,
                        "ebayAttribute"
                      )
                    }
                    error={
                      errorsData?.[account]?.["fields"]?.[field]?.[
                        "mappingOfShippingCarrier"
                      ]?.[index]?.["ebayAttribute"]
                    }
                  />
                </FormLayout.Group>
              </FormLayout>
            </Card.Section>
          );
        })}
      </Card>
    );
  };

  const orderCancelationReasonMappingDataHandler = (
    value,
    field,
    index,
    attributeType
  ) => {
    let tempAccounts = { ...connectedAccountsObject };
    let tempErrorData = { ...errorsData };

    tempAccounts[account]["fields"][field]["value"][index][attributeType] =
      value;
    if (value) {
      if (
        tempErrorData?.[account]?.["fields"]?.[field]?.["value"]?.[index]?.[
          attributeType
        ]
      ) {
        tempErrorData[account]["fields"][field]["value"][index][
          attributeType
        ] = false;
        setErrorsData(tempErrorData);
      }
    }
    setconnectedAccountsObject(tempAccounts);
  };

  const getOrderCancelationReasonStruture = (field) => {
    return (
      <Card
        actions={[
          {
            content: <Button>Add Reason</Button>,
            onAction: (e) => {
              let tempAccounts = {
                ...connectedAccountsObject,
              };
              tempAccounts[account]["fields"][field]["value"].push({
                shopifyAttribute: "",
                ebayAttribute: "",
              });
              setconnectedAccountsObject(tempAccounts);
            },
          },
        ]}
      >
        {fields[field]["value"].map((mappingData, index) => {
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
                    value={mappingData["shopifyAttribute"]}
                    options={OrderCancellationReasonShopifyOptions}
                    onChange={(value) =>
                      orderCancelationReasonMappingDataHandler(
                        value,
                        field,
                        index,
                        "shopifyAttribute"
                      )
                    }
                    error={
                      errorsData?.[account]?.["fields"]?.[field]?.["value"]?.[
                        index
                      ]?.["shopifyAttribute"]
                    }
                  />
                  <Select
                    label="eBay Reason"
                    value={mappingData["ebayAttribute"]}
                    options={OrderCancellationReasonEbayOptions}
                    onChange={(value) =>
                      orderCancelationReasonMappingDataHandler(
                        value,
                        field,
                        index,
                        "ebayAttribute"
                      )
                    }
                    error={
                      errorsData?.[account]?.["fields"]?.[field]?.["value"]?.[
                        index
                      ]?.["ebayAttribute"]
                    }
                  />
                </FormLayout.Group>
              </FormLayout>
            </Card.Section>
          );
        })}
      </Card>
    );
  };

  return (
    <Card
      sectioned
      title={<Title level={4}>Manage Order</Title>}
      actions={[
        {
          content: (
            <ButtonGroup segmented>
              <Button
                primary={fields["autoOrderSync"]["value"]}
                pressed={fields["autoOrderSync"]["value"]}
                onClick={(e) => handleBtnPres(true, "autoOrderSync")}
              >
                Yes
              </Button>
              <Button
                primary={!fields["autoOrderSync"]["value"]}
                pressed={!fields["autoOrderSync"]["value"]}
                onClick={(e) => handleBtnPres(false, "autoOrderSync")}
              >
                No
              </Button>
            </ButtonGroup>
          ),
        },
      ]}
    >
      <FormLayout>
        {fields["autoOrderSync"]["value"] &&
          Object.keys(fields).map((field, outerIndex) => {
            if (field !== "autoOrderSync") {
              return (
                <Layout key={outerIndex}>
                  <Layout.AnnotatedSection
                    id={field}
                    title={fields[field]["label"]}
                    description={fields[field]["description"]}
                  >
                    <Card sectioned>
                      <Stack vertical>
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
                        {field === "inventoryBehavioursetting" && (
                          <Select
                            value={fields[field]["value"]}
                            onChange={(e) => handleBtnPres(e, field)}
                            options={inventoryBehavioursettingOptions}
                          />
                        )}
                        {shopifyOrderNoteTagsNameList.includes(field) && (
                          <Stack vertical spacing="tight">
                            <Select
                              value={fields[field]["value"]}
                              onChange={(e) => handleBtnPres(e, field)}
                              options={shopifyOrderNoteTagsNameOptions}
                            />
                            {fields[field]["value"] === "custom" &&
                              getCustomStructure(field)}
                          </Stack>
                        )}
                        {field === "useEbayCustomerDetails" &&
                          !fields[field]["value"] && (
                            <FormLayout>
                              <TextField
                                type="email"
                                label="Email"
                                value={fields[field]["email"]}
                                onChange={(value) =>
                                  handleBtnPres(value, field, "email")
                                }
                                autoComplete="email"
                                error={
                                  errorsData?.[account]?.["fields"]?.[field]?.[
                                    "email"
                                  ]
                                }
                              />
                              {/* <TextField
                                label="Name"
                                value={fields[field]["name"]}
                                onChange={(value) =>
                                  handleBtnPres(value, field, "name")
                                }
                                autoComplete="off"
                                error={
                                  errorsData?.[account]?.["fields"]?.[field]?.[
                                    "name"
                                  ]
                                }
                              /> */}
                            </FormLayout>
                          )}
                        {field === "shipmentSync" && fields[field]["value"] && (
                          <FormLayout>
                            <Checkbox
                              label="Sync Tracking Details"
                              checked={fields[field]["syncTrackingDetails"]}
                              onChange={(e) =>
                                handleBtnPres(e, field, "syncTrackingDetails")
                              }
                            />
                            <Stack distribution="equalSpacing">
                              <Checkbox
                                label="Mapping of Shipping Carrier"
                                checked={
                                  Array.isArray(
                                    fields[field]["mappingOfShippingCarrier"]
                                  ) &&
                                  fields[field]["mappingOfShippingCarrier"]
                                    .length
                                }
                                onChange={(e) =>
                                  handleBtnPres(
                                    e,
                                    field,
                                    "mappingOfShippingCarrier"
                                  )
                                }
                              />
                              {fields[field]["mappingOfShippingCarrier"] && (
                                <Button
                                  onClick={(e) => {
                                    let tempAccounts = {
                                      ...connectedAccountsObject,
                                    };
                                    tempAccounts[account]["fields"][field][
                                      "mappingOfShippingCarrier"
                                    ].push({
                                      shopifyAttribute: "",
                                      ebayAttribute: "",
                                    });
                                    setconnectedAccountsObject(tempAccounts);
                                  }}
                                >
                                  Add Shpping Carrier
                                </Button>
                              )}
                            </Stack>
                            {fields[field]["mappingOfShippingCarrier"] &&
                              fields[field]["mappingOfShippingCarrier"] !==
                                "no" &&
                              getShippingCarrierStructure(field)}
                          </FormLayout>
                        )}
                        {field === "orderCancelation" &&
                          getOrderCancelationReasonStruture(field)}
                      </Stack>
                    </Card>
                  </Layout.AnnotatedSection>
                </Layout>
              );
            }
          })}
      </FormLayout>
    </Card>
  );
};

export default TabContent;
