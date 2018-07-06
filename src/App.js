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
      skygear.auth.loginOAuthProviderWithPopup('google').then((user) => {
        // loginOAuthProviderWithPopup returns a Record Type
        this.setState({ user: JSON.stringify(user.toJSON(), null, 2) });

        // As a second login check, return another promise for chaining
        return skygear.auth.getOAuthProviderProfiles();
      }).then((profileJson) => {
        // getOAuthProviderProfiles return a JSON type
        this.setState({ profile: JSON.stringify(profileJson, null, 2) });

        // sign in was successful
        console.info('Login success');
        console.info('Access token:', skygear.auth.accessToken);
        console.info('Username:', skygear.auth.currentUser.username);
        // status becomes signed in
        this.setState({ status: this.statuses[1] });  
      }).catch(this.onError('Login failure'));
    };

    this.onLogout = () => {
      skygear.auth.logout().then(() => {
        return this.isCurrentUserNull();
      }).then(() => {
        console.info('Logout success');
        this.setState(this.defaultStates);
      }).catch(this.onError('Logout failure'));
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
      (value) => { return false},
      (error) => { return true}
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
