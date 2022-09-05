import { stateArray } from "../../Panel/Marketplaces/Ebay/Configurations/Components/ProductSettingsNewNew/Helper/sampleData";

export const order_settings = {
  autoOrderSync: true,
  includeTax: true,
  inventoryBehavioursetting: "decrement_obeying_policy",
  syncWithoutProductdetails: false,
  setOrderNote: "default",
  setOrderTags: "default",
  setOrderName: "default",
  useEbayCustomerDetails: true,
  shipmentSync: {
    withoutTrackingDetails: true,
    mappingOfShippingCarrier: false,
  },
  orderCancelation: [
    {
      shopifyAttribute: "Other",
      ebayAttribute: "UNKNOWN",
    },
  ],
};
// export const order_settings = {
//   default: {
//     autoOrderSync: {
//       enable: "yes",
//     },
//     includeTax: {
//       enable: "yes",
//     },
//     trackInventoryFromShopify: {
//       enable: "yes",
//     },
//     syncWithoutProductdetails: {
//       enable: "yes",
//     },
//     setOrderNote: {
//       enable: "yes",
//       attribute: {
//         orderNote: {
//           value: "",
//         },
//       },
//     },
//     setOrderTags: {
//       enable: "yes",
//       attribute: {
//         orderTags: {
//           value: "",
//         },
//       },
//     },
//     shippingService: {
//       enable: "yes",
//       attribute: {
//         mappingOfShippingService: {
//           label: "Mapping of Shipping Service",
//           enable: "yes",
//           type: "mappingBoolean",
//           value: "yes",
//           shippingServiceMapping: {
//             mapping: {
//               "#1": {
//                 customAttribute: {
//                   label: "Shopify Shipping Service",
//                   value: "",
//                 },
//                 shopifyAttribute: {
//                   label: "eBay Shipping Service",
//                   value: "",
//                 },
//               },
//             },
//             counter: 1,
//           },
//         },
//       },
//     },
//     userRealCustomerDetails: {
//       enable: "yes",
//       attribute: {
//         email: {
//           label: "Email",
//           enable: "yes",
//           type: "textfield",
//           value: "",
//         },
//         name: {
//           label: "Name",
//           enable: "yes",
//           type: "textfield",
//           value: "",
//         },
//       },
//     },
//     shipmentSync: {
//       enable: "yes",
//       attribute: {
//         withoutTrackingDetails: {
//           label: "Without Tracking details",
//           enable: "yes",
//           type: "boolean",
//           options: [
//             {
//               label: "Yes",
//               value: "yes",
//             },
//             {
//               label: "No",
//               value: "no",
//             },
//           ],
//           value: "no",
//         },
//         mappingOfShippingCarrier: {
//           label: "Mapping of Shipping Carrier",
//           enable: "yes",
//           type: "mappingBoolean",
//           value: "no",
//           shippingCarrierMapping: {
//             mapping: {
//               "#1": {
//                 customAttribute: {
//                   label: "Shopify Carrier",
//                   value: "",
//                 },
//                 shopifyAttribute: {
//                   label: "eBay Carrier",
//                   value: "",
//                 },
//               },
//             },
//             counter: 1,
//           },
//         },
//       },
//     },
//     orderCancelation: {
//       enable: "yes",
//       attribute: {
//         mappingOfOrderCancellation: {
//           label: "Mapping of Order Cancellation",
//           enable: "yes",
//           type: "mappingBoolean",
//           value: "yes",
//           orderCancellationReasonMapping: {
//             mapping: [],
//             counter: 0,
//           },
//         },
//       },
//     },
//   },
// };

export const product_settings = {
  shopify_to_app: {
    autoProductSync: {
      title: true,
      description: true,
      vendor: true,
      price: true,
      quantity: true,
      weight: true,
      weight_unit: true,
      sku: true,
      product_type: true,
      images: true,
      tags: true,
    },
    autoDeleteProduct: true,
    autoProductCreate: true,
  },
  app_to_ebay: {
    // default: {
    //   autoProductSync: {
    //     enable: "yes",
    //     attribute: {
    //       title: "yes",
    //       description: "yes",
    //       main_image: "yes",
    //       weight: "yes",
    //       item_specifics: "yes",
    //       variation_pictures: "yes",
    //       quantity: "yes",
    //       price: "yes",
    //     },
    //   },
    //   autoEndProduct: {
    //     enable: "yes",
    //   },
    //   autoListProduct: {
    //     enable: "no",
    //   },
    //   vatDetails: {
    //     enable: "yes",
    //     attribute: {
    //       businessSeller: "no",
    //       restrictedToBusiness: "yes",
    //       vatPercentage: "",
    //     },
    //   },
    //   itemLocation: {
    //     enable: "yes",
    //     attribute: {
    //       country: "US",
    //       zipcode: "99950",
    //       location: "Au",
    //     },
    //   },
    //   shopifyWarehouses: {
    //     enable: "yes",
    //     shopifyWarehouseValue: [],
    //   },
    //   currencyConversion: {
    //     enable: "yes",
    //     attribute: {
    //       shopifyCurrency: "",
    //       ebayCurrency: "",
    //     },
    //   },
    //   match_from_ebay: {
    //     enable: "yes",
    //     attributeMapping: [
    //       {
    //         shopify_attribute: "title",
    //         ebay_attribute: "Title",
    //       },
    //       {
    //         shopify_attribute: "sku",
    //         ebay_attribute: "SKU",
    //       },
    //     ],
    //   },
    // },
  },
};

export const productSettingsDataShop = {
  autoProductSync: {
    title: true,
    description: true,
    main_image: true,
    weight: true,
    item_specifics: true,
    variation_pictures: true,
    quantity: true,
    price: true,
  },
  autoEndProduct: true,
  autoListProduct: false,
  salesTaxDetails: {
    useEbayTaxRateTable: false,
    state: stateArray[0]["value"],
    taxPercentage: "",
    alsoApplyToShippingAndHandlingCosts: false,
  },
  vehicleDetails: {
    vehicleIdentificationNumber: "",
    restrictedToBusiness: "",
  },
  vatDetails: {
    businessSeller: false,
    restrictedToBusiness: true,
    vatPercentage: "",
  },
  shopifyWarehouses: [],
  currencyConversion: {
    shopifyCurrencyName: "",
    shopifyCurrencyValue: "",
    ebayCurrencyName: "",
    ebayCurrencyValue: "",
  },
  match_from_ebay: [
    {
      shopify_attribute: "title",
      ebay_attribute: "Title",
    },
  ],
};

// export const productSettingsDataShop = {
//   autoProductSync: {
//     enable: "yes",
//     attribute: {
//       title: "yes",
//       description: "yes",
//       main_image: "yes",
//       weight: "yes",
//       item_specifics: "yes",
//       variation_pictures: "yes",
//       quantity: "yes",
//       price: "yes",
//     },
//   },
//   autoEndProduct: {
//     enable: "yes",
//   },
//   autoListProduct: {
//     enable: "no",
//   },
//   vatDetails: {
//     enable: "yes",
//     attribute: {
//       businessSeller: "no",
//       restrictedToBusiness: "yes",
//       vatPercentage: "",
//     },
//   },
//   // itemLocation: {
//   //   enable: "yes",
//   //   attribute: {
//   //     country: "US",
//   //     zipcode: "99950",
//   //     location: "Au",
//   //   },
//   // },
//   shopifyWarehouses: {
//     enable: "yes",
//     shopifyWarehouseValue: [],
//   },
//   currencyConversion: {
//     enable: "yes",
//     attribute: {
//       shopifyCurrencyName: "",
//       shopifyCurrencyValue: "",
//       ebayCurrencyName: "",
//       ebayCurrencyValue: "",
//     },
//   },
//   match_from_ebay: {
//     enable: "yes",
//     attributeMapping: [
//       {
//         shopify_attribute: "title",
//         ebay_attribute: "Title",
//       },
//       {
//         shopify_attribute: "sku",
//         ebay_attribute: "SKU",
//       },
//     ],
//   },
// };
