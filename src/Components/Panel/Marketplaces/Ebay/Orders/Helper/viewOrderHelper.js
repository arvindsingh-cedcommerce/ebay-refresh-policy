export const autofillValidation = (data, recievedData) => {
  let errorCount = 0;
  let errors = {};
  if (recievedData) {
    if (recievedData.email && !data.email.trim()) {
      errors["email"] = "*required";
      errorCount++;
    }
    if (recievedData.phone && !data.phone.trim()) {
      errors["phone"] = "*required";
      errorCount++;
    }
  }
  return { errorCount, errors };
};

export const parseDataForSave = (data) => {
  let parsedData = {};
  for (const key in data) {
    if (typeof data[key] === "object" && Object.keys(data[key]).length > 0) {
      let tempObj = {};
      for (const innerKey in data[key]) {
        // if (innerKey === "last_name") {
        //   tempObj[innerKey] = data[key][innerKey];
        // }
        // else if(innerKey === 'phone_number') {
        //   tempObj['phone'] = data[key][innerKey]
        // }
        // else
        if (data[key][innerKey]) {
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
      // case "phone_number":
      //   extractedData[key] = data[key];
      //   break;
      case "phone":
        extractedData[key] = data[key];
        break;
      case "shipping_address":
        extractedData[key]["name"] = data[key]["name"];
        extractedData[key]["country"] = data[key]["country"];
        extractedData[key]["country_code"] = data[key]["country_code"];
        // extractedData[key]["phone_number"] = data[key]["phone_number"];
        extractedData[key]["phone"] = data[key]["phone"];
        extractedData[key]["company"] = data[key]["company"];
        extractedData[key]["city"] = data[key]["city"];
        extractedData[key]["province"] = data[key]["province"];
        extractedData[key]["zip"] = data[key]["zip"];
        extractedData[key]["company"] = data[key]["company"];
        extractedData[key]["address1"] = data[key]["address1"];
        //  + " " + data[key]["address1"];
        extractedData[key]["address2"] = data[key]["address2"];
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
