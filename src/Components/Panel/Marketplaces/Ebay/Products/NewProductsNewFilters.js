import { Image, PageHeader, Alert, Row, Col, Typography } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import NoProductImage from "../../../../../assets/notfound.png";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import VariantComponentData from "./VariantComponentData";
import {
  getProductsURL,
  getProductsCountURL,
  getVariantsURL,
} from "../../../../../URLs/ProductsURL";
import { dashboardAnalyticsURL } from "../../../../../URLs/DashboardURL";
import {
  getProducts,
  getProductsCount,
} from "../../../../../APIrequests/ProductsAPI";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import PaginationComponent from "../../../../AntDesignComponents/PaginationComponent";
import {
  ButtonGroup,
  Card,
  Icon,
  Stack,
  TextField,
  Button,
  Popover,
  ChoiceList,
  Tag,
  Badge,
  Tooltip,
  TextStyle,
  Modal,
  TextContainer,
  Banner,
  List,
} from "@shopify/polaris";
import { notify } from "../../../../../services/notify";
import ActionPopover from "./ActionPopover";
import {
  getVariantsCountDetails,
  trimTitle,
} from "./helperFunctions/commonHelper";
import {
  AlertMinor,
  FilterMajorMonotone,
  QuestionMarkMinor,
} from "@shopify/polaris-icons";
import { getProfilesURL } from "../../../../../URLs/ProfilesURL";
import { getProfiles } from "../../../../../APIrequests/ProfilesAPI";
import { getImportAttribute } from "../../../../../Apirequest/registrationApi";
import NewFilterComponentSimilarPolaris from "./NewFilterComponentSimilarPolaris";
import { debounce } from "../Template/TemplateBody/CategoryTemplatePolarisNew";
import {
  getCountryAbbreviation,
  getCountryName,
} from "../Template/Components/TemplatesType/CategoryTemplateComponent";
import { getCountyrName } from "../Template/Components/TemplateGridComponent";
import PopoverProduct from "./PopoverProduct";
import ProductBulkMenu from "./ProductBulkMenu";
import ProductMassMenu from "./ProductMassMenu";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../../../../APIrequests/DashboardAPI";
import CsvBulkMenu from "./CsvBulkMenu";
import OutsideAlerter from "./OutsideAlerter";
import OutsideAlerterMassMenu from "./OutsideAlerterMassMenu";
import EbayActionsBulkMenu from "./EbayActionsBulkMenu";

const { Text } = Typography;

export const stringOperatorOptions = [
  { label: "equals", value: "1" },
  { label: "not equals", value: "2" },
  { label: "contains", value: "3" },
  { label: "does not contains", value: "4" },
  { label: "starts with", value: "5" },
  { label: "ends with", value: "6" },
];

export const numberOperatorOptions = [
  { label: "equals", value: "1" },
  { label: "not equals", value: "2" },
  { label: "greater than or equal to", value: "8" },
  { label: "less than or equal to", value: "9" },
];

export const filtersFields = [
  {
    label: "eBay Item ID",
    value: "listing_id",
    searchType: "textField",
    inputValue: "",
    operator: "1",
    dataType: "number",
    placeholder: "Enter eBay Item Id",
  },
  {
    label: "Product Type",
    value: "product_type",
    searchType: "dropdown",
    inputValue: "",
    operator: "1",
    dataType: "string",
    placeholder: "Select Product Type",
  },
  {
    label: "Vendor",
    value: "brand",
    searchType: "dropdown",
    inputValue: "",
    operator: "1",
    dataType: "string",
    placeholder: "Select Vendor",
  },
  {
    label: "Tags",
    value: "tags",
    searchType: "textField",
    inputValue: "",
    operator: "3",
    dataType: "string",
    placeholder: "Enter Tags",
  },
  {
    label: "Price",
    value: "price",
    searchType: "textField",
    inputValue: "",
    operator: "1",
    dataType: "number",
    placeholder: "Enter Price",
  },
  {
    label: "Inventory",
    value: "quantity",
    searchType: "textField",
    inputValue: "",
    operator: "1",
    dataType: "number",
    placeholder: "Enter Inventory",
  },
];

export const getFitersInitially = () => {
  let tempObj = {};
  filtersFields.forEach((field) => {
    tempObj[field["value"]] = {
      operator: field["operator"],
      value: field["inputValue"],
      label: field["label"],
      dataType: field["dataType"],
      placeholder: field["placeholder"],
      disabled: false,
    };
    if (field?.["searchType"] === "dropdown") {
      tempObj[field["value"]]["options"] = [];
    }
  });
  return tempObj;
};

function NewProductsNewFilters(props) {
  const reduxState = useSelector(
    (state) => state.productFilterReducer.reduxFilters
  );
  const checkValueHandler = (arr, filterName) => {
    let countryValue = "";
    Object.keys(arr).filter((item, index) => {
      let indexOfFirstOpeningBracket = item.indexOf("[");
      let indexOfFirstClosingBracket = item.indexOf("]");
      const mainItem = item.substring(
        indexOfFirstOpeningBracket + 1,
        indexOfFirstClosingBracket
      );
      if (mainItem === filterName) {
        countryValue = item;
        return;
      }
    });
    return countryValue;
  };
  const initialCountryValue =
    reduxState[checkValueHandler(reduxState, "country")];
  const initialStatusValue =
    reduxState[checkValueHandler(reduxState, "status")];
  const initialProfileValue =
    reduxState[checkValueHandler(reduxState, "profile_name")];
  const moreFilters = [
    "listing_id",
    "product_type",
    "brand",
    "tags",
    "price",
    "quantity",
  ];
  let initialMoreFiltersObj = {};
  moreFilters.map((moreFilter, index) => {
    let filterItem = checkValueHandler(reduxState, moreFilter);
    if (filterItem) initialMoreFiltersObj[filterItem] = reduxState[filterItem];
  });
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isProductBulkMenuOpen, setIsProductBulkMenuOpen] = useState(false);
  const [isCsvBulkMenuOpen, setIsCsvBulkMenuOpen] = useState(false);
  const [isEbayActionBulkMenuOpen, setIsEbayActionBulkMenuOpen] =
    useState(false);
  const [productData, setProductData] = useState([]);
  const setCallbackCsvFunction = (openState) => {
    setIsCsvBulkMenuOpen(openState);
    setIsProductBulkMenuOpen(false);
    setIsEbayActionBulkMenuOpen(false);
  };
  const setCallbackEbayActionFunction = (openState) => {
    setIsEbayActionBulkMenuOpen(openState);
    setIsProductBulkMenuOpen(false);
    setIsCsvBulkMenuOpen(false);
  };
  const setCallbackProductBulkFunction = (openState) => {
    setIsProductBulkMenuOpen(openState);
    setIsCsvBulkMenuOpen(false);
    setIsEbayActionBulkMenuOpen(false);
  };
  const [productColumns, setProductColumns] = useState([
    {
      title: <center>Image</center>,
      dataIndex: "image",
      key: "image",
      width: 80,
      className: "show",
      label: "Image",
      value: "Image",
      checked: true,
      editable: true,
      fixed: window.innerWidth <= 768 ? false : "left",
    },
    {
      title: <center>Title</center>,
      dataIndex: "title",
      key: "title",
      className: "show",
      label: "Title",
      value: "Title",
      checked: true,
      editable: true,
      onCell: () => {},
      width: 250,
      fixed: window.innerWidth <= 768 ? false : "left",
    },
    {
      title: <center>Status</center>,
      dataIndex: "productStatus",
      key: "productStatus",
      className: "show",
      label: "Status",
      value: "status",
      checked: true,
      editable: true,
      onCell: () => {},
      width: 250,
    },
    {
      title: <center>Inventory</center>,
      dataIndex: "variantsCount",
      key: "variantsCount",
      className: "show",
      label: "Variant Count",
      value: "Variant Count",
      checked: true,
      editable: true,
    },
    // {
    //   title: <center>Type</center>,
    //   dataIndex: "simpleVariant",
    //   key: "simpleVariant",
    //   className: "show",
    //   label: "Variant Count",
    //   value: "Variant Count",
    //   checked: true,
    //   editable: true,
    // },
    {
      title: <center>Profile</center>,
      dataIndex: "profile",
      key: "profile",
      className: "show",
      label: "Profile",
      value: "Profile",
      checked: true,
      editable: true,
    },
    {
      title: <center>Product Type</center>,
      dataIndex: "productType",
      key: "productType",
      className: "show",
      label: "Product Type",
      value: "Product Type",
      checked: true,
      editable: true,
    },
    {
      title: <center>Variant Attributes</center>,
      dataIndex: "variantAttributes",
      key: "variantAttributes",
      className: "show",
      label: "Variant Attributes",
      value: "Variant Attributes",
      checked: true,
      editable: true,
    },
    {
      title: <center>Vendor</center>,
      dataIndex: "vendor",
      key: "vendor",
      className: "show",
      label: "Vendor",
      value: "Vendor",
      checked: true,
      editable: true,
    },
    {
      title: <center>Actions</center>,
      dataIndex: "actions",
      key: "actions",
      className: "show",
      label: "Actions",
      value: "Actions",
      checked: true,
      editable: false,
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return (
          <Stack distribution="center" alignment="leading">
            <ActionPopover record={record} />
          </Stack>
        );
      },
    },
  ]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // pagination
  const [activePage, setActivePage] = useState(1);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  const [pageSize, setPageSize] = useState(25);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  // && filters
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
  const [filters, setFilters] = useState(getFitersInitially());
  const [filtersToPass, setFiltersToPass] = useState("");
  const [innerFilterCount, setInnerFilterCount] = useState(0);
  const [searchWithTitle, setSearchWithTitle] = useState(true);
  const [filterTitleORsku, setFilterTitleORsku] = useState("");
  const [popOverStatus, setPopOverStatus] = useState({
    country: false,
    status: false,
    profile: false,
    productType: false,
    brand: false,
  });
  const [status, setStatus] = useState([
    { label: "Uploaded", value: "uploaded" },
    { label: "Not Uploaded", value: "notUploaded" },
    { label: "Ended", value: "ended" },
    { label: "Error", value: "error" },
  ]);
  const [profileList, setProfileList] = useState([]);
  const [profileListForFilters, setProfileListForFilters] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [selected, setSelected] = useState({
    country: [""],
    status: [],
    profile_name: [],
    product_type: [],
    brand: [],
  });

  // countries
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);

  const [gridLoader, setGridLoader] = useState(false);

  // status popup
  const [errorPopup, setErrorPopup] = useState({
    active: false,
    content: [],
  });

  // variant state
  const [doVariantDataExists, setDoVariantDataExists] = useState({});
  // product credits
  const [productCredits, setProductCredits] = useState({
    available: "",
    total: "",
  });
  const [prevPage, setPrevPage] = useState(1);

  useEffect(() => {
    if (filtersToPass && activePage > 1 && activePage !== prevPage) {
      hitGetProductsAPI(1, pageSize);
      setActivePage(1);
    } else if (filtersToPass) {
      hitGetProductsAPI(activePage, pageSize);
    }
  }, [filtersToPass]);

  const getBadge = (test) => {
    if (test?.ended && test?.Errors) {
      return (
        <Badge status="warning">
          <div
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={(e) => {
              setErrorPopup({
                active: true,
                content: [...test.Errors],
              });
            }}
          >
            <Stack spacing="extraTight" alignment="center">
              <Icon source={AlertMinor} color={"red"} />
              <>Ended</>
            </Stack>
          </div>
        </Badge>
      );
    } else if (test?.ended) {
      return <Badge status="warning">Ended</Badge>;
    } else if (test?.ItemId && test?.Errors) {
      return (
        <Badge status="success" progress="complete">
          <div
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={(e) => {
              setErrorPopup({
                active: true,
                content: [...test.Errors],
              });
            }}
          >
            <Stack spacing="extraTight" alignment="center">
              <Icon source={AlertMinor} color={"red"} />
              <>Uploaded</>
            </Stack>
          </div>
        </Badge>
      );
    } else if (test?.ItemId) {
      return (
        <Badge status="success" progress="complete">
          Uploaded
        </Badge>
      );
    } else if (test?.Errors) {
      return (
        <Badge status="critical">
          <div
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={(e) => {
              setErrorPopup({
                ...errorPopup,
                active: true,
                content: [...test.Errors],
              });
            }}
          >
            Errors
          </div>
        </Badge>
      );
    }
    // else {
    //   return <Badge status="attention">Not Uploaded</Badge>;
    // }
  };
  const getProductStatus = (edited) => {
    let statusStructures = [];
    if (edited) {
      let { variation, shops } = edited;
      if (Array.isArray(variation) && variation.length) {
        for (const shopId in variation[0]?.["shops"]) {
          let matchedAccount = connectedAccountsArray.find(
            (connectedAccount) => connectedAccount["shopId"] == shopId
          );
          let test = {
            ...matchedAccount,
            ...variation[0]?.["shops"][shopId],
          };
          const structStatus = (test.ItemId || test.Errors) && (
            <Stack>
              {/* <Badge status="success" progress="complete">Uploaded</Badge> */}
              {test?.image}
              {/* {test?.ItemId && test["Errors"] && (
                <Icon source={AlertMinor} color={"red"} />
              )} */}
              <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
              {getBadge(test)}
              {/* <Badge status={getStatusColor(test)}>
                <Text style={{ fontSize: "1.5rem" }}>
                  {test?.ItemId
                    ? "Uploaded"
                    : test?.Errors
                    ? "Error"
                    : "Not Uploaded"}
                </Text>
              </Badge> */}
            </Stack>
          );
          statusStructures.push(structStatus);
        }
        return statusStructures;
      } else if (shops) {
        console.log(shops);
        for (const shopId in shops) {
          let matchedAccount = connectedAccountsArray.find(
            (connectedAccount) => connectedAccount["shopId"] == shopId
          );
          let test = {
            ...matchedAccount,
            ...shops[shopId],
          };
          const structStatus = (test.ItemId || test.Errors) && (
            <Stack distribution="center" spacing="tight">
              {test?.image}
              <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
              {getBadge(test)}
            </Stack>
          );
          statusStructures.push(structStatus);
        }
        return statusStructures;
      }
    }
    return (
      <center>
        <Text>N/A</Text>
      </center>
    );
  };
  const getProductStatusEbayResponse = (response) => {
    let statusStructures = [];
    if (response && Object.keys(response).length) {
      for (const shopId in response) {
        let matchedAccount = connectedAccountsArray.find(
          (connectedAccount) => connectedAccount["shopId"] == shopId
        );
        let test = {
          ...matchedAccount,
          ...response[shopId],
        };
        // console.log(test);
        const structStatus = test.active
          ? (test.ItemId || test.Errors) && (
              <Stack>
                {test?.image}
                <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
                {test?.image && getBadge(test)}
              </Stack>
            )
          : (test.ItemId || test.Errors) && (
              <div
                style={{
                  pointerEvents: "none",
                  opacity: 0.4,
                }}
              >
                <Stack>
                  {test?.image}
                  <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
                  {test?.image && getBadge(test)}
                </Stack>
              </div>
            );
        statusStructures.push(structStatus);
      }
      return <PopoverProduct>{statusStructures}</PopoverProduct>;
    } else {
      return (
        // <Text>N/A</Text>
        <Badge>Not Uploaded</Badge>
      );
    }
  };
  const hitGetProductsAPI = async (activePageNumber, activePageSize) => {
    setGridLoader(true);
    let filterPostData = {};
    for (const key in filtersToPass) {
      if (key !== "filtersPresent") {
        if (key === "filter[country][1]") {
          let matchedAccoount = connectedAccountsArray.find(
            (connectedAccount) =>
              connectedAccount["value"] === filtersToPass["filter[country][1]"]
          );
          filterPostData["filter[shop_id][1]"] = matchedAccoount?.["shopId"];
        } else {
          filterPostData[key] = filtersToPass[key];
        }
      }
    }
    // filterPostData  = {...filterPostData, ...reduxState}
    // console.log('filterPostData', filterPostData);
    let postData = {
      productOnly: true,
      count: activePageSize,
      activePage: activePageNumber,
      grid: true,
      ...filterPostData,
    };
    // if (Object.keys(filterPostData).length) {
    //   postData["activePage"] = 1;
    // }
    let {
      success: productsDataSuccess,
      data: productsData,
      message,
      code,
    } = await getProducts(getProductsURL, postData);
    let { success: totalProductsCountSuccess, data: totalProductsCountData } =
      await getProductsCount(getProductsCountURL, {
        productOnly: true,
        ...filterPostData,
      });
    if (totalProductsCountSuccess) {
      let { count } = totalProductsCountData;
      setTotalProductsCount(count);
    }
    if (productsDataSuccess) {
      let { rows } = productsData;
      if (rows && Array.isArray(rows)) {
        let tempProductData = [];
        tempProductData = rows.map((row, index) => {
          let {
            main_image,
            title,
            product_type,
            variant_attributes,
            // variants,
            container_id,
            brand,
            profile_name,
            profile_id,
            source_product_id,
            edited,
            ebay_response,
            quantity,
            total_variants,
            total_quantity,
          } = row;
          let tempObject = {};
          tempObject["source_product_id"] = source_product_id;
          tempObject["key"] = index;
          tempObject["image"] = (
            <center>
              {main_image ? (
                <Image width={30} src={main_image} />
              ) : (
                <Image width={30} preview={false} src={NoProductImage} />
              )}
            </center>
          );
          tempObject["title"] = (
            <Stack
              spacing="extraTight"
              wrap={true}
              vertical={false}
              distribution="center"
            >
              <Text
                strong
                onClick={(e) => {
                  return props.history.push(
                    `/panel/ebay/products/viewproducts?id=${container_id}&source_product_id=${source_product_id}`
                  );
                }}
                style={{ cursor: "pointer" }}
                title={title}
              >
                {trimTitle(title)}
              </Text>
              <Text
                copyable={{
                  text: title,
                }}
              />
            </Stack>
          );
          tempObject["productStatus"] = (
            <Stack alignment="center" distribution="center">
              {getProductStatusEbayResponse(ebay_response)}
            </Stack>
          );
          tempObject["productType"] = (
            <center>
              <Text>{product_type ? product_type : "-"}</Text>
            </center>
          );
          tempObject["vendor"] = (
            <center>
              <Text>{brand ? brand : "-"}</Text>
            </center>
          );
          tempObject["profile"] = (
            <center>
              <Button
                plain
                onClick={(e) => {
                  return props.history.push(
                    `/panel/ebay/profiles/edit?id=${profile_id}`
                  );
                }}
              >
                {profile_name ? profile_name : "-"}
              </Button>
            </center>
          );
          tempObject["variantAttributes"] = (
            <center>
              <Text copyable={variant_attributes.length && true}>
                {variant_attributes.length
                  ? variant_attributes.map((attibute) => attibute).join(", ")
                  : "-"}
              </Text>
            </center>
          );
          tempObject["variantsCount"] = (
            <center>
              <Text>
                {/* {getVariantsCountDetails(variants, variant_attributes)} */}
                {total_variants > 0 ? (
                  total_quantity == 0 ? (
                    <Text type="danger">
                      {total_quantity} in stock for {total_variants} variant(s)
                    </Text>
                  ) : (
                    <>
                      {total_quantity} in stock for {total_variants} variant(s)
                    </>
                  )
                ) : quantity == 0 ? (
                  <Text type="danger">{quantity} in stock</Text>
                ) : (
                  <>{quantity} in stock</>
                )}
              </Text>
            </center>
          );
          // tempObject["variantsData"] = variants;
          tempObject["container_id"] = container_id;
          tempObject["simpleVariant"] = (
            <center>
              {variant_attributes.length > 0 ? "Variants" : "Simple"}
            </center>
          );
          tempObject["showVariant"] =
            variant_attributes.length > 0 ? true : false;
          return tempObject;
        });
        setProductData(tempProductData);
      }
    } else {
      if (code === "invalid_token" || code === "token_expired") {
        props.history.push("/auth/login");
      }
    }
    setGridLoader(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    // onSelectAll: selected=> {
    //   console.log("selected",selected);
    //   if(selected)
    //       { setSelectedRowKeys([0,2]);
    //        setSelectedRows([]);
    //       }
    // }
  };
  const verify = useCallback(
    debounce((value) => {
      let type = "";
      if (searchWithTitle) {
        type = "filter[title][3]";
      } else {
        type = "filter[sku][3]";
      }
      let titleFilterObj = {};
      titleFilterObj[type] = value;
      if (titleFilterObj[type] !== "") {
        setFiltersToPass({
          ...filtersToPass,
          ...titleFilterObj,
          filtersPresent: true,
        });
      } else if (filtersToPass.hasOwnProperty("filter[title][3]")) {
        let temp = { ...filtersToPass, filtersPresent: true };
        delete temp["filter[title][3]"];
        setFiltersToPass(temp);
      } else if (filtersToPass.hasOwnProperty("filter[sku][3]")) {
        let temp = { ...filtersToPass, filtersPresent: true };
        delete temp["filter[sku][3]"];
        setFiltersToPass(temp);
      }
    }, 200),
    [searchWithTitle, filtersToPass]
  );
  useEffect(() => {
    verify(filterTitleORsku);
  }, [filterTitleORsku, searchWithTitle]);

  const renderTitleOrSKU = () => {
    return (
      <TextField
        value={filterTitleORsku}
        onChange={(e) => {
          setFilterTitleORsku(e);
        }}
        placeholder={searchWithTitle ? "Search with title" : "Search with SKU"}
      />
    );
  };
  const renderChoiceListForTitleSKU = () => (
    <ButtonGroup segmented>
      <Button
        primary={searchWithTitle}
        pressed={searchWithTitle}
        onClick={(e) => {
          let temp = { ...filtersToPass };
          if (temp.hasOwnProperty("filter[sku][3]")) {
            delete temp["filter[sku][3]"];
          }
          setFiltersToPass(temp);
          setFilterTitleORsku("");
          setSearchWithTitle(true);
        }}
      >
        Title
      </Button>
      <Button
        primary={!searchWithTitle}
        pressed={!searchWithTitle}
        onClick={(e) => {
          let temp = { ...filtersToPass };
          if (temp.hasOwnProperty("filter[title][3]")) {
            delete temp["filter[title][3]"];
          }
          setFiltersToPass(temp);
          setFilterTitleORsku("");
          setSearchWithTitle(false);
        }}
      >
        SKU
      </Button>
    </ButtonGroup>
  );

  const popOverHandler = (type) => {
    let temp = { ...popOverStatus };
    temp[type] = !popOverStatus[type];
    setPopOverStatus(temp);
  };
  const countryActivator = (
    <Button disclosure onClick={() => popOverHandler("country")}>
      Account
    </Button>
  );
  const statusActivator = (
    <Button disclosure onClick={() => popOverHandler("status")}>
      Status
    </Button>
  );
  const profileActivator = (
    <Button disclosure onClick={() => popOverHandler("profile")}>
      Profile
    </Button>
  );

  const gatherAllFilters = () => {
    let temp = {};
    Object.keys(filters).forEach((filter) => {
      if (filters[filter]["value"]) {
        temp[`filter[${filter}][${filters[filter]["operator"]}]`] =
          filters[filter]["value"];
      }
    });
    let filtersToPassTemp = { ...filtersToPass };
    if (Object.keys(filtersToPassTemp).length) {
      for (const key in filtersToPassTemp) {
        for (const key1 in temp) {
          if (key.split("[")[1] === key1.split("[")[1]) {
            delete filtersToPassTemp[key];
          }
        }
      }
    }
    if (Object.keys(temp).length > 0) {
      setInnerFilterCount(Object.keys(temp).length);
      setFiltersToPass({ ...filtersToPassTemp, ...temp });
    } else {
      // notify.warn("No filters applied");
      setFiltersDrawerVisible(false);
      setInnerFilterCount(0);
      setFiltersToPass({ filtersPresent: false });
      setFilterTitleORsku("");
    }
  };

  const handleChange = (value, selectedType) => {
    let type = `filter[${selectedType}][1]`;
    let filterObj = {};
    filterObj[type] = value[0];
    setFiltersToPass({ ...filtersToPass, ...filterObj });
    setSelected({ ...selected, [selectedType]: value });
  };

  const renderOtherFilters = () => {
    const initialCountryObj = connectedAccountsArray?.filter(
      (connectedAccount, index) =>
        connectedAccount.value === initialCountryValue
    );
    const initialStatusObj = status?.filter(
      (statusItem, index) => statusItem.value === initialStatusValue
    );
    const initialProfileObj = profileListForFilters?.filter(
      (profileItem, index) => profileItem.value === initialProfileValue
    );
    console.log("initial object 1", initialCountryObj);
    console.log("initial object 2", initialStatusObj);
    console.log("initial object 3", initialProfileObj);
    console.log("initial object 4", selected["country"]);
    console.log("initial object 5", selected["status"]);
    console.log("initial object 6", selected["profile_name"]);
    return (
      <Stack wrap>
        <ButtonGroup segmented>
          <Popover
            active={popOverStatus["country"]}
            activator={countryActivator}
            onClose={() => popOverHandler("country")}
          >
            <div style={{ margin: "10px" }}>
              <ChoiceList
                choices={connectedAccountsArray}
                selected={
                  initialCountryObj[0]
                    ? [initialCountryObj[0].value]
                    : selected["country"]
                }
                onChange={(value) => handleChange(value, "country")}
              />
            </div>
          </Popover>
          <Popover
            active={popOverStatus["status"]}
            activator={statusActivator}
            onClose={() => popOverHandler("status")}
          >
            <div style={{ margin: "10px" }}>
              <ChoiceList
                choices={status}
                selected={
                  initialStatusObj[0]
                    ? [initialStatusObj[0].value]
                    : selected["status"]
                }
                onChange={(value) => handleChange(value, "status")}
              />
            </div>
          </Popover>
          <Popover
            active={popOverStatus["profile"]}
            activator={profileActivator}
            onClose={() => popOverHandler("profile")}
          >
            <div style={{ margin: "10px" }}>
              <ChoiceList
                choices={profileListForFilters}
                selected={
                  initialProfileObj[0]
                    ? [initialProfileObj[0].value]
                    : selected["profile_name"]
                }
                onChange={(value) => handleChange(value, "profile_name")}
              />
            </div>
          </Popover>
        </ButtonGroup>
        <Button
          icon={<Icon source={FilterMajorMonotone} color="base" />}
          onClick={() => {
            setFiltersDrawerVisible(true);
          }}
        >
          More Filters
        </Button>
      </Stack>
    );
  };

  const prepareProfileList = (profiles) => {
    const profileList = profiles.map((profile) => {
      return {
        label: profile.name,
        value: profile.name,
        profileId: profile.profile_id,
      };
    });
    profileList.unshift({ label: "All profiles", value: "all" });
    setProfileList(profileList);
    let temp = [...profileList];
    temp.shift();
    setProfileListForFilters(temp);
  };

  const prepareProductTypeVendor = (data) => {
    const { product_type, vendor } = data;
    product_type
      .sort((a, b) => b.localeCompare(a, "es", { sensitivity: "base" }))
      .reverse();
    vendor
      .sort((a, b) => b.localeCompare(a, "es", { sensitivity: "base" }))
      .reverse();
    const productTypeList = product_type.map((type) => {
      return { label: type, value: type };
    });
    const vendorList = vendor.map((type) => {
      return { label: type, value: type };
    });
    let temp = { ...filters };
    temp["brand"]["options"] = vendorList;
    temp["product_type"]["options"] = productTypeList;
    setFilters(temp);
    setProductTypeList(productTypeList);
    setVendorList(vendorList);
  };

  const extractDataProfilesProducttypeVendor = (index, promiseData) => {
    let { success, data, message } = promiseData;
    if (success) {
      switch (index) {
        case 0:
          prepareProfileList(data.rows);
          break;
        case 1:
          prepareProductTypeVendor(data);
        default:
          break;
      }
    } else {
      notify.error(message);
    }
  };

  const getProfilesProducttypeVendor = async () => {
    let profileDataToPost = {
      marketplace: "ebay",
      grid: true,
    };
    try {
      const allPromise = await Promise.all([
        await getProfiles(getProfilesURL, profileDataToPost),
        await getImportAttribute(),
      ]);
      allPromise.forEach((data, index) => {
        extractDataProfilesProducttypeVendor(index, data);
      });
    } catch (err) {
      // console.log(err);
    }
  };
  const getAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );

      let tempArr = ebayAccounts.map((account, key) => {
        let accountName = {
          label: (
            <Stack alignment="center" spacing="tight">
              <>{getCountyrName(account["warehouses"][0]["site_id"])}</>
              <>{account["warehouses"][0]["user_id"]}</>
            </Stack>
          ),
          value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          siteID: account["warehouses"][0]["site_id"],
          shopId: account["id"],
          image: getCountyrName(account["warehouses"][0]["site_id"]),
          abbreviation: getCountryAbbreviation(
            account["warehouses"][0]["site_id"]
          ),
          username: account["warehouses"][0]["user_id"],
          active:
            account["warehouses"][0]["status"] === "active" ? true : false,
        };
        return accountName;
      });
      setconnectedAccountsArray(tempArr);
      getProfilesProducttypeVendor();
    }
  };

  const hitDashoboardAPI = async () => {
    let { success, data } = await getDashboardData(dashboardAnalyticsURL);
    if (success) {
      const { available_credits, total_used_credits, service_credits } =
        data?.planDetails?.productCredits?.prepaid;
      let temp = { ...productCredits };
      temp["available"] = available_credits;
      temp["total"] = service_credits;
      setProductCredits(temp);
    }
  };

  useEffect(() => {
    // if (connectedAccountsArray.length) {
    //   hitGetProductsAPI();
    // }
    if (reduxState && connectedAccountsArray.length) {
      setFiltersToPass(reduxState);
    }
  }, [connectedAccountsArray]);

  useEffect(() => {
    getAccounts();
    hitDashoboardAPI();
  }, []);

  const getFieldValue = (field) => {
    switch (field) {
      case "country":
        return "Account";
      case "status":
        return "Product Status";
      case "title":
        return "Title";
      case "sku":
        return "SKU";
      case "profile_name":
        return "Profile";
      default:
        return filtersFields.find((option) => option["value"] === field)?.[
          "label"
        ];
    }
  };

  const getOperatorLabel = (operator) => {
    let findValue = stringOperatorOptions.find(
      (option) => option["value"] === operator
    );
    let value = "";
    if (findValue) {
      value = findValue["label"];
    } else {
      findValue = numberOperatorOptions.find(
        (option) => option["value"] === operator
      );
      value = findValue?.["label"];
    }
    return value;
  };
  const disableFiltersHandler = (temp, object) => {
    const arr = Object.keys(temp).map((item, index) => {
      let indexOfFirstOpeningBracket = item.indexOf("[");
      let indexOfFirstClosingBracket = item.indexOf("]");
      return item.substring(
        indexOfFirstOpeningBracket + 1,
        indexOfFirstClosingBracket
      );
    });
    return arr;
  };
  const formatFilterValue = (filterName, filterValue) => {
    if (filterName === "status") {
      const statusItem = status?.filter((item) => item.value === filterValue);
      console.log("filter name", statusItem);
      return statusItem[0]?.label;
    } else {
      return filterValue;
    }
  };
  const tagMarkup = () => {
    return Object.keys(filtersToPass).map((filter, index) => {
      // if (key !== "filtersPresent") {

      if (
        !filter.includes("filtersPresent") ||
        (filter.includes("filtersPresent") && filter["filtersPresent"])
      ) {
        let indexOfFirstOpeningBracket = filter.indexOf("[");
        let indexOfFirstClosingBracket = filter.indexOf("]");
        let indexOfSecondOpeningBracket = filter.indexOf(
          "[",
          indexOfFirstOpeningBracket + 1
        );
        let indexOfSecondClosingBracket = filter.indexOf(
          "]",
          indexOfFirstClosingBracket + 1
        );
        let fieldValue = filter.substring(
          indexOfFirstOpeningBracket + 1,
          indexOfFirstClosingBracket
        );
        let operatorValue = filter.substring(
          indexOfSecondOpeningBracket + 1,
          indexOfSecondClosingBracket
        );
        return (
          <Tag
            key={filter}
            onRemove={() => {
              const temp = Object.keys(filtersToPass).reduce((object, key) => {
                if (key !== filter) {
                  object[key] = filtersToPass[key];
                }
                return object;
              }, {});
              let tempObj = { ...filters };
              let disabledArr = [];
              Object.keys(tempObj).forEach((object) => {
                if (object === fieldValue) {
                  if (object === "listing_id") {
                    tempObj["price"]["disabled"] = false;
                    tempObj["quantity"]["disabled"] = false;
                  } else if (object === "price" || object === "quantity") {
                    disabledArr = disableFiltersHandler(temp, object);
                    if (
                      !disabledArr.includes("price") &&
                      !disabledArr.includes("quantity")
                    ) {
                      tempObj["listing_id"]["disabled"] = false;
                    }
                  }
                  tempObj[object]["value"] = "";
                }
              });
              // setFilterTitleORsku("");
              ["title", "sku"].includes(fieldValue) && setFilterTitleORsku("");
              setFilters(tempObj);
              setFiltersToPass(temp);
              setSelected({ ...selected, [fieldValue]: [] });
            }}
          >
            {getFieldValue(fieldValue)} {getOperatorLabel(operatorValue)}{" "}
            {formatFilterValue(fieldValue, filtersToPass[filter])}
          </Tag>
        );
      }
    });
  };

  useEffect(() => {
    if (filtersToPass) {
      dispatch({ type: "productFilter", payload: filtersToPass });
      setSelectedRows([]);
      setSelectedRowKeys([]);
    }
  }, [filtersToPass]);
  // useEffect(() => {
  //   // if (reduxState) setFiltersToPass(reduxState);
  //   if (reduxState && connectedAccountsArray.length) {
  //     setFiltersToPass(reduxState);
  //   }
  // }, [connectedAccountsArray]);

  function handleScroll(e) {
    if (
      e.currentTarget.querySelector(".ant-table-wrapper").className ===
      "ant-table-wrapper"
    ) {
      setIsOpen(false);
    }
  }

  return (
    <PageHeader
      className="site-page-header-responsive"
      title={"Products"}
      subTitle={
        productCredits.total && (
          <Badge>
            <Text strong>
              <Stack spacing="extraTight" alignment="center">
                <>{`${productCredits.available}/${productCredits.total} product credits available`}</>
                <div style={{ cursor: "pointer" }}>
                  <Tooltip content="1 Product Credit means 1 product can be listed on eBay through the app">
                    <Icon source={QuestionMarkMinor} />
                  </Tooltip>
                </div>
              </Stack>
            </Text>
          </Badge>
        )
      }
      ghost={true}
      extra={[
        <CsvBulkMenu
          profileList={profileList}
          isCsvBulkMenuOpen={isCsvBulkMenuOpen}
          setCallbackCsvFunction={setCallbackCsvFunction}
          hitGetNotifications={props.hitGetNotifications}
        />,
        <EbayActionsBulkMenu
          profileList={profileList}
          isEbayActionBulkMenuOpen={isEbayActionBulkMenuOpen}
          setCallbackEbayActionFunction={setCallbackEbayActionFunction}
          hitGetNotifications={props.hitGetNotifications}
        />,
        // <ProductMassMenu selectedRows={selectedRows} />,
        <ProductBulkMenu
          profileList={profileList}
          isProductBulkMenuOpen={isProductBulkMenuOpen}
          setCallbackProductBulkFunction={setCallbackProductBulkFunction}
          hitGetNotifications={props.hitGetNotifications}
        />,
      ]}
    >
      <Card sectioned>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Stack wrap>
              <Stack.Item fill>{renderTitleOrSKU()}</Stack.Item>
              <Stack.Item>{renderChoiceListForTitleSKU()}</Stack.Item>
              <Stack.Item>{renderOtherFilters()}</Stack.Item>
            </Stack>
            <Stack spacing="tight">
              {filtersToPass &&
                Object.keys(filtersToPass).length > 0 &&
                tagMarkup()}
            </Stack>
          </div>
          <Row
            gutter={{ xs: [8, 32], sm: [16, 32], md: 24, lg: 32 }}
            justify="space-between"
            style={{ marginBottom: 10 }}
          >
            <Col
              className="gutter-row"
              span={6}
              xs={24}
              sm={24}
              md={6}
              lg={6}
              xl={6}
              xxl={6}
            >
              {/* <OutsideAlerterMassMenu isOpen={isOpen} setIsOpen={setIsOpen}> */}
              <ProductMassMenu
                selectedRows={selectedRows}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
              {/* </OutsideAlerterMassMenu> */}
            </Col>
            <Col
              className="gutter-row"
              span={18}
              xs={24}
              sm={24}
              md={18}
              lg={18}
              xl={18}
              xxl={18}
            >
              <Stack distribution="trailing">
                <PaginationComponent
                  totalCount={totalProductsCount}
                  hitGetProductsAPI={hitGetProductsAPI}
                  pageSizeOptions={pageSizeOptions}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  setPrevPage={setPrevPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  size={"default"}
                  simple={false}
                />
              </Stack>
            </Col>
          </Row>
        </div>
        <div className="wrapper" onScroll={handleScroll}>
          <NestedTableComponent
            loading={gridLoader}
            size={"small"}
            pagination={false}
            columns={productColumns}
            dataSource={productData}
            selectedRowKeys={selectedRowKeys}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            // scroll={{ x: 1500, y: 500 }}
            scroll={{ x: 1500 }}
            expandable={{
              expandedRowRender: (record) => {
                return record["showVariant"] ? (
                  // <>hi</>
                  <VariantComponentData
                    // dataSource={record["variantsData"]}
                    record={record}
                    size="small"
                  />
                ) : (
                  // <VariantComponentData
                  //   // dataSource={record["variantsData"]}
                  //   record={record}
                  //   size="small"
                  // />
                  // <RenderChild record={record} />
                  // <VariantComponentData
                  //   dataSource={record["variantsData"]}
                  //   size="small"
                  // />
                  <Alert message="No Variants Found" type="info" />
                );
                // <TabsComponent
                //   totalTabs={1}
                //   tabContents={{
                //     "Variant Listings":
                //       record["variantsData"] &&
                //       record["variantsData"].length > 0 ? (
                //         <VariantComponentData
                //           dataSource={record["variantsData"]}
                //           size="small"
                //         />
                //       ) : (
                //         <Alert message="No Variants Found" type="info" />
                //       ),
                //   }}
                // />
                // );
              },
              expandIcon: ({ expanded, onExpand, record }) =>
                record["showVariant"] &&
                (expanded ? (
                  <Tooltip content="Hide Variants">
                    <CaretUpOutlined onClick={(e) => onExpand(record, e)} />
                  </Tooltip>
                ) : (
                  <Tooltip content="View Variants">
                    <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                  </Tooltip>
                )),
            }}
          />
        </div>
      </Card>
      <NewFilterComponentSimilarPolaris
        setFiltersDrawerVisible={setFiltersDrawerVisible}
        filtersDrawerVisible={filtersDrawerVisible}
        filters={filters}
        stringOperatorOptions={stringOperatorOptions}
        initialMoreFiltersObj={initialMoreFiltersObj}
        numberOperatorOptions={numberOperatorOptions}
        setFilters={setFilters}
        gatherAllFilters={gatherAllFilters}
        setFiltersToPass={setFiltersToPass}
        setFilterTitleORsku={setFilterTitleORsku}
        setSelected={setSelected}
      />
      <Modal
        open={errorPopup.active}
        onClose={() => setErrorPopup({ active: false, content: [] })}
        title="Errors"
      >
        <Modal.Section>
          <Banner status="critical">
            <List>
              {errorPopup.content.map((error) => (
                <List.Item>{error}</List.Item>
              ))}
            </List>
          </Banner>
        </Modal.Section>
      </Modal>
    </PageHeader>
  );
}

export default NewProductsNewFilters;
