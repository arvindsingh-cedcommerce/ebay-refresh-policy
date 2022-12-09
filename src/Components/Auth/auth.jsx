import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import LoginComponent from "./login/LoginComponent";

class Auth extends Component {
 
    render() {
        return (
            <Switch>
                <Route exact path={'/auth'} render={() => {
                    return <Redirect to={'/auth/login'}/>
                }}/>
                {/* <Route path={'/auth/login'} component={Login}/> */}
                <Route path={'/auth/login'} component={LoginComponent}/>
            </Switch>
        );
    }
}

export default Auth;