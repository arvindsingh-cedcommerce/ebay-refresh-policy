import { Column, Line } from "@ant-design/plots";
import { Stack } from "@shopify/polaris";
import React from "react";
import NoDataFound from "../../../../../assets/data_nahi.png";

const StackedLineAnt = ({
  revenueAnalyticsDataAllTypes,
  orderAnalyticsYearlyMonthlyWeekly,
}) => {
  console.log(revenueAnalyticsDataAllTypes);
  if (orderAnalyticsYearlyMonthlyWeekly === "yearly") {
    const { revenueYearlyData, hasRevenueYearlyData } =
      revenueAnalyticsDataAllTypes;
    if (!hasRevenueYearlyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      revenueYearlyData &&
      Array.isArray(revenueYearlyData) &&
      revenueYearlyData.length
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
    if (!hasRevenueMonthlyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      revenueMonthlyData &&
      Array.isArray(revenueMonthlyData) &&
      revenueMonthlyData.length
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
    if (!hasRevenueWeeklyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      revenueWeeklyData &&
      Array.isArray(revenueWeeklyData) &&
      revenueWeeklyData.length
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
