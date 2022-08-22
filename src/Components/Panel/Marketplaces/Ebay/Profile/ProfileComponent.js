import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import ProfileGridComponent from './ProfileGridComponent';
import CreateProfilePolaris from './Profilepages/CreateProfilePolaris';

const ProfileComponent = () => {
    return (
        <Switch>
          <Route
            path="/panel/ebay/profiles/grid"
            component={ProfileGridComponent}
          />
          <Route
            path="/panel/ebay/profiles/edit"
            component={CreateProfilePolaris}
          />
          <Route
            exact
            path="/panel/ebay/profiles"
            render={() => <Redirect to="/panel/ebay/profiles/grid" />}
          />
        </Switch>
      );
}

export default ProfileComponent