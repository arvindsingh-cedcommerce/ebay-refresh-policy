import { Pagination } from "antd";
import React from "react";

const BasicPaginationComponent = ({
  totalCount,
  hitGetProductsAPI,
  pageSizeOptions,
  activePage,
  setActivePage,
  setPrevPage,
  pageSize,
  setPageSize,
  size,
  simple,
}) => {
  return (
    <Pagination
      size={size}
      total={totalCount}
      showSizeChanger={false}
      showLessItems={true}
      defaultCurrent={1}
      current={activePage}
      defaultPageSize={pageSizeOptions[0]}
      pageSize={pageSize}
      onChange={(page, pageSize) => {
       
        setActivePage(page);
        //setPageSize(pageSize);
        setPrevPage(activePage);
        hitGetProductsAPI(page,pageSize);
      }}
      //pageSize={pageSize}
    //   showTotal={(total, range) => {
    //     if(range[0] > range[1]) {
    //       range[0] = 1
    //     }
    //     if (totalCount)
    //       return `Showing ${range[0]}-${range[1]} of ${total} items`;
    //   }}
    />
  );
};

export default BasicPaginationComponent;
