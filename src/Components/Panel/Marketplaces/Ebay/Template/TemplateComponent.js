import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import TemplateHandlerComponent from "./TemplateHandlerComponent";
import TemplateGridComponent from "./Components/TemplateGridComponent";
import FinalTemplateGridComponent from "./Components/FinalTemplateGridComponent";

const TemplateComponent = () => {
  return (
    <Switch>
      <Route
        path="/panel/ebay/templatesUS/grid"
        // component={TemplateGridComponent}
        component={FinalTemplateGridComponent}
      />
      <Route
        path="/panel/ebay/templatesUS/handler"
        component={TemplateHandlerComponent}
      />
      <Route
        exact
        path="/panel/ebay/templatesUS"
        render={() => <Redirect to="/panel/ebay/templatesUS/grid" />}
      />
    </Switch>
  );
};

export default TemplateComponent;
