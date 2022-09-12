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
