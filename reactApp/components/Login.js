import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import Register from './Register';


// import {Editor, EditorState, RichUtils, Immutable} from 'draft-js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        redirect: false
    };
  }

  handleUsernameChange(event) {
      this.setState({username: event.target.value})
  }

  handlePasswordChange(event) {
      this.setState({password: event.target.value})
  }

  handleSubmit(e) {
    e.preventDefault();
    var self = this;
    axios.post('http://localhost:3000/login', self.state)
    .then(function(response) {
      if (response.data.success) {
        console.log(response)
        self.setState({
          redirect: true
        });
        localStorage.setItem('userId', response.data.userId)
      }
    }).catch(err => err);
  }

  render() {
    if (this.state.redirect) return <Redirect to='/docs' />;
    return (
      <div id='login'>
          <h1>Login</h1> <br/>
          <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="text" value={this.state.username} onChange={(event) => this.handleUsernameChange(event)} placeholder="Username"/><br/>
              <input type="password" value={this.state.password} onChange={(event) => this.handlePasswordChange(event)} placeholder="Password"/><br/>
              <input type='submit' value='Submit' />
          </form>
          <Route path='/register' component={Register}/>
          <button type="button"><Link to='/register'>Go to Register</Link></button>
      </div>
    );
  }
}

export default Login;
