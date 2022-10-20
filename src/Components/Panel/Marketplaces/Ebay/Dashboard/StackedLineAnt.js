import { Column, Line } from "@ant-design/plots";
import { Stack } from "@shopify/polaris";
import React from "react";
import NoDataFound from "../../../../../assets/data_nahi.png";

const StackedLineAnt = ({
  revenueAnalyticsDataAllTypes,
  orderAnalyticsYearlyMonthlyWeekly,
}) => {
  if (orderAnalyticsYearlyMonthlyWeekly === "yearly") {
    const { revenueYearlyData, hasRevenueYearlyData } =
      revenueAnalyticsDataAllTypes;
    if (revenueYearlyData) {
      var tempRevenueYearlyData = revenueYearlyData.map((order) => {
        let correctValues = {};
        correctValues["name"] = order["name"];
        if (order["revenueCount"] > 0)
          correctValues["revenueCount"] = order["revenueCount"];
        correctValues["year"] = order["year"];
        return correctValues;
      });
    }
    if (!hasRevenueYearlyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      tempRevenueYearlyData &&
      Array.isArray(tempRevenueYearlyData) &&
      tempRevenueYearlyData.length
    ) {
      const config = {
        data: revenueYearlyData,
        xField: "year",
        yField: "revenueCount",
        seriesField: "name",
        yAxis: {
          label: {
            formatter: (v) => v,
          },
        },
        // legend: {
        //   position: "top",
        // },
        legend: {
          layout: "horizontal",
          position: "bottom",
          flipPage: false,
        },
        smooth: true,
        animation: {
          appear: {
            animation: "path-in",
            duration: 3000,
          },
        },
      };
      return <Line height={300} {...config} />;
    }
    return <>Loading</>;
  } else if (orderAnalyticsYearlyMonthlyWeekly === "monthly") {
    const { revenueMonthlyData, hasRevenueMonthlyData } =
      revenueAnalyticsDataAllTypes;
    if (revenueMonthlyData) {
      var tempRevenueMonthlyData = revenueMonthlyData.map((order) => {
        let correctValues = {};
        correctValues["name"] = order["name"];
        if (order["revenueCount"] > 0)
          correctValues["revenueCount"] = order["revenueCount"];
        correctValues["month"] = order["month"];
        return correctValues;
      });
    }
    if (!hasRevenueMonthlyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      tempRevenueMonthlyData &&
      Array.isArray(tempRevenueMonthlyData) &&
      tempRevenueMonthlyData.length
    ) {
      const config = {
        data: revenueMonthlyData,
        xField: "month",
        yField: "revenueCount",
        seriesField: "name",
        yAxis: {
          label: {
            formatter: (v) => v,
          },
        },
        legend: {
          layout: "horizontal",
          position: "bottom",
          flipPage: false,
        },
        smooth: true,
        animation: {
          appear: {
            animation: "path-in",
            duration: 3000,
          },
        },
      };
      return <Line height={300} {...config} />;
    }
    return <>Loading</>;
  } else if (orderAnalyticsYearlyMonthlyWeekly === "weekly") {
    const { revenueWeeklyData, hasRevenueWeeklyData } =
      revenueAnalyticsDataAllTypes;
    if (revenueWeeklyData) {
      var tempRevenueWeeklyData = revenueWeeklyData.map((order) => {
        let correctValues = {};
        correctValues["name"] = order["name"];
        if (order["revenueCount"] > 0)
          correctValues["revenueCount"] = order["revenueCount"];
        correctValues["week"] = order["week"];
        return correctValues;
      });
    }
    if (!hasRevenueWeeklyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      tempRevenueWeeklyData &&
      Array.isArray(tempRevenueWeeklyData) &&
      tempRevenueWeeklyData.length
    ) {
      const config = {
        data: revenueWeeklyData,
        xField: "week",
        yField: "revenueCount",
        seriesField: "name",
        yAxis: {
          label: {
            formatter: (v) => v,
          },
        },
        legend: {
          layout: "horizontal",
          position: "bottom",
          flipPage: false,
        },
        smooth: true,
        animation: {
          appear: {
            animation: "path-in",
            duration: 3000,
          },
        },
      };
      return <Line height={300} {...config} />;
    }
    return <>Loading</>;
  }
};

export default StackedLineAnt;
