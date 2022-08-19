import {
  Banner,
  Card,
  ChoiceList,
  FormLayout,
  Select,
  Stack,
} from "@shopify/polaris";
import { Button, Checkbox, Radio, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { configurationAPI } from "../../../../../../APIrequests/ConfigurationAPI";
import {
  getSourceAttributesURL,
  vendorProductTypeURL,
} from "../../../../../../URLs/ConfigurationURL";

let matchfromEbayOptions = [
  { label: "Title", value: "Title" },
  { label: "Sku", value: "SKU" },
];

let matchfromShopifyOptions = [
  { label: "Title", value: "details.title" },
  { label: "Sku", value: "variants.sku" },
];

const ImportSettingsBckp = () => {
  const [importProductFilters, setImportProductFilters] = useState({
    importAndReplaceProduct: {
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      enable: "yes",
    },
    productType: {
      enable: "yes",
      options: [
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
      ],
      value: "",
    },
    publishedStatus: {
      options: [
        {
          label: "Please Select...",
          value: "",
        },
        { label: "Published", value: "published" },
        { label: "Unpublished", value: "unpublished" },
        { label: "Any", value: "any" },
      ],
      value: "",
      enable: "yes",
    },
    productStatus: {
      options: [
        {
          label: "Please Select...",
          value: "",
        },
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
        { label: "Draft", value: "draft" },
      ],
      value: "",
      enable: "yes",
    },
    vendor: {
      value: "",
      options: [
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
      ],
      enable: "yes",
    },
    import_collection: {
      enable: "yes",
      collections_options: [
        {
          label: "Bags-262969491534",
          value: "262969491534",
        },
        {
          label: "Home page-141790281806",
          value: "141790281806",
        },
        {
          label: "Track suit-262969589838",
          value: "262969589838",
        },
        {
          label: "myCollection-262952550478",
          value: "262952550478",
        },
      ],
      selected_collection: [],
    },
    match_from_ebay: {
      enable: "yes",
      match_from_ebay: {},
    },
  });

  const handleAdd = (userPreference = "match_from_ebay") => {
    switch (userPreference) {
      case "match_from_ebay":
        let tempObj = {};
        let attributeAdded = "";
        tempObj = Object.assign(
          {},
          importProductFilters.match_from_ebay.match_from_ebay
        );
        let ObjtoAdd = { shopify_attribute: "", ebay_attribute: "" };
        if (Object.keys(tempObj).length < 2) {
          if (Object.keys(tempObj).length === 0) {
            tempObj["1"] = { ...ObjtoAdd };
          } else {
            tempObj["2"] = { ...ObjtoAdd };
          }
        }
        let test = { ...importProductFilters };
        test.match_from_ebay.match_from_ebay = Object.assign({}, tempObj);
        matchfromEbayOptions.forEach((key, index) => {
          if (key.value === attributeAdded) {
            matchfromEbayOptions[index]["disabled"] = true;
          }
        });
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
        tempObj = Object.assign(
          {},
          importProductFilters.match_from_ebay.match_from_ebay
        );
        if (Object.keys(tempObj).length > -1) {
          if (tempObj.hasOwnProperty(key)) {
            delete tempObj[key];
            if (Object.keys(tempObj).length > 0) {
              let pos = 1;
              Object.keys(tempObj).map((PosKey) => {
                resturctureObj[pos] = tempObj[PosKey];
                ++pos;
              });
            }
            test.match_from_ebay.match_from_ebay = Object.assign(
              {},
              resturctureObj
            );
          }
        }
        matchfromEbayOptions.forEach((key, index) => {
          if (key.value === attributeRemoved) {
            if (matchfromEbayOptions[index]["disabled"]) {
              matchfromEbayOptions[index]["disabled"] = false;
            }
          }
        });
        setImportProductFilters(test);
        break;
    }
  };

  const hitAPI = async () => {
    let postData = {
      marketplace: 'shopify',
    };
    let {} = await configurationAPI(getSourceAttributesURL, postData);
  };
  useEffect(() => {
    hitAPI();
  }, []);
  // useEffect(() => {
  // console.log(importProductFilters.match_from_ebay);
  // }, [importProductFilters]);

  const importCollections = () => {
    // requests.getRequest("shopify/import/collections").then((data) => {
    //   if (data.success) {
    //     notify.success(data.message);
    //     this.getSourceAttributes();
    //   } else {
    //     notify.error(data.message);
    //   }
    // });
  };

  return (
    <Card
      title="Import Product Filters"
      actions={[
        {
          content: (
            <Button
              type="primary"
              onClick={() => {
                console.log(importProductFilters);
              }}
            >
              Save
            </Button>
          ),
        },
      ]}
    >
      <Card.Section>
        <Stack spacing="loose" distribution="fillEvenly">
          <Select
            label="Import and replace product"
            options={importProductFilters["importAndReplaceProduct"]["options"]}
            value={importProductFilters["importAndReplaceProduct"]["enable"]}
            onChange={(e) => {
              let temp = { ...importProductFilters };
              temp["importAndReplaceProduct"]["enable"] = e;
              setImportProductFilters(temp);
            }}
            helpText={
              "*this option will help if you want to delete and replace all product"
            }
          />
          <Select
            label="Product Type"
            options={importProductFilters["productType"]["options"]}
            value={importProductFilters["productType"]["value"]}
            onChange={(e) => {
              let temp = { ...importProductFilters };
              temp["productType"]["value"] = e;
              setImportProductFilters(temp);
            }}
            helpText={"*by default all product types are imported"}
          />
          <Select
            label="Published Status"
            options={importProductFilters["publishedStatus"]["options"]}
            value={importProductFilters["publishedStatus"]["value"]}
            onChange={(e) => {
              let temp = { ...importProductFilters };
              temp["publishedStatus"]["value"] = e;
              setImportProductFilters(temp);
            }}
            helpText={"*by default all published product are imported"}
          />
          <Select
            label="Product Status"
            options={importProductFilters["productStatus"]["options"]}
            value={importProductFilters["productStatus"]["value"]}
            onChange={(e) => {
              let temp = { ...importProductFilters };
              temp["productStatus"]["value"] = e;
              setImportProductFilters(temp);
            }}
            helpText={"*by default all product status are imported"}
          />
          <Select
            label="Vendor"
            options={importProductFilters["vendor"]["options"]}
            value={importProductFilters["vendor"]["value"]}
            onChange={(e) => {
              let temp = { ...importProductFilters };
              temp["vendor"]["value"] = e;
              setImportProductFilters(temp);
            }}
            helpText={"*by default all products of all vendor are imported"}
          />
        </Stack>
      </Card.Section>
      <Card.Section title={"Import Collection products"}>
        <Banner
          title="If you have made any changes or some collections seems to be missing then you need to re-import them so as to keep the app in Sync."
          status="warning"
          action={{
            content: "Import collections",
            onAction: importCollections,
          }}
        />
        <div style={{ maxHeight: 400, overflowY: "scroll" }}>
          <ChoiceList
            title
            e={""}
            choices={importProductFilters.import_collection.collections_options}
            selected={
              importProductFilters.import_collection.selected_collection
            }
            onChange={(e) => {
              let choicesMade = [];
              // e.forEach((choice) => {
              //   let isChoiceExisting =
              //     this.state.seller_preferences.import_collection.collections_options.filter(
              //       (optionavailable) => optionavailable.value === choice
              //     );
              //   if (isChoiceExisting.length > 0) {
              //     choicesMade.push(choice);
              //   }
              // });
              // console.log(choicesMade);
              // this.state.seller_preferences.import_collection.selected_collection =
              //   choicesMade.slice(0);
              // this.setState(this.state);
            }}
            allowMultiple={true}
          />
        </div>
      </Card.Section>
      {Object.keys(importProductFilters["match_from_ebay"]["match_from_ebay"])
        .length === 0 && (
        <Card.Section title={"Match products from Shopify"}>
          <Banner
            title={
              "Preferences for matching products from eBay is set by default in order Title > SKU and both are matched , To set custom preferences click on Add Attribute"
            }
            action={{
              content: "Add Attribute",
              onAction: (e) => {
                handleAdd("match_from_ebay");
              },
            }}
          />
        </Card.Section>
      )}
      {Object.keys(importProductFilters.match_from_ebay.match_from_ebay)
        .length > 0 && (
        <Card.Section>
          <Card
            title={"Match products from eBay"}
            actions={{
              content: "Add Attribute",
              onAction: (e) => {
                handleAdd("match_from_ebay");
              },
              disabled:
                Object.keys(
                  importProductFilters.match_from_ebay.match_from_ebay
                ).length === 2,
            }}
          >
            <FormLayout>
              <FormLayout.Group condensed={true}>
                {Object.keys(
                  importProductFilters.match_from_ebay.match_from_ebay
                ).map((preferenceKey) => {
                  return (
                    <Card.Section>
                      <Card
                        actions={{
                          content: "Remove",
                          onAction: (e) => {
                            handleRemove("match_from_ebay", preferenceKey);
                          },
                        }}
                      >
                        <Card.Section title={`Preference # ${preferenceKey}`}>
                          <Stack vertical={false} distribution={"fillEvenly"}>
                            <Select
                              placeholder={"Select..."}
                              label={`Ebay attribute`}
                              options={matchfromEbayOptions}
                              onChange={(e) => {
                                let test = { ...importProductFilters };
                                test.match_from_ebay.match_from_ebay[
                                  preferenceKey
                                ]["ebay_attribute"] = e;
                                setImportProductFilters(test);
                              }}
                              value={
                                importProductFilters.match_from_ebay
                                  .match_from_ebay[preferenceKey][
                                  "ebay_attribute"
                                ]
                              }
                            />
                            <Select
                              placeholder={"Select..."}
                              label={`Shopify attribute`}
                              options={matchfromShopifyOptions}
                              onChange={(e) => {
                                let test = { ...importProductFilters };
                                test.match_from_ebay.match_from_ebay[
                                  preferenceKey
                                ]["shopify_attribute"] = e;
                                setImportProductFilters(test);
                              }}
                              value={
                                importProductFilters.match_from_ebay
                                  .match_from_ebay[preferenceKey][
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
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Card.Section>
      )}
    </Card>
  );
};

export default ImportSettingsBckp;
