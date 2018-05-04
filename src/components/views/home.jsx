import React from "react";
import { browserHistory } from 'react-router';

class Home extends React.Component {
  componentDidMount() {
    browserHistory.push('/');
  }
  render() {
    return (
      <div id="home">
        This is the home page.
      </div>
    );
  }
}

export default Home;