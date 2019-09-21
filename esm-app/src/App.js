import React, {Component} from 'react';
import './App.css';

class App extends Component {
  
  state = {
    users: [], 
    newUser: {
      name: 'John Doe',  
      age: 30, 
      email: 'john.doe@gmail.com'
    }
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

  render () {
    const { users, newUser } = this.state 
    
    return (
      <div className="App">
        {users.map(this.renderUser)}

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
