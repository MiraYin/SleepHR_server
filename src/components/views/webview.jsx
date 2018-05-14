import React from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';

class WebView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loginFlag: false,
            myName: '',
            myFriends: [],
            myID: null
        };
        this.checkLoginState = this.checkLoginState.bind(this);
        this.fetchprofile = this.fetchprofile.bind(this);
        this.statusChangeCallback = this.statusChangeCallback.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1950569411924737',
                xfbml      : true,
                cookie     : true,
                version    : 'v3.0'
            });
            FB.AppEvents.logPageView();
            FB.Event.subscribe('auth.statusChange', function(response) {
                if (response.authResponse) {
                    this.checkLoginState();
                } else {
                    console.log('---->User cancelled login or did not fully authorize.');
                }
            }.bind(this));
        }.bind(this);

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    //run after login is successful
    fetchprofile(){
        console.log('Fetching profile.... ');
        FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name);
            setState({
                myName: response.name,
                myID: response.id,
                loginFlag: true
            });
        });
        FB.api('/me/friends', function(response) {
            console.log(response);
            setState({
                myFriends: response.data.map(friend => friend.id)
            });
        });
        //browserHistory.push('/dashboard');
    }
    // called when someone finishes with the Login Button
    checkLoginState() {
        FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
        }.bind(this));
    }
    
    // called with the results from from FB.getLoginStatus().
    statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
            this.fetchprofile();
        } 
    }

    handleClick() {
        FB.login(this.checkLoginState());
    }

    render(){
        return (
            <div>

            <h1>{'Welcome ' + this.state.myName}</h1>
            {!this.state.loginFlag && <a href="#" onClick={this.handleClick} onlogin={this.checkLoginState}>Facebook Login</a>}

            {this.state.loginFlag &&
                <div>
                    <h2>Your sleep analysis report based on recent 10 records: </h2>
                        <Scoreboard location={{query:{_id: this.state.myID}}}/>
                        <Report location={{query: {_id: this.state.myID, analysisRange: 10}}}/>
                </div>
            }
          

            {/* <div
                class="fb-like"
                data-share="true"
                data-width="450"
                data-show-faces="true">
            </div> */}
            </div>
        );
    }
}

export default WebView;
