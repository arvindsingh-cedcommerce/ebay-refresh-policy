import React, { useState } from "react";
import { Button, Table } from "antd";

function NestedTableComponent({
  columns,
  dataSource,
  rowSelection,
  expandable,
  bordered,
  scroll,
  pagination,
  onChange,
  size,
  style,
  title,
  components,
  onRow,
  loading,
}) {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelection}
      expandable={expandable}
      bordered={bordered}
      scroll={scroll}
      pagination={pagination}
      onChange={onChange}
      size={size}
      style={style}
      title={title}
      components={components}
      onRow={onRow}
      loading={loading}
    />
  );
}

export default NestedTableComponent;
