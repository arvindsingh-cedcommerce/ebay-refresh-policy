import { Select } from "@shopify/polaris";
import React from "react";

const shippingPackageType = [
  { label: "Please Select", value: "" },
  { label: "Bulky Goods", value: "C_BULKY_GOODS" },
  { label: "Caravan", value: "C_CARAVAN" },
  { label: "Cars", value: "C_CARS" },
  { label: "Custom Code", value: "C_CUSTOM_CODE" },
  { label: "Europallet", value: "C_EUROPALLET" },
  { label: "Expandable Tough Bags", value: "C_EXPANDABLE_TOUGH_BAGS" },
  { label: "ExtraLargePack", value: "C_EXTRA_LARGE_PACK" },
  { label: "Furniture", value: "C_FURNITURE" },
  { label: "Industry Vehicles", value: "C_INDUSTRY_VEHICLES" },
  { label: "Large Canada PostBox", value: "C_LARGE_CANADA_POST_BOX" },
  {
    label: "Large Canada Post Bubble Mailer",
    value: "C_LARGE_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "Large Envelope", value: "C_LARGE_ENVELOPE" },
  { label: "Letter", value: "C_LETTER" },
  { label: "MailingBoxes", value: "C_MAILING_BOXES" },
  { label: "MediumCanadaPostBox", value: "C_MEDIUM_CANADA_POST_BOX" },
  {
    label: "MediumCanadaPostBubbleMailer",
    value: "C_MEDIUM_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "Motorbikes", value: "C_MOTORBIKES" },
  { label: "None", value: "C_NONE" },
  { label: "One Way Pallet", value: "C_ONE_WAY_PALLET" },
  { label: "Package Thick Envelope", value: "C_PACKAGE_THICK_ENVELOPE" },
  { label: "Padded Bags", value: "C_PADDED_BAGS" },
  { label: "Parcel Or Padded Envelope", value: "C_PARCEL_OR_PADDED_ENVELOPE" },
  { label: "Roll", value: "C_ROLL" },
  { label: "Small Canada PostBox", value: "C_SMALL_CANADA_POST_BOX" },
  {
    label: "Small Canada Post BubbleMailer",
    value: "C_SMALL_CANADA_POST_BUBBLE_MAILER",
  },
  { label: "Tough Bags", value: "C_TOUGH_BAGS" },
  { label: "UPS Letter", value: "C_UPS_LETTER" },
  { label: "USPS Flat Rate Envelope", value: "C_USPS_FLAT_RATE_ENVELOPE" },
  { label: "USPS Large Pack", value: "C_USPS_LARGE_PACK" },
  { label: "Very Large Pack", value: "C_VERY_LARGE_PACK" },
  { label: "Winepak", value: "C_WINEPAK" },
];

const PackageTypeComponent = ({
  connectedAccountsObject,
  account,
  setconnectedAccountsObject,
}) => {
  return (
    <Select
      key={"selectShippingpackageType"}
      options={shippingPackageType}
      label={"Package Type"}
      value={connectedAccountsObject[account].packageType}
      onChange={(e) => {
        let temp = { ...connectedAccountsObject };
        temp[account].packageType = e;
        setconnectedAccountsObject(temp);
      }}
    />
  );
};

export default PackageTypeComponent;
