import { Card, Col, Collapse, Divider, PageHeader, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { getMethod } from "../../../../../APIrequests/DashboardAPI";
import { faqAPI } from "../../../../../APIrequests/HelpAPI";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import { getParseFaqData } from "../Products/helperFunctions/commonHelper";
import { videos } from "../Products/SampleProductData";
import GroupFAQComponent from "./GroupFAQComponent";
import YoutubeEmbed from "./YoutubeEmbed";
import { Card as ShopifyCard, Icon, SkeletonBodyText, SkeletonDisplayText, TextContainer, TextField } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

const { Meta } = Card;

const site = {
  marginBottom: "24px",
  overflow: "hidden",
  background: "#f7f7f7",
  border: "10px",
  borderRadius: "2px",
};

const EbayHelpComponent = () => {
  const [faqData, setFaqData] = useState({});

  // faqloader
  const [faqLoader, setFaqLoader] = useState(false)

  const getAllFAQs = async () => {
    setFaqLoader(true)
    let { success, data } = await getMethod(faqAPI, {
      type: "FAQ",
    });
    if (success) {
      let parsedData = getParseFaqData(data);
      setFaqData(parsedData);
    }
    setFaqLoader(false)
  };

  useEffect(() => {
    document.title = "Help | Integration for eBay";
    document.description = "Help";
    getAllFAQs();
  }, []);

  return (
    <PageHeader title="Help">
      <ShopifyCard sectioned>
        <TabsComponent
          totalTabs={2}
          tabContents={{
            "FAQ(s)": (
              <>
              {Object.keys(faqData).length===0?  ( <Card sectioned>
               <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>):
              (<>  <TextField
                value={""}
                onChange={(e) => {
                }}
                placeholder={"Search your query"
                }
                prefix={(<Icon
                  source={SearchMinor}

                  color="base"
                />)}
              /><br/><GroupFAQComponent faqs={faqData} setFaqData={setFaqData} /></>)}
              </>
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
      </ShopifyCard>
    </PageHeader>
  );
};

export default EbayHelpComponent;
