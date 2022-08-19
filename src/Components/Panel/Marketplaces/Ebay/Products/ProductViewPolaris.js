import {
  Button,
  Col,
  PageHeader,
  Row,
  Typography,
  Alert,
  Spin,
  Collapse,
  Dropdown,
  Menu,
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
  editProductByIdURL,
  endProductByIdURL,
  getProductDataURL,
  uploadProductByIdURL,
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

// const commonFields = ['title', 'vendor', 'productType', 'tags']
// let editedDataReceivedFromAPI = {}

const ProductViewPolaris = (props) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [mainProduct, setMainProduct] = useState({});
  const [apiCallMainProduct, setApiCallMainProduct] = useState({});
  const [variants, setVariants] = useState([]);
  const [productId, setProductId] = useState(null);

  const [connectedAccounts, setconnectedAccounts] = useState({});
  const [errors, setErrors] = useState({});

  // variant table
  const [variantColumns, setVariantColumns] = useState(columns);
  const [variantData, setVariantData] = useState([]);

  // producrt type: simple/variation
  const [productType, setProductType] = useState("");

  useEffect(() => {
    // console.log(variants);
  }, [variants]);
  // function findCommonElem(arr1, arr2) {
  //   const map = new Map();
  
  //   arr1.forEach(item => map.set(item, true));
  
  //   return arr2.filter(item => map.has(item));
  // }
  // function findUnCommonElem(arr1, arr2) {
  //   let difference = arr1.filter(x => !arr2.includes(x));
  //   return difference
  // }

  // const extractEditedDataForCommonFields = (forCommon) => {
  //   let arr1 = Object.keys(forCommon.shops[Object.keys(forCommon.shops)[0]]['edited_data'])
  //   let commonFieldsFromEditedData = findCommonElem(arr1, commonFields)
  //   let tempObj = {}
  //   commonFieldsFromEditedData.forEach(field => {
  //     tempObj[field] = forCommon.shops[Object.keys(forCommon.shops)[0]]['edited_data'][field]
  //   })
  //   return tempObj
  // }

  // const extractEditedDataForVariantFields = (forVariantFields) => {
  //   let tempArr = {};
  //   forVariantFields.forEach(variant => {
  //     let arr1 = Object.keys(variant.shops[Object.keys(variant.shops)[0]]['edited_data'])
  //     let unCommonFieldsFromEditedData = findUnCommonElem(arr1, commonFields)
  //     let tempObj = {}
  //     unCommonFieldsFromEditedData.forEach(field => {
  //       tempObj[field] = variant.shops[Object.keys(variant.shops)[0]]['edited_data'][field]
  //     })
  //     tempArr[variant.source_product_id] = tempObj
  //   })
  //   return tempArr
  // }

  // const extractEditedData = (editedProductData, typeOfProduct) => {
  //   let temp = {
  //     mainProductEditedData: {}, 
  //     variantProductEditedData: {}
  //   }
  //   if(typeOfProduct === 'variantType') {
  //     // console.log(editedProductData.variation, typeOfProduct);
  //     let forCommon = editedProductData.variation[0]
  //     temp['mainProductEditedData']= extractEditedDataForCommonFields(forCommon)
  //     temp['variantProductEditedData'] = extractEditedDataForVariantFields(editedProductData.variation)
  //   }
  //   return temp
  // }

  const extractDataFromAPI = (productData, rows) => {
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

      let productDataClone = { ...productData };
      let mainProductData = {};
      let variantProductsData = [];
      sortedProductData = productDataClone["rows"].reduce((acc, element) => {
        if (!element.hasOwnProperty("sku")) {
          return [element, ...acc];
        }
        return [...acc, element];
      }, []);
      // let editedProductData = sortedProductData.filter(element => element.hasOwnProperty('edited'))
      // sortedProductData = sortedProductData.filter(element => !element.hasOwnProperty('edited'))
      // if(editedProductData.length) {
      //   let typeOfProduct = sortedProductData.length > 1 ? 'variantType': 'simpleType'
      //   editedDataReceivedFromAPI = extractEditedData(editedProductData[0], typeOfProduct)
      // }
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
      additional_images_arr = additional_images ? [...additional_images] : [];

      variantProductsData.forEach((variant) => {
        if (!tags) {
          if (variant.hasOwnProperty("tags")) {
            tags = variant["tags"];
          }
        }
        additional_images_arr = [
          ...additional_images_arr,
          ...variant["additional_images"],
        ];
      });

      let tempObj = {};
      tempObj["source_product_id"] = source_product_id ? source_product_id : "";
      tempObj["container_id"] = container_id ? container_id : "";
      tempObj["title"] = title ? title : "";
      tempObj["checkTitle"] = false;
      tempObj["description"] = description ? description : "";
      tempObj["checkDescription"] = false;
      tempObj["vendor"] = brand ? brand : "";
      tempObj["checkVendor"] = false;
      tempObj["productType"] = product_type ? product_type : "";
      tempObj["checkProductType"] = false;
      tempObj["tags"] = tags ? tags : "";
      tempObj["checkTags"] = false;
      tempObj["mainImage"] = main_image ? main_image : "";
      // tempObj["image_array"] = additional_images_arr
      //   ? additional_images_arr
      //   : [];
      tempObj["length"] = length ? length : "";
      tempObj["width"] = width ? width : "";
      tempObj["height"] = height ? height : "";
      // tempObj["variant_attributes"] =
      //   variant_attributes.length > 0 ? variant_attributes : [];
      // console.log(tempObj);
      setMainProduct(tempObj);
      setApiCallMainProduct(tempObj);
      setVariants(variantProductsData);
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
    let { id } = parseQueryString(props.location.search);
    setProductId(id);
    let postData = {
      "filter[container_id][1]": id,
      source_marketplace: "ebay",
    };
    let { success, data, message } = await fetchProductById(
      getProductDataURL,
      postData
    );
    if (success) {
      extractDataFromAPI(data, data.rows);
    } else {
      notify.error(message);
    }
    setPageLoader(false);
  };

  const getCountryName = (site_id) => {
    let countryName = json.flag_country.filter(
      (country) => country["value"] === site_id
    );
    return countryName.length && countryName[0]["label"];
  };

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();

    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );

      let tempObj = {};
      ebayAccounts.forEach((account, key) => {
        tempObj[account["id"]] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}`;
      });
      setconnectedAccounts(tempObj);
    }
  };

  useEffect(() => {
    getProductData();
    getAllConnectedAccounts();
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
    let commonFieldsChanges = differenceObjectDeep(
      apiCallMainProduct,
      mainProduct
    );
    let postData = {
      variantionData: [],
      containerData: [],
    };
    if (Object.keys(variantCommonFieldsChanges).length > 0) {
      let tempForVariation = [];
      variantCommonFieldsChanges.forEach((variant) => {
        let tempObj = {};
        for (const key in variant) {
          if (Object.keys(variant).length > 1 && variant["source_product_id"]) {
            tempObj[key] = variant[key];
          }
        }
        tempForVariation.push(tempObj);
      });
      tempForVariation = tempForVariation.filter(
        (e) => Object.keys(e).length > 0
      );
      postData["variantionData"] = [
        ...postData["variantionData"],
        ...tempForVariation,
      ];
    }
    if (Object.keys(commonFieldsChanges).length > 0) {
      let tempForVariation = [];
      let temp = commonFieldsChanges;
      variants.forEach((variant) => {
        let tempObj = {};
        tempObj["source_product_id"] = variant["source_product_id"];
        for (const key in temp) {
          if (!key.includes("check")) {
            tempObj[key] = temp[key];
          }
        }
        tempForVariation.push(tempObj);
      });
      postData["containerData"] = [
        ...postData["containerData"],
        ...tempForVariation,
      ];
    }
    return postData;
  };

  const mergeContainerAndVariation = (containerData, variantionData) => {
    let postData = [];
    containerData.forEach((container) => {
      let mergedObj = {};
      variantionData.forEach((variantion) => {
        if (
          variantion["source_product_id"] === container["source_product_id"]
        ) {
          mergedObj = { ...mergedObj, ...variantion, ...container };
        } else {
          mergedObj = { ...mergedObj, ...container };
        }
      });
      postData.push(mergedObj);
    });
    return postData;
  };

  const moreFilteration = (data) => {
    let postData = {
      edited_fields: {
        // variation: []
      },
      source_product_id:
        // productType === "variation"
          // ? 
          apiCallMainProduct["source_product_id"]
          // : apiCallMainProduct["container_id"],
    };
    if (productType === "variation") {
      postData["edited_fields"] = {
        variation: [],
      };
    }
    if (data.containerData.length > 0 && data.variantionData.length === 0) {
      if (productType === "variation") {
        postData.edited_fields.variation = [...data.containerData];
      } else if (productType === "simple") {
        postData.edited_fields = { ...data.containerData[0] };
      }
    } else if (
      data.containerData.length === 0 &&
      data.variantionData.length > 0
    ) {
      if (productType === "variation") {
        postData.edited_fields.variation = [...data.variantionData];
      } else if (productType === "simple") {
        postData.edited_fields = { ...data.variantionData[0] };
      }
    } else if (
      data.containerData.length > 0 &&
      data.variantionData.length > 0
    ) {
      let mergedData = mergeContainerAndVariation(
        data.containerData,
        data.variantionData
      );
      if (productType === "variation") {
        postData.edited_fields.variation = [...mergedData];
      } else if (productType === "simple") {
        postData.edited_fields = { ...mergedData[0] };
      }
    }
    if (productType === "simple") {
      delete postData.edited_fields["source_product_id"];
    }
    return postData;
  };

  const menu = (
    <Menu>
      <Menu.Item key="SyncWithShopify">
        <SyncOutlined /> Sync with shopify
      </Menu.Item>
      <Menu.Item
        key="upload"
        onClick={async () => {
          let postData = {
            product_id: [apiCallMainProduct['source_product_id']]
          };
          let data = await postActionOnProductById(uploadProductByIdURL, postData);
          if (data[0]) {
            let tempObj = {};
            for (const [shopId, countrySelected] of Object.entries(
              connectedAccounts
            )) {
              if (shopId in data[0]) {
                tempObj[countrySelected] = data[0][shopId];
              }
            }
            setErrors(tempObj);
          }
        }}
      >
        <UploadOutlined /> Upload
      </Menu.Item>
      <Menu.Item
        key="upload"
        onClick={async () => {
          let postData = {
            product_id: [apiCallMainProduct['source_product_id']]
          };
          let {data, success} = await postActionOnProductById(endProductByIdURL, postData);
          if (success) {
            notify.success(data)
          }
        }}
      >
        <UploadOutlined /> End
      </Menu.Item>
    </Menu>
  );
  return (
    <PageHeader
      // className="site-page-header-responsive"
      title={mainProduct["title"]}
      subTitle={
        <Row gutter={[{ xs: 8, sm: 16, md: 24 }, 12]}>
          {Object.keys(errors).map((e) => {
            if (errors[e].hasOwnProperty("ItemId")) {
              return <Col>{errors[e]["ItemId"]}</Col>;
            }
            return <Col>{errors[e]["Errors"]}</Col>;
          })}
        </Row>
      }
      ghost={true}
      onBack={() => props.history.push("/panel/ebay/products")}
      extra={[
        <Button
          key="2"
          type="primary"
          onClick={async () => {
            let filteredData = prepareDataForSave();
            let moreFilteredData = moreFilteration(filteredData);
            let { success, message } = await editProductById(
              editProductByIdURL,
              moreFilteredData
            );
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          Save
        </Button>,
        <Button key="1" type="primary" danger>
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
            Details: (
              <DetailsComponent
                mainProduct={mainProduct}
                setMainProduct={setMainProduct}
                apiCallMainProduct={apiCallMainProduct}
                // editedDataReceivedFromAPI={editedDataReceivedFromAPI}
              />
            ),
            Description: (
              <DescriptionComponent
                mainProduct={mainProduct}
                setMainProduct={setMainProduct}
                apiCallMainProduct={apiCallMainProduct}
              />
            ),
            Variants: (
              // <VariantComponentDataBackup size={"small"} dataSource={variants} variantColumns={variantColumns} />
              <VariantsComponent
                size={"small"}
                dataSource={variants}
                variantColumns={variantColumns}
                setVariantColumns={setVariantColumns}
                variantData={variantData}
                setVariantData={setVariantData}
              />
            ),
            Images: <ImagesComponent mainProduct={mainProduct} />,
            "Product Data": (
              <ProductDataComponent data={mainProduct} errors={errors} />
            ),
          }}
        />
      )}
    </PageHeader>
  );
};

export default ProductViewPolaris;

export const ProductDataComponent = ({ data, errors }) => {
  return (
    <Collapse onChange={() => {}}>
      {!isUndefined(data.ebay_product_data) && (
        <Collapse.Panel header="eBay Product Data" key="1">
          <ReactJson
            style={{ maxHeight: 200, overflowY: "scroll" }}
            src={!isUndefined(data.ebay_product_data) && data.ebay_product_data}
          />
        </Collapse.Panel>
      )}
      {/* {!isUndefined(data.report) && (
        <Collapse.Panel header="eBay Error(s) & Warnings" key="2">
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}>
            {data.report.map((error) => {
              return (
                <Col span={24}>
                  <Alert
                    message={error["SeverityCode"]}
                    description={error["ShortMessage"]}
                    type={error["SeverityCode"].toLowerCase()}
                    showIcon
                  />
                </Col>
              );
            })}
          </Row>
        </Collapse.Panel>
      )} */}
      {!isUndefined(errors) && (
        <Collapse.Panel header="eBay Error(s) & Warnings" key="2">
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}>
            {Object.keys(errors).map((error) => {
              return (
                <Col span={24}>
                  <Alert
                    message={error}
                    description={errors[error]["Errors"].map((e) => (
                      <p>{e}</p>
                    ))}
                    showIcon
                  />
                </Col>
              );
            })}
            {/* {data.report.map((error) => {
              return (
                <Col span={24}>
                  <Alert
                    message={error["SeverityCode"]}
                    description={error["ShortMessage"]}
                    type={error["SeverityCode"].toLowerCase()}
                    showIcon
                  />
                </Col>
              );
            })} */}
          </Row>
        </Collapse.Panel>
      )}
      {!isUndefined(data.details) && (
        <Collapse.Panel header="Shopify Product Data" key="3">
          <ReactJson
            style={{ maxHeight: 200, overflowY: "scroll" }}
            src={!isUndefined(data.details) && data.details}
          />
        </Collapse.Panel>
      )}
    </Collapse>
  );
};
