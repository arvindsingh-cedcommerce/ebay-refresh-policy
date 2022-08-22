import React, { Component } from "react";
import { parseQueryString } from "../../../../../services/helperFunction";
import { notify } from "../../../../../services/notify";
import { saveBusinessPolicy } from "../../../../../Apirequest/ebayApirequest/policiesApi";
import { modalPolaris } from "../../../../../PolarisComponents/ModalGroups";
import { bannerPolaris } from "../../../../../PolarisComponents/InfoGroups";
import { CircleAlertMajorMonotone } from "@shopify/polaris-icons";
import { PageHeader } from "antd";
import ShippingPolicyUtkarsh from "./PolicyBody/ShippingPolicyUtkarsh";
import ReturnPolicyComponentUtkarsh from "./ReturnPolicyComponentUtkarsh";
import PaymentPolicyUtkarshNew from "./PolicyBody/PaymentPolicyUtkarshNew";
import { withRouter } from "react-router-dom";

class PolicyHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      id: "",
      shop_id: "",
      loader: false,
      site_id: "",
      errors_recieved_policy: [],
    };
  }

  redirect(url) {
    this.props.history.push(url);
  }

  getPolicybody(type) {
    let { id, loader, site_id, shop_id } = this.state;
    switch (type.toLowerCase()) {
      case "payment":
        return (
          <PaymentPolicyUtkarshNew
            type={type}
            id={id}
            site_id={site_id}
            loader={loader}
            shop_id={shop_id}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
        );
      case "return":
        return (
          <ReturnPolicyComponentUtkarsh
            id={id}
            site_id={site_id}
            loader={loader}
            shop_id={shop_id}
            recieveFormdata={this.recieveFormdata.bind(this)}
            type={type}
          />
        );
      case "shipping":
        return (
          <ShippingPolicyUtkarsh
            id={id}
            site_id={site_id}
            loader={loader}
            shop_id={shop_id}
            recieveFormdata={this.recieveFormdata.bind(this)}
            type={type}
          />
        );
      default:
        return [];
    }
  }

  componentDidMount() {
    this.getParams();
  }

  loaderToggle(toggle) {
    this.setState({ loader: toggle });
  }

  prepareErrorModal(data) {
    console.log("data", data);
    let temparr = [];
    Object.keys(data).map((key) => {
      data[key].forEach((value) => {
        temparr.push(
          bannerPolaris(
            "",
            `${key.toUpperCase()} Policy : ${
              value.hasOwnProperty("message") ? value.message : value
            }`,
            "critical",
            CircleAlertMajorMonotone
          )
        );
      });
      return true;
    });
    this.setState({ errors_recieved_policy: [...temparr] });
  }

  async recieveFormdata(policy) {
    let { site_id, shop_id, id } = this.state;
    this.loaderToggle(true);
    let requestData = {
      data: policy,
      site_id,
      shop_id,
      type: Object.keys(policy)[0],
    };
    if (id !== "") requestData = { ...requestData, profileId: id };
    let { success, data, code, message } = await saveBusinessPolicy(
      requestData
    );
    this.loaderToggle(false);
    if (success) {
      notify.success("Business policy saved successfully");
      return true;
    } else {
      if (code && code !== "something_went_wrong") this.prepareErrorModal(data);
      else notify.error(message);
      return false;
    }
  }

  closeErrorModal() {
    this.setState({ errors_recieved_policy: [] });
  }

  async getParams() {
    let { type, id, site_id, shop_id } = parseQueryString(
      this.props.location.search
    );
    if (type) {
      this.setState({ type, id, site_id, shop_id }, () => {});
    } else this.redirect("/panel/ebay/policy");
  }

  render() {
    let { type, id, errors_recieved_policy } = this.state;
    let openModal = errors_recieved_policy.length;
    return (
      <PageHeader
        className="site-page-header-responsive"
        title={!id ? "Create policy" : "View policy"}
        ghost={true}
        onBack={() => {
          this.redirect("/panel/ebay/policy");
        }}
      >
        {this.getPolicybody(type)}
        {modalPolaris(
          `Policy creation errors`,
          openModal,
          this.closeErrorModal.bind(this),
          false,
          errors_recieved_policy
        )}
      </PageHeader>
    );
  }
}

export default withRouter(PolicyHandler);
