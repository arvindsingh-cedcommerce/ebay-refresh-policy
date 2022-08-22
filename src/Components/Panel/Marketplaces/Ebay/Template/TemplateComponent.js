import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import TemplateHandlerComponent from "./TemplateHandlerComponent";
import FinalTemplateGridComponent from "./Components/FinalTemplateGridComponent";

const TemplateComponent = () => {
  useEffect(() => {
    document.title =
      "Create/Edit templates on eBay Marketplace Integration - CedCommerce";
    document.description =
      "Users can create or edit Title, Inventory, Price & Category Templates to make selling on eBay automated.";
  }, []);

  return (
    <Switch>
      <Route
        path="/panel/ebay/templates/grid"
        component={FinalTemplateGridComponent}
      />
      <Route
        path="/panel/ebay/templates/handler"
        component={TemplateHandlerComponent}
      />
      <Route
        exact
        path="/panel/ebay/templates"
        render={() => <Redirect to="/panel/ebay/templates/grid" />}
      />
    </Switch>
  );
};

export default TemplateComponent;
