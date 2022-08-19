import React, {Component} from 'react';
import {Page} from "@shopify/polaris";
import {AddMajorMonotone} from "@shopify/polaris-icons";
import Grid from "../../../../../Subcomponents/Aggrid/grid";
import {
    extractValuesfromRequest, filterCondition,
    gridPropColumns, pageSizeOptionTemplate,
} from "../../Ebay/Template/ebaytemplatlisthelper";
import {attachCountTabTitle} from "../../Ebay/Policies/ebaypolicyhelper";
import {deleteTemplate, getTemplates} from "../../../../../Apirequest/ebayApirequest/templatesApi";
import {notify} from "../../../../../services/notify";
import {getTypeoftabs, templatetabs} from "./TemplateBody/TemplateHelpers/AmazonTemplateHelper";

let gridApi = '';

class AmazontemplateList extends Component {

    constructor(props) {
        super(props);
        this.state={
            columns: gridPropColumns(this.incellElement.bind(this)),
            tabs: templatetabs,
            selectedTab:0,
            rows: [],
            all_rows:[],
            paginationProps:{
                pageSizeOptions:pageSizeOptionTemplate,
                activePage:1,
                pageSize: pageSizeOptionTemplate[0],
                pages: 0, totalrecords: 0
            },
            filtersProps :{ attributeoptions : [], filters:[] , filterCondition: filterCondition},
        }
    }

    componentDidMount() {
        this.getTemplates()
    }


    getGridApi(api){
        gridApi = api;
    }

    async incellElement(field, data){
        switch (field) {
            case 'edit':
                let { id, type } = data;
                this.redirect(`/panel/amazon/templates/handler?type=${type}&id=${id}`);
                break;
            case 'delete':
                let { id: templateid } = data;
                let { success, message } = await deleteTemplate( templateid );
                if(success) {
                    notify.success( message );
                    await this.getTemplates();
                }
                else notify.error( message );
                break;
            default:
                break;
        }
    }

    cellClickedEvent(colDef, data){
    }

    async getTemplates(){
        let { tabs, selectedTab } = this.state;
        this.toggleOverLay(true);
        let templates = await getTemplates({marketplace: 'amazon', multitype:['price','inventory', "title", "category"]});
        let {success , data} = templates;
        if(success){
            let rows = await extractValuesfromRequest(data);
            tabs = [...attachCountTabTitle(tabs, 'all',  rows)];
            tabs = [...attachCountTabTitle(tabs, 'price',  rows)];
            tabs = [...attachCountTabTitle(tabs, 'inventory',  rows)];
            tabs = [...attachCountTabTitle(tabs, 'title',  rows)];
            tabs = [...attachCountTabTitle(tabs, 'category',  rows)];
            this.setState({
                all_rows: rows,
                rows, selectedTab: selectedTab, tabs
            },() => {
                this.filterTabProducts();
                this.toggleOverLay(false);
            });
        }else {
            this.toggleOverLay(false);
        }
    }

    filterTabProducts(){
        let { selectedTab, all_rows } = this.state;
        let getType = getTypeoftabs(selectedTab);
        let rows;
        if(getType !== 'all') {
            rows = all_rows.filter(data => data.type === getType);
        }else{
            rows = all_rows.slice(0);
        }
        this.setState({rows});
    }

    tabSelected(tabs){
        this.setState({ selectedTab : tabs }, ()=>{
            this.filterTabProducts();
        });
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

    render() {
        let { columns, rows, selectedTab, tabs } = this.state;
        return (
            <Page fullWidth title={"Templates"}
                  actionGroups={[
                      {
                          title: 'Add templates',
                          icon: AddMajorMonotone,
                          actions: [
                              {
                                  content: 'Inventory', icon: AddMajorMonotone, onAction: () => {
                                      this.redirect('/panel/amazon/templates/handler?type=inventory')
                                  }
                              },
                              {
                                  content: 'Price', icon: AddMajorMonotone, onAction: () => {
                                      this.redirect('/panel/amazon/templates/handler?type=price')
                                  }
                              },
                              {
                                  content: 'Title', icon: AddMajorMonotone, onAction: () => {
                                      this.redirect('/panel/amazon/templates/handler?type=title')
                                  }
                              },
                              {
                                  content: 'Category', icon: AddMajorMonotone, onAction: () => {
                                      this.redirect('/panel/amazon/templates/handler?type=category')
                                  }
                              }
                          ]
                      }]}
            >
                <Grid
                    tag={'Template(s)'}
                    columns={columns}
                    rows={rows}
                    showTabs={true}
                    tabs={tabs}
                    selectedTab={selectedTab}
                    tabSelected={this.tabSelected.bind(this)}
                    getGridApi={this.getGridApi.bind(this)}
                    suppressSizeToFit={true}
                    suppressMovableColumns={true}
                    suppressRowClickSelection={true}
                    enableCellTextSelection={true}
                    rowSelection={"multiple"}
                    cellClickedEvent={this.cellClickedEvent.bind(this)}
                />
            </Page>
        );
    }
}

export default AmazontemplateList;