const saveData = {
  shopifyToApp: {
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
        enable: "no",
      },
      autoProductCreate: {
        enable: "no",
      },
      resetEditedFields: {
        enable: "no",
      },
    },
    setting_type: "product_settings",
  },
  appToEbay: {
    app_to_ebay: {
      default: {
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
          enable: "no",
        },
        autoListProduct: {
          enable: "no",
        },
        vatDetails: {
          enable: "yes",
          attribute: {
            businessSeller: "yes",
            restrictedToBusiness: "yes",
            vatPercentage: "",
          },
        },
        itemLocation: {
          enable: "yes",
          attribute: {
            country: "BA",
            zipcode: "",
          },
        },
        shopifyWarehouses: {
          enable: "yes",
          shopifyWarehouseValue: [],
        },
        currencyConversion: {
          enable: "no",
          attribute: {
            shopifyCurrency: "",
            ebayCurrency: "13",
          },
        },
      },
    },
    setting_type: "product_settings",
  },
  order_settings: {
    default: {
      autoOrderSync: {
        enable: "yes",
      },
      includeTax: {
        enable: "no",
      },
      trackInventoryFromShopify: {
        enable: "no",
      },
      syncWithoutProductdetails: {
        enable: "no",
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
        enable: "no",
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
        enable: "no",
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
        enable: "no",
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
        enable: "no",
        attribute: {
          mappingOfOrderCancellation: {
            label: "Mapping of Order Cancellation",
            enable: "yes",
            type: "mappingBoolean",
            value: "yes",
            orderCancellationReasonMapping: {
              mapping: {
                "#1": {
                  customAttribute: {
                    label: "Shopify Reason",
                    value: "",
                  },
                  shopifyAttribute: {
                    label: "eBay Reason",
                    value: "",
                  },
                },
              },
              counter: 1,
            },
          },
        },
      },
    },
  },
  import_settings: {
    importAndReplaceProduct: {
      enable: "yes",
    },
    productType: {
      enable: "yes",
      value: "",
    },
    vendor: {
      enable: "yes",
      value: "",
    },
    publishedStatus: {
      enable: "yes",
      value: "",
    },
    productStatus: {
      enable: "yes",
      value: "",
    },
    import_collection: {
      enable: "yes",
      selected_collection: [],
    },
    match_from_ebay: {
      enable: "yes",
      match_from_ebay: {},
    },
  },
};
