import { getCountryName } from "../../../Accounts/NewAccountGrid";

export const getParsedOrderAnalyticsData = (
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
  orderByTimeLineYearly.forEach((yearlyData) => {
    const year = yearlyData.start.split("-")[0];
    let tempObj = { yearly: year };
    yearlyData.count.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      if (accountName === "United States-testuser_pankaj9839") {
        accountDetails[accountName] = 10;
      } else {
        accountDetails[accountName] =
          //   10;
          shopwiseCount[Object.keys(shopwiseCount)[0]];
      }
      accountDetails[`${accountName}Color`] = getConnectAccountColor(
        connectedAccountsArray,
        shopwiseCount
      );
      tempObj = { ...tempObj, ...accountDetails };
    });
    orderYearlyData.push(tempObj);
    tempObj = {};
  });
  orderByTimeLineMonthly.forEach((monthlyData) => {
    const monthNumber = monthlyData.start.split("-")[1];
    let tempObj = { monthly: getMonthName(monthNumber) };
    monthlyData.count.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      if (accountName === "United States-testuser_pankaj9839") {
        accountDetails[accountName] = 10;
      } else {
        accountDetails[accountName] =
          //   10;
          shopwiseCount[Object.keys(shopwiseCount)[0]];
      }
      accountDetails[`${accountName}Color`] = getConnectAccountColor(
        connectedAccountsArray,
        shopwiseCount
      );
      tempObj = { ...tempObj, ...accountDetails };
    });
    orderMonthlyData.push(tempObj);
    tempObj = {};
  });
  orderByTimeLineWeekly.forEach((weeklyData) => {
    const startMonthNumber = weeklyData.start.split("-")[1];
    const startDate = weeklyData.start.split("-")[2];
    const endMonthNumber = weeklyData.end.split("-")[1];
    const endDate = weeklyData.end.split("-")[2];
    let tempObj = {
      weekly: `${startDate} ${getMonthName(
        startMonthNumber
      )}-${endDate} ${getMonthName(endMonthNumber)}`,
    };
    weeklyData.count.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      if (accountName === "United States-testuser_pankaj9839") {
        accountDetails[accountName] = 10;
      } else {
        accountDetails[accountName] =
          //   10;
          shopwiseCount[Object.keys(shopwiseCount)[0]];
      }
      accountDetails[`${accountName}Color`] = getConnectAccountColor(
        connectedAccountsArray,
        shopwiseCount
      );
      tempObj = { ...tempObj, ...accountDetails };
    });
    orderWeeklyData.push(tempObj);
    tempObj = {};
  });
  let dataToReturn = {};
  dataToReturn["orderYearlyData"] = {
    data: [...orderYearlyData],
    keys: getKeys(connectedAccountsArray),
    indexBy: "yearly",
  };
  dataToReturn["orderMonthlyData"] = {
    data: [...orderMonthlyData],
    keys: getKeys(connectedAccountsArray),
    indexBy: "monthly",
  };
  dataToReturn["orderWeeklyData"] = {
    data: [...orderWeeklyData],
    keys: getKeys(connectedAccountsArray),
    indexBy: "weekly",
  };
  //   console.log(dataToReturn);
  return dataToReturn;
};

export const getParsedOrderAnalyticsDataAntD = (
  orderByTimeLine,
  connectedAccountsArray
) => {
  const {
    monthly: orderByTimeLineMonthly,
    weekly: orderByTimeLineWeekly,
    yearly: orderByTimeLineYearly,
  } = orderByTimeLine;
  const orderYearlyData = [];
  let hasOrderYearlyData = false;
  const orderMonthlyData = [];
  let hasOrderMonthlyData = false;
  const orderWeeklyData = [];
  let hasOrderWeeklyData = false;
  // yearly
  orderByTimeLineYearly.forEach((yearlyData) => {
    const year = yearlyData.start.split("-")[0];
    yearlyData.count.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      accountDetails["name"] = accountName;
      accountDetails["year"] = year;
      accountDetails["orderCount"] =
        // 10;
        shopwiseCount[Object.keys(shopwiseCount)[0]];
      if (shopwiseCount[Object.keys(shopwiseCount)[0]] > 0) {
        hasOrderYearlyData = true;
      }
      orderYearlyData.push(accountDetails);
    });
  });
  // monthly
  orderByTimeLineMonthly.forEach((monthlyData) => {
    const month = getMonthName(monthlyData.start.split("-")[1]);
    monthlyData.count.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      accountDetails["name"] = accountName;
      accountDetails["month"] = month;
      accountDetails["orderCount"] =
        // 10;
        shopwiseCount[Object.keys(shopwiseCount)[0]];
      if (shopwiseCount[Object.keys(shopwiseCount)[0]] > 0) {
        hasOrderMonthlyData = true;
      }
      orderMonthlyData.push(accountDetails);
    });
  });
  // weekly
  orderByTimeLineWeekly.forEach((weeklyData) => {
    const startMonth = getMonthName(weeklyData.start.split("-")[1]);
    const startDate = weeklyData.start.split("-")[2];
    const endMonth = getMonthName(weeklyData.end.split("-")[1]);
    const endDate = weeklyData.end.split("-")[2];
    const week = `${startDate} ${startMonth}-${endDate} ${endMonth}`;
    weeklyData.count.forEach((shopwiseCount) => {
      let accountName = getConnectAccountLabel(
        connectedAccountsArray,
        shopwiseCount
      );
      let accountDetails = {};
      accountDetails["name"] = accountName;
      accountDetails["week"] = week;
      accountDetails["orderCount"] =
        // 10;
        shopwiseCount[Object.keys(shopwiseCount)[0]];
      if (shopwiseCount[Object.keys(shopwiseCount)[0]] > 0) {
        hasOrderWeeklyData = true;
      }
      orderWeeklyData.push(accountDetails);
    });
  });
  let dataToReturn = {};
  dataToReturn["orderYearlyData"] = [...orderYearlyData];
  dataToReturn["orderMonthlyData"] = [...orderMonthlyData];
  dataToReturn["orderWeeklyData"] = [...orderWeeklyData];
  dataToReturn["hasOrderYearlyData"] = hasOrderYearlyData;
  dataToReturn["hasOrderMonthlyData"] = hasOrderMonthlyData;
  dataToReturn["hasOrderWeeklyData"] = hasOrderWeeklyData;
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
      month = "Jun";
      break;
    case "7":
      month = "July";
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
