import React, {Component} from 'react';
import {Page} from "@shopify/polaris";

import Grid from "../../../../../Subcomponents/Aggrid/grid";
import {
    crouselStructureFunction, ebayPageActions,
    extractValuesfromRequest, filterCondition, filterOptions, getFilterforRequest,
    gridPropColumns,
    pageSizeOptionProducts,
    selectedProductActions
} from "./ebayproducthelper";
import {getproducts, getproductsCount, testController} from "../../../../../Apirequest/ebayApirequest/productsApi";
import {getpaginationInfo} from "../../../../../services/helperFunction";
import {prepareChoiceoption} from "../../../../../Subcomponents/Aggrid/gridHelper";
import {modalPolaris} from "../../../../../PolarisComponents/ModalGroups";
import { connect } from 'react-redux';
import {filterUpdated} from "../../../../../store/reducers/ebay/products/filters";
import {importProducts} from "../../../../../Apirequest/shopifyApirequest/shopifyproductsApi";
import {notify} from "../../../../../services/notify";
import {activityAdd} from "../../../../../store/reducers/activity/modifyactivityslice";

let gridApi = '';
class Ebayproducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: gridPropColumns(this.incellElement.bind(this)),
            rows: [],
            selectedRows: [],
            selectedActions: selectedProductActions,
            actionSelected: '',
            imageModal:{
                open: false,
                structure:[],
            },
            paginationProps:{
                pageSizeOptions:pageSizeOptionProducts,
                activePage:1,
                pageSize: pageSizeOptionProducts[0],
                pages: 0, totalrecords: 0
            },
            filtersProps :{ attributeoptions : [], filters:this.props.filters , filterCondition: filterCondition},
        }
    }

    incellElement(field, data){
        switch(field){
            case 'view_product':
                let {source_product_id, container_id} = data;
                this.redirect(`/panel/ebay/viewproductsPS?id=${container_id}`);
                break;
            default : break;
        }
    }

    redirect(url){
        this.props.history.push(url);
    }

    componentDidMount() {
        this.getProducts();
        this.prepareFilters();
    }

    imageModalChange(open, structure = []){
        let { imageModal } = this.state;
        this.setState({ imageModal: {...imageModal, open, structure}})
    }

    onPaginationChange(paginationProps){
        this.setState({ paginationProps },()=>{this.getProducts();});
    }

    prepareFilters(){
        let {  filtersProps } = this.state;
        filtersProps['attributeoptions'] = [...prepareChoiceoption(filterOptions, 'headerName', "field")];
        this.setState({filtersProps});
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
        switch(field){
            case 'title':

                break;
            case 'image':
                let { image_array } = data;
                let crouselStructure = crouselStructureFunction(image_array);
                this.imageModalChange(true, crouselStructure);
                break;
            default:break;
        }
    }

    getGridApi(api){
        gridApi = api;
    }

    async getProducts(){
        this.toggleOverLay(true);
        let { paginationProps, filtersProps } = this.state;
        let  { filters } = filtersProps;
        let {  pageSize : count, activePage } = paginationProps;
        let productsRequest = await getproducts({productOnly:true, count, activePage,  ...getFilterforRequest(filters)});
        let { success: successProductCount, data: dataProductCount } = await getproductsCount({productOnly:true, count, activePage,  ...getFilterforRequest(filters)});
        let { success, data } = productsRequest;
        if(success && successProductCount){
            let { rows } = data;
            let { count: totalRecords } = dataProductCount;
            let paginationInformation = getpaginationInfo( totalRecords, count);
            paginationProps = { ...paginationProps, ...paginationInformation};

            let extractRowData = extractValuesfromRequest(rows);

            this.setState({rows: [...extractRowData], paginationProps});
        }
        this.toggleOverLay(false);
    }

    async onSelectedAction(action){
        console.log(action);
    }

    filterData(componentFilters){
        // console.log(componentFilters);
        let { filtersProps } = this.state;
        filtersProps['filters'] = [...componentFilters];
        this.props.filterUpdated([...componentFilters]);
        this.getProducts();
        // this.setState({filtersProps},()=>{
            // this.getProducts();
        // });
    }

    async pageActions(action){
        switch(action){
            case 'shopify_import':
                let { success : successShopifyImport, message : messageShopifyImport } = await importProducts({ marketplace : 'shopify' });
                if(successShopifyImport) notify.success(messageShopifyImport);
                else notify.warn(messageShopifyImport);
                break;
            default : break;
        }
    }

    testAction(){
        this.props.activityAdd();
    }


     render() {
        let { columns, rows, selectedRows, paginationProps, selectedActions, filtersProps, imageModal } = this.state;
        let { open, structure } = imageModal;
        return (
            <Page title={'Products'}
                  primaryAction={{content: 'Test', onAction :  this.testAction.bind(this) }}
                  actionGroups={ebayPageActions(this.pageActions.bind(this))}
                  fullWidth={true} >
                <Grid
                    tag={'Product(s)'}
                    columns={columns}
                    rows={rows}
                    showFilters
                    customRowHeight={100}
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
                {
                    modalPolaris("Product images", open, this.imageModalChange.bind(this, false, []), false, structure)
                }
            </Page>
        );
    }
}

const mapStateToProps = state => {
    let { ebay } = state;
    let { products } = ebay;
    let { filters } = products;
 return ({
     filters
 });
}

const mapDispatchToProps = dispatch => {

    return ({
        filterUpdated : (filters = []) => dispatch(filterUpdated(filters)),
        activityAdd : () => dispatch(activityAdd())
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Ebayproducts);
