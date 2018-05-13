import React from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';

class WebView extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.responseFacebook = this.responseFacebook.bind(this);
    }

    responseFacebook(response){
        console.log(response);
    }

    onClickHandler(){
        console.log('clicked');
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
            data-max-rows="1" 
            data-size="large" 
            data-button-type="continue_with" 
            data-show-faces="false" 
            data-auto-logout-link="false" 
            data-use-continue-as="false"></div>

            {/* <FacebookLogin
            appId="1950569411924737"
            autoLoad={true}
            fields="name,email,picture"
            onClick={this.onClickHandler}
            callback={this.responseFacebook} /> */}
            </div>
        );
    }
}

/// provide _id and analysisRange
export default WebView;
