import { Button, FooterHelp, Link, TextStyle, Tooltip } from "@shopify/polaris";
import { PageHeader } from "antd";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import {
  getProfilebyId,
  saveProfile,
} from "../../../../../../Apirequest/ebayApirequest/profileApi";
import { getTemplatesPost } from "../../../../../../APIrequests/TemplatesAPI";
import { tokenExpireValues } from "../../../../../../HelperVariables";
import { parseQueryString } from "../../../../../../services/helperFunction";
import { notify } from "../../../../../../services/notify";
import { getTemplatesURL } from "../../../../../../URLs/TemplateURLS";
import { getCountryName } from "../../../../Accounts/NewAccount";
import AccountSelectionTab from "./Components/Tabs/AccountSelectionTab";
import NewFilterProductsTab from "./Components/Tabs/NewFilterProductsTab";

const CreateProfilePolaris = (props) => {
  const [id, setId] = useState("");
  const [profileName, setProfileName] = useState("");
  const [templateOptions, setTemplateOptions] = useState({});
  const [connectedAccountsObject, setconnectedAccountsObject] = useState({});
  const [shopifyWarehouses, setShopifyWarehouses] = useState([]);
  const [minProductFlag, setMinProductFlag] = useState(false);
  const [prepareQuery, setPrepareQuery] = useState({
    query: "",
    querySentence: "",
    queryArray: [],
  });
  const [panes, setPanes] = useState([]);
  const [overriceCheckboxStatus, setOverriceCheckboxStatus] = useState(false);
  const [alreadyProfiledProductsCount, setAlreadyProfiledProductsCount] =
    useState(0);

  // flag variable
  const [updatedConnectedAccountObject, setUpdatedConnectedAccountObject] =
    useState(false);

  // errors
  const [profileNameError, setProfileNameError] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);

  // loaders
  const [profileSaveBtnLoader, setProfileSaveBtnLoader] = useState(false);
  const [profileDataSkeleton, setProfileDataSkeleton] = useState(true);

  const dumpTemplatePolicyWarehouse = (extractedAccount) => {
    let test = {};
    for (const key in extractedAccount) {
      switch (key) {
        case "checked":
          break;
        case "shopId":
          break;
        case "siteID":
          break;
        case "value":
          break;
        case "warehouse_setting":
          break;
        case "errors":
          break;
        case "status":
          break;
        default:
          test[key] = extractedAccount[key];
          break;
      }
    }
    return test;
  };

  const validationCheck = () => {
    Object.keys(connectedAccountsObject).forEach((account) => {
      if (connectedAccountsObject[account]["checked"]) {
        Object.keys(connectedAccountsObject[account]).forEach((field) => {
          if (
            ![
              "errors",
              "checked",
              "shopId",
              "siteID",
              "value",
              "warehouse_setting",
            ].includes(field)
          ) {
            if (
              [
                "category_template",
                "shipping_policy",
                "return_policy",
                "payment_policy",
              ].includes(field)
            ) {
              if (connectedAccountsObject[account][field] === "") {
                let temp = { ...connectedAccountsObject };
                temp[account]["errors"][field] = true;
                setconnectedAccountsObject(temp);
              } else {
                let temp = { ...connectedAccountsObject };
                temp[account]["errors"][field] = false;
                setconnectedAccountsObject(temp);
              }
            }
          }
        });
      }
    });
    setCheckboxError(true);
    Object.keys(connectedAccountsObject).forEach((account) => {
      if (connectedAccountsObject[account]["checked"]) setCheckboxError(false);
    });
    if (profileName === "") {
      setProfileNameError(true);
    }
  };

  const hasErrorCheck = () => {
    let flag = false;
    Object.keys(connectedAccountsObject).forEach((account) => {
      if (connectedAccountsObject[account]["checked"]) {
        Object.keys(connectedAccountsObject[account]["errors"]).forEach(
          (field) => {
            if (connectedAccountsObject[account]["errors"][field]) {
              flag = true;
            }
          }
        );
      }
    });
    const checkAccountStatusChecked = Object.keys(
      connectedAccountsObject
    ).every((account) => !connectedAccountsObject[account].checked);
    if (checkAccountStatusChecked) {
      flag = true;
    }
    if (profileName === "") {
      flag = true;
    }
    return flag;
  };
  const saveFunc = async (test) => {
    let postData = {
      saveInTable: true,
      name: profileName,
      prepareQuery,
      data: test,
      override: overriceCheckboxStatus,
    };
    if (id !== "") postData["profile_id"] = id;
    setProfileSaveBtnLoader(true);
    let { success, message, code, matching_profiles } = await saveProfile(
      postData
    );
    if (success) {
      notify.success(message);
      props.history.push("/panel/ebay/profiles/grid");
    } else {
      notify.error(message);
    }
  };
  const saveProfileAction = async () => {
    let test = {};
    validationCheck();
    if (hasErrorCheck()) {
      console.log("error");
      notify.error("Please fill all required fields...");
    } else if (!minProductFlag) {
      notify.error("Minimum 1 Product Required to create Profile");
    } else {
      console.log("save no error");
      Object.keys(connectedAccountsObject).forEach((account) => {
        if (connectedAccountsObject[account]["checked"]) {
          let templatePolicyWarehouse = dumpTemplatePolicyWarehouse(
            connectedAccountsObject[account]
          );
          test[connectedAccountsObject[account]["shopId"]] = {
            data: templatePolicyWarehouse,
            site_id: connectedAccountsObject[account]["siteID"],
          };
        }
      });
      // console.log(
      //   "overriceCheckboxStatus",
      //   overriceCheckboxStatus,
      //   "alreadyProfiledProductsCount",
      //   alreadyProfiledProductsCount
      // );
      if (alreadyProfiledProductsCount == 0 && !overriceCheckboxStatus)
        await saveFunc(test);
      else if (alreadyProfiledProductsCount > 0 && overriceCheckboxStatus)
        await saveFunc(test);
      else
        notify.error(
          "All products are aligned in other profile allow override to save the profile or filter different products"
        );
      // let postData = {
      //   saveInTable: true,
      //   name: profileName,
      //   prepareQuery,
      //   data: test,
      //   override: overriceCheckboxStatus,
      // };
      // if (id !== "") postData["profile_id"] = id;
      // setProfileSaveBtnLoader(true);
      // let { success, message, code, matching_profiles } = await saveProfile(
      //   postData
      // );
      // if (success) {
      //   notify.success(message);
      //   props.history.push("/panel/ebay/profiles/grid");
      // } else {
      //   notify.error(message);
      // }
      setProfileSaveBtnLoader(false);
    }
  };

  const hitTemplateAPI = async () => {
    let requestData = {
      multitype: ["category", "price", "inventory", "title"],
      marketplace: "ebay",
    };
    let { success, data: fetchedTemplatesArray } = await getTemplatesPost(
      getTemplatesURL,
      requestData
    );
    if (success) {
      let test = {};
      let category_template = [];
      let title_template = [{ label: "Please Select", value: "" }];
      let inventory_template = [{ label: "Please Select", value: "" }];
      let price_template = [{ label: "Please Select", value: "" }];
      fetchedTemplatesArray.forEach((template) => {
        switch (template["type"]) {
          case "category":
            category_template.push({
              label: template["title"],
              value: template["_id"].toString(),
              account: Object.keys(connectedAccountsObject).filter(
                (account) =>
                  connectedAccountsObject[account]["shopId"] ==
                  template["data"]["shop_id"]
                // connectedAccountsObject[account]["siteID"] ===
                // template["data"]["site_id"]
              )[0],
              siteId: template['data']['site_id'],
              shopId: template['data']['shop_id']
            });
            break;
          case "title":
            title_template.push({
              label: template["title"],
              value: template["_id"].toString(),
            });
            break;
          case "inventory":
            inventory_template.push({
              label: template["title"],
              value: template["_id"].toString(),
            });
            break;
          case "price":
            price_template.push({
              label: template["title"],
              value: template["_id"].toString(),
            });
            break;
          default:
            break;
        }
      });
      test["category_template"] = category_template;
      test["title_template"] = title_template;
      test["inventory_template"] = inventory_template;
      test["price_template"] = price_template;
      setTemplateOptions(test);
    }
  };

  const extractShopifyWarehouses = (accounts) => {
    let temp = accounts.map((account) => {
      let test = {
        helptext: `${account.shop_url}(${account.country})`,
        warehouses: [],
      };
      test["warehouses"] = account?.warehouses.map((warehouse) => {
        return {
          label: warehouse.name,
          value: warehouse.name,
          helpText: `${account.shop_url}(${account.country})`,
        };
      });
      return test;
    });
    return temp;
  };
  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
      code,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let shopifyAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "shopify"
      );
      let ebayAccountsObj = {};
      ebayAccounts.forEach((account, key) => {
        let temp = {};
        temp["value"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["status"] = account["warehouses"][0]["status"];
        temp["shopId"] = account["id"];
        temp["errors"] = {
          category_template: false,
          payment_policy: false,
          shipping_policy: false,
          return_policy: false,
        };
        temp["checked"] = false;
        temp["category_template"] = "";
        temp["inventory_template"] = "";
        temp["title_template"] = "";
        temp["price_template"] = "";
        temp["payment_policy"] = "";
        temp["shipping_policy"] = "";
        temp["return_policy"] = "";
        ebayAccountsObj[
          `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`
        ] = { ...temp };
      });
      setconnectedAccountsObject(ebayAccountsObj);
      setUpdatedConnectedAccountObject(true);
    } else {
      notify.error(message);
      if (tokenExpireValues.includes(code)) props.history.push("/auth/login");
    }
  };

  useEffect(() => {
    if (updatedConnectedAccountObject) {
      getParams();
      hitTemplateAPI();
    }
  }, [updatedConnectedAccountObject]);

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  const extractAccounts = (target) => {
    let temp = {};
    for (const account in target) {
      for (const key in target[account]) {
        for (const shopid in target[account][key]) {
          temp[shopid] = target[account][key][shopid];
        }
      }
    }
    let test = { ...connectedAccountsObject };
    let tempPanes = [...panes];
    Object.keys(test).forEach((account) => {
      Object.keys(temp).forEach((shopid) => {
        if (shopid == test[account]["shopId"]) {
          test[account]["checked"] = true;
          for (const key in temp[shopid]["data"]) {
            test[account][key] = temp[shopid]["data"][key];
          }
          if (test[account]["checked"]) {
            tempPanes = [
              ...tempPanes,
              {
                title: test[account]["value"],
                content: "",
                key: account,
                closable: false,
                siteID: test[account]["siteID"],
                status: test[account]["status"],
              },
            ];
          }
        }
      });
    });
    setPanes(tempPanes);
    setconnectedAccountsObject(test);
  };
  const getParams = async () => {
    let { id } = parseQueryString(props.location.search);
    if (id) {
      let { success, data } = await getProfilebyId(id);
      if (success && data) {
        let { prepareQuery, target, name } = data;
        setId(id);
        setProfileName(name);
        extractAccounts(target);
        setPrepareQuery(prepareQuery);
      }
    }
    setProfileDataSkeleton(false);
  };
  return (
    <PageHeader
      className="site-page-header-responsive"
      title={
        id === "" ? (
          <Tooltip
            content="Every product must associated with one profile. profile provides feature to set variation conditions on group of products"
            preferredPosition="above"
          >
            <TextStyle variation="strong">
              <span
                style={{
                  borderBottomStyle: "dashed",
                  borderColor: "#00000069",
                }}
              >
                Create profile
              </span>
            </TextStyle>
          </Tooltip>
        ) : (
          <Tooltip
            content="Every product must associated with one profile. Profile provides feature to set variation conditions on group of products"
            preferredPosition="above"
          >
            <TextStyle variation="strong">
              <span
                style={{
                  borderBottomStyle: "dashed",
                  borderColor: "#00000069",
                }}
              >
                View profile
              </span>
            </TextStyle>
          </Tooltip>
        )
      }
      ghost={true}
      onBack={() => props.history.push("/panel/ebay/profiles/grid")}
      extra={[
        <Button
          primary
          onClick={() => saveProfileAction()}
          loading={profileSaveBtnLoader}
        >
          Save
        </Button>,
      ]}
    >
      <AccountSelectionTab
        profileName={profileName}
        setProfileName={setProfileName}
        connectedAccountsObject={connectedAccountsObject}
        setconnectedAccountsObject={setconnectedAccountsObject}
        templateOptions={templateOptions}
        shopifyWarehouses={shopifyWarehouses}
        panes={panes}
        setPanes={setPanes}
        checkboxError={checkboxError}
        setCheckboxError={setCheckboxError}
        profileNameError={profileNameError}
        setProfileNameError={setProfileNameError}
        profileDataSkeleton={profileDataSkeleton}
      />
      <br />
      {Object.keys(connectedAccountsObject).some(
        (account) => connectedAccountsObject[account].checked
      ) && (
        <NewFilterProductsTab
          setMinProductFlag={setMinProductFlag}
          setPrepareQuery={setPrepareQuery}
          savedQuery={prepareQuery}
          profileDataSkeleton={profileDataSkeleton}
          profileId={id}
          overriceCheckboxStatus={overriceCheckboxStatus}
          setOverriceCheckboxStatus={setOverriceCheckboxStatus}
          alreadyProfiledProductsCount={alreadyProfiledProductsCount}
          setAlreadyProfiledProductsCount={setAlreadyProfiledProductsCount}
        />
      )}
      <FooterHelp>
        Learn more about{" "}
        <Link
          external
          // url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=editing-and-creating-a-profile"
          url="https://docs.cedcommerce.com/shopify/integration-ebay-multi-account/?section=how-to-create-a-profile-7"
        >
          Create Profile
        </Link>
      </FooterHelp>
    </PageHeader>
  );
};

export default withRouter(CreateProfilePolaris);
