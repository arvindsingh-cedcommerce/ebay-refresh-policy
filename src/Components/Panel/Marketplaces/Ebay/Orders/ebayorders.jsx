import React, {Component} from 'react';
import {Page} from "@shopify/polaris";
import {
    extractValuesfromRequest,
    filterCondition, filterOptions, getModalStructure, getTabSelectedFilter,
    gridPropColumns, orderlistTabs,
    pageSizeOptionProducts,
    selectedOrderActions
} from "./ebayorderhelper";
import Grid from "../../../../../Subcomponents/Aggrid/grid";

import {getpaginationInfo} from "../../../../../services/helperFunction";
import {fetchOrders, getorders} from "../../../../../Apirequest/ebayApirequest/ordersApi";
import {prepareChoiceoption} from "../../../../../Subcomponents/Aggrid/gridHelper";
import {modalPolaris} from "../../../../../PolarisComponents/ModalGroups";
import {getMarketplaceConnectedAccount} from "../Template/TemplateBody/TemplateHelpers/categorytemplateHelper";
import {getFilterforRequest} from "../Products/ebayproducthelper";
import {notify} from "../../../../../services/notify";


let gridApi = '';
class Ebayorders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: gridPropColumns(this.incellElement.bind(this)),
            rows: [],
            fetch_orders:{
                accounts_options: [],
                days: 1,
                shop_id: '',
                order_ids : '',
                date_modified_from: '',
                date_modified_to: '',
                date_created_from: '',
                date_created_to: '',
            },
            add_filters_fetch_orders : {
              add_more_filters : false,
                order_ids : false,
                date_modified: false,
                date_created: false,
            },
            loaders:{
                fetch_orders : false
            },
            tabs: orderlistTabs,
            selectedTab:0,
            selectedRows: [],
            selectedActions: selectedOrderActions,
            actionSelected: '',
            paginationProps:{
                pageSizeOptions:pageSizeOptionProducts,
                activePage:1,
                pageSize: pageSizeOptionProducts[0],
                pages: 0, totalrecords: 0
            },
            modal:{
                open:'',
                modal_type: '',
                title: '',
                data : {}
            },
            tabfilters: {},
            filtersProps :{ attributeoptions : [], filters:[] , filterCondition: filterCondition},
        }
    }

    loaderHandler(type, value = true){
        let { loaders } = this.state;
        loaders[type] = value;
        this.setState({ loaders });
    }

    incellElement(field, data){
        switch(field){
            case 'view_order':
                let { source_order_id } = data;
                this.redirect(`/panel/ebay/vieworders?id=${source_order_id}`);
                break;
            default :  break;
        }
    }

    componentDidMount() {
        this.tabSelected(0);
        this.prepareFilters();
        this.getConnectedeBayAccounts();
    }

    async getConnectedeBayAccounts(){
        let { fetch_orders } = this.state;
        fetch_orders.accounts_options = [ ...await getMarketplaceConnectedAccount('ebay', ['user_id'])];
        this.setState({ fetch_orders });
    }

    redirect(url){
        this.props.history.push(url);
    }

    prepareFilters(){
        let {  filtersProps } = this.state;
        filtersProps['attributeoptions'] = [...prepareChoiceoption(filterOptions, 'headerName', "field")];
        this.setState({filtersProps});
    }

    async fetchOrders() {
        this.loaderHandler("fetch_orders", true);
        let {fetch_orders, add_filters_fetch_orders: filters_used} = this.state;
        let { success, message } = await fetchOrders({fetch_orders, filters_used});
        if(success) notify.success(message);
        else notify.error(message);
        this.loaderHandler("fetch_orders", false);
        this.modalHandler(false, 'fetch_orders');
    }

    tabSelected(tabs){
        let tabfilters ={};
        let tabselected = orderlistTabs.filter((tabOrder, tabIndex) => tabIndex === tabs);
        if(tabselected.length) {
            tabselected = tabselected[0]['type'];
            tabfilters = {...getTabSelectedFilter(tabselected)};
        }
        this.setState({ selectedTab : tabs, tabfilters }, ()=>{
            this.getOrders();
        });
    }
    async getOrders(){
        this.toggleOverLay(true);
        let { paginationProps, tabfilters, filtersProps } = this.state;
        let { filters } = filtersProps;
        let {  pageSize : count, activePage,  } = paginationProps;
        let ordersRequest = await getorders({count, activePage, markteplace: 'ebay',...tabfilters, ...getFilterforRequest(filters)});
        let { success, data } = ordersRequest;
        if(success){
            let { rows, count: totalRecords } = data;
            let paginationInformation = getpaginationInfo( totalRecords, count);
            paginationProps = { ...paginationProps, ...paginationInformation};
            let extractRowData = extractValuesfromRequest(rows);
            this.setState({rows: [...extractRowData], paginationProps});
        }
        this.toggleOverLay(false);
    }

    filterData(componentFilters){
        // console.log(componentFilters);
        let { filtersProps } = this.state;
        filtersProps['filters'] = [...componentFilters];
        // this.props.filterUpdated([...componentFilters]);
        this.setState({filtersProps},()=>{
        this.getOrders();
        });
    }

    toggleOverLay(showhide){
        if(gridApi!=='') {
            if (showhide) gridApi.showLoadingOverlay();
            else gridApi.hideOverlay();
        }
    }

    cellClickedEvent(colDef, data){
        let { field } = colDef;
        console.log('Cell Clicked', field);
        console.log('Cell Clicked', data);
    }

    getGridApi(api){
        gridApi = api;
    }

    async onSelectedAction(action){
        console.log(action);
    }

    onPaginationChange(paginationProps){
        this.setState({ paginationProps },()=>{this.getOrders();});
    }

    getSelectedRows(selectedRows){
        this.setState({selectedRows});
    }

    getModalInternalStructure(modal_type) {
        switch (modal_type) {
            case 'fetch_orders':
                let {fetch_orders, add_filters_fetch_orders} = this.state;
                return getModalStructure(modal_type, {...fetch_orders, add_filters_fetch_orders}, this.modalChangeHandler.bind(this));
            default : return [];
        }
    }

    modalChangeHandler(type, field, value){
        switch(type){
            case 'fetch_orders':
                let { fetch_orders } = this.state;
                fetch_orders[field] = value;
                this.setState({ fetch_orders });
                break
            case 'add_filters_fetch_orders':
                let { add_filters_fetch_orders } = this.state;
                add_filters_fetch_orders[field] = value;
                this.setState({ add_filters_fetch_orders });
                break
            default: break;
        }
    }

    modalHandler( open = true, modal_type = ''){
        let { modal } = this.state;
        modal.open = open;
        modal.modal_type = open ? modal_type:'';
        switch(modal_type) {
            case 'fetch_orders':
                modal.title = open ? 'Fetch order(s) eBay' : '';
                break;
            default : break;
        }
        if(!open) modal.data = {};
        this.setState({ modal });
    }

    render() {
        let { columns, rows, selectedRows, paginationProps, selectedActions, filtersProps, tabs, selectedTab, modal, fetch_orders} = this.state;
        let { open, modal_type, title } = modal;
        let structure = this.getModalInternalStructure(modal_type);
        return (
           <Page title={'Orders'}
                 primaryAction={{content:'Fetch order(s)', onAction: this.modalHandler.bind(this, true, 'fetch_orders')}}
                 fullWidth={true}>
               <Grid
                   tag={'Order(s)'}
                   showTabs={true}
                   tabs={tabs}
                   selectedTab={selectedTab}
                   tabSelected={this.tabSelected.bind(this)}
                   columns={columns}
                   rows={rows}
                   showFilters
                   customRowHeight={150}
                   filterData={this.filterData.bind(this)}
                   filtersProps={filtersProps}
                   selectedActions={selectedActions}
                   onSelectAction={this.onSelectedAction.bind(this)}
                   getGridApi={this.getGridApi.bind(this)}
                   paginationProps={paginationProps}
                   onpaginationChange={this.onPaginationChange.bind(this)}
                   suppressSizeToFit={true}
                   suppressMovableColumns={true}
                   suppressRowClickSelection={true}
                   enableCellTextSelection={true}
                   rowSelection={"multiple"}
                   selectedRows={selectedRows}
                   cellClickedEvent={this.cellClickedEvent.bind(this)}
                   rowSelected={this.getSelectedRows.bind(this)}
               />
               { modal_type === 'fetch_orders' &&
               modalPolaris(title, open, this.modalHandler.bind(this, false, modal_type), { content: 'Fetch order(s)', onAction: this.fetchOrders.bind(this), disabled : fetch_orders.shop_id === ''}, structure)
               }
           </Page>
        );
    }
}

export default Ebayorders;