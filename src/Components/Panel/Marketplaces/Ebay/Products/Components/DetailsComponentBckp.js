import {
  Banner,
  Card,
  ChoiceList,
  FormLayout,
  Layout,
  Stack,
  TextField,
} from "@shopify/polaris";
import { Image, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

const DetailsComponentBckp = ({ mainProduct, setMainProduct, apiCallMainProduct }) => {
  // console.log("mainProduct", mainProduct);
  // const [pointedImage, setPointedImage] = useState(mainProduct["mainImage"]);

  const onChangeHandler = (value, type) => {
    let temp = { ...mainProduct };
    temp[type] = value;
    setMainProduct(temp);
  };

  const [selected, setSelected] = useState(["shopify"]);

  return (
    <FormLayout>
      <Layout>
        <Layout.AnnotatedSection
          id="title"
          title="Title"
          description="Shopify and your customers will use this information to contact you."
        >
          <Card sectioned>
            <FormLayout>
              <ChoiceList
                choices={[
                  {
                    label: (
                      <Stack vertical spacing="extraTight">
                        <>Set Shopify product title as eBay title</>
                        {selected[0] === "shopify" && (
                          <Title level={5}>{apiCallMainProduct["title"]}</Title>
                        )}
                      </Stack>
                    ),
                    value: "shopify",
                  },
                  {
                    label: (
                      <Stack vertical spacing="extraTight">
                        <>Set custom eBay title</>
                        {selected[0] === "custom" && (
                          <TextField
                            type="title"
                            // label="Title"
                            onChange={(e) => onChangeHandler(e, "title")}
                            autoComplete="off"
                            value={mainProduct["title"]}
                          />
                        )}
                      </Stack>
                    ),
                    value: "custom",
                  },
                ]}
                selected={selected}
                onChange={(e) => setSelected(e)}
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection id="vendor" title="Vendor">
          <Card sectioned>
            <FormLayout>
              <ChoiceList
                choices={[
                  {
                    label: (
                      <Stack vertical spacing="extraTight">
                        <>Set Shopify product vendor as eBay vendor</>
                        {selected[0] === "shopify" && (
                          <Title level={5}>{mainProduct["vendor"]}</Title>
                        )}
                      </Stack>
                    ),
                    value: "shopify",
                  },
                  {
                    label: (
                      <Stack vertical spacing="extraTight">
                        <>Set custom eBay title</>
                        {selected[0] === "custom" && (
                          <TextField
                            value={mainProduct["vendor"]}
                            onChange={(e) => onChangeHandler(e, "vendor")}
                            autoComplete="off"
                          />
                        )}
                      </Stack>
                    ),
                    value: "custom",
                  },
                ]}
                selected={selected}
                onChange={(e) => setSelected(e)}
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection id="productType" title="Product Type">
          <Card sectioned>
            <FormLayout>
              <ChoiceList
                choices={[
                  {
                    label: (
                      <Stack vertical spacing="extraTight">
                        <>Set Shopify Product Type as eBay Product Type</>
                        {selected[0] === "shopify" && (
                          <Title level={5}>{mainProduct["productType"]}</Title>
                        )}
                      </Stack>
                    ),
                    value: "shopify",
                  },
                  {
                    label: (
                      <Stack vertical spacing="extraTight">
                        <>Set custom eBay Product Type</>
                        {selected[0] === "custom" && (
                          <TextField
                            value={mainProduct["productType"]}
                            onChange={(e) => onChangeHandler(e, "productType")}
                            autoComplete="off"
                          />
                        )}
                      </Stack>
                    ),
                    value: "custom",
                  },
                ]}
                selected={selected}
                onChange={(e) => setSelected(e)}
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection id="tags" title="Tags">
          <Card sectioned>
            <FormLayout>
              <ChoiceList
                choices={[
                  {
                    label: (
                      <Stack vertical spacing="extraTight">
                        <>Set Shopify Tags as eBay Tags</>
                        {selected[0] === "shopify" && (
                          <Title level={5}>{mainProduct["tags"]}</Title>
                        )}
                      </Stack>
                    ),
                    value: "shopify",
                  },
                  {
                    label: (
                      <Stack vertical spacing="extraTight">
                        <>Set custom eBay Product Type</>
                        {selected[0] === "custom" && (
                          <TextField
                            value={mainProduct["tags"]}
                            onChange={(e) => onChangeHandler(e, "tags")}
                            autoComplete="off"
                          />
                        )}
                      </Stack>
                    ),
                    value: "custom",
                  },
                ]}
                selected={selected}
                onChange={(e) => setSelected(e)}
              />
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

export default DetailsComponentBckp;
