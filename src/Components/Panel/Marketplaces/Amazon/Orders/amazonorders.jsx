import React, {Component} from 'react';
import {Page} from "@shopify/polaris";
import {prepareChoiceoption} from "../../../../../Subcomponents/Aggrid/gridHelper";
import {getpaginationInfo} from "../../../../../services/helperFunction";
import {
    extractValuesfromRequest,
    filterCondition,
    filterOptions, getModalStructure, getTabSelectedFilter,
    gridPropColumns, orderlistTabs, ordersStatus,
    pageSizeOptionProducts,
    selectedOrderActions
} from "./amazonorderhelper";
import {
    createorderonShopify,
    fetchOrders,
    getorders,
    shiporderonAmazon, syncorderonAmazon
} from "../../../../../Apirequest/amazonApirequest/ordersApi";
import Grid from "../../../../../Subcomponents/Aggrid/grid";
import {modalPolaris} from "../../../../../PolarisComponents/ModalGroups";
import {notify} from "../../../../../services/notify";
import {getMarketplaceConnectedAccount} from "../../Ebay/Template/TemplateBody/TemplateHelpers/categorytemplateHelper";
import {getFilterforRequest} from "../../Ebay/Products/ebayproducthelper";

let gridApi = '';
class Amazonorders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: gridPropColumns(this.incellElement.bind(this)),
            rows: [],
            selectedRows: [],
            tabs: orderlistTabs,
            selectedTab:0,
            selectedActions: selectedOrderActions,
            actionSelected: '',
            fetch_orders:{
                buyer_email : '',
                order_id : '',
                shop_id : '',
                accounts_options: [],
                status: '',
                status_options: ordersStatus(),
                created_after : '',
                limit : '',
            },
            modal:{
                open:'',
                modal_type: '',
                title: '',
                data : {}
            },
            paginationProps:{
                pageSizeOptions:pageSizeOptionProducts,
                activePage:1,
                pageSize: pageSizeOptionProducts[0],
                pages: 0, totalrecords: 0
            },
            filtersProps :{ attributeoptions : [], filters:[] , filterCondition: filterCondition},
        }
    }


    incellElement(field, data){
        switch(field){
            case 'marketplace_details':
                let { modal } = this.state;
                modal.data = { ...data};
                this.setState({ modal }, () => {
                    this.modalHandler(true, 'marketplace_status');
                });
                break;
            case 'shopify_status':
                let { modal : modalShopify } = this.state;
                modalShopify.data = { ...data};
                this.setState({ modal : modalShopify }, () => {
                    this.modalHandler(true, 'shopify_status');
                });
                break;
            case 'view_order':
                let { source_order_id, account_id } = data;
                this.redirect(`/panel/amazon/orderview?region=${account_id.toLowerCase()}&id=${source_order_id}`);
                break;
            default: break;
        }
    }

    redirect(url){
        this.props.history.push(url);
    }

    componentDidMount() {
        this.tabSelected(0);
        this.prepareFilters();
        this.getConnectedAmazonAccounts();
    }

    tabSelected(tabs){
        let tabfilters ={};
        let tabselected = orderlistTabs.filter((tabOrder, tabIndex) => tabIndex === tabs);
        if(tabselected.length) {
            tabselected = tabselected[0]['type'];
            tabfilters = {...getTabSelectedFilter(tabselected)};
        }
        this.setState({ selectedTab : tabs, tabfilters }, ()=>{
            console.log("came-here");
            this.getOrders();
        });
    }

    async getConnectedAmazonAccounts(){
        let { fetch_orders } = this.state;
        fetch_orders.accounts_options = [ ...await getMarketplaceConnectedAccount('amazon', ['region'])];
        this.setState({ fetch_orders });
    }

    prepareFilters(){
        let {  filtersProps } = this.state;
        filtersProps['attributeoptions'] = [...prepareChoiceoption(filterOptions, 'headerName', "field")];
        this.setState({filtersProps});
    }

    async getOrders(){
        this.toggleOverLay(true);
        let { paginationProps, tabfilters, filtersProps } = this.state;
        let { filters } = filtersProps;
        let {  pageSize : count, activePage } = paginationProps;
        let ordersRequest = await getorders({count, activePage, source : 'amazon', ...tabfilters ,...getFilterforRequest(filters)});
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
        gridApi.resetRowHeights();
        // console.log(gridApi);
    }

    async onSelectedAction(action){
        let { selectedRows } = this.state;
        let selectedSourceOrderIds = [];
        selectedRows.forEach(order => selectedSourceOrderIds = [...selectedSourceOrderIds, order.source_order_id]);
        let response = {};
        switch(action){
            case 'ship_order_amazon':
                response = await shiporderonAmazon({source_order_ids : selectedSourceOrderIds});
                break;
            case 'create_order_shopify':
                response = await createorderonShopify({source_order_ids : selectedSourceOrderIds});
                break;
            case 'sync_order_amazon':
                response = await syncorderonAmazon({source_order_ids : selectedSourceOrderIds});
                break;
            default: break;
        }
    }

    onPaginationChange(paginationProps){
        this.setState({ paginationProps },()=>{this.getOrders();});
    }

    getSelectedRows(selectedRows){
        this.setState({selectedRows});
    }

    modalHandler( open = true, modal_type = ''){
        let { modal } = this.state;
        modal.open = open;
        modal.modal_type = open ? modal_type:'';
        switch(modal_type) {
            case 'fetch_orders':
                modal.title = open ? 'Fetch order(s) Amazon' : '';
                break;
            case 'marketplace_status':
                modal.title = open ? `Amazon Errors` : '';
                break;
            case 'shopify_status':
                modal.title = open ? `Shopify Errors` : '';
                break;
            default : break;
        }
        if(!open) modal.data = {};
        this.setState({ modal });
    }

    modalChangeHandler(type, field, value){
        switch(type){
            case 'fetch_orders':
                let { fetch_orders } = this.state;
                fetch_orders[field] = value;
                this.setState({ fetch_orders });
                break
            default: break;
        }
    }

    async fetchOrders(){
        let { fetch_orders } = this.state;
        let { success, message } = await fetchOrders( fetch_orders );
        if(success) notify.success(message);
        else notify.info(message);
        this.modalHandler(false, 'fetch_orders');
    }

    getModalInternalStructure(modal_type){
        switch (modal_type){
            case 'fetch_orders':
                let { fetch_orders } = this.state;
                return getModalStructure(modal_type, {...fetch_orders}, this.modalChangeHandler.bind(this));
            case 'marketplace_status':
                let { modal } = this.state;
                let {   data } = modal;
                return getModalStructure(modal_type, {...data}, this.modalChangeHandler.bind(this));
            case 'shopify_status':
                let { modal: modalShopify } = this.state;
                let { data: dataShopify } = modalShopify;
                return getModalStructure(modal_type, {...dataShopify}, this.modalChangeHandler.bind(this));
            default: return [];
        }
    }

    render() {
        let { columns, rows, selectedRows, paginationProps,selectedTab, tabs, selectedActions, filtersProps, modal} = this.state;
        let { open, modal_type, title } = modal;
        let structure = this.getModalInternalStructure(modal_type);
        return (
            <Page fullWidth title={"Orders"} primaryAction={{content:'Fetch order(s)', onAction: this.modalHandler.bind(this, true, 'fetch_orders')}}>
                <Grid
                    tag={'Order(s)'}
                    columns={columns}
                    rows={rows}
                    showFilters
                    showTabs={true}
                    tabs={tabs}
                    selectedTab={selectedTab}
                    tabSelected={this.tabSelected.bind(this)}
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
                    modalPolaris(title, open, this.modalHandler.bind(this, false, modal_type), { content: 'Fetch order(s)', onAction: this.fetchOrders.bind(this)}, structure)
                }
                { (modal_type === 'marketplace_status'  || modal_type === 'shopify_status') &&
                modalPolaris(title, open, this.modalHandler.bind(this, false, modal_type), false, structure)
                }
            </Page>
        );
    }
}

export default Amazonorders;