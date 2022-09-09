import React, { useCallback, useEffect, useState } from "react";
import { Input, InputNumber, Form, Image, Switch } from "antd";
import NoProductImage from "../../../../../assets/notfound.png";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import {
  ActionList,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Popover,
  Stack,
} from "@shopify/polaris";
import {
  getrequest,
  postActionOnProductById,
} from "../../../../../APIrequests/ProductsAPI";
import { changeVariantStatusURL } from "../../../../../URLs/ProductsURL";
import { notify } from "../../../../../services/notify";

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: false,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const VariantComponentData = ({ dataSource, size }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [popoverActive, setPopoverActive] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      variantImage: "",
      variantTitle: "",
      variantSKU: "",
      variantBarcode: "",
      variantQuantity: "",
      variantPrice: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const getAllVariants = (data) => {
    let tempVariantData = [];
    tempVariantData = data.map((key, index) => {
      let tempObject = {};
      tempObject["key"] = index.toString();
      // tempObject["variantImage"] = key["variant_image"] ? (
      //   <Image width={50} src={key["variant_image"]} />
      // ) : (
      //   // <Image width={50} src={ImageResizer(key["variant_image"])} />
      //   <Image width={50} preview={false} src={NoProductImage} />
      // );
      tempObject["excluded"] = (
        <Stack>
          <>Included</>
          <Switch
            defaultChecked={key["isExclude"] ? true : false}
            onChange={async (e) => {
              const { source_product_id } = key;
              const postData = {};
              postData["variant_id"] = [source_product_id];
              postData["status"] = e ? "Exclude" : "Include";
              let { success, message, data } = await postActionOnProductById(
                changeVariantStatusURL,
                postData
              );
              if (success) {
                notify.success(message ? message : data);
              } else {
                notify.error(message ? message : data);
              }
              // setReactSwitchPlan(e);
            }}
            style={
              key["isExclude"]
                ? { background: "#1890ff" }
                : { background: "#1890ff" }
            }
          />
          <>Excluded</>
        </Stack>
      );
      tempObject["variantImage"] = key["main_image"] ? (
        <Image width={40} src={key["main_image"]} />
      ) : (
        // <Image width={50} src={ImageResizer(key["variant_image"])} />
        <Image width={40} preview={false} src={NoProductImage} />
      );
      tempObject["variantTitle"] = key["variant_title"];
      tempObject["variantSKU"] = key["sku"];
      tempObject["variantBarcode"] = key["barcode"] ? key["barcode"] : "N/A";
      tempObject["variantQuantity"] = key["quantity"];
      tempObject["variantPrice"] = key["price"];

      return tempObject;
    });
    setData(tempVariantData);
  };

  useEffect(() => {
    getAllVariants(dataSource);
  }, []);

  const columns = [
    {
      title: "Excluded",
      dataIndex: "excluded",
      key: "excluded",
      editable: false,
    },
    {
      title: "Image",
      dataIndex: "variantImage",
      key: "variantImage",
      // fixed: "left",
      // width: 75,
      editable: false,
    },
    {
      title: "Title",
      dataIndex: "variantTitle",
      key: "variantTitle",
      width: "33%",
      filters: dataSource.map((key, index) => {
        let tempObject = {};
        tempObject["text"] = key["variant_title"];
        tempObject["value"] = key["variant_title"];
        return tempObject;
      }),
      onFilter: (value, record) => {
        return record.variantTitle.indexOf(value) === 0;
      },
      // filteredValue: null,
      editable: true,
    },
    {
      title: "SKU",
      dataIndex: "variantSKU",
      key: "variantSKU",
      editable: true,
      // filters: [],
      // onFilter: (value, record) => record.variantSKU.indexOf(value) === 0,
    },
    {
      title: "Barcode",
      dataIndex: "variantBarcode",
      key: "variantBarcode",
      editable: true,
    },
    {
      title: "Inventory",
      dataIndex: "variantQuantity",
      key: "variantQuantity",
      sorter: (a, b) => a.variantQuantity - b.variantQuantity,
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "variantPrice",
      key: "variantPrice",
      sorter: () => {},
      editable: true,
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => {
        return {
          record,
          inputType: ["variantPrice", "variantQuantity"].includes(col.dataIndex)
            ? "number"
            : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      More actions
    </Button>
  );

  return (
    // <Form form={form} component={false}>
    // <Card
    //   sectioned
    //   // actions={[
    //   //   {
    //   //     content: (
    //   //       <Popover
    //   //         active={popoverActive}
    //   //         activator={activator}
    //   //         autofocusTarget="first-node"
    //   //         onClose={togglePopoverActive}
    //   //       >
    //   //         <ActionList
    //   //           actionRole="menuitem"
    //   //           items={[{ content: "Import" }, { content: "Export" }]}
    //   //         />
    //   //       </Popover>
    //   //     ),
    //   //   },
    //   // ]}
    // >
      <NestedTableComponent
        size={size}
        columns={mergedColumns}
        dataSource={data}
        bordered={true}
        // rowSelection={{
        //   type: selectionType,
        //   ...rowSelection,
        // }}
        style={{
          maxHeight: "500px",
          overflowY: "scroll",
        }}
        pagination={false}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      />
    // </Card>
    // </Form>
  );
};

export default VariantComponentData;
