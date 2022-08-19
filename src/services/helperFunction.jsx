import * as queryString from "query-string";

export function prepareChoiceforArray(options = []) {
  let optionsArray = [];
  options.forEach((value) => {
    optionsArray.push({ label: value.toString(), value: value.toString() });
  });
  return optionsArray;
}

export function getpaginationInfo(totalrecords, pageSize) {
  let pages = Math.ceil(parseInt(totalrecords) / parseInt(pageSize));
  return { pages, totalrecords };
}

export function parseQueryString(query) {
  return { ...queryString.parse(query) };
}