import { getCountryName } from "../../../Accounts/NewAccountGrid";

export const getParsedOrderAnalyticsDataLine = (
  orderByTimeLine,
  connectedAccountsArray
) => {
  const {
    monthly: orderByTimeLineMonthly,
    weekly: orderByTimeLineWeekly,
    yearly: orderByTimeLineYearly,
  } = orderByTimeLine;
  const orderYearlyData = [];
  const orderMonthlyData = [];
  const orderWeeklyData = [];
  for (const shopId in orderByTimeLineYearly) {
    let tempObj = {};
    let accountName = getConnectAccountLabel(connectedAccountsArray, shopId);
    let accountColor = getConnectAccountColor(connectedAccountsArray, shopId);
    tempObj["id"] = accountName;
    tempObj["color"] = accountColor;
    tempObj["data"] = [];
    orderByTimeLineYearly[shopId].forEach((data) => {
      const year = data.start.split("-")[0];
      const value = Number(data.revenue);
      const obj = {};
      obj["x"] = year;
      obj["y"] = 10;
      tempObj["data"].push(obj);
    });
    orderYearlyData.push(tempObj);
  }
  let dataToReturn = {};
  dataToReturn["revenueYearlyData"] = [...orderYearlyData];
  return dataToReturn;
};

export const getParsedRevenueAnalyticsDataAntD = (
  revenueByTimeLine,
  connectedAccountsArray
) => {
  const {
    monthly: revenueByTimeLineMonthly,
    weekly: revenueByTimeLineWeekly,
    yearly: revenueByTimeLineYearly,
  } = revenueByTimeLine;
  const revenueYearlyData = [];
  const revenueMonthlyData = [];
  const revenueWeeklyData = [];
  let hasRevenueYearlyData = false;
  let hasRevenueMonthlyData = false;
  let hasRevenueWeeklyData = false;
  revenueByTimeLineYearly.forEach((yearlyData) => {
    const year = yearlyData.start.split("-")[0];
    yearlyData.revenue.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      accountDetails["name"] = accountName;
      accountDetails["year"] = year;
      accountDetails["revenueCount"] =
        // 10;
        shopwiseCount[Object.keys(shopwiseCount)[0]];
      if (shopwiseCount[Object.keys(shopwiseCount)[0]] > 0) {
        hasRevenueYearlyData = true;
      }
      revenueYearlyData.push(accountDetails);
    });
  });
  // monthly
  revenueByTimeLineMonthly.forEach((monthlyData) => {
    const month = monthlyData.start.split("-")[1];
    monthlyData.revenue.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      accountDetails["name"] = accountName;
      accountDetails["month"] = month;
      accountDetails["revenueCount"] =
        // 10;
        shopwiseCount[Object.keys(shopwiseCount)[0]];
      if (shopwiseCount[Object.keys(shopwiseCount)[0]] > 0) {
        hasRevenueMonthlyData = true;
      }
      revenueMonthlyData.push(accountDetails);
    });
  });
  // weekly
  revenueByTimeLineWeekly.forEach((weeklyData) => {
    const startMonth = getMonthName(weeklyData.start.split("-")[1]);
    const startDate = weeklyData.start.split("-")[2];
    const endMonth = getMonthName(weeklyData.end.split("-")[1]);
    const endDate = weeklyData.end.split("-")[2];
    const week = `${startDate} ${startMonth}-${endDate} ${endMonth}`;
    weeklyData.revenue.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      accountDetails["name"] = accountName;
      accountDetails["week"] = week;
      accountDetails["revenueCount"] =
        // 10;
        shopwiseCount[Object.keys(shopwiseCount)[0]];
      if (shopwiseCount[Object.keys(shopwiseCount)[0]] > 0) {
        hasRevenueWeeklyData = true;
      }
      revenueWeeklyData.push(accountDetails);
    });
  });
  let dataToReturn = {};
  dataToReturn["revenueYearlyData"] = [...revenueYearlyData];
  dataToReturn["revenueMonthlyData"] = [...revenueMonthlyData];
  dataToReturn["revenueWeeklyData"] = [...revenueWeeklyData];
  dataToReturn["hasRevenueYearlyData"] = hasRevenueYearlyData;
  dataToReturn["hasRevenueMonthlyData"] = hasRevenueMonthlyData;
  dataToReturn["hasRevenueWeeklyData"] = hasRevenueWeeklyData;
  return dataToReturn;
};

const getConnectAccountLabel = (accounts, shopData) => {
  let matchedAccount = accounts.find(
    (account) => account.shopId == Object.keys(shopData)[0]
  );
  return matchedAccount.value;
};

const getConnectAccountColor = (accounts, shopData) => {
  let matchedAccount = accounts.find(
    (account) => account.shopId == Object.keys(shopData)[0]
  );
  return matchedAccount.color;
};

const getKeys = (accounts) => {
  const accountLabels = accounts.map((account) => account.value);
  return accountLabels;
};

const getMonthName = (monthNumber) => {
  let month = "";
  switch (monthNumber) {
    case "1":
      month = "Jan";
      break;
    case "01":
      month = "Jan";
      break;
    case "2":
      month = "Feb";
      break;
    case "02":
      month = "Feb";
      break;
    case "3":
      month = "Mar";
      break;
    case "03":
      month = "Mar";
      break;
    case "4":
      month = "Apr";
      break;
    case "04":
      month = "Apr";
      break;
    case "5":
      month = "May";
      break;
    case "05":
      month = "May";
      break;
    case "6":
      month = "June";
      break;
    case "06":
      month = "June";
      break;
    case "7":
      month = "Jul";
      break;
    case "07":
      month = "Jul";
      break;
    case "8":
      month = "Aug";
      break;
    case "08":
      month = "Aug";
      break;
    case "9":
      month = "Sep";
      break;
    case "09":
      month = "Sep";
      break;
    case "10":
      month = "Oct";
      break;
    case "11":
      month = "Nov";
      break;
    case "12":
      month = "Dec";
      break;
    default:
      break;
  }
  return month;
};
