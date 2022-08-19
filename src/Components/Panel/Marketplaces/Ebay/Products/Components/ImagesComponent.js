import { Layout, Stack, Thumbnail } from "@shopify/polaris";
import { Image } from "antd";
import React, { useEffect, useState } from "react";
import NoProductImage from "../../../../../../assets/notfound.png";

const ImagesComponent = ({ mainProduct }) => {
  const [pointedImage, setPointedImage] = useState(mainProduct["mainImage"]);
  const [imageArray, setImageArray] = useState([])
  
  useEffect(() => {
    let temp = []
    if(mainProduct["mainImage"]) {
      temp.push(mainProduct["mainImage"])
    }
    if(Array.isArray(mainProduct["image_array"]) && mainProduct["image_array"].length) {
      mainProduct["image_array"].forEach(e => {
        temp.push(e)
      })
    }
    setImageArray(temp)
  }, [])

  return (
    <Stack vertical distribution="center">
      <Stack.Item fill>
        <div style={{ height: "40vh", width: "20%", margin: "0 auto" }}>
          <Thumbnail source={pointedImage ? pointedImage : NoProductImage} alt={""} size={"extralarge"} />
        </div>
      </Stack.Item>
      <Stack.Item>
        <div style={{ margin: "0 auto", display: 'flex', justifyContent: 'center' }}>
          {/* {mainProduct["image_array"] && */}
            {/* mainProduct["image_array"]. */}
            {imageArray.map((image, index) => {
              return (
                <Image
                  preview={false}
                  width={"5%"}
                  height={'100px'}
                  style={{padding: '0px 10px'}}
                  src={image}
                  onMouseOver={(e) => {
                    setPointedImage(e.target.src);
                  }}
                  key={index}
                />
              );
            })}
        </div>
      </Stack.Item>
    </Stack>
  );
};

export default ImagesComponent;
