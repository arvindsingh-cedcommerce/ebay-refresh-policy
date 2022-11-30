import React, { Component } from "react";
import { Page } from "@shopify/polaris";
import { checkStepCompleted } from "../../Apirequest/registrationApi";
import { getDashboardData } from "../../APIrequests/DashboardAPI";
import { dashboardAnalyticsURL } from "../../URLs/DashboardURL";
import { getConnectedAccounts } from "../../Apirequest/accountsApi";
import { tokenExpireValues } from "../../HelperVariables";
import { notify } from "../../services/notify";
const welcomeScreen = require("./../../assets/Sell-on-ebay-marketplace-08.jpg");

class Welcome extends Component {
  redirect(url) {
    this.props.history.push(url);
  }

  componentDidMount() {
    this.getAllConnectedAccounts()
    setTimeout(() => {
      this.routetoUrl();
    }, 4000);
  }

  routetoUrl = async () => {
    let { success, data } = await checkStepCompleted();
    if (success) {
      if (data < 4) {
        this.redirect("/registrations");
      } else {
        // this.redirect("/panel/ebay/dashboard?refresh=true");
        this.props.history.push("/panel/ebay/dashboard", { refresh: true });
      }
    }
  };

  setShopUrlInLocalStorage = (shop_url) => {
    localStorage.removeItem("shop_url");
    localStorage.setItem("shop_url", shop_url);
  };

  getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
      code,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let shopifyAccount = connectedAccountData.find(
        (account) => account.marketplace === "shopify"
      );
      if (shopifyAccount) {
        const { shop_url } = shopifyAccount;
        this.setShopUrlInLocalStorage(shop_url);
      }
    } else {
      notify.error(message);
      if (tokenExpireValues.includes(code)) this.props.history.push("/auth/login");
    }
  }

  render() {
    return (
      <Page fullWidth>
        <img
          src={welcomeScreen}
          alt={""}
          style={{ height: "95vh", width: "100%" }}
        />
      </Page>
    );
  }
}

export default Welcome;
