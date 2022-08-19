import {
  Card,
  Form,
  FormLayout,
  Select,
  Stack,
  TextField,
} from "@shopify/polaris";
import { Checkbox, Radio, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";

const eBayCarrierOptions = [
  {
    title: "ShippingCarrierCodeType",
    options: [
      { label: "A1CourierServices", value: "A1CourierServices" },
      { label: "ABF", value: "ABF" },
      { label: "AeroPost", value: "AeroPost" },
      { label: "ALLIEDEXPRESS", value: "ALLIEDEXPRESS" },
    ],
  },
  {
    title: "ShippingServiceCodeType",
    options: [
      {
        label: "AT_BitteTreffenSieEineAuswahl",
        value: "AT_BitteTreffenSieEineAuswahl",
      },
      { label: "AT_COD", value: "AT_COD" },
      {
        label: "AT_EconomyDeliveryFromAbroad",
        value: "AT_EconomyDeliveryFromAbroad",
      },
      {
        label: "AT_EinschreibenVersandInklEinschreibengebuhr",
        value: "AT_EinschreibenVersandInklEinschreibengebuhr",
      },
    ],
  },
];
const shopifyOptions = [
  {
    label: "Customer changed/canceled order",
    value: "customer",
    options1: eBayCarrierOptions,
  },
  {
    label: "Fraudulent order",
    value: "fraud",
    options1: eBayCarrierOptions,
  },
  {
    label: "Items unavailable",
    value: "inventory",
    options1: eBayCarrierOptions,
  },
  {
    label: "Payment declined",
    value: "declined",
    options1: eBayCarrierOptions,
  },
  {
    label: "Other",
    value: "other",
    options1: eBayCarrierOptions,
  },
];
const ebayOptions = [
  {
    label: "Address Issues",
    value: "ADDRESS_ISSUES",
  },
  {
    label: "Buyer Asked Cancel",
    value: "BUYER_ASKED_CANCEL",
  },
  {
    label: "BUYER_CANCEL_OR_ADDRESS_ISSUE",
    value: "BUYER_CANCEL_OR_ADDRESS_ISSUE",
  },
  {
    label: "FOUND_CHEAPER_PRICE",
    value: "FOUND_CHEAPER_PRICE",
  },
  {
    label: "ORDER_MISTAKE",
    value: "ORDER_MISTAKE",
  },
  {
    label: "ORDER_UNPAID",
    value: "ORDER_UNPAID",
  },
  {
    label: "OTHER",
    value: "OTHER",
  },
  {
    label: "OUT_OF_STOCK_OR_CANNOT_FULFILL",
    value: "OUT_OF_STOCK_OR_CANNOT_FULFILL",
  },
  {
    label: "PRICE_TOO_HIGH",
    value: "PRICE_TOO_HIGH",
  },
  {
    label: "UNKNOWN",
    value: "UNKNOWN",
  },
  {
    label: "WONT_ARRIVE_IN_TIME",
    value: "WONT_ARRIVE_IN_TIME",
  },
  {
    label: "WRONG_PAYMENT_METHOD",
    value: "WRONG_PAYMENT_METHOD",
  },
  {
    label: "WRONG_SHIPPING_ADDRESS",
    value: "WRONG_SHIPPING_ADDRESS",
  },
  {
    label: "WRONG_SHIPPING_METHOD",
    value: "WRONG_SHIPPING_METHOD",
  },
];

const AppToEbayBackup = ({
  account,
  checkedList,
  checkAll,
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  const [addCarrier, setAddCarrier] = useState(1);

  const clickHandler = (e, account, field) => {
    let temp = { ...connectedAccountsObject };
    if (field === "autoOrderSync") {
      temp[account]["fields"][field]["enable"] = e.target.value;
    } else temp[account]["fields"][field]["enable"] = e ? "yes" : "no";
    setconnectedAccountsObject(temp);
  };

  useEffect(
    () => console.log(connectedAccountsObject),
    [connectedAccountsObject]
  );
  const getFieldStructure = () => {
    return Object.keys(connectedAccountsObject[account]["fields"]).map(
      (field) => {
        return (
          field !== "autoOrderSync" &&
          connectedAccountsObject[account]["fields"]["autoOrderSync"][
            "enable"
          ] === "yes" &&
          (connectedAccountsObject[account]["fields"][field]["type"] ===
          "textfield" ? (
            <TextField
              label={connectedAccountsObject[account]["fields"][field]["label"]}
              value={connectedAccountsObject[account]["fields"][field]["value"]}
              onChange={(e) => {
                let temp = { ...connectedAccountsObject };
                temp[account]["fields"][field]["value"] = e;
                setconnectedAccountsObject(temp);
              }}
            />
          ) : (
            <Stack spacing="extraTight">
              <>{connectedAccountsObject[account]["fields"][field]["label"]}</>
              <Switch
                checked={
                  connectedAccountsObject[account]["fields"][field][
                    "enable"
                  ] === "yes"
                    ? true
                    : false
                }
                onChange={(e) => clickHandler(e, account, field)}
              />
            </Stack>
          ))
        );
      }
    );
  };
  const getDetails = () => {
    return (
      <Card>
        <Stack vertical={false} alignment="baseline">
          <span>
            {
              connectedAccountsObject[account]["fields"]["autoOrderSync"][
                "label"
              ]
            }
          </span>
          <Radio.Group
            buttonStyle="solid"
            onChange={(e) => clickHandler(e, account, "autoOrderSync")}
            value={
              connectedAccountsObject[account]["fields"]["autoOrderSync"][
                "enable"
              ]
            }
          >
            <Radio.Button value="yes">Yes</Radio.Button>
            <Radio.Button value="no">No</Radio.Button>
          </Radio.Group>
        </Stack>
      </Card>
    );
  };
  // const prevCountRef = useRef();
  // prevCountRef.current = addCarrier
  useEffect(() => {
    let temp = {...connectedAccountsObject}
    console.log(addCarrier);
    temp[account]['fields']['mappingOfShippingCarrier']['sourceTarget'][`${addCarrier}number`] = {}
    setconnectedAccountsObject(temp)
  }, [addCarrier])

  const addCarrierFunc = () => {
    let temp = addCarrier
    temp++;
    setAddCarrier((prev) => prev+1);
  };
  const removeCarrierFunc = () => {
    let temp = addCarrier
    temp--;
    setAddCarrier((prev) => prev-1);
  };
  const getShippingCarrier = () => {
    return Object.keys(connectedAccountsObject[account]['fields']['mappingOfShippingCarrier']['sourceTarget']).map(e => {
      return <Card
      sectioned
      actions={[
        {
          content: "Remove Carrier",
          onAction: () => removeCarrierFunc(),
          disabled: Object.keys(connectedAccountsObject[account]['fields']['mappingOfShippingCarrier']['sourceTarget']).length === 1,
        },
      ]}
    >
      <Form onSubmit={() => {}}>
        <FormLayout>
          <FormLayout.Group>
            <Stack distribution="fillEvenly">
              <Select
                label={"Shopify"}
                options={shopifyOptions}
                placeholder="Please Select..."
                onChange={e1 => {
                  let temp = {...connectedAccountsObject}
                  temp[account]['fields']['mappingOfShippingCarrier']['sourceTarget'][e]['shopify'] = e1
                  setconnectedAccountsObject(temp)
                }}
                value={connectedAccountsObject[account]['fields']['mappingOfShippingCarrier']['sourceTarget'][e]['shopify']}
              />
              <Select
                label={"eBay"}
                options={eBayCarrierOptions}
                placeholder="Please Select..."
                onChange={e1 => {
                  let temp = {...connectedAccountsObject}
                  temp[account]['fields']['mappingOfShippingCarrier']['sourceTarget'][e]['ebay'] = e1
                  setconnectedAccountsObject(temp)
                }}
                value={connectedAccountsObject[account]['fields']['mappingOfShippingCarrier']['sourceTarget'][e]['ebay']}
              />
            </Stack>
          </FormLayout.Group>
        </FormLayout>
      </Form>
    </Card>
    })
    // console.log(testArr);
    // return Object.keys(testArr).map(e => testArr[e]);
  };
  return (
    <Card sectioned title={`${account}`} actions={[{ content: getDetails() }]}>
      <Card.Section>
        <Stack distribution="leading">{getFieldStructure()}</Stack>
      </Card.Section>
      {connectedAccountsObject[account]["fields"]["autoOrderSync"]["enable"] ===
        "yes" &&
        connectedAccountsObject[account]["fields"][
          "mapOrderCancellationReason"
        ]["enable"] === "yes" && (
          <Card.Section
            title={
              connectedAccountsObject[account]["fields"][
                "mapOrderCancellationReason"
              ]["label"]
            }
          >
            <Form onSubmit={() => {}}>
              <FormLayout>
                <FormLayout.Group>
                  {shopifyOptions.map((shopifyOption) => {
                    return (
                      <Select
                        label={shopifyOption["label"]}
                        options={ebayOptions}
                        onChange={(e) => {
                          let temp = { ...connectedAccountsObject };
                          temp[account]["fields"]["mapOrderCancellationReason"][
                            "sourceTarget"
                          ][shopifyOption["label"]] = e;
                          setconnectedAccountsObject(temp);
                        }}
                        value={
                          connectedAccountsObject[account]["fields"][
                            "mapOrderCancellationReason"
                          ]["sourceTarget"][shopifyOption["label"]]
                        }
                        placeholder="Please Select..."
                      />
                    );
                  })}
                </FormLayout.Group>
              </FormLayout>
            </Form>
          </Card.Section>
        )}
    </Card>
  );
};

export default AppToEbayBackup;
