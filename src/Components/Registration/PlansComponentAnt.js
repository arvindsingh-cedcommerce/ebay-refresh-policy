import {
  PageHeader,
  Card,
  Alert,
  Row,
  Col,
  Switch,
  Typography,
  List,
  Avatar,
  Button,
  Divider,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Banner,
  Button as ShopifyButton,
  Modal,
  SkeletonBodyText,
  SkeletonDisplayText,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import {
  ExclamationCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import {
  checkStepCompleted,
  choosePlan,
  getActivePlan,
  getPlans,
  getUserDetails,
  saveCompletedStep,
  saveUserDetails,
} from "../../Apirequest/registrationApi";
import { notify } from "../../services/notify";
import { withRouter } from "react-router-dom";
import { tokenExpireValues } from "../../HelperVariables";
import PlansFAQComponent from "./PlansFAQComponent";
import { getMethod } from "../../APIrequests/DashboardAPI";
import { faqAPI } from "../../APIrequests/HelpAPI";

const { Title, Text, Link } = Typography;
const PlansComponentAnt = ({
  // plans,
  plansComponentCallback,
  fromOnBoarding,
  setCurrentStep,
  currentStep,
  ...props
}) => {
  const [reactSwitchPlan, setReactSwitchPlan] = useState(true);
  const [plans, setPlans] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [openPaymentRedirectModal, setOpenPaymentRedirectModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });

  // const [choosePlanBtnLoader, setChoosePlanBtnLoader] = useState(false);
  const [freePlan, setFreePlan] = useState({});

  const [okPlanLoader, setOkPlanLoader] = useState(false);
  // faq
  const [faqArray, setFaqArray] = useState([]);

  const [faqLoader, setFaqLoader] = useState(false);

  const hitRequiredFuncs = async () => {
    let { success, data: apiData, message, code } = await getPlans();
    if (success) {
      const { data: planData } = apiData;
      if (planData.rows) {
        let tempFreePlan = planData.rows.find(
          (plan) => plan["custom_price"] == 0
        );
        // console.log(tempFreePlan);
        setFreePlan(tempFreePlan);
        let tempPlans = planData.rows
          .filter((plan) => plan["custom_price"] != 0)
          .map((plan) => {
            return { ...plan, choosePlanBtnLoader: false };
          });
        setPlans(tempPlans);
      }
      setShowSkeleton(false);
      // console.log(planData.rows, plans);
      // console.log(planData.rows[2], plans[0]);
    } else {
      notify.error(message);
      if (tokenExpireValues.includes(code)) {
        props.history.push("/auth/login");
      }
    }
  };
  useEffect(() => {
    document.title = "Plans | Integration for eBay";
    document.description = "Plans";
    hitRequiredFuncs();
    fromOnBoarding && checkActivePlan();
    getAllFAQs();
  }, []);

  const checkActivePlan = async () => {
    let { success, data } = await getActivePlan();
    if (success) {
      if (data?.active_plan && data?.active_plan?.status === "active") {
        await saveCompletedStep(3);

        let { success, data } = await checkStepCompleted();
        if (success) {
          setCurrentStep(data);
        }
      }
    }
  };

  const getAllFAQs = async () => {
    let pricingFaqs = [];
    setFaqLoader(true);
    let { success, data } = await getMethod(faqAPI, {
      type: "FAQ",
    });
    if (success) {
      let temp = data
        .map((faq) => {
          return faq.data;
        })
        .filter((faq) => faq.showInApp === "Pricing" && faq.enable)
        .map((faq) => {
          return {
            title: faq.title,
            description: faq.description,
            isOpen: false,
          };
        });
      setFaqArray(temp);
      // let parsedData = getParseFaqData(data);
      // setFaqData(parsedData);
    }
    setFaqLoader(false);
  };

  const hitTestAPI = async (plan) => {
    plan["choosePlanBtnLoader"] = true;
    setPlans([...plans]);
    if (plan.plan_id) {
      let { success, data, message } = await choosePlan({
        plan_id: plan.plan_id,
      });
      if (success) {
        if (data?.confirmation_url) {
          setOpenPaymentRedirectModal({
            ...openPaymentRedirectModal,
            active: true,
            content: "Redirect to Shopify for payment?",
            url: data?.confirmation_url,
          });
        }
      } else {
        notify.error(message);
      }
      plan["choosePlanBtnLoader"] = false;
      setPlans([...plans]);
    }
  };

  // const onMouseHoverCard = () => {
  //   var plansCard = document.getElementsByClassName("plansCard");
  //   for (var i = 0; i < plansCard.length; i++) {
  //     plansCard[i].addEventListener("mouseover", function () {
  //       var current = document.getElementsByClassName("active");
  //       current[0].className = current[0].className.replace(" active", "");
  //       this.className += " active";
  //     });
  //   }
  // };

  const onMouseHoverCard = () => {
    var plansCard = document.getElementsByClassName("plansCard");
    for (var i = 0; i < plansCard.length; i++) {
      if (window.innerWidth >= 767) {
        plansCard[i].addEventListener("mouseover", function () {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
      } else {
        plansCard[i].addEventListener("click", function () {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
      }
    }
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      ghost={true}
      // style={{ padding: "0px 10px 10px 10px", height: "calc(100vh - 50px)" }}
    >
      <div
      // style={
      //   // currentStep === 4
      //   // ?
      //   fromOnBoarding
      //     ? {
      //         border: "2px solid #008060",
      //         borderRadius: "3px",
      //         boxShadow: "0px 0px 5px 5px rgb(0 128 96 / 29%)",
      //       }
      //     : {}
      //   // : {
      //   //     pointerEvents: "none",
      //   //     opacity: 0.8,
      //   //   }
      // }
      >
        <Card
          size="small"
          style={{ borderRadius: "8px" }}
          bodyStyle={{ padding: "10px 20px 10px 20px" }}
          // primaryFooterAction={{
          //   content: "Next",
          //   // onAction: () => setCurrentStep(currentStep + 1),
          //   onAction: async () => {
          //     // let dataToPost = {
          //     //   alreadySellingOnEbayValue: alreadySellingOnEbayValue,
          //     //   necessaryFilterValue: necessaryFilterValue,
          //     // };
          //     let { success, message } = await saveUserDetails();

          //     if (success) {
          //       console.log("92 plan");
          //       await saveCompletedStep(3);

          //       let { success, data } = await checkStepCompleted();
          //       if (success) {
          //         setCurrentStep(data);
          //         let { success, data: getDetails } = await getUserDetails();
          //         if (success) {
          //           console.log(getDetails);
          //         }
          //       }
          //     }
          //   },
          //   disabled: currentStep !== 4,
          // }}
          // secondaryFooterActions={
          //   fromOnBoarding && [
          //     {
          //       content: "Skip With Free Plan",
          //       // onAction: () => setCurrentStep(currentStep + 1),
          //       onAction: async () => {
          //         let dataToPost = {
          //           free_plan: true,
          //         };
          //         let { success: detailsSavedSuccess, message } =
          //           await saveUserDetails(dataToPost);

          //         if (detailsSavedSuccess) {
          //           console.log("120 skip with free plan");
          //           await saveCompletedStep(3);

          //           let { success, data } = await checkStepCompleted();
          //           if (success) {
          //             setCurrentStep(data);
          //             // let { success, data: getDetails } =
          //             //   await getUserDetails();
          //             // if (success) {
          //             //   console.log(getDetails);
          //             // }
          //           }
          //         }
          //       },
          //     },
          //   ]
          // }
        >
          <Row gutter={[8, 32]} justify="center" className="plansCardRow">
            <Col span={24}>
              {fromOnBoarding ? (
                <React.Fragment>
                  <Row justify="space-between" style={{ marginBottom: "20px" }}>
                    <Col>
                      <Title style={{ marginRight: "20px" }} level={4}>
                        Choose Plan
                      </Title>
                    </Col>
                    <Col>
                      <ShopifyButton
                        primary
                        onClick={async () => {
                          await hitTestAPI(freePlan);
                          await saveCompletedStep(3);
                          let { success, data } = await checkStepCompleted();
                          if (success) {
                            setCurrentStep(data);
                          }
                        }}
                      >
                        Skip with free plan
                      </ShopifyButton>
                    </Col>
                  </Row>
                  <Banner status="info">
                    <p>
                      The following plans allow you to list products on eBay's
                      marketplace using the Application. It has no relation to
                      the selling limit imposed by eBay to sellers. Sellers need
                      to contact eBay directly for that purpose.
                    </p>
                  </Banner>
                </React.Fragment>
              ) : (
                <Row gutter={[8, 8]} style={{ textAlign: "center" }}>
                  <Col span={24}>
                    <Title style={{ marginBottom: "0px" }}>
                      Choose the best plan
                    </Title>
                    {/* <Button onClick={async() => {
                      let {success, data} = await choosePlan({plan_id: 1})
                      if(success) {
                        console.log(data);
                      }
                    }}>Buy</Button> */}
                  </Col>
                  <Col span={24}>
                    <Text>
                      If you already have an existing plan you can upgrade or
                      downgrade your plan
                    </Text>
                  </Col>
                  <Col span={24}>
                    <Badge status="warning">
                      <Text strong>
                        If you want a custom plan feel free to&nbsp;
                        <span
                          onClick={() => {
                            props.history.push("/panel/ebay/contactUs");
                          }}
                        >
                          <Link>contact Us</Link>
                        </span>
                      </Text>
                    </Badge>
                    {/* <div style={{ width: "50%", margin: "0 auto" }}> */}
                    {/* <Banner status="warning" icon={false}>
                        <Text strong>
                          If you want a custom plan feel free to&nbsp;
                          <span
                            onClick={() => {
                              props.history.push("/panel/ebay/contactUs");
                            }}
                          >
                            <Link>contact Us</Link>
                          </span>
                        </Text>
                      </Banner> */}
                    {/* <Alert
                        message={
                          <Text strong>
                            If you want a custom plan feel free to&nbsp;
                            <Link href="https://ant.design" target="_blank">
                              contact Us
                            </Link>
                          </Text>
                        }
                        type="warning"
                      /> */}
                    {/* </div> */}
                  </Col>
                </Row>
              )}
            </Col>
            <Col span={24}>
              <Row justify="center" gutter={8} align="middle">
                <Col style={reactSwitchPlan ? { opacity: "0.5" } : {}}>
                  Monthly
                </Col>
                <Col>
                  <Switch
                    checked={reactSwitchPlan}
                    onChange={(e) => setReactSwitchPlan(e)}
                    style={
                      reactSwitchPlan
                        ? { background: "#1890ff" }
                        : { background: "#1890ff" }
                    }
                  />
                </Col>
                <Col style={!reactSwitchPlan ? { opacity: "0.5" } : {}}>
                  Annually
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="center" gutter={8} style={{ marginBottom: "30px" }}>
                {showSkeleton
                  ? [1, 2, 3, 4, 5].map((e) => (
                      <Col
                        span={4}
                        xs={24}
                        sm={16}
                        md={12}
                        lg={8}
                        xl={4}
                        xxl={4}
                      >
                        <Card title={<SkeletonDisplayText size="small" />}>
                          <SkeletonBodyText />
                        </Card>
                      </Col>
                    ))
                  : plans
                      .filter((plan) =>
                        !reactSwitchPlan
                          ? plan["validity"] == "30"
                          : plan["validity"] == "365"
                      )
                      .map((plan, index) => {
                        return (
                          <Col
                            span={4}
                            xs={24}
                            sm={16}
                            md={12}
                            lg={8}
                            xl={4}
                            xxl={4}
                            style={{ padding: "0" }}
                          >
                            <Card
                              title={<Title level={5}> {plan["title"]}</Title>}
                              size="small"
                              className={
                                plan["title"] === "Silver"
                                  ? "plansCard active"
                                  : "plansCard"
                              }
                              onMouseOver={onMouseHoverCard}
                              style={{ borderRadius: "8px" }}
                            >
                              <Row align="middle">
                                <Col>
                                  <Title
                                    level={2}
                                  >{`$${plan["custom_price"]}`}</Title>
                                </Col>
                                <Col>
                                  <Title level={5}>
                                    {/* {!reactSwitchPlan ? "/monthly" : "/yearly"} */}
                                    {!reactSwitchPlan ? "/month" : "/year"}
                                  </Title>
                                </Col>
                              </Row>
                              <List
                                itemLayout="horizontal"
                                dataSource={
                                  plan["services_groups"]
                                  // [0]["services"]
                                }
                                size="small"
                                renderItem={(service) => {
                                  return (
                                    <List.Item
                                      style={{
                                        border: "0px",
                                        padding: "0px 0px",
                                      }}
                                    >
                                      <List.Item.Meta
                                        style={{
                                          display: "flex",
                                          alignItems: "baseline",
                                          marginRight: "0px !important",
                                        }}
                                        avatar={
                                          <Avatar
                                            style={{
                                              color: "rgba(0, 0, 0, 0.45)",
                                              backgroundColor: "#fff",
                                              marginRight: "0px !important",
                                            }}
                                            icon={<RightCircleOutlined />}
                                          />
                                        }
                                        description={
                                          <Text type="secondary">
                                            {service["description"]}
                                          </Text>
                                        }
                                      />
                                    </List.Item>
                                  );
                                }}
                              />
                              <Row
                                justify="center"
                                style={{ marginTop: "20px" }}
                              >
                                <ShopifyButton
                                  primary
                                  size="slim"
                                  loading={plan.choosePlanBtnLoader}
                                  onClick={() => {
                                    hitTestAPI(plan);
                                  }}
                                  // onClick={() =>

                                  //   confirm({
                                  //     title: "Redirect to Shopify for payment?",
                                  //     icon: <ExclamationCircleOutlined />,
                                  //     onOk() {
                                  //       fromOnBoarding
                                  //         ? plansComponentCallback()
                                  //         : setOpenPaymentRedirectModal(false);
                                  //     },
                                  //     onCancel() {
                                  //       setOpenPaymentRedirectModal(false);
                                  //     },
                                  //   })
                                  // }
                                >
                                  Choose Plan
                                </ShopifyButton>
                              </Row>
                            </Card>
                          </Col>
                        );
                      })}
              </Row>
            </Col>
          </Row>{" "}
          <Row gutter={[0, 16]}>
            <Col span={24}>
              {" "}
              <PlansFAQComponent
                faqLoader={faqLoader}
                faqs={faqArray}
                setFaqArray={setFaqArray}
              />
            </Col>{" "}
          </Row>
        </Card>
      </div>
      <Modal
        open={openPaymentRedirectModal.active}
        onClose={() =>
          setOpenPaymentRedirectModal({
            ...openPaymentRedirectModal,
            active: false,
          })
        }
      >
        <Modal.Section>
          <TextContainer>
            <Text strong>Redirect to Shopify for payment?</Text>
            <Stack distribution="center" spacing="tight">
              <ShopifyButton
                onClick={() => {
                  setOpenPaymentRedirectModal({
                    ...openPaymentRedirectModal,
                    active: false,
                  });
                }}
              >
                Cancel
              </ShopifyButton>
              <ShopifyButton
                primary
                loading={okPlanLoader}
                onClick={() => {
                  setOkPlanLoader(true);
                  window.open(openPaymentRedirectModal.url, "_self");
                }}
              >
                OK
              </ShopifyButton>
            </Stack>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </PageHeader>
  );
};

export default withRouter(PlansComponentAnt);
