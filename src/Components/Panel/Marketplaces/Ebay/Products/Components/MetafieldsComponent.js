import { Card, Layout } from "@shopify/polaris";
import React from "react";

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
        <Card title="Metafields not found" sectioned></Card>
      </Layout.Section>
    </Layout>
  );
};

export default MetafieldsComponent;
