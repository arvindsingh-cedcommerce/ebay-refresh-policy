import React from "react";
import {Badge, Banner, DisplayText, Icon, MediaCard, Thumbnail, VideoThumbnail} from "@shopify/polaris";
import {MarketingMajorMonotone} from "@shopify/polaris-icons";
import NotFound from "../assets/notfound.png";

export function bannerPolaris(title="", message="", status="warning", icon = MarketingMajorMonotone, action= false) {
    return (<Banner title={title} status={status} icon={icon} action={action}>
        {message}
    </Banner>)
}

export function thumbnail(source, alt, size){
    return <Thumbnail source={source} alt={alt} size={size}/>
}

export function displayText(size, element, children =[]){
    return <DisplayText size={size} element={element} children={children}/>
}

export function mediaCardPolaris( title ="", description = "", children =[], primaryAction = false, popOverAction = []){
    return <MediaCard
    title={title}
    primaryAction={primaryAction}
    description={description}
    popoverActions={popOverAction}
  >
      {
        children
      }
  </MediaCard>
}

export function imageComponent(src="", style={}, alt=''){
    return <img
    alt={alt}
    width="100%"
    height="100%"
    style={style}
    src= {""? NotFound: src}
  />
}

export function videoThumbnailPolaris(url = "", onClick = ()=>{},showVideoProgress= true){
    return <VideoThumbnail
        onClick={onClick}
        showVideoProgress={ showVideoProgress}
        thumbnailUrl={url}
    />
}

export function getBadgePolaris(children='', status = 'info',size = 'small',  progress='complete'){
    return <Badge children={children} size={size} status={status} progress={progress}/>
}

export function polarisIcon(source = '', color = false){
    return <Icon
    source={source}
    color={color}
    />
}