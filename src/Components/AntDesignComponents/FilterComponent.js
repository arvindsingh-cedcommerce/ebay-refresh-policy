import {
  Button,
  Collapse,
  Drawer,
  Input,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";

const { Panel } = Collapse;
const { Text, Link } = Typography;

const fieldOptionsProducts = [
  { label: "Title", value: "title", searchType: "textField" },
  { label: "Product Type", value: "product_type", searchType: "textField" },
  { label: "Price", value: "price", searchType: "textField" },
  { label: "Inventory", value: "inventory", searchType: "textField" },
  { label: "SKU", value: "sku", searchType: "textField" },
  { label: "eBay Item ID", value: "listing_id", searchType: "textField" },
  { label: "Tags", value: "tags", searchType: "textField" },
  { label: "Profile", value: "profile", searchType: "textField" },
  { label: "Vendor", value: "vendor", searchType: "textField" },
  {
    label: "Variant Attribute",
    value: "variant_attribute",
    searchType: "textField",
  },
];

const fieldOptionsOrder = [
  { label: "eBay Order Id", value: "source_order_id", searchType: "textField" },
  {
    label: "Shopify Order Name",
    value: "shopify_order_name",
    searchType: "textField",
  },
  {
    label: "Shopify Order Id",
    value: "target_order_id",
    searchType: "textField",
  },
  {
    label: "Customer Name",
    value: "client_details.name",
    searchType: "textField",
  },
];

const fieldOptionsActivities = [
  { label: "Country", value: "country", searchType: "textField" },
  { label: "Message", value: "message", searchType: "textField" },
]

export const operatorOptions = [
  { label: "equals", value: "1" },
  { label: "not equals", value: "2" },
  { label: "contains", value: "3" },
  { label: "does not contains", value: "4" },
  { label: "starts with", value: "5" },
  { label: "ends with", value: "6" },
  // { label: "greater than or equal to", value: "greaterThanOrEqualTo" },
  // { label: "less than or equal to", value: "lessThanOrEqualTo" },
];

const FilterComponent = ({
  setFiltersDrawerVisible,
  filtersDrawerVisible,
  gatherAllFilters,
  filtersSource,
}) => {
  const [selectedOperator, setSelectedOperator] = useState({
    title: "3",
    product_type: "3",
    price: "3",
    inventory: "3",
    sku: "3",
    listing_id: "3",
    tags: "3",
    profile: "3",
    vendor: "3",
    variant_attribute: "3",
    source_order_id: "3",
    shopify_order_name: "3",
    target_order_id: "3",
    "client_details.name": "3",
    country: '3',
    message: '3'
  });
  const [inputValue, setInputValue] = useState({
    title: "",
    product_type: "",
    price: "",
    inventory: "",
    sku: "",
    listing_id: "",
    tags: "",
    profile: "",
    vendor: "",
    variant_attribute: "",
    source_order_id: "",
    shopify_order_name: "",
    target_order_id: "",
    "client_details.name": "",
  });
  const [selectedValue, setSelectedValue] = useState("");

  let fieldOptions = [];
  if (filtersSource === "orders") {
    fieldOptions = fieldOptionsOrder;
  } else if (filtersSource === 'activities') {
    fieldOptions = fieldOptionsActivities;
  } else {
    fieldOptions = fieldOptionsProducts;
  }

  return (
    <div>
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
            <Button onClick={() => setFiltersDrawerVisible(false)}>
              Clear
            </Button>
            <Button
              type="primary"
              onClick={() => {
                gatherAllFilters(selectedOperator, inputValue);
              }}
            >
              Apply
            </Button>
          </Space>
        }
      >
        <Collapse
          defaultActiveKey={false}
          onChange={() => { }}
          ghost
          expandIconPosition={"right"}
        >
          {fieldOptions.map((field, index) => {
            return (
              <Panel header={<Text strong>{field.label}</Text>} key={index}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Select
                    options={operatorOptions}
                    style={{ width: "100%", marginBottom: "10px" }}
                    value={selectedOperator[field.value]}
                    onChange={(e) => {
                      setSelectedOperator({
                        ...selectedOperator,
                        [field.value]: e,
                      });
                    }}
                  />
                  {field.searchType === "dropdown" ? (
                    <Select
                      style={{ width: "100%" }}
                      value={selectedValue}
                      onChange={(value) => {
                        selectedValue(value);
                      }}
                    />
                  ) : (
                    <Input
                      style={{ width: "100%" }}
                      value={inputValue[field.value]}
                      onChange={(e) => {
                        setInputValue({
                          ...inputValue,
                          [field.value]: e.target.value,
                        });
                      }}
                    />
                  )}
                </div>
              </Panel>
            );
          })}
        </Collapse>
      </Drawer>
    </div>
  );
};

export default FilterComponent;
