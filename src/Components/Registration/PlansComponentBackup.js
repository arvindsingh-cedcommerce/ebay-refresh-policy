import {
    Button,
    Card,
    ChoiceList,
    DisplayText,
    Icon,
    List,
    Modal,
    Stack,
    TextContainer,
    TextStyle,
    Tooltip,
  } from "@shopify/polaris";
  import { QuestionMarkMajorTwotone } from "@shopify/polaris-icons";
  import React, { useState } from "react";
  import Switch from "react-switch";
  
  const PlansComponentBackup = ({ plans }) => {
    const [reactSwitchPlan, setReactSwitchPlan] = useState(false);
  
    console.log("plans", plans);
    const [openPaymentRedirectModal, setOpenPaymentRedirectModal] =
      useState(false);
  
    const monthlyPlans = plans.filter((plan) => plan["validity"] === "30");
  
    const monthlyPlansList = monthlyPlans.map((plan) => {
      return { label: plan, value: plan["title"] };
    });
    console.log("monthlyPlansList", monthlyPlansList);
    const [selectedMontlyPlan, setSelectedMontlyPlan] = useState(
      monthlyPlansList[0]
    );
    const annualPlans = plans.filter((plan) => plan["validity"] === "365");
    //   console.log("annualPlans", annualPlans);
    //   console.log("reactSwitchPlan", reactSwitchPlan);
  
    return (
      <Card.Section>
        {/* <div style={{ minWidth: "100%" }}> */}
          <Stack vertical={false} alignment={"center"} distribution="center">
            <div style={reactSwitchPlan ? { opacity: "0.5" } : {}}>
              Monthly
            </div>
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
        {/* </div> */}
        <Stack spacing="loose" distribution="center">
          {!reactSwitchPlan
            ? monthlyPlans.map((plan) => (
                <Card
                  sectioned
                  // title={plan["title"]}
                >
                  <Stack vertical spacing="extraTight">
                    <DisplayText size="medium">{plan["title"]}</DisplayText>
                    <Stack
                      vertical={false}
                      spacing="extraTight"
                      alignment="trailing"
                    >
                      <DisplayText size="extraLarge">{`$${plan["custom_price"]}`}</DisplayText>
                      <DisplayText size="small">/month</DisplayText>
                    </Stack>
                    <TextStyle variation="subdued">
                      <List type="bullet">
                        {plan["services_groups"][0]["services"].map((service) => (
                          <List.Item>{service["title"]}</List.Item>
                        ))}
                      </List>
                    </TextStyle>
  
                    <DisplayText size="medium">
                      <Button
                        primary
                        onClick={() => setOpenPaymentRedirectModal(true)}
                      >
                        Choose Plan
                      </Button>
                    </DisplayText>
                  </Stack>
                </Card>
              ))
            : annualPlans.map((plan) => (
                <Card sectioned>
                  <Stack
                    vertical={false}
                    distribution="equalSpacing"
                    alignment="center"
                  >
                    <Stack vertical spacing="extraTight">
                      <DisplayText size="medium">{plan["title"]}</DisplayText>
                      <Stack
                        vertical={false}
                        spacing="extraTight"
                        alignment="trailing"
                      >
                        <DisplayText size="extraLarge">{`$${plan["custom_price"]}`}</DisplayText>
                        <DisplayText size="small">/year</DisplayText>
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
                          onClick={() => setOpenPaymentRedirectModal(true)}
                        >
                          Choose Plan
                        </Button>
                      </DisplayText>
                    </Stack>
                  </Stack>
                </Card>
              ))}
        </Stack>
        {/* <Stack vertical={false} alignment={"center"} distribution="center">
          <span style={reactSwitchPlan ? { opacity: "0.5" } : {}}>
            Billed Monthly
          </span>
          <Switch
            onChange={(e) => setReactSwitchPlan(e)}
            checked={reactSwitchPlan}
            onColor="#008060"
            offColor="#008060"
            activeBoxShadow="0px 0px 1px 0px rgba(0, 0, 0, 0.2)"
            checkedIcon={false}
            uncheckedIcon={false}
          />
          <span style={!reactSwitchPlan ? { opacity: "0.5" } : {}}>
            Billed Annually
          </span>
        </Stack>
        <br />
        <Stack vertical spacing="tight">
          {!reactSwitchPlan
            ? monthlyPlans.map((plan) => (
                <Card
                  sectioned
                  // title={
                  //   <Stack
                  //     vertical={false}
                  //     distribution="equalSpacing"
                  //     alignment="center"
                  //   >
                  //     <Stack vertical spacing="extraTight">
                  //       <DisplayText size="small">{`$ ${plan["custom_price"]}/month`}</DisplayText>
                  //       <Stack
                  //         vertical={false}
                  //         distribution="leading"
                  //         spacing="tight"
                  //       >
                  //         <p>{plan["title"]}</p>
                  //         <Tooltip
                  //           content={
                  //             <List type="bullet">
                  //               {plan["services_groups"][0]["services"].map(
                  //                 (service) => (
                  //                   <List.Item>{service["title"]}</List.Item>
                  //                 )
                  //               )}
                  //             </List>
                  //           }
                  //         >
                  //           <TextStyle variation="strong">
                  //             <Icon
                  //               source={QuestionMarkMajorTwotone}
                  //               color="base"
                  //             />
                  //           </TextStyle>
                  //         </Tooltip>
                  //       </Stack>
                  //     </Stack>
                  //     <DisplayText size="medium">
                  //       <Button
                  //         primary
                  //         onClick={() => setOpenPaymentRedirectModal(true)}
                  //       >
                  //         Choose Plan
                  //       </Button>
                  //     </DisplayText>
                  //   </Stack>
                  // }
                >
                  <Stack
                    vertical={false}
                    distribution="equalSpacing"
                    alignment="center"
                  >
                    <Stack vertical spacing="extraTight">
                      <DisplayText size="small">{`$ ${plan["custom_price"]}/month`}</DisplayText>
                      <Stack
                        vertical={false}
                        distribution="leading"
                        spacing="tight"
                      >
                        <p>{plan["title"]}</p>
                        <Tooltip
                          content={
                            <List type="bullet">
                              {plan["services_groups"][0]["services"].map(
                                (service) => (
                                  <List.Item>{service["title"]}</List.Item>
                                )
                              )}
                            </List>
                          }
                        >
                          <TextStyle variation="strong">
                            <Icon
                              source={QuestionMarkMajorTwotone}
                              color="base"
                            />
                          </TextStyle>
                        </Tooltip>
                      </Stack>
                    </Stack>
                    <DisplayText size="medium">
                      <Button
                        primary
                        onClick={() => setOpenPaymentRedirectModal(true)}
                      >
                        Choose Plan
                      </Button>
                    </DisplayText>
                  </Stack>
                </Card>
              ))
            : annualPlans.map((plan) => (
                <Card
                  sectioned
                  // title={
                  //   <Stack
                  //     vertical={false}
                  //     distribution="equalSpacing"
                  //     alignment="center"
                  //   >
                  //     <Stack vertical spacing="extraTight">
                  //       <DisplayText size="medium">{`$ ${plan["custom_price"]}/year`}</DisplayText>
                  //       <Stack
                  //         vertical={false}
                  //         distribution="leading"
                  //         spacing="tight"
                  //       >
                  //         <p>{plan["title"]}</p>
                  //         <Tooltip
                  //           content={
                  //             <List type="bullet">
                  //               {plan["services_groups"][0]["services"].map(
                  //                 (service) => (
                  //                   <List.Item>{service["title"]}</List.Item>
                  //                 )
                  //               )}
                  //             </List>
                  //           }
                  //         >
                  //           <TextStyle variation="strong">
                  //             <Icon
                  //               source={QuestionMarkMajorTwotone}
                  //               color="base"
                  //             />
                  //           </TextStyle>
                  //         </Tooltip>
                  //       </Stack>
                  //     </Stack>
                  //     <DisplayText size="medium">
                  //       <Button
                  //         primary
                  //         onClick={() => setOpenPaymentRedirectModal(true)}
                  //       >
                  //         Choose Plan
                  //       </Button>
                  //     </DisplayText>
                  //   </Stack>
                  // }
                >
                  <Stack
                    vertical={false}
                    distribution="equalSpacing"
                    alignment="center"
                  >
                    <Stack vertical spacing="extraTight">
                      <DisplayText size="small">{`$ ${plan["custom_price"]}/year`}</DisplayText>
                      <Stack
                        vertical={false}
                        distribution="leading"
                        spacing="tight"
                      >
                        <p>{plan["title"]}</p>
                        <Tooltip
                          content={
                            <List type="bullet">
                              {plan["services_groups"][0]["services"].map(
                                (service) => (
                                  <List.Item>{service["title"]}</List.Item>
                                )
                              )}
                            </List>
                          }
                        >
                          <TextStyle variation="strong">
                            <Icon
                              source={QuestionMarkMajorTwotone}
                              color="base"
                            />
                          </TextStyle>
                        </Tooltip>
                      </Stack>
                    </Stack>
                    <DisplayText size="medium">
                      <Button
                        primary
                        onClick={() => setOpenPaymentRedirectModal(true)}
                      >
                        Choose Plan
                      </Button>
                    </DisplayText>
                  </Stack>
                </Card>
              ))}
        </Stack> */}
        <Modal
          open={openPaymentRedirectModal}
          onClose={() => setOpenPaymentRedirectModal(false)}
          title="Redirect to Shopify for payment?"
          primaryAction={{
            content: "Redirect",
            onAction: () => {},
          }}
        ></Modal>
      </Card.Section>
    );
  };
  
  export default PlansComponentBackup;
  