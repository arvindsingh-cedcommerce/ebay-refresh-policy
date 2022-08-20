import {
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import React from "react";
import AccountConnectionPolicyTemplate from "../AccountConnectionPolicyTemplate";

const AccountSelectionTab = ({
  profileName,
  setProfileName,
  connectedAccountsObject,
  setconnectedAccountsObject,
  templateOptions,
  shopifyWarehouses,
  panes,
  setPanes,
  profileNameError,
  checkboxError,
  setProfileNameError,
  setCheckboxError,
  profileDataSkeleton,
}) => {
  return (
    <Card>
      <Card.Section>
        {profileDataSkeleton ? (
          <SkeletonBodyText lines={2} />
        ) : (
          <TextField
            label="Profile Name"
            value={profileName}
            onChange={(value) => {
              setProfileName(value);
              setProfileNameError(false);
            }}
            autoComplete="off"
            error={profileNameError && "Please fill..."}
            helpText={
              "Set profile name as per your convenience. It will use to identify this profile while listing creation on eBay."
            }
          />
        )}
      </Card.Section>
      {profileDataSkeleton ? (
        <Card>
          <Card.Section>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card.Section>
          <Card.Section>
            <SkeletonBodyText lines={3} />
          </Card.Section>
        </Card>
      ) : (
        <AccountConnectionPolicyTemplate
          templateOptions={templateOptions}
          checkboxError={checkboxError}
          setCheckboxError={setCheckboxError}
          connectedAccountsObject={connectedAccountsObject}
          setconnectedAccountsObject={setconnectedAccountsObject}
          shopifyWarehouses={shopifyWarehouses}
          panes={panes}
          setPanes={setPanes}
        />
      )}
    </Card>
  );
};

export default AccountSelectionTab;
