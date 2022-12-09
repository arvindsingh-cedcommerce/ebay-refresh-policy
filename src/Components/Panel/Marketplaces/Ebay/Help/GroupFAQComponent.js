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

const GroupFAQComponent = ({ faqs, setSearchFaqArray }) => {
  const getTabStructure = () => {
    let returnStructure = {};
    faqs.forEach((faq, i) => {
      if (faq["qas"] && faq["qas"].length > 0) {
        returnStructure[faq["category"]] = faq["qas"].map((faqKey, index) => (
          <>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                let temp = [...faqs];
                temp[i]["qas"][index]["isOpen"] = !faq["qas"][index]["isOpen"];
                setSearchFaqArray(temp);
              }}
              ariaExpanded={faq["qas"][index]["isOpen"]}
            >
              <Card>
                <Card.Section>
                  <Stack distribution={"equalSpacing"}>
                    <b>{faqKey["question"]}</b>
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
                  open={faq["qas"][index]["isOpen"]}
                >
                  <Card>
                    <Card.Section>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: faq["qas"][index]["value"],
                        }}
                      />
                      {/* {faq["qas"][index]["value"]} */}
                    </Card.Section>
                  </Card>
                </Collapsible>
              </Card>
            </div>
            <br />
          </>
        ));
      }
    });

    return returnStructure;
  };
  return (
    <TabsComponent
      tabPosition={window.innerWidth <= 768 ? "top" : "left"}
      totalTabs={faqs.length}
      tabContents={getTabStructure()}
    />
  );
};

export default GroupFAQComponent;
