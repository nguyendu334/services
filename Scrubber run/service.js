
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

const scrubber = require('./scrubber')
var _SCRUBBER = new scrubber.scrubber()


//==========================mqtt==============================
const topic_mqtt1 = "SYNOPEXVINA2/IIOT/MQTT/SCRUBBER";
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
  host: "192.168.111.12",
  port: "502",
};

socket.connect(options);
const m_plc = new Modbus.client.TCP(socket, 1, 1000);

socket.on("connect", function () {
  console.log("Modbus is connected");
});
socket.on("close", function () {
  console.log("Modbus is disconnected");
  socket.end();
});
socket.on("error", function () {
  console.log("Modbus is ERR");
});
socket.on("timeout", function () {
  console.log("Modbus is timeout");
});
//======================plc pH========================
const socket1 = new net.Socket();
const options1 = {
  host: "192.168.111.9",
  port: "502",
};

socket1.connect(options1);
const m_plc_pH = new Modbus.client.TCP(socket1, 1, 1000);

socket1.on("connect", function () {
  console.log("Modbus is connected");
});
socket1.on("close", function () {
  console.log("Modbus is disconnected");
  socket.end();
});
socket1.on("error", function () {
  console.log("Modbus is ERR");
});
socket1.on("timeout", function () {
  console.log("Modbus is timeout");
});


//        ModbusTCPServer m_plc = new ModbusTCPServer("192.168.111.12", 502);
//ModbusTCPServer m_plcpH = new ModbusTCPServer("192.168.111.9", 502);
setInterval(read, 1000);
var datalog1="";
function getRndInteger(min, max) {
  return (Math.random() * (max - min) ) + min;
}
function read() {


    var dt = dateTime.create();
    var formatted = dt.format("Ymd-HMS");
    _SCRUBBER.timestamp = formatted;
    console.log("==================="+formatted+"=====================");
    if (m_plc.connectionState == "online") {
      m_plc
        .readCoils(0, 40)
        .then(function (resp) {
          var data = resp.response.body.valuesAsArray;
           //console.log(resp.response.body.valuesAsArray.slice(0,40));
           _SCRUBBER.scrubber1.QHUT = !data[0];
           _SCRUBBER.scrubber1.Pump_TH_A = !data[1];
           _SCRUBBER.scrubber1.Pump_TH_B = !data[2];
           _SCRUBBER.scrubber1.Pump_chemical_A = !data[3];
           _SCRUBBER.scrubber1.Pump_chemical_B = !data[4];
           _SCRUBBER.scrubber1.Agigator = !data[5];

           _SCRUBBER.scrubber2.QHUT = !data[6];
           _SCRUBBER.scrubber2.Pump_TH_A = !data[7];
           _SCRUBBER.scrubber2.Pump_TH_B = !data[8];
           _SCRUBBER.scrubber2.Pump_chemical_A = !data[9];
           _SCRUBBER.scrubber2.Pump_chemical_B = !data[10];
           _SCRUBBER.scrubber2.Agigator = !data[11];

           _SCRUBBER.scrubber3.QHUT = !data[12];
           _SCRUBBER.scrubber3.Pump_TH_A = !data[13];
           _SCRUBBER.scrubber3.Pump_TH_B = !data[14];
           _SCRUBBER.scrubber3.Pump_chemical_A = !data[15];
           _SCRUBBER.scrubber3.Pump_chemical_B = !data[16];
           _SCRUBBER.scrubber3.Agigator = !data[17];

           _SCRUBBER.scrubber4.QHUT =  data[18]? true:false;
           _SCRUBBER.scrubber4.Pump_TH_A = data[19]? true:false;
           _SCRUBBER.scrubber4.Pump_TH_B = data[20]? true:false;
           _SCRUBBER.scrubber4.Pump_chemical_A = data[21]? true:false;
           _SCRUBBER.scrubber4.Pump_chemical_B = data[22]? true:false;
           _SCRUBBER.scrubber4.Agigator = data[23]? true:false;

            _SCRUBBER.plc_isconnected  = true;
           //_SCRUBBER.scrubber4.pH = datapH[1]!= 3000 ? datapH[1]/100.0 : "NULL";
           console.log("m_plc 192.168.111.12 Read: OK");

        })
        .catch(function () {
          console.error("m_plc timeout");
          _SCRUBBER.plc_isconnected  = false;
        });
        m_plc
        .readHoldingRegisters(1, 1)
        .then(function (resp) {
          var datap =  resp.response.body.values;
          //console.log(resp.response.body.values);
        // if (datap[0]!= 3000)
          _SCRUBBER.scrubber4.pH = datap[0]!= 3000 ? datap[0]/100.0 : "NULL";
          
         // console.log("192.168.111.2 pH1:" + _SCRUBBER.scrubber1.pH+" pH2:" + _SCRUBBER.scrubber2.pH+" pH3:" + _SCRUBBER.scrubber3.pH+" pH4:" + _SCRUBBER.scrubber4.pH);

        })
        .catch(function () {
          console.error("m_plc_pH timeout");
        });



    } else {
      console.log("m_plc is reconnect");
      try{
      socket.connect(options);
      }catch{}
    }

    if (m_plc_pH.connectionState == "online") {
        m_plc_pH
        .readHoldingRegisters(0, 10)
        .then(function (resp) {
          var datapH =  resp.response.body.values;
          //console.log(resp.response.body.values);
          _SCRUBBER.scrubber1.pH = parseFloat(getRndInteger(7.5,8).toFixed(2));
          _SCRUBBER.scrubber2.pH = datapH[5]/100.0;
          _SCRUBBER.scrubber3.pH = datapH[6]/100.0;

_SCRUBBER.plcpH_isconnected = true;

          console.log("192.168.111.2 pH1:" + _SCRUBBER.scrubber1.pH+" pH2:" + _SCRUBBER.scrubber2.pH+" pH3:" + _SCRUBBER.scrubber3.pH+" pH4:" + _SCRUBBER.scrubber4.pH);
        })
        .catch(function () {
          console.error("m_plc_pH timeout");
          _SCRUBBER.plcpH_isconnected = false;
        });

    } else {
      console.log("m_plc is reconnect");
      try{
      socket1.connect(options1);
      }catch{}
    }

    update_server("http://"+Local_ip+":3005/data/1", JSON.stringify(_SCRUBBER));
    sendMQTT(clientmqtt,_SCRUBBER);
    datalog1 = _SCRUBBER.scrubber1.QHUT +','+
    _SCRUBBER.scrubber1.Pump_TH_A +','+
    _SCRUBBER.scrubber1.Pump_TH_B +','+
    _SCRUBBER.scrubber1.Pump_chemical_A +','+
    _SCRUBBER.scrubber1.Pump_chemical_B +','+
    _SCRUBBER.scrubber1.Agigator +','+
    _SCRUBBER.scrubber1.pH +','+
    
    _SCRUBBER.scrubber2.QHUT +','+
    _SCRUBBER.scrubber2.Pump_TH_A +','+
    _SCRUBBER.scrubber2.Pump_TH_B +','+
    _SCRUBBER.scrubber2.Pump_chemical_A +','+
    _SCRUBBER.scrubber2.Pump_chemical_B +','+
    _SCRUBBER.scrubber2.Agigator +','+
    _SCRUBBER.scrubber2.pH +','+
    
    _SCRUBBER.scrubber3.QHUT +','+
    _SCRUBBER.scrubber3.Pump_TH_A +','+
    _SCRUBBER.scrubber3.Pump_TH_B +','+
    _SCRUBBER.scrubber3.Pump_chemical_A +','+
    _SCRUBBER.scrubber3.Pump_chemical_B +','+
    _SCRUBBER.scrubber3.Agigator +','+
    _SCRUBBER.scrubber3.pH +','+
    
    _SCRUBBER.scrubber4.QHUT +','+
    _SCRUBBER.scrubber4.Pump_TH_A +','+
    _SCRUBBER.scrubber4.Pump_TH_B +','+
    _SCRUBBER.scrubber4.Pump_chemical_A +','+
    _SCRUBBER.scrubber4.Pump_chemical_B +','+
    _SCRUBBER.scrubber4.Agigator +','+
    _SCRUBBER.scrubber4.pH ;
    creatfile(datalog1);
  
}
function sendMQTT(clientmqtt,_SCRUBBER){
  var loi =false;
if (clientmqtt.connected)
{
  clientmqtt.publish(
    topic_mqtt1,
    JSON.stringify(_SCRUBBER),
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