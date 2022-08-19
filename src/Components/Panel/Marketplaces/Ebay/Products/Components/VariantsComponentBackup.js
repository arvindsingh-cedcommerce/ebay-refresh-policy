import { Image } from "antd";
import React, { useEffect, useState } from "react";
import NestedTableComponent from "../../../../../AntDesignComponents/NestedTableComponent";
import NoProductImage from "../../../../../../assets/notfound.png";
import { TextField } from "@shopify/polaris";

const VariantsComponentBackup = ({
  dataSource,
  size,
  variantColumns,
  setVariantColumns,
  variantData,
  setVariantData,
  editedProductDataFromAPI,
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

  // useEffect(() => {
  //   console.log(variantColumns);
  //   variantColumns.fil
  // }, [])

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
    let tempObject = {};
    variantColumns.forEach((e) => {
      let check = e.dataIndex.replace("variant", "");
      if (key.hasOwnProperty(check)) {
        // console.log(e);
        tempObject[e.dataIndex] = key[check] ? (
          <TextField
            value={key[check]}
            onChange={(e) => variantValueChange(key, check, e)}
          />
        ) : (
          <></>
        );
      }
    });
    tempObject["key"] = index.toString();
    tempObject["variantImage"] = key["main_image"] ? (
      <Image width={25} src={key["main_image"]} />
    ) : (
      <Image width={25} preview={false} src={NoProductImage} />
    );
    tempObject["variantSKU"] = (
      <TextField
        // disabled
        value={key["sku"]}
        onChange={(e) => variantValueChange(key, "sku", e)}
      />
    );
    tempObject["variantQuantity"] = (
      <TextField
        value={key["quantity"].toString()}
        onChange={(e) => variantValueChange(key, "quantity", e)}
        type="number"
      />
    );
    tempObject["variantPrice"] = (
      <TextField
        value={key["price"].toString()}
        onChange={(e) => variantValueChange(key, "price", e)}
        type="number"
      />
    );
    tempObject["variantBarcode"] = key["barcode"] ? (
      <TextField
        value={key["barcode"]}
        onChange={(e) => variantValueChange(key, "barcode", e)}
      />
    ) : (
      <TextField
        value={key["barcode"]}
        onChange={(e) => variantValueChange(key, "barcode", e)}
      />
    );
    tempObject["variantWeight"] =
      key["weight"] !== undefined ? (
        <TextField
          value={key["weight"].toString()}
          onChange={(e) => variantValueChange(key, "weight", e)}
          type="number"
        />
      ) : (
        "N/A"
      );
    tempObject["variantWeightUnit"] = key["weight_unit"]
      ? key["weight_unit"]
      : "N/A";

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
    />
  );
};

export default VariantsComponentBackup;
