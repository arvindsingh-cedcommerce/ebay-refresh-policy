import { Card, Col, Collapse, Divider, PageHeader, Row } from "antd";
import React from "react";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import { faqs, videos } from "../Products/SampleProductData";
import YoutubeEmbed from "./YoutubeEmbed";

const { Panel } = Collapse;
const { Meta } = Card;

const site = {
  marginBottom: "24px",
  overflow: "hidden",
  background: "#f7f7f7",
  border: "10px",
  borderRadius: "2px",
};

const EbayHelpComponent = () => {
  return (
    <PageHeader title="Help">
      <TabsComponent
        totalTabs={2}
        tabContents={{
          "FAQ(s)": (
            <Collapse
              defaultActiveKey={false}
              ghost
              expandIconPosition={"right"}
              onChange={() => {}}
              className={site}
            >
              {faqs.map((faq, index) => {
                return (
                  <React.Fragment key={index}>
                    <Panel header={faq["ques"]} key={index} className={site}>
                      {faq["ans"]}
                    </Panel>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </Collapse>
          ),
          "Video(s)": (
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {videos.map((video, index) => {
                return (
                  <Col span={8}>
                    <Card
                      key={video["key"]}
                      size="small"
                      style={{ marginBottom: "10px" }}
                      hoverable
                      cover={<YoutubeEmbed embedId={video["url"]} />}
                    >
                      <Meta
                        title={video["title"]}
                        description={video["description"]}
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ),
        }}
      />
    </PageHeader>
  );
};

export default EbayHelpComponent;
