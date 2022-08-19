import {
    // Button,
    Col,
    PageHeader,
    Row,
    Typography,
    Alert,
    Spin,
    Collapse,
    Dropdown,
    Menu,
    Popover,
  } from "antd";
  import React, { useEffect, useState } from "react";
  import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
  import {
    editProductById,
    fetchProductById,
    postActionOnProductById,
    uploadProductById,
  } from "../../../../../APIrequests/ProductsAPI";
  import { json } from "../../../../../globalConstant/static-json";
  import { parseQueryString } from "../../../../../services/helperFunction";
  import {
    editProductByIdURL,
    endProductByIdURL,
    getMetafieldsURL,
    getProductDataURL,
    uploadProductByIdURL,
    viewProductDataURL,
  } from "../../../../../URLs/ProductsURL";
  import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
  import { notify } from "../../../../../services/notify";
  import DetailsComponentBckp from "./Components/DetailsComponentBckp";
  import DetailsComponent from "./Components/DetailsComponent";
  import DescriptionComponent from "./DescriptionComponent";
  import _ from "lodash";
  import VariantsComponent from "./Components/VariantsComponent";
  import { globalState } from "../../../../../services/globalstate";
  import { isUndefined } from "lodash";
  import ReactJson from "react-json-view";
  import ImagesComponent from "./Components/ImagesComponent";
  import { DownOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
  import DetailsComponentNew from "./Components/DetailsComponentNew";
  import ProductDataComponentNew from "./Components/ProductDataComponentNew";
  import { Badge, Link, Thumbnail, Stack, Button } from "@shopify/polaris";
import VariantsComponentBKP from "./Components/VariantsComponentBKP";
  
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
      title: "SKU",
      dataIndex: "variantSKU",
      key: "variantSKU",
      editable: true,
    },
    {
      title: "Inventory",
      dataIndex: "variantQuantity",
      key: "variantQuantity",
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "variantPrice",
      key: "variantPrice",
      editable: true,
    },
    {
      title: "Barcode",
      dataIndex: "variantBarcode",
      key: "variantBarcode",
      editable: true,
    },
    {
      title: "Weight",
      dataIndex: "variantWeight",
      key: "variantWeight",
      editable: true,
    },
    {
      title: "Weight Unit",
      dataIndex: "variantWeightUnit",
      key: "variantWeightUnit",
      editable: true,
    },
  ];
  const InnerVariantColumns = [
    {
      title: "Image",
      dataIndex: "innerVariantImage",
      key: "variantImage",
      editable: false,
    },
    {
      title: "SKU",
      dataIndex: "innerVariantSKU",
      key: "variantSKU",
      editable: true,
    },
    {
      title: "Inventory",
      dataIndex: "innerVariantQuantity",
      key: "variantQuantity",
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "innerVariantPrice",
      key: "variantPrice",
      editable: true,
    },
    {
      title: "Barcode",
      dataIndex: "innerVariantBarcode",
      key: "variantBarcode",
      editable: true,
    },
    {
      title: "Weight",
      dataIndex: "innerVariantWeight",
      key: "variantWeight",
      editable: true,
    },
    {
      title: "Weight Unit",
      dataIndex: "innerVariantWeightUnit",
      key: "variantWeightUnit",
      editable: true,
    },
  ];
  // let editedProductDataFromAPI = ''
  const commonFields = ["title", "brand", "tags", "producttype", "description"];
  const { Text } = Typography;
  
  const ProductViewPolarisNewBKP = (props) => {
    const [pageLoader, setPageLoader] = useState(false);
    const [mainProduct, setMainProduct] = useState({});
    const [apiCallMainProduct, setApiCallMainProduct] = useState({});
    const [variants, setVariants] = useState([]);
    const [productId, setProductId] = useState(null);
    const [saveBtnLoader, setSaveBtnLoader] = useState(false);
  
    const [connectedAccounts, setconnectedAccounts] = useState({});
    const [errors, setErrors] = useState({});
  
    // variant table
    const [variantColumns, setVariantColumns] = useState(columns);
    const [innerVariantColumns, setInnerVariantColumns] =
      useState(InnerVariantColumns);
    const [variantData, setVariantData] = useState([]);
  
    // producrt type: simple/variation
    const [productType, setProductType] = useState("");
  
    useEffect(() => {
      // console.log(variants);
    }, [variants]);
  
    //
    const [editedProductDataFromAPI, seteditedProductDataFromAPI] = useState([]);
  
    // errorsData
    const [errorsData, setErrorsData] = useState({});
  
    // itemUrls
    const [itemUrls, setItemUrls] = useState([]);
    const [viewItemURLsPopoverActive, setViewItemURLsPopoverActive] =
      useState(false);
  
    const [variantAttributeColumns, setVariantAttributeColumns] = useState([]);
    const [innerVariantAttributeColumns, setInnerVariantAttributeColumns] =
      useState([]);
  
    const extractEditedDataForMainProduct = (formainproduct) => {
      let tempObj = {};
      for (const key in formainproduct) {
        if (commonFields.includes(key)) {
          tempObj[key] = formainproduct[key];
        }
      }
      return tempObj;
    };
  
    const extractEditedDataForVariationProduct = (forvariationproduct, type) => {
      let tempArr = [];
      if (type === "variation") {
        for (const key in forvariationproduct) {
          let firstShop = Object.keys(forvariationproduct[key]["shops"])[0];
          let firstShopData = forvariationproduct[key]["shops"][firstShop];
          let editedData = firstShopData.edited_data;
          let tempObj = {};
          for (const key in editedData) {
            if (!commonFields.includes(key)) {
              tempObj[key] = editedData[key];
            }
          }
          tempObj["source_product_id"] =
            forvariationproduct[key]["source_product_id"];
          tempArr.push(tempObj);
        }
        return tempArr;
      } else if (type === "simple") {
        let firstShop = Object.keys(forvariationproduct["shops"])[0];
        let firstShopData = forvariationproduct["shops"][firstShop];
        let editedData = firstShopData.edited_data;
        let tempObj = {};
        for (const key in editedData) {
          if (!commonFields.includes(key)) {
            tempObj[key] = editedData[key];
          }
        }
        tempObj["source_product_id"] = forvariationproduct["source_product_id"];
        tempArr.push(tempObj);
        return tempArr;
      }
    };
    const getUploadedItemDetails = (ebay_product_response) => {
      let itemUrls = ebay_product_response.map((response) => {
        return {
          site: response?.Site,
          url: response?.ListingDetails?.ViewItemURL,
        };
      });
      setItemUrls(itemUrls);
    };
  
    const extractProductUploadErrorData = (errors, ebay_product_response) => {
      let errorsObj = {};
      let itemIdObj = {};
      Object.keys(errors).map((shopId) => {
        if (errors[shopId].hasOwnProperty("Errors")) {
          errorsObj[shopId] = { ...errors[shopId]?.Errors };
        } else if (errors[shopId].hasOwnProperty("ItemId")) {
          itemIdObj[shopId] = {
            itemId: errors[shopId]?.itemId,
            jsonResponse: ebay_product_response,
          };
        }
      });
      ebay_product_response && getUploadedItemDetails(ebay_product_response);
      // errors && getUploadedItemDetails(errors);
      return { itemIdObj, errorsObj };
    };
  
    const extractEditedData = (
      editedData,
      typeOfProductLength,
      ebay_product_response
    ) => {
      let editedProductData = {
        mainProduct: {},
        variationProduct: [],
      };
      if (typeOfProductLength > 1 && editedData[0]?.variation) {
        // for variants
        let editedVariantProduct = extractEditedDataForVariationProduct(
          editedData[0].variation,
          "variation"
        );
        if (editedVariantProduct.length) {
          editedProductData["variationProduct"] = editedVariantProduct;
        }
  
        // for errors
        let shopsForErrors = editedData[0].variation[0].shops;
        let dataForErrors = extractProductUploadErrorData(
          shopsForErrors,
          ebay_product_response
        );
        if (Object.keys(dataForErrors).length > 0) {
          setErrorsData(dataForErrors);
        }
        // for main
        let firstShop = Object.keys(editedData[0].variation[0].shops)[0];
        let firstShopData = editedData[0].variation[0].shops[firstShop];
        if (firstShopData.hasOwnProperty("edited_data")) {
          let editedMainProduct = extractEditedDataForMainProduct(
            firstShopData.edited_data
          );
          if (Object.keys(editedMainProduct).length) {
            editedProductData["mainProduct"] = editedMainProduct;
          }
        }
      } else if (typeOfProductLength === 1 && editedData[0]) {
        // for variants
        let editedVariantProduct = extractEditedDataForVariationProduct(
          editedData[0],
          "simple"
        );
        if (editedVariantProduct.length) {
          editedProductData["variationProduct"] = editedVariantProduct;
        }
        // for errors
        let shopsForErrors = editedData[0].shops;
        let dataForErrors = extractProductUploadErrorData(
          shopsForErrors,
          ebay_product_response
        );
        if (Object.keys(dataForErrors).length > 0) {
          setErrorsData(dataForErrors);
        }
        // for main
        let firstShop = Object.keys(editedData[0].shops)[0];
        let firstShopData = editedData[0].shops[firstShop];
        if (firstShopData.hasOwnProperty("edited_data")) {
          let editedMainProduct = extractEditedDataForMainProduct(
            firstShopData.edited_data
          );
          if (Object.keys(editedMainProduct).length) {
            editedProductData["mainProduct"] = editedMainProduct;
          }
        }
      }
      return editedProductData;
    };
  
    const extractDataFromAPI = (productData, rows, ebay_product_response) => {
      let mainProduct = {};
      let variations = [];
      let additional_images_arr = [];
      let sortedProductData = [];
  
      if (rows && rows.length) {
        mainProduct = { ...rows[0] };
        if (rows.length === 1) variations = [{ ...rows[0] }];
        else if (rows.length > 1) {
          variations = [...rows.filter((variant, index) => index !== 0)];
        }
  
        // let productDataClone = { ...productData };
        let productDataClone = [...productData];
        let mainProductData = {};
        let variantProductsData = [];
        // sortedProductData = productDataClone["rows"].reduce((acc, element) => {
        sortedProductData = productDataClone.reduce((acc, element) => {
          if (!element.hasOwnProperty("sku")) {
            return [element, ...acc];
          }
          return [...acc, element];
        }, []);
        let editedData = sortedProductData.filter(
          (row) =>
            // row.hasOwnProperty("edited")
            row.hasOwnProperty("source_marketplace") &&
            row["source_marketplace"] === "app"
        );
        sortedProductData = sortedProductData.filter(
          // (row) => !row.hasOwnProperty("edited")
          (row) => {
            if (
              row.hasOwnProperty("source_marketplace") &&
              row["source_marketplace"] === "app"
            ) {
            } else {
              return row;
            }
          }
        );
        if (editedData.length) {
          // editedProductDataFromAPI = extractEditedData(editedData)
          seteditedProductDataFromAPI(
            extractEditedData(
              editedData,
              sortedProductData.length,
              ebay_product_response
            )
          );
        }
        if (sortedProductData.length === 1) {
          mainProductData = sortedProductData[0];
          variantProductsData = sortedProductData;
          setProductType("simple");
        } else if (sortedProductData.length > 1) {
          mainProductData = sortedProductData[0];
          variantProductsData = sortedProductData.slice(1);
          setProductType("variation");
        }
        let {
          title,
          brand,
          product_type,
          tags,
          main_image,
          additional_images,
          length,
          width,
          height,
          source_product_id,
          description,
          variant_attributes,
          container_id,
        } = mainProductData;
        // additional_images_arr = Object.values(additional_images).length
        //   ? [...Object.values(additional_images)]
        //   : [];
  
        variantProductsData.forEach((variant) => {
          if (!tags) {
            if (variant.hasOwnProperty("tags")) {
              tags = variant["tags"];
            }
          }
          additional_images_arr = [
            ...additional_images_arr,
            ...Object.values(variant["additional_images"]),
          ];
        });
  
        let tempObj = {
          checkTitle: {
            enable: false,
            value: "",
          },
          checkDescription: {
            enable: false,
            value: "",
          },
          checkBrand: {
            enable: false,
            value: "",
          },
          checkProducttype: {
            enable: false,
            value: "",
          },
          checkTags: {
            enable: false,
            value: "",
            inputValue: "",
            valueArray: [],
          },
        };
        tempObj["source_product_id"] = source_product_id ? source_product_id : "";
        tempObj["container_id"] = container_id ? container_id : "";
        tempObj["title"] = title ? title : "";
        tempObj["checkTitle"]["value"] = title ? title : "";
        tempObj["description"] = description ? description : "";
        tempObj["checkDescription"]["value"] = description ? description : "";
        tempObj["brand"] = brand ? brand : "";
        tempObj["checkBrand"]["value"] = brand ? brand : "";
        tempObj["product_type"] = product_type ? product_type : "";
        tempObj["checkProducttype"]["value"] = product_type ? product_type : "";
        tempObj["tags"] = tags ? tags : "";
        tempObj["checkTags"]["value"] = tags ? tags : "";
        tempObj["checkTags"]["valueArray"] = tags ? tags.split(",") : "";
        tempObj["mainImage"] = main_image ? main_image : "";
        tempObj["image_array"] = additional_images_arr
          ? additional_images_arr
          : [];
        tempObj["length"] = length ? length : "";
        tempObj["width"] = width ? width : "";
        tempObj["height"] = height ? height : "";
        // tempObj["variant_attributes"] =
        //   Object.keys(variant_attributes).length > 0 ? variant_attributes : {};
        // console.log(tempObj);
  
        setVariantColumns([
          ...variantColumns,
          ...getVariantAttributeColumns(variant_attributes),
          ...getVariantAttributeColumns(variant_attributes),
        ]);
        setInnerVariantColumns([
          ...innerVariantColumns,
          ...getVariantAttributeColumns(variant_attributes, true),
          ...getVariantAttributeColumns(variant_attributes, true),
        ]);
        setVariantAttributeColumns(
          getVariantAttributeColumns(variant_attributes),
          getVariantAttributeColumns(variant_attributes)
        );
        setInnerVariantAttributeColumns(
          getVariantAttributeColumns(variant_attributes, true),
          getVariantAttributeColumns(variant_attributes, true)
        );
        setMainProduct(tempObj);
        setApiCallMainProduct(tempObj);
        // console.log(variantProductsData);
        setVariants(variantProductsData);
      }
    };
    useEffect(() => {
      // console.log(variantAttributeColumns);
    }, [variantAttributeColumns]);
    const getVariantAttributeColumns = (variantAttributes, inner = false) => {
      if (Object.keys(variantAttributes).length > 0) {
        const result = Object.keys(variantAttributes).map((key) => {
          let tempObj = {
            title: variantAttributes[key],
            dataIndex: variantAttributes[key],
            key: variantAttributes[key],
            editable: true,
          };
          if (inner) {
            tempObj["dataIndex"] = `inner${variantAttributes[key]}`;
            tempObj["key"] = `inner${variantAttributes[key]}`;
          }
          return tempObj;
        });
        return result;
      } else return [];
    };
    useEffect(() => {
      if (variants.length > 0) {
        globalState.setLocalStorage(
          "variantDataFromAPI",
          JSON.stringify(variants)
        );
      }
    }, [variants]);
  
    // useEffect(() => {
    //   if (
    //     apiCallMainProduct["variant_attributes"] &&
    //     apiCallMainProduct["variant_attributes"].length > 0
    //   ) {
    //     let temp = [...variantColumns];
    //     let variantAttributeAddedArray = apiCallMainProduct[
    //       "variant_attributes"
    //     ].map((attribute) => {
    //       return {
    //         title: attribute,
    //         dataIndex: `variant${attribute}`,
    //         key: `variant${attribute}`,
    //         editable: true,
    //       };
    //     });
    //     temp = [...temp, ...variantAttributeAddedArray];
    //     setVariantColumns(temp);
    //   }
    // }, [apiCallMainProduct]);
  
    const getProductData = async () => {
      setPageLoader(true);
      let { id, source_product_id } = parseQueryString(props.location.search);
      setProductId(id);
      let postData = {
        // "filter[container_id][1]": id,
        // source_marketplace: "ebay",
        container_id: id,
        source_product_id,
        // source_marketplace: "ebay",
      };
      let { success, data, message } = await fetchProductById(
        viewProductDataURL,
        postData
      );
      if (success) {
        // extractDataFromAPI(data, data.rows);
        extractDataFromAPI(
          data?.product_data,
          data?.product_data,
          data?.ebay_product_response
        );
      } else {
        notify.error(message);
        redirect("/auth/login");
      }
      setPageLoader(false);
    };
    const redirect = (url) => {
      props.history.push(url);
    };
  
    const getCountryName = (site_id) => {
      let countryName = json.flag_country.filter(
        (country) => country["value"] === site_id
      );
      return countryName.length && countryName[0]["label"];
    };
  
    const getAllConnectedAccounts = async () => {
      let {
        success: accountConnectedSuccess,
        data: connectedAccountData,
        message,
      } = await getConnectedAccounts();
  
      if (accountConnectedSuccess) {
        let ebayAccounts = connectedAccountData.filter(
          (account) => account["marketplace"] === "ebay"
        );
  
        let tempObj = {};
        // ebayAccounts.forEach((account, key) => {
        //   tempObj[account["id"]] = `${getCountryName(
        //     account["warehouses"][0]["site_id"]
        //   )}`;
        // });
  
        let tempArr = ebayAccounts.map((account, key) => {
          let accountName = {
            label: `${getCountryName(account["warehouses"][0]["site_id"])}-${
              account["warehouses"][0]["user_id"]
            }`,
            value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
              account["warehouses"][0]["user_id"]
            }`,
            siteID: account["warehouses"][0]["site_id"],
            shopId: account["id"],
          };
          return accountName;
        });
        setconnectedAccounts(tempArr);
      }
    };
  
    const getMetaFields = async () => {
      let { source_product_id } = parseQueryString(props.location.search);
      let postData = {
        product_id: source_product_id,
      };
      let { success, data } = await fetchProductById(getMetafieldsURL, postData);
      if (success) {
        console.log(data);
      }
    };
  
    useEffect(() => {
      getProductData();
      getAllConnectedAccounts();
      // getMetaFields();
      return () => {
        globalState.removeLocalStorage("variantDataFromAPI");
      };
    }, []);
  
    useEffect(() => {
      if (errors) {
        for (const [key, value] of Object.entries(errors)) {
          if (value.hasOwnProperty("Errors")) {
            notify.error("", key);
          } else {
            notify.success("", key);
          }
        }
      }
    }, [errors]);
    function differenceObjectDeep(source, other) {
      return _.reduce(
        source,
        function (result, value, key) {
          if (_.isObject(value) && _.isObject(other[key])) {
            result[key] = differenceObjectDeep(value, other[key]);
          } else if (!_.isEqual(value, other[key])) {
            result[key] = other[key];
          }
          return result;
        },
        _.omit(other, _.keys(source))
      );
    }
  
    const mergeContainerAndVariation = (containerData, variantionData) => {
      let postData = [];
      variantionData.forEach((variantion) => {
        let mergedObj = {};
        for (const key in containerData) {
          mergedObj = {
            ...mergedObj,
            ...variantion,
            ...{ [key]: containerData[key] },
          };
        }
        postData.push(mergedObj);
      });
      return postData;
    };
  
    const moreFilteration = (data) => {
      let postData = {
        edited_fields: {
          // variation: []
        },
        container_id: apiCallMainProduct["container_id"],
        source_product_id:
          // productType === "variation"
          // ?
          apiCallMainProduct["source_product_id"],
        // : apiCallMainProduct["container_id"],
      };
      if (productType === "variation") {
        postData["edited_fields"] = {
          variation: [],
        };
        if (
          Object.keys(data.containerData).length === 0 &&
          data.variantionData.length === 0
        ) {
          delete postData["edited_fields"]["variation"];
        }
        if (
          Object.keys(data.containerData).length > 0 &&
          data.variantionData.length === 0
        ) {
          let tempForVariation = [];
          variants.forEach((variant) => {
            let tempObj = {};
            tempObj["source_product_id"] = variant["source_product_id"];
            for (const key in data.containerData) {
              tempObj[key] = data.containerData[key];
            }
            tempForVariation.push(tempObj);
          });
          postData["edited_fields"]["variation"] = [...tempForVariation];
        }
        if (
          Object.keys(data.containerData).length === 0 &&
          data.variantionData.length > 0
        ) {
          let tempForVariation = [];
          let tempObj;
          data.variantionData.forEach((e) => {
            tempObj = {};
            for (const key in e) {
              tempObj[key] = e[key];
            }
            // if (
            //   tempObj.hasOwnProperty("source_product_id") &&
            //   Object.keys(tempObj).length === 1
            // ) {
            // } else {
            tempForVariation.push(tempObj);
            // }
          });
          postData["edited_fields"]["variation"] = [...tempForVariation];
        }
        if (
          Object.keys(data.containerData).length > 0 &&
          data.variantionData.length > 0
        ) {
          postData["edited_fields"]["variation"] = mergeContainerAndVariation(
            data.containerData,
            data.variantionData
          );
        }
      }
      if (productType === "simple") {
        if (
          Object.keys(data.containerData).length > 0 &&
          data.variantionData.length === 0
        ) {
          postData["edited_fields"] = { ...data.containerData };
        } else if (
          Object.keys(data.containerData).length === 0 &&
          data.variantionData.length > 0
        ) {
          if (data.variantionData[0].hasOwnProperty("source_product_id")) {
            delete data.variantionData[0].source_product_id;
          }
          postData["edited_fields"] = { ...data.variantionData[0] };
        } else if (
          Object.keys(data.containerData).length > 0 &&
          data.variantionData.length > 0
        ) {
          postData["edited_fields"] = mergeContainerAndVariation(
            data.containerData,
            data.variantionData
          )[0];
          if (postData["edited_fields"].hasOwnProperty("source_product_id")) {
            delete postData["edited_fields"].source_product_id;
          }
        }
      }
      return postData;
    };
  
    const menu = (
      <Menu>
        <Menu.Item key="SyncWithShopify">
          <SyncOutlined /> Sync
        </Menu.Item>
        <Menu.Item
          key="upload"
          onClick={async () => {
            let postData = {
              product_id: [apiCallMainProduct["source_product_id"]],
            };
            let data = await postActionOnProductById(
              uploadProductByIdURL,
              postData
            );
            // if (data[0]) {
            //   let tempObj = {};
            //   for (const [shopId, countrySelected] of Object.entries(
            //     connectedAccounts
            //   )) {
            //     if (shopId in data[0]) {
            //       tempObj[countrySelected] = data[0][shopId];
            //     }
            //   }
            //   setErrors(tempObj);
            // }
          }}
        >
          <UploadOutlined /> Upload
        </Menu.Item>
        <Menu.Item
          key="end"
          onClick={async () => {
            let postData = {
              product_id: [apiCallMainProduct["source_product_id"]],
            };
            let { data, success } = await postActionOnProductById(
              endProductByIdURL,
              postData
            );
            if (success) {
              notify.success(data);
            }
          }}
        >
          <UploadOutlined /> End
        </Menu.Item>
      </Menu>
    );
  
    const differenceArrayDeep = () => {
      let source = JSON.parse(globalState.getLocalStorage("variantDataFromAPI"));
      let target = variantData;
      let temp = [];
      Object.keys(source).forEach((s1) => {
        temp[s1] = {};
        Object.keys(source[s1]).forEach((field) => {
          if (
            [
              "sku",
              "quantity",
              "price",
              "barcode",
              "weight",
              "source_product_id",
            ].includes(field)
          ) {
            if (source[s1][field] != target[s1][field]) {
              temp[s1][field] = target[s1][field];
            } else if (field === "source_product_id") {
              temp[s1][field] = target[s1][field];
            }
          }
        });
      });
      return temp.filter((obj) => Object.keys(obj).length > 0);
    };
  
    const prepareDataForSave = () => {
      let variantCommonFieldsChanges = [];
      if (variantData.length) {
        variantCommonFieldsChanges = differenceArrayDeep(variants, variantData);
      }
      let tempObj = {
        containerData: {},
        variantionData: [],
      };
      tempObj["variantionData"] = variantCommonFieldsChanges;
      for (const key in mainProduct) {
        if (key.includes("check") && mainProduct[key]["enable"]) {
          let tempKey = key.replace("check", "");
          tempKey = tempKey.charAt(0).toLowerCase() + tempKey.slice(1);
          tempObj["containerData"][tempKey] = mainProduct[key]["value"];
        }
      }
      return tempObj;
    };
  
    const callSaveAPI = async (moreFilteredData) => {
      setSaveBtnLoader(true);
      let { success, message } = await editProductById(
        editProductByIdURL,
        moreFilteredData
      );
      if (success) {
        notify.success(message);
      } else {
        notify.error(message);
      }
      setSaveBtnLoader(false);
    };
  
    const getItemURLs = () => (
      <Stack>
        {itemUrls.map((itemUrl, index) => {
          return (
            <React.Fragment key={index}>
              <Badge status="success">{itemUrl?.site}</Badge>
              <Text style={{ fontSize: "1.5rem" }}>
                <Link
                  url={itemUrl?.url}
                  removeUnderline
                  external
                  onClick={() => setViewItemURLsPopoverActive(false)}
                >
                  {itemUrl?.url.split("/").reverse()[0]}
                </Link>
              </Text>
            </React.Fragment>
          );
        })}
      </Stack>
    );
    return (
      <PageHeader
        // className="site-page-header-responsive"
        title={
          <Stack alignment="center">
            <Thumbnail
              source={mainProduct?.["mainImage"]}
              size="large"
              alt="image"
            />
            <Stack vertical spacing="extraTight">
              <>{mainProduct["title"]}</>
              {getItemURLs()}
              {/* <Popover
                placement="right"
                content={getItemURLs()}
                // title="Item ID(s)"
                trigger="click"
                visible={viewItemURLsPopoverActive}
                onVisibleChange={(e) => setViewItemURLsPopoverActive(e)}
              >
                <Button plain>View on eBay</Button>
              </Popover> */}
            </Stack>
          </Stack>
        }
        // subTitle={
        //   <Popover
        //     placement="right"
        //     content={getItemURLs()}
        //     title="Item ID(s)"
        //     trigger="click"
        //     visible={viewItemURLsPopoverActive}
        //     onVisibleChange={(e) => setViewItemURLsPopoverActive(e)}
        //   >
        //     <Button plain>View on eBay</Button>
        //   </Popover>
        // }
        ghost={true}
        onBack={() => props.history.push("/panel/ebay/products")}
        extra={[
          <Button
            key="2"
            primary
            onClick={async () => {
              let filteredData = prepareDataForSave();
              let moreFilteredData = moreFilteration(filteredData);
              callSaveAPI(moreFilteredData);
            }}
            loading={saveBtnLoader}
          >
            Save
          </Button>,
          <Button
            key="1"
            destructive
            onClick={(e) => {
              getProductData();
            }}
          >
            Discard
          </Button>,
          <Dropdown key="bulkAction" overlay={menu} trigger={["click"]}>
            <Button>
              <div>
                Actions <DownOutlined />
              </div>
            </Button>
          </Dropdown>,
        ]}
      >
        {pageLoader ? (
          <Spin />
        ) : (
          <TabsComponent
            tabContents={{
              Variants: (
                // <VariantComponentDataBackup size={"small"} dataSource={variants} variantColumns={variantColumns} />
                <VariantsComponentBKP
                  size={"small"}
                  dataSource={variants}
                  variantColumns={variantColumns}
                  innerVariantColumns={innerVariantColumns}
                  setVariantColumns={setVariantColumns}
                  variantData={variantData}
                  setVariantData={setVariantData}
                  editedProductDataFromAPI={editedProductDataFromAPI}
                  variantAttributeColumns={variantAttributeColumns}
                  innerVariantAttributeColumns={innerVariantAttributeColumns}
                />
              ),
              Details: (
                <DetailsComponentNew
                  mainProduct={mainProduct}
                  setMainProduct={setMainProduct}
                  apiCallMainProduct={apiCallMainProduct}
                  editedProductDataFromAPI={editedProductDataFromAPI}
                />
              ),
              Description: (
                <DescriptionComponent
                  mainProduct={mainProduct}
                  setMainProduct={setMainProduct}
                  apiCallMainProduct={apiCallMainProduct}
                  editedProductDataFromAPI={editedProductDataFromAPI}
                />
              ),
              Images: <ImagesComponent mainProduct={mainProduct} />,
              "Product Data": (
                <ProductDataComponentNew
                  data={mainProduct}
                  errors={errors}
                  errorsData={errorsData}
                  connectedAccounts={connectedAccounts}
                />
              ),
            }}
          />
        )}
      </PageHeader>
    );
  };
  
  export default ProductViewPolarisNewBKP;
  
  // export const ProductDataComponent = ({ data, errors }) => {
  //   return (
  //     <Collapse onChange={() => {}}>
  //       {!isUndefined(data.ebay_product_data) && (
  //         <Collapse.Panel header="eBay Product Data" key="1">
  //           <ReactJson
  //             style={{ maxHeight: 200, overflowY: "scroll" }}
  //             src={!isUndefined(data.ebay_product_data) && data.ebay_product_data}
  //           />
  //         </Collapse.Panel>
  //       )}
  //       {/* {!isUndefined(data.report) && (
  //         <Collapse.Panel header="eBay Error(s) & Warnings" key="2">
  //           <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}>
  //             {data.report.map((error) => {
  //               return (
  //                 <Col span={24}>
  //                   <Alert
  //                     message={error["SeverityCode"]}
  //                     description={error["ShortMessage"]}
  //                     type={error["SeverityCode"].toLowerCase()}
  //                     showIcon
  //                   />
  //                 </Col>
  //               );
  //             })}
  //           </Row>
  //         </Collapse.Panel>
  //       )} */}
  //       {!isUndefined(errors) && (
  //         <Collapse.Panel header="eBay Error(s) & Warnings" key="2">
  //           <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}>
  //             {Object.keys(errors).map((error) => {
  //               return (
  //                 <Col span={24}>
  //                   <Alert
  //                     message={error}
  //                     description={errors[error]["Errors"].map((e) => (
  //                       <p>{e}</p>
  //                     ))}
  //                     showIcon
  //                   />
  //                 </Col>
  //               );
  //             })}
  //             {/* {data.report.map((error) => {
  //               return (
  //                 <Col span={24}>
  //                   <Alert
  //                     message={error["SeverityCode"]}
  //                     description={error["ShortMessage"]}
  //                     type={error["SeverityCode"].toLowerCase()}
  //                     showIcon
  //                   />
  //                 </Col>
  //               );
  //             })} */}
  //           </Row>
  //         </Collapse.Panel>
  //       )}
  //       {!isUndefined(data.details) && (
  //         <Collapse.Panel header="Shopify Product Data" key="3">
  //           <ReactJson
  //             style={{ maxHeight: 200, overflowY: "scroll" }}
  //             src={!isUndefined(data.details) && data.details}
  //           />
  //         </Collapse.Panel>
  //       )}
  //     </Collapse>
  //   );
  // };
  