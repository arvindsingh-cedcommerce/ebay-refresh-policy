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
import React from "react";

const { Panel } = Collapse;
const { Text } = Typography;

const NewFilterComponentSimilarPolaris = ({
  setFiltersDrawerVisible,
  filtersDrawerVisible,
  filters,
  setFilters,
  // operatorOptions,
  gatherAllFilters,
  numberOperatorOptions,
  stringOperatorOptions,
  setFiltersToPass,
  setFilterTitleORsku,
  setSelected,
}) => {
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
              setFiltersToPass("");
              setFilterTitleORsku("");
              setSelected({
                profile_name: [],
                product_type: [],
                vendor: [],
                status: [],
              });
            }}
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
                    placeholder={filters[filter]["placeholder"]}
                    onChange={(e) => {
                      let cloneObj = { ...filters };
                      cloneObj[filter]["value"] = e.target.value;
                      setFilters(cloneObj);
                    }}
                    type={
                      filters[filter]["dataType"] === "number"
                        ? "number"
                        : "text"
                    }
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

export default NewFilterComponentSimilarPolaris;