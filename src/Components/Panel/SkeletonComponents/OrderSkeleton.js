import {
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
} from "@shopify/polaris";
import React from "react";

const OrderSkeleton = () => {
  return (
    <SkeletonPage fullWidth primaryAction>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText lines={4} />
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card>
            <Card.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={4} />
              </TextContainer>
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={4} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={4} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={4} />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default OrderSkeleton;
