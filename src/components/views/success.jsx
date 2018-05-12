import React from "react";
import { browserHistory } from 'react-router';

class Success extends React.Component {
  render() {
    return (
      <div id="success">
        <h1> Success!</h1> 
        <h3> Your bedtime and self-report survey has been saved. Thank you for response. </h3>
      </div>
    );
  }
}

export default Success;