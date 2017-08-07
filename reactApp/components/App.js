var React = require('react');
var ReactDOM = require('react-dom');
import { BrowserRouter } from 'react-router-dom';
import { Editor, EditorState, RichUtils, Immutable } from 'draft-js';
import Toolbar from './Toolbar'
import Login from './Login'
import Register from './Register'

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

// class AligningWrapper extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       textAlign: 'left'
//     }
//   }
//   textAlignCenter() {
//     this.setState({
//         textAlign: 'center'
//     })
//   }

//   textAlignLeft() {
//     this.setState({
//         textAlign: 'left'
//     })
//   }

//   textAlignRight() {
//     this.setState({
//         textAlign: 'right'
//     })
//   }

//   render() {
//     return (
//       <div className={this.state.textAlign}>
//         <button onClick={() => this.textAlignLeft()}>Align Left</button>
//         <button onClick={() => this.textAlignCenter()}>Align Center</button>
//         <button onClick={() => this.textAlignRight()}>Align Right</button>
//         {this.props.children}
//       </div>
//     );
//   }
// }

// const blockRenderMap = Immutable.Map({
//   'AligningWrapper': {
//     wrapper: AligningWrapper
//   }
// });

// const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

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
        <Toolbar
          handleFontSizeChange={this._onFontSizeChange.bind(this)}
          handleFormatClick={(style, event) => this._onFormatClick(style, event)}
          handleColorChange={() => this._onColorChange()}
          bulletList={this._onBulletList.bind(this)}
          numberList={this._onNumberList.bind(this)}
          />
        {/* <button onClick={this._onLeftAClick.bind(this)}>Align Left</button>
        <button onClick={this._onCenterAClick.bind(this)}>Align Center</button>
        <button onClick={this._onRightAClick.bind(this)}>Align Right</button> */}
        <div className='editor' style={{border: '1px solid grey', padding: '6px'}}>
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
        {/* <button onClick={() => this.saveChanges()}>SAVE</button> */}
      </div>
    );
  }
}

export default EditorApp;
