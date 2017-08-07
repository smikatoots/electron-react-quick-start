var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router-dom';
// import {Editor, EditorState, RichUtils, Immutable} from 'draft-js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <div id='register'>
            <h1>Register</h1><br/>
            <input type="text" value={this.state.username} onChange={(event) => this.handleUsernameChange(event)} placeholder="Username"/><br/>
            <input type="text" value={this.state.password} onChange={(event) => this.handlePasswordChange(event)} placeholder="Password"/>
            {/* <button onClick={() => this.handleSubmit()}>Submit</button> */}
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <button type="button"><Link to='/login'>Go Back to Login</Link></button>
        </div>
    );
  }
}

export default Register;
