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
  { label: "LETTER", value: "LETTER" },
  { label: "BULKY_GOODS", value: "BULKY_GOODS" },
  { label: "CARAVAN", value: "CARAVAN" },
  { label: "CARS", value: "CARS" },
  { label: "EUROPALLET", value: "EUROPALLET" },
  { label: "EXPANDABLE_TOUGH_BAGS", value: "EXPANDABLE_TOUGH_BAGS" },
  { label: "EXTRA_LARGE_PACK", value: "EXTRA_LARGE_PACK" },
  { label: "FURNITURE", value: "FURNITURE" },
  { label: "INDUSTRY_VEHICLES", value: "INDUSTRY_VEHICLES" },
  { label: "LARGE_CANADA_POSTBOX", value: "LARGE_CANADA_POSTBOX" },
  {
    label: "LARGE_CANADA_POST_BUBBLE_MAILER",
    value: "LARGE_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "LARGE_ENVELOPE", value: "LARGE_ENVELOPE" },
  { label: "MAILING_BOX", value: "MAILING_BOX" },
  { label: "MEDIUM_CANADA_POST_BOX", value: "MEDIUM_CANADA_POST_BOX" },
  {
    label: "MEDIUM_CANADA_POST_BUBBLE_MAILER",
    value: "MEDIUM_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "MOTORBIKES", value: "MOTORBIKES" },
  { label: "ONE_WAY_PALLET", value: "ONE_WAY_PALLET" },
  { label: "PACKAGE_THICK_ENVELOPE", value: "PACKAGE_THICK_ENVELOPE" },
  { label: "PADDED_BAGS", value: "PADDED_BAGS" },
  {
    label: "PARCEL_OR_PADDED_ENVELOPE",
    value: "PARCEL_OR_PADDED_ENVELOPE",
  },
  { label: "ROLL", value: "ROLL" },
  { label: "SMALL_CANADA_POST_BOX", value: "SMALL_CANADA_POST_BOX" },
  {
    label: "SMALL_CANADA_POST_BUBBLE_MAILER",
    value: "SMALL_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "TOUGH_BAGS", value: "TOUGH_BAGS" },
  { label: "UPS_LETTER", value: "UPS_LETTER" },
  {
    label: "USPS_FLAT_RATE_ENVELOPE",
    value: "USPS_FLAT_RATE_ENVELOPE",
  },
  { label: "USPS_LARGE_PACK", value: "USPS_LARGE_PACK" },
  { label: "VERY_LARGE_PACK", value: "VERY_LARGE_PACK" },
  { label: "WINE_PAK", value: "WINE_PAK" },
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
    </FormLayout>
  );
};

export default AdditionalDetailsComponent;
