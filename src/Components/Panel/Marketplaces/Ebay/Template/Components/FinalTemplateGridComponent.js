import {
  Alert,
  Divider,
  Image,
  List,
  PageHeader,
  Select,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getTemplates } from "../../../../../../APIrequests/TemplatesAPI";
import { json } from "../../../../../../globalConstant/static-json";
import { getTemplatesURL } from "../../../../../../URLs/TemplateURLS";
import { addTemplatesOptions } from "../Helper/TemplateHelper";
import { notify } from "../../../../../../services/notify";
import {
  Badge,
  Banner,
  Button,
  Card,
  FooterHelp,
  Link,
  Modal,
  Select as PolarisSelect,
  Stack,
  Tabs,
} from "@shopify/polaris";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { getCountryName } from "../../../../Accounts/NewAccount";
import CategoryTemplateGrid from "./TemplateGridsComponent/CategoryTemplateGrid";
import InventoryTemplateGrid from "./TemplateGridsComponent/InventoryTemplateGrid";
import PriceTemplateGrid from "./TemplateGridsComponent/PriceTemplateGrid";
import TitleTemplateGrid from "./TemplateGridsComponent/TitleTemplateGrid";
import { withRouter } from "react-router-dom";
// import ModalVideo from "react-modal-video";
import TabsComponent from "../../../../../AntDesignComponents/TabsComponent";
import { gifTemplates } from "../../Help/gifHelper";
import { tokenExpireValues } from "../../../../../../HelperVariables";

const { Option } = Select;
const { Text } = Typography;

export const getCountyrName = (siteId) => {
  let countryName = json.flag_country.filter((sites) => sites.value === siteId);
  if (countryName.length) {
    return (
      <Image
        preview={false}
        width={25}
        src={siteId && require(`../../../../../../assets/flags/${siteId}.png`)}
        style={{ borderRadius: "50%" }}
      />
    );
  }
  return "-";
};
const tabs = [
  {
    id: "Category",
    content: "Category",
    accessibilityLabel: "Category",
    panelID: "Category",
  },
  {
    id: "Inventory",
    content: "Inventory",
    panelID: "Inventory",
  },
  {
    id: "Price",
    content: "Price",
    panelID: "Price",
  },
  {
    id: "Title",
    content: "Title",
    panelID: "Title",
  },
];

const FinalTemplateGridComponent = (props) => {
  const [tabsData, setTabsData] = useState(tabs);
  const [categoryTemplateCount, setCategoryTemplateCount] = useState(null);
  const [inventoryTemplateCount, setInventoryTemplateCount] = useState(null);
  const [priceTemplateCount, setPriceTemplateCount] = useState(null);
  const [titleTemplateCount, setTitleTemplateCount] = useState(null);
  const [selectedTabId, setSelectedTabId] = useState(0);
  const [addTemplateValue, setAddTemplateValue] = useState(null);
  const [accountSelectionModal, setaccountSelectionModal] = useState({
    active: false,
    siteID: "",
    accountName: "",
    options: [],
    shopID: "",
  });

  // ebay accounts
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
  // modal video
  const [isOpenModalVideo, setIsOpenModalVideo] = useState(false);
  // gif modal
  const [isOpenGifModal, setIsOpenGifModal] = useState({
    active: false,
    title: "",
    url: "",
  });

  useEffect(() => {
    if (categoryTemplateCount !== null) {
      let temp = [...tabsData];
      temp[0]["content"] = `Category (${categoryTemplateCount})`;
      setTabsData(temp);
    }
  }, [categoryTemplateCount]);
  useEffect(() => {
    if (inventoryTemplateCount !== null) {
      let temp = [...tabsData];
      temp[1]["content"] = `Inventory (${inventoryTemplateCount})`;
      setTabsData(temp);
    }
  }, [inventoryTemplateCount]);
  useEffect(() => {
    if (priceTemplateCount !== null) {
      let temp = [...tabsData];
      temp[2]["content"] = `Price (${priceTemplateCount})`;
      setTabsData(temp);
    }
  }, [priceTemplateCount]);
  useEffect(() => {
    if (titleTemplateCount !== null) {
      let temp = [...tabsData];
      temp[3]["content"] = `Title (${titleTemplateCount})`;
      setTabsData(temp);
    }
  }, [titleTemplateCount]);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTabId(selectedTabIndex),
    []
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
  const getTabContent = () => {
    switch (selectedTabId) {
      case 0:
        return (
          <CategoryTemplateGrid
            cbFuncCategory={cbFuncCategory}
            checkValueHandler={checkValueHandler}
          />
        );
      case 1:
        return (
          <InventoryTemplateGrid
            cbFuncInventory={cbFuncInventory}
            checkValueHandler={checkValueHandler}
          />
        );
      case 2:
        return (
          <PriceTemplateGrid
            cbFuncPrice={cbFuncPrice}
            checkValueHandler={checkValueHandler}
          />
        );
      case 3:
        return (
          <TitleTemplateGrid
            cbFuncTitle={cbFuncTitle}
            checkValueHandler={checkValueHandler}
          />
        );
      default:
        break;
    }
  };

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
      code,
    } = await getConnectedAccounts();
    let ebayAccountsObj = [];
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      ebayAccounts.forEach((account, key) => {
        let temp = {};
        temp["value"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["label"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["status"] = account["warehouses"][0]["status"];
        temp["shopID"] = account["id"];
        temp["disabled"] =
          account["warehouses"][0]["status"] === "inactive" ? true : false;
        ebayAccountsObj.push(temp);
      });
      setconnectedAccountsArray(ebayAccountsObj);
      setaccountSelectionModal({
        ...accountSelectionModal,
        options: ebayAccountsObj,
        siteID: "",
        accountName: "",
        shopID: "",
        status: "",
      });
    } else {
      notify.error(message);
      if (tokenExpireValues.includes(code)) props.history.push("/auth/login");
    }
  };
  const cbFuncCategory = () => {
    getCategoryTemplateCount();
  };
  const cbFuncInventory = () => {
    getInventoryTemplateCount();
  };
  const cbFuncPrice = () => {
    getPriceTemplateCount();
  };
  const cbFuncTitle = () => {
    getTitleTemplateCount();
  };
  const getCategoryTemplateCount = async () => {
    const postData = {
      "filter[type][1]": "category",
      count: 10,
      activePage: 1,
    };
    const {
      success,
      data: fetchedTemplatesArray,
      message,
      count,
    } = await getTemplates(getTemplatesURL, postData);
    if (success) {
      setCategoryTemplateCount(count?.[0]?.count ? count?.[0]?.count : 0);
    }
  };
  const getInventoryTemplateCount = async () => {
    const postData = {
      "filter[type][1]": "inventory",
      count: 10,
      activePage: 1,
    };
    const {
      success,
      data: fetchedTemplatesArray,
      message,
      count,
    } = await getTemplates(getTemplatesURL, postData);
    if (success) {
      setInventoryTemplateCount(count?.[0]?.count ? count?.[0]?.count : 0);
    }
  };
  const getPriceTemplateCount = async () => {
    const postData = {
      "filter[type][1]": "price",
      count: 10,
      activePage: 1,
    };
    const {
      success,
      data: fetchedTemplatesArray,
      message,
      count,
    } = await getTemplates(getTemplatesURL, postData);
    if (success) {
      setPriceTemplateCount(count?.[0]?.count ? count?.[0]?.count : 0);
    }
  };
  const getTitleTemplateCount = async () => {
    const postData = {
      "filter[type][1]": "title",
      count: 10,
      activePage: 1,
    };
    const {
      success,
      data: fetchedTemplatesArray,
      message,
      count,
    } = await getTemplates(getTemplatesURL, postData);
    if (success) {
      setTitleTemplateCount(count?.[0]?.count ? count?.[0]?.count : 0);
    }
  };
  useEffect(() => {
    getAllConnectedAccounts();
    getCategoryTemplateCount();
    getInventoryTemplateCount();
    getPriceTemplateCount();
    getTitleTemplateCount();
  }, []);
  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Templates"
      subTitle={
        <div
          onClick={() => setIsOpenModalVideo(true)}
          style={{ cursor: "pointer" }}
        >
          <Badge status="info">Need Help?</Badge>
        </div>
      }
      // subTitle="Manage templates for choosing eBay category and customise your products details like price, inventory, title, description etc."
      ghost={true}
      extra={[
        <Select
          key="addTemplates"
          value={addTemplateValue}
          placeholder={<Text strong>Add Templates</Text>}
          onChange={(selectedTemplateValue) => {
            if (selectedTemplateValue === "category") {
              if (connectedAccountsArray.length === 1) {
                const { siteID, shopID } = connectedAccountsArray[0];
                props.history.push(
                  `/panel/ebay/templates/handler?type=category&siteID=${siteID}&shopID=${shopID}`
                );
              } else {
                setaccountSelectionModal({
                  ...accountSelectionModal,
                  active: true,
                });
              }
            } else {
              props.history.push(
                `/panel/ebay/templates/handler?type=${selectedTemplateValue}`
              );
            }
          }}
        >
          {addTemplatesOptions.map((option) => (
            <Option key={option["value"]} value={option["value"]}>
              {option["label"]}
            </Option>
          ))}
        </Select>,
      ]}
    >
      <Alert
        style={{ borderRadius: "7px" }}
        message={
          <>
            Manage templates for choosing eBay category and customise your
            products details like price, inventory, title, description etc.
          </>
        }
        type="info"
        showIcon
      />
      <br />
      <Card>
        <Tabs
          tabs={tabsData}
          selected={selectedTabId}
          onSelect={handleTabChange}
        >
          {getTabContent()}
        </Tabs>
      </Card>
      <Modal
        open={accountSelectionModal.active}
        onClose={() =>
          setaccountSelectionModal({ ...accountSelectionModal, active: false })
        }
        title="Select account for category template"
        // primaryAction={{
        //   content: "Add",
        //   disabled:
        //     !accountSelectionModal.siteID && !accountSelectionModal.shopID,
        //   onAction: () => {
        //     props.history.push(
        //       `/panel/ebay/templates/handler?type=category&siteID=${accountSelectionModal.siteID}&shopID=${accountSelectionModal.shopID}`
        //     );
        //   },
        // }}
      >
        <Modal.Section>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: "10px" }}>
              {getCountyrName(accountSelectionModal.siteID) !== "-" &&
                getCountyrName(accountSelectionModal.siteID)}
            </div>
            <div style={{ minWidth: "50%" }}>
              <PolarisSelect
                options={accountSelectionModal.options}
                value={accountSelectionModal.accountName}
                placeholder="Please Select..."
                onChange={(e) => {
                  let temp = accountSelectionModal.options.filter(
                    (account) => account["value"] === e
                  );
                  setaccountSelectionModal({
                    ...accountSelectionModal,
                    accountName: temp[0]?.value,
                    siteID: temp[0]?.siteID,
                    shopID: temp[0]?.shopID,
                  });
                }}
              />
            </div>
          </div>
          <br />
          <Stack distribution="center">
            <Button
              primary
              disabled={
                !accountSelectionModal.siteID && !accountSelectionModal.shopID
              }
              onClick={() => {
                props.history.push(
                  `/panel/ebay/templates/handler?type=category&siteID=${accountSelectionModal.siteID}&shopID=${accountSelectionModal.shopID}`
                );
              }}
            >
              Add Template
            </Button>
          </Stack>
        </Modal.Section>
      </Modal>
      <Modal
        open={isOpenModalVideo}
        onClose={() => setIsOpenModalVideo(false)}
        title="How Can I Help?"
      >
        <Modal.Section>
          {gifTemplates.map((gifTemplate, index) => {
            return (
              <>
                <Stack distribution="equalSpacing">
                  <>{gifTemplate.title}</>
                  <Button
                    plain
                    onClick={() => {
                      setIsOpenModalVideo(false);
                      setIsOpenGifModal({
                        active: true,
                        title: gifTemplate.title,
                        url: gifTemplate.url,
                      });
                    }}
                  >
                    Watch
                  </Button>
                </Stack>
                {index == gifTemplates.length - 1 ? <></> : <Divider />}
              </>
            );
          })}
          <Divider />
          <center>
            <Button primary onClick={() => setIsOpenModalVideo(false)}>
              Close
            </Button>
          </center>
        </Modal.Section>
      </Modal>
      <Modal
        open={isOpenGifModal.active}
        onClose={() =>
          setIsOpenGifModal({
            active: false,
            title: "",
          })
        }
        title={isOpenGifModal.title}
      >
        <Modal.Section>
          <img src={isOpenGifModal.url} style={{ width: "100%" }} />
          <Divider />
          <center>
            <Button
              primary
              onClick={() =>
                setIsOpenGifModal({
                  active: false,
                  title: "",
                })
              }
            >
              Close
            </Button>
          </center>
        </Modal.Section>
      </Modal>
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=templates-section-of-the-app"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=templates-section-of-the-app-2"
        >
          Templates
        </Link>
      </FooterHelp>
    </PageHeader>
  );
};

export default withRouter(FinalTemplateGridComponent);
