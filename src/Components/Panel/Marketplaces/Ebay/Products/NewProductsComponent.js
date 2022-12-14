import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ImportProducts from "./ImportProducts";
import NewProductsNewFilters from "./NewProductsNewFilters";
import ProductViewPolarisNew from "./ProductViewPolarisNew";

const NewProductsComponent = (props) => {
  useEffect(() => {
    document.title =
      "Manage Shopify products on eBay Marketplace Integration App";
    document.description =
      "Minimize your efforts to sell Shopify products on eBay with eBay Marketplace Integration App, which helps to easily list, sync & manage your products on eBay.";
    if (!document.title.includes(localStorage.getItem("shop_url"))) {
      document.title += localStorage.getItem("shop_url")
        ? " " + localStorage.getItem("shop_url")
        : "";
    }
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
        path="/panel/ebay/products/bulkupdate"
        component={ImportProducts}
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
