var React = require('react');
var ReactDOM = require('react-dom');
import { Route, Link } from 'react-router-dom';

class DocumentPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        newDocument: '',
        sharedDocumentID: '',
    };
  }

  handleNewDocumentChange(event) {
      this.setState({newDocument: event.target.value})
  }

  handleSharedDocumentIDChange(event) {
      this.setState({sharedDocumentID: event.target.value})
  }

  handleNewDocumentSubmit(event) {
      this.setState({newDocument: event.target.value})
  }

  handleSharedDocumentIDSubmit(event) {
      this.setState({sharedDocumentID: event.target.value})
  }

  render() {
    return (
      <div id='portal'>
          <h1> Documents Portal </h1>
          <input
              type="text"
              onChange={(event) => this.handleNewDocumentChange(event)}
              value={this.state.newDocument}
              placeholder="New Document Title"/><br/>
          <button type="submit" onSubmit={() => this.handleNewDocumentSubmit()}>Create Document</button><br/><br/>
          <input
              type="text"
              onChange={(event) => this.handleSharedDocumentIDChange(event)}
              value={this.state.sharedDocumentID}
              placeholder="Shared Document ID"/><br/>
          <button type="submit" onSubmit={() => this.handleSharedDocumentIDSubmit()}>Add Shared Document</button>
      </div>
    );
  }
}

export default DocumentPortal;
