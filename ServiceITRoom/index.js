var net = require('net');
var client = new net.Socket();
client.connect(502, '192.168.111.144', function () {
    console.log('Connected');
});
var databf1 = [];
client.on('data', function (data) {
    // console.log('Received: ' + data.length);

    // console.log('Received: ' + data[3]);
    if (databf1.length == 87) {
        // console.log(databf1);
        console.log("------HVAC 1-----------------------------------------------  ");
        console.log("Humidity : " + convert8to16(databf1[82], databf1[83]) / 10);
        console.log("Temperature : " + convert8to16(databf1[80], databf1[81]) / 10);

        console.log("-----------------------------------------------------  ");
        dataUPDATE.HVAC1.Humi = convert8to16(databf1[82], databf1[83]) / 10;
        dataUPDATE.HVAC1.Temp = convert8to16(databf1[80], databf1[81]) / 10;
        buffer_binary = new Buffer(data);
        // console.log(buffer_binary);
        let number = (buffer_binary[4] << 8) + buffer_binary[3];
        // console.log(number);
        databf1 = [];
    }
    // ghep data
    for (let i = 0; i < data.length; i++) {
        databf1.push(data[i]);
    }
});

function convert8to16(data1, data2) {
    return (data2 << 8) + data1;
    // return data2*256 + data1;
}

var client2 = new net.Socket();
client2.connect(27001, '192.168.111.2', function () {
    console.log('Connected');
});
var databf2 = [];
client2.on('data', function (data) {
    if (databf2.length == 87) {
        console.log("------HVAC 2-----------------------------------------------  ");
        console.log("Humidity : " + convert8to16(databf2[82], databf2[83]) / 10);
        console.log("Temperature : " + convert8to16(databf2[80], databf2[81]) / 10);
        console.log("-----------------------------------------------------  ");
        
        dataUPDATE.HVAC2.Humi = convert8to16(databf2[82], databf2[83]) / 10;
        dataUPDATE.HVAC2.Temp = convert8to16(databf2[80], databf2[81]) / 10;
        databf2 = [];
    }
    for (let i = 0; i < data.length; i++) {
        databf2.push(data[i]);
    }
})
var dataUPDATE = {
    HVAC1 : {
        Humi : 50,
        Temp : 22.9
    },
    HVAC2 : {
        Humi : 57.9,
        Temp : 22.9
    },
    ts : 0
}
var dateTime = require("node-datetime");
setInterval(TimerUP, 1000);
function TimerUP() {
    const Realtime = new Date();
    var month = Realtime.getMonth() + 1;
    var tsReal = Realtime.getHours() + ":" + Realtime.getMinutes() + ":" + Realtime.getSeconds() + " " + Realtime.getDate() + "/" + month + "/" + Realtime.getFullYear();
    dataUPDATE.ts = tsReal;
    console.log(dataUPDATE);
    Updatedata(dataUPDATE);
    getdataJson();
    sendMQTT(clientmqtt, datamqtt);
}
// Json server
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(3012, () => {
  console.log('JSON Server is running')
})
var url = "http://10.100.203.78:3011/data/1";
const fetch = require("node-fetch");
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
  }

  const mqtt = require("mqtt");
  const topic_mqtt1 = "SYNOPEXVINA2/IIOT/MQTT/SERVER_HVAC_IT_ROOM";
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