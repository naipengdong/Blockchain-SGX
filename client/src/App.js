import React, { Component } from "react";
import ReactDOM from 'react-dom';
import DataEscrowContract from "./contracts/DataEscrow.json";
import getWeb3 from "./utils/getWeb3";
import DataEntryForm from "./DataEntryForm";
import CheckAccessLog from "./CheckAccessLog";
import AccessRequest from "./AccessRequest";


import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAddedSuccess: false,
      requestVerified: false,
      accessLogSuccess: 'TBD',
      newAccessRequest: 'TBD',
      logDataId: 'TBD',
      logTime: 'TBD',
      logSuccess: 'TBD',
      logRequester: 'TBD',
      dataID: 'TBD',
      ownerID: 1,
      requester_id: '0xE53736Cb429d5ad2578a27b67eaD50348a495dA8', //should get from session
      authList: '',
      isOwner: true,
      web3: null,
      accounts: null,
      contract: null
    };
    this.handleOwnerClick = this.handleOwnerClick.bind(this);
    this.handleRequesterClick = this.handleRequesterClick.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.handleReadAccessForm = this.handleReadAccessForm.bind(this);
    this.handleRequestForm = this.handleRequestForm.bind(this);
  }


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DataEscrowContract.networks[networkId];

      //console.log(DataEscrowContract.networks[networkId].address);

      const instance = new web3.eth.Contract(
        DataEscrowContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      //console.log(instance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleForm = async (formDataID, formAuthList) => {
    const { accounts, contract } = this.state;
    var addDataResponse;
    var authArray = formAuthList.split(",")
    await contract.methods.addDataEntry(formDataID, this.state.ownerID, authArray).send({ from: accounts[0] }).then(function (receipt) {
      addDataResponse = receipt.status;
    });
    this.setState({ dataAddedSuccess: addDataResponse });
    console.log("form send contract")
    console.log(this.state.dataAddedSuccess);
    console.log("Generating Key");
    console.log("Your public key is : 1234566");
    console.log("Storing your private key 1 in key valt");
    console.log("Storing your private key 2 in TEE");
  }

  handleReadAccessForm = async (requestLog) => {
    const { contract } = this.state;
    var accessLog;
    // read a data Access Request (Access Request ID)
    await contract.methods.readAccessLog(requestLog).call().then(function (result) {
      accessLog = result;
    });
    this.setState({ logDataId: accessLog._dataID });
    this.setState({ logRequester: accessLog._requester });
    this.setState({ logSuccess: accessLog._isSuccess });
    this.setState({ logTime: accessLog._accessTime });
    console.log(this.state.logDataId);
  }

  handleRequestForm = async (formDataID) => {
    const { accounts, contract } = this.state;
    var newAccessRequestID;
    var addAccessResponse;
    // add Data Access Request (requester ID, dataID)
    await contract.methods.addAccessRequest(this.state.requester_id, formDataID).send({ from: accounts[0] }).on('receipt', function (receipt) {
      console.log(receipt.events.AddAccess.returnValues._requestID);
      newAccessRequestID = receipt.events.AddAccess.returnValues._requestID;
      addAccessResponse = receipt.events.AddAccess.returnValues._isSuccess;
    }).on('error', console.error);
    this.setState({ accessLogSuccess: addAccessResponse });
    this.setState({ newAccessRequest: newAccessRequestID });
  }

  handleOwnerClick() {
    this.setState({ isOwner: false });
  }

  handleRequesterClick() {
    this.setState({ isOwner: true });
  }


  runExample = async () => { }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    var isOwner = this.state.isOwner;
    var dataAddedSuccess = this.state.dataAddedSuccess;
    var ownerID = this.state.ownerID;
    // requester_id: 22, //should get from session
    let button;
    if (isOwner) {
      button = <OwnerButton onClick={this.handleOwnerClick} />;
    } else {
      button = <RequesterButton onClick={this.handleRequesterClick} />;
    }
    return (

      <div className="App">
        <DisplayView isOwner={isOwner}
          dataAddedSuccess={dataAddedSuccess}
          ownerID={ownerID}
          handleForm={this.handleForm}
          handleReadAccessForm={this.handleReadAccessForm}
          logDataID={this.state.logDataID}
          newAccessRequest={this.state.newAccessRequest}
          logSuccess={this.state.logSuccess}
          logtime={this.state.logTime}
          logRequester={this.state.logRequester}
          requester_id={this.state.requester_id}
          handleRequestForm={this.handleRequestForm}
          accessLogSuccess={this.state.accessLogSuccess}
          newAccessRequest={this.state.newAccessRequest}
        />
        <p></p>
        <p>
        {button}
        </p>
       
      </div>
    );
  }
}

export default App;

function DataOwner(props) {
  return (
    <div>
      <h1>Data Owner View</h1>
      <p>If you own a piece of data and want to register for escrow, fill in the form below.</p>
      <h2>Register Data</h2>
      <p>Your data owner ID is {props.ownerID}</p>
      <p>
        Please define your data unique identifier, your unique identifier, and your authorized acces control list.
        </p>
      <DataEntryForm onFormSubmit={props.handleForm} />

      <p>The data Entry is added: {props.dataAddedSuccess.toString()}</p>
  
      <h2>Check Access Log</h2>
      <p>
        Use access log ID to view access request details.
        </p>
      <CheckAccessLog onFormSubmit={props.handleReadAccessForm} />
      <p>
        The access log on Data {props.logDataID} with request ID {props.newAccessRequest} is added successfully: {props.logSuccess ? props.logSuccess.toString() : " "}.
        </p>
      <p>
        Access Time is at {props.logTime} by requester {props.logRequester}.
        </p>
    </div>
  );
}

function RequesterView(props) {
  return (<div>
    <h1>Data Requester View</h1>
    <p>I want to access a piece of data with owner's authorization.</p>
    <h2>Access Reqest</h2>
    <p>Your requester ID is {props.requester_id}.</p>
    <AccessRequest onFormSubmit={props.handleRequestForm} />
    <div>
      The acccess log is added successfully:
      {props.accessLogSuccess ? props.accessLogSuccess.toString() : " "}
    </div>
    <div>The access request ID is : {props.newAccessRequest} </div>
  </div >
  );
}

function OwnerButton(props) {
  return (
    <button onClick={props.onClick}>
      Request Data Access
    </button>
  );
}

function RequesterButton(props) {
  return (
    <button onClick={props.onClick}>
      I'm Owner
    </button>
  );
}

function DisplayView(props) {
  const isOwner = props.isOwner;
  console.log('pass data to displayvier')
  console.log(isOwner);
  if (isOwner) {
    return <DataOwner ownerID={props.ownerID}
      handleForm={props.handleForm}
      dataAddedSuccess={props.dataAddedSuccess}
      handleReadAccessForm={props.handleReadAccessForm}
      logDataID={props.logDataID}
      newAccessRequest={props.newAccessRequest}
      logSuccess={props.logSuccess}
      logtime={props.logTime}
      logRequester={props.logRequester}
    />;
  }
  return <RequesterView requester_id={props.requester_id}
    handleRequestForm={props.handleRequestForm}
    accessLogSuccess={props.accessLogSuccess}
    newAccessRequest={props.newAccessRequest}
  />;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);