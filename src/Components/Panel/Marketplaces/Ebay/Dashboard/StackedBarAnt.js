import { Column } from "@ant-design/plots";
import { Stack } from "@shopify/polaris";
import { Spin } from "antd";
import React from "react";
import NoDataFound from "../../../../../assets/data_nahi.png";

const StackedBarAnt = ({
  orderAnalyticsDataAllTypes,
  orderAnalyticsYearlyMonthlyWeekly,
}) => {
  if (orderAnalyticsYearlyMonthlyWeekly === "yearly") {
    const { orderYearlyData, hasOrderYearlyData } = orderAnalyticsDataAllTypes;
    if (orderYearlyData) {
      var tempOrderYearlyData = orderYearlyData.map((order) => {
        let correctValues = {};
        correctValues["name"] = order["name"];
        if (order["orderCount"] > 0)
          correctValues["orderCount"] = order["orderCount"];
        correctValues["year"] = order["year"];
        return correctValues;
      });
    }
    if (!hasOrderYearlyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      tempOrderYearlyData &&
      Array.isArray(tempOrderYearlyData) &&
      tempOrderYearlyData.length
    ) {
      const configStackedBar = {
        data: tempOrderYearlyData,
        isStack: true,
        xField: "year",
        yField: "orderCount",
        seriesField: "name",
        legend: {
          layout: "horizontal",
          position: "bottom",
          flipPage: false,
        },
        label: {
          position: "middle",
          layout: [
            {
              name: "interval-adjust-position",
            },
            {
              name: "interval-hide-overlap",
            },
            {
              name: "adjust-color",
            },
          ],
        },
      };
      return <Column height={300} {...configStackedBar} />;
    }
    return (
      <Stack>
        <Spin size="large" />
      </Stack>
    );
  } else if (orderAnalyticsYearlyMonthlyWeekly === "monthly") {
    const { orderMonthlyData, hasOrderMonthlyData } =
      orderAnalyticsDataAllTypes;
    if (orderMonthlyData) {
      var tempOrderMonthlyData = orderMonthlyData.map((order) => {
        let correctValues = {};
        correctValues["name"] = order["name"];
        if (order["orderCount"] > 0)
          correctValues["orderCount"] = order["orderCount"];
        correctValues["month"] = order["month"];
        return correctValues;
      });
    }
    if (!hasOrderMonthlyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      tempOrderMonthlyData &&
      Array.isArray(tempOrderMonthlyData) &&
      tempOrderMonthlyData.length
    ) {
      const configStackedBar = {
        data: tempOrderMonthlyData,
        isStack: true,
        xField: "month",
        yField: "orderCount",
        seriesField: "name",
        label: {
          position: "middle",
          layout: [
            {
              name: "interval-adjust-position",
            },
            {
              name: "interval-hide-overlap",
            },
            {
              name: "adjust-color",
            },
          ],
        },
        legend: {
          layout: "horizontal",
          position: "bottom",
          flipPage: false,
        },
      };
      return <Column height={300} {...configStackedBar} />;
    }
    return <>Loading</>;
  } else if (orderAnalyticsYearlyMonthlyWeekly === "weekly") {
    const { orderWeeklyData, hasOrderWeeklyData } = orderAnalyticsDataAllTypes;
    if (orderWeeklyData) {
      var tempOrderWeeklyData = orderWeeklyData.map((order) => {
        let correctValues = {};
        correctValues["name"] = order["name"];
        if (order["orderCount"] > 0)
          correctValues["orderCount"] = order["orderCount"];
        correctValues["week"] = order["week"];
        return correctValues;
      });
    }
    if (!hasOrderWeeklyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      tempOrderWeeklyData &&
      Array.isArray(tempOrderWeeklyData) &&
      tempOrderWeeklyData.length
    ) {
      const configStackedBar = {
        data: tempOrderWeeklyData,
        isStack: true,
        xField: "week",
        yField: "orderCount",
        seriesField: "name",
        legend: {
          layout: "horizontal",
          position: "bottom",
          flipPage: false,
        },
        label: {
          position: "middle",
          layout: [
            {
              name: "interval-adjust-position",
            },
            {
              name: "interval-hide-overlap",
            },
            {
              name: "adjust-color",
            },
          ],
        },
      };
      return <Column height={300} {...configStackedBar} />;
    }
    return <>Loading</>;
  }
  return <>Loading</>;
};

export default StackedBarAnt;
