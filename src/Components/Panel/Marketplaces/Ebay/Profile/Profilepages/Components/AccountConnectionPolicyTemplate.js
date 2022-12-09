import { Banner, Card, Layout, List, Stack } from "@shopify/polaris";
import { Tabs, Divider, Image } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import AccountTabContent from "./AccountTabContent";
import CheckboxComponent from "./CheckboxComponent";

const { TabPane } = Tabs;

const AccountConnectionPolicyTemplate = ({
  templateOptions,
  connectedAccountsObject,
  setconnectedAccountsObject,
  shopifyWarehouses,
  panes,
  setPanes,
  checkboxError,
  setCheckboxError
}) => {
  useEffect(() => {
    if (Object.keys(connectedAccountsObject).length > 0) {
      const filteredArray = panes
        .filter((value) =>
          Object.keys(connectedAccountsObject).includes(value.title)
        )
        .map((e) => {
          return {
            ...e,
            content: (
              <AccountTabContent
                account={e["title"]}
                connectedAccountsObject={connectedAccountsObject}
                setconnectedAccountsObject={setconnectedAccountsObject}
                templateOptions={templateOptions}
                shopifyWarehouses={shopifyWarehouses}
              />
            ),
          };
        });
      setPanes(filteredArray);
    }
  }, [connectedAccountsObject, templateOptions]);

  return (
    <Card.Section title="Account Selection">
      <Banner title="How to add accounts to profile" status="info">
        <List type="bullet">
          <List.Item>
            Select Account below ( you can add multiple accounts ) and add them
            for which you want to create the profile.
          </List.Item>
          <List.Item>
            Select settings (Business policy & templates) for the site.
          </List.Item>
        </List>
      </Banner>
      <Divider />
      <div style={checkboxError ? {WebkitBoxShadow: "0px 0px 5px 1px rgba(255,0,0,1)",MozBoxShadow: "0px 0px 5px 1px rgba(255,0,0,1)",boxShadow: "0px 0px 5px 1px rgba(255,0,0,1)"}:null}>
      <Card sectioned>
      <CheckboxComponent
        connectedAccountsObject={connectedAccountsObject}
        setconnectedAccountsObject={setconnectedAccountsObject}
        panes={panes}
        setPanes={setPanes}
        setCheckboxError={setCheckboxError}
      />
      </Card>
      </div>
      {panes.length > 0 && <Divider />}
      {panes.length > 0 && <>Selected Accounts-:</>}
      <Tabs onChange={() => {}} type="card">
        {panes.map((pane) => {
          return (
            <TabPane
              // tab={pane.title}
              tab={
                <Stack alignment="fill" spacing="tight">
                  <Image
                    preview={false}
                    width={25}
                    src={
                      pane["siteID"] &&
                      require(`../../../../../../../assets/flags/${pane["siteID"]}.png`)
                    }
                    style={{ borderRadius: "50%" }}
                  />
                  <>{pane.title.split("-")[1]}</>
                </Stack>
              }
              key={pane.key}
              closable={pane.closable}
            >
              <div style={pane?.['status'] === "inactive" ? {
                pointerEvents: "none",
                opacity: 0.8,
              } : {}}>
                {pane.content}
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    </Card.Section>
  );
};

export default withRouter(AccountConnectionPolicyTemplate);
