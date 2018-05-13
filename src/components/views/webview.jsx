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
        });
    }
    
    // called with the results from from FB.getLoginStatus().
    statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
            this.fetchprofile()
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
            data-onlogin={this.checkLoginState}
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
