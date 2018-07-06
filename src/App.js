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
      skygear.auth.loginOAuthProviderWithPopup('google').then(
        // sign in was successful
        user => {
          console.info('Login success', user);
          console.info('Access token:', skygear.auth.accessToken);
          console.info('Username:', skygear.auth.currentUser.username);
  
          // status becomes signed in
          this.setState({ status: this.statuses[1] });
          skygear.auth.whoami().then(
            // whoami returns a Record type
            record => this.setState({ user: JSON.stringify(record.toJSON(), null, 2) }),
            this.onError('')
          );
          skygear.auth.getOAuthProviderProfiles().then(
            // getOAuthProviderProfiles return a JSON type
            profileJson => this.setState({ profile: JSON.stringify(profileJson, null, 2) }),
            this.onError('')
          );  
        },
        // sign in was unsuccessful
        this.onError('Login failure')
      );
    };

    this.onLogout = () => {
      skygear.auth.logout().then(
        this.isCurrentUserNull() ?
          this.onError('Logout failure') :
          user => {
            console.info('Logout success');
            this.setState(this.defaultStates);
          },
        this.onError('Logout failure')
      );
    };

    this.onError = (message) => {
      return (error) => {
        console.error(message, error);
        this.setState({ status: this.statuses[2] });
      }
    };;
  }

  isCurrentUserNull() {
    // as a check after skygear.auth.logout()
    skygear.auth.whoami().then(
      value => false,
      error => true
    );
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
