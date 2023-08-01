const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
const client2 = new ModbusRTU();
const fetch = require("node-fetch");

const mqtt = require("mqtt");
const convert = require('./converter.js');
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
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
server.listen(3013, () => {
  console.log("JSON Server is running");
});
var url = "http://localhost:3013/data/1";
function Updatedata(dataUpdateJson) {
    fetch(url, {
      method: "PATCH",
      body: JSON.stringify(dataUpdateJson),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
    //   .then((json) => console.log(json));
  }
  function getdataJson() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => (datamqtt = data))
      .catch((err) => console.log(err));
  }
//MQTT
const topic_mqtt1 = "SYNOPEXVINA2/IIOT/MQTT/PWC";
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
//PLC1 IP
var ip = "192.168.111.41";
// open connection to a tcp line
client.connectTCP(ip, { port: 502 });
client.setID(1);

// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.
setInterval(function () {
    // use the ReadHolding to Check disconnect
    client.readHoldingRegisters(0, 6)
        .then(function (d) {
            // console.log(d.data);
            readdata(d.data);
            connect.PLC1HMI_connect =true;
            Updatedata(connect);
        })
        .catch(function (e) {
            console.log(e);
            if (e.message =='Port Not Open')
            { 
              connect.PLC1HMI_connect = false;
              console.log("a");
              Updatedata(connect);
            }
            client.connectTCP(ip, { port: 502 });
            client.setID(1);
        })
        
    client.readCoils(14, 2)
    .then(function (d) {
            // console.log(d.data);
            vantank(d.data);
    })
        client.readCoils(30, 14)
        .then(function (d) {
            // console.log("PUMP : " + d.data);
            pump(d.data);
 
        })
        client.readInputRegisters(6, 4)
        .then(function (d) {
            console.log(d.data);
            // console.log(convert.convert16to32(d.data[0], d.data[1]));
            // console.log(convert.convert16to32(d.data[2], d.data[3]));
            datalive.nhiệt_độ.wetline = convert.convert16to32(d.data[0], d.data[1]);
            datalive.nhiệt_độ.hotpress = convert.convert16to32(d.data[2], d.data[3]);
        })
        readDataPLC2();
}, 1000);
// PLC2
var ip2 = "192.168.111.42";
// open connection to a tcp line
client2.connectTCP(ip2, { port: 502 });
client2.setID(1);
function readDataPLC2() {
  client2.readHoldingRegisters(0, 8)
  .then(function (d) {
      console.log(d.data);
      connect.PLC2_connect = true;
      datalive.nhiệt_độ.chiller6 = convert.convert16to32(d.data[2], d.data[3]);
      datalive.nhiệt_độ.chiller7 = convert.convert16to32(d.data[2], d.data[3]);
      datalive.nhiệt_độ.chiller5= convert.convert16to32(d.data[4], d.data[5]);
      datalive.nhiệt_độ.chiller4 = convert.convert16to32(d.data[6], d.data[7]);
  })
  .catch(function (e) {
      console.log(e);
      if (e.message =='Port Not Open')
      { 
        connect.PLC2_connect = false;
        Updatedata(connect);
      }
      client2.connectTCP(ip2, { port: 502 });
      client2.setID(1);
  })
  //4
  client2.readCoils(0, 2)
  .then(function (d) {
      Chiller4comp(d.data);
  })
  client2.readCoils(2, 2)
  .then(function (d) {
      Chiller4fan1(d.data);
  })
  client2.readCoils(4, 2)
  .then(function (d) {
      Chiller4fan2(d.data);
  })
  // 5
  client2.readCoils(6, 3)
  .then(function (d) {
    Chiller5comp(d.data);
  })
  client2.readCoils(9, 2)
  .then(function (d) {
      Chiller5fan1(d.data);
  })
  client2.readCoils(11, 2)
  .then(function (d) {
      Chiller5fan2(d.data);
  })
  client2.readCoils(13, 2)
  .then(function (d) {
      Chiller5fan3(d.data);
  })
  //6
  client2.readCoils(15, 2)
  .then(function (d) {
      Chiller7comp(d.data);
  })
  client2.readCoils(17, 2)
  .then(function (d) {
      Chiller7fan1(d.data);
  })
  client2.readCoils(19, 2)
  .then(function (d) {
      Chiller7fan2(d.data);
  })
  //7
  client2.readCoils(21, 2)
  .then(function (d) {
      Chiller6comp(d.data);
  })
  client2.readCoils(23, 2)
  .then(function (d) {
      Chiller6fan1(d.data);
  })
  client2.readCoils(25, 2)
  .then(function (d) {
      Chiller6fan2(d.data);
  })
  //nhiet do
}
function Chiller4comp(data){
  Object.keys(datalive.chill.chill4.comp).forEach((key,value) => {
    datalive.chill.chill4.comp[key] = data[value];
  });
}
function Chiller4fan1(data){
  Object.keys(datalive.chill.chill4.cooling1).forEach((key,value) => {
    datalive.chill.chill4.cooling1[key] = data[value];
  });
}
function Chiller4fan2(data){
  Object.keys(datalive.chill.chill4.cooling2).forEach((key,value) => {
    datalive.chill.chill4.cooling2[key] = data[value];
  });
}
function Chiller5comp(data){
  Object.keys(datalive.chill.chill5.comp).forEach((key,value) => {
    datalive.chill.chill5.comp[key] = data[value];
  });
}
function Chiller5fan1(data){
  Object.keys(datalive.chill.chill5.cooling1).forEach((key,value) => {
    datalive.chill.chill5.cooling1[key] = data[value];
  });
}
function Chiller5fan2(data){
  Object.keys(datalive.chill.chill5.cooling2).forEach((key,value) => {
    datalive.chill.chill5.cooling2[key] = data[value];
  });
}
function Chiller5fan3(data){
  Object.keys(datalive.chill.chill5.cooling3).forEach((key,value) => {
    datalive.chill.chill5.cooling3[key] = data[value];
  });
}
function Chiller6comp(data){
  Object.keys(datalive.chill.chill6.comp).forEach((key,value) => {
    datalive.chill.chill6.comp[key] = data[value];
  });
}
function Chiller6fan1(data){
  Object.keys(datalive.chill.chill4.cooling1).forEach((key,value) => {
    datalive.chill.chill6.cooling1[key] = data[value];
  });
}
function Chiller6fan2(data){
  Object.keys(datalive.chill.chill4.cooling2).forEach((key,value) => {
    datalive.chill.chill6.cooling2[key] = data[value];
  });
}
function Chiller7comp(data){
  Object.keys(datalive.chill.chill7.comp).forEach((key,value) => {
    datalive.chill.chill7.comp[key] = data[value];
  });
}
function Chiller7fan1(data){
  Object.keys(datalive.chill.chill7.cooling1).forEach((key,value) => {
    datalive.chill.chill7.cooling1[key] = data[value];
  });
}
function Chiller7fan2(data){
  Object.keys(datalive.chill.chill7.cooling2).forEach((key,value) => {
    datalive.chill.chill7.cooling2[key] = data[value];
  });
}
var old = new Date();
var ngay = "";
var oldmonth = 0;
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}
function vantank(data){
  datalive.van_chính.hotpress = data[0];
  datalive.van_chính.wetline = data[1];
}
function pump (data){
  Object.keys(datalive.pump).forEach((key,value) => {
    datalive.pump[key] = data[value];
  });
}
function readdata(data){
    var d = new Date();
    var day = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var month = d.getMonth();
    var year = d.getFullYear();
    var dayinmonth = daysInMonth(month, year);
    connect.time =h+':'+m+':'+s+ '-'+ day + '/' + month + '/' + year;
    try{
      // console.log(data);
      datalive.mực_nước.hotpress = data[0]/20;
      datalive.mực_nước.wetline = data[1]/20;
      datalive.nhiệt_độ.nước_về.hotpress_machine_1 = data[2]/10;
      datalive.nhiệt_độ.nước_về.hotpress_machine_2 = data[3]/10;
      datalive.nhiệt_độ.nước_về.copper_line_1 = data[4]/10;
      datalive.nhiệt_độ.nước_về.copper_line_2 = data[5]/10;
      Updatedata(datalive);
      getdataJson();
      sendMQTT(clientmqtt,datamqtt);
  }
      catch(e){console.log(e);}
}
var connect = {
  PLC1HMI_connect : 0,
  PLC2_connect : 0,
  time: 0
}
var datalive = {
  van_chính: {
      hotpress: 1,
      wetline: 0
  },
  mực_nước: {
      hotpress: 60,
      wetline: 50
  },
  nhiệt_độ: {
      hotpress: 21,
      wetline: 20,
      chiller4: 19,
      chiller5: 22,
      chiller6: 26,
      chiller7: 21,
      nước_về: {
          hotpress_machine_1: 21,
          hotpress_machine_2: 19,
          copper_line_1: 22,
          copper_line_2: 24
      }
  },
  pump: {
      1: 0,
      2: 1,
      3: 0,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1,
      9: 1,
      10: 1,
      11: 1,
      12: 1,
      13: 1,
      14: 1
  },
  chill: {
      chill4: {
          comp: {
              1: 1,
              2: 1
          },
          cooling1: {
              1: 1,
              2: 1
          },
          cooling2: {
              1: 1,
              2: 1
          }
      },
      chill5: {
          comp: {
              1: 1,
              2: 1,
              3: 1
          },
          cooling1: {
              1: 0,
              2: 1,
          },
          cooling2: {
              1: 0,
              2: 1
          },
          cooling3: {
            1: 0,
            2: 1
        }
      },
      chill6: {
          comp: {
              1: 1,
              2: 1
          },
          cooling1: {
              1: 0,
              2: 1
          },
          cooling2: {
              1: 0,
              2: 1
          }
      },
      chill7: {
          comp: {
              1: 1,
              2: 1
          },
          cooling1: {
              1: 0,
              2: 1
          },
          cooling2: {
              1: 0,
              2: 1
          }
      }
  }
}


