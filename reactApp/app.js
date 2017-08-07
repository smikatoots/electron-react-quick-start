var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Switch, BrowserRouter } from 'react-router-dom';
import { Editor, EditorState, RichUtils, Immutable } from 'draft-js';
import Login from './components/Login'
import Register from './components/Register'
import EditorApp from './components/App'

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <BrowserRouter>
            {/* <Switch> */}
                <Route exact path='/' component={EditorApp}/>
                <Route path='/login' component={Login}/>
                {/* both /roster and /roster/:number begin with /roster */}
                <Route path='/register' component={Register}/>
            {/* </Switch> */}
        </BrowserRouter>
    );
  }
}

ReactDOM.render((
    <Main />
), document.getElementById('root'));
