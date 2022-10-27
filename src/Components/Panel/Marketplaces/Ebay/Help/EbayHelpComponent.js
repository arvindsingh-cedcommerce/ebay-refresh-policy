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
import { parseQueryString } from "../../../../../services/helperFunction";

const { Meta } = Card;

const site = {
  marginBottom: "24px",
  overflow: "hidden",
  background: "#f7f7f7",
  border: "10px",
  borderRadius: "2px",
};

const EbayHelpComponent = (props) => {
 
  let { question } = parseQueryString(props.location.search);
  const questionValue=question.trim();
  const [faqData, setFaqData] = useState({});
  const [searchQuery,setSearchQuery]=useState("");
  const [searchFaqData,setSearchFaqData]= useState({});
  const [faqArray,setFaqArray]=useState([]);
  const [searchFaqArray,setSearchFaqArray]=useState([]);
  // faqloader
  const [faqLoader, setFaqLoader] = useState(false);
  
  useEffect(()=>{
  let finalFaqArray=[...faqArray];
  if(searchQuery)
  {
  let updatedFaqArray=[];

  finalFaqArray.forEach((faqKey,index)=>{
      let questionArray=[];
      let faqObj={...faqKey};
      let initialQuestionArray=[...faqKey["qas"]];
      initialQuestionArray.forEach((questionKey)=>{
  if(questionKey["question"].toLowerCase().includes(searchQuery.toLowerCase()))
  {
    questionArray.push(questionKey);
  }
      })
      faqObj["qas"]=[...questionArray];
      updatedFaqArray.push(faqObj);
     });
      setSearchFaqArray([...updatedFaqArray]);
    }
    else
    {
      setSearchFaqArray([...finalFaqArray]);
    }
  },[searchQuery]);
  useEffect(()=>{
    if(questionValue && faqArray.length>0)
    setSearchQuery(questionValue);
  },[faqArray]);
  const getAllFAQs = async () => {
    setFaqLoader(true)
    let { success, data } = await getMethod(faqAPI, {
      type: "FAQ",
    });
    if (success) {
      let parsedData = getParseFaqData(data);
      let parsedValues=Object.values(parsedData);
      let finalFaqArray=[];
      parsedValues.map((parsedValue,index)=>{
        let questionsList=[];
        
        finalFaqArray[index]={...parsedValue};
        questionsList=Object.keys(parsedValue["qas"]);
        let currentArr=[];
        questionsList.map((question,i)=>{
          let questionObj={...parsedValue["qas"][question]};
          questionObj["question"]=question;
          currentArr.push(questionObj);
        })
        finalFaqArray[index]["qas"]=currentArr;
      });
      setFaqArray([...finalFaqArray]);
      setSearchFaqArray([...finalFaqArray]);
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
              {searchFaqArray.length===0?  ( <Card sectioned>
               <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>):
              (<>  <TextField
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e);
                }}
                placeholder={"Search your query"
                }
                prefix={(<Icon
                  source={SearchMinor}

                  color="base"
                />)}
              /><br/><GroupFAQComponent faqs={searchFaqArray} setSearchFaqArray={setSearchFaqArray} /></>)}
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
