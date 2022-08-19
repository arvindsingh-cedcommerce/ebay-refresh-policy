import React from "react";
import {
    Button,
    Checkbox,
    ChoiceList, Collapsible,
    DatePicker,
    RangeSlider,
    Select,
    Spinner,
    TextContainer,
    TextField
} from "@shopify/polaris";
import ReactJson from "react-json-view";
import CKEditor from "ckeditor4-react";

export function textField (label, value, onChange, placeholder  = '', helptext = '', error = false, type = 'text' , prefix = '', suffix = '', maxLength = false, disabled = false) {
    return <TextField
        label={label}
        value={value ? value.toString(): ''}
        onChange={onChange}
        type={type}
        helpText={helptext}
        error={error}
        placeholder={placeholder}
        prefix={prefix}
        maxLength={maxLength ? maxLength : undefined}
        disabled={disabled}
        suffix={suffix}
        showCharacterCount={false}
    />;
}

export function textFieldreadOnly(label = '', value = '', readOnly = false){
    value=value !== null ? value.toString(): '';
    return <TextField label={label} value={value} readOnly={readOnly}/>
}

export function textArea (label, value, onChange, multiline = 2, placeholder  = '', helptext = '', error = false, type = 'text' , prefix = '', suffix = '') {
    return <TextField
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        helpText={helptext}
        error={error}
        multiline={multiline}
        placeholder={placeholder}
        prefix={prefix}
        suffix={suffix}
        showCharacterCount
    />;
}

export function textFieldwithConnectedComponent (label, value, onChange, placeholder  = '', prefix = '', connectedComponent , suffix = '') {
    return <TextField
        label={label}
        value={value}
        onChange={onChange}
        prefix={prefix}
        placeholder={placeholder}
        connectedLeft={connectedComponent}
    />;
}

export function select(label='', options=[], onChange, value, placeholder = 'Please Select', error= false, labelInline =false, disabled =false, helpText = false){
    return    <Select
        label={label}
        options={options}
        onChange={onChange}
        labelInline={labelInline}
        helpText={helpText}
        value={value}
        error={error}
        disabled={disabled}
        placeholder={placeholder}
    />
}

export function button(label, onClick, submit = false, loading = false, primary=true, size ='medium', disabled = false, destructive=false, icon= false ){
    return <Button children={label} onClick={onClick} submit={submit} primary={primary} size={size} loading={loading} disabled={disabled} destructive={destructive} icon={icon}/>
}

export function checkbox(label,checked, onChange, error = false, helpText="", disabled = false){
    return <Checkbox label={label} checked={checked} onChange={onChange} error={error} helpText={helpText} disabled={disabled}/>
}

export function choiceList(title, options =[],selected=[],onChange, error = false, disabled= false, multiple = true){
    return <ChoiceList
        allowMultiple ={multiple}
        disabled={disabled}
        title={title}
        error={error}
        choices={options}
        selected={selected}
        onChange={onChange}
    />
}

export function textContainer(children = [], spacing=""){
    return <TextContainer children={children} spacing={spacing}/>
}

export function datePicker(month, year, setSelectedDates, handleMonthChange, selectedDates){
    return <DatePicker month={month} year={year} onChange={setSelectedDates} onMonthChange={handleMonthChange} selected={selectedDates}/>
}

export function spinner( size ="small", color ='teal', accessibilityLabel = "Loading"){
    return <span style={{fontSize: 20}}>{accessibilityLabel}<Spinner accessibilityLabel={accessibilityLabel} size={size} color={color} /></span>;
}

export function ReactJsonStructure( structure = {},  theme="monokai"){
    return <ReactJson src={structure} theme={theme}/>
}

export function ckeditor( data = '', onChange, readonly = false){
    return  <CKEditor
        data={data}
        readOnly={readonly}
        onChange={onChange}
    />
}

export function rangeSlider(label, value, onChange, showOutput, min = 0, max = false, error= false ){
    return <RangeSlider
        output={showOutput}
        label={label}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        error={error}
    />
}

export function collapsiblePolaris(open, structure = [], id = "Account collapsible"){
    return <Collapsible
        open={open}
        id={id}
        transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
    >
        {structure}
    </Collapsible>}