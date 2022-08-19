import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  ChoiceList,
  FormLayout,
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
  Thumbnail,
  Tooltip,
  ProgressBar,
} from "@shopify/polaris";
import {
  ArrowLeftMinor,
  ArrowRightMinor,
  CircleInformationMajorTwotone,
  ImportMinor,
  InfoMinor,
  MobileBackArrowMajorMonotone,
  ViewMajorMonotone,
} from "@shopify/polaris-icons";
import React, { useState, useEffect } from "react";
import { json } from "../../globalConstant/static-json";
import { term_and_conditon } from "../../globalConstant/term&condition";
import {
  downloadPrivacyPolicy,
  getMobileCode,
} from "../../Subcomponents/Registration/UserDetailsAcceptTerms";
import { optionsAccountType, plansSample } from "./NewRegistrationhelper";
import {
  checkAccountsConnected,
  checkStepCompleted,
  getImportAttribute,
  // getAccountsConnection,
  getInstallationForm,
  getPlans,
  getSiteID,
  getUserDetails,
  importProduct,
  initiateVendorProductTypeFetch,
  saveCompletedStep,
  saveUserDetails,
} from "../../Apirequest/registrationApi";
import { globalState } from "../../services/globalstate";
import { environment } from "../../environment/environment";
import Switch from "react-switch";
import PlansComponent from "./PlansComponent";
import { requests } from "../../services/request";
import { isUndefined } from "lodash";
import { getConnectedAccounts } from "../../Apirequest/accountsApi";
import PlansComponentAnt from "./PlansComponentAnt";
import { Progress } from "antd";
import { configurationAPI } from "../../APIrequests/ConfigurationAPI";
import { saveAppSettingsShopifyToAppURL } from "../../URLs/ConfigurationURL";

export const alreadySellingOnEbayOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const necessaryFilterOptions = [
  // { label: "Published", value: "published" },
  // { label: "Unpublished", value: "unpublished" },
  { label: "All", value: "" },
  { label: "Web", value: "web" },
  { label: "Global", value: "global" },
];

export const accountTypeOptions = [
  { label: "Sandbox Account", value: "sandbox" },
  { label: "Live Account", value: "production" },
];

let siteID = false;
let domain = [];

export const NewRegistration = (props) => {
  const totalSteps = 5;
  const steps = [
    "Tell Us About Yourself",
    "Get your account linked",
    "Choose a plan",
  ];

  const [currentStep, setCurrentStep] = useState(undefined);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile_code: "+91",
    mobile: "",
    country: "IN",
    where_do_you_know_to_come_about_us: "Shopify App Store",
    accept_terms_conditions: false,
    disconnected_all_other_apps: false,
    countryConnected: "0",
  });

  const [viewPlanModal, setViewPlanModal] = useState(false);
  const [accountTypeValue, setAccountTypeValue] = useState(
    accountTypeOptions[0]["value"]
  );

  const { country_mobile_code, sources, flag_country } = json;
  const [accountConnection, setAccountConnection] = useState({
    accountType: optionsAccountType[0]["value"],
    countryConnected: flag_country[0]["value"],
    countryImage: flag_country[0]["flag"],
    connectAccountModal: false,
  });

  const [alreadySellingOnEbayValue, setAlreadySellingOnEbay] = useState(
    alreadySellingOnEbayOptions[0]["value"]
  );

  const [necessaryFilterValue, setNecessaryFilterValue] = useState([""]);

  const [plans, setPlans] = useState(plansSample);
  const [importProductFilters, setImportProductFilters] = useState({
    productType: {
      label: "Product Type",
      options: [],
      value: "",
      enable: "no",
    },
    vendor: {
      options: [],
      value: "",
      label: "Vendor",
      enable: "no",
    },
  });
  const [optionalFilters, setOptionalFilters] = useState(true);
  const [errors, setErrors] = useState({});
  const [shopUrlLink, setShopUrlLink] = useState("");
  const hitGetPlans = async () => {
    let plans = await getPlans();
    // if (plans.success) {
    //   let { data } = plans;
    //   console.log('plans', data)
    //   // let { step_data, active_step } = this.state;
    //   // step_data[active_step]["data"]["plans"] = [...data.data.rows];
    //   // this.setState({ step_data });
    // }
  };

  const hitGetSideID = async () => {
    let data = await getSiteID();
    console.log("data", data);
    // requests.getRequest("ebayV1/get/siteId").then((data) => {
    //   if (data.success) {
    //     siteID = !isUndefined(data.data.site_id) ? data.data.site_id : false;
    //     domain = json.country.filter((name) => name.siteId === siteID);
    //   }
    // });
    // this.setState(this.state);
  };

  const plansComponentCallback = () => {
    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    // hitGetPlans();
    // hitGetSideID();

    async function fetchMyAPI() {
      await callConnectedAccounts()
      let { success: checkStepCompletedSuccess, data } =
        await checkStepCompleted();
      data === 3 && (await hitAPIsForVendorProductType());
      if (checkStepCompletedSuccess) {
        setCurrentStep(data);
      }
      let { success: getUserDetailsSuccess, registration_details } =
        await getUserDetails();
      if (getUserDetailsSuccess && registration_details) {
        setUserData({
          ...userData,
          accept_terms_conditions: registration_details["term_and_conditon"]
            ? registration_details["term_and_conditon"]
            : false,
          disconnected_all_other_apps: registration_details[
            "disconnected_all_other_apps"
          ]
            ? registration_details["disconnected_all_other_apps"]
            : false,
        });
      }
    }
    fetchMyAPI();
  }, []);

  useEffect(() => {
    // console.log("currentStep", currentStep);
  }, [currentStep]);

  const redirect = (url) => {
    props.history.push(url);
  };

  useEffect(() => {
    if (currentStep === totalSteps) {
      // setTimeout(() => {
      redirect("/panel");
      // }, 4000);
    }
    if (currentStep > 5) {
      redirect("/panel");
    }
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
    // let data = await getInstallationForm({
    //   code: "eBay",
    //   site_id: accountConnection["countryConnected"],
    //   mode: accountConnection["accountType"],
    //   bearer: globalState.getLocalStorage("auth_token"),
    // });
    // setAccountConnection({
    //   ...accountConnection,
    //   connectAccountModal: true,
    // });
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
  const getPercentage = () => (currentStep + 1) * 20;

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
        temp["productType"]["options"] = prepareOptions(data?.product_type);
        temp["vendor"]["options"] = prepareOptions(data?.vendor);
        setImportProductFilters(temp);
      }
    }
  };

  const checkForValidation = (data) => {
    const tempErrObj = {};
    let errorFlag = false;
    Object.keys(data).forEach((key) => {
      switch (key) {
        case "vendor":
          if (
            data?.[key]?.["enable"] === "yes" &&
            data?.[key]?.["value"] === ""
          ) {
            tempErrObj[key] = "Please select vendor...";
            errorFlag = true;
          }
          break;
        case "productType":
          if (
            data?.[key]?.["enable"] === "yes" &&
            data?.[key]?.["value"] === ""
          ) {
            tempErrObj[key] = "Please select product type...";
            errorFlag = true;
          }
          break;
        default:
          break;
      }
    });
    setErrors(tempErrObj);
    return errorFlag;
  };
  const prepareDataForImportProductFilters = () => {
    const temp = {};
    Object.keys(importProductFilters).forEach((obj) => {
      if (importProductFilters[obj]["enable"] === "yes") {
        temp[obj] = {
          value: importProductFilters[obj]["value"],
          enable: importProductFilters[obj]["enable"],
        };
      }
    });
    // {
    //   "match_from_ebay": {
    //     "enable": "no",
    //     "match_from_ebay": []
    //   }
    // }
    temp["publishedStatus"] = {
      enable: necessaryFilterValue[0] ? "yes" : "no",
      value: necessaryFilterValue[0],
    };
    temp["match_from_ebay"] = {
      enable: alreadySellingOnEbayValue,
      attributeMapping: [
        {
          shopify_attribute: "title",
          ebay_attribute: "Title",
        },
        {
          shopify_attribute: "sku",
          ebay_attribute: "SKU",
        },
      ],
    };
    return temp;
  };
  const callConnectedAccounts = async () => {
    let { success: connectConnectionSuccess, data: connectedAccounts } =
      await getConnectedAccounts();
    if (connectConnectionSuccess) {
      const shopifyAccount = connectedAccounts.find(
        (account) => account.marketplace === "shopify"
      );
      if (shopifyAccount && shopifyAccount?.shop_url) {
        const url = `https://${shopifyAccount.shop_url}/admin/apps`;
        setShopUrlLink(url);
      }
    }
  };
  return (
    <Page fullWidth>
      <Card>
        <Card.Section>
          <Progress percent={getPercentage()} />
        </Card.Section>
        {(currentStep === 0 ||
          currentStep === 1 ||
          currentStep === 2 ||
          currentStep === 3) && (
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
                          minHeight: "100%",
                        }
                      : {
                          pointerEvents: "none",
                          opacity: 0.8,
                          minHeight: "100vh",
                        }
                  }
                >
                  <Card
                    title="Account Essentials"
                    primaryFooterAction={{
                      content: "Next",
                      onAction: async () => {
                        let dataToPost = {
                          term_and_conditon:
                            userData["accept_terms_conditions"],
                        };
                        let { success, message } = await saveUserDetails(
                          dataToPost
                        );
                        if (success) {
                          await callConnectedAccounts();
                          await saveCompletedStep(0);
                          let { success, data } = await checkStepCompleted();
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
                                accept_terms_conditions:
                                  registration_details["term_and_conditon"],
                              });
                            }
                          }
                        }
                      },
                      disabled: !userData["accept_terms_conditions"],
                    }}
                  >
                    <Card.Section title="Primary Access to the Professional Seller Account">
                      <TextStyle variation="subdued">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.
                      </TextStyle>
                    </Card.Section>
                    <Card.Section title="Account should not be Suspended, Inactive or in Vacation mode">
                      <TextStyle variation="subdued">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.
                      </TextStyle>
                    </Card.Section>
                    <Card.Section title={"privacy policy"}>
                      <Stack vertical={true} spacing={"loose"}>
                        <div style={{ maxHeight: 130, overflowY: "scroll" }}>
                          {term_and_conditon()}
                        </div>
                        <Stack vertical={false} alignment="baseline">
                          <Checkbox
                            label="Accept terms and conditions"
                            checked={userData["accept_terms_conditions"]}
                            onChange={(e) =>
                              callBackFunction(e, "accept_terms_conditions")
                            }
                          />
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={downloadPrivacyPolicy}
                          >
                            <Tooltip content={"Download privacy policy"}>
                              <Icon source={ImportMinor} color={"blueDark"} />
                            </Tooltip>
                          </div>
                        </Stack>
                      </Stack>
                    </Card.Section>
                  </Card>
                </div>
              </Layout.Section>
              <Layout.Section oneThird>
                <div
                  style={{
                    minHeight: "100%",
                  }}
                >
                  <Stack vertical spacing="tight">
                    <div
                      style={
                        currentStep === 1
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
                          "Do not use any other eBay Shopify Integration App"
                        }
                        primaryFooterAction={{
                          content: "Next",
                          onAction: async () => {
                            let dataToPost = {
                              disconnected_all_other_apps:
                                userData["disconnected_all_other_apps"],
                              term_and_conditon:
                                userData["accept_terms_conditions"],
                            };
                            let { success, message } = await saveUserDetails(
                              dataToPost
                            );

                            if (success) {
                              await saveCompletedStep(1);

                              let { success, data } =
                                await checkStepCompleted();
                              if (success) {
                                setCurrentStep(data);
                                let { success, registration_details } =
                                  await getUserDetails();
                                if (success && registration_details) {
                                  setUserData({
                                    ...userData,
                                    accept_terms_conditions:
                                      registration_details[
                                        "disconnected_all_other_apps"
                                      ],
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
                                      await saveCompletedStep(2);
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
                                  // let { success: connectConnectionSuccess } =
                                  //   await getConnectedAccounts();
                                  // if (!connectConnectionSuccess)
                                  // else {
                                  // let {
                                  //   success: nextStepSuccess,
                                  //   data: current_step,
                                  // } = await checkStepCompleted();
                                  // if (nextStepSuccess) {
                                  //   setCurrentStep(current_step);
                                  // }
                                  // }
                                }
                              }
                            }
                          },
                          disabled: !userData["disconnected_all_other_apps"],
                        }}
                        // secondaryFooterActions={[
                        //   { content: "Back", onAction: () => {} },
                        // ]}
                      >
                        <Card.Section title="If you are using any another eBay Integration App, disconnect it.">
                          <Stack vertical>
                            <TextStyle variation="subdued">
                              Lorem Ipsum is simply dummy text of the printing
                              and typesetting industry. Lorem Ipsum has been the
                              industry's standard dummy text ever since the
                              1500s.
                            </TextStyle>
                            <TextStyle variation="strong">
                              To disconnect your installed eBay apps,{" "}
                              <Link url={shopUrlLink}>click here</Link>
                            </TextStyle>
                            <Banner status={currentStep === 1 && "success"}>
                              <p>
                                Still not sure? <Link url="">Read Doc</Link>
                              </p>
                            </Banner>
                          </Stack>
                        </Card.Section>
                        <Card.Section>
                          <Checkbox
                            label="I have disconnected all other eBay apps."
                            checked={userData["disconnected_all_other_apps"]}
                            onChange={(e) =>
                              callBackFunction(e, "disconnected_all_other_apps")
                            }
                          />
                        </Card.Section>
                      </Card>
                    </div>
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
                        sectioned
                        primaryFooterAction={{
                          content: "Connect",
                          onAction: () => {
                            getAppInstallationForm(
                              userData["countryConnected"]
                            );
                          },
                          // onAction: async () => {
                          //   let { success: accountConnectSuccesfully } =
                          //     await getAccountsConnection();
                          //   if (accountConnectSuccesfully) {
                          //     await saveCompletedStep(2);
                          //     let { success, data } =
                          //       await checkStepCompleted();
                          //     if (success) {
                          //       setCurrentStep(data);
                          //       let { success, data: getDetails } =
                          //         await getUserDetails();
                          //       if (success) {
                          //         console.log(getDetails);
                          //       }
                          //     }
                          //   }
                          //   setCurrentStep(currentStep + 1);
                          // },
                          disabled: currentStep !== 2,
                        }}
                      >
                        <Stack
                          vertical={false}
                          distribution="equalSpacing"
                          alignment="center"
                        >
                          <TextStyle variation="strong">
                            Account Connection
                          </TextStyle>
                          <Thumbnail
                            source={
                              "https://ebay.sellernext.com/marketplace-logos/ebay.png"
                            }
                            size="small"
                          />
                        </Stack>
                        <Stack
                          vertical={false}
                          distribution="fillEvenly"
                          alignment="center"
                        >
                          {/* <TextStyle variation="strong">Account Connection</TextStyle> */}
                          <SelectComponent
                            options={accountTypeOptions}
                            value={accountConnection["accountType"]}
                            onChange={callBackFunction}
                            textfieldType={"accountType"}
                          />
                          <SelectComponent
                            options={flag_country}
                            value={accountConnection["countryConnected"]} //
                            onChange={callBackFunction}
                            textfieldType={"countryConnected"}
                          />
                        </Stack>
                      </Card>
                    </div>
                  </Stack>
                </div>
              </Layout.Section>
              <Layout.Section oneThird>
                <div
                  style={
                    currentStep === 3
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
                    title={"Map eBay and Shopify fields"}
                    primaryFooterAction={{
                      content: "Next",
                      // onAction: () => setCurrentStep(currentStep + 1),
                      onAction: async () => {
                        const temp = prepareDataForImportProductFilters();
                        const errorInValidation = checkForValidation(temp);
                        if (!errorInValidation) {
                          let dataToPost = {
                            disconnected_all_other_apps:
                              userData["disconnected_all_other_apps"],
                            term_and_conditon:
                              userData["accept_terms_conditions"],
                          };
                          // let dataToPost = {
                          //   // alreadySellingOnEbayValue: alreadySellingOnEbayValue,
                          //   // necessaryFilterValue: necessaryFilterValue,
                          // };
                          let { success, message } = await saveUserDetails(
                            dataToPost
                          );

                          if (success) {
                            await saveCompletedStep(3);
                            await configurationAPI(
                              saveAppSettingsShopifyToAppURL,
                              {
                                import_settings: temp,
                                setting_type: "import_settings",
                              }
                            );
                            await importProduct();

                            let { success, data } = await checkStepCompleted();
                            if (success) {
                              setCurrentStep(data);
                              let { success, data: getDetails } =
                                await getUserDetails();
                              if (success) {
                                console.log(getDetails);
                              }
                            }
                          }
                        }
                      },
                      disabled: currentStep !== 3,
                    }}
                  >
                    <Card.Section title="If you are already selling on eBay, then you need to map your Title(s) and SKU(s) between eBay and Shopify. This will help us in recognizing your already existing products on eBay and hence avoiding any sort of duplicity issues."></Card.Section>
                    <Card.Section>
                      <Stack vertical spacing="tight">
                        <Stack spacing="tight">
                          <TextStyle>
                            Are you already selling on eBay?
                          </TextStyle>
                          <Tooltip
                            // active
                            preferredPosition="above"
                            content="To map only one option, please visit the configuration section after onboarding."
                          >
                            <Icon source={ViewMajorMonotone} color="base" />
                          </Tooltip>
                        </Stack>
                        <Select
                          label=""
                          // label={
                          //   <Tooltip
                          //     active
                          //     content="This order has shipping labels."
                          //   >
                          //     <>Are you already selling on eBay?</>
                          //   </Tooltip>
                          // }
                          options={alreadySellingOnEbayOptions}
                          value={alreadySellingOnEbayValue}
                          onChange={(e) => setAlreadySellingOnEbay(e)}
                        />
                        {/* <Banner
                          action={{
                            content: "Refetch filter",
                            onAction: () => initiatefetchVendorProductType(),
                          }}
                          status={currentStep === 3 && "success"}
                        >
                          <p>We are about to import products from Shopify</p>
                        </Banner> */}
                      </Stack>
                    </Card.Section>
                    <Card.Section title="Optional Filters">
                      {/* <Checkbox
                        label="Optional Filters"
                        checked={optionalFilters}
                        onChange={() => setOptionalFilters(!optionalFilters)}
                      /> */}
                      {optionalFilters && (
                        <Stack>
                          <Checkbox
                            label="Vendor"
                            checked={
                              importProductFilters["vendor"]["enable"] === "yes"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              let temp = { ...importProductFilters };
                              temp["vendor"]["enable"] =
                                e === true ? "yes" : "no";
                              // !importProductFilters["vendor"]["enable"];
                              setImportProductFilters(temp);
                            }}
                          />
                          <Checkbox
                            label="Product type"
                            checked={
                              importProductFilters["productType"]["enable"] ===
                              "yes"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              let temp = { ...importProductFilters };
                              temp["productType"]["enable"] =
                                e === true ? "yes" : "no";
                              // !importProductFilters["productType"]["enable"];
                              setImportProductFilters(temp);
                            }}
                          />
                        </Stack>
                      )}
                    </Card.Section>
                    {optionalFilters &&
                      (importProductFilters["productType"]["enable"] ===
                        "yes" ||
                        importProductFilters["vendor"]["enable"] === "yes") && (
                        <Card.Section>
                          <Stack distribution="fillEvenly">
                            {importProductFilters["vendor"]["enable"] ===
                              "yes" && (
                              <Select
                                label="Vendor"
                                value={importProductFilters["vendor"]["value"]}
                                options={
                                  importProductFilters["vendor"]["options"]
                                }
                                onChange={(e) => {
                                  setErrors({ ...errors, vendor: false });
                                  let temp = { ...importProductFilters };
                                  temp["vendor"]["value"] = e;
                                  setImportProductFilters(temp);
                                }}
                                error={errors["vendor"]}
                              />
                            )}
                            {importProductFilters["productType"]["enable"] ===
                              "yes" && (
                              <Select
                                label="Product Type"
                                value={
                                  importProductFilters["productType"]["value"]
                                }
                                options={
                                  importProductFilters["productType"]["options"]
                                }
                                onChange={(e) => {
                                  setErrors({ ...errors, productType: false });
                                  let temp = { ...importProductFilters };
                                  temp["productType"]["value"] = e;
                                  setImportProductFilters(temp);
                                }}
                                error={errors["productType"]}
                              />
                            )}
                          </Stack>
                        </Card.Section>
                      )}
                    <Card.Section
                      title="necessary filter"
                      actions={[
                        {
                          content: "Refetch vendor and product type",
                          onAction: () => initiatefetchVendorProductType(),
                        },
                      ]}
                    >
                      <ChoiceList
                        title="Kindly select the status of product you want to import"
                        choices={necessaryFilterOptions}
                        selected={necessaryFilterValue}
                        onChange={(e) => {
                          setNecessaryFilterValue(e);
                        }}
                      />
                    </Card.Section>
                  </Card>
                </div>
              </Layout.Section>
            </Layout>
          </Card.Section>
        )}
        {currentStep === 4 && (
          // <PlansComponent
          //   plans={plans}
          //   plansComponentCallback={plansComponentCallback}
          //   fromOnBoarding={true}
          //   setCurrentStep={setCurrentStep}
          //   currentStep={currentStep}
          // />
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
          // onAction: handleChange,
          onAction: () => {
            setCurrentStep(currentStep + 1);
            setAccountConnection({
              ...accountConnection,
              connectAccountModal: false,
            });
          },
        }}
      >
        {/* <Modal.Section>
          <TextContainer>
            <p>
              Use Instagram posts to share your products with millions of
              people. Let shoppers buy from your store without leaving
              Instagram.
            </p>
          </TextContainer>
        </Modal.Section> */}
      </Modal>
    </Page>
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
