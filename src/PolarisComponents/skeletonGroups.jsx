import React from "react";
import {Card, SkeletonBodyText} from "@shopify/polaris";

export function getSkeleton(type){
    switch (type) {
        case 'categoryAttribute':
            return <Card>
                <Card.Section>
                    <SkeletonBodyText lines={5}/>
                </Card.Section>
                <Card.Section>
                    <SkeletonBodyText lines={5}/>
                </Card.Section>
            </Card>
        default : return  [] ;
    }
}