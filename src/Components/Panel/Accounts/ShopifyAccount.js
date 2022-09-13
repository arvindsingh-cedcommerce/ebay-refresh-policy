import {
  Card,
  ChoiceList,
  FormLayout,
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../Apirequest/accountsApi";
import AppAccountDetailsComponent from "./AccountTabsComponent/AppAccountDetailsComponent";
import ImageUpload from "./ImageUpload";

const ShopifyAccount = (props) => {
  const { shopifyAccountData } = props;
  const [shopifyData, setShopifyData] = useState({});

  // custom details
  const [customDetails, setCustomDetails] = useState({
    contactNumber: "",
    email: "",
    skypeLink: "",
    whatsAppLink: "",
    selectedEmailNotifications: [],
  });

  useEffect(() => {
    document.title = "User Profile | Integration for eBay";
  }, []);

  // useEffect(() => {
  //   if (shopifyAccountData && Object.keys(shopifyAccountData).length) {
  //     console.log(shopifyAccountData);
  //     let testObj = {};
  //     testObj["name"] = shopifyAccountData["name"];
  //     testObj["phone"] = shopifyAccountData["phone"];
  //     testObj["email"] = shopifyAccountData["email"];
  //     testObj["currency"] = shopifyAccountData["shop_details"]["currency"];
  //     testObj["email"] = shopifyAccountData["shop_details"]["email"];
  //     testObj["plan display name"] =
  //       shopifyAccountData["shop_details"]["plan_display_name"];
  //     testObj["address1"] = shopifyAccountData["shop_details"]["address1"];
  //     setShopifyData(testObj);
  //   }
  // }, []);

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (
      accountConnectedSuccess &&
      Array.isArray(connectedAccountData) &&
      connectedAccountData.length
    ) {
      let shopifyAccountData = connectedAccountData.find(
        (account) => account["marketplace"] === "shopify"
      );
      //   for shopify
      let testObj = {};
      testObj["name"] = shopifyAccountData["name"];
      testObj["phone"] = shopifyAccountData["phone"];
      testObj["email"] = shopifyAccountData["email"];
      testObj["currency"] = shopifyAccountData["shop_details"]["currency"];
      testObj["email"] = shopifyAccountData["shop_details"]["email"];
      testObj["plan display name"] =
        shopifyAccountData["shop_details"]["plan_display_name"];
      testObj["address1"] = shopifyAccountData["shop_details"]["address1"];

      setShopifyData(testObj);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  const saveCustomDetails = () => {
    console.log(customDetails);
    const postData = {};
    for (const key in customDetails) {
      if (
        key === "selectedEmailNotifications" &&
        customDetails[key].length > 0
      ) {
        postData[key] = customDetails[key];
      } else if (key !== "selectedEmailNotifications" && customDetails[key]) {
        postData[key] = customDetails[key];
      }
    }
    console.log(postData);
  };

  return (
    <Page fullWidth={false} title="User Profile">
      <Layout>
        <Layout.Section secondary>
          <ImageUpload />
        </Layout.Section>
        <Layout.Section>
          <AppAccountDetailsComponent shopifyData={shopifyData} />
          <Card
            sectioned
            primaryFooterAction={{
              content: "Submit",
              onAction: saveCustomDetails,
            }}
          >
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="Contact Number"
                  onChange={(value) =>
                    setCustomDetails({ ...customDetails, contactNumber: value })
                  }
                  autoComplete="off"
                  value={customDetails.contactNumber}
                  type="number"
                  min={0}
                />
                <TextField
                  type="email"
                  label="Account Email"
                  onChange={(value) =>
                    setCustomDetails({ ...customDetails, email: value })
                  }
                  autoComplete="email"
                  value={customDetails.email}
                />
                <TextField
                  label="Skype"
                  onChange={(value) =>
                    setCustomDetails({ ...customDetails, skypeLink: value })
                  }
                  autoComplete="off"
                  value={customDetails.skypeLink}
                />
                <TextField
                  label="WhatsApp"
                  onChange={(value) =>
                    setCustomDetails({ ...customDetails, whatsAppLink: value })
                  }
                  autoComplete="off"
                  value={customDetails.whatsAppLink}
                />
                <ChoiceList
                  allowMultiple
                  title="Email Notification"
                  choices={[
                    {
                      label: "Failed Order",
                      value: "failedOrder",
                      // helpText:
                      //   "Reduces the number of fields required to check out. The billing address can still be edited.",
                    },
                  ]}
                  selected={customDetails.selectedEmailNotifications}
                  onChange={(value) =>
                    setCustomDetails({
                      ...customDetails,
                      selectedEmailNotifications: value,
                    })
                  }
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopifyAccount;
