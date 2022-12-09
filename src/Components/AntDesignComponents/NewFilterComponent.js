import {
  Button,
  Collapse,
  Drawer,
  Input,
  Select,
  Space,
  Typography,
} from "antd";
import React from "react";

const { Panel } = Collapse;
const { Text } = Typography;

const NewFilterComponent = ({
  setFiltersDrawerVisible,
  filtersDrawerVisible,
  filters,
  setFilters,
  operatorOptions,
  gatherAllFilters,
}) => {
  return (
    <Drawer
      title="Filters"
      placement={"right"}
      width={500}
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
            <Panel header={<Text strong>{filters[filter]["label"]}</Text>} key={index}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Select
                  options={operatorOptions}
                  style={{ width: "100%", marginBottom: "10px" }}
                  value={filters[filter]["operator"]}
                  onChange={(e) => {
                    let cloneObj = { ...filters };
                    cloneObj[filter]["operator"] = e;
                    setFilters(cloneObj);
                  }}
                />
                <Input
                  style={{ width: "100%" }}
                  value={filters[filter]["value"]}
                  onChange={(e) => {
                    let cloneObj = { ...filters };
                    cloneObj[filter]["value"] = e.target.value;
                    setFilters(cloneObj);
                  }}
                />
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </Drawer>
  );
};

export default NewFilterComponent;
