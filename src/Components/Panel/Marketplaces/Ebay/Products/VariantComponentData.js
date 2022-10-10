import React, { useCallback, useEffect, useState } from "react";
import { Input, InputNumber, Form, Image, Switch, Typography } from "antd";
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
  getProducts,
  getrequest,
  postActionOnProductById,
} from "../../../../../APIrequests/ProductsAPI";
import { changeVariantStatusURL, getVariantsURL } from "../../../../../URLs/ProductsURL";
import { notify } from "../../../../../services/notify";
const { Text } = Typography;

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

const VariantComponentData = ({ record, size }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [variants,setVariants] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
useEffect(()=>{
if(variants.length>0)
{
  getAllVariants([...variants]);
}
},[variants]);
  const [popoverActive, setPopoverActive] = useState(false);

  const isEditing = (record) => record.key === editingKey;
  const getCheckedAtleastOnceFlag = (variantProductsData, index) => {
    let count = 0;
    let variantCount = variantProductsData.length;
    let temp = [...variantProductsData];
    temp.forEach((curr) => curr.isExclude === true && count++);
    let flag = false
    if(count+1 === variantCount) {
      flag = true
    } else flag = false
    return flag
  };
  const getCheckedAtleastOnce = (e, index) => {
    let count = 0;
    let variantCount = variants.length;
    let temp = [...variants];
    let returnValue = true;
    temp[index]["isExclude"] = !e;
    temp.forEach((curr) => curr.isExclude === true && count++);
    if (count + 1 === variantCount) {
      let findIndex
      variants.forEach((val, j, arr) => {
        if(!arr[j]['isExclude']) {
          findIndex = j
        }
      })
      temp[findIndex]["isExcludeDisabled"] = true;
      setVariants(temp);
    } else {
      let temp1 = temp.map((curr) => ({...curr, isExcludeDisabled: false}));
      setVariants(temp1);
    }
    return returnValue;
  };
  const getAllVariants = (data) => {
    console.log("start data",data);
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
          {/* <>Excluded</> */}
          <Switch
            defaultChecked={key["isExclude"] ? false : true}
            disabled={key["isExcludeDisabled"]}
            onChange={async (e) => {
              const { source_product_id } = key;
console.log("variant arr",variants);
          let returnValue = getCheckedAtleastOnce(e, index);
              const postData = {};
              postData["variant_id"] = [source_product_id];
              postData["status"] = !e ? "Exclude" : "Include";
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
            // style={
            //   key["isExclude"]
            //     ? { background: "#a19f9f" }
            //     : { background: "#1890ff" }
            // }
          />
          {/* <>Included</> */}
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
      tempObject["variantQuantity"] = key["quantity"] == 0 ? (
        <Text type="danger">{key["quantity"]}</Text>
      ) : (
        key["quantity"]
      );
      tempObject["variantPrice"] = key["price"];

      return tempObject;
    });
    setData(tempVariantData);
  };


  const callVariantData = async (record) => {
    // console.log("record", record);
    const { source_product_id, container_id } = record;
    let {
      success: productsDataSuccess,
      data: productsData,
      message,
      code,
    } = await getProducts(getVariantsURL, {
      container_id: container_id,
    });
    if (
      productsDataSuccess &&
      productsData &&
      productsData[container_id] &&
      productsData[container_id]["variations"] &&
      Array.isArray(productsData[container_id]["variations"])
    ) {
      // console.log(productsData[container_id]["variations"]);
      const variantProductsData=[...productsData[container_id]["variations"]];
      let includeIsExcludeKey = variantProductsData.map((e, index) => {
        if(e.hasOwnProperty('isExclude')) {
          return {...e, isExcludeDisabled: false}
        } else {
          let flag = getCheckedAtleastOnceFlag(variantProductsData, index)
          return {...e, isExclude: false, isExcludeDisabled: flag}
        }
      })
      setVariants([...includeIsExcludeKey]);
      //getAllVariants([...includeIsExcludeKey]);

    }
  };

  useEffect(() => {
    callVariantData(record);
  }, []);

  // useEffect(() => {
  //   getAllVariants(dataSource);
  // }, []);

  const columns = [
    {
      title: "Included",
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
      // filters: record.map((key, index) => {
      //   let tempObject = {};
      //   tempObject["text"] = key["variant_title"];
      //   tempObject["value"] = key["variant_title"];
      //   return tempObject;
      // }),
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
      loading={data.length > 0 ? false : true}
    />
    // </Card>
    // </Form>
  );
};

export default VariantComponentData;
