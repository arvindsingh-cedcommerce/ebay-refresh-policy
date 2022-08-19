import {
  Banner,
  Button,
  Card,
  DisplayText,
  Layout,
  List,
  Modal,
  Stack,
  TextStyle,
} from "@shopify/polaris";
import React, { useState } from "react";
import Switch from "react-switch";
import {
  checkStepCompleted,
  saveCompletedStep,
  saveUserDetails,
} from "../../Apirequest/registrationApi";
// import { Switch } from 'antd';

const PlansComponent = ({
  plans,
  plansComponentCallback,
  fromOnBoarding,
  setCurrentStep,
  currentStep,
}) => {
  const [reactSwitchPlan, setReactSwitchPlan] = useState(false);

  const [openPaymentRedirectModal, setOpenPaymentRedirectModal] =
    useState(false);

  return (
    <Card sectioned>
      <Layout>
        <Layout.Section oneThird>
          <div
            style={
              // currentStep === 4
              // ?
              fromOnBoarding
                ? {
                    border: "2px solid #008060",
                    borderRadius: "3px",
                    boxShadow: "0px 0px 5px 5px rgb(0 128 96 / 29%)",
                  }
                : {}
              // : {
              //     pointerEvents: "none",
              //     opacity: 0.8,
              //   }
            }
          >
            <Card
              title="Choose a Plan"
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
              //       await saveCompletedStep(4);

              //       let { success, data } = await checkStepCompleted();
              //       if (success) {
              //         setCurrentStep(data);
              //         let { success, data: getDetails } =
              //           await getUserDetails();
              //         if (success) {
              //           console.log(getDetails);
              //         }
              //       }
              //     }
              //   },
              //   disabled: currentStep !== 4,
              // }}
              secondaryFooterActions={
                fromOnBoarding && [
                  {
                    content: "Skip With Free Plan",
                    // onAction: () => setCurrentStep(currentStep + 1),
                    onAction: async () => {
                      let dataToPost = {
                        free_plan: true,
                      };
                      let { success: detailsSavedSuccess, message } =
                        await saveUserDetails(dataToPost);

                      if (detailsSavedSuccess) {
                        await saveCompletedStep(4);

                        let { success, data } = await checkStepCompleted();
                        if (success) {
                          setCurrentStep(data);
                          // let { success, data: getDetails } =
                          //   await getUserDetails();
                          // if (success) {
                          //   console.log(getDetails);
                          // }
                        }
                      }
                    },
                  },
                ]
              }
            >
              <Card.Section>
                <Banner title="Please note" status="warning">
                  <TextStyle variation="subdued">
                    The plans listed below provide the service to list the
                    products on eBay marketplace. It is not related in any way
                    with the selling limit of seller on eBay marketplace, for
                    that seller need to contact with eBay marketplace
                    separately.
                  </TextStyle>
                </Banner>
              </Card.Section>
              <Card.Section>
                <Stack
                  vertical={false}
                  alignment={"center"}
                  distribution="center"
                >
                  <div style={reactSwitchPlan ? { opacity: "0.5" } : {}}>
                    Monthly
                  </div>
                  {/* <Switch defaultChecked onChange={(e) => setReactSwitchPlan(e)} /> */}
                  <Switch
                    onChange={(e) => setReactSwitchPlan(e)}
                    checked={reactSwitchPlan}
                    onColor="#008060"
                    offColor="#008060"
                    activeBoxShadow="0px 0px 1px 0px rgba(0, 0, 0, 0.2)"
                    checkedIcon={false}
                    uncheckedIcon={false}
                  />
                  <div style={!reactSwitchPlan ? { opacity: "0.5" } : {}}>
                    Annually
                  </div>
                </Stack>
                <Stack spacing="loose" distribution="center">
                  {plans
                    .filter((plan) =>
                      !reactSwitchPlan
                        ? plan["validity"] === "30"
                        : plan["validity"] === "365"
                    )
                    .map((plan) => {
                      return (
                        <Card sectioned>
                          <Stack vertical spacing="extraTight">
                            <DisplayText size="medium">
                              {plan["title"]}
                            </DisplayText>
                            <Stack
                              vertical={false}
                              spacing="extraTight"
                              alignment="trailing"
                            >
                              <DisplayText size="extraLarge">{`$${plan["custom_price"]}`}</DisplayText>
                              <DisplayText size="small">
                                {!reactSwitchPlan ? "monthly" : "yearly"}
                              </DisplayText>
                            </Stack>
                            <TextStyle variation="subdued">
                              <List type="bullet">
                                {plan["services_groups"][0]["services"].map(
                                  (service) => (
                                    <List.Item>{service["title"]}</List.Item>
                                  )
                                )}
                              </List>
                            </TextStyle>
                            <DisplayText size="medium">
                              <Button
                                primary
                                onClick={() =>
                                  setOpenPaymentRedirectModal(true)
                                }
                              >
                                Choose Plan
                              </Button>
                            </DisplayText>
                          </Stack>
                        </Card>
                      );
                    })}
                </Stack>
                <Modal
                  open={openPaymentRedirectModal}
                  onClose={() => setOpenPaymentRedirectModal(false)}
                  title="Redirect to Shopify for payment?"
                  primaryAction={{
                    content: "Redirect",
                    onAction: () =>
                      fromOnBoarding
                        ? plansComponentCallback()
                        : setOpenPaymentRedirectModal(false),
                  }}
                ></Modal>
              </Card.Section>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Card>
  );
};

export default PlansComponent;
