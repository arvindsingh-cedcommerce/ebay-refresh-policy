import { Icon, Select, Stack } from "@shopify/polaris";
import { ChevronDownMinor, ChevronRightMinor, MinusMinor, PlusMinor } from "@shopify/polaris-icons";
import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  variantGridHeadings,
} from "../Panel/Marketplaces/Ebay/Products/SampleProductData";

function NestedTableBackup(props) {
  const clearFilters = () => {

  }
  const expandedRowRender = (rowIndex) => {
    return <Innertable rowIndex={rowIndex} />
  };

  return (
    <Table
      // className="components-table-demo-nested"
      columns={props.parentHeadings}
      expandable={{ expandedRowRender }}
      dataSource={props.parentRows}
      rowSelection={props.rowSelection}
    // expandIcon={(props) => customExpandIcon(props)}
    />
  );
}

export default NestedTableBackup;

export const Innertable = ({ rowIndex }) => {
  const [tags, setTags] = useState([])

  if (rowIndex['variantsCount'] > 0) {
    let temp = {};
    variantGridHeadings[1]['filters'] = rowIndex['variants'].map(variant => {
      temp = {};
      temp['text'] = variant['variantTitle'];
      temp['value'] = variant['variantTitle'];
      return temp;
    })
    variantGridHeadings[2]['filters'] = rowIndex['variants'].map(variant => {
      temp = {};
      temp['text'] = variant['variantSKU'];
      temp['value'] = variant['variantSKU'];
      return temp;
    })
    variantGridHeadings[5]['sorter'] = (a, b) => a.variantPrice - b.variantPrice;
    variantGridHeadings[4]['sorter'] = (a, b) => a.variantQuantity - b.variantQuantity;

    const options = [
      { label: 'View', value: 'view' },
      { label: 'Variants', value: 'variants' },
    ];
    // console.log("variantGridHeadings[1]['filters']", variantGridHeadings[1]['filters'])
    function getTagsValue(value){
      console.log(value)
    }
    let tagsMarkup = [];
    return (
     <>
     {/* {renderTags()} */}
     <Table
        columns={variantGridHeadings}
        dataSource={rowIndex['variants']}
        pagination={false}
        rowSelection={rowIndex['variantsRowSelection']}
        bordered
        footer={currentPageData => {
          tagsMarkup = currentPageData;
          // console.log('tagsMarkup', tagsMarkup)
          getTagsValue(tagsMarkup)
          return null;
        }}
        title={() => <Stack distribution="equalSpacing"><p>Variants</p>
          {/* <RenderTagsVariantFilters tagsMarkup={tagsMarkup}/> */}
        </Stack>}

        onFilter={(filteredDataSource, activeFilters) => {
          console.log('filteredDataSource, activeFilters', filteredDataSource, activeFilters)

          // Now you can do whatever you want with the filtered dataSource

          // this.setState({ numberOfRowsInTable: filteredDataSource.length });
        }}
      />
     </>
    )
  } else return rowIndex['variants']
}

export const RenderTagsVariantFilters = (props) => {
  console.log('props', props)
  // console.log('tagsMarkup', props.tagsMarkup)
  return <p>gjh</p>
}
// [
//   "30008717475918"
// ]
// 30008717475918