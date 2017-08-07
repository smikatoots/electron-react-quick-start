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
};

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
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

  render() {
    return (
      <div id='content' style={{width: '480px', margin: '0 auto'}}>
        <h1>Draft.js Editor</h1>
        <Toolbar handleFontSizeChange={this.handleChange.bind(this)}/>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <div className='editor' style={{border: '1px solid grey', padding: '6px'}}>
          <Editor
            editorState={this.state.editorState}
            customStyleMap={styleMap}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}


ReactDOM.render(<MyEditor />,
   document.getElementById('root'));
