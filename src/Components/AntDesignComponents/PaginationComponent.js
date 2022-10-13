import { Pagination } from "antd";
import React from "react";

const PaginationComponent = ({
  totalCount,
  hitGetProductsAPI,
  pageSizeOptions,
  activePage,
  setActivePage,
  pageSize,
  setPageSize,
  size,
  simple,
}) => {
  return (
    <Pagination
      showLessItems={true}
      size={size}
      total={totalCount}
      simple={simple}
      showSizeChanger
      showQuickJumper
      defaultCurrent={1}
      current={activePage}
      defaultPageSize={pageSizeOptions[0]}
      onChange={(page, pageSize) => {
        setActivePage(page);
        setPageSize(pageSize);
        hitGetProductsAPI(page,pageSize);
      }}
      pageSizeOptions={pageSizeOptions}
      pageSize={pageSize}
      showTotal={(total, range) => {
        if(range[0] > range[1]) {
          range[0] = 1
        }
        if (totalCount)
          return `Showing ${range[0]}-${range[1]} of ${total} items`;
      }}
    />
  );
};

export default PaginationComponent;
