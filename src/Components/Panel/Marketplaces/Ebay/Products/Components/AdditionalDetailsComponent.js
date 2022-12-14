import {
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  Layout,
  Select,
  TextField,
} from "@shopify/polaris";
import React from "react";

const packageTypeArray = [
  { label: "Please Select...", value: "" },
  { label: "LETTER", value: "C_LETTER" },
  { label: "BULKY_GOODS", value: "C_BULKY_GOODS" },
  { label: "CARAVAN", value: "C_CARAVAN" },
  { label: "CARS", value: "C_CARS" },
  { label: "EUROPALLET", value: "C_EUROPALLET" },
  { label: "EXPANDABLE_TOUGH_BAGS", value: "C_EXPANDABLE_TOUGH_BAGS" },
  { label: "EXTRA_LARGE_PACK", value: "C_EXTRA_LARGE_PACK" },
  { label: "FURNITURE", value: "C_FURNITURE" },
  { label: "INDUSTRY_VEHICLES", value: "C_INDUSTRY_VEHICLES" },
  { label: "LARGE_CANADA_POSTBOX", value: "C_LARGE_CANADA_POSTBOX" },
  {
    label: "LARGE_CANADA_POST_BUBBLE_MAILER",
    value: "C_LARGE_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "LARGE_ENVELOPE", value: "C_LARGE_ENVELOPE" },
  { label: "MAILING_BOX", value: "C_MAILING_BOX" },
  { label: "MEDIUM_CANADA_POST_BOX", value: "C_MEDIUM_CANADA_POST_BOX" },
  {
    label: "MEDIUM_CANADA_POST_BUBBLE_MAILER",
    value: "C_MEDIUM_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "MOTORBIKES", value: "C_MOTORBIKES" },
  { label: "ONE_WAY_PALLET", value: "C_ONE_WAY_PALLET" },
  { label: "PACKAGE_THICK_ENVELOPE", value: "C_PACKAGE_THICK_ENVELOPE" },
  { label: "PADDED_BAGS", value: "C_PADDED_BAGS" },
  {
    label: "PARCEL_OR_PADDED_ENVELOPE",
    value: "C_PARCEL_OR_PADDED_ENVELOPE",
  },
  { label: "ROLL", value: "C_ROLL" },
  { label: "SMALL_CANADA_POST_BOX", value: "C_SMALL_CANADA_POST_BOX" },
  {
    label: "SMALL_CANADA_POST_BUBBLE_MAILER",
    value: "C_SMALL_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "TOUGH_BAGS", value: "TOUGH_BAGS" },
  { label: "UPS_LETTER", value: "C_UPS_LETTER" },
  {
    label: "USPS_FLAT_RATE_ENVELOPE",
    value: "C_USPS_FLAT_RATE_ENVELOPE",
  },
  { label: "USPS_LARGE_PACK", value: "C_USPS_LARGE_PACK" },
  { label: "VERY_LARGE_PACK", value: "C_VERY_LARGE_PACK" },
  { label: "WINE_PAK", value: "C_WINEPAK" },
];

const AdditionalDetailsComponent = ({
  mainProduct,
  setMainProduct,
  apiCallMainProduct,
  editedProductDataFromAPI,
}) => {
  const onChangeHandler = (e, type, field) => {
    let temp = { ...mainProduct };
    if (field) {
      temp[type][field] = e;
    } else {
      if (type === "privateListing") {
        temp[type] = e === "yes" ? true : false;
      } else temp[type] = e;
    }
    setMainProduct(temp);
  };

  const getPrivateListingValue = (value) => {
    let resultValue;
    if (value === true || value === "yes") {
      resultValue = true;
    } else {
      resultValue = false;
    }
    return resultValue;
  };

  return (
    <FormLayout>
      <Layout>
        <Layout.AnnotatedSection
          id="productDimensions"
          title="Product Dimensions"
          description={
            "Assign product dimensions to the product before shipping it. Use the option if you are using Calculated shipping services for shipments"
          }
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group condensed>
                <TextField
                  label="Length"
                  onChange={(e) => onChangeHandler(e, "length")}
                  autoComplete="off"
                  value={mainProduct["length"]}
                  type="number"
                  min={"0"}
                />
                <TextField
                  label="Width"
                  onChange={(e) => onChangeHandler(e, "width")}
                  autoComplete="off"
                  value={mainProduct["width"]}
                  type="number"
                  min={"0"}
                />
                <TextField
                  label="Height"
                  onChange={(e) => onChangeHandler(e, "height")}
                  autoComplete="off"
                  value={mainProduct["height"]}
                  type="number"
                  min={"0"}
                />
                <Select
                  options={[
                    { label: "cm", value: "cm" },
                    { label: "in", value: "in" },
                  ]}
                  placeholder="Please select..."
                  label="Unit"
                  value={mainProduct["unit"]}
                  onChange={(e) => onChangeHandler(e, "unit")}
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection
          id="packageType"
          title="Package Type"
          description={
            "The nature of the package used to ship the item(s). Required for calculated shipping only."
          }
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <Select
                  value={mainProduct["packageType"]}
                  options={packageTypeArray}
                  onChange={(e) => onChangeHandler(e, "packageType")}
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection
          id="privateListing"
          title="Private Listing"
          description={
            "This field indicates that the listing is private on eBay."
          }
        >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <ButtonGroup segmented>
                  <Button
                    primary={
                      getPrivateListingValue(mainProduct["privateListing"])
                      // mainProduct["privateListing"] === "yes" ? true : false
                      // mainProduct["privateListing"]
                    }
                    pressed={
                      getPrivateListingValue(mainProduct["privateListing"])
                      // mainProduct["privateListing"] === "yes" ? true : false
                      // mainProduct["privateListing"]
                    }
                    onClick={(e) => onChangeHandler("yes", "privateListing")}
                  >
                    Yes
                  </Button>
                  <Button
                    primary={
                      !getPrivateListingValue(mainProduct["privateListing"])
                      // mainProduct["privateListing"] === "no" ? true : false
                      // mainProduct["privateListing"]
                    }
                    pressed={
                      !getPrivateListingValue(mainProduct["privateListing"])
                      // mainProduct["privateListing"] === "no" ? true : false
                      // mainProduct["privateListing"]
                    }
                    onClick={(e) => onChangeHandler("no", "privateListing")}
                  >
                    No
                  </Button>
                </ButtonGroup>
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout>
        <Layout.AnnotatedSection
          id="subtitle"
          title="Subtitle"
          description={
            "Subtitle appears in eBay search results in list view, and can increase buyer interest by providing more descriptive info."
          }
        >
          <Card sectioned>
            <FormLayout>
              <TextField
                onChange={(e) => onChangeHandler(e, "subtitle")}
                autoComplete="off"
                value={mainProduct["subtitle"]}
                type="text"
                showCharacterCount
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </FormLayout>
  );
};

export default AdditionalDetailsComponent;
