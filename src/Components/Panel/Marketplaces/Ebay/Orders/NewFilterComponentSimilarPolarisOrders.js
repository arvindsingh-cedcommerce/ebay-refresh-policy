import { QuestionCircleOutlined } from "@ant-design/icons";
import { Stack } from "@shopify/polaris";
import {
  Button,
  Collapse,
  Drawer,
  Input,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect } from "react";

const { Panel } = Collapse;
const { Text } = Typography;

const NewFilterComponentSimilarPolarisOrders = ({
  setFiltersDrawerVisible,
  filtersDrawerVisible,
  filters,
  setFilters,
  initialMoreFiltersObj,
  // operatorOptions,
  gatherAllFilters,
  numberOperatorOptions,
  stringOperatorOptions,
  setFiltersToPass,
  setFilterTitleORsku,
  setSelected,
}) => {
  const getInitialOperatorValue=(currentFilter)=>{
    let filterObj="";
    let arr;
    arr=Object.keys(initialMoreFiltersObj)?.filter((moreFilterObj,index)=>{
     let indexOfFirstOpeningBracket = moreFilterObj.indexOf("[");
     let indexOfFirstClosingBracket = moreFilterObj.indexOf("]");
     let indexOfSecondOpeningBracket = moreFilterObj.indexOf(
       "[",
       indexOfFirstOpeningBracket + 1
     );
     let indexOfSecondClosingBracket = moreFilterObj.indexOf(
       "]",
       indexOfFirstClosingBracket + 1
     );
     let mainItem = moreFilterObj.substring(
       indexOfFirstOpeningBracket + 1,
       indexOfFirstClosingBracket
     );
     let operatorValue = moreFilterObj.substring(
       indexOfSecondOpeningBracket + 1,
       indexOfSecondClosingBracket
     );
     if(mainItem===currentFilter)
     {
           filterObj= {
             "filter":moreFilterObj,
             "operatorValue":operatorValue
           };
         return moreFilterObj;
     }
    });
    return filterObj;
  }
  useEffect(()=>{
    const obj={...filters};
    Object.keys(filters).map((filter, index) => {
            let initialFilterOperatorValue=getInitialOperatorValue(filter);
     
           let initialFilterMainValue=getInitialOperatorValue(filter);
           if(initialFilterOperatorValue && initialFilterMainValue)
           {
           obj[filter].operator=initialFilterOperatorValue?.operatorValue;
           obj[filter].value=initialMoreFiltersObj[`${initialFilterMainValue?.filter}`];
       
          }
  
            // if(initialFilterOperatorValue)
            // {
             
            //   initialFilterOperatorValue=initialFilterOperatorValue?.operatorValue;
            // }
           
      //      if(initialFilterMainValue)
      //      {
      //  console.log("valuess",initialMoreFiltersObj);     
      //  console.log("valuess 1",`${initialFilterMainValue?.filter}`);
      //       initialFilterMainValue=initialMoreFiltersObj[`${initialFilterMainValue?.filter}`];
      //      }
  });
  setFilters({...obj});
  },[]);
  return (
    <Drawer
      title="Filters"
      placement={"right"}
      width={400}
      onClose={() => {
        setFiltersDrawerVisible(false);
      }}
      visible={filtersDrawerVisible}
      extra={
        <Space>
          <Button
            onClick={() => {
              Object.keys(filters).forEach((filter) => {
                let cloneObj = { ...filters };
                cloneObj[filter]["value"] = "";
                setFilters(cloneObj);
              });
              gatherAllFilters();
              setFiltersDrawerVisible(false);
              setFiltersToPass({filtersPresent:false});
              setFilterTitleORsku("");
              setSelected({
                profile_name: [],
                product_type: [],
                vendor: [],
                status: [],
              });
            }}
            disabled={false}
          >
            Clear All Filters
          </Button>
          <Button
            type="primary"
            onClick={() => {
              gatherAllFilters();
              setFiltersDrawerVisible(false);
            }}
          >
            Apply
          </Button>
        </Space>
      }
    >
      <Collapse
        defaultActiveKey={false}
        onChange={() => {}}
        ghost
        expandIconPosition={"right"}
      >
        {Object.keys(filters).map((filter, index) => {
          return (
            <Panel
              header={
                filters[filter]["label"] === "Inventory" ? (
                  <Stack>
                    <Text strong>Inventory</Text>
                    <Tooltip title="Applies only on simple and variation options.">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Stack>
                ) : (
                  <Text strong>{filters[filter]["label"]}</Text>
                )
              }
              key={index}
            >
              <Stack vertical spacing="extraTight">
                <Select
                  disabled={filters[filter]?.["options"] ? true : false}
                  options={
                    filters[filter]["dataType"] === "string"
                      ? stringOperatorOptions
                      : numberOperatorOptions
                  }
                  style={{
                    width: "100%",
                    lineHeight: "2.4rem",
                    borderRadius: "2px !important",
                  }}
                  value={filters[filter]["operator"]}
                  onChange={(e) => {
                    let cloneObj = { ...filters };
                    cloneObj[filter]["operator"] = e;
                    setFilters(cloneObj);
                  }}
                />
                {filters[filter]?.["options"] ? (
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Please Select..."
                    options={filters[filter]["options"]}
                    value={filters[filter]["value"]}
                    onChange={(e) => {
                      let cloneObj = { ...filters };
                      cloneObj[filter]["value"] = e;
                      setFilters(cloneObj);
                    }}
                    showSearch
                  />
                ) : (
                  <Input
                    style={{
                      width: "100%",
                      lineHeight: "2.4rem",
                      fontSize: "1.4rem",
                      borderRadius: "2px !important",
                    }}
                    value={filters[filter]["value"]}
                    onChange={(e) => {
                      let cloneObj = { ...filters };
                      cloneObj[filter]["value"] = e.target.value;
                      setFilters(cloneObj);
                    }}
                  />
                )}
              </Stack>
            </Panel>
          );
        })}
      </Collapse>
    </Drawer>
  );
};

export default NewFilterComponentSimilarPolarisOrders;
