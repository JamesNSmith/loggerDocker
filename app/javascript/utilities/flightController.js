import Database from './indexedDB'

class FlightController {
  constructor(tag=null){

    window.flightController = this;
    window.flightControllerDependents = {};

    this.table = 'flights'
    this.mode = 'demo'
  }

//Helpers ---------------
  calculateTimeFees (record) {
    var twoDP = (num) => {
      return Math.round(num*100)/100
    }
    console.log('calculateTimeFees')
    console.log(record)
    var launchFee = parseFloat(record['launchFee'])
    var soaringFee = parseFloat(record['soaringFee'])

    console.log(record['launchTime']['formatted'])
    console.log(record['landTime']['formatted'])

    console.log(record['launchTime']['input'])
    console.log(record['landTime']['input'])

    var launchTime =  new Date(record['launchTime']['formatted']).setFullYear(2020, 11, 3) //dodgy fix -- needs :()
    var landTime =  new Date(record['landTime']['formatted']).setFullYear(2020, 11, 3) //dodgy fix -- needs :()
    console.log(landTime)
    console.log(launchTime)
    var flightTime = Math.floor(Math.abs((landTime - launchTime))/(1000*60)) //.getTime()
    console.log('flightTime: ' + flightTime)

    var soaringTotal = twoDP(flightTime * soaringFee);
    var total = launchFee + soaringTotal

    var returnVals = [['flightTime',flightTime],['soaringTotal',soaringTotal],['total',total]]
    console.log(returnVals)

    return {record,returnVals}
  }

// logger helpers --------------
  updateFees(inputData){
    if(inputData['launchTime'] != '' && inputData['landTime'] != ''){
      var updateVals = (this.calculateTimeFees(inputData))['returnVals']

      console.log(updateVals)

      for(var key in updateVals){
        inputData[updateVals[key][0]] = updateVals[key][1]
      }
    }

    console.log(inputData)
    return inputData
  }

//Logger ---------
  addFromLogger(inputData){
    console.log('addFromLogger')

    var database = window.flightControllerDependents['database']
    var table = window.flightControllerDependents['table']
    var addDataTable = database.addDataTable
    var index

    console.log('inputData:')
    console.log(inputData)

    var countHandler = (result) => {
      index = result+1
      inputData['indexNumber'] = index
      inputData['flightNumber'] = null
      console.log('inpData')
      console.log(inputData)
      database.addData('flights',[inputData]) //-----------dodgy
      table.addDataTable([inputData])
    }
  	
	  database.countRecords('flights',countHandler);

  }

  updateFromLogger(inputData){
    console.log('updateFromLogger')

    var database = window.flightControllerDependents['database']
    var table = window.flightControllerDependents['table']

    if(inputData['launchTime']['formatted'] != '' && inputData['landTime']['formatted'] != ''){
      var updatedData = this.updateFees(inputData)
    } else {
      var updatedData = inputData
    }

    database.updateRecordRow('flights',updatedData) // -------------dodgy
    table.updateDataRow(updatedData)

    //cable.updateDataRow(updatedDate)
  }

//Table helpers ------------------------
  populateObject(object,columnValue){
    for(var key in columnValue){
      console.log(columnValue[key])
      object[columnValue[key][0]] = columnValue[key][1]
    }
   
    return object
  }

  

//table handlers -----------------------

  tableProcessDatabaseData(returnData,resolve,reject) {
    console.log('processDatabaseData')
    console.log(returnData)

    if(returnData['error'] == null){
      resolve([['flightNumber',returnData['flightNumber']]])
    } else {
      reject(returnData['error'])
    }

  }

  tableUpdateTime(indexTable,id,name,time){
    var database = window.flightControllerDependents['database'];
    var table = window.flightControllerDependents['table']
    var cable = window.flightControllerDependents['cable']
    
    console.log('tableUpdate')
    console.log(table)

    var timeUpdatedRecord = {}
    var timeUpdatedValues = []
    var databaseIndex = []

    var queue = new Promise((resolve,reject) => {
      database.updateRecordValues(indexTable,id,[[name,[['formatted',time]]]],resolve,reject)

    }).then(() => {
      return new Promise((resolve,reject) => {table.updateCheckStatus(id,name,resolve,reject)})

    }).then((status) => {
      return new Promise((resolve,reject) => {if(status){resolve()} else {console.log('exit due time')}})

    }).then(() => {
      return new Promise((resolve,reject) => {database.getRecord(indexTable,id,resolve,reject)})

    }).then((record) => {
      return this.calculateTimeFees(record)

    }).then(({record,returnVals}) => {
      timeUpdatedRecord = this.populateObject(record,returnVals)
      timeUpdatedValues = returnVals

    }).then(() => {
      return new Promise((resolve,reject) => {database.updateRecordValues(indexTable,id,timeUpdatedValues,resolve,reject)})

    }).then((index) => {
      return new Promise((resolve,reject) => {table.updateTableData(id,timeUpdatedValues,resolve,reject)})

    }).then((status) => {
      return new Promise((resolve,reject) => {if(this.mode == 'demo'){console.log('exit due mode')} else {resolve()}})

    }).then(() => {
      return new Promise((resolve,reject) => {cable.add('flightInsert',timeUpdatedRecord,resolve,reject)})

    }).then((response) => {
      return new Promise((resolve,reject) => {this.tableProcessDatabaseData(response,resolve,reject)})

    }).then((returnVals) => {
      databaseIndex = returnVals

    }).then(() => {
      return new Promise((resolve,reject) => {database.updateRecordValues(indexTable,id,databaseIndex,resolve,reject)})

    }).then((index) => {
      return new Promise((resolve,reject) => {table.updateTableData(id,databaseIndex,resolve,reject)})

    }).catch((error) => {
      console.log('tableUpdateTime queue failed:')
      console.log(error)

    })
  }

  tableDeleteRecord(index,flightNumber){
    var database = window.flightControllerDependents['database'];

    database.deleteData('flights',index)

    //cable.delete(flightNumber)
  }

  tableEditRecord(data){
    var logger =  window.flightControllerDependents['logger']

    logger.importEditData(data)
  }

//this ---------------------------------
  ready(){
  	var database = window.flightControllerDependents['database']
  	var table = window.flightControllerDependents['table']
  	var cable = window.flightControllerDependents['cable']

  	var databaseGet = function(data){
    	console.log('exit get range:',data)
    	table.addDataTable(data)
  	}

  	database.getRecordAll('flights',databaseGet);

  	var cableGet = function(data){
  		console.log('cableGet')
  		console.log(data)
  		database.addData('flights',data,databaseGet)
  		//table.addDataTable(data)
  	}

    if(this.mode != 'demo'){
  	  var queue = new Promise((resolve,reject) => {cable.ready(resolve,reject)})
      .then(() => {cable.get('all',cableGet)})
    }

  	//cable.ready()
  	//cable.get('all',cableGet)
  }

  delete(){
  	console.log('delete')
  	//delete FlightController.dependents
  	delete  window.flightControllerDependents
  }
}

export default FlightController