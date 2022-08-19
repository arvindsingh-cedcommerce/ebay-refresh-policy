import React from "react";
import {polarisIcon} from "../../../../../PolarisComponents/InfoGroups";
import {ViewMajorMonotone} from "@shopify/polaris-icons";
import {DataTable, Stack, Tooltip} from "@shopify/polaris";
import {json} from "../../../../../globalConstant/static-json";
import {ReactJsonStructure} from "../../../../../PolarisComponents/InputGroups";

export const pageSizeOptionFeeds = [25,50,75];
export const selectedFeedsActions = [
    {label:'Sync', value:'sync', modaltext:'Do you want to sync the feed(s) ?'},
    {label:'Delete', value:'delete', modaltext:'Do you want to delete feed(s) ?'},
];

export function gridPropColumns ( incellElement = () =>{}) { return [
    {
        headerName: "Id", field: "id",
        checkboxSelection: true,
        autoHeight: true,
        width: 100,
        pinned: 'left',
        headerCheckboxSelection:true,
    },
    {
        headerName: "Feed id",field: "feed_id",resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true , sortable:true
    },
    {
        headerName: "Status", field: "status", sortable:true, resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Type", field: "type",  resizable: true,sortable:true,  cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Created at", field: "created_at",  resizable: true,sortable:true,  cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Executed at", field: "executed_at",  resizable: true,sortable:true,  cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Feed", field: "feed",  resizable: true,sortable:true,  cellStyle: { 'white-space': 'normal' }, autoHeight: true, cellRendererFramework :actionRenderer.bind(this, 'feed_view', incellElement.bind(this)), width: 100
    },
    {
        headerName: "Response", field: "response",  resizable: true,sortable:true, cellRendererFramework :actionRenderer.bind(this, 'response_view', incellElement.bind(this)),  cellStyle: { 'white-space': 'normal' }, autoHeight: true, width: 100
    },
    {
        headerName: "Specifics", field: "specifics", cellRendererFramework: actionRenderer.bind(this, 'specifics', incellElement.bind(this)), width: 100,  resizable: true,sortable:true,  cellStyle: { 'white-space': 'normal' }, autoHeight: true
    }
] };

export const filterOptions = [
    {
        headerName: "Feed id",field: "feed_id"
    },
    {
        headerName: "Status", field: "status"
    },
    {
        headerName: "Type", field: "type"
    }
];

function actionRenderer(type, incellFunction, params){
    params = params.data;
    switch (type){
        case 'specifics': return <div onClick={incellFunction.bind(this, "specifics", params)}>
            <Tooltip content={'View'}>{polarisIcon(ViewMajorMonotone)}</Tooltip>
        </div>
        case 'response_view': return <div onClick={incellFunction.bind(this, "response_view", params)}>
            <Tooltip content={'View'}>{polarisIcon(ViewMajorMonotone)}</Tooltip>
        </div>
        case 'feed_view': return <div onClick={incellFunction.bind(this, "feed_view", params)}>
            <Tooltip content={'View'}>{polarisIcon(ViewMajorMonotone)}</Tooltip>
        </div>
        default : return [];
    }
}

export function extractValuesfromRequest(rows=[]){
    let modifiedRows = [];
    rows.forEach( row =>{
        let { _id: id ,feed_id , status, type, feed_created_date: created_at, feed_executed_date: executed_at, feed_file : feed, response_file : response, specifics  } = row;
        type = json.amazon_feed_type.filter(obj => obj.label === type);
        if(type.length) type = type[0]['value'];
        status = json.amazon_feed_status.filter(obj => obj.label === status);
        if(status.length) status = status[0]['value'];
        modifiedRows = [ ...modifiedRows, { id, feed_id, status, type, created_at, executed_at, feed, response, specifics }];
    });
    return modifiedRows;
}

export function getModalStructure(type = '', data){
    let {  feed, response, specifics } = data;
    switch(type){
        case 'specifics':
            if(!specifics) return <p>No specifics to view</p>;
            let headings = Object.keys(specifics);
            let { type, marketplace, shop_id } = specifics;
            let row = [];
            if(headings.indexOf("ids") > -1){
                let idsStruct = [];
                Object.values(specifics.ids).map(value => {
                    idsStruct = [...idsStruct, <p>{value.toString()}</p>];
                });
                row.push(<Stack vertical={false}>{idsStruct}</Stack>);
            }else{
                row.push("");
            }
            row.push(type ? type : '');
            row.push(marketplace ? marketplace : '');
            row.push(shop_id ? shop_id : '');
            return  <DataTable
            columnContentTypes={[
                'text',
                'numeric',
                'numeric',
                'text',
            ]}
            headings={[
                'IDS',
                'Type',
                'Markteplace',
                'Shop Id',
            ]}
            rows={[row]}
        />;
        case 'response_view': return response === "" ? <p>No response to view</p> : ReactJsonStructure(response);
        case 'feed_view': return feed === "" ? <p>No feed to view</p>: <p>{feed}</p>;
        default : return [];
    }
}

export function getModalActions(type, data, action){
    switch(type){
        case 'sync_feed' : return { content : 'Sync', onAction: action.bind(this, type, data)}
        case 'delete_feed' : return { content : 'Sync', onAction: action.bind(this, type, data)}
        default : return false;
    }
}

export function amazonFeedActions(action){
    return [
        {
            title: 'Amazon',
            accessibilityLabel: 'Amazon actions',
            actions: [
                {
                    content: 'Sync feed',
                    accessibilityLabel: 'Sync feeds on Amazon',
                    onAction: action.bind(this, 'amazon_sync_feeds_bulk'),
                },
                {
                    content: 'Delete feed',
                    accessibilityLabel: 'Delete feed on Amazon',
                    onAction: action.bind(this, 'amazon_delete_feeds_bulk'),
                },
            ],
        },
    ]
}

