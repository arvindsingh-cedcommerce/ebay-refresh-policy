import { Select, Stack } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { getPolicies } from "../../../../../../../APIrequests/PoliciesAPI";
import { getPoliciesURL } from "../../../../../../../URLs/PoliciesURL";

const Policy = ({
  label,
  value,
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  const [policyOptions, setPolicyOptions] = useState({});
  const hitPolicyAPI = async () => {
    let requestData = {
      multitype: ["shipping", "payment", "return"],
      site_id: value["siteID"],
      shop_id: value["shopId"],
    };
    let {
      success,
      data: fetchedPoliciesArray,
      message,
    } = await getPolicies(getPoliciesURL, { ...requestData });
    if (success) {
      let test = {};
      let paymentPolicy = [];
      let shippingPolicy = [];
      let returnPolicy = [];
      fetchedPoliciesArray.forEach((policy) => {
        switch (policy["type"]) {
          case "payment":
            paymentPolicy.push({
              label: policy["title"],
              value: policy["data"]["profileId"].toString(),
            });
            break;
          case "shipping":
            shippingPolicy.push({
              label: policy["title"],
              value: policy["data"]["profileId"].toString(),
            });
            break;
          case "return":
            returnPolicy.push({
              label: policy["title"],
              value: policy["data"]["profileId"].toString(),
            });
            break;
          default:
            break;
        }
      });
      test["paymentPolicy"] = paymentPolicy;
      test["shippingPolicy"] = shippingPolicy;
      test["returnPolicy"] = returnPolicy;
      setPolicyOptions(test);
    }
  };
  useEffect(() => {
    hitPolicyAPI();
  }, []);
  return (
    <Stack distribution="fill">
      {Object.keys(policyOptions).map((policyOption) => {
        return (
          <Select
            options={policyOptions[policyOption]}
            label={policyOption.toUpperCase()}
            placeholder="Please Select..."
            value={connectedAccountsObject[label][policyOption]}
            onChange={(e) => {
              let temp = { ...connectedAccountsObject };
              temp[label][policyOption] = e;
              setconnectedAccountsObject(temp);
            }}
            key={policyOption}
          />
        );
      })}
    </Stack>
  );
};

export default Policy;
