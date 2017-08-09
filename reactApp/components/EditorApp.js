var React = require('react');
var ReactDOM = require('react-dom');
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ContentState, Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import Immutable from 'immutable';
import Toolbar from './Toolbar'
import Login from './Login'
import Register from './Register'

const io = require('socket.io-client')  
var socket = io.connect('http://localhost:3000');
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
        title: '',
        docId: ''
    };
    //this.onChange = (editorState) => this.setState({editorState});
  }

  componentWillMount() {
    var id = this.props.match.params.id;
    var self = this;
    fetch('http://localhost:3000/editor/'+id, {
        method: 'POST'
      })
       .then(function(response) {
        console.log('Response is this:', response)
        return response.json()
      })
      .then(function(body) {
        console.log('Body of Editor: ', body)
        console.log("THISEDITORSTATE", self.state.editorState);
        const contentState = ContentState.createFromText(body.content);
        // const editorStateNew = EditorState.push(self.state.editorState, contentState);
        const editorStateNew = EditorState.createWithContent(contentState);
        console.log("CONTENTSTATE", contentState);
        console.log("EDITORSTATE", editorStateNew);
        console.log("CONTENT", editorStateNew.getCurrentContent().getPlainText());
        console.log("TITLE", body.title);
        // self.setState({
        //     title: body.title
        // })
        console.log("TITLE STATE", self.state);
        self.setState({
            title: body.title,
            editorState: editorStateNew,
            docId: id
        })
        console.log("EDITOR STATE", self.state);
        // self.setState({
        //   editorState: editorStateNew,
        //   title: body.title
        // })
        console.log("next state", self.state);
      })
      .catch((err) => {
        console.log('Error is err', err)
      })
  }

  updateEditorFromSockets(payload) {
    this.setState({payload})
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
            docId: this.state.docId
        })
      })
      .then(function() {
        console.log("Saved!");
      })
      .catch((err) => {
        console.log('Error is err', err)
      })
    }

  componentDidMount() { 
  console.log(this.props); 
   if (!this.props.docState.sharedDocumentId) {
      // display all docs
    } else {
      socket.emit('room', {room: this.props.docState.sharedDocumentId});
    }
  }

  componentWillReceiveProps(nextProps) {  
    socket.emit('room', {room: nextProps.docState.sharedDocumentId})
  }

  componentWillUnmount() {  
    socket.emit('leave room', {
      room: this.props.docState.sharedDocumentId
    })
  }

  updateEditorInState(newState) {  
    this.setState({newState})
    socket.emit('coding event', {
      room: this.props.docState.sharedDocumentId,
      editorState: newState
    })   
  }

  render() {
    return (
      <div id='content' style={{width: '480px', margin: '0 auto'}}>
        <h1>{this.state.title}</h1>
        <p id="jam-title">Jam Editor</p>
        <Link to='/docs'>Home</Link>
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
            onChange={this.updateEditorInState.bind(this)}
            blockRenderMap={extendedBlockRenderMap}
          />
        </div>
      </div>
    );
  }
}

export default EditorApp;
