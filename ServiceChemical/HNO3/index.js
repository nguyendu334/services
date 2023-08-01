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
const ModbusRTU = require("modbus-serial");
const { sync } = require("glob");

/* Reading the data from the database and sending it to the MQTT broker. */
setInterval(function () {
  read1();  //socket 1 Wetline
  read2();  // socket 2 RTUoverTCP khu xu ly nuoc thai 
  read3();  // Socket 3 RTUoverTCP ma vang
  read4();  // socket 4 mavang

  ChartArea();
  Checksheet();
  // console.log(datamqtt);
  sendMQTT(clientmqtt, datamqtt);
  // read();
}, 1000);

// Json server
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
// Use default router
server.use("/", router);
server.listen(3010, () => {
  console.log("JSON Server is running");
});
// End Json server
var url = "http://localhost:3010/data/1";
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
const topic_mqtt1 = "SYNOPEXVINA2/IIOT/MQTT/CHEMICALNew";
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
  MQTT_CLIENT_ID =
    "iot_web_" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
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
var datamqtt = [];
/**
 * It takes a JSON object as an argument and sends it to the server using the PATCH method.
 * @param dataUpdateJson - This is the JSON object that you want to update.
 */
function Updatedata(dataUpdateJson) {
  fetch(url, {
    method: "PATCH",
    body: JSON.stringify(dataUpdateJson),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
  //   .then((json) => console.log(json));
}
//socket1
const socket1 = new net.Socket();
const client1 = new Modbus.client.TCP(socket1, 1);
const options1 = {
  host: "192.168.111.31",
  port: "502",
};

socket1.connect(options1);
socket1.on("error", function () {
  console.log("Modbus is ERR");
  Tankwetline.ConnectTankwetline = false;
});
socket1.on("timeout", function () {
  console.log("Modbus is timeout");
  Tankwetline.ConnectTankwetline = false;
});
socket1.on("connect", function () {
  console.log("Modbus is connected");
  Tankwetline.ConnectTankwetline = true;
});
socket1.on("close", function () {
  console.log("Modbus is disconnected");
  Tankwetline.ConnectTankwetline = false;
  socket1.end();
});

var Tankwetline = {
  id: 1,
  dataLineDes1: {
    HCLtankLL: 0,
    HCLtankL: 0,
    HCLtankH: 0,
    HCLtankHH: 0,
    LeatankH: 0,
    LeatankL: 0
  },
  dataHafetching: {
    HCLtankLL: 0,
    HCLtankL: 0,
    HCLtankH: 0,
    HCLtankHH: 0,
    LeatankH: 0,
    LeatankL: 0
  },
  ConnectTankwetline: 1
}

async function read1() {
  getdataJson();
 if(Tankwetline.ConnectTankwetline == true){
    await client1
      .readCoils(0, 12)
      .then(function (resp) {
        var dataModbus = resp.response.body.valuesAsArray;
        Tankwetline.ConnectTankwetline = true;
        console.log(dataModbus);
        var data1 = dataModbus.slice(0, 6);
        Object.keys(Tankwetline.dataLineDes1).forEach((key, index) => {
          Tankwetline.dataLineDes1[key] = data1[index];
        });
        // console.log(data1);
        var data2 = dataModbus.slice(6, 12);
        Object.keys(Tankwetline.dataHafetching).forEach((key, index) => {
          Tankwetline.dataHafetching[key] = data2[index];
        });
        // console.log(data2);
      })
      await Updatedata(Tankwetline);
  } 
  else {
    console.log("Modbus is reconnect");
    Tankwetline.ConnectTankwetline = false;
    socket1.connect(options1);
    socket1.on("error", function () {
      console.log("Modbus is ERR");
    });
    socket1.on("timeout", function () {
      console.log("Modbus is timeout");
    });
    socket1.on("connect", function () {
      console.log("Modbus is connected");
      Tankwetline.ConnectTankwetline = true;
    });
    socket1.on("close", function () {
      console.log("Modbus is disconnected");
      socket1.end();
    });
  }

}
//tank HNO3 ma vang 
var dataHno3AU = {
  dataHno3AuTank2 : {
    Connet_Hno3AuTank2 :false,
    LLtankHNO3:false,
    HHtankHNO3:false
  }
}
//socket4 

const client6 = new ModbusRTU();
// const ipMavang = "10.100.203.78";
const ipMavang = "192.168.111.30";
// open connection to a tcp line
client6.connectTCP(ipMavang, { port: 502 })
  .then(setClient)
  .then(function () {
    console.log("Connected client6");
  })
  .catch(function (e) {
    console.log(e.message);
  });
async function read4() {
  await client6.readCoils(0, 10)
    .then(function (d) {
      console.log("Receive:", d.data);
      dataHno3AU.dataHno3AuTank2.Connet_Hno3AuTank2 = true;
      var dataModbus = d.data[6];
        dataHno3AU.dataHno3AuTank2.HHtankHNO3 = dataModbus;
    })
    .catch(function (e) {
      dataHno3AU.dataHno3AuTank2.Connet_Hno3AuTank2 = false;
      console.log(e.message);
      if (e.message == "Timed out") {
        client6.connectTCP(ipMavang, { port: 502 })
          .then(setClient)
          .then(function () {
            console.log("Connected");
          })
          .catch(function (e) {
            console.log(e.message);
          });
      }
    });
    await Updatedata(dataHno3AU);
}
// note: can't store
// const socket2 = new net.Socket();
// const client6 = new Modbus.client.TCP(socket1, 1);
// const options2 = {
//   host: "127.0.0.1",
//   port: "502",
// };

// socket2.connect(options2);
// socket2.on("error", function () {
//   console.log("Modbus is ERR");
// });
// socket2.on("timeout", function () {
//   console.log("Modbus is timeout");
// });
// socket2.on("connect", function () {
//   console.log("Modbus is connected");
//   dataHno3AU.dataHno3AuTank2.Connet_Hno3AuTank2 = true;
// });
// socket2.on("close", function () {
//   console.log("Modbus is disconnected");
//   socket2.end();
// });
// async function read4(){
//   getdataJson();
//   if (dataHno3AU.dataHno3AuTank2.Connet_Hno3AuTank2 == true) {
//     await client6
//       .readCoils(0, 10)
//       .then(function (resp) {
//         var dataModbus1 = resp.response.body.valuesAsArray;
//         console.log(dataModbus1);
//         dataHno3AU.dataHno3AuTank2.HHtankHNO3 = dataModbus[0];
//       })
//   } else {
//     console.log("Modbus socket2 is reconnect");
//     dataHno3AU.dataHno3AuTank2.Connet_Hno3AuTank2 = false;
//     socket2.connect(options2);
//     socket2.on("error", function () {
//       console.log("Modbus socket2 is ERR");
//     });
//     socket2.on("timeout", function () {
//       console.log("Modbus socket2 is timeout");
//     });
//     socket2.on("connect", function () {
//       console.log("Modbus socket2 is connected");
//       dataHno3AU.dataHno3AuTank2.Connet_Hno3AuTank2 = true;
//     });
//     socket2.on("close", function () {
//       console.log("Modbus socket2 is disconnected");
//       socket2.end();
//     });
//   }
//   await Updatedata(dataHno3AU);
// }
//----------------------------------------------------------------
var TankHoaChat = {
  id: 1,
  level: {
    HNO3_I: 0,
    HNO3_O: 0,
    OXA100: 0,
    CuCL2: 48.599998474121094,
    HCL: 0,
    HNO3AU: 0
  },
  PLCConnect: {
    HNO3_I_isconnected: false,
    HNO3_O_isconnected: false,
    OXA100_isconnected: false,
    CuCL2_isconnected: false,
    HCL_isconnected: false,
    HNO3AU_isconnected: false
  }
}
//socket3

const client5 = new ModbusRTU();

// NPort Gateway 801D NetPort
var IP2 = "192.168.111.29"; // 192.168.111.29
var postIP2 = 502;
client5.connectRTUoverTCP(IP2, { port: postIP2 })
  .then(setClient)
  .then(function () {
    console.log("Connected client2");
  })
  .catch(function (e) {
    console.log(e.message);
  });
  async function read3() {
    await client5.readHoldingRegisters(106, 1)
      .then(function (d) {
        console.log("Receive:", d.data);
        TankHoaChat.PLCConnect.HNO3AU_isconnected = true;
        var dataHNO3AU = d.data[0];
        var convertdataHNO3AU = ((2300 - dataHNO3AU) / 2300) * 100;  
        TankHoaChat.level.HNO3AU = convertdataHNO3AU;
      })
      .catch(function (e) {
        TankHoaChat.PLCConnect.HNO3AU_isconnected = false;
        console.log(e.message);
        if (e.message == "Port Not Open") {
          client5.connectRTUoverTCP(IP2, { port: postIP2 })
            .then(setClient)
            .then(function () {
              console.log("Connected");
            })
            .catch(function (e) {
              console.log(e.message);
            });
        }
      });
  }
//socket2

// const client2 = new ModbusRTU();
// const client3 = new ModbusRTU();
// const client4 = new ModbusRTU();
// // NPort Gateway 801D NetPort
// var IP = "192.168.111.143";
var postIP = 502;
// client2.connectRTUoverTCP(IP, { port: postIP })
//   .then(setClient)
//   .then(function () {
//     console.log("Connected client2");
//   })
//   .catch(function (e) {
//     console.log(e.message);
//   });
// client3.connectRTUoverTCP(IP, { port: postIP })
//   .then(setClient)
//   .then(function () {
//     console.log("Connected client3");
//   })
//   .catch(function (e) {
//     console.log(e.message);
//   });
// client4.connectRTUoverTCP(IP, { port: postIP })
//   .then(setClient)
//   .then(function () {
//     console.log("Connected client4");
//   })
//   .catch(function (e) {
//     console.log(e.message);
//   });
// // cài đặt ID
function setClient() {
  // client2.setID(5);
  // client2.setTimeout(3000);
  // client3.setID(7);
  // client3.setTimeout(3000);
  // client4.setID(6);
  // client4.setTimeout(3000);
  client5.setID(1);
  client5.setTimeout(3000);
  client6.setID(1);
  client6.setTimeout(3000);
  client2.setID(1);
  client2.setTimeout(3000);
}
const client2 = new ModbusRTU();
client2.connectTCP("192.168.111.40", { port: postIP });

function reconnect() {
  client2.connectTCP("192.168.111.40", { port: postIP })
  .then(setClient)
  .then(function () {
    console.log("Connected");
  })
  .catch(function (e) {
    console.log(e.message);
  })
}
async function read2() {
  getdataJson();
  await client2.readHoldingRegisters(100, 3)
    .then(function (d) {
      console.log("Receive:", d.data);
      //CuCL2
      TankHoaChat.PLCConnect.CuCL2_isconnected = true;
      var dataCUCL2 = d.data[0];
      var convertdataCUCL2 = ((4000 - dataCUCL2) / 4000) * 100;
      TankHoaChat.level.CuCL2 = convertdataCUCL2;
      // HNO3
      TankHoaChat.PLCConnect.HNO3_I_isconnected = true;
          var dataHNO3 = d.data[2];
          var convertdataHNO3 = ((2300 - dataHNO3) / 2300) * 100;
          TankHoaChat.level.HNO3_I = convertdataHNO3;
        //HCL
        TankHoaChat.PLCConnect.HCL_isconnected = true;
            var dataHCl = d.data[1];
            var convertdataHCL = ((4000 - dataHCl) / 4000) * 100;
            TankHoaChat.level.HCL = convertdataHCL;

    })
    .catch(function (e) {
      TankHoaChat.PLCConnect.CuCL2_isconnected = false;
      TankHoaChat.PLCConnect.HCL_isconnected = false;
      TankHoaChat.PLCConnect.HNO3_I_isconnected = false;
      console.log(e.message);

        reconnect();
        console.log("reConnect");
    });
  // CUCL2
  // await client2.readHoldingRegisters(107, 1)
  //   .then(function (d) {
  //     console.log("Receive:", d.data);
  //     TankHoaChat.PLCConnect.CuCL2_isconnected = true;
  //     var dataCUCL2 = d.data[0];
  //     var convertdataCUCL2 = ((4000 - dataCUCL2) / 4000) * 100;
  //     TankHoaChat.level.CuCL2 = convertdataCUCL2;
  //   })
  //   .catch(function (e) {
  //     TankHoaChat.PLCConnect.CuCL2_isconnected = false;
  //     console.log(e.message);
  //     if (e.message == "Port Not Open") {
  //       client2.connectRTUoverTCP(IP, { port: postIP })
  //         .then(setClient)
  //         .then(function () {
  //           console.log("Connected");
  //         })
  //         .catch(function (e) {
  //           console.log(e.message);
  //         });
  //     }
  //   });

  // // HNO3
  // await client3.readHoldingRegisters(107, 1)
  //   .then(function (d) {
  //     console.log("Receive:", d.data);
  //     TankHoaChat.PLCConnect.HNO3_I_isconnected = true;
  //     var dataHNO3 = d.data[0];
  //     var convertdataHNO3 = ((2300 - dataHNO3) / 2300) * 100;
  //     TankHoaChat.level.HNO3_I = convertdataHNO3;
  //   })
  //   .catch(function (e) {
  //     TankHoaChat.PLCConnect.HNO3_I_isconnected = false;
  //     console.log(e.message);
  //     if (e.message == "Port Not Open") {
  //       client3.connectRTUoverTCP(IP, { port: postIP })
  //         .then(setClient)
  //         .then(function () {
  //           console.log("Connected");
  //         })
  //         .catch(function (e) {
  //           console.log(e.message);
  //         });
  //     }
  //   });

  // // HCL
  // await client4.readHoldingRegisters(107, 1)
  //   .then(function (d) {
  //     console.log("Receive:", d.data);
  //     TankHoaChat.PLCConnect.HCL_isconnected = true;
  //     var dataHCl = d.data[0];
  //     var convertdataHCL = ((4000 - dataHCl) / 4000) * 100;
  //     TankHoaChat.level.HCL = convertdataHCL;
  //   })
  //   .catch(function (e) {
  //     TankHoaChat.PLCConnect.HCL_isconnected = false;
  //     console.log(e.message);
  //     if (e.message == "Port Not Open") {
  //       client3.connectRTUoverTCP(IP, { port: postIP })
  //         .then(setClient)
  //         .then(function () {
  //           console.log("Connected");
  //         })
  //         .catch(function (e) {
  //           console.log(e.message);
  //         });
  //     }
  //   });

  await Updatedata(TankHoaChat);
}


function read() {
  getdataJson();
  console.log(response);
}

// function read() {
//   // modbus tank HCL Wetline kèm tank chống tràn
//   client1.readDiscreteInputs(0, 12).then(function (resp) {
//     console.log("Tank :");
//     console.log(resp.response.body.valuesAsArray);
//   }, console.error);

//   //gán data vào object so sánh với thời gian
//   console.log(data.Chart_Area.CuCL2[1].Time);
//   //
//   var random = Math.random();
//   var phantram = (random * 100).toFixed(1);
//   const d = new Date();
//   let s = d.getSeconds();
//   console.log(s.toString());
//   console.log(data.Chart_Area.CuCL2);
//   for(let i = 0;i<=23;i++){
//     if(data.Chart_Area.CuCL2[i].Time == s.toString()){
//       data.Chart_Area.CuCL2[i].rate = phantram;
//     }
//     // console.log(i);
//   }
// }
var Old_day = 10;
async function ChartArea() {
  getdataJson();
  const d = new Date();
  let hour = d.getHours();
  let day = d.getDay();

  for (let i = 0; i <= 23; i++) {
    if (dataChart.Chart_Area.CuCL2[i].Time == hour.toString()) {
      dataChart.Chart_Area.CuCL2[i].rate = TankHoaChat.level.CuCL2;
      dataChart.Chart_Area.HNO3_I[i].rate = TankHoaChat.level.HNO3_I;
    }
  }
  //reset data new day
  if (Old_day != day) {
    Old_day = day;
    for (let i = 0; i <= 23; i++) {
      dataChart.Chart_Area.CuCL2[i].rate = 0;
      dataChart.Chart_Area.HNO3_I[i].rate = 0;
    }
  }
  // const arraydataCucl2 = Object.entries(dataChart.Chart_Area.CuCL2);
  // dataChart.Chart_Area.CuCL2 = 
  // dataChart.Chart_Area.CuCL2 = arraydataCucl2;

  await Updatedata(dataChart);
}
var dataChart = {
  Chart_Area: {
    CuCL2: {
      0: { Time: '8', rate: 0 },
      1: { Time: '9', rate: 0 },
      2: { Time: '10', rate: 0 },
      3: { Time: '11', rate: 0 },
      4: { Time: '12', rate: 0 },
      5: { Time: '13', rate: 0 },
      6: { Time: '14', rate: 0 },
      7: { Time: '15', rate: 0 },
      8: { Time: '16', rate: 0 },
      9: { Time: '17', rate: 0 },
      10: { Time: '18', rate: 0 },
      11: { Time: '19', rate: 0 },
      12: { Time: '20', rate: 0 },
      13: { Time: '21', rate: 0 },
      14: { Time: '22', rate: 0 },
      15: { Time: '23', rate: 0 },
      16: { Time: '0', rate: 0 },
      17: { Time: '1', rate: 0 },
      18: { Time: '2', rate: 0 },
      19: { Time: '3', rate: 0 },
      20: { Time: '4', rate: 0 },
      21: { Time: '5', rate: 0 },
      22: { Time: '6', rate: 0 },
      23: { Time: '7', rate: 0 }
    },
    HCL: {
      0: { Time: '8', rate: 0 },
      1: { Time: '9', rate: 0 },
      2: { Time: '10', rate: 0 },
      3: { Time: '11', rate: 0 },
      4: { Time: '12', rate: 0 },
      5: { Time: '13', rate: 0 },
      6: { Time: '14', rate: 0 },
      7: { Time: '15', rate: 0 },
      8: { Time: '16', rate: 0 },
      9: { Time: '17', rate: 0 },
      10: { Time: '18', rate: 0 },
      11: { Time: '19', rate: 0 },
      12: { Time: '20', rate: 0 },
      13: { Time: '21', rate: 0 },
      14: { Time: '22', rate: 0 },
      15: { Time: '23', rate: 0 },
      16: { Time: '0', rate: 0 },
      17: { Time: '1', rate: 0 },
      18: { Time: '2', rate: 0 },
      19: { Time: '3', rate: 0 },
      20: { Time: '4', rate: 0 },
      21: { Time: '5', rate: 0 },
      22: { Time: '6', rate: 0 },
      23: { Time: '7', rate: 0 }
    },
    HNO3_I: {
      0: { Time: '8', rate: 0 },
      1: { Time: '9', rate: 0 },
      2: { Time: '10', rate: 0 },
      3: { Time: '11', rate: 0 },
      4: { Time: '12', rate: 0 },
      5: { Time: '13', rate: 0 },
      6: { Time: '14', rate: 0 },
      7: { Time: '15', rate: 0 },
      8: { Time: '16', rate: 0 },
      9: { Time: '17', rate: 0 },
      10: { Time: '18', rate: 0 },
      11: { Time: '19', rate: 0 },
      12: { Time: '20', rate: 0 },
      13: { Time: '21', rate: 0 },
      14: { Time: '22', rate: 0 },
      15: { Time: '23', rate: 0 },
      16: { Time: '0', rate: 0 },
      17: { Time: '1', rate: 0 },
      18: { Time: '2', rate: 0 },
      19: { Time: '3', rate: 0 },
      20: { Time: '4', rate: 0 },
      21: { Time: '5', rate: 0 },
      22: { Time: '6', rate: 0 },
      23: { Time: '7', rate: 0 }
    }
  }
};
// s%:Hno3_i            Sm3: Hno3_o        R%: oXa-100          Rm3:Cucl2         DI% : HCL
var dataCheckSheet = {
  Checksheet: {
    data: {
      0: { Hour: "8", "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      1: { Hour: '9', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      2: { Hour: '10', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      3: { Hour: '11', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      4: { Hour: '12', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      5: { Hour: '13', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      6: { Hour: '14', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      7: { Hour: '15', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      8: { Hour: '16', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      9: { Hour: '17', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      10: { Hour: '18', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      11: { Hour: '19', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      12: { Hour: '20', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      13: { Hour: '21', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      14: { Hour: '22', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      15: { Hour: '23', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      16: { Hour: '0', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      17: { Hour: '1', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      18: { Hour: '2', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      19: { Hour: '3', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      20: { Hour: '4', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      21: { Hour: '5', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      22: { Hour: '6', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
      23: { Hour: '7', "S%": "0", "Sm3": "0", "R%": "0", "Rm3": "0", "DI%": "0" },
    }
  }
}
var old_day = 0;
/**
 * "If the current hour is equal to the hour in the JSON file, then update the JSON file with the
 * current level of the tanks."
 * 
 * The JSON file is updated every hour.
 * 
 * The problem is that the JSON file is not updated every hour.
 * 
 * I have tried to use the setInterval() function, but it doesn't work.
 * 
 * I have tried to use the setTimeout() function, but it doesn't work.
 * 
 * I have tried to use the setInterval() function with the setTimeout() function, but it doesn't work.
 * 
 * I have tried to use the setInterval() function with the setTimeout() function and the
 * clearInterval() function, but it doesn't work.
 * 
 * I have tried to use the setInterval() function with the setTimeout() function and the
 * clearInterval() function and the clearTimeout
 */
function Checksheet() {
  getdataJson();
  const s = new Date();
  let hour = s.getHours();
  let day = s.getDay();

  for (let i = 0; i <= 23; i++) {
    if (dataCheckSheet.Checksheet.data[i].Hour == hour.toString()) {
      dataCheckSheet.Checksheet.data[i]["S%"] = TankHoaChat.level.HNO3_I.toFixed(2);
      dataCheckSheet.Checksheet.data[i]["Sm3"] = "0";
      dataCheckSheet.Checksheet.data[i]["R%"] = "0";
      dataCheckSheet.Checksheet.data[i]["Rm3"] = TankHoaChat.level.CuCL2.toFixed(2);
      dataCheckSheet.Checksheet.data[i]["DI%"] = TankHoaChat.level.HCL.toFixed(2);
    }
  }
  if (old_day != day) {
    old_day = day;
    for (let i = 0; i <= 23; i++) {
      dataCheckSheet.Checksheet.data[i]["S%"] = "0";
      dataCheckSheet.Checksheet.data[i]["Sm3"] = "0";
      dataCheckSheet.Checksheet.data[i]["R%"] = "0";
      dataCheckSheet.Checksheet.data[i]["Rm3"] = "0";
      dataCheckSheet.Checksheet.data[i]["DI%"] = "0";
    }
  }
  Updatedata(dataCheckSheet);
}
