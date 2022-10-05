import { Card, Layout, Stack } from "@shopify/polaris";
import React from "react";
import NoDataFound from "../../../../../../assets/data_nahi.png";

const MetafieldsComponent = ({ metafields }) => {
  return metafields["present"] ? (
    <Layout>
      {Object.keys(metafields.content).map((key) => {
        return (
          <Layout.AnnotatedSection id={key} title={key}>
            <Card sectioned>{metafields.content[key]}</Card>
          </Layout.AnnotatedSection>
        );
      })}
    </Layout>
  ) : (
    <Layout>
      <Layout.Section>
        {/* <Card title="Metafields not found" sectioned></Card> */}
        <Stack distribution="center">
          {/* <Card title="Product is not uploaded yet" sectioned></Card> */}
          <img src={NoDataFound} width="100%" />
        </Stack>
      </Layout.Section>
    </Layout>
  );
};

export default MetafieldsComponent;
