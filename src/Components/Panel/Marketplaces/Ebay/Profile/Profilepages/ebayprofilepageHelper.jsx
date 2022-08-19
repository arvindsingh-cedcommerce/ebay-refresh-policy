import {Thumbnail} from "@shopify/polaris";
import React from "react";

const Noimage = require("../../../../../../assets/notfound.png");

export function gridPropColumns () { return [
    {
        headerName: "Image", field: "image",
        autoHeight: true,
        width: 100,
        pinned: 'left',
        cellRendererFramework:(params)=>{
            return params.data.image ?
                <Thumbnail source={params.data.image} size={"large"} alt={params.data.title} />:
                <Thumbnail alt={params.data.title} size={"large"} source={Noimage} />;
        }
    },{
        headerName: "Product details",field: "product_detail",resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true ,cellRendererFramework: productdetailsRenderer.bind(this)  , sortable:true
    },
    {
        headerName: "Other details",cellRendererFramework: OtherRenderer ,field: "other_details", sortable:true, resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
] };

function productdetailsRenderer(params){
    let { title, vendor, product_type, tags } = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"} >{title}</div>
        <div className={"col-12"} style={{color:"grey"}}>Vendor - {vendor}</div>
        <div className={"col-12"} style={{color:"grey"}}>Product type - {product_type}</div>
        <div className={"col-12"} style={{color:"grey"}}>Tags - {tags}</div>
    </div>)
}

function OtherRenderer(params){
    let { price, sku, variant_attribute } = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"} >Price - {price}</div>
        <div className={"col-12"} style={{color:"grey"}}>SKU - {sku}</div>
        <div className={"col-12"} style={{color:"grey"}}>Attributes - {variant_attribute}</div>

    </div>)
}

export function prepareShopifywarehouseOptions(data){
    let options = [];
    data.forEach(site => {
        let { country, shop_url, warehouses } = site;
        warehouses.forEach(warehouse => {
            let  { name,  _id }= warehouse;
           options = [...options, { label : name, value: _id.toString(), helpText: `${shop_url} (${country})`}];
        });
    });
    return options;
}