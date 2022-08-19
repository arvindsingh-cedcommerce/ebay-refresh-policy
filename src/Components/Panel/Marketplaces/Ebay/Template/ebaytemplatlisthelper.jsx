import {Icon, Stack, Tooltip} from "@shopify/polaris";
import {DeleteMajorMonotone, EditMajorMonotone, MinusMinor} from "@shopify/polaris-icons";
import React from "react";
import {getSiteName} from "../../../Accounts/accountsHelper";
import {polarisIcon} from "../../../../../PolarisComponents/InfoGroups";

export function gridPropColumns ( incellElement = () =>{}) { return [
    {
        headerName: "Actions", field: "actions",
        autoHeight: true,
        width: 50,
        pinned: 'right',
        cellRendererFramework:actionRenderer.bind(this, incellElement.bind(this))
    },
    {
        headerName: "Name",field: "name" , cellRendererFramework:nameRenderer.bind(this, incellElement.bind(this)) ,resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true , filter:'agTextColumnFilter', sortable:true
    },
    {
        headerName: "Account",field: "account" , cellRendererFramework:accountRenderer.bind(this, incellElement.bind(this)) ,resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true , sortable:true
    }
] };

export function extractValuesfromRequest(rows=[]){
    let modifiedRows = [];
    rows.forEach( row =>{
        let { _id, title, type, data } = row;
        modifiedRows.push({
            id: _id,
            name: title,
            type,
            site: data && data.site_specific ? getSiteName(data.site_specific):'',
        });
    });
    return modifiedRows;
}

function accountRenderer(func, params){
    let { data } = params;
    let { site } = data;
    return site === ""? polarisIcon(MinusMinor): site;
}

export function getTypeoftabs(tab){
    return templatetabs[tab]['type'];
}

function actionRenderer(func, params){
    let { data } = params;
    return (
        <Stack vertical={false} alignment={"center"} distribution={"fill"} >
            <div onClick={(e) => {
                func('edit', data); e.preventDefault();
            }} >
                <Tooltip content={"Edit"}>
            <Icon source={EditMajorMonotone} />
                </Tooltip>
            </div>
            <div onClick={(e) => {
                func('delete', data); e.preventDefault();
            }}>
                <Tooltip content={"Delete"}>
            <Icon source={DeleteMajorMonotone} />
                </Tooltip>
            </div>
        </Stack>
    );
}

function nameRenderer(func, params){
    let { data } = params;
    let { name, site, type } = data;
    let modifiedName = '';
    if(type === 'category') modifiedName = `${name}`;
    else modifiedName = `${name}`;
    return (
       <p>{modifiedName}</p>
    );
}

export const templatetabs = [
    {
        id: 'all-template',
        content: 'All',
        title: 'All',
        accessibilityLabel: 'All templates',
        panelID: 'all-template-content',
        type: 'all',
    },
    {
        id: 'pricing_template',
        content: 'Pricing',
        title: 'Pricing',
        panelID: 'pricing-template-content',
        type: 'price',
    },
    {
        id: 'inventory-template',
        content: 'Inventory',
        title: 'Inventory',
        panelID: 'inventory-template-content',
        type: 'inventory',
    },
    {
        id: 'category-template',
        content: 'Category',
        title: 'Category',
        panelID: 'category-template-content',
        type: 'category',
    },
    {
        id: 'title-template',
        content: 'Title',
        title: 'Title',
        panelID: 'title-template-content',
        type: 'title',
    }
];

export const pageSizeOptionTemplate = [25,50,75];

export const filterCondition =  [
    {label: 'equals', value: "1"},
    {label: 'not equals', value: "2"},
    {label: 'contains', value: "3"},
    {label: 'does not contains', value: "4"},
    {label: 'starts with', value: "5"},
    {label: 'ends with', value: "6"}
];