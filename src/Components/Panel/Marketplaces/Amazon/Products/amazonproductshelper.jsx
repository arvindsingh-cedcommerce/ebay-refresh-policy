import {DataTable, Icon, Stack, Thumbnail, Tooltip} from "@shopify/polaris";
import React from "react";
import {ViewMajorMonotone} from "@shopify/polaris-icons";
import {crouselStructureFunction, totalQuantityfromVariant} from "../../Ebay/Products/ebayproducthelper";
import {ckeditor, ReactJsonStructure, textField} from "../../../../../PolarisComponents/InputGroups";
import _ from "lodash";
import {bannerPolaris, getBadgePolaris, thumbnail} from "../../../../../PolarisComponents/InfoGroups";
const Noimage = require('../../../../../assets/notfound.png');

export function gridPropColumns ( incellElement = () =>{}) { return [
    {
        headerName: "Image", field: "image",
        checkboxSelection: true,
        autoHeight: true,
        width: 100,
        pinned: 'left',
        headerCheckboxSelection:true,
        cellRendererFramework:(params)=>{
            return params.data.image ?
                <Thumbnail source={params.data.image} size={"large"} alt={params.data._id} />:
                <Thumbnail alt={params.data._id} size={"large"} source={Noimage} />;
        }
    },{
        headerName: "Product details",field: "product_detail",resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true ,cellRendererFramework: productdetailsRenderer.bind(this, incellElement.bind(this))
    },
    {
        headerName: "Meta details",cellRendererFramework: metaRenderer ,field: "meta_detail", resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Markeplace details( Site, Status)", field: "martketplace_details",  resizable: true,cellRendererFramework: marketplaceDetailsRenderer, cellStyle: { 'white-space': 'normal' }, autoHeight: true
    }
] };

export const filterOptions = [
    {
        headerName: "Title",field: "title"
    },
    {
        headerName: "Inventory", field: "quantity"
    },
    {
        headerName: "SKU", field: "sku"
    },
    {
        headerName: "Profile", field: "profile_name"
    },
    {
        headerName: "eBay Item Id", field: "listing_id"
    },
    {
        headerName: "Tags", field: "tags"
    },
    {
        headerName: "Product type",field: "product_type"
    },
    {
        headerName: "Vendor",field: "vendor"
    },
    {
        headerName: "Variation attributes", field: "variant_attributes"
    },
    {
        headerName: "Status", field: "status", choices: productsStatus(), default_condition: 'equals'
    }
];

function productdetailsRenderer(incellElement, params){
    let { title, sku, quantity, price } = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        {title && <div className={"col-12"} >{title}</div>}
        {sku && <div className={"col-12"} style={{color:"grey"}}>SKU - {sku}</div>}
        <div className={"col-12"} style={{color:"grey"}}>
            <Stack vertical={false}>
                {price && <p>Price - {price} /</p>}
                <p onClick={(e) => {
                    incellElement('view_product', params.data);
                    e.preventDefault();
                }}><Tooltip content="View product"><Icon  source={ViewMajorMonotone}/></Tooltip></p>
            </Stack>
        </div>
        { quantity &&
        <div className={"col-12"} style={{color:"grey"}}>{quantity}</div>
        }
    </div>)
}


function metaRenderer(params){
    let { product_type, vendor, tags, variant_attribute, profile_name} = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        {
            product_type &&
            <div className={"col-12"} >Product type - {product_type}</div>
        }
        {vendor &&
        <div className={"col-12"} style={{color: "dimgrey"}}>Vendor - {vendor}</div>
        }
        {/*<div className={"col-12"} style={{color:"dimgrey"}}>Tags - {tags}</div>*/}
        {profile_name &&
        <div className={"col-12"} style={{color:"grey"}}>Profile - {profile_name}</div>
        }{
        variant_attribute &&
        <div className={"col-12"} style={{color:"dimgrey"}}>Attribute - {variant_attribute}</div>
    }
    </div>)
}

export function marketplaceDetailsRenderer(params){
    let { marketplace } = params.data;
    if(marketplace && !Array.isArray(marketplace)){
        let structurebadges = [];
        Object.keys(marketplace).map( marketplace_connected => {
            let specificDetails = marketplace[marketplace_connected];
            let { status, identifier, shop_name } = specificDetails;
            let labelBadge = [];
            let badgeStatus = "info";
            switch(status){
                case 'success' :
                    badgeStatus = "success";
                    labelBadge.push("Uploaded");
                    break;
                case 'error':
                    badgeStatus = "error";
                    labelBadge.push("Error");
                    break;
                case "ended":
                    badgeStatus = "info";
                    labelBadge.push("Ended");
                    break;
                default : break;
            }
            if(marketplace_connected) labelBadge =[...labelBadge, `${marketplace_connected}`];
            if(shop_name) labelBadge = [...labelBadge,`${shop_name}`];
            if(identifier) labelBadge =[...labelBadge, `${identifier}`];
            structurebadges = [...structurebadges, getBadgePolaris( labelBadge.join('-'), badgeStatus)]
        });
    }
    return getBadgePolaris("Not uploaded", "warning");
}


export function productsStatus(){
    return [
        {label:'Uploaded', value:'uploaded'},
        {label:'Not uploaded', value:'not_uploaded'},
        {label:'Ended', value:'ended'},
        {label:'Error', value:'error'}
    ];
}


export function extractValuesfromRequest(rows=[]){
    let modifiedRows = [];
    rows.forEach( row =>{
        let { source_product_id, main_image: image, marketplace, sku, tags, price, quantity, profile, variants, product_type, brand: vendor , title, listing_id, status : ebayProductStatus, variant_attributes, additional_images : image_array, container_id } = row;
        // let quantity = `${totalQuantityfromVariant(variants)}  in stock for ${Object.keys(variants).length} variants`;
        quantity = quantity ? `${quantity} in stock`: false;
        price = price ? price.toString(): "0";
        // let sku = variants[0]['sku'];
        // let price = variants[0]['price'];
        // let image = variants[0]['main_image'];
        // let tags = variants[0]['tags'];
        modifiedRows.push({
            source_product_id ,
            profile_name : profile && Object.values(profile)[0],
            title,
            tags,
            product_type,
            quantity,
            image,
            sku,
            container_id,
            price,
            image_array : [ image, ...(image_array && image_array.length? image_array:[])],
            variant_attribute : [...Object.values(variant_attributes)].join(),
            vendor,
            marketplace
        })
    });
    return modifiedRows;
}

export const selectedProductActions = [
    {label:'Upload product(s)', value:'amazon_upload_products', modaltext:'Do you want to proceed with uploading product(s) ?'},
    {label:'Match product(s)', value:'amazon_match_products', modaltext:'Do you want to proceed with matching product(s) from Amazon?'},
    {label:'Upload price(s)', value:'amazon_upload_price', modaltext:'Do you want to proceed with uploading price(s) ?'},
    {label:'Upload inventory(s)', value:'amazon_upload_inventory', modaltext:'Do you want to proceed with uploading inventory(s) ?'},
    {label:'Upload image(s)', value:'amazon_upload_image', modaltext:'Do you want to proceed with uploading image(s) ?'},
    {label:'Upload relationship(s)', value:'amazon_upload_relationship', modaltext:'Do you want to proceed with uploading relationship(s) ?'},
    {label:'Delete product(s)', value:'amazon_delete_product', modaltext:'Do you want to proceed with deleting product(s) ?'},
    {label:'Sync product from Shopify', value:'select_sync_from_shopify', modaltext:'Do you want to proceed with syncing product(s) from Shopify ?'},
];

export const pageSizeOptionProducts = [25,50,75];

export const filterCondition =  [
    {label: 'equals', value: "1"},
    {label: 'not equals', value: "2"},
    {label: 'contains', value: "3"},
    {label: 'does not contains', value: "4"},
    {label: 'starts with', value: "5"},
    {label: 'ends with', value: "6"}
];

export function amazonPageActions(actionFunction){
    return [
        {
            title: 'Amazon',
            accessibilityLabel: 'Amazon actions',
            actions: [
                {
                    content: 'Upload products',
                    accessibilityLabel: 'Upload products on Amazon',
                    onAction: actionFunction.bind(this, 'amazon_upload_products'),
                },
                {
                    content: 'Upload price',
                    accessibilityLabel: 'Upload price on Amazon',
                    onAction: actionFunction.bind(this, 'amazon_upload_price'),
                },
                {
                    content: 'Upload inventory',
                    accessibilityLabel: 'Upload inventory on Amazon',
                    onAction: actionFunction.bind(this, 'amazon_upload_inventory'),
                },
                {
                    content: 'Upload image',
                    accessibilityLabel: 'Upload image on Amazon',
                    onAction: actionFunction.bind(this, 'amazon_upload_image'),
                },
                {
                    content: 'Upload relationship',
                    accessibilityLabel: 'Upload relationship on Amazon',
                    onAction: actionFunction.bind(this, 'amazon_upload_relationship'),
                },
                {
                    content: 'Delete product',
                    accessibilityLabel: 'Delete product on Amazon',
                    onAction: actionFunction.bind(this, 'amazon_delete_product'),
                },
                {
                    content: 'Match products',
                    accessibilityLabel: 'Match product on Amazon',
                    onAction: actionFunction.bind(this, 'amazon_match_products'),
                },
            ],
        },
    ]
}

export const productViewtabs = [
    {
        id: 'details-product',
        content: 'Details',
        title: 'Details',
        accessibilityLabel: 'Details',
        panelID: 'details-content',
        type: 'details',
    },
    {
        id: 'description-product',
        content: 'Description',
        title: 'Description',
        panelID: 'description-content',
        type: 'description'
    },
    {
        id: 'specifications-product',
        content: 'Specifications',
        title: 'Specifications',
        panelID: 'specifications-product-content',
        type: 'specifications'
    },
    {
        id: 'variant-images-product',
        content: 'Variant Images',
        title: 'Variant Images',
        panelID: 'variant-images-content',
        type: 'variantimages'
    },
    {
        id: 'amazon-data-product',
        content: 'Amazon product(JSON)',
        title: 'Amazon product(JSON)',
        panelID: 'amazon-product-content',
        type: 'amazonproductdata'
    }
];

export function getProductViewTabsStructure(tab, productData, changeProductViewDetails){
    let tabType = productViewtabs.filter( (tabData, index) => index === tab);
    if(tabType.length){
        tabType = tabType[0]['type'];
        switch(tabType){
            case 'details':
                let  { title, vendor, product_type, tags, variant_attributes } = productData.details;
                return <Stack vertical={true}>
                    {
                        textField("Title", title, changeProductViewDetails.bind(this, 'details', 'title', false))
                    }
                    <Stack vertical={false} distribution={"fillEvenly"}>
                        {
                            textField("Vendor", vendor, changeProductViewDetails.bind(this, 'details', 'vendor', false))
                        }
                        {
                            textField("Product type", product_type, changeProductViewDetails.bind(this, 'details', 'product_type', false))
                        }
                    </Stack>
                    {
                        textField("Tags", tags, changeProductViewDetails.bind(this, 'details', 'tags', false))
                    }
                    { variant_attributes.length !==0  &&
                    textField("Variant attributes", variant_attributes.join(','), ()=>{}, "","", false, 'text', "","", false, true)
                    }
                </Stack>

            case 'specifications' :
                let  { variants, variant_attributes: attributes } =  productData.details;
                let barcodeAttribute = [];
                if( variants && variants.length && variants[0].hasOwnProperty('barcode')) barcodeAttribute = ['Barcode'];
                let headings = _.concat(['Product', 'Price', 'SKU Number', 'Net quantity'],barcodeAttribute, attributes);
                let columnTypes = headings.map( heading => 'text');
                let rows = variants.map( (variantObj, index) => {
                    let { main_image, source_variant_id, price, quantity, sku, barcode  } = variantObj;
                    main_image = main_image ? main_image: Noimage;
                    let singlerow = [
                        thumbnail(main_image, `${source_variant_id}`),
                        textField("", price, changeProductViewDetails.bind(this, "variants", "price", index ), "", "", false, "number", "$" ),
                        textField("", sku, changeProductViewDetails.bind(this, "variants", "sku", index ) ),
                        textField("", quantity, changeProductViewDetails.bind(this, "variants", "quantity", index ), "", "", false, "number" )
                    ];
                    if(barcode) singlerow.push( textField("", barcode, changeProductViewDetails.bind(this, "variants", "barcode", index ) ))
                    attributes.forEach(attri => {
                        singlerow.push( textField("", variantObj[attri], changeProductViewDetails.bind(this, "variants", attri, index ) ) );
                    });
                    return singlerow;
                });
                return <DataTable
                    columnContentTypes={columnTypes}
                    headings={ headings }
                    rows={ rows }
                />

            case 'description':
                let { long_description } = productData.details;
                return ckeditor(long_description, changeProductViewDetails.bind(this, 'details','long_description',false));

            case 'variantimages':
                let { image_array } = productData.details;
                return <Stack vertical={true} alignment={"center"}><div style={{paddingLeft : 150, paddingRight: 150}}>{crouselStructureFunction(image_array)}</div></Stack>

            case 'amazonproductdata' :
                let { amazon_product_json } = productData;
                if(amazon_product_json && Object.keys(amazon_product_json).length) return ReactJsonStructure(amazon_product_json);
                else return bannerPolaris("Amazon Product data",<p>Not available</p>, "info" )
            default : break;
        }
    }
}