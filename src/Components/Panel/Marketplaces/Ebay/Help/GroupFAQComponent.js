import {
  Button,
  Card,
  Collapsible,
  Icon,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import { ChevronDownMinor, ChevronRightMinor } from "@shopify/polaris-icons";
import { Collapse, Divider, Typography } from "antd";
import React, { useEffect, useState } from "react";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";

const GroupFAQComponent = ({ faqs, setFaqData }) => {
  const getTabStructure = () => {
    let returnStructure = {};
    Object.keys(faqs).forEach((faq) => {
      returnStructure[faqs[faq]["category"]] = Object.keys(
        faqs[faq]["qas"]
      ).map((faqKey) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              let temp = { ...faqs };
              temp[faq]["qas"][faqKey]["isOpen"] =
                !faqs[faq]["qas"][faqKey]["isOpen"];
              setFaqData(temp);
            }}
            ariaExpanded={faqs[faq]["qas"][faqKey]["isOpen"]}
          >
            <Card>
              <Card.Section>
                <Stack distribution={"equalSpacing"}>
                  <b>{faqKey}</b>
                  <Button
                    plain
                    icon={
                      true ? (
                        <Icon source={ChevronDownMinor} />
                      ) : (
                        <Icon source={ChevronRightMinor} />
                      )
                    }
                  />
                </Stack>
              </Card.Section>
              <Collapsible
                transition={{
                  duration: "500ms",
                  timingFunction: "ease-in-out",
                }}
                open={faqs[faq]["qas"][faqKey]["isOpen"]}
              >
                <Card>
                  <Card.Section>
                    {faqs[faq]["qas"][faqKey]["value"]}
                  </Card.Section>
                </Card>
              </Collapsible>
            </Card>
          </div>
          <br />
        </>
      ));
    });
    return returnStructure;
  };
  return (
    <TabsComponent
      tabPosition={window.innerWidth<=768?"top":"left"}
      totalTabs={Object.keys(faqs).length}
      tabContents={getTabStructure()}
    />
  );
};

export default GroupFAQComponent;
