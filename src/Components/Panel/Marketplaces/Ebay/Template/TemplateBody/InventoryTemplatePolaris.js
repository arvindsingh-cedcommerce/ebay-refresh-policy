import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  Layout,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { getTemplatebyId } from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import { notify } from "../../../../../../services/notify";

const InventoryTemplatePolaris = (props) => {
  const [flag, setFlag] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fixed_inventory: "",
    threshold_inventory: "",
    delete_product_outofStock: false,
    QuantityRestrictPerBuyer: "",
    customize_inventory: false,
    custom_inventory: {
      trend: "increase",
      value: "",
    },
  });
  const [errors, setErrors] = useState({
    name: false,
    threshold_inventory: false,
    fixed_inventory: false,
    QuantityRestrictPerBuyer: false,
    custom_inventory: false,
  });
  const [id, setId] = useState("");

  const changeHandler = (value, ...formFields) => {
    let temp = { ...formData };
    if (formFields.length === 1) temp[formFields[0]] = value;
    else if (formFields.length === 2)
      temp[formFields[0]][formFields[1]] = value;
    setFormData(temp);
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
        case "fixed_inventory":
          if (
            // formData[key] === "" || 
            formData[key] < 0) {
            temp[key] = true;
            errorsCount++;
          } else temp[key] = false;
          break;
        case "threshold_inventory":
          if (
            // formData[key] === "" || 
            formData[key] < 0) {
            temp[key] = true;
            errorsCount++;
          } else temp[key] = false;
          break;
        case "QuantityRestrictPerBuyer":
          if (
            // formData[key] === "" || 
            formData[key] < 0) {
            temp[key] = true;
            errorsCount++;
          } else temp[key] = false;
          break;
        case "custom_inventory":
          if (
            (formData["customize_inventory"] &&
              formData[key]["value"] === "") ||
            formData[key]["value"] < 0
          ) {
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

  useEffect(() => {
    setId(props.id);
  }, []);

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

  const redirect = (url) => {
    props.history.push(url);
  };

  const saveFormdata = async () => {
    if (formValidator()) {
      let tempObj = {
        title: formData.name,
        type: "inventory",
        data: formData,
      };
      if (id !== "") tempObj["_id"] = id;
      let returnedResponse = await props.recieveFormdata(tempObj);
      if (returnedResponse) {
        redirect("/panel/ebay/templatesUS");
      }
    } else {
      notify.error("Kindly fill all the required fields with proper values");
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
        <Layout.AnnotatedSection
          id="fixedInventory"
          title="Fixed Inventory"
          description="Set fixed quantity to restrict actual Shopify product quantity on eBay, Use if quantity is not managed from Shopify."
        >
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
              Set a minimum quantity that you want to keep reserved for your
              Shopify store, as soon as product inventory reaches the set
              minimum value, it will be shown as{" "}
              <b>{`“out of stock” on eBay`}</b>.
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
          id="customizeInventory"
          title="Customize Inventory"
          description="Enabling the option helps to customize the inventory by increasing or decreasing value on eBay. Example: Shopify Product stock is 10 > choose trend (increase) > Value (5) on eBay stock will be reflected as 15."
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
              Enabling the option will <b>{"END"}</b> the products from eBay
              once out of stock in Shopify.
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
      </SkeletonPage>
    </Card>
  ) : (
    <Card
      title="Inventory Template"
      sectioned
      primaryFooterAction={{ content: "Save", onAction: saveFormdata }}
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
            description="Enter a unique name"
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
            id="fixedInventory"
            title="Fixed Inventory"
            description="Set fixed quantity to restrict actual Shopify product quantity on eBay, Use if quantity is not managed from Shopify."
          >
            <Card sectioned>
              <TextField
                value={formData.fixed_inventory}
                onChange={(e) => changeHandler(e, "fixed_inventory")}
                type="number"
                min={"0"}
                error={errors.fixed_inventory}
              />
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="thresholdInventory"
            title="Threshold Inventory"
            description={
              <>
                Set a minimum quantity that you want to keep reserved for your
                Shopify store, as soon as product inventory reaches the set
                minimum value, it will be shown as{" "}
                <b>{`“out of stock” on eBay`}</b>.
              </>
            }
          >
            <Card sectioned>
              <TextField
                value={formData.threshold_inventory}
                onChange={(e) => changeHandler(e, "threshold_inventory")}
                type="number"
                min={"0"}
                error={errors.threshold_inventory}
              />
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="customizeInventory"
            title="Customize Inventory"
            description="Enabling the option helps to customize the inventory by increasing or decreasing value on eBay. Example: Shopify Product stock is 10 > choose trend (increase) > Value (5) on eBay stock will be reflected as 15."
          >
            <Card sectioned>
              <FormLayout>
                <ButtonGroup segmented>
                  <Button
                    primary={formData.customize_inventory}
                    pressed={formData.customize_inventory}
                    onClick={(e) => changeHandler(true, "customize_inventory")}
                  >
                    Yes
                  </Button>
                  <Button
                    primary={!formData.customize_inventory}
                    pressed={!formData.customize_inventory}
                    onClick={(e) => changeHandler(false, "customize_inventory")}
                  >
                    No
                  </Button>
                </ButtonGroup>
                {formData.customize_inventory && (
                  <>
                    <Select
                      options={[
                        { label: "Increase", value: "increase" },
                        { label: "Decrease", value: "decrease" },
                      ]}
                      label="Choose Trend"
                      value={formData.custom_inventory.trend}
                      onChange={(e) =>
                        changeHandler(e, "custom_inventory", "trend")
                      }
                    />
                    <TextField
                      label="Value"
                      value={formData.custom_inventory.value}
                      onChange={(e) =>
                        changeHandler(e, "custom_inventory", "value")
                      }
                      type="number"
                      min={"0"}
                      error={errors.custom_inventory}
                    />
                  </>
                )}
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="deleteOutOfStock"
            title="Delete out of stock product"
            description={
              <>
                Enabling the option will <b>{"END"}</b> the products from eBay
                once out of stock in Shopify.
              </>
            }
          >
            <Card sectioned>
              <ButtonGroup segmented>
                <Button
                  primary={formData.delete_product_outofStock}
                  pressed={formData.delete_product_outofStock}
                  onClick={(e) =>
                    changeHandler(true, "delete_product_outofStock")
                  }
                >
                  Yes
                </Button>
                <Button
                  primary={!formData.delete_product_outofStock}
                  pressed={!formData.delete_product_outofStock}
                  onClick={(e) =>
                    changeHandler(false, "delete_product_outofStock")
                  }
                >
                  No
                </Button>
              </ButtonGroup>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="Quantity_restriction_per_buyer"
            title="Quantity restriction per buyer"
            description="Set a fix quantity of a product you want to offer to each buyer."
          >
            <Card sectioned>
              <TextField
                value={formData.QuantityRestrictPerBuyer}
                onChange={(e) => changeHandler(e, "QuantityRestrictPerBuyer")}
                type="number"
                min={"0"}
                error={errors.QuantityRestrictPerBuyer}
              />
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Card.Section>
    </Card>
  );
};

export default withRouter(InventoryTemplatePolaris);
