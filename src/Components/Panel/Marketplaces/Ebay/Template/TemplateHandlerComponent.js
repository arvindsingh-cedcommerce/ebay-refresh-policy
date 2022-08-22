import React, { Component } from "react";
import { parseQueryString } from "../../../../../services/helperFunction";
import { Page } from "@shopify/polaris";
import { saveTemplates } from "../../../../../Apirequest/ebayApirequest/templatesApi";
import { notify } from "../../../../../services/notify";
import TitleTemplatePolaris from "./TemplateBody/TitleTemplatePolaris";
import PricingTemplatePolaris from "./TemplateBody/PricingTemplatePolaris";
import CategoryTemplatePolarisNew from "./TemplateBody/CategoryTemplatePolarisNew";
import FinalInventoryTemplate from "./TemplateBody/FinalInventoryTemplate";

class TemplateHandlerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      id: "",
      loader: false,
      siteID: "",
      shopID: "",
    };
  }

  componentDidMount() {
    this.getParams();
  }

  async getParams() {
    let { type, id, siteID, shopID } = parseQueryString(
      this.props.location.search
    );
    if (type) {
      this.setState({ type, id, siteID, shopID });
    } else this.redirect("/panel/ebay/templates/grid");
  }

  redirect(url) {
    this.props.history.push(url);
  }
  loaderToggle(toggle) {
    this.setState({ loader: toggle });
  }

  async recieveFormdata(data) {
    data = { ...data, marketplace: "ebay" };
    this.loaderToggle(true);
    let { success, message } = await saveTemplates(data);
    this.loaderToggle(false);
    if (success) {
      notify.success(message);
      return true;
    } else {
      notify.error(message);
      return false;
    }
  }

  getTemplatebody(type) {
    let { id, loader, siteID, shopID } = this.state;
    switch (type) {
      case "inventory":
        return (
          <FinalInventoryTemplate
            id={id}
            loader={loader}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
        );
      case "title":
        return (
          <TitleTemplatePolaris
            id={id}
            loader={loader}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
        );
      case "price":
        return (
          <PricingTemplatePolaris
            id={id}
            loader={loader}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
        );
      case "category":
        return (
          <CategoryTemplatePolarisNew
            siteID={siteID}
            shopID={shopID}
            id={id}
            loader={loader}
            showSecondaryCategory={true}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
        );
      default:
        return [];
    }
  }

  render() {
    let { type, id } = this.state;
    let title = !id ? "Create template" : "Edit template";
    return (
      <Page
        breadcrumbs={[
          {
            content: "Templates",
            onAction: this.redirect.bind(this, "/panel/ebay/templates/grid"),
          },
        ]}
        title={title}
        fullWidth={true}
      >
        {this.getTemplatebody(type)}
      </Page>
    );
  }
}

export default TemplateHandlerComponent;
