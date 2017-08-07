var React = require('react');
var ReactDOM = require('react-dom');
import { Route, Link } from 'react-router-dom';
import Login from './Login'
// import {Editor, EditorState, RichUtils, Immutable} from 'draft-js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: ''
    };
  }

  handleUsernameChange(event) {
      this.setState({username: event.target.value})
  }

  handlePasswordChange(event) {
      this.setState({password: event.target.value})
  }

  render() {
    return (
        <div id='register'>
            <h1>Register</h1><br/>
            <input type="text" value={this.state.username} onChange={(event) => this.handleUsernameChange(event)} placeholder="Username"/><br/>
            <input type="text" value={this.state.password} onChange={(event) => this.handlePasswordChange(event)} placeholder="Password"/><br/>
            {/* <button onClick={() => this.handleSubmit()}>Submit</button> */}
            <Route path='/login' component={Login}/>
            <button type="button"><Link to='/login'>Go Back to Login</Link></button>
        </div>
    );
  }
}

export default Register;
