import { Tabs } from "antd";
import React from "react";

const TabsComponent = ({ tabContents, type }) => {
  const { TabPane } = Tabs;

  function callback(key) {
    // console.log(key);
  }

  return (
    <Tabs defaultActiveKey="1" onChange={callback} type={type}>
      {Object.keys(tabContents).map((tabContent) => {
        return (
          <TabPane tab={tabContent} key={tabContent}>
            {tabContents[tabContent]}
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default TabsComponent;
