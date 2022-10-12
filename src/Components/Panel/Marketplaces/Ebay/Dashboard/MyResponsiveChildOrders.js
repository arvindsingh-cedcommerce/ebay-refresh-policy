import { ResponsivePie } from "@nivo/pie";
import React, { useEffect, useState } from "react";
import { animated } from "@react-spring/web";
import { Stack } from "@shopify/polaris";

const MyResponsiveChildOrders = ({ accountClickedOrders }) => {
  // let tempData = accountClickedOrders
  //   console.log(accountClickedOrders.data);
  // let tempData = [];
  const [tempData, setTempData] = useState([]);
  console.log("new pie 3");

  useEffect(() => {
    let temp = [...tempData];
    for (const key in accountClickedOrders.data) {
      let tempObj = {};
      switch (key) {
        case "unfulfilledOrders":
          tempObj["id"] = key;
          tempObj["label"] = "Not Uploaded";
          tempObj["value"] = accountClickedOrders.data[key];
          tempObj["color"] = "#40e0d0";
          temp.push(tempObj);
          break;
        case "fulfilledOrders":
          tempObj["id"] = key;
          tempObj["label"] = "Uploaded";
          tempObj["value"] = accountClickedOrders.data[key];
          tempObj["color"] = "#4169e1";
          temp.push(tempObj);
          break;
        case "cancelledOrders":
          tempObj["id"] = key;
          tempObj["label"] = "Error";
          tempObj["value"] = accountClickedOrders.data[key];
          tempObj["color"] = "#6a5acd";
          temp.push(tempObj);
          break;
        case "failedOrders":
          tempObj["id"] = key;
          tempObj["label"] = "Ended";
          tempObj["value"] = accountClickedOrders.data[key];
          tempObj["color"] = "#0047ab";
          temp.push(tempObj);
          break;
        default:
          break;
      }
    }
    setTempData(temp);
  }, []);

  return (
    <ResponsivePie
      arcLabelsComponent={({ datum, label, style }) => { if(datum.value >0) return (
        <animated.g
          transform={style.transform}
          style={{ pointerEvents: "none" }}
        >
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
      )
       else return <></>
      }}
      data={tempData}
      margin={{
        top: 55,
        bottom: 55,
      }}
      fit={true}
      tooltip={(point) => {
       if(point.datum.value>0)
        return (
          <div
            style={{
              background: "#DDE4E5",
              padding: "10px",
              borderRadius: 5,
            }}
          >
            <b>
              {point.datum.label}: {point.datum.value} orders
            </b>
          </div>
        );
        else
          return <></>;
      }}
      arcLabel={(point) => {
        if(point.value>0)
        return `${point.value}`;
        else
        return "";
      }}
      colors={{ datum: "data.color" }}
      sortByValue={true}
      innerRadius={0.5}
      padAngle={0}
      cornerRadius={0}
      activeOuterRadiusOffset={8}
      // borderWidth={1}
      // borderColor={{
      //   from: "color",
      //   modifiers: [["darker", 0.2]],
      // }}
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
    />
  );
};

export default MyResponsiveChildOrders;
