import React from "react";
import {Autocomplete} from "@shopify/polaris";

export function autoComplete(options =[], selected='',onSelect =()=>{}, textField = [] ){
    return <Autocomplete
           options={options}
           selected={selected}
           onSelect={onSelect}
           textField = {textField}
     />
}

export function autoCompleteTextField(label='', value = '',onChange =()=>{}, prefix=false,placeholder = "Search"){
    return <Autocomplete.TextField
        label={label}
        value={value}
        prefix={prefix}
        onChange={onChange}
        placeholder={placeholder}
    />
}