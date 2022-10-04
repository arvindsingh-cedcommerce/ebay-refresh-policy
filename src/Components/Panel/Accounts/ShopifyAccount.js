import {
  Card,
  ChoiceList,
  FormLayout,
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import {
  getConnectedAccounts,
  getProfileImage,
  uploadCustomData,
  uploadPic,
} from "../../../Apirequest/accountsApi";
import { notify } from "../../../services/notify";
import AppAccountDetailsComponent from "./AccountTabsComponent/AppAccountDetailsComponent";
import ImageUpload from "./ImageUpload";

const ShopifyAccount = (props) => {
  const { shopifyAccountData } = props;
  // custom photo
  const [person, setPerson] = useState({
    file: "",
    imagePreviewUrl: "",
    active: "edit",
  });
  const [shopifyData, setShopifyData] = useState({});

  // custom details
  const [customDetails, setCustomDetails] = useState({
    contactNumber: "",
    email: "",
    skypeLink: "",
    whatsAppLink: "",
    selectedEmailNotifications: [],
  });
  const [customPhoto, setCustomPhoto] = useState("");

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
      testObj["address"] = shopifyAccountData["shop_details"]["address1"];

      // if (shopifyAccountData?.["userCustomData"]?.["photo"]) {
      //   const imageName = shopifyAccountData["userCustomData"]["photo"].split('/').pop()
      //   setPerson({...person, imagePreviewUrl: imageName})
      // }

      if (shopifyAccountData?.["userCustomData"]?.["userData"]) {
        setCustomDetails({
          ...customDetails,
          ...shopifyAccountData?.["userCustomData"]?.["userData"],
        });
      }

      setShopifyData(testObj);
    }
  };

  const getImage = async () => {
    let { success, message } = await getProfileImage();
    if (success) {
      setPerson({ ...person, imagePreviewUrl: message });
    } else {
      // setPerson({...person, imagePreviewUrl: message})
    }
  };
  useEffect(() => {
    getAllConnectedAccounts();
    getImage();
  }, []);

  const getParsedSaveData = () => {
    const postData = {};
    for (const key in customDetails) {
      if (
        key === "selectedEmailNotifications" &&
        customDetails[key].length > 0
      ) {
        postData[key] = customDetails[key];
      } else if (key !== "selectedEmailNotifications") {
        let trimmedValue = customDetails[key].trim();
        if (trimmedValue) {
          postData[key] = trimmedValue;
        }
      }
    }
    return postData;
  };
  const saveCustomDetails = async () => {
    const parsedData = getParsedSaveData(customDetails);
    let { success, message } = await uploadCustomData(parsedData);
    if (success) {
      notify.success(message);
    } else {
      notify.error(message);
    }
  };

  return (
    <Page fullWidth={false} title="User Profile">
      <Layout>
        <Layout.Section secondary>
          <ImageUpload person={person} setPerson={setPerson} />
        </Layout.Section>
        <Layout.Section>
          <AppAccountDetailsComponent shopifyData={shopifyData} />
          <Card
            sectioned
            primaryFooterAction={{
              content: "Submit",
              onAction: saveCustomDetails,
            }}
            title="Contact Details"
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
                  label="Contact Email"
                  onChange={(value) =>
                    setCustomDetails({ ...customDetails, email: value })
                  }
                  autoComplete="email"
                  value={customDetails.email}
                />
                <TextField
                  label={"Skype Group Link"}
                  onChange={(value) =>
                    setCustomDetails({ ...customDetails, skypeLink: value })
                  }
                  autoComplete="off"
                  value={customDetails.skypeLink}
                />
                <TextField
                  label="WhatsApp Group Link"
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
