import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NewProductsNewFilters from "./NewProductsNewFilters";
import ProductViewPolarisNew from "./ProductViewPolarisNew";

const NewProductsComponent = () => {
  return (
    <Switch>
      <Route
        path="/panel/ebay/products/grid"
        // component={TemplateGridComponent}
        component={NewProductsNewFilters}
      />
      <Route
        path="/panel/ebay/products/viewproducts"
        component={ProductViewPolarisNew}
      />
      <Route
        exact
        path="/panel/ebay/products"
        render={() => <Redirect to="/panel/ebay/products/grid" />}
      />
    </Switch>
  );
};

export default NewProductsComponent;
