import { Page } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import { configurationAPI } from "../../../../../APIrequests/ConfigurationAPI";
import { getAppSettingsURL } from "../../../../../URLs/ConfigurationURL";
import { notify } from "../../../../../services/notify";
import FinalImportSettings from "./Components/ImportSettingsNew/FinalImportSettings";
import FinalOrderSettings from "./Components/OrderSettingsNew/FinalOrderSettings";
import FinalProductSettings from "./Components/ProductSettingsNew/FinalProductSettings";
import FinalOrderSettingsNew from "./Components/OrderSettingsNew/FinalOrderSettingsNew";
import FinalProductSettingsNewNew from "./Components/ProductSettingsNewNew/components/FinalProductSettingsNewNew";
import { Col, Row } from "antd";
import { tokenExpireValues } from "../../../../../HelperVariables";
import { withRouter } from "react-router-dom";

const configurationTabs = [
  "Product Settings",
  "Order Settings",
  "Product Import Settings",
  // "Product Settings Prev",
  // "Order Settings Prev",
  // "Import Settings Prev",
  // "Default Profile",
  // "App Settings",
  // "Global Configuration",
  // "Webhook Settings",
];

const Configuration = (props) => {
  const [importSettingsFromSavedAPIData, setImportSettingsFromSavedAPIData] =
    useState({});

  // order settings
  const [orderSettingsFromSavedAPIData, setOrderSettingsFromSavedAPIData] =
    useState({});
// pickup this api
  const getSavedData = async () => {
    // debugger
    let { data, success, message, code } = await configurationAPI(
      getAppSettingsURL
    );
    console.log(data)
    if (success) {
      if (data?.data?.import_settings) {
        setImportSettingsFromSavedAPIData(data.data.import_settings);
      }
      let temp = { ...orderSettingsFromSavedAPIData };
      if (data?.data?.order_settings) {
        temp["default"] = data?.data?.order_settings;
      }
      if (data?.marketplace?.ebay?.shop) {
        for (const account in data.marketplace.ebay.shop) {
          if (data.marketplace.ebay.shop[account].data.order_settings) {
            temp[account] =
              data.marketplace.ebay.shop[account].data.order_settings;
          }
        }
      }
      setOrderSettingsFromSavedAPIData(temp);
    } else {
      notify.error(message);
      if (tokenExpireValues.includes(code)) redirect("/auth/login");
    }
  };

  const redirect = (url) => props.history.push(url);

  useEffect(() => {
    document.title = "Configuration | Integration for eBay";
    document.description = "Configuration";
    if(!document.title.includes(localStorage.getItem('shop_url'))) {
      document.title += localStorage.getItem('shop_url') ? " " + localStorage.getItem('shop_url') : "";
    }
    getSavedData();
  }, []);

  const getTabContent = () => {
    let content = {};
    configurationTabs.forEach((tabName) => {
      switch (tabName) {
        case "Product Settings":
          content[tabName] = <FinalProductSettingsNewNew />;
          // <FinalProductSettings />;
          break;
        // case "App Settings":
        //   content[tabName] = <AppSettings />;
        //   break;
        case "Product Import Settings":
          content[tabName] = (
            <FinalImportSettings
              importSettingsFromSavedAPIData={importSettingsFromSavedAPIData}
            />
          );
          break;
        // case "Import Settings Prev":
        //   content[tabName] = <ImportSettingsBckp />;
        //   break;
        // case "Global Configuration":
        //   content[tabName] = <GlobalConfiguration />;
        //   break;
        case "Order Settings":
          content[tabName] = (
            // <FinalOrderSettings
            //   orderSettingsFromSavedAPIData={orderSettingsFromSavedAPIData}
            // />
            <FinalOrderSettingsNew
              orderSettingsFromSavedAPIData={orderSettingsFromSavedAPIData}
            />
          );
          break;
        // case "Webhook Settings":
        //   content[tabName] = <WebhookSettings />;
        //   break;
        default:
          break;
      }
    });
    return content;
  };

  return (
    <Row justify="center" className="site-page-header-responsive">
      <Col xs={22} md={24} lg={24} xl={24} xxl={24}>
        <Page fullWidth title="Configuration">
          <TabsComponent totalTabs={6} tabContents={getTabContent()} />
        </Page>
      </Col>
    </Row>
  );
};

export default withRouter(Configuration);
