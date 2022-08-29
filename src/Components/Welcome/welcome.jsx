import React, { Component } from "react";
import { Page } from "@shopify/polaris";
import { checkStepCompleted } from "../../Apirequest/registrationApi";
import { getDashboardData } from "../../APIrequests/DashboardAPI";
import { dashboardAnalyticsURL } from "../../URLs/DashboardURL";
const welcomeScreen = require("./../../assets/Sell-on-ebay-marketplace-08.jpg");

class Welcome extends Component {
  redirect(url) {
    this.props.history.push(url);
  }

  componentDidMount() {
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
