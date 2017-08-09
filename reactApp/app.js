var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Switch, HashRouter } from 'react-router-dom';
import { Editor, EditorState, RichUtils, Immutable } from 'draft-js';
import { Redirect } from 'react-router'
import Login from './components/Login';
import Register from './components/Register';
import EditorApp from './components/App';
import DocumentPortal from './components/DocumentPortal'

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  requireLogin() {
    console.log("here", localStorage.getItem('userId'))
    if (!localStorage.getItem('userId')) return (<Redirect to='/' />);
  }

  render() {
    return (
        <HashRouter>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route exact path='/docs' component={DocumentPortal} onEnter={this.requireLogin.bind(this)}/>
                 <Route exact path='/editor/:id' component={EditorApp} onEnter={this.requireLogin.bind(this)}/> 
                {/* both /roster and /roster/:number begin with /roster */}
                <Route path='/register' component={Register}/>
            </Switch>
        </HashRouter>
    );
  }
}

ReactDOM.render((
    <Main />
), document.getElementById('root'));
