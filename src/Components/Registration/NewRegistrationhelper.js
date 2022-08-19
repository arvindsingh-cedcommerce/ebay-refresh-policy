export const optionsAccountType = [
    { label : 'Live Account', value:'production' },
    { label : 'Sandbox Account', value:'sandbox' },
];

export const plansSample = [
    {
        "_id": {
            "$oid": "5d5662ad7399f0f5c3763ac6"
        },
        "title": "Silver",
        "description": " All Listed Features Available",
        "validity": "30",
        "connectors": "shopify",
        "custom_price": 49,
        "discount_type": "Fixed",
        "discount": "",
        "services_groups": [
            {
                "title": "Silver plan services",
                "description": "Features provided in Silver Plan",
                "services": [
                    {
                        "title": "One Year Validity",
                        "code": "shopify_importer",
                        "type": "importer",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "50",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Manage up-to 5000 products",
                        "code": "ebay_uploader",
                        "type": "uploader",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "5000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Sync up-to 3000 orders",
                        "code": "ebay_order_sync",
                        "type": "syncing",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "3000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    }
                ]
            }
        ],
        "plan_id": "4"
    },
    {
        "_id": {
            "$oid": "5d5a42142c262a35e937cb6f"
        },
        "title": "Silver Mega Saver",
        "description": " All Listed Features Available",
        "validity": "365",
        "connectors": "shopify",
        "custom_price": 399,
        "discount_type": "Fixed",
        "discount": "",
        "services_groups": [
            {
                "title": "Silver Mega Saver Services",
                "description": "Features provided in Silver Mega Saver",
                "services": [
                    {
                        "title": "One Year Validity",
                        "code": "shopify_importer",
                        "type": "importer",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "50",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Manage up-to 5000 products",
                        "code": "ebay_uploader",
                        "type": "uploader",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "5000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Sync up-to 3000 orders",
                        "code": "ebay_order_sync",
                        "type": "syncing",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "3000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    }
                ]
            }
        ],
        "plan_id": "9"
    },
    {
        "_id": {
            "$oid": "5d5a430e2c262a35e937e8d5"
        },
        "title": "Gold Mega Saver",
        "description": "All Listed Features Available",
        "validity": "365",
        "connectors": "shopify",
        "custom_price": 499,
        "discount_type": "Fixed",
        "discount": "",
        "services_groups": [
            {
                "title": "Gold Mega Saver Services",
                "description": "Features provided in Gold Plan",
                "services": [
                    {
                        "title": "One Year Validity",
                        "code": "shopify_importer",
                        "type": "importer",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "50",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Manage up-to 10000 products",
                        "code": "ebay_uploader",
                        "type": "uploader",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "10000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Sync up-to 5000 orders",
                        "code": "ebay_order_sync",
                        "type": "syncing",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "5000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    }
                ]
            }
        ],
        "plan_id": "10"
    },
    {
        "_id": {
            "$oid": "5d5a40532c262a35e937a7a0"
        },
        "title": "Bronze Mega Saver",
        "description": " All Listed Features Available",
        "validity": "365",
        "connectors": "shopify",
        "custom_price": 229,
        "discount_type": "Fixed",
        "discount": "",
        "services_groups": [
            {
                "title": "Bronze Mega Saver Services",
                "description": "Features provided in Bronze Mega Saver",
                "services": [
                    {
                        "title": "One Year Validity",
                        "code": "shopify_importer",
                        "type": "importer",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "50",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Manage up-to 2500 products",
                        "code": "ebay_uploader",
                        "type": "uploader",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "2500",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Sync up-to 1000 orders",
                        "code": "ebay_order_sync",
                        "type": "syncing",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "1000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    }
                ]
            }
        ],
        "plan_id": "7"
    },
    {
        "_id": {
            "$oid": "5d5662ad7399f0f5c3763ac7"
        },
        "title": "Gold",
        "description": "All Listed Features Available",
        "validity": "30",
        "connectors": "shopify",
        "custom_price": 69,
        "discount_type": "Fixed",
        "discount": "",
        "services_groups": [
            {
                "title": "Gold plan services",
                "description": "Features provided in Gold Plan",
                "services": [
                    {
                        "title": "One Year Validity",
                        "code": "shopify_importer",
                        "type": "importer",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "50",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Manage up-to 10000 products",
                        "code": "ebay_uploader",
                        "type": "uploader",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "10000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Sync up-to 5000 orders",
                        "code": "ebay_order_sync",
                        "type": "syncing",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "5000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    }
                ]
            }
        ],
        "plan_id": "5"
    },
    {
        "_id": {
            "$oid": "5d5a45752c262a35e93827c0"
        },
        "title": "Platinum Mega Saver",
        "description": "All Listed Features Available",
        "validity": "365",
        "connectors": "shopify",
        "custom_price": 799,
        "discount_type": "Fixed",
        "discount": "",
        "services_groups": [
            {
                "title": "Platinum Mega Saver Services",
                "description": "Features provided in Platinum Mega Saver",
                "services": [
                    {
                        "title": "One Year Validity",
                        "code": "shopify_importer",
                        "type": "importer",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "50",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Manage unlimited (up-to 150,000) products",
                        "code": "ebay_uploader",
                        "type": "uploader",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "150000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Sync unlimited orders",
                        "code": "ebay_order_sync",
                        "type": "syncing",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "150000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    }
                ]
            }
        ],
        "plan_id": "11"
    },
    {
        "_id": {
            "$oid": "5d5662ad7399f0f5c3763ac8"
        },
        "title": "Platinum",
        "description": "All Listed Features Available",
        "validity": "30",
        "connectors": "shopify",
        "custom_price": 99,
        "discount_type": "Fixed",
        "discount": "",
        "services_groups": [
            {
                "title": "Platinum plan services",
                "description": "Features provided in Platinum Plan",
                "services": [
                    {
                        "title": "One Year Validity",
                        "code": "shopify_importer",
                        "type": "importer",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "50",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Manage unlimited (up-to 150,000) products",
                        "code": "ebay_uploader",
                        "type": "uploader",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "150000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    },
                    {
                        "title": "Sync unlimited orders",
                        "code": "ebay_order_sync",
                        "type": "syncing",
                        "charge_type": "Prepaid",
                        "required": 1,
                        "service_charge": "",
                        "prepaid": {
                            "service_credits": "150000",
                            "validity_changes": "Replace",
                            "fixed_price": "",
                            "reset_credit_after": "",
                            "expiring_at": ""
                        },
                        "postpaid": {
                            "per_unit_usage_price": "",
                            "capped_amount": ""
                        }
                    }
                ]
            }
        ],
        "plan_id": "6"
    }
]
