import React from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';
import Scoreboard from './scoreboard';
import Report from './report';


class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            myName: '',
            myFriends: [],
            myID: null
        };
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

    fetchprofile(){
        console.log('Fetching profile.... ');
        FB.api('/me', function(response) {
            console.log(response);
            this.setState({
                myName: response.name,
                myID: response.id
            });
        });
        FB.api('/me/friends', function(response) {
            console.log(response);
            this.setState({
                myFriends: response.data.map(friend => friend.id)
            });
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
            <h1>{'Welcome ' + this.state.myName}</h1>

            <div>
                <h2>Your sleep analysis report based on recent 10 records: </h2>
                <Scoreboard location={{query:{_id: this.state.myID}}}/>
                <Report location={{query: {_id: this.state.myID, analysisRange: 10}}}/>
            </div>


        </div>);
    }
}


export default Dashboard;