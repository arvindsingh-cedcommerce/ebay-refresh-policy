import { Link } from "@shopify/polaris";
import { Carousel } from "antd";
import React from "react";
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
          url="https://experts.shopify.com/cedcommerce"
          external
        >
          <img
            width={"100%"}
            height={
              reqiuredCurrentStep == 3
                ? orderManagementDisabledCount == 0 ||
                  productManagementDisabledCount == 0
                  ? "225px"
                  : "265px"
                : reqiuredCurrentStep >= 2
                ? notProfiledProductCount > 0
                  ? "187px"
                  : "225px"
                : "269px"
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
                  ? "225px"
                  : "265px"
                : reqiuredCurrentStep >= 2
                ? notProfiledProductCount > 0
                  ? "187px"
                  : "225px"
                : "269px"
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
