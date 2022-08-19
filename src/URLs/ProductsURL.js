// product grid
export const getProductsURL = "ebay/product/getProducts";
export const getProductsCountURL = "ebay/product/getProductsCount";

// variant grid
export const getVariantsURL = "ebay/product/getProductVariant";

// edit product
export const getProductDataURL = "connector/product/getProducts";
export const viewProductDataURL = "ebay/product/getProductById";
export const uploadProductByIdURL = "ebay/product/upload";
export const uploadProductByProfileURL = "ebay/product/uploadProductByProfile";
export const endProductByIdURL = "ebay/product/deleteProduct";
export const editProductByIdURL = "ebay/product/updateProduct";
export const getMetafieldsURL = "ebay/product/getMetafields";

// bulk actions
export const matchFromEbayURL = "ebay/product/matchFromEbay"; // without any postData
export const bulkUploadProduct = "ebay/product/bulkUpload";
export const importMetaFieldURL = "ebay/product/importMetafield";
export const importByIdURL = "ebay/product/importById";
export const importProductURL = "ebay/product/importProduct";
export const importCollectionProductURL =
  "ebay/product/importCollectionProduct";

// mass action
export const relistItemURL = "ebay/product/relistItem"; // productId in array Form
export const deleteItemURL = "ebay/product/deleteProduct"; // productId in array Form
export const disableItemURL = "ebay/product/changeProductStatus";

// common actions
export const syncInventoryPrice = "ebay/product/syncInventoryAndPrice";
export const syncProductDetails = "ebay/product/syncProductDetails";
