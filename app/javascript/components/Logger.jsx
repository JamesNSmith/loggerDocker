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

class Membership extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    var options = () => {
      var lst = [];
      for(var key in this.props.memberships){
        lst.push(<option key = {'opt' + key} value={key}>{this.props.memberships[key]['name']}</option>);
      }
      return lst
    }

    return(
      <Form.Control as="select" onChange={(e) => {this.props.setMembership(this.props.memberships[e.target.value],this.props.user)}} value={this.props.value}>
        {options()}
      </Form.Control>
    );
  }
}

class User extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    return(

    <Form.Row className="row">
      <Form.Label><h3>{this.props.user.charAt(0).toUpperCase() + this.props.user.slice(1)}</h3></Form.Label>

      <Form.Group className="group" controlId="formGridName" >
        <Form.Label>Name</Form.Label>

        <DropdownGroup menuName={this.props.user+'ClubUsers'} menuData={this.props.totalClubUsers} onMenuUpdate={(menuNum) => {this.props.setUser(this.props.totalClubUsers[menuNum]['userId'],this.props.user)}}>
          <DropdownBox column='fName' placeholder='First Name' onChange={(event) => {this.props.textboxChange(event,this.props.user,'fName')}} value={this.props.userData['fName']} 
            filter={(textOriginal,search) => {return ((textOriginal.toLowerCase().startsWith(search.toLowerCase()))||(search == ''))}}
          />
          <DropdownBox column='lName' placeholder='Last Name' onChange={(event) => {this.props.textboxChange(event,this.props.user,'lName')}} value={this.props.userData['lName']}
            filter={(textOriginal,search) => {return ((textOriginal.toLowerCase().startsWith(search.toLowerCase()))||(search == ''))}}
          />
        </DropdownGroup>
        
      </Form.Group>

      <Form.Group className="group" controlId="formGridState">
        <Form.Label>Membership</Form.Label>

        {this.props.membership}

      </Form.Group>

    </Form.Row>
    );
  }
}

class AircraftAux extends React.Component {
  constructor(props){
    super(props)

  }

  render(){
    if(this.props.type == 'aircraft'){
      return (
        <Form.Group className="group" controlId="formGridacName">
          <Form.Label>Launch</Form.Label>
          <ToggleButtonGroup vertical name="launchType" type="radio" onChange={this.props.onLaunchChange} value={this.props.launchType}>
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
              <Button variant="outline-primary" onClick={(e) => this.props.setReleaseHeight(e,+1000)}>+</Button>
              <Button variant="outline-primary" onClick={(e) => this.props.setReleaseHeight(e,-1000)}>-</Button>
              <Button variant="outline-primary" onClick={(e) => this.props.setReleaseHeight(e,+1000)}>{this.props.releaseHeight}</Button>
            </InputGroup.Prepend>
          </InputGroup>
        </Form.Group>
      );
    }
  }
}

class Aircraft extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    var status = () => {
      if(this.props.type == 'tug'){
        if(this.props.launchType == 'winch'){
          return "row hideTug"
        } else { 
          return "row showTug"
        }
      } else {
        return "row"
      }
    }

    return(

    <Form.Row className={(this.props.type == 'tug')?(this.props.launchType == 'winch') ? "row hideTug" : "row showTug" : "row"}>
      <Form.Label><h3>{this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)}</h3></Form.Label>

      <Form.Group className="group" controlId="formGridName" >
        <Form.Label>Registration</Form.Label>

        <DropdownGroup menuName={this.props.type} menuData={this.props.totalAircrafts} onMenuUpdate={(menuNum) => {this.props.setAircraft(this.props.totalAircrafts[menuNum]['id'],this.props.type)}}>
          <DropdownBox column='registration' placeholder='Registration' onChange={(event) => {this.props.textboxChange(event,this.props.type,'registration')}} value={this.props.aircraftData['registration']} 
            filter={(textOriginal,search) => {
              if((textOriginal.toLowerCase().startsWith(search.toLowerCase()))||(search == '')){
                return true
              } else if(textOriginal.toLowerCase().slice(3).startsWith(search.toLowerCase())){
                return true
              } else {
                return false
              }
            }}/>
          <DropdownBox column='acName' placeholder='Name' onChange={(event) => {this.props.textboxChange(event,this.props.type,'acName')}} value={this.props.aircraftData['acName']} 
            filter={(textOriginal,search) => {return ((textOriginal.toLowerCase().startsWith(search.toLowerCase()))||(search == ''))}}      
          />
        </DropdownGroup>
        
      </Form.Group>

      {this.props.aircraftAux}

    </Form.Row>
    );
  }
}

class Logger extends React.Component {
	constructor(props){
		super(props);

		//this.handleAdd = this.handleAdd.bind(this);
    this.importEditData = this.importEditData.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setMembership = this.setMembership.bind(this);
    this.setPayee = this.setPayee.bind(this);
    this.setAircraft = this.setAircraft.bind(this);
    this.setReleaseHeight = this.setReleaseHeight.bind(this);
    

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
    this.userObj = {userId:'',username:'',fName:'',lName:'',membershipId:'',winchLaunchFee:'',soaringFee:'',aerotowStandardFee:'',aerotowUnitFee:''}
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
      winchLaunchFee:'', //winch
      soaringFee:'',
      launchTime:this.timeObj,//time
      landTime:this.timeObj,
      soaringTotal:'',
      aerotowTotal:'',
      winchTotal:''
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

//foreign functions
  importEditData(importData){
    var currentData = JSON.parse(JSON.stringify(this.state.data))

    this.setState({mode:'edit'},console.log(this.state))
    this.setState({data:importData},console.log(this.state))
  }

//Calculations
  getAerotowFee(launchFee,unitFee,height){
    var figure = parseFloat(launchFee) + parseFloat(unitFee)*parseInt(height - 2000)/1000
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

//handlers -----------------------------------
	/*handleChange(event){ //?????
		const data = this.state.data
		const {name,value} = event.target
		data[name] = value
		this.setState({data:data},console.log(this.state.data));
	}*/

// Sets
  setMembership(membership,user,updateGlobal=false){
    var data = this.state.data

    var userMem = [
      ['membershipId', membership['membershipId']],
      ['winchLaunchFee', membership['winchLaunchFee']],
      ['soaringFee', membership['soaringFee']],
      ['aerotowStandardFee', membership['aerotowStandardFee']],
      ['aerotowUnitFee', membership['aerotowUnitFee']]
    ]

    var globalMem = [
      ['payee', user],
      ['winchLaunchFee', membership['winchLaunchFee']],
      ['soaringFee', membership['soaringFee']],
      ['aerotowStandardFee', membership['aerotowStandardFee']],
      ['aerotowUnitFee', membership['aerotowUnitFee']],
      ['aerotowLaunchFee',this.getAerotowFee(membership['aerotowStandardFee'],membership['aerotowUnitFee'],this.state.data['releaseHeight'])]
    ]

    for(var mem in userMem){
      data[user][userMem[mem][0]] = userMem[mem][1]
    }

    if(user == data['payee']||updateGlobal){
      console.log('updateGlobal')

      for(var globe in globalMem){
        data[globalMem[globe][0]] = globalMem[globe][1]
      }

    }

    this.setState({data:data})
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

  setReleaseHeight(event,figure){
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

  setPayee(payee){
    const columns = ['winchLaunchFee','soaringFee','aerotowStandardFee','aerotowUnitFee']
    const data = this.state.data

    data['payee'] = payee

    for(var key in columns){
      data[columns[key]] = data[payee][columns[key]]
    }

    data['aerotowLaunchFee'] = this.getAerotowFee(data[payee]['aerotowStandardFee'],data[payee]['aerotowUnitFee'],data['releaseHeight'])

    this.setState({data:data},console.log(this.state.data))
  }

//constructors ---------------------------------
  fees(){
    var aerotowUpdate = (event) => {
      const {name,value} = event.target
      var data = this.state.data

      if(name == 'aerotowStandardFee'){
        var aerotowStandardFee = value
        var aerotowUnitFee = data['aerotowUnitFee']
      } else {
        var aerotowStandardFee = data['aerotowStandardFee']
        var aerotowUnitFee = value
      }

      data[name] = value
      data['aerotowLaunchFee'] = this.getAerotowFee(aerotowStandardFee,aerotowUnitFee,data['releaseHeight'])

      this.setState({data:data})
    }

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
          <Form.Control placeholder="Launch Fee" name="winchLaunchFee" onChange={(e) => {this.setData([[e.target.name,e.target.value]])}} onClick={(e)=>e.target.select()} value={this.state.data["winchLaunchFee"]}/>
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
        <Form.Control placeholder="Launch Fee" name="aerotowStandardFee" onChange={aerotowUpdate} onClick={(e)=>e.target.select()} value={this.state.data["aerotowStandardFee"]}/>
      </Form.Group>

      <Form.Group className={(this.state.data['launchType'] == 'winch') ? "group hideElement" : "group showElement"} controlId="formGridEmail" >
        <Form.Label>Fee per 1000ft above</Form.Label>
        <Form.Control placeholder="Launch Fee" name="aerotowUnitFee" onChange={aerotowUpdate} onClick={(e)=>e.target.select()} value={this.state.data["aerotowUnitFee"]}/>
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
    var columns = ['winchLaunchFee','aerotowLaunchFee','aerotowStandardFee','aerotowUnitFee','soaringFee']
    
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
      formData['date'] = (new Date()).toISOString()
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

            <Aircraft
              type={'aircraft'}
              launchType={this.state.data['launchType']}
              aircraftData={this.state.data['aircraft']}
              totalAircrafts={this.totalAircrafts}
              setAircraft={this.setAircraft} 
              textboxChange={(event,row,column) => {var data= this.state.data; data[row][column]= event.value; this.setState({data:data})}}
              aircraftAux={<AircraftAux
                type={'aircraft'} 
                releaseHeight={this.state.data['releaseHeight']} 
                launchType={this.state.data['launchType']} 
                onLaunchChange={(event) => this.setData([['launchType',event]])} 
                setReleaseHeight={this.setReleaseHeight}
              />}
            />

            <Aircraft
              type={'tug'}
              launchType={this.state.data['launchType']}
              aircraftData={this.state.data['tug']}
              totalAircrafts={this.totalAircrafts}
              setAircraft={this.setAircraft} 
              textboxChange={(event,row,column) => {var data= this.state.data; data[row][column]= event.value; this.setState({data:data})}}
              aircraftAux={<AircraftAux
                type={'tug'} 
                releaseHeight={this.state.data['releaseHeight']} 
                launchType={this.state.data['launchType']} 
                onLaunchChange={(event) => this.setData([['launchType',event]])} 
                setReleaseHeight={this.setReleaseHeight}
              />}
            />

            <User 
              user='p1' 
              totalClubUsers={this.totalClubUsers} 
              setUser={this.setUser} 
              userData={this.state.data['p1']} 
              textboxChange={(event,row,column) => {var data= this.state.data; data[row][column]= event.value; this.setState({data:data})}}
              membership={<Membership
                user='p1'
                value={this.state.data['p1']['membershipId']}
                memberships={this.memberships}
                setMembership={this.setMembership}
              />}
            />

            <User 
              user='p2' 
              totalClubUsers={this.totalClubUsers} 
              setUser={this.setUser} 
              userData={this.state.data['p2']} 
              textboxChange={(event,row,column) => {var data= this.state.data; data[row][column]= event.value; this.setState({data:data})}}
              membership={<Membership
                user='p2'
                value={this.state.data['p2']['membershipId']}
                memberships={this.memberships}
                setMembership={this.setMembership}
              />}
            />

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