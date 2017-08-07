var React = require('react');
var ReactDOM = require('react-dom');
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
            <h1>Register</h1> <br/>
            <input type="text" value={this.state.username} onChange={(event) => this.handleUsernameChange(event)} placeholder="Username"/><br/>
            <input type="text" value={this.state.password} onChange={(event) => this.handlePasswordChange(event)} placeholder="Password"/>
            {/* <button onClick={() => this.handleSubmit()}>Submit</button> */}
            {/* <button onClick={() => this.backToLogin()}>Back to Login</button> */}
        </div>
    );
  }
}

export default Register;
