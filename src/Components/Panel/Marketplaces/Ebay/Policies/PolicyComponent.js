import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import FinalPolicyGrid from "./FinalPolicyGrid";
import PolicyHandler from "./PolicyHandler";

const PolicyComponent = () => {
  return (
    <Switch>
      <Route
        path="/panel/ebay/policy/grid"
        component={FinalPolicyGrid}
      />
      <Route
        path="/panel/ebay/policy/handler"
        component={PolicyHandler}
      />
      <Route
        exact
        path="/panel/ebay/policy"
        render={() => <Redirect to="/panel/ebay/policy/grid" />}
      />
    </Switch>
  );
};

export default PolicyComponent;
