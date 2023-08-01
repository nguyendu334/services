
//jslint node: true 
"use strict";

//import "./scrubber.js"
const Modbus = require("hieunv_inductrial_protocol");
const net = require("net");
var dateTime = require("hieunv_inductrial_protocol/dist/node-datetime");
const jsonServer = require("json-server");
var fs = require("fs");
var XMLHttpRequest = require("hieunv_inductrial_protocol/dist/xhr2");
const mqtt = require("mqtt");
var Local_ip='127.0.0.1';
const pathlog = 'Logfile/';
var timehientai1=0;
//var sleep = require('system-sleep');

/*const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};*/

const SMT = require('./SMT')
var _SMTMACHINE = new SMT.SMTMACHINE()
//const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

//==========================mqtt==============================
const topic_mqtt1 = "SYNOPEXVINA2/IIOT/MQTT/SMT2";
var MQTT_CLIENT_ID =
  "iot_web_" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
const connectUrl = "mqtt://broker.hivemq.com:1883";
const optionsmqtt = {
  clientId: MQTT_CLIENT_ID,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};
const clientmqtt = mqtt.connect(connectUrl, optionsmqtt);
clientmqtt.on("connect", () => {
  console.log("mqtt connected!!!");
});
clientmqtt.on("disconnect", () => {
  console.error("mqtt disconnect");
});
clientmqtt.on("error", () => {
  console.error("mqtt error");
});
clientmqtt.on("close", () => {
  console.error("mqtt close");
});
//========================================================
//================plc scrubber=============
const socket = new net.Socket();
const options = {
 // host: "192.168.111.21",
 host:"127.0.0.1",
  port: "502",
};

socket.connect(options);
const SECSIONRP1_7 = new Modbus.client.RTUoverTCP(socket, 2, 2000);

socket.on("connect", function () {
  console.log("SECSIONRP1_7 is connected");
});
socket.on("close", function () {
  console.log("SECSIONRP1_7 is disconnected");
  socket.end();
});
socket.on("error", function () {
  console.log("SECSIONRP1_7 is ERR");
});
socket.on("timeout", function () {
  console.log("SECSIONRP1_7 is timeout");
});
//======================plc pH========================
const socket1 = new net.Socket();
const options1 = {
  host: "192.168.111.25",
  port: "502",
};

socket1.connect(options1);
const SECSIONRP8_16 = new Modbus.client.RTUoverTCP(socket1, 1, 1000);
socket1.on("connect", function () {
  console.log("SECSIONRP8_16 is connected");
});
socket1.on("close", function () {
  console.log("SECSIONRP8_16 is disconnected");
  socket.end();
});
socket1.on("error", function () {
  console.log("SECSIONRP8_16 is ERR");
});
socket1.on("timeout", function () {
  console.log("SECSIONRP8_16 is timeout");
});
//================ex scrubber=============
const socket2 = new net.Socket();
const options2 = {
  host: "192.168.111.26",
  port: "502",
};

socket2.connect(options2);
const SECSIONREXHAUT = new Modbus.client.TCP(socket2, 1, 1000);

socket2.on("connect", function () {
  console.log("SECSIONREXHAUT is connected");
});
socket2.on("close", function () {
  console.log("SECSIONREXHAUT is disconnected");
  socket.end();
});
socket2.on("error", function () {
  console.log("SECSIONREXHAUT is ERR");
});
socket2.on("timeout", function () {
  console.log("SECSIONREXHAUT is timeout");
});
//======================plc pH========================

//        ModbusTCPServer m_plc = new ModbusTCPServer("192.168.111.12", 502);
//ModbusTCPServer m_plcpH = new ModbusTCPServer("192.168.111.9", 502);
//setInterval(plc1, 2000);
//setInterval(plc3, 20000);
//setInterval(plc2, 200);
var datalog1="";
var id =0;
var id_plc2 = 0;
 function plc1() {


  var dt = dateTime.create();
  var formatted = dt.format("Ymd-HMS");
  _SMTMACHINE.timestamp = formatted;
  

console.log("==================="+formatted+"=====================");

 DATA_SMT(SECSIONRP1_7,8,'4x',9,'4x',_SMTMACHINE.SMTMACHINE1,socket,options);
 DATA_SMT(SECSIONRP1_7,7,'4x',10,'4x',_SMTMACHINE.SMTMACHINE2,socket,options);
 DATA_SMT(SECSIONRP1_7,6,'4x',11,'4x',_SMTMACHINE.SMTMACHINE3,socket,options);
 DATA_SMT(SECSIONRP1_7,5,'4x',12,'4x',_SMTMACHINE.SMTMACHINE4,socket,options);
 DATA_SMT(SECSIONRP1_7,4,'4x',13,'4x',_SMTMACHINE.SMTMACHINE5,socket,options);
 DATA_SMT(SECSIONRP1_7,3,'4x',14,'4x',_SMTMACHINE.SMTMACHINE6,socket,options);
 DATA_SMT(SECSIONRP1_7,1,'4x',15,'4x',_SMTMACHINE.SMTMACHINE7,socket,options);
}
function plc2() {
  DATA_SMT(SECSIONRP8_16,1,'4x',10,'4x',_SMTMACHINE.SMTMACHINE8,socket1,options1);
  DATA_SMT(SECSIONRP8_16,2,'4x',11,'4x',_SMTMACHINE.SMTMACHINE9,socket1,options1);
  DATA_SMT(SECSIONRP8_16,3,'4x',12,'4x',_SMTMACHINE.SMTMACHINE10,socket1,options1);
  DATA_SMT(SECSIONRP8_16,4,'4x',13,'4x',_SMTMACHINE.SMTMACHINE11,socket1,options1);
  DATA_SMT(SECSIONRP8_16,5,'4x',14,'4x',_SMTMACHINE.SMTMACHINE12,socket1,options1);
  DATA_SMT(SECSIONRP8_16,6,'4x',15,'4x',_SMTMACHINE.SMTMACHINE13,socket1,options1);
  DATA_SMT(SECSIONRP8_16,7,'4x',16,'4x',_SMTMACHINE.SMTMACHINE14,socket1,options1);
  DATA_SMT(SECSIONRP8_16,8,'4x',17,'4x',_SMTMACHINE.SMTMACHINE15,socket1,options1);
  DATA_SMT(SECSIONRP8_16,9,'4x',18,'4x',_SMTMACHINE.SMTMACHINE16,socket1,options1);
}



    

  function plc3(){  

//=================

//SECSIONRP1_7._slaveId =2;
//SECSIONRP1_7._unitId = 2;
if (SECSIONREXHAUT.connectionState == "online") {
  SECSIONREXHAUT
    .readCoils(0, 3)
    .then(function (resp) {
      var data = resp.response.body.valuesAsArray;
      
       _SMTMACHINE.EXHAUFAN1.RUNNING = data[0]? true:false;
       _SMTMACHINE.EXHAUFAN2.RUNNING = data[1]? true:false;
       _SMTMACHINE.EXHAUFAN3.RUNNING = data[2]? true:false;

        _SMTMACHINE.Exhaufan_isconnected  = true;
       console.log("EXHAUFAN 192.168.111.26 Read: OK");

    })
    .catch(function () {
      console.error("EXHAUFAN timeout");
      _SMTMACHINE.Exhaufan_isconnected  = false;
    });
  } else {
    console.log("EXHAUFAN3 is reconnect");
    try{
    socket2.connect(options2);
    }catch{}
  }
}
async function READDATAREFLOW(session,ID_reflow,fun1,SMT)
{
session._requestHandler._address = ID_reflow;
session._slaveId =ID_reflow;
session._unitId =ID_reflow;
  if (fun1=='4x')
    {
    await  session
      .readHoldingRegisters(1,1)
      .then(function (resp) {
        var datapH =  resp.response.body.values;
        SMT.REFLOW = datapH[0]/10.0;
        SMT.REFLOW_ISCONNECTED = true;
      })
      .catch(function () {
        SMT.REFLOW_ISCONNECTED = false;
      });

    }
    else
    {
      session
      .readInputRegisters(1000,1)
      .then(function (resp) {
        var datapH =  resp.response.body.values;
        SMT.REFLOW = datapH[0]/10.0;
        SMT.REFLOW_ISCONNECTED = true;
      })
      .catch(function () {
        SMT.REFLOW_ISCONNECTED = false;
      });
    }
}
 function READDATAPRINTER(session,ID_reflow,fun1,SMT)
{
session._requestHandler._address = ID_reflow;
session._slaveId =ID_reflow;
session._unitId =ID_reflow;
  if (fun1=='4x')
    {
      session
      .readHoldingRegisters(1,1)
      .then(function (resp) {
        var datapH =  resp.response.body.values;
        SMT.PRINTER = datapH[0]/10.0;
        SMT.PRINTER_ISCONNECTED = true;
      })
      .catch(function () {
        SMT.PRINTER_ISCONNECTED = false;
      });

    }
    else
    {
      session
      .readInputRegisters(1000,1)
      .then(function (resp) {
        var datapH =  resp.response.body.values;
        SMT.PRINTER = datapH[0]/10.0;
        SMT.PRINTER_ISCONNECTED = true;
      })
      .catch(function () {
        SMT.PRINTER_ISCONNECTED = false;
      });
    }
}
 function DATA_SMT(session, ID_reflow, fun1,  ID_printer, fun2, SMT, socket, options)
{
  if (session.connectionState == "online") {
     READDATAREFLOW(session,ID_reflow,fun1,SMT);
    
     READDATAPRINTER(session,ID_printer, fun2, SMT);
    console.log(SMT.toString() +SMT.REFLOW+" "+SMT.PRINTER);
  } else {
    console.log("m_plc is reconnect");
    try{
   // socket.connect(options);
    }catch{}
  }


}





function sendMQTT(clientmqtt,_SMTMACHINE){
  var loi =false;
if (clientmqtt.connected)
{
  clientmqtt.publish(
    topic_mqtt1,
    JSON.stringify(_SMTMACHINE),
    { qos: 0, retain: true },
    (error) => {
      if (error) {
        console.error(error);
        loi = true;
      }
      
    }
  );
  if (!loi)
      {
        console.log("mqtt send OK");
      }
      else
      console.log("mqtt send NG");
  }
}

  function creatfile(datalog1) {
    var title =
    "DATE,TIME," +
    "L1QuatHut,"+
    "L1PumpTH_A,"+
    "L1PumpTH_B,"+
    "L1PumpChemical_A,"+
    "L1PumpChemical_B,"+
   "L1AGIGATOR,"+
    "L1pH,"+

      "L2QuatHut,"+
      "L2PumpTH_A,"+
      "L2PumpTH_B,"+
      "L2PumpChemical_A,"+
      "L2PumpChemical_B,"+
      "L2AGIGATOR,"+
      "L2pH,"+

        "L3QuatHut,"+
        "L3PumpTH_A,"+
        "L3PumpTH_B,"+
        "L3PumpChemical_A,"+
        "L3PumpChemical_B,"+
        "L3AGIGATOR,"+
        "L3pH,"+

          "L4QuatHut,"+
          "L4PumpTH_A,"+
          "L4PumpTH_B,"+
          "L4PumpChemical_A,"+
          "L4PumpChemical_B,"+
          "L4AGIGATOR,"+
          "L4pH";
    
    var dt = dateTime.create();
    var formatted = dt.format("Ymd");
    var _date = dt.format("Y/m/d");
    var _time = dt.format("H:M:S");
    //const path_Event = pathlog + "/HVAC_Event_LOG_" + formatted + ".csv";
    const path_checksheet1 = pathlog + "/HVAC1_Checksheet_LOG_" + formatted + ".csv";
    //if (datalog1 != '0,0,0,0,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false') {
      if (timehientai1 != dt.format("H")) {
      try {
        if (fs.existsSync(path_checksheet1)) {
        //file exists
        } else {
        fs.appendFile(path_checksheet1, title + "\r\n", function (err) {
          if (err) throw err;
          //console.log('Saved!');
        });
        }
        fs.appendFile(
        path_checksheet1,
        "'" + _date + "," + "'" + _time + "," + datalog1 + "\r\n",
        function (err) {
          // if (err) throw err;
          //console.log('Saved!');
        }
        );
        timehientai1 = dt.format("H");
      } catch (err) {
        console.error(err);
      }
    }
    }
    
  function update_server(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url); //PATCH//POST
    
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
      // console.log(xhr.status);
      // console.log(xhr.responseText);
      }
    };
    
    //var data = '{"abc":"sdfsdf"}';
    
    xhr.send(data);
    }
    function httpserver(port, db) {
    // server.js
    const jsonServer = require("json-server");
    const server = jsonServer.create();
    const router = jsonServer.router(db);
    const middlewares = jsonServer.defaults();
    
    server.use(middlewares);
    server.use(router);
    server.listen(port, () => {
      console.log("JSON Server is running");
    });
    }
    httpserver(3005, "db.json");



    //===========
    // list of meter's id
const metersIdList = [10, 11, 12, 13, 14];

const getMetersValue = async (id) => {
    try{
        // get value of all meters
       // for(let meter of meters) {
            // output value to console
            console.log(await getMeterValue(id));
            // wait 100ms before get another device
            await sleep(100);
//	}
    } catch(e){
        // if error, handle them here (it should not)
        console.log(e)
    } finally {
        // after get all data from salve repeate it again
        setImmediate(() => {
            getMetersValue(id);
        })
    }
}

const getMeterValue = async (id) => {
    try {
        // set ID of slave
      //  await SECSIONRP1_7.setID(id);
      SECSIONRP1_7._requestHandler._address = id;
      SECSIONRP1_7._slaveId =id;
      SECSIONRP1_7._unitId =id;
        // read the 1 registers starting at address 0 (first register)
        if (SECSIONRP1_7.connectionState == "online") {
        let val =  await SECSIONRP1_7.readInputRegisters(1, 1);
        // return the value
        return val.data[0];
        }
        return 0;
    } catch(e){
        // if error return -1
        return -1
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// start get value
getMetersValue(1);
getMetersValue(2);
getMetersValue(3);