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
import { getTemplatebyId } from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import { notify } from "../../../../../../services/notify";

const customiseInventoryOptions = [
  {
    label: "Please Select...",
    value: "",
  },
  {
    label: "Set Fixed Inventory for eBay Products",
    value: "fixedInventory",
  },
  {
    label: "Reserve Inventory for Shopify Products",
    value: "reserveInventory",
  },
];

const FinalInventoryTemplate = (props) => {
  const [id, setId] = useState("");
  const [flag, setFlag] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    customiseInventoryType: customiseInventoryOptions[0].value,
    fixedInventory: "",
    useShopifyInventory: false,
    reservedInventory: "",
    thresholdInventory: "",
    delete_product_outofStock: false,
    QuantityRestrictPerBuyer: "",

    // customize_inventory: false,
    // custom_inventory: {
    //   trend: "increase",
    //   value: "",
    // },
  });
  const [errors, setErrors] = useState({
    name: false,
    customiseInventoryType: false,
    fixedInventory: false,
    reservedInventory: false,
    thresholdInventory: false,
    QuantityRestrictPerBuyer: false,
  });
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const changeHandler = (value, ...formFields) => {
    let temp = { ...formData };
    if (formFields[0] === "customiseInventoryType") {
      if (value === "fixedInventory") {
        temp["reservedInventory"] = "";
      } else if (value === "reserveInventory") {
        temp["fixedInventory"] = "";
        temp["useShopifyInventory"] = false;
      }
    }
    if (formFields.length === 1) temp[formFields[0]] = value;
    else if (formFields.length === 2)
      temp[formFields[0]][formFields[1]] = value;
    setFormData(temp);
  };

  const getTemplateData = async () => {
    setFlag(true);
    let templatedata = {};
    if (id) {
      let { success, data } = await getTemplatebyId(id);
      if (success) {
        templatedata = { ...data.data };
        setFormData({ ...formData, ...templatedata });
      }
    }
    setFlag(false);
  };

  useEffect(() => {
    if (id) getTemplateData();
  }, [id]);

  useEffect(() => {
    setId(props.id);
  }, []);

  const redirect = (url) => {
    props.history.push(url);
  };

  const formValidator = () => {
    let temp = { ...errors };
    let errorsCount = 0;
    Object.keys(formData).forEach((key) => {
      switch (key) {
        case "name":
          if (formData[key] === "") {
            temp[key] = "name cannot be empty";
            errorsCount++;
          } else temp[key] = false;
          break;
        // case "customiseInventoryType":
        //   if (formData[key] === "") {
        //     temp[key] = true;
        //     errorsCount++;
        //   } else temp[key] = false;
        case "fixedInventory":
          console.log(key, formData[key]);
          if (
            formData[key] !== "" &&
            formData[key] < 1
            // formData["customiseInventoryType"] === "fixedInventory" &&
            // (formData[key] !== "" || formData[key] < 1)
          ) {
            temp[key] = "value must be greater than 1";
            errorsCount++;
          } else temp[key] = false;
          break;

        case "reservedInventory":
          if (
            // formData["customiseInventoryType"] === "reserveInventory" &&
            formData[key] !== "" &&
            formData[key] < 1
          ) {
            temp[key] = "value must be greater than 1";
            errorsCount++;
          } else temp[key] = false;
          break;

        case "thresholdInventory":
          if (formData[key] !== "" && formData[key] < 1) {
            temp[key] = "value must be greater than 1";
            errorsCount++;
          } else if (
            formData[key] !== "" &&
            formData[key] >= 1 &&
            formData["fixedInventory"] !== "" &&
            formData["fixedInventory"] <= formData[key]
          ) {
            temp[key] = "value must be less than fixed inventory";
            errorsCount++;
          }
          //   else if (
          //     formData.customiseInventoryType === "fixedInventory" &&
          //     Number(formData.thresholdInventory) > Number(formData.fixedInventory)
          //   ) {
          //     console.log('118');
          //     temp[key] = true;
          //   console.log('temp', temp[key]);
          //     errorsCount++;
          //   }
          else {
            temp[key] = false;
          }
          break;
        case "QuantityRestrictPerBuyer":
          if (formData[key] !== "" && formData[key] < 1) {
            temp[key] = "value must be greater than 1";
            errorsCount++;
          } else temp[key] = false;
          break;
        // default:
        //   break;
      }
    });
    setErrors(temp);
    return errorsCount === 0;
  };
  const saveFormdata = async () => {
    // console.log(formValidator());
    if (formValidator()) {
      setSaveBtnLoader(true);
      let tempObj = {
        title: formData.name,
        type: "inventory",
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

  const getCustomiseInventoryTypeStructure = () => {
    const { customiseInventoryType } = formData;
    switch (customiseInventoryType) {
      case "fixedInventory":
        return (
          <Stack vertical spacing="tight">
            <TextField
              type="number"
              min={1}
              // label="Set Fixed Inventory for eBay Products"
              value={formData.fixedInventory}
              onChange={(e) => changeHandler(e, "fixedInventory")}
              error={errors.fixedInventory}
            />
            <Checkbox
              checked={formData.useShopifyInventory}
              onChange={(e) => changeHandler(e, "useShopifyInventory")}
              label="Use Shopify Inventory If Fixed Inventory Greater Than Shopify Inventory"
            />
          </Stack>
        );
      case "reserveInventory":
        return (
          <TextField
            type="number"
            min={1}
            // label="Reserve Inventory for Shopify Products"
            value={formData.reservedInventory}
            onChange={(e) => changeHandler(e, "reservedInventory")}
            error={errors.reservedInventory}
          />
        );
      default:
        break;
    }
  };

  return flag ? (
    <Card>
      <SkeletonPage fullWidth title="Inventory Template" primaryAction={false}>
        <Layout.AnnotatedSection
          id="templateName"
          title="Template name"
          description="Enter a unique name"
        >
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection id="customise" title="Customise Inventory">
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          id="thresholdInventory"
          title="Threshold Inventory"
          description={
            <>
              Set a minimum inventory that you want to keep for your Shopify
              products, as soon as shopify product inventory reaches the
              threshold value, product will be shown as{" "}
              <b>{`“out of stock”`}</b> on eBay. Customise Inventory will not
              applied on threshold inventory.
            </>
          }
        >
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          id="Quantity_restriction_per_buyer"
          title="Quantity restriction per buyer"
          description="Set a fix quantity of a product you want to offer to each buyer."
        >
          <Layout.Section>
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          id="deleteOutOfStock"
          title="Delete out of stock product"
          description={
            <>
              {/* Enabling the option will <b>{"END"}</b> the products from eBay
              once out of stock in Shopify. */}
            </>
          }
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
      title="Inventory Template"
      sectioned
      primaryFooterAction={{
        content: "Save",
        onAction: saveFormdata,
        loading: saveBtnLoader,
      }}
    >
      <Banner status="info">
        <p>
          With the use of Inventory template you can assign properties like how
          much should be the inventory, what is its limit (threshold),
          restriction per buyer and whether to delete products when they are out
          of stock. So by simply using the template all of these conditions can
          be applied while listing on eBay.
        </p>
      </Banner>
      <Card.Section>
        <Layout>
          <Layout.AnnotatedSection
            id="templateName"
            title="Template name"
            description="Set unique name to identify in profile section."
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
            id="customise"
            title="Customise Inventory"
            description="Customise product inventory while create listing on eBay. you can set fixed inventory or reserve shopify inventory before sending inventory details on eBay. i.e. Fixed inventory value will ignore the shopify inventory and Reserve inventory value will reduse shopify inventory before sending to eBay."
          >
            <Card sectioned>
              <FormLayout>
                <Select
                  options={customiseInventoryOptions}
                  value={formData.customiseInventoryType}
                  onChange={(e) => {
                    changeHandler(e, "customiseInventoryType");
                  }}
                  error={errors.customiseInventoryType}
                />
                {getCustomiseInventoryTypeStructure()}
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="threshold"
            title="Threshold Inventory"
            description={
              <>
                Set a minimum inventory that you want to keep for your Shopify
                products, as soon as shopify product inventory reaches the
                threshold value, product will be shown as{" "}
                <b>{`“out of stock”`}</b> on eBay. Customise Inventory will not
                applied on threshold inventory.
              </>
            }
          >
            <Card sectioned>
              <TextField
                type="number"
                min={1}
                value={formData.thresholdInventory}
                onChange={(e) => changeHandler(e, "thresholdInventory")}
                error={
                  // (formData.customiseInventoryType === "fixedInventory" &&
                  //   formData.thresholdInventory > formData.fixedInventory &&
                  //   "should be less than fixed inventory") ||
                  errors.thresholdInventory
                }
              />
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="Quantity_restriction_per_buyer"
            title="Quantity restriction per buyer"
            description="Set a fix quantity of a product you want to offer to each buyer."
          >
            <Card sectioned>
              <TextField
                type="number"
                min={1}
                value={formData.QuantityRestrictPerBuyer}
                onChange={(e) => changeHandler(e, "QuantityRestrictPerBuyer")}
                error={errors.QuantityRestrictPerBuyer}
              />
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="deleteOutOfStockProducts"
            title="Delete Out of Stock Products"
            description={
              "Enable to END a product listing on eBay once it goes out of stock on Shopify."
            }
          >
            <Card sectioned>
              <ButtonGroup segmented>
                <Button
                  pressed={formData.delete_product_outofStock}
                  primary={formData.delete_product_outofStock}
                  onClick={(e) =>
                    changeHandler(true, "delete_product_outofStock")
                  }
                >
                  Yes
                </Button>
                <Button
                  pressed={!formData.delete_product_outofStock}
                  primary={!formData.delete_product_outofStock}
                  onClick={(e) =>
                    changeHandler(false, "delete_product_outofStock")
                  }
                >
                  No
                </Button>
              </ButtonGroup>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Card.Section>
    </Card>
  );
};

export default withRouter(FinalInventoryTemplate);
