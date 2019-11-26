import React, { Component } from "react";
class DataEntryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formDataID: '',
      formAuthList: ''
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
    this.props.onFormSubmit(this.state.formDataID, this.state.formAuthList);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Data Input:
       <input type="text" name="formDataID" value={this.state.formDataID} onChange={this.handleInputChange} />
        </p>
        {/* <!--br />
        please enter authorized requester ID seperated by ','.
    <--br/> */}
        <p>
          Authorized Access Control List:
        <input type="text" name="formAuthList" value={this.state.formAuthList.value} onChange={this.handleInputChange} />
        </p>
        <p><input type="submit" value="Submit" /></p>
      </form>
      // <form onSubmit={this.handleSubmit}>
      //   <label>
      //     Name:
      //     <input type="text" value={this.state.value} onChange={this.handleChange} />
      //   </label>
      //   <input type="submit" value="Submit" />
      // </form>
    );
  }
}
export default DataEntryForm;