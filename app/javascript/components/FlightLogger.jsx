//import React from "react"
//import PropTypes from "prop-types"
//class FlightLogger extends React.Component {
  //render () {
    //return (
      //<React.Fragment>
        //Key: {this.props.key}
        //Demo: {this.props.demo}
      //</React.Fragment>
    //);
  //}
//}

//FlightLogger.propTypes = {
  //key: PropTypes.string,
  //demo: PropTypes.bool
//};
//export default FlightLogger

import React from "react"
import ReactDOM from "react"
import PropTypes from "prop-types"
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'

//import idb from 'idb';
//import { openDb, deleteDb } from 'idb';
//openDb();
//deleteDb();

import TableLog from './TableLog'
import Logger from './Logger'
//import Cable from './Cable'

import Database from '../utilities/indexedDB'
import FlightController from '../utilities/flightController'


    

class FlightLogger extends React.Component {
  constructor(props){
    super(props);
  //this.functions = [];
  //this.addDataRow = {};

  //this.componentDidMount = this.componentDidMount.bind(this);
  //this.update = this.update.bind(this);

    const keys = [
        'tailNumber',
        'acName',
        'p1FName',
        'p1LName',
        'p2FName',
        'p2LName',
        'lFee',
        'sFee'
      ]
    
  }

//coms -------------------------------------
  message(){
    console.log('TableLog')
  }

// Utils -------------------------------------

  //update(newData){
    //console.log('update');
    //console.log(newData)
    //this.addDataRow(newData)
    //update={this.update}
    //getFunctions={this.functions}
  //}

  componentWillMount(){
    console.log('flight will mount')
    //this.database = new Database('flightLogger'); 
    this.flightController = new FlightController(['flightLogger',this])
  }

//render --------------------------------------
  render() {
    return (
      <div>
        <Logger key='f1' />
        <br />
        <TableLog key='f2' />
      </div>
    );
  }

  componentDidMount(){
  console.log('flight did mount')
  //console.log(this.functions)
  //this.addDataRow = this.functions[0]

  this.database = new Database('flightLogger'); 

  console.log('ff')
  console.log(window.flightControllerDependents)
  
  }

  componentWillUnmount(){
    console.log('end')
    this.flightController.delete()
    delete this.flightContoller
  }

}

//FlightLogger.propTypes = {
  //greeting: PropTypes.string
//};

export default FlightLogger
