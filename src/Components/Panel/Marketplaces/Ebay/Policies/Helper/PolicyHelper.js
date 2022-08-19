export const getPolicyCountTabLabel = (policyArray, tabName) => {
  return policyArray.length
    ? `${tabName} (${policyArray.length})`
    : `${tabName} (0)`;
};

export const addPolicyOptions = [
  { label: "Shipping", value: "shipping" },
  { label: "Payment", value: "payment" },
  { label: "Return", value: "return" },
];
