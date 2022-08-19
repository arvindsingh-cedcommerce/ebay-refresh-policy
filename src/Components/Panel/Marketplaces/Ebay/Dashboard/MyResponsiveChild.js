import { ResponsivePie } from "@nivo/pie";
import React, { useEffect, useState } from "react";
import { animated } from "@react-spring/web";
import { Stack } from "@shopify/polaris";

const MyResponsiveChild = ({ accountClicked }) => {
  // let tempData = accountClicked
//   console.log(accountClicked.data);
  // let tempData = [];
  const [tempData, setTempData] = useState([])
  useEffect(() => {
    let temp = [...tempData]
    for (const key in accountClicked.data) {
      let tempObj = {};
      switch (key) {
        case "notUploaded":
          tempObj["id"] = key;
          tempObj["label"] = "Not Uploaded";
          tempObj["value"] = accountClicked.data[key];
          tempObj["color"] = "#40e0d0";
          temp.push(tempObj);
          break;
        case "uploaded":
          tempObj["id"] = key;
          tempObj["label"] = "Uploaded";
          tempObj["value"] = accountClicked.data[key];
          tempObj["color"] = "#4169e1";
          temp.push(tempObj);
          break;
        case "error":
          tempObj["id"] = key;
          tempObj["label"] = "Error";
          tempObj["value"] = accountClicked.data[key];
          tempObj["color"] = "#6a5acd";
          temp.push(tempObj);
          break;
        case "ended":
          tempObj["id"] = key;
          tempObj["label"] = "Ended";
          tempObj["value"] = accountClicked.data[key];
          tempObj["color"] = "#0047ab";
          temp.push(tempObj);
          break;
        default:
          break;
      }
    }
    setTempData(temp)
  }, []);

  return (
    <ResponsivePie
      arcLabelsComponent={({ datum, label, style }) => (
        <animated.g
          transform={style.transform}
          style={{ pointerEvents: "none" }}
        >
          {/* <circle fill={style.textColor} cy={6} r={15} />
          <circle fill="#ffffff" stroke={datum.color} strokeWidth={2} r={16} /> */}
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={style.textColor}
            style={{
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {label}
          </text>
        </animated.g>
      )}
      //   layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
      // enableArcLabels={false}
      data={tempData}
      margin={{
        top: 55,
        // right: -200,
        bottom: 55,
        // left: 150,
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
            <b>
              {point.datum.label}: {point.datum.value} products
            </b>
          </div>
        );
      }}
      arcLabel={(point) => {
        return `${point.value}`;
      }}
      colors={{ datum: "data.color" }}
      // enableArcLinkLabels={true}
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
      // legends={[
      //   {
      //     // anchor: "bottom-right",
      //     anchor: "top-left",
      //     // direction: "row",
      //     direction: "column",
      //     justify: false,
      //   //   translateX: 20,
      //   //   translateX: -120,
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
  );
};

export default MyResponsiveChild;
