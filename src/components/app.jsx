import React from "react";

export default class App extends React.Component {
  render() {
    return (
        <div>
            <header>SleepHR: help to sleep healthily and regularly</header>
            <main>
                {this.props.children}
            </main>
            <footer>copyright@yanxin.yin</footer>
        </div>
    );
  }
}
 