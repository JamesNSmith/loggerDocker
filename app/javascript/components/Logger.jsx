import React from "react"

import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown'

import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

import FlightController from '../utilities/flightController'

class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
          onClick: this.props.onClick
        });
    });
    
    return (
      <div>
        {children}
      </div>
    );
  }
}

class CustomMenu extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { value: '' };
  }

  render() {
    const {
      children,
      style,
      className,
      'aria-labelledby': labeledBy,
    } = this.props;

    const value = this.props.value;

    const childs = React.Children.map(this.props.children, child => {
      return React.cloneElement(child,{});
    });

    return (
      <div style={style} className={className} aria-labelledby={labeledBy}>
        <ul className="list-unstyled">
          {childs}
        </ul>
      </div>
    );
  }
}


class Logger extends React.Component {
	constructor(props){
		super(props);

		//this.handleAdd = this.handleAdd.bind(this);
    this.setPayee = this.setPayee.bind(this);
    this.importEditData = this.importEditData.bind(this);

    window.flightControllerDependents['logger'] = this
    this.flightController = window.flightController

    //this.memberships = window.memberships
    //this.totalClubUsers = window.clubUsers
    //this.totalAircrafts = window.aircrafts

    this.aircraftObj = {id:'',registration:'',acName:''}
    this.userObj = {userId:'',username:'',fName:'',lName:'',membershipId:'',launchFee:'',soaringFee:'',aerotowStandardFee:'',aerotowUnitFee:''}
    this.timeObj = {formatted:'',input:'',status:''}
		
    this.state = {
			data:{
        user:'',//Info
        date:'', 
        club:'',

        aircraft:'',
				tug:'',
        
        launchType:'',
        releaseHeight:'',

        p1:'',
        p2:'',

        payee:'',//payment
        aerotowStandardFee:'',//aerotow
        aerotowUnitFee:'',
        aerotowLaunchFee:'',
				launchFee:'', //winch
				soaringFee:'',
        launchTime:'',//time
        landTime:'',
        //notes:''
			},
      p1ClubUsers:'',
      p2ClubUsers:'',
      aircrafts:'',
      tugAircrafts:'',
      mode:''
		}

    this.defaultValues = [
      ['user',window.user],
      ['date',(new Date()).toISOString()],
      //['club',window.club],
      ['aircraft',JSON.parse(JSON.stringify(this.aircraftObj))],
      ['tug',JSON.parse(JSON.stringify(this.aircraftObj))],
      ['launchType','winch'],
      ['releaseHeight',2000],
      ['p1',JSON.parse(JSON.stringify(this.userObj))],
      ['p2',JSON.parse(JSON.stringify(this.userObj))],
      ['payee','p1'],
      ['launchTime',JSON.parse(JSON.stringify(this.timeObj))],
      ['landTime',JSON.parse(JSON.stringify(this.timeObj))]
    ];

    /*this.defaultObjects = [
      ['p1ClubUsers',JSON.parse(JSON.stringify(this.totalClubUsers))],
      ['p2ClubUsers',JSON.parse(JSON.stringify(this.totalClubUsers))],
      ['aircrafts',JSON.parse(JSON.stringify(this.totalAircrafts))],
      ['tugAircrafts',JSON.parse(JSON.stringify(this.totalAircrafts))],
      ['mode','create']
    ];*/

    for(var key in this.defaultValues){
      this.state.data[this.defaultValues[key][0]] = this.defaultValues[key][1]
    }

    /*for(var key in this.defaultObjects){
      var stateObj = {};
      this.state[this.defaultObjects[key][0]] = this.defaultObjects[key][1];
    }*/
	}
//Calculations
getAerotowFee(launchFee,unitFee,height){
    var figure = parseInt(launchFee) + parseInt(unitFee)*parseInt(height - 2000)/1000
    console.log(figure)
    return figure 
  }

//formatters
  formatDate(inputDate){
    var date = new Date(inputDate)
    
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();

    return (day.toString() + " / " + month.toString() + " / " + year.toString());
  }

// Helpers
  clear(){
    console.log('clear')
    const data = this.state.data

    for(var line in data){
      data[line] = ''
    }

    for(var key in this.defaultValues){
      data[this.defaultValues[key][0]] = this.defaultValues[key][1]
    }

    this.setState({data:data});

    for(var key in this.defaultObjects){
      var stateObj = {};
      stateObj[this.defaultObjects[key][0]] = this.defaultObjects[key][1];
      this.setState(stateObj);
    }
  }

  setData(nameValue,successHandler = () => {console.log(this.state.data)}){
    console.log(nameValue)
    const data = this.state.data
    for(var key in nameValue){
      data[nameValue[key][0]] = nameValue[key][1]
    }
    this.setState({data:data},successHandler);
  }

  setDataRow(row,nameValue,successHandler = () => {console.log(this.state.data)}){
    console.log(nameValue)
    const data = this.state.data
    for(var key in nameValue){
      data[row][nameValue[key][0]] = nameValue[key][1]
    }
    this.setState({data:data},successHandler);
  }

  setMembership(membership,user,start=false){
    console.log('setMembership')
    var data = [
      ['membershipId', membership['membershipId']],
      ['launchFee', membership['launchFee']],
      ['soaringFee', membership['soaringFee']],
      ['aerotowStandardFee', membership['aerotowStandardFee']],
      ['aerotowUnitFee', membership['aerotowUnitFee']]
    ]

    this.setDataRow(user,data)

    if(!start){
      console.log('start')
      var fees = [
        ['payee', user],
        ['launchFee', membership['launchFee']],
        ['soaringFee', membership['soaringFee']],
        ['aerotowStandardFee', membership['aerotowStandardFee']],
        ['aerotowUnitFee', membership['aerotowUnitFee']],
        ['aerotowLaunchFee',this.getAerotowFee(membership['aerotowStandardFee'],membership['aerotowUnitFee'],this.state.data['releaseHeight'])]
      ]
      this.setData(fees)

    }
  }

  setPayee(payee){
    const columns = ['launchFee','soaringFee']

    const data = this.state.data
    var launchType = this.state.data['launchType']

    data['payee'] = payee

    var objectKey = ''
    for(var key in columns){
      data[columns[key]] = data[payee][columns[key]]
    }

    this.setState({data:data},console.log(this.state.data))
  }

//foreign functions -----------------------------

importEditData(importData){
  console.log('importEditData')
  console.log(importData)

  var currentData = JSON.parse(JSON.stringify(this.state.data))
  console.log(currentData)

  this.setState({mode:'edit'},console.log(this.state))
  this.setState({data:importData},console.log(this.state))

  
  //this.setState({data:data},)


}

//handlers -----------------------------------
	handleChange(event){
		const data = this.state.data
		const {name,value} = event.target
		data[name] = value
		this.setState({data:data},console.log(this.state.data));
	}


//constructors ---------------------------------
  membership(memberships,user){
    var options = () => {
      var lst = [];
      for(var key in memberships){
        lst.push(<option key = {'opt' + key} value={key}>{memberships[key]['name']}</option>);
      }
      return lst
    }

    var memHandler = (e) => {
      console.log('memHandler')
      this.setMembership(memberships[e.target.value],user)
    }
  
    return(
      <Form.Control as="select" onChange={memHandler} value={this.state.data[user]['membershipId']}>
        {options()}
      </Form.Control>
    );
  }

  defaultMenuElement(items){
    var lst = []
    for(var key in items){
      lst.push([key,items[key]])
    }
    return lst
  }

  dropdownInput(row,column,placeHolder,menuName,totalDropdownRows,columnNames,filterElement,menuElement = this.defaultMenuElement){
    //Utils -------------------------------------

    var filter = (success,failure) => {
      var lst = []
      var columns = {}

      for(var key in columnNames){
        columns[columnNames[key]] = this.state.data[row][columnNames[key]]
      }
      
      for(var userKey in totalDropdownRows){
        var count = 0
        for(var columnKey in columns){
          if(filterElement(totalDropdownRows[userKey][columnKey],columns[columnKey])){count++}
        }
        if(count == 0){lst.push(totalDropdownRows[userKey])}
      }

      var data = {}
      data[menuName] = lst
      this.setState(data,success);
    }

    var menuUpdate = (text,row,column) => {
      var recordList = this.state[menuName]

      console.log('menuUpdate')
      console.log(menuName)
      console.log(recordList)

      if(recordList.length == 1){

        var record = recordList[0]
        var lst = menuElement(record)

        this.setDataRow(row,lst)

      } else {
        this.setDataRow(row,[[column,text]])
      }
    
    }

    //Handlers ------------------------------

    var formHandler = (event) => {
      const {name,value} = event.target
      var queue = new Promise((resolve,reject) => {this.setDataRow(row,[[name,value]],resolve)})
      .then(() => {return new Promise((resolve,reject) => {filter(resolve,reject)})})
    }

    var menuHandler = (event,row,column) => {
      var text = event.target.innerHTML

      console.log('menuHandler')

      var menuQueue = new Promise((resolve,reject) => {this.setDataRow(row,[[column,text]],resolve)})
      .then(()=>{return new Promise((resolve,reject) => {filter(resolve,reject)})})
      .then(()=>{menuUpdate(text,row,column)})
      .catch((error) => {console.log('menuQueue failed:');console.log(error)})
      
    }

    //Constructors
    var dropRows = (row,column) => {
      var dropdownRows = this.state[menuName]
      var lst = []

      for(var key in dropdownRows){
        lst.push(<Dropdown.Item key={"DI" + key} eventKey={key} onClick={e => menuHandler(e,row,column)}>{dropdownRows[key][column]}</Dropdown.Item>);
      }
      return lst
    }

    return (
      <Dropdown dropupauto="false">
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <Form.Control autoComplete="new-password" placeholder={placeHolder} name={column} onChange={e => formHandler(e)}  value={this.state.data[row][column]}/>
        </Dropdown.Toggle>

        <Dropdown.Menu key={"DM" + row+column} as={CustomMenu} value={this.state.data[row][column]}>
          {dropRows(row,column)}
        </Dropdown.Menu>
      </Dropdown>
      );
  }

  user(title,user){
    var columnNames = ['fName','lName']
    var menuName = user+'ClubUsers'

    var filterElement = (searchElement,inputElement) => {
      return !((searchElement.toLowerCase().startsWith(inputElement.toLowerCase()))||(inputElement == ''))
    }

    var menuElement = (items) =>{
      var lst = []
      for(var key in items){
        if(key == 'membershipId'){
          this.setMembership(this.memberships[items['membershipId']],user)
        } else {
          lst.push([key,items[key]])
        }
      }
      return lst
    }

    return(
    <Form.Row className="row">
      <Form.Label><h3>{title}</h3></Form.Label>
    
      <Form.Group className="group" controlId="formGridName" >
        <Form.Label>Name</Form.Label>
      
        <ul id="name">

        <li>
        {this.dropdownInput(user,'fName',"First Name",menuName,this.totalClubUsers,columnNames,filterElement,menuElement)}
        </li>

        <li>
        {this.dropdownInput(user,'lName',"Last Name",menuName,this.totalClubUsers,columnNames,filterElement,menuElement)}
        </li>
        </ul>
        
      </Form.Group>

      <Form.Group className="group" controlId="formGridState">
        <Form.Label>Membership</Form.Label>

        {this.membership(this.memberships,user)}

      </Form.Group>

    </Form.Row>
    );
  }

  aircraftFilterElement(searchElement,inputElement) {

    if(!((searchElement.toLowerCase().startsWith(inputElement.toLowerCase()))||(inputElement == ''))){
      if(!searchElement.toLowerCase().slice(3).startsWith(inputElement.toLowerCase())){
        return true
      }
    }
    return false
  }

  aircraft(){
    var columnNames = ['registration','acName']; //
    var menuName = 'aircrafts';
    var row = 'aircraft'

    return (
      <Form.Row className="row">
      <Form.Label><h3>Aircraft</h3></Form.Label>

      <Form.Group className="group" controlId="formGridRegistration" >
        <Form.Label>Registration</Form.Label>
        {this.dropdownInput(row,'registration',"Registration",menuName,this.totalAircrafts,columnNames,this.aircraftFilterElement)}
      </Form.Group>

      <Form.Group className="group" controlId="formGridacName">
        <Form.Label>Name</Form.Label>
        {this.dropdownInput(row,'acName',"Name",menuName,this.totalAircrafts,columnNames,this.aircraftFilterElement)}
      </Form.Group>

      <Form.Group className="group" controlId="formGridacName">
        <Form.Label>Launch</Form.Label>
        <ToggleButtonGroup vertical name="launchType" type="radio" onChange={(event) => this.setData([['launchType',event]])} value={this.state.data['launchType']}>
        <ToggleButton variant="outline-primary" value={'winch'}>Winch</ToggleButton>
        <ToggleButton variant="outline-primary" value={'aerotow'}>Aerotow</ToggleButton>
        </ToggleButtonGroup>
      </Form.Group>

      </Form.Row>

    );
  }
  
  tug(){
    var columnNames = ['registration','acName']; //
    var menuName = 'tugAircrafts';
    var row = 'tug'

    var handleClick = (event,figure) => {
      var height = this.state.data['releaseHeight']
      var returnHeight = (height + figure)
      var returnLst = [['releaseHeight',returnHeight]]

      if(returnHeight >= 2000){
        if(this.state.data['aerotowLaunchFee'] != ''){
          returnLst[1] = ['aerotowLaunchFee',this.getAerotowFee(this.state.data['aerotowStandardFee'],this.state.data['aerotowUnitFee'],returnHeight)]
        }

        this.setData(returnLst);
      }
    }
    //<FormControl disabled aria-describedby="basic-addon1" value={this.state.data['releaseHeight']}/>
    return (
      <Form.Row className={(this.state.data['launchType'] == 'winch') ? "row hideTug" : "row showTug"}>
      <Form.Label><h3>Tug</h3></Form.Label>

      <Form.Group className="group" controlId="formGridRegistration" >
        <Form.Label>Registration</Form.Label>
        {this.dropdownInput(row,'registration',"Registration",menuName,this.totalAircrafts,columnNames,this.aircraftFilterElement)}
      </Form.Group>

      <Form.Group className="group" controlId="formGridacName">
        <Form.Label>Name</Form.Label>
        {this.dropdownInput(row,'acName',"Name",menuName,this.totalAircrafts,columnNames,this.aircraftFilterElement)}
      </Form.Group>

      <Form.Group className="group" controlId="formGridacName">
        <Form.Label>Release Height</Form.Label>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <Button variant="outline-primary" onClick={(e) => handleClick(e,+1000)}>+</Button>
            <Button variant="outline-primary" onClick={(e) => handleClick(e,-1000)}>-</Button>
            <Button variant="outline-primary" onClick={(e) => handleClick(e,+1000)}>{this.state.data['releaseHeight']}</Button>
          </InputGroup.Prepend>
        </InputGroup>
      </Form.Group>

      </Form.Row>

    );
  }

  fees(){

    var launch = () => {
      if(this.state.data['launchType'] == 'aerotow'){

        return (
        <Form.Group className="group" controlId="formGridEmail" >
          <Form.Label>Launch Fee</Form.Label>
          <Form.Control placeholder="Launch Fee" name="aerotowLaunchFee" onChange={(e) => {this.setData([[e.target.name,e.target.value]])}} onClick={(e)=>e.target.select()} value={this.state.data["aerotowLaunchFee"]}/>
        </Form.Group>
        );

      } else {
    
        return (
        <Form.Group className="group" controlId="formGridEmail" >
          <Form.Label>Launch Fee</Form.Label>
          <Form.Control placeholder="Launch Fee" name="launchFee" onChange={(e) => {this.setData([[e.target.name,e.target.value]])}} onClick={(e)=>e.target.select()} value={this.state.data["launchFee"]}/>
        </Form.Group>
        );

      }
    }
    
    return (
      <Form.Row className="row">
      <Form.Label><h3>Fees</h3></Form.Label>

      <Form.Group className="group" controlId="formGridacName">
        <Form.Label>Payee</Form.Label>
        <ToggleButtonGroup vertical name="launchType" type="radio" onChange={this.setPayee} value={this.state.data['payee']}>
        <ToggleButton variant="outline-primary" value={'p1'}>P1</ToggleButton>
        <ToggleButton variant="outline-primary" value={'p2'}>P2</ToggleButton>
        </ToggleButtonGroup>
      </Form.Group>

      <Form.Group className={(this.state.data['launchType'] == 'winch') ? "group hideElement" : "group showElement"} controlId="formGridEmail" >
        <Form.Label>Aerotow Launch to 2000</Form.Label>
        <Form.Control placeholder="Launch Fee" name="aerotowStandardFee" onChange={(e) => {this.setData([[e.target.name,e.target.value]])}} onClick={(e)=>e.target.select()} value={this.state.data["aerotowStandardFee"]}/>
      </Form.Group>

      <Form.Group className={(this.state.data['launchType'] == 'winch') ? "group hideElement" : "group showElement"} controlId="formGridEmail" >
        <Form.Label>Fee per 1000ft above</Form.Label>
        <Form.Control placeholder="Launch Fee" name="aerotowUnitFee" onChange={(e) => {this.setData([[e.target.name,e.target.value]])}} onClick={(e)=>e.target.select()} value={this.state.data["aerotowUnitFee"]}/>
      </Form.Group>

      {launch()}
      
      <Form.Group className="group" controlId="formGridPassword" >
        <Form.Label>Soaring Fee</Form.Label>
        <Form.Control placeholder="Soaring Fee" name="soaringFee" onChange={(e) => {this.setData([[e.target.name,e.target.value]])}} onClick={(e)=>e.target.select()} value={this.state.data["soaringFee"]}/>
      </Form.Group>

      </Form.Row>
    );
  }

  buttons(){
    var columns = ['launchFee','aerotowLaunchFee','aerotowStandardFee','aerotowUnitFee','soaringFee']
    var floatData = (data,columns) =>{
      for(var key in columns){
        data[columns[key]] = parseFloat(data[columns[key]])
        console.log(data[columns[key]])
      }
      console.log(data)
      return data
    }
    var handleUpdate = (event) =>{
      console.log('update---');

      const formData = Object.assign({},this.state.data);
      console.log(formData)
      this.flightController.updateFromLogger(floatData(formData,columns))

      this.setState({mode:'create'},console.log(this.state.mode))
      this.clear()
    }
    var handleCancel = (event) =>{
      console.log('cancel');

      this.setState({mode:'create'},console.log(this.state.mode))
      this.clear()
    }
    var handleAdd = (event) => {
      console.log('add');
      var formData = Object.assign({},this.state.data);
      //formData['date'] = formData['date']
      console.log(formData)
      this.flightController.addFromLogger(floatData(formData,columns))
      this.clear()
    }

    if(this.state.mode == 'edit'){
      return (
        <div>
        <Button variant="outline-success" onClick={e => handleUpdate(e)}>
          Update
        </Button>
        <Button variant="outline-danger" onClick={e => handleCancel(e)}>
          Cancel
        </Button>
        </div>
      );
      
    } else {
      return (
        <div>
        <Button variant="outline-success" onClick={e => handleAdd(e)}>
          Add
        </Button>
        <Button variant="outline-danger" onClick={e => this.clear()}>
          Clear
        </Button>
        </div>
      );

    }
  }

	render(){
		return(
			<div>
			
        <div className="form">
          <Form className="formform" onSubmit={e => this.handleAdd(e)} >

            <Form.Row className="row">
            <Form.Label><h3>Info</h3></Form.Label>

              <Form.Group className="group" controlId="formGridDate" >
                <Form.Control disabled aria-describedby="basic-addon1" placeholder="Date" name="date" value={this.formatDate(this.state.data['date'])}/> 
              </Form.Group>

              <Form.Group className="group" controlId="formGridClub" >
                <Form.Control disabled aria-describedby="basic-addon1" placeholder="Club" name="club" value={this.state.data['club']['name']}/>
              </Form.Group>

            </Form.Row>

            {this.aircraft()}

            {this.tug()}

            {this.user('P1','p1')}

            {this.user('P2','p2')}

            {this.fees()}
  
            {this.buttons()}

          </Form>
        </div>

			</div>
		);
	}

  componentDidMount(){
    console.log('logger did mount')
    //this.setMembership(this.memberships[Object.keys(this.memberships)[0]],'p1',true)
    //this.setMembership(this.memberships[Object.keys(this.memberships)[0]],'p2',true)
    
  }

  componentWillUpdate(){
    console.log('update')
  }

  componentWillUnmount(){
    console.log('end logger')
  }
}

export default Logger