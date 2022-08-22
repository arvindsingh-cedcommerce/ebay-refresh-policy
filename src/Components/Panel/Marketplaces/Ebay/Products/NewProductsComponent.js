import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NewProductsNewFilters from "./NewProductsNewFilters";
import ProductViewPolarisNew from "./ProductViewPolarisNew";

const NewProductsComponent = () => {
  useEffect(() => {
    document.title =
      "Manage Shopify products on eBay Marketplace Integration App";
    document.description =
      "Minimize your efforts to sell Shopify products on eBay with eBay Marketplace Integration App, which helps to easily list, sync & manage your products on eBay.";
  }, []);

  return (
    <Switch>
      <Route
        path="/panel/ebay/products/grid"
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
