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
import { configurationAPI } from "../../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../../services/notify";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../../../URLs/ConfigurationURL";
import { getParsedData, getSavedData } from "../Helper/ProductSettingsHelper";
const { Text, Title } = Typography;

const yesNoButtonList = [
  "autoProductSync",
  "autoDeleteProduct",
  "autoProductCreate",
];

const getAttributeLabel = (attribute) => {
  let label = "";
  switch (attribute) {
    case "title":
      label = "Title";
      break;
    case "description":
      label = "Description";
      break;
    case "vendor":
      label = "Vendor";
      break;
    case "price":
      label = "Price";
      break;
    case "quantity":
      label = "Quantity";
      break;
    case "weight":
      label = "Weight";
      break;
    case "weight_unit":
      label = "Weight Unit";
      break;
    case "sku":
      label = "SKU";
      break;
    case "product_type":
      label = "Product Type";
      break;
    case "images":
      label = "Images";
      break;
    case "tags":
      label = "Tags";
      break;
    default:
      break;
  }
  return label;
};

const ShopifyToAppNewNew = ({ shopifyToAppData }) => {
  const [fields, setFields] = useState({
    autoProductSync: {
      label: "Auto Product Syncing",
      value: true,
      description:
        "Enable the option to automatic sync selected attributes of the product from shopify on app. You can unselect the attribute if you don't want to sync the value.",
      attributes: {
        title: true,
        description: true,
        vendor: true,
        price: true,
        quantity: true,
        weight: true,
        weight_unit: true,
        sku: true,
        product_type: true,
        images: true,
        tags: true,
      },
    },
    autoDeleteProduct: {
      label: "Auto Delete Product",
      value: true,
      description:
        "Enable the option to allow automatic delete product from app. Which means if the product deleted on Shopify then it will automatically deleted on app as well.",
    },
    autoProductCreate: {
      label: "Auto Product Create",
      value: true,
      description:
        "Enable the option to import new products automatically on the App when created on Shopify. i.e. importing process will consider the product import settings but not for collection based import settings.",
    },
  });

  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const saveData = async () => {
    setSaveBtnLoader(true);
    const parsedData = getParsedData(fields);
    let temp = {
      product_settings: {
        shopify_to_app: { ...parsedData },
      },
      setting_type: ["product_settings"],
    };
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

  const handleBtnPres = (value, field, innerField) => {
    let temp = { ...fields };
    if (innerField) {
      temp[field]["attributes"][innerField] = value;
    } else temp[field]["value"] = value;
    setFields(temp);
  };

  useEffect(() => {
    if (Object.keys(shopifyToAppData).length) {
      getSavedData(shopifyToAppData, fields, setFields);
    }
  }, [shopifyToAppData]);

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
      {Object.keys(fields).map((field) => {
        return (
          <FormLayout key={field}>
            <Layout>
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
                          <Stack spacing="tight">
                            {Object.keys(fields[field]["attributes"]).map(
                              (attribute, index) => {
                                return (
                                  <Checkbox
                                    label={getAttributeLabel(attribute)}
                                    checked={
                                      fields[field]["attributes"][attribute]
                                    }
                                    onChange={(e) =>
                                      handleBtnPres(e, field, attribute)
                                    }
                                  />
                                );
                              }
                            )}
                          </Stack>
                        </React.Fragment>
                      )}
                    </Stack>
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
          </FormLayout>
        );
      })}
    </Card>
  );
};

export default ShopifyToAppNewNew;
