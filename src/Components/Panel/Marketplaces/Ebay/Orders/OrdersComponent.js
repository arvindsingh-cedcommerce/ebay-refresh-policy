import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NewOrdersGrid from "./NewOrdersGrid";
import ViewOrdersPolarisNew from "./ViewOrdersPolarisNew";

const OrdersComponent = () => {
  useEffect(() => {
    document.title = "Orders";
    document.description = "Orders";
  }, []);

  return (
    <Switch>
      <Route path="/panel/ebay/orders/grid" component={NewOrdersGrid} />
      <Route
        path="/panel/ebay/orders/vieworders"
        component={ViewOrdersPolarisNew}
      />
      <Route
        exact
        path="/panel/ebay/orders"
        render={() => <Redirect to="/panel/ebay/orders/grid" />}
      />
    </Switch>
  );
};

export default OrdersComponent;
