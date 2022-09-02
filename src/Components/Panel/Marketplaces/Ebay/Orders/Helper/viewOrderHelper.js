export const parseDataForSave = (data) => {
  let parsedData = {};
  for (const key in data) {
    if (typeof data[key] === "object" && Object.keys(data[key]).length > 0) {
      let tempObj = {};
      for (const innerKey in data[key]) {
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
