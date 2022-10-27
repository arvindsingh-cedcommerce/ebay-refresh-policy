import { Link, SkeletonBodyText } from "@shopify/polaris";
import { Carousel } from "antd";
import React from "react";
import { useState, useEffect } from "react";
import CarouselImage1 from "../../../../../assets/Digital-Marketing-Shopify-Expert-Solutions.jpg";
import CarouselImage2 from "../../../../../assets/Sell-on-leading-global-marketplaces-with-CedCommerce.jpg";

const CarouselComponent = ({
  reqiuredCurrentStep,
  notProfiledProductCount,
  orderManagementDisabledCount,
  productManagementDisabledCount,
}) => {
  return (
    <Carousel autoplay autoplaySpeed={10000} effect="fade">
      <div>
        <Link
          // url="https://experts.shopify.com/cedcommerce"
          url="https://cedcommerce.com/digital-marketing-services"
          external
        >
          <img
            width={"100%"}
            height={
              reqiuredCurrentStep == 3
                ? orderManagementDisabledCount == 0 ||
                  productManagementDisabledCount == 0
                  ? "350px"
                  : "350px"
                : reqiuredCurrentStep >= 2
                ? notProfiledProductCount > 0
                  ? "350px"
                  : "350px"
                : "350px"
            }
            src={CarouselImage1}
            alt=""
          />
        </Link>
      </div>
      <div>
        <Link url="https://apps.shopify.com/partners/cedcommerce" external>
          <img
            width={"100%"}
            height={
              reqiuredCurrentStep == 3
                ? orderManagementDisabledCount == 0 ||
                  productManagementDisabledCount == 0
                  ? "240px"
                  : "240px"
                : reqiuredCurrentStep >= 2
                ? notProfiledProductCount > 0
                  ? "240px"
                  : "240px"
                : "240px"
            }
            src={CarouselImage2}
            alt=""
          />
        </Link>
      </div>
    </Carousel>
  );
};

export default CarouselComponent;