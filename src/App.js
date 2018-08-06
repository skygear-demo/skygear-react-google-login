import React, { Component } from 'react';
import skygear from 'skygear';

class App extends Component {
  constructor(props) {
    super(props);
    this.statuses = ['not yet signed in', 'signed in', 'error message'];      // bad practice?
    this.defaultStates = {
      status: this.statuses[0],
      user: "",
      profile: ""
    };
    this.state = this.defaultStates;

    this.onLogin = () => {
      skygear.auth.loginOAuthProviderWithPopup('google')
        .then((value) => {
          // value correponds to loginOAuthProviderWithPopup returning user
          this.setState({ user: JSON.stringify(value.toJSON(), null, 2) });
          // after loginOAuthProviderWithPopup, we can legally getOAuthProviderProfiles
          return skygear.auth.getOAuthProviderProfiles()
        }).then((value) => {
          // value correponds to getOAuthProviderProfiles returning profileJson
          this.setState({ profile: JSON.stringify(value, null, 2) });

          // sign in was successful
          console.info('Login success');
          console.info('Access token:', skygear.auth.accessToken);
          console.info('Username:', skygear.auth.currentUser.username);
          // status becomes signed in
          this.setState({ status: this.statuses[1] });
        }).catch(this.onError('Login failure'));
    };

    this.onLogout = () => {
      skygear.auth.logout()
        .then(() => {
          console.info('Logout success');
          this.setState(this.defaultStates);
        })
        .catch(this.onError('Logout failure'));
    };

    this.onError = (message) => {
      return (error) => {
        console.error(message, error);
        this.setState({ status: this.statuses[2] });
      }
    };;
  }

  // implement Auto login
  componentDidMount() {
    // if accessToken exists
    if (skygear.auth.accessToken !== "") {
      Promise.all([
        skygear.auth.whoami(),
        skygear.auth.getOAuthProviderProfiles()
      ]).then((values) => {
        // sign in was successful
        console.info('Auto login success');
        console.info('Access token:', skygear.auth.accessToken);
        console.info('Username:', skygear.auth.currentUser.username);
        // status becomes signed in
        this.setState({ status: this.statuses[1] });
        // values[0] correponds to loginOAuthProviderWithPopup returning user
        this.setState({ user: JSON.stringify(values[0].toJSON(), null, 2) });
        // values[1] correponds to getOAuthProviderProfiles returning profileJson
        this.setState({ profile: JSON.stringify(values[1], null, 2) });
      }).catch(() => {
        console.info('Auto login failure');
        this.onLogout();
      });
    }
    // else { keep status as 'not yet signed in' }
  }

  render() {
    return (
      <div className="Login">
        <h1>Skygear Google Login with Pop up Demo</h1>
        <button className="block-button secondary-bg" onClick={() => this.onLogin()}>Login with Google</button>

        <p>Google login status:</p>
        <div className="block-div">{this.state.status}</div>

        <p>Skygear currentUser:</p>
        <div className="block-div">{this.state.user}</div>

        <p>currentUser Google profile:</p>
        <div className="block-div ">{this.state.profile}</div>
        <br/>
        <button className="inline-button" onClick={() => this.onLogout()}>Logout</button>
      </div>
    );
  }
}

export default App;
