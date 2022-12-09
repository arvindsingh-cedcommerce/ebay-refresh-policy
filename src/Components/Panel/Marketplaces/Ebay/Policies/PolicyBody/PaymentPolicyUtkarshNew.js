import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  FormLayout,
  Layout,
  Modal,
  Stack,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import { isUndefined } from "lodash";
import React, { useEffect, useState } from "react";
import {
  getBusinessPolicy,
  saveBusinessPolicy,
} from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import SkeletonPaymentPolicy from "../../SkeletonComponents/Policy/SkeletonPaymentPolicy";
import { withRouter } from "react-router-dom";
import { notify } from "../../../../../../services/notify";
import { Typography } from "antd";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { json } from "../../../../../../globalConstant/static-json";

const { Title } = Typography;

const PaymentPolicyUtkarshNew = (props) => {
  const { site_id, type, shop_id, id } = props;
  const [dataReceivedFromAPI, setDataReceivedFromAPI] = useState(true);

  // account status
  const [accountStatus, setAccountStatus] = useState("active");

  // domain name
  const [domainName, setDomainName] = useState("");

  const extractDataFromAPI = (data) => {
    setName(data["title"]);
    setDescription(data["data"]["description"]);
    setImmediatePay(data["data"]["immediatePay"]);
    if (data["data"]["paymentMethods"] && !data["data"]["immediatePay"]) {
      const recievedPaymentOptions = data["data"]["paymentMethods"].map(
        (option) => option.paymentMethodType
      );
      let tempPaypalEmail = data["data"]["paymentMethods"].find(
        (e) => e["paymentMethodType"] === "PAYPAL"
      );
      if (tempPaypalEmail?.recipientAccountReference?.referenceId) {
        setReferenceId(tempPaypalEmail.recipientAccountReference.referenceId);
        setPayPalSelected(true);
      }
      let tempCreditCardBrands = data["data"]["paymentMethods"].find(
        (e) => e["paymentMethodType"] === "CREDIT_CARD"
      );
      if (tempCreditCardBrands?.brands) {
        const tempOptions = [...creditCardBrands];
        const modifiedTempOptions = tempOptions.map((option) => {
          if (tempCreditCardBrands.brands.includes(option.value)) {
            option.flag = true;
            return option;
          }
          return option;
        });
        setCreditCardBrands(modifiedTempOptions);
        setCreditCardSelected(true);
      }

      const tempOptions = [...options];
      const modifiedTempOptions = tempOptions.map((option) => {
        if (recievedPaymentOptions.includes(option.value)) {
          option.flag = true;
          return option;
        }
        return option;
      });
      setOptions(modifiedTempOptions);
    } else if (data["data"]["paymentMethods"] && data["data"]["immediatePay"]) {
      const tempOptions = [...onlyPayPalOptions];
      const recievedPaymentOptions = data["data"]["paymentMethods"].map(
        (option) => option.paymentMethodType
      );
      const modifiedTempOptions = tempOptions.map((option) => {
        if (recievedPaymentOptions.includes(option.value)) {
          option.flag = true;
          return option;
        }
        return option;
      });
      setOnlyPayPalOptions(modifiedTempOptions);
      let tempPaypalEmail = data["data"]["paymentMethods"].find(
        (e) => e["paymentMethodType"] === "PAYPAL"
      );
      if (tempPaypalEmail?.recipientAccountReference?.referenceId) {
        setOnlyPayPalOptionsReferenceId(
          tempPaypalEmail.recipientAccountReference.referenceId
        );
      }
    }
  };

  const getDomainName = (siteId) => {
    let countryName = json.flag_country.filter(
      (sites) => sites.value === siteId
    );
    if (countryName.length) {
      return countryName[0]?.domainName;
    }
    return "-";
  };

  const hitAPI = async () => {
    if (!isUndefined(id)) {
      setDomainName(getDomainName(site_id));
      let { success, data } = await getBusinessPolicy(id);
      if (success) {
        setDataReceivedFromAPI(false);
        extractDataFromAPI(data);
      }
    }
  };

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    let ebayAccountsObj = [];
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      ebayAccounts.forEach((account, key) => {
        if (account?.id == shop_id) {
          setAccountStatus(account["warehouses"][0]["status"]);
        }
      });
    } else {
    }
  };
  useEffect(() => {
    hitAPI();
    getAllConnectedAccounts();
  }, []);

  const [saveLoader, setSaveLoader] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [immediatePay, setImmediatePay] = useState(false);
  //   immediatePay false
  const [options, setOptions] = useState([
    { label: "PAYPAL", value: "PAYPAL", flag: false },
    { label: "CASHIER_CHECK", value: "CASHIER_CHECK", flag: false },
    { label: "CASH_IN_PERSON", value: "CASH_IN_PERSON", flag: false },
    { label: "CASH_ON_DELIVERY", value: "CASH_ON_DELIVERY", flag: false },
    { label: "CASH_ON_PICKUP", value: "CASH_ON_PICKUP", flag: false },
    { label: "CREDIT_CARD", value: "CREDIT_CARD", flag: false },
    { label: "ESCROW", value: "ESCROW", flag: false },
    {
      label: "INTEGRATED_MERCHANT_CREDIT_CARD",
      value: "INTEGRATED_MERCHANT_CREDIT_CARD",
      flag: false,
    },
    { label: "LOAN_CHECK", value: "LOAN_CHECK", flag: false },
    { label: "MONEY_ORDER", value: "MONEY_ORDER", flag: false },
    { label: "OTHER", value: "OTHER", flag: false },
    { label: "PAISA_PAY", value: "PAISA_PAY", flag: false },
    { label: "PAISA_PAY_ESCROW", value: "PAISA_PAY_ESCROW", flag: false },
    {
      label: "PAISA_PAY_ESCROW_EMI",
      value: "PAISA_PAY_ESCROW_EMI",
      flag: false,
    },
    { label: "PERSONAL_CHECK", value: "PERSONAL_CHECK", flag: false },
  ]);
  const [payPalSelected, setPayPalSelected] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [creditCardSelected, setCreditCardSelected] = useState(false);
  const [creditCardBrands, setCreditCardBrands] = useState([
    { label: "AMERICAN_EXPRESS", value: "AMERICAN_EXPRESS", flag: false },
    { label: "DISCOVER", value: "DISCOVER", flag: false },
    { label: "VISA", value: "VISA", flag: false },
    { label: "MASTERCARD", value: "MASTERCARD", flag: false },
  ]);
  //   immediatePay true
  const [onlyPayPalOptions, setOnlyPayPalOptions] = useState([
    { label: "PAYPAL", value: "PAYPAL", flag: true },
  ]);
  const [onlyPayPalOptionsReferenceId, setOnlyPayPalOptionsReferenceId] =
    useState("");

  const [errors, setErrors] = useState({});
  const [errorModalActive, setErrorModalActive] = useState(false);

  const getCheckedOptions = (options) => {
    const checkedOptions = options
      .filter((option) => option.flag)
      .map((option) => option.value);
    return checkedOptions;
  };

  const getCheckedCreditCardBrands = () => {
    const checkedCards = creditCardBrands
      .filter((card) => card.flag)
      .map((card) => card.value);
    return checkedCards;
  };

  const prepareDataForPost = () => {
    let tempObj = {};
    let PaymentProfile = {};
    PaymentProfile["name"] = name;
    PaymentProfile["description"] = description;
    PaymentProfile["immediatePay"] = immediatePay;
    PaymentProfile["paymentMethods"] = [];
    if (id) {
      PaymentProfile["profileId"] = id;
    }
    tempObj["PaymentProfile"] = { ...PaymentProfile };
    tempObj["site_id"] = site_id;
    tempObj["type"] = "PaymentProfile";
    if (!immediatePay) {
      const selectedPaymentOptions = getCheckedOptions(options);
      selectedPaymentOptions.forEach((selectedOption) => {
        switch (selectedOption) {
          case "PAYPAL":
            let tempPayPalObj = {
              paymentMethodType: selectedOption,
              referenceId: referenceId,
            };
            PaymentProfile["paymentMethods"].push(tempPayPalObj);
            break;
          case "CREDIT_CARD":
            let tempCreditCardObj = {
              paymentMethodType: selectedOption,
              brands: getCheckedCreditCardBrands(),
            };
            PaymentProfile["paymentMethods"].push(tempCreditCardObj);
            break;
          default:
            let tempOtherObj = {
              paymentMethodType: selectedOption,
            };
            PaymentProfile["paymentMethods"].push(tempOtherObj);
            break;
        }
      });
    } else {
      const selectedPaymentOptions = getCheckedOptions(onlyPayPalOptions);
      selectedPaymentOptions.forEach((selectedOption) => {
        switch (selectedOption) {
          case "PAYPAL":
            let tempPayPalObj = {
              paymentMethodType: selectedOption,
              referenceId: onlyPayPalOptionsReferenceId,
            };
            PaymentProfile["paymentMethods"].push(tempPayPalObj);
            break;
          default:
            let tempOtherObj = {
              paymentMethodType: selectedOption,
            };
            PaymentProfile["paymentMethods"].push(tempOtherObj);
            break;
        }
      });
    }
    let returnData = { data: tempObj, shop_id, site_id };
    return returnData;
  };

  const getValidationValue = (data) => {
    const errorsObj = [];
    if (data?.data?.PaymentProfile) {
      Object.keys(data.data.PaymentProfile).forEach((key) => {
        switch (key) {
          case "name":
            if (data.data.PaymentProfile[key] === "")
              errorsObj["name"] = "Please enter valid name";
            break;

          default:
            break;
        }
      });
      if (Object.keys(errorsObj).length) {
        setErrors(errorsObj);
        return errorsObj;
      } else return true;
    }
  };

  const prepareErrors = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      let tempErr = {};
      data.map((err, index) => {
        const { message, longMessage } = err;
        if (longMessage) {
          tempErr["longMessage"] = longMessage;
        } else if (message) {
          tempErr["message"] = message;
        }
      });
      setErrorModalActive(true);
      setErrors(tempErr);
    }
  };
  const saveFunc = async () => {
    let postData = prepareDataForPost();
    let validationPassed = getValidationValue(postData);
    if (validationPassed === true) {
      setSaveLoader(true);
      let { success, data, code, message } = await saveBusinessPolicy(postData);
      if (success) {
        notify.success(message);
        redirect("/panel/ebay/policiesUS");
      } else {
        notify.error(message);
        if (data?.errors) {
          prepareErrors(data.errors);
        }
      }
      setSaveLoader(false);
    }
  };
  const redirect = (url) => {
    props.history.push(url);
  };

  const renderSkeletonPage = () => <SkeletonPaymentPolicy />;
  const renderPaymentOption = () => (
    <>
      <Card
        sectioned
        title={<Title level={4}>Payment Policy</Title>}
        actions={[
          {
            content: <Button primary>Edit on eBay</Button>,
            url: `https://www.bizpolicy.ebay${domainName}/businesspolicy/${type}?profileId=${id}`,
            external: true,
          },
        ]}
      >
        <div
          style={{
            pointerEvents: "none",
            opacity: 0.8,
          }}
        >
          <FormLayout>
            <Layout>
              <Layout.AnnotatedSection title={"Name"}>
                <Card sectioned>
                  <FormLayout>
                    <Stack vertical spacing="extraTight">
                      <TextField
                        value={name}
                        onChange={(e) => {
                          setName(e);
                          let tempErrors = { ...errors };
                          delete tempErrors.name;
                          setErrors(tempErrors);
                        }}
                        type="email"
                        error={errors.name}
                      />
                    </Stack>
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
            <Layout>
              <Layout.AnnotatedSection title={"Description"}>
                <Card sectioned>
                  <FormLayout>
                    <Stack vertical spacing="extraTight">
                      <TextField
                        multiline={4}
                        placeholder="maxLength is 250"
                        maxLength={250}
                        showCharacterCount
                        value={description}
                        onChange={(e) => setDescription(e)}
                      />
                    </Stack>
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
            <Layout>
              <Layout.AnnotatedSection title={"Immediate Pay"}>
                <Card sectioned>
                  <FormLayout>
                    <Stack vertical spacing="extraTight">
                      <ButtonGroup segmented>
                        <Button
                          primary={immediatePay === true ? true : false}
                          pressed={immediatePay === true ? true : false}
                          onClick={() => {
                            setImmediatePay(true);
                            const tempOptions = options.map((option) => {
                              return { ...option, flag: false };
                            });
                            setOptions(tempOptions);
                            setCreditCardSelected(false);
                            setPayPalSelected(false);
                          }}
                        >
                          Yes
                        </Button>
                        <Button
                          primary={immediatePay === false ? true : false}
                          pressed={immediatePay === false ? true : false}
                          onClick={() => {
                            setImmediatePay(false);
                          }}
                        >
                          No
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
            <Layout>
              <Layout.AnnotatedSection title={"Payment Options"}>
                <Card sectioned>
                  <FormLayout>
                    <Stack spacing="extraTight">
                      {!immediatePay ? (
                        options.map((option, index) => {
                          return (
                            <Checkbox
                              key={index}
                              label={option.label}
                              checked={option.flag}
                              onChange={(checkedValue) => {
                                if (option.value === "PAYPAL") {
                                  setPayPalSelected(checkedValue);
                                } else if (option.value === "CREDIT_CARD") {
                                  setCreditCardSelected(checkedValue);
                                }
                                let tempOptions = [...options];
                                tempOptions[index]["flag"] = checkedValue;
                                setOptions(tempOptions);
                              }}
                            />
                          );
                        })
                      ) : (
                        <Checkbox
                          key={0}
                          label={onlyPayPalOptions[0].label}
                          checked={onlyPayPalOptions[0].flag}
                          disabled={true}
                        />
                      )}
                    </Stack>
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
            {/* immediate pay true */}
            {payPalSelected && (
              <Layout>
                <Layout.AnnotatedSection title={"Paypal Email"}>
                  <Card sectioned>
                    <FormLayout>
                      <Stack vertical spacing="extraTight">
                        <TextField
                          value={referenceId}
                          onChange={(e) => setReferenceId(e)}
                        />
                      </Stack>
                    </FormLayout>
                  </Card>
                </Layout.AnnotatedSection>
              </Layout>
            )}
            {creditCardSelected && (
              <Layout>
                <Layout.AnnotatedSection title={"Brands"}>
                  <Card sectioned>
                    <FormLayout>
                      <Stack spacing="extraTight">
                        {creditCardBrands.map((creditCardBrand, index) => {
                          return (
                            <Checkbox
                              key={index}
                              label={creditCardBrand.label}
                              checked={creditCardBrand.flag}
                              onChange={(checkedValue) => {
                                let tempCreditCardBrands = [
                                  ...creditCardBrands,
                                ];
                                tempCreditCardBrands[index]["flag"] =
                                  checkedValue;
                                setCreditCardBrands(tempCreditCardBrands);
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </FormLayout>
                  </Card>
                </Layout.AnnotatedSection>
              </Layout>
            )}
            {/* immediate pay false */}
            {immediatePay && onlyPayPalOptions[0].flag && (
              <Layout>
                <Layout.AnnotatedSection title={"Paypal Email"}>
                  <Card sectioned>
                    <FormLayout>
                      <Stack vertical spacing="extraTight">
                        <TextField
                          value={onlyPayPalOptionsReferenceId}
                          onChange={(e) => setOnlyPayPalOptionsReferenceId(e)}
                        />
                      </Stack>
                    </FormLayout>
                  </Card>
                </Layout.AnnotatedSection>
              </Layout>
            )}
          </FormLayout>
        </div>
      </Card>
      <Modal
        open={errorModalActive}
        onClose={() => setErrorModalActive(false)}
        title="Errors found in policy creation"
      >
        <Modal.Section>
          <TextContainer>
            {Object.keys(errors).map((error, index) => (
              <Banner status="critical" key={index}>
                {errors[error]}
              </Banner>
            ))}
          </TextContainer>
        </Modal.Section>
      </Modal>
    </>
  );
  return (
    <Card>
      <div
        style={
          accountStatus === "inactive"
            ? {
                pointerEvents: "none",
                opacity: 0.8,
              }
            : {}
        }
      >
        {id && dataReceivedFromAPI
          ? renderSkeletonPage()
          : renderPaymentOption()}
      </div>
    </Card>
  );
};

export default withRouter(PaymentPolicyUtkarshNew);
