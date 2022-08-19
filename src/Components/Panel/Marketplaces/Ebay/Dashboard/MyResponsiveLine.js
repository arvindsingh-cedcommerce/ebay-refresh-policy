import { ResponsiveLine } from "@nivo/line";
import React from "react";
const data = [
  {
    id: "japan",
    color: "hsl(88, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 258,
      },
      {
        x: "helicopter",
        y: 145,
      },
      {
        x: "boat",
        y: 69,
      },
      {
        x: "train",
        y: 40,
      },
      {
        x: "subway",
        y: 263,
      },
      {
        x: "bus",
        y: 92,
      },
      {
        x: "car",
        y: 263,
      },
      {
        x: "moto",
        y: 155,
      },
      {
        x: "bicycle",
        y: 181,
      },
      {
        x: "horse",
        y: 252,
      },
      {
        x: "skateboard",
        y: 68,
      },
      {
        x: "others",
        y: 111,
      },
    ],
  },
  {
    id: "france",
    color: "hsl(222, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 192,
      },
      {
        x: "helicopter",
        y: 95,
      },
      {
        x: "boat",
        y: 1,
      },
      {
        x: "train",
        y: 133,
      },
      {
        x: "subway",
        y: 108,
      },
      {
        x: "bus",
        y: 279,
      },
      {
        x: "car",
        y: 201,
      },
      {
        x: "moto",
        y: 202,
      },
      {
        x: "bicycle",
        y: 207,
      },
      {
        x: "horse",
        y: 8,
      },
      {
        x: "skateboard",
        y: 105,
      },
      {
        x: "others",
        y: 167,
      },
    ],
  },
  {
    id: "us",
    color: "hsl(191, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 91,
      },
      {
        x: "helicopter",
        y: 149,
      },
      {
        x: "boat",
        y: 119,
      },
      {
        x: "train",
        y: 17,
      },
      {
        x: "subway",
        y: 237,
      },
      {
        x: "bus",
        y: 240,
      },
      {
        x: "car",
        y: 60,
      },
      {
        x: "moto",
        y: 18,
      },
      {
        x: "bicycle",
        y: 81,
      },
      {
        x: "horse",
        y: 120,
      },
      {
        x: "skateboard",
        y: 29,
      },
      {
        x: "others",
        y: 214,
      },
    ],
  },
  {
    id: "germany",
    color: "hsl(84, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 112,
      },
      {
        x: "helicopter",
        y: 253,
      },
      {
        x: "boat",
        y: 138,
      },
      {
        x: "train",
        y: 85,
      },
      {
        x: "subway",
        y: 261,
      },
      {
        x: "bus",
        y: 164,
      },
      {
        x: "car",
        y: 144,
      },
      {
        x: "moto",
        y: 225,
      },
      {
        x: "bicycle",
        y: 245,
      },
      {
        x: "horse",
        y: 71,
      },
      {
        x: "skateboard",
        y: 133,
      },
      {
        x: "others",
        y: 59,
      },
    ],
  },
  {
    id: "norway",
    color: "hsl(35, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 158,
      },
      {
        x: "helicopter",
        y: 89,
      },
      {
        x: "boat",
        y: 183,
      },
      {
        x: "train",
        y: 167,
      },
      {
        x: "subway",
        y: 197,
      },
      {
        x: "bus",
        y: 117,
      },
      {
        x: "car",
        y: 108,
      },
      {
        x: "moto",
        y: 236,
      },
      {
        x: "bicycle",
        y: 66,
      },
      {
        x: "horse",
        y: 144,
      },
      {
        x: "skateboard",
        y: 142,
      },
      {
        x: "others",
        y: 120,
      },
    ],
  },
];
const MyResponsiveLine = ({ revenueAnalyticsDataAllTypes }) => {
  const { revenueYearlyData } = revenueAnalyticsDataAllTypes;
  console.log(revenueYearlyData);
  if (revenueYearlyData) {
    return (
      <ResponsiveLine
        data={revenueYearlyData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="basis"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "transportation",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    );
  }
  return <>Loading</>;
};

export default MyResponsiveLine;
