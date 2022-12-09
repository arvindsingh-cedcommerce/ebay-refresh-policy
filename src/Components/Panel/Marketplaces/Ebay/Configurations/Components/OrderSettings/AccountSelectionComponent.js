import { Checkbox, Divider } from 'antd';
import React, { useEffect, useState } from 'react'

const CheckboxGroup = Checkbox.Group;

const AccountSelectionComponent = ({ ebayAccountsArrayCopy, checkedList, setCheckedList, indeterminate, setIndeterminate, checkAll, setCheckAll }) => {
    const [connectedAccountsObject, setconnectedAccountsObject] = useState([]);
    const onChange = list => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < ebayAccountsArrayCopy.length);
        setCheckAll(list.length === ebayAccountsArrayCopy.length);
    };

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? ebayAccountsArrayCopy : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    return (
        <>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Global
            </Checkbox>
            <Divider />
            <CheckboxGroup options={ebayAccountsArrayCopy} value={checkedList} onChange={onChange} />
        </>
    )
}

export default AccountSelectionComponent