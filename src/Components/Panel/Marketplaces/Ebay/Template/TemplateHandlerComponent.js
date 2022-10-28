import React, { Component } from "react";
import { parseQueryString } from "../../../../../services/helperFunction";
import {
  Button,
  Checkbox,
  Modal,
  Page,
  Select,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import {
  duplicateTemplate,
  saveTemplates,
  saveTemplateToProfile,
} from "../../../../../Apirequest/ebayApirequest/templatesApi";
import { notify } from "../../../../../services/notify";
import TitleTemplatePolaris from "./TemplateBody/TitleTemplatePolaris";
import PricingTemplatePolaris from "./TemplateBody/PricingTemplatePolaris";
import CategoryTemplatePolarisNew from "./TemplateBody/CategoryTemplatePolarisNew";
import FinalInventoryTemplate from "./TemplateBody/FinalInventoryTemplate";
import { getProfiles } from "../../../../../APIrequests/ProfilesAPI";
import { getProfilesURLFilter } from "../../../../../URLs/ProfilesURL";

class TemplateHandlerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      id: "",
      loader: false,
      siteID: "",
      shopID: "",
      saveTemplateToProfileModal: false,
      profilesList: [],
      selectedProfile: "",
    };
  }

  getAllProfiles = async () => {
    let dataToPost = {
      marketplace: "ebay",
      grid: true,
    };
    let { success, data, message } = await getProfiles(
      getProfilesURLFilter,
      dataToPost
    );
    if (success && data.rows.length) {
      let temp = data.rows.map((row) => {
        return { label: row.name, value: row.profile_id };
      });
      this.setState({ profilesList: [...temp] });
    } else {
      notify.error(message);
      this.props.history.push("/auth/login");
    }
  };
  componentDidMount() {
    this.getParams();
    this.getAllProfiles();
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

  createDuplicateTemplate = async () => {
    const postData = { template_id: this.state.id };
    let { success, message } = await duplicateTemplate(postData);
    if (success) {
      notify.success(message);
      this.redirect("/panel/ebay/templates");
    } else {
      notify.error(message);
      this.setState({ saveTemplateToProfileModal: false });
    }
  };

  saveToAllProfile = async (profileId) => {
    const postData = {
      profile_id: profileId,
      template_id: this.state.id,
      type: this.state.type,
    };
    if (this.state.type === "category") postData["shop_id"] = this.state.shopID;
    let { success, message } = await saveTemplateToProfile(postData);
    if (success) {
      notify.success(message);
      this.redirect("/panel/ebay/templates");
    } else {
      notify.error(message);
      this.setState({ saveTemplateToProfileModal: false });
    }
  };

  saveToSpecificProfile = () => {
    let temp = { ...this.state };
    temp["saveTemplateToProfileModal"] = true;
    this.setState(temp);
  };

  prepareOptionsforAction = () => {
    const tempArr = [
      {
        content: "Create duplicate template",
        onAction: this.createDuplicateTemplate,
      },
    ];
    if (this.state.profilesList.length) {
      tempArr.push(
        {
          content: "Save to all profile",
          onAction: () => this.saveToAllProfile("all"),
        },
        {
          content: "Save to specified profile",
          onAction: this.saveToSpecificProfile,
        }
      );
    }
    return tempArr;
  };

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
        actionGroups={
          id
            ? [
                {
                  title: "Actions",
                  actions: this.prepareOptionsforAction(),
                },
              ]
            : []
        }
      >
        {this.getTemplatebody(type)}
        <Modal
          open={this.state.saveTemplateToProfileModal}
          onClose={() => {
            let temp = { ...this.state };
            temp["saveTemplateToProfileModal"] = false;
            this.setState(temp);
          }}
          title="Please select one profile for save template"
        >
          <Modal.Section>
            <TextContainer>
              <Stack distribution="fillEvenly" spacing="extraTight">
                {/* {this.state.profilesList.map((profile, index) => (
                  <Checkbox
                    label={profile.name}
                    checked={profile.checked}
                    onChange={() => {
                      let temp = { ...this.state };
                      temp["profilesList"][index]["checked"] = !profile.checked;
                      this.setState(temp);
                    }}
                  />
                ))} */}
                <Select
                  options={this.state.profilesList}
                  value={this.state.selectedProfile}
                  onChange={(e) => {
                    this.setState({ selectedProfile: e });
                  }}
                  placeholder="Please Select..."
                />
              </Stack>
              <Stack distribution="center">
                <Button
                  onClick={() => {
                    let temp = { ...this.state };
                    temp["selectedProfile"] = "";
                    temp["saveTemplateToProfileModal"] = false;
                    this.setState(temp);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  onClick={() => {
                    this.saveToAllProfile(this.state.selectedProfile);
                  }}
                  disabled={!this.state.selectedProfile}
                >
                  Save
                </Button>
              </Stack>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Page>
    );
  }
}

export default TemplateHandlerComponent;
