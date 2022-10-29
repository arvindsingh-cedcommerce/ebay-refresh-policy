import {
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  FormLayout,
  Layout,
  Link,
  Select,
  SkeletonBodyText,
  SkeletonPage,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { getTemplatebyId } from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import { notify } from "../../../../../../services/notify";

const sellingFormatOptions = [
  { label: "Fixed Price", value: "fixed_price" },
  { label: "Auction-style", value: "auction_style" },
];

let sellingListingDurations = [
  {
    label: "Days_1",
    value: "Days_1",
    disabled: false,
  },
  {
    label: "Days_3",
    value: "Days_3",
    disabled: false,
  },
  {
    label: "Days_5",
    value: "Days_5",
    disabled: false,
  },
  {
    label: "Days_7",
    value: "Days_7",
    disabled: false,
  },
  {
    label: "Days_10",
    value: "Days_10",
    disabled: false,
  },
  {
    label: "Days_21",
    value: "Days_21",
    disabled: false,
  },
  {
    label: "Days_30",
    value: "Days_30",
    disabled: false,
  },
  {
    label: "Days_60",
    value: "Days_60",
    disabled: false,
  },
  {
    label: "Days_90",
    value: "Days_90",
    disabled: false,
  },
  {
    label: "Days_120",
    value: "Days_120",
    disabled: false,
  },
];
const sellingListingDurationFixed = [{ label: "GTC", value: "GTC" }];

const SettingsFixed = [
  { label: "Custom price", value: "customized_price" },
  { label: "Flat price", value: "flat_price" },
  { label: "Default", value: "default" },
];
const SettingsAuction = [
  { label: "Custom price", value: "customized_price" },
  /*{label:'Flat price',value:'flat_price'},*/
  { label: "Default", value: "default" },
];
const variateType = [
  { label: "Increase", value: "increase" },
  { label: "Decrease", value: "decrease" },
];
const variateBy = [
  { label: "Percentage", value: "percentage" },
  { label: "Value", value: "value" },
];

const PricingTemplatePolaris = (props) => {
  const [formData, setFormData] = useState({
    selling_details: {
      format: "fixed_price",
      listing_duration: "GTC",
    },
    name: "",
    roundOff: {
      all: false,
    },
    fixed_listing: {
      selected: "default",
      customized_price: {
        variate_type: "increase",
        variate_by: "value",
        variate_value: 0,
      },
      flat_price: {
        fixed_value: 0,
      },
    },
    auctions_listing: {
      start_price: {
        checked: false,
        selected: "default",
        customized_price: {
          variate_type: "increase",
          variate_by: "value",
          variate_value: 0,
        },
        flat_price: {
          fixed_value: 0,
        },
      },
      buyitnow_price: {
        checked: false,
        selected: "customized_price",
        customized_price: {
          variate_type: "increase",
          variate_by: "percentage",
          variate_value: 30,
        },
        flat_price: {
          fixed_value: 0,
        },
      },
      reserved_price: {
        selected: "customized_price",
        customized_price: {
          variate_type: "increase",
          variate_by: "value",
          variate_value: 0,
        },
        flat_price: {
          fixed_value: 0,
        },
      },
    },
  });
  const [errors, setErrors] = useState({
    name: false,
  });
  const [id, setId] = useState("");
  const [flag, setFlag] = useState(false);
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

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

  const saveFormdata = async () => {
    if (formValidator()) {
      setSaveBtnLoader(true);
      let tempObj = {
        title: formData.name,
        type: "price",
        data: formData,
      };
      if (id !== "") tempObj["_id"] = id;
      let returnedResponse = await props.recieveFormdata(tempObj);
      if (returnedResponse) {
        redirect("/panel/ebay/templates");
      }
      setSaveBtnLoader(false);
    } else {
      notify.error("Kindly fill all the required fields");
    }
  };

  const redirect = (url) => {
    props.history.push(url);
  };

  const changeHandler = (value, ...formFields) => {
    let temp = { ...formData };
    if (formFields.length === 1) temp[formFields[0]] = value;
    else if (formFields.length === 2)
      temp[formFields[0]][formFields[1]] = value;
    else if (formFields.length === 3)
      temp[formFields[0]][formFields[1]][formFields[2]] = value;
    else if (formFields.length === 4)
      temp[formFields[0]][formFields[1]][formFields[2]][formFields[3]] = value;
    setFormData(temp);
  };

  const getListingDuration = (type) => {
    let getListingDurationOptions = [...sellingListingDurationFixed];
    let disabled = true;
    if (type === "auction_style") {
      getListingDurationOptions = [...sellingListingDurations];
      disabled = false;
    }
    return (
      <Select
        options={getListingDurationOptions}
        label="Listing Duration"
        value={formData.selling_details.listing_duration}
        disabled={disabled}
        onChange={(e) =>
          changeHandler(e, "selling_details", "listing_duration")
        }
        helpText="*Duration for which your listing will run. If your item doesn't sell, you can choose to relist it."
      />
    );
  };

  useEffect(() => {
    setId(props.id);
  }, []);

  const getTemplateData = async () => {
    setFlag(true);
    let templatedata = {};
    if (id) {
      let { success, data, message } = await getTemplatebyId(id);
      if (success) {
        templatedata = { ...data.data };
        setFormData({ ...formData, ...templatedata });
      } else {
        notify.error(message);
      }
    }
    setFlag(false);
  };

  useEffect(() => {
    if (id) getTemplateData();
  }, [id]);

  return !flag ? (
    <Card
      title="Pricing Template"
      sectioned
      actions={[
        {
          content: <Button primary>Save</Button>,
          onAction: saveFormdata,
          loading: saveBtnLoader,
        }
      ]}
      // primaryFooterAction={{
      //   content: "Save",
      //   onAction: saveFormdata,
      //   // loading: props.loader,
      //   loading: saveBtnLoader,
      // }}
    >
      <Banner status="info">
        <p>
          Pricing template helps you to assign custom pricing while creating or
          updating a listing on eBay.
        </p>
      </Banner>
      <Banner status="info">
        <p>
          To sell an item at a fixed price, your feedback score must be 0 or
          higher, and the item you're listing must be priced at $0.99 or higher.
        </p>
      </Banner>
      <Card.Section>
        <Layout>
          <Layout.AnnotatedSection
            id="templateName"
            title="Template name"
            // description="Enter a uniqe name"
            description="Define name as per your understanding. It will use to identify template in other sections of the app like product's profile."
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
            id="rounfOffPrice"
            title="Round off price"
            description="Round off all the prices to its nearest whole number value, i.e., $4.6 becomes $5."
          >
            <Card sectioned>
              <ButtonGroup segmented>
                <Button
                  primary={formData.roundOff.all}
                  pressed={formData.roundOff.all}
                  onClick={(e) => changeHandler(true, "roundOff", "all")}
                >
                  Yes
                </Button>
                <Button
                  primary={!formData.roundOff.all}
                  pressed={!formData.roundOff.all}
                  onClick={(e) => changeHandler(false, "roundOff", "all")}
                >
                  No
                </Button>
              </ButtonGroup>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            id="Configuration"
            title="Listing Type & Duration"
            description="Fixed price listings are set to Good 'Til Cancelled (GTC) duration by default. This means your item will be listed on eBay until it sells or you end it."
          >
            <Card sectioned>
              <FormLayout>
                <Select
                  options={sellingFormatOptions}
                  label={
                    <>
                      <>Listing type</>
                      <Link
                        url="https://www.ebay.in/pages/help/sell/formats.html"
                        removeUnderline
                        monochrome
                        external
                      >
                        <Badge status="warning">Learn More</Badge>
                      </Link>
                    </>
                  }
                  value={formData.selling_details.format}
                  onChange={(e) =>
                    changeHandler(e, "selling_details", "format")
                  }
                  // helpText="*Select how you want to sell the items you're listing"
                  helpText="*Select listing format Fixed Price or Auction, as how you want to list the items on eBay."
                  // error={errors.name}
                />
                {getListingDuration(formData.selling_details.format)}
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          {formData.selling_details.format === "fixed_price" ? (
            <Layout.AnnotatedSection
              id="FixedFormat"
              title="Fixed Listing Price"
              description="A buyer knows the exact price they need to pay for your item, and can complete their purchase immediately. There is no bidding on fixed price listings."
            >
              <Card sectioned title="Final Price">
                <FormLayout>
                  <Select
                    options={SettingsFixed}
                    // label="Settings"
                    value={formData.fixed_listing.selected}
                    onChange={(e) =>
                      changeHandler(e, "fixed_listing", "selected")
                    }
                  />
                  {formData.fixed_listing.selected === "customized_price" ? (
                    <FormLayout.Group>
                      <Select
                        options={variateType}
                        value={
                          formData.fixed_listing.customized_price.variate_type
                        }
                        onChange={(e) =>
                          changeHandler(
                            e,
                            "fixed_listing",
                            "customized_price",
                            "variate_type"
                          )
                        }
                      />
                      <Select
                        options={variateBy}
                        value={
                          formData.fixed_listing.customized_price.variate_by
                        }
                        onChange={(e) =>
                          changeHandler(
                            e,
                            "fixed_listing",
                            "customized_price",
                            "variate_by"
                          )
                        }
                      />
                      <TextField
                        value={
                          formData.fixed_listing.customized_price.variate_value
                        }
                        onChange={(e) =>
                          changeHandler(
                            e,
                            "fixed_listing",
                            "customized_price",
                            "variate_value"
                          )
                        }
                        type="number"
                      />
                    </FormLayout.Group>
                  ) : (
                    formData.fixed_listing.selected === "flat_price" && (
                      <TextField
                        value={formData.fixed_listing.flat_price.fixed_value}
                        placeholder="Enter Flat Price..."
                        type="number"
                        onChange={(e) =>
                          changeHandler(
                            e,
                            "fixed_listing",
                            "flat_price",
                            "fixed_value"
                          )
                        }
                      />
                    )
                  )}
                </FormLayout>
              </Card>
            </Layout.AnnotatedSection>
          ) : (
            <Layout.AnnotatedSection
              title="Auction Listing Price"
              description="List the product  in Auction format that need to be sold quickly, Auction format may  helps to fast up the selling process."
            >
              <Card>
                <Card.Section>
                  <FormLayout>
                    <Select
                      options={SettingsAuction}
                      label="Start price"
                      value={formData.auctions_listing.start_price.selected}
                      helpText={
                        "*When list an item for sale  on eBay auction, you can choose a starting price, and interested buyers place bids. When the auction ends, you sell to the highest bidder."
                      }
                      onChange={(e) =>
                        changeHandler(
                          e,
                          "auctions_listing",
                          "start_price",
                          "selected"
                        )
                      }
                    />
                    {formData.auctions_listing.start_price.selected ===
                      "customized_price" && (
                      <FormLayout.Group>
                        <Select
                          options={variateType}
                          value={
                            formData.auctions_listing.start_price
                              .customized_price.variate_type
                          }
                          onChange={(e) =>
                            changeHandler(
                              e,
                              "auctions_listing",
                              "start_price",
                              "customized_price",
                              "variate_type"
                            )
                          }
                        />
                        <Select
                          options={variateBy}
                          value={
                            formData.auctions_listing.start_price
                              .customized_price.variate_by
                          }
                          onChange={(e) =>
                            changeHandler(
                              e,
                              "auctions_listing",
                              "start_price",
                              "customized_price",
                              "variate_by"
                            )
                          }
                        />
                        <TextField
                          value={
                            formData.auctions_listing.start_price
                              .customized_price.variate_value
                          }
                          onChange={(e) =>
                            changeHandler(
                              e,
                              "auctions_listing",
                              "start_price",
                              "customized_price",
                              "variate_value"
                            )
                          }
                          type="number"
                        />
                      </FormLayout.Group>
                    )}
                  </FormLayout>
                </Card.Section>
                <Card.Section>
                  <FormLayout>
                    <Checkbox
                      label="Buy it now price"
                      checked={formData.auctions_listing.buyitnow_price.checked}
                      onChange={(e) =>
                        changeHandler(
                          e,
                          "auctions_listing",
                          "buyitnow_price",
                          "checked"
                        )
                      }
                    />
                    <Banner status="info">
                      Buyers can either purchase your item right away at the Buy
                      It Now price, or place a bid. In most categories, The Buy
                      It Now price has to be at least 30% higher than the
                      Start/Current price.
                    </Banner>
                    {formData.auctions_listing.buyitnow_price.checked && (
                      <React.Fragment>
                        <Select
                          options={SettingsFixed}
                          value={
                            formData.auctions_listing.buyitnow_price.selected
                          }
                          onChange={(e) =>
                            changeHandler(
                              e,
                              "auctions_listing",
                              "buyitnow_price",
                              "selected"
                            )
                          }
                        />
                        {formData.auctions_listing.buyitnow_price.selected ===
                        "customized_price" ? (
                          <FormLayout.Group>
                            <Select
                              options={variateType}
                              value={
                                formData.auctions_listing.buyitnow_price
                                  .customized_price.variate_type
                              }
                              onChange={(e) =>
                                changeHandler(
                                  e,
                                  "auctions_listing",
                                  "buyitnow_price",
                                  "customized_price",
                                  "variate_type"
                                )
                              }
                            />
                            <Select
                              options={variateBy}
                              value={
                                formData.auctions_listing.buyitnow_price
                                  .customized_price.variate_by
                              }
                              onChange={(e) =>
                                changeHandler(
                                  e,
                                  "auctions_listing",
                                  "buyitnow_price",
                                  "customized_price",
                                  "variate_by"
                                )
                              }
                            />
                            <TextField
                              value={
                                formData.auctions_listing.buyitnow_price
                                  .customized_price.variate_value
                              }
                              onChange={(e) =>
                                changeHandler(
                                  e,
                                  "auctions_listing",
                                  "buyitnow_price",
                                  "customized_price",
                                  "variate_value"
                                )
                              }
                              type="number"
                            />
                          </FormLayout.Group>
                        ) : (
                          formData.auctions_listing.buyitnow_price.selected ===
                            "flat_price" && (
                            <FormLayout.Group>
                              <TextField
                                value={
                                  formData.auctions_listing.buyitnow_price
                                    .flat_price.fixed_value
                                }
                                onChange={(e) =>
                                  changeHandler(
                                    e,
                                    "auctions_listing",
                                    "buyitnow_price",
                                    "flat_price",
                                    "fixed_value"
                                  )
                                }
                                type="number"
                              />
                            </FormLayout.Group>
                          )
                        )}
                      </React.Fragment>
                    )}
                  </FormLayout>
                </Card.Section>
                <Card.Section>
                  <FormLayout>
                    <Checkbox
                      label="Use reserved price"
                      checked={formData.auctions_listing.reserved_price.checked}
                      onChange={(e) =>
                        changeHandler(
                          e,
                          "auctions_listing",
                          "reserved_price",
                          "checked"
                        )
                      }
                    />
                    <Banner status="info">
                      Fee May Apply You can set a hidden minimum selling price
                      for your item - the lowest price you're willing to accept
                      for your item. If the listing ends without any bids that
                      reach this price, you don't have to sell the item.
                    </Banner>
                    {formData.auctions_listing.reserved_price.checked && (
                      <React.Fragment>
                        <Select
                          options={SettingsFixed}
                          value={
                            formData.auctions_listing.reserved_price.selected
                          }
                          onChange={(e) =>
                            changeHandler(
                              e,
                              "auctions_listing",
                              "reserved_price",
                              "selected"
                            )
                          }
                        />
                        {formData.auctions_listing.reserved_price.selected ===
                        "customized_price" ? (
                          <FormLayout.Group>
                            <Select
                              options={variateType}
                              value={
                                formData.auctions_listing.reserved_price
                                  .customized_price.variate_type
                              }
                              onChange={(e) =>
                                changeHandler(
                                  e,
                                  "auctions_listing",
                                  "reserved_price",
                                  "customized_price",
                                  "variate_type"
                                )
                              }
                            />
                            <Select
                              options={variateBy}
                              value={
                                formData.auctions_listing.reserved_price
                                  .customized_price.variate_by
                              }
                              onChange={(e) =>
                                changeHandler(
                                  e,
                                  "auctions_listing",
                                  "reserved_price",
                                  "customized_price",
                                  "variate_by"
                                )
                              }
                            />
                            <TextField
                              value={
                                formData.auctions_listing.reserved_price
                                  .customized_price.variate_value
                              }
                              onChange={(e) =>
                                changeHandler(
                                  e,
                                  "auctions_listing",
                                  "reserved_price",
                                  "customized_price",
                                  "variate_value"
                                )
                              }
                              type="number"
                            />
                          </FormLayout.Group>
                        ) : (
                          formData.auctions_listing.reserved_price.selected ===
                            "flat_price" && (
                            <FormLayout.Group>
                              <TextField
                                value={
                                  formData.auctions_listing.reserved_price
                                    .flat_price.fixed_value
                                }
                                onChange={(e) =>
                                  changeHandler(
                                    e,
                                    "auctions_listing",
                                    "reserved_price",
                                    "flat_price",
                                    "fixed_value"
                                  )
                                }
                                type="number"
                              />
                            </FormLayout.Group>
                          )
                        )}
                      </React.Fragment>
                    )}
                  </FormLayout>
                </Card.Section>
              </Card>
            </Layout.AnnotatedSection>
          )}
        </Layout>
      </Card.Section>
    </Card>
  ) : (
    <Card sectioned>
      <SkeletonPage fullWidth title="Pricing Template" primaryAction={false}>
        <Layout.AnnotatedSection
          id="templateName"
          title="Template name"
          // description="Enter a unique name"
          description="Define name as per your understanding. It will use to identify template in other sections of the app like product's profile."
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
  );
};

export default withRouter(PricingTemplatePolaris);
