import React from "react"

import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import InputGroup from 'react-bootstrap/InputGroup'

import Database from '../utilities/indexedDB'
import FlightController from '../utilities/flightController'



class TableLog extends React.Component {
	constructor(props){
		super(props);
		//this.clickHandler = this.clickHandler.bind(this);
		//this.clickHandlert = this.clickHandlert.bind(this);

		this.setData = this.setData.bind(this);
		//this.addData = this.addData.bind(this);
		this.addDataTable = this.addDataTable.bind(this);
		this.clearData = this.clearData.bind(this);

		this.timeTextHandler = this.timeTextHandler.bind(this);
		this.timeButtonHandler = this.timeButtonHandler.bind(this);

		//this.props.getFunctions.push(this.addData);

		window.flightControllerDependents['table'] = this
    	console.log(flightControllerDependents)
		
    	this.input = {}
		this.state = {
			tableData:{},
			//inputData:{}
		}
		
	}

//formatters -------------------------------
	timeFormat(time, separator = ':'){
		if(time == ''){
			return ''
		}

		const timeDate = new Date(time);
		var hours = timeDate.getHours()
		var minutes = timeDate.getMinutes()

		if(minutes < 10){
			minutes = "0" + minutes;
		}

		return (hours + separator + minutes);
	}

	currencyFormat(value){
		if(value.length == 0){
			return value
		}

		value = value.toString()
		var figure = '£'
	
		var dpCount = 0
		for(var char in value){
			figure = figure + value[char]

			if(value[char] == '.' || dpCount > 0){
				dpCount++
			}

			if(dpCount > 2){
				break
			}
		}

		if(dpCount == 0){
			figure = figure + '.00'
		} else if(dpCount == 2){
			figure = figure + '0'
		}

		return figure
	}

	capitaliseFormat(word){
		return word.charAt(0).toUpperCase() + word.slice(1)
	}

//helpers ---------------------------------
	defaultData(){ // not sure -----------------------------
		var aircraftObj = {id:'',registration:'',acName:''}
    	var userObj = {userId:'',username:'',fName:'',lName:'',membershipId:'',launchFee:'',soaringFee:'',aerotowStandardFee:'',aerotowUnitFee:''}
		
		var data = {
        user:'',//Info
        date:'', 
        club:'',

        aircraft:JSON.parse(JSON.stringify(this.aircraftObj)),
		tug:JSON.parse(JSON.stringify(this.aircraftObj)),
        
        launchType:'',
        releaseHeight:'',

        p1:JSON.parse(JSON.stringify(this.userObj)),
        p2:JSON.parse(JSON.stringify(this.userObj)),

        payee:'',//payment
        aerotowStandardFee:'',//aerotow
        aerotowUnitFee:'',
        aerotowLaunchFee:'',
		launchFee:'', //winch
		soaringFee:'',
        launchTime:'',//time
        landTime:'',
        //notes:''
		}
	}

	setData(row,columnValue,successHandler = () => {console.log(this.state.tableData)}){
		console.log(row)
    	console.log(columnValue)
    	const data = this.state.tableData
    	for(var key in columnValue){

    		if(typeof columnValue[key][1] == 'object'){
    			var tierTwo = data[row][columnValue[key][0]]
    			var objTwo = columnValue[key][1]

    			for(var keyTwo in objTwo){
    				tierTwo[objTwo[keyTwo][0]] = objTwo[keyTwo][1]
    			}
    			data[row][columnValue[key][0]] = tierTwo

    		} else {
      			data[row][columnValue[key][0]] = columnValue[key][1]
      		}
    	}
    	
    	this.setState({tableData:data},successHandler());
  	}

  	scrollFocus(top){
  		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;
		var docHeight = document.height;

  		window.scroll({
  			top: top + 2*winHeight/3,
  			left: 0,
  			behavior: 'smooth'
		});
  	}

  	scrollLogger(){
  		window.scroll({
  			top: 150,
  			left: 0,
  			behavior: 'smooth'
		});
  	}

  	checkForStatus(status){
  		var statusFound = false
  		for(var key in this.state.tableData){
  			if(this.state.tableData[key]['status'] == status){
  				statusFound = true;
  				break;
  			}
  		}
  		return statusFound
  	}

//Utils -------------------------------------
	clearData(){
		this.setState({tableData:[]},console.log('ready'));
	}
	
	updateData(id,name,time){
		var table = 'flights'
		var timeFormated = time.toISOString()

		this.setData(id,[[name,[['formatted',timeFormated]]]],() => {console.log('updateData ready');console.log(this.state.tableData)})

		window.flightController.tableUpdateTime(table,id,name,timeFormated)
	}

	deleteRecord(index){
  		const data = this.state.tableData
  		const flightNumber = data['flightNumber']

  		if(!confirm('Are you sure you want to delete this record?')){
  			return ''
  		}

  		window.flightController.tableDeleteRecord(index,flightNumber)

  		delete data[index]
  		this.setState({tableData:data});
  	}

//foreign functions -----------------------------
	addDataTable(inputData){
		//table
		console.log('add data')
		var tableData = this.state.tableData;
		var returnData //= tableData.concat(inputData);

		//var inpData = this.state.inputData
		for(var count in inputData){

			if(typeof inputData[count]['launchTime'] != 'object'){//sloppy
				var formattedLaunchTime = inputData[count]['launchTime']
				var formattedLandTime = inputData[count]['landTime']
			} else {
				var formattedLaunchTime = inputData[count]['launchTime']['formatted']
				var formattedLandTime = inputData[count]['landTime']['formatted']
			}
			
			inputData[count]['launchTime'] = {formatted:formattedLaunchTime,input:this.timeFormat(formattedLaunchTime),status:''}
			inputData[count]['landTime'] = {formatted:formattedLandTime,input:this.timeFormat(formattedLandTime),status:''}

			inputData[count]['status'] = ''
			
			if(inputData[count]['launchTime']['formatted'] == ''){
				inputData[count]['launchTime']['status'] = ''
				inputData[count]['status'] = 'editTime'
			} else {
				inputData[count]['launchTime']['status'] = 'indexed'
			}

			if(inputData[count]['landTime']['formatted'] == ''){
				inputData[count]['landTime']['status'] = ''
				inputData[count]['status'] = 'editTime'
			} else {
				inputData[count]['landTime']['status'] = 'indexed'
			}

			//inputData[count]['launchTimeInput']
			//inputData[count]['landTimeInput']

			//inputData[count]['notes'] = '' // dodgy -------------------------

			console.log('input')
			console.log(inputData[count])
			tableData[inputData[count]['indexNumber']] = inputData[count]

			
		}

		this.setState({tableData:tableData},console.log('table ready'));
	}

	updateDataRow(inputData){
		var data = this.state.tableData
		data[inputData['indexNumber']] = inputData
		
		if(data[inputData['indexNumber']]['launchTime']['status'] == '' || data[inputData['indexNumber']]['launchTime']['status'] == ''){
			data[inputData['indexNumber']]['status'] = 'editTime'
		} else {
			data[inputData['indexNumber']]['status'] = ''
		}

		this.setState({data:data})

		var element = document.getElementById("tr"+inputData['indexNumber'])
		this.scrollFocus(element.offsetTop)
	}

	updateCheckStatus(id,name,success,failure){
		var tableData = this.state.tableData;
		var names = ['launchTime','landTime']
		var ready = false

		console.log(name)
		tableData[id][name]['status'] = 'indexed'

		var readyCount = 0
		for(var key in names){
			if(tableData[id][names[key]]['status'] == 'indexed'){readyCount++}
		}

		console.log(tableData)

		if(readyCount == 2){
			console.log('true')
			ready = true
			tableData[id]['status'] = ''
		} else {
			console.log('false')
			ready = false
		}

		this.setState({tableData:tableData});

		success(ready)	
		
	}

	updateTableData(id,columnValues,success,failure){
		console.log('updateTableData')
		console.log(columnValues)

		this.setData(id,columnValues,success)
	}

	
//handlers ----------------------------------

	/*clickHandler(){
		console.log('click handler');
		this.addData(this.extraData);
	}*/

	/*clickHandlert(){
		console.log('click handler');
		this.clearData();
	}*/

	timeTextHandler(event) {
		const {id,name,value} = event.target

		this.setData(id,[[name,[['input',value]]]])

		if(value.length == 5){
			console.log('validate')

			var valHour = value.slice(0,2);
			var valColon = value[2];
			var valMinute = value.slice(3,5);

			var hour = false
			var colon = false
			var minute = false

			for(var count = 0;count<24;count++){
				var compareVal = count.toString()
				if (compareVal.length < 2){
					compareVal = '0' + compareVal
				}
				if(valHour == compareVal){
					hour = true
					break;
				}
			}

			if(valColon == ':'){ // needs improvement
				colon = true
			} 

			for(var count = 0;count<60;count++){
				var compareVal = count.toString()
				if (compareVal.length < 2){
					compareVal = '0' + compareVal
				}
				if(valMinute == compareVal){
					minute = true
					break;
				}
			}

			if(hour && colon && minute){
				console.log('success')
				var time = new Date()
				time.setHours(parseInt(valHour))
				time.setMinutes(parseInt(valMinute))
				time.setSeconds(0)
				time.setMilliseconds(0)

				this.updateData(parseInt(id),name,time)

			} else {
				console.log('error')
			}
		}			
		
	}

	timeButtonHandler(id,name) {
		var time = new Date()
		time.setSeconds(0)
		time.setMilliseconds(0)
		console.log(time)

		this.setData(id,[[name,[['input',this.timeFormat(time)]]]])

		this.updateData(id,name,time)
	}

//constructors ------------------------------
	timeInput(index,name,mesg,time,type,btnImagePath){
		var returnHTML = []
		var buttonHandler = (event) =>{
			this.timeButtonHandler(index,name)
		}

		if(type == 'left'){
			var placeholder = mesg + ' - 24(hh:mm)          '
		} else if(type == 'right'){
			var placeholder = '          ' + mesg + ' - 24(hh:mm)'
		} else {
			var placeholder = mesg + ' - 24(hh:mm)'
		}

		var form = (<FormControl
						key={'time' + type + index}
     			  		placeholder={placeholder} 
      			  		aria-label={name}
      			  		aria-describedby={name}
      			  		autoComplete="new-password"
      			  		maxLength={5}
      			  		onChange={this.timeTextHandler}
      			  		name={name}
      			  		id={index}
      			  		value={this.state.tableData[index][name]['input']}
    			/>);
		var button = (
      			  	<Button 
      			  		key={'btn' + type + index}
      			  		variant="outline-secondary" 
      			  		onClick={buttonHandler}
      			  	>
      			  	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d={btnImagePath}/></svg>
      			  	</Button>
    				);

		if(type == 'left'){
			returnHTML.push(<InputGroup.Prepend key={'btninp' + type + index}>{button}</InputGroup.Prepend>)
			returnHTML.push(form)
		} else { 
			returnHTML.push(form)
			returnHTML.push(<InputGroup.Append key={'btninp' + type + index}>{button}</InputGroup.Append>) 
		}

		if(this.state.tableData[index]['status'] == 'editTime'){ //this.state.tableData[index]['launchTime']['status'] == 'indexed' && this.state.tableData[index]['landTime']['status'] == 'indexed' &&
			return(	
				<InputGroup className="mb-3">
					{returnHTML}
				</InputGroup>	
  			);

		} else {
  			return(
  				<ul className = "td"><li>{this.timeFormat(time,' : ')}</li></ul>
  			);
		}
		
	}

	/*
	hideOn(condition){ // hmmmmmmmmmmmmmm
	 	if(condition()){
	 		return " hideElement ";
	 	} else {
	 		return " showElement ";
	 	}

	} */

	row(data){
		if(!data){
  			return (<tr key = "last"><td colSpan="100%" height="60"></td></tr>)
  			var rowId = "table_row_end"
		} else {
			var rowId = "table_row" + data['indexNumber']
		}

		//handlers ----------------------------
		var  editTimeHandler = (e) => {
			console.log('editTimeHandler')
			console.log(e)
			console.log(data)
			this.setData(data['indexNumber'],[['status','editTime']])//[['launchTime',[['status','']]],['landTime',[['status','']]]]
		}

		var editAllHandler = (e) => {
			console.log('editAllHandler')
			console.log(e)
			console.log(data)
			this.setData(data['indexNumber'],[['status','editAll']])
			this.scrollLogger()
			window.flightController.tableEditRecord(data)
			//this.deleteRecord(data['indexNumber'])
		}

		//helpers ----------------------------------
		var editHide = () => {
			if(data['status'] == 'editTime'){
	 			return " hideElement ";
	 		} else {
	 			return " showElement ";
	 		}
		}

		//constructors -----------------------------
		var buttons = () => {
			const returnElements = []
			
			var editTimes = false
			var deleteBu = false
			var editAll = false
			var goLogger = false

			switch(data['status']){
				case 'editTime':
					deleteBu = true
					editAll = true
					break;
				case 'editAll':
					editTimes = false
					deleteBu = false
					editAll = false
					goLogger = true
					break;
				case '':
					editTimes = true
					deleteBu = true
					editAll = true
					break;

			}

			var totalEditAll = this.checkForStatus('editAll') //Move to body function ??

			if(editTimes){
				returnElements.push(<Button key="editTimes" variant="outline-info" onClick={editTimeHandler}>Edit Times</Button>)
			}
			if(deleteBu){
				returnElements.push(<Button key="delete" variant="outline-danger" onClick={() => this.deleteRecord(data['indexNumber'])} >Delete</Button>)
			}
			if(editAll && !totalEditAll){
				returnElements.push(<Button key="editAll" variant="outline-info" onClick={editAllHandler}>Edit All</Button>)
			}
			if(goLogger){
				returnElements.push(<Button key="goLogger" variant="outline-info" onClick={this.scrollLogger}>Data in logger</Button>)
			}

			return (
				<ButtonGroup vertical>
					{returnElements}
				</ButtonGroup>
			);
		}

		

		const launchClock = 'M13 12l-.688-4h-.609l-.703 4c-.596.347-1 .984-1 1.723 0 1.104.896 2 2 2s2-.896 2-2c0-.739-.404-1.376-1-1.723zm-1-8c-5.522 0-10 4.477-10 10s4.478 10 10 10 10-4.477 10-10-4.478-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-2-19.819v-2.181h4v2.181c-1.438-.243-2.592-.238-4 0zm9.179 2.226l1.407-1.407 1.414 1.414-1.321 1.321c-.462-.484-.964-.926-1.5-1.328z'
		const landClock = 'M22 14c0 5.523-4.478 10-10 10s-10-4.477-10-10 4.478-10 10-10 10 4.477 10 10zm-2 0c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8 8-3.589 8-8zm-6-11.819v-2.181h-4v2.181c1.408-.238 2.562-.243 4 0zm6.679 3.554l1.321-1.321-1.414-1.414-1.407 1.407c.536.402 1.038.844 1.5 1.328zm-8.679 2.265v6h6c0-3.309-2.691-6-6-6z'

		return(
			<tr key = {data['indexNumber']} id={"tr" + data['indexNumber']}>
			<td><ul className = "td">
				<li>{data['indexNumber']}</li>
				<li>{data['flightNumber']}</li>
				</ul></td>
			<td><ul className = "td">
				<li>{data['aircraft']['registration']}</li>
				<li>{data['aircraft']['acName']}</li>
				</ul></td>
			<td><ul className = "td">
				<li>{data['p1']['username']}</li>
				<li>{data['p1']['fName']}</li>
				<li>{data['p1']['lName']}</li>
				</ul></td>
			<td><ul className = "td">
				<li>{data['p2']['username']}</li>
				<li>{data['p2']['fName']}</li>
				<li>{data['p2']['lName']}</li>
				</ul></td>
			<td style={{width:"300px"}}>
				{this.timeInput(data['indexNumber'],'launchTime','Launch Time',data['launchTime']['formatted'],'r',launchClock)}
				{this.timeInput(data['indexNumber'],'landTime','Land Time',data['landTime']['formatted'],'r',landClock)}
				<ul className = "td"><li className = {editHide()}>{data['flightTime']}</li>
				</ul></td>
			<td><ul className = "td">
				<li>{this.currencyFormat(data['launchFee'])}</li>
				<li>{this.currencyFormat(data['soaringFee'])}</li>
				<li>{this.currencyFormat(data['soaringTotal'])}</li>
				</ul></td>
			<td><ul className = "td">
				<li>{this.currencyFormat(data['total'])}</li>
				<li>{this.capitaliseFormat(data['payee'])}</li>
				</ul></td>
			<td>
				{buttons()}
				</td>
			</tr>
		);
	}

	body(tableData){
		const rows = [];
		var keys = Object.keys(tableData)
		keys.sort((a, b) => b - a)

		for(var key in keys){
			var row = this.row(tableData[keys[key]])
			rows.push(row)
		}
		rows.push(this.row())

		return (
			<tbody key="t1"id="tableBody">
			{rows}
			</tbody>
		);
	}


	componentWillUpdate(){
		console.log('will update')
	}

	render(){
		console.log('uio')
		return(
		<div className="table">
		<Table striped bordered hover size="sm">
			<thead>
				<tr>
					<th>#</th>
					<th>Aircraft</th>
					<th>P1</th>
					<th>P2</th>
					<th>Flight</th>
					<th colSpan="2">Fee</th>
					<th></th>
				</tr>
			</thead>
			{this.body(this.state.tableData)}
		</Table>
		</div>
		);
	}

	componentDidMount(){
		var addDataTable = this.addDataTable
		console.log('did mount')

		var getHandler = function(data){
    		console.log('exit get range:',data)
    		addDataTable(data)
  		}
  		console.log('run stop');
  		//this.flightController.tableReady(getHandler)
  		//this.database.getRecordAll('flights',getHandler);
  		//this.database.getRecordRange('flights',"flightNumber",[1,11],getRangeHandler);
	}
	
}

export default TableLog
