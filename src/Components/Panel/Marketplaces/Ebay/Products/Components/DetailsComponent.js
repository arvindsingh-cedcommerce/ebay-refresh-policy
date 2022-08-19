import {
  Card,
  Checkbox,
  FormLayout,
  Layout,
  Stack,
  TextField,
} from "@shopify/polaris";
import { Typography } from "antd";
import React, { useEffect } from "react";

const { Text } = Typography;

const DetailsComponent = ({
  mainProduct,
  setMainProduct,
  apiCallMainProduct,
  // editedDataReceivedFromAPI,
}) => {
  const onChangeHandler = (value, type) => {
    let temp = { ...mainProduct };
    temp[type] = value;
    setMainProduct(temp);
  };

  // const fillDataForEditedContent = async () => {
  //   let temp = { ...mainProduct };
  //   if (Object.keys(editedDataReceivedFromAPI).length > 0) {
  //     Object.keys(editedDataReceivedFromAPI?.mainProductEditedData).forEach(
  //       (field) => {
  //         let checkField = `check${
  //           field.charAt(0).toUpperCase() + field.slice(1)
  //         }`;
  //         temp[checkField] = true;
  //         temp[field] = editedDataReceivedFromAPI.mainProductEditedData[field];
  //       }
  //     );
  //   }
  //   setMainProduct(temp);
  // };

  // useEffect(() => {
  //   fillDataForEditedContent();
  // }, []);

  return (
    <FormLayout>
      <Layout>
        <Layout.AnnotatedSection
          id="title"
          title="Title"
          description="Mention the title of the product that you want to display to the customers on the eBay marketplace."
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                <Text strong>{apiCallMainProduct["title"]}</Text>
                <Checkbox
                  label={<>Set Custom</>}
                  checked={mainProduct["checkTitle"]}
                  onChange={(e) => onChangeHandler(e, "checkTitle")}
                />
                {mainProduct["checkTitle"] && (
                  <TextField
                    type="text"
                    onChange={(e) => onChangeHandler(e, "title")}
                    autoComplete="off"
                    value={mainProduct["title"]}
                  />
                )}
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection id="vendor" title="Vendor">
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                <Text strong>{apiCallMainProduct["vendor"]}</Text>
                <Checkbox
                  label={"Set Custom"}
                  checked={mainProduct["checkVendor"]}
                  onChange={(e) => onChangeHandler(e, "checkVendor")}
                />
                {mainProduct["checkVendor"] && (
                  <TextField
                    type="text"
                    onChange={(e) => onChangeHandler(e, "vendor")}
                    autoComplete="off"
                    value={mainProduct["vendor"]}
                  />
                )}
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection id="productType" title="Product Type">
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                <Text strong>{apiCallMainProduct["productType"]}</Text>
                <Checkbox
                  label={"Set Custom"}
                  checked={mainProduct["checkProductType"]}
                  onChange={(e) => onChangeHandler(e, "checkProductType")}
                />
                {mainProduct["checkProductType"] && (
                  <TextField
                    type="title"
                    onChange={(e) => onChangeHandler(e, "productType")}
                    autoComplete="off"
                    value={mainProduct["productType"]}
                  />
                )}
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection id="tags" title="Tags">
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                <Text strong>{apiCallMainProduct["tags"]}</Text>
                <Checkbox
                  label={"Set Custom"}
                  checked={mainProduct["checkTags"]}
                  onChange={(e) => onChangeHandler(e, "checkTags")}
                />
                {mainProduct["checkTags"] && (
                  <TextField
                    type="title"
                    onChange={(e) => onChangeHandler(e, "tags")}
                    autoComplete="off"
                    value={mainProduct["tags"]}
                  />
                )}
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
            <>
              Choose only if you have selected <b>Calculated Shipping</b>
            </>
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
                <TextField
                  label="Unit"
                  onChange={(e) => onChangeHandler(e, "unit")}
                  autoComplete="off"
                  value={mainProduct["unit"]}
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </FormLayout>
  );
};

export default DetailsComponent;
