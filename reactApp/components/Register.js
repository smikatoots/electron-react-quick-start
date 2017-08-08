var React = require('react');
var ReactDOM = require('react-dom');
import { Redirect } from 'react-router'

import { Route, Link } from 'react-router-dom';
import Login from './Login'
// import {Editor, EditorState, RichUtils, Immutable} from 'draft-js';

class Register extends React.Component {
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
    fetch('http://localhost:3000/register', {
      method: 'POST',
      body: JSON.stringify(Object.assign({}, this.state)),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }).then(res => {
      if (res.success) {
        this.setState({
          redirect: true
        });
      }
    }).catch(err => err);
  }

  render() {
    if (this.state.redirect) return <Redirect to='/login' />;
    return (
        <div id='register'>
            <h1>Register</h1><br/>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="text" value={this.state.username} onChange={(event) => this.handleUsernameChange(event)} placeholder="Username"/><br/>
              <input type="password" value={this.state.password} onChange={(event) => this.handlePasswordChange(event)} placeholder="Password"/><br/>
              <input type='submit' value='Submit' />
            </form>
            <Route path='/login' component={Login}/>
            <button type="button"><Link to='/login'>Go Back to Login</Link></button>
        </div>
    );
  }
}

export default Register;
