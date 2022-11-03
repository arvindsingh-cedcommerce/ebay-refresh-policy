import {
  Button,
  Card,
  Collapsible,
  Icon,
  SkeletonBodyText,
  SkeletonDisplayText,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import { ChevronDownMinor, ChevronRightMinor } from "@shopify/polaris-icons";
import { Collapse, Divider, Typography } from "antd";
import React, { useEffect, useState } from "react";

const PlansFAQComponent = ({ faqLoader, faqs, setFaqArray }) => {
  console.log("faqs", faqs);
  const returnStructure = () => {
    let tempArr = faqs.map((faqKey, index) => (
      <>
        <div
          style={{ cursor: "pointer", width: "100%" }}
          onClick={() => {
            let temp = [...faqs];
            temp[index]["isOpen"] = !faqKey["isOpen"];
            setFaqArray([...temp]);
          }}
          ariaExpanded={faqKey["isOpen"]}
        >
          <Card>
            <Card.Section>
              <Stack distribution={"equalSpacing"}>
                <b>{faqKey["title"]}</b>
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
              open={faqKey["isOpen"]}
            >
              <Card>
                <Card.Section>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: faqKey["description"],
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
    return (
      <>
        <Divider />
        <Stack vertical>
          <center>
            <h1
              style={{ margin: "auto", fontSize: "2rem", fontWeight: "bold" }}
            >
              Have Some Questions? Here are the answers
            </h1>
          </center>
          <>{tempArr}</>
        </Stack>
      </>
    );
  };

  return (
    <div>
      {faqLoader ? (
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      ) : faqs.length > 0 ? (
        returnStructure()
      ) : (
        <></>
      )}
    </div>
  );
};

export default PlansFAQComponent;
