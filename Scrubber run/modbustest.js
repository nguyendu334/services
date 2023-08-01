
//jslint node: true 
"use strict";
const Modbus = require("hieunv_inductrial_protocol");
const net = require("net");
var dateTime = require("hieunv_inductrial_protocol/dist/node-datetime");


const socket = new net.Socket();
const options = {
  host: "127.0.0.1",
  port: "502",
};
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
socket.connect(options);
const client = new Modbus.client.RTUoverTCP(socket, 3, 1000);
setInterval(read, 1000);
function read() {
    var dt = dateTime.create();
    var formatted = dt.format("Ymd-HMS");
    if (client.connectionState == "online") {
      client
        .readCoils(0, 10)
        .then(function (resp) {
           console.log(resp.response.body.valuesAsArray.slice(0,10));
        })
        .catch(function () {
          console.error("timeout");
        });
        client
        .readHoldingRegisters(0, 10)
        .then(function (resp) {
           console.log(resp.response.body.values);
        })
        .catch(function () {
          console.error("timeout");
        });

    } else {
      console.log("Modbus is reconnect");
      try{
      socket.connect(options);
      }catch{}
    }
   
  }