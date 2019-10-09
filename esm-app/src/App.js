import React, {Component} from 'react';
import './App.css';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import config from './config.json';

class App extends Component {

  constructor() {
    super()
    this.state = {
      isAuthenticated: false,
      user: null,
    };
  }

  // componentDidMount() {
  //   this.getUsers();
  // }

  // Fetches data from localhost:4000
  // getUsers = () => {
  //   fetch('http://localhost:4000/users')
  //     .then(response => response.json())
  //     .then(response => this.setState({ users: response.data}))
  //     .catch(err => console.log(err));
  // };

  // checkUser = () => {
  //   const email = this.state.user.email
  //   fetch(`http://localhost:4000/users/check?email=${email}`)
  //     .then(response => response.json())
  //     .then(response => response.data)
  //     .catch(err => console.log(err));
  // }

  addUser = _ => {
    const newUser = this.state.user
    fetch(`http://localhost:4000/users/add?name=${newUser.name}&age=${newUser.age}&email=${newUser.email}`)
      .catch(err => console.log(err));
  }
  //
  // renderUser = ({ name, age, email }) =>
  // <div key={email}>{name} {age} {email} </div>
  newUserCheck = (email) => {
    return fetch(`http://localhost:4000/users/check?email=${email}`)
      .then(response => response.json())
      .then(response => response.data)
      .then(function(response) {
        if(response.length === 0) { return true }
        else { return false }
      })
      .catch(err => console.log(err));
  }

  googleResponse = (response) => {
    console.log(response)
    this.setState({
      isAuthenticated: true,
      token: response.token_id,
      user: {
        email: response.profileObj.email,
        name: response.profileObj.name
      }
    })
    this.newUserCheck(response.profileObj.email).then(response => this.setState( {newUser: response} ))
  }

  loginFail = (response) => {
    console.log(response)
  }

  logout = () => {
    this.setState({ isAuthenticated: false, user: null })
  }

  render () {
    // const { users, newUser } = this.setState
    if(this.state.newUser) { }
    let content = !!this.state.isAuthenticated ? (
      <div>
        <p>{this.state.user.name} Logged In</p>
        <GoogleLogout
          clientId = {config.GOOGLE_CLIENT_ID}
          buttonText = "Logout"
          onLogoutSuccess = {this.logout}
        ></GoogleLogout>
      </div>
    ) :
    (
      <div>
        <GoogleLogin
          clientId={config.GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={this.googleResponse}
          onFailure={this.loginFail}
          scope= {config.GOOGLE_SCOPE_API}
        ></GoogleLogin>
      </div>
    )

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
