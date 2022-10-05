import { Image, Switch } from "antd";
import React, { useEffect, useState } from "react";
import NestedTableComponent from "../../../../../AntDesignComponents/NestedTableComponent";
import NoProductImage from "../../../../../../assets/notfound.png";
import {
  Badge,
  Icon,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import { EditMinor } from "@shopify/polaris-icons";
import { postActionOnProductById } from "../../../../../../APIrequests/ProductsAPI";
import { changeVariantStatusURL } from "../../../../../../URLs/ProductsURL";
import { notify } from "../../../../../../services/notify";
import { EditFilled } from "@ant-design/icons";

const VariantsComponent = ({
  // dataSource,
  variants,
  setVariants,
  customDataSource,
  size,
  variantColumns,
  setVariantColumns,
  variantData,
  setVariantData,
  editedProductDataFromAPI,
  setCustomVariantColumns,
  customVariantColumns,
  customVariantData,
  setCustomVariantData,
}) => {
  // console.log('customVariantColumns', customVariantColumns);
  // const [variants, setShopifyTempState] = useState([...dataSource]);
  const [tempState, setTempState] = useState([...customDataSource]);
  // console.log(tempState);
  const [switchShopifyCustom, setswitchShopifyCustom] = useState(false);

  const fillDataForEditedContent = async () => {
    let temp = [...tempState];
    if (
      Object.keys(editedProductDataFromAPI).length > 0 &&
      editedProductDataFromAPI?.variationProduct
    ) {
      let arr1 = editedProductDataFromAPI.variationProduct;
      let arr2 = [...temp];
      let arr3 = arr2.map((item, i) => {
        // console.log('arr1[i]', arr1[i], item);
        let tempObj = { ...item };
        for (const key in arr1[i]) {
          // if(item.includes(key)) {
          if (`custom${key}` in item) {
            tempObj[`custom${key}`] = arr1[i][key];
          }
        }
        return tempObj;
        // return Object.assign({}, item, arr1[`custom${i}`]);
        // return {...item, }
      });
      setTempState(arr3);
      // setVariantData(arr3);
      // setCu
    }
  };

  const fillDataForShopifyContent = async () => {
    // console.log(variants);
    // let temp = [...tempState];
    // if (
    //   Object.keys(editedProductDataFromAPI).length > 0 &&
    //   editedProductDataFromAPI?.variationProduct
    // ) {
    //   let arr1 = editedProductDataFromAPI.variationProduct;
    //   let arr2 = [...temp];
    //   let arr3 = arr2.map((item, i) => Object.assign({}, item, arr1[i]));
    //   setShopifyTempState(arr3);
    //   // setVariantData(arr3);
    // }
  };

  const customVariantValueChange = (index, type, value) => {
    const temp = [...tempState];
    temp[index][type] = value;
    setTempState(temp);
    setCustomVariantData(temp);
  };

  useEffect(() => {
    // fillDataForEditedContent();
    fillDataForShopifyContent();
  }, []);

  // useEffect(() => {
  //   console.log(variantColumns);
  //   variantColumns.fil
  // }, [])

  const variantValueChange = (id, type, value, editedContent) => {
    const temp = [...tempState];
    let check = temp.map((obj) => {
      if (obj["source_product_id"] === id["source_product_id"]) {
        if (editedContent.toString().includes("_edited")) {
          // console.log(id, type, value, editedContent);
          obj[type] = value + "_edited";
          // console.log(obj[type]);
        } else {
          obj[type] = value;
        }
        return { ...obj };
      } else {
        return obj;
      }
    });
    // console.log(check);
    let removedEditedKeywordArray = check.map((obj) => {
      let returnedObj = {};
      for (const key in obj) {
        if (obj[key]?.toString().includes("_edited")) {
          // console.log(obj[key], typeof obj[key]);
          returnedObj[key] = obj[key]?.toString().replace("_edited", "");
        } else {
          returnedObj[key] = obj[key];
        }
      }
      return returnedObj;
    });
    // console.log(removedEditedKeywordArray);
    setTempState(check);
    // setVariantData(check);
    setVariantData(removedEditedKeywordArray);
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

  const tempVariantData = variants.map((key, index) => {
    let tempObject = {};
    variantColumns.forEach((e) => {
      let check = e.dataIndex.replace("variant", "");
      if (key.hasOwnProperty(check)) {
        // console.log(e);
        tempObject[e.dataIndex] = key[check] ? (
          <>{key[check]}{ customVariantData[index][`custom${check}`] ?<EditFilled style={{width:"0.6rem",height:"0.6rem"}} />:<></>}</>
        ) : (
          // <TextField
          //   value={key[check]}
          //   onChange={(e) => variantValueChange(key, check, e)}
          // />
          <></>
        );
      }
    });
    tempObject["key"] = index.toString();
    tempObject["variantImage"] = key["variant_image"] ? (
      <Image width={25} src={key["variant_image"]} />
    ) : (
      <Image width={25} preview={false} src={NoProductImage} />
    );
    tempObject["variantSKU"] = (
      <>{key["sku"]}  { customVariantData[index][`customsku`] ?<EditFilled style={{width:"0.6rem",height:"0.6rem"}} />:<></>}</>
   
      // <TextField
      //   // disabled
      //   value={key["sku"]}
      //   onChange={(e) => variantValueChange(key, "sku", e)}
      // />
    );
    tempObject["variantQuantity"] = (
      key["quantity"] !== undefined ? <>{key["quantity"]?.toString()}{ customVariantData[index][`customquantity`] ?<EditFilled style={{width:"0.6rem",height:"0.6rem"}} />:<></>}</> : <></>
      // <TextField
      //   value={key["quantity"].toString()}
      //   onChange={(e) => variantValueChange(key, "quantity", e)}
      //   type="number"
      // />
    );
    tempObject["variantPrice"] = (
      key["price"] !== undefined ? <>{key["price"].toString()}{ customVariantData[index][`customprice`] ?<EditFilled style={{width:"0.6rem",height:"0.6rem"}} />:<></>}</> : <></>
      // <TextField
      //   value={key["price"].toString()}
      //   onChange={(e) => variantValueChange(key, "price", e)}
      //   type="number"
      // />
    );
    tempObject["variantBarcode"] = key["barcode"] ? (
      <>{key["barcode"]}{ customVariantData[index][`custombarcode`] ?<EditFilled style={{width:"0.6rem",height:"0.6rem"}} />:<></>}</>
    ) : (
      // <TextField
      //   value={key["barcode"]}
      //   onChange={(e) => variantValueChange(key, "barcode", e)}
      // />
      "N/A"
      // <TextField
      //   value={key["barcode"]}
      //   onChange={(e) => variantValueChange(key, "barcode", e)}
      // />
    );
    tempObject["variantExcluded"] = (
      <Switch
        defaultChecked={key["isExclude"] ? false : true}
        disabled={key["isExcludeDisabled"]}
        onChange={async (e) => {
          let returnValue = getCheckedAtleastOnce(e, index);
          const { source_product_id } = key;
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
      />
      // <Badge status={key["isExclude"] ? "success" : "critical"}>
      //   {key["isExclude"] ? "Excluded" : 'Included'}
      // </Badge>
    );
    tempObject["variantWeight"] =
      key["weight"] !== undefined ? (
        <>{key["weight"].toString()}{ customVariantData[index][`customweight`] ?<EditFilled style={{width:"0.6rem",height:"0.6rem"}} />:<></>}</>
      ) : (
        // <TextField
        //   value={key["weight"].toString()}
        //   onChange={(e) => variantValueChange(key, "weight", e)}
        //   type="number"
        // />
        "N/A"
      );
    tempObject["variantWeightUnit"] = key["weight_unit"]
      ? <>{key["weight_unit"]}{ customVariantData[index][`customweight_unit`] ?<EditFilled style={{width:"0.6rem",height:"0.6rem"}} />:<></>}</>
      : "N/A";

    if (key?.["variant_attributes"] && key["variant_attributes"].length > 0) {
      key["variant_attributes"].forEach((variantAttribute) => {
        tempObject[variantAttribute] = key[variantAttribute];
      });
    }
    return tempObject;
  });

  const customTempVariantData = tempState.map((key, index) => {
    let tempObject = {};
    // tempObject["customvariantImage"] = key["main_image"] ? (
    //   <Image width={25} src={key["main_image"]} />
    // ) : (
    //   <Image width={25} preview={false} src={NoProductImage} />
    // );
    tempObject["customvariantSKU"] = (
      <TextField
        value={key["customsku"]}
        onChange={(e) => customVariantValueChange(index, "customsku", e)}
        placeholder="Custom sku"
      />
    );
    tempObject["customvariantQuantity"] = (
      <TextField
        value={key["customquantity"]}
        onChange={(e) => customVariantValueChange(index, "customquantity", e)}
        type="number"
        placeholder="Custom quantity"
      />
    );
    tempObject["customvariantPrice"] = (
      <TextField
        value={key["customprice"]}
        onChange={(e) => customVariantValueChange(index, "customprice", e)}
        type="number"
        placeholder="Custom price"
      />
    );
    tempObject["customvariantBarcode"] = (
      <TextField
        value={key["custombarcode"]}
        onChange={(e) => customVariantValueChange(index, "custombarcode", e)}
        placeholder="Custom barcode"
      />
    );
    tempObject["customvariantWeight"] = (
      <TextField
        value={key["customweight"]}
        onChange={(e) => customVariantValueChange(index, "customweight", e)}
        type="number"
        placeholder="Custom weight"
      />
    );
    tempObject["customvariantWeightUnit"] = (
      <Select
        options={[
          {
            label: "Unselect",
            value: "",
            disabled: key["customweight_unit"] == "",
          },
          { label: "lb", value: "lb" },
          { label: "oz", value: "oz" },
          { label: "kg", value: "kg" },
          { label: "g", value: "g" },
        ]}
        value={key["customweight_unit"]}
        onChange={(e) =>
          customVariantValueChange(index, "customweight_unit", e)
        }
        placeholder="Custom weight unit"
      />
    );
    if (
      variants[index]?.["variant_attributes"] &&
      variants[index]["variant_attributes"].length > 0
    ) {
      variants[index]["variant_attributes"].forEach(
        (variantAttribute) => {
          // console.log(variants[index][variantAttribute]);
          tempObject[`customvariant${variantAttribute}`] = (
            // variants[index][variantAttribute]
            <TextField
              placeholder={`custom ${variantAttribute}`}
              value={key[`custom${variantAttribute}`]}
              onChange={(e) =>
                customVariantValueChange(index, `custom${variantAttribute}`, e)
              }
            />
          );
        }
      );
    }
    // console.log(tempObject);
    return tempObject;
  });
  // console.log(customTempVariantData);
  // const customTempVariantData = tempState.map((key, index) => {
  //   let tempObject = {};
  //   variantColumns.forEach((e) => {
  //     let check = e.dataIndex.replace("variant", "");
  //     if (key.hasOwnProperty(check)) {
  //       // console.log(e);
  //       tempObject[e.dataIndex] = key[check] ? (
  //         <TextField
  //           value={key[check]}
  //           onChange={(e) => variantValueChange(key, check, e)}
  //         />
  //       ) : (
  //         <></>
  //       );
  //     }
  //   });
  //   tempObject["key"] = index.toString();
  //   tempObject["variantImage"] = key["main_image"] ? (
  //     <Image width={25} src={key["main_image"]} />
  //   ) : (
  //     <Image width={25} preview={false} src={NoProductImage} />
  //   );
  //   tempObject["variantSKU"] = (
  //     <TextField
  //       // disabled
  //       // value={key["sku"]}
  //       value={
  //         key["sku"].toString().includes("_edited")
  //           ? key["sku"].toString().replace("_edited", "").toString()
  //           : key["sku"].toString()
  //       }
  //       onChange={(e) => variantValueChange(key, "sku", e, key["sku"])}
  //       // prefix={
  //       //   key["sku"].toString().includes("_edited") ? (
  //       //     <Tooltip content="Edited">
  //       //       <Icon source={EditMinor} color="base" />
  //       //     </Tooltip>
  //       //   ) : (
  //       //     ""
  //       //   )
  //       // }
  //     />
  //   );
  //   tempObject["variantQuantity"] = (
  //     <TextField
  //       // value={key["quantity"].toString()}
  //       value={
  //         key["quantity"].toString().includes("_edited")
  //           ? key["quantity"].toString().replace("_edited", "").toString()
  //           : key["quantity"].toString()
  //       }
  //       onChange={(e) =>
  //         variantValueChange(key, "quantity", e, key["quantity"])
  //       }
  //       type="number"
  //       // prefix={
  //       //   key["quantity"].toString().includes("_edited") ? (
  //       //     <Tooltip content="Edited">
  //       //       <Icon source={EditMinor} color="base" />
  //       //     </Tooltip>
  //       //   ) : (
  //       //     ""
  //       //   )
  //       // }
  //     />
  //   );
  //   tempObject["variantPrice"] = (
  //     <TextField
  //       value={
  //         key["price"].toString().includes("_edited")
  //           ? key["price"].toString().replace("_edited", "").toString()
  //           : key["price"].toString()
  //       }
  //       onChange={(e) => {
  //         // console.log(key["price"].toString().includes("_edited"));
  //         variantValueChange(key, "price", e, key["price"]);
  //       }}
  //       type="number"
  //       prefix={
  //         key["price"].toString().includes("_edited") ? (
  //           <Tooltip content="Edited">
  //             <Icon source={EditMinor} color="base" />
  //           </Tooltip>
  //         ) : (
  //           ""
  //         )
  //       }
  //     />
  //   );
  //   tempObject["variantBarcode"] = key["barcode"] ? (
  //     <TextField
  //       // value={key["barcode"]}
  //       value={
  //         key["barcode"].toString().includes("_edited")
  //           ? key["barcode"].toString().replace("_edited", "").toString()
  //           : key["barcode"].toString()
  //       }
  //       onChange={(e) => variantValueChange(key, "barcode", e, key["barcode"])}
  //       // prefix={
  //       //   key["barcode"].toString().includes("_edited") ? (
  //       //     <Tooltip content="Edited">
  //       //       <Icon source={EditMinor} color="base" />
  //       //     </Tooltip>
  //       //   ) : (
  //       //     ""
  //       //   )
  //       // }
  //     />
  //   ) : (
  //     <TextField
  //       // value={key["barcode"]}
  //       value={
  //         key["barcode"]?.toString().includes("_edited")
  //           ? key["barcode"].toString().replace("_edited", "").toString()
  //           : key["barcode"]?.toString()
  //       }
  //       onChange={(e) => variantValueChange(key, "barcode", e, key["barcode"])}
  //       // prefix={
  //       //   key["barcode"]?.toString().includes("_edited") ? (
  //       //     <Tooltip content="Edited">
  //       //       <Icon source={EditMinor} color="base" />
  //       //     </Tooltip>
  //       //   ) : (
  //       //     ""
  //       //   )
  //       // }
  //     />
  //   );
  //   tempObject["variantWeight"] =
  //     key["weight"] !== undefined ? (
  //       <TextField
  //         // value={key["weight"].toString()}
  //         value={
  //           key["weight"].toString().includes("_edited")
  //             ? key["weight"].toString().replace("_edited", "").toString()
  //             : key["weight"].toString()
  //         }
  //         onChange={(e) => variantValueChange(key, "weight", e, key["weight"])}
  //         type="number"
  //         // prefix={
  //         //   key["weight"].toString().includes("_edited") ? (
  //         //     <Tooltip content="Edited">
  //         //       <Icon source={EditMinor} color="base" />
  //         //     </Tooltip>
  //         //   ) : (
  //         //     ""
  //         //   )
  //         // }
  //       />
  //     ) : (
  //       "N/A"
  //     );
  //   tempObject["variantWeightUnit"] = key["weight_unit"] ? (
  //     // key["weight_unit"]
  //     <Select
  //       value={
  //         key["weight_unit"].includes("_edited")
  //           ? key["weight_unit"].replace("_edited", "")
  //           : key["weight_unit"]
  //       }
  //       options={[
  //         {
  //           label: "kg",
  //           value: "kg",
  //           // prefix: key["weight_unit"].toString().includes("_edited") ? (
  //           //   <Tooltip content="Edited">
  //           //     <Icon source={EditMinor} color="base" />
  //           //   </Tooltip>
  //           // ) : (
  //           //   ""
  //           // ),
  //         },
  //         {
  //           label: "lb",
  //           value: "lb",
  //           // prefix: key["weight_unit"].toString().includes("_edited") ? (
  //           //   <Tooltip content="Edited">
  //           //     <Icon source={EditMinor} color="base" />
  //           //   </Tooltip>
  //           // ) : (
  //           //   ""
  //           // ),
  //         },
  //       ]}
  //       onChange={(e) => {
  //         // console.log(e);
  //         variantValueChange(key, "weight_unit", e, key["weight_unit"]);
  //       }}
  //     />
  //   ) : (
  //     "N/A"
  //   );
  //   return tempObject;
  // });

  return (
    <>
    <Stack distribution="center">
        <React.Fragment style={switchShopifyCustom ? { opacity: "0.5" } : {}}>
          Shopify
        </React.Fragment>
        <Switch
          checked={switchShopifyCustom}
          onChange={(e) => setswitchShopifyCustom(e)}
          style={
            switchShopifyCustom
              ? { background: "#1890ff" }
              : { background: "#1890ff" }
          }
        />
        <React.Fragment style={!switchShopifyCustom ? { opacity: "0.5" } : {}}>
          Custom
        </React.Fragment>
      </Stack>
      <br />
      {!switchShopifyCustom ? (
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
      ) : (
        <NestedTableComponent
          size={size}
          columns={customVariantColumns}
          dataSource={customTempVariantData}
          bordered={true}
          // style={{
          //   maxHeight: "500px",
          //   overflowY: "scroll",
          // }}
          pagination={false}
         />
      )}
    </>
  );
};

export default VariantsComponent;
