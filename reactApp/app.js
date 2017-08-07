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

  _onBoldClick() {
     this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        'BOLD'
     ));
  }

  handleChange(e) {
    var string = 'FONT_SIZE_' + e.target.value;
    console.log(string);
    this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        string
     ));
  }

  _onUnderlineClick() {
     this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        'UNDERLINE'
     ));
  }

  _onItalicClick() {
     this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        'ITALIC'
     ));
  }

  _onCodeClick() {
     this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        'CODE'
     ));
  }

  _onStrikeClick() {
     this.onChange(RichUtils.toggleInlineStyle(
        this.state.editorState,
        'STRIKETHROUGH'
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

   _onLeftAClick() {
      this.onChange(RichUtils.toggleInlineStyle(
          this.textAlignment,
          'left'
      ));
  }

   _onRightAClick() {
      this.onChange(RichUtils.toggleInlineStyle(
          this.textAlignment,
          'right'
      ));
  }

   _onCenterAClick() {
      this.onChange(RichUtils.toggleInlineStyle(
          this.textAlignment,
          'center'
      ));
  }

  render() {
    return (
      <div id='content' style={{width: '480px', margin: '0 auto'}}>
        <h1>Draft.js Editor</h1>
        <Toolbar handleFontSizeChange={this.handleChange.bind(this)}/>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <button onClick={this._onItalicClick.bind(this)}>Italic</button>
        <button onClick={this._onUnderlineClick.bind(this)}>Underline</button>
        <button onClick={this._onCodeClick.bind(this)}>Code</button>
        <button onClick={this._onStrikeClick.bind(this)}>Strikethrough</button>
        <select onChange={(e) => this._onColorChange(e)}>
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
            customStyleMap={styleMap}
            onChange={this.onChange}
            textAlignment='right'
          />
        </div>
      </div>
    );
  }
}




ReactDOM.render(<MyEditor />,
   document.getElementById('root'));
