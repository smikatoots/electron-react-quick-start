var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Editor, EditorState, RichUtils, Immutable } from 'draft-js';
import Toolbar from './components/Toolbar'
import Login from './components/Login'
import Register from './components/Register'
import EditorApp from './components/App'

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

ReactDOM.render((
    <BrowserRouter>
        <EditorApp />
    </BrowserRouter>
), document.getElementById('root'));
