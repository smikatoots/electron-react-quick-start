var React = require('react');
var ReactDOM = require('react-dom');
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ContentState, Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, Modifier, SelectionState } from 'draft-js';
import Immutable from 'immutable';
import Toolbar from './Toolbar'
import Login from './Login';
import Register from './Register';
import History from './History';
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
    'HIGHLIGHT_YELLOW': {
      backgroundColor: 'yellow'
    },
    'HIGHLIGHT_GREEN': {
      backgroundColor: 'green'
    }
};

class EditorApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        editorState: EditorState.createEmpty(),
        title: '',
        docId: '',
        history: false,
        historyArr: []
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.color = null;
    this.prevHighlight = null;
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
        var editorStateNew
        if (body.content.length === 0) {
          editorStateNew = EditorState.createEmpty()
        }
        else {
          console.log('THIS IS BODY CONTENT:', body.content[body.content.length - 1])
          var convertedContent = convertFromRaw(JSON.parse(body.content[body.content.length - 1].content))
          editorStateNew = EditorState.createWithContent(convertedContent);
        }
        self.setState({
            title: body.title,
            editorState: editorStateNew,
            docId: id,
            historyArr: body.content
        })
        console.log("EDITOR STATE", self.state);
        // self.setState({
        //   editorState: editorStateNew,
        //   title: body.title
        // })
        // console.log("next state", self.state);
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
    var self = this;
    socket.emit('room', {room: this.props.match.params.id});
    socket.on('room', (payload) => {self.color = payload});
    socket.on('receive code', (payload) => {
      var curState = self.state.editorState;
      var curSelection = curState.getSelection();
      //var temp = EditorState.createWithContent(convertFromRaw(payload.contentState));
      //var raw = convertFromRaw(payload.contentState);

      var selection = SelectionState.createEmpty('highlight');
      console.log("Payload", payload)
      var update = selection.merge({
        focusKey: payload.focusKey,
        anchorKey: payload.anchorKey,
        anchorOffset: payload.anchorOffset,
        focusOffset: payload.focusOffset
      });

      var editor;

      if (self.prevHighlight) {
        editor = EditorState.acceptSelection(curState, self.prevHighlight);
        editor = RichUtils.toggleInlineStyle(editor, 'HIGHLIGHT_' + self.color);
        self.prevHighlight = null;
      }
      editor = EditorState.acceptSelection(curState, update);
      editor = RichUtils.toggleInlineStyle(editor, 'HIGHLIGHT_' + self.color);
      self.prevHighlight = update;
      editor = EditorState.forceSelection(editor, curSelection);
      //var content = Modifier.applyInlineStyle(raw, update, 'HIGHLIGHT_' + self.color);
      //var editor = EditorState.createWithContent(content);
      //var content2 = Modifier.applyInlineStyle(content.getCurrentContent(), content.getSelection(), 'BOLD');
      this.setState({editorState: editor});
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
      contentState: convertToRaw(newState.getCurrentContent()),
      anchorKey: newState.getSelection().getAnchorKey(),
      anchorOffset: newState.getSelection().getAnchorOffset(),
      focusKey: newState.getSelection().getFocusKey(),
      focusOffset: newState.getSelection().getFocusOffset()
    })
  }
  toggleHistory() {
    var other = !this.state.history
    this.setState({
      history: other
    })
    console.log('this is history array: ',this.state.historyArr[0])
  }

  setHistoryState(content) {
      console.log("THIS IS CONTENT", content);
    var convertedContent = convertFromRaw(JSON.parse(content));
    console.log(convertedContent);
    var editorStateNew = EditorState.createWithContent(convertedContent);
    this.setState({
      editorState: editorStateNew
    })
    console.log('History updated!')
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
                <p id="id-text">Sharing ID: {this.state.docId}</p>
            </div>
            <button onClick={() => this._save()}>Save</button>
            <button onClick={() => this.toggleHistory()}>History</button>
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
        {this.state.history ? <div><History history={this.state.historyArr} updateState={(content) => this.setHistoryState(content)}></History></div> : null}
      </div>
    );
  }
}

export default EditorApp;
