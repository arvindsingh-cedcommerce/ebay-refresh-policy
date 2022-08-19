import {
  Button,
  Dropdown,
  Image,
  PageHeader,
  Menu,
  Tabs,
  Alert,
  Row,
  Col,
  Typography,
  Drawer,
  Space,
  Tooltip,
  Spin,
  Avatar,
  Badge as AntBadge,
  AutoComplete,
  // Tag,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import {
  demoProductData,
  getDataForPreviewComponent,
  getFilteredDataFromProductListingAndEditListing,
  getProductGridHeadings,
  productGridHeadings,
  productGridTabs,
  singleProductData,
  variantGridHeadings,
} from "./SampleProductData";
import {
  DownOutlined,
  UploadOutlined,
  DownloadOutlined,
  SyncOutlined,
  FilterOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
  // CaretDownOutlinedTwoTone,
  // CaretUpOutlinedTwoTone
} from "@ant-design/icons";
import NoProductImage from "../../../../../assets/notfound.png";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import PreviewProductDataComponent from "../../../../AntDesignComponents/PreviewProductDataComponent";
import VariantComponentData from "./VariantComponentData";
import ModalComponent from "../../../../AntDesignComponents/ModalComponent";
import Checkbox from "antd/lib/checkbox/Checkbox";
import {
  getProductsURL,
  getProductsCountURL,
  uploadProductByIdURL,
  matchFromEbayURL,
  relistItemURL,
  deleteItemURL,
  bulkUploadProduct,
  importMetaFieldURL,
  disableItemURL,
  syncInventoryPrice,
  syncProductDetails,
  importProductURL,
  importCollectionProductURL,
} from "../../../../../URLs/ProductsURL";
import {
  getProducts,
  getProductsCount,
  getrequest,
  postActionOnProductById,
} from "../../../../../APIrequests/ProductsAPI";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterofWords,
} from "../Template/Helper/TemplateHelper";
import PaginationComponent from "../../../../AntDesignComponents/PaginationComponent";
import { testController } from "../../../../../Apirequest/ebayApirequest/productsApi";
import NewFilterComponent from "../../../../AntDesignComponents/NewFilterComponent";
import {
  Card,
  Icon,
  Stack,
  ActionList,
  Tag,
  Badge,
  Button as ShopifyButton,
  Link,
  ButtonGroup,
  Popover,
  ChoiceList,
  TextField,
} from "@shopify/polaris";
import { notify } from "../../../../../services/notify";
import {
  DropdownMinor,
  MobileVerticalDotsMajorMonotone,
} from "@shopify/polaris-icons";
import ActionPopover from "./ActionPopover";
import { functionsIn, isUndefined } from "lodash";
import { getProfiles } from "../../../../../APIrequests/ProfilesAPI";
import { getProfilesURL } from "../../../../../URLs/ProfilesURL";
import { getImportAttribute } from "../../../../../Apirequest/registrationApi";
import NewFilterComponentSimilarPolaris from "./NewFilterComponentSimilarPolaris";

const { Paragraph, Title, Text } = Typography;

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
  // {
  //   label: "Title",
  //   value: "title",
  //   searchType: "textField",
  //   inputValue: "",
  //   operator: "3",
  // },
  // {
  //   label: "Product Type",
  //   value: "product_type",
  //   searchType: "textField",
  //   inputValue: "",
  //   operator: "3",
  // },
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
    value: "inventory",
    searchType: "textField",
    inputValue: "",
    operator: "1",
    dataType: "number",
  },
  // {
  //   label: "SKU",
  //   value: "sku",
  //   searchType: "textField",
  //   inputValue: "",
  //   operator: "3",
  // },
  {
    label: "eBay Item ID",
    value: "listing_id",
    searchType: "textField",
    inputValue: "",
    operator: "3",
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
  // {
  //   label: "Profile",
  //   value: "profile",
  //   searchType: "textField",
  //   inputValue: "",
  //   operator: "3",
  // },
  // {
  //   label: "Vendor",
  //   value: "vendor",
  //   searchType: "textField",
  //   inputValue: "",
  //   operator: "3",
  // },
  {
    label: "Variant Attribute",
    value: "variant_attribute",
    searchType: "textField",
    inputValue: "",
    operator: "3",
    dataType: "string",
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
    };
  });
  return tempObj;
};

function FinalProductGrid(props) {
  const [productData, setProductData] = useState([]);

  let [productColumns, setProductColumns] = useState([
    {
      title: (
        <center>
          <Text strong>Image</Text>
        </center>
      ),
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
      title: (
        <center>
          <Text strong>Title</Text>
        </center>
      ),
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
      title: (
        <center>
          <Text strong>Inventory</Text>
        </center>
      ),
      dataIndex: "variantsCount",
      key: "variantsCount",
      className: "show",
      label: "Variant Count",
      value: "Variant Count",
      checked: true,
      editable: true,
      // width: 80,
    },
    // {
    //   title: (
    //     <center>
    //       <Text strong>Status</Text>
    //     </center>
    //   ),
    //   dataIndex: "status",
    //   key: "status",
    //   className: "show",
    //   label: "Status",
    //   value: "Status",
    //   checked: true,
    //   editable: true,
    //   // width: 200,
    // },
    {
      title: (
        <center>
          <Text strong>Profiles</Text>
        </center>
      ),
      dataIndex: "profile",
      key: "profile",
      className: "show",
      label: "Profile",
      value: "Profile",
      checked: true,
      editable: true,
      // width: 180,
    },
    {
      title: (
        <center>
          <Text strong>Product Type</Text>
        </center>
      ),
      dataIndex: "productType",
      key: "productType",
      className: "show",
      label: "Product Type",
      value: "Product Type",
      checked: true,
      editable: true,
      // width: 200,
    },
    {
      title: (
        <center>
          <Text strong>Variant Attributes</Text>
        </center>
      ),
      dataIndex: "variantAttributes",
      key: "variantAttributes",
      className: "show",
      label: "Variant Attributes",
      value: "Variant Attributes",
      checked: true,
      editable: true,
      // width: 180,
    },
    {
      title: (
        <center>
          <Text strong>Vendor</Text>
        </center>
      ),
      dataIndex: "vendor",
      key: "vendor",
      className: "show",
      label: "Vendor",
      value: "Vendor",
      checked: true,
      editable: true,
      // width: 180,
    },
    {
      title: (
        <center>
          <Text strong>Actions</Text>
        </center>
      ),
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
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewColumnsModal, setViewColumnsModal] = useState(false);

  // pagination && filters
  const [activePage, setActivePage] = useState(1);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  const [pageSize, setPageSize] = useState(25);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const [variantColumns, setVariantColumns] = useState(variantGridHeadings);

  // checkbox related states
  const [defaultChecked, setDefaultChecked] = useState([]);
  const [checkedList, setCheckedList] = useState([]);

  // filters
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
  const [filters, setFilters] = useState(getFitersInitially());
  const [filtersToPass, setFiltersToPass] = useState("");
  const [popoverActive, setpopoverActive] = useState(false);

  // tags
  const [selectedTags, setSelectedTags] = useState(["Rustic", "Antique"]);

  const [gridLoader, setGridLoader] = useState(false);
  const [selected, setSelected] = useState({
    profile: [],
    product_type: [],
    vendor: [],
  });
  const [profileList, setProfileList] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  const handleChange = (value, selectedType) => {
    console.log(selectedType);
    let type = `filter[${selectedType}][1]`;
    let filterObj = {};
    filterObj[type] = value;
    setFiltersToPass({ ...filtersToPass, ...filterObj });
    setSelected({ ...selected, [selectedType]: value });
  };

  const [searchWithTitle, setSearchWithTitle] = useState(true);
  const [popOverStatus, setPopOverStatus] = useState({
    profile: false,
    productType: false,
    vendor: false,
  });

  const [filterTitleORsku, setFilterTitleORsku] = useState("");

  const getDefaultHeadingsOnDefaultCheckedBasis = () => {
    let temp = productGridHeadings.filter((heading) => heading["checked"]);
    setDefaultChecked(temp);
    setCheckedList(temp);
  };

  const getHeadingsAfterChecked = () => {
    let result = productGridHeadings.filter((o1) =>
      checkedList.some((o2) => o1.title === o2.title)
    );
    setProductColumns(result);
  };

  useEffect(() => {
    // getHeadingsAfterChecked();
  }, [checkedList]);

  const getProfilesProducttypeVendor = async () => {
    let profileDataToPost = {
      count: 25,
      activePage: 1,
      marketplace: "ebay",
      grid: true,
    };
    try {
      const allPromise = await Promise.all([
        await getProfiles(getProfilesURL, profileDataToPost),
        await getImportAttribute(),
      ]);
      allPromise.forEach((data, index) => {
        extractData(index, data);
      });
    } catch (err) {
      // console.log(err);
    }
  };
  const extractData = (index, promiseData) => {
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

  const prepareProfileList = (profiles) => {
    const profileList = profiles.map((profile) => {
      return { label: profile.name, value: profile.name };
    });
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
    setProductTypeList(productTypeList);
    setVendorList(vendorList);
  };

  useEffect(() => {
    hitGetProductsAPI();
    getProfilesProducttypeVendor();
  }, [activePage, pageSize, filtersToPass]);

  const getEditedData = (edited) => {
    if (edited) {
      let test = edited?.variation[0]?.shops;
      return Object.values(test)[0]?.edited_data;
    }
    return {};
  };

  const getVariantsCountDetails = (variants, variant_attributes) => {
    let text = "";
    let inventoryCount = 0;
    variants.forEach((variant) => {
      inventoryCount += Number(variant?.quantity);
    });
    if (
      variant_attributes &&
      Array.isArray(variant_attributes) &&
      variant_attributes.length
    ) {
      text = `${inventoryCount} in stock for ${variants.length} variant`;
    } else {
      text = `${inventoryCount} in stock`;
    }
    return text;
  };

  function trimTitle(title = "") {
    return title.length > 29 ? `${title.substring(0, 25)}...` : title;
  }

  const checkItemId = (edited, connectedAccountData) => {
    let arr = [];
    if (!isUndefined(edited)) {
      if (!isUndefined(edited.variation)) {
        if (!isUndefined(edited.variation[0].shops)) {
          for (let [key, value] of Object.entries(edited.variation[0].shops)) {
            connectedAccountData.map((acc) => {
              if (acc.id.toString() === key) {
                arr.push({
                  ItemId: value.ItemId,
                  SiteId: acc.warehouses[0].site_id,
                });
              }
            });
          }
          return [true, arr];
        } else return [false, arr];
      } else return [false, arr];
    } else return [false, arr];
  };

  const hitGetProductsAPI = async () => {
    setGridLoader(true);
    let postData = {
      productOnly: true,
      count: pageSize,
      activePage: activePage,
      grid: true,
      ...filtersToPass,
    };
    let {
      success: productsDataSuccess,
      data: productsData,
      message,
      code,
    } = await getProducts(getProductsURL, postData);
    let { success: totalProductsCountSuccess, data: totalProductsCountData } =
      await getProductsCount(getProductsCountURL, postData);
    if (totalProductsCountSuccess) {
      let { count } = totalProductsCountData;
      setTotalProductsCount(count);
    }
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      msg,
    } = await getConnectedAccounts();

    if (accountConnectedSuccess) {
      if (productsDataSuccess) {
        let { rows } = productsData;
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
            // description,
            source_product_id,
            edited,
          } = row;
          // let editedData = getEditedData(edited);
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
          tempObject["productType"] = (
            // <Paragraph>{capitalizeFirstLetterofWords(product_type)}</Paragraph>
            <Stack vertical spacing="extraTight" distribution="center">
              <Text copyable={product_type && true}>{product_type}</Text>
              {/* {editedData?.producttype && (
                      <Text>
                        <Stack
                          spacing="extraTight"
                          alignment="center"
                          distribution="center"
                        >
                          <>{editedData?.producttype}</>
                          <Tag>edited</Tag>
                        </Stack>
                      </Text>
                    )} */}
            </Stack>
          );
          tempObject["vendor"] = (
            // <Paragraph>{capitalizeFirstLetterofWords(brand)}</Paragraph>
            <Stack vertical spacing="extraTight" distribution="center">
              <Text copyable={brand && true}>{brand}</Text>
              {/* {editedData?.brand && (
                      <Text>
                        <Stack
                          spacing="extraTight"
                          alignment="center"
                          distribution="center"
                        >
                          <>{editedData?.brand}</>
                          <Tag>edited</Tag>
                        </Stack>
                      </Text>
                    )} */}
            </Stack>
          );
          tempObject["profile"] = (
            <center>
              <Paragraph copyable={profile_name && true}>
                {/* {profile && capitalizeFirstLetterofWords(profile[Object.keys(profile)[0]])} */}
                {/* {profile && profile[Object.keys(profile)[0]]} */}
                {profile_name}
              </Paragraph>
            </center>
          );
          tempObject["variantAttributes"] = (
            <center>
              <Paragraph>
                {variant_attributes
                  // .map((attibute) => capitalizeFirstLetterofWords(attibute))
                  .map((attibute) => attibute)
                  .join(", ")}
              </Paragraph>
            </center>
          );
          tempObject["variantsCount"] = (
            <center>
              <Paragraph>
                {getVariantsCountDetails(variants, variant_attributes)}
              </Paragraph>
            </center>
          );
          // tempObject["description"] = <Paragraph>{description.replace(/<[^>]*>/g,"")}</Paragraph>;
          tempObject["variantsData"] = variants;
          tempObject["container_id"] = container_id;
          // let res = checkItemId(edited, connectedAccountData);
          // tempObject["status"] = !res[0] ? (
          //   <div style={{ marginLeft: "70px" }}> - </div>
          // ) : (
          //   <Dropdown
          //     key="bulkAction"
          //     overlay={StatusMenu(res[1])}
          //     trigger={["click"]}
          //   >
          //     <div style={{ marginLeft: "40px", cursor: "pointer" }}>
          //       <Badge size="small" status="info">
          //         View Status
          //         <Icon source={DropdownMinor} />
          //       </Badge>
          //     </div>
          //   </Dropdown>
          // );
          return tempObject;
        });
        setProductData(tempProductData);
      } else {
        notify.error(message);
        if (code === "invalid_token" || code === "token_expired") {
          redirect("/auth/login");
        }
      }
      setGridLoader(false);
    } else {
      notify.error(message);
      if (code === "invalid_token" || code === "token_expired") {
        redirect("/auth/login");
      }
    }
  };
  const redirect = (url) => {
    props.history.push(url);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  const massMenu = (
    <Menu
    // onClick={(e) => console.log("selectedRows", selectedRows, e)}
    >
      <Menu.ItemGroup key="g3" title="eBay Actions">
        <Menu.Item
          key="Upload and Revise (All Products)"
          onClick={async () => {
            let postData = [];
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.push(source_product_id);
            });

            let { success, data } = await postActionOnProductById(
              uploadProductByIdURL,
              { product_id: postData, action: "upload_and_revise" }
            );
          }}
        >
          <UploadOutlined /> Upload and Revise on eBay1
        </Menu.Item>
        <Menu.Item
          key="Disable Product"
          onClick={async () => {
            let postData = [];
            selectedRows.forEach((selectedRow) => {
              let { container_id } = selectedRow;
              postData.push(container_id);
            });

            let { success, data, message } = await postActionOnProductById(
              disableItemURL,
              { product_id: postData, status: "Disable" }
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Disable Product
        </Menu.Item>
        <Menu.Item
          key="Relist Item"
          onClick={async () => {
            let postData = [];
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.push(source_product_id);
            });

            let { success, data, message } = await postActionOnProductById(
              relistItemURL,
              { product_id: postData }
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Relist Item
        </Menu.Item>

        <Menu.Item
          key="End from eBay"
          onClick={async () => {
            let postData = [];
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.push(source_product_id);
            });

            let { success, data, message } = await postActionOnProductById(
              deleteItemURL,
              { product_id: postData }
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> End from eBay
        </Menu.Item>
        <Menu.Item
          key="Match from eBay"
          onClick={async () => {
            let postData = [];
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.push(source_product_id);
            });

            let { success, data, message } = await postActionOnProductById(
              matchFromEbayURL,
              { product_id: postData }
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Match from eBay
        </Menu.Item>
        <Menu.Item
          key="Sync Inventory eBay"
          onClick={async () => {
            let postData = {
              product_id: [],
              sync: ["inventory"],
              action: "app_to_marketplace",
            };
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.product_id.push(source_product_id);
            });
            let { success, data, message } = await postActionOnProductById(
              syncInventoryPrice,
              postData
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Inventory
        </Menu.Item>
        <Menu.Item
          key="Sync Price eBay"
          onClick={async () => {
            let postData = {
              product_id: [],
              sync: ["price"],
              action: "app_to_marketplace",
            };
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.product_id.push(source_product_id);
            });
            let { success, data, message } = await postActionOnProductById(
              syncInventoryPrice,
              postData
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Price
        </Menu.Item>
        <Menu.Item key="Sync Images">
          <SyncOutlined /> Sync Images
        </Menu.Item>
        {/* <Menu.Item key="Export Details CSV">
            <UploadOutlined /> Export Details CSV
          </Menu.Item> */}
        <Menu.Item
          key="Upload Products"
          onClick={async () => {
            let postData = [];
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.push(source_product_id);
            });

            let { success, data } = await postActionOnProductById(
              uploadProductByIdURL,
              { product_id: postData, action: "upload" }
            );
          }}
        >
          <UploadOutlined /> Upload Products
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup key="g2" title="Shopify Actions">
        <Menu.Item
          key="Sync Details"
          onClick={async () => {
            let postData = [];
            selectedRows.forEach((selectedRow) => {
              let { source_product_id, container_id } = selectedRow;
              postData.push(container_id);
            });
            let { success, message } = await postActionOnProductById(
              syncProductDetails,
              {
                product_id: postData,
              }
            );
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Details
        </Menu.Item>
        <Menu.Item
          key="Sync Inventory eBay"
          onClick={async () => {
            let postData = {
              product_id: [],
              sync: ["inventory"],
              action: "shopify_to_app",
            };
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.product_id.push(source_product_id);
            });
            let { success, data, message } = await postActionOnProductById(
              syncInventoryPrice,
              postData
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Inventory
        </Menu.Item>
        <Menu.Item
          key="Sync Price eBay"
          onClick={async () => {
            let postData = {
              product_id: [],
              sync: ["price"],
              action: "shopify_to_app",
            };
            selectedRows.forEach((selectedRow) => {
              let { source_product_id } = selectedRow;
              postData.product_id.push(source_product_id);
            });
            let { success, data, message } = await postActionOnProductById(
              syncInventoryPrice,
              postData
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Price
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  function StatusMenu(arr) {
    let objArr = [];
    arr.map((val) => {
      let id = parseInt(val.SiteId);
      objArr.push({
        content: (
          <Stack>
            <Image
              preview={false}
              width={25}
              src={require(`../../../../../assets/flags/${id}.png`)}
              style={{ borderRadius: "50%" }}
            />
            <Link removeUnderline>{val.ItemId}</Link>
          </Stack>
        ),
      });
    });
    return (
      <Menu>
        <ActionList actionRole="menuitem" items={objArr} />
      </Menu>
    );
  }

  const bulkMenu = (
    <Menu>
      <Menu.ItemGroup key="g3" title="eBay Actions">
        <Menu.Item
          key="Match from eBay"
          onClick={async () => {
            let { success, data, message } = await getrequest(matchFromEbayURL);
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          <UploadOutlined /> Match from eBay
        </Menu.Item>
        <Menu.Item
          key="Upload and Revise (All Products)"
          onClick={async () => {
            let { success, data, message } = await postActionOnProductById(
              // bulkUploadProduct,
              uploadProductByIdURL,
              { action: "upload_and_revise" }
            );
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          <UploadOutlined /> Upload and Revise (All Products)
        </Menu.Item>
        <Menu.Item
          key="Sync Inventory eBay"
          onClick={async () => {
            let { success, data, message } = await postActionOnProductById(
              syncInventoryPrice,
              { sync: ["inventory"], action: "app_to_marketplace" }
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Inventory
        </Menu.Item>
        <Menu.Item
          key="Sync Price"
          onClick={async () => {
            let { success, data, message } = await postActionOnProductById(
              syncInventoryPrice,
              { sync: ["price"], action: "app_to_marketplace" }
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Price
        </Menu.Item>
        <Menu.Item
          key="Upload Products"
          onClick={async () => {
            let { success, data, message } = await postActionOnProductById(
              // bulkUploadProduct,
              uploadProductByIdURL,
              { action: "upload" }
            );
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          <UploadOutlined /> Upload Products
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup key="g1" title="CSV Actions">
        <Menu.Item key="Export">
          <UploadOutlined /> Export
        </Menu.Item>
        <Menu.Item key="Bulk Update">
          <DownloadOutlined /> Bulk Update
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup key="g2" title="Shopify Actions">
        <Menu.Item
          key="Import Products"
          onClick={async () => {
            let { success, message } = await getrequest(importProductURL);
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          <DownloadOutlined /> Import Products
        </Menu.Item>
        <Menu.Item
          key="Sync Inventory Shopify"
          onClick={async () => {
            let { success, data, message } = await postActionOnProductById(
              syncInventoryPrice,
              { sync: ["inventory"], action: "shopify_to_app" }
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Inventory
        </Menu.Item>
        <Menu.Item
          key="Sync Price Shopify"
          onClick={async () => {
            let { success, data, message } = await postActionOnProductById(
              syncInventoryPrice,
              { sync: ["price"], action: "shopify_to_app" }
            );
            if (success) {
              notify.success(data);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Price
        </Menu.Item>
        <Menu.Item
          key="Sync Details"
          onClick={async () => {
            let { success, message } = await getrequest(syncProductDetails);
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          <SyncOutlined /> Sync Details
        </Menu.Item>
        <Menu.Item
          key="Import Collection Products"
          onClick={async () => {
            let { success, data, message } = await getrequest(
              importCollectionProductURL
            );
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          <DownloadOutlined /> Import Collection Products
        </Menu.Item>
        <Menu.Item
          key="Import metafileds of products"
          onClick={async () => {
            let { success, data, message } = await getrequest(
              importMetaFieldURL
            );
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
          }}
        >
          <DownloadOutlined /> Import metafileds of products
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
    </Menu>
  );

  const { TabPane } = Tabs;

  const viewColumnsHandler = () => {
    setViewColumnsModal(!viewColumnsModal);
  };

  const gatherAllFilters = () => {
    let temp = {};
    Object.keys(filters).forEach((filter) => {
      if (filters[filter]["value"]) {
        temp[`filter[${filter}][${filters[filter]["operator"]}]`] =
          filters[filter]["value"];
      }
    });
    setFiltersToPass({ ...filtersToPass, ...temp });
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

  const getFieldValue = (field) => {
    return filtersFields.find((option) => option["value"] === field)["label"];
  };

  // const tagMarkup = () => {
  //   return Object.keys(filtersToPass).map((filter, index) => {
  //     let indexOfFirstOpeningBracket = filter.indexOf("[");
  //     let indexOfFirstClosingBracket = filter.indexOf("]");
  //     let indexOfSecondOpeningBracket = filter.indexOf(
  //       "[",
  //       indexOfFirstOpeningBracket + 1
  //     );
  //     let indexOfSecondClosingBracket = filter.indexOf(
  //       "]",
  //       indexOfFirstClosingBracket + 1
  //     );
  //     let fieldValue = filter.substring(
  //       indexOfFirstOpeningBracket + 1,
  //       indexOfFirstClosingBracket
  //     );
  //     let operatorValue = filter.substring(
  //       indexOfSecondOpeningBracket + 1,
  //       indexOfSecondClosingBracket
  //     );
  //     return (
  //       <Tag
  //         key={filter}
  //         onRemove={() => {
  //           const temp = Object.keys(filtersToPass).reduce((object, key) => {
  //             if (key !== filter) {
  //               object[key] = filtersToPass[key];
  //             }
  //             return object;
  //           }, {});
  //           let tempObj = { ...filters };
  //           Object.keys(tempObj).forEach((object) => {
  //             if (object === fieldValue) {
  //               tempObj[object]["value"] = "";
  //             }
  //           });
  //           setFilters(tempObj);
  //           setFiltersToPass(temp);
  //         }}
  //       >
  //         {getFieldValue(fieldValue)} {getOperatorLabel(operatorValue)}{" "}
  //         {filtersToPass[filter]}
  //       </Tag>
  //     );
  //   });
  // };

  const renderTitleOrSKU = () => {
    let type = "";
    if (searchWithTitle) {
      type = "filter[title][3]";
    } else {
      type = "filter[sku][3]";
    }
    return (
      <TextField
        value={filterTitleORsku}
        onChange={(e) => {
          let titleFilterObj = {};
          titleFilterObj[type] = e;
          setFiltersToPass({ ...filtersToPass, ...titleFilterObj });
          setFilterTitleORsku(e);
        }}
        placeholder={searchWithTitle ? "Search with title" : "Search with SKU"}
      />
    );
  };
  const renderChoiceListForTitleSKU = () => (
    <ButtonGroup segmented>
      <ShopifyButton
        primary={searchWithTitle}
        pressed={searchWithTitle}
        onClick={(e) => {
          setFilterTitleORsku("");
          setSearchWithTitle(true);
        }}
      >
        Title
      </ShopifyButton>
      <ShopifyButton
        primary={!searchWithTitle}
        pressed={!searchWithTitle}
        onClick={(e) => {
          setFilterTitleORsku("");
          setSearchWithTitle(false);
        }}
      >
        SKU
      </ShopifyButton>
    </ButtonGroup>
  );
  const popOverHandler = (type) => {
    let temp = { ...popOverStatus };
    temp[type] = !popOverStatus[type];
    setPopOverStatus(temp);
  };
  const profileActivator = (
    <ShopifyButton disclosure onClick={() => popOverHandler("profile")}>
      Profile
    </ShopifyButton>
  );
  const productTypeActivator = (
    <ShopifyButton disclosure onClick={() => popOverHandler("productType")}>
      Porduct Type
    </ShopifyButton>
  );
  const vendorActivator = (
    <ShopifyButton disclosure onClick={() => popOverHandler("vendor")}>
      Vendor
    </ShopifyButton>
  );
  const renderOtherFilters = () => {
    return (
      <ButtonGroup segmented>
        <Popover
          active={popOverStatus["profile"]}
          activator={profileActivator}
          onClose={() => popOverHandler("profile")}
        >
          <div style={{ margin: "10px" }}>
            <ChoiceList
              choices={profileList}
              selected={selected["profile"]}
              onChange={(value) => handleChange(value, "profile")}
            />
          </div>
        </Popover>
        <Popover
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
        </Popover>
        <Popover
          active={popOverStatus["vendor"]}
          activator={vendorActivator}
          onClose={() => popOverHandler("vendor")}
        >
          <div style={{ margin: "10px" }}>
            <ChoiceList
              choices={vendorList}
              selected={selected["vendor"]}
              onChange={(value) => handleChange(value, "vendor")}
            />
          </div>
        </Popover>
        <ShopifyButton
          icon={<FilterOutlined />}
          onClick={() => {
            setFiltersDrawerVisible(true);
          }}
        >
          More Filters
        </ShopifyButton>
      </ButtonGroup>
    );
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Products"
      ghost={true}
      extra={[
        <Button
          type="primary"
          onClick={async () => {
            let data = {};
            let response = await testController(data);
          }}
          key={"test"}
        >
          Test
        </Button>,
        <Dropdown
          key="massAction"
          overlay={massMenu}
          trigger={["click"]}
          disabled={selectedRows.length > 0 ? false : true}
        >
          <Button>
            <div>
              {selectedRows.length
                ? `${selectedRows.length} Selected for: Mass Actions`
                : "Mass Actions"}{" "}
              <DownOutlined />
            </div>
          </Button>
        </Dropdown>,
        <Dropdown key="bulkAction" overlay={bulkMenu} trigger={["click"]}>
          <Button>
            <div>
              Bulk Actions <DownOutlined />
            </div>
          </Button>
        </Dropdown>,
      ]}
    >
      <Card sectioned>
        {/* <Tabs
              defaultActiveKey="1"
              onChange={() => {}}
              animated={true}
              type="line"
            > */}
        {/* {productGridTabs.map((productGridTab) => {
                return ( */}
        {/* // <TabPane tab={productGridTab} key={productGridTab}> */}
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
          {/* <Col className="gutter-row" span={6}>
                <Stack distribution="trailing" vertical={false}>
                  <AntBadge count={Object.keys(filtersToPass).length}>
                    <Button
                      type="primary"
                      // primary
                      icon={<FilterOutlined />}
                      size={"middle"}
                      style={{ marginBottom: 5 }}
                      onClick={() => {
                        setFiltersDrawerVisible(true);
                      }}
                    >
                      Filters
                    </Button>
                  </AntBadge>
                </Stack>
              </Col> */}
        </Row>
        <Stack alignment="center">
          <Stack.Item fill>{renderTitleOrSKU()}</Stack.Item>
          <Stack.Item>{renderChoiceListForTitleSKU()}</Stack.Item>
          <Stack.Item>{renderOtherFilters()}</Stack.Item>
          {/* <Stack.Item>
                <AntBadge count={Object.keys(filtersToPass).length}>
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    size={"middle"}
                    onClick={() => {
                      setFiltersDrawerVisible(true);
                    }}
                    style={{ borderRadius: 3 }}
                  >
                    More Filters
                  </Button>
                </AntBadge>
              </Stack.Item> */}
        </Stack>
        <Stack spacing="tight">
          {/* {Object.keys(filtersToPass).length > 0 && tagMarkup()} */}
        </Stack>
        <br />
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
          scroll={{ x: 1500 }}
          // bordered={true}
          expandable={{
            expandedRowRender: (record, index, indent, expanded) => {
              let dataToDisplay = getDataForPreviewComponent(record);
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
                    // Preview: (
                    //   <PreviewProductDataComponent
                    //     dataToDisplay={dataToDisplay}
                    //   />
                    // ),
                  }}
                />
              );
            },
            // expandIcon: ({ expanded, onExpand, record }) =>
            //   expanded ? (
            //     <MinusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            //   ) : (
            //     <PlusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            //   ),
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretUpOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
              ),
          }}
        />
        {/* // </TabPane> */}
        {/* );
              })} */}
        {/* </Tabs> */}
      </Card>
      {viewColumnsModal && (
        <ModalComponent
          isModalVisible={viewColumnsModal}
          title={"Columns"}
          handleCancel={() => setViewColumnsModal(false)}
          footer={null}
          modalContent={
            // <></>
            <CheckboxComponent
              defaultChecked={defaultChecked}
              setDefaultChecked={setDefaultChecked}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              productGridHeadings={productGridHeadings}
              productColumns={productColumns}
              setProductColumns={setProductColumns}
            />
          }
        />
      )}
      <NewFilterComponentSimilarPolaris
        setFiltersDrawerVisible={setFiltersDrawerVisible}
        filtersDrawerVisible={filtersDrawerVisible}
        filters={filters}
        // operatorOptions={operatorOptions}
        stringOperatorOptions={stringOperatorOptions}
        numberOperatorOptions={numberOperatorOptions}
        setFilters={setFilters}
        gatherAllFilters={gatherAllFilters}
      />
    </PageHeader>
  );
}

export default FinalProductGrid;

export const CheckboxComponent = ({
  checkedList,
  setCheckedList,
  productGridHeadings,
  productColumns,
}) => {
  return (
    <Row>
      {" "}
      {productGridHeadings.map((heading, index) => {
        return (
          <Col key={index}>
            <Checkbox
              checked={productColumns.some(
                (column) => column["title"] === heading["title"]
              )}
              disabled={["Title", "Image"].includes(
                heading["title"].props.children
              )}
              defaultChecked={["Title", "Image", "Variant Count"].includes(
                heading["title"]
              )}
              onChange={(e) => {
                if (e.target.checked) {
                  setCheckedList([...checkedList, heading]);
                } else if (!e.target.checked) {
                  setCheckedList(
                    checkedList.filter(
                      (checked) => checked["title"] !== heading["title"]
                    )
                  );
                }
              }}
            >
              {heading["title"]}
            </Checkbox>
          </Col>
        );
      })}
    </Row>
  );
};
