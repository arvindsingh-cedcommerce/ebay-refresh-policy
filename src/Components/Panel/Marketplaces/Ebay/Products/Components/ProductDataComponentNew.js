import { Card, FormLayout, Layout, Stack } from "@shopify/polaris";
import { Alert, Col, Collapse, Image, Row } from "antd";
import { isUndefined } from "lodash";
import React from "react";
import ReactJson from "react-json-view";
import NoDataFound from "../../../../../../assets/data_nahi.png";

const ProductDataComponentNew = ({
  data,
  errors,
  errorsData,
  connectedAccounts,
}) => {
  const getAccountLabel = (shopId) => {
    let filteredAccounts = connectedAccounts.filter(
      (account) => account["shopId"] == shopId
    );
   
    return <> <Image
    preview={false}
    width={25}
  
    src={
      filteredAccounts[0]["siteID"] &&
      require(`../../../../../../assets/flags/${filteredAccounts[0]["siteID"]}.png`)
    }
    style={{ borderRadius: "50%",marginRight:"20px"}}
  />{filteredAccounts[0]["label"]}</>;
  };

  return Object.keys(errorsData).length &&
    (Object.keys(errorsData["errorsObj"]).length > 0 ||
      Object.keys(errorsData["itemIdObj"]).length > 0) ? (
    <Collapse onChange={() => {}}>
      {Object.keys(errorsData).length &&
        Object.keys(errorsData?.errorsObj).length && (
          <Collapse.Panel header={"Errors"} key="1">
            <FormLayout>
              {Object.keys(errorsData?.errorsObj).map((shopId, index) => {
                return (
                  <Layout>
                    <Layout.AnnotatedSection
                      id={getAccountLabel(shopId)}
                      title={getAccountLabel(shopId)}
                    >
                      <Card sectioned>
                        <ReactJson
                          style={{ maxHeight: 200, overflowY: "scroll" }}
                          src={errorsData?.errorsObj[shopId]}
                        />
                      </Card>
                    </Layout.AnnotatedSection>
                  </Layout>
                );
              })}
            </FormLayout>
          </Collapse.Panel>
        )}
      {Object.keys(errorsData).length &&
        Object.keys(errorsData?.itemIdObj).length && (
          <Collapse.Panel header={"eBay Product Data"} key="2">
            <FormLayout>
              {Object.keys(errorsData?.itemIdObj).map((shopId, index) => {
                return (
                  <Layout>
                    <Layout.AnnotatedSection
                      id={getAccountLabel(shopId)}
                      title={getAccountLabel(shopId)}
                    >
                      <Card sectioned>
                        <ReactJson
                          style={{ maxHeight: 200, overflowY: "scroll" }}
                          src={errorsData?.itemIdObj[shopId].jsonResponse}
                        />
                      </Card>
                    </Layout.AnnotatedSection>
                  </Layout>
                );
              })}
            </FormLayout>
          </Collapse.Panel>
        )}
      {/* {!isUndefined(data.ebay_product_data) && (
            <Collapse.Panel header="eBay Product Data" key="1">
              <ReactJson
                style={{ maxHeight: 200, overflowY: "scroll" }}
                src={!isUndefined(data.ebay_product_data) && data.ebay_product_data}
              />
            </Collapse.Panel>
          )} */}
      {/* {!isUndefined(data.report) && (
            <Collapse.Panel header="eBay Error(s) & Warnings" key="2">
              <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}>
                {data.report.map((error) => {
                  return (
                    <Col span={24}>
                      <Alert
                        message={error["SeverityCode"]}
                        description={error["ShortMessage"]}
                        type={error["SeverityCode"].toLowerCase()}
                        showIcon
                      />
                    </Col>
                  );
                })}
              </Row>
            </Collapse.Panel>
          )} */}
    </Collapse>
  ) : (
    <Layout>
      <Layout.Section>
        <Stack distribution="center">
          {/* <Card title="Product is not uploaded yet" sectioned></Card> */}
          <img src={NoDataFound} width="100%" />
        </Stack>
      </Layout.Section>
    </Layout>
  );
};

export default ProductDataComponentNew;
