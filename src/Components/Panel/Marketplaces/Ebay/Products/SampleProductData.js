import {
  Button,
  Collapsible,
  Icon,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import { Popconfirm, Typography } from "antd";
import React from "react";

export const demoProductData = [
  {
    user_id: "60f7b89399ee8f7b5764d065",
    container_id: "4107431968846",
    main_image:
      "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/skin-care_c18143d5-6378-46aa-b0d7-526aee3bc776.jpg?v=1568611657",
    title: "The Scout Skincare Kit",
    additional_images: [],
    brand: "Ursa Major",
    description:
      '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p><meta charset="utf-8">\n<p><span>A collection of the best Ursa Major has to offer! "The Scout" kit contains travel sizes of their best selling skin care items including: </span></p>\n<ul>\n<li><span style="line-height: 1.4;">Face Wash (2 fl oz)</span></li>\n<li><span style="line-height: 1.4;">Shave Cream (2 fl oz)</span></li>\n<li><span style="line-height: 1.4;">Face Balm (0.5 fl oz)</span></li>\n<li><span style="line-height: 1.4;">5 tonic-infused bamboo Face Wipes</span></li>\n</ul>\n<p><span>All wrapped together in a great, reusable tin.</span><span class="aam"> </span></p>',
    product_type: "Accessories",
    app_codes: ["amazon_sales_channel"],
    variant_attributes: [],
    marketplace: {
      amazon: [
        {
          shop_id: "2727",
          process_tags: [],
          seller_id: "A3VSMOL1YWESR0",
        },
      ],
    },
    variants: [],
    source_product_id: "30008717475918",
    type: "simple",
    visibility: "Catalog and Search",
    quantity: 1,
  },
  {
    user_id: "60f7b89399ee8f7b5764d065",
    container_id: "4107432034382",
    main_image:
      "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7kg7f9mfx.jpg?v=1576151616",
    title: "test product",
    additional_images: [],
    brand: "test product",
    description: '<p>test product</p>\n<ul class="tabs-content"></ul>',
    product_type: "test product",
    app_codes: ["amazon_sales_channel"],
    variant_attributes: ["Size", "Color"],
    variants: [
      {
        container_id: "4107432034382",
        source_product_id: "30008717574222",
        sku: "43MCHBL2",
        variant_title: "S / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130219598",
            updated_at: "2019-12-12T11:53:53Z",
            available: 420,
            location_id: "33734623310",
            inventory_item_id: "31469130219598",
          },
        ],
        quantity: 420,
        barcode: "",
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717606990",
        sku: "43MCHBL3",
        variant_title: "M / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130252366",
            updated_at: "2019-09-16T05:27:38Z",
            available: 0,
            location_id: "33734623310",
            inventory_item_id: "31469130252366",
          },
        ],
        quantity: 0,
        barcode: null,
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/HarrietChambray_Longsleeves_25493de2-c72b-49a0-b319-d9d4117fae8e.jpg?v=1568611671",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717639758",
        sku: "43MCHBL4",
        variant_title: "L / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130285134",
            updated_at: "2019-09-16T05:27:39Z",
            available: 25,
            location_id: "33734623310",
            inventory_item_id: "31469130285134",
          },
        ],
        quantity: 25,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717672526",
        sku: "43MCHBL5",
        variant_title: "XL / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130317902",
            updated_at: "2019-09-16T05:27:39Z",
            available: 35,
            location_id: "33734623310",
            inventory_item_id: "31469130317902",
          },
        ],
        quantity: 35,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717574222",
        sku: "43MCHBL2",
        variant_title: "S / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130219598",
            updated_at: "2019-12-12T11:53:53Z",
            available: 420,
            location_id: "33734623310",
            inventory_item_id: "31469130219598",
          },
        ],
        quantity: 420,
        barcode: "",
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717606990",
        sku: "43MCHBL3",
        variant_title: "M / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130252366",
            updated_at: "2019-09-16T05:27:38Z",
            available: 0,
            location_id: "33734623310",
            inventory_item_id: "31469130252366",
          },
        ],
        quantity: 0,
        barcode: null,
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/HarrietChambray_Longsleeves_25493de2-c72b-49a0-b319-d9d4117fae8e.jpg?v=1568611671",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717639758",
        sku: "43MCHBL4",
        variant_title: "L / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130285134",
            updated_at: "2019-09-16T05:27:39Z",
            available: 25,
            location_id: "33734623310",
            inventory_item_id: "31469130285134",
          },
        ],
        quantity: 25,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717672526",
        sku: "43MCHBL5",
        variant_title: "XL / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130317902",
            updated_at: "2019-09-16T05:27:39Z",
            available: 35,
            location_id: "33734623310",
            inventory_item_id: "31469130317902",
          },
        ],
        quantity: 35,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717574222",
        sku: "43MCHBL2",
        variant_title: "S / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130219598",
            updated_at: "2019-12-12T11:53:53Z",
            available: 420,
            location_id: "33734623310",
            inventory_item_id: "31469130219598",
          },
        ],
        quantity: 420,
        barcode: "",
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717606990",
        sku: "43MCHBL3",
        variant_title: "M / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130252366",
            updated_at: "2019-09-16T05:27:38Z",
            available: 0,
            location_id: "33734623310",
            inventory_item_id: "31469130252366",
          },
        ],
        quantity: 0,
        barcode: null,
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/HarrietChambray_Longsleeves_25493de2-c72b-49a0-b319-d9d4117fae8e.jpg?v=1568611671",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717639758",
        sku: "43MCHBL4",
        variant_title: "L / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130285134",
            updated_at: "2019-09-16T05:27:39Z",
            available: 25,
            location_id: "33734623310",
            inventory_item_id: "31469130285134",
          },
        ],
        quantity: 25,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717672526",
        sku: "43MCHBL5",
        variant_title: "XL / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130317902",
            updated_at: "2019-09-16T05:27:39Z",
            available: 35,
            location_id: "33734623310",
            inventory_item_id: "31469130317902",
          },
        ],
        quantity: 35,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717574222",
        sku: "43MCHBL2",
        variant_title: "S / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130219598",
            updated_at: "2019-12-12T11:53:53Z",
            available: 420,
            location_id: "33734623310",
            inventory_item_id: "31469130219598",
          },
        ],
        quantity: 420,
        barcode: "",
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717606990",
        sku: "43MCHBL3",
        variant_title: "M / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130252366",
            updated_at: "2019-09-16T05:27:38Z",
            available: 0,
            location_id: "33734623310",
            inventory_item_id: "31469130252366",
          },
        ],
        quantity: 0,
        barcode: null,
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/HarrietChambray_Longsleeves_25493de2-c72b-49a0-b319-d9d4117fae8e.jpg?v=1568611671",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717639758",
        sku: "43MCHBL4",
        variant_title: "L / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130285134",
            updated_at: "2019-09-16T05:27:39Z",
            available: 25,
            location_id: "33734623310",
            inventory_item_id: "31469130285134",
          },
        ],
        quantity: 25,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717672526",
        sku: "43MCHBL5",
        variant_title: "XL / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130317902",
            updated_at: "2019-09-16T05:27:39Z",
            available: 35,
            location_id: "33734623310",
            inventory_item_id: "31469130317902",
          },
        ],
        quantity: 35,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717574222",
        sku: "43MCHBL2",
        variant_title: "S / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130219598",
            updated_at: "2019-12-12T11:53:53Z",
            available: 420,
            location_id: "33734623310",
            inventory_item_id: "31469130219598",
          },
        ],
        quantity: 420,
        barcode: "",
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717606990",
        sku: "43MCHBL3",
        variant_title: "M / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130252366",
            updated_at: "2019-09-16T05:27:38Z",
            available: 0,
            location_id: "33734623310",
            inventory_item_id: "31469130252366",
          },
        ],
        quantity: 0,
        barcode: null,
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/HarrietChambray_Longsleeves_25493de2-c72b-49a0-b319-d9d4117fae8e.jpg?v=1568611671",
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717639758",
        sku: "43MCHBL4",
        variant_title: "L / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130285134",
            updated_at: "2019-09-16T05:27:39Z",
            available: 25,
            location_id: "33734623310",
            inventory_item_id: "31469130285134",
          },
        ],
        quantity: 25,
        barcode: null,
        variant_image: null,
        price: 10,
      },
      {
        container_id: "4107432034382",
        source_product_id: "30008717672526",
        sku: "43MCHBL5",
        variant_title: "XL / red",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130317902",
            updated_at: "2019-09-16T05:27:39Z",
            available: 35,
            location_id: "33734623310",
            inventory_item_id: "31469130317902",
          },
        ],
        quantity: 35,
        barcode: null,
        variant_image: null,
        price: 10,
      },
    ],
    source_product_id: "4107432034382",
    type: "variation",
    visibility: "Catalog and Search",
  },
  {
    user_id: "60f7b89399ee8f7b5764d065",
    container_id: "4107432067150",
    main_image:
      "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/lodge_women_white2_df6cafb7-1756-4991-8f1c-e074ecf4a5f2.jpg?v=1568611660",
    title: "Lodge",
    additional_images: [],
    brand: "United By Blue",
    description:
      '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p>\n<p>The lodge, after a day of white slopes, is a place of revelry, blazing fires and high spirits.</p>\n<ul>\n<li><span style="line-height: 1.4;">100% organic cotton, stone washed slub knit 6 oz jersey fabric</span></li>\n</ul>',
    product_type: "Womens",
    app_codes: ["amazon_sales_channel"],
    variant_attributes: ["Color", "Size"],
    variants: [
      {
        container_id: "4107432067150",
        source_product_id: "30008717738062",
        sku: "33WSLWHV1",
        variant_title: "White / XS",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130416206",
            updated_at: "2019-09-16T05:27:41Z",
            available: 1,
            location_id: "33734623310",
            inventory_item_id: "31469130416206",
          },
        ],
        quantity: 1,
        barcode: null,
        variant_image: null,
      },
      {
        container_id: "4107432067150",
        source_product_id: "30008717770830",
        sku: "33WSLWHV2",
        variant_title: "White / S",
        type: "simple",
        visibility: "Not Visible Individually",
        locations: [
          {
            admin_graphql_api_id:
              "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130448974",
            updated_at: "2019-09-16T05:27:41Z",
            available: 1,
            location_id: "33734623310",
            inventory_item_id: "31469130448974",
          },
        ],
        quantity: 1,
        barcode: null,
        variant_image:
          "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/HarrietChambray_Longsleeves_25493de2-c72b-49a0-b319-d9d4117fae8e.jpg?v=1568611671",
      },
      // {
      //   container_id: "4107432067150",
      //   source_product_id: "30008717803598",
      //   sku: "33WSLWHV3",
      //   variant_title: "White / M",
      //   type: "simple",
      //   visibility: "Not Visible Individually",
      //   locations: [
      //     {
      //       admin_graphql_api_id:
      //         "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130481742",
      //       updated_at: "2019-09-16T05:27:41Z",
      //       available: 1,
      //       location_id: "33734623310",
      //       inventory_item_id: "31469130481742",
      //     },
      //   ],
      //   quantity: 1,
      //   barcode: null,
      //   variant_image: null,
      // },
      // {
      //   container_id: "4107432067150",
      //   source_product_id: "30008717836366",
      //   sku: "33WSLWHV4",
      //   variant_title: "White / L",
      //   type: "simple",
      //   visibility: "Not Visible Individually",
      //   locations: [
      //     {
      //       admin_graphql_api_id:
      //         "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130514510",
      //       updated_at: "2019-09-16T05:27:41Z",
      //       available: 1,
      //       location_id: "33734623310",
      //       inventory_item_id: "31469130514510",
      //     },
      //   ],
      //   quantity: 1,
      //   barcode: null,
      //   variant_image: null,
      // },
      // {
      //   container_id: "4107432067150",
      //   source_product_id: "30008717869134",
      //   sku: "33WSLWHV5",
      //   variant_title: "White / XL",
      //   type: "simple",
      //   visibility: "Not Visible Individually",
      //   locations: [
      //     {
      //       admin_graphql_api_id:
      //         "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130547278",
      //       updated_at: "2019-09-16T05:27:41Z",
      //       available: 1,
      //       location_id: "33734623310",
      //       inventory_item_id: "31469130547278",
      //     },
      //   ],
      //   quantity: 1,
      //   barcode: null,
      //   variant_image: null,
      // },
    ],
    source_product_id: "4107432067150",
    type: "variation",
    visibility: "Catalog and Search",
  },
];

export const singleProductData = [
  [
    {
      _id: "9760858",
      type: "simple",
      container_id: "4107431968846",
      title: "The Scout Skincare Kit",
      brand: "Ursa Major",
      product_type: "Accessories",
      description:
        '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p><meta charset="utf-8">\n<p><span>A collection of the best Ursa Major has to offer! "The Scout" kit contains travel sizes of their best selling skin care items including: </span></p>\n<ul>\n<li><span style="line-height: 1.4;">Face Wash (2 fl oz)</span></li>\n<li><span style="line-height: 1.4;">Shave Cream (2 fl oz)</span></li>\n<li><span style="line-height: 1.4;">Face Balm (0.5 fl oz)</span></li>\n<li><span style="line-height: 1.4;">5 tonic-infused bamboo Face Wipes</span></li>\n</ul>\n<p><span>All wrapped together in a great, reusable tin.</span><span class="aam"> </span></p>',
      handle: "the-scout-skincare-kit",
      tags: "",
      template_suffix: null,
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/skin-care_c18143d5-6378-46aa-b0d7-526aee3bc776.jpg?v=1568611657",
      published_at: "2019-09-16T05:27:37Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      collection: [
        {
          collection_id: "141790281806",
          title: "Home page",
          __parentId: "gid://shopify/Product/4107431968846",
          gid: "gid://shopify/Collection/141790281806",
        },
      ],
      variant_title: "Default Title",
      position: 1,
      sku: "",
      price: 36,
      compare_at_price: null,
      quantity: 1,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: true,
      fulfillment_service: "manual",
      variant_image: null,
      inventory_item_id: "31469130154062",
      inventory_tracked: false,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130154062",
          updated_at: "2019-09-16T05:27:38Z",
          available: 1,
          location_id: "33734623310",
          inventory_item_id: "31469130154062",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717475918",
      is_imported: 1,
      visibility: "Catalog and Search",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      additional_images: [],
      variant_attributes: [],
      low_sku: "",
      marketplace: {
        amazon: [
          {
            shop_id: "2727",
            process_tags: [],
            seller_id: "A3VSMOL1YWESR0",
          },
        ],
      },
      price_with_currency: "36 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
  ],
  [
    {
      _id: "9760859",
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "4107432034382",
      container_id: "4107432034382",
      title: "test product",
      description: '<p>test product</p>\n<ul class="tabs-content"></ul>',
      type: "variation",
      brand: "test product",
      product_type: "test product",
      additional_images: [],
      is_imported: 1,
      visibility: "Catalog and Search",
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7kg7f9mfx.jpg?v=1576151616",
      variant_attributes: ["Size", "Color"],
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      created_at: "2021-09-30 12:51:59",
      source_marketplace: "shopify",
      low_sku: "",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760860",
      type: "simple",
      group_id: "4107432034382",
      container_id: "4107432034382",
      title: "test product",
      brand: "test product",
      product_type: "test product",
      description: '<p>test product</p>\n<ul class="tabs-content"></ul>',
      handle: "ayers-chambray",
      tags: "Shirts,test product",
      template_suffix: "",
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7kg7f9mfx.jpg?v=1576151616",
      published_at: "2019-09-16T05:27:38Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      additional_images: [
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/chambray_5f232530-4331-492a-872c-81c225d6bafd.jpg?v=1576151616",
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
      ],
      variant_attributes: ["Size", "Color"],
      variant_attributes_values: {
        Size: "S",
        Color: "red",
      },
      variant_title: "S / red",
      position: 1,
      sku: "43MCHBL2",
      price: 420,
      compare_at_price: null,
      quantity: 420,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: "",
      inventory_policy: "DENY",
      taxable: false,
      fulfillment_service: "manual",
      variant_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
      Size: "S",
      Color: "red",
      inventory_item_id: "31469130219598",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130219598",
          updated_at: "2019-12-12T11:53:53Z",
          available: 420,
          location_id: "33734623310",
          inventory_item_id: "31469130219598",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717574222",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "43mchbl2",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      price_with_currency: "420 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760861",
      type: "simple",
      group_id: "4107432034382",
      container_id: "4107432034382",
      title: "test product",
      brand: "test product",
      product_type: "test product",
      description: '<p>test product</p>\n<ul class="tabs-content"></ul>',
      handle: "ayers-chambray",
      tags: "Shirts,test product",
      template_suffix: "",
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7kg7f9mfx.jpg?v=1576151616",
      published_at: "2019-09-16T05:27:38Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      additional_images: [
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/chambray_5f232530-4331-492a-872c-81c225d6bafd.jpg?v=1576151616",
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
      ],
      variant_attributes: ["Size", "Color"],
      variant_attributes_values: {
        Size: "S",
        Color: "red",
      },
      variant_title: "M / red",
      position: 2,
      sku: "43MCHBL3",
      price: 98,
      compare_at_price: null,
      quantity: 0,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: false,
      fulfillment_service: "manual",
      variant_image: null,
      Size: "M",
      Color: "red",
      inventory_item_id: "31469130252366",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130252366",
          updated_at: "2019-09-16T05:27:38Z",
          available: 0,
          location_id: "33734623310",
          inventory_item_id: "31469130252366",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717606990",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "43mchbl3",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      price_with_currency: "98 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760862",
      type: "simple",
      group_id: "4107432034382",
      container_id: "4107432034382",
      title: "test product",
      brand: "test product",
      product_type: "test product",
      description: '<p>test product</p>\n<ul class="tabs-content"></ul>',
      handle: "ayers-chambray",
      tags: "Shirts,test product",
      template_suffix: "",
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7kg7f9mfx.jpg?v=1576151616",
      published_at: "2019-09-16T05:27:38Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      additional_images: [
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/chambray_5f232530-4331-492a-872c-81c225d6bafd.jpg?v=1576151616",
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
      ],
      variant_attributes: ["Size", "Color"],
      variant_attributes_values: {
        Size: "S",
        Color: "red",
      },
      variant_title: "L / red",
      position: 3,
      sku: "43MCHBL4",
      price: 98,
      compare_at_price: null,
      quantity: 25,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: false,
      fulfillment_service: "manual",
      variant_image: null,
      Size: "L",
      Color: "red",
      inventory_item_id: "31469130285134",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130285134",
          updated_at: "2019-09-16T05:27:39Z",
          available: 25,
          location_id: "33734623310",
          inventory_item_id: "31469130285134",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717639758",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "43mchbl4",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      price_with_currency: "98 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760863",
      type: "simple",
      group_id: "4107432034382",
      container_id: "4107432034382",
      title: "test product",
      brand: "test product",
      product_type: "test product",
      description: '<p>test product</p>\n<ul class="tabs-content"></ul>',
      handle: "ayers-chambray",
      tags: "Shirts,test product",
      template_suffix: "",
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7kg7f9mfx.jpg?v=1576151616",
      published_at: "2019-09-16T05:27:38Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      additional_images: [
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/chambray_5f232530-4331-492a-872c-81c225d6bafd.jpg?v=1576151616",
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/woman-359-womaniya-shoulder-bag-handicraft-jute-original-imae2gy7cyz3drhb.jpg?v=1576151611",
      ],
      variant_attributes: ["Size", "Color"],
      variant_attributes_values: {
        Size: "S",
        Color: "red",
      },
      variant_title: "XL / red",
      position: 4,
      sku: "43MCHBL5",
      price: 102,
      compare_at_price: null,
      quantity: 35,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: false,
      fulfillment_service: "manual",
      variant_image: null,
      Size: "XL",
      Color: "red",
      inventory_item_id: "31469130317902",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130317902",
          updated_at: "2019-09-16T05:27:39Z",
          available: 35,
          location_id: "33734623310",
          inventory_item_id: "31469130317902",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717672526",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "43mchbl5",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      price_with_currency: "102 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
  ],
  [
    {
      _id: "9760864",
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "4107432067150",
      container_id: "4107432067150",
      title: "Lodge",
      description:
        '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p>\n<p>The lodge, after a day of white slopes, is a place of revelry, blazing fires and high spirits.</p>\n<ul>\n<li><span style="line-height: 1.4;">100% organic cotton, stone washed slub knit 6 oz jersey fabric</span></li>\n</ul>',
      type: "variation",
      brand: "United By Blue",
      product_type: "Womens",
      additional_images: [],
      is_imported: 1,
      visibility: "Catalog and Search",
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/lodge_women_white2_df6cafb7-1756-4991-8f1c-e074ecf4a5f2.jpg?v=1568611660",
      variant_attributes: ["Color", "Size"],
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      created_at: "2021-09-30 12:51:59",
      source_marketplace: "shopify",
      low_sku: "",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760865",
      type: "simple",
      group_id: "4107432067150",
      container_id: "4107432067150",
      title: "Lodge",
      brand: "United By Blue",
      product_type: "Womens",
      description:
        '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p>\n<p>The lodge, after a day of white slopes, is a place of revelry, blazing fires and high spirits.</p>\n<ul>\n<li><span style="line-height: 1.4;">100% organic cotton, stone washed slub knit 6 oz jersey fabric</span></li>\n</ul>',
      handle: "lodge-womens-shirt",
      tags: "Shirts",
      template_suffix: null,
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/lodge_women_white2_df6cafb7-1756-4991-8f1c-e074ecf4a5f2.jpg?v=1568611660",
      published_at: "2019-09-16T05:27:39Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      variant_attributes: ["Color", "Size"],
      variant_attributes_values: {
        Color: "White",
        Size: "XS",
      },
      variant_title: "White / XS",
      position: 1,
      sku: "33WSLWHV1",
      price: 36,
      compare_at_price: null,
      quantity: 1,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: true,
      fulfillment_service: "manual",
      variant_image: null,
      Color: "White",
      Size: "XS",
      inventory_item_id: "31469130416206",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130416206",
          updated_at: "2019-09-16T05:27:41Z",
          available: 1,
          location_id: "33734623310",
          inventory_item_id: "31469130416206",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717738062",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "33wslwhv1",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      additional_images: [],
      price_with_currency: "36 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760866",
      type: "simple",
      group_id: "4107432067150",
      container_id: "4107432067150",
      title: "Lodge",
      brand: "United By Blue",
      product_type: "Womens",
      description:
        '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p>\n<p>The lodge, after a day of white slopes, is a place of revelry, blazing fires and high spirits.</p>\n<ul>\n<li><span style="line-height: 1.4;">100% organic cotton, stone washed slub knit 6 oz jersey fabric</span></li>\n</ul>',
      handle: "lodge-womens-shirt",
      tags: "Shirts",
      template_suffix: null,
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/lodge_women_white2_df6cafb7-1756-4991-8f1c-e074ecf4a5f2.jpg?v=1568611660",
      published_at: "2019-09-16T05:27:39Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      variant_attributes: ["Color", "Size"],
      variant_attributes_values: {
        Color: "White",
        Size: "XS",
      },
      variant_title: "White / S",
      position: 2,
      sku: "33WSLWHV2",
      price: 36,
      compare_at_price: null,
      quantity: 1,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: false,
      fulfillment_service: "manual",
      variant_image: null,
      Color: "White",
      Size: "S",
      inventory_item_id: "31469130448974",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130448974",
          updated_at: "2019-09-16T05:27:41Z",
          available: 1,
          location_id: "33734623310",
          inventory_item_id: "31469130448974",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717770830",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "33wslwhv2",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      additional_images: [],
      price_with_currency: "36 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760867",
      type: "simple",
      group_id: "4107432067150",
      container_id: "4107432067150",
      title: "Lodge",
      brand: "United By Blue",
      product_type: "Womens",
      description:
        '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p>\n<p>The lodge, after a day of white slopes, is a place of revelry, blazing fires and high spirits.</p>\n<ul>\n<li><span style="line-height: 1.4;">100% organic cotton, stone washed slub knit 6 oz jersey fabric</span></li>\n</ul>',
      handle: "lodge-womens-shirt",
      tags: "Shirts",
      template_suffix: null,
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/lodge_women_white2_df6cafb7-1756-4991-8f1c-e074ecf4a5f2.jpg?v=1568611660",
      published_at: "2019-09-16T05:27:39Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      variant_attributes: ["Color", "Size"],
      variant_attributes_values: {
        Color: "White",
        Size: "XS",
      },
      variant_title: "White / M",
      position: 3,
      sku: "33WSLWHV3",
      price: 36,
      compare_at_price: null,
      quantity: 1,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: false,
      fulfillment_service: "manual",
      variant_image: null,
      Color: "White",
      Size: "M",
      inventory_item_id: "31469130481742",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130481742",
          updated_at: "2019-09-16T05:27:41Z",
          available: 1,
          location_id: "33734623310",
          inventory_item_id: "31469130481742",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717803598",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "33wslwhv3",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      additional_images: [],
      price_with_currency: "36 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760868",
      type: "simple",
      group_id: "4107432067150",
      container_id: "4107432067150",
      title: "Lodge",
      brand: "United By Blue",
      product_type: "Womens",
      description:
        '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p>\n<p>The lodge, after a day of white slopes, is a place of revelry, blazing fires and high spirits.</p>\n<ul>\n<li><span style="line-height: 1.4;">100% organic cotton, stone washed slub knit 6 oz jersey fabric</span></li>\n</ul>',
      handle: "lodge-womens-shirt",
      tags: "Shirts",
      template_suffix: null,
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/lodge_women_white2_df6cafb7-1756-4991-8f1c-e074ecf4a5f2.jpg?v=1568611660",
      published_at: "2019-09-16T05:27:39Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      variant_attributes: ["Color", "Size"],
      variant_attributes_values: {
        Color: "White",
        Size: "XS",
      },
      variant_title: "White / L",
      position: 4,
      sku: "33WSLWHV4",
      price: 36,
      compare_at_price: null,
      quantity: 1,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: false,
      fulfillment_service: "manual",
      variant_image: null,
      Color: "White",
      Size: "L",
      inventory_item_id: "31469130514510",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130514510",
          updated_at: "2019-09-16T05:27:41Z",
          available: 1,
          location_id: "33734623310",
          inventory_item_id: "31469130514510",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717836366",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "33wslwhv4",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      additional_images: [],
      price_with_currency: "36 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
    {
      _id: "9760869",
      type: "simple",
      group_id: "4107432067150",
      container_id: "4107432067150",
      title: "Lodge",
      brand: "United By Blue",
      product_type: "Womens",
      description:
        '<p><em>This is a demonstration store. You can purchase products like this from <a href="http://unitedbyblue.com/" target="_blank">United By Blue</a>.</em></p>\n<p>The lodge, after a day of white slopes, is a place of revelry, blazing fires and high spirits.</p>\n<ul>\n<li><span style="line-height: 1.4;">100% organic cotton, stone washed slub knit 6 oz jersey fabric</span></li>\n</ul>',
      handle: "lodge-womens-shirt",
      tags: "Shirts",
      template_suffix: null,
      main_image:
        "https://cdn.shopify.com/s/files/1/0267/1443/9758/products/lodge_women_white2_df6cafb7-1756-4991-8f1c-e074ecf4a5f2.jpg?v=1568611660",
      published_at: "2019-09-16T05:27:39Z",
      created_at: "2021-09-30 12:51:59",
      updated_at: "2021-09-30T12:51:59+0000",
      variant_attributes: ["Color", "Size"],
      variant_attributes_values: {
        Color: "White",
        Size: "XS",
      },
      variant_title: "White / XL",
      position: 5,
      sku: "33WSLWHV5",
      price: 36,
      compare_at_price: null,
      quantity: 1,
      weight: 0,
      weight_unit: "KILOGRAMS",
      grams: 0,
      barcode: null,
      inventory_policy: "DENY",
      taxable: false,
      fulfillment_service: "manual",
      variant_image: null,
      Color: "White",
      Size: "XL",
      inventory_item_id: "31469130547278",
      inventory_tracked: true,
      requires_shipping: true,
      locations: [
        {
          admin_graphql_api_id:
            "gid://shopify/InventoryLevel/33502494798?inventory_item_id=31469130547278",
          updated_at: "2019-09-16T05:27:41Z",
          available: 1,
          location_id: "33734623310",
          inventory_item_id: "31469130547278",
        },
      ],
      user_id: "60f7b89399ee8f7b5764d065",
      source_product_id: "30008717869134",
      is_imported: 1,
      visibility: "Not Visible Individually",
      low_sku: "33wslwhv5",
      app_codes: ["amazon_sales_channel"],
      shop_id: "215",
      source_marketplace: "shopify",
      additional_images: [],
      price_with_currency: "36 INR",
      amazon_currency: "INR",
      edited_data: {
        profile_data: {
          profile_id: "default",
          profile_name: "default",
        },
        profile_id: "default",
        profile_name: "default",
      },
    },
  ],
];
export const productGridHeadings = [
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    // fixed: "left",
    width: 80,
    className: "show",
    label: "Image",
    value: "Image",
    checked: true,
    editable: true,
    // render: (text, record, index) => {
    //   return <p>hi</p>
    // }
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    className: "show",
    label: "Title",
    value: "Title",
    checked: true,
    editable: true,
    onCell: () => {},
  },
  {
    title: "Product Type",
    dataIndex: "productType",
    key: "productType",
    className: "show",
    label: "Product Type",
    value: "Product Type",
    checked: true,
    editable: true,
    width: 180,
  },
  {
    title: "Variant Attributes",
    dataIndex: "variantAttributes",
    key: "variantAttributes",
    className: "show",
    label: "Variant Attributes",
    value: "Variant Attributes",
    checked: true,
    editable: true,
    width: 180,
  },
  {
    title: "Variant Count",
    dataIndex: "variantsCount",
    key: "variantsCount",
    className: "show",
    label: "Variant Count",
    value: "Variant Count",
    checked: true,
    editable: true,
    width: 80,
  },
  {
    title: "Vendor",
    dataIndex: "vendor",
    key: "vendor",
    className: "show",
    label: "Vendor",
    value: "Vendor",
    checked: true,
    editable: true,
    width: 180,
  },
  {
    title: "Profile",
    dataIndex: "profile",
    key: "profile",
    className: "show",
    label: "Profile",
    value: "Profile",
    checked: true,
    editable: true,
    width: 80,
  },
];

export const variantGridHeadings = [
  {
    title: "Image",
    dataIndex: "variantImage",
    key: "variantImage",
    // fixed: "left",
    // width: 75,
    label: "Image",
    value: "Image",
  },
  {
    title: "Title",
    dataIndex: "variantTitle",
    key: "variantTitle",
    filters: [],
    onFilter: (value, record) => {
      // console.log("value, record", value, record);
      return record.variantTitle.indexOf(value) === 0;
    },
    // filteredValue: null,
    label: "Title",
    value: "Title",
  },
  {
    title: "SKU",
    dataIndex: "variantSKU",
    key: "variantSKU",
    // filters: [],
    // onFilter: (value, record) => record.variantSKU.indexOf(value) === 0,
    label: "SKU",
    value: "SKU",
  },
  {
    title: "Barcode",
    dataIndex: "variantBarcode",
    key: "variantBarcode",
    label: "Barcode",
    value: "Barcode",
  },
  {
    title: "Inventory",
    dataIndex: "variantQuantity",
    key: "variantQuantity",
    sorter: () => {},
    label: "Inventory",
    value: "Inventory",
  },
  {
    title: "Price",
    dataIndex: "variantPrice",
    key: "variantPrice",
    sorter: () => {},
    label: "Price",
    value: "Price",
  },
  {
    title: "Operations",
    dataIndex: "variantOperations",
    key: "variantOperations",
    label: "Operations",
    value: "Operations",
    render: () => {},
  },
];

export const getVariantData = (variantData) => {
  return variantData;
};

export const getFilteredDataFromProductListingAndEditListing = (
  productListingData,
  singleProductData
) => {
  // console.log(
  //   "productListingData",
  //   //  ,singleProductData

  //   productListingData
  //   // singleProductData
  // );
  let productsData = [];
  let mainProduct = {};
  let variations = [];
  singleProductData.forEach((data) => {
    if (data && data.length) {
      if (data.length === 1) {
        mainProduct = { ...data[0] };
        variations = [{ ...data[0] }];
      } else if (data.length > 1) {
        data.forEach((eachData) => {
          if (!eachData.hasOwnProperty("sku")) {
            mainProduct = Object.assign({}, eachData);
          }
        });
        variations = [
          ...data.filter((variant, index) => variant.hasOwnProperty("sku")),
        ];
      }
      productsData = [...productsData, mainProduct];
    }
  });
  let filteredData = productsData.filter(
    (productData) =>
      productData["container_id"] === productListingData["container_id"]
  );
  // console.log("filteredData", filteredData);

  let previewData = {};
  previewData["Title"] = filteredData[0]["title"];
  previewData["Description"] = filteredData[0]["description"];
  previewData["Vendor"] = filteredData[0]["brand"];
  previewData["Product Type"] = filteredData[0]["product_type"];
  return previewData;
};

export const getDataForPreviewComponent = (record) => {
  let previewData = {};
  previewData["Title"] = record["title"];
  previewData["Description"] = record["description"];
  previewData["Vendor"] = record["vendor"];
  previewData["Product Type"] = record["productType"];
  return previewData;
};

export const ImageResizer = (image) => {
  let setExtension = ["jpg", "jpeg", "png", "gif"].filter((extension) =>
    image.includes(extension)
  );
  let reducedImageInSize = image;
  reducedImageInSize = reducedImageInSize.replace(
    `.${setExtension}`,
    `_medium.${setExtension}`
  );
  return reducedImageInSize;
};

export const defaultCheckedList = ["Image", "Title"];

export const productGridTabs = [
  "All",
  "Uploaded",
  "Not Uploaded",
  "Ended",
  "Error",
];

export const timezone = [
  { label: "GMT", value: "GMT" },
  { label: "UTC", value: "UTC" },
  { label: "ECT", value: "GMT+1:00" },
  { label: "EET", value: "GMT+2:00" },
  { label: "ART", value: "GMT+2:00" },
  { label: "EAT", value: "GMT+3:00" },
  { label: "MET", value: "GMT+3:30" },
  { label: "NET", value: "GMT+4:00" },
  { label: "PLT", value: "GMT+5:00" },
  { label: "IST", value: "GMT+5:30" },
  { label: "BST", value: "GMT+6:00" },
  { label: "VST", value: "GMT+7:00" },
  { label: "CTT", value: "GMT+8:00" },
  { label: "JST", value: "GMT+9:00" },
  { label: "ACT", value: "GMT+9:30" },
  { label: "AET", value: "GMT+10:00" },
  { label: "SST", value: "GMT+11:00" },
  { label: "NST", value: "GMT+12:00" },
  { label: "MIT", value: "GMT-11:00" },
  { label: "HST", value: "GMT-10:00" },
  { label: "AST", value: "GMT-9:00" },
  { label: "AST", value: "GMT-8:00" },
  { label: "PST", value: "GMT-8:00" },
  { label: "PNT", value: "GMT-7:00" },
  { label: "MST", value: "GMT-7:00" },
  { label: "CST", value: "GMT-6:00" },
  { label: "EST", value: "GMT-5:00" },
  { label: "IET", value: "GMT-5:00" },
  { label: "PRT", value: "GMT-4:00" },
  { label: "CNT", value: "GMT-3:30" },
  { label: "AGT", value: "GMT-3:00" },
  { label: "BET", value: "GMT-3:00" },
  { label: "CAT", value: "GMT-1:00" },
];

export const getPrefferedTimeOptions = () => {
  let options = [];
  let i = 0;
  while (i <= 21) {
    options = [
      ...options,
      { label: `${i}:00 - ${i + 3}:00`, value: `${i}:00 - ${i + 3}:00` },
    ];
    i += 3;
  }
  return options;
};

export const preferredTime = getPrefferedTimeOptions();

export const faqs = [
  {
    id: 5,
    show: false, // for collapse div
    search: true, // for search
    ques: "Before you can list this item we need some additional information to create a seller account",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This response comes when a seller starts selling on eBay, so you
            need to select an automatic payment method for your selling fees and
            eBay is requiring the credit card information. Please log into your
            eBay account and add an automatic payment method for your eBay
            selling fees.
          </li>
          <li className={"mb-2"}>
            <a
              href={
                "https://cedcommerce.com/blog/how-to-add-payment-methods-on-ebay/"
              }
              target={"_blank"}
            >
              For additional help click here
            </a>
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 2,
    show: false, // for collapse div
    search: true, // for search
    ques: "The item specific Size Type is missing. Add Size Type to this listing, enter a valid value, and then try again",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            The size is not provided in the products(this error arise in
            clothing products). You can do this from your shopify store,
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 23,
    show: false, // for collapse div
    search: true, // for search
    ques: "How to connect my eBay seller account with app",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            You need to authenticate your seller account with our app at second
            step of registration,
          </li>
          <li className="mb-2">
            If you need to reconnect with different details you can do so from
            the Accounts section of the app.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 1,
    show: false, // for collapse div
    search: true, // for search
    ques: "The package weight is not valid or is missing. Provide a valid number for the weight",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This issue occurs only when a merchant has opted for calculated
            service type in the shipping policy.
          </li>
          <li className="mb-2">
            The calculated service type requires weight for the products
            therefore you need to provide the weight for the products from your
            shopify store or in the app as well.
          </li>
          <li>
            If you don't provide the weight to all the products you can simply
            change the calculated service type to the flat service type (if it
            doesn't require weight for the products).
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  // {
  //   id: 2,
  //   show: false, // for collapse div
  //   search: true, // for search
  //   ques: "The item specific Size Type is missing. Add Size Type to this listing, enter a valid value, and then try again",
  //   ans: (
  //     <React.Fragment>
  //       <ul>
  //         <li className="mb-2">
  //           The size is not provided in the products(this error arise in
  //           clothing products). You can do this from your shopify store,
  //         </li>
  //       </ul>
  //     </React.Fragment>
  //   ),
  // },
  {
    id: 3,
    show: false, // for collapse div
    search: true, // for search
    ques: "You are not opted into Business Policies",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            You can opt out any time by selecting the Opt out link on the Manage
            business policies page. Your active listings won't be affected, but
            if you want to make changes to payment, shipping and returns terms,
            you’ll need to do that individually on each listing in the future.
            You can also opt back in to Business policies at any time. The
            policies you’ve already created will still be there, ready for you
            to use again
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 4,
    show: false, // for collapse div
    search: true, // for search
    ques: "A mixture of Self Hosted and EPS pictures are not allowed",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            The "self hosted" photos eBay is referring to your photos hosted at
            SSB. Anytime an image is sent by a third party service such as SSB,
            it's considered "self-hosted. eBay requires that eBay Picture
            Services (EPS) images be hosted on THEIR server.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  // {
  //   id: 5,
  //   show: false, // for collapse div
  //   search: true, // for search
  //   ques: "Before you can list this item we need some additional information to create a seller account",
  //   ans: (
  //     <React.Fragment>
  //       <ul>
  //         <li className="mb-2">
  //           This response comes when a seller starts selling on eBay, so you
  //           need to select an automatic payment method for your selling fees and
  //           eBay is requiring the credit card information. Please log into your
  //           eBay account and add an automatic payment method for your eBay
  //           selling fees.
  //         </li>
  //         <li className={"mb-2"}>
  //           <a
  //             href={
  //               "https://cedcommerce.com/blog/how-to-add-payment-methods-on-ebay/"
  //             }
  //             target={"_blank"}
  //           >
  //             For additional help click here
  //           </a>
  //         </li>
  //       </ul>
  //     </React.Fragment>
  //   ),
  // },
  {
    id: 6,
    show: false, // for collapse div
    search: true, // for search
    ques: "Variation Specifics provided does not match with the variation specifics of the variations on the item",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            An originally single variant product now being sent as a
            multi-variant product - eBay will not allow this so the product
            needs to be completely ended, deleted and re-listed.
          </li>
          <li>
            The variation data for the product from the eCommerce store is not
            particularly good e.g. different attribute names in different
            variants.
          </li>
          <li>
            So, it would have originally listed fine but now is not getting
            updated due to failing the validation rules.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 7,
    show: false, // for collapse div
    search: true, // for search
    ques: "The shipping service is not available for this item location. Select a different service",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This error means that the selected shipping service is not available
            for the item location that you have provided for the products.
          </li>
          <li className="mb-2">
            The wrong item location provided for the products, provide the
            correct country & Item location within the Configuration section. Go
            to: Configuration section -> Global configuration -> ZIP Code.
          </li>
          <li>
            The wrong Shipping Service provided for the products, select the
            different Shipping Service within the Shipping Policy. Go to :
            Business Policy -> Shipping Policy.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 8,
    show: false, // for collapse div
    search: true, // for search
    ques: "Brand should contain only one value. Remove the extra values and try again",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This error is because of wrong mapping in the category template.
          </li>
          <li className="mb-2">
            You have maped Brand with Additional Images. Kindly map Brand with
            Vendor.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 9,
    show: false, // for collapse div
    search: true, // for search
    ques: "The tags Custom Bundle is/are disabled as Variant? || Custom Bundle is not allowed as a variation specific",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This error is because of the wrong mapping in the category template.
          </li>
          <li className="mb-2">Correct mapping for Custom Bundle is size.</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 10,
    show: false, // for collapse div
    search: true, // for search
    ques: "Your item-location was not filled in. The location field helps buyers determine the shipping cost(s) for the item, and should always be included",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            Zip code or postal code is not filled.Please enter a valid ZIP code.
          </li>
          <li className="mb-2">Go To: Configuration -> Global Policy.</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 11,
    show: false, // for collapse div
    search: true, // for search
    ques: "Listing titles are limited to 80 characters",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            An eBay title has been entered that is greater than 80 characters.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 12,
    show: false, // for collapse div
    search: true, // for search
    ques: "Price should be greater than 0.99",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">Increase the price of your products.</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 13,
    show: false, // for collapse div
    search: true, // for search
    ques: "Duplicate custom variation label",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            When the SKU’s are of same in the product variants.Kindly provide
            different SKU’s.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 14,
    show: false, // for collapse div
    search: true, // for search
    ques: "You will be unable to complete this request until payment is made or a credit card is put on file for automatic monthly billing",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            If you are a new seller, you may encounter this error message when
            trying to create your first listing. eBay requires sellers to set up
            a payment method to pay final value fees and listing fees.
          </li>
          <li className="mb-2">
            <a
              href={
                "https://www.ebay.com/help/selling/fees-credits-invoices/setting-changing-payment-method?id=4124"
              }
              target={"_blank"}
            >
              Set up automatic payments on eBay
            </a>
            .
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 15,
    show: false, // for collapse div
    search: true, // for search
    ques: "The email address you entered is not linked to a PayPal account.",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This means the email address you have entered is not verified by
            eBay, therefore, you need to make sure the email address in your
            listing is the exact same email address you have attached to your
            PayPal account.
          </li>
          <li className="mb-2">
            <a
              href={
                "https://www.ebay.com/help/buying/paying-items/paying-paypal?id=4033"
              }
              target={"_blank"}
            >
              Paying with PayPal
            </a>
            .
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 16,
    show: false, // for collapse div
    search: true, // for search
    ques: "eBay account not connected",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            Connection breaks with your eBay seller account. Please reconnect
            with your eBay account.
          </li>
          <li className="mb-2">Go To: Top-Right Thumbnail -> Account</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 17,
    show: false, // for collapse div
    search: true, // for search
    ques: "Return Policy Attribute returnDescription Not Valid On This Site",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            You have to update the return policy from eBay seller panel and then
            sync with app and then again try to upload.{" "}
          </li>
          <li className="mb-2">
            Return description is allowed only on following eBay sites
            Germany:(DE), Austria:(AT), France:(FR), Italy:(IT), Spain:(ES),
            Motors
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 18,
    show: false, // for collapse div
    search: true, // for search
    ques: "Unable to send listing confirmation notice",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            {" "}
            When eBay don’t send listing confirmation mail to the sellers.It is
            just a acknowledgement message from eBay.
          </li>
        </ul>
      </React.Fragment>
    ),
  },

  {
    id: 19,
    show: false, // for collapse div
    search: true, // for search
    ques: 'Please select an international ship to location.||An error number "Shipto.CustomLocation.Required" occurred while processing your request.',
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            {" "}
            You have not chosen your international shipping destinations in the
            international shipping policy.
          </li>
          <li>Choose shipping destinations.</li>
          <li>
            From Business Policy>> Shipping policy >> underInternational
            Shipping Services
          </li>
        </ul>
      </React.Fragment>
    ),
  },

  {
    id: 20,
    show: false, // for collapse div
    search: true, // for search
    ques: "Invalid property type provided for PaymentProfileID. Expected integer but got NULL || Invalid property type provided for ReturnProfileID. Expected integer but got NULL || Invalid property type provided for ShippingProfileID. Expected integer but got NULL",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            Please make sure that the Default profile not empty and Business
            policy should be available on app.,
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 21,
    show: false, // for collapse div
    search: true, // for search
    ques: "Invalid <ShippingPackage>",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            No need to fill Package type value in Configuration -> App Settings
            -> Package Type. In case you have saved it then just unselect the
            value from first value of the dropdown,
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 22,
    show: false, // for collapse div
    search: true, // for search
    ques: "Invalid Multi-SKU item id supplied with variations.",
    ans: (
      <React.Fragment>
        <ul>
          <li>
            You are getting this error because the original item was not a
            Multi-SKU item and you are trying to relist it as a Multi-SKU item.
            If the original item was not listed as a Multi-SKU item, you cannot
            change it to be a Multi-SKU item during relist (or revise). You will
            need to create a new listing as a Multi-SKU item.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  // {
  //   id: 23,
  //   show: false, // for collapse div
  //   search: true, // for search
  //   ques: "How to connect my eBay seller account with app",
  //   ans: (
  //     <React.Fragment>
  //       <ul>
  //         <li className="mb-2">
  //           You need to authenticate your seller account with our app at second
  //           step of registration,
  //         </li>
  //         <li className="mb-2">
  //           If you need to reconnect with different details you can do so from
  //           the Accounts section of the app.
  //         </li>
  //       </ul>
  //     </React.Fragment>
  //   ),
  // },
  {
    id: 24,
    show: false,
    search: true,
    ques: "How to import already selling products and sync with Shopify ",
    ans: (
      <ul>
        <li className="mb-2">
          At Step 4 of registration you need to map eBay attributes with Shopify
          attributes and proceed.
        </li>
        <li className="mb-2">
          This will automatically initiate Product Import and syncing process.
        </li>
      </ul>
    ),
  },
  {
    id: 25,
    show: false, // for collapse div
    search: true, // for search
    ques: "Will my products get duplicated if i already sell on eBay and use this App",
    ans: (
      <ul>
        <li className="mb-2">No, Our app handles duplicate listing issue.</li>
      </ul>
    ),
  },

  {
    id: 26,
    show: false, // for collapse div
    search: true, // for search
    ques: "How to register for eBay seller account ",
    ans: (
      <ul>
        <li className="mb-2">
          Registration for an eBay seller account can be done using your email
          address,for more information kindly visit{" "}
          <a
            href={
              "https://www.eBay/help/account/signing-ebay-account/signing-ebay-account?id=4191"
            }
            target={"_blank"}
          >
            eBay help section
          </a>
          .
        </li>
      </ul>
    ),
  },
  {
    id: 27,
    show: false,
    search: true,
    ques: "What are the terms and conditions to apply for eBay seller account",
    ans: (
      <p>
        Though there are no prescribed terms and conditions, it is recommended
        that you go through{" "}
        <a
          href={"https://pages.ebay.in/terms-and-conditions/"}
          target={"_blank"}
        >
          terms and conditions{" "}
        </a>
        , put forth by eBay.{" "}
      </p>
    ),
  },
  {
    id: 28,
    show: false,
    search: true,
    ques: "What is profiling and what is Default Profile",
    ans: (
      <React.Fragment>
        <p className="text-justify">
          <b>Profiling</b> is a feature using which you can upload products with
          particular specifications by making your own customised profile (for
          example- all products with price 10$) from App to eBay marketplace.
        </p>

        <p className="text-justify">
          So whenever you want to upload bulk products you can simply make your
          customised profile with specifications of your choice and upload all
          products in one go.
        </p>

        {/*<p>In default Profile We Have Some Fixed Format. For Example Click <a href="javascript:void(0)" onClick={this.modalOpen}>Here</a></p>*/}
      </React.Fragment>
    ),
  },
  {
    id: 29,
    show: false,
    search: true,
    ques: "What do templates in the app stand for? Are they required",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            A listing template contains information that is required to create a
            product listing: title, description, images, and other information
            that you indicate on eBay’s Sell Your Item form. Multiple listing
            templates for each product can be assigned, which allows you to list
            products in multiple ways.
          </li>
          <li className="mb-2">
            Only <b>category template</b> is a required template.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 30,
    show: false,
    search: true,
    ques: "How to create a template",
    ans: (
      <React.Fragment>
        <p className="mb-2">You can create template by following steps </p>
        <ul>
          <li className="mb-2">
            Visit{" "}
            <a
              style={{ color: "blue" }}
              // onClick={this.redirect.bind(this, "/panel/template/list")}
            >
              <b>Templates</b>
            </a>{" "}
            section of the app .
          </li>
          <li className="mb-2">Select a template type you want to create.</li>
          <li className="mb-2">Click on create new.</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 31,
    show: false,
    search: true,
    ques: "What is the difference between Personal eBay account and Business eBay account",
    ans: (
      <React.Fragment>
        <ul>
          <li>
            Personal eBay accounts can be created if, someone wants to sell
            casually. For example, if a seller wants to end a particular stock
            of products, he can create <b>Personal eBay account</b>.
          </li>
          <li>
            If you are selling or planning to sell large quantites then you need
            to register for a <b>Business eBay account</b>.
          </li>
        </ul>
        <p>
          For more information regarding the same you can refer to{" "}
          <a
            href={
              "https://docs.cedcommerce.com/shopify/ebay-marketplace-integration"
            }
            target={"_blank"}
          >
            eBay help documentation.
          </a>
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 32,
    show: false,
    search: true,
    ques: "What is Business policy",
    ans: (
      <React.Fragment>
        <p className={"mb-2"}>
          For creating a listing you`ll need to choose a set of business
          policies of buyers ie.{" "}
        </p>
        <ul>
          <li className={"mb-2"}>Payment policy</li>
          <li className={"mb-2"}>Shipping policy</li>
          <li className={"mb-2"}>Return policy</li>
        </ul>

        <p>
          but you can streamline the process by creating business policies
          templates which can be used to define these set of policies on each
          listing without re-defining them again-again
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 33,
    show: false,
    search: true,
    ques: "Is order management section based on profiling, templating and business policy",
    ans: (
      <React.Fragment>
        <p>
          <b>No</b>, If you are only on our app for order management then there
          is no need to create business policies and templates , Your orders
          will be managed using default settings.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 34,
    show: false,
    search: true,
    ques: "Does the app support for eBay Motors site",
    ans: (
      <React.Fragment>
        <p>
          <b>Yes</b>, Our app does support eBay Motors site
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 35,
    show: false,
    search: true,
    ques: "What is the difference between Auction and Fixed price item",
    ans: (
      <React.Fragment>
        <ul>
          <li>
            <p>
              <b>Auction price item : </b> Buyers can purchase your item
              immediately or place a bid.
            </p>
          </li>
          <li>
            <p>
              <b>Fixed price item : </b> Buyers can purchase your item
              immediately at the price you set, but cannot bid on your item.
            </p>
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 36,
    show: false,
    search: true,
    ques: "Does the app support secondary category setting ",
    ans: (
      <React.Fragment>
        <p>
          <b>Yes,</b> app does support secondary category, you can set the same
          during creation of category template by selecting{" "}
          <b>Enable secondary category.</b>
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 37,
    show: false,
    search: true,
    ques: "Does the app support international shipping and global shipping program ",
    ans: (
      <React.Fragment>
        <p>
          <b>Yes,</b> app supports global shipping program and international
          shipping ,given global shipping is enabled from eBay seller panel.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 38,
    show: false,
    search: true,
    ques: "Does the app support for all eBay Countries ",
    ans: (
      <React.Fragment>
        <p>
          <b>Yes,</b> our app does support all eBay countries.
        </p>
      </React.Fragment>
    ),
  },

  {
    id: 39,
    show: false,
    search: true,
    ques: "Can we manage multiple eBay stores from one app ",
    ans: (
      <React.Fragment>
        <p>
          <b>No,</b> as of now multiple eBay stores can`t be managed from the
          app.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 40,
    show: false,
    search: true,
    ques: 'Your listing cannot contain javascript (".cookie", "cookie(", "replace(", IFRAME, META, or includes), cookies or base href.',
    ans: (
      <React.Fragment>
        <p>
          eBay doesn't allow to list products with these javascripts words.You
          need to remove the script tags, videos and above words from
          description/title of the products.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 41,
    show: false,
    search: true,
    ques: "How does app credits work?",
    ans: (
      <React.Fragment>
        <p>
          As our app plans are based on credits, here is the brief explanation
          over the app Credits.
        </p>
        <p>
          1 Product Credit means 1 product can be listed on eBay through the
          app. The product can be a simple or variant product. Therefore, if you
          have 1000 product credits you can list 1000 products on eBay through
          the app.
        </p>
        <br />
        <p>About Product Credits</p>
        <ul>
          <li>
            1 Product Credit => 1 product can be listed on eBay through the app.
          </li>
          <li>
            1000 Product Credits=> 1000 products can be listed on eBay through
            the app.
          </li>
        </ul>
        <br />
        <p>
          1 Order credit means 1 eBay Order can be managed from Shopify through
          the app. Therefore, if you have 500 order credits then you can manage
          500 orders through the app.
        </p>
        <br />
        <p>About Order Credits</p>
        <ul>
          <li>
            1 Order credit=> 1 eBay Order can be managed from Shopify through
            the app.
          </li>
          <li>
            500 Order credits=> 500 eBay Order can be managed from Shopify
            through the app.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 42,
    show: false,
    search: true,
    ques: "Email contains an invalid domain name ?",
    ans: (
      <React.Fragment>
        <p>
          This response means that the email id provided by the buyer does not
          have a valid domain. If you want this order to be created in Shopify,
          kindly provide us with the default email Id that we can use for making
          this order in Shopify. You will receive an update on it in 24 hours.
          As the creation of the order requires the involvement of the tech
          team.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 43,
    show: false,
    search: true,
    ques: "Unable to reserve inventory ?",
    ans: (
      <React.Fragment>
        <p>
          This response means that the ordered product doesn't contain stock/
          inventory.
          <ul>
            <li>
              Kindly provide stock for the product for both the ordered products
            </li>
            <li>
              Then delete the order from the app, and in a few minutes, both the
              orders will get synced.
            </li>
          </ul>
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 44,
    show: false,
    search: true,
    ques: "Product is either not uploaded from app or title and sku did not match else does not exists ?",
    ans: (
      <React.Fragment>
        <p>
          This response means that the ordered product is not available in your
          Shopify store.
          <br />
          If the product is available in your Shopify store, you need to provide
          the same title or SKU on both the platforms. As the app map eBay and
          Shopify attributes (title or SKU) of already existing eBay products.
          <br />
          Then delete the order from the app, and in a few minutes, the order
          will get synced.
        </p>
      </React.Fragment>
    ),
  },
];

export const videos = [
  {
    url: "https://www.youtube.com/embed/w1rlb6c0G2w",
    title: "test title",
    description: "test description",
    key: "v1",
  },
  {
    url: "https://www.youtube.com/embed/w1rlb6c0G2w",
    title: "test title 1",
    description: "test description 1",
    key: "v2",
  },
  {
    url: "https://www.youtube.com/embed/w1rlb6c0G2w",
    title: "test title 2",
    description: "test description 2",
    key: "v3",
  },
  {
    url: "https://www.youtube.com/embed/w1rlb6c0G2w",
    title: "test title 3",
    description: "test description 3",
    key: "v4",
  },
];

export const recentActivities = [
  {
    id: "37363862",
    user_id: "694",
    message: "Imported 411 of 411 products from Shopify",
    url: null,
    severity: "success",
    created_at: "2022-03-10 07:10:16",
  },
  {
    id: "37286781",
    user_id: "694",
    message:
      "Issues occured in uploading 1 product. For more  information, go to the Products section.",
    url: null,
    severity: "critical",
    created_at: "2022-03-07 13:17:05",
  },
  {
    id: "37285706",
    user_id: "694",
    message: "All Products imported from Collection Successfully",
    url: null,
    severity: "success",
    created_at: "2022-03-07 13:01:04",
  },
];

export const queuedActivities = [
  {
    id: "33189577",
    user_id: "694",
    message:
      "Product upload process through Default profile to eBay in progress",
    progress: "0",
    created_at: "2022-03-10 08:22:09",
  },
];
