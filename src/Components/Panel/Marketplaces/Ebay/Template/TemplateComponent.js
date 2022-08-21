import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import TemplateHandlerComponent from "./TemplateHandlerComponent";
import TemplateGridComponent from "./Components/TemplateGridComponent";
import FinalTemplateGridComponent from "./Components/FinalTemplateGridComponent";

const TemplateComponent = () => {
  return (
    <Switch>
      <Route
        path="/panel/ebay/templates/grid"
        // component={TemplateGridComponent}
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
