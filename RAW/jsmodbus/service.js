// create a tcp modbus client
//npm install jsmodbus
//npm install -g mocha
//npm i node-datetime
const mqtt = require('mqtt');
const jsonServer = require("json-server");
const Enum = require("enum");
var XMLHttpRequest = require("xhr2");
var dateTime = require("node-datetime");
var fs = require("fs");
const Modbus = require("jsmodbus");
const net = require("net");
const { timeStamp } = require("console");
const socket = new net.Socket();
const options = {
  host: "192.168.123.10",
  port: "502",
};
const myEnum = new Enum({
  _Manu_auto: 0,
  _Service: 1,
  _BW: 2,
  _LS1_LL_RAW_WATER_TANK: 3,
  _LS1_L_RAW_WATER_TANK: 4,
  _LS1_H_RAW_WATER_TANK: 5,
  _LS1_HH_RAW_WATER_TANK: 6,
  _LS2_LL_TREATED_WATER_TANK: 7,
  _LS2_L_TREATED_WATER_TANK: 8,
  _LS2_H_TREATED_WATER_TANK: 9,
  _LS2_HH_TREATED_WATER_TANK: 10,
  _Select_A: 11,
  _Select_B: 12,
  _SP_01A_F_SERVICE_PUMP: 13,
  _SP_01A_Run_SERVICE_PUMP: 14,
  _SP_01B_F_SERVICE_PUMP: 15,
  _SP_01B_Run_SERVICE_PUMP: 16,
  _SP_01C_F_SERVICE_PUMP: 17,
  _SP_01C_Run_SERVICE_PUMP: 18,
  _BP_01A_F_NaCl_PUMP: 19,
  _BP_01A_Run_NaCl_PUMP: 20,
  _BP_01B_F_NaCl_PUMP: 21,
  _BP_01B_Run_NaCl_PUMP: 22,
  _NP_01A_F_BACK_WASH_PUMP: 23,
  _NP_01A_RUN_BACK_WASH_PUMP: 24,
  _NP_01B_F_BACK_WASH_PUMP: 25,
  _NP_01B_RUN_BACK_WASH_PUMP: 26,
  _Backwash_BIRM_1: 27,
  _Rinse_BIRM_1: 28,
  _Backwash_BIRM_2: 29,
  _Settling_BIRM_2: 30,
  _Rinse_BIRM_2: 31,
  _Backwash_AC_FILTER: 32,
  _Settling_AC_FILTER: 33,
  _Rinse_AC_FILTER: 34,
  _Backwash_SOFTENER: 35,
  _Settling_SOFTENER: 36,
  _Chemical_Injection_SOFTENER: 37,
  _Displacement_SOFTENER: 38,
  _Rinse_SOFTENER: 39,
  _F07A: 40,
  _BSVA: 41,
  _08A_BIRM_A1: 42,
  _01A_BIRM_A1: 43,
  _03A_BIRM_A1: 44,
  _06A_BIRM_A1: 45,
  _04A_BIRM_A1: 46,
  _02A_BIRM_A1: 47,
  _05A_BIRM_A1: 48,
  _08A_BIRM_A2: 49,
  _01A_BIRM_A2: 50,
  _03A_BIRM_A2: 51,
  _06A_BIRM_A2: 52,
  _04A_BIRM_A2: 53,
  _02A_BIRM_A2: 54,
  _05A_BIRM_A2: 55,
  _08A_AC_FILTER_A: 56,
  _01A_AC_FILTER_A: 57,
  _03A_AC_FILTER_A: 58,
  _06A_AC_FILTER_A: 59,
  _04A_AC_FILTER_A: 60,
  _02A_AC_FILTER_A: 61,
  _05A_AC_FILTER_A: 62,
  _08A_SOFTENER_A: 63,
  _01A_SOFTENER_A: 64,
  _03A_SOFTENER_A: 65,
  _06A_SOFTENER_A: 66,
  _04A_SOFTENER_A: 67,
  _02A_SOFTENER_A: 68,
  _05A_SOFTENER_A: 69,
  _07A: 70,
  _F07B: 71,
  _BSVB: 72,
  _08B_BIRM_B1: 73,
  _01B_BIRM_B1: 74,
  _03B_BIRM_B1: 75,
  _06B_BIRM_B1: 76,
  _04B_BIRM_B1: 77,
  _02B_BIRM_B1: 78,
  _05B_BIRM_B1: 79,
  _08B_BIRM_B2: 80,
  _01B_BIRM_B2: 81,
  _03B_BIRM_B2: 82,
  _06B_BIRM_B2: 83,
  _04B_BIRM_B2: 84,
  _02B_BIRM_B2: 85,
  _05B_BIRM_B2: 86,
  _08B_AC_FILTER_B: 87,
  _01B_AC_FILTER_B: 88,
  _03B_AC_FILTER_B: 89,
  _06B_AC_FILTER_B: 90,
  _04B_AC_FILTER_B: 91,
  _02B_AC_FILTER_B: 92,
  _05B_AC_FILTER_B: 93,
  _08B_SOFTENER_B: 94,
  _01B_SOFTENER_B: 95,
  _03B_SOFTENER_B: 96,
  _06B_SOFTENER_B: 97,
  _04B_SOFTENER_B: 98,
  _02B_SOFTENER_B: 99,
  _05B_SOFTENER_B: 100,
  _07B: 101,
  _TO_WWT_BIRM_A1: 102,
  _TO_WWT_BIRM_A2: 103,
  _TO_WWT_AC_FILTER_A: 104,
  _TO_WWT_SOFTENER_A: 105,
  _TO_WWT_BIRM_B1: 106,
  _TO_WWT_BIRM_B2: 107,
  _TO_WWT_AC_FILTER_B: 108,
  _TO_WWT_SOFTENER_B: 109,
});

const myEnum_Word = new Enum({
  RunningAh: 0,
  RunningAmin: 1,
  RunningBh: 2,
  RunningBmin: 3,
  TimeAutoA: 4,
  TimeAutoB: 5,
  ProgressBIRM1Backwash: 6,
  ProgressBIRM1Rinse: 7,
  ProgressBIRM2Backwash: 8,
  ProgressBIRM2Settling: 9,
  ProgressBIRM2Rinse: 10,
  ProgressACFILTERBackwash: 11,
  ProgressACFILTERSettling: 12,
  ProgressSOFTENERBackwash: 13,
  ProgressSOFTENERSettling: 14,
  ProgressSOFTENERRinse: 15,
  SettingBIRM1Backwash: 16,
  SettingBIRM1Rinse: 17,
  SettingBIRM2Backwash: 18,
  SettingBIRM2Settling: 19,
  SettingBIRM2Rinse: 20,
  SettingACFILTERBackwash: 21,
  SettingACFILTERSettling: 22,
  SettingBackwashSOFTENER: 23,
  SettingSettlingSOFTENER: 24,
  SettingRinseSOFTENER: 25,
});

class Data_bits {
  _Manu_auto = false;
  _Service = false;
  _BW = false;
  _LS1_LL_RAW_WATER_TANK = false;
  _LS1_H_RAW_WATER_TANK = false;
  _LS1_L_RAW_WATER_TANK = false;
  _LS1_HH_RAW_WATER_TANK = false;
  _LS2_LL_TREATED_WATER_TANK = false;
  _LS2_L_TREATED_WATER_TANK = false;
  _LS2_H_TREATED_WATER_TANK = false;
  _LS2_HH_TREATED_WATER_TANK = false;
  _Select_A = false;
  _Select_B = false;
  _SP_01A_F_SERVICE_PUMP = false;
  _SP_01A_Run_SERVICE_PUMP = false;
  _SP_01B_F_SERVICE_PUMP = false;
  _SP_01B_Run_SERVICE_PUMP = false;
  _SP_01C_F_SERVICE_PUMP = false;
  _SP_01C_Run_SERVICE_PUMP = false;
  _BP_01A_F_NaCl_PUMP = false;
  _BP_01A_Run_NaCl_PUMP = false;
  _BP_01B_F_NaCl_PUMP = false;
  _BP_01B_Run_NaCl_PUMP = false;
  _NP_01A_F_BACK_WASH_PUMP = false;
  _NP_01A_RUN_BACK_WASH_PUMP = false;
  _NP_01B_F_BACK_WASH_PUMP = false;
  _NP_01B_RUN_BACK_WASH_PUMP = false;
  _Backwash_BIRM_1 = false;
  _Rinse_BIRM_1 = false;
  _Backwash_BIRM_2 = false;
  _Settling_BIRM_2 = false;
  _Rinse_BIRM_2 = false;
  _Backwash_AC_FILTER = false;
  _Settling_AC_FILTER = false;
  _Rinse_AC_FILTER = false;
  _Backwash_SOFTENER = false;
  _Settling_SOFTENER = false;
  _Chemical_Injection_SOFTENER = false;
  _Displacement_SOFTENER = false;
  _Rinse_SOFTENER = false;
  _F07A = false;
  _BSVA = false;
  _08A_BIRM_A1 = false;
  _01A_BIRM_A1 = false;
  _03A_BIRM_A1 = false;
  _06A_BIRM_A1 = false;
  _04A_BIRM_A1 = false;
  _02A_BIRM_A1 = false;
  _05A_BIRM_A1 = false;
  _08A_BIRM_A2 = false;
  _01A_BIRM_A2 = false;
  _03A_BIRM_A2 = false;
  _06A_BIRM_A2 = false;
  _04A_BIRM_A2 = false;
  _02A_BIRM_A2 = false;
  _05A_BIRM_A2 = false;
  _08A_AC_FILTER_A = false;
  _01A_AC_FILTER_A = false;
  _03A_AC_FILTER_A = false;
  _06A_AC_FILTER_A = false;
  _04A_AC_FILTER_A = false;
  _02A_AC_FILTER_A = false;
  _05A_AC_FILTER_A = false;
  _08A_SOFTENER_A = false;
  _01A_SOFTENER_A = false;
  _03A_SOFTENER_A = false;
  _06A_SOFTENER_A = false;
  _04A_SOFTENER_A = false;
  _02A_SOFTENER_A = false;
  _05A_SOFTENER_A = false;
  _07A = false;
  _F07B = false;
  _BSVB = false;
  _08B_BIRM_B1 = false;
  _01B_BIRM_B1 = false;
  _03B_BIRM_B1 = false;
  _06B_BIRM_B1 = false;
  _04B_BIRM_B1 = false;
  _02B_BIRM_B1 = false;
  _05B_BIRM_B1 = false;
  _08B_BIRM_B2 = false;
  _01B_BIRM_B2 = false;
  _03B_BIRM_B2 = false;
  _06B_BIRM_B2 = false;
  _04B_BIRM_B2 = false;
  _02B_BIRM_B2 = false;
  _05B_BIRM_B2 = false;
  _08B_AC_FILTER_B = false;
  _01B_AC_FILTER_B = false;
  _03B_AC_FILTER_B = false;
  _06B_AC_FILTER_B = false;
  _04B_AC_FILTER_B = false;
  _02B_AC_FILTER_B = false;
  _05B_AC_FILTER_B = false;
  _08B_SOFTENER_B = false;
  _01B_SOFTENER_B = false;
  _03B_SOFTENER_B = false;
  _06B_SOFTENER_B = false;
  _04B_SOFTENER_B = false;
  _02B_SOFTENER_B = false;
  _05B_SOFTENER_B = false;
  _07B = false;
  _TO_WWT_BIRM_A1 = false;
  _TO_WWT_BIRM_A2 = false;
  _TO_WWT_AC_FILTER_A = false;
  _TO_WWT_SOFTENER_A = false;
  _TO_WWT_BIRM_B1 = false;
  _TO_WWT_BIRM_B2 = false;
  _TO_WWT_AC_FILTER_B = false;
  _TO_WWT_SOFTENER_B = false;
}

class Data_words {
  RunningAh;
  RunningAmin;
  RunningBh;
  RunningBmin;
  TimeAutoA;
  TimeAutoB;
  ProgressBIRM1Backwash;
  ProgressBIRM1Rinse;
  ProgressBIRM2Backwash;
  ProgressBIRM2Settling;
  ProgressBIRM2Rinse;
  ProgressACFILTERBackwash;
  ProgressACFILTERSettling;
  ProgressSOFTENERBackwash;
  ProgressSOFTENERSettling;
  ProgressSOFTENERRinse;
  SettingBIRM1Backwash;
  SettingBIRM1Rinse;
  SettingBIRM2Backwash;
  SettingBIRM2Settling;
  SettingBIRM2Rinse;
  SettingACFILTERBackwash;
  SettingACFILTERSettling;
  SettingBackwashSOFTENER;
  SettingSettlingSOFTENER;
  SettingRinseSOFTENER;
}
class Data_json {
  id = 1;
  timeStamp = "r";
  Data_bits = new Data_bits();
  //Data_words = new Data_words();
  Rawsystem_PLC_isconnect = false;
}
const topic_mqtt = 'SYNOPEXVINA2/IIOT/MQTT/RAWWATERSYSTEM';
var MQTT_CLIENT_ID = "iot_web_" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
const connectUrl = 'mqtt://broker.hivemq.com:1883';
const optionsmqtt = {
  clientId: MQTT_CLIENT_ID,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000
};
const clientmqtt = mqtt.connect(connectUrl,optionsmqtt);
//disconnect error close
clientmqtt.on('connect', () => {
  console.log("mqtt connected!!!");
  
});
clientmqtt.on('disconnect', () => {
  console.error("mqtt disconnect");
});
clientmqtt.on('error', () => {
  console.error("mqtt error");
});
clientmqtt.on('close', () => {
  console.error("mqtt close");
});




var a_data = new Data_json();
a_data.timeStamp = "sdfs";
var aaa = JSON.stringify(a_data);
const client = new Modbus.client.TCP(socket, 1, 1000);

socket.on("connect", function () {
  console.log("Modbus is connected");
});
socket.on("close", function () {
  console.log("Modbus is disconnected");

  a_data.Rawsystem_PLC_isconnect = false;
  socket.end();
});

httpserver(3000, "db.json");
setInterval(read, 1000);
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
var datalog = "";
var datalog_old = "";
var timehientai = 0;
function read() {
  var dt = dateTime.create();
  var formatted = dt.format("Ymd-HMS");

  a_data.timeStamp = formatted;

  //console.log(client.connectionState);
  if (client.connectionState == "online") {
    //////////////
    client
      .readCoils(0, 110)
      .then(function (resp) {
        //console.log(formatted + ": "+ resp.response._body._valuesAsArray)
        a_data.Rawsystem_PLC_isconnect = true;
        datalog = "";
        for (i = 0; i < 110; i++) {
          a_data.Data_bits[myEnum.enums[i].key] =
            resp.response._body._valuesAsArray[myEnum.enums[i].value];
          if (i != 109)
            datalog +=
              resp.response._body._valuesAsArray[myEnum.enums[i].value] + ",";
          else
            datalog +=
              resp.response._body._valuesAsArray[myEnum.enums[i].value];
        }

        // socket.end()
      })
      .catch(function () {
        // console.error(arguments)
        console.error("timeout");
        a_data.Rawsystem_PLC_isconnect = false;
        //socket.end()
      });
    //////////////
    /*/////////////
      
      client.readHoldingRegisters(0, 25)
      .then(function (resp) {
        for (i=0; i<25;i++)
        a_data.Data_words[myEnum_Word.enums[i].key] = resp.response._body._valuesAsArray[myEnum_Word.enums[i].value];
       //   console.log(formatted + ": "+ resp.response._body._values)
      // socket.end()
      }).catch(function () {
         // console.error(arguments)
         console.error("timeout");
    //socket.end()
      })
      ////////////*/
  } else {
    console.log("Modbus is reconnect");
    socket.connect(options);
  }
  update_server("http://127.0.0.1:3000/data/1", JSON.stringify(a_data));
  if(clientmqtt.connected)
  clientmqtt.publish(topic_mqtt, JSON.stringify(a_data), { qos: 0, retain: true }, (error) => {
    if (error) {
      console.error(error)
    }
  })

  creatfile(datalog);
}

function creatfile(datalog) {
  var title =
    "DATE,TIME" +
    "_Manu_auto," +
    "_Service," +
    "_BW," +
    "_LS1_LL_RAW_WATER_TANK," +
    "_LS1_L_RAW_WATER_TANK," +
    "_LS1_H_RAW_WATER_TANK," +
    "_LS1_HH_RAW_WATER_TANK," +
    "_LS2_LL_TREATED_WATER_TANK," +
    "_LS2_L_TREATED_WATER_TANK," +
    "_LS2_H_TREATED_WATER_TANK," +
    "_LS2_HH_TREATED_WATER_TANK," +
    "_Select_A," +
    "_Select_B," +
    "_SP_01A_F_SERVICE_PUMP," +
    "_SP_01A_Run_SERVICE_PUMP," +
    "_SP_01B_F_SERVICE_PUMP," +
    "_SP_01B_Run_SERVICE_PUMP," +
    "_SP_01C_F_SERVICE_PUMP," +
    "_SP_01C_Run_SERVICE_PUMP," +
    "_BP_01A_F_NaCl_PUMP," +
    "_BP_01A_Run_NaCl_PUMP," +
    "_BP_01B_F_NaCl_PUMP," +
    "_BP_01B_Run_NaCl_PUMP," +
    "_NP_01A_F_BACK_WASH_PUMP," +
    "_NP_01A_RUN_BACK_WASH_PUMP," +
    "_NP_01B_F_BACK_WASH_PUMP," +
    "_NP_01B_RUN_BACK_WASH_PUMP," +
    "_Backwash_BIRM_1," +
    "_Rinse_BIRM_1," +
    "_Backwash_BIRM_2," +
    "_Settling_BIRM_2," +
    "_Rinse_BIRM_2," +
    "_Backwash_AC_FILTER," +
    "_Settling_AC_FILTER," +
    "_Rinse_AC_FILTER," +
    "_Backwash_SOFTENER," +
    "_Settling_SOFTENER," +
    "_Chemical_Injection_SOFTENER," +
    "_Displacement_SOFTENER," +
    "_Rinse_SOFTENER," +
    "_F07A," +
    "_BSVA," +
    "_08A_BIRM_A1," +
    "_01A_BIRM_A1," +
    "_03A_BIRM_A1," +
    "_06A_BIRM_A1," +
    "_04A_BIRM_A1," +
    "_02A_BIRM_A1," +
    "_05A_BIRM_A1," +
    "_08A_BIRM_A2," +
    "_01A_BIRM_A2," +
    "_03A_BIRM_A2," +
    "_06A_BIRM_A2," +
    "_04A_BIRM_A2," +
    "_02A_BIRM_A2," +
    "_05A_BIRM_A2," +
    "_08A_AC_FILTER_A," +
    "_01A_AC_FILTER_A," +
    "_03A_AC_FILTER_A," +
    "_06A_AC_FILTER_A," +
    "_04A_AC_FILTER_A," +
    "_02A_AC_FILTER_A," +
    "_05A_AC_FILTER_A," +
    "_08A_SOFTENER_A," +
    "_01A_SOFTENER_A," +
    "_03A_SOFTENER_A," +
    "_06A_SOFTENER_A," +
    "_04A_SOFTENER_A," +
    "_02A_SOFTENER_A," +
    "_05A_SOFTENER_A," +
    "_07A," +
    "_F07B," +
    "_BSVB," +
    "_08B_BIRM_B1," +
    "_01B_BIRM_B2," +
    "_03B_BIRM_B3," +
    "_06B_BIRM_B4," +
    "_04B_BIRM_B5," +
    "_02B_BIRM_B6," +
    "_05B_BIRM_B7," +
    "_08B_BIRM_B2," +
    "_01B_BIRM_B3," +
    "_03B_BIRM_B4," +
    "_06B_BIRM_B5," +
    "_04B_BIRM_B6," +
    "_02B_BIRM_B7," +
    "_05B_BIRM_B8," +
    "_08B_AC_FILTER_B," +
    "_01B_AC_FILTER_B," +
    "_03B_AC_FILTER_B," +
    "_06B_AC_FILTER_B," +
    "_04B_AC_FILTER_B," +
    "_02B_AC_FILTER_B," +
    "_05B_AC_FILTER_B," +
    "_08B_SOFTENER_B," +
    "_01B_SOFTENER_B," +
    "_03B_SOFTENER_B," +
    "_06B_SOFTENER_B," +
    "_04B_SOFTENER_B," +
    "_02B_SOFTENER_B," +
    "_05B_SOFTENER_B," +
    "_07B," +
    "_TO_WWT_BIRM_A1," +
    "_TO_WWT_BIRM_A2," +
    "_TO_WWT_AC_FILTER_A," +
    "_TO_WWT_SOFTENER_A," +
    "_TO_WWT_BIRM_B1," +
    "_TO_WWT_BIRM_B2," +
    "_TO_WWT_AC_FILTER_B," +
    "_TO_WWT_SOFTENER_B";

  var dt = dateTime.create();
  var formatted = dt.format("Ymd");
  var _date = dt.format("Y/m/d");
  var _time = dt.format("H:M:S");
  const path_Event = "Logfile/" + "RAWWATER_Event_LOG_" + formatted + ".csv";
  const path_checksheet =
    "Logfile/" + "RAWWATER_Checksheet_LOG_" + formatted + ".csv";
  if (datalog != "") {
    if (datalog_old != datalog) {
      try {
        if (fs.existsSync(path_Event)) {
          //file exists
        } else {
          fs.appendFile(path_Event, title + "\r\n", function (err) {
            if (err) throw err;
            //console.log('Saved!');
          });
        }
        fs.appendFile(
          path_Event,
          "'" + _date + "," + "'" + _time + "," + datalog + "\r\n",
          function (err) {
            // if (err) throw err;
            //console.log('Saved!');
          }
        );
        datalog_old = datalog;
      } catch (err) {
        console.error(err);
      }
    }
    if (timehientai != dt.format("H")) {
      try {
        if (fs.existsSync(path_checksheet)) {
          //file exists
        } else {
          fs.appendFile(path_checksheet, title + "\r\n", function (err) {
            if (err) throw err;
            //console.log('Saved!');
          });
        }
        fs.appendFile(
          path_checksheet,
          "'" + _date + "," + "'" + _time + "," + datalog + "\r\n",
          function (err) {
            // if (err) throw err;
            //console.log('Saved!');
          }
        );
        timehientai = dt.format("H");
      } catch (err) {
        console.error(err);
      }
    }
  }
}

socket.on("error", function () {
  console.log("Modbus is ERR");
  // _isconnected = false;
});
socket.on("timeout", function () {
  console.log("Modbus is timeout");
  // _isconnected = false;
});
//socket.connect(options)
