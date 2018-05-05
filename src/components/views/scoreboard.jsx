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
        this.compareBy.bind(this);
        this.sortBy.bind(this);
  }
  
  // TODO: change to this.props.location.query once IOS APP done
  // this.props.location.query should be a JSON of FB friend list
    componentDidMount(){

        // const getReq = {
        //     _ids: ["126888448170255", "101276350746156", "111708899698271"]
        // };

        axios.post(`api/scoreboard`, this.props.location.query.friendList).then(res => {
            console.log(res);
            console.log(res.data);

            var reconstructUserInfo = res.data.map(ui => {
                return ({
                    _id: ui._id,
                    name: ui.userName,
                    longestDays: ui.longestDays,
                    stayUpRate: (ui.stayUpDays / ui.surveys.length * 100).toFixed(2)
                });
            })

            this.setState({
                data: reconstructUserInfo
            });
        });
    }


  compareBy(key, increase) {
    return function (a, b) {
      if (a[key] < b[key]) return (increase ? -1 : 1);
      if (a[key] > b[key]) return (increase ? 1 :-1);
      return 0;
    };
  }
 
  sortBy(key) {
    let arrayCopy = [...this.state.data];
    if(key === 'longestDays'){
        arrayCopy.sort(this.compareBy(key, false));
    }
    if(key === 'stayUpRate'){
        arrayCopy.sort(this.compareBy(key, true));
    }
    this.setState({data: arrayCopy});
  }
    
  render() {
    const rows = this.state.data.map( (rowData) => <Row key={rowData._id} data={rowData} />);

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