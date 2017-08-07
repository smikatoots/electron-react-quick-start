var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import {Editor, EditorState, RichUtils, Immutable} from 'draft-js';
import Toolbar from './components/Toolbar'
import Login from './components/Login'
import Register from './components/Register'


/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

const styleMap = {
    'FONT_SIZE_8': {
      fontSize: 8,
    },
    'FONT_SIZE_12': {
      fontSize: 12,
    },
    'FONT_SIZE_16': {
      fontSize: 16,
    },
    'FONT_SIZE_24': {
      fontSize: 24,
    },
    'STRIKETHROUGH': {
      textDecoration: 'line-through',
    },
    'FONT_COLOR_RED': {
      color: 'red',
    },
    'FONT_COLOR_BLUE': {
      color: 'blue',
    },
    'FONT_COLOR_YELLOW': {
      color: 'yellow',
    },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        editorState: EditorState.createEmpty(),
        textAlign: 'x'
    };
    this.onChange = (editorState) => this.setState({editorState});
  }

  _onFormatClick(style) {
      this.onChange(RichUtils.toggleInlineStyle(
         this.state.editorState,
         style
      ));
  }

  handleChange(e) {
    var string = 'FONT_SIZE_' + e.target.value;
    this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        string
    ));
  }

  _onColorChange(event) {
     const styleMapColor = 'FONT_COLOR_' + event.target.value.toUpperCase();
     this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        styleMapColor
     ));
  }

  // saveChanges() {
  //    models.Documents.findById()
  // }

  //  _onLeftAClick() {
  //     this.onChange(RichUtils.toggleBlockType(
  //         this.state.editorState,
  //         'left'
  //     ));
  // }
  //
  //  _onRightAClick() {
  //     this.onChange(RichUtils.toggleBlockType(
  //         this.state.editorState,
  //         'right'
  //     ));
  // }
  //
  //  _onCenterAClick() {
  //     this.onChange(RichUtils.toggleBlockType(
  //         this.state.editorState,
  //         'center'
  //     ));
  // }

  render() {
    return (
      <div id='content' style={{width: '480px', margin: '0 auto'}}>
        <h1>Jam Editor</h1>
        <Toolbar handleFontSizeChange={this.handleChange.bind(this)}/>
        <button onClick={() => this._onFormatClick('BOLD')}>Bold</button>
        <button onClick={() => this._onFormatClick('ITALIC')}>Italic</button>
        <button onClick={() => this._onFormatClick('UNDERLINE')}>Underline</button>
        <button onClick={() => this._onFormatClick('CODE')}>Code</button>
        <button onClick={() => this._onFormatClick('STRIKETHROUGH')}>Strikethrough</button>
        <select onChange={(event) => this._onColorChange(event)}>
            <option value="red">Red</option>
            <option value="yellow">Yellow</option>
            <option value="blue">Blue</option>
        </select>
        {/* <button onClick={this._onLeftAClick.bind(this)}>Align Left</button>
        <button onClick={this._onCenterAClick.bind(this)}>Align Center</button>
        <button onClick={this._onRightAClick.bind(this)}>Align Right</button> */}
        <div className='editor' style={{border: '1px solid grey', padding: '6px'}}>
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
            textAlignment={this.state.textAlign}
          />
        </div>
        {/* <button onClick={() => this.saveChanges()}>SAVE</button> */}
      </div>
    );
  }
}

export default App;
