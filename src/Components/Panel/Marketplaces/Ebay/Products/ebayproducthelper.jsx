import React from "react";
import _ from 'lodash';
import {DataTable, Icon, Stack, Thumbnail, Tooltip} from "@shopify/polaris";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {ViewMajorMonotone} from "@shopify/polaris-icons";
import {ckeditor, ReactJsonStructure, textField} from "../../../../../PolarisComponents/InputGroups";
import {bannerPolaris, thumbnail} from "../../../../../PolarisComponents/InfoGroups";
import {marketplaceDetailsRenderer} from "../../Amazon/Products/amazonproductshelper";

const Noimage = require("../../../../../assets/notfound.png");


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
        headerName: "Markeplace details( Site, Status)", field: "martketplace_details",  resizable: true, cellRendererFramework: marketplaceDetailsRenderer, cellStyle: { 'white-space': 'normal' }, autoHeight: true
    }
] };

export const producttabs = [
    {
        id: 'all-products',
        content: 'All',
        accessibilityLabel: 'All products',
        panelID: 'all-products-content',
    },
    {
        id: 'uploaded-products',
        content: 'Uploaded',
        panelID: 'uploaded-products-content',
    },
    {
        id: 'not-uploaded-products',
        content: 'Not uploaded',
        panelID: 'not-uploaded-products-content',
    },
    {
        id: 'ended-products',
        content: 'Ended',
        panelID: 'ended-products-content',
    },
    {
        id: 'error-products',
        content: 'Error',
        panelID: 'error-products-content',
    }
];

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

export function productsStatus(){
    return [
        {label:'Uploaded', value:'uploaded'},
        {label:'Not uploaded', value:'not_uploaded'},
        {label:'Ended', value:'ended'},
        {label:'Error', value:'error'}
    ];
}

function productdetailsRenderer(incellElement, params){
    let { title, sku, quantity, price } = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"} >{title}</div>
        {sku && <div className={"col-12"} style={{color: "grey"}}>SKU - {sku}</div>}
        <div className={"col-12"} style={{color:"grey"}}>
            <Stack vertical={false}>
                {price &&
            <p>Price - {price} /</p>
                }

            <p onClick={(e) => {
                incellElement('view_product', params.data);
                e.preventDefault();
            }}><Tooltip content="View product"><Icon  source={ViewMajorMonotone}/></Tooltip></p>
            </Stack>
        </div>
        <div className={"col-12"} style={{color:"grey"}}>{quantity}</div>
    </div>)
}

function metaRenderer(params){
    let { product_type, vendor, tags, variant_attribute, profile} = params.data;
    let profile_name = false;
    if(profile){
        profile_name = Object.values(profile)[0];
    }
    // profile_name = profile_name ? profile_name.profile_name: false;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        {product_type &&
            <div className={"col-12"} >Product type - {product_type}</div>
        }
        { vendor &&
        <div className={"col-12"} style={{color:"dimgrey"}}>Vendor - {vendor}</div>
        }
        {/*<div className={"col-12"} style={{color:"dimgrey"}}>Tags - {tags}</div>*/}
        {profile_name &&
            <div className={"col-12"} style={{color:"grey"}}>Profile - {profile_name}</div>
        }
        { variant_attribute &&
        <div className={"col-12"} style={{color:"dimgrey"}}>Attribute - {variant_attribute}</div>
        }
    </div>)
}

// function marketplaceDetailsRenderer(params){
//     let { ebay_item_id, ebay_product_status} = params.data;
//     return(
//
//             <table width={"100%"} border={1}>
//                 <tbody>
//                 <tr>
//                     <td>US</td>
//                     <td>
//                         <div className={"row w-100"} style={{lineHeight: 1.8}}>
//                             <div className={"col-12"} >{ebay_product_status} - {ebay_item_id}</div>
//
//                         </div>
//                     </td>
//                 </tr>
//                 </tbody>
//             </table>
//       );
// }

export const selectedProductActions = [
    {label:'Upload product(s)', value:'upload_product', modaltext:'Do you want to proceed with uploading product(s) ?'},
    {label:'Sync product from Shopify', value:'select_sync_from_shopify', modaltext:'Do you want to proceed with syncing product(s) from Shopify ?'},
];

// export function extractValuesfromRequest(rows=[]){
//     let modifiedRows = [];
//     rows.forEach( row =>{
//         let {  profile_name, variants, details, listing_id, status : ebayProductStatus, variant_attribute } = row;
//         let { source_product_id, product_type, title, vendor, additional_images : image_array } = details;
//         let quantity = `${totalQuantityfromVariant(variants)}  in stock for ${Object.keys(variants).length} variants`;
//         let sku = variants[0]['sku'];
//         let price = variants[0]['price'];
//         let image = variants[0]['main_image'];
//         let tags = variants[0]['tags'];
//         modifiedRows.push({
//             source_product_id ,
//             profile_name,
//             title,
//             tags,
//             product_type,
//             quantity,
//             image,
//             sku,
//             price,
//             image_array : [ ...Object.values(image_array)],
//             variant_attribute : [...Object.values(variant_attribute)].join(),
//             vendor,
//             ebay_item_id: listing_id,
//             ebay_product_status : ebayProductStatus,
//         })
//     });
//     return modifiedRows;
// }

export function extractValuesfromRequest(rows=[]){
    let modifiedRows = [];
    rows.forEach( row =>{
        let { source_product_id, main_image: image, marketplace, sku, tags, price, quantity, profile, variants, product_type, brand: vendor, title, listing_id, status : ebayProductStatus, variant_attributes, additional_images : image_array, container_id } = row;
        // let quantity = `${totalQuantityfromVariant(variants)}  in stock for ${Object.keys(variants).length} variants`;
        quantity = quantity ? `${quantity} in stock`: false;
        price = price ? price.toString(): "0";
        // let sku = variants[0]['sku'];
        // let price = variants[0]['price'];
        // let image = variants[0]['main_image'];
        // let tags = variants[0]['tags'];
        modifiedRows.push({
            source_product_id ,
            profile,
            title,
            tags,
            product_type,
            quantity,
            image,
            sku,
            container_id,
            price,
            image_array : [ image, ...(image_array && image_array.length? image_array:[])],
            variant_attribute : variant_attributes && [...Object.values(variant_attributes)]?.join(),
            vendor,
            marketplace,
        })
    });
    return modifiedRows;
}


export function totalQuantityfromVariant(variants =[]){
    let quantity = 0;
    Object.keys(variants).map(variantKey =>{
        let { quantity : quantityofVariant } = variants[variantKey];
        quantity += quantityofVariant;
        return true;
    });
    return quantity;
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
        id: 'ebay-data-product',
        content: 'Ebay product(JSON)',
        title: 'Ebay product(JSON)',
        panelID: 'ebay-product-content',
        type: 'ebayproductdata'
    }
];

export function extractVariantInfo(variants =[], variantAttributes = []){
    let variantInfo = [];
    variants.forEach((variantObj) => {
        let { price, quantity, sku, source_variant_id, barcode, main_image } = variantObj;
       let preparedObj = {
           price , quantity, sku, source_variant_id, main_image
       };
       if(barcode) preparedObj = { ...preparedObj, barcode };
       variantAttributes.forEach(attribute => {
           preparedObj[attribute] = variantObj.hasOwnProperty(attribute)? variantObj[attribute] :'';
       });
       variantInfo = [...variantInfo, {...preparedObj}];
    });
    return variantInfo;
}

export function crouselStructureFunction(imageArray = [])
{
    let preparedCrousel =[];

    if(imageArray && imageArray.length){
        imageArray.forEach((src, position) => {
            if(src) {
                preparedCrousel.push(
                    <div key={`image-${position}`}  >
                        <img src={src} alt={`additional-${position}`} style={{width:"50%"}}/>
                    </div>
                )
            }else{
                preparedCrousel.push(
                    <div key={`No-image-modal${position}`}>
                        <img src={Noimage} alt={'Not found'}  style={{width:"70%"}} />
                        <p className="legend">No images found</p>
                    </div>
                )
            }
        });

    }else{
        preparedCrousel.push(
            <div key={'No-image-modal'}>
                <img src={Noimage} alt={'Not found'}  style={{width:"70%"}}/>
                <p className="legend">No images found</p>
            </div>
        )
    }
    return <div style={{padding:10}}><Carousel showArrows={true}>{preparedCrousel}</Carousel></div>;
}
export const pageSizeOptionProducts = [25,50,75];

export const filterCondition =  [
    {label: 'equals', value: "1"},
    {label: 'not equals', value: "2"},
    {label: 'contains', value: "3"},
    {label: 'does not contains', value: "4"},
    {label: 'starts with', value: "5"},
    {label: 'ends with', value: "6"}
];

export function ebayPageActions(actionFunction){
    return [
        {
            title: 'Shopify',
            accessibilityLabel: 'Shopify actions',
            actions: [
                {
                    content: 'Import products',
                    accessibilityLabel: 'Import products from Shopify',
                    onAction: actionFunction.bind(this, 'shopify_import'),
                },
            ],
        },
    ]
}

export function getFilterforRequest(filters = []){
    let tempObj = {};
    filters.forEach(filter => {
        tempObj[`filter[${filter['attribute']}][${filter['condition']}]`] = filter['value'];
    });
    return tempObj;
}

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

            case 'ebayproductdata' :
                let { ebay_product_json } = productData;
                if(ebay_product_json && Object.keys(ebay_product_json).length) return ReactJsonStructure(ebay_product_json);
                else return bannerPolaris("eBay Product data",<p>Not available</p>, "info" )
            default : break;
        }
    }
}