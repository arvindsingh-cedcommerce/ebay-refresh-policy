import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Image,
} from "antd";
import NoProductImage from "../../../../../assets/notfound.png";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";

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

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      // console.log('newData', newData)
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      //   console.log("Validate Failed:", errInfo);
    }
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
      tempObject["variantImage"] = key["main_image"] ? (
        <Image width={50} src={key["main_image"]} />
      ) : (
        // <Image width={50} src={ImageResizer(key["variant_image"])} />
        <Image width={50} preview={false} src={NoProductImage} />
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
    // {
    //   title: "Operation",
    //   dataIndex: "operation",
    //   render: (_, record) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <span>
    //         <Typography.Link
    //           onClick={() => save(record.key)}
    //           style={{
    //             marginRight: 8,
    //           }}
    //         >
    //           Save
    //         </Typography.Link>
    //         <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
    //           <a>Cancel</a>
    //         </Popconfirm>
    //       </span>
    //     ) : (
    //       <Typography.Link
    //         disabled={editingKey !== ""}
    //         onClick={() => edit(record)}
    //       >
    //         Edit
    //       </Typography.Link>
    //     );
    //   },
    // },
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

  return (
    <Form form={form} component={false}>
      {/* <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
        }}
        pagination={false}
      /> */}
      <NestedTableComponent
        size={size}
        columns={mergedColumns}
        dataSource={data}
        bordered={true}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        style={{
          // maxHeight: "300px",
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
    </Form>
  );
};

export default VariantComponentData;
