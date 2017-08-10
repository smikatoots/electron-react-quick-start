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
                      (<div><button onClick={()=>{this.props.updateState(historyObj.content)}} key={historyObj.time}>{historyObj.time}</button><br/></div>)
                     )}  
            </div>
        )

    }
}

export default History;