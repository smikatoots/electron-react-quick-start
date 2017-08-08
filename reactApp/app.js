var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Switch, HashRouter } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register'
import EditorApp from './components/App'
import DocumentPortal from './components/DocumentPortal'

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <HashRouter>
            <Switch>
                <Route exact path='/' component={DocumentPortal}/>
                <Route exact path='/editor' component={EditorApp}/>
                <Route exact path='/login' component={Login}/>
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
