import React from "react";
import {Navigation, TopBar} from "@shopify/polaris";
import {
    ProductsMajorMonotone,
    OrdersMajorMonotone,
    LegalMajorMonotone,
    CollectionsMajorMonotone,
    SettingsMajorMonotone,
    AnalyticsMajorMonotone,
    AttachmentMajorMonotone, ProfileMajorMonotone,
    CashDollarMajorMonotone, ActivitiesMajorMonotone, QuestionMarkMajorMonotone, EmailMajorMonotone
} from "@shopify/polaris-icons";
import {marketplaceOptions} from "./PanelHelper/panelhelper";

export function userMenuActions(userMenuAction) {
    let userAction = [];
    marketplaceOptions.forEach( marketplace => {
        let { label, value, icon } =  marketplace;
        userAction.push(
            {
                items: [{content: label, onAction: userMenuAction.bind(this, value), icon}],
            },
        );
    });
    // subMenuOptions.forEach( menuOption => {
    //     let { label, value, icon } =  menuOption;
    //     userAction.push(
    //         {
    //             items: [{content: label, onAction: userMenuAction.bind(this, value), icon}],
    //         },
    //     );
    // });
    return [...userAction];
}

export function userMenuMarkup(userMenu = {}) {
    let { userMenuToggle, userMenuAction, active, userDetails} = userMenu;
    let {   name, initials, storeName } = userDetails;
    return (
        <TopBar.UserMenu
            actions={userMenuActions(userMenuAction)}
            name={name}
            detail={storeName}
            initials={initials}
            open={active}
            onToggle={userMenuToggle}
        />
    );
}


export function topBarMarkup(  toggleMobileNavigationActive, userMenu){
   return  (
        <TopBar
            showNavigationToggle
            // userMenu={userMenuMarkup(userMenu)}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );
}

export function navigationMarkup(redirect = ()=>{}, props, marketplace = ''){
    if( marketplace === 'ebay') {
        let { activity } = props;
        return (
            <Navigation location={props.location.pathname}>
                <Navigation.Section
                    title={marketplace.toUpperCase()}
                    items={[
                        {
                            label: 'Dashboard',
                            icon: AnalyticsMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/dashboard');
                            }
                        },
                        {
                            label: 'Products',
                            icon: ProductsMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/products');
                            }
                        }, {
                            label: 'Order',
                            icon: OrdersMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/orders');
                            }
                        }, {
                            label: 'Profiles',
                            icon: CollectionsMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/profiles');
                            }
                        }, {
                            label: 'Business policies',
                            icon: LegalMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/policies');
                            }
                        }, {
                            label: 'Templates',
                            icon: AttachmentMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/templates');
                            }
                        },
                        // {
                        //     label: 'Payment plan',
                        //     icon: CashDollarMajorMonotone,
                        //     onClick() {
                        //         redirect('/panel/ebay/pricing');
                        //     }
                        // },
                        {
                            label: 'Configurations',
                            icon: SettingsMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/configurations');
                            }
                        },
                        // {
                        //     label: 'Activity',
                        //     icon: ActivitiesMajorMonotone,
                        //     badge: activity.count ? `${activity.count}`:false,
                        //
                        //     onClick() {
                        //         redirect('/panel/ebay/activity');
                        //     }
                        // },
                        {
                            label: 'Messages',
                            icon: EmailMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/message');
                            }
                        },{
                            label: 'Help',
                            icon: QuestionMarkMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/help');
                            }
                        },{
                            label: 'Accounts',
                            icon: ProfileMajorMonotone,
                            onClick() {
                                redirect('/panel/ebay/accounts');
                            }
                        }
                    ]}
                />
            </Navigation>
        );
    }else if( marketplace === 'amazon'){
        return (
            <Navigation location={props.location.pathname}>
                <Navigation.Section
                    title={marketplace.toUpperCase()}
                    items={[
                        {
                            label: 'Products',
                            icon: ProductsMajorMonotone,
                            onClick() {
                                redirect('/panel/amazon/products');
                            }
                        }, {
                            label: 'Order',
                            icon: OrdersMajorMonotone,
                            onClick() {
                                redirect('/panel/amazon/orders');
                            }
                        }, {
                            label: 'Profiles',
                            icon: CollectionsMajorMonotone,
                            onClick() {
                                redirect('/panel/amazon/profiles');
                            }
                        },{
                            label: 'Templates',
                            icon: AttachmentMajorMonotone,
                            onClick() {
                                redirect('/panel/amazon/templates/list');
                            }
                        },{
                            label: 'Configurations',
                            icon: SettingsMajorMonotone,
                            onClick() {
                                redirect('/panel/amazon/configurations');
                            }
                        },{
                            label: 'Feeds',
                            icon: SettingsMajorMonotone,
                            onClick() {
                                redirect('/panel/amazon/feeds');
                            }
                        },{
                            label: 'Accounts',
                            icon: ProfileMajorMonotone,
                            onClick() {
                                redirect('/panel/amazon/accounts');
                            }
                        },{
                            label: 'Help',
                            icon: QuestionMarkMajorMonotone,
                            onClick() {
                                redirect('/panel/amazon/help');
                            }
                        }
                    ]}
                />
            </Navigation>
        );
    }
    return [];
}