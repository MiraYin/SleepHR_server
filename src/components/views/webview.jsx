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
            <FacebookLogin
            appId="1950569411924737"
            autoLoad={true}
            fields="name,email,picture"
            onClick={this.onClickHandler}
            callback={this.responseFacebook} />
        );
    }
}

/// provide _id and analysisRange
export default WebView;
