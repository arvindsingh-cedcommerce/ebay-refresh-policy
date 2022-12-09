import {
  Button,
  ButtonGroup,
  Card,
  ChoiceList,
  FormLayout,
  Layout,
  Select,
  Stack,
  SkeletonBodyText,
  SkeletonPage,
} from "@shopify/polaris";
import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  getImportAttribute,
  initiateVendorProductTypeFetch,
} from "../../../../../../../Apirequest/registrationApi";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../../services/notify";
import { requests } from "../../../../../../../services/request";
import {
  collectionFetchURL,
  saveAppSettingsShopifyToAppURL,
} from "../../../../../../../URLs/ConfigurationURL";
const { Title } = Typography;

let matchfromEbayOptions = [
  { label: "Title", value: "Title" },
  { label: "Sku", value: "SKU" },
];

let matchfromShopifyOptions = [
  { label: "Title", value: "title" },
  { label: "Sku", value: "sku" },
];

const productTypeOptions = [
  {
    label: "Please Select...",
    value: "",
  },
  {
    label: "Accessories",
    value: "Accessories",
  },
  {
    label: "Animals & Pet Supplies",
    value: "Animals & Pet Supplies",
  },
  {
    label: "Apparel",
    value: "Apparel",
  },
  {
    label: "Badge",
    value: "Badge",
  },
  {
    label: "Bags",
    value: "Bags",
  },
  {
    label: "Bar Tape",
    value: "Bar Tape",
  },
  {
    label: "Baskets",
    value: "Baskets",
  },
  {
    label: "Bells",
    value: "Bells",
  },
  {
    label: "Bicycle Rack",
    value: "Bicycle Rack",
  },
  {
    label: "Bike Accessories",
    value: "Bike Accessories",
  },
  {
    label: "Bike Rack",
    value: "Bike Rack",
  },
  {
    label: "Bike Racks",
    value: "Bike Racks",
  },
  {
    label: "Bottom Brackets",
    value: "Bottom Brackets",
  },
  {
    label: "Brake",
    value: "Brake",
  },
  {
    label: "Care",
    value: "Care",
  },
  {
    label: "Chain",
    value: "Chain",
  },
  {
    label: "Chain Guards",
    value: "Chain Guards",
  },
  {
    label: "Chain Tensioners",
    value: "Chain Tensioners",
  },
  {
    label: "Chainrings",
    value: "Chainrings",
  },
  {
    label: "Clothing",
    value: "Clothing",
  },
  {
    label: "Clothing Accessories",
    value: "Clothing Accessories",
  },
  {
    label: "Computer",
    value: "Computer",
  },
  {
    label: "Cranks",
    value: "Cranks",
  },
  {
    label: "FGFS",
    value: "FGFS",
  },
  {
    label: "FGFS Accessories",
    value: "FGFS Accessories",
  },
  {
    label: "Fender",
    value: "Fender",
  },
  {
    label: "Fixed Cogs",
    value: "Fixed Cogs",
  },
  {
    label: "Fixed Gear Bicycle",
    value: "Fixed Gear Bicycle",
  },
  {
    label: "Foot Straps",
    value: "Foot Straps",
  },
  {
    label: "Forks",
    value: "Forks",
  },
  {
    label: "Framesets",
    value: "Framesets",
  },
  {
    label: "Freewheels",
    value: "Freewheels",
  },
  {
    label: "Furniture",
    value: "Furniture",
  },
  {
    label: "Gloves",
    value: "Gloves",
  },
  {
    label: "Glow Series",
    value: "Glow Series",
  },
  {
    label: "Grips",
    value: "Grips",
  },
  {
    label: "Handlebars",
    value: "Handlebars",
  },
  {
    label: "Head Set",
    value: "Head Set",
  },
  {
    label: "Headsets",
    value: "Headsets",
  },
  {
    label: "Helmet",
    value: "Helmet",
  },
  {
    label: "Home",
    value: "Home",
  },
  {
    label: "Kickstand",
    value: "Kickstand",
  },
  {
    label: "Kids Fixed Gear Bike",
    value: "Kids Fixed Gear Bike",
  },
  {
    label: "Light",
    value: "Light",
  },
  {
    label: "Live Animals",
    value: "Live Animals",
  },
  {
    label: "Lock",
    value: "Lock",
  },
  {
    label: "Lockrings",
    value: "Lockrings",
  },
  {
    label: "Locks",
    value: "Locks",
  },
  {
    label: "Mens",
    value: "Mens",
  },
  {
    label: "Outdoor",
    value: "Outdoor",
  },
  {
    label: "Pannier",
    value: "Pannier",
  },
  {
    label: "Pedals",
    value: "Pedals",
  },
  {
    label: "Pet Agility Equipment",
    value: "Pet Agility Equipment",
  },
  {
    label: "Premium Fixed Gear Bike",
    value: "Premium Fixed Gear Bike",
  },
  {
    label: "Pumps",
    value: "Pumps",
  },
  {
    label: "Rim Tape",
    value: "Rim Tape",
  },
  {
    label: "Saddle",
    value: "Saddle",
  },
  {
    label: "Scooter",
    value: "Scooter",
  },
  {
    label: "Seatpost",
    value: "Seatpost",
  },
  {
    label: "Seatpost Clamp",
    value: "Seatpost Clamp",
  },
  {
    label: "Shoes",
    value: "Shoes",
  },
  {
    label: "Speaker",
    value: "Speaker",
  },
  {
    label: "Stem",
    value: "Stem",
  },
  {
    label: "Stickers",
    value: "Stickers",
  },
  {
    label: "Tires",
    value: "Tires",
  },
  {
    label: "Tools",
    value: "Tools",
  },
  {
    label: "Tube",
    value: "Tube",
  },
  {
    label: "USB Charger",
    value: "USB Charger",
  },
  {
    label: "Video Recorders",
    value: "Video Recorders",
  },
  {
    label: "Water Bottle",
    value: "Water Bottle",
  },
  {
    label: "Water Bottle Holder",
    value: "Water Bottle Holder",
  },
  {
    label: "Wheelsets",
    value: "Wheelsets",
  },
  {
    label: "Womens",
    value: "Womens",
  },
  {
    label: "test product",
    value: "test product",
  },
  {
    label: "tshirt",
    value: "tshirt",
  },
];
const vendorOptions = [
  {
    label: "Please Select...",
    value: "",
  },
  {
    label: "Accessories",
    value: "Accessories",
  },
  {
    label: "Animals & Pet Supplies",
    value: "Animals & Pet Supplies",
  },
  {
    label: "Apparel",
    value: "Apparel",
  },
  {
    label: "Badge",
    value: "Badge",
  },
  {
    label: "Bags",
    value: "Bags",
  },
  {
    label: "Bar Tape",
    value: "Bar Tape",
  },
  {
    label: "Baskets",
    value: "Baskets",
  },
  {
    label: "Bells",
    value: "Bells",
  },
  {
    label: "Bicycle Rack",
    value: "Bicycle Rack",
  },
  {
    label: "Bike Accessories",
    value: "Bike Accessories",
  },
  {
    label: "Bike Rack",
    value: "Bike Rack",
  },
  {
    label: "Bike Racks",
    value: "Bike Racks",
  },
  {
    label: "Bottom Brackets",
    value: "Bottom Brackets",
  },
  {
    label: "Brake",
    value: "Brake",
  },
  {
    label: "Care",
    value: "Care",
  },
  {
    label: "Chain",
    value: "Chain",
  },
  {
    label: "Chain Guards",
    value: "Chain Guards",
  },
  {
    label: "Chain Tensioners",
    value: "Chain Tensioners",
  },
  {
    label: "Chainrings",
    value: "Chainrings",
  },
  {
    label: "Clothing",
    value: "Clothing",
  },
  {
    label: "Clothing Accessories",
    value: "Clothing Accessories",
  },
  {
    label: "Computer",
    value: "Computer",
  },
  {
    label: "Cranks",
    value: "Cranks",
  },
  {
    label: "FGFS",
    value: "FGFS",
  },
  {
    label: "FGFS Accessories",
    value: "FGFS Accessories",
  },
  {
    label: "Fender",
    value: "Fender",
  },
  {
    label: "Fixed Cogs",
    value: "Fixed Cogs",
  },
  {
    label: "Fixed Gear Bicycle",
    value: "Fixed Gear Bicycle",
  },
  {
    label: "Foot Straps",
    value: "Foot Straps",
  },
  {
    label: "Forks",
    value: "Forks",
  },
  {
    label: "Framesets",
    value: "Framesets",
  },
  {
    label: "Freewheels",
    value: "Freewheels",
  },
  {
    label: "Furniture",
    value: "Furniture",
  },
  {
    label: "Gloves",
    value: "Gloves",
  },
  {
    label: "Glow Series",
    value: "Glow Series",
  },
  {
    label: "Grips",
    value: "Grips",
  },
  {
    label: "Handlebars",
    value: "Handlebars",
  },
  {
    label: "Head Set",
    value: "Head Set",
  },
  {
    label: "Headsets",
    value: "Headsets",
  },
  {
    label: "Helmet",
    value: "Helmet",
  },
  {
    label: "Home",
    value: "Home",
  },
  {
    label: "Kickstand",
    value: "Kickstand",
  },
  {
    label: "Kids Fixed Gear Bike",
    value: "Kids Fixed Gear Bike",
  },
  {
    label: "Light",
    value: "Light",
  },
  {
    label: "Live Animals",
    value: "Live Animals",
  },
  {
    label: "Lock",
    value: "Lock",
  },
  {
    label: "Lockrings",
    value: "Lockrings",
  },
  {
    label: "Locks",
    value: "Locks",
  },
  {
    label: "Mens",
    value: "Mens",
  },
  {
    label: "Outdoor",
    value: "Outdoor",
  },
  {
    label: "Pannier",
    value: "Pannier",
  },
  {
    label: "Pedals",
    value: "Pedals",
  },
  {
    label: "Pet Agility Equipment",
    value: "Pet Agility Equipment",
  },
  {
    label: "Premium Fixed Gear Bike",
    value: "Premium Fixed Gear Bike",
  },
  {
    label: "Pumps",
    value: "Pumps",
  },
  {
    label: "Rim Tape",
    value: "Rim Tape",
  },
  {
    label: "Saddle",
    value: "Saddle",
  },
  {
    label: "Scooter",
    value: "Scooter",
  },
  {
    label: "Seatpost",
    value: "Seatpost",
  },
  {
    label: "Seatpost Clamp",
    value: "Seatpost Clamp",
  },
  {
    label: "Shoes",
    value: "Shoes",
  },
  {
    label: "Speaker",
    value: "Speaker",
  },
  {
    label: "Stem",
    value: "Stem",
  },
  {
    label: "Stickers",
    value: "Stickers",
  },
  {
    label: "Tires",
    value: "Tires",
  },
  {
    label: "Tools",
    value: "Tools",
  },
  {
    label: "Tube",
    value: "Tube",
  },
  {
    label: "USB Charger",
    value: "USB Charger",
  },
  {
    label: "Video Recorders",
    value: "Video Recorders",
  },
  {
    label: "Water Bottle",
    value: "Water Bottle",
  },
  {
    label: "Water Bottle Holder",
    value: "Water Bottle Holder",
  },
  {
    label: "Wheelsets",
    value: "Wheelsets",
  },
  {
    label: "Womens",
    value: "Womens",
  },
  {
    label: "test product",
    value: "test product",
  },
  {
    label: "tshirt",
    value: "tshirt",
  },
];
const publishedStatusOptions = [
  {
    label: "Please Select...",
    value: "",
  },
  // { label: "Web", value: "web" },
  // { label: "Global", value: "global" },
  { label: "Any", value: "any" },
  { label: "Published", value: "published" },
  { label: "Unpublished", value: "unpublished" },
];
const productStatusOptions = [
  {
    label: "Please Select...",
    value: "",
  },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
  { label: "Draft", value: "draft" },
];

const ImportSettingsNew = ({ importSettingsFromSavedAPIData }) => {
  const [flag, setflag] = useState(true);
  const [saveBtnLoader, setSaveBtnLoader] = useState(false);

  const [importProductFilters, setImportProductFilters] = useState({
    importAndReplaceProduct: {
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      label: "Import and replace product",
      enable: "yes",
      type: "segmentedBtn",
      description:
        "The option imports the products from Shopify based on the applied filters given below and replaces /removes the other existing products from the app.",
    },
    productType: {
      options: [],
      label: "Product Type",
      enable: "yes",
      type: "dropdown",
      value: '',
      description:
        "Select the product type you wish to import from Shopify to the App. By default, all product types are imported.",
    },
    vendor: {
      options: [],
      label: "Vendor",
      enable: "yes",
      type: "dropdown",
      value: '',
      description:
        "Select the vendor you wish to import from Shopify to the App. By default, products of all vendors are imported.",
    },
    publishedStatus: {
      options: publishedStatusOptions,
      label: "Published Status",
      enable: "yes",
      type: "dropdown",
      value: publishedStatusOptions[0]["value"],
      description:
        "Select the products with the required published status you wish to import from Shopify to the App. By default, products with all published status are imported.",
    },
    productStatus: {
      options: productStatusOptions,
      label: "Product Status",
      enable: "yes",
      type: "dropdown",
      value: productStatusOptions[0]["value"],
      description:
        "Select the products with the required product status you wish to import from Shopify to the App. By default, the active product statuses are imported.",
    },
    import_collection: {
      label: "Import Collection products",
      enable: "yes",
      type: "choicelist",
      description:
        "Products can be imported in the app based on the selected Shopify collections, you can select the checkbox shown next to the imported Shopify collections.",
      collections_options: [],
      // collections_options: [
      //   {
      //     label: "Bags-262969491534",
      //     value: "262969491534",
      //   },
      //   {
      //     label: "Home page-141790281806",
      //     value: "141790281806",
      //   },
      //   {
      //     label: "Track suit-262969589838",
      //     value: "262969589838",
      //   },
      //   {
      //     label: "myCollection-262952550478",
      //     value: "262952550478",
      //   },
      // ],
      selected_collection: [],
    },
    // match_from_ebay: {
    //   label: "Match products from eBay",
    //   enable: "yes",
    //   type: "segmentedBtn",
    //   description:
    //     "Set the attribute preference between Title or SKU to map the already existing eBay linting to  Shopify listings.",
    //   match_from_ebay: [],
    // },
  });

  const handleBtnPres = (e, field, innerFieldLevel1 = "") => {
    // console.log(e, field, innerFieldLevel1);
    let temp = { ...importProductFilters };
    if (innerFieldLevel1) {
    } else {
      temp[field]["enable"] = temp[field]["enable"] === "yes" ? "no" : "yes";
    }
    if (field === "match_from_ebay" && temp[field]["enable"] === "no") {
      temp[field]["match_from_ebay"] = [];
    }
    setImportProductFilters(temp);
  };

  useEffect(() => {
    if (Object.keys(importSettingsFromSavedAPIData).length) {
      let temp = { ...importProductFilters };
      Object.keys(importSettingsFromSavedAPIData).forEach((field) => {
        if (field !== "match_from_ebay") {
          temp[field]["enable"] =
            importSettingsFromSavedAPIData[field]["enable"];
          switch (field) {
            case "import_collection":
              temp[field]["selected_collection"] =
                importSettingsFromSavedAPIData[field]["selected_collection"];
              break;
            // case "match_from_ebay":
            //   temp[field]["match_from_ebay"] =
            //     importSettingsFromSavedAPIData[field]["match_from_ebay"];
            //   break;
            case "importAndReplaceProduct":
              break;
            default:
              temp[field]["value"] =
                importSettingsFromSavedAPIData[field]["value"];
              break;
          }
          setImportProductFilters(temp);
        }
      });
    }
    setflag(false);
  }, [importSettingsFromSavedAPIData]);
  // useEffect(() => {
  //   console.log(importProductFilters);
  // }, [importProductFilters])
  const prepareOptions = (data) => {
    const options = data.map((value) => {
      let tempObj = {};
      tempObj["label"] = value;
      tempObj["value"] = value;
      return tempObj;
    });
    options.unshift({ label: "Please Select...", value: "" });
    return options;
  };

  const hitAPIsInitialRender = async () => {
    // let { success, data } = await initiateVendorProductTypeFetch();
    let { success, data } = await getImportAttribute();
    if (success) {
      let temp = { ...importProductFilters };
      if (data?.product_type)
        temp["productType"]["options"] = prepareOptions(data?.product_type);
      if (data?.vendor)
        temp["vendor"]["options"] = prepareOptions(data?.vendor);
      if (data?.collection) {
        const options = Object.keys(data.collection).map((key) => {
          let tempObj = {};
          tempObj["label"] = data.collection[key];
          tempObj["value"] = key;
          return tempObj;
        });
        options.unshift({ label: "Please Select...", value: "" });
        temp["import_collection"]["collections_options"] = options;
      }
      setImportProductFilters(temp);
    }
  };
  useEffect(() => {
    hitAPIsInitialRender();
  }, []);

  const importCollections = async () => {
    const { success, message } = await configurationAPI(collectionFetchURL);
    if (success) {
      notify.success(message);
    } else {
      notify.error(message);
    }
    // requests.getRequest("ebay/account/collectionFetch").then((data) => {
    //   if (data.success) {
    //     notify.success(data.message);
    //     // this.getSourceAttributes();
    //   } else {
    //     notify.error(data.message);
    //   }
    // });
  };

  const handleAdd = (userPreference = "match_from_ebay") => {
    switch (userPreference) {
      case "match_from_ebay":
        let tempObj = {};
        let attributeAdded = "";
        tempObj = Object.assign(
          {},
          importProductFilters.match_from_ebay.match_from_ebay
        );
        let tempArr = [];
        let ObjtoAdd = { shopify_attribute: "", ebay_attribute: "" };
        tempArr.push(ObjtoAdd);
        // if (Object.keys(tempObj).length < 2) {
        //   if (Object.keys(tempObj).length === 0) {
        //     tempObj["1"] = { ...ObjtoAdd };
        //   } else {
        //     tempObj["2"] = { ...ObjtoAdd };
        //   }
        // }
        let test = { ...importProductFilters };
        // test.match_from_ebay.match_from_ebay = Object.assign({}, tempObj);
        test.match_from_ebay.match_from_ebay.push(ObjtoAdd);
        // matchfromEbayOptions.forEach((key, index) => {
        //   if (key.value === attributeAdded) {
        //     matchfromEbayOptions[index]["disabled"] = true;
        //   }
        // });
        setImportProductFilters(test);
        break;
    }
  };

  const handleRemove = (userPreference = "match_from_ebay", key) => {
    let test = { ...importProductFilters };
    switch (userPreference) {
      case "match_from_ebay":
        let tempObj = {};
        let resturctureObj = {};
        let attributeRemoved =
          importProductFilters.match_from_ebay.match_from_ebay[key];
        let temp = { ...importProductFilters };
        temp["match_from_ebay"]["match_from_ebay"].splice(key, 1);
        // tempObj = Object.assign(
        //   {},
        //   importProductFilters.match_from_ebay.match_from_ebay
        // );
        // if (Object.keys(tempObj).length > -1) {
        //   if (tempObj.hasOwnProperty(key)) {
        //     delete tempObj[key];
        //     if (Object.keys(tempObj).length > 0) {
        //       let pos = 1;
        //       Object.keys(tempObj).map((PosKey) => {
        //         resturctureObj[pos] = tempObj[PosKey];
        //         ++pos;
        //       });
        //     }
        //     test.match_from_ebay.match_from_ebay = Object.assign(
        //       {},
        //       resturctureObj
        //     );
        //   }
        // }
        // matchfromEbayOptions.forEach((key, index) => {
        //   if (key.value === attributeRemoved) {
        //     if (matchfromEbayOptions[index]["disabled"]) {
        //       matchfromEbayOptions[index]["disabled"] = false;
        //     }
        //   }
        // });
        setImportProductFilters(test);
        break;
    }
  };

  const saveData = async () => {
    setSaveBtnLoader(true);
    let tempObj = {
      import_settings: {},
      setting_type: ["import_settings"],
    };
    for (const key in importProductFilters) {
      tempObj["import_settings"][key] = {};
      for (const key1 in importProductFilters[key]) {
        if (key1 === "enable") {
          tempObj["import_settings"][key][key1] =
            importProductFilters[key][key1];
        } else if (
          key1 === "value" ||
          key1 === "selected_collection" ||
          key1 === "match_from_ebay"
        ) {
          tempObj["import_settings"][key][key1] =
            importProductFilters[key][key1];
        }
        if (
          ["value", "match_from_ebay", "selected_collection"].includes(key1)
        ) {
          if (
            importProductFilters[key][key1] === "" ||
            (Array.isArray(importProductFilters[key][key1]) &&
              importProductFilters[key][key1].length === 0) ||
            (Object.getPrototypeOf(importProductFilters[key][key1]) ===
              Object.prototype &&
              Object.keys(importProductFilters[key][key1]).length === 0)
          ) {
            tempObj["import_settings"][key]["enable"] = "no";
          }
        }
      }
    }
    console.log("tempObj", tempObj);
    let { success, message } = await configurationAPI(
      saveAppSettingsShopifyToAppURL,
      tempObj
    );
    if (success) {
      notify.success(message);
    } else {
      notify.error(message);
    }
    setSaveBtnLoader(false);
  };
  return flag ? (
    <Card sectioned>
      <SkeletonPage fullWidth={true} title="Import Product Filters">
        <Card.Section>
          <SkeletonBodyText lines={2} />
        </Card.Section>
        <Card.Section>
          <SkeletonBodyText lines={2} />
        </Card.Section>
        <Card.Section>
          <SkeletonBodyText lines={2} />
        </Card.Section>
        <Card.Section>
          <SkeletonBodyText lines={2} />
        </Card.Section>
      </SkeletonPage>
    </Card>
  ) : (
    <Card
      sectioned
      title={<Title level={4}>Import Product Filters</Title>}
      actions={[
        {
          content: (
            <Button primary onClick={saveData} loading={saveBtnLoader}>
              Save
            </Button>
          ),
        },
      ]}
    >
      {Object.keys(importProductFilters).map(
        (importProductFilterSetting, index1) => {
          return (
            <FormLayout key={index1}>
              <Layout>
                <Layout.AnnotatedSection
                  id={importProductFilterSetting}
                  title={
                    importProductFilters[importProductFilterSetting]["label"]
                  }
                  description={
                    importProductFilters[importProductFilterSetting][
                      "description"
                    ]
                  }
                >
                  <Card sectioned>
                    <FormLayout>
                      {importProductFilters[importProductFilterSetting][
                        "type"
                      ] === "dropdown" ? (
                        <Select
                          options={
                            importProductFilters[importProductFilterSetting][
                              "options"
                            ]
                          }
                          value={
                            importProductFilters[importProductFilterSetting][
                              "value"
                            ]
                          }
                          onChange={(e) => {
                            let temp = { ...importProductFilters };
                            temp[importProductFilterSetting]["value"] = e;
                            if (e) {
                              temp[importProductFilterSetting]["enable"] =
                                "yes";
                            } else {
                              temp[importProductFilterSetting]["enable"] = "no";
                            }
                            setImportProductFilters(temp);
                          }}
                        />
                      ) : importProductFilters[importProductFilterSetting][
                          "type"
                        ] === "segmentedBtn" ? (
                        <ButtonGroup segmented>
                          <Button
                            primary={
                              importProductFilters[importProductFilterSetting][
                                "enable"
                              ] === "yes"
                                ? true
                                : false
                            }
                            pressed={
                              importProductFilters[importProductFilterSetting][
                                "enable"
                              ] === "yes"
                                ? true
                                : false
                            }
                            onClick={(e) => {
                              handleBtnPres(e, importProductFilterSetting);
                            }}
                          >
                            Yes
                          </Button>
                          <Button
                            primary={
                              importProductFilters[importProductFilterSetting][
                                "enable"
                              ] === "no"
                                ? true
                                : false
                            }
                            pressed={
                              importProductFilters[importProductFilterSetting][
                                "enable"
                              ] === "no"
                                ? true
                                : false
                            }
                            onClick={(e) => {
                              handleBtnPres(e, importProductFilterSetting);
                            }}
                          >
                            No
                          </Button>
                        </ButtonGroup>
                      ) : importProductFilters[importProductFilterSetting][
                          "type"
                        ] === "choicelist" ? (
                        <Card
                          sectioned
                          actions={{
                            content: (
                              <Button onClick={importCollections}>
                                Refresh Collections
                              </Button>
                            ),
                          }}
                        >
                          <div style={{ maxHeight: 400, overflowY: "scroll" }}>
                            <ChoiceList
                              e={""}
                              choices={
                                importProductFilters[
                                  importProductFilterSetting
                                ]["collections_options"]
                              }
                              selected={
                                importProductFilters[
                                  importProductFilterSetting
                                ]["selected_collection"]
                              }
                              onChange={(e) => {
                                let temp = { ...importProductFilters };
                                temp[importProductFilterSetting][
                                  "selected_collection"
                                ] = e;
                                if (e.length) {
                                  temp[importProductFilterSetting]["enable"] =
                                    "yes";
                                } else {
                                  temp[importProductFilterSetting]["enable"] =
                                    "no";
                                }
                                setImportProductFilters(temp);
                              }}
                              allowMultiple={true}
                            />
                          </div>
                        </Card>
                      ) : (
                        <></>
                      )}
                    </FormLayout>
                    {/* {importProductFilters[importProductFilterSetting][
                      "label"
                    ] === "Match products from eBay" &&
                      importProductFilters[importProductFilterSetting][
                        "enable"
                      ] === "yes" && (
                        <Card.Section
                          actions={{
                            content: (
                              <Button
                                // primary
                                onClick={(e) => {
                                  handleAdd("match_from_ebay");
                                }}
                                disabled={
                                  importProductFilters.match_from_ebay
                                    .match_from_ebay.length === 2
                                }
                              >
                                Add Attribute
                              </Button>
                            ),
                          }}
                        >
                          <FormLayout>
                            {Object.keys(
                              importProductFilters.match_from_ebay
                                .match_from_ebay
                            ).map((preferenceKey, index) => {
                              return (
                                <Card.Section>
                                  <Card
                                    actions={{
                                      content: "Remove",
                                      onAction: (e) => {
                                        handleRemove("match_from_ebay", index);
                                      },
                                    }}
                                  >
                                    <Card.Section
                                      title={`Preference # ${index + 1}`}
                                    >
                                      <Stack
                                        vertical={false}
                                        distribution={"fillEvenly"}
                                      >
                                        <Select
                                          placeholder={"Select..."}
                                          label={`Ebay attribute`}
                                          options={matchfromEbayOptions}
                                          onChange={(e) => {
                                            let test = {
                                              ...importProductFilters,
                                            };
                                            test.match_from_ebay.match_from_ebay[
                                              index
                                            ]["ebay_attribute"] = e;
                                            setImportProductFilters(test);
                                          }}
                                          value={
                                            importProductFilters.match_from_ebay
                                              .match_from_ebay[index][
                                              "ebay_attribute"
                                            ]
                                          }
                                        />
                                        <Select
                                          placeholder={"Select..."}
                                          label={`Shopify attribute`}
                                          options={matchfromShopifyOptions}
                                          onChange={(e) => {
                                            let test = {
                                              ...importProductFilters,
                                            };
                                            test.match_from_ebay.match_from_ebay[
                                              index
                                            ]["shopify_attribute"] = e;
                                            setImportProductFilters(test);
                                          }}
                                          value={
                                            importProductFilters.match_from_ebay
                                              .match_from_ebay[index][
                                              "shopify_attribute"
                                            ]
                                          }
                                        />
                                      </Stack>
                                    </Card.Section>
                                  </Card>
                                </Card.Section>
                              );
                            })}
                          </FormLayout>
                        </Card.Section>
                      )} */}
                  </Card>
                </Layout.AnnotatedSection>
              </Layout>
            </FormLayout>
          );
        }
      )}
    </Card>
  );
};

export default ImportSettingsNew;
