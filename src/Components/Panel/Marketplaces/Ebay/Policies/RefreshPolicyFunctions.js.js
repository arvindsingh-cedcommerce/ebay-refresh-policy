// import { getPolicies } from "../../../../../APIrequests/PoliciesAPI";
// import { getPoliciesURL } from '../../../../../URLs/PoliciesURL';

// export const getShippingPolicyCount = async () => {
//   let requestData = {
//     count: 10,
//     activePage: 1,
//     "filter[type][1]": "shipping",
//   };
//   let {
//     success,
//     data: fetchedPoliciesArray,
//     message,
//     count,
//   } = await getPolicies(getPoliciesURL, { ...requestData });
//   if (success) {
//     setShippingPolicyCount(count?.[0]?.count ? count?.[0]?.count : 0);
//   }
// };

// export const getPaymentPolicyCount = async () => {
//   let requestData = {
//     count: 10,
//     activePage: 1,
//     "filter[type][1]": "payment",
//   };
//   let {
//     success,
//     data: fetchedPoliciesArray,
//     message,
//     count,
//   } = await getPolicies(getPoliciesURL, { ...requestData });
//   if (success) {
//     setPaymentPolicyCount(count?.[0]?.count ? count?.[0]?.count : 0);
//   }
// };

// const getReturnPolicyCount = async () => {
//   let requestData = {
//     count: 10,
//     activePage: 1,
//     "filter[type][1]": "return",
//   };
//   let {
//     success,
//     data: fetchedPoliciesArray,
//     message,
//     count,
//   } = await getPolicies(getPoliciesURL, { ...requestData });
//   if (success) {
//     setReturnPolicyCount(count?.[0]?.count ? count?.[0]?.count : 0);
//   }
// };

// export const getReturnPolicyCount1 = async () => {
//     let requestData = {
//       count: 10,
//       activePage: 1,
//       "filter[type][1]": "return",
//     };
//     let {
//       success,
//       data: fetchedPoliciesArray,
//       message,
//       count,
//     } = await getPolicies(getPoliciesURL, { ...requestData });
//     if (success) {
//     //   setReturnPolicyCount(count?.[0]?.count ? count?.[0]?.count : 0);
//     }
//   };