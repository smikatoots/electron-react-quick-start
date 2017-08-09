var React = require('react');
var ReactDOM = require('react-dom');
import { Route, Link } from 'react-router-dom';
import EditorApp from './Editor'

const LoadEditorApp = (props) => {
  return (
    <EditorApp docState={this.state} />
  );
}

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
      fetch('http://localhost:3000/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            userId: localStorage.getItem('userId')
        })
      })
      .then(function(response) {
        return response.json()
      })
      .then(function(body) {
        console.log('Body of data documents: ', body.documents)
        self.setState({documentsArray: body.documents})
      })
      .catch((err) => {
        console.log('Error!', err)
      })
  }

  handleSharedDocumentIDSubmit(event) {
      var self = this;
      var docId = this.state.sharedDocumentID;
      this.setState({sharedDocumentID: ''});
      fetch('http://localhost:3000/accessShared', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              docId,
              userId: localStorage.getItem('userId')
          })
      })
      .then(function(response) {
          return response.json()
      })
      .then(function(body) {
          console.log('Body of documents from accessShared', body.documents);
          self.setState({documentsArray: body.documents})
      })
  }

  componentWillMount() {
      var returnedDocuments = [];
      var self = this;
      fetch('http://localhost:3000/allDocs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: localStorage.getItem('userId')
        })
      })
      .then(function(response) {
        return response.json()
      })
      .then(function(body) {
        console.log('Body of data: ', body.documents)
        returnedDocuments = body.documents
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
              type="text"
              onChange={(event) => this.handleNewDocumentChange(event)}
              value={this.state.newDocument}
              placeholder="New Document Title"/><br/>
          <button type="submit" onClick={() => this.handleNewDocumentSubmit()}>Create Document</button><br/><br/>
          <Route path='/editor/:id' render={LoadEditorApp} />
          {this.state.documentsArray.map((foundDoc) =>
              <div key={foundDoc._id}>
                  <Link to={'/editor/'+ foundDoc._id}>{foundDoc.title}, {foundDoc._id}</Link><br/>
              </div>
          )}
          <input
              type="text"
              onChange={(event) => this.handleSharedDocumentIDChange(event)}
              value={this.state.sharedDocumentID}
              placeholder="Shared Document ID"/><br/>
          <button type="submit" onClick={() => this.handleSharedDocumentIDSubmit()}>Add Shared Document</button>
      </div>
    );
  }
}

export default DocumentPortal;
