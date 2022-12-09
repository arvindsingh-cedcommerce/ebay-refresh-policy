import {
  Select,
  Stack,
  FormLayout,
  Layout,
  SkeletonDisplayText,
  SkeletonBodyText,
  Link,
  Icon,
  Tooltip,
} from "@shopify/polaris";
import { ExternalMinor, ExternalSmallMinor } from "@shopify/polaris-icons";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { getPolicies } from "../../../../../../../APIrequests/PoliciesAPI";
import { getPoliciesURL } from "../../../../../../../URLs/PoliciesURL";
import { getDomainName } from "../../../Policies/FinalPolicyGrid";

const Policy = ({
  label,
  value,
  connectedAccountsObject,
  setconnectedAccountsObject,
  ...props
}) => {
  const [policyOptions, setPolicyOptions] = useState({});
  const [loader, setLoader] = useState(false);
  const hitPolicyAPI = async () => {
    setLoader(true);
    let shippingRequestData = {
      "filter[type][1]": "shipping",
      "filter[shop_id][1]": value["shopId"],
    };
    let paymentRequestData = {
      "filter[type][1]": "payment",
      "filter[shop_id][1]": value["shopId"],
    };
    let returnRequestData = {
      "filter[type][1]": "return",
      "filter[shop_id][1]": value["shopId"],
    };
    let test = {};
    let payment_policy = [{ label: "Please Select", value: "" }];
    let shipping_policy = [{ label: "Please Select", value: "" }];
    let return_policy = [{ label: "Please Select", value: "" }];
    let { success: successShipping, data: fetchedPoliciesArrayShipping } =
      await getPolicies(getPoliciesURL, { ...shippingRequestData });
    if (successShipping) {
      fetchedPoliciesArrayShipping.forEach((policy) => {
        switch (policy["type"]) {
          case "shipping":
            shipping_policy.push({
              label: policy["title"],
              value: policy["data"]?.["profileId"].toString(),
            });
            break;
        }
      });
    }
    let {
      success: successPayment,
      data: fetchedPoliciesArrayPayment,
      //   message,
    } = await getPolicies(getPoliciesURL, { ...paymentRequestData });
    if (successPayment) {
      fetchedPoliciesArrayPayment.forEach((policy) => {
        switch (policy["type"]) {
          case "payment":
            payment_policy.push({
              label: policy["title"],
              value: policy["data"]?.["profileId"].toString(),
            });
            break;
        }
      });
    }
    let {
      success: successReturn,
      data: fetchedPoliciesArrayReturn,
      //   message,
    } = await getPolicies(getPoliciesURL, { ...returnRequestData });
    if (successReturn) {
      fetchedPoliciesArrayReturn.forEach((policy) => {
        switch (policy["type"]) {
          case "return":
            return_policy.push({
              label: policy["title"],
              value: policy["data"]?.["profileId"].toString(),
            });
            break;
        }
      });
    }
    test["payment_policy"] = payment_policy;
    test["shipping_policy"] = shipping_policy;
    test["return_policy"] = return_policy;
    setPolicyOptions(test);
    setLoader(false);
  };
  useEffect(() => {
    hitPolicyAPI();
  }, []);
  return (
    <Stack distribution="fill">
      {loader ? (
        <Layout>
          {[1, 2, 3].map((e) => {
            return (
              <Layout.AnnotatedSection
                title={<SkeletonDisplayText size="small" />}
              >
                <SkeletonBodyText lines={2} />
              </Layout.AnnotatedSection>
            );
          })}
        </Layout>
      ) : (
        <FormLayout>
          {Object.keys(policyOptions).map((policyOption, index) => {
            return (
              <Layout>
                <Layout.AnnotatedSection
                  title={
                    <Stack spacing="extraTight">
                      <>{policyOption?.split("_")?.join(" ")?.toUpperCase()}</>
                      {connectedAccountsObject[label][policyOption] && (
                        <Tooltip content="View Policy">
                          <Link
                            removeUnderline
                            onClick={(e) => {
                              let policyType = policyOption.split("_")[0];
                              let value1 =
                                connectedAccountsObject[label][policyOption];
                              // return props.history.push(
                              //   `/panel/ebay/policy/handler?type=${policyType}&id=${value}&site_id=${value["siteID"]}&shop_id=${value["shopId"]}`
                              // );
                              console.log(`https://www.bizpolicy.ebay${getDomainName(
                                value["siteID"]
                              )}/businesspolicy/${policyType.toLowerCase()}?profileId=${value1}`);
                              return window.open(
                                `https://www.bizpolicy.ebay${getDomainName(
                                  value["siteID"]
                                )}/businesspolicy/${policyType.toLowerCase()}?profileId=${value1}`,
                                "_blank"
                              );
                              // https://www.bizpolicy.ebay.pl/businesspolicy/shipping?profileId=6062591000
                              // http://amazon-ebay-multi.local.cedcommerce.com:5000/ebay/panel/ebay/policy/handler?type=shipping&id=6062591000&site_id=212&shop_id=755
                            }}
                          >
                            {/* {policyOption?.split("_")?.join(" ")?.toUpperCase()} */}
                            <Icon color="primary" source={ExternalSmallMinor} />
                          </Link>
                        </Tooltip>
                      )}
                    </Stack>
                  }
                >
                  <Select
                    key={index}
                    options={policyOptions[policyOption]}
                    // placeholder="Please Select..."
                    value={connectedAccountsObject[label][policyOption]}
                    onChange={(e) => {
                      let temp = { ...connectedAccountsObject };
                      temp[label][policyOption] = e;
                      setconnectedAccountsObject(temp);
                    }}
                    error={
                      connectedAccountsObject[label]["errors"][policyOption]
                    }
                  />
                </Layout.AnnotatedSection>
              </Layout>
            );
          })}
        </FormLayout>
      )}
    </Stack>
  );
};

export default withRouter(Policy);
