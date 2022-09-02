export const parseDataForSave = (data) => {
  let parsedData = {};
  for (const key in data) {
    if (typeof data[key] === "object" && Object.keys(data[key]).length > 0) {
      let tempObj = {};
      for (const innerKey in data[key]) {
        if (innerKey === "last_name") {
          tempObj[innerKey] = data[key][innerKey];
        } else if (data[key][innerKey]) {
          tempObj[innerKey] = data[key][innerKey];
        }
      }
      if (Object.keys(tempObj).length) {
        parsedData[key] = { ...tempObj };
      }
    } else if (key === "customer") {
      parsedData[key] = data[key] ? data[key] : null;
    } else if (data[key]) {
      parsedData[key] = data[key];
    }
  }
  return parsedData;
};

export const extractUpdateOrderData = (data, updateOrder, setUpdateOrder) => {
  let extractedData = { ...updateOrder };
  for (const key in data) {
    switch (key) {
      case "email":
        extractedData[key] = data[key];
        break;
      case "phone_number":
        extractedData[key] = data[key];
        break;
      case "shipping_address":
        extractedData[key]["full_name"] = data[key]["full_name"];
        extractedData[key]["country"] = data[key]["country"];
        extractedData[key]["phone_number"] = data[key]["phone_number"];
        extractedData[key]["company"] = data[key]["company"];
        extractedData[key]["city"] = data[key]["city"];
        extractedData[key]["province"] = data[key]["province"];
        extractedData[key]["zip"] = data[key]["zip"];
        extractedData[key]["company"] = data[key]["company"];
        extractedData[key]["address1"] =
          data[key]["address1"] + " " + data[key]["address1"];
        break;
      case "customer":
        extractedData[key] = Object.keys(data[key]).length > 0;
        break;
      case "tags":
        extractedData[key] = data[key];
        break;
      case "note":
        extractedData[key] = data[key];
        break;
      default:
        break;
    }
  }
  setUpdateOrder(extractedData);
};
