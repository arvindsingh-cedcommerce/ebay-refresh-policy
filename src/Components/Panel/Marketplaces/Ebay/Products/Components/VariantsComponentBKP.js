import { Image } from "antd";
import React, { useEffect, useState } from "react";
import NestedTableComponent from "../../../../../AntDesignComponents/NestedTableComponent";
import NoProductImage from "../../../../../../assets/notfound.png";
import { TextField } from "@shopify/polaris";
import TabsComponent from "../../../../../AntDesignComponents/TabsComponent";
import VariantComponentData from "../VariantComponentData";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

const VariantsComponentBKP = ({
  dataSource,
  size,
  variantColumns,
  setVariantColumns,
  variantData,
  setVariantData,
  editedProductDataFromAPI,
  innerVariantColumns,
  variantAttributeColumns,
  innerVariantAttributeColumns,
}) => {
  const [tempState, setTempState] = useState([...dataSource]);

  const fillDataForEditedContent = async () => {
    let temp = [...tempState];
    if (
      Object.keys(editedProductDataFromAPI).length > 0 &&
      editedProductDataFromAPI?.variationProduct
    ) {
      let arr1 = editedProductDataFromAPI.variationProduct;
      let arr2 = [...temp];
      let arr3 = arr2.map((item, i) => Object.assign({}, item, arr1[i]));
      setTempState(arr3);
      setVariantData(arr3);
    }
  };

  useEffect(() => {
    fillDataForEditedContent();
  }, []);

  const variantValueChange = (id, type, value) => {
    const temp = [...tempState];
    let check = temp.map((obj) => {
      if (obj["source_product_id"] === id["source_product_id"]) {
        obj[type] = value;
        return { ...obj };
      } else {
        return obj;
      }
    });
    setTempState(check);
    setVariantData(check);
  };

  const tempVariantData = tempState.map((key, index) => {
    // console.log(key, innerVariantAttributeColumns);
    let tempObject = {};
    tempObject["key"] = index.toString();
    tempObject["variantImage"] = key["main_image"] ? (
      <Image width={25} src={key["main_image"]} />
    ) : (
      <Image width={25} preview={false} src={NoProductImage} />
    );
    tempObject["innerVariantImage"] = key["main_image"] ? (
      <Image width={25} src={key["main_image"]} />
    ) : (
      <Image width={25} preview={false} src={NoProductImage} />
    );
    tempObject["variantSKU"] = key["sku"];
    tempObject["innerVariantSKU"] = (
      <TextField
        disabled
        value={key["sku"]}
        onChange={(e) => variantValueChange(key, "sku", e)}
      />
    );
    tempObject["variantQuantity"] = key["quantity"].toString();
    tempObject["innerVariantQuantity"] = (
      <TextField
        // value={key["quantity"].toString()}
        placeholder="Set custom inventory"
        value={""}
        onChange={(e) => variantValueChange(key, "quantity", e)}
        type="number"
      />
    );
    tempObject["variantPrice"] = key["price"].toString();
    tempObject["innerVariantPrice"] = (
      <TextField
        // value={key["price"].toString()}
        placeholder="Set custom price"
        value=""
        onChange={(e) => variantValueChange(key, "price", e)}
        type="number"
      />
    );
    tempObject["variantBarcode"] = key["barcode"];
    tempObject["innerVariantBarcode"] = key["barcode"] ? (
      <TextField
        // value={key["barcode"]}
        placeholder="Set custom barcode"
        value=""
        onChange={(e) => variantValueChange(key, "barcode", e)}
      />
    ) : (
      <TextField
        value={key["barcode"]}
        onChange={(e) => variantValueChange(key, "barcode", e)}
      />
    );
    tempObject["variantWeight"] =
      key["weight"] !== undefined ? key["weight"].toString() : "N/A";
    tempObject["innerVariantWeight"] =
      key["weight"] !== undefined ? (
        <TextField
          // value={key["weight"].toString()}
          placeholder="Set custom weight"
          value=""
          onChange={(e) => variantValueChange(key, "weight", e)}
          type="number"
        />
      ) : (
        "N/A"
      );
    tempObject["variantWeightUnit"] = key["weight_unit"]
      ? key["weight_unit"]
      : "N/A";
    tempObject["innerVariantWeightUnit"] = key["weight_unit"]
      ? key["weight_unit"]
      : "N/A";

    variantAttributeColumns.map((variantAttributeColumn) => {
      tempObject[variantAttributeColumn.dataIndex] =
        key[variantAttributeColumn.dataIndex];
    });
    innerVariantAttributeColumns.map((innerVariantAttributeColumn) => {
      tempObject[innerVariantAttributeColumn.dataIndex] =
        <TextField value={''} placeholder={`Set custom ${innerVariantAttributeColumn.title}`} />
    });
    return tempObject;
  });

  return (
    <NestedTableComponent
      size={size}
      columns={variantColumns}
      dataSource={tempVariantData}
      bordered={true}
      // style={{
      //   maxHeight: "500px",
      //   overflowY: "scroll",
      // }}
      pagination={false}
      expandable={{
        expandedRowRender: (record, index, indent, expanded) => {
          console.log(record, variantColumns);
          return (
            <NestedTableComponent
              size={size}
              columns={innerVariantColumns}
              dataSource={[record]}
              bordered={true}
              pagination={false}
            />
          );
        },
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <CaretUpOutlined onClick={(e) => onExpand(record, e)} />
          ) : (
            <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
          ),
      }}
    />
  );
};

export default VariantsComponentBKP;
