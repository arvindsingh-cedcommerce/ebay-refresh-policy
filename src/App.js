import React, {Component} from 'react';
import {Redirect, Route, Switch } from 'react-router-dom';
import Auth from "./Components/Auth/auth";
import Welcome from "./Components/Welcome/welcome";
// import Registration from "./Components/Registration/registration";
// import Panel from "./Components/Panel/panel";
import Redirectmessage from "./Components/Message/redirectmessage";
// import NewRegistration from './Components/Registration/NewRegistration';
import {NewRegistration} from './Components/Registration/NewRegistration';
import NewPanel from './Components/Panel/NewPanel';
import { FinalRegistration } from './Components/Registration/FinalRegistration';
import { FinalRegistrationItemLocation } from './Components/Registration/FinalRegistrationItemLocation';

class App extends Component {
    render() {
        return (
            <Switch>
              <Route exact path={'/'} render={() => {
                 return <Redirect to={'/auth'}/>
              }}/>
              <Route path={'/auth'} component={Auth}/>
              <Route path={'/show/message'} component={Redirectmessage}/>
              <Route path={'/welcome'} component={Welcome}/>
              {/* <Route path={'/registrations'} component={Registration}/> */}
              {/* <Route path={'/registrations'} component={NewRegistration}/> */}
              {/* <Route path={'/registrations'} component={FinalRegistration}/> */}
              <Route path={'/registrations'} component={FinalRegistrationItemLocation}/>
              {/* <Route path={'/panel'} component={Panel}/> */}
              <Route path={'/panel'} component={NewPanel}/>
            </Switch>
        );
    }
}

export default App;