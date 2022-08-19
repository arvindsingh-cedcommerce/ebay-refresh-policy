import React, {Component} from 'react';
import {Page} from "@shopify/polaris";
import {prepareChoiceoption} from "../../../../../Subcomponents/Aggrid/gridHelper";
import {
    gridPropColumns,
    pageSizeOptionFeeds,
    selectedFeedsActions,
    filterOptions,
    extractValuesfromRequest, getModalStructure, amazonFeedActions
} from "./amazonfeedsHelper";
import {filterCondition} from "../Products/amazonproductshelper";
import Grid from "../../../../../Subcomponents/Aggrid/grid";
import {
    deleteFeed,
    deletefeedbulk,
    getallfeeds,
    syncFeed,
    syncfeedbulk
} from "../../../../../Apirequest/amazonApirequest/feedsApi";
import {getpaginationInfo} from "../../../../../services/helperFunction";
import {modalPolaris} from "../../../../../PolarisComponents/ModalGroups";
import { notify } from "../../../../../services/notify";
let gridApi = '';

class Amazonfeeds extends Component {

    constructor(props) {
        super(props);
        this.state = {
          feeds : [],
          columns: gridPropColumns(this.incellElement.bind(this)),
          rows: [],
          selectedRows: [],
          selectedActions: selectedFeedsActions,
          actionSelected: '',
            modal : {
              open : false, title: "", type : "", data : {}
            },
          paginationProps: {
             pageSizeOptions:pageSizeOptionFeeds,
             activePage:1,
             pageSize: pageSizeOptionFeeds[0],
             pages: 0, totalrecords: 0
            },
          filtersProps :{ attributeoptions : [], filters: [] , filterCondition: filterCondition},
        };
    }

    componentDidMount() {
        this.prepareFilters();
        this.getFeeds();
    }

    async getFeeds(){
        this.toggleOverLay(true);
        let { paginationProps, filtersProps } = this.state;
        let { filters } = filtersProps;
        let {  pageSize : count, activePage } = paginationProps;
        let { success, data} = await getallfeeds({ count, activePage, filters, marketplace : 'amazon' });
        if(success) {
            let {rows, count: totalRecords} = data;
            let paginationInformation = getpaginationInfo( totalRecords, count);
            paginationProps = { ...paginationProps, ...paginationInformation};
            let extractRowData = extractValuesfromRequest(rows)
            this.setState({rows: [...extractRowData], paginationProps});
        }
        this.toggleOverLay(false);
    }
    onPaginationChange(paginationProps){
        this.setState({ paginationProps },()=>{this.getFeeds();});
    }

    prepareFilters(){
        let {  filtersProps } = this.state;
        filtersProps['attributeoptions'] = [...prepareChoiceoption(filterOptions, 'headerName', "field")];
        this.setState({filtersProps});
    }

    incellElement(field, data){
       switch (field){
           case 'feed_view':
               this.handleModal(true, { title : 'Feed view', type : field, data })
               break;
           case 'response_view':
               this.handleModal(true, { title : 'Response view', type : field, data })
               break;
           case 'specifics':
               this.handleModal(true, { title : 'Specifics view', type : field, data })
               break;
           default : break;
       }
    }

    redirect(url){
        this.props.history.push(url);
    }

    toggleOverLay(showhide){
        if(gridApi!=='') {
            if (showhide) gridApi.showLoadingOverlay();
            else gridApi.hideOverlay();
        }
    }

    getSelectedRows(selectedRows){
        this.setState({selectedRows});
    }

    cellClickedEvent(colDef, data){
        let { field } = colDef;
        console.log('Cell Clicked', field);
        console.log('Cell Clicked', data);
    }

    async onSelectedAction(action){
        let { selectedRows } = this.state;
        switch(action){
            case 'sync' :
                let {success : successSyncFeed, message: syncFeedMessage } = await syncFeed({ feeds : selectedRows });
                if(successSyncFeed) notify.success(syncFeedMessage);
                else notify.error(syncFeedMessage);
                break;
            case 'delete' :
                let {success: successDeleteFeed, message : deleteFeedMessage } = await deleteFeed({ feeds : selectedRows });
                if(successDeleteFeed) notify.success(deleteFeedMessage);
                else notify.error(deleteFeedMessage);
                break;
            default :  break;
        }
    }

    filterData(componentFilters){
        // console.log(componentFilters);
        let { filtersProps } = this.state;
        filtersProps['filters'] = [...componentFilters];
        this.props.filterUpdated([...componentFilters]);
        // this.setState({filtersProps},()=>{
        // this.getProducts();
        // });
    }

    async pageActions(action){
        switch(action){
            case 'amazon_sync_feeds_bulk': await syncfeedbulk();
                break;
            case 'amazon_delete_feeds_bulk': await deletefeedbulk();
                break;
            default : break;
        }
    }

    getGridApi(api){
        gridApi = api;
    }

    async modalActions(type, data){
        // let { feed_id } = data;
        // console.log(feed_id);

    }

    handleModal(open, data){
        let { modal } = this.state;
        modal.open = open;
        modal.title = open?data.title: '';
        modal.type = open? data.type: '';
        modal.data = open? data.data : {};
        this.setState({ modal });
    }

    render() {
        let { columns, rows, selectedRows, paginationProps, selectedActions, filtersProps, modal } = this.state;
        let { open, title, type, data } = modal;
        let modalAction = false;
        let modalstructure = getModalStructure(type, data);
        return (
            <Page fullWidth={true} title={"Feeds"}
            actionGroups={amazonFeedActions(this.pageActions.bind(this))}
            >
                <Grid
                    tag={'Feed(s)'}
                    columns={columns}
                    rows={rows}
                    showFilters
                    filterData={this.filterData.bind(this)}
                    filtersProps={filtersProps}
                    selectedActions={selectedActions}
                    onSelectAction={this.onSelectedAction.bind(this)}
                    getGridApi={this.getGridApi.bind(this)}
                    paginationProps={paginationProps}
                    onpaginationChange={this.onPaginationChange.bind(this)}
                    suppressMovableColumns={true}
                    suppressRowClickSelection={true}
                    enableCellTextSelection={true}
                    rowSelection={"multiple"}
                    selectedRows={selectedRows}
                    cellClickedEvent={this.cellClickedEvent.bind(this)}
                    rowSelected={this.getSelectedRows.bind(this)}
                />
                {
                    modalPolaris(title, open, this.handleModal.bind(this, false), modalAction, modalstructure )
                }
            </Page>
        );
    }
}

export default Amazonfeeds;