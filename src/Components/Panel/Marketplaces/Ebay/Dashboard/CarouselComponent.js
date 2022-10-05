import { Icon, Link } from "@shopify/polaris";
import { Carousel } from "antd";
import React from "react";
import CarouselImage1 from "../../../../../assets/Digital-Marketing-Shopify-Expert-Solutions.jpg";
import CarouselImage2 from "../../../../../assets/Sell-on-leading-global-marketplaces-with-CedCommerce.jpg";
import {
  ChevronLeftMinor,ChevronRightMinor
} from '@shopify/polaris-icons';
const CarouselComponent = ({
  reqiuredCurrentStep,
  notProfiledProductCount,
  orderManagementDisabledCount,
  productManagementDisabledCount,
}) => {

  const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79'
  }
  
  const SampleNextArrow = props => {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{ ...style,zIndex:"1", display:"block",position:"absolute",right:"0"}}
        onClick={onClick}
      >
 <Icon source={ChevronRightMinor} color={"dark"} />
        </div>
    )
  }
  
  const SamplePrevArrow = props => {
    const { className, style, onClick } = props
    return (
      <div
      className={className}
      style={{ ...style,zIndex:"1", display:"block",position:"absolute",left:"0"}}
      onClick={onClick}
    >
<Icon source={ChevronLeftMinor} color={"dark"} />
      </div>
    )
  }
  
  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  }


  return (
    <Carousel autoplay autoplaySpeed={10000} effect="fade" arrows {...settings} style={{position:"relative"}}>
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
