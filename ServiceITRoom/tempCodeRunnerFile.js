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