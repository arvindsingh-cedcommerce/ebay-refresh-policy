import { PageHeader, Typography, Dropdown, Menu, Popover, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import {
  editProductById,
  fetchProductById,
  postActionOnProductById,
} from "../../../../../APIrequests/ProductsAPI";
import { json } from "../../../../../globalConstant/static-json";
import { parseQueryString } from "../../../../../services/helperFunction";
import {
  editProductByIdURL,
  endProductByIdURL,
  getMetafieldsURL,
  relistItemURL,
  syncProductDetails,
  uploadProductByIdURL,
  viewProductDataURL,
} from "../../../../../URLs/ProductsURL";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import { notify } from "../../../../../services/notify";
import DescriptionComponent from "./DescriptionComponent";
import _ from "lodash";
import VariantsComponent from "./Components/VariantsComponent";
import { globalState } from "../../../../../services/globalstate";
import ImagesComponent from "./Components/ImagesComponent";
import {
  DeleteOutlined,
  DownOutlined,
  RollbackOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import DetailsComponentNew from "./Components/DetailsComponentNew";
import ProductDataComponentNew from "./Components/ProductDataComponentNew";
import {
  Link,
  Thumbnail,
  Stack,
  Button,
  Icon,
  Card,
  Modal,
  SkeletonPage,
  Layout,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
  List,
  Banner,
  FooterHelp,
} from "@shopify/polaris";
import { AlertMinor } from "@shopify/polaris-icons";
import { getCountyrName } from "../Template/Components/TemplateGridComponent";
import NoProductImage from "../../../../../assets/notfound.png";
import AdditionalDetailsComponent from "./Components/AdditionalDetailsComponent";
import {
  getFillDataForEditedContent,
  getParsedMetaFieldsData,
  parseMetaFieldsData,
} from "./helperFunctions/viewProductHelper";
import MetafieldsComponent from "./Components/MetafieldsComponent";
import { tokenExpireValues } from "../../../../../HelperVariables";

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
    title: "Included",
    dataIndex: "variantExcluded",
    key: "variantExcluded",
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
const customVariantGridColumns = [
  // {
  //   title: "Image",
  //   dataIndex: "customvariantImage",
  //   key: "customvariantImage",
  //   // fixed: "left",
  //   // width: 75,
  //   editable: false,
  // },
  {
    title: "SKU",
    dataIndex: "customvariantSKU",
    key: "customvariantSKU",
    editable: true,
  },
  {
    title: "Inventory",
    dataIndex: "customvariantQuantity",
    key: "customvariantQuantity",
    editable: true,
  },
  {
    title: "Price",
    dataIndex: "customvariantPrice",
    key: "customvariantPrice",
    editable: true,
  },
  {
    title: "Barcode",
    dataIndex: "customvariantBarcode",
    key: "customvariantBarcode",
    editable: true,
  },
  {
    title: "Weight",
    dataIndex: "customvariantWeight",
    key: "customvariantWeight",
    editable: true,
  },
  {
    title: "Weight Unit",
    dataIndex: "customvariantWeightUnit",
    key: "customvariantWeightUnit",
    editable: true,
  },
];
// let editedProductDataFromAPI = ''
const commonFields = [
  "title",
  "brand",
  "tags",
  "product_type",
  "description",
  "length",
  "width",
  "height",
  "unit",
  "packageType",
  "privateListing",
  "subtitle",
];
const { Text } = Typography;

const ProductViewPolarisNew = (props) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [mainProduct, setMainProduct] = useState({});
  const [apiCallMainProduct, setApiCallMainProduct] = useState({});
  const [variants, setVariants] = useState([]);
  const [customvariants, setCustomVariants] = useState([]);
  const [productId, setProductId] = useState(null);
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);
  const [statusValues, setStatusValues] = useState([]);

  const [connectedAccounts, setconnectedAccounts] = useState({});
  const [errors, setErrors] = useState({});

  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });
  const [btnLoader, setBtnLoader] = useState(false);

  // variant table
  const [variantColumns, setVariantColumns] = useState(columns);
  const [customVariantColumns, setCustomVariantColumns] = useState(
    customVariantGridColumns
  );
  const [variantData, setVariantData] = useState([]);
  const [customVariantData, setCustomVariantData] = useState([]);

  // producrt type: simple/variation
  const [productType, setProductType] = useState("");

  //
  const [editedProductDataFromAPI, seteditedProductDataFromAPI] = useState([]);

  // errorsData
  const [errorsData, setErrorsData] = useState({});

  // itemUrls
  const [itemUrls, setItemUrls] = useState([]);
  const [viewItemURLsPopoverActive, setViewItemURLsPopoverActive] =
    useState(false);

  // check if product gets edited
  const [isProductEdited, setIsProductEdited] = useState(false);

  // showSkeleton
  const [showSkeleton, setShowSkeleton] = useState(true);

  // errors popup
  const [errorPopup, setErrorPopup] = useState({
    active: false,
    content: [],
    title: "",
  });

  // metafields data
  const [metafields, setMetafields] = useState({
    present: false,
    content: {},
  });

  const extractEditedDataForMainProduct = (formainproduct) => {
    let tempObj = {};
    for (const key in formainproduct) {
      if (commonFields.includes(key)) {
        tempObj[key] = formainproduct[key];
      }
    }
    return tempObj;
  };

  useEffect(() => {
    // console.log('itemUrls', itemUrls);
    if (itemUrls.length === 1) setStatusValues([getStatusValue(itemUrls[0])]);
    if (itemUrls.length > 1) {
      let statusArr = [];
      itemUrls.map((item) => {
        const statusVal = getStatusValue(item);
        if (statusVal) statusArr.push(statusVal);
      });
      setStatusValues([...statusArr]);
    }
  }, [itemUrls]);

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
  const getUploadedItemDetails = (errors, ebay_product_response) => {
    // console.log(errors);
    let statusShopIDs = Object.keys(errors).map((shopId) => {
      let temp = {};
      temp["shopId"] = shopId;
      temp["endStatus"] = errors[shopId]?.["ended"] ? true : false;
      if (errors[shopId]?.["ItemId"]) {
        temp["itemId"] = errors[shopId]?.["ItemId"];
      }
      temp["hasError"] = errors[shopId]?.["Errors"] ? true : false;
      if (
        errors[shopId]?.["Errors"] &&
        Array.isArray(errors[shopId]?.["Errors"]) &&
        errors[shopId]?.["Errors"].length
      ) {
        temp["errorsList"] = [...errors[shopId]?.["Errors"]];
      }
      return temp;
      // return {
      //   shopId: shopId,
      //   endStatus: errors[shopId]?.["ended"] ? true : false,
      //   itemId: errors[shopId]?.["ItemId"],
      //   hasError: errors[shopId]?.["Errors"] ? true : false,
      // };
    });
    let itemUrls = [];
    if (ebay_product_response) {
      itemUrls = ebay_product_response.map((response) => {
        return {
          site: response?.Site,
          url: response?.ListingDetails?.ViewItemURL,
          itemId:
            response?.ListingDetails?.ViewItemURL?.split("/").reverse()[0],
        };
      });
    }
    // console.log('itemUrls', itemUrls);
    let matchedAccounts = [];
    // console.log("statusShopIDs", statusShopIDs);
    statusShopIDs.forEach((shopIdData) => {
      connectedAccounts.forEach((connectedAccount) => {
        if (connectedAccount["shopId"] == shopIdData["shopId"]) {
          matchedAccounts.push({ ...shopIdData, ...connectedAccount });
        }
      });
    });
    // console.log(
    //   "matchedAccounts",
    //   matchedAccounts,
    //   itemUrls
    //   // ebay_product_response
    // );
    let tempURLs = [];

    for (let i = 0; i < matchedAccounts.length; i++) {
      let flag = 1;
      for (let j = 0; j < itemUrls.length; j++) {
        if (matchedAccounts[i]["itemId"] === itemUrls[j]["itemId"]) {
          // console.log(matchedAccounts[i], itemUrls[j]);
          flag = 0;
          tempURLs.push({ ...matchedAccounts[i], ...itemUrls[j] });
        }
      }
      if (flag) {
        tempURLs.push(matchedAccounts[i]);
      }
    }
    // console.log("tempURLs", tempURLs);

    // tempURLs = matchedAccounts
    //   .map((matchedAccount, index) => {
    //     if (
    //       matchedAccount.itemId === (itemUrls[index] && itemUrls[index].itemId)
    //     ) {
    //       return { ...matchedAccount, ...itemUrls[index] };
    //     } else {
    //       return matchedAccount;
    //     }
    //   })
    //   .filter((matchedAccount) => matchedAccount.hasOwnProperty("itemId"));
    // console.log("tempURLs", tempURLs);
    setItemUrls(tempURLs);
  };

  const extractProductUploadErrorData = (errors, ebay_product_response) => {
    let errorsObj = {};
    let itemIdObj = {};
    // console.log(errors, ebay_product_response);
    Object.keys(errors).map((shopId) => {
      if (errors[shopId].hasOwnProperty("Errors") && errors[shopId]["Errors"]) {
        errorsObj[shopId] = { ...errors[shopId]?.Errors };
      }
      // else if (errors[shopId].hasOwnProperty("ItemId")) {
      //   itemIdObj[shopId] = {
      //     itemId: errors[shopId]?.itemId,
      //     jsonResponse: ebay_product_response,
      //   };
      // }
    });
    if (ebay_product_response) {
      Object.keys(errors).forEach((shopId) => {
        ebay_product_response.forEach((response) => {
          if (
            errors[shopId].hasOwnProperty("ItemId") &&
            errors[shopId]["ItemId"] === response["ItemID"] &&
            !errors[shopId]?.ended
          ) {
            // console.log(errors[shopId]["ItemId"], response['ItemID']);
            itemIdObj[shopId] = {
              itemId: errors[shopId]?.ItemId,
              jsonResponse:
                ebay_product_response &&
                ebay_product_response.find(
                  (product) => product.ItemID === errors[shopId]?.ItemId
                ),
              // ended: errors[shopId]?.ended
            };
          }
        });
        // if (errors[shopId].hasOwnProperty("ItemId") && errors[shopId]["ItemId"]) {
        //   itemIdObj[shopId] = {
        //     itemId: errors[shopId]?.itemId,
        //     jsonResponse: ebay_product_response,
        //   };
        // }
      });
    }
    getUploadedItemDetails(errors, ebay_product_response);
    // console.log(itemIdObj, errorsObj);
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
      // let shopsForErrors = editedData[0].shops;
      let temp = [...editedData[0].shops];
      let tempObj = {};
      // temp.forEach(obj => {
      //   const {shop_id, ...remainingProps} = obj
      //   console.log(shop_id, remainingProps);
      //   tempObj[shop_id] = remainingProps
      // })
      temp.forEach((obj, index) => {
        if (index == 0 || obj?.ItemId) {
          const { shop_id, ...remainingProps } = obj;
          tempObj[shop_id] = remainingProps;
        }
      });
      let shopsForErrors = { ...tempObj };

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

  const getCheckedAtleastOnce = (variantProductsData, index) => {
    let count = 0;
    let variantCount = variantProductsData.length;
    let temp = [...variantProductsData];
    temp.forEach((curr) => curr.isExclude === true && count++);
    let flag = false;
    if (count + 1 === variantCount) {
      flag = true;
    } else flag = false;
    return flag;
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

      let productDataClone = [...productData];
      let mainProductData = {};
      let variantProductsData = [];
      sortedProductData = productDataClone.reduce((acc, element) => {
        if (!element.hasOwnProperty("sku")) {
          return [element, ...acc];
        }
        return [...acc, element];
      }, []);
      let editedData = sortedProductData.filter(
        (row) =>
          row.hasOwnProperty("source_marketplace") &&
          row["source_marketplace"] === "app"
      );
      sortedProductData = sortedProductData.filter((row) => {
        if (
          row.hasOwnProperty("source_marketplace") &&
          row["source_marketplace"] === "app"
        ) {
        } else {
          return row;
        }
      });
      let tempUtkEditedData = {};
      if (editedData.length) {
        tempUtkEditedData = extractEditedData(
          editedData,
          sortedProductData.length,
          ebay_product_response
        );
        seteditedProductDataFromAPI(tempUtkEditedData);
        // seteditedProductDataFromAPI(
        //   extractEditedData(
        //     editedData,
        //     sortedProductData.length,
        //     ebay_product_response
        //   )
        // );
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
        unit,
        packageType,
        privateListing,
        subtitle,
      } = mainProductData;
      variant_attributes = Object.values(variant_attributes);

      variantProductsData.forEach((variant) => {
        if (!tags) {
          if (variant.hasOwnProperty("tags")) {
            tags = variant["tags"];
          }
        }
        additional_images_arr = [...additional_images];
        // additional_images_arr = [
        //   ...additional_images_arr,
        //   ...Object.values(variant["additional_images"]),
        // ];
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
        checkProduct_type: {
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
      tempObj["checkProduct_type"]["value"] = product_type ? product_type : "";
      tempObj["tags"] = tags ? tags : "";
      tempObj["checkTags"]["value"] = tags ? tags : "";
      tempObj["checkTags"]["valueArray"] = tags ? tags.split(",") : [];
      tempObj["mainImage"] = main_image ? main_image : "";
      tempObj["image_array"] = additional_images_arr
        ? additional_images_arr
        : [];
      tempObj["length"] = length ? length : "";
      tempObj["width"] = width ? width : "";
      tempObj["height"] = height ? height : "";
      tempObj["unit"] = unit ? unit : "in";
      tempObj["packageType"] = packageType ? packageType : "";
      tempObj["privateListing"] = privateListing ? privateListing : false;
      tempObj["subtitle"] = subtitle ? subtitle : "";
      // tempObj["privateListing"] = privateListing ? privateListing : false;
      tempObj["variant_attributes"] =
        variant_attributes.length > 0 ? variant_attributes : [];
      setMainProduct(tempObj);
      setApiCallMainProduct(tempObj);
      let tempVariantProductsData = variantProductsData.map((e) => {
        let tempObj = {};
        for (const key in e) {
          tempObj[`custom${key}`] = "";
        }
        return tempObj;
      });
      let includeIsExcludeKey = variantProductsData.map((e, index) => {
        if (e.hasOwnProperty("isExclude")) {
          return { ...e, isExcludeDisabled: false };
        } else {
          let flag = getCheckedAtleastOnce(variantProductsData, index);
          return { ...e, isExclude: false, isExcludeDisabled: flag };
        }
      });
      let tempUtkEditedVariantProductsData = getFillDataForEditedContent(
        tempUtkEditedData,
        tempVariantProductsData
      );
      // setVariants(variantProductsData);
      setVariants(includeIsExcludeKey);
      if (tempUtkEditedVariantProductsData)
        setCustomVariants(tempUtkEditedVariantProductsData);
      else setCustomVariants(tempVariantProductsData);
      if (tempUtkEditedVariantProductsData)
        setCustomVariantData(tempUtkEditedVariantProductsData);
      else setCustomVariantData(tempVariantProductsData);
      // setCustomVariants(tempVariantProductsData);
      // setCustomVariants(tempUtkEditedVariantProductsData)
      // setCustomVariantData(tempUtkEditedVariantProductsData)
    }
  };

  // custom variant edited data - POPULATE
  const fillDataForEditedContent = (editedData) => {
    let temp = [...customvariants];
    console.log("editedData", editedData);
    if (Object.keys(editedData).length > 0 && editedData?.variationProduct) {
      let arr1 = editedData.variationProduct;
      console.log(arr1);
      let arr2 = [...temp];
      console.log(arr2);
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
      // console.log("arr3", arr3);
      // setTempState(arr3);
      // setVariantData(arr3);
      console.log("arr3", arr3);
      // setCustomVariants(arr3);
      // setCu
    }
  };
  useEffect(() => {
    if (variants.length > 0) {
      globalState.setLocalStorage(
        "variantDataFromAPI",
        JSON.stringify(variants)
      );
    }
  }, [variants]);

  useEffect(() => {
    if (
      apiCallMainProduct["variant_attributes"] &&
      apiCallMainProduct["variant_attributes"].length > 0
    ) {
      let temp = [...variantColumns];
      let variantAttributeAddedArray = apiCallMainProduct[
        "variant_attributes"
      ].map((attribute) => {
        return {
          title: attribute,
          dataIndex: `variant${attribute}`,
          key: `variant${attribute}`,
          editable: true,
        };
      });
      let customTemp = [...customVariantColumns];
      let customVariantAttributeAddedArray = apiCallMainProduct[
        "variant_attributes"
      ].map((attribute) => {
        return {
          title: attribute,
          dataIndex: `customvariant${attribute}`,
          key: `customvariant${attribute}`,
          editable: true,
        };
      });
      if (temp.length == 8) {
        temp = [...temp, ...variantAttributeAddedArray];
      }
      if (customTemp.length == 6) {
        customTemp = [...customTemp, ...customVariantAttributeAddedArray];
      }
      setVariantColumns(temp);
      setCustomVariantColumns(customTemp);
    }
  }, [apiCallMainProduct]);

  const getProductData = async () => {
    setPageLoader(true);
    setShowSkeleton(true);
    let { id, source_product_id } = parseQueryString(props.location.search);
    setProductId(id);
    let postData = {
      container_id: id,
      source_product_id,
    };
    let { success, data, message } = await fetchProductById(
      viewProductDataURL,
      postData
    );
    if (success) {
      if (data?.product_metafields?.metafields) {
        let tempMetafields = { ...metafields };
        tempMetafields["present"] = true;
        const parsedMetaFields = getParsedMetaFieldsData(
          data.product_metafields.metafields
        );
        tempMetafields["content"] = { ...parsedMetaFields };
        setMetafields(tempMetafields);
      }
      extractDataFromAPI(
        data?.product_data,
        data?.product_data,
        data?.ebay_product_response
      );
    } else if (message.includes("Product not found")) {
      notify.info("Product not found");
      props.history.push("/panel/ebay/products");
    } else {
      notify.error(message);
      // redirect("/auth/login");
    }
    setShowSkeleton(false);
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

  const getCountryAbbreviation = (site_id) => {
    let countryName = json.flag_country.filter(
      (country) => country["value"] === site_id
    );
    return countryName.length && countryName[0]["abbreviation"];
  };

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
      code,
    } = await getConnectedAccounts();

    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );

      let tempObj = {};

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
          abbreviation: getCountryAbbreviation(
            account["warehouses"][0]["site_id"]
          ),
          username: account["warehouses"][0]["user_id"],
          image: getCountyrName(account["warehouses"][0]["site_id"]),
          active:
            account["warehouses"][0]["status"] === "active" ? true : false,
        };
        return accountName;
      });
      setconnectedAccounts(tempArr);
    } else {
      notify.error(message);
      if (tokenExpireValues.includes(code)) props.history.push("/auth/login");
    }
  };

  useEffect(() => {
    if (connectedAccounts.length) {
      getProductData(connectedAccounts);
    }
  }, [connectedAccounts]);

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
    getAllConnectedAccounts();
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
      source_product_id: apiCallMainProduct["source_product_id"],
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
          tempForVariation.push(tempObj);
        });
        postData["edited_fields"]["variation"] = [...tempForVariation];
      }
      if (
        Object.keys(data.containerData).length > 0 &&
        data.variantionData.length > 0
      ) {
        //
        let tempDataVariation = [...data.variantionData];
        variants.forEach((variant, index) => {
          tempDataVariation[index]["source_product_id"] =
            variant["source_product_id"];
        });
        postData["edited_fields"]["variation"] = mergeContainerAndVariation(
          data.containerData,
          // data.variantionData
          tempDataVariation
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
          // delete data.variantionData[0].source_product_id;
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
          // check for this line
          // delete postData["edited_fields"].source_product_id;
        }
      }
    }
    return postData;
  };

  const differenceArrayDeepNew = (data) => {
    // console.log(data);
    let parsedDataArray = data.map((variantData) => {
      let tempObj = {};
      for (const key in variantData) {
        if (variantData[key] !== "") {
          tempObj[key.replace("custom", "")] = variantData[key];
        }
      }
      return tempObj;
    });
    return parsedDataArray;
  };
  const prepareDataForSave = () => {
    let variantCommonFieldsChanges = [];
    let variantCommonFieldsChangesNew = [];
    if (customVariantData.length) {
      variantCommonFieldsChangesNew = differenceArrayDeepNew(customVariantData);
    }
    let tempObj = {
      containerData: {},
      variantionData: [],
    };
    tempObj["variantionData"] = variantCommonFieldsChangesNew;
    for (const key in mainProduct) {
      if (key.includes("check") && mainProduct[key]["enable"]) {
        let tempKey = key.replace("check", "");
        tempKey = tempKey.charAt(0).toLowerCase() + tempKey.slice(1);
        tempObj["containerData"][tempKey] = mainProduct[key]["value"];
      }
      if (
        [
          "length",
          "width",
          "height",
          "unit",
          "packageType",
          "privateListing",
          "subtitle",
        ].includes(key)
      ) {
        tempObj["containerData"][key] = mainProduct[key];
      }
    }
    return tempObj;
  };

  const callSaveAPI = async (moreFilteredData) => {
    setSaveBtnLoader(true);
    let { success, message, data } = await editProductById(
      editProductByIdURL,
      moreFilteredData
    );
    if (success) {
      notify.success(message ? message : data);
      getProductData();
    } else {
      notify.error(message);
    }
    setSaveBtnLoader(false);
  };

  const getBadge = (test) => {
    if (test?.endStatus && test?.hasError) {
      let errorWarningStructure = <></>;
      if (
        test.errorsList &&
        Array.isArray(test.errorsList) &&
        test.errorsList.length > 0
      ) {
        errorWarningStructure = test.errorsList.map((item) => {
          if (item && typeof item == "object" && !Array.isArray(item)) {
            const { SeverityCode, LongMessage } = item;
            return (
              <Banner
                title={
                  SeverityCode == "Error"
                    ? "Error"
                    : SeverityCode == "Warning"
                    ? "Warning"
                    : ""
                }
                status={
                  SeverityCode == "Error"
                    ? "critical"
                    : SeverityCode == "Warning"
                    ? "warning"
                    : ""
                }
              >
                <>{LongMessage}</>
              </Banner>
            );
          } else {
            return (
              <Banner title="Error" status="critical">
                <>{item}</>
              </Banner>
            );
          }
        });
      }
      return (
        <Tag
          color="rgb(255 215 157)"
          style={{ color: "#000", borderRadius: "10px" }}
        >
          {/* Errors */}
          <div
            onClick={() => {
              let errorsList = (
                <List type="bullet">
                  {" "}
                  {test.errorsList.map((error) => (
                    <List.Item>{error}</List.Item>
                  ))}
                </List>
              );
              let errorPopupTitle = (
                <Stack alignment="center" vertical={false}>
                  {test.image}
                  <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
                </Stack>
              );
              setViewItemURLsPopoverActive(false);
              setErrorPopup({
                ...errorPopup,
                active: true,
                // content: errorsList,
                content: errorWarningStructure,
                title: errorPopupTitle,
              });
            }}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            <Stack spacing="extraTight">
              <Icon source={AlertMinor} color={"red"} />
              <>Ended</>
            </Stack>
          </div>
        </Tag>
      );
    } else if (test?.endStatus) {
      return (
        <Tag color="#ffd79d" style={{ color: "#000", borderRadius: "10px" }}>
          Ended
        </Tag>
      );
    } else if (test?.itemId && test?.hasError) {
      let errorWarningStructure = <></>;
      if (
        test.errorsList &&
        Array.isArray(test.errorsList) &&
        test.errorsList.length > 0
      ) {
        errorWarningStructure = test.errorsList.map((item) => {
          if (item && typeof item == "object" && !Array.isArray(item)) {
            const { SeverityCode, LongMessage } = item;
            return (
              <Banner
                title={
                  SeverityCode == "Error"
                    ? "Error"
                    : SeverityCode == "Warning"
                    ? "Warning"
                    : ""
                }
                status={
                  SeverityCode == "Error"
                    ? "critical"
                    : SeverityCode == "Warning"
                    ? "warning"
                    : ""
                }
              >
                <>{LongMessage}</>
              </Banner>
            );
          } else {
            return (
              <Banner title="Error" status="critical">
                <>{item}</>
              </Banner>
            );
          }
        });
      }
      return (
        <div style={{ display: "flex" }}>
          <Tag color="#aee9d1" style={{ color: "#000", borderRadius: "10px" }}>
            <div
              onClick={() => {
                let errorsList = (
                  <List type="bullet">
                    {" "}
                    {test.errorsList.map((error) => (
                      <List.Item>{error}</List.Item>
                    ))}
                  </List>
                );
                let errorPopupTitle = (
                  <Stack alignment="center" vertical={false}>
                    {test.image}
                    <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
                  </Stack>
                );
                setViewItemURLsPopoverActive(false);
                setErrorPopup({
                  ...errorPopup,
                  active: true,
                  // content: errorsList,
                  content: errorWarningStructure,
                  title: errorPopupTitle,
                });
              }}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              <Stack spacing="extraTight">
                <Icon source={AlertMinor} color={"red"} />
                <>Uploaded</>
              </Stack>
            </div>
          </Tag>
          <Link url={test?.url} external removeUnderline>
            {test?.itemId}
          </Link>
        </div>
      );
    } else if (test?.itemId) {
      return (
        <>
          <Tag color="#aee9d1" style={{ color: "#000", borderRadius: "10px" }}>
            Uploaded
          </Tag>
          <Link url={test?.url} external removeUnderline>
            {test?.itemId}
          </Link>
        </>
      );
    } else if (test?.hasError) {
      let errorWarningStructure = <></>;
      if (
        test.errorsList &&
        Array.isArray(test.errorsList) &&
        test.errorsList.length > 0
      ) {
        errorWarningStructure = test.errorsList.map((item) => {
          if (item && typeof item == "object" && !Array.isArray(item)) {
            const { SeverityCode, LongMessage } = item;
            return (
              <Banner
                title={
                  SeverityCode == "Error"
                    ? "Error"
                    : SeverityCode == "Warning"
                    ? "Warning"
                    : ""
                }
                status={
                  SeverityCode == "Error"
                    ? "critical"
                    : SeverityCode == "Warning"
                    ? "warning"
                    : ""
                }
              >
                <>{LongMessage}</>
              </Banner>
            );
          } else {
            return (
              <Banner title="Error" status="critical">
                <>{item}</>
              </Banner>
            );
          }
        });
      }
      return (
        <Tag color="#fed3d1" style={{ color: "#000", borderRadius: "10px" }}>
          {/* Errors */}
          <div
            onClick={() => {
              let errorsList = (
                <List type="bullet">
                  {" "}
                  {test.errorsList.map((error) => (
                    <List.Item>{error}</List.Item>
                  ))}
                </List>
              );
              let errorPopupTitle = (
                <Stack alignment="center" vertical={false}>
                  {test.image}
                  <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
                </Stack>
              );
              setViewItemURLsPopoverActive(false);
              setErrorPopup({
                ...errorPopup,
                active: true,
                // content: errorsList,
                content: errorWarningStructure,
                title: errorPopupTitle,
              });
            }}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            <>Errors</>
          </div>
        </Tag>
      );
    }
  };

  const getItemURLs = () => {
    let statusStructures = [];
    // console.log(itemUrls);
    itemUrls.forEach((itemUrl) => {
      const structStatus = itemUrl.active
        ? (itemUrl.itemId || itemUrl.hasError || itemUrl.endStatus) && (
            <Stack alignment="center" vertical={false}>
              {/* {console.log('hi1')} */}
              {itemUrl.image}
              <Text style={{ fontSize: "1.5rem" }}>{itemUrl?.username}</Text>
              {getBadge(itemUrl)}
            </Stack>
          )
        : (itemUrl.itemId || itemUrl.hasError || itemUrl.endStatus) && (
            <div
              style={{
                pointerEvents: "none",
                opacity: 0.4,
              }}
            >
              {/* {console.log('hi2')} */}
              <Stack alignment="center" vertical={false}>
                {itemUrl.image}
                <Text style={{ fontSize: "1.5rem" }}>{itemUrl?.username}</Text>
                {getBadge(itemUrl)}
              </Stack>
            </div>
          );
      statusStructures.push(structStatus);
    });
    return statusStructures;
  };
  const getStatusValue = (test) => {
    if (test?.endStatus && test?.hasError) {
      return "Ended";
    } else if (test?.endStatus) {
      return "Ended";
    } else if (test?.itemId && test?.hasError) {
      return "Uploaded with error";
    } else if (test?.itemId) {
      return "Uploaded";
    } else if (test?.hasError) {
      return "Error";
    }
  };
  const menu = (
    <Menu>
      <Menu.Item
        key="upload"
        onClick={() => {
          let postData = {
            product_id: [apiCallMainProduct["source_product_id"]],
            // product_id: [apiCallMainProduct["container_id"]],
            action: "upload_and_revise",
          };
          setModal({
            ...modal,
            active: true,
            content: "Upload and Revise on eBay",
            actionName: postActionOnProductById,
            actionPayload: postData,
            api: uploadProductByIdURL,
          });
        }}
      >
        <UploadOutlined /> Upload and Revise on eBay
      </Menu.Item>
      <Menu.Item
        key="Sync from Shopify"
        onClick={() => {
          let postData = {
            product_id: [apiCallMainProduct["container_id"]],
          };
          setModal({
            ...modal,
            active: true,
            content: "Sync from Shopify",
            actionName: postActionOnProductById,
            actionPayload: postData,
            api: syncProductDetails,
          });
        }}
      >
        <SyncOutlined /> Sync from Shopify
      </Menu.Item>
      {!getItemURLs().every((item) => item == false) ? (
        (itemUrls.length === 1 &&
          ["Uploaded", "Uploaded with error"].includes(statusValues[0])) ||
        (itemUrls.length > 1 &&
          (statusValues.includes("Uploaded") ||
            statusValues.includes("Uploaded with error"))) ? (
          <Menu.Item
            key="end"
            onClick={() => {
              let postData = {
                product_id: [apiCallMainProduct["source_product_id"]],
              };
              setModal({
                ...modal,
                active: true,
                content: "End",
                actionName: postActionOnProductById,
                actionPayload: postData,
                api: endProductByIdURL,
              });
            }}
          >
            <DeleteOutlined /> End
          </Menu.Item>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      {!getItemURLs().every((item) => item == false) ? (
        (itemUrls.length === 1 && statusValues[0] === "Ended") ||
        (itemUrls.length > 1 && statusValues.includes("Ended")) ? (
          <Menu.Item
            key="Relist Item"
            onClick={() => {
              let postData = {
                product_id: [apiCallMainProduct["source_product_id"]],
              };
              setModal({
                ...modal,
                active: true,
                content: "Relist Item",
                actionName: postActionOnProductById,
                actionPayload: postData,
                api: relistItemURL,
              });
            }}
          >
            <RollbackOutlined /> Relist Item
          </Menu.Item>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </Menu>
  );
  return showSkeleton ? (
    <div className="site-page-header-responsive">
      <SkeletonPage primaryAction fullWidth>
        <SkeletonBodyText lines={2} />
        <br />   
        <Layout>
          <Layout.Section secondary>
            <Card>
              <Card.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                </TextContainer>
              </Card.Section>
              <Card.Section>
                <SkeletonBodyText lines={1} />
              </Card.Section>
            </Card>
            <Card subdued>
              <Card.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                </TextContainer>
              </Card.Section>
              <Card.Section>
                <SkeletonBodyText lines={2} />
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    </div>
  ) : (
    <PageHeader
      className="site-page-header-responsive"
      title={
        <Stack alignment="center">
          <Thumbnail
            source={
              mainProduct?.["mainImage"]
                ? mainProduct?.["mainImage"]
                : NoProductImage
            }
            size="large"
            alt="image"
          />
          <Stack vertical spacing="extraTight">
            <>{mainProduct["title"]}</>
            {!getItemURLs().every((item) => item == false) &&
              itemUrls.length && (
                <Popover
                  placement="right"
                  content={getItemURLs()}
                  trigger="click"
                  visible={viewItemURLsPopoverActive}
                  onVisibleChange={(e) => setViewItemURLsPopoverActive(e)}
                >
                  <Button plain>View Status</Button>
                </Popover>
              )}
          </Stack>
        </Stack>
      }
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
      <TabsComponent
        tabContents={{
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
          Variants: (
            <VariantsComponent
              size={"small"}
              variants={variants}
              setVariants={setVariants}
              customDataSource={customvariants}
              variantColumns={variantColumns}
              customVariantColumns={customVariantColumns}
              setVariantColumns={setVariantColumns}
              setCustomVariantColumns={setCustomVariantColumns}
              variantData={variantData}
              setVariantData={setVariantData}
              customVariantData={customVariantData}
              setCustomVariantData={setCustomVariantData}
              editedProductDataFromAPI={editedProductDataFromAPI}
              // setCustomVariants={setCustomVariants}
            />
          ),
          Images: <ImagesComponent mainProduct={mainProduct} />,
          Metafields: <MetafieldsComponent metafields={metafields} />,
          "Additional Details": (
            <AdditionalDetailsComponent
              mainProduct={mainProduct}
              setMainProduct={setMainProduct}
              apiCallMainProduct={apiCallMainProduct}
              editedProductDataFromAPI={editedProductDataFromAPI}
            />
          ),
          "API Response": (
            <ProductDataComponentNew
              data={mainProduct}
              errors={errors}
              errorsData={errorsData}
              connectedAccounts={connectedAccounts}
            />
          ),
        }}
      />
      <Modal
        open={modal.active}
        onClose={() => setModal({ ...modal, active: false })}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>Are you sure you want to initiate {modal.content} ?</p>
            <Stack distribution="center" spacing="tight">
              <Button onClick={() => setModal({ ...modal, active: false })}>
                Cancel
              </Button>
              <Button
                primary
                loading={btnLoader}
                onClick={async () => {
                  setBtnLoader(true);
                  let { success, message, data } = await modal.actionName(
                    modal.api,
                    modal.actionPayload
                  );
                  if (success) {
                    notify.success(message ? message : data);
                    setModal({ ...modal, active: false });
                    getProductData(connectedAccounts);
                  } else {
                    notify.error(message ? message : data);
                    setModal({ ...modal, active: false });
                  }
                  setBtnLoader(false);
                }}
              >
                OK
              </Button>
            </Stack>
          </Stack>
        </Modal.Section>
      </Modal>
      <Modal
        open={errorPopup.active}
        onClose={() => setErrorPopup({ active: false, content: [], title: "" })}
        title={errorPopup.title}
      >
        {/* <Modal.Section>
         <Banner status="critical">{errorPopup.content}</Banner>
       </Modal.Section> */}
        <Modal.Section>{errorPopup.content}</Modal.Section>
      </Modal>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=editing-product-details-in-application"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=editing-product-details-in-application-2"
        >
          Edit Product
        </Link>
      </FooterHelp>
    </PageHeader>
  );
};

export default ProductViewPolarisNew;
