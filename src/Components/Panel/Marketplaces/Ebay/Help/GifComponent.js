import { Stack } from "@shopify/polaris";
import { Card, Col, Divider, Row } from "antd";
import React from "react";
import CategoryTemplateGIF from "../../../../../assets/gifs/categoryTemplate.gif";

const { Meta } = Card;

const GifComponent = () => {
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col span={8}>
        <Card
          size="small"
          style={{ marginBottom: "10px", borderRadius: "7px" }}
          hoverable
          cover={<img src={CategoryTemplateGIF} style={{ width: "100%" }} />}
        >
          <Stack distribution="center">
            <Meta
              style={{ marginTop: "10px" }}
              title={"How to create Category Template?"}
            />
          </Stack>
        </Card>
      </Col>
    </Row>
  );
};

export default GifComponent;
