import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./login/login";

class Auth extends Component {

    render() {
        return (
            <Switch>
                <Route exact path={'/auth'} render={() => {
                    return <Redirect to={'/auth/login'}/>
                }}/>
                <Route path={'/auth/login'} component={Login}/>
            </Switch>
        );
    }
}

export default Auth;