var React = require('react');
var ReactDOM = require('react-dom');
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ContentState, Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw } from 'draft-js';
import Immutable from 'immutable';
import Toolbar from './Toolbar'
import Login from './Login'
import Register from './Register'
import axios from 'axios'
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
    this.onChange = (editorState) => this.setState({editorState});
  }

  componentWillMount() {
    var id = this.props.match.params.id;
    var self = this;
    axios.post('http://localhost:3000/editor/'+id)
       .then(function(response) {
        console.log('Response is this:', response)
        return response.data
      })
      .then(function(body) {
        console.log('Body of Editor: ', body)
        console.log("THISEDITORSTATE", self.state.editorState);
        console.log()
        var editorStateNew
        if (body.content.length === 0) {
          editorStateNew = EditorState.createEmpty()
        }
        else {
          console.log('THIS IS BODY CONTENT:', body.content[body.content.length - 1])
          var convertedContent = convertFromRaw(JSON.parse(body.content[body.content.length - 1]))
        // const contentState = ContentState.createFromText(convertedContent);
        // const editorStateNew = EditorState.push(self.state.editorState, contentState);
          // console.log("CONTENTSTATE", contentState);
          editorStateNew = EditorState.createWithContent(convertedContent);
        }
        console.log("EDITORSTATE", editorStateNew);
        // console.log("CONTENT", editorStateNew.getCurrentContent().getPlainText());
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
    this.setState({editorState: payload})
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
      alert('Document updated and saved!')
      var contentStatte = this.state.editorState.getCurrentContent()
      var content = convertToRaw(contentStatte)
      var stringContent = JSON.stringify(content)
      console.log('this is stringified content',stringContent)
      fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: stringContent,
            docId: this.state.docId
        })
      })
      .then(() => {
        console.log("Saved!", data);
      })
      .catch((err) => {
        console.log('Error is err', err)
      })
    }

  componentDidMount() {
    socket.emit('room', {room: this.props.match.params.id});
    socket.on('receive code', (payload) => {
      var content = EditorState.createWithContent(convertFromRaw(payload))
      console.log('content', content)
      this.setState({editorState: content});
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log("nextProps", nextProps)
  //   socket.emit('room', {room: nextProps.match.params.id})
  // }

  componentWillUnmount() {
    socket.emit('leave room', {
      room: this.props.match.params.id
    })
  }

  updateEditorInState(newState) {
    this.setState({editorState: newState});
    socket.emit('coding event', {
      room: this.props.match.params.id,
      contentState: convertToRaw(newState.getCurrentContent())
    })
  }

  render() {
    return (
      <div id='content' style={{width: '480px', margin: '0 auto'}}>
        <div id='header'>
            <Link to='/docs'>
                <button type="button" className="backButton"><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
            </Link>
            <div>
                <h1>{this.state.title}</h1>
                <p id="jam-title">Jam Editor</p>
            </div>
            <button onClick={() => this._save()}>Save</button>
        </div>
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
            // className='actualEditor'
            placeholder='Type your text here'
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={(editorState) => this.updateEditorInState(editorState)}
            blockRenderMap={extendedBlockRenderMap}
          />
        </div>
      </div>
    );
  }
}

export default EditorApp;
