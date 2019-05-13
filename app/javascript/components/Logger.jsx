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
import {demoMemberships,demoClubUsers,demoAircrafts} from '../utilities/seeds'

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

class DropdownGroup extends React.Component {
  constructor(props){
    super(props)

    this.addProps = this.addProps.bind(this);
    this.update = this.update.bind(this);

    this.menuName = this.props.menuName
    this.menuData = JSON.parse(JSON.stringify(this.props.menuData))

    this.children = []
    this.filters = []
    this.change = []

    this.state = {
      menuData:this.props.menuData,
      columns:[]
    }
  }

  //Foreign Functions 
  update(valueColumnNum,value){
    var menuData = []
    
    for(var menuNum in this.menuData){
      var count = 0
      for(var columnNum in this.state.columns){
        if(columnNum == valueColumnNum){
          var filterValue = value
        } else {
          var filterValue = this.children[columnNum].props.value
        }
        
        if(this.filters[columnNum](this.menuData[menuNum][this.state.columns[columnNum]],filterValue)){
          count++
        } 
      }

      if(count == this.state.columns.length){menuData.push(this.menuData[menuNum])}
    }

    if(menuData.length == 1){
      console.log('Match')
    } else if(menuData.length == 0){
      console.log('No Match')
    } else {
      console.log('Multiple Match')
    }

    this.setState({menuData:menuData});
  }

  addProps(column,filter,change,child){
    const columns = this.state.columns
    columns.push(column)
    this.setState({columns:columns})

    this.filters.push(filter)
    this.change.push(change)
    this.children.push(child)

    return (columns.length - 1)
  }

  //Handlers
  menuHandler(menuNum) {
    for(var columnNum in this.state.columns){
      this.change[columnNum]({value:JSON.parse(JSON.stringify(this.menuData[menuNum][this.state.columns[columnNum]]))})
    }

    this.update()
    this.props.onMenuUpdate(menuNum)
  }

  //Builders
  rows(){
    const dropRow = (menuNum) => {
      return <Dropdown.Item key={"DI" + menuNum} eventKey={menuNum} onClick={e => this.menuHandler(menuNum)} >{columnLst}</Dropdown.Item>
    }
    
    var columns = this.state.columns
    var menuData = this.state.menuData

    var menuLst = []

    for(var menuNum in menuData){
      var columnLst = []
      for(var columnNum in columns){
        columnLst.push(menuData[menuNum][columns[columnNum]])
      }  
      menuLst.push(dropRow(menuNum));
    }
    
    return menuLst
  }

  render(){

    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
          setProps: this.addProps,
          update: this.update
          
        });
    });
    
    return (
      <Dropdown dropupauto="false">
      <div>
        <ul id="name">
        {children}
        </ul>
      </div>
      <Dropdown.Menu key={"DM "+this.menuName} as={CustomMenu} value={this.menuData}>
        {this.rows()}
      </Dropdown.Menu>
      </Dropdown>
    );
    
  }
}

class DropdownBox extends React.Component {
  constructor(props){
    super(props)

    this.column = this.props.column
    this.placehold = this.props.placeholder

    this.update = this.props.update

    this.changeHandler = this.changeHandler.bind(this);

    this.columnNum = this.props.setProps(this.column,this.props.filter,this.props.onChange,this)

  }

  changeHandler(event){
    const {name,value} = event.target
    this.props.onChange({name:name,value:value})
    this.update(this.columnNum,value)
  }

  render(){

    return (
        <li>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            <Form.Control autoComplete="new-password" placeholder={this.props.placeholder} name={this.props.column} onChange={this.changeHandler}  value={this.props.value}/>
          </Dropdown.Toggle>
        </li>
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

    if(window.mode == 'demo'){
      this.writeUser = {id:0,username:'Demo User'}
      this.club = {id:0,name:'Demo Club'}
      this.memberships = demoMemberships
      this.totalClubUsers = demoClubUsers
      this.totalAircrafts = demoAircrafts

    } else {
      this.writeUser = window.user
      this.club = window.club
      this.memberships = window.memberships
      this.totalClubUsers = window.clubUsers
      this.totalAircrafts = window.aircrafts
    }

    this.aircraftObj = {id:'',registration:'',acName:''}
    this.userObj = {userId:'',username:'',fName:'',lName:'',membershipId:'',launchFee:'',soaringFee:'',aerotowStandardFee:'',aerotowUnitFee:''}
    this.timeObj = {formatted:'',input:'',status:''}
		
    this.data = {
      indexNumber:'',

      user:this.writeUser,//Info
      date:(new Date()).toISOString(), 
      club:this.club,

      aircraft:this.aircraftObj,
      tug:this.aircraftObj,
        
      launchType:'winch',
      releaseHeight:2000,

      p1:this.userObj,
      p2:this.userObj,

      payee:'p1',//payment
      aerotowStandardFee:'',//aerotow
      aerotowUnitFee:'',
      aerotowLaunchFee:'',
      launchFee:'', //winch
      soaringFee:'',
      launchTime:this.timeObj,//time
      landTime:this.timeObj,
      soaringTotal:'',
      total:''
      //notes:''
    }

    this.defaultObjects = [
      ['data',this.data],
      ['p1ClubUsers',this.totalClubUsers],
      ['p2ClubUsers',this.totalClubUsers],
      ['aircrafts',this.totalAircrafts],
      ['tugAircrafts',this.totalAircrafts],
      ['mode','create']
    ];


    var stateObj = {};
    for(var key in this.defaultObjects){ 
      stateObj[this.defaultObjects[key][0]] = JSON.parse(JSON.stringify(this.defaultObjects[key][1]));
    }
    this.state = stateObj
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
    for(var key in this.defaultObjects){
      var stateObj = {};
      stateObj[this.defaultObjects[key][0]] = JSON.parse(JSON.stringify(this.defaultObjects[key][1]));
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

  setMembership(membership,user,updateGlobal=false){
    console.log('setMembership')
    console.log('User: ' + user)
    console.log(membership)
    var data = [
      ['membershipId', membership['membershipId']],
      ['launchFee', membership['launchFee']],
      ['soaringFee', membership['soaringFee']],
      ['aerotowStandardFee', membership['aerotowStandardFee']],
      ['aerotowUnitFee', membership['aerotowUnitFee']]
    ]

    this.setDataRow(user,data)

    if(updateGlobal){
      console.log('updateGlobal')
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

  setUser(userId,user) {
    console.log('setUser')
    var userObj = this.totalClubUsers[userId]
    var data = this.state.data

    for(var item in userObj){
      data[user][item] = userObj[item]
    }

    this.setState({data:data},this.setMembership(this.memberships[userObj['membershipId']],user,true))
  }

  setAircraft(id,type) {
    console.log('setAircraft')
    var userObj = this.totalAircrafts[id]
    var data = this.state.data

    for(var item in userObj){
      data[type][item] = userObj[item]
    }

    this.setState({data:data})
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
    var currentData = JSON.parse(JSON.stringify(this.state.data))

    this.setState({mode:'edit'},console.log(this.state))
    this.setState({data:importData},console.log(this.state))
  }

//handlers -----------------------------------
	handleChange(event){ //?????
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

  

  user(user){

    var boxChange = (event,row,column) => {
      console.log('boxChange')
      var data = this.state.data
      data[row][column] = event.value
      this.setState({data:data})
    }

    return(

    <Form.Row className="row">
      <Form.Label><h3>{user.charAt(0).toUpperCase() + user.slice(1)}</h3></Form.Label>

      <Form.Group className="group" controlId="formGridName" >
        <Form.Label>Name</Form.Label>

        <DropdownGroup menuName={user+'ClubUsers'} menuData={this.totalClubUsers} onMenuUpdate={(menuNum) => {this.setUser(this.totalClubUsers[menuNum]['userId'],user)}}>
          <DropdownBox column='fName' placeholder='First Name' onChange={(event) => {boxChange(event,user,'fName')}} value={this.state.data[user]['fName']} 
            filter={(textOriginal,search) => {return ((textOriginal.toLowerCase().startsWith(search.toLowerCase()))||(search == ''))}}
          />
          <DropdownBox column='lName' placeholder='Last Name' onChange={(event) => {boxChange(event,user,'lName')}} value={this.state.data[user]['lName']}
            filter={(textOriginal,search) => {return ((textOriginal.toLowerCase().startsWith(search.toLowerCase()))||(search == ''))}}
          />
        </DropdownGroup>
        
      </Form.Group>

      <Form.Group className="group" controlId="formGridState">
        <Form.Label>Membership</Form.Label>

        {this.membership(this.memberships,user)}

      </Form.Group>

    </Form.Row>
    );
  }

  aircraft(type){

    var auxGroup = () =>{
      if(type == 'aircraft'){
        return (
          <Form.Group className="group" controlId="formGridacName">
            <Form.Label>Launch</Form.Label>
            <ToggleButtonGroup vertical name="launchType" type="radio" onChange={(event) => this.setData([['launchType',event]])} value={this.state.data['launchType']}>
              <ToggleButton variant="outline-primary" value={'winch'}>Winch</ToggleButton>
              <ToggleButton variant="outline-primary" value={'aerotow'}>Aerotow</ToggleButton>
            </ToggleButtonGroup>
          </Form.Group>
        );
      } else {
        return (
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
        );
      }
    }

    var boxChange = (event,row,column) => {
      console.log('boxChange')
      var data = this.state.data
      data[row][column] = event.value
      //data[row]['id'] = ''
      this.setState({data:data})
    }

    var status = () => {
      if(type == 'tug'){
        if(this.state.data['launchType'] == 'winch'){
          return "row hideTug"
        } else { 
          return "row showTug"
        }
      } else {
        return "row"
      }
    }

    return(

    <Form.Row className={(type == 'tug')?(this.state.data['launchType'] == 'winch') ? "row hideTug" : "row showTug" : "row"}>
      <Form.Label><h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3></Form.Label>

      <Form.Group className="group" controlId="formGridName" >
        <Form.Label>Registration</Form.Label>

        <DropdownGroup menuName={type} menuData={this.totalAircrafts} onMenuUpdate={(menuNum) => {this.setAircraft(this.totalAircrafts[menuNum]['id'],type)}}>
          <DropdownBox column='registration' placeholder='Registration' onChange={(event) => {boxChange(event,type,'registration')}} value={this.state.data[type]['registration']} 
            filter={(textOriginal,search) => {
              if((textOriginal.toLowerCase().startsWith(search.toLowerCase()))||(search == '')){
                return true
              } else if(textOriginal.toLowerCase().slice(3).startsWith(search.toLowerCase())){
                return true
              } else {
                return false
              }
            }}/>
          <DropdownBox column='acName' placeholder='Name' onChange={(event) => {boxChange(event,type,'acName')}} value={this.state.data[type]['acName']} 
            filter={(textOriginal,search) => {return ((textOriginal.toLowerCase().startsWith(search.toLowerCase()))||(search == ''))}}      
          />
        </DropdownGroup>
        
      </Form.Group>

      {auxGroup()}

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
      }
      return data
    }

    var handleUpdate = (event) =>{
      const formData = Object.assign({},this.state.data);
      this.flightController.updateFromLogger(floatData(formData,columns))

      this.setState({mode:'create'})
      this.clear()
    }

    var handleCancel = (event) =>{
      this.flightController.cancelFromLogger(this.state.data.indexNumber)

      this.setState({mode:'create'})
      this.clear()
    }

    var handleAdd = (event) => {
      var formData = Object.assign({},this.state.data);
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

            {this.aircraft('aircraft')}

            {this.aircraft('tug')}

            {this.user('p1')}

            {this.user('p2')}

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
    console.log('logger will update')
    console.log(this.state)
  }

  componentWillUnmount(){
    console.log('end logger')
  }
}

export default Logger