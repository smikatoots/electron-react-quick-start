var React = require('react');
var ReactDOM = require('react-dom');
import {Editor, EditorState, RichUtils} from 'draft-js';
import Toolbar from './components/Toolbar'

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
   'FONT-COLOR-RED': {
      color: 'red',
   },
   'FONT-COLOR-BLUE': {
      color: 'blue',
   },
   'FONT-COLOR-YELLOW': {
      color: 'yellow',
   },
};

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        editorState: EditorState.createEmpty(),
        fontColor: '',
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
     const styleMapColor = 'FONT-COLOR-' + event.target.value.toUpperCase();
     this.setState({fontColor: event.target.value})
     this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        styleMapColor
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

  render() {
    return (
      <div id='content' style={{width: '480px', margin: '0 auto'}}>
        <h1>Draft.js Editor</h1>
        <Toolbar 
          handleFontSizeChange={this._onFontSizeChange.bind(this)} 
          bulletList={this._onBulletList.bind(this)}
          numberList={this._onNumberList.bind(this)} 
          />
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
            // textAlignment={this.state.editorState}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MyEditor />,
   document.getElementById('root'));
