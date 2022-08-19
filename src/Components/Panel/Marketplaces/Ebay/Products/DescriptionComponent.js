import React, { useEffect, useState } from "react";
import CKEditor from "ckeditor4-react";
import {
  Card,
  Checkbox,
  ChoiceList,
  FormLayout,
  Layout,
  Stack,
} from "@shopify/polaris";
import { Typography } from "antd";
const { Text } = Typography;

const DescriptionComponent = ({
  mainProduct,
  setMainProduct,
  apiCallMainProduct,
  editedProductDataFromAPI,
}) => {
  const onChangeHandler = (e, type, field) => {
    let temp = { ...mainProduct };
    temp[type][field] = e;
    setMainProduct(temp);
  };

  const fillDataForEditedContent = async () => {
    let temp = { ...mainProduct };
    if (Object.keys(editedProductDataFromAPI).length > 0) {
      Object.keys(editedProductDataFromAPI?.mainProduct).forEach((field) => {
        if (field === "description") {
          let checkField = `check${
            field.charAt(0).toUpperCase() + field.slice(1)
          }`;
          let tempObj = {
            enable: true,
            value: editedProductDataFromAPI.mainProduct[field],
          };
          temp[checkField] = { ...tempObj };
          setMainProduct(temp);
        }
      });
    }
  };

  useEffect(() => {
    fillDataForEditedContent();
  }, []);

  return (
    <Layout>
      <Layout.AnnotatedSection
        id="description"
        title="Description"
        description="View the product description assigned to your product on Shopify. You can customize the product description based on your preference by clicking on the checkbox."
      >
        <Card sectioned>
          <FormLayout>
            <Stack vertical spacing="extraTight">
              <Text strong>
                {apiCallMainProduct["description"].replace(/<[^>]*>/g, "")}
              </Text>
              <Checkbox
                label={"Set Custom"}
                checked={mainProduct["checkDescription"]["enable"]}
                onChange={(e) =>
                  onChangeHandler(e, "checkDescription", "enable")
                }
              />
              {mainProduct["checkDescription"]["enable"] && (
                <CKEditor
                  data={mainProduct["checkDescription"]["value"]}
                  config={{
                    allowedContent: true,
                    extraAllowedContent: ["span(*)", "em(*)", "meta(*)"],
                    fillEmptyBlocks: false,
                    tabSpaces: false,
                    basicEntities: false,
                  }}
                  onChange={(e) =>
                    onChangeHandler(
                      e.editor.getData(),
                      "checkDescription",
                      "value"
                    )
                  }
                />
              )}
            </Stack>
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  );
};

export default DescriptionComponent;
