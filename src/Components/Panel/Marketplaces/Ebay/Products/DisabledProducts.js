import {
  ButtonGroup,
  Card,
  ChoiceList,
  Icon,
  Popover,
  Stack,
  Tag,
  TextField,
  Button,
  Modal,
} from "@shopify/polaris";
import { Col, Dropdown, Image, Menu, PageHeader, Row } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import React, { useCallback, useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import {
  getProducts,
  getProductsCount,
  postActionOnProductById,
} from "../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../services/notify";
import {
  disableItemURL,
  getProductsCountURL,
  getProductsURL,
} from "../../../../../URLs/ProductsURL";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import ActionPopover from "./ActionPopover";
import NoProductImage from "../../../../../assets/notfound.png";
import PaginationComponent from "../../../../AntDesignComponents/PaginationComponent";
import {
  DownloadOutlined,
  DownOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  filtersFields,
  getFitersInitially,
  numberOperatorOptions,
  stringOperatorOptions,
} from "./NewProductsNewFilters";
import { debounce } from "../Template/TemplateBody/CategoryTemplatePolarisNew";
import { FilterMajorMonotone } from "@shopify/polaris-icons";
import { getProfiles } from "../../../../../APIrequests/ProfilesAPI";
import { getProfilesURL } from "../../../../../URLs/ProfilesURL";
import { getImportAttribute } from "../../../../../Apirequest/registrationApi";
import { getCountyrName } from "../Template/Components/TemplateGridComponent";
import {
  getCountryAbbreviation,
  getCountryName,
} from "../Template/Components/TemplatesType/CategoryTemplateComponent";
import { withRouter } from "react-router-dom";
import NewFilterComponentSimilarPolaris from "./NewFilterComponentSimilarPolaris";

const DisabledProducts = (props) => {
  const [gridLoader, setGridLoader] = useState(false);
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
    },
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
            <ActionPopover record={record} actionContent={["Enable"]} />
          </Stack>
        );
      },
    },
  ]);
  const [productData, setProductData] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const [activePage, setActivePage] = useState(1);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  const [pageSize, setPageSize] = useState(25);

  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

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
    { label: "Error", value: "Error" },
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

  function trimTitle(title = "") {
    return title.length > 29 ? `${title.substring(0, 25)}...` : title;
  }

  // action modal
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });
  const [btnLoader, setBtnLoader] = useState(false);

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
  const hitGetProductsAPI = async () => {
    setGridLoader(true);
    let postData = {
      productOnly: true,
      count: pageSize,
      activePage: activePage,
      grid: true,
      status: "disabled",
      ...filtersToPass,
    };
    let {
      success: productsDataSuccess,
      data: productsData,
      message,
      code,
    } = await getProducts(getProductsURL, postData);
    let { success: totalProductsCountSuccess, data: totalProductsCountData } =
      // await getProductsCount(getProductsCountURL, postData);
      await getProductsCount(getProductsCountURL, {
        productOnly: true,
        status: 'disabled',
        // ...filtersToPass
        ...filtersToPass,
      });
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
        if (Array.isArray(rows)) {
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
              quantity,
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
            tempObject["productType"] = (
              <Stack vertical spacing="extraTight" distribution="center">
                <Text copyable={product_type && true}>{product_type}</Text>
              </Stack>
            );
            tempObject["vendor"] = (
              <Stack vertical spacing="extraTight" distribution="center">
                <Text copyable={brand && true}>{brand}</Text>
              </Stack>
            );
            tempObject["profile"] = (
              <center>
                <Paragraph copyable={profile_name && true}>
                  {profile_name}
                </Paragraph>
              </center>
            );
            tempObject["variantAttributes"] = (
              <center>
                <Paragraph>
                  {variant_attributes.map((attibute) => attibute).join(", ")}
                </Paragraph>
              </center>
            );
            tempObject["variantsCount"] = (
              <center>
                <Paragraph>
                  {/* {getVariantsCountDetails(variants, variant_attributes)} */}
                  {quantity}
                </Paragraph>
              </center>
            );
            tempObject["variantsData"] = variants;
            tempObject["container_id"] = container_id;
            return tempObject;
          });
          setProductData(tempProductData);
        }
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

  useEffect(() => {
    hitGetProductsAPI();
  }, [activePage, pageSize, filtersToPass]);

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
      // setFiltersToPass({ ...filtersToPass, ...titleFilterObj });
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
    // setInnerFilterCount(Object.keys(temp).length);
    if (Object.keys(temp).length > 0) {
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Disabled Products"
      ghost={true}
      extra={[
        <Button
          onClick={() => {
            let postData = [];
            selectedRows.forEach((selectedRow) => {
              let { container_id } = selectedRow;
              postData.push(container_id);
            });
            setModal({
              ...modal,
              active: true,
              content: "Enable",
              actionName: postActionOnProductById,
              actionPayload: { product_id: postData, status: "Enable" },
              api: disableItemURL,
            });
          }}
          disabled={selectedRows.length == 0}
          // onClick={async () => {
          //   let postData = [];
          //   selectedRows.forEach((selectedRow) => {
          //     let { container_id } = selectedRow;
          //     postData.push(container_id);
          //   });
          //   let { success, message } = await postActionOnProductById(
          //     disableItemURL,
          //     { product_id: postData, status: "Enable" }
          //   );
          //   if (success) {
          //     notify.success(message);
          //     // hitGetProductsAPI();
          //     props.history.push("products");
          //   } else {
          //     notify.error(message);
          //   }
          // }}
        >
          Enable
        </Button>,
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
          scroll={{ x: 1500 }}
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
      <Modal
        open={modal.active}
        onClose={() => setModal({ ...modal, active: false })}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>
              Are you sure you want to initiate {modal.content} bulk action ?
            </p>
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
                    props.history.push("products");
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

export default withRouter(DisabledProducts);
