import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  FormLayout,
  Layout,
  Select,
  SkeletonBodyText,
  SkeletonPage,
  Stack,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  getMetafields,
  getTemplatebyId,
} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import { ckeditor } from "../../../../../../PolarisComponents/InputGroups";
import { notify } from "../../../../../../services/notify";

export let AttributeMapoptions = [
  { label: "Title", value: "title" },
  { label: "Vendor", value: "vendor" },
  { label: "Description", value: "description" },
  { label: "Price", value: "price" },
  { label: "Product Type", value: "product_type" },
  { label: "Tags", value: "tags" },
  { label: "Set custom value", value: "default" },
];

let defaultAttributeoptions = [
  { label: "Title", value: "title" },
  { label: "Vendor", value: "vendor" },
  { label: "SKU", value: "sku" },
  { label: "Description", value: "description" },
  { label: "Price", value: "price" },
  { label: "Main image", value: "image_main" },
  { label: "Tags", value: "tags" },
  { label: "Product Type", value: "product_type" },
];

const TitleTemplatePolaris = (props) => {
  const [flag, setFlag] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    // site_id: "",
    // shop_id: "",
    set_subtitle: false,
    // motors: {
    //   selected: "title",
    //   default_setting: {
    //     value: "{{title}}",
    //   },
    // },
    title: {
      selected: "title",
      default_setting: {
        value: "{{title}}",
      },
      trim_title: false,
    },
    subtitle: {
      selected: "title",
      default_setting: {
        value: "{{title}}",
      },
    },
    description: {
      selected: "description",
      default_setting: {
        value: "{{description}}",
      },
    },
  });
  const [default_settings, setDefault_settings] = useState({
    title: "title",
    subtitle: "title",
    description: "description",
    motors: "title",
  });
  const [errors, setErrors] = useState({ name: false });
  const [id, setId] = useState("");
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const changeHandler = (value, ...formFields) => {
    let temp = { ...formData };
    if (formFields.length === 1) temp[formFields[0]] = value;
    else if (formFields.length === 2)
      temp[formFields[0]][formFields[1]] = value;
    else if (formData.length === 3)
      temp[formFields[0]][formFields[1]][formFields[2]] = value;
    setFormData(temp);
  };
  const prepareMetaOptions = async () => {
    let metaOptionsPrepared = [];
    let { success: metaFieldsSuccess, data: metaFieldsData } =
      await getMetafields();
    if (metaFieldsSuccess) {
      Object.values(metaFieldsData).forEach((meta) => {
        metaOptionsPrepared.push({ label: meta, value: meta });
      });
    }
    defaultAttributeoptions = [
      ...defaultAttributeoptions,
      ...metaOptionsPrepared,
    ];
    AttributeMapoptions = [...AttributeMapoptions, ...metaOptionsPrepared];
  };

  useEffect(() => {
    setId(props.id);
    prepareMetaOptions();
  }, []);

  const getTemplateData = async () => {
    setFlag(true);
    let templatedata = {};
    if (id) {
      let { success, data } = await getTemplatebyId(id);
      if (success) templatedata = { ...data.data };
      setFormData({ ...formData, ...templatedata });
    }
    setFlag(false);
  };

  useEffect(() => {
    if (id) getTemplateData();
  }, [id]);

  const defaultChangeHandler = (value, ...formFields) => {
    let temp = { ...default_settings };
    if (formFields.length === 1) {
      temp[formFields[0]] = value;
      let formDataCopy = { ...formData };
      formDataCopy[formFields[0]]["default_setting"]["value"] += `{{${value}}}`;
    }
    setDefault_settings(temp);
  };

  const formValidator = () => {
    let temp = { ...errors };
    let errorsCount = 0;
    Object.keys(formData).forEach((key) => {
      switch (key) {
        case "name":
          if (formData[key] === "") {
            temp[key] = true;
            errorsCount++;
          } else temp[key] = false;
          break;
        default:
          break;
      }
    });
    setErrors(temp);
    return errorsCount === 0;
  };

  const redirect = (url) => {
    props.history.push(url);
  };

  const saveFormdata = async () => {
    if (formValidator()) {
      setSaveBtnLoader(true);
      let tempObj = {
        title: formData.name,
        type: "title",
        data: formData,
      };
      if (id !== "") tempObj["_id"] = id;
      let returnedResponse = await props.recieveFormdata(tempObj);
      if (returnedResponse) {
        redirect("/panel/ebay/templates");
      }
      setSaveBtnLoader(false);
    } else {
      notify.error("Kindly fill all the required fields with proper values");
    }
  };

  return flag ? (
    <Card sectioned>
      <SkeletonPage fullWidth title="Title Template" primaryAction={false}>
        <Layout.AnnotatedSection
          id="templateName"
          title="Template name"
          description="Enter a unique template name"
        >
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          id="title"
          title="Title"
          description="Map Title to Shopify attributes (title, description, price, vendor, products type, tags) and can set custom values ahead of the Shopify title."
        >
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          id="setSubtitle"
          title="Set Subtitle"
          description="Facilitate you to add a sub-title for the products on eBay."
        >
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          id="Description"
          title="Description"
          description="Map Description for eBay with the Shopify attributes (title, description, price, vendor, products type, tags). Select Set Custom Values option to insert the customize description or the  HTML code for the description."
        >
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout.AnnotatedSection>
      </SkeletonPage>
    </Card>
  ) : (
    <Card
      title="Title Template"
      sectioned
      primaryFooterAction={{
        content: "Save",
        onAction: saveFormdata,
        loading: saveBtnLoader,
      }}
    >
      <Banner status="info">
        <p>
          Title template helps you map desired Shopify attributes to Title, sub
          title & description attribute of eBay. You can even pass combination
          of Shopify attributes and custom values to the aforementioned eBay
          attributes.
        </p>
      </Banner>
      <Card.Section>
        <Layout>
          <Layout.AnnotatedSection
            id="templateName"
            title="Template name"
            description="Enter a unique template name"
          >
            <Card sectioned>
              <TextField
                value={formData.name}
                onChange={(e) => changeHandler(e, "name")}
                error={errors.name}
              />
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="title"
            title="Title"
            description="Map Title to Shopify attributes (title, description, price, vendor, products type, tags) and can set custom values ahead of the Shopify title."
          >
            <Card sectioned>
              <FormLayout>
                <Select
                  options={AttributeMapoptions}
                  label="Mapping options for title field"
                  value={formData["title"]["selected"]}
                  onChange={(e) => changeHandler(e, "title", "selected")}
                />
                <Checkbox
                  label="Trim Title"
                  checked={formData["title"]["trim_title"]}
                  onChange={(e) => changeHandler(e, "title", "trim_title")}
                  helpText="*Enable the option if you want to trim the title if greater than 80 characters.This might make your title absurd so make sure accordingly."
                />
                {formData["title"]["selected"] === "default" && (
                  <Stack vertical={false}>
                    <Stack.Item>
                      <Select
                        label="Choose to add attribute"
                        options={defaultAttributeoptions}
                        value={default_settings["title"]}
                        onChange={(e) => defaultChangeHandler(e, "title")}
                        placeholder="Please Select..."
                      />
                    </Stack.Item>
                    <Stack.Item fill>
                      <TextField
                        label="Value"
                        value={formData["title"]["default_setting"]["value"]}
                        onChange={(e) => {
                          // changeHandler(e, "title", "default_setting", "value");
                          let temp = { ...formData };
                          temp["title"]["default_setting"]["value"] = e;
                          setFormData(temp);
                        }}
                      />
                    </Stack.Item>
                  </Stack>
                )}
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="setSubtitle"
            title="Set Subtitle"
            description="Facilitate you to add a sub-title for the products on eBay."
          >
            <Card sectioned>
              <FormLayout>
                <ButtonGroup segmented>
                  <Button
                    primary={formData.set_subtitle}
                    pressed={formData.set_subtitle}
                    onClick={(e) => changeHandler(true, "set_subtitle")}
                  >
                    Yes
                  </Button>
                  <Button
                    primary={!formData.set_subtitle}
                    pressed={!formData.set_subtitle}
                    onClick={(e) => changeHandler(false, "set_subtitle")}
                  >
                    No
                  </Button>
                </ButtonGroup>
                {formData["set_subtitle"] && (
                  <Select
                    label="Mapping options for subtitle field"
                    options={AttributeMapoptions}
                    value={formData["subtitle"]["selected"]}
                    onChange={(e) => changeHandler(e, "subtitle", "selected")}
                  />
                )}
                {formData["set_subtitle"] &&
                  formData["subtitle"]["selected"] === "default" && (
                    <Stack vertical={false}>
                      <Stack.Item>
                        <Select
                          label="Choose to add attribute"
                          options={defaultAttributeoptions}
                          value={default_settings["subtitle"]}
                          onChange={(e) => defaultChangeHandler(e, "subtitle")}
                          placeholder="Please Select..."
                        />
                      </Stack.Item>
                      <Stack.Item fill>
                        <TextField
                          label="Value"
                          value={
                            formData["subtitle"]["default_setting"]["value"]
                          }
                          onChange={(e) => {
                            let temp = { ...formData };
                            temp["title"]["default_setting"]["value"] = e;
                            setFormData(temp);
                          }}
                        />
                      </Stack.Item>
                    </Stack>
                  )}
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="Description"
            title="Description"
            description="Map Description for eBay with the Shopify attributes (title, description, price, vendor, products type, tags). Select Set Custom Values option to insert the customize description or the  HTML code for the description."
          >
            <Card sectioned>
              <FormLayout>
                <Select
                  label="Mapping options for description field"
                  options={AttributeMapoptions}
                  value={formData["description"]["selected"]}
                  onChange={(e) => changeHandler(e, "description", "selected")}
                />
                {formData["description"]["selected"] === "default" && (
                  <Stack vertical={false}>
                    <Stack.Item>
                      <Select
                        label="Choose to add attribute"
                        options={defaultAttributeoptions}
                        value={default_settings["description"]}
                        onChange={(e) => defaultChangeHandler(e, "description")}
                        placeholder="Please Select..."
                      />
                    </Stack.Item>
                    <Stack.Item fill>
                      <FormLayout>
                        <FormLayout.Group condensed>
                          <TextField
                            label="Value"
                            multiline={10}
                            showCharacterCount
                            value={
                              formData["description"]["default_setting"][
                                "value"
                              ]
                            }
                            onChange={(e) => {
                              let temp = { ...formData };
                              temp["description"]["default_setting"]["value"] =
                                e;
                              setFormData(temp);
                            }}
                          />
                          {ckeditor(
                            formData["description"]["default_setting"]["value"],
                            () => {},
                            true
                          )}
                        </FormLayout.Group>
                      </FormLayout>
                    </Stack.Item>
                  </Stack>
                )}
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Card.Section>
    </Card>
  );
};

export default withRouter(TitleTemplatePolaris);
