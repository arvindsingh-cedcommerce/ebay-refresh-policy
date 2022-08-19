import {Icon, Stack, Tooltip} from "@shopify/polaris";
import React from "react";
import {DeleteMajorMonotone, EditMajorMonotone} from "@shopify/polaris-icons";

export const filterConditions = [
    {label: 'equals', value: "1"},
    {label: 'not equals', value: "2"},
    {label: 'contains', value: "3"},
    {label: 'does not contains', value: "4"},
    {label: 'starts with', value: "5"},
    {label: 'ends with', value: "6"}
];

export const filterConditionsforQuery = [
    { label: "Equals", value: "==" },
    { label: "Not Equals", value: "!=" },
    { label: "Contains", value: "%LIKE%" },
    { label: "Does Not Contains", value: "!%LIKE%" },
    { label: "Greater Than", value: ">" },
    { label: "Less Than", value: "<" },
    { label: "Greater Than Equal To", value: ">=" },
    { label: "Less Than Equal To", value: "<=" }
];

export const amazonsettingsObj = { templates: { title: '', inventory: '', category : '', price : ''  }, shopify_warehouse : [] };

export const pageSizeOptionProfile = [25,50,75];


export function gridPropColumns (incellElement = () =>{}) { return [
    {
        headerName: "Actions", field: "actions",
        autoHeight: true,
        width: 100,
        pinned: 'right',
        cellRendererFramework:actionRenderer.bind(this, incellElement.bind(this))
    },
    {
        headerName: "Name", field: "name",
        autoHeight: true,
        width: 200,
        pinned: 'left',
       /* headerCheckboxSelection:true,
        checkboxSelection: true,*/
    },{
        headerName: "Accounts connected",field: "accounts",resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true   , sortable:true
    },{
        headerName: "Query",field: "query",resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true   , sortable:true
    }
] };

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

export const filterOptions = [
    {
        headerName: "Name",field: "name"
    }
];

export function extractValuesfromRequest(rows=[], marketplace = "amazon"){
    let modifiedRows = [];
    rows.forEach( row =>{
        let amazonAccountconnected = 0;
        let { name, query, profile_id, settings } = row;
        if(settings && settings.hasOwnProperty(marketplace)) amazonAccountconnected = Object.keys(settings[marketplace]).length;
        modifiedRows = [ ...modifiedRows, { name, query: query.query, id : profile_id, profile_id: profile_id, accounts : `Amazon (${amazonAccountconnected})`}];
    });
    return modifiedRows;
}
