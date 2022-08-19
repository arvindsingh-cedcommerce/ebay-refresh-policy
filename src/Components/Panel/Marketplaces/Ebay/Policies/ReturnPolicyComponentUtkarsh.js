import React, { useState, useEffect } from "react";
import { Card as AntCard, Row, Col, Input, Form, Checkbox } from "antd";
import {
  Card,
  FormLayout,
  Select,
  Button,
  Layout,
  Stack,
  ChoiceList,
  SkeletonBodyText,
  SkeletonPage,
  ButtonGroup,
} from "@shopify/polaris";
import {
  getBusinessPolicy,
  saveBusinessPolicy,
} from "../../../../../Apirequest/ebayApirequest/policiesApi";
import { Typography } from "antd";
import { notify } from "../../../../../services/notify";
import { withRouter } from "react-router-dom";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import { json } from "../../../../../globalConstant/static-json";

const { Title } = Typography;
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

const returnPeriodOptions = [
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
];

const ReturnPolicyComponentUtkarsh = (props) => {
  const { shop_id, site_id, id, type } = props;
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [returnsAccepted, setReturnsAccepted] = useState(false);
  const [dataReceivedFromAPI, setDataReceivedFromAPI] = useState(true);
  const [domesticObj, setDomesticObj] = useState({
    returnShippingCostPayer: "SELLER",
    returnPeriod: 30,
  });
  const [saveLoader, setSaveLoader] = useState(false);

  const onFinish = (values) => {
    console.log(values);
  };
  // account status
  const [accountStatus, setAccountStatus] = useState("active");

  // domain name
  const [domainName, setDomainName] = useState("");

  const prepareDataForPost = () => {
    let tempObj = {};
    let ReturnProfile = {};
    ReturnProfile["name"] = name;
    ReturnProfile["returnsAccepted"] = returnsAccepted;
    if (description !== "") {
      ReturnProfile["description"] = description;
    } else {
      ReturnProfile["description"] = "";
    }
    tempObj["site_id"] = site_id;
    tempObj["type"] = "ReturnProfile";
    // tempObj["returnsAccepted"] = returnsAccepted ? returnsAccepted : false;
    // tempObj["shop_id"] = shop_id;
    if (returnsAccepted) {
      let domestic = {};
      domestic["returnShippingCostPayer"] =
        domesticObj["returnShippingCostPayer"];
      domestic["returnPeriod"] = Number(domesticObj["returnPeriod"]);
      ReturnProfile["domestic"] = domestic;
      ReturnProfile["domestic"]["returnsAccepted"] = returnsAccepted;

      // let international = {};
      // international["returnShippingCostPayer"] =
      //   internationalObj["returnShippingCostPayer"];
      // international["returnPeriod"] = Number(internationalObj["returnPeriod"]);
      // ReturnProfile["international"] = international;
    }
    if (id) {
      ReturnProfile["profileId"] = id;
    }
    tempObj["ReturnProfile"] = { ...ReturnProfile };
    let returnData = { data: tempObj, shop_id, site_id };
    return returnData;
  };
  // useEffect(() => console.log(domesticObj), [domesticObj]);

  const extractData = (data) => {
    setName(data["title"]);
    setDescription(data["data"]["description"]);
    setReturnsAccepted(data["data"]["returnsAccepted"]);
    let temp1 = {};
    temp1["returnShippingCostPayer"] = data["data"]["returnShippingCostPayer"];
    temp1["returnPeriod"] =
      data["data"]["returnPeriod"] && data["data"]["returnPeriod"]["value"];
    setDomesticObj(temp1);
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
    if (id) {
      setDomainName(getDomainName(site_id));
      let { success, data } = await getBusinessPolicy(id);
      if (success) {
        setDataReceivedFromAPI(false);
        extractData(data);
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
      // notify.error(message);
      // props.history.push("/auth/login");
    }
  };
  useEffect(() => {
    hitAPI();
    getAllConnectedAccounts();
  }, []);

  const redirect = (url) => {
    props.history.push(url);
  };
  return (
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
      {id && dataReceivedFromAPI ? (
        <Card sectioned>
          <SkeletonPage fullWidth={true} title="Return Policy">
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
          </SkeletonPage>
        </Card>
      ) : (
        <Card>
          <Card
            sectioned
            title={<Title level={4}>Return Policy</Title>}
            actions={[
              {
                content: <Button primary>Edit</Button>,
                url: `https://www.bizpolicy.ebay${domainName}/businesspolicy/${type}?profileId=${id}`,
                external: true,
                // content: (
                //   <Button
                //     loading={saveLoader}
                //     primary
                //     onClick={async () => {
                //       setSaveLoader(true);
                //       let postData = prepareDataForPost();
                //       let { success, data, code, message } =
                //         await saveBusinessPolicy(postData);
                //       if (success) {
                //         notify.success(message);
                //         redirect("/panel/ebay/policiesUS");
                //       } else {
                //         notify.error(message);
                //       }
                //       setSaveLoader(false);
                //     }}
                //   >
                //     Save
                //   </Button>
                // ),
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
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                  <Layout.AnnotatedSection title={"Returns accepted"}>
                    <Card sectioned>
                      <FormLayout>
                        <ButtonGroup segmented>
                          <Button
                            primary={returnsAccepted}
                            pressed={returnsAccepted}
                            onClick={() => setReturnsAccepted(!returnsAccepted)}
                          >
                            Yes
                          </Button>
                          <Button
                            primary={!returnsAccepted}
                            pressed={!returnsAccepted}
                            onClick={() => setReturnsAccepted(!returnsAccepted)}
                          >
                            No
                          </Button>
                        </ButtonGroup>
                        {/* <Checkbox
            checked={returnsAccepted}
            onChange={() => {
              setReturnsAccepted(!returnsAccepted);
            }}
          >
            Returns accepted
          </Checkbox> */}
                      </FormLayout>
                    </Card>
                  </Layout.AnnotatedSection>
                </Layout>
              </FormLayout>
            </div>
          </Card>
          <div
            style={{
              pointerEvents: "none",
              opacity: 0.8,
            }}
          >
            {returnsAccepted && (
              <Card sectioned title={<Title level={4}>Domestic Returns</Title>}>
                <FormLayout>
                  <Layout>
                    <Layout.AnnotatedSection
                      title={"Return Shipping Cost Payer"}
                    >
                      <Card sectioned>
                        <FormLayout>
                          <Stack vertical spacing="extraTight">
                            <Select
                              options={[
                                { label: "Seller", value: "SELLER" },
                                { label: "Buyer", value: "BUYER" },
                              ]}
                              value={domesticObj["returnShippingCostPayer"]}
                              onChange={(e) => {
                                setDomesticObj({
                                  ...domesticObj,
                                  returnShippingCostPayer: e,
                                });
                              }}
                            />
                          </Stack>
                        </FormLayout>
                      </Card>
                    </Layout.AnnotatedSection>
                  </Layout>

                  <Layout>
                    <Layout.AnnotatedSection title={"Return Period"}>
                      <Card sectioned>
                        <FormLayout>
                          <Stack vertical spacing="extraTight">
                            <Select
                              options={returnPeriodOptions}
                              value={domesticObj["returnPeriod"]}
                              onChange={(e) => {
                                setDomesticObj({
                                  ...domesticObj,
                                  returnPeriod: e.target.value,
                                });
                              }}
                            />
                            {/* <Input
                        value={domesticObj["returnPeriod"]}
                        onChange={(e) => {
                          setDomesticObj({
                            ...domesticObj,
                            returnPeriod: e.target.value,
                          });
                        }}
                      /> */}
                          </Stack>
                        </FormLayout>
                      </Card>
                    </Layout.AnnotatedSection>
                  </Layout>
                </FormLayout>
              </Card>
            )}
          </div>
          {/* {returnsAccepted && (
  <Card
    sectioned
    title={<Title level={4}>International Returns</Title>}
  >
  <FormLayout>
    <Layout>
      <Layout.AnnotatedSection
        title={"Return Shipping Cost Payer"}
      >
        <Card sectioned>
          <FormLayout>
          <Stack vertical spacing="extraTight">
          <Select
            options={[
              { label: "Seller", value: "SELLER" },
              { label: "Buyer", value: "BUYER" },
            ]}
            value={internationalObj["returnShippingCostPayer"]}
            onChange={(e) =>
              setinternationalObj({
                ...internationalObj,
                returnShippingCostPayer: e,
              })
            }
          />
          </Stack>
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>

    <Layout>
      <Layout.AnnotatedSection
        title={"Return Period"}
      >
        <Card sectioned>
          <FormLayout>
            <Stack vertical spacing="extraTight">
            <Input
              value={internationalObj["returnPeriod"]}
              onChange={(e) =>
                setinternationalObj({
                  ...internationalObj,
                  returnPeriod: e.target.value,
                })
              }
            />
            </Stack>
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  </FormLayout>
  </Card>)}   */}
        </Card>
      )}
    </div>
  );
};

export default withRouter(ReturnPolicyComponentUtkarsh);
