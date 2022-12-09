import React, {Component} from 'react';
import {Card, DisplayText, Form, Page, Stack} from "@shopify/polaris";
import {button, textField} from "../../../PolarisComponents/InputGroups";
import {globalState, refreshSession} from "../../../services/globalstate";
import {notify} from "../../../services/notify";
import {login} from "../../../Apirequest/authApi";
import {parseQueryString} from "../../../services/helperFunction";
import { getDashboardData } from '../../../APIrequests/DashboardAPI';
import { dashboardAnalyticsURL } from '../../../URLs/DashboardURL';
import { environment } from '../../../environment/environment';
import Cancel from "../../../assets/warning.png";
import * as queryString from "query-string";
class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            credentials: {
                username: '',
                password: '',
            },
            loader: false,
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

    autoRedirect()
    {
        const  queryParams = queryString.parse(this.props.location.search);
        if(queryParams['user_token']!=null && queryParams['code']!=null) {
            globalState.setLocalStorage('user_authenticated', 'true');
            globalState.setLocalStorage('auth_token', queryParams['user_token']);
            globalState.setLocalStorage('shop', queryParams['shop']);
            this.redirect('/welcome');
        } else if ( queryParams['admin_user_token'] ) {
            globalState.setLocalStorage('user_authenticated', 'true');
            globalState.setLocalStorage('auth_token',queryParams['admin_user_token']);
            this.redirect('/welcome');
        }

    }

    removeLocalStorage() {
        globalState.removeLocalStorage('user_authenticated');
          globalState.removeLocalStorage('auth_token');
        //   if((this.verifyCompatibilityofBrowser())) {
        //     this.getMaintainenceCheck();
              this.autoRedirect();
        //       this.state.browserCompatible=true;
        //   }
        //   else{
        //       this.state.browserCompatible=false;
        //   }
  
      }
    componentDidMount() {
      this.removeLocalStorage();
    }
    
    async getAndSetToken(){
        let { credentials } = this.state;
        let getToken = await login(credentials);
        if(getToken.success){
            globalState.setLocalStorage('user_authenticated', 'true');
            globalState.setLocalStorage('auth_token', getToken.data.token);
            notify.success(getToken.message);
            this.setState({ loader :false}, ()=>{
                
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


    renderExceptionBanner(){
        return <Card>
        <Card.Section>
            <div style={{textAlign:'center',minHeight:'35rem',marginTop:'10rem'}}>
                <Stack alignment={"center"} vertical={true}>
                    <img src={Cancel} style={{height:'5rem',width:'5rem'}} />
                    <DisplayText size={"extraLarge"}>
                        Oops !!
                    </DisplayText>
                    <DisplayText size='small'>
                        <b>Unauthorized access attempt</b>
                    </DisplayText>
                    <DisplayText size='small'>
                        Kindly revisit the app from your shopify store's apps section
                    </DisplayText>
                </Stack>
            </div>
        </Card.Section>
    </Card>
    }

    render() {
        let { credentials, loader } = this.state;
        let { username, password} = credentials;
        return environment.isLive ? <Page
        title=""
    >{this.renderExceptionBanner()}
    </Page> : (
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