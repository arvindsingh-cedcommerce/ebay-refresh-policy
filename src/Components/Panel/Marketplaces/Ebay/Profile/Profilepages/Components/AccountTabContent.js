import { Card, ChoiceList } from "@shopify/polaris";
import { Button } from "antd";
import React from "react";
import Policy from "./Policy";
import Template from "./Template";

const AccountTabContent = ({
  account,
  connectedAccountsObject,
  setconnectedAccountsObject,
  templateOptions,
  shopifyWarehouses,
}) => {
  return (
    <>
      <Card.Section>
        <Policy
          label={account}
          value={connectedAccountsObject[account]}
          connectedAccountsObject={connectedAccountsObject}
          setconnectedAccountsObject={setconnectedAccountsObject}
        />
      </Card.Section>
      <Card.Section>
        <Template
          templateOptions={templateOptions}
          connectedAccountsObject={connectedAccountsObject}
          account={account}
          setconnectedAccountsObject={setconnectedAccountsObject}
        />
      </Card.Section>
    </>
  );
};

export default AccountTabContent;
