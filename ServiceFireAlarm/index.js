const Modbus = require("jsmodbus");
const net = require("net");
const Enum = require("enum");
var Excel = require("exceljs");
const mqtt = require("mqtt");
const fetch = require("node-fetch");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
var dateTime = require("node-datetime");
const middlewares = jsonServer.defaults();
var XMLHttpRequest = require("xhr2");
// Json server
const Unit = require("./UintToInt");

server.use(middlewares);
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  next();
});
var url = "http://localhost:3004/data/1";
var datamqtt = [];
/**
 * It fetches the data from the url, then it converts the response to json, then it assigns the data to
 * the variable datamqtt, and finally it catches any errors and logs them to the console.
 */
function getdataJson() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => (datamqtt = data))
    .catch((err) => console.log(err));
}
function Updatedata(dataUpdateJson) {
  fetch(url, {
    method: "PATCH",
    body: JSON.stringify(dataUpdateJson),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
  //   .then((json) => console.log(json));
}
// Use default router
server.use("/", router);
server.listen(3004, () => {
  console.log("JSON Server is running");
});
// End Json server

//MQTT Client => server Set
const topic_mqtt1 = "SYNOPEXVINA/HIEUNV/MQTT/FIREALARMnew/";
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
  connect_Modbus.PLCConnect.MQTT_isconnected = true;
});
clientmqtt.on("disconnect", () => {
  console.error("mqtt disconnect");
  MQTT_CLIENT_ID =
    "iot_web_" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
    connect_Modbus.PLCConnect.MQTT_isconnected = false;
});
clientmqtt.on("error", () => {
  console.error("mqtt error");
  MQTT_CLIENT_ID =
    "iot_web_" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
});
clientmqtt.on("close", () => {
  console.error("mqtt close");
  MQTT_CLIENT_ID =
    "iot_web_" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
});
function sendMQTT(clientmqtt, data) {
  var loi = false;
  if (clientmqtt.connected) {
    clientmqtt.publish(
      topic_mqtt1,
      JSON.stringify(data),
      { qos: 0, retain: true },
      (error) => {
        if (error) {
          console.error(error);
          loi = true;
        }

      }
    );
    if (!loi) {
      console.log("mqtt send OK");
    }
    else
      console.log("mqtt send NG");
  }
}
// End MQTT client
//socket1
const socket1 = new net.Socket();
const client1 = new Modbus.client.TCP(socket1, 1);
const options1 = {
  host: "192.168.111.35",
  port: "502",
};
socket1.on("connect", function () {
  client1.readCoils(0, 50).then(function (resp) {
    console.log("Fire Alram : ");
    console.log(resp.response.body.valuesAsArray);
  }, console.error);
});
socket1.connect(options1);
socket1.on("error", function () {
  console.log("Modbus socket1 is ERR");
});
socket1.on("timeout", function () {
  console.log("Modbus socket1 is timeout");
});
socket1.on("connect", function () {
  console.log("Modbus socket1 is connected");
  connect_Modbus.PLCConnect.PLC_isconnected = true;
});
socket1.on("close", function () {
  console.log("Modbus socket1 is disconnected");
  socket1.end();
});
socket1.on("connect", function () {
  connect_Modbus.PLCConnect.PLC_isconnected = true;
  console.log("Modbus socket1 is connect");
});
//socket3
const socket3 = new net.Socket();
const client4 = new Modbus.client.TCP(socket3, 1);
const options4 = {
  host: "192.168.111.33",
  port: "8000",
};
socket3.on("connect", function () {
  client4.readCoils(100, 11).then(function (resp) {
    console.log("DOOR : ");
    console.log(resp.response.body.valuesAsArray);
  }, console.error);
});
socket3.connect(options4);
socket3.on("error", function () {
  console.log("Modbus socket3 is ERR");
});
socket3.on("timeout", function () {
  console.log("Modbus socket3 is timeout");
});
socket3.on("connect", function () {
  console.log("Modbus socket3 is connected");
  connect_Modbus.PLCConnect.PLC_isconnected = true;
});
socket3.on("close", function () {
  console.log("Modbus socket3 is disconnected");
  socket3.end();
});
 var dataDoor = {
  datadoor:{
    Door1:0,
    Door2:0,
    Door3:0,
    Door4:0,
    Door5:0,
    Door6:0,
    Door7:0,
    Door8:0,
    Door9:0,
    Door10:0,
    Door11:0
  }
 } 
/**
 * If the connection is true, then read the data, otherwise, reconnect the connection.
 */
async function read3(){
  if(connect_Modbus.PLCConnect.PLC_AutoDoor  == true){
    await client4
    .readCoils(100, 11)
    .then(function (resp) {
      var data1 = resp.response.body.valuesAsArray;
      console.log(data1);
      Object.keys(dataDoor.datadoor).forEach((key, index) => {
        dataDoor.datadoor[key] = data1[index];
      });
    })
    .catch(function () {
      console.error("timeout");
    });
  }else {
    socket3.connect(options4);
    console.log("Modbus is reconnect");
    socket3.on("error", function () {
      console.log("Modbus socket3 is ERR");
    });
    socket3.on("timeout", function () {
      console.log("Modbus socket3 is timeout");
    });
    socket3.on("connect", function () {
      console.log("Modbus socket3 is connected");
      connect_Modbus.PLCConnect.PLC_isconnected = true;
    });
    socket3.on("close", function () {
      console.log("Modbus socket3 is disconnected");
      socket3.end();
    });
  }
  await Updatedata(dataDoor); 
}
setInterval(() => {
  read2();
  read1();
  read3();
  time();

  sendMQTT(clientmqtt, datamqtt);
  // console.log(datamqtt);
}, 1000);
/**
 * If the PLC is connected, read the coils, then update the data_Zone object with the values from the
 * coils, then update the data_Zone object and the connect_Modbus object.
 */
async function read2() {
  if (connect_Modbus.PLCConnect.PLC_isconnected == true) {
    await client1
      .readCoils(0, 50)
      .then(function (resp) {
        var data1 = resp.response.body.valuesAsArray;
        console.log(data1);

        Object.keys(data_Zone.dataZone.datazone).forEach((key, index) => {
          data_Zone.dataZone.datazone[key] = data1[index];
          // console.log(data_Zone.dataZone.datazone[key]);
          if (data_Zone.dataZone.datazone[key] == 1){
            console.log("co chay");
            const headers = [
             
              { header: 'Zone 1' },
              { header: 'Zone 2' },
              { header: 'Zone 3' },
              { header: 'Zone 4' },
              { header: 'Zone 5' },
              { header: 'Zone 6' },
              { header: 'Zone 7' },
              { header: 'Zone 8' },
              { header: 'Zone 9' },
              { header: 'Zone 10' },
              { header: 'Zone 11' },
              { header: 'Zone 12' },
              { header: 'Zone 13' },
              { header: 'Zone 14' },
              { header: 'Zone 15' },
              { header: 'Zone 16' },
              { header: 'Zone 17' },
              { header: 'Zone 18' },
              { header: 'Zone 19' },
              { header: 'Zone 20' },
              { header: 'Zone 21' },
              { header: 'Zone 22' },
              { header: 'Zone 23' },
              { header: 'Zone 24' },
              { header: 'Zone 25' },
              { header: 'Zone 26' },
              { header: 'Zone 27' },
              { header: 'Zone 28' },
              { header: 'Zone 29' },
              { header: 'Zone 30' },
              { header: 'Zone 31' },
              { header: 'Zone 32' },
              { header: 'Zone 33' },
              { header: 'Zone 34' },
              { header: 'Zone 35' },
              { header: 'Zone 36' },
              { header: 'Zone 37' },
              { header: 'Zone 38' },
              { header: 'Zone 39' },
              { header: 'Zone 40' },
              { header: 'Zone 41' },
              { header: 'Zone 42' },
              { header: 'Zone 43' },
              { header: 'Zone 44' },
              { header: 'Zone 45' },
              { header: 'Zone 46' },
              { header: 'Zone 47' },
              { header: 'Zone 48' },
              { header: 'Zone 49' },
              { header: 'Zone 50' },
              { header: 'Time' }
          ]
          const d = new Date();
          ws.columns = headers;
              var dataExceladd = data1.slice(0,50);
              dataExceladd.push(d.toString());
              // console.log(dataExceladd2);
              ws.addRow(dataExceladd);
              SavefileExcel();
          }
        });
        // console.log(data_Zone.dataZone.datazone);
      })
      .catch(function () {
        console.error("timeout");
        connect_Modbus.PLCConnect.PLC_isconnected = false;
      });
  } else {
    console.log("Modbus is reconnect");
    socket1.connect(options1);
    socket1.on("error", function () {
      console.log("Modbus socket1 is ERR");
    });
    socket1.on("timeout", function () {
      console.log("Modbus socket1 is timeout");
    });
    socket1.on("connect", function () {
      console.log("Modbus socket1 is connected");
      connect_Modbus.PLCConnect.PLC_isconnected = true;
    });
    socket1.on("close", function () {
      console.log("Modbus socket1 is disconnected");
      socket1.end();
    });
  }
  await Updatedata(data_Zone);
  await Updatedata(connect_Modbus);
}

async function time() {
  const d = new Date();
  timer.Timespan = d.toString();
  await Updatedata(timer);
}
var connect_Modbus = {
  PLCConnect: {
    PLC_isconnected: false,
    MQTT_isconnected: false,
    Spinkler_isconnected: true,
    PLC_AutoDoor: true
  }
}
var timer = {
  Timespan: ""
}

var data_Zone = {
  dataZone: {
    datazone: {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
      23: false,
      24: false, 25: false, 26: false,
      27: false, 28: false, 29: false,
      30: false, 31: false, 32: false,
      33: false, 34: false, 35: false,
      36: false, 37: false, 38: false,
      39: false, 40: false, 41: false,
      42: false, 43: false, 44: false,
      45: false, 46: false, 47: false,
      48: false, 49: false
    }
  }
}

// socket 2
const ModbusRTU = require("modbus-serial");
const { Console } = require("console");
const client2 = new ModbusRTU();
const client3 = new ModbusRTU();
// NPort Gateway 801D NetPort
var IP = "192.168.111.27";
var postIP = 502;
client2.connectRTUoverTCP(IP, { port: postIP })
  .then(setClient)
  .then(function () {
    console.log("Connected client2");
  })
  .catch(function (e) {
    console.log(e.message);
  });
client3.connectRTUoverTCP(IP, { port: postIP })
  .then(setClient)
  .then(function () {
    console.log("Connected client3");
  })
  .catch(function (e) {
    console.log(e.message);
  });
// cài đặt ID
function setClient() {
  client2.setID(1);
  client2.setTimeout(3000);
  client3.setID(2);
  client3.setTimeout(3000);
}
var dataPressure = {
  dataW: {
    Spinkler: 5,
    PipeWall: 5.20
  }
}
async function read1() {
  getdataJson();
  // Wall pipe
  await client2.readInputRegisters(0, 1)
    .then(function (d) {
      console.log("Spinkler:", d.data[0]);
      dataPressure.dataW.Spinkler = Unit.UintToint(d.data[0]) ;
      console.log(dataPressure.dataW.Spinkler);
      connect_Modbus.PLCConnect.Spinkler_isconnected = true;
    })
    .catch(function (e) {
      // console.log(e.message);
      connect_Modbus.PLCConnect.Spinkler_isconnected = false;
      if (e.message == "Port Not Open") {
        client2.connectRTUoverTCP(IP, { port: postIP })
          .then(setClient)
          .then(function () {
            console.log("Connected");
          })
          .catch(function (e) {
            console.log(e.message);
          });
      }
    });
    
  // Spinkler
  await client3.readInputRegisters(0, 1)
    .then(function (d) {
      console.log("Receive:", d.data);
      dataPressure.dataW.PipeWall = Unit.UintToint(d.data[0]);
    })
    .catch(function (e) {
      // console.log(e.message);
      if (e.message == "Port Not Open") {
        client3.connectRTUoverTCP(IP, { port: postIP })
          .then(setClient)
          .then(function () {
            console.log("Connected");
          })
          .catch(function (e) {
            console.log(e.message);
          });
      }
    });
    await Updatedata(dataPressure);
}
const wb = new Excel.Workbook();
const ws = wb.addWorksheet('My Sheet');

function SavefileExcel() {
  const d= new Date();
  const month = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  let numbermonth = month[d.getMonth()];
  let date = d.getDate();
  let year = d.getFullYear();

  const fileName = "Logs_"+date.toString()+"-"+numbermonth+"-"+year.toString()+".xlsx";

  wb.xlsx
  .writeFile(fileName)
  .then(() => {
    console.log('file created');
  })
  .catch(err => {
    console.log(err.message);
  });
}