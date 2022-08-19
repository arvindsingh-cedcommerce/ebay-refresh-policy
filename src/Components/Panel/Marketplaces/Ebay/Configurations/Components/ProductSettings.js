import { Button, Card, Stack } from "@shopify/polaris";
import { Checkbox, message } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { configurationAPI } from "../../../../../../APIrequests/ConfigurationAPI";
import { notify } from "../../../../../../services/notify";
import { getAppSettingsURL, saveAppSettingsShopifyToAppURL } from "../../../../../../URLs/ConfigurationURL";
import { getCountryName } from "../../../../Accounts/NewAccount";
import AppToEbay from "./ProductSettings/AppToEbay";
import ShopifyToApp from "./ProductSettings/ShopifyToApp";

export const shippingPackageType = [
    { label: "Unselect", value: "" },
    { label: "Bulky Goods", value: "C_BULKY_GOODS" },
    { label: "Caravan", value: "C_CARAVAN" },
    { label: "Cars", value: "C_CARS" },
    { label: "Custom Code", value: "C_CUSTOM_CODE" },
    { label: "Europallet", value: "C_EUROPALLET" },
    { label: "Expandable Tough Bags", value: "C_EXPANDABLE_TOUGH_BAGS" },
    { label: "ExtraLargePack", value: "C_EXTRA_LARGE_PACK" },
    { label: "Furniture", value: "C_FURNITURE" },
    { label: "Industry Vehicles", value: "C_INDUSTRY_VEHICLES" },
    { label: "Large Canada PostBox", value: "C_LARGE_CANADA_POST_BOX" },
    {
        label: "Large Canada Post Bubble Mailer",
        value: "C_LARGE_CANADA_POST_BUBBLE_MAILER",
    },
    { label: "Large Envelope", value: "C_LARGE_ENVELOPE" },
    { label: "Letter", value: "C_LETTER" },
    { label: "MailingBoxes", value: "C_MAILING_BOXES" },
    { label: "MediumCanadaPostBox", value: "C_MEDIUM_CANADA_POST_BOX" },
    {
        label: "MediumCanadaPostBubbleMailer",
        value: "C_MEDIUM_CANADA_POST_BUBBLE_MAILER",
    },
    { label: "Motorbikes", value: "C_MOTORBIKES" },
    { label: "None", value: "C_NONE" },
    { label: "One Way Pallet", value: "C_ONE_WAY_PALLET" },
    { label: "Package Thick Envelope", value: "C_PACKAGE_THICK_ENVELOPE" },
    { label: "Padded Bags", value: "C_PADDED_BAGS" },
    { label: "Parcel Or Padded Envelope", value: "C_PARCEL_OR_PADDED_ENVELOPE" },
    { label: "Roll", value: "C_ROLL" },
    { label: "Small Canada PostBox", value: "C_SMALL_CANADA_POST_BOX" },
    {
        label: "Small Canada Post BubbleMailer",
        value: "C_SMALL_CANADA_POST_BUBBLE_MAILER",
    },
    { label: "Tough Bags", value: "C_TOUGH_BAGS" },
    { label: "UPS Letter", value: "C_UPS_LETTER" },
    { label: "USPS Flat Rate Envelope", value: "C_USPS_FLAT_RATE_ENVELOPE" },
    { label: "USPS Large Pack", value: "C_USPS_LARGE_PACK" },
    { label: "Very Large Pack", value: "C_VERY_LARGE_PACK" },
    { label: "Winepak", value: "C_WINEPAK" },
];
const ProductSettings = () => {
    const [optionsVar, setOptionsVar] = useState({
        autoProductSync: {
            label: "Auto Product Syncing",
            enable: "yes",
            options: [
                {
                    label: "Yes",
                    value: "yes",
                },
                {
                    label: "No",
                    value: "no",
                },
            ],
            attribute: {
                title: {
                    label: "Title",
                    value: "yes",
                },
                type: {
                    label: "Type",
                    value: "yes",
                },
                vendor: {
                    label: "Vendor",
                    value: "yes",
                },
                price: {
                    label: "Price",
                    value: "yes",
                },
                quantity: {
                    label: "Quantity",
                    value: "yes",
                },
                weight: {
                    label: "Weight",
                    value: "yes",
                },
                weight_unit: {
                    label: "Weight Unit",
                    value: "yes",
                },
                sku: {
                    label: "SKU",
                    value: "yes",
                },
                product_type: {
                    label: "Product Type",
                    value: "yes",
                },
                images: {
                    label: "Images",
                    value: "yes",
                },
                tags: {
                    label: "Tags",
                    value: "yes",
                },
            },
        },
        autoDeleteProduct: {
            label: "Auto Delete Product",
            enable: "no",
            options: [
                {
                    label: "Yes",
                    value: "yes",
                },
                {
                    label: "No",
                    value: "no",
                },
            ],
        },
        autoProductCreate: {
            label: "Auto Product Create",
            enable: "no",
            options: [
                {
                    label: "Yes",
                    value: "yes",
                },
                {
                    label: "No",
                    value: "no",
                },
            ],
        },
        resetEditedFields: {
            label: "Reset All Edited fields",
            enable: "no",
            options: [
                {
                    label: "Yes",
                    value: "yes",
                },
                {
                    label: "No",
                    value: "no",
                },
            ],
        },
    });
    const [connectedAccountsObject, setconnectedAccountsObject] = useState({});

    const getAllConnectedAccounts = async () => {
        let { success: accountConnectedSuccess, data: connectedAccountData } =
            await getConnectedAccounts();
        if (accountConnectedSuccess) {
            let ebayAccounts = connectedAccountData.filter(
                (account) => account["marketplace"] === "ebay"
            );
            let ebayAccountsObj = {
                Default: {
                    checked: true,
                    value: "default",
                    shopId: "default",
                    label: "Default",
                    fields: {
                        autoProductSync: {
                            label: "Auto Product Syncing",
                            enable: "yes",
                            options: [
                                {
                                    label: "Yes",
                                    value: "yes",
                                },
                                {
                                    label: "No",
                                    value: "no",
                                },
                            ],
                            attribute: {
                                title: {
                                    label: "Title",
                                    value: "yes",
                                },
                                description: {
                                    label: "Description",
                                    value: "yes",
                                },
                                main_image: {
                                    label: "Main Image",
                                    value: "yes",
                                },
                                weight: {
                                    label: "Weight",
                                    value: "yes",
                                },
                                item_specifics: {
                                    label: "Item Specifics",
                                    value: "yes",
                                },
                                variation_pictures: {
                                    label: "Variation Pictures",
                                    value: "yes",
                                },
                                quantity: {
                                    label: "Quantity",
                                    value: "yes",
                                },
                                price: {
                                    label: "Price",
                                    value: "yes",
                                },
                            },
                        },
                        autoEndProduct: {
                            label: "Auto End product",
                            enable: "no",
                            options: [
                                {
                                    label: "Yes",
                                    value: "yes",
                                },
                                {
                                    label: "No",
                                    value: "no",
                                },
                            ],
                        },
                        autoListProduct: {
                            label: "Auto List product",
                            enable: "no",
                            options: [
                                {
                                    label: "Yes",
                                    value: "yes",
                                },
                                {
                                    label: "No",
                                    value: "no",
                                },
                            ],
                        },
                    },
                },
            };
            ebayAccounts.forEach((account, key) => {
                let temp = {};
                temp["value"] = `${getCountryName(
                    account["warehouses"][0]["site_id"]
                )}-${account["warehouses"][0]["user_id"]}`;
                temp["siteID"] = account["warehouses"][0]["site_id"];
                temp["shopId"] = account["id"];
                temp["checked"] = false;
                temp["fields"] = {
                    autoProductSync: {
                        label: "Auto Product Syncing",
                        enable: "yes",
                        options: [
                            {
                                label: "Yes",
                                value: "yes",
                            },
                            {
                                label: "No",
                                value: "no",
                            },
                        ],
                        attribute: {
                            title: {
                                label: "Title",
                                value: "yes",
                            },
                            description: {
                                label: "Description",
                                value: "yes",
                            },
                            main_image: {
                                label: "Main Image",
                                value: "yes",
                            },
                            weight: {
                                label: "Weight",
                                value: "yes",
                            },
                            item_specifics: {
                                label: "Item Specifics",
                                value: "yes",
                            },
                            variation_pictures: {
                                label: "Variation Pictures",
                                value: "yes",
                            },
                            quantity: {
                                label: "Quantity",
                                value: "yes",
                            },
                            price: {
                                label: "Price",
                                value: "yes",
                            },
                        },
                    },
                    autoEndProduct: {
                        label: "Auto End product",
                        enable: "no",
                        options: [
                            {
                                label: "Yes",
                                value: "yes",
                            },
                            {
                                label: "No",
                                value: "no",
                            },
                        ],
                    },
                    autoListProduct: {
                        label: "Auto List product",
                        enable: "no",
                        options: [
                            {
                                label: "Yes",
                                value: "yes",
                            },
                            {
                                label: "No",
                                value: "no",
                            },
                        ],
                    },
                };
                ebayAccountsObj[
                    `${getCountryName(account["warehouses"][0]["site_id"])}-${account["warehouses"][0]["user_id"]
                    }`
                ] = temp;
            });
            setconnectedAccountsObject(ebayAccountsObj);
        }
    };

    useEffect(() => {
        getAllConnectedAccounts();
    }, []);

    const getSavedData = async () => {
        let { data, success } = await configurationAPI(getAppSettingsURL);
        if (success) {
            if (data?.data?.product_settings?.shopify_to_app) {
                let temp = { ...optionsVar };
                Object.keys(data.data.product_settings.shopify_to_app).forEach(id => {
                    temp[id]["enable"] =
                        data.data.product_settings.shopify_to_app[id]["enable"];
                    if (id === "autoProductSync") {
                        for (const attributeKey in temp[id]["attribute"]) {
                            temp[id]["attribute"][attributeKey]["value"] =
                                data.data.product_settings.shopify_to_app[id]["attribute"][attributeKey];
                        }
                    }
                })
                setOptionsVar(temp);
            } if (data?.data?.product_settings?.app_to_ebay) {
                let temp = { ...connectedAccountsObject }
                temp['Default']['checked'] = true
                Object.keys(data.data.product_settings.app_to_ebay).forEach(id => {
                    temp['Default']['fields'][id]["enable"] =
                        data.data.product_settings.app_to_ebay[id]["enable"];
                    if (id === "autoProductSync") {
                        for (const attributeKey in temp['Default']['fields'][id]["attribute"]) {
                            temp['Default']['fields'][id]["attribute"][attributeKey]["value"] =
                                data.data.product_settings.app_to_ebay[id]["attribute"][attributeKey];
                        }
                    }
                })
                setconnectedAccountsObject(temp)
            }
            if (data?.marketplace?.ebay?.shop) {
                let temp = { ...connectedAccountsObject }
                Object.keys(data.marketplace.ebay.shop).forEach(id => {
                    for (const key in temp) {
                        if (temp[key]['shopId'] == id) {
                            temp[key]['checked'] = true
                            for(const field in temp[key]['fields']) {
                                temp[key]['fields'][field]['enable'] = data.marketplace.ebay.shop[id]['data']['product_settings']['app_to_ebay'][field]['enable']
                                if(field === 'autoProductSync') {
                                    for(const key1 in temp[key]['fields'][field]['attribute']) {
                                        temp[key]['fields'][field]['attribute'][key1]['value'] = data.marketplace.ebay.shop[id]['data']['product_settings']['app_to_ebay'][field]['attribute'][key1]
                                    }
                                }
                            }
                        }
                    }
                })
                setconnectedAccountsObject(temp)
            }
        }
    };

    useEffect(() => {
        if (Object.keys(connectedAccountsObject).length) getSavedData();
    }, [Object.keys(connectedAccountsObject).length]);

    const saveDataAppToEbay = async () => {
        let tempObj = {
            app_to_ebay: {
            },
            setting_type: 'product_settings'
        };
        for (const account in connectedAccountsObject) {
            if (connectedAccountsObject[account]['checked']) {
                tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]] = {
                }
                Object.keys(connectedAccountsObject[account]['fields']).forEach(field => {
                    tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]][field] = {}
                    for (const key in connectedAccountsObject[account]['fields'][field]) {
                        if (key === 'enable') {
                            tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]][field][key] = connectedAccountsObject[account]['fields'][field][key]
                        } else if (key === 'attribute') {
                            tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]][field][key] = {}
                            for (const attribute1 in connectedAccountsObject[account]['fields'][field][key]) {
                                tempObj['app_to_ebay'][connectedAccountsObject[account]["shopId"]][field][key][attribute1] = connectedAccountsObject[account]['fields'][field][key][attribute1]['value']
                            }
                        }
                    }
                })
            }
        }
        let { success, message } = await configurationAPI(saveAppSettingsShopifyToAppURL, tempObj);
        if (success) {
            notify.success(message)
        }
    }

    return (
        <>
            <ShopifyToApp optionsVar={optionsVar} setOptionsVar={setOptionsVar} />
            <br />
            <Card sectioned>
                <Stack alignment="baseline">
                    <CheckboxComponent
                        connectedAccountsObject={connectedAccountsObject}
                        setconnectedAccountsObject={setconnectedAccountsObject}
                    />
                    <Button primary onClick={() => { saveDataAppToEbay() }}>
                        Save
                    </Button>
                </Stack>
                {Object.keys(connectedAccountsObject).map((account) => {
                    return (
                        connectedAccountsObject[account]["checked"] && (
                            <Card sectioned title={`From App to eBay ${account}`}>
                                <Card.Section>
                                    <AppToEbay
                                        connectedAccountsObject={connectedAccountsObject}
                                        setconnectedAccountsObject={setconnectedAccountsObject}
                                        account={account}
                                    />
                                </Card.Section>
                            </Card>
                        )
                    );
                })}
            </Card>
        </>
    );
};

export default ProductSettings;

export const CheckboxComponent = ({
    connectedAccountsObject,
    setconnectedAccountsObject,
}) => {
    return (
        <Stack>
            <>Account Selection-:</>
            {connectedAccountsObject &&
                Object.keys(connectedAccountsObject).map((account, index) => {
                    return (
                        <Checkbox
                            checked={connectedAccountsObject[account]["checked"]}
                            onChange={(e) => {
                                let temp = { ...connectedAccountsObject };
                                temp[account]["checked"] = e.target.checked;
                                setconnectedAccountsObject(temp);
                            }}
                        >
                            {account}
                        </Checkbox>
                    );
                })}
        </Stack>
    )
};
