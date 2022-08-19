import { Pie } from "@ant-design/plots";
import { Stack } from "@shopify/polaris";
import { Spin } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useEffect, useState } from "react";

const AntPieProductAnalytics = ({
  productAnalyticsData,
  uniquesColors,
  accountClicked,
  setAccountClicked,
  accountClickedDetails,
}) => {
  const [totalCenterProducts, setTotalCenterProducts] = useState(0);

  useEffect(() => {
    if (productAnalyticsData) {
      let total = 0;
      productAnalyticsData.forEach((shopid) => {
        total += shopid.totalProducts;
      });
      setTotalCenterProducts(total / productAnalyticsData.length);
    }
  }, [productAnalyticsData]);

  const config = {
    interactions: [
      {
        type: "tooltip",
        cfg: { start: [{ trigger: "element:click", action: "tooltip:show" }] },
        on:
          ("element:click",
          (...args) => {
            console.log(...args);
          }),
        onClick: (node, event) => {
          console.log(node, event);
          //   let temp = {};
          //   temp["status"] = true;
          //   temp["data"] = { ...node?.["data"] };
          //   setAccountClicked(temp);
        },
      },
    ],
    appendPadding: 10,
    data: productAnalyticsData,
    angleField: "totalProducts",
    colorField: "accountName",
    radius: 0.9,
    innerRadius: 0.6,
    legend: {
      layout: "horizontal",
      position: "bottom",
      flipPage: false,
    },
    tooltip: {
      customContent: (title, data) => {
        if (data?.[0]?.["data"]) {
          const {
            accountName,
            ended,
            error,
            not_uploaded,
            uploaded,
            totalProducts,
          } = data?.[0]?.["data"];
          return (
            <div style={{ margin: "10px 0px" }}>
              <Stack vertical spacing="tight">
                <Text strong>
                  {accountName}: {totalProducts} products
                </Text>
                <Text>Uploaded: {uploaded} products</Text>
                <Text>Not Uploaded: {not_uploaded} products</Text>
                <Text>Error: {error} products</Text>
                <Text>Ended: {ended} products</Text>
              </Stack>
            </div>
          );
        }
      },
    },
    label: false,
    interactions: [
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: totalCenterProducts,
      },
    },
  };
  return productAnalyticsData.length ? (
    <Pie {...config} />
  ) : (
    <Stack distribution="center" alignment="center">
      <Spin size="large" />
    </Stack>
  );
};

export default AntPieProductAnalytics;
