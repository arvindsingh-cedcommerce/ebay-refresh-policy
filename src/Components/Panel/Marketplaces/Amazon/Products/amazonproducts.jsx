import React, {Component} from 'react';
import {Page} from "@shopify/polaris";
import {
    amazonPageActions,
    extractValuesfromRequest,
    filterCondition,
    filterOptions,
    gridPropColumns,
    pageSizeOptionProducts,
    selectedProductActions
} from "./amazonproductshelper";
import {prepareChoiceoption} from "../../../../../Subcomponents/Aggrid/gridHelper";

import {getpaginationInfo} from "../../../../../services/helperFunction";
import {crouselStructureFunction, getFilterforRequest} from "../../Ebay/Products/ebayproducthelper";
import {
    deleteproduct,
    getproducts, matchproducts, uploadimage,
    uploadinventory,
    uploadprice,
    uploadproducts, uploadrelationship
} from "../../../../../Apirequest/amazonApirequest/productsApi";
import Grid from "../../../../../Subcomponents/Aggrid/grid";
import {modalPolaris} from "../../../../../PolarisComponents/ModalGroups";
import {filterUpdated} from "../../../../../store/reducers/ebay/products/filters";
import {connect} from "react-redux";
import {importProducts} from "../../../../../Apirequest/shopifyApirequest/shopifyproductsApi";
import {notify} from "../../../../../services/notify";
import {getproductsCount} from "../../../../../Apirequest/ebayApirequest/productsApi";

let gridApi = '';
class Amazonproducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: gridPropColumns(this.incellElement.bind(this)),
            selectedTab:0,
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
                this.redirect(`/panel/amazon/viewproducts?id=${container_id}`);
                break;
            default : break;
        }
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
    redirect(url){
        this.props.history.push(url);
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

    async onSelectedAction(action){
        let { selectedRows } = this.state;
        let productIds = [];
        selectedRows.forEach(row => productIds = [...productIds, row.source_product_id]);
        await this.pageActions(action, { product_ids : productIds });
    }

    filterData(componentFilters){
        // console.log(componentFilters);
        let { filtersProps } = this.state;
        filtersProps['filters'] = [...componentFilters];
        this.props.filterUpdated([...componentFilters]);
        // this.setState({filtersProps},()=>{
        this.getProducts();
        // });
    }

    async getProducts(){
        this.toggleOverLay(true);
        let { paginationProps, filtersProps } = this.state;
        let  { filters } = filtersProps;
        let {  pageSize : count, activePage } = paginationProps;
        let productsRequest = await getproducts({count, activePage, ...getFilterforRequest(filters)});
        let { success: successProductCount, data: dataProductCount } = await getproductsCount({count, activePage,  ...getFilterforRequest(filters)});
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

    async pageActions(action, data = {}){
        switch(action){
            case 'amazon_match_products': let { success: sMatch, message: mMatch } = await matchproducts(data);
                if(sMatch) notify.success(mMatch);
                else notify.error(mMatch);
                break;
            case 'amazon_upload_products': let { success: sUploaded, message: mUploaded } = await uploadproducts(data);
                if(sUploaded) notify.success(mUploaded);
                else notify.error(mUploaded);
                break;
            case 'amazon_upload_price': let { success: sPrice, message: mPrice } = await uploadprice(data);
                if(sPrice) notify.success(mPrice);
                else notify.error(mPrice);
                break;
            case 'amazon_upload_inventory': let { success: sInventory, message: mInventory } =  await uploadinventory(data);
                if(sInventory) notify.success(mInventory);
                else notify.error(mInventory);
                break;
            case 'amazon_upload_image': let { success: sImages, message: mImages } = await uploadimage(data);
                if(sImages) notify.success(mImages);
                else notify.error(mImages);
                break;
            case 'amazon_upload_relationship': let { success: sRelationship, message: mRelationship } =  await uploadrelationship(data);
                if(sRelationship) notify.success(mRelationship);
                else notify.error(mRelationship);
                break;
            case 'amazon_delete_product': let { success: sDeleteProduct, message: mDeleteProduct } = await deleteproduct(data);
                if(sDeleteProduct) notify.success(mDeleteProduct);
                else notify.error(mDeleteProduct);
                break;
            default : break;
        }
    }


    render() {
        let { columns, rows, selectedRows, paginationProps, selectedActions, filtersProps, imageModal } = this.state;
        let { open, structure } = imageModal;
        return (
            <Page fullWidth={true}
                  actionGroups={amazonPageActions(this.pageActions.bind(this))}
                  title={"Products"}>
                <Grid
                    tag={'Product(s)'}
                    columns={columns}
                    rows={rows}
                    showFilters
                    filterData={this.filterData.bind(this)}
                    filtersProps={filtersProps}
                    customRowHeight={100}
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
    let { amazon } = state;
    let { products } = amazon;
    let { filters } = products;
    return ({
        filters
    });
}

const mapDispatchToProps = dispatch => {
    return ({
        filterUpdated : (filters = []) => dispatch(filterUpdated(filters))
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Amazonproducts);