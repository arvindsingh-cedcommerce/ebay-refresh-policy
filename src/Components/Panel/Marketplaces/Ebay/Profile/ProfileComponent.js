import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ProfileGridComponent from "./ProfileGridComponent";
import CreateProfilePolaris from "./Profilepages/CreateProfilePolaris";

const ProfileComponent = () => {
  useEffect(() => {
    // document.title =
    //   "Create/Edit profile and easily list them on eBay - CedCommerce";
    document.title = "Profile | Integration for eBay";
    document.description =
      "Place & segment your Shopify products based on product properties such as type, vendor, etc. in particular profile to assign various business policies (Return, Payment, Shipping ), templates.";
    if (!document.title.includes(localStorage.getItem("shop_url"))) {
      document.title += localStorage.getItem("shop_url")
        ? " " + localStorage.getItem("shop_url")
        : "";
    }
  }, []);

  return (
    <Switch>
      <Route
        path="/panel/ebay/profiles/grid"
        component={ProfileGridComponent}
      />
      <Route
        path="/panel/ebay/profiles/edit"
        component={CreateProfilePolaris}
      />
      <Route
        exact
        path="/panel/ebay/profiles"
        render={() => <Redirect to="/panel/ebay/profiles/grid" />}
      />
    </Switch>
  );
};

export default ProfileComponent;
