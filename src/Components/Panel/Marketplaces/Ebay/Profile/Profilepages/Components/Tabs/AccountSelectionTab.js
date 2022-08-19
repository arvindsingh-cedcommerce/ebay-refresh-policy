import { Card, TextField } from '@shopify/polaris'
import React from 'react'
import AccountConnectionPolicyTemplate from '../AccountConnectionPolicyTemplate'

const AccountSelectionTab = ({ profileName, setProfileName, connectedAccountsObject, setconnectedAccountsObject, templateOptions, shopifyWarehouses, panes, setPanes, profileNameError,checkboxError,setProfileNameError, setCheckboxError }) => {
    return (
        <Card>
            <Card.Section>
                <TextField
                    label="Profile Name"
                    value={profileName}
                    onChange={(value) => {
                        setProfileName(value)
                        setProfileNameError(false)
                    }}
                    autoComplete="off"
                    error={profileNameError && 'Please fill...'}
                    helpText={'Set profile name as per your convenience. It will use to identify this profile while listing creation on eBay.'}
                />
            </Card.Section>
            <AccountConnectionPolicyTemplate templateOptions={templateOptions} checkboxError={checkboxError} setCheckboxError={setCheckboxError} connectedAccountsObject={connectedAccountsObject} setconnectedAccountsObject={setconnectedAccountsObject} shopifyWarehouses={shopifyWarehouses} panes={panes} setPanes={setPanes} />
        </Card>
    )
}

export default AccountSelectionTab