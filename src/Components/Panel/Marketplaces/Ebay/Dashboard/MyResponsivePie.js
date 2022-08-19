import { ResponsivePie } from "@nivo/pie";
import { Card, Stack } from "@shopify/polaris";
import React, { useEffect } from "react";
import { animated } from "@react-spring/web";

const MyResponsivePie = ({
  productAnalyticsData,
  uniquesColors,
  accountClicked,
  setAccountClicked,
  accountClickedDetails,
}) => {
  // console.log("productAnalyticsData", productAnalyticsData);
  let tempData = productAnalyticsData.map((productData, index) => {
    // console.log(productData);
    productData["color"] = uniquesColors[index];
    productData["label"] = productData["id"];
    return productData;
  });

  // const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
  //   let total = 0;
  //   dataWithArc.forEach((datum) => {
  //     total += datum.value;
  //   });

  //   return (
  //     <text
  //       x={centerX}
  //       y={centerY}
  //       textAnchor="middle"
  //       dominantBaseline="central"
  //       style={{
  //         fontSize: "25px",
  //         fontWeight: 600,
  //       }}
  //     >
  //       {total}
  //     </text>
  //   );
  // };

  return (
    <div style={{ height: 350 }}>
      {accountClickedDetails &&
        Object.keys(accountClickedDetails).length === 0 &&
        Object.getPrototypeOf(accountClickedDetails) === Object.prototype && (
          <ResponsivePie
            arcLabelsComponent={({ datum, label, style }) => (
              <animated.g
                transform={style.transform}
                style={{ pointerEvents: "none" }}
              >
                <circle fill={style.textColor} cy={6} r={15} />
                <circle
                  fill="#ffffff"
                  stroke={datum.color}
                  strokeWidth={2}
                  r={16}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={style.textColor}
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  {label}
                </text>
              </animated.g>
            )}
            layers={[
              "arcs",
              "arcLabels",
              "arcLinkLabels",
              "legends",
              // CenteredMetric,
            ]}
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
                  }}
                >
                  <Stack vertical spacing="extraTight">
                    <b>
                      {point.datum.label}: {point.datum.value} products
                    </b>
                    <>Uploaded - {point.datum.data.uploaded} products</>
                    <>Not Uploaded - {point.datum.data.notUploaded} products</>
                    <>Error - {point.datum.data.error} products</>
                    <>Ended - {point.datum.data.ended} products</>
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
            innerRadius={0.9}
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
            //     translateX: 20,
            //     // translateX: -120,
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
        )}
    </div>
  );
};

export default MyResponsivePie;
