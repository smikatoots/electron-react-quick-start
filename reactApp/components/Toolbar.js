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
          <label>
            Font Size:{' '}
            <select onChange={this.props.handleFontSizeChange}>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="24">24</option>
            </select>
          </label>
        </form>
      </div>
    );
  }
}

export default Toolbar;