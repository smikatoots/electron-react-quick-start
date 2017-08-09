var React = require('react');
var ReactDOM = require('react-dom');
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import EditorApp from './EditorApp'
import axios from 'axios'

class DocumentPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        newDocument: '',
        sharedDocumentID: '',
        documentsArray: []
    };
  }

  handleNewDocumentChange(event) {
      this.setState({newDocument: event.target.value})
  }

  handleSharedDocumentIDChange(event) {
      this.setState({sharedDocumentID: event.target.value})
  }

  handleNewDocumentSubmit() {
      var self = this;
      var title = this.state.newDocument;
      this.setState({newDocument: ''})
      axios.post('http://localhost:3000/new', {
        title: title
      })
      .then(function(response) {
        console.log('Body of data documents: ', response.data.documents)
        self.setState({documentsArray: response.data.documents})
      })
      .catch((err) => {
        console.log('Error!', err)
      })
  }

  handleSharedDocumentIDSubmit(event) {
      var self = this;
      var docId = this.state.sharedDocumentID;
      this.setState({sharedDocumentID: ''});
      axios.post('http://localhost:3000/accessShared', {
          docId
      })
      .then(function(response) {
          console.log('Body of documents from accessShared', response.data.documents);
          self.setState({documentsArray: response.data.documents})
      })
  }

  componentWillMount() {
      var returnedDocuments = [];
      var self = this;
      axios.post('http://localhost:3000/allDocs', {
        userId: localStorage.getItem('userId')
      })
      .then(function(response) {
        console.log('Body of data: ', response.data.documents)
        returnedDocuments = response.data.documents
        self.setState({documentsArray: returnedDocuments})
      })
      .catch((err) => {
        console.log('Error!', err)
      })
  }

  render() {
    return (
      <div id='portal'>
          <h1> Documents Portal </h1>
          <input
              className="inputs"
              type="text"
              onChange={(event) => this.handleNewDocumentChange(event)}
              value={this.state.newDocument}
              placeholder="New Document Title"/>
          <button type="button" onClick={() => this.handleNewDocumentSubmit()}>Create Document</button><br/>
          <div id="docList">
              {this.state.documentsArray.map((foundDoc) =>
                  <div key={foundDoc._id}>
                      <Link to={'/editor/'+ foundDoc._id}>{foundDoc.title}</Link><br/>
                  </div>
              )}
          </div>
          <input
              className="inputs"
              type="text"
              onChange={(event) => this.handleSharedDocumentIDChange(event)}
              value={this.state.sharedDocumentID}
              placeholder="Shared Document ID"/>
          <button type="button" onClick={() => this.handleSharedDocumentIDSubmit()}>Add Shared Document</button>
      </div>
    );
  }
}

export default DocumentPortal;
