export const getVariantsCountDetails = (variants, variant_attributes) => {
  let text = "";
  let inventoryCount = 0;
  variants.forEach((variant) => {
    inventoryCount += Number(variant?.quantity);
  });
  if (
    variant_attributes &&
    Array.isArray(variant_attributes) &&
    variant_attributes.length
  ) {
    let variantSingleOrMultiple = variants.length > 1 ? "variants" : "variant";
    text = `${inventoryCount} in stock for ${variants.length} ${variantSingleOrMultiple}`;
  } else {
    text = `${inventoryCount} in stock`;
  }
  return text;
};

export const trimTitle = (title = "") => {
  return title.length > 29 ? `${title.substring(0, 25)}...` : title;
};

export const redirect = (props, url) => {
  props.history.push(url);
};
