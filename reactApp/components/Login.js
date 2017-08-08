import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router'
import { Route, Link } from 'react-router-dom';
import Register from './Register'


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
    fetch('http://localhost:3000/login', {
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
        localStorage.setItem('userId', res.userId)
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
