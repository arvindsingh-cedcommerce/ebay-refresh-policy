import {
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  FormLayout,
  Layout,
  Select,
  Stack,
  Subheading,
} from "@shopify/polaris";
import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../services/notify";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../../URLs/ConfigurationURL";
const { Text, Title } = Typography;

const matchfromEbayOptions = [
  { label: "Title", value: "Title" },
  { label: "Sku", value: "SKU" },
];

const matchfromShopifyOptions = [
  { label: "Title", value: "title" },
  { label: "Sku", value: "sku" },
];

const ShopifyToAppNew = ({ optionsVar, setOptionsVar }) => {
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);
  const handleBtnPres = (e, option) => {
    let temp = { ...optionsVar };
    temp[option]["enable"] = temp[option]["enable"] === "yes" ? "no" : "yes";
    if (optionsVar["autoProductSync"]["enable"] === "no") {
      Object.keys(temp["autoProductSync"]["attribute"]).map((field) => {
        temp["autoProductSync"]["attribute"][field]["value"] = "no";
      });
    }
    setOptionsVar(temp);
  };

  const saveData = async () => {
    setSaveBtnLoader(true);
    let temp = {
      product_settings: {
        shopify_to_app: {},
      },
      setting_type: ["product_settings"],
    };
    Object.keys(optionsVar).forEach((option) => {
      console.log(option);
      // if (option === "match_from_ebay") {
      //   temp['product_settings']["match_from_ebay"] = {};
      //   for (const key in optionsVar[option]) {
      //     if (key === "enable") {
      //       temp['product_settings']["match_from_ebay"][key] = optionsVar[option][key];
      //     } else if (key === "attributeMapping") {
      //       temp['product_settings']["match_from_ebay"][key] = {};
      //       temp['product_settings']["match_from_ebay"][key] = [...optionsVar[option][key]];
      //     }
      //   }
      // } else {
        temp['product_settings']["shopify_to_app"][option] = {};
        for (const key in optionsVar[option]) {
          if (key === "enable") {
            temp['product_settings']["shopify_to_app"][option][key] = optionsVar[option][key];
          } else if (key === "attribute") {
            temp['product_settings']["shopify_to_app"][option][key] = {};
            for (const attribute in optionsVar[option][key]) {
              temp['product_settings']["shopify_to_app"][option][key][attribute] =
                optionsVar[option][key][attribute]["value"];
            }
          } else if (key === "attributeMapping") {
            temp['product_settings']["shopify_to_app"][option][key] = [...optionsVar[option][key]];
          }
        }
      // }
    });
    let { success, message } = await configurationAPI(
      saveAppSettingsShopifyToAppURL,
      temp
    );
    if (success) {
      notify.success(message);
    } else {
      notify.error(message);
    }
    setSaveBtnLoader(false);
  };

  const handleAdd = (userPreference = "match_from_ebay") => {
    switch (userPreference) {
      case "match_from_ebay":
        let tempArr = [];
        let ObjtoAdd = { shopify_attribute: "", ebay_attribute: "" };
        tempArr.push(ObjtoAdd);
        let test = { ...optionsVar };
        test.match_from_ebay.attributeMapping.push(ObjtoAdd);
        setOptionsVar(test);
        break;
    }
  };

  const handleRemove = (userPreference = "match_from_ebay", key) => {
    switch (userPreference) {
      case "match_from_ebay":
        let temp = { ...optionsVar };
        temp["match_from_ebay"]["attributeMapping"].splice(key, 1);
        setOptionsVar(temp);
        break;
    }
  };
  return (
    <Card
      sectioned
      title={
        <Title
          level={4}
          title={
            "Configure settings to manage product details from Shopify to the App."
          }
        >
          Shopify To App
        </Title>
      }
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
      {Object.keys(optionsVar).map((option, index1) => {
        return (
          <FormLayout key={index1}>
            <Layout>
              <Layout.AnnotatedSection
                id={option}
                title={optionsVar[option]["label"]}
                description={optionsVar[option]["description"]}
              >
                <Card sectioned>
                  <FormLayout>
                    <Stack vertical spacing="extraTight">
                      <ButtonGroup segmented>
                        <Button
                          primary={
                            optionsVar[option]["enable"] === "yes"
                              ? true
                              : false
                          }
                          pressed={
                            optionsVar[option]["enable"] === "yes"
                              ? true
                              : false
                          }
                          onClick={(e) => handleBtnPres(e, option)}
                        >
                          Yes
                        </Button>
                        <Button
                          primary={
                            optionsVar[option]["enable"] === "no" ? true : false
                          }
                          pressed={
                            optionsVar[option]["enable"] === "no" ? true : false
                          }
                          onClick={(e) => handleBtnPres(e, option)}
                        >
                          No
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </FormLayout>
                  {optionsVar[option]["label"] === "Auto Product Syncing" &&
                    optionsVar["autoProductSync"]["enable"] === "yes" && (
                      <Card.Section title="Fields">
                        <Stack>
                          {Object.keys(
                            optionsVar["autoProductSync"]["attribute"]
                          ).map((field, index) => {
                            return (
                              <Checkbox
                                key={index}
                                label={
                                  optionsVar["autoProductSync"]["attribute"][
                                    field
                                  ]["label"]
                                }
                                checked={
                                  optionsVar["autoProductSync"]["attribute"][
                                    field
                                  ]["value"] === "yes"
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  let parsedValue = e ? "yes" : "no";
                                  let temp = { ...optionsVar };
                                  temp["autoProductSync"]["attribute"][field][
                                    "value"
                                  ] = parsedValue;
                                  setOptionsVar(temp);
                                }}
                              />
                            );
                          })}
                        </Stack>
                      </Card.Section>
                    )}
                  {/* {optionsVar[option]["label"] === "Match products from eBay" &&
                    optionsVar["match_from_ebay"]["enable"] === "yes" && (
                      <Card.Section
                        actions={{
                          content: (
                            <Button
                              onClick={(e) => {
                                handleAdd("match_from_ebay");
                              }}
                              disabled={
                                optionsVar[option]["attributeMapping"]
                                  .length === 2
                              }
                            >
                              Add Attribute
                            </Button>
                          ),
                        }}
                      >
                        <FormLayout>
                          {Object.keys(
                            optionsVar[option]["attributeMapping"]
                          ).map((preferenceKey, index) => {
                            return (
                              <Card.Section>
                                <Card
                                  actions={{
                                    content: "Remove",
                                    onAction: (e) => {
                                      handleRemove("match_from_ebay", index);
                                    },
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
                                        label={`Ebay attribute`}
                                        options={matchfromEbayOptions}
                                        onChange={(e) => {
                                          let test = {
                                            ...optionsVar,
                                          };
                                          test[option]["attributeMapping"][
                                            index
                                          ]["ebay_attribute"] = e;
                                          setOptionsVar(test);
                                        }}
                                        value={
                                          optionsVar[option][
                                            "attributeMapping"
                                          ][preferenceKey]["ebay_attribute"]
                                        }
                                      />
                                      <Select
                                        placeholder={"Select..."}
                                        label={`Shopify attribute`}
                                        options={matchfromShopifyOptions}
                                        onChange={(e) => {
                                          let test = {
                                            ...optionsVar,
                                          };
                                          test[option]["attributeMapping"][
                                            index
                                          ]["shopify_attribute"] = e;
                                          setOptionsVar(test);
                                        }}
                                        value={
                                          optionsVar[option][
                                            "attributeMapping"
                                          ][preferenceKey]["shopify_attribute"]
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
                    )} */}
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
          </FormLayout>
        );
      })}
    </Card>
  );
};

export default ShopifyToAppNew;
