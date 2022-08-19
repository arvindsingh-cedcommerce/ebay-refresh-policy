import React, {Component} from 'react';
import {Page} from "@shopify/polaris";
import {AddMajorMonotone} from "@shopify/polaris-icons";
import Grid from "../../../../../Subcomponents/Aggrid/grid";
import {prepareChoiceoption} from "../../../../../Subcomponents/Aggrid/gridHelper";
import {
    extractValuesfromRequest,
    filterConditions, filterOptions,
    gridPropColumns,
    pageSizeOptionProfile
} from './amazonProfileHelper';
import {deleteProfile, getallProfile} from "../../../../../Apirequest/ebayApirequest/profileApi";
import {notify} from "../../../../../services/notify";
import {getpaginationInfo} from "../../../../../services/helperFunction";
import {getFilterforRequest} from "../../Ebay/Products/ebayproducthelper";

let gridApi = '';

class AmazonProfile extends Component {

    constructor(props){
        super(props);
        this.state={
            columns: gridPropColumns(this.incellElement.bind(this)),
            selectedTab:0,
            rows: [],
            all_rows:[],
            paginationProps:{
                pageSizeOptions:pageSizeOptionProfile,
                activePage:1,
                pageSize: pageSizeOptionProfile[0],
                pages: 0, totalrecords: 0
            },
            filtersProps :{ attributeoptions : [], filters:[] , filterCondition: filterConditions},
        }
    }

    async getProfiles(){
        this.toggleOverLay(true);
        let { paginationProps, filtersProps } = this.state;
        let { filters } = filtersProps;
        let {  pageSize : count, activePage } = paginationProps;
        let profiles = await getallProfile({ count, activePage, ...getFilterforRequest(filters), marketplace : 'amazon' });
        let { success, data } = profiles;
        if(success){
            let { rows, count: totalRecords } = data;
            let paginationInformation = getpaginationInfo( totalRecords, count);
            paginationProps = { ...paginationProps, ...paginationInformation};
            let extractRowData = extractValuesfromRequest(rows, "amazon");
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
            this.getProfiles();
        });
    }

    getGridApi(api){
        gridApi = api;
    }

    async incellElement(field, data){

        switch (field) {
            case 'edit':
                let { id } = data;
                this.redirect(`/panel/amazon/createprofile?id=${id}`);
                break;
            case 'delete':
                let {  profile_id } = data;
                let { success, message } = await deleteProfile( profile_id );
                if(success) {
                    notify.success( message );
                    await this.getProfiles();
                }
                else notify.error( message );
                break;
            default:
                break;
        }
    }

    redirect(url){
        this.props.history.push(url);
    }

    cellClickedEvent(colDef, data){
    }

    async onSelectedAction(action){
        console.log(action);
    }

    toggleOverLay(showhide){
        if(gridApi!=='') {
            if (showhide) gridApi.showLoadingOverlay();
            else gridApi.hideOverlay();
        }
    }

    componentDidMount() {
        this.getProfiles()
        this.prepareFilters();
    }

    prepareFilters(){
        let {  filtersProps } = this.state;
        filtersProps['attributeoptions'] = [...prepareChoiceoption(filterOptions, 'headerName', "field")];
        this.setState({filtersProps});
    }

    getSelectedRows(selectedRows){
        this.setState({selectedRows});
    }

    onPaginationChange(paginationProps){
        this.setState({ paginationProps },()=>{this.getProfiles();});
    }

    render() {
        let { columns, rows, selectedRows, paginationProps, selectedActions, filtersProps } = this.state;

        return (
            <Page fullWidth title={'Profiles'}
                  primaryAction={{content: 'Create', icon: AddMajorMonotone, onAction: this.redirect.bind(this, '/panel/amazon/createprofile')}}
            >
                <Grid
                    tag={'Profile(s)'}
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
                    suppressSizeToFit={true}
                    suppressMovableColumns={true}
                    suppressRowClickSelection={true}
                    enableCellTextSelection={true}
                    rowSelection={"multiple"}
                    selectedRows={selectedRows}
                    cellClickedEvent={this.cellClickedEvent.bind(this)}
                    rowSelected={this.getSelectedRows.bind(this)}
                />
            </Page>
        );
    }
}

export default AmazonProfile;