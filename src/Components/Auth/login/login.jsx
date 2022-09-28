import React, {Component} from 'react';
import {Form, Page, Stack} from "@shopify/polaris";
import {button, textField} from "../../../PolarisComponents/InputGroups";
import {globalState, refreshSession} from "../../../services/globalstate";
import {notify} from "../../../services/notify";
import {login} from "../../../Apirequest/authApi";
import {parseQueryString} from "../../../services/helperFunction";
import { getDashboardData } from '../../../APIrequests/DashboardAPI';
import { dashboardAnalyticsURL } from '../../../URLs/DashboardURL';

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            credentials: {
                username: '',
                password: '',
            },
            loader: false
        }
    }

    onChange(key, value){
        let { credentials } = this.state;
        credentials[key] = value;
        this.setState({ credentials });
    }

    componentDidMount() {
       refreshSession();
       this.setQueryParams()
    }

    setQueryParams(){
        let { user_token } = parseQueryString(this.props.location.search);
        if(user_token) {
            globalState.setLocalStorage('user_authenticated', 'true');
            globalState.setLocalStorage('auth_token', user_token);
            this.redirect('/welcome');
        }
    }

    async getAndSetToken(){
        let { credentials } = this.state;
        let getToken = await login(credentials);
        if(getToken.success){
            globalState.setLocalStorage('user_authenticated', 'true');
            globalState.setLocalStorage('auth_token', getToken.data.token);
            notify.success(getToken.message);
            this.setState({ loader :false}, async()=>{
                let { success, data } = await getDashboardData(
                    dashboardAnalyticsURL,
                    {refreshDashboard: true}
                );
                this.redirect('/welcome');
            });
        }else{
            notify.error(getToken.message);
            this.setState({ loader :false});
        }

    }

    onSubmit(){
        this.setState({ loader :true}, ()=>{
            this.getAndSetToken();
        });
    }

    redirect(url){
        this.props.history.push(url);
    }

    render() {
        let { credentials, loader } = this.state;
        let { username, password} = credentials;
        return (
            <Page title={'Login'}>
                <Form onSubmit={this.onSubmit.bind(this)}>
                <Stack distribution={"fillEvenly"} vertical={true}>
                    {
                        textField('Username', username, this.onChange.bind(this,'username'))
                    }
                    {
                        textField('Password', password, this.onChange.bind(this,'password'),"","",false, 'password')
                    }
                    {
                        button('Submit', this.onSubmit.bind(this),false, loader)
                    }
                </Stack>
                </Form>
            </Page>
        );
    }
}

export default Login;