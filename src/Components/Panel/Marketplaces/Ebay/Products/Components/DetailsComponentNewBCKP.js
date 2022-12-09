import {
  Button,
  Card,
  Checkbox,
  FormLayout,
  Layout,
  Select,
  Stack,
  Tag,
  TextField,
} from "@shopify/polaris";
import { Typography } from "antd";
import React, { useEffect } from "react";

const { Text } = Typography;

const DetailsComponentNewBCKP = ({
  mainProduct,
  setMainProduct,
  apiCallMainProduct,
  editedProductDataFromAPI,
}) => {
  const onChangeHandler = (e, type, field) => {
    let temp = { ...mainProduct };
    if (field) {
      temp[type][field] = e;
    } else {
      temp[type] = e;
    }
    setMainProduct(temp);
  };

  const fillDataForEditedContent = async () => {
    let temp = { ...mainProduct };
    if (Object.keys(editedProductDataFromAPI).length > 0) {
      Object.keys(editedProductDataFromAPI?.mainProduct).forEach((field) => {
        if (["length", "width", "height", "unit"].includes(field)) {
          temp[field] = editedProductDataFromAPI?.mainProduct?.[field];
        } else {
          let checkField = `check${
            field.charAt(0).toUpperCase() + field.slice(1)
          }`;
          let tempObj = {
            enable: true,
            value: editedProductDataFromAPI.mainProduct[field],
          };
          if (field === "tags") {
            tempObj["valueArray"] =
              editedProductDataFromAPI.mainProduct[field].split(",");
          }
          temp[checkField] = { ...tempObj };
        }
      });
    }
    setMainProduct(temp);
  };

  useEffect(() => {
    fillDataForEditedContent();
  }, []);

  return (
    <FormLayout>
      <Layout>
        <Layout.AnnotatedSection
          id="title"
          title="Title"
          description="View the Product title assigned to your product on Shopify. You can customize the product title based on your preference by clicking on the checkbox"
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                <Text strong>{apiCallMainProduct["title"]}</Text>
                <Checkbox
                  label={<>Set Custom</>}
                  checked={mainProduct?.checkTitle?.enable}
                  onChange={(e) => onChangeHandler(e, "checkTitle", "enable")}
                />
                {mainProduct?.["checkTitle"]?.["enable"] && (
                  <TextField
                    type="text"
                    onChange={(e) => onChangeHandler(e, "checkTitle", "value")}
                    autoComplete="off"
                    value={mainProduct?.["checkTitle"]?.["value"]}
                  />
                )}
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection
          id="brand"
          title="Vendor"
          description="View the product vendor assigned to your product on Shopify. You can customize the Vendor based on your preference by clicking on the checkbox."
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                <Text strong>{apiCallMainProduct["brand"]}</Text>
                <Checkbox
                  label={"Set Custom"}
                  checked={mainProduct?.["checkBrand"]?.["enable"]}
                  onChange={(e) => onChangeHandler(e, "checkBrand", "enable")}
                />
                {mainProduct?.["checkBrand"]?.["enable"] && (
                  <TextField
                    type="text"
                    onChange={(e) => onChangeHandler(e, "checkBrand", "value")}
                    autoComplete="off"
                    value={mainProduct?.["checkBrand"]?.["value"]}
                  />
                )}
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection
          id="product_type"
          title="Product Type"
          description="View the product type assigned to your product on Shopify. You can customize the product type based on your preference by clicking on the checkbox."
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                <Text strong>{apiCallMainProduct["product_type"]}</Text>
                <Checkbox
                  label={"Set Custom"}
                  checked={mainProduct?.["checkProducttype"]?.["enable"]}
                  onChange={(e) =>
                    onChangeHandler(e, "checkProducttype", "enable")
                  }
                />
                {mainProduct?.["checkProducttype"]?.["enable"] && (
                  <TextField
                    type="title"
                    onChange={(e) =>
                      onChangeHandler(e, "checkProducttype", "value")
                    }
                    autoComplete="off"
                    value={mainProduct?.["checkProducttype"]?.["value"]}
                  />
                )}
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection
          id="tags"
          title="Tags"
          description="View the Tags assigned to your product on Shopify. You can customize the Tags based on your preference by clicking on the checkbox."
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                {/* <Text strong>{apiCallMainProduct["tags"]}</Text> */}
                <Stack>
                  {apiCallMainProduct["tags"]?.split(",").map((tag) => (
                    <Tag>{tag}</Tag>
                  ))}
                </Stack>
                <Checkbox
                  label={"Set Custom"}
                  checked={mainProduct?.["checkTags"]?.["enable"]}
                  onChange={(e) => onChangeHandler(e, "checkTags", "enable")}
                />
                {mainProduct?.["checkTags"]?.["enable"] && (
                  <Stack vertical>
                    <Stack distribution="fillEvenly">
                      <TextField
                        value={mainProduct["checkTags"]["inputValue"]}
                        onChange={(e) =>
                          onChangeHandler(e, "checkTags", "inputValue")
                        }
                      />
                      <Button
                        primary
                        onClick={(e) => {
                          let temp = { ...mainProduct };
                          temp["checkTags"]["valueArray"].push(
                            mainProduct["checkTags"]["inputValue"]
                          );
                          temp["checkTags"]["value"] =
                            temp["checkTags"]["valueArray"].join();
                          temp["checkTags"]["inputValue"] = "";
                          setMainProduct(temp);
                        }}
                      >
                        Add
                      </Button>
                    </Stack>
                    <Stack>
                      {mainProduct?.["checkTags"]?.["valueArray"].map(
                        (tag, index) => (
                          <Tag
                            onRemove={(e) => {
                              let temp = { ...mainProduct };
                              temp["checkTags"]["valueArray"] = mainProduct[
                                "checkTags"
                              ]["valueArray"].filter((e) => e !== tag);
                              temp["checkTags"]["value"] =
                                temp["checkTags"]["valueArray"].join();
                              setMainProduct(temp);
                            }}
                          >
                            {tag}
                          </Tag>
                        )
                      )}
                    </Stack>
                  </Stack>
                )}
                {/* {mainProduct?.["checkTags"]?.["enable"] && (
                    <TextField
                      type="title"
                      onChange={(e) => onChangeHandler(e, "checkTags", "value")}
                      autoComplete="off"
                      value={mainProduct?.["checkTags"]?.["value"]}
                    />
                  )} */}
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection
          id="productDimensions"
          title="Product Dimensions"
          description={
            "Assign product dimensions to the product before shipping it. Use the option if you are using Calculated shipping services for shipments"
          }
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group condensed>
                <TextField
                  label="Length"
                  onChange={(e) => onChangeHandler(e, "length")}
                  autoComplete="off"
                  value={mainProduct["length"]}
                  type="number"
                  min={"0"}
                />
                <TextField
                  label="Width"
                  onChange={(e) => onChangeHandler(e, "width")}
                  autoComplete="off"
                  value={mainProduct["width"]}
                  type="number"
                  min={"0"}
                />
                <TextField
                  label="Height"
                  onChange={(e) => onChangeHandler(e, "height")}
                  autoComplete="off"
                  value={mainProduct["height"]}
                  type="number"
                  min={"0"}
                />
                <Select
                  options={[
                    { label: "cm", value: "cm" },
                    { label: "in", value: "in" },
                  ]}
                  placeholder="Please select..."
                  label="Unit"
                  value={mainProduct["unit"]}
                  onChange={(e) => onChangeHandler(e, "unit")}
                />
                {/* <TextField
                    label="Unit"
                    onChange={(e) => onChangeHandler(e, "unit")}
                    autoComplete="off"
                    value={mainProduct["unit"]}
                  /> */}
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </FormLayout>
  );
};

export default DetailsComponentNewBCKP;
