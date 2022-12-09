import { Menu } from "antd";
import React from "react";
import {
  UploadOutlined,
  SyncOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  uploadProductByIdURL,
  matchFromEbayURL,
  importMetaFieldURL,
  syncInventoryPrice,
  syncProductDetails,
  importProductURL,
  importCollectionProductURL,
} from "../../../../../../URLs/ProductsURL";
import {
  getrequest,
  postActionOnProductById,
} from "../../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../../services/notify";

export const bulkMenu = (
  <Menu>
    <Menu.ItemGroup key="g3" title="eBay Actions">
      <Menu.Item
        key="Match from eBay"
        onClick={async () => {
          let { success, message } = await getrequest(matchFromEbayURL);
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
        }}
      >
        <UploadOutlined /> Match from eBay
      </Menu.Item>
      <Menu.Item
        key="Upload and Revise (All Products)"
        onClick={async () => {
          let { success, data, message } = await postActionOnProductById(
            // bulkUploadProduct,
            uploadProductByIdURL,
            { action: "upload_and_revise" }
          );
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
        }}
      >
        <UploadOutlined /> Upload and Revise (All Products)
      </Menu.Item>
      <Menu.Item
        key="Sync Inventory eBay"
        onClick={async () => {
          let { success, data, message } = await postActionOnProductById(
            syncInventoryPrice,
            { sync: ["inventory"], action: "app_to_marketplace" }
          );
          if (success) {
            notify.success(data);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Sync Inventory
      </Menu.Item>
      <Menu.Item
        key="Sync Price"
        onClick={async () => {
          let { success, data, message } = await postActionOnProductById(
            syncInventoryPrice,
            { sync: ["price"], action: "app_to_marketplace" }
          );
          if (success) {
            notify.success(data);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Sync Price
      </Menu.Item>
      <Menu.Item
        key="Upload Products"
        onClick={async () => {
          let { success, data, message } = await postActionOnProductById(
            // bulkUploadProduct,
            uploadProductByIdURL,
            { action: "upload" }
          );
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
        }}
      >
        <UploadOutlined /> Upload Products
      </Menu.Item>
    </Menu.ItemGroup>
    <Menu.ItemGroup key="g1" title="CSV Actions">
      <Menu.Item key="Export">
        <UploadOutlined /> Export
      </Menu.Item>
      <Menu.Item key="Bulk Update">
        <DownloadOutlined /> Bulk Update
      </Menu.Item>
    </Menu.ItemGroup>
    <Menu.Divider />
    <Menu.ItemGroup key="g2" title="Shopify Actions">
      <Menu.Item
        key="Import Products"
        onClick={async () => {
          let { success, message } = await getrequest(importProductURL);
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
        }}
      >
        <DownloadOutlined /> Import Products
      </Menu.Item>
      <Menu.Item
        key="Sync Inventory Shopify"
        onClick={async () => {
          let { success, data, message } = await postActionOnProductById(
            syncInventoryPrice,
            { sync: ["inventory"], action: "shopify_to_app" }
          );
          if (success) {
            notify.success(data);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Sync Inventory
      </Menu.Item>
      <Menu.Item
        key="Sync Price Shopify"
        onClick={async () => {
          let { success, data, message } = await postActionOnProductById(
            syncInventoryPrice,
            { sync: ["price"], action: "shopify_to_app" }
          );
          if (success) {
            notify.success(data);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Sync Price
      </Menu.Item>
      <Menu.Item
        key="Sync Details"
        onClick={async () => {
          let { success, message } = await getrequest(syncProductDetails);
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Sync Details
      </Menu.Item>
      <Menu.Item
        key="Import Collection Products"
        onClick={async () => {
          let { success, data, message } = await getrequest(
            importCollectionProductURL
          );
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
        }}
      >
        <DownloadOutlined /> Import Collection Products
      </Menu.Item>
      <Menu.Item
        key="Import metafileds of products"
        onClick={async () => {
          let { success, data, message } = await getrequest(importMetaFieldURL);
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
        }}
      >
        <DownloadOutlined /> Import metafileds of products
      </Menu.Item>
    </Menu.ItemGroup>
    <Menu.Divider />
  </Menu>
);
