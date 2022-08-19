import { Stack } from "@shopify/polaris";
import { Carousel } from "antd";
import React from "react";
// import { Carousel } from "react-responsive-carousel";
import { announcementData } from "./DashboardData";
// import CarouselImage1 from "../../../../../assets/welcome_screen.jpg";
// import CarouselImage2 from "../../../../../assets/Sell-on-ebay-marketplace-08.jpg";
import CarouselImage1 from "../../../../../assets/Digital-Marketing-Shopify-Expert-Solutions.jpg";
import CarouselImage2 from "../../../../../assets/Sell-on-leading-global-marketplaces-with-CedCommerce.jpg";

const contentStyle = {
  height: "266px",
  color: "#fff",
  background: "#364d79",
  wordWrap: "break-word",
  padding: "10px 20px",
  backgroundImage: `url(${CarouselImage1})`,
};
const CarouselComponent = ({
  reqiuredCurrentStep,
  notProfiledProductCount,
  orderManagementDisabledCount,
  productManagementDisabledCount,
}) => {
  return (
    <Carousel autoplay autoplaySpeed={10000} effect="fade">
      <div>
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
          alt="image"
        />
      </div>
      <div>
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
          alt="image"
        />
      </div>
      {/* {announcementData.map((data, index) => {
        return (
          <div
            style={{
              // height: "266px",
              color: "#fff",
              background: "#364d79",
              wordWrap: "break-word",
              padding: "0px 20px",
              backgroundImage:
                index === 0
                  ? `url(${CarouselImage1})`
                  : index === 1 && `url(${CarouselImage2})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              // height: '100%',
              backgroundRepeat: "no-repeat",
            }}
          >
            <img width={'100%'} height={'100%'} src={CarouselImage1} alt="image" />
            <img width={'100%'} height={'100%'} src={CarouselImage2} alt="image" /> */}
      {/* <div
              style={{
                height: "266px",
                color: "#fff",
                // background: "#364d79",
                wordWrap: "break-word",
                padding: "0px 20px",
                backgroundImage:
                  index === 0
                    ? `url(${CarouselImage1})`
                    : index === 1 && `url(${CarouselImage2})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                // height: '100%',
                backgroundRepeat: "no-repeat",
              }}
            >
            </div> */}
      {/* </div>
        );
      })} */}
    </Carousel>
    // <Carousel
    //   showArrows={true}
    //   // dynamicHeight={true}
    //   style={{height: '100px'}}
    //   // onChange={onChange}
    //   // onClickItem={onClickItem}
    //   // onClickThumb={onClickThumb}
    // >
    //   <div style={{background: 'red'}}>
    //     {/* <img src="assets/1.jpeg" /> */}
    //     <p className="legend">Legend 1</p>
    //   </div>
    //   <div>
    //     {/* <img src="assets/2.jpeg" /> */}
    //     <p className="legend">Legend 2</p>
    //   </div>
    //   <div>
    //     {/* <img src="assets/3.jpeg" /> */}
    //     <p className="legend">Legend 3</p>
    //   </div>
    // </Carousel>
  );
};

export default CarouselComponent;
