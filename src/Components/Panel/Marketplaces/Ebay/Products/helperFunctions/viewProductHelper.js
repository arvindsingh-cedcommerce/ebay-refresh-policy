export const getParsedMetaFieldsData = (data) => {
  let metafieldsData = {};
  Object.values(data).map((field) => {
    const { key, value } = field;
    const parsedKey = parseMetaFieldKey(key);
    metafieldsData[parsedKey] = value;
  });
  return metafieldsData;
};

export const parseMetaFieldKey = (data) =>
  data.replace(/^_*(.)|_+(.)/g, (s, c, d) =>
    c ? c.toUpperCase() : " " + d.toUpperCase()
  );

export const getFillDataForEditedContent = (
  editedProductDataFromAPI,
  tempState
) => {
  let temp = [...tempState];
  if (
    Object.keys(editedProductDataFromAPI).length > 0 &&
    editedProductDataFromAPI?.variationProduct
  ) {
    let arr1 = editedProductDataFromAPI.variationProduct;
    let arr2 = [...temp];
    let arr3 = arr2.map((item, i) => {
      let tempObj = { ...item };
      for (const key in arr1[i]) {
        if (`custom${key}` in item) {
          tempObj[`custom${key}`] = arr1[i][key];
        }
      }
      return tempObj;
    });
    console.log("helper arr3", arr3);
    return arr3;
  }
};
