import { Card } from "@shopify/polaris";
import { Col, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { viewUserDetailsEbay } from "../../../../Apirequest/accountsApi";

const { Text } = Typography;

const AppAccountDetailsComponent = ({ shopifyData }) => {
  return (
    <Card 
    title="Shopify Store Details" 
    sectioned>
      {Object.keys(shopifyData).map((field) => {
        return (
          <Row justify="space-between" align="middle">
            <Col span={12}>
              <Text strong>{field.toUpperCase()}</Text>
            </Col>
            <Col span={12}>
              {shopifyData[field] ? shopifyData[field] : "Not available"}
            </Col>
          </Row>
        );
      })}
    </Card>
  );
};

export default AppAccountDetailsComponent;
