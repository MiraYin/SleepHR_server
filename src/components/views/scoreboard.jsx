import React from 'react';
import axios from 'axios';

class Row extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="row">
                <div>{this.props.data.name}</div>
                <div>{this.props.data.longestDays}</div>
                <div>{this.props.data.stayUpRate}</div>  
            </div>
        );
    }
}

class Scoreboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        this.compareByStayUpRate.bind(this);
        this.compareByLongestDays.bind(this);
        this.sortBy.bind(this);
  }
  
    componentDidMount(){
        axios.post(`/api/scoreboard`, {fbid: this.props.location.query._id}).then(res => {
            console.log(this.props.location.query._id)
            console.log(res);
            console.log(res.data);

            var retrievedData = res.data.friends.map(friend => {
                return ({
                    fbid: friend.fbid,
                    name: friend.userName,
                    longestDays: friend.hasOwnProperty('longestDays')? friend.longestDays: NaN,
                    stayUpRate: friend.surveys.length? (friend.stayUpDays / friend.surveys.length * 100).toFixed(2) : NaN
                });
            })

            retrievedData.push({
                fbid: res.data.fbid, 
                name: res.data.userName, 
                longestDays: res.data.longestDays,
                stayUpRate: (res.data.stayUpDays / res.data.surveys.length * 100).toFixed(2)
            });

            this.setState({
                data: retrievedData
            });
        });
    }


  compareByLongestDays(a, b) {
        if(!isFinite(a['longestDays']) && !isFinite(b['longestDays'])){
            return 0;
        }
        if( !isFinite(a['longestDays']) ) {
            return 1;
        }
        if( !isFinite(b['longestDays']) ) {
            return -1;
        }
        return b['longestDays']-a['longestDays'];
  }

  compareByStayUpRate(a, b) {
        if(!isFinite(a['stayUpRate']) && !isFinite(b['stayUpRate'])){
            return 0;
        }
        if( !isFinite(a['stayUpRate']) ) {
            return 1;
        }
        if( !isFinite(b['stayUpRate']) ) {
            return -1;
        }
        return a['stayUpRate']-b['stayUpRate'];
  }
 
  sortBy(key) {
    console.log("sortby "+key);
    let arrayCopy = [...this.state.data];
    if(key === 'longestDays'){
        arrayCopy.sort(this.compareByLongestDays);
    }
    if(key === 'stayUpRate'){
        arrayCopy.sort(this.compareByStayUpRate);
    }
    console.log(arrayCopy);
    this.setState({data: arrayCopy});
  }
    
  render() {
    const rows = this.state.data.map( (rowData) => <Row key={rowData.fbid} data={rowData} />);

    return (
      <div id="scoreboard">
        <div className="headerRow">
          <div >Name</div>
          <div onClick={() => this.sortBy('longestDays')}>Consecutive Days on Schedule</div>
          <div onClick={() => this.sortBy('stayUpRate')}>Stay Up Rate (%)</div>
        </div>
        <div className="bodyRow">
          {rows}
        </div>
      </div>
    );
    
  }
}

export default Scoreboard;