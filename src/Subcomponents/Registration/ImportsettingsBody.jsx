import React from "react";
import {Card, Stack} from "@shopify/polaris";
import {button, select, textField} from "../../PolarisComponents/InputGroups";
import {bannerPolaris} from "../../PolarisComponents/InfoGroups";

export let attributeOptions = {
    ebay : [
        {label : 'Title', value : 'title'},
        {label : 'SKU', value : 'sku'},
    ],
    amazon : [
        {label : 'Barcode', value : 'barcode'},
        {label : 'SKU', value : 'sku'},
    ],
    shopify : [
        {label : 'Title', value : 'title'},
        {label : 'SKU', value : 'sku'},
        {label : 'Custom', value : 'custom'},
        ]
};

export const marketplacesOptions = {
    shopify : {
        status : [{
            label : 'Active', value : 'active'
        },{
            label : 'Archived', value : 'archived'
        },{ label: 'Draft', value : 'draft'}]
    }
};

export let marketplaceAttributeMapSchema = { shopify_attribute : '', marketplace_attribute : '', custom : ''}
export let marketplaceAttributeErrorMapSchema = { shopify_attribute : '', marketplace_attribute : '', custom : ''}

export function importSettingsStructure(activeStep, data, onChange, errors){
    let { filters,accounts_connected,  handleMarketplaceFilters } = data;
    let { shopify, ebay, amazon} = filters;
    let { shopify: shopifyErrorOption } = errors;
    let { product_status: productStatusError } = shopifyErrorOption;
    let { status } = shopify;
    return (<Stack vertical={false} distribution={'fillEvenly'}>
                {/*<Card title={'Shopify'}>*/}
                {/*    <Card.Section>*/}
                {/*        <Stack vertical={true}>*/}
                {/*        {*/}
                {/*            bannerPolaris('Apply filters for importing products from Shopify')*/}
                {/*        }*/}
                {/*        {*/}
                {/*            select('Product status', marketplacesOptions.shopify.status, onChange.bind(this,'status', activeStep), status, 'Please select.....', productStatusError )*/}
                {/*        }*/}
                {/*        </Stack>*/}
                {/*    </Card.Section>*/}
                {/*</Card>*/}
            <Card title={'Marketplaces'}>

                    <Card.Section>
                        {
                         bannerPolaris(<p style={{fontSize: '1.5rem'}}><b>Map the attributes for matching already<br/>uploaded products on marketplace(s)</b></p>)
                        }
                    </Card.Section>
                {accounts_connected.indexOf('ebay') > -1 &&
                    <Card.Section title={'eBay'} actions={[{
                        content: 'Add',
                        onAction: handleMarketplaceFilters.bind(this, activeStep, 'add', 'ebay')
                    }]}>
                        {ebay.length > 0 &&
                        getMarketplacemapOptionsStructure(ebay, attributeOptions.ebay, handleMarketplaceFilters.bind(this), activeStep, 'ebay', attributeOptions.shopify, errors)
                        }
                        {!ebay.length &&
                        bannerPolaris(<p style={{fontSize: '1.2rem'}}><b>Click on add action for new attribute map
                            option</b></p>)
                        }
                    </Card.Section>
                }
                {accounts_connected.indexOf('amazon') > -1 &&
                <Card.Section title={'Amazon'} actions={[{
                    content: 'Add',
                    onAction: handleMarketplaceFilters.bind(this, activeStep, 'add', 'amazon')
                }]}>
                    {amazon.length > 0 &&
                    getMarketplacemapOptionsStructure(amazon, attributeOptions.amazon, handleMarketplaceFilters.bind(this), activeStep, 'amazon', attributeOptions.shopify, errors)
                    }
                    {!amazon.length &&
                    bannerPolaris(<p style={{fontSize: '1.2rem'}}><b>Click on add action for new attribute map
                        option</b></p>)
                    }
                </Card.Section>
                }
                </Card>
    </Stack>)
}

function getMarketplacemapOptionsStructure(arrayOptions =[], marketplaceattributeOptions =[], handleMarketplaceFilters, activeStep, marketplace, shopifyAttributeOptions = [], errors){
    let structure =[];
    arrayOptions.forEach((value, index) =>{
        structure = [ ...structure, <Stack vertical={false} distribution={'fillEvenly'}>
            {
                select('', marketplaceattributeOptions, handleMarketplaceFilters.bind(this, activeStep, 'update',  marketplace, index, "marketplace_attribute"), value.marketplace_attribute, 'Marketplace attribute', errors[marketplace][index]['marketplace_attribute'])
            }
            {
                select('', shopifyAttributeOptions, handleMarketplaceFilters.bind(this, activeStep, 'update',  marketplace, index, "shopify_attribute"), value.shopify_attribute, 'Shopify attribute', errors[marketplace][index]['shopify_attribute'])
            }
            {value.shopify_attribute === 'custom' &&
                textField('', value.custom, handleMarketplaceFilters.bind(this, activeStep, 'update', marketplace, index, 'custom'), 'Custom value', '', errors[marketplace][index]['custom'])
            }
            {
                button("X", handleMarketplaceFilters.bind(this, activeStep, 'delete',  marketplace, index))
            }
        </Stack>]
    })
    return <Stack vertical={true} spacing={"loose"} distribution={'fillEvenly'}>{structure}</Stack>;
}


