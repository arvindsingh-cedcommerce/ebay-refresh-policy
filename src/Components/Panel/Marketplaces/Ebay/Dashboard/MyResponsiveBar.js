import { ResponsiveBar } from "@nivo/bar";
import React from "react";
const data = [
  {
    country: "AD",
    "hot dog": 88,
    "hot dogColor": "hsl(346, 70%, 50%)",
    burger: 166,
    burgerColor: "hsl(314, 70%, 50%)",
    sandwich: 170,
    sandwichColor: "hsl(163, 70%, 50%)",
    kebab: 100,
    kebabColor: "hsl(205, 70%, 50%)",
    fries: 124,
    friesColor: "hsl(63, 70%, 50%)",
    donut: 146,
    donutColor: "hsl(53, 70%, 50%)",
  },
  {
    country: "AE",
    "hot dog": 16,
    "hot dogColor": "hsl(100, 70%, 50%)",
    burger: 53,
    burgerColor: "hsl(174, 70%, 50%)",
    sandwich: 70,
    sandwichColor: "hsl(274, 70%, 50%)",
    kebab: 12,
    kebabColor: "hsl(232, 70%, 50%)",
    fries: 104,
    friesColor: "hsl(178, 70%, 50%)",
    donut: 199,
    donutColor: "hsl(63, 70%, 50%)",
  },
  {
    country: "AF",
    "hot dog": 95,
    "hot dogColor": "hsl(203, 70%, 50%)",
    burger: 14,
    burgerColor: "hsl(72, 70%, 50%)",
    sandwich: 183,
    sandwichColor: "hsl(176, 70%, 50%)",
    kebab: 107,
    kebabColor: "hsl(352, 70%, 50%)",
    fries: 18,
    friesColor: "hsl(195, 70%, 50%)",
    donut: 195,
    donutColor: "hsl(264, 70%, 50%)",
  },
  {
    country: "AG",
    "hot dog": 68,
    "hot dogColor": "hsl(291, 70%, 50%)",
    burger: 137,
    burgerColor: "hsl(157, 70%, 50%)",
    sandwich: 100,
    sandwichColor: "hsl(222, 70%, 50%)",
    kebab: 152,
    kebabColor: "hsl(352, 70%, 50%)",
    fries: 12,
    friesColor: "hsl(337, 70%, 50%)",
    donut: 136,
    donutColor: "hsl(29, 70%, 50%)",
  },
  {
    country: "AI",
    "hot dog": 88,
    "hot dogColor": "hsl(330, 70%, 50%)",
    burger: 3,
    burgerColor: "hsl(222, 70%, 50%)",
    sandwich: 71,
    sandwichColor: "hsl(340, 70%, 50%)",
    kebab: 41,
    kebabColor: "hsl(255, 70%, 50%)",
    fries: 100,
    friesColor: "hsl(276, 70%, 50%)",
    donut: 146,
    donutColor: "hsl(98, 70%, 50%)",
  },
  {
    country: "AL",
    "hot dog": 79,
    "hot dogColor": "hsl(27, 70%, 50%)",
    burger: 142,
    burgerColor: "hsl(304, 70%, 50%)",
    sandwich: 58,
    sandwichColor: "hsl(328, 70%, 50%)",
    kebab: 183,
    kebabColor: "hsl(256, 70%, 50%)",
    fries: 104,
    friesColor: "hsl(287, 70%, 50%)",
    donut: 155,
    donutColor: "hsl(287, 70%, 50%)",
  },
  {
    country: "AM",
    "hot dog": 11,
    "hot dogColor": "hsl(247, 70%, 50%)",
    burger: 157,
    burgerColor: "hsl(80, 70%, 50%)",
    sandwich: 114,
    sandwichColor: "hsl(279, 70%, 50%)",
    kebab: 13,
    kebabColor: "hsl(37, 70%, 50%)",
    fries: 144,
    friesColor: "hsl(87, 70%, 50%)",
    donut: 195,
    donutColor: "hsl(23, 70%, 50%)",
  },
];
const MyResponsiveBar = ({
  orderAnalyticsDataAllTypes,
  orderAnalyticsYearlyMonthlyWeekly,
}) => {
  if (orderAnalyticsYearlyMonthlyWeekly === "yearly") {
    const { orderYearlyData } = orderAnalyticsDataAllTypes;
    if (orderYearlyData) {
      const { data, indexBy, keys } = orderYearlyData;
      // console.log(data, indexBy, keys);
      return (
        <ResponsiveBar
          // gridYValues=[]
          maxValue={"auto"}
          data={data}
          keys={keys}
          indexBy={indexBy}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "fries",
              },
              id: "dots",
            },
            {
              match: {
                id: "sandwich",
              },
              id: "lines",
            },
          ]}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            // legend: indexBy,
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            // legend: "food",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          // legends={[
          //   {
          //     dataFrom: "keys",
          //     anchor: "bottom",
          //     direction: "row",
          //     justify: false,
          //     translateX: 0,
          //     translateY: 40,
          //     itemsSpacing: 2,
          //     itemWidth: 250,
          //     itemHeight: 20,
          //     itemDirection: "left-to-right",
          //     itemOpacity: 0.85,
          //     symbolSize: 20,
          //     effects: [
          //       {
          //         on: "hover",
          //         style: {
          //           itemOpacity: 1,
          //         },
          //       },
          //     ],
          //   },
          // ]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={function (e) {
            return (
              e.id + ": " + e.formattedValue + " in country: " + e.indexValue
            );
          }}
        />
      );
    }
  } else if (orderAnalyticsYearlyMonthlyWeekly === "monthly") {
    const { orderMonthlyData } = orderAnalyticsDataAllTypes;
    if (orderMonthlyData) {
      const { data, indexBy, keys } = orderMonthlyData;
      return (
        <ResponsiveBar
          maxValue={"auto"}
          data={data}
          keys={keys}
          indexBy={indexBy}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "fries",
              },
              id: "dots",
            },
            {
              match: {
                id: "sandwich",
              },
              id: "lines",
            },
          ]}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            // legend: indexBy,
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            // legend: "food",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={function (e) {
            return (
              e.id + ": " + e.formattedValue + " in country: " + e.indexValue
            );
          }}
        />
      );
    }
  } else if (orderAnalyticsYearlyMonthlyWeekly === "weekly") {
    const { orderWeeklyData } = orderAnalyticsDataAllTypes;
    if (orderWeeklyData) {
      const { data, indexBy, keys } = orderWeeklyData;
      // console.log(data, indexBy, keys);
      return (
        <ResponsiveBar
          // gridYValues=[]
          maxValue={"auto"}
          data={data}
          keys={keys}
          indexBy={indexBy}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "fries",
              },
              id: "dots",
            },
            {
              match: {
                id: "sandwich",
              },
              id: "lines",
            },
          ]}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            // legend: indexBy,
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            // legend: "food",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={function (e) {
            return (
              e.id + ": " + e.formattedValue + " in country: " + e.indexValue
            );
          }}
        />
      );
    }
  }
  return <>Loading</>;
};

export default MyResponsiveBar;
