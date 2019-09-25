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
      users: [],
      newUser: {
        name: 'John Doe',
        age: 30,
        email: 'john.doe@gmail.com'
      }
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  // Fetches data from localhost:4000
  getUsers = () => {
    fetch('http://localhost:4000/users')
      .then(response => response.json())
      .then(response => this.setState({ users: response.data}))
      .catch(err => console.log(err));
  };

  addUser = _ => {
    const {newUser} = this.state;
    console.log(newUser.name, newUser.age, newUser.email)
    fetch(`http://localhost:4000/users/add?name=${newUser.name}&age=${newUser.age}&email=${newUser.email}`)
      .then(this.getUsers())
      .catch(err => console.log(err));
  }

  renderUser = ({ name, age, email }) =>
  <div key={email}>{name} {age} {email} </div>

  googleResponse = (response) => {
    this.setState({
      isAuthenticated: true,
      user: {
        email: response.profileObj.email,
        name: response.profileObj.name
      }
    })
  }

  loginFail = (response) => {
    console.log(response)
  }

  logout = () => {
    this.setState({ isAuthenticated: false, user: null })
  }

  render () {
    const { users, newUser } = this.state
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
        ></GoogleLogin>
      </div>
    )

    return (
      <div className="App">
        {content}
        {/* {users.map(this.renderUser)}} not sure what this does but this bugs the App for some reason*/}
        <div>
          <input
            value={newUser.name}
            onChange={e => this.setState({ newUser: {...newUser, name: e.target.value}})}/>
          <input
            value={newUser.age}
            onChange={e => this.setState({ newUser: {...newUser, age: e.target.value}})} />
          <input
            value={newUser.email}
            onChange={e => this.setState({ newUser: {...newUser, email: e.target.value}})}/>
          <button onClick={this.addUser}> Add User </button>
        </div>
      </div>
    );
  }
}

export default App;
