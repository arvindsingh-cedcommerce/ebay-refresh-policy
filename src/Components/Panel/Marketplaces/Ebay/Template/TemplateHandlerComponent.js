import React, { Component } from "react";
import { parseQueryString } from "../../../../../services/helperFunction";
import InventoryTemplate from "./TemplateBody/inventoryTemplate";
import { Page } from "@shopify/polaris";
import { saveTemplates } from "../../../../../Apirequest/ebayApirequest/templatesApi";
import { notify } from "../../../../../services/notify";
import TitleTemplate from "./TemplateBody/titleTemplate";
import PricingTemplate from "./TemplateBody/pricingTemplate";
import CategoryTemplate from "./TemplateBody/categoryTemplate";
import CategoryTemplateComponent from "./TemplateBody/CategoryTemplateComponent";
import PricingTemplateComponent from "./TemplateBody/PricingTemplateComponent";
import TitleTemplateComponent from "./TemplateBody/TitleTemplateComponent";
import InventoryTemplateComponent from "./TemplateBody/InventoryTemplateComponent";
import CategoryTemplatePolaris from "./TemplateBody/CategoryTemplatePolaris";
import InventoryTemplatePolaris from "./TemplateBody/InventoryTemplatePolaris";
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
    } else this.redirect("/panel/ebay/templatesUS/grid");
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
        // return <InventoryTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
        // return <InventoryTemplateComponent id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
        return (
          <FinalInventoryTemplate
            id={id}
            loader={loader}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
          // <InventoryTemplatePolaris
          //   id={id}
          //   loader={loader}
          //   recieveFormdata={this.recieveFormdata.bind(this)}
          // />
        );
      case "title":
        // return <TitleTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
        // return (
        //   <TitleTemplateComponent
        //     id={id}
        //     loader={loader}
        //     recieveFormdata={this.recieveFormdata.bind(this)}
        //   />
        // );
        return (
          <TitleTemplatePolaris
            id={id}
            loader={loader}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
        );
      case "price":
        // return <PricingTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
        // return (
        //   <PricingTemplateComponent
        //     id={id}
        //     loader={loader}
        //     recieveFormdata={this.recieveFormdata.bind(this)}
        //   />
        // );
        return (
          <PricingTemplatePolaris
            id={id}
            loader={loader}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
        );
      case "category":
        // return <CategoryTemplate id={id} loader={loader} showSecondaryCategory={true} recieveFormdata={this.recieveFormdata.bind(this)}  />
        // return (
        //   <CategoryTemplateComponent
        //     id={id}
        //     loader={loader}
        //     showSecondaryCategory={true}
        //     recieveFormdata={this.recieveFormdata.bind(this)}
        //   />
        // );
        return (
          <CategoryTemplatePolarisNew
            siteID={siteID}
            shopID={shopID}
            id={id}
            loader={loader}
            showSecondaryCategory={true}
            recieveFormdata={this.recieveFormdata.bind(this)}
          />
          // <CategoryTemplatePolaris
          //   siteID={siteID}
          //   shopID={shopID}
          //   id={id}
          //   loader={loader}
          //   showSecondaryCategory={true}
          //   recieveFormdata={this.recieveFormdata.bind(this)}
          // />
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
            onAction: this.redirect.bind(this, "/panel/ebay/templatesUS/grid"),
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
