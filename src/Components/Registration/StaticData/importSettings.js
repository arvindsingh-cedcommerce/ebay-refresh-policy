export const order_settings = {
  default: {
    autoOrderSync: {
      enable: "yes",
    },
    includeTax: {
      enable: "yes",
    },
    trackInventoryFromShopify: {
      enable: "yes",
    },
    syncWithoutProductdetails: {
      enable: "yes",
    },
    setOrderNote: {
      enable: "yes",
      attribute: {
        orderNote: {
          value: "",
        },
      },
    },
    setOrderTags: {
      enable: "yes",
      attribute: {
        orderTags: {
          value: "",
        },
      },
    },
    shippingService: {
      enable: "yes",
      attribute: {
        mappingOfShippingService: {
          label: "Mapping of Shipping Service",
          enable: "yes",
          type: "mappingBoolean",
          value: "yes",
          shippingServiceMapping: {
            mapping: {
              "#1": {
                customAttribute: {
                  label: "Shopify Shipping Service",
                  value: "",
                },
                shopifyAttribute: {
                  label: "eBay Shipping Service",
                  value: "",
                },
              },
            },
            counter: 1,
          },
        },
      },
    },
    userRealCustomerDetails: {
      enable: "yes",
      attribute: {
        email: {
          label: "Email",
          enable: "yes",
          type: "textfield",
          value: "",
        },
        name: {
          label: "Name",
          enable: "yes",
          type: "textfield",
          value: "",
        },
      },
    },
    shipmentSync: {
      enable: "yes",
      attribute: {
        withoutTrackingDetails: {
          label: "Without Tracking details",
          enable: "yes",
          type: "boolean",
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
          value: "no",
        },
        mappingOfShippingCarrier: {
          label: "Mapping of Shipping Carrier",
          enable: "yes",
          type: "mappingBoolean",
          value: "no",
          shippingCarrierMapping: {
            mapping: {
              "#1": {
                customAttribute: {
                  label: "Shopify Carrier",
                  value: "",
                },
                shopifyAttribute: {
                  label: "eBay Carrier",
                  value: "",
                },
              },
            },
            counter: 1,
          },
        },
      },
    },
    orderCancelation: {
      enable: "yes",
      attribute: {
        mappingOfOrderCancellation: {
          label: "Mapping of Order Cancellation",
          enable: "yes",
          type: "mappingBoolean",
          value: "yes",
          orderCancellationReasonMapping: {
            mapping: [],
            counter: 0,
          },
        },
      },
    },
  },
};

export const product_settings = {
  shopify_to_app: {
    autoProductSync: {
      enable: "yes",
      attribute: {
        title: "yes",
        vendor: "yes",
        price: "yes",
        quantity: "yes",
        weight: "yes",
        weight_unit: "yes",
        sku: "yes",
        product_type: "yes",
        images: "yes",
        tags: "yes",
      },
    },
    autoDeleteProduct: {
      enable: "yes",
    },
    autoProductCreate: {
      enable: "yes",
    },
    resetEditedFields: {
      enable: "yes",
    },
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
    enable: "yes",
    attribute: {
      title: "yes",
      description: "yes",
      main_image: "yes",
      weight: "yes",
      item_specifics: "yes",
      variation_pictures: "yes",
      quantity: "yes",
      price: "yes",
    },
  },
  autoEndProduct: {
    enable: "yes",
  },
  autoListProduct: {
    enable: "no",
  },
  vatDetails: {
    enable: "yes",
    attribute: {
      businessSeller: "no",
      restrictedToBusiness: "yes",
      vatPercentage: "",
    },
  },
  // itemLocation: {
  //   enable: "yes",
  //   attribute: {
  //     country: "US",
  //     zipcode: "99950",
  //     location: "Au",
  //   },
  // },
  shopifyWarehouses: {
    enable: "yes",
    shopifyWarehouseValue: [],
  },
  currencyConversion: {
    enable: "yes",
    attribute: {
      shopifyCurrency: "",
      ebayCurrency: "",
    },
  },
  match_from_ebay: {
    enable: "yes",
    attributeMapping: [
      {
        shopify_attribute: "title",
        ebay_attribute: "Title",
      },
      {
        shopify_attribute: "sku",
        ebay_attribute: "SKU",
      },
    ],
  },
};
