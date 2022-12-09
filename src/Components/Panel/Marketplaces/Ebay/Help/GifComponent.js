import { Button, Modal, Stack } from "@shopify/polaris";
import { Card, Col, Divider, Row, Typography } from "antd";
import React, { useState } from "react";
// import CategoryTemplateImage from "../../../../../assets/gifImage/categoryTemplate.png";
import { gifs } from "./gifHelper";

const { Meta } = Card;
const { Text } = Typography;

const GifComponent = () => {
  const [gifImageModal, setGifImageModal] = useState({
    active: false,
    title: "",
    url: "",
  });

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 8 }}>
      {gifs.map((gif) => {
        return (
          <Col span={8} xs={24} sm={24} md={8} lg={8} xl={6}>
            <Card
              size="small"
              style={{
                marginBottom: "15px",
                borderRadius: "7px",
                width: "80%",
              }}
              hoverable
              cover={<img src={gif.gifModalImage} style={{ width: "100%" }} />}
              onClick={() =>
                setGifImageModal({
                  active: true,
                  title: gif.title,
                  url: gif.url,
                })
              }
            >
              <div
                style={{
                  display: "flex",
                  minHeight: "60px",
                  lineHeight: "24px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {gif.title}
                <Text
                  copyable={{
                    text: gif.url,
                    tooltips: <>Copy gif link</>
                  }}
                />
              </div>
            </Card>
          </Col>
        );
      })}
      <Modal
        open={gifImageModal.active}
        onClose={() => setGifImageModal({ active: false, title: "", url: "" })}
        title={gifImageModal.title}
      >
        <Modal.Section>
          <img src={gifImageModal.url} style={{ width: "100%" }} />
          <Divider />
          <center>
            <Button
              primary
              onClick={() =>
                setGifImageModal({ active: false, title: "", url: "" })
              }
            >
              Close
            </Button>
          </center>
        </Modal.Section>
      </Modal>
    </Row>
  );
};

export default GifComponent;
