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
          <label style={{fontSize: 12}}>
            Font Size:{' '}
            <select onChange={this.props.handleFontSizeChange}>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="24">24</option>
            </select>
          </label>
          <button onClick={this.props.bulletList.bind(this)}>Bullet</button>
          <button onClick={this.props.numberList.bind(this)}>Number</button>
        </form>
      </div>
    );
  }
}

export default Toolbar;