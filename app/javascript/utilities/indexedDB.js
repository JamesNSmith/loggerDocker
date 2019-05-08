import flights from './seeds'
import FlightController from './flightController'

/*
class Flights extends Database {
	static constructor(){
		super('flightLogger')

	}
}
*/

class Database {
//Constructors -----------------------------
  constructor(dbName){
    this.start = this.start.bind(this);

    this.dbName = dbName;
    this.version = 1;
    this.count = 0;

    window.flightControllerDependents['database'] = this
    
    if (!('indexedDB' in window)) { //!window.indexedDB
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }

    var queue = new Promise((resolve,reject) => {this.deleteDatabase(resolve,reject)})
    .then(() => {return new Promise((resolve,reject) => {this.start(resolve,reject)})})
    .then(() => {return new Promise((resolve,reject) => {this.addData('flights',flights,resolve,reject)})})
    .then(() => {window.flightController.ready()})
    .catch(() => {console.log('queue error')})
    
  }

  start(successHandler = this.success,failureHandler = this.failure){
    console.log('start')
  	
    var openRequest = indexedDB.open(this.dbName, this.version);

    console.log('start b')
    console.log(openRequest)
    openRequest.onupgradeneeded = function(e) { //upgrading the database version number??
      var db = e.target.result;
      console.log('running onupgradeneeded');

      if (!db.objectStoreNames.contains('flights')) {
        console.log('new flights')
        var flightsOS = db.createObjectStore('flights', {keyPath: 'indexNumber', autoIncrement: true});
        flightsOS.createIndex("indexNumber", "indexNumber", { unique: true });
        flightsOS.createIndex("flightNumber", "flightNumber", { unique: true });
        
      }
    };

    openRequest.onsuccess = function(e) {
      console.log('running onsuccess 1');

      e.target.result.close();
      successHandler()
    };

    openRequest.onerror = function(e) {
      console.log('onerror! start');
      
      e.target.result.close();
      failureHandler()
    }; 

    console.log(openRequest)
  }
//Placeholders ------------------------------
  success(data = 'yes'){
    console.log('success:')
    console.log(data)
  }

  failure(data = 'no'){
    console.log('failure:')
    console.log(data)
  }
//coms -------------------------------------
  message(){
    console.log('database')
  }

// Count ---------------------
  countRecords(table,successHandler = this.success){ 
    var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
      var db = e.target.result;
      var transaction = db.transaction([table], 'readwrite');
      var records = transaction.objectStore(table);

      var request = records.count();
      request.onsuccess = function(ev) {
        successHandler(request.result);
        e.target.result.close();
      };
      request.onerror = function(ev) {
        console.log('Error', e.target.error.name);
        e.target.result.close();
      };
    }

    openRequest.onerror = function(e) {
      console.log('onerror! count');
      e.target.result.close();
    };
  }

  /*deleteTable(table) {
    var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
       console.log('running onsuccess delete');
       var db = e.target.result;
    -> db.deleteObjectStore(table);

    }

    openRequest.onerror = function(e) {
      console.log('onerror! delete table');

      var db = e.target.result;
      db.close();
    };
  }
  */
// Delete ------------------------
  deleteDatabase(successHandler = this.success,failureHandler = this.failure){
    var deleteRequest = indexedDB.deleteDatabase(this.dbName);
    deleteRequest.onsuccess = function () {
      console.log("Deleted database successfully");
      successHandler()
    };
    deleteRequest.onerror = function () {
      console.log("Couldn't delete database");
      failureHandler()
    };
    deleteRequest.onblocked = function () {
      console.log("Couldn't delete database due to the operation being blocked");
      failureHandler()
    };
  }

  deleteData(table,id,successHandler = this.success,failureHandler = this.failure){
    var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
      console.log('running onsuccess delete');

      var db = e.target.result;
      var transaction = db.transaction([table], 'readwrite');
      var records = transaction.objectStore(table);

      var request = records.delete(id);
      request.onsuccess = function(ev) {
        console.log('Woot! Did it -delete');
        e.target.result.close();
        successHandler()
      };
      request.onerror = function(ev) {
        console.log('Error', ev.target.error.name);
        e.target.result.close();
        failureHandler(ev.target.error.name)
      };
    }

    openRequest.onerror = function(e) {
      console.log('onerror! add');
      e.target.result.close();
      failureHandler(e.target.error.name)
    };
  }
//Add -------------------------
  addData(table,data,successHandler = this.success,failureHandler = this.failure) {
    var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
      console.log('running onsuccess 2');

      var db = e.target.result;
      var transaction = db.transaction([table], 'readwrite');
      var records = transaction.objectStore(table);

      var inpCount = 0
      for(var count=0;count<data.length;count++){
      	var request = records.add(data[count]);

        console.log(data[count])
        console.log(request)
      	
      	request.onsuccess = function(ev) {
        	console.log('Woot! Did it -add');
          data[inpCount]['indexNumber'] = ev.target.result;

          inpCount += 1

        	if(inpCount == data.length){
        		e.target.result.close();
            successHandler(data)
        	}
      	};
      	request.onerror = function(ev) {
        	console.log('Error', ev.target.error);
        	e.target.result.close();
          failureHandler()
      	};
  	  }
    }

    openRequest.onerror = function(e) {
      console.log('onerror! add');
      e.target.result.close();
      failureHandler()
    };
  }
//Update -----------------
  updateRecordRow(table,record,successHandler = this.success,failureHandler = this.failure){
    var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
      console.log('running onsuccess 3');
      console.log(table)
      var db = e.target.result;
      var transaction = db.transaction([table], 'readwrite');
      var records = transaction.objectStore(table);

      var request = records.put(record);
      console.dir(records)
      request.onsuccess = function(ev) {
        console.log('Woot! Did it -update row');

        var record = request.result;
        console.log(record)
        successHandler(record)

      };
      request.onerror = function(ev) {
        e.target.result.close();
        failureHandler(ev.target.error.name)
      };   
    }

    openRequest.onerror = function(e) {
      e.target.result.close();
      console.log('onerror! get');
      failureHandler(e.target.error.name);

    };
  }
  updateRecordValues(table,id,columnValue,successHandler = this.success,failureHandler = this.failure){
    var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
      console.log('running onsuccess 3');
      console.log(table)
      var db = e.target.result;
      var transaction = db.transaction([table], 'readwrite');
      var records = transaction.objectStore(table);

      var request = records.get(id);
      console.dir(records)
      request.onsuccess = function(ev) {
        console.log('Woot! Did it -update');

        var record = request.result;
        console.log(record)
        for(var key in columnValue){

          if(typeof columnValue[key][1] == 'object'){
            var tierTwo = record[columnValue[key][0]]
            var objTwo = columnValue[key][1]

            for(var keyTwo in objTwo){
              tierTwo[objTwo[keyTwo][0]] = objTwo[keyTwo][1]
            }
            record[columnValue[key][0]] = tierTwo

          } else {
            record[columnValue[key][0]] = columnValue[key][1]
          }
        }

        var requestUpdate = records.put(record);
        requestUpdate.onsuccess = function(event){
          e.target.result.close();

          successHandler(requestUpdate.result);
        }

        requestUpdate.onerror = function(event){
          e.target.result.close();
          failureHandler(event.target.error.name)
        }

      };
      request.onerror = function(ev) {
        e.target.result.close();
        failureHandler(ev.target.error.name)
      };   
    }

    openRequest.onerror = function(e) {
      e.target.result.close();
      console.log('onerror! get');
      failureHandler(e.target.error.name);
    };
  }
//Get ----------------------------
  getRecord(table,id,successHandler = this.success,failureHandler = this.failure) {
    var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
      console.log('running onsuccess 2');

      var db = e.target.result;
      var transaction = db.transaction([table], 'readwrite');
      var records = transaction.objectStore(table);

      var request = records.get(id);
      request.onsuccess = function(ev) {
        console.log('Woot! Did it -get');
        e.target.result.close();

        successHandler(request.result);
      };
      request.onerror = function(ev) {
        console.log('Error', ev.target.error.name);
        e.target.result.close();

        //fail
      };   
    }

    openRequest.onerror = function(e) {
      console.log('onerror! get');
      console.dir(e);

      e.target.result.close();
    };
  }

  getRecordRange(table,column,range,successHandler){ //Range:[lower,upper]
    var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
      console.log('running onsuccess 3');

      var db = e.target.result;
      var transaction = db.transaction([table], 'readwrite');
      var records = transaction.objectStore(table);
      var index = records.index(column);

      var boundKeyRange = IDBKeyRange.bound(range[0],range[1], false, false);
      var request = index.openCursor(boundKeyRange); //"prev"

      var data = []
      request.onsuccess = function(ev){
        var cursor = event.target.result;

        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        }
        else {
          e.target.result.close();
          successHandler(data);
        }
      }

      request.onerror = function(ev){
        console.log('onerror! getRecordRange request');
        console.dir(e);

        e.target.result.close();
      }   
    }

    openRequest.onerror = function(e) {
      console.log('onerror! getRecordRange');
      console.dir(e);

      e.target.result.close();
    };
  }

  getRecordAll(table,successHandler){
  	var openRequest = indexedDB.open(this.dbName, this.version);

    openRequest.onsuccess = function(e) {
      console.log('running onsuccess 2');

      var db = e.target.result;
      var transaction = db.transaction([table], 'readwrite');
      var records = transaction.objectStore(table);

      var request = records.getAll();
      request.onsuccess = function(ev) {
        console.log('Woot! Did it -getAll');
        e.target.result.close();

        successHandler(request.result);
      };
      request.onerror = function(ev) {
        console.log('Error', ev.target.error.name);
        e.target.result.close();

        //fail
      };   
    }

    openRequest.onerror = function(e) {
      console.log('onerror! get');
      console.dir(e);

      e.target.result.close();
    };
  }
}


export default Database
