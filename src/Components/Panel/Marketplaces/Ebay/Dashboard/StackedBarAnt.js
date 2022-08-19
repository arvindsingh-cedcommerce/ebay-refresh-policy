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
    if (!hasOrderYearlyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      orderYearlyData &&
      Array.isArray(orderYearlyData) &&
      orderYearlyData.length
    ) {
      const configStackedBar = {
        data: orderYearlyData,
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
    if (!hasOrderMonthlyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      orderMonthlyData &&
      Array.isArray(orderMonthlyData) &&
      orderMonthlyData.length
    ) {
      // console.log(orderMonthlyData);
      const configStackedBar = {
        data: orderMonthlyData,
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
    if (!hasOrderWeeklyData) {
      return (
        <Stack distribution="center">
          <img src={NoDataFound} width="100%" />
        </Stack>
      );
    } else if (
      orderWeeklyData &&
      Array.isArray(orderWeeklyData) &&
      orderWeeklyData.length
    ) {
      const configStackedBar = {
        data: orderWeeklyData,
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
