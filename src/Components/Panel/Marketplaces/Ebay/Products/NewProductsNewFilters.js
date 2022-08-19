import { Image, PageHeader, Alert, Row, Col, Typography, Dropdown } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import {
  DownOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import NoProductImage from "../../../../../assets/notfound.png";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import VariantComponentData from "./VariantComponentData";
import {
  getProductsURL,
  getProductsCountURL,
  getVariantsURL,
} from "../../../../../URLs/ProductsURL";
import {
  getProducts,
  getProductsCount,
} from "../../../../../APIrequests/ProductsAPI";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import PaginationComponent from "../../../../AntDesignComponents/PaginationComponent";
import { testController } from "../../../../../Apirequest/ebayApirequest/productsApi";
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
  Link,
  Badge,
  Tooltip,
  TextStyle,
} from "@shopify/polaris";
import { notify } from "../../../../../services/notify";
import ActionPopover from "./ActionPopover";
import { bulkMenu } from "./helperFunctions/bulkMenuHelper";
import { massMenu } from "./helperFunctions/massMenuHelper";
import {
  getVariantsCountDetails,
  trimTitle,
} from "./helperFunctions/commonHelper";
import { AlertMinor, FilterMajorMonotone } from "@shopify/polaris-icons";
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
import ProductDisabledMenu from "./ProductDisabledMenu";

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
    operator: "3",
    dataType: "string",
  },
  {
    label: "Product Type",
    value: "product_type",
    searchType: "dropdown",
    inputValue: "",
    operator: "1",
    dataType: "string",
  },
  {
    label: "Vendor",
    value: "brand",
    searchType: "dropdown",
    inputValue: "",
    operator: "1",
    dataType: "string",
  },
  {
    label: "Tags",
    value: "tags",
    searchType: "textField",
    inputValue: "",
    operator: "3",
    dataType: "string",
  },
  {
    label: "Price",
    value: "price",
    searchType: "textField",
    inputValue: "",
    operator: "1",
    dataType: "number",
  },
  {
    label: "Inventory",
    value: "quantity",
    searchType: "textField",
    inputValue: "",
    operator: "1",
    dataType: "number",
  },
  // {
  //   label: "Variant Attribute",
  //   value: "variant_attributes",
  //   searchType: "textField",
  //   inputValue: "",
  //   operator: "3",
  //   dataType: "string",
  // },
];

export const getFitersInitially = () => {
  let tempObj = {};
  filtersFields.forEach((field) => {
    tempObj[field["value"]] = {
      operator: field["operator"],
      value: field["inputValue"],
      label: field["label"],
      dataType: field["dataType"],
    };
    if (field?.["searchType"] === "dropdown") {
      tempObj[field["value"]]["options"] = [];
    }
  });
  return tempObj;
};

function NewProductsNewFilters(props) {
  const [productData, setProductData] = useState([]);

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
          <Stack distribution="equalSpacing" alignment="leading">
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
  // const [pageSizeOptions, setPageSizeOptions] = useState([5, 10, 20]);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  // const [pageSize, setPageSize] = useState(5);
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

  useEffect(() => {
    hitGetProductsAPI();
  }, [activePage, pageSize, filtersToPass]);

  const getBadge = (test) => {
    if (test?.ended) {
      return <Badge status="warning">Ended</Badge>;
    } else if (test?.ItemId && test?.Errors) {
      return (
        <Badge status="success" progress="complete">
          <Icon source={AlertMinor} color={"red"} />
          Uploaded
        </Badge>
      );
    } else if (test?.ItemId) {
      return (
        <Badge status="success" progress="complete">
          Uploaded
        </Badge>
      );
    } else if (test?.Errors) {
      return <Badge status="critical">Errors</Badge>;
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
              {/* <Badge status="success" progress="complete" /> */}
              {test?.image}
              {/* {test?.ItemId && test["Errors"] && (
                <Icon source={AlertMinor} color={"red"} />
              )} */}
              <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
              {getBadge(test)}
              {/* {test?.abbreviation}
              {test?.ItemId && test["Errors"] && (
                <Icon source={AlertMinor} color={"red"} />
              )}
              <Text style={{ fontSize: "1.5rem" }}>
                {test?.ended
                  ? "Ended"
                  : test?.ItemId
                  ? test?.ItemId
                  : test?.Errors
                  ? "Error"
                  : "Not Uploaded"} */}
              {/* </Text> */}
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
    // console.log(response);
    let statusStructures = [];
    if (response) {
      for (const shopId in response) {
        let matchedAccount = connectedAccountsArray.find(
          (connectedAccount) => connectedAccount["shopId"] == shopId
        );
        let test = {
          ...matchedAccount,
          ...response[shopId],
        };
        const structStatus = (test.ItemId || test.Errors) && (
          <Stack>
            {test?.image}
            <Text style={{ fontSize: "1.5rem" }}>{test?.username}</Text>
            {getBadge(test)}
          </Stack>
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
  const hitGetProductsAPI = async () => {
    setGridLoader(true);
    let filterPostData = {};
    for (const key in filtersToPass) {
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
    // let filterKeys = Object.keys(filterPostData).map(filter => {
    //   let filterKeyName = filter.split('[')?.[1].split(']')?.[0]
    //   return filterKeyName
    // })
    // let flagCount = 0
    // filterKeys.forEach(filter => {
    //   if(['shop_id', 'status'].includes(filter)) {
    //     flagCount++
    //   }
    // })
    // if(flagCount === 2) {
    //   console.log(filterPostData);
    // }
    let postData = {
      productOnly: true,
      count: pageSize,
      activePage: activePage,
      // grid: true,
      // ...filtersToPass,
      ...filterPostData,
    };
    if (Object.keys(filterPostData).length) {
      postData["activePage"] = 1;
    }
    let {
      success: productsDataSuccess,
      data: productsData,
      message,
      code,
    } = await getProducts(getProductsURL, postData);
    let { success: totalProductsCountSuccess, data: totalProductsCountData } =
      await getProductsCount(
        getProductsCountURL,
        {
          productOnly: true,
          // ...filtersToPass
          ...filterPostData,
        }
        // postData
      );
    if (totalProductsCountSuccess) {
      let { count } = totalProductsCountData;
      setTotalProductsCount(count);
    }
    // let { success: accountConnectedSuccess } = await getConnectedAccounts();

    // if (accountConnectedSuccess) {
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
            variants,
            container_id,
            brand,
            profile_name,
            source_product_id,
            edited,
            ebay_response,
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
                    `/panel/ebay/viewproducts?id=${container_id}&source_product_id=${source_product_id}`
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
              {/* <PopoverProduct>{getProductStatus(edited)}</PopoverProduct> */}
              {getProductStatusEbayResponse(ebay_response)}
            </Stack>
          );
          tempObject["productType"] = (
            <center>
              <Text
              // copyable={product_type && true}
              >
                {product_type}
              </Text>
            </center>
          );
          tempObject["vendor"] = (
            <center>
              <Text
              // copyable={brand && true}
              >
                {brand}
              </Text>
            </center>
          );
          tempObject["profile"] = (
            <center>
              <Text
              // copyable={profile_name && true}
              >
                {profile_name ? profile_name : "-"}
              </Text>
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
                {getVariantsCountDetails(variants, variant_attributes)}
              </Text>
            </center>
          );
          tempObject["variantsData"] = variants;
          tempObject["container_id"] = container_id;
          return tempObject;
        });
        setProductData(tempProductData);
      }
    } else {
      // notify.error(message);
      if (code === "invalid_token" || code === "token_expired") {
        props.history.push("/auth/login");
      }
    }
    setGridLoader(false);
    // } else {
    //   if (code === "invalid_token" || code === "token_expired") {
    //     props.history.push("/auth/login");
    //   }
    // }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
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
        setFiltersToPass({ ...filtersToPass, ...titleFilterObj });
      } else if (filtersToPass.hasOwnProperty("filter[title][3]")) {
        let temp = { ...filtersToPass };
        delete temp["filter[title][3]"];
        setFiltersToPass(temp);
      } else if (filtersToPass.hasOwnProperty("filter[sku][3]")) {
        let temp = { ...filtersToPass };
        delete temp["filter[sku][3]"];
        setFiltersToPass(temp);
      }
    }, 200),
    [searchWithTitle, filtersToPass]
  );
  useEffect(() => {
    // if (filterTitleORsku !== "") {
    verify(filterTitleORsku);
    // }
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
  const productTypeActivator = (
    <Button disclosure onClick={() => popOverHandler("productType")}>
      Product Type
    </Button>
  );
  const vendorActivator = (
    <Button disclosure onClick={() => popOverHandler("brand")}>
      Vendor
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
      notify.warn("No filters applied");
    }
    // setFiltersToPass({ ...temp });
  };

  const handleChange = (value, selectedType) => {
    let type = `filter[${selectedType}][1]`;
    let filterObj = {};
    filterObj[type] = value[0];
    setFiltersToPass({ ...filtersToPass, ...filterObj });
    setSelected({ ...selected, [selectedType]: value });
  };

  const renderOtherFilters = () => {
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
                // allowMultiple
                choices={connectedAccountsArray}
                selected={selected["country"]}
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
                selected={selected["status"]}
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
                choices={profileList}
                selected={selected["profile_name"]}
                onChange={(value) => handleChange(value, "profile_name")}
              />
            </div>
          </Popover>
          {/* <Popover
            active={popOverStatus["productType"]}
            activator={productTypeActivator}
            onClose={() => popOverHandler("productType")}
          >
            <div style={{ margin: "10px" }}>
              <ChoiceList
                choices={productTypeList}
                selected={selected["product_type"]}
                onChange={(value) => handleChange(value, "product_type")}
              />
            </div>
          </Popover> */}
          {/* <Popover
            active={popOverStatus["brand"]}
            activator={vendorActivator}
            onClose={() => popOverHandler("brand")}
          >
            <div style={{ margin: "10px" }}>
              <ChoiceList
                choices={vendorList}
                selected={selected["brand"]}
                onChange={(value) => handleChange(value, "brand")}
              />
            </div>
          </Popover> */}
          {/* {innerFilterCount ? (
          <Badge count={innerFilterCount}>
            <Button
              icon={<FilterMajorMonotone />}
              onClick={() => {
                setFiltersDrawerVisible(true);
              }}
            >
              More Filters
            </Button>
          </Badge>
        ) : ( */}
          {/* <Button
          icon={<FilterMajorMonotone />}
          onClick={() => {
            setFiltersDrawerVisible(true);
          }}
        >
          More Filters
        </Button> */}
          {/* )} */}
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
  };

  const prepareProductTypeVendor = (data) => {
    const { product_type, vendor } = data;
    const productTypeList = product_type.map((type) => {
      return { label: type, value: type };
    });
    const vendorList = vendor.map((type) => {
      return { label: type, value: type };
    });
    let temp = { ...filters };
    temp["brand"]["options"] = vendorList;
    temp["product_type"]["options"] = productTypeList;
    // temp["brand"]["value"] = vendorList[0].value;
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
      // count: 25,
      // activePage: 1,
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
        };
        return accountName;
      });
      setconnectedAccountsArray(tempArr);
      getProfilesProducttypeVendor();
    }
  };

  useEffect(() => {
    if (connectedAccountsArray.length) {
      hitGetProductsAPI();
    }
  }, [connectedAccountsArray]);

  useEffect(() => {
    getAccounts();
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
      // case "product_type":
      //   return "Product Type";
      // case "brand":
      //   return "Vendor";
      default:
        return filtersFields.find((option) => option["value"] === field)?.[
          "label"
        ];
    }
    // return 'vh'
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
      value = findValue["label"];
    }
    return value;
  };

  const tagMarkup = () => {
    return Object.keys(filtersToPass).map((filter, index) => {
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
            Object.keys(tempObj).forEach((object) => {
              if (object === fieldValue) {
                tempObj[object]["value"] = "";
              }
            });
            setFilterTitleORsku("");
            setFilters(tempObj);
            setFiltersToPass(temp);
            setSelected({ ...selected, [fieldValue]: [] });
          }}
        >
          {getFieldValue(fieldValue)} {getOperatorLabel(operatorValue)}{" "}
          {filtersToPass[filter]}
        </Tag>
      );
    });
  };

  const callVariantAPI = async (record) => {
    const postData = { container_id: record.container_id, grid: true };
    let {
      success: variantDataSuccess,
      data: variantData,
      message,
      code,
    } = await getProducts(getVariantsURL, postData);
    if (
      variantDataSuccess &&
      variantData &&
      Array.isArray(variantData) &&
      variantData.length
    ) {
      const { variants } = variantData[0];
      if (variants && Array.isArray(variants) && variants.length) {
        let tempProductData = [...productData];
        tempProductData.forEach((product, index) => {
          if (product.container_id === record.container_id) {
            tempProductData[index]["variantsData"] = variants;
          }
        });
        setProductData(tempProductData);
      }
    }
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      // title="Products"
      title={
        <Tooltip
          preferredPosition="above"
          content="Manage your shopify products"
        >
          <TextStyle variation="strong"> Products</TextStyle>
        </Tooltip>
      }
      ghost={true}
      extra={[
        // <Button
        //   type="primary"
        //   onClick={async () => {
        //     let data = {};
        //     await testController(data);
        //   }}
        //   key={"test"}
        // >
        //   Test
        // </Button>,
        <ProductMassMenu selectedRows={selectedRows} />,
        <ProductBulkMenu profileList={profileList} />,
        // <ProductDisabledMenu selectedRows={selectedRows} />
        // <Dropdown key="bulkAction" overlay={bulkMenu(props)} trigger={["click"]}>
        //   <Button>
        //     <div>
        //       Bulk Actions <DownOutlined />
        //     </div>
        //   </Button>
        // </Dropdown>,
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
              {Object.keys(filtersToPass).length > 0 && tagMarkup()}
            </Stack>
          </div>
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            justify="space-between"
            style={{ marginBottom: 10 }}
          >
            <Col className="gutter-row" span={18}>
              <PaginationComponent
                totalCount={totalProductsCount}
                pageSizeOptions={pageSizeOptions}
                activePage={activePage}
                setActivePage={setActivePage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                size={"default"}
                simple={false}
              />
            </Col>
          </Row>
        </div>
        <NestedTableComponent
          loading={gridLoader}
          size={"small"}
          pagination={false}
          columns={productColumns}
          dataSource={productData}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          scroll={{ x: 1500, y: 500 }}
          expandable={{
            // onExpand: (expanded, record) => {
            //   if (expanded) {
            //     callVariantAPI(record);
            //   }
            // },
            expandedRowRender: (record) => {
              // console.log(record);
              return (
                <TabsComponent
                  totalTabs={1}
                  tabContents={{
                    "Variant Listings":
                      record["variantsData"] &&
                      record["variantsData"].length > 0 ? (
                        <VariantComponentData
                          dataSource={record["variantsData"]}
                          size="small"
                        />
                      ) : (
                        <Alert message="No Variants Found" type="info" />
                      ),
                  }}
                />
              );
            },
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <Tooltip content="Hide Variants">
                  <CaretUpOutlined onClick={(e) => onExpand(record, e)} />
                </Tooltip>
              ) : (
                <Tooltip content="View Variants">
                  <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                </Tooltip>
              ),
          }}
        />
      </Card>
      <NewFilterComponentSimilarPolaris
        setFiltersDrawerVisible={setFiltersDrawerVisible}
        filtersDrawerVisible={filtersDrawerVisible}
        filters={filters}
        // operatorOptions={operatorOptions}
        stringOperatorOptions={stringOperatorOptions}
        numberOperatorOptions={numberOperatorOptions}
        setFilters={setFilters}
        gatherAllFilters={gatherAllFilters}
        setFiltersToPass={setFiltersToPass}
        setFilterTitleORsku={setFilterTitleORsku}
        setSelected={setSelected}
      />
    </PageHeader>
  );
}

export default NewProductsNewFilters;
