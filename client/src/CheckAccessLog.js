import React, { Component } from "react";
class CheckAccessLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestLog: ''
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
    this.props.onFormSubmit(this.state.requestLog);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Access Log ID
          <input type="text" name="requestLog" value={this.state.requestLog} onChange={this.handleInputChange} />
        </p>
        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>

    );
  }
}
export default CheckAccessLog;