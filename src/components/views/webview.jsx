import React from 'react';
import axios from 'axios';

class WebView extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.checkLoginState = this.checkLoginState.bind(this);
        this.fetchprofile = this.fetchprofile.bind(this);
        this.statusChangeCallback = this.statusChangeCallback.bind(this);
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
        browserHistory.push('/success');
    });

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

    render(){
        return (
            <div>
            <div
                class="fb-like"
                data-share="true"
                data-width="450"
                data-show-faces="true">
            </div>
          
            <div class="fb-login-button" 
            data-onlogin="this.checkLoginState"
            data-max-rows="1" 
            data-size="large" 
            data-button-type="continue_with" 
            data-show-faces="false" 
            data-auto-logout-link="false" 
            data-use-continue-as="false"></div>
            </div>
        );
    }
}

/// provide _id and analysisRange
export default WebView;
