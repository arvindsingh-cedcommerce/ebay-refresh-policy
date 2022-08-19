import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import EbaytemplateList from "./ebaytemplateList";
import EbaytemplateHandler from "./ebaytemplateHandler";

class Ebaytemplate extends Component {

    render() {
        return (
                <Switch>
                    <Route path='/panel/ebay/templates/list' component={EbaytemplateList}/>
                    <Route path='/panel/ebay/templates/handler' component={EbaytemplateHandler}/>
                    <Route exact path="/panel/ebay/templates" render={() => (
                        <Redirect to="/panel/ebay/templates/list"/>
                    )}/>
                </Switch>

        );
    }
}

export default Ebaytemplate;