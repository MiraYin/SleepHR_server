import React from "react";
import { browserHistory } from 'react-router';

class Home extends React.Component {
  componentDidMount() {
    browserHistory.push('/');
  }
  render() {
    return (
      <div id="home">
        <h1>Welcome!</h1>
        <h3>You are doing great! Keep it up!</h3>
      </div>
    );
  }
}

export default Home;