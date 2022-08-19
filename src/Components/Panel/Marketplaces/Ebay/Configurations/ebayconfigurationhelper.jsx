import React from 'react';
import {Card, Stack} from "@shopify/polaris";
import {button, select, textField} from "../../../../../PolarisComponents/InputGroups";
import { attributeOptions, marketplacesOptions } from '../../../../../Subcomponents/Registration/ImportsettingsBody';
import {bannerPolaris} from "../../../../../PolarisComponents/InfoGroups";

export let ebayconfigSectiontabs = [
    {
      id: 'filter-panel',
      content: 'Filters',
      accessibilityLabel: 'Filters',
      panelID: 'filter-panel-content',
    }

  ];

export function filterStructure(filters = {} , handleConfigurationChange, marketplace, configurationSaved, loader = false, errors = {}){
    let { /* shopify_import, */ ebay_import, amazon_import } = filters;
    let { /*shopify_import: shopifyErrors, */ ebay_import: ebayErrors, amazon_import: amazonErrors } = errors;
    // let { product_status } = shopify_import;
    return <Card primaryFooterAction={{ content :'Save', onAction: configurationSaved.bind(this, 'product_filters'), loading: loader}}>
      {/*<Card.Section title={"Shopify"}>*/}
      {/*  { */}
      {/*    select("Product status", marketplacesOptions.shopify.status, handleConfigurationChange.bind(this, 'product_filters', 'shopify_import', 'product_status', false, false, false), product_status, "Please select...", shopifyErrors.product_status, false, false, "Apply filters for importing product(s) from Shopify")*/}
      {/*  }*/}
      {/*</Card.Section>*/}
      { marketplace === "ebay" &&
      <Card.Section title={"eBay"} actions={[{
        content: 'Add',
        onAction: handleConfigurationChange.bind(this,'product_filters', 'ebay_import', false, false, false, 'add')
    }]}>
        {
        ebay_import.length > 0 &&
          getMarketplacemapOptionsStructure('ebay', ebay_import, attributeOptions, handleConfigurationChange.bind(this), ebayErrors)
        }
        {
        !ebay_import.length &&
          bannerPolaris(<span style={{fontSize: '1.2rem'}}><b>Click on add action for new attribute map
                            option</b></span>)
        }
      </Card.Section>
      }
      { marketplace === "amazon" &&
      <Card.Section title={"Amazon"} actions={[{
          content: 'Add',
          onAction: handleConfigurationChange.bind(this,'product_filters', 'amazon_import', false, false, false, 'add')
      }]}>
          {
              amazon_import.length > 0 &&
              getMarketplacemapOptionsStructure('amazon', amazon_import, attributeOptions, handleConfigurationChange.bind(this), amazonErrors)
          }
          {
              !amazon_import.length &&
              bannerPolaris(<span style={{fontSize: '1.2rem'}}><b>Click on add action for new attribute map
                  option</b></span>)
          }
      </Card.Section>
      }
    </Card>
}

function getMarketplacemapOptionsStructure(marketplace, saved_options,  attributeOptions, handleConfigurationChange, errors){
  let { ebay, shopify, amazon } = attributeOptions;
  switch(marketplace){
    case 'ebay':
        let ebayFilterOptions = [];
        saved_options.forEach((opt, index) =>{
            ebayFilterOptions = [ ...ebayFilterOptions, <Stack vertical={false} distribution={"fillEvenly"} >
                {
                    select("eBay attribute", ebay,  handleConfigurationChange.bind(this, 'product_filters', 'ebay_import', false, index, 'marketplace_attribute', 'update'), opt.marketplace_attribute, 'Please Select', errors[index]['marketplace_attribute'])
                }
                {
                    select("Shopify attribute", shopify,  handleConfigurationChange.bind(this, 'product_filters', 'ebay_import', false, index, 'shopify_attribute', 'update'), opt.shopify_attribute, 'Please Select', errors[index]['shopify_attribute'])
                }
                { opt.shopify_attribute === 'custom' &&
                    textField("Custom value", opt.custom, handleConfigurationChange.bind(this, 'product_filters', 'ebay_import', false, index, 'custom', 'update'), "", "", errors[index]['custom'])
                }
                <div style={{marginTop : '2.3rem'}}>
                {
                    button("X", handleConfigurationChange.bind(this, 'product_filters', 'ebay_import', false, false, false, 'delete', index))
                }
                </div>
            </Stack>]
        });
        return <Stack vertical={true} distribution={"fill"}>{ebayFilterOptions}</Stack>
      case 'amazon' :
          let amazonFilterOptions = [];
          saved_options.forEach((opt, index) =>{
              amazonFilterOptions = [ ...amazonFilterOptions, <Stack vertical={false} distribution={"fillEvenly"} >
                  {
                      select("Amazon attribute", amazon,  handleConfigurationChange.bind(this, 'product_filters', 'amazon_import', false, index, 'marketplace_attribute', 'update'), opt.marketplace_attribute,'Please Select', errors[index]['marketplace_attribute'])
                  }
                  {
                      select("Shopify attribute", shopify,  handleConfigurationChange.bind(this, 'product_filters', 'amazon_import', false, index, 'shopify_attribute', 'update'), opt.shopify_attribute, 'Please Select', errors[index]['shopify_attribute'])
                  }
                  { opt.shopify_attribute === 'custom' &&
                  textField("Custom value", opt.custom, handleConfigurationChange.bind(this, 'product_filters', 'amazon_import', false, index, 'custom', 'update'), "", "", errors[index]['custom'])
                  }
                  <div style={{marginTop : '2.3rem'}}>
                  {
                      button("X", handleConfigurationChange.bind(this, 'product_filters', 'amazon_import', false, false, false, 'delete', index))
                  }
                  </div>
              </Stack>]
          });
          return <Stack vertical={true} distribution={"fill"}>{amazonFilterOptions}</Stack>
      default : break;

  }

}

export let configurationstemplates = { data : {
    general_settings : {
        item_location : {
            country : "",
                zip_code : "",
                location : ""
        },
        excluded_shipping_location : {
            country : ""
        },
        vat_details : {
            business_seller : "yes",
            restricted_to_business : "yes",
            vat_percentage : "yes"
        },
        currency_converter : {
            enable : "yes",
            source_currency_value : "",
            target_currency_value : ""
        }
    },
    product_settings : {
        product_sync : {
            enable : "yes",
                attributes : {
                title : "yes", sku : "yes",

            }
        },
    },
    order_settings : {
        order_sync : "yes",
        order_status : "paid",
        product_not_exist : "yes",
        auto_acknowladge : "yes",
        auto_cancel_order : "yes",
        reason_order_cancellation : {
            target_marketplace_reasons : "source_marketplace_reasons"
        },
        track_target_inventory : "yes",
            customer_details : {
            use_marketplace_details : "yes",
                default_customer_details : {
                name : "", email : "",
            }
        },
        mapping_of_shipping_services : {
            target_marketplace_services : "source_marketplace_services"
        },
    },
    shipment_settings : {
        sync_target_to_source : "yes",
            sync_source_to_target : "yes",
            sync_without_tracking : "yes"
    },
    import_profile : {
        marketplace_attribute : {
            type : "attribute",
                value : "source_attribute"
        },
    },
}};