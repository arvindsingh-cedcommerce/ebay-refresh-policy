export function capitalizeFirstLetter(word) {
  return word[0] && word[0].toUpperCase() + word.substr(1);
}

export function capitalizeFirstLetterofWords(str) {
  return str.toLowerCase().split(" ").map(capitalizeFirstLetter).join(" ");
}

export const getTemplatesCountTabLabel = (templatesArray, tabName) => {
  return templatesArray.length
    ? `${tabName} (${templatesArray.length})`
    : `${tabName} (0)`;
};

export const addTemplatesOptions = [
  { label: "Category", value: "category" },
  { label: "Inventory", value: "inventory" },
  { label: "Price", value: "price" },
  { label: "Title", value: "title" },
];

export const addPolicyOptions = [
  { label: "Shipping", value: "shipping" },
  { label: "Payment", value: "payment" },
  { label: "Return", value: "return" },
];

export function prepareChoiceoption(optionsArray = [], nameKey, nameValue) {
  let options = [];
  optionsArray.forEach((option) => {
    options.push({
      label: option[nameKey],
      value: option[nameValue].toString(),
      choices: option.hasOwnProperty("choices") ? option["choices"] : [],
      default_condition: option.hasOwnProperty("default_condition")
        ? option["default_condition"]
        : "",
    });
  });
  return options;
}
