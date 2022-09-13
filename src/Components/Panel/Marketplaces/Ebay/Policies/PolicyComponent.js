import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import FinalPolicyGrid from "./FinalPolicyGrid";
import PolicyHandler from "./PolicyHandler";

const PolicyComponent = () => {
  useEffect(() => {
    // document.title =
    //   "Edit an existing business policy or create new - CedCommerce";
    document.title = "Policy | Integration for eBay";
    document.description =
      "Business Policy section helps you to edit an existing business policy or you can create a new business policy (Shipping/Return/Payment) as per your choice.";
  }, []);

  return (
    <Switch>
      <Route path="/panel/ebay/policy/grid" component={FinalPolicyGrid} />
      <Route path="/panel/ebay/policy/handler" component={PolicyHandler} />
      <Route
        exact
        path="/panel/ebay/policy"
        render={() => <Redirect to="/panel/ebay/policy/grid" />}
      />
    </Switch>
  );
};

export default PolicyComponent;
