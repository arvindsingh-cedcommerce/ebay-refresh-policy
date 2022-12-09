import React from "react";
import {accountLink, accountLinkCardStructure} from "../../../PolarisComponents/AccountconnectGroup";
import {json} from "../../../globalConstant/static-json";
import {Card, Stack} from "@shopify/polaris";
import {ReactJsonStructure, spinner} from "../../../PolarisComponents/InputGroups";


export let accountsSectiontabs = [
    {
      id: 'accounts-connected',
      content: 'Accounts',
      panelID: 'accounts-connected-content',
    }
    /*,
    {
        id: 'connection-panel',
        content: 'Connection panel',
        accessibilityLabel: 'Connection panel',
        panelID: 'connection-panel-content',
    }*/
  ];

export function accountsConnectedStructure(accounts = [], actionFunction, pathname = "ebay", activeInactiveFunction = () => {}, showUserDetails = () => {}){
    let accountConnectedStructure = [];
    let { shopify, amazon, ebay } = accounts;
    // shopify.forEach((shopifyshop) => {
    //     accountConnectedStructure.push(
    //         accountLink( 'Shopify', shopifyshop.label , 'Connect', actionFunction.bind(this, { marketplace: 'shopify', id: shopifyshop.id}), '', shopifyshop.shop_url,'', true, true)
    //     )
    // });
    if(pathname.includes('ebay')){
        ebay.forEach((ebayshop) => {
            let { warehouses } = ebayshop;
            let { status } = warehouses[0];
            status = status && status === "active";
            accountConnectedStructure.push(
                accountLinkCardStructure( actionFunction.bind(this, { marketplace : 'ebay', ...ebayshop}), activeInactiveFunction.bind(this, { marketplace : 'ebay', ...ebayshop}), status, ebayshop.label, (ebayshop.warehouses).length ?ebayshop.warehouses[0].user_id: '', showUserDetails.bind(this, "ebay", ebayshop), true)
            );
        //     accountConnectedStructure.push(
        //         accountLink( `eBay`, ebayshop.label , 'ReConnect', actionFunction.bind(this, { marketplace : 'ebay', ...ebayshop}), '', (ebayshop.warehouses).length ?ebayshop.warehouses[0].user_id: '','', true)
        // );
        });
    }

    if(pathname.includes('amazon')){
        amazon.forEach((amazonshop) => {
            let { warehouses } = amazonshop;
            let { status } = warehouses[0];
            status = status && status === "active";
            accountConnectedStructure.push(
                accountLinkCardStructure( actionFunction.bind(this, { marketplace: 'amazon', ...amazonshop}), activeInactiveFunction.bind(this, { marketplace: 'amazon', ...amazonshop}), status, amazonshop.label, warehouses[0].region?(warehouses[0].region).toUpperCase():'Not available', showUserDetails.bind(this, "amazon", amazonshop))
            );
            // accountConnectedStructure.push(
            //     accountLink( `Amazon`, amazonshop.label, 'ReConnect', actionFunction.bind(this, { marketplace: 'amazon', ...amazonshop}), '', warehouses[0].region?(warehouses[0].region).toUpperCase():'Not available','', true)
            // )
        });
    }
    return <Card><Card.Section>{accountConnectedStructure}</Card.Section></Card>;
}

export function getgeneralModalStrucuture(type, modalData = {}){
    switch(type){
        case "react_json": return ReactJsonStructure(modalData);
        case "loader" : return <Stack vertical={true} alignment={"center"}>{spinner("large", "teal", "Fetching shop details...")}</Stack>;
        default : break;
    }
}

export function getSiteName(siteId){
    let siteName = (json.flag_country).filter( sites => sites.value === siteId);
    if(siteName.length){
        return siteName[0]['label'];
    }
    return '';
}