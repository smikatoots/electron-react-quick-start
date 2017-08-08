var React = require('react');
var ReactDOM = require('react-dom');

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='toolbarContent'>
      	<form id='toolbarForm' onSubmit={() => {return false;}}>
          <button type="button" onClick={() => this.props.handleFormatClick('BOLD')}><i className="fa fa-bold" aria-hidden="true"></i></button>
          <button type="button" onClick={() => this.props.handleFormatClick('ITALIC')}><i className="fa fa-italic" aria-hidden="true"></i></button>
          <button type="button" onClick={() => this.props.handleFormatClick('UNDERLINE')}><i className="fa fa-underline" aria-hidden="true"></i></button>
          <button type="button" onClick={() => this.props.handleFormatClick('CODE')}><i className="fa fa-code" aria-hidden="true"></i></button>
          <button type="button" onClick={() => this.props.handleFormatClick('STRIKETHROUGH')}><i className="fa fa-strikethrough" aria-hidden="true"></i></button>
          <select onChange={(event) => this.props.handleColorChange(event)}>
              <optgroup>Font Color</optgroup>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
          </select>
          <select onChange={this.props.handleFontSizeChange}>
              <optgroup>Font Size</optgroup>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="24">24</option>
          </select>
          <button type="button" onClick={this.props.bulletList.bind(this)}><i className="fa fa-list" aria-hidden="true"></i></button>
          <button type="button" onClick={this.props.numberList.bind(this)}><i className="fa fa-list-ol" aria-hidden="true"></i></button>
          <button type="button" onClick={this.props.handleLeftAClick.bind(this)}><i className="fa fa-align-left" aria-hidden="true"></i></button>
          <button type="button" onClick={this.props.handleCenterAClick.bind(this)}><i className="fa fa-align-center" aria-hidden="true"></i></button>
          <button type="button" onClick={this.props.handleRightAClick.bind(this)}><i className="fa fa-align-right" aria-hidden="true"></i></button>
        </form>
      </div>
    );
  }
}

export default Toolbar;
