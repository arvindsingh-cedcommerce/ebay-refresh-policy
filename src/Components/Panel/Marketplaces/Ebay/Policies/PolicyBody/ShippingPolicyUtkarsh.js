import { Alert, Input } from "antd";
import {
  FormLayout,
  ButtonGroup,
  Button,
  Layout,
  Stack,
  Checkbox,
  Card,
  Modal,
  SkeletonBodyText,
  SkeletonPage,
  Select,
} from "@shopify/polaris";
import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  getBusinessPolicy,
  getEbayshopSettings,
} from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import { prepareChoiceoption } from "../../../../../../Subcomponents/Aggrid/gridHelper";
import {
  countriestoExclude,
  countriestoInclude,
  extractShippingDetails,
} from "../ebaypolicyhelper";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { withRouter } from "react-router-dom";
import { json } from "../../../../../../globalConstant/static-json";
const { Title } = Typography;

const ShippingPolicyUtkarsh = (props) => {
  const { site_id, shop_id, id, type } = props;
  const [saveLoader, setSaveLoader] = useState(false);
  const [name, setName] = useState("");
  const [costType, setCostType] = useState("");
  const [globalShipping, setGlobalShipping] = useState(false);
  const [dataReceivedFromAPI, setDataReceivedFromAPI] = useState(true);
  const [flag, setflag] = useState(false);

  // domain name
  const [domainName, setDomainName] = useState("");

  const [regionExcludedModalActive, setRegionExcludedModalActive] =
    useState(false);
  const [regionExcluded, setRegionExcluded] = useState([]);

  // option preparation
  const [optionsRecieved, setOptionsRecieved] = useState({
    country: [],
    excluded_shipping_locations: [],
    handling_time: [],
    shipping_service: {
      domestic: {},
      international: {},
    },
    shipping_service_options: {
      domestic: [],
      international: [],
    },
  });
  // domestic
  const [domesticShippingServices, setDomesticShippingServices] = useState({
    handlingTime: "",
    shippingServiceDomestic: [
      {
        buyerResponsibleForShipping: false,
        shippingCost: "",
        freeShipping: false,
        additionalShippingCost: "",
        shippingServiceCode: "",
      },
    ],
  });

  // account status
  const [accountStatus, setAccountStatus] = useState("active");

  const tempObjShippingServiceDomestice = {
    buyerResponsibleForShipping: false,
    shippingCost: "",
    freeShipping: false,
    additionalShippingCost: "",
    shippingServiceCode: "",
  };

  const tempObjShippingserviceInternational = {
    buyerResponsibleForShipping: false,
    shippingServiceCode: "",
    freeShipping: false,
    regionIncluded: [],
    regionIncludedModalActive: false,
  };

  // international
  const [internationalShippingServices, setInternationalShippingServices] =
    useState({
      // handlingTime: "",
      shippingServiceInternational: [
        {
          buyerResponsibleForShipping: false,
          shippingServiceCode: "",
          freeShipping: false,
          regionIncluded: [],
          regionIncludedModalActive: false,
        },
      ],
      // regionExcluded: [],
      // regionExcludedModalActive: false,
    });

  const prepareOptions = async () => {
    let optionsRecievedCopy = { ...optionsRecieved };
    let { success, data } = await getEbayshopSettings({ site_id, shop_id });
    if (success) {
      let {
        CountryDetails,
        ExcludeShippingLocationDetails,
        DispatchTimeMaxDetails,
        ShippingServiceDetails,
      } = data;
      optionsRecievedCopy = {
        country: [
          ...prepareChoiceoption(CountryDetails, "Description", "Country"),
        ],
        excluded_shipping_locations: [
          ...prepareChoiceoption(
            ExcludeShippingLocationDetails,
            "Description",
            "Location"
          ),
        ],
        handling_time: [
          ...prepareChoiceoption(
            DispatchTimeMaxDetails,
            "Description",
            "DispatchTimeMax"
          ),
        ],
        ...extractShippingDetails(ShippingServiceDetails),
      };

      setOptionsRecieved(optionsRecievedCopy);
    }
  };

  const separateDomesticAndInternational = (data) => {
    let allDomesticShippingServices = [];
    let allInternationalShippingServices = [];
    data["data"]["shippingOptions"].forEach((option) => {
      if (option["optionType"] === "DOMESTIC") {
        allDomesticShippingServices.push(...option["shippingServices"]);
      } else if (option["optionType"] === "INTERNATIONAL") {
        allInternationalShippingServices.push(...option["shippingServices"]);
      }
    });
    if (allDomesticShippingServices.length > 0) {
      let shippingServiceDomestic = [];
      allDomesticShippingServices.forEach((service) => {
        let tempObj = {};
        tempObj["buyerResponsibleForShipping"] =
          service["buyerResponsibleForShipping"];
        tempObj["shippingCost"] = service["shippingCost"]["value"];
        tempObj["freeShipping"] = service["freeShipping"];
        tempObj["additionalShippingCost"] =
          service["additionalShippingCost"]["value"];
        tempObj["shippingServiceCode"] = service["shippingServiceCode"];
        shippingServiceDomestic.push(tempObj);
      });
      setDomesticShippingServices({
        ...domesticShippingServices,
        handlingTime: data["data"]["handlingTime"]["value"],
        shippingServiceDomestic: shippingServiceDomestic,
      });
    }
    if (allInternationalShippingServices.length > 0) {
      let shippingServiceInternational = [];
      allInternationalShippingServices.forEach((service) => {
        let tempObj = {};
        tempObj["buyerResponsibleForShipping"] =
          service["buyerResponsibleForShipping"];
        tempObj["shippingServiceCode"] = service["shippingServiceCode"];
        tempObj["freeShipping"] = service["freeShipping"];
        tempObj["shippingCost"] = service["shippingCost"]["value"];
        tempObj["additionalShippingCost"] =
          service["additionalShippingCost"]["value"];
        tempObj["regionIncluded"] = service["shipToLocations"][
          "regionIncluded"
        ].map((region) => region["regionName"]);
        shippingServiceInternational.push(tempObj);
      });
      setInternationalShippingServices({
        ...internationalShippingServices,
        shippingServiceInternational: shippingServiceInternational,
      });
    }
  };

  useEffect(() => {}, [
    domesticShippingServices,
    internationalShippingServices,
  ]);

  const handleCheckbox = (index) => {
    var arr = [];
    let internationalShippingServicesCopy = {
      ...internationalShippingServices,
    };
    countriestoInclude.map((val, index) => {
      if (val.checked) {
        arr.push(val.label);
      }
    });
    internationalShippingServicesCopy["shippingServiceInternational"][index][
      "regionIncluded"
    ] = arr;
    setInternationalShippingServices(internationalShippingServicesCopy);
  };

  const handleRestrictCheck = () => {
    var arr = [];
    countriestoExclude.map((val, index) => {
      if (val.checked) {
        arr.push(val.label);
      }
    });
    setRegionExcluded(arr);
  };

  const getPolicyFromAPI = async () => {
    let { success, data } = await getBusinessPolicy(id);
    let costTypeDomestic = "";
    let costTypeInternational = "";
    let costTypeOptionDomestic = "";
    let costTypeOptionInternational = "";
    if (success) {
      setName(data["title"]);
      setDataReceivedFromAPI(false);
      setGlobalShipping(data["data"]["globalShipping"]);
      if (data["data"]["shippingOptions"]) {
        data["data"]["shippingOptions"].forEach((option) => {
          if (option["optionType"] === "DOMESTIC") {
            if (option["costType"] === "FLAT_RATE") {
              costTypeDomestic = "Flat";
            } else if (option["costType"] === "CALCULATED") {
              costTypeDomestic = "Calculated";
            }
            costTypeOptionDomestic = "Domestic";
          } else if (option["optionType"] === "INTERNATIONAL") {
            if (option["costType"] === "FLAT_RATE") {
              costTypeInternational = "Flat";
            } else if (option["costType"] === "CALCULATED") {
              costTypeInternational = "Calculated";
            }
            costTypeOptionInternational = "International";
          }
        });
        if (
          costTypeDomestic !== "" &&
          costTypeInternational !== "" &&
          costTypeDomestic !== costTypeInternational
        ) {
          setCostType(
            `${costTypeDomestic}${costTypeOptionDomestic}${costTypeInternational}${costTypeOptionInternational}`
          );
        } else {
          setCostType(costTypeDomestic);
        }
        separateDomesticAndInternational(data);
      }
    }
  };

  const addService = (type) => {
    switch (type) {
      case "domestic":
        let insertService = tempObjShippingServiceDomestice;
        let currentServicedomestic =
          domesticShippingServices.shippingServiceDomestic.slice(0);
        currentServicedomestic.push(insertService);
        domesticShippingServices.shippingServiceDomestic =
          currentServicedomestic;
        setDomesticShippingServices(domesticShippingServices);
        setflag(!flag);
        break;
      case "international":
        let insertServiceinternational = tempObjShippingserviceInternational;
        let currentServiceinternational =
          internationalShippingServices.shippingServiceInternational.slice(0);
        currentServiceinternational.push(insertServiceinternational);
        internationalShippingServices.shippingServiceInternational =
          currentServiceinternational;
        setInternationalShippingServices(internationalShippingServices);
        setflag(!flag);
        break;
      default:
        console.log(type);
    }
  };

  const deleteService = (type, index) => {
    switch (type) {
      case "domestic":
        let currentServicedomestic =
          domesticShippingServices.shippingServiceDomestic.slice(0);
        currentServicedomestic.splice(index, 1);
        domesticShippingServices.shippingServiceDomestic =
          currentServicedomestic;
        setDomesticShippingServices(domesticShippingServices);
        setflag(!flag);
        break;
      case "international":
        let currentServiceinternational =
          internationalShippingServices.shippingServiceInternational.slice(0);
        currentServiceinternational.splice(index, 1);
        internationalShippingServices.shippingServiceInternational =
          currentServiceinternational;
        setInternationalShippingServices(internationalShippingServices);
        setflag(!flag);
        break;
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

  const getDomainName = (siteId) => {
    let countryName = json.flag_country.filter(
      (sites) => sites.value === siteId
    );
    if (countryName.length) {
      return countryName[0]?.domainName;
    }
    return "-";
  };

  useEffect(() => {
    prepareOptions();
    getAllConnectedAccounts();
    if (id) {
      setDomainName(getDomainName(site_id));
      getPolicyFromAPI();
    }
  }, []);

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
          <SkeletonPage fullWidth={true} title="Shipping Policy">
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
            title={<Title level={4}>Shipping Policy</Title>}
            actions={[
              {
                content: <Button primary>Edit</Button>,
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
                <Alert
                  showIcon
                  description={
                    <p>
                      <b>Shipping policy</b> helps you to assign shipping
                      services, handling time, charges and much more both for
                      global and domestic shipping.
                    </p>
                  }
                />
                <br />
                <Layout>
                  <Layout.AnnotatedSection title={"Shipping Profile Name"}>
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
                  <Layout.AnnotatedSection title={"Cost Type"}>
                    <Card sectioned>
                      <FormLayout>
                        <Stack vertical spacing="extraTight">
                          <Select
                            style={{ width: "100%" }}
                            options={[
                              { label: "Calculated", value: "Calculated" },
                              { label: "Flat", value: "Flat" },
                              {
                                label: "Flat Domestic Calculated International",
                                value: "FlatDomesticCalculatedInternational",
                              },
                              {
                                label: "Calculated Domestic Flat International",
                                value: "CalculatedDomesticFlatInternational",
                              },
                              // { label: "Not Specified", value: "NOT_SPECIFIED" },
                            ]}
                            value={costType}
                            onChange={(e) => setCostType(e)}
                            placeholder="Please select cost type"
                          />
                        </Stack>
                      </FormLayout>
                    </Card>
                  </Layout.AnnotatedSection>
                </Layout>

                <Layout>
                  <Layout.AnnotatedSection title={"Global Shipping"}>
                    <Card sectioned>
                      <FormLayout>
                        <Stack vertical spacing="extraTight">
                          <ButtonGroup segmented>
                            <Button
                              primary={globalShipping === true ? true : false}
                              pressed={globalShipping === true ? true : false}
                              onClick={() => setGlobalShipping(true)}
                            >
                              Yes
                            </Button>
                            <Button
                              primary={globalShipping === false ? true : false}
                              pressed={globalShipping === false ? true : false}
                              onClick={() => setGlobalShipping(false)}
                            >
                              No
                            </Button>
                          </ButtonGroup>
                        </Stack>
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
            <Card
              sectioned
              title={<Title level={4}>Domestic Shipping Services</Title>}
              actions={[
                {
                  content: (
                    <Button
                      primary
                      onClick={() => {
                        addService("domestic");
                      }}
                    >
                      Add Services
                    </Button>
                  ),
                },
              ]}
            >
              {domesticShippingServices["shippingServiceDomestic"].map(
                (service, index) => {
                  return (
                    <Card
                      sectioned={true}
                      actions={[
                        {
                          content: "Delete Service",
                          onAction: () => {
                            deleteService("domestic", index);
                          },
                          disabled:
                            domesticShippingServices.shippingServiceDomestic
                              .length <= 1,
                        },
                      ]}
                    >
                      <Layout>
                        <Layout.AnnotatedSection title={"Shipping Services"}>
                          <Card sectioned>
                            <FormLayout>
                              <Stack vertical spacing="extraTight">
                                <Select
                                  style={{ width: "80%" }}
                                  options={
                                    optionsRecieved.shipping_service_options
                                      .domestic
                                  }
                                  value={service["shippingServiceCode"]}
                                  onChange={(e) => {
                                    let domesticShippingServicesCopy = {
                                      ...domesticShippingServices,
                                    };
                                    domesticShippingServicesCopy[
                                      "shippingServiceDomestic"
                                    ][index]["shippingServiceCode"] = e;
                                    setDomesticShippingServices(
                                      domesticShippingServicesCopy
                                    );
                                  }}
                                  placeholder="Please select"
                                />
                              </Stack>
                            </FormLayout>
                          </Card>
                        </Layout.AnnotatedSection>
                      </Layout>
                      <br />
                      <Layout>
                        <Layout.AnnotatedSection title={"Charges"}>
                          <Card sectioned>
                            <FormLayout>
                              <Stack vertical spacing="extraTight">
                                <Input
                                  style={{ width: "80%" }}
                                  value={service["shippingCost"]}
                                  onChange={(e) => {
                                    let domesticShippingServicesCopy = {
                                      ...domesticShippingServices,
                                    };
                                    domesticShippingServicesCopy[
                                      "shippingServiceDomestic"
                                    ][index]["shippingCost"] = e.target.value;
                                    setDomesticShippingServices(
                                      domesticShippingServicesCopy
                                    );
                                  }}
                                />
                              </Stack>
                            </FormLayout>
                          </Card>
                        </Layout.AnnotatedSection>
                      </Layout>
                      <br />
                      <Layout>
                        <Layout.AnnotatedSection title={"Additional Charges"}>
                          <Card sectioned>
                            <FormLayout>
                              <Stack vertical spacing="extraTight">
                                <Input
                                  style={{ width: "80%" }}
                                  value={service["additionalShippingCost"]}
                                  onChange={(e) => {
                                    let domesticShippingServicesCopy = {
                                      ...domesticShippingServices,
                                    };
                                    domesticShippingServicesCopy[
                                      "shippingServiceDomestic"
                                    ][index]["additionalShippingCost"] =
                                      e.target.value;
                                    setDomesticShippingServices(
                                      domesticShippingServicesCopy
                                    );
                                  }}
                                />
                              </Stack>
                            </FormLayout>
                          </Card>
                        </Layout.AnnotatedSection>
                      </Layout>
                      <br />
                      <Layout>
                        <Layout.AnnotatedSection title={"Free Shipping"}>
                          <Card sectioned>
                            <FormLayout>
                              <Stack vertical spacing="extraTight">
                                <ButtonGroup segmented>
                                  <Button
                                    primary={
                                      service["freeShipping"] === true
                                        ? true
                                        : false
                                    }
                                    pressed={
                                      service["freeShipping"] === true
                                        ? true
                                        : false
                                    }
                                    onClick={(e) => {
                                      let domesticShippingServicesCopy = {
                                        ...domesticShippingServices,
                                      };
                                      domesticShippingServicesCopy[
                                        "shippingServiceDomestic"
                                      ][index]["freeShipping"] =
                                        !domesticShippingServices[
                                          "shippingServiceDomestic"
                                        ][index]["freeShipping"];
                                      setDomesticShippingServices(
                                        domesticShippingServicesCopy
                                      );
                                    }}
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    primary={
                                      service["freeShipping"] === false
                                        ? true
                                        : false
                                    }
                                    pressed={
                                      service["freeShipping"] === false
                                        ? true
                                        : false
                                    }
                                    onClick={(e) => {
                                      let domesticShippingServicesCopy = {
                                        ...domesticShippingServices,
                                      };
                                      domesticShippingServicesCopy[
                                        "shippingServiceDomestic"
                                      ][index]["freeShipping"] =
                                        !domesticShippingServices[
                                          "shippingServiceDomestic"
                                        ][index]["freeShipping"];
                                      setDomesticShippingServices(
                                        domesticShippingServicesCopy
                                      );
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
                      <br />
                      {site_id == 100 && (
                        <Layout>
                          <Layout.AnnotatedSection
                            title={"Buyer Responsible For Shipping"}
                          >
                            <Card sectioned>
                              <FormLayout>
                                <Stack vertical spacing="extraTight">
                                  <ButtonGroup segmented>
                                    <Button
                                      primary={
                                        service[
                                          "buyerResponsibleForShipping"
                                        ] === true
                                          ? true
                                          : false
                                      }
                                      pressed={
                                        service[
                                          "buyerResponsibleForShipping"
                                        ] === true
                                          ? true
                                          : false
                                      }
                                      onClick={(e) => {
                                        let domesticShippingServicesCopy = {
                                          ...domesticShippingServices,
                                        };
                                        domesticShippingServicesCopy[
                                          "shippingServiceDomestic"
                                        ][index][
                                          "buyerResponsibleForShipping"
                                        ] =
                                          !domesticShippingServices[
                                            "shippingServiceDomestic"
                                          ][index][
                                            "buyerResponsibleForShipping"
                                          ];
                                        setDomesticShippingServices(
                                          domesticShippingServicesCopy
                                        );
                                      }}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      primary={
                                        service[
                                          "buyerResponsibleForShipping"
                                        ] === false
                                          ? true
                                          : false
                                      }
                                      pressed={
                                        service[
                                          "buyerResponsibleForShipping"
                                        ] === false
                                          ? true
                                          : false
                                      }
                                      onClick={(e) => {
                                        let domesticShippingServicesCopy = {
                                          ...domesticShippingServices,
                                        };
                                        domesticShippingServicesCopy[
                                          "shippingServiceDomestic"
                                        ][index][
                                          "buyerResponsibleForShipping"
                                        ] =
                                          !domesticShippingServices[
                                            "shippingServiceDomestic"
                                          ][index][
                                            "buyerResponsibleForShipping"
                                          ];
                                        setDomesticShippingServices(
                                          domesticShippingServicesCopy
                                        );
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
                      )}
                    </Card>
                  );
                }
              )}

              <Card.Section>
                <Layout>
                  <Layout.AnnotatedSection title={"Handling Time"}>
                    <Card sectioned>
                      <FormLayout>
                        <Stack vertical spacing="extraTight">
                          <Select
                            style={{ width: "100%" }}
                            options={[
                              { label: "1 Day", value: "1" },
                              { label: "2 Days", value: "2" },
                              { label: "3 Days", value: "3" },
                            ]}
                            value={domesticShippingServices["handlingTime"]}
                            onChange={(e) =>
                              setDomesticShippingServices({
                                ...domesticShippingServices,
                                handlingTime: e,
                              })
                            }
                            placeholder="Please select"
                          />
                        </Stack>
                      </FormLayout>
                    </Card>
                  </Layout.AnnotatedSection>
                </Layout>
              </Card.Section>
            </Card>
          </div>
          <br />
          <div
            style={{
              pointerEvents: "none",
              opacity: 0.8,
            }}
          >
            <Card
              sectioned
              title={<Title level={4}>International Shipping Services</Title>}
              actions={[
                {
                  content: (
                    <Button primary onClick={() => addService("international")}>
                      Add Services
                    </Button>
                  ),
                },
              ]}
            >
              {internationalShippingServices[
                "shippingServiceInternational"
              ].map((service, index) => {
                return (
                  <Card
                    sectioned={true}
                    actions={[
                      {
                        content: "Delete Service",
                        onAction: () => {
                          deleteService("international", index);
                        },
                        disabled:
                          internationalShippingServices
                            .shippingServiceInternational.length <= 1,
                      },
                    ]}
                  >
                    <Layout>
                      <Layout.AnnotatedSection title={"Shipping Services"}>
                        <Card sectioned>
                          <FormLayout>
                            <Stack vertical spacing="extraTight">
                              <Select
                                style={{ width: "80%" }}
                                options={
                                  optionsRecieved.shipping_service_options
                                    .international
                                }
                                value={service["shippingServiceCode"]}
                                onChange={(e) => {
                                  let internationalShippingServicesCopy = {
                                    ...internationalShippingServices,
                                  };
                                  internationalShippingServicesCopy[
                                    "shippingServiceInternational"
                                  ][index]["shippingServiceCode"] = e;
                                  setInternationalShippingServices(
                                    internationalShippingServicesCopy
                                  );
                                }}
                                placeholder="Please select"
                              />
                            </Stack>
                          </FormLayout>
                        </Card>
                      </Layout.AnnotatedSection>
                    </Layout>
                    <br />
                    <Layout>
                      <Layout.AnnotatedSection title={"Free Shipping"}>
                        <Card sectioned>
                          <FormLayout>
                            <Stack vertical spacing="extraTight">
                              <ButtonGroup segmented>
                                <Button
                                  primary={
                                    service["freeShipping"] === true
                                      ? true
                                      : false
                                  }
                                  pressed={
                                    service["freeShipping"] === true
                                      ? true
                                      : false
                                  }
                                  onClick={(e) => {
                                    let internationalShippingServicesCopy = {
                                      ...internationalShippingServices,
                                    };
                                    internationalShippingServicesCopy[
                                      "shippingServiceInternational"
                                    ][index]["freeShipping"] =
                                      !internationalShippingServices[
                                        "shippingServiceInternational"
                                      ][index]["freeShipping"];
                                    setInternationalShippingServices(
                                      internationalShippingServicesCopy
                                    );
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  primary={
                                    service["freeShipping"] === false
                                      ? true
                                      : false
                                  }
                                  pressed={
                                    service["freeShipping"] === false
                                      ? true
                                      : false
                                  }
                                  onClick={(e) => {
                                    let internationalShippingServicesCopy = {
                                      ...internationalShippingServices,
                                    };
                                    internationalShippingServicesCopy[
                                      "shippingServiceInternational"
                                    ][index]["freeShipping"] =
                                      !internationalShippingServices[
                                        "shippingServiceInternational"
                                      ][index]["freeShipping"];
                                    setInternationalShippingServices(
                                      internationalShippingServicesCopy
                                    );
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
                    {site_id == 100 && (
                      <Layout>
                        <Layout.AnnotatedSection
                          title={"Buyer Responsible For Shipping"}
                        >
                          <Card sectioned>
                            <FormLayout>
                              <Stack vertical spacing="extraTight">
                                <ButtonGroup segmented>
                                  <Button
                                    primary={
                                      service["buyerResponsibleForShipping"] ===
                                      true
                                        ? true
                                        : false
                                    }
                                    pressed={
                                      service["buyerResponsibleForShipping"] ===
                                      true
                                        ? true
                                        : false
                                    }
                                    onClick={(e) => {
                                      let internationalShippingServicesCopy = {
                                        ...internationalShippingServices,
                                      };
                                      internationalShippingServicesCopy[
                                        "shippingServiceInternational"
                                      ][index]["buyerResponsibleForShipping"] =
                                        !internationalShippingServices[
                                          "shippingServiceInternational"
                                        ][index]["buyerResponsibleForShipping"];
                                      setInternationalShippingServices(
                                        internationalShippingServicesCopy
                                      );
                                    }}
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    primary={
                                      service["buyerResponsibleForShipping"] ===
                                      false
                                        ? true
                                        : false
                                    }
                                    pressed={
                                      service["buyerResponsibleForShipping"] ===
                                      false
                                        ? true
                                        : false
                                    }
                                    onClick={(e) => {
                                      let internationalShippingServicesCopy = {
                                        ...internationalShippingServices,
                                      };
                                      internationalShippingServicesCopy[
                                        "shippingServiceInternational"
                                      ][index]["buyerResponsibleForShipping"] =
                                        !internationalShippingServices[
                                          "shippingServiceInternational"
                                        ][index]["buyerResponsibleForShipping"];
                                      setInternationalShippingServices(
                                        internationalShippingServicesCopy
                                      );
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
                    )}
                    <br />
                    <Layout>
                      <Layout.AnnotatedSection title={"Destinations"}>
                        <Card sectioned>
                          <FormLayout>
                            <Stack vertical spacing="extraTight">
                              <Button
                                primary
                                onClick={(e) => {
                                  let internationalShippingServicesCopy = {
                                    ...internationalShippingServices,
                                  };
                                  internationalShippingServicesCopy[
                                    "shippingServiceInternational"
                                  ][index]["regionIncludedModalActive"] =
                                    !internationalShippingServices[
                                      "shippingServiceInternational"
                                    ][index]["regionIncludedModalActive"];
                                  setInternationalShippingServices(
                                    internationalShippingServicesCopy
                                  );
                                }}
                              >
                                Choose Destinations
                              </Button>
                              <Modal
                                title="Choose Destinations"
                                open={service["regionIncludedModalActive"]}
                                onClose={(e) => {
                                  let internationalShippingServicesCopy = {
                                    ...internationalShippingServices,
                                  };
                                  internationalShippingServicesCopy[
                                    "shippingServiceInternational"
                                  ][index]["regionIncludedModalActive"] =
                                    !internationalShippingServices[
                                      "shippingServiceInternational"
                                    ][index]["regionIncludedModalActive"];
                                  setInternationalShippingServices(
                                    internationalShippingServicesCopy
                                  );
                                }}
                                primaryAction={{
                                  content: "Confirm",
                                  onAction: () => {
                                    let internationalShippingServicesCopy = {
                                      ...internationalShippingServices,
                                    };
                                    internationalShippingServicesCopy[
                                      "shippingServiceInternational"
                                    ][index]["regionIncludedModalActive"] =
                                      !internationalShippingServices[
                                        "shippingServiceInternational"
                                      ][index]["regionIncludedModalActive"];
                                    setInternationalShippingServices(
                                      internationalShippingServicesCopy
                                    );
                                  },
                                }}
                              >
                                <Card>
                                  <Card.Section>
                                    {countriestoInclude.map((value, ind) => {
                                      return (
                                        <Checkbox
                                          key={ind}
                                          label={value.value}
                                          checked={value.checked}
                                          onChange={(checkedValues) => {
                                            value.checked = checkedValues;
                                            handleCheckbox(index);
                                          }}
                                        />
                                      );
                                    })}
                                  </Card.Section>
                                </Card>
                              </Modal>
                            </Stack>
                          </FormLayout>
                        </Card>
                      </Layout.AnnotatedSection>
                    </Layout>
                  </Card>
                );
              })}
              <br />
              <Button
                primary
                onClick={() => {
                  setRegionExcludedModalActive(true);
                }}
              >
                Exclude Destinations
              </Button>
              <Modal
                title="Exclude Destinations"
                open={regionExcludedModalActive}
                onClose={() => {
                  setRegionExcludedModalActive(!regionExcludedModalActive);
                }}
                primaryAction={{
                  content: "Confirm",
                  onAction: () => {
                    setRegionExcludedModalActive(!regionExcludedModalActive);
                  },
                }}
              >
                <Card>
                  <Card.Section>
                    {countriestoExclude.map((value, ind) => {
                      return (
                        <Checkbox
                          key={ind}
                          label={value.value}
                          checked={value.checked}
                          onChange={(checkedValues) => {
                            value.checked = checkedValues;
                            handleRestrictCheck();
                          }}
                        />
                      );
                    })}
                  </Card.Section>
                </Card>
              </Modal>
            </Card>
          </div>
        </Card>
      )}
    </div>
  );
};

export default withRouter(ShippingPolicyUtkarsh);
