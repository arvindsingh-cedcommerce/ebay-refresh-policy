import React, { Component } from "react";
import { parseQueryString } from "../../services/helperFunction";
import { Spinner, Stack } from "@shopify/polaris";
import { displayText } from "../../PolarisComponents/InfoGroups";
import { checkStepCompleted, saveCompletedStep } from "../../Apirequest/registrationApi";
const SuccessCheck = require("../../assets/successcheck.png");
const FailedCross = require("../../assets/remove.png");

class Redirectmessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: "",
      message: "",
    };
  }

  getStep = async() => {
    let { success: nextStepSuccess, data: current_step } = await checkStepCompleted();
    // console.log("current_step", current_step);
    if(nextStepSuccess) {
      // if (current_step >= 5) {
      if (current_step >= 4) {
        this.getParams();
      } else {
        console.log('25 redirect msg');
        // await saveCompletedStep(2);
        // await saveCompletedStep(1);
        this.redirect("/registrations");
      }
    }
  };
  componentDidMount() {
    this.getStep();
  }

  getParams() {
    let { success, message } = parseQueryString(this.props.location.search);
    this.setState({ success, message }, () => {
      setTimeout(() => {
        this.redirect("/panel");
      }, 3000);
    });
  }

  redirect(url) {
    this.props.history.push(url);
  }

  render() {
    let { success, message } = this.state;
    return (
      <div style={{ marginTop: 50 }}>
        <Stack vertical={true} alignment={"center"}>
          {success !== "" && (
            <img
              alt={"Success"}
              src={success ? SuccessCheck : FailedCross}
              width={100}
            />
          )}
          <p style={{ fontSize: 19 }}>{message}</p>
          {displayText(
            "medium",
            "h4",
            <p>
              Redirecting...
              <Spinner
                accessibilityLabel="Spinner example"
                size="large"
                color="teal"
              />
            </p>
          )}
        </Stack>
      </div>
    );
  }
}

export default Redirectmessage;
