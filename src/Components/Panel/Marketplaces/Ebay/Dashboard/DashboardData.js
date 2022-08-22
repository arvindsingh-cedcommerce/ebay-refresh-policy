import React, { useEffect, useState } from "react";

const productAnalytics = {
  uploaded: 315,
  not_uploaded: 56,
  error: 41,
  ended: 0,
};

export const recentActivities = [
  {
    id: "35386963",
    user_id: "694",
    message: "No new orders to sync",
    url: null,
    severity: "info",
    created_at: "2021-12-28 08:07:28",
  },
  {
    id: "35360826",
    user_id: "694",
    message: "Imported 409 of 409 products from Shopify",
    url: null,
    severity: "success",
    created_at: "2021-12-27 10:45:38",
  },
  {
    id: "34948309",
    user_id: "694",
    message: "Bulk Update for 412 Products have been successfully performed",
    url: null,
    severity: "success",
    created_at: "2021-12-14 08:16:03",
  },
];

export const newsData = [
  {
    _id: "5f12c0002c66a",
    title: "Paying it Forward Through Animal Therapy",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.ebayinc.com/stories/news/paying-it-forward-through-animal-therapy/",
  },
  {
    _id: "60c1c76434bc7",
    title: "New cancel function for unpaid items",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://community.ebay.com/t5/Announcements/New-cancel-function-for-unpaid-items/ba-p/31848079",
  },
  {
    _id: "60d1d3bf23453",
    title: "eBay Offers Deals on Refurbs to Compete on Prime Day",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ecommercebytes.com/2021/06/21/ebay-offers-deals-on-refurbs-to-compete-on-prime-day/",
  },
  {
    _id: "60d1d841a824d",
    title: "eBay Launches Seller-Friendly Returns Policy for Trading Cards",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ecommercebytes.com/2021/06/21/ebay-launches-seller-friendly-returns-policy-for-trading-cards/",
  },
  {
    _id: "60d1ddc9a327a",
    title: "eBay's Enhanced Advertising Dashboard",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tech.ebayinc.com/product/ebays-enhanced-advertising-dashboard/",
  },
  {
    _id: "60fec252d2afe",
    title: "UK eBay fulfilment launches with Orange Connex",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tamebay.com/2021/07/uk-ebay-fulfilment-launches-with-orange-connex.html",
  },
  {
    _id: "611600d02078f",
    title: "eBay handbag vending machines appear in popular U.S. cities",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tamebay.com/2021/08/ebay-handbag-vending-machines-appear-in-popular-u-s-cities.html",
  },
  {
    _id: "612e06489f6ed",
    title: "Boosting Seller Sales With Promoted Listings Advanced",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.ebayinc.com/stories/news/boosting-seller-sales-with-promoted-listings-advanced/",
  },
  {
    _id: "6166b7431b815",
    title: "Volo announces full support for eBay Fulfilment",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/10/volo-announces-full-support-for-ebay-fulfilment.html",
  },
  {
    _id: "5e7bad0c2e38f",
    title: "eBay to Defer Seller Fees and Offer Up To 100,000 Free Listings",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://esellercafe.com/https-esellercafe-com-ebay-defer-many-seller-fees-and-offer-up-100000-free-listings/",
  },
  {
    _id: "5e884f346f102",
    title: "Ebay cooperates with Shopify",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link: "https://ecommercenews.eu/ebay-cooperates-with-shopify/",
  },
  {
    _id: "5ea159cdd6237",
    title:
      "Mini Stories: Distributing Thousands of Laptops to Students to Support Virtual Learning",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/mini-stories-distributing-thousands-of-laptops-to-students-to-support-virtual-learning/",
  },
  {
    _id: "5ee9bc5ad0892",
    title:
      "eBay Inc. Issues Statement Regarding Indictments of Previously Terminated Employees",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-inc-issues-statement-regarding-indictments-of-previously-terminated-employees/",
  },
  {
    _id: "5ee9bc743a16f",
    title: "eBay Inc. Prices $750 Million Senior Unsecured Notes Offering",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-inc-prices-750-million-senior-unsecured-notes-offering-2/",
  },
  {
    _id: "5ef18928ec787",
    title:
      "eBay Announces Early Results of Tender Offer and Consent Solicitation for 2.875% Notes due 2021",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-announces-early-results-of-tender-offer-and-consent-solicitation-for-2-875-notes-due-2021/",
  },
  {
    _id: "5f17e3eeb202b",
    title:
      "Adevinta to Acquire eBay Classifieds Group to Create the World’s Largest Online Classifieds Company",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/adevinta-to-acquire-ebay-classifieds-group-to-create-the-worlds-largest-online-classifieds-company/",
  },
  {
    _id: "60b7650cc55be",
    title: "eBay Auto Parts Coupon Good Only for 5 Sellers",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.ecommercebytes.com/2021/05/31/ebay-auto-parts-coupon-good-only-for-5-sellers/",
  },
  {
    _id: "60c1c97855442",
    title: "eBay Launches Same Day Delivery in Two German Cities",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.ecommercebytes.com/2021/06/08/ebay-launches-same-day-delivery-in-two-german-cities/",
  },
  {
    _id: "60c3911f6e7ea",
    title:
      "Update on Sales and Exports of products with a CE mark to the European Union",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://community.ebay.com/t5/Announcements/Update-on-Sales-and-Exports-of-products-with-a-CE-mark-to-the/ba-p/31953993",
  },
  {
    _id: "60d5c4052f9cc",
    title: "eBay Korea to be acquired by retailer Emart",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://tamebay.com/2021/06/ebay-korea-to-be-acquired-by-retailer-emart.html",
  },
  {
    _id: "60dd7c0d79bdf",
    title: "eBay GSP Terms & Conditions update clarifies VAT treatment",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/06/ebay-gsp-terms-conditions-update-clarifies-vat-treatment.html",
  },
  {
    _id: "60dedcb1216dc",
    title: "5th eBay for Business Awards 2021 open for entries",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/06/5th-ebay-for-business-awards-2021-open-for-entries.html",
  },
  {
    _id: "610126159fb20",
    title: "External eBay Ads to feature Promoted Listings",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/07/external-ebay-ads-to-feature-promoted-listings.html",
  },
  {
    _id: "6103c33b0b0d1",
    title: "",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link: "",
  },
  {
    _id: "6124b5db494d3",
    title: "Boosting Seller Sales With Promoted Listings Advanced",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ebayinc.com/stories/news/boosting-seller-sales-with-promoted-listings-advanced/",
  },
  {
    _id: "6148776578cec",
    title: "eBay fulfilment by Orange Connex FAQs",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/09/ebay-fulfilment-by-orange-connex-faqs.html",
  },
  {
    _id: "5e7f3e7c44d76",
    title:
      "We are Actively Removing Price Gouging, Prohibited Items from eBay’s Marketplace",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/we-are-actively-removing-price-gouging-prohibited-items-from-ebays-marketplace/",
  },
  {
    _id: "5f23b61062630",
    title:
      "eBay Inc. Reports Better Than Expected Second Quarter 2020 Results and Raises Full Year Guidance",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-inc-reports-better-than-expected-second-quarter-2020-results-and-raises-full-year-guidance/",
  },
  {
    _id: "60b4cf9c3b569",
    title: "More About eBay Letting Regulators Remove Listings",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ecommercebytes.com/2021/05/28/more-about-ebay-letting-regulators-remove-listings/",
  },
  {
    _id: "60c1c94caef04",
    title: "Antique sellers new eBay Mandate deep dive",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tamebay.com/2021/06/antique-sellers-new-ebay-mandate-deep-dive.html",
  },
  {
    _id: "60c1c99217a6d",
    title: "eBay’s expanded Home range & designer’s guide",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/06/ebays-expanded-home-range-designers-guide.html",
  },
  {
    _id: "60d0668edb44d",
    title: "eBay Coded Coupons features in Seller Hub",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://tamebay.com/2021/06/ebay-coded-coupons-features-in-seller-hub.html",
  },
  {
    _id: "60d48f25a72bf",
    title: "eBay Certified Refurbished Hub update",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tamebay.com/2021/06/ebay-certified-refurbished-hub-update.html",
  },
  {
    _id: "60d985b773329",
    title: "eBay Completes Transfer of Classifieds Business to Adevinta",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-completes-transfer-of-classifieds-business-to-adevinta/",
  },
  {
    _id: "60e82aae7fcdf",
    title: "Simplifying Shipping Signals on eBay",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tech.ebayinc.com/product/simplifying-shipping-signals-on-ebay/",
  },
  {
    _id: "61039dbd71b7f",
    title: "eBay Open UK 2021 – Connecting and sharing, as one",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tamebay.com/2021/07/ebay-open-uk-2021-connecting-and-sharing-as-one.html",
  },
  {
    _id: "6103c316d56f2",
    title:
      "Announcing improvements and features now live on the eBay Stores experience",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://community.ebay.com/t5/Announcements/Announcing-improvements-and-features-now-live-on-the-eBay-Stores/ba-p/32117600",
  },
  {
    _id: "6103c337bf663",
    title:
      "eBay Launches New Trading Cards Experience Bringing Price Guide & Collection Features to Enthusiasts",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-launches-new-trading-cards-experience-bringing-price-guide-collection-features-to-enthusiasts/",
  },
  {
    _id: "6110fa885504a",
    title:
      "eBay Launches 2021 'Up & Running Grants' to Support Small Business Success",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-launches-2021-up-running-grants-to-support-small-business-success/",
  },
  {
    _id: "6135c739d1a22",
    title:
      "USPS to suspend package services to Australia effective immediately",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://community.ebay.com/t5/Announcements/USPS-to-suspend-package-services-to-Australia-effective/ba-p/32243280",
  },
  {
    _id: "5e9479737269a",
    title: "eBay Inc. Names Jamie Iannone Chief Executive Officer",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-inc-names-jamie-iannone-chief-executive-officer/",
  },
  {
    _id: "5eaaa11b5a710",
    title:
      "eBay Inc. Reports First Quarter 2020 Results and Provides COVID-19 Business Update",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-inc-reports-first-quarter-2020-results-and-provides-covid-19-business-update/",
  },
  {
    _id: "5ebe7b64e4c69",
    title: "How We’re Building a More Seamless Payments Product Experience",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/how-were-building-a-more-seamless-payments-product-experience/",
  },
  {
    _id: "5f06cbcbd2031",
    title: "eBay Motors Mobile App Launches Escrow and New Chat Features",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-motors-mobile-app-launches-escrow-and-new-chat-features/",
  },
  {
    _id: "60c1fa713604f",
    title: "Generation eBay to see graduates challenge executive strategy",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://tamebay.com/2021/06/generation-ebay-to-see-graduates-challenge-executive-strategy.html",
  },
  {
    _id: "60cb32aae1dc6",
    title: "eBay to Sell Korean Marketplace for $3.6 Billion",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ecommercebytes.com/2021/06/16/ebay-to-sell-korean-marketplace-for-3-6-billion/",
  },
  {
    _id: "60d986967d3e4",
    title: "eBay Video in gallery comes to UK listings",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tamebay.com/2021/06/ebay-video-in-gallery-comes-to-uk-listings.html",
  },
  {
    _id: "60dff484d241f",
    title: "New eBay July item specifics mandates & Free Optiseller help",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://tamebay.com/2021/07/new-ebay-july-item-specifics-mandates-free-optiseller-help.html",
  },
  {
    _id: "60f028d153acb",
    title: "eBay Signs Agreement to Sell Part of its Adevinta Stake to Permira",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-signs-agreement-to-sell-part-of-its-adevinta-stake-to-permira/",
  },
  {
    _id: "60f03a173494e",
    title: "eBay Mobile Filter increases filtering by 10%",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tamebay.com/2021/07/ebay-mobile-filter-increases-filtering-by-10.html",
  },
  {
    _id: "6108df5437ee8",
    title: "eBay Small Business Power – 75% off new listing costs",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tamebay.com/2021/08/ebay-small-business-power-75-off-new-listing-costs.html",
  },
  {
    _id: "610b9eceb65a0",
    title:
      "McDonald’s and eBay Team Up with Lightsource bp to Power US Operations With Solar",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/mcdonalds-and-ebay-team-up-with-lightsource-bp-to-power-us-operations-with-solar/",
  },
  {
    _id: "614c610ae30c4",
    title: "eBay Managed Payments is Now Live in All Global Markets",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-managed-payments-is-now-live-in-all-global-markets/",
  },
  {
    _id: "617a43a47be26",
    title: "eBay Inc. Reports Better Than Expected Third Quarter 2021 Results",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-inc-reports-better-than-expected-third-quarter-2021-results/",
  },
  {
    _id: "617a43a591d15",
    title: "eBay Inc. Reports Better Than Expected Third Quarter 2021 Results",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-inc-reports-better-than-expected-third-quarter-2021-results/",
  },
  {
    _id: "617b85a0116fb",
    title: "Faster Shipping Speeds for Cross-Border Orders",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://tech.ebayinc.com/product/faster-shipping-speeds-for-cross-border-orders/",
  },
  {
    _id: "618bab7abbccc",
    title: "eBay Launches ‘Refurbished’ Offering",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-launches-refurbished-offering/",
  },
  {
    _id: "61a61d77ccdaf",
    title: "eBay Acquires Sneaker Con Authentication Business",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-acquires-sneaker-con-authentication-business/",
  },
  {
    _id: "61b1bcf257d68",
    title:
      "eBay Suspends Some Seller Accounts by Mistake – Only Offers Lukewarm Apology",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.eseller365.com/ebay-suspends-sellers-mistake-lukewarm-apology/?utm_source=eSeller365&utm_campaign=0293494fc7-EMAIL_CAMPAIGN_2021_12_08_02_26&utm_medium=email&utm_term=0_80242f16e0-0293494fc7-95539033",
  },
  {
    _id: "61b804f0f3fbf",
    title: "eBay Clarifies Why Some Buyers See Duplicate Charges",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://www.eseller365.com/ebay-clarifies-why-buyers-see-duplicate-charges/",
  },
  {
    _id: "61b80540d91ed",
    title:
      "eBay Extends Seller Protections to Sellers Impacted by the Tornadoes That Hit Kentucky and Surrounding States",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://www.eseller365.com/ebay-seller-protections-kentucky-tornadoes/?utm_source=push&utm_campaign=onesignal&utm_medium=organic_post",
  },
  {
    _id: "61b96a2049ab8",
    title:
      "eBay Asks Sellers to Help Fight New 1099-K Reporting Thresholds for 2022",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.eseller365.com/ebay-asks-sellers-fight-low-thresholds-1099k/",
  },
  {
    _id: "61c009eb8ba76",
    title:
      "eBay Announces Change to Gross Merchandise Volume Definition and Releases Updated Historical Metrics",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/ebay-announces-change-to-gross-merchandise-volume-definition-and-releases-updated-historical-metrics/",
  },
  {
    _id: "61c00a42b062e",
    title: "End of year review with Murray Lambell, eBay UK GM",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/12/end-of-year-review-with-murray-lambell-ebay-uk-gm.html",
  },
  {
    _id: "61c00a6dc315f",
    title: "eBay tech sale savings on Apple & Dyson",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/12/ebay-tech-sale-savings-on-apple-dyson.html",
  },
  {
    _id: "61c3eff39b2e2",
    title: "Boxing up day – 27th December is top eBay selling day",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/12/boxing-up-day-27th-december-is-top-ebay-selling-day.html",
  },
  {
    _id: "61c3f02f4d194",
    title: "eBay sees Harry Potter cast spell over shoppers ahead of reunion",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://tamebay.com/2021/12/ebay-sees-harry-potter-cast-spell-over-shoppers-ahead-of-reunion.html",
  },
  {
    _id: "61cd23f815c95",
    title:
      "eBay Removes Popular Image Search Function from IOS and Android Apps",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.eseller365.com/ebay-removes-image-search-mobile-apps/",
  },
  {
    _id: "61cd243dcf610",
    title: "Boxing up day – 27th December is top eBay selling day",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://tamebay.com/2021/12/boxing-up-day-27th-december-is-top-ebay-selling-day.html",
  },
  {
    _id: "61cd2459d9104",
    title: "21 for ‘21: The eBay Listings That Went Viral This Year",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://www.ebayinc.com/stories/news/21-for-21-the-ebay-listings-that-went-viral-this-year/",
  },
];

export const blogData = [
  {
    _id: "5d8b7152ce49e",
    title: "How to Sell on eBay with Shopify eBay Marketplace Integration App?",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link: "https://cedcommerce.com/blog/sell-shopify-products-on-ebay/",
  },
  {
    _id: "5d8b7192af87b",
    title: "eBay Launches Managed Delivery Fulfillment Service",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link:
      "https://cedcommerce.com/blog/ebay-launches-managed-delivery-fulfillment-service/",
  },
  {
    _id: "5e185fc8a9f9a",
    title:
      "A complete list of the eBay errors with the best possible solutions",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/1.png",
    content_link: "https://cedcommerce.com/blog/ebay-errors-reason-solution/",
  },
  {
    _id: "60d07b492c0f2",
    title: "Why eBay Business account is better than Personal Account",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://cedcommerce.com/blog/why-ebay-business-account-is-better-than-personal-account/",
  },
  {
    _id: "5d8b72451d119",
    title: "How to give quality to your eBay photos?",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link: "https://cedcommerce.com/blog/quality-ebay-photos/",
  },
  {
    _id: "5e37d9496cad0",
    title: "How to add payment methods on eBay",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://cedcommerce.com/blog/how-to-add-payment-methods-on-ebay/",
  },
  {
    _id: "617c18517e9d5",
    title: "eBay Quarterly Report: Q1 Q2 Review Confirms Why eBay is Better!",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/2.png",
    content_link:
      "https://cedcommerce.com/blog/ebay-quarterly-report-q1-q2-review/",
  },
  {
    _id: "617c1868141ba",
    title: "Boost eBay Holiday Sales with Actionable and Simple Ways",
    description: "",
    image_url: "https://ebay.sellernext.com/marketplace-logos/0.png",
    content_link:
      "https://cedcommerce.com/blog/9-steps-to-ebay-selling-strategy/",
  },
];

export const trendingAppsData = [
  {
    url: "https://apps.shopify.com/facebook-marketplace-connector",
    name: "Facebook & Instagram Shopping",
    description:
      "Sell on Facebook & Instagram, list products and manage orders.",
    source:
      "https://cdn.shopify.com/app-store/listing_images/8e58c700f1ecc2539682f6a04a8852c7/icon/CNyDx+T0lu8CEAE=.png?height=84&width=84",
  },
  {
    url: "https://apps.shopify.com/wish-marketplace-integration",
    name: "Wish Marketplace Integration",
    description:
      "All in one solution to ease & manage your selling on Wish.com.",
    source:
      "https://cdn.shopify.com/app-store/listing_images/33e17a8988791e04821ac3b0d8b4f434/icon/CIaj/8j0lu8CEAE=.png?height=84&amp;width=84",
  },
  {
    url: `https://apps.shopify.com/ced-importer`,
    name: "Multichannel Importer",
    description:
      "Etsy Importer, eBay Importer Amazon Importer FBA, file import",
    source:
      "https://cdn.shopify.com/app-store/listing_images/5b1d8296277176f72fcfbdb371c4a6e8/icon/CJ2umLP0lu8CEAE=.png?height=84&width=84",
  },
  {
    url: "https://apps.shopify.com/etsy-marketplace-integration",
    name: "Etsy Marketplace Integration",
    description: "Easily manage listings, inventory, orders & more on Etsy.com",
    source:
      "https://cdn.shopify.com/app-store/listing_images/2fa150931ca28a5ed6a17dc69c40477b/icon/CNLtvLz0lu8CEAE=.png?height=84&amp;width=84",
  },
];

export const faqData = [
  {
    id: 18,
    show: false, // for collapse div
    search: true, // for search
    ques: "The package weight is not valid or is missing. Provide a valid number for the weight",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This issue occurs only when a merchant has opted for calculated
            service type in the shipping policy.
          </li>
          <li className="mb-2">
            The calculated service type requires weight for the products
            therefore you need to provide the weight for the products from your
            shopify store or in the app as well.
          </li>
          <li>
            If you don't provide the weight to all the products you can simply
            change the calculated service type to the flat service type (if it
            doesn't require weight for the products).
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 19,
    show: false, // for collapse div
    search: true, // for search
    ques: "The item specific Size Type is missing. Add Size Type to this listing, enter a valid value, and then try again",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            The size is not provided in the products(this error arise in
            clothing products). You can do this from your shopify store,
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 20,
    show: false, // for collapse div
    search: true, // for search
    ques: "You are not opted into Business Policies",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            You can opt out any time by selecting the Opt out link on the Manage
            business policies page. Your active listings won't be affected, but
            if you want to make changes to payment, shipping and returns terms,
            you’ll need to do that individually on each listing in the future.
            You can also opt back in to Business policies at any time. The
            policies you’ve already created will still be there, ready for you
            to use again
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 21,
    show: false, // for collapse div
    search: true, // for search
    ques: "A mixture of Self Hosted and EPS pictures are not allowed",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            The "self hosted" photos eBay is referring to your photos hosted at
            SSB. Anytime an image is sent by a third party service such as SSB,
            it's considered "self-hosted. eBay requires that eBay Picture
            Services (EPS) images be hosted on THEIR server.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 22,
    show: false, // for collapse div
    search: true, // for search
    ques: "Before you can list this item we need some additional information to create a seller account",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This response comes when a seller starts selling on eBay, so you
            need to select an automatic payment method for your selling fees and
            eBay is requiring the credit card information. Please log into your
            eBay account and add an automatic payment method for your eBay
            selling fees.
          </li>
          <li className={"mb-2"}>
            <a
              href={
                "https://cedcommerce.com/blog/how-to-add-payment-methods-on-ebay/"
              }
              target={"_blank"}
            >
              For additional help click here
            </a>
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 23,
    show: false, // for collapse div
    search: true, // for search
    ques: "Variation Specifics provided does not match with the variation specifics of the variations on the item",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            An originally single variant product now being sent as a
            multi-variant product - eBay will not allow this so the product
            needs to be completely ended, deleted and re-listed.
          </li>
          <li>
            The variation data for the product from the eCommerce store is not
            particularly good e.g. different attribute names in different
            variants.
          </li>
          <li>
            So, it would have originally listed fine but now is not getting
            updated due to failing the validation rules.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 24,
    show: false, // for collapse div
    search: true, // for search
    ques: "The shipping service is not available for this item location. Select a different service",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This error means that the selected shipping service is not available
            for the item location that you have provided for the products.
          </li>
          <li className="mb-2">
            The wrong item location provided for the products, provide the
            correct country & Item location within the Configuration section. Go
            to: Configuration section -> Global configuration -> ZIP Code.
          </li>
          <li>
            The wrong Shipping Service provided for the products, select the
            different Shipping Service within the Shipping Policy. Go to :
            Business Policy -> Shipping Policy.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 25,
    show: false, // for collapse div
    search: true, // for search
    ques: "Brand should contain only one value. Remove the extra values and try again",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This error is because of wrong mapping in the category template.
          </li>
          <li className="mb-2">
            You have maped Brand with Additional Images. Kindly map Brand with
            Vendor.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 26,
    show: false, // for collapse div
    search: true, // for search
    ques: "The tags Custom Bundle is/are disabled as Variant? || Custom Bundle is not allowed as a variation specific",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This error is because of the wrong mapping in the category template.
          </li>
          <li className="mb-2">Correct mapping for Custom Bundle is size.</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 27,
    show: false, // for collapse div
    search: true, // for search
    ques: "Your item-location was not filled in. The location field helps buyers determine the shipping cost(s) for the item, and should always be included",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            Zip code or postal code is not filled.Please enter a valid ZIP code.
          </li>
          <li className="mb-2">Go To: Configuration -> Global Policy.</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 28,
    show: false, // for collapse div
    search: true, // for search
    ques: "Listing titles are limited to 80 characters",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            An eBay title has been entered that is greater than 80 characters.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 29,
    show: false, // for collapse div
    search: true, // for search
    ques: "Price should be greater than 0.99",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">Increase the price of your products.</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 30,
    show: false, // for collapse div
    search: true, // for search
    ques: "Duplicate custom variation label",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            When the SKU’s are of same in the product variants.Kindly provide
            different SKU’s.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 31,
    show: false, // for collapse div
    search: true, // for search
    ques: "You will be unable to complete this request until payment is made or a credit card is put on file for automatic monthly billing",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            If you are a new seller, you may encounter this error message when
            trying to create your first listing. eBay requires sellers to set up
            a payment method to pay final value fees and listing fees.
          </li>
          <li className="mb-2">
            <a
              href={
                "https://www.ebay.com/help/selling/fees-credits-invoices/setting-changing-payment-method?id=4124"
              }
              target={"_blank"}
            >
              Set up automatic payments on eBay
            </a>
            .
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 32,
    show: false, // for collapse div
    search: true, // for search
    ques: "The email address you entered is not linked to a PayPal account.",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            This means the email address you have entered is not verified by
            eBay, therefore, you need to make sure the email address in your
            listing is the exact same email address you have attached to your
            PayPal account.
          </li>
          <li className="mb-2">
            <a
              href={
                "https://www.ebay.com/help/buying/paying-items/paying-paypal?id=4033"
              }
              target={"_blank"}
            >
              Paying with PayPal
            </a>
            .
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 33,
    show: false, // for collapse div
    search: true, // for search
    ques: "eBay account not connected",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            Connection breaks with your eBay seller account. Please reconnect
            with your eBay account.
          </li>
          <li className="mb-2">Go To: Top-Right Thumbnail -> Account</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 34,
    show: false, // for collapse div
    search: true, // for search
    ques: "Return Policy Attribute returnDescription Not Valid On This Site",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            You have to update the return policy from eBay seller panel and then
            sync with app and then again try to upload.{" "}
          </li>
          <li className="mb-2">
            Return description is allowed only on following eBay sites
            Germany:(DE), Austria:(AT), France:(FR), Italy:(IT), Spain:(ES),
            Motors
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 35,
    show: false, // for collapse div
    search: true, // for search
    ques: "Unable to send listing confirmation notice",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            {" "}
            When eBay don’t send listing confirmation mail to the sellers.It is
            just a acknowledgement message from eBay.
          </li>
        </ul>
      </React.Fragment>
    ),
  },

  {
    id: 36,
    show: false, // for collapse div
    search: true, // for search
    ques: 'Please select an international ship to location.||An error number "Shipto.CustomLocation.Required" occurred while processing your request.',
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            {" "}
            You have not chosen your international shipping destinations in the
            international shipping policy.
          </li>
          <li>Choose shipping destinations.</li>
          <li>
            From Business Policy>> Shipping policy >> underInternational
            Shipping Services
          </li>
        </ul>
      </React.Fragment>
    ),
  },

  {
    id: 37,
    show: false, // for collapse div
    search: true, // for search
    ques: "Invalid property type provided for PaymentProfileID. Expected integer but got NULL || Invalid property type provided for ReturnProfileID. Expected integer but got NULL || Invalid property type provided for ShippingProfileID. Expected integer but got NULL",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            Please make sure that the Default profile not empty and Business
            policy should be available on app.,
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 38,
    show: false, // for collapse div
    search: true, // for search
    ques: "Invalid <ShippingPackage>",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            No need to fill Package type value in Configuration -> App Settings
            -> Package Type. In case you have saved it then just unselect the
            value from first value of the dropdown,
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 39,
    show: false, // for collapse div
    search: true, // for search
    ques: "Invalid Multi-SKU item id supplied with variations.",
    ans: (
      <React.Fragment>
        <ul>
          <li>
            You are getting this error because the original item was not a
            Multi-SKU item and you are trying to relist it as a Multi-SKU item.
            If the original item was not listed as a Multi-SKU item, you cannot
            change it to be a Multi-SKU item during relist (or revise). You will
            need to create a new listing as a Multi-SKU item.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 1,
    show: false, // for collapse div
    search: true, // for search
    ques: "How to connect my eBay seller account with app",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            You need to authenticate your seller account with our app at second
            step of registration,
          </li>
          <li className="mb-2">
            If you need to reconnect with different details you can do so from
            the Accounts section of the app.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 2,
    show: false,
    search: true,
    ques: "How to import already selling products and sync with Shopify ",
    ans: (
      <ul>
        <li className="mb-2">
          At Step 4 of registration you need to map eBay attributes with Shopify
          attributes and proceed.
        </li>
        <li className="mb-2">
          This will automatically initiate Product Import and syncing process.
        </li>
      </ul>
    ),
  },
  {
    id: 3,
    show: false, // for collapse div
    search: true, // for search
    ques: "Will my products get duplicated if i already sell on eBay and use this App",
    ans: (
      <ul>
        <li className="mb-2">No, Our app handles duplicate listing issue.</li>
      </ul>
    ),
  },

  {
    id: 4,
    show: false, // for collapse div
    search: true, // for search
    ques: "How to register for eBay seller account ",
    ans: (
      <ul>
        <li className="mb-2">
          Registration for an eBay seller account can be done using your email
          address,for more information kindly visit{" "}
          <a
            href={
              "https://www.eBay/help/account/signing-ebay-account/signing-ebay-account?id=4191"
            }
            target={"_blank"}
          >
            eBay help section
          </a>
          .
        </li>
      </ul>
    ),
  },
  {
    id: 5,
    show: false,
    search: true,
    ques: "What are the terms and conditions to apply for eBay seller account",
    ans: (
      <p>
        Though there are no prescribed terms and conditions, it is recommended
        that you go through{" "}
        <a
          href={"https://pages.ebay.in/terms-and-conditions/"}
          target={"_blank"}
        >
          terms and conditions{" "}
        </a>
        , put forth by eBay.{" "}
      </p>
    ),
  },
  {
    id: 6,
    show: false,
    search: true,
    ques: "What is profiling and what is Default Profile",
    ans: (
      <React.Fragment>
        <p className="text-justify">
          <b>Profiling</b> is a feature using which you can upload products with
          particular specifications by making your own customised profile (for
          example- all products with price 10$) from App to eBay marketplace.
        </p>

        <p className="text-justify">
          So whenever you want to upload bulk products you can simply make your
          customised profile with specifications of your choice and upload all
          products in one go.
        </p>

        {/*<p>In default Profile We Have Some Fixed Format. For Example Click <a href="javascript:void(0)" onClick={this.modalOpen}>Here</a></p>*/}
      </React.Fragment>
    ),
  },
  {
    id: 7,
    show: false,
    search: true,
    ques: "What do templates in the app stand for? Are they required",
    ans: (
      <React.Fragment>
        <ul>
          <li className="mb-2">
            A listing template contains information that is required to create a
            product listing: title, description, images, and other information
            that you indicate on eBay’s Sell Your Item form. Multiple listing
            templates for each product can be assigned, which allows you to list
            products in multiple ways.
          </li>
          <li className="mb-2">
            Only <b>category template</b> is a required template.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 8,
    show: false,
    search: true,
    ques: "How to create a template",
    ans: (
      <React.Fragment>
        <p className="mb-2">You can create template by following steps </p>
        <ul>
          <li className="mb-2">
            Visit{" "}
            <a
              style={{ color: "blue" }}
              // onClick={this.redirect.bind(this, "/panel/template/list")}
            >
              <b>Templates</b>
            </a>{" "}
            section of the app .
          </li>
          <li className="mb-2">Select a template type you want to create.</li>
          <li className="mb-2">Click on create new.</li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 9,
    show: false,
    search: true,
    ques: "What is the difference between Personal eBay account and Business eBay account",
    ans: (
      <React.Fragment>
        <ul>
          <li>
            Personal eBay accounts can be created if, someone wants to sell
            casually. For example, if a seller wants to end a particular stock
            of products, he can create <b>Personal eBay account</b>.
          </li>
          <li>
            If you are selling or planning to sell large quantites then you need
            to register for a <b>Business eBay account</b>.
          </li>
        </ul>
        <p>
          For more information regarding the same you can refer to{" "}
          <a
            href={
              "https://docs.cedcommerce.com/shopify/ebay-marketplace-integration"
            }
            target={"_blank"}
          >
            eBay help documentation.
          </a>
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 10,
    show: false,
    search: true,
    ques: "What is Business policy",
    ans: (
      <React.Fragment>
        <p className={"mb-2"}>
          For creating a listing you`ll need to choose a set of business
          policies of buyers ie.{" "}
        </p>
        <ul>
          <li className={"mb-2"}>Payment policy</li>
          <li className={"mb-2"}>Shipping policy</li>
          <li className={"mb-2"}>Return policy</li>
        </ul>

        <p>
          but you can streamline the process by creating business policies
          templates which can be used to define these set of policies on each
          listing without re-defining them again-again
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 11,
    show: false,
    search: true,
    ques: "Is order management section based on profiling, templating and business policy",
    ans: (
      <React.Fragment>
        <p>
          <b>No</b>, If you are only on our app for order management then there
          is no need to create business policies and templates , Your orders
          will be managed using default settings.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 12,
    show: false,
    search: true,
    ques: "Does the app support for eBay Motors site",
    ans: (
      <React.Fragment>
        <p>
          <b>Yes</b>, Our app does support eBay Motors site
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 13,
    show: false,
    search: true,
    ques: "What is the difference between Auction and Fixed price item",
    ans: (
      <React.Fragment>
        <ul>
          <li>
            <p>
              <b>Auction price item : </b> Buyers can purchase your item
              immediately or place a bid.
            </p>
          </li>
          <li>
            <p>
              <b>Fixed price item : </b> Buyers can purchase your item
              immediately at the price you set, but cannot bid on your item.
            </p>
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 14,
    show: false,
    search: true,
    ques: "Does the app support secondary category setting ",
    ans: (
      <React.Fragment>
        <p>
          <b>Yes,</b> app does support secondary category, you can set the same
          during creation of category template by selecting{" "}
          <b>Enable secondary category.</b>
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 15,
    show: false,
    search: true,
    ques: "Does the app support international shipping and global shipping program ",
    ans: (
      <React.Fragment>
        <p>
          <b>Yes,</b> app supports global shipping program and international
          shipping ,given global shipping is enabled from eBay seller panel.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 16,
    show: false,
    search: true,
    ques: "Does the app support for all eBay Countries ",
    ans: (
      <React.Fragment>
        <p>
          <b>Yes,</b> our app does support all eBay countries.
        </p>
      </React.Fragment>
    ),
  },

  {
    id: 17,
    show: false,
    search: true,
    ques: "Can we manage multiple eBay stores from one app ",
    ans: (
      <React.Fragment>
        <p>
          <b>No,</b> as of now multiple eBay stores can`t be managed from the
          app.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 18,
    show: false,
    search: true,
    ques: 'Your listing cannot contain javascript (".cookie", "cookie(", "replace(", IFRAME, META, or includes), cookies or base href.',
    ans: (
      <React.Fragment>
        <p>
          eBay doesn't allow to list products with these javascripts words.You
          need to remove the script tags, videos and above words from
          description/title of the products.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 19,
    show: false,
    search: true,
    ques: "How does app credits work?",
    ans: (
      <React.Fragment>
        <p>
          As our app plans are based on credits, here is the brief explanation
          over the app Credits.
        </p>
        <p>
          1 Product Credit means 1 product can be listed on eBay through the
          app. The product can be a simple or variant product. Therefore, if you
          have 1000 product credits you can list 1000 products on eBay through
          the app.
        </p>
        <br />
        <p>About Product Credits</p>
        <ul>
          <li>
            1 Product Credit => 1 product can be listed on eBay through the app.
          </li>
          <li>
            1000 Product Credits=> 1000 products can be listed on eBay through
            the app.
          </li>
        </ul>
        <br />
        <p>
          1 Order credit means 1 eBay Order can be managed from Shopify through
          the app. Therefore, if you have 500 order credits then you can manage
          500 orders through the app.
        </p>
        <br />
        <p>About Order Credits</p>
        <ul>
          <li>
            1 Order credit=> 1 eBay Order can be managed from Shopify through
            the app.
          </li>
          <li>
            500 Order credits=> 500 eBay Order can be managed from Shopify
            through the app.
          </li>
        </ul>
      </React.Fragment>
    ),
  },
  {
    id: 20,
    show: false,
    search: true,
    ques: "Email contains an invalid domain name ?",
    ans: (
      <React.Fragment>
        <p>
          This response means that the email id provided by the buyer does not
          have a valid domain. If you want this order to be created in Shopify,
          kindly provide us with the default email Id that we can use for making
          this order in Shopify. You will receive an update on it in 24 hours.
          As the creation of the order requires the involvement of the tech
          team.
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 21,
    show: false,
    search: true,
    ques: "Unable to reserve inventory ?",
    ans: (
      <React.Fragment>
        <p>
          This response means that the ordered product doesn't contain stock/
          inventory.
          <ul>
            <li>
              Kindly provide stock for the product for both the ordered products
            </li>
            <li>
              Then delete the order from the app, and in a few minutes, both the
              orders will get synced.
            </li>
          </ul>
        </p>
      </React.Fragment>
    ),
  },
  {
    id: 22,
    show: false,
    search: true,
    ques: "Product is either not uploaded from app or title and sku did not match else does not exists ?",
    ans: (
      <React.Fragment>
        <p>
          This response means that the ordered product is not available in your
          Shopify store.
          <br />
          If the product is available in your Shopify store, you need to provide
          the same title or SKU on both the platforms. As the app map eBay and
          Shopify attributes (title or SKU) of already existing eBay products.
          <br />
          Then delete the order from the app, and in a few minutes, the order
          will get synced.
        </p>
      </React.Fragment>
    ),
  },
];

export const planData = {
  id: 22915776601,
  name: "Premium Mega Saver",
  api_client_id: 2684447,
  price: "0.50",
  status: "active",
  return_url:
    "https://ebay.sellernext.com/shopify/payment/checkNew?plan_id=20&log_id=7951&type=recurring&shop=anubhav-test-1.myshopify.com",
  billing_on: "2023-07-18",
  created_at: "2022-07-18T09:50:34-04:00",
  updated_at: "2022-07-18T09:50:45-04:00",
  test: true,
  activated_on: "2022-07-18",
  cancelled_on: null,
  trial_days: 0,
  trial_ends_on: "2022-07-18",
  decorated_return_url:
    "https://ebay.sellernext.com/shopify/payment/checkNew?charge_id=22915776601&log_id=7951&plan_id=20&shop=anubhav-test-1.myshopify.com&type=recurring",
};
