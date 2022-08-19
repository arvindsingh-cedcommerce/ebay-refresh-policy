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
} from "@shopify/polaris";
import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  OrderCancellationReasonEbayOptions,
  OrderCancellationReasonShopifyOptions,
  ShippingServiceCodeTypeOptions,
} from "./staticData";
const { Text, Title } = Typography;

const FinalAccountTabContentConfig = ({
  account,
  content,
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  let { fields } = content;
  const [default_settings_orderNote, setDefault_settings_orderNote] =
    useState("");
  const [default_settings_orderTag, setDefault_settings_orderTag] =
    useState("");
  const [default_settings_orderName, setDefault_settings_orderName] =
    useState("");

  const handleBtnPres = (
    e,
    field,
    htmlInputType = "",
    innerFieldLevel1 = "",
    innerFieldLevel2 = ""
  ) => {
    let temp = { ...connectedAccountsObject };
    if (innerFieldLevel1) {
      if (
        field === "vatDetails" ||
        field === "itemLocation" ||
        field === "salesTaxDetails" ||
        field === "currencyConversion"
      ) {
        temp[account]["fields"][field]["attribute"][innerFieldLevel1]["value"] =
          e;
      } else if (htmlInputType === "checkbox") {
        temp[account]["fields"][field]["attribute"][innerFieldLevel1]["value"] =
          temp[account]["fields"][field]["attribute"][innerFieldLevel1][
            "value"
          ] === "yes"
            ? "no"
            : "yes";
      } else if (htmlInputType === "textfield") {
        temp[account]["fields"][field]["attribute"][innerFieldLevel1]["value"] =
          e;
      }
    } else if (htmlInputType === "textfield") {
      temp[account]["fields"][field]["value"] = e;
    } else if (htmlInputType === "checkbox") {
      temp[account]["fields"][field]["value"] =
        temp[account]["fields"][field]["value"] === "yes" ? "no" : "yes";
    } else {
      temp[account]["fields"][field]["enable"] =
        temp[account]["fields"][field]["enable"] === "yes" ? "no" : "yes";
      // if (field === "userRealCustomerDetails") {
      //   Object.keys(temp[account]['fields'][field]['attribute']).forEach(attributeValue => {
      //     temp[account]["fields"][field]["attribute"][attributeValue]['value'] = ''
      //   })
      // }
      // console.log(temp);
    }
    setconnectedAccountsObject(temp);
  };

  const addShippingService = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    shippingServiceMappingReal
  ) => {
    let temp = { ...connectedAccountsObject };
    temp[account]["fields"][field][attribute][innerFieldLevel1][
      shippingServiceMappingReal
    ]["counter"]++;
    let createdObject = {};
    let tempObject = {
      customAttribute: { label: "Shopify Shipping Service", value: "" },
      shopifyAttribute: { label: "eBay Shipping Service", value: "" },
    };
    createdObject[
      `#${temp[account]["fields"][field][attribute][innerFieldLevel1][shippingServiceMappingReal]["counter"]}`
    ] = tempObject;
    temp[account]["fields"][field][attribute][innerFieldLevel1][
      shippingServiceMappingReal
    ]["mapping"] = {
      ...temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ]["mapping"],
      ...createdObject,
    };
    setconnectedAccountsObject(temp);
  };

  const addShippingCarrier = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    shippingCarrierMappingReal
  ) => {
    // let temp = { ...shippingCarrierMapping };
    let temp = { ...connectedAccountsObject };
    temp[account]["fields"][field][attribute][innerFieldLevel1][
      shippingCarrierMappingReal
    ]["counter"]++;
    // temp["counter"]++;
    let createdObject = {};
    let tempObject = {
      customAttribute: { label: "Shopify Carrier", value: "" },
      shopifyAttribute: { label: "eBay Carrier", value: "" },
    };
    createdObject[
      `#${temp[account]["fields"][field][attribute][innerFieldLevel1][shippingCarrierMappingReal]["counter"]}`
    ] = tempObject;
    // temp["mapping"] = { ...temp["mapping"], ...createdObject };
    temp[account]["fields"][field][attribute][innerFieldLevel1][
      shippingCarrierMappingReal
    ]["mapping"] = {
      ...temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ]["mapping"],
      ...createdObject,
    };
    // setShippingCarrierMapping(temp);
    setconnectedAccountsObject(temp);
  };

  const addOrderCancelReason = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    orderCancellationReasonMappingReal
  ) => {
    let temp = { ...connectedAccountsObject };
    temp[account]["fields"][field][attribute][innerFieldLevel1][
      orderCancellationReasonMappingReal
    ]["counter"]++;
    let createdObject = {};
    let tempObject = {
      customAttribute: { label: "Shopify Reason", value: "" },
      shopifyAttribute: { label: "eBay Reason", value: "" },
    };
    createdObject[
      `#${temp[account]["fields"][field][attribute][innerFieldLevel1][orderCancellationReasonMappingReal]["counter"]}`
    ] = tempObject;
    temp[account]["fields"][field][attribute][innerFieldLevel1][
      orderCancellationReasonMappingReal
    ]["mapping"] = {
      ...temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ]["mapping"],
      ...createdObject,
    };
    setconnectedAccountsObject(temp);
  };

  const removeShippingService = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    shippingServiceMappingReal,
    serviceNumber
  ) => {
    // let temp = { ...shippingServiceMapping };
    let temp = { ...connectedAccountsObject };
    if (
      serviceNumber.substring(1) ==
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ]["counter"]
    ) {
      // temp["counter"]--;
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ]["counter"]--;
      delete temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ]["mapping"][serviceNumber];
      // setShippingServiceMapping(temp);
      setconnectedAccountsObject(temp);
    } else if (
      parseInt(serviceNumber.substring(1)) <
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ]["counter"]
    ) {
      // temp["counter"]--;
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ]["counter"]--;
      delete temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ]["mapping"][serviceNumber];
      let cloneObj = {
        ...temp[account]["fields"][field][attribute][innerFieldLevel1][
          shippingServiceMappingReal
        ]["mapping"],
      };
      let newTemp = {};
      newTemp["counter"] =
        temp[account]["fields"][field][attribute][innerFieldLevel1][
          shippingServiceMappingReal
        ]["counter"];
      newTemp["mapping"] = {};
      Object.keys(cloneObj).forEach((service) => {
        if (
          parseInt(service.substring(1)) > parseInt(serviceNumber.substring(1))
        ) {
          let copy = {
            ...temp[account]["fields"][field][attribute][innerFieldLevel1][
              shippingServiceMappingReal
            ]["mapping"][service],
          };
          let modifiedServiceNumber = "";
          modifiedServiceNumber = parseInt(service.substring(1));
          let tempObj = {};
          tempObj[`#${--modifiedServiceNumber}`] = { ...copy };
          newTemp["mapping"] = { ...newTemp["mapping"], ...tempObj };
        } else {
          let copy = {
            ...temp[account]["fields"][field][attribute][innerFieldLevel1][
              shippingServiceMappingReal
            ]["mapping"][service],
          };
          let tempObj = {};
          tempObj[`#${parseInt(service.substring(1))}`] = { ...copy };
          newTemp["mapping"] = { ...newTemp["mapping"], ...tempObj };
        }
      });
      // setShippingServiceMapping(newTemp);
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ] = { ...newTemp };
      setconnectedAccountsObject(temp);
    }
  };

  const removeShippingCarrier = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    shippingCarrierMappingReal,
    serviceNumber
  ) => {
    let temp = { ...connectedAccountsObject };
    if (
      serviceNumber.substring(1) ==
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ]["counter"]
    ) {
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ]["counter"]--;
      delete temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ]["mapping"][serviceNumber];
      setconnectedAccountsObject(temp);
    } else if (
      parseInt(serviceNumber.substring(1)) <
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ]["counter"]
    ) {
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ]["counter"]--;
      delete temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ]["mapping"][serviceNumber];
      let cloneObj = {
        ...temp[account]["fields"][field][attribute][innerFieldLevel1][
          shippingCarrierMappingReal
        ]["mapping"],
      };
      let newTemp = {};
      newTemp["counter"] =
        temp[account]["fields"][field][attribute][innerFieldLevel1][
          shippingCarrierMappingReal
        ]["counter"];
      newTemp["mapping"] = {};
      Object.keys(cloneObj).forEach((service) => {
        if (
          parseInt(service.substring(1)) > parseInt(serviceNumber.substring(1))
        ) {
          let copy = {
            ...temp[account]["fields"][field][attribute][innerFieldLevel1][
              shippingCarrierMappingReal
            ]["mapping"][service],
          };
          let modifiedServiceNumber = "";
          modifiedServiceNumber = parseInt(service.substring(1));
          let tempObj = {};
          tempObj[`#${--modifiedServiceNumber}`] = { ...copy };
          newTemp["mapping"] = { ...newTemp["mapping"], ...tempObj };
        } else {
          let copy = {
            ...temp[account]["fields"][field][attribute][innerFieldLevel1][
              shippingCarrierMappingReal
            ]["mapping"][service],
          };
          let tempObj = {};
          tempObj[`#${parseInt(service.substring(1))}`] = { ...copy };
          newTemp["mapping"] = { ...newTemp["mapping"], ...tempObj };
        }
      });
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ] = { ...newTemp };
      setconnectedAccountsObject(temp);
    }
  };

  const removeOrderCancellationReason = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    orderCancellationReasonMappingReal,
    serviceNumber
  ) => {
    let temp = { ...connectedAccountsObject };
    if (
      serviceNumber.substring(1) ==
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ]["counter"]
    ) {
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ]["counter"]--;
      delete temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ]["mapping"][serviceNumber];
      setconnectedAccountsObject(temp);
    } else if (
      parseInt(serviceNumber.substring(1)) <
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ]["counter"]
    ) {
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ]["counter"]--;
      delete temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ]["mapping"][serviceNumber];
      let cloneObj = {
        ...temp[account]["fields"][field][attribute][innerFieldLevel1][
          orderCancellationReasonMappingReal
        ]["mapping"],
      };
      let newTemp = {};
      newTemp["counter"] =
        temp[account]["fields"][field][attribute][innerFieldLevel1][
          orderCancellationReasonMappingReal
        ]["counter"];
      newTemp["mapping"] = {};
      Object.keys(cloneObj).forEach((service) => {
        if (
          parseInt(service.substring(1)) > parseInt(serviceNumber.substring(1))
        ) {
          let copy = {
            ...temp[account]["fields"][field][attribute][innerFieldLevel1][
              orderCancellationReasonMappingReal
            ]["mapping"][service],
          };
          let modifiedServiceNumber = "";
          modifiedServiceNumber = parseInt(service.substring(1));
          let tempObj = {};
          tempObj[`#${--modifiedServiceNumber}`] = { ...copy };
          newTemp["mapping"] = { ...newTemp["mapping"], ...tempObj };
        } else {
          let copy = {
            ...temp[account]["fields"][field][attribute][innerFieldLevel1][
              orderCancellationReasonMappingReal
            ]["mapping"][service],
          };
          let tempObj = {};
          tempObj[`#${parseInt(service.substring(1))}`] = { ...copy };
          newTemp["mapping"] = { ...newTemp["mapping"], ...tempObj };
        }
      });
      temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ] = { ...newTemp };
      setconnectedAccountsObject(temp);
    }
  };

  const getShippingServiceStructure = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    shippingServiceMappingReal
  ) => {
    let temp = { ...connectedAccountsObject };
    let shippingServiceMapping = {
      ...temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingServiceMappingReal
      ],
    };
    return (
      <>
        {Object.keys(shippingServiceMapping["mapping"]).map(
          (service, index) => {
            return (
              <Card
                sectioned
                title={service}
                actions={[
                  {
                    content: "Delete",
                    onAction: () =>
                      removeShippingService(
                        fields,
                        field,
                        attribute,
                        innerFieldLevel1,
                        shippingServiceMappingReal,
                        service
                      ),
                  },
                ]}
                key={index}
              >
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      label={
                        shippingServiceMapping["mapping"][service][
                          "customAttribute"
                        ]["label"]
                      }
                      value={
                        shippingServiceMapping["mapping"][service][
                          "customAttribute"
                        ]["value"]
                      }
                      onChange={(e) => {
                        temp[account]["fields"][field][attribute][
                          innerFieldLevel1
                        ][shippingServiceMappingReal]["mapping"][service][
                          "customAttribute"
                        ]["value"] = e;
                        setconnectedAccountsObject(temp);
                      }}
                    />
                    <TextField
                      label={
                        shippingServiceMapping["mapping"][service][
                          "shopifyAttribute"
                        ]["label"]
                      }
                      value={
                        shippingServiceMapping["mapping"][service][
                          "shopifyAttribute"
                        ]["value"]
                      }
                      onChange={(e) => {
                        temp[account]["fields"][field][attribute][
                          innerFieldLevel1
                        ][shippingServiceMappingReal]["mapping"][service][
                          "shopifyAttribute"
                        ]["value"] = e;
                        setconnectedAccountsObject(temp);
                      }}
                    />
                  </FormLayout.Group>
                </FormLayout>
              </Card>
            );
          }
        )}
      </>
    );
  };

  const getShippingCarrierStructure = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    shippingCarrierMappingReal
  ) => {
    let temp = { ...connectedAccountsObject };
    let shippingCarrierMapping = {
      ...temp[account]["fields"][field][attribute][innerFieldLevel1][
        shippingCarrierMappingReal
      ],
    };
    return (
      <>
        {Object.keys(shippingCarrierMapping["mapping"]).map(
          (service, index) => {
            return (
              <Card
                sectioned
                title={service}
                actions={[
                  {
                    content: "Delete",
                    onAction: () =>
                      removeShippingCarrier(
                        fields,
                        field,
                        attribute,
                        innerFieldLevel1,
                        shippingCarrierMappingReal,
                        service
                      ),
                  },
                ]}
                key={index}
              >
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      label={
                        shippingCarrierMapping["mapping"][service][
                          "customAttribute"
                        ]["label"]
                      }
                      value={
                        shippingCarrierMapping["mapping"][service][
                          "customAttribute"
                        ]["value"]
                      }
                      onChange={(e) => {
                        temp[account]["fields"][field][attribute][
                          innerFieldLevel1
                        ][shippingCarrierMappingReal]["mapping"][service][
                          "customAttribute"
                        ]["value"] = e;
                        setconnectedAccountsObject(temp);
                      }}
                    />
                    <TextField
                      label={
                        shippingCarrierMapping["mapping"][service][
                          "shopifyAttribute"
                        ]["label"]
                      }
                      value={
                        shippingCarrierMapping["mapping"][service][
                          "shopifyAttribute"
                        ]["value"]
                      }
                      onChange={(e) => {
                        temp[account]["fields"][field][attribute][
                          innerFieldLevel1
                        ][shippingCarrierMappingReal]["mapping"][service][
                          "shopifyAttribute"
                        ]["value"] = e;
                        setconnectedAccountsObject(temp);
                      }}
                    />
                  </FormLayout.Group>
                </FormLayout>
              </Card>
            );
          }
        )}
      </>
    );
  };

  const getOrderCancelReasonStructure = (
    fields,
    field,
    attribute,
    innerFieldLevel1,
    orderCancellationReasonMappingReal
  ) => {
    let temp = { ...connectedAccountsObject };
    let orderCancellationReasonMapping = {
      ...temp[account]["fields"][field][attribute][innerFieldLevel1][
        orderCancellationReasonMappingReal
      ],
    };
    return (
      <>
        {Object.keys(orderCancellationReasonMapping["mapping"]).map(
          (service, index) => {
            return (
              <Card
                sectioned
                title={service}
                actions={[
                  {
                    content: "Delete",
                    onAction: () =>
                      removeOrderCancellationReason(
                        fields,
                        field,
                        attribute,
                        innerFieldLevel1,
                        orderCancellationReasonMappingReal,
                        service
                      ),
                  },
                ]}
                key={index}
              >
                <FormLayout>
                  <FormLayout.Group>
                    <Select
                      label={
                        orderCancellationReasonMapping["mapping"][service][
                          "customAttribute"
                        ]["label"]
                      }
                      options={OrderCancellationReasonShopifyOptions}
                      value={
                        orderCancellationReasonMapping["mapping"][service][
                          "customAttribute"
                        ]["value"]
                      }
                      onChange={(e) => {
                        temp[account]["fields"][field][attribute][
                          innerFieldLevel1
                        ][orderCancellationReasonMappingReal]["mapping"][
                          service
                        ]["customAttribute"]["value"] = e;
                        setconnectedAccountsObject(temp);
                      }}
                    />
                    <Select
                      label={
                        orderCancellationReasonMapping["mapping"][service][
                          "shopifyAttribute"
                        ]["label"]
                      }
                      options={OrderCancellationReasonEbayOptions}
                      value={
                        orderCancellationReasonMapping["mapping"][service][
                          "shopifyAttribute"
                        ]["value"]
                      }
                      onChange={(e) => {
                        temp[account]["fields"][field][attribute][
                          innerFieldLevel1
                        ][orderCancellationReasonMappingReal]["mapping"][
                          service
                        ]["shopifyAttribute"]["value"] = e;
                        setconnectedAccountsObject(temp);
                      }}
                    />
                  </FormLayout.Group>
                </FormLayout>
              </Card>
            );
          }
        )}
      </>
    );
  };

  const getValue = (fields, field, attribute1) => {
    let temp = { ...connectedAccountsObject };
    let { attribute } = temp[account][fields][field];
    let dynamicKey = Object.keys(attribute)[0];
    return attribute[dynamicKey]["value"];
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
                primary={
                  fields["autoOrderSync"]["enable"] === "yes" ? true : false
                }
                pressed={
                  fields["autoOrderSync"]["enable"] === "yes" ? true : false
                }
                onClick={(e) => handleBtnPres(e, "autoOrderSync")}
              >
                Yes
              </Button>
              <Button
                primary={
                  fields["autoOrderSync"]["enable"] === "no" ? true : false
                }
                pressed={
                  fields["autoOrderSync"]["enable"] === "no" ? true : false
                }
                onClick={(e) => handleBtnPres(e, "autoOrderSync")}
              >
                No
              </Button>
            </ButtonGroup>
          ),
        },
      ]}
    >
      <FormLayout>
        {fields["autoOrderSync"]["enable"] === "yes" &&
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
                      <FormLayout>
                        <Stack vertical spacing="extraTight">
                          {fields[field]["type"] === "segmentedBtn" && (
                            <ButtonGroup segmented>
                              <Button
                                primary={
                                  fields[field]["enable"] === "yes"
                                    ? true
                                    : false
                                }
                                pressed={
                                  fields[field]["enable"] === "yes"
                                    ? true
                                    : false
                                }
                                onClick={(e) => handleBtnPres(e, field)}
                              >
                                Yes
                              </Button>
                              <Button
                                primary={
                                  fields[field]["enable"] === "no"
                                    ? true
                                    : false
                                }
                                pressed={
                                  fields[field]["enable"] === "no"
                                    ? true
                                    : false
                                }
                                onClick={(e) => {
                                  handleBtnPres(e, field);
                                }}
                              >
                                No
                              </Button>
                            </ButtonGroup>
                          )}
                          {fields[field]["type"] === "textfield" && (
                            <TextField
                              key={outerIndex}
                              value={getValue("fields", field, "attribute")}
                              onChange={(e) => {
                                let { ...attribute } =
                                  fields[field]["attribute"];
                                let dynamicKey = Object.keys(attribute)[0];
                                let temp = { ...connectedAccountsObject };
                                temp[account]["fields"][field]["attribute"][
                                  dynamicKey
                                ]["value"] = e;
                                setconnectedAccountsObject(temp);
                              }}
                            />
                          )}
                          {fields[field]["type"] === "dropdown" && (
                            <Select
                              placeholder="Please Select..."
                              options={fields[field]["options"]}
                              value={fields[field]["value"]}
                              onChange={(e) => {
                                // let {...attribute} =  fields[field]["attribute"]
                                // let dynamicKey = Object.keys(attribute)[0]
                                let temp = { ...connectedAccountsObject };
                                temp[account]["fields"][field]["value"] = e;
                                setconnectedAccountsObject(temp);
                              }}
                            />
                          )}
                          {fields[field]["label"] ===
                            "Use Real Customer Details" &&
                            fields[field]["enable"] === "no" && (
                              <FormLayout>
                                {Object.keys(fields[field]["attribute"]).map(
                                  (innerFieldLevel2, index) => {
                                    if (
                                      fields["userRealCustomerDetails"][
                                        "attribute"
                                      ][innerFieldLevel2]["type"] ===
                                      "textfield"
                                    ) {
                                      return (
                                        <TextField
                                          key={index}
                                          label={
                                            fields["userRealCustomerDetails"][
                                              "attribute"
                                            ][innerFieldLevel2]["label"]
                                          }
                                          value={
                                            fields["userRealCustomerDetails"][
                                              "attribute"
                                            ][innerFieldLevel2]["value"]
                                          }
                                          onChange={(e) => {
                                            handleBtnPres(
                                              e,
                                              field,
                                              "textfield",
                                              innerFieldLevel2
                                            );
                                          }}
                                          type={
                                            fields["userRealCustomerDetails"][
                                              "attribute"
                                            ][innerFieldLevel2]["label"] ===
                                            "Email"
                                              ? "email"
                                              : "text"
                                          }
                                        />
                                      );
                                    }
                                  }
                                )}
                              </FormLayout>
                            )}
                          {/* {fields[field]["label"] === "Shipping Service" &&
                            fields[field]["enable"] === "yes" && (
                              <FormLayout>
                                {Object.keys(fields[field]["attribute"]).map(
                                  (innerFieldLevel1, index) => {
                                    if (
                                      fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["type"] === "mappingBoolean"
                                    ) {
                                      return (
                                        <>
                                          <Stack distribution="trailing">
                                            {fields[field]["attribute"][
                                              innerFieldLevel1
                                            ]["value"] === "yes" && (
                                              <Button
                                                onClick={() =>
                                                  addShippingService(
                                                    fields,
                                                    field,
                                                    "attribute",
                                                    innerFieldLevel1,
                                                    "shippingServiceMapping"
                                                  )
                                                }
                                              >
                                                Add Shipping Service
                                              </Button>
                                            )}
                                          </Stack>
                                          {fields[field]["attribute"][
                                            innerFieldLevel1
                                          ]["value"] === "yes" &&
                                            getShippingServiceStructure(
                                              fields,
                                              field,
                                              "attribute",
                                              innerFieldLevel1,
                                              "shippingServiceMapping"
                                            )}
                                        </>
                                      );
                                    }
                                  }
                                )}
                              </FormLayout>
                            )} */}
                        </Stack>
                      </FormLayout>
                      {fields[field]["label"] === "Shipment Sync" &&
                        fields[field]["enable"] === "yes" && (
                          <Card.Section title="Fields">
                            <FormLayout>
                              {Object.keys(fields[field]["attribute"]).map(
                                (innerFieldLevel1, index) => {
                                  if (
                                    fields[field]["attribute"][
                                      innerFieldLevel1
                                    ]["type"] === "boolean"
                                  ) {
                                    return (
                                      <Checkbox
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
                                          handleBtnPres(
                                            e,
                                            field,
                                            "checkbox",
                                            innerFieldLevel1
                                          );
                                        }}
                                      />
                                    );
                                  } else if (
                                    fields[field]["attribute"][
                                      innerFieldLevel1
                                    ]["type"] === "mappingBoolean"
                                  ) {
                                    return (
                                      <>
                                        <Stack distribution="equalSpacing">
                                          <Checkbox
                                            key={outerIndex}
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
                                              handleBtnPres(
                                                e,
                                                field,
                                                "checkbox",
                                                innerFieldLevel1
                                              );
                                            }}
                                          />
                                          {fields[field]["attribute"][
                                            innerFieldLevel1
                                          ]["value"] === "yes" && (
                                            <Button
                                              onClick={() =>
                                                addShippingCarrier(
                                                  fields,
                                                  field,
                                                  "attribute",
                                                  innerFieldLevel1,
                                                  "shippingCarrierMapping"
                                                )
                                              }
                                            >
                                              Add Shipping Carrier
                                            </Button>
                                          )}
                                        </Stack>
                                        {fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["value"] === "yes" &&
                                          getShippingCarrierStructure(
                                            fields,
                                            field,
                                            "attribute",
                                            innerFieldLevel1,
                                            "shippingCarrierMapping"
                                          )}
                                      </>
                                    );
                                  }
                                }
                              )}
                            </FormLayout>
                          </Card.Section>
                        )}

                      {fields[field]["label"] === "Order Cancellation Reason" &&
                        fields[field]["enable"] === "yes" && (
                          <FormLayout>
                            {Object.keys(fields[field]["attribute"]).map(
                              (innerFieldLevel1, index) => {
                                if (
                                  fields[field]["attribute"][innerFieldLevel1][
                                    "type"
                                  ] === "mappingBoolean"
                                ) {
                                  return (
                                    <>
                                      <Stack distribution="trailing">
                                        {fields[field]["attribute"][
                                          innerFieldLevel1
                                        ]["value"] === "yes" && (
                                          <Button
                                            onClick={() =>
                                              addOrderCancelReason(
                                                fields,
                                                field,
                                                "attribute",
                                                innerFieldLevel1,
                                                "orderCancellationReasonMapping"
                                              )
                                            }
                                          >
                                            Add Reason
                                          </Button>
                                        )}
                                      </Stack>
                                      {fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["value"] === "yes" &&
                                        getOrderCancelReasonStructure(
                                          fields,
                                          field,
                                          "attribute",
                                          innerFieldLevel1,
                                          "orderCancellationReasonMapping"
                                        )}
                                    </>
                                  );
                                }
                              }
                            )}
                          </FormLayout>
                        )}
                      {fields[field]["label"] === "Set Shopify Order Note" &&
                        fields[field]["enable"] === "yes" && (
                          <FormLayout>
                            {Object.keys(fields[field]["attribute"]).map(
                              (innerFieldLevel1, index) => {
                                if (
                                  fields[field]["attribute"][innerFieldLevel1][
                                    "type"
                                  ] === "mappingBoolean"
                                ) {
                                  return (
                                    <>
                                      {fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["value"] === "yes" && (
                                        <Stack vertical spacing="tight">
                                          <Select
                                            // label="Mapping Options"
                                            options={[
                                              {
                                                label: "Please Select...",
                                                value: "",
                                              },
                                              {
                                                label: "eBay Order Id",
                                                value: "ebayOrderId",
                                              },
                                              {
                                                label: "Set custom value",
                                                value: "default",
                                              },
                                            ]}
                                            value={
                                              fields[field]["attribute"][
                                                innerFieldLevel1
                                              ]["orderNoteMapping"]
                                            }
                                            onChange={(e) => {
                                              let temp = {
                                                ...connectedAccountsObject,
                                              };
                                              temp[account]["fields"][
                                                "setOrderNote"
                                              ]["attribute"][
                                                "mappingOfOrderNote"
                                              ]["orderNoteMapping"] = e;
                                              setconnectedAccountsObject(temp);
                                            }}
                                          />
                                          {fields[field]["attribute"][
                                            innerFieldLevel1
                                          ]["orderNoteMapping"] ===
                                            "default" && (
                                            <Stack vertical={false}>
                                              <Stack.Item>
                                                <Select
                                                  label="Choose to add attribute"
                                                  options={[
                                                    {
                                                      label: "Please Select...",
                                                      value: "",
                                                    },
                                                    {
                                                      label: "eBay Order Id",
                                                      value: "ebay_order_id",
                                                    },
                                                  ]}
                                                  value={
                                                    default_settings_orderNote
                                                  }
                                                  onChange={(e) => {
                                                    let temp = {
                                                      ...default_settings_orderNote,
                                                    };
                                                    temp = e;
                                                    if (e) {
                                                      let tempAccounts = {
                                                        ...connectedAccountsObject,
                                                      };
                                                      tempAccounts[account][
                                                        "fields"
                                                      ]["setOrderNote"][
                                                        "attribute"
                                                      ]["mappingOfOrderNote"][
                                                        "default_setting"
                                                      ]["value"] += `{{${e}}}`;
                                                      setconnectedAccountsObject(
                                                        tempAccounts
                                                      );
                                                    }
                                                    setDefault_settings_orderNote(
                                                      temp
                                                    );
                                                  }}
                                                />
                                              </Stack.Item>
                                              <Stack.Item fill>
                                                <TextField
                                                  label={"Value"}
                                                  value={
                                                    fields[field]["attribute"][
                                                      innerFieldLevel1
                                                    ]["default_setting"][
                                                      "value"
                                                    ]
                                                  }
                                                  onChange={(e) => {
                                                    let temp = {
                                                      ...connectedAccountsObject,
                                                    };
                                                    temp[account]["fields"][
                                                      "setOrderNote"
                                                    ]["attribute"][
                                                      "mappingOfOrderNote"
                                                    ]["default_setting"][
                                                      "value"
                                                    ] = e;
                                                    setconnectedAccountsObject(
                                                      temp
                                                    );
                                                  }}
                                                />
                                              </Stack.Item>
                                            </Stack>
                                          )}
                                        </Stack>
                                      )}
                                    </>
                                  );
                                }
                              }
                            )}
                          </FormLayout>
                        )}
                      {fields[field]["label"] === "Set Shopify Order Tag" &&
                        fields[field]["enable"] === "yes" && (
                          <FormLayout>
                            {Object.keys(fields[field]["attribute"]).map(
                              (innerFieldLevel1, index) => {
                                if (
                                  fields[field]["attribute"][innerFieldLevel1][
                                    "type"
                                  ] === "mappingBoolean"
                                ) {
                                  return (
                                    <>
                                      {fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["value"] === "yes" && (
                                        <Stack vertical spacing="tight">
                                          <Select
                                            // label="Mapping Options"
                                            options={[
                                              {
                                                label: "Please Select...",
                                                value: "",
                                              },
                                              {
                                                label: "eBay Order Id",
                                                value: "ebayOrderId",
                                              },
                                              {
                                                label: "Set custom value",
                                                value: "default",
                                              },
                                            ]}
                                            value={
                                              fields[field]["attribute"][
                                                innerFieldLevel1
                                              ]["orderTagMapping"]
                                            }
                                            onChange={(e) => {
                                              let temp = {
                                                ...connectedAccountsObject,
                                              };
                                              temp[account]["fields"][
                                                "setOrderTags"
                                              ]["attribute"][
                                                "mappingOfOrderTag"
                                              ]["orderTagMapping"] = e;
                                              setconnectedAccountsObject(temp);
                                            }}
                                          />
                                          {fields[field]["attribute"][
                                            innerFieldLevel1
                                          ]["orderTagMapping"] ===
                                            "default" && (
                                            <Stack vertical={false}>
                                              <Stack.Item>
                                                <Select
                                                  label="Choose to add attribute"
                                                  options={[
                                                    {
                                                      label: "Please Select...",
                                                      value: "",
                                                    },
                                                    {
                                                      label: "eBay Order Id",
                                                      value: "ebay_order_id",
                                                    },
                                                  ]}
                                                  value={
                                                    default_settings_orderTag
                                                  }
                                                  onChange={(e) => {
                                                    let temp = {
                                                      ...default_settings_orderTag,
                                                    };
                                                    temp = e;
                                                    if (e) {
                                                      let tempAccounts = {
                                                        ...connectedAccountsObject,
                                                      };
                                                      tempAccounts[account][
                                                        "fields"
                                                      ]["setOrderTags"][
                                                        "attribute"
                                                      ]["mappingOfOrderTag"][
                                                        "default_setting"
                                                      ]["value"] += `{{${e}}}`;
                                                      setconnectedAccountsObject(
                                                        tempAccounts
                                                      );
                                                    }
                                                    setDefault_settings_orderTag(
                                                      temp
                                                    );
                                                  }}
                                                />
                                              </Stack.Item>
                                              <Stack.Item fill>
                                                <TextField
                                                  label={"Value"}
                                                  value={
                                                    fields[field]["attribute"][
                                                      innerFieldLevel1
                                                    ]["default_setting"][
                                                      "value"
                                                    ]
                                                  }
                                                  onChange={(e) => {
                                                    let temp = {
                                                      ...connectedAccountsObject,
                                                    };
                                                    temp[account]["fields"][
                                                      "setOrderTags"
                                                    ]["attribute"][
                                                      "mappingOfOrderTag"
                                                    ]["default_setting"][
                                                      "value"
                                                    ] = e;
                                                    setconnectedAccountsObject(
                                                      temp
                                                    );
                                                  }}
                                                />
                                              </Stack.Item>
                                            </Stack>
                                          )}
                                        </Stack>
                                      )}
                                    </>
                                  );
                                }
                              }
                            )}
                          </FormLayout>
                        )}
                      {fields[field]["label"] === "Set Shopify Order Name" &&
                        fields[field]["enable"] === "yes" && (
                          <FormLayout>
                            {Object.keys(fields[field]["attribute"]).map(
                              (innerFieldLevel1, index) => {
                                if (
                                  fields[field]["attribute"][innerFieldLevel1][
                                    "type"
                                  ] === "mappingBoolean"
                                ) {
                                  return (
                                    <>
                                      {fields[field]["attribute"][
                                        innerFieldLevel1
                                      ]["value"] === "yes" && (
                                        <Stack vertical spacing="tight">
                                          <Select
                                            // label="Mapping Options"
                                            options={[
                                              {
                                                label: "Please Select...",
                                                value: "",
                                              },
                                              {
                                                label: "eBay Order Id",
                                                value: "ebayOrderId",
                                              },
                                              {
                                                label: "Set custom value",
                                                value: "default",
                                              },
                                            ]}
                                            value={
                                              fields[field]["attribute"][
                                                innerFieldLevel1
                                              ]["orderNameMapping"]
                                            }
                                            onChange={(e) => {
                                              let temp = {
                                                ...connectedAccountsObject,
                                              };
                                              temp[account]["fields"][
                                                "setOrderName"
                                              ]["attribute"][
                                                "mappingOfOrderName"
                                              ]["orderNameMapping"] = e;
                                              setconnectedAccountsObject(temp);
                                            }}
                                          />
                                          {fields[field]["attribute"][
                                            innerFieldLevel1
                                          ]["orderNameMapping"] ===
                                            "default" && (
                                            <Stack vertical={false}>
                                              <Stack.Item>
                                                <Select
                                                  label="Choose to add attribute"
                                                  options={[
                                                    {
                                                      label: "Please Select...",
                                                      value: "",
                                                    },
                                                    {
                                                      label: "eBay Order Id",
                                                      value: "ebay_order_id",
                                                    },
                                                  ]}
                                                  value={
                                                    default_settings_orderName
                                                  }
                                                  onChange={(e) => {
                                                    let temp = {
                                                      ...default_settings_orderName,
                                                    };
                                                    temp = e;
                                                    if (e) {
                                                      let tempAccounts = {
                                                        ...connectedAccountsObject,
                                                      };
                                                      tempAccounts[account][
                                                        "fields"
                                                      ]["setOrderName"][
                                                        "attribute"
                                                      ]["mappingOfOrderName"][
                                                        "default_setting"
                                                      ]["value"] += `{{${e}}}`;
                                                      setconnectedAccountsObject(
                                                        tempAccounts
                                                      );
                                                    }
                                                    setDefault_settings_orderName(
                                                      temp
                                                    );
                                                  }}
                                                />
                                              </Stack.Item>
                                              <Stack.Item fill>
                                                <TextField
                                                  label={"Value"}
                                                  value={
                                                    fields[field]["attribute"][
                                                      innerFieldLevel1
                                                    ]["default_setting"][
                                                      "value"
                                                    ]
                                                  }
                                                  onChange={(e) => {
                                                    let temp = {
                                                      ...connectedAccountsObject,
                                                    };
                                                    temp[account]["fields"][
                                                      "setOrderName"
                                                    ]["attribute"][
                                                      "mappingOfOrderName"
                                                    ]["default_setting"][
                                                      "value"
                                                    ] = e;
                                                    setconnectedAccountsObject(
                                                      temp
                                                    );
                                                  }}
                                                />
                                              </Stack.Item>
                                            </Stack>
                                          )}
                                        </Stack>
                                      )}
                                    </>
                                  );
                                }
                              }
                            )}
                          </FormLayout>
                        )}
                    </Card>
                  </Layout.AnnotatedSection>
                </Layout>
              );
            } else {
            }
          })}
      </FormLayout>
    </Card>
  );
};

export default FinalAccountTabContentConfig;
