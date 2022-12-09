import React, {Component} from 'react';
import {Pagination, Stack} from "@shopify/polaris";
import {select} from "../../PolarisComponents/InputGroups";
import {prepareChoiceforArray} from "../../services/helperFunction";

class PaginationComponent extends Component {

    handlePageSizeSelection(value){
        let { paginationProps, paginationChanged} = this.props;
        let { activePage, totalrecords } = paginationProps;
        if( parseInt(value) >= parseInt(totalrecords)) activePage = 1;
        paginationChanged({...paginationProps, pageSize: value, activePage});
    }

    render() {
        let { paginationProps, paginationChanged } = this.props;
        let { activePage, pages, pageSizeOptions, pageSize } = paginationProps;
        pageSizeOptions = prepareChoiceforArray(pageSizeOptions);

        return (
            <Stack>
                <Pagination
                    label={` ${activePage} / ${pages} page(s)`}
                    hasPrevious={activePage > 1}
                    onPrevious={() => {
                        if(activePage>1) paginationChanged({...paginationProps, activePage:activePage-1});
                    }}
                    hasNext={ activePage < pages}
                    onNext={() => {
                        if(activePage< pages) paginationChanged({...paginationProps, activePage:activePage+1});
                    }}
                />
                {
                    select('', pageSizeOptions, this.handlePageSizeSelection.bind(this), pageSize.toString())
                }
            </Stack>
        );
    }
}

export default PaginationComponent;