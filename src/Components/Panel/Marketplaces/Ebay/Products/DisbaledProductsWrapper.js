import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import DisabledProducts from "./DisabledProducts";
import DisabledProductsView from "./DisabledProductsView";

const DisbaledProductsWrapper = () => {
  return (
    <Switch>
      <Route
        path="/panel/ebay/disabledproducts/grid"
        component={DisabledProducts}
      />
      <Route
        path="/panel/ebay/disabledproducts/viewproducts"
        component={DisabledProductsView}
      />
      <Route
        exact
        path="/panel/ebay/disabledproducts"
        render={() => <Redirect to="/panel/ebay/disabledproducts/grid" />}
      />
    </Switch>
  );
};

export default DisbaledProductsWrapper;
