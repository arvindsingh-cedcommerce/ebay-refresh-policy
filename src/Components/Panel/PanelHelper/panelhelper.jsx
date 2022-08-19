import { ProfileMajorMonotone } from "@shopify/polaris-icons";

export const marketplaceOptions = [
        {label : 'eBay', value: 'ebay'},
        {label : 'Amazon', value: 'amazon'},
    ];

export const subMenuOptions = [
    { label : 'Accounts', value: 'accounts', icon : ProfileMajorMonotone}
]

export function getMarketplace(marketplace){
    let marketplaceName = marketplaceOptions.filter(marketplaceObj => marketplaceObj.value === marketplace);
     if(marketplaceName.length) return marketplaceName[0]['label'];
     else return '';
}


