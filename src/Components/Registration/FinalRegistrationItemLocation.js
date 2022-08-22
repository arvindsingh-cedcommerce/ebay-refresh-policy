import {
  Button,
  Card,
  Checkbox,
  ChoiceList,
  Icon,
  Layout,
  Link,
  Modal,
  Page,
  Select,
  Stack,
  TextContainer,
  TextField,
  TextStyle,
  Tooltip,
  DisplayText,
} from "@shopify/polaris";
import { ImportMinor, QuestionMarkMinor } from "@shopify/polaris-icons";
import React, { useState, useEffect } from "react";
import { json } from "../../globalConstant/static-json";
import { term_and_conditon } from "../../globalConstant/term&condition";
import { downloadPrivacyPolicy } from "../../Subcomponents/Registration/UserDetailsAcceptTerms";
import { plansSample } from "./NewRegistrationhelper";
import {
  checkAccountsConnected,
  checkStepCompleted,
  getImportAttribute,
  getUserDetails,
  importCollectionProduct,
  importProduct,
  initiateVendorProductTypeFetch,
  saveCompletedStep,
  saveUserDetails,
} from "../../Apirequest/registrationApi";
import { globalState } from "../../services/globalstate";
import { environment } from "../../environment/environment";
import { getConnectedAccounts } from "../../Apirequest/accountsApi";
import PlansComponentAnt from "./PlansComponentAnt";
import { Progress } from "antd";
import { configurationAPI } from "../../APIrequests/ConfigurationAPI";
import {
  collectionFetchURL,
  getAppSettingsURL,
  saveAppSettingsShopifyToAppURL,
} from "../../URLs/ConfigurationURL";
import Title from "antd/lib/typography/Title";
import {
  order_settings,
  productSettingsDataShop,
  product_settings,
} from "./StaticData/importSettings";
import { countryArray } from "../Panel/Marketplaces/Ebay/Configurations/Components/ProductSettingsNew/countryData";
import { refreshPoliciesURL } from "../../URLs/PoliciesURL";
import { getRefreshPolicies } from "../../APIrequests/PoliciesAPI";

export const alreadySellingOnEbayOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const publishedStatusOptions = [
  { label: "Please Select...", value: "" },
  { label: "All", value: "any" },
  { label: "Published", value: "published" },
  { label: "Unpublished", value: "unpublished" },
];

export const productStatusOptions = [
  { label: "Please Select...", value: "" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
  { label: "Draft", value: "draft" },
];

export const accountTypeOptions = [
  { label: "Sandbox Account", value: "sandbox" },
  { label: "Live Account", value: "production", disabled: true },
];

let siteID = false;

export const FinalRegistrationItemLocation = (props) => {
  const [username, setUsername] = useState("");
  const [ebaySellerAccountActive, setEbaySellerAccountActive] = useState(false);
  const [similarShopifyApp, setSimilarShopifyApp] = useState(false);

  const totalSteps = 4;

  const [currentStep, setCurrentStep] = useState(undefined);

  const [userData, setUserData] = useState({
    accept_terms_conditions: false,
    ebaySellerAccountActive: false,
    similarShopifyApp: false,
  });

  const [viewPlanModal, setViewPlanModal] = useState(false);

  const { flag_country } = json;
  const [accountConnection, setAccountConnection] = useState({
    accountType: accountTypeOptions[0]["value"],
    countryConnected: flag_country[0]["value"],
    countryImage: flag_country[0]["flag"],
    connectAccountModal: false,
  });

  const [plans, setPlans] = useState(plansSample);
  const [importSettingsStatus, setImportSettingsStatus] = useState(true);
  const [orderSettingsStatus, setOrderSettingsStatus] = useState(false);
  const [importByCollection, setImportByCollection] = useState(false);
  const [restrictImportByCollection, setRestictImportByCollection] =
    useState(false);
  const [restrictImportByAttribute, setRestictImportByAttribute] =
    useState(false);
  const [importByAttribute, setImportByAttribute] = useState(true);
  const [importProductFilters, setImportProductFilters] = useState({
    productStatus: {
      label: "Product Status",
      // options: [],
      options: [{ label: "Please Select...", value: "" }],
      value: productStatusOptions[0]["value"],
      enable: "yes",
    },
    publishedStatus: {
      label: "Published Status",
      // options: [],
      options: [{ label: "Please Select...", value: "" }],
      value: publishedStatusOptions[0]["value"],
      enable: "yes",
    },
    productType: {
      label: "Product Type",
      options: [],
      value: "",
      enable: "yes",
    },
    vendor: {
      options: [],
      value: "",
      label: "Vendor",
      enable: "yes",
    },
    import_collection: {
      options: [],
      value: "",
      label: "Collections",
      enable: "yes",
    },
    importAndReplaceProduct: {
      enable: "yes",
    },
  });
  const [errors, setErrors] = useState({});
  const [shopUrlLink, setShopUrlLink] = useState("");
  const [restrictAfterSave, setRestrictAfterSave] = useState({
    accept_terms_conditions: false,
    ebaySellerAccountActive: false,
    similarShopifyApp: false,
    // importSettingsStatus: false,
    // orderSettingsStatus: false,
  });
  const [restrictImportSettingsStatus, setRestrictImportSettingsStatus] =
    useState(false);
  const [restrictOrderSettingsStatus, setRestrictOrderSettingsStatus] =
    useState(false);
  const [statusCallAPIs, setStatusCallAPIs] = useState(false);
  const [selectImportShopifyProduct, setSelectImportShopifyProduct] = useState([
    "Import By Filter(s)",
  ]);

  const [itemLocation, setitemLocation] = useState({
    attribute: { country: "", zipcode: "", location: "" },
    enable: "yes",
  });
  const [itemLocationError, setitemLocationError] = useState({
    country: false,
    zipcode: false,
    location: false,
  });
  const [ebayAccountConnected, setEbayAccountConnected] = useState(false);

  const [connectLoader, setConnectLoader] = useState(false);

  const [next1Loader, setNext1Loader] = useState(false);
  const [next2Loader, setNext2Loader] = useState(false);
  const [next3Loader, setNext3Loader] = useState(false);

  const plansComponentCallback = () => {
    setCurrentStep(currentStep + 1);
  };

  const importCollections = async () => {
    const { success, message } = await configurationAPI(collectionFetchURL);
    if (success) {
      // notify.success(message);
    } else {
      // notify.error(message);
    }
  };
  useEffect(() => {
    async function fetchMyAPI() {
      await callConnectedAccounts();
      // await importCollections();
      let { success: checkStepCompletedSuccess, data } =
        await checkStepCompleted();
      data === 2 && (await hitAPIsForVendorProductType());
      // data === 2 && (await importCollections());
      if (checkStepCompletedSuccess) {
        setCurrentStep(data);
      }
      let { success: getUserDetailsSuccess, registration_details } =
        await getUserDetails();
      if (getUserDetailsSuccess && registration_details) {
        let {
          similarShopifyApp,
          ebaySellerAccountActive,
          term_and_conditon,
          importSettingsStatus,
          orderSettingsStatus,
          itemLocationCountry,
          itemLocationZipcode,
          itemLocationLocation,
        } = registration_details;
        if (
          itemLocationCountry &&
          itemLocationLocation &&
          itemLocationZipcode
        ) {
          let temp = { ...itemLocation };
          temp["attribute"]["country"] = itemLocationCountry;
          temp["attribute"]["zipcode"] = itemLocationZipcode;
          temp["attribute"]["location"] = itemLocationLocation;
          setitemLocation(temp);
        }
        if (
          itemLocationCountry &&
          itemLocationZipcode &&
          itemLocationLocation
        ) {
          setStatusCallAPIs(true);
          if (data === 1) {
            let previousDataToPost = {
              ebaySellerAccountActive: userData["ebaySellerAccountActive"],
              similarShopifyApp: userData["similarShopifyApp"],
              term_and_conditon: userData["accept_terms_conditions"],
              itemLocationCountry: itemLocation["attribute"]["country"],
              itemLocationZipcode: itemLocation["attribute"]["zipcode"],
              itemLocationLocation: itemLocation["attribute"]["location"],
            };
            let { success, message } = await saveUserDetails(
              previousDataToPost
            );
            if (success) {
              console.log("296");
              await saveCompletedStep(1);
              // await configurationAPI(saveAppSettingsShopifyToAppURL, postData);
              let { success, data } = await checkStepCompleted();
              if (success) {
                setCurrentStep(data);
                let { success, registration_details } = await getUserDetails();
                if (success) {
                  setUserData({
                    ...userData,
                    ebaySellerAccountActive:
                      registration_details["ebaySellerAccountActive"],
                    similarShopifyApp:
                      registration_details["similarShopifyApp"],
                    accept_terms_conditions:
                      registration_details["term_and_conditon"],
                  });
                  let tempObj = { ...itemLocation };
                  tempObj["attribute"]["country"] =
                    registration_details["itemLocationCountry"];
                  tempObj["attribute"]["zipcode"] =
                    registration_details["itemLocationZipcode"];
                  tempObj["attribute"]["location"] =
                    registration_details["itemLocationLocation"];
                  setitemLocation(tempObj);
                }
                // await hitAPIsForVendorProductType();
              }
            }
          }
        }
        if (similarShopifyApp && ebaySellerAccountActive && term_and_conditon) {
          // setStatusCallAPIs(true);
          setUserData({
            ...userData,
            similarShopifyApp: registration_details["similarShopifyApp"],
            ebaySellerAccountActive:
              registration_details["ebaySellerAccountActive"],
            accept_terms_conditions: registration_details["term_and_conditon"]
              ? registration_details["term_and_conditon"]
              : false,
          });
          setRestrictAfterSave({
            ...restrictAfterSave,
            accept_terms_conditions: true,
            ebaySellerAccountActive: true,
            similarShopifyApp: true,
          });
        }
        if (importSettingsStatus && data === 2) {
          let {
            data: configData,
            success: configSuccess,
            message,
          } = await configurationAPI(getAppSettingsURL);
          if (configSuccess && configData?.data?.import_settings) {
            let temp = { ...importProductFilters };
            for (const key in configData.data.import_settings) {
              temp[key]["enable"] =
                configData.data.import_settings[key]["enable"];
              if (key !== "import_collection") {
                if (temp[key]["enable"] === "yes") {
                  setImportByAttribute(temp[key]["enable"]);
                  setRestictImportByAttribute(true);
                }
                temp[key]["value"] =
                  configData.data.import_settings[key]["value"];
              } else if (
                configData.data.import_settings[key]["enable"] === "yes"
              ) {
                temp[key]["value"] =
                  configData.data.import_settings[key][
                    "selected_collection"
                  ][0];
                setImportByCollection(
                  configData.data.import_settings[key]["enable"]
                );
              }
              setRestictImportByCollection(true);
            }
            setImportProductFilters(temp);
          }
        }
        if (importSettingsStatus) {
          setImportSettingsStatus(registration_details["importSettingsStatus"]);
          setRestrictImportSettingsStatus(true);
        }
        if (orderSettingsStatus) {
          setOrderSettingsStatus(registration_details["orderSettingsStatus"]);
          setRestrictOrderSettingsStatus(true);
        }
      }
    }
    fetchMyAPI();
  }, []);

  const redirect = (url) => {
    props.history.push(url);
  };

  useEffect(() => {
    if (currentStep >= totalSteps) {
      // setTimeout(() => {
      redirect("/panel");
      // }, 4000);
    }
    // if (currentStep > 4) {
    //   redirect("/panel");
    // }
  }, [currentStep]);

  const callBackFunction = (childData, textfieldType) => {
    if (
      textfieldType === "accountType" ||
      textfieldType === "countryConnected"
    ) {
      setAccountConnection({
        ...accountConnection,
        [textfieldType]: childData,
      });
    }
    setUserData({ ...userData, [textfieldType]: childData });
  };

  const getAppInstallationForm = async (siteID) => {
    setConnectLoader(true);
    window.open(
      `${
        environment.API_ENDPOINT
      }/connector/get/installationForm?code=ebay&site_id=${siteID}&mode=sandbox&from_onboarding=true&bearer=${globalState.getLocalStorage(
        "auth_token"
      )}`,
      "_parent"
    );
  };
  const initiatefetchVendorProductType = async () => {
    let {} = await initiateVendorProductTypeFetch();
  };
  const getPercentage = () => currentStep * 25;

  const prepareOptions = (data) => {
    const options = data.map((value) => {
      let tempObj = {};
      tempObj["label"] = value;
      tempObj["value"] = value;
      return tempObj;
    });
    options.unshift({ label: "Please Select...", value: "" });
    return options;
  };

  const hitAPIsForVendorProductType = async () => {
    let { success, data } = await getImportAttribute();
    if (success) {
      if (data) {
        let temp = { ...importProductFilters };
        if (data?.product_type)
          temp["productType"]["options"] = prepareOptions(data?.product_type);
        if (data?.vendor)
          temp["vendor"]["options"] = prepareOptions(data?.vendor);
        if (data?.collection) {
          const options = Object.keys(data.collection).map((key) => {
            let tempObj = {};
            tempObj["label"] = data.collection[key];
            tempObj["value"] = key;
            return tempObj;
          });
          options.unshift({ label: "Please Select...", value: "" });
          temp["import_collection"]["options"] = options;
        }
        setImportProductFilters(temp);
      }
    }
  };

  const prepareDataForImportProductFilters = () => {
    const temp = {};
    Object.keys(importProductFilters).forEach((obj) => {
      if (importProductFilters[obj]["enable"] === "yes") {
        temp[obj] = {
          value: importProductFilters[obj]["value"],
          enable: importProductFilters[obj]["enable"],
        };
      } else {
        temp[obj] = {
          value: importProductFilters[obj]["value"],
          enable: importProductFilters[obj]["enable"],
        };
      }
    });
    return temp;
  };
  const callConnectedAccounts = async () => {
    let { success: connectConnectionSuccess, data: connectedAccounts } =
      await getConnectedAccounts();
    if (connectConnectionSuccess) {
      const shopifyAccount = connectedAccounts.find(
        (account) => account.marketplace === "shopify"
      );
      const firstebayAccountConnected = connectedAccounts.filter(
        (account) => account.marketplace === "ebay"
      )[0];
      if (shopifyAccount && shopifyAccount?.shop_url) {
        const url = `https://${shopifyAccount.shop_url}/admin/apps`;
        setUsername(shopifyAccount.name);
        setShopUrlLink(url);
      }
      // setEbayFirstAccountConnectedSiteId(firstebayAccountConnected?.warehouses[0]?.site_id)
      setAccountConnection({
        ...accountConnection,
        countryConnected: firstebayAccountConnected?.warehouses[0]?.site_id,
      });
      setEbayAccountConnected(firstebayAccountConnected);
    }
  };
  const saveConfiguration = async (temp) => {
    const postData = {
      setting_type: [],
      // product_settings: product_settings,
    };
    const temp1 = {};
    if (importByAttribute) {
      Object.keys(importProductFilters).forEach((obj) => {
        if (obj !== "import_collection") {
          if (importProductFilters[obj]["value"] === "") {
            temp1[obj] = {
              value: importProductFilters[obj]["value"],
              enable: "no",
            };
          } else {
            temp1[obj] = {
              value: importProductFilters[obj]["value"],
              enable: importProductFilters[obj]["enable"],
            };
          }
        } else {
          temp1["import_collection"] = {
            selected_collection: [],
            enable: "no",
          };
        }
      });
    } else if (importByCollection) {
      Object.keys(importProductFilters).forEach((obj) => {
        if (obj === "import_collection") {
          if (importProductFilters[obj]["value"] === "") {
            temp1[obj] = {
              selected_collection: [],
              enable: "no",
            };
          } else {
            temp1[obj] = {
              selected_collection: [importProductFilters[obj]["value"]],
              enable: importProductFilters[obj]["enable"],
            };
          }
        } else {
          temp1[obj] = {
            value: "",
            enable: "no",
          };
        }
      });
    }
    if (importSettingsStatus) {
      postData.setting_type.push("import_settings");
      postData["import_settings"] = {};
      postData["import_settings"] = temp1;
    }
    if (orderSettingsStatus) {
      postData.setting_type.push("order_settings");
      postData["order_settings"] = {};
      postData["order_settings"] = order_settings;
    }
    await configurationAPI(saveAppSettingsShopifyToAppURL, postData);
  };
  const renderImportByFilter = (
    <div
      style={
        importByAttribute
          ? {}
          : {
              pointerEvents: "none",
              opacity: 0.8,
            }
      }
    >
      <Card>
        <Card.Section>
          <Stack distribution="fillEvenly">
            <Select
              title="Kindly select the published status you want to import"
              options={publishedStatusOptions}
              value={importProductFilters["publishedStatus"]["value"]}
              onChange={(e) => {
                let temp = { ...importProductFilters };
                temp["publishedStatus"]["value"] = e;
                setImportProductFilters(temp);
              }}
              label="Published Status"
              disabled={restrictImportByAttribute}
            />
            <Select
              title="Kindly select the product status you want to import"
              options={productStatusOptions}
              value={importProductFilters["productStatus"]["value"]}
              onChange={(e) => {
                let temp = { ...importProductFilters };
                temp["productStatus"]["value"] = e;
                setImportProductFilters(temp);
              }}
              label="Product Status"
              disabled={restrictImportByAttribute}
            />
          </Stack>
        </Card.Section>
        <Card.Section
          title="Additional Filter(s)"
          actions={[
            {
              content: (
                <Tooltip content="If all options not listed then please wait while data fetching process running you can reload the page to check the options">
                  <Icon source={QuestionMarkMinor} color="base" />
                </Tooltip>
              ),
            },
          ]}
        >
          <Stack vertical>
            <Stack distribution="fillEvenly">
              <Select
                label="Vendor"
                value={importProductFilters["vendor"]["value"]}
                options={importProductFilters["vendor"]["options"]}
                onChange={(e) => {
                  let temp = {
                    ...importProductFilters,
                  };
                  temp["vendor"]["value"] = e;
                  setImportProductFilters(temp);
                }}
                disabled={restrictImportByAttribute}
              />
              <Select
                label="Product Type"
                value={importProductFilters["productType"]["value"]}
                options={importProductFilters["productType"]["options"]}
                onChange={(e) => {
                  let temp = {
                    ...importProductFilters,
                  };
                  temp["productType"]["value"] = e;
                  setImportProductFilters(temp);
                }}
                disabled={restrictImportByAttribute}
              />
            </Stack>
          </Stack>
          {/* </Stack> */}
        </Card.Section>
      </Card>
    </div>
  );
  const renderImportByCollection = (
    <div
      style={
        importByCollection
          ? {}
          : {
              pointerEvents: "none",
              opacity: 0.8,
            }
      }
    >
      <Card sectioned>
        <Select
          options={importProductFilters["import_collection"]["options"]}
          value={importProductFilters["import_collection"]["value"]}
          onChange={(e) => {
            let temp = { ...importProductFilters };
            temp["import_collection"]["value"] = e;
            setImportProductFilters(temp);
          }}
          disabled={restrictImportByCollection}
        />
      </Card>
    </div>
  );

  const itemLocationValidator = () => {
    let tempObj = { ...itemLocationError };
    let hasError = false;
    for (const key in itemLocation["attribute"]) {
      if (!itemLocation["attribute"][key]) {
        tempObj[key] = true;
        hasError = true;
      } else {
        tempObj[key] = false;
      }
    }
    setitemLocationError(tempObj);
    return hasError;
  };

  const makeListOfCalls = async (productsettings) => {
    setNext2Loader(true);
    const postData = {
      setting_type: ["product_settings"],
      product_settings: productsettings,
    };
    let previousDataToPost = {
      ebaySellerAccountActive: userData["ebaySellerAccountActive"],
      similarShopifyApp: userData["similarShopifyApp"],
      term_and_conditon: userData["accept_terms_conditions"],
      itemLocationCountry: itemLocation["attribute"]["country"],
      itemLocationZipcode: itemLocation["attribute"]["zipcode"],
      itemLocationLocation: itemLocation["attribute"]["location"],
    };
    let { success, message } = await saveUserDetails(previousDataToPost);
    if (success) {
      console.log("774");
      await saveCompletedStep(1);
      await configurationAPI(saveAppSettingsShopifyToAppURL, postData);
      let { success, data } = await checkStepCompleted();
      if (success) {
        setCurrentStep(data);
        let { success, registration_details } = await getUserDetails();
        if (success) {
          setUserData({
            ...userData,
            ebaySellerAccountActive:
              registration_details["ebaySellerAccountActive"],
            similarShopifyApp: registration_details["similarShopifyApp"],
            accept_terms_conditions: registration_details["term_and_conditon"],
          });
          let tempObj = { ...itemLocation };
          tempObj["attribute"]["country"] =
            registration_details["itemLocationCountry"];
          tempObj["attribute"]["zipcode"] =
            registration_details["itemLocationZipcode"];
          tempObj["attribute"]["location"] =
            registration_details["itemLocationLocation"];
          setitemLocation(tempObj);
        }
        await hitAPIsForVendorProductType();
      }
    }
    setNext2Loader(false);
  };

  const getAllPoliciesRefresh = async () => {
    let requestData = {
      multitype: ["shipping", "payment", "return"],
      site_id: Number(ebayAccountConnected["warehouses"][0]["site_id"]),
      shop_id: ebayAccountConnected.id,
    };
    let {
      success,
      data: fetchedPoliciesArray,
      message,
    } = await getRefreshPolicies(refreshPoliciesURL, { ...requestData });
    if (success) {
    }
  };

  const completeStepAfterConnect = async () => {
    let hasError = itemLocationValidator();
    if (!hasError) {
      const { id } = ebayAccountConnected;
      product_settings["app_to_ebay"][id] = {};
      for (const key in productSettingsDataShop) {
        product_settings["app_to_ebay"][id][key] = productSettingsDataShop[key];
      }
      product_settings["app_to_ebay"][id]["itemLocation"] = { ...itemLocation };
      await makeListOfCalls(product_settings);
      await getAllPoliciesRefresh();
    }
  };
  return (
    <div style={{ margin: "35px 0px" }}>
      <Page fullWidth>
        <Card>
          {[0, 1, 2, 3].includes(currentStep) && (
            <Card.Section>
              <Stack vertical>
                <DisplayText size="large">Integration for eBay</DisplayText>
                <>
                  Hello <b>{username}</b>, Thank you for choosing this app for
                  managing your products and orders. Please fulfill certain
                  prerequisites before proceeding. This will take a few minutes.
                </>
                <Stack>
                  <Stack.Item fill>
                    <Progress percent={getPercentage()} showInfo={false} />
                  </Stack.Item>
                  <>Step {currentStep + 1}/4</>
                </Stack>
              </Stack>
            </Card.Section>
          )}
          {(currentStep === 0 ||
            currentStep === 1 ||
            //   currentStep === 2 ||
            currentStep === 2) && (
            <Card.Section>
              <Layout>
                <Layout.Section oneThird>
                  <div
                    style={
                      currentStep === 0
                        ? {
                            border: "2px solid #084e8a",
                            borderRadius: "3px",
                            boxShadow: "0px 0px 5px 5px rgb(8 78 138 / 0.29)",
                            // minHeight: "100%",
                            // minHeight: '100vh'
                          }
                        : {
                            pointerEvents: "none",
                            opacity: 0.8,
                            // minHeight: "100vh",
                            // minHeight: 'calc(100vh + 84px)'
                          }
                    }
                  >
                    <Card
                      title={
                        <Stack distribution="equalSpacing">
                          <b>Step 1</b>
                          <b>Basic Prerequisite</b>
                        </Stack>
                      }
                      primaryFooterAction={{
                        content: "Next",
                        loading: next1Loader,
                        onAction: async () => {
                          if (statusCallAPIs) {
                            console.log("566 checkStepCompleted");
                            await callConnectedAccounts();
                            await saveCompletedStep(0);
                            let { success, data } = await checkStepCompleted();
                            if (success) {
                              setCurrentStep(data);
                              let { success, registration_details } =
                                await getUserDetails();
                              if (success) {
                                setUserData({
                                  ...userData,
                                  ebaySellerAccountActive:
                                    registration_details[
                                      "ebaySellerAccountActive"
                                    ],
                                  similarShopifyApp:
                                    registration_details["similarShopifyApp"],
                                  accept_terms_conditions:
                                    registration_details["term_and_conditon"],
                                });
                                let {
                                  success: checkAccountsConnectedSuccess,
                                  account_connected: accountConnectedArray,
                                } = await checkAccountsConnected();
                                if (
                                  checkAccountsConnectedSuccess &&
                                  Array.isArray(accountConnectedArray) &&
                                  accountConnectedArray.length > 0
                                ) {
                                  let ebayAccountConnectedFlag =
                                    accountConnectedArray.includes("ebay");
                                  if (ebayAccountConnectedFlag) {
                                    console.log("598 checkStepCompleted");
                                    await saveCompletedStep(1);
                                    let { success, data } =
                                      await checkStepCompleted();
                                    if (success) {
                                      setCurrentStep(data);
                                      let { success, registration_details } =
                                        await getUserDetails();
                                      await hitAPIsForVendorProductType();
                                    }
                                  }
                                }
                              }
                            }
                          } else {
                            let dataToPost = {
                              ebaySellerAccountActive:
                                userData["ebaySellerAccountActive"],
                              similarShopifyApp: userData["similarShopifyApp"],
                              term_and_conditon:
                                userData["accept_terms_conditions"],
                            };
                            setNext1Loader(true);
                            let { success, message } = await saveUserDetails(
                              dataToPost
                            );
                            if (success) {
                              console.log("624 checkStepCompleted");
                              await importCollections();
                              await callConnectedAccounts();
                              await saveCompletedStep(0);
                              let { success, data } =
                                await checkStepCompleted();
                              if (success) {
                                // let {success} = await checkEmailValidity(email);
                                // Email = !success;
                                initiatefetchVendorProductType();
                                setCurrentStep(data);
                                let { success, registration_details } =
                                  await getUserDetails();
                                if (success) {
                                  setUserData({
                                    ...userData,
                                    ebaySellerAccountActive:
                                      registration_details[
                                        "ebaySellerAccountActive"
                                      ],
                                    similarShopifyApp:
                                      registration_details["similarShopifyApp"],
                                    accept_terms_conditions:
                                      registration_details["term_and_conditon"],
                                  });
                                }
                              }
                            }
                            setNext1Loader(false);
                          }
                        },
                        disabled:
                          !userData["accept_terms_conditions"] ||
                          !userData["ebaySellerAccountActive"] ||
                          !userData["similarShopifyApp"],
                      }}
                    >
                      <Card.Section>
                        <TextStyle variation="subdued">
                          Before selling on eBay with this application, please
                          confirm these details.
                        </TextStyle>
                      </Card.Section>
                      <Card.Section>
                        <Stack vertical={true}>
                          <Checkbox
                            label={
                              <Stack vertical>
                                <Title level={5}>
                                  eBay Seller Account should be active and
                                  available for selling
                                </Title>
                              </Stack>
                            }
                            checked={userData["ebaySellerAccountActive"]}
                            disabled={
                              restrictAfterSave["ebaySellerAccountActive"]
                            }
                            onChange={(e) =>
                              callBackFunction(e, "ebaySellerAccountActive")
                            }
                          />
                          <div
                            style={{
                              marginLeft: "28px",
                              marginTop: "-25px",
                            }}
                          >
                            <Stack vertical spacing="extraTight">
                              <Link removeUnderline external>
                                Opt Business Policy
                              </Link>
                              <Link removeUnderline external>
                                Automatic Payment Account Added
                              </Link>
                              <Link removeUnderline external>
                                Listing Limit Not Exausted
                              </Link>
                            </Stack>
                          </div>
                          <Checkbox
                            label={
                              <Title level={5}>
                                Do not use similar shopify app/sales-channel for
                                eBay.
                              </Title>
                            }
                            checked={userData["similarShopifyApp"]}
                            disabled={restrictAfterSave["similarShopifyApp"]}
                            onChange={(e) =>
                              callBackFunction(e, "similarShopifyApp")
                            }
                            helpText={
                              <Stack vertical spacing="extraTight">
                                <>
                                  Make sure you are not using any other app or
                                  sales-channel for similar type of feature
                                  which you are going to use in this app. i.e.{" "}
                                  <b>product and order management</b>.
                                </>
                                <div style={{ margin: "10px 0px" }}>
                                  <b>
                                    If you are using these type of
                                    app(s)/sales-channel(s){" "}
                                    <Link
                                      removeUnderline
                                      external
                                      url={shopUrlLink}
                                    >
                                      please visit
                                    </Link>{" "}
                                    to the shopify store to disconnect them.
                                  </b>
                                </div>
                              </Stack>
                            }
                          />
                          <Stack wrap={false} alignment="baseline">
                            <Checkbox
                              label={
                                <Title level={5}>
                                  Accept privacy policy of CEDCommerce
                                </Title>
                              }
                              checked={userData["accept_terms_conditions"]}
                              disabled={
                                restrictAfterSave["accept_terms_conditions"]
                              }
                              onChange={(e) =>
                                callBackFunction(e, "accept_terms_conditions")
                              }
                            />
                            <Tooltip content={"View privacy policy"}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={downloadPrivacyPolicy}
                              >
                                <Icon source={ImportMinor} color={"blueDark"} />
                              </div>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      </Card.Section>
                    </Card>
                  </div>
                </Layout.Section>
                <Layout.Section oneThird>
                  <div
                    style={
                      {
                        // minHeight: "100%",
                      }
                    }
                  >
                    <Stack vertical spacing="tight">
                      <div
                        style={
                          currentStep === 1
                            ? {
                                border: "2px solid #084e8a",
                                borderRadius: "3px",
                                boxShadow:
                                  "0px 0px 5px 5px rgb(8 78 138 / 0.29)",
                              }
                            : {
                                pointerEvents: "none",
                                opacity: 0.8,
                              }
                        }
                      >
                        <Card
                          // sectioned
                          // title="Step 2"
                          title={
                            <Stack distribution="equalSpacing">
                              <b>Step 2</b>
                              <b>Connect eBay account</b>
                            </Stack>
                          }
                          primaryFooterAction={{
                            content: "Next",
                            // disabled: next2Loader,
                            onAction: () => {
                              completeStepAfterConnect();
                            },
                            loading: next2Loader,
                            disabled: !ebayAccountConnected?.id,
                          }}
                        >
                          <Card.Section>
                            <Stack vertical spacing="extraLoose">
                              <TextStyle variation="subdued">
                                Connect your eBay seller account with the app to
                                manage products and orders. P.S. you can also
                                connect more eBay account after completing this
                                process.
                              </TextStyle>
                              <Stack distribution="center">
                                <img
                                  src="https://ebay.sellernext.com/marketplace-logos/ebay.png"
                                  alt="ebay integration app"
                                  width={"80%"}
                                />
                              </Stack>
                            </Stack>
                          </Card.Section>
                          <Card.Section>
                            <Stack
                              vertical
                              spacing="tight"
                              distribution="trailing"
                            >
                              <div
                                style={
                                  ebayAccountConnected &&
                                  ebayAccountConnected?.id !== "" && {
                                    pointerEvents: "none",
                                    opacity: 0.8,
                                  }
                                }
                              >
                                <Stack
                                  vertical={false}
                                  distribution="fillEvenly"
                                  alignment="center"
                                >
                                  <SelectComponent
                                    options={accountTypeOptions}
                                    value={accountConnection["accountType"]}
                                    onChange={callBackFunction}
                                    textfieldType={"accountType"}
                                  />
                                  <SelectComponent
                                    options={flag_country}
                                    value={
                                      accountConnection["countryConnected"]
                                    } //
                                    onChange={callBackFunction}
                                    textfieldType={"countryConnected"}
                                  />
                                </Stack>
                              </div>
                              <Stack distribution="trailing">
                                <Button
                                  disabled={ebayAccountConnected?.id}
                                  onClick={() =>
                                    getAppInstallationForm(
                                      userData["countryConnected"]
                                    )
                                  }
                                  primary
                                  loading={connectLoader}
                                >
                                  Connect
                                </Button>
                              </Stack>
                            </Stack>
                          </Card.Section>
                          <Card.Section
                            title={
                              <Tooltip
                                preferredPosition="above"
                                content="Indicates the geographical location of the item on eBay"
                              >
                                <TextStyle variation="strong">
                                  <span
                                    style={{
                                      borderBottomStyle: "dashed",
                                      borderColor: "#00000069",
                                    }}
                                  >
                                    Item Location
                                  </span>
                                </TextStyle>
                              </Tooltip>
                            }
                            // "Item Location"
                          >
                            <Stack vertical>
                              <Stack distribution="fillEvenly">
                                <Select
                                  placeholder="Please Select Country..."
                                  options={countryArray}
                                  // label="Country"
                                  value={itemLocation.attribute.country}
                                  onChange={(e) => {
                                    let temp = { ...itemLocation };
                                    temp["attribute"]["country"] = e;
                                    setitemLocation(temp);
                                  }}
                                  error={itemLocationError["country"]}
                                />
                                <TextField
                                  placeholder="Enter zipcode..."
                                  // label="Zip Code"
                                  value={itemLocation.attribute.zipcode}
                                  onChange={(e) => {
                                    let temp = { ...itemLocation };
                                    temp["attribute"]["zipcode"] = e;
                                    setitemLocation(temp);
                                  }}
                                  error={itemLocationError["zipcode"]}
                                />
                              </Stack>
                              <TextField
                                placeholder="Enter location..."
                                // label="Location"
                                value={itemLocation.attribute.location}
                                onChange={(e) => {
                                  let temp = { ...itemLocation };
                                  temp["attribute"]["location"] = e;
                                  setitemLocation(temp);
                                }}
                                error={itemLocationError["location"]}
                              />
                            </Stack>
                          </Card.Section>
                        </Card>
                      </div>
                    </Stack>
                  </div>
                </Layout.Section>
                <Layout.Section oneThird>
                  <div
                    style={
                      currentStep === 2
                        ? {
                            border: "2px solid #084e8a",
                            borderRadius: "3px",
                            boxShadow: "0px 0px 5px 5px rgb(8 78 138 / 0.29)",
                          }
                        : {
                            pointerEvents: "none",
                            opacity: 0.8,
                          }
                    }
                  >
                    <Card
                      title={
                        <Stack distribution="equalSpacing">
                          <b>Step 3</b>
                          <b>Required Settings</b>
                        </Stack>
                      }
                      primaryFooterAction={{
                        content: "Next",
                        loading: next3Loader,
                        onAction: async () => {
                          const temp = prepareDataForImportProductFilters();
                          setNext3Loader(true);
                          let dataToPost = {
                            ebaySellerAccountActive:
                              userData["ebaySellerAccountActive"],
                            similarShopifyApp: userData["similarShopifyApp"],
                            term_and_conditon:
                              userData["accept_terms_conditions"],
                            importSettingsStatus,
                            orderSettingsStatus,
                          };

                          let { success, message } = await saveUserDetails(
                            dataToPost
                          );
                          console.log("success", success);
                          if (success) {
                            await saveCompletedStep(2);
                            await saveConfiguration(temp);
                            if (importByAttribute) await importProduct();
                            else if (importByCollection)
                              await importCollectionProduct();

                            let { success, data } = await checkStepCompleted();
                            if (success) {
                              setCurrentStep(data);
                              let { success, registration_details } =
                                await getUserDetails();
                              if (success) {
                              }
                            }
                          }
                          setNext3Loader(false);
                        },
                      }}
                    >
                      <Card.Section>
                        <Stack vertical spacing="loose">
                          <Tooltip
                            preferredPosition="above"
                            content="Import Shopify products on the bases of available filter(s) or Shopify Collection"
                          >
                            <TextStyle variation="strong">
                              <span
                                style={{
                                  borderBottomStyle: "dashed",
                                  borderColor: "#00000069",
                                }}
                              >
                                Import Shopify Products
                              </span>
                            </TextStyle>
                          </Tooltip>
                          <ChoiceList
                            choices={[
                              {
                                label: (
                                  <Tooltip
                                    preferredPosition="mostSpace"
                                    content="All selected filters will apply for importing process"
                                  >
                                    <TextStyle>
                                      <span
                                        style={{
                                          borderBottomStyle: "dashed",
                                          borderColor: "#00000069",
                                        }}
                                      >
                                        Import By Filter(s)
                                      </span>
                                    </TextStyle>
                                  </Tooltip>
                                ),
                                value: "Import By Filter(s)",
                                renderChildren: () => renderImportByFilter,
                              },
                              {
                                label: "Import By Collection",
                                value: "Import Collection",
                                renderChildren: () => renderImportByCollection,
                              },
                            ]}
                            selected={selectImportShopifyProduct}
                            onChange={(e) => {
                              console.log(e);
                              if (e[0] === "Import Collection") {
                                setImportByCollection(true);
                                setImportByAttribute(false);
                              } else if (e[0] === "Import By Filter(s)") {
                                setImportByCollection(false);
                                setImportByAttribute(true);
                              }
                              setSelectImportShopifyProduct(e);
                            }}
                          />
                          <Select
                            label={
                              <Tooltip
                                preferredPosition="above"
                                content="Do you want to sync eBay orders on Shopify store?"
                              >
                                <TextStyle variation="strong">
                                  <span
                                    style={{
                                      borderBottomStyle: "dashed",
                                      borderColor: "#00000069",
                                    }}
                                  >
                                    Manage eBay orders?
                                  </span>
                                </TextStyle>
                              </Tooltip>
                            }
                            value={orderSettingsStatus ? "yes" : "no"}
                            options={[
                              { label: "Yes", value: "yes" },
                              { label: "No", value: "no" },
                            ]}
                            onChange={(e) => {
                              if (e === "yes") {
                                setOrderSettingsStatus(true);
                              } else setOrderSettingsStatus(false);
                            }}
                          />
                        </Stack>
                      </Card.Section>
                    </Card>
                  </div>
                </Layout.Section>
              </Layout>
            </Card.Section>
          )}
          {currentStep === 3 && (
            <PlansComponentAnt
              plans={plans}
              plansComponentCallback={plansComponentCallback}
              fromOnBoarding={true}
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
            />
          )}
        </Card>
        <Modal
          open={viewPlanModal}
          onClose={() => setViewPlanModal(!viewPlanModal)}
          title={"Choose a Plan"}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                Use Instagram posts to share your products with millions of
                people. Let shoppers buy from your store without leaving
                Instagram.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
        <Modal
          open={accountConnection["connectAccountModal"]}
          onClose={() =>
            setAccountConnection({
              ...accountConnection,
              connectAccountModal: false,
            })
          }
          title="Redirect to eBay?"
          primaryAction={{
            content: "Redirect",
            onAction: () => {
              setCurrentStep(currentStep + 1);
              setAccountConnection({
                ...accountConnection,
                connectAccountModal: false,
              });
            },
          }}
        ></Modal>
      </Page>
    </div>
  );
};

export const SelectComponent = ({
  label,
  value: passedValue,
  onChange: passeCallBackFunction,
  options,
  textfieldType,
  labelHidden = false,
}) => {
  const [value, setValue] = useState(passedValue);
  const onChangeFunction = (e) => {
    setValue(e);
    passeCallBackFunction(e, textfieldType);
  };
  return (
    <Select
      value={passedValue}
      label={label}
      options={options}
      onChange={onChangeFunction}
      labelHidden={labelHidden}
    />
  );
};

export const TextFieldComponent = ({
  type,
  label,
  value: passedValue,
  onChange: passeCallBackFunction,
  autoComplete,
  textfieldType,
  connectedLeft,
  prefix = "",
}) => {
  const [value, setValue] = useState(passedValue);
  const onChangeFunction = (e) => {
    setValue(e);
    passeCallBackFunction(e, textfieldType);
  };
  return (
    <TextField
      type={type}
      label={label}
      value={value}
      onChange={onChangeFunction}
      autoComplete={autoComplete}
      connectedLeft={connectedLeft}
      prefix={prefix}
    />
  );
};
