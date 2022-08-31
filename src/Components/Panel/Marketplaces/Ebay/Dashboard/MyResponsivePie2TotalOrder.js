import { ResponsivePie } from "@nivo/pie";
import { Badge, Card, Stack } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { animated } from "@react-spring/web";
import NoDataFound from "../../../../../assets/data_nahi.png";

const MyResponsivePie2TotalOrder = ({
  orderAnalyticsData,
  uniquesColors,
  accountClickedOrders,
  setAccountClickedOrders,
  accountClickedDetailsOrders,
}) => {
  const [hasOrderFlag, setHasOrderFlag] = useState(false);

  useEffect(() => {
    if (orderAnalyticsData) {
      orderAnalyticsData.forEach((orderData) => {
        if (orderData.hasOrders) {
          setHasOrderFlag(true);
        }
      });
    }
  }, [orderAnalyticsData]);

  let tempData = orderAnalyticsData.map((productData, index) => {
    productData["color"] = uniquesColors[index];
    productData["label"] = productData["id"];
    productData["innerLabel"] = productData["innerLabel"];
    return productData;
  });

  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0;
    dataWithArc.forEach((datum) => {
      total += datum.value;
    });
    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "25px",
          fontWeight: 600,
        }}
      >
        {total}
      </text>
    );
  };

  return !hasOrderFlag ? (
    <Stack distribution="center">
      <img src={NoDataFound} style={{ padding: "10px 0px" }} width="100%" />
    </Stack>
  ) : (
    <ResponsivePie
      arcLabelsComponent={({ datum, label, style }) => (
        <animated.g
          transform={style.transform}
          style={{ pointerEvents: "none" }}
        >
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={style.textColor}
            style={{
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {label}
          </text>
        </animated.g>
      )}
      layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
      enableArcLabels={true}
      data={tempData}
      margin={{
        top: 55,
        bottom: 55,
      }}
      fit={true}
      tooltip={(point) => {
        return (
          <div
            style={{
              background: "#DDE4E5",
              padding: "10px",
              borderRadius: 5,
            }}
          >
            <Stack vertical spacing="extraTight">
              <Stack alignment="center" spacing="extraTight">
                <>{point.datum.data.flag}</> <>: {point.datum.value}</>
              </Stack>
              <>
                <Badge status="success">Fulfilled Orders</Badge> -{" "}
                {point.datum.data.fulfilledOrders}
              </>
              <>
                <Badge status="info">Unfulfilled Orders</Badge> -{" "}
                {point.datum.data.unfulfilledOrders}
              </>
              <>
                <Badge status="warning">Cancelled Orders</Badge> -{" "}
                {point.datum.data.cancelledOrders}
              </>
              <>
                <Badge status="critical">Failed Orders</Badge> -{" "}
                {point.datum.data.failedOrders}
              </>
            </Stack>
          </div>
        );
      }}
      arcLabel={(point) => {
        return `${point.value}`;
      }}
      colors={{ datum: "data.color" }}
      sortByValue={true}
      innerRadius={0.5}
      padAngle={0}
      cornerRadius={0}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLinkLabelsDiagonalLength={5}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "ruby",
          },
          id: "dots",
        },
        {
          match: {
            id: "c",
          },
          id: "dots",
        },
        {
          match: {
            id: "go",
          },
          id: "dots",
        },
        {
          match: {
            id: "python",
          },
          id: "dots",
        },
        {
          match: {
            id: "scala",
          },
          id: "lines",
        },
        {
          match: {
            id: "lisp",
          },
          id: "lines",
        },
        {
          match: {
            id: "elixir",
          },
          id: "lines",
        },
        {
          match: {
            id: "javascript",
          },
          id: "lines",
        },
      ]}
      onClick={(node, event) => {
        let temp = {};
        temp["status"] = true;
        temp["data"] = { ...node?.["data"] };
        setAccountClickedOrders(temp);
      }}
    />
  );
};

export default MyResponsivePie2TotalOrder;
