import { Menu } from "antd";
import React from "react";
import {
  UploadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  uploadProductByIdURL,
  matchFromEbayURL,
  relistItemURL,
  deleteItemURL,
  disableItemURL,
  syncInventoryPrice,
  syncProductDetails,
  importMetaFieldURL,
} from "../../../../../../URLs/ProductsURL";
import {
  postActionOnProductById,
} from "../../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../../services/notify";

export const massMenu = (selectedRows) =>  (
  <Menu>
    <Menu.ItemGroup key="g3" title="eBay Actions">
      <Menu.Item
        key="Upload and Revise (All Products)"
        onClick={async () => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { source_product_id } = selectedRow;
            postData.push(source_product_id);
          });
          await postActionOnProductById(uploadProductByIdURL, {
            product_id: postData,
            action: "upload_and_revise",
          });
        }}
      >
        <UploadOutlined /> Upload and Revise on eBay
      </Menu.Item>
      <Menu.Item
        key="Disable Product"
        onClick={async () => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { container_id } = selectedRow;
            postData.push(container_id);
          });

          let { success, data, message } = await postActionOnProductById(
            disableItemURL,
            { product_id: postData, status: "Disable" }
          );
          if (success) {
            notify.success(data);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Disable Product
      </Menu.Item>
      <Menu.Item
        key="Relist Item"
        onClick={async () => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { source_product_id } = selectedRow;
            postData.push(source_product_id);
          });

          let { success, data, message } = await postActionOnProductById(
            relistItemURL,
            { product_id: postData }
          );
          if (success) {
            notify.success(data);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Relist Item
      </Menu.Item>

      <Menu.Item
        key="End from eBay"
        onClick={async () => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { source_product_id } = selectedRow;
            postData.push(source_product_id);
          });

          let { success, data, message } = await postActionOnProductById(
            deleteItemURL,
            { product_id: postData }
          );
          if (success) {
            notify.success(data);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> End from eBay
      </Menu.Item>
      <Menu.Item
        key="Match from eBay"
        onClick={async () => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { source_product_id } = selectedRow;
            postData.push(source_product_id);
          });

          let { success, data, message } = await postActionOnProductById(
            matchFromEbayURL,
            { product_id: postData }
          );
          if (success) {
            notify.success(data);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Match from eBay
      </Menu.Item>
      <Menu.Item
        key="Sync Inventory eBay"
        onClick={async () => {
          let postData = {
            product_id: [],
            sync: ["inventory"],
            action: "app_to_marketplace",
          };
          selectedRows.forEach((selectedRow) => {
            let { source_product_id } = selectedRow;
            postData.product_id.push(source_product_id);
          });
          let { success, data, message } = await postActionOnProductById(
            syncInventoryPrice,
            postData
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
        key="Sync Price eBay"
        onClick={async () => {
          let postData = {
            product_id: [],
            sync: ["price"],
            action: "app_to_marketplace",
          };
          selectedRows.forEach((selectedRow) => {
            let { source_product_id } = selectedRow;
            postData.product_id.push(source_product_id);
          });
          let { success, data, message } = await postActionOnProductById(
            syncInventoryPrice,
            postData
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
      <Menu.Item key="Sync Images">
        <SyncOutlined /> Sync Images
      </Menu.Item>
      {/* <Menu.Item key="Export Details CSV">
          <UploadOutlined /> Export Details CSV
        </Menu.Item> */}
      <Menu.Item
        key="Upload Products"
        onClick={async () => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { source_product_id } = selectedRow;
            postData.push(source_product_id);
          });

          await postActionOnProductById(uploadProductByIdURL, {
            product_id: postData,
            action: "upload",
          });
        }}
      >
        <UploadOutlined /> Upload Products
      </Menu.Item>
    </Menu.ItemGroup>
    <Menu.Divider />
    <Menu.ItemGroup key="g2" title="Shopify Actions">
      <Menu.Item
        key="Sync Details"
        onClick={async () => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { container_id } = selectedRow;
            postData.push(container_id);
          });
          let { success, message } = await postActionOnProductById(
            syncProductDetails,
            {
              product_id: postData,
            }
          );
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
        key="Sync Inventory eBay"
        onClick={async () => {
          let postData = {
            product_id: [],
            sync: ["inventory"],
            action: "shopify_to_app",
          };
          selectedRows.forEach((selectedRow) => {
            // let { source_product_id } = selectedRow;
            // postData.product_id.push(source_product_id);
            let { container_id } = selectedRow;
            postData.product_id.push(container_id);
          });
          let { success, data, message } = await postActionOnProductById(
            syncInventoryPrice,
            postData
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
        key="Sync Price eBay"
        onClick={async () => {
          let postData = {
            product_id: [],
            sync: ["price"],
            action: "shopify_to_app",
          };
          selectedRows.forEach((selectedRow) => {
            // let { source_product_id } = selectedRow;
            // postData.product_id.push(source_product_id);
            let { container_id } = selectedRow;
            postData.product_id.push(container_id);
          });
          let { success, data, message } = await postActionOnProductById(
            syncInventoryPrice,
            postData
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
        key="Import metafileds of products"
        onClick={async () => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { container_id } = selectedRow;
            postData.push(container_id);
          });
          let { success, message } = await postActionOnProductById(
            importMetaFieldURL,
            {
              product_id: postData,
            }
          );
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
        }}
      >
        <SyncOutlined /> Import metafileds of products
      </Menu.Item>
    </Menu.ItemGroup>
  </Menu>
);
