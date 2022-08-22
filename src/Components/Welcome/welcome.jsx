import React, { Component } from "react";
import { Page } from "@shopify/polaris";
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

  routetoUrl() {
    if (true) {
      this.redirect("/registrations");
    } else {
      this.redirect("/panel/products");
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
