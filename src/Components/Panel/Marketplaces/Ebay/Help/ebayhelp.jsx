import React, {Component} from 'react';
import {Page, Tabs} from "@shopify/polaris";
import {ebayhelpSectiontabs} from "./helpHelper";
import {bannerPolaris, mediaCardPolaris, videoThumbnailPolaris} from "../../../../../PolarisComponents/InfoGroups";
let ebayBanner = require("../../../../../assets/welcome_screen.jpg");
class Ebayhelp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs : {
              tabList : ebayhelpSectiontabs,
              selectedTab : 0
            },
            faq: [
                { question : 'Test question', answer : 'Test answer', type: 'info'},
                { question : 'Test question 1', answer : 'Test answer 1', type: 'warning'},
                { question : 'Test question 2', answer : 'Test answer 2', type: 'attention'},
                { question : 'Test question 3', answer : 'Test answer 3', type: 'success'},
            ],
            videos: [
                { url : 'https://www.youtube.com/watch?v=w1rlb6c0G2w', title: 'test title', description : 'test description' },
                { url : 'https://www.youtube.com/watch?v=w1rlb6c0G2w', title: 'test title 1', description : 'test description 1' },
                { url : 'https://www.youtube.com/watch?v=w1rlb6c0G2w', title: 'test title 2', description : 'test description 2' },
                { url : 'https://www.youtube.com/watch?v=w1rlb6c0G2w', title: 'test title 3', description : 'test description 3' }
            ]
        }
    }

    handleTabChange(tab){
        let { tabs } = this.state;
        tabs.selectedTab = tab
        this.setState({ tabs });
    }

    renderTabStructure(tab){
        let { faq, videos } = this.state;
        switch (tab){
            case 0:
                let faqs = [];
                faq.forEach((obj) => {
                   faqs = [ ...faqs, bannerPolaris(obj.question, obj.answer, obj.type)]
                });
                return faqs;
            case 1:
                let videosList = [];
                videos.forEach((obj) => {
                    videosList = [ ...videosList, mediaCardPolaris(obj.title, obj.description, videoThumbnailPolaris(ebayBanner, false), { content : 'Learn more', onAction : () =>{}})]
                });
                return videosList;

            default:
                break;
        }
    }

    render() {
        let { tabs } = this.state;
        let { tabList, selectedTab } = tabs;
        return (
            <Page fullWidth title={'Help'}>
                <Tabs tabs={tabList} selected={selectedTab} onSelect={this.handleTabChange.bind(this)}/>
                {
                    this.renderTabStructure(selectedTab)
                }
            </Page>
        );
    }
}

export default Ebayhelp;