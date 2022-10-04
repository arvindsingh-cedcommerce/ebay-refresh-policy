import React, { useState, useEffect } from "react";
import { Input } from "antd";
import {
  Card,
  FormLayout,
  Select,
  Button,
  Layout,
  Stack,
  SkeletonBodyText,
  SkeletonPage,
  ButtonGroup,
} from "@shopify/polaris";
import { getBusinessPolicy } from "../../../../../Apirequest/ebayApirequest/policiesApi";
import { Typography } from "antd";
import { withRouter } from "react-router-dom";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import { json } from "../../../../../globalConstant/static-json";

const { Title } = Typography;
const { TextArea } = Input;

const returnPeriodOptions = [
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
];

const ReturnPolicyComponentUtkarsh = (props) => {
  const { shop_id, site_id, id, type } = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [returnsAccepted, setReturnsAccepted] = useState(false);
  const [dataReceivedFromAPI, setDataReceivedFromAPI] = useState(true);
  const [domesticObj, setDomesticObj] = useState({
    returnShippingCostPayer: "SELLER",
    returnPeriod: 30,
  });
  const [saveLoader, setSaveLoader] = useState(false);

  // account status
  const [accountStatus, setAccountStatus] = useState("active");

  // domain name
  const [domainName, setDomainName] = useState("");

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
                          </Stack>
                        </FormLayout>
                      </Card>
                    </Layout.AnnotatedSection>
                  </Layout>
                </FormLayout>
              </Card>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default withRouter(ReturnPolicyComponentUtkarsh);
