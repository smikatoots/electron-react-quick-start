var React = require('react');
var ReactDOM = require('react-dom');
import {Editor, EditorState, RichUtils} from 'draft-js';

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

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

  render() {
    return (
      <div id='content' style={{width: '480px', margin: '0 auto'}}>
        <h1>Draft.js Editor</h1>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <div className='editor' style={{border: '1px solid grey', padding: '6px'}}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}


ReactDOM.render(<MyEditor />,
   document.getElementById('root'));
