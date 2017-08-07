var React = require('react');
var ReactDOM = require('react-dom');

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='toolbarContent'>
      	<form onSubmit={() => {return false;}}>
          <button type="button" onClick={() => this.props.handleFormatClick('BOLD')}>Bold</button>
          <button type="button" onClick={() => this.props.handleFormatClick('ITALIC')}>Italic</button>
          <button type="button" onClick={() => this.props.handleFormatClick('UNDERLINE')}>Underline</button>
          <button type="button"onClick={() => this.props.handleFormatClick('CODE')}>Code</button>
          <button type="button" onClick={() => this.props.handleFormatClick('STRIKETHROUGH')}>Strikethrough</button>
          <select onChange={(event) => this.props.handleColorChange(event)}>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
          </select>
          <select onChange={this.props.handleFontSizeChange}>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="24">24</option>
          </select>
          <button type="button" onClick={this.props.bulletList.bind(this)}>Bullet</button>
          <button type="button" onClick={this.props.numberList.bind(this)}>Number</button>
        </form>
      </div>
    );
  }
}

export default Toolbar;
