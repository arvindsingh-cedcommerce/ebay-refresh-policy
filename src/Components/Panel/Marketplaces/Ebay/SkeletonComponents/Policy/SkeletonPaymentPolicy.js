import { Card, SkeletonBodyText, SkeletonPage } from "@shopify/polaris";
import React from "react";

const SkeletonPaymentPolicy = () => {
  return (
    <SkeletonPage fullWidth={true} title="Payment Policy">
      <Card.Section>
        <SkeletonBodyText lines={2} />
      </Card.Section>
      <Card.Section>
        <SkeletonBodyText lines={2} />
      </Card.Section>
      <Card.Section>
        <SkeletonBodyText lines={2} />
      </Card.Section>
      <Card.Section>
        <SkeletonBodyText lines={2} />
      </Card.Section>
    </SkeletonPage>
  );
};

export default SkeletonPaymentPolicy;
