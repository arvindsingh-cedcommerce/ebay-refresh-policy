export const getParsedProductAnalyticsDataAntD = (
  productAnalytics,
  connectedAccountsArray
) => {
  const modifiedProductData = [];
  let hasModifiedProductData = false;
  let tempProductAnalytics = {};
//   console.log(productAnalytics, connectedAccountsArray);
  Object.keys(productAnalytics).forEach((shopId) => {
    let totalProducts = 0;
    for (const key in productAnalytics[shopId]) {
      totalProducts += productAnalytics[shopId][key];
    }
    tempProductAnalytics[shopId] = {
      ...productAnalytics[shopId],
      totalProducts,
    };
  });
  Object.keys(tempProductAnalytics).forEach((shopid) => {
    connectedAccountsArray.forEach((account) => {
      let matchedAccountObj = {};
      if (account.shopId == shopid) {
        Object.assign(matchedAccountObj, {
          ...tempProductAnalytics[shopid],
          accountName: account.value,
        });
        modifiedProductData.push(matchedAccountObj);
      }
    });
  });
//   console.log(modifiedProductData);
  let dataToReturn = {};
  dataToReturn["modifiedProductData"] = [...modifiedProductData];
  return modifiedProductData
};
