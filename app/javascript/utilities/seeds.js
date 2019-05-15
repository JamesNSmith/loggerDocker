export const demoFlights = [{
            user:{id: 2, username: "jamesnsmith97"},//Info
            date:new Date("October 13, 2018 11:13:00").toISOString(), 
            club:{id: 2, name: "Logger Club"},

            aircraft:{id: 1, registration: "G-CUHJ", acName: "k13"},
            tug:{id: 2, registration: "G-CUGF", acName: "k13"},
        
            launchType:'winch',
            releaseHeight:2000,

            p1:{userId: 2, username: "jamesnsmith97", fName: "James", lName: "Smith", membershipId: 5,winchLaunchFee:7,soaringFee:0.6,aerotowStandardFee:20,aerotowUnitFee:5},
            p2:{userId: 1, username: "jamesnsmith", fName: "James", lName: "Smith", membershipId: 5,winchLaunchFee:7,soaringFee:0.6,aerotowStandardFee:20,aerotowUnitFee:5}
,

            payee:'p1',//payment
            aerotowStandardFee:20,//aerotow
            aerotowUnitFee:5,
            aerotowLaunchFee:20,
            winchLaunchFee:7, //winch
            soaringFee:0.6,
            launchTime:{formatted: new Date("October 13, 2018 11:13:00").toISOString(),input:'',status:''} ,//time
            landTime:{formatted: new Date("October 13, 2018 11:19:00").toISOString(),input:'',status:''},
            flightTime:10,
            soaringTotal:6,
            winchTotal:13,
            aerotowTotal:30
      }]

export const demoMemberships = {
      0:{membershipId:0,name:'Full', winchLaunchFee:7.00, soaringFee:0.3,aerotowStandardFee: 20, aerotowUnitFee: 5},
      1:{membershipId:1,name:'Junior', winchLaunchFee:4.50, soaringFee:0.15,aerotowStandardFee: 15, aerotowUnitFee: 2.5}
}

export const demoClubUsers = {
      0:{userId:0,username:'carlosBu',email: 'carlos@email.com', fName: 'Carlos', lName: 'Bueno',membershipId:0},
      1:{userId:1,username:'freidaBu',email: 'freida@email.com', fName: 'Frieda', lName: 'Bueno',membershipId:0},
      2:{userId:2,username:'julianBu',email: 'julian@email.com', fName: 'Julian', lName: 'Bueno',membershipId:1}

}

export const demoAircrafts = {
      0:{id:0,registration:'G-CUHJ', acName:'k13'},
      1:{id:1,registration:'G-CUGF', acName:'k13'},
      2:{id:2,registration:'G-CIOP', acName:'k8'},
      3:{id:3,registration:'G-CHYT', acName:'Puchacz'},
      4:{id:4,registration:'G-CIRC', acName:'k8'},
      5:{id:5,registration:'G-CHUV', acName:'Puchacz'}
      }

//export default flights

//{id: 2, username: "jamesnsmith97"}
//{id:'', registration: '', acName: ''}
//{userId:'',username:'',fName:'',lName:'',membershipId:'',launchFee:'',soaringFee:'',aerotowStandardFee:'',aerotowUnitFee:''}


/*{
      //indexNumber:1,
      tailNumber:'YUG',
      acName:'Puchacz',
      p1FName:'John',
      p1LName:'Smith',
      p2FName:'Jack',
      p2LName:'Bing',
      launchFee:'4.50',
      soaringFee:'0.15',
      p1Username:'',
      p2Username:'',
      launchTime:'',
      landTime:'',
      flightTime:'',
      soaringTotal:'',
      total:''
      },
*/