var React = require('react');
var ReactDOM = require('react-dom');
import { BrowserRouter } from 'react-router-dom';
import { Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import Immutable from 'immutable';
import Toolbar from './Toolbar'
import Login from './Login'
import Register from './Register'
// import mongoose from 'mongoose';
// import { Users, Documents } from '../../backend/models'

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

const blockRenderMap = Immutable.Map({
  'rightAlign': {wrapper: (<div className='right'></div>)},
  'leftAlign': {wrapper: (<div className='left'></div>)},
  'centerAlign': {wrapper: (<div className='center'></div>)}
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

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

class EditorApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        editorState: EditorState.createEmpty(),
        title: ''
    };
    this.onChange = (editorState) => this.setState({editorState});
  }

  componentWillMount() {
    console.log(this.props.match.params.id)
    var id = localStorage.getItem('userId')
    fetch('http://localhost:3000/editor/:'+id, {
        method: 'POST'
      })
       .then(function(response) {
        console.log('response is this:', response)
        return response.json()
      })
      .then(function(body) {
        console.log('body is right here: ', body)
        this.setState({
          editorState: body.content,
          title: body.title
        })
      })
      .catch((err) => {
        console.log('error is err', err)
      })
  }

  _onFormatClick(style) {
      this.onChange(RichUtils.toggleInlineStyle(
         this.state.editorState,
         style
      ));
  }

  _onFontSizeChange(e) {
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

  _onBulletList(e) {
    e.preventDefault();
    this.onChange(
        RichUtils.toggleBlockType(
            this.state.editorState,
            'unordered-list-item'
    ));
  }

  _onNumberList(e) {
    e.preventDefault();
    this.onChange(
        RichUtils.toggleBlockType(
            this.state.editorState,
            'ordered-list-item'
    ));
  }

   _onLeftAClick() {
      this.onChange(RichUtils.toggleBlockType(
          this.state.editorState,
          'leftAlign'
      ));
  }

   _onRightAClick() {
      this.onChange(RichUtils.toggleBlockType(
          this.state.editorState,
          'rightAlign'
      ));
  }

   _onCenterAClick() {
      this.onChange(RichUtils.toggleBlockType(
          this.state.editorState,
          'centerAlign'
      ));
  }

  _save() {
      var content = this.state.editorState.getCurrentContent().getPlainText();
      fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: content,
            // user: req.user
        })
      })
      .then(function(response) {
        console.log('response is this:', response)
        return response.json()
      })
      .then(function(body) {
        console.log('body is right here: ', body)
      })
      .catch((err) => {
        console.log('error is err', err)
      })
    }

  render() {
    return (
      <div id='content' style={{width: '480px', margin: '0 auto'}}>
        <h1>{this.state.title}</h1>
        <p id="jam-title">Jam Editor</p>
        <button onClick={() => this._save()}>Save</button>
        <Toolbar
          handleFontSizeChange={this._onFontSizeChange.bind(this)}
          handleFormatClick={(style, event) => this._onFormatClick(style, event)}
          handleColorChange={(e) => this._onColorChange(e)}
          bulletList={this._onBulletList.bind(this)}
          numberList={this._onNumberList.bind(this)}
          handleLeftAClick={() => this._onLeftAClick()}
          handleCenterAClick={() => this._onCenterAClick()}
          handleRightAClick={() => this._onRightAClick()}
          />

        <div className='editor' style={{border: '1px solid grey', padding: '6px'}}>
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
            blockRenderMap={extendedBlockRenderMap}
          />
        </div>
      </div>
    );
  }
}

export default EditorApp;
