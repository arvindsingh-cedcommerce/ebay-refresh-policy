import React, { useState } from "react";
import { Checkbox, Divider } from "antd";

const CheckboxGroup = Checkbox.Group;

const CheckboxComponentBackup = ({
  groupOfCheckboxes,
  checkedList,
  indeterminate,
  checkAll,
  setCheckedList,
  setIndeterminate,
  setCheckAll,
  defaultCheckedList,
}) => {

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < groupOfCheckboxes.length);
    setCheckAll(list.length === groupOfCheckboxes.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? groupOfCheckboxes : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        Check all
      </Checkbox>
      <Divider />
      <CheckboxGroup
        options={groupOfCheckboxes}
        value={checkedList}
        onChange={onChange}
      />
    </>
  );
};

export default CheckboxComponentBackup;
