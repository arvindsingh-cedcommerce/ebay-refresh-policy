import React, { useEffect, useState } from "react";
import {
  Card as AntCard,
  Input,
} from "antd";
import {
  Button,
  Card,
  FormLayout,
  ButtonGroup,
  Layout,
  Stack,
  ChoiceList,
  Checkbox, SkeletonBodyText,
  SkeletonPage 
} from "@shopify/polaris";
import {
  getBusinessPolicy,
  saveBusinessPolicy,
} from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import { notify } from "../../../../../../services/notify";
import { Typography } from "antd";
import { isUndefined } from "lodash";
import { arrayOf } from "prop-types";
const { Text, Title } = Typography;
const { TextArea } = Input;
const layout =
  // {
  //   labelCol: {
  //     span: 4,
  //   },
  //   wrapperCol: {
  //     span: 20,
  //   },
  // }
  null;


const PaymentPolicyUtkarsh = ({
  loader,
  recieveFormdata,
  site_id,
  type,
  shop_id,
  id,
}) => {
  // const [form] = Form.useForm();
  const [immediatePay, setImmediatePay] = useState(false);
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState([]);
  const [dataReceivedFromAPI,setDataReceivedFromAPI]=useState(true);
  const [name, setName] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCreditCardBrands, setSelectedCreditCardBrands] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const [checkFlag, setcheckFlag]=useState(false);
  const [flag,setflag]=useState(false);
  const [CCflag,setCCflag]=useState(false);
  const onFinish = (values) => {
    console.log(values);
  };
  const [options,setoptions] = useState([
    { label: "PAYPAL", value: "PAYPAL",flag:false },
    { label: "CASHIER_CHECK", value: "CASHIER_CHECK",flag:false },
    { label: "CASH_IN_PERSON", value: "CASH_IN_PERSON",flag:false },
    { label: "CASH_ON_DELIVERY", value: "CASH_ON_DELIVERY",flag:false },
    { label: "CASH_ON_PICKUP", value: "CASH_ON_PICKUP",flag:false },
    { label: "CREDIT_CARD", value: "CREDIT_CARD",flag:false },
    { label: "ESCROW", value: "ESCROW",flag:false },
    { label: "INTEGRATED_MERCHANT_CREDIT_CARD",value: "INTEGRATED_MERCHANT_CREDIT_CARD",flag:false },
    { label: "LOAN_CHECK", value: "LOAN_CHECK",flag:false },
    { label: "MONEY_ORDER", value: "MONEY_ORDER",flag:false },
    { label: "OTHER", value: "OTHER",flag:false },
    { label: "PAISA_PAY", value: "PAISA_PAY",flag:false },
    { label: "PAISA_PAY_ESCROW", value: "PAISA_PAY_ESCROW",flag:false },
    { label: "PAISA_PAY_ESCROW_EMI", value: "PAISA_PAY_ESCROW_EMI",flag:false },
    { label: "PERSONAL_CHECK", value: "PERSONAL_CHECK",flag:false },
  ]);

  const [creditCardBrands,setcreditCardBrands] = useState([
    { label: "AMERICAN_EXPRESS", value: "AMERICAN_EXPRESS",flag:false },
    { label: "DISCOVER", value: "DISCOVER",flag:false },
    { label: "VISA", value: "VISA",flag:false },
    { label: "MASTERCARD", value: "MASTERCARD",flag:false },
  ]);

  const [onlyPayPalOptions,setonlyPayPalOptions] = useState([{ label: "PAYPAL", value: "PAYPAL",flag:true }]);

  useEffect(() => {
    if (immediatePay) {
      setSelectedPaymentOptions([...selectedPaymentOptions, "PAYPAL"]);
    } else {
      let temp = [...selectedPaymentOptions];
      const index = temp.indexOf("PAYPAL");
      if (index > -1) {
        temp.splice(index, 1);
        setSelectedPaymentOptions(temp);
      }
    }
  }, [immediatePay]);

  const extractDataFromAPI = (data) => {
    setName(data["title"]);
    setDescription(data["data"]["description"]);
    setImmediatePay(data["data"]["immediatePay"]);
    if (data["data"]["paymentMethods"]) {
      setSelectedPaymentOptions(
        data["data"]["paymentMethods"].map((e) => e["paymentMethodType"])
      );
      let temp = data["data"]["paymentMethods"].filter(
        (e) => e["paymentMethodType"] === "PAYPAL"
      );
      if (temp.length > 0) {
        setReferenceId(temp[0]["recipientAccountReference"]["referenceId"]);
      }
      setflag(!flag)
    }
    data["data"]["paymentMethods"].map(val=>{
      if(val.paymentMethodType === "CREDIT_CARD"){
        setSelectedCreditCardBrands(val.brands)
        setCCflag(!CCflag)
      }
    })
  };

  const hitAPI = async () => {
    if(!isUndefined(id)){
      let { success, data } = await getBusinessPolicy(id);
      if (success) {
        setDataReceivedFromAPI(false);
        extractDataFromAPI(data);
      }
    }
  };
  useEffect(() => {
    hitAPI();
  }, []);

  useEffect(()=>{
    if(!isUndefined(id)){
      options.map((val,index)=>{
        selectedPaymentOptions.map(value=>{
          if(val.value===value){
            options[index].flag=true;
          }
          if(value==="PAYPAL"){
            onlyPayPalOptions[0].flag=true;
          }
        })
      })
    }
  },[flag])

  useEffect(()=>{
    if(!isUndefined(id)){
      creditCardBrands.map((val,index)=>{
        selectedCreditCardBrands.map(value=>{
          if(val.value===value){
            creditCardBrands[index].flag=true;
            setcheckFlag(!checkFlag)
          }
        })
      })
    }
  },[CCflag])


  useEffect(()=>{
    let payArr=[];
    let CCArr=[];
    options.forEach((value)=>{
      if(value.flag){
        payArr.push(value.value)
      }
    })
    creditCardBrands.forEach(value=>{
      if(value.flag){
        CCArr.push(value.value)
      }
    })
    setSelectedCreditCardBrands(CCArr)
    setSelectedPaymentOptions(payArr)
  },[checkFlag])

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
    // tempObj["shop_id"] = shop_id;
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
            brands: selectedCreditCardBrands,
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
    let returnData = { data: tempObj, shop_id, site_id };

    return returnData;
  };

  const renderPaymentOption = () => {
    return (
      <Card
        sectioned
        title={<Title level={4}>Payment Policy</Title>}
        actions={[
          {
            content: (
              <Button primary onClick={async () => {
                let postData = prepareDataForPost();
                //   recieveFormdata(postData);
                setSaveLoader(true);
                let { success, data, code, message } = await saveBusinessPolicy(
                  postData
                );
                if (success) {
                  notify.success(message);
                } else {
                  notify.error(message);
                }
                setSaveLoader(false);
              }}>
                Save
              </Button>
            ),
          },
        ]}
      >
    <FormLayout>
      <Layout>
        <Layout.AnnotatedSection
          title={"Name"}
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>

      <Layout>
        <Layout.AnnotatedSection
          title={"Description"}
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
              <TextArea
               rows={4}
               placeholder="maxLength is 250"
               maxLength={250}
               value={description}
               onChange={(e) => setDescription(e.target.value)}
              />
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>

      <Layout>
        <Layout.AnnotatedSection
          title={"Immediate Pay"}
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
              <ButtonGroup segmented>
                <Button
                  primary={
                    immediatePay === true
                      ? true
                      : false
                  }
                  pressed={
                    immediatePay === true
                      ? true
                      : false
                  }
                  onClick={()=>setImmediatePay(true)}
                >
                  Yes
                </Button>
                <Button
                  primary={
                    immediatePay === false ? true : false
                  }
                  pressed={
                    immediatePay === false ? true : false
                  }
                  onClick={()=>setImmediatePay(false)}
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
        <Layout.AnnotatedSection
          title={"Payment Options"}
        >
          <Card sectioned>
            <FormLayout>
              <Stack spacing="extraTight">
                {!immediatePay?
                options.map((row,index)=>{
                return(
                  <Checkbox
                  key={index}
                  label={options[index].value}
                  checked={options[index].flag}
                  onChange={(checkedValues) =>{
                    options[index].flag=checkedValues;
                    setcheckFlag(!checkFlag)}
                  }
                />
                );
              })
              :
              <Checkbox
              key={0}
              label={onlyPayPalOptions[0].label}
              checked={onlyPayPalOptions[0].flag}
              disabled={true}
              />
            }
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>

      {selectedPaymentOptions.includes("PAYPAL") &&
      <Layout>
        <Layout.AnnotatedSection
          title={"Paypal Email"}
        >
          <Card sectioned>
            <FormLayout>
              <Stack vertical spacing="extraTight">
              <Input
               value={referenceId}
               onChange={(e) => setReferenceId(e.target.value)}
              />
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>}

      {selectedPaymentOptions.includes("CREDIT_CARD") &&
      <Layout>
        <Layout.AnnotatedSection
          title={"Brands"}
        >
          <Card sectioned>
            <FormLayout>
              <Stack spacing="extraTight">
                {creditCardBrands.map((row,index)=>{
                return(
                <Checkbox
                key={index}
                label={creditCardBrands[index].value}
                checked={creditCardBrands[index].flag}
                onChange={(checkedValues) =>{
                  creditCardBrands[index].flag=checkedValues;
                  setcheckFlag(!checkFlag)}
                }
              />)})}
              </Stack>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      }

    </FormLayout>
    </Card>)
  };
  return id && dataReceivedFromAPI ? 
    (
      <Card sectioned>
      <SkeletonPage fullWidth={true} title="Payment Policy">
        <Card.Section>
          <SkeletonBodyText lines={2}/>
        </Card.Section>
        <Card.Section>
          <SkeletonBodyText lines={2}/>
        </Card.Section>
        <Card.Section>
          <SkeletonBodyText lines={2} />
        </Card.Section>
        <Card.Section>
          <SkeletonBodyText lines={2} />
        </Card.Section>
      </SkeletonPage>
    </Card>
    ):
    (
      <Card>
        {renderPaymentOption()}
      </Card>)
  ;
};

export default PaymentPolicyUtkarsh;
