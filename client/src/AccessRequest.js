import React, { Component } from "react";
class AccessRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formDataID: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    this.props.onFormSubmit(this.state.formDataID);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Please enter the Data ID to initiate data access request.</p>
        <p> Data ID to Access :
          <input type="text" name="formDataID" value={this.state.formDataID} onChange={this.handleInputChange} />
        </p>
        <p> JWT from Authority :
          <input type="text" name="jwt"/>
        </p>
        <p> Callback URL :
          <input type="text" name="callback" />
        </p>
        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>

    );
  }
}
export default AccessRequest;