import { ResponsivePie } from "@nivo/pie";
import { Badge, Card, Stack } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { animated } from "@react-spring/web";
import NoDataFound from "../../../../../assets/data_nahi.png";

const MyResponsivePie2 = ({
  productAnalyticsData,
  uniquesColors,
  accountClicked,
  setAccountClicked,
  accountClickedDetails,
}) => {
  const [hasProductFlag, setHasProductFlag] = useState(false);

  useEffect(() => {
    if (productAnalyticsData) {
      productAnalyticsData.forEach((productData) => {
        if (productData.hasProducts) {
          setHasProductFlag(true);
        }
      });
    }
  }, [productAnalyticsData]);

  // console.log("productAnalyticsData", productAnalyticsData);
  let tempData = productAnalyticsData.map((productData, index) => {
    // console.log(productData);
    productData["color"] = uniquesColors[index];
    productData["label"] = productData["id"];
    productData["innerLabel"] = productData["innerLabel"];
    productData["flag"] = productData["flag"];
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
        {/* {dataWithArc.length > 0 && total / dataWithArc.length} */}
      </text>
    );
  };

  return !hasProductFlag ? (
    <Stack distribution="center">
      <img src={NoDataFound} style={{ padding: "10px 0px" }} width="100%" />
    </Stack>
  ) : (
    // <div style={{ height: 350 }}>
    //   {accountClicked && !accountClicked.status && (
    // Object.keys(accountClickedDetails).length === 0 &&
    // Object.getPrototypeOf(accountClickedDetails) === Object.prototype && (
    <ResponsivePie
      arcLabelsComponent={({ datum, label, style }) => (
        <animated.g
          transform={style.transform}
          style={{ pointerEvents: "none" }}
        >
          {/* <circle fill={style.textColor} cy={6} r={15} />
                <circle
                  fill="#ffffff"
                  stroke={datum.color}
                  strokeWidth={2}
                  r={16}
                /> */}
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
        // right: -200,
        bottom: 55,
        // left: 150,
      }}
      fit={true}
      tooltip={(point) => {
        // console.log(point.datum);
        return (
          <div
            style={{
              background: "#DDE4E5",
              padding: "10px",
              borderRadius: 5,
              // color: '#fff'
            }}
          >
            <Stack vertical spacing="extraTight">
              <Stack alignment="center" spacing="extraTight">
                <>{point.datum.data.flag}</> <>: {point.datum.value}</>
              </Stack>
              <><Badge status="success">Uploaded</Badge> - {point.datum.data.uploaded}</>
              <><Badge status="info">Not Uploaded</Badge> - {point.datum.data.notUploaded}</>
              <><Badge status="critical">Error</Badge> - {point.datum.data.error}</>
              <><Badge status="warning">Ended</Badge> - {point.datum.data.ended}</>
            </Stack>
          </div>
        );
      }}
      arcLabel={(point) => {
        return `${point.value}`;
      }}
      colors={{ datum: "data.color" }}
      // enableArcLinkLabels={false}
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
        // console.log(node, event);
        let temp = {};
        temp["status"] = true;
        temp["data"] = { ...node?.["data"] };
        setAccountClicked(temp);
      }}
      // legends={[
      //   {
      //     // anchor: "bottom-right",
      //     anchor: "top-left",
      //     // direction: "row",
      //     direction: "column",
      //     justify: false,
      //     // translateX: 20,
      //     translateX: -120,
      //     // translateY: 56,
      //     // translateY: 0,
      //     itemsSpacing: 15,
      //     itemWidth: 120,
      //     itemHeight: 10,
      //     itemTextColor: "#000",
      //     itemDirection: "left-to-right",
      //     itemOpacity: 1,
      //     symbolSize: 14,
      //     symbolShape: "circle",
      //     effects: [
      //       {
      //         on: "hover",
      //         style: {
      //           itemTextColor: "#000",
      //         },
      //       },
      //     ],
      //   },
      // ]}
    />
    // )}
    // </div>
  );
};

export default MyResponsivePie2;
