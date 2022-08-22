import {
  PageHeader,
  Typography,
  Menu,
  Popover,
  Tag,
} from "antd";
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
  disableItemURL,
  editProductByIdURL,
  endProductByIdURL,
  getMetafieldsURL,
  relistItemURL,
  uploadProductByIdURL,
  viewProductDataURL,
} from "../../../../../URLs/ProductsURL";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import { notify } from "../../../../../services/notify";
import DetailsComponent from "./Components/DetailsComponent";
import DescriptionComponent from "./DescriptionComponent";
import _ from "lodash";
import VariantsComponent from "./Components/VariantsComponent";
import { globalState } from "../../../../../services/globalstate";
import ReactJson from "react-json-view";
import ImagesComponent from "./Components/ImagesComponent";
import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import DetailsComponentNew from "./Components/DetailsComponentNew";
import ProductDataComponentNew from "./Components/ProductDataComponentNew";
import {
  Badge,
  Link,
  Thumbnail,
  Stack,
  Button,
  Icon,
  // Popover,
  Card,
  Modal,
  SkeletonPage,
  Layout,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
} from "@shopify/polaris";
import { AlertMinor } from "@shopify/polaris-icons";
import PopoverProduct from "./PopoverProduct";
import { getCountyrName } from "../Template/Components/TemplateGridComponent";
import NoProductImage from "../../../../../assets/notfound.png";
import AdditionalDetailsComponent from "./Components/AdditionalDetailsComponent";

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
  "producttype",
  "description",
  "length",
  "width",
  "height",
  "unit",
  "packageType",
  "privateListing",
];
const { Text } = Typography;

const DisabledProductsView = (props) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [mainProduct, setMainProduct] = useState({});
  const [apiCallMainProduct, setApiCallMainProduct] = useState({});
  const [variants, setVariants] = useState([]);
  const [customvariants, setCustomVariants] = useState([]);
  const [productId, setProductId] = useState(null);
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

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

  // check if product gets edited
  const [isProductEdited, setIsProductEdited] = useState(false);

  // showSkeleton
  const [showSkeleton, setShowSkeleton] = useState(true);

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
  const getUploadedItemDetails = (errors, ebay_product_response) => {
    let statusShopIDs = Object.keys(errors).map((shopId) => {
      return {
        shopId: shopId,
        endStatus: errors[shopId]?.["ended"],
        itemId: errors[shopId]?.["ItemId"],
        hasError: errors[shopId]?.["Errors"] ? true : false,
      };
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
    let matchedAccounts = [];
    statusShopIDs.forEach((shopIdData) => {
      connectedAccounts.forEach((connectedAccount) => {
        if (connectedAccount["shopId"] == shopIdData["shopId"]) {
          matchedAccounts.push({ ...shopIdData, ...connectedAccount });
        }
      });
    });
    let tempURLs = [];
    for (let i = 0; i < matchedAccounts.length; i++) {
      let matchedAccount = matchedAccounts[i];
      if (itemUrls.length) {
        for (let j = 0; j < itemUrls.length; j++) {
          let itemUrl = itemUrls[j];
          if (matchedAccount["itemId"] === itemUrl["itemId"]) {
            tempURLs.push({ ...itemUrl, ...matchedAccount });
          } else if (matchedAccount["itemId"] === undefined) {
            tempURLs.push({ ...itemUrl, ...matchedAccount });
            break;
          }
        }
      } else {
        tempURLs.push(matchedAccount);
      }
    }
    // statusShopIDs.forEach((val) => {
    //   if (itemUrls.length) {
    //     itemUrls.forEach((item) => {
    //       if (val.itemId === item.itemId) {
    //         tempURLs.push({ ...val, ...item });
    //       }
    //     });
    //   } else if (itemUrls.length < statusShopIDs.length) {
    //     console.log(val);
    //     tempURLs.push({ ...val });
    //   }
    // });
    // setItemUrls(itemUrls);
    setItemUrls(tempURLs);
  };

  const extractProductUploadErrorData = (errors, ebay_product_response) => {
    // console.log(errors, ebay_product_response);
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
    // if (ebay_product_response) {
    //   Object.keys(errors).map((shopId) => {
    //     ebay_product_response.forEach((data) => {
    //       if (data?.["ItemID"] === errors[shopId]?.["ItemID"]) {
    //         itemIdObj[shopId] = {
    //           itemId: errors[shopId]?.itemId,
    //           jsonResponse: ebay_product_response,
    //         };
    //       }
    //     });
    //   });
    // }
    // console.log(itemIdObj);
    // ebay_product_response &&
    getUploadedItemDetails(errors, ebay_product_response);
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
      // console.log("dataForErrors", dataForErrors);
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
        unit,
        packageType,
        privateListing,
      } = mainProductData;
      variant_attributes = Object.values(variant_attributes);
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
      tempObj["privateListing"] = privateListing ? privateListing : "no";
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
      setVariants(variantProductsData);
      setCustomVariants(tempVariantProductsData);
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
      if (temp.length == 7) {
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
          abbreviation: getCountryAbbreviation(
            account["warehouses"][0]["site_id"]
          ),
          username: account["warehouses"][0]["user_id"],
          image: getCountyrName(account["warehouses"][0]["site_id"]),
        };
        return accountName;
      });
      setconnectedAccounts(tempArr);
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
    // getProductData();
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
      {/* <Menu.Item key="SyncWithShopify">
          <SyncOutlined /> Sync
        </Menu.Item> */}
      <Menu.Item
        key="upload"
        onClick={() => {
          let postData = {
            product_id: [apiCallMainProduct["source_product_id"]],
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
        <UploadOutlined /> End
      </Menu.Item>
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
        <SyncOutlined /> Relist Item
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
            "weight_unit",
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

  const differenceArrayDeepNew = (data) => {
    console.log(data);
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
    // if (variantData.length) {
    //   variantCommonFieldsChanges = differenceArrayDeep(variants, variantData);
    // }
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
    if (test?.endStatus) {
      return (
        <Tag color="#ffd79d" style={{ color: "#000", borderRadius: "10px" }}>
          Ended
        </Tag>
      );
    } else if (test?.itemId && test?.hasError) {
      return (
        <div style={{ display: "flex" }}>
          {/* <Badge status="success" progress="complete">
              <Icon source={AlertMinor} color={"red"} />
              Uploaded
            </Badge> */}
          <Tag color="#aee9d1" style={{ color: "#000", borderRadius: "10px" }}>
            <Stack spacing="extraTight">
              <Icon source={AlertMinor} color={"red"} />
              <>Uploaded</>
            </Stack>
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
          {/* <Badge status="success" progress="complete">
              Uploaded
            </Badge> */}
          <Link url={test?.url} external removeUnderline>
            {test?.itemId}
          </Link>
        </>
      );
    } else if (test?.hasError) {
      return (
        <Tag color="#fed3d1" style={{ color: "#000", borderRadius: "10px" }}>
          Errors
        </Tag>
      );
    }
    //  else {
    //   // return <Badge status="attention">Not Uploaded</Badge>;
    //   return (
    //     <Tag color="#ffea8a" style={{ color: "#000", borderRadius: "10px" }}>
    //       Not Uploaded
    //     </Tag>
    //   );
    // }
  };

  const getItemURLs = () => {
    let statusStructures = [];
    itemUrls.forEach((itemUrl) => {
      const structStatus = (itemUrl.itemId || itemUrl.hasError) && (
        <Stack alignment="center" vertical={false}>
          {itemUrl.image}
          <Text style={{ fontSize: "1.5rem" }}>{itemUrl?.username}</Text>
          {getBadge(itemUrl)}
        </Stack>
      );
      statusStructures.push(structStatus);
    });
    return statusStructures;
    return (
      <Stack vertical>
        {itemUrls.map((itemUrl, index) => {
          return itemUrl["endStatus"] ? (
            <Stack spacing="extraTight">
              <Badge getBadgestatus="info">{itemUrl?.abbreviation} </Badge>
              <Text style={{ fontSize: "1.5rem" }}>Ended</Text>
            </Stack>
          ) : itemUrl["itemId"] ? (
            <React.Fragment key={index}>
              <Badge status="success">
                {itemUrl?.abbreviation}
                {itemUrl["hasError"] && (
                  <Icon source={AlertMinor} color={"red"} />
                )}
              </Badge>
              <Text style={{ fontSize: "1.5rem" }}>
                <Link
                  url={itemUrl?.url}
                  removeUnderline
                  external
                  onClick={() => setViewItemURLsPopoverActive(false)}
                >
                  {/* {itemUrl?.url.split("/").reverse()[0]} */}
                  {itemUrl?.itemId}
                </Link>
              </Text>
            </React.Fragment>
          ) : (
            !itemUrl?.["itemId"] &&
            itemUrl?.["hasError"] && (
              <Stack spacing="extraTight">
                <Badge status="info">{itemUrl?.abbreviation} </Badge>
                <Text style={{ fontSize: "1.5rem" }}>Error</Text>
              </Stack>
            )
          );
          // return itemUrl.status ? (
          //   <Stack spacing="extraTight">
          //     <Badge status="info">{itemUrl?.site} </Badge>
          //     <Text style={{ fontSize: "1.5rem" }}>Ended</Text>
          //   </Stack>
          // ) : (
          //   <React.Fragment key={index}>
          //     <Badge status="success">{itemUrl?.site}</Badge>
          //     <Text style={{ fontSize: "1.5rem" }}>
          //       <Link
          //         url={itemUrl?.url}
          //         removeUnderline
          //         external
          //         onClick={() => setViewItemURLsPopoverActive(false)}
          //       >
          //         {itemUrl?.url.split("/").reverse()[0]}
          //       </Link>
          //     </Text>
          //   </React.Fragment>
          // );
        })}
      </Stack>
    );
  };
  const activator = (
    <Button
      plain
      disclosure="down"
      onClick={() => {
        setViewItemURLsPopoverActive(!viewItemURLsPopoverActive);
      }}
    >
      View Status
    </Button>
  );

  const checkFieldsEditedOrNot = (data) => {
    const { edited_fields } = data;
    console.log(edited_fields);
    let flag = false;
    // if (editedProductDataFromAPI.length) {
    for (const key in edited_fields) {
      if (key === "privateListing" && edited_fields[key] === "no") {
        // flag = true;
      } else if (key === "unit" && edited_fields[key] === "in") {
        // flag = true;
      } else if (edited_fields[key] === "") {
        // flag = true;
      } else {
        flag = true;
      }
    }
    // }
    console.log(flag);
    return flag;
  };
  return showSkeleton ? (
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
  ) : (
    <PageHeader
      // className="site-page-header-responsive"
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
            {itemUrls.length && (
              <Popover
                // preferredAlignment="right"
                // hideOnPrint={true}
                // active={viewItemURLsPopoverActive}
                // fluidContent={true}
                // activator={activator}
                // autofocusTarget="first-node"
                // onClose={() => setViewItemURLsPopoverActive(false)}
                placement="right"
                content={getItemURLs()}
                trigger="click"
                visible={viewItemURLsPopoverActive}
                onVisibleChange={(e) => setViewItemURLsPopoverActive(e)}
              >
                <Button plain>View Status</Button>
                {/* <Popover.Pane>
                    <Card sectioned>{getItemURLs()}</Card>
                  </Popover.Pane> */}
              </Popover>
            )}
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
      onBack={() => props.history.push("/panel/ebay/disabledproducts")}
      extra={[
        <Button
          key="2"
          primary
          onClick={async () => {
            let { success, message, data } = await postActionOnProductById(
              disableItemURL,
              {
                product_id: productId,
                status: "Enable",
              }
            );
            if (success) {
              notify.success(message ? message : data);
              props.history.push("/panel/ebay/products/grid");
            } else {
              notify.error(message ? message : data);
            }
            // let filteredData = prepareDataForSave();
            // let moreFilteredData = moreFilteration(filteredData);
            // callSaveAPI(moreFilteredData);
          }}
          // loading={saveBtnLoader}
        >
          Enable
        </Button>,
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
              dataSource={variants}
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
            />
          ),
          Images: <ImagesComponent mainProduct={mainProduct} />,
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
                    // props.history.push("activity");
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
    </PageHeader>
  );
};

export default DisabledProductsView;

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
