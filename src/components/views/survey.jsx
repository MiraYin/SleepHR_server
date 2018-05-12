import React from 'react';
import axios from 'axios';
import {browserHistory} from 'react-router';

class StayUp extends React.Component{
    constructor(props){
        super(props);
        this.handlerOnChange = this.handlerOnChange.bind(this);
    }
    
    handlerOnChange(event){
        this.props.handlerOnReasonChange(event.target.value);
    }
    
    render(){
        return (
        <div>
            <label>
                What was your reason in general to stay up?
                <select onChange={this.handlerOnChange}>
                    <option value="work">work</option>
                    <option value="read">read</option>
                    <option value="watch videos">watch videos</option>
                    <option value="play games">play games</option>
                    <option value="chat with friends">chat with friends</option>
                    <option value="others">others</option>
                </select>
            </label>
        </div>
        );
    }
}

class Survey extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            _id: props.location.query._id,
            sleepDate: new Date(parseInt(props.location.query.timeToSleep)),
            wakeDate: new Date(parseInt(props.location.query.timeToWake)),
            sleepQuality: 0,
            stayUpFlag: false,
            stayUpReason: null
        }
        console.log(props);
        console.log(this.state);
        this.handlerFlagOnChange=this.handlerFlagOnChange.bind(this);
        this.handlerQualityOnChange=this.handlerQualityOnChange.bind(this);
        this.handlerOnSubmit=this.handlerOnSubmit.bind(this);
        this.handlerOnReasonChange=this.handlerOnReasonChange.bind(this);
    }
    
    handlerOnSubmit(event){
        let output = "sleepQuality: "+this.state.sleepQuality+(this.state.stayUpFlag ? "\nStay up, for "+this.state.stayUpReason:"\nOn bedtime schedule");
        console.log(output);

        const postReq = {
            _id: this.state._id,
            sleepQuality: this.state.sleepQuality,
            sleepDate: this.state.sleepDate.getTime(),
            wakeDate: this.state.wakeDate.getTime(),
            stayUp: this.state.stayUpFlag,
        };
        console.log(postReq);
        if(postReq.stayUp){
            postReq.stayUpReason = this.state.stayUpReason;
        }

        axios.post(`/api/survey`, postReq).then(res => {
          console.log(res);
          console.log(res.data);
        })
        browserHistory.push('/');
        //event.preventDefault();
    }
    
    handlerFlagOnChange(event){
        this.setState({
            stayUpFlag: event.target.checked
        });
    }
    
    handlerQualityOnChange(event){
        this.setState({
            sleepQuality: event.target.value
        });
    }

    handlerOnReasonChange(reason){
        this.setState({
            stayUpReason: reason
        });
    }

    render(){
        return(
        <form onSubmit={this.handlerOnSubmit}>
            <h1>Survey</h1>
            <label>How was your sleep quality last night? Scale from 0-4
                <select onChange={this.handlerQualityOnChange}>
                    <option value='0'>0</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                </select>
            </label>
            <br />
            <label>Did you go to sleep as scheduled?
                <input type="checkbox" onChange={this.handlerFlagOnChange}/>
            </label>
            <br />
            {this.state.stayUpFlag ? <StayUp handlerOnReasonChange={this.handlerOnReasonChange}/> : null}
            <input type="submit" value="Submit"/>
        </form>
      );
    }
}

export default Survey;