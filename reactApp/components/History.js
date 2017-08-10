var React = require('react');
var ReactDOM = require('react-dom');


class History extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log(this.props.history)
        return(
            <div>
                  {this.props.history.map((historyObj) =>
                      (<div key={historyObj.time}><button onClick={() => {this.props.updateState(historyObj.content)}}>{historyObj.time}</button><br/></div>)
                     )}
            </div>
        )

    }
}

export default History;
