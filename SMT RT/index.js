var ModbusRTU = require("modbus-serial");
var dateTime = require("node-datetime");
const SMT = require('./SMT');
const jsonServer = require("json-server");
var XMLHttpRequest = require("xhr2");
const mqtt = require("mqtt");

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

function sendMQTT(clientmqtt, _SMTMACHINE) {
    var loi = false;
    if (clientmqtt.connected) {
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
        if (!loi) {
            console.log("mqtt send OK");
        }
        else
            console.log("mqtt send NG");
    }
}

//========================================================

var _SMTMACHINE = new SMT.SMTMACHINE()

var SECSIONRP1_7 = new ModbusRTU();
var SECSIONRP8_16 = new ModbusRTU();
var SECSIONREXHAUT = new ModbusRTU();
try {
    SECSIONRP1_7.connectRTUoverTCP("192.168.111.21", { port: 502 });
} catch (error) {

}
try {
    SECSIONREXHAUT.connectTcpRTUBuffered("192.168.111.26", { port: 502 });
} catch (error) {

}
try {
    SECSIONRP8_16.connectRTUoverTCP("192.168.111.25", { port: 502 });
} catch (error) {

}

//SECSIONRP1_7 .connectTCP("127.0.0.1", { port: 502 });

//SECSIONRP1_7 .setID(9);
SECSIONRP1_7.setTimeout(1000);
SECSIONRP8_16.setTimeout(1000);
SECSIONREXHAUT.setID(1);
SECSIONREXHAUT.setTimeout(1000);



const plc1 = async () => {
    try {
        var dt = dateTime.create();
        var formatted = dt.format("Ymd-HMS");
        _SMTMACHINE.timestamp = formatted;


        console.log("===================" + formatted + "=====================");

        await DATA_SMT(SECSIONRP1_7, 8, '4x', 9, '4x', _SMTMACHINE.SMTMACHINE1, "SMTMACHINE1");
        await DATA_SMT(SECSIONRP1_7, 7, '4x', 10, '4x', _SMTMACHINE.SMTMACHINE2, "SMTMACHINE2");
        await DATA_SMT(SECSIONRP1_7, 6, '4x', 11, '4x', _SMTMACHINE.SMTMACHINE3, "SMTMACHINE3");
        await DATA_SMT(SECSIONRP1_7, 5, '4x', 12, '4x', _SMTMACHINE.SMTMACHINE4, "SMTMACHINE4");
        await DATA_SMT(SECSIONRP1_7, 4, '4x', 13, '4x', _SMTMACHINE.SMTMACHINE5, "SMTMACHINE5");
        await DATA_SMT(SECSIONRP1_7, 3, '4x', 14, '4x', _SMTMACHINE.SMTMACHINE6, "SMTMACHINE6");
        await DATA_SMT(SECSIONRP1_7, 1, '4x', 15, '4x', _SMTMACHINE.SMTMACHINE7, "SMTMACHINE7");

        await DATA_SMT(SECSIONRP8_16, 1, '4x', 10, '4x', _SMTMACHINE.SMTMACHINE8, "SMTMACHINE8");
        await DATA_SMT(SECSIONRP8_16, 2, '4x', 11, '4x', _SMTMACHINE.SMTMACHINE9, "SMTMACHINE9");
        await DATA_SMT(SECSIONRP8_16, 3, '4x', 12, '4x', _SMTMACHINE.SMTMACHINE10, "SMTMACHINE10");
        await DATA_SMT(SECSIONRP8_16, 4, '4x', 13, '4x', _SMTMACHINE.SMTMACHINE11, "SMTMACHINE11");
        await DATA_SMT(SECSIONRP8_16, 5, '4x', 14, '4x', _SMTMACHINE.SMTMACHINE12, "SMTMACHINE12");
        await DATA_SMT(SECSIONRP8_16, 6, '4x', 15, '4x', _SMTMACHINE.SMTMACHINE13, "SMTMACHINE13");
        await DATA_SMT(SECSIONRP8_16, 7, '4x', 16, '4x', _SMTMACHINE.SMTMACHINE14, "SMTMACHINE14");
        await DATA_SMT(SECSIONRP8_16, 8, '4x', 17, '4x', _SMTMACHINE.SMTMACHINE15, "SMTMACHINE15");
        await DATA_SMT(SECSIONRP8_16, 9, '4x', 18, '4x', _SMTMACHINE.SMTMACHINE16, "SMTMACHINE16");
        await READDATAEXHAU(SECSIONRP8_16, 19, '3x', _SMTMACHINE.EXHAUFAN1, "EXHAUFAN1");
        await READDATAEXHAU(SECSIONRP8_16, 20, '3x', _SMTMACHINE.EXHAUFAN2, "EXHAUFAN2");
        await READDATAEXHAU(SECSIONRP8_16, 21, '4x', _SMTMACHINE.EXHAUFAN3, "EXHAUFAN3");
        // await update_server("http://127.0.0.1:3009/data/1",JSON.stringify(_SMTMACHINE))

        // wait 100ms before get another device
        //await sleep(100);
        //}
    } catch (e) {
        // if error, handle them here (it should not)
        console.log(e)
    } finally {
        // after get all data from salve repeate it again
        setImmediate(() => {
            plc1();
            //plc2();
        })
    }
}
async function plc_exhau() {
    if (SECSIONREXHAUT.isOpen) {
        SECSIONREXHAUT.readCoils(0, 3, function (err, data) {
            try {
            //    console.log('data: ',data.data);
                _SMTMACHINE.EXHAUFAN1.RUNNING = data.data[0];
                _SMTMACHINE.EXHAUFAN2.RUNNING = data.data[1];
                _SMTMACHINE.EXHAUFAN3.RUNNING = data.data[2];
            } catch (error) {

            }

        });
    }
    else {
        console.log("exhau is reconnect");
        try {

            await sleep(1000);
            if (SECSIONREXHAUT.isOpen != true)
                SECSIONREXHAUT.connectTcpRTUBuffered(SECSIONREXHAUT._port.connectOptions.host, { port: SECSIONREXHAUT._port.connectOptions.port });

        } catch (error) {
            //await sleep(1000);
        }
    }
}

async function READDATAEXHAU(session, id, fun1, EXHAUFAN, EXHuaname) {
    if (fun1 == '4x') {
        try {
            await sleep(100);
            await session.setID(id);
            // read the 1 registers starting at address 0 (first register)
            let val = await session.readHoldingRegisters(1, 1);
            // return the value
            EXHAUFAN.TEMPERATURE = val.data[0] / 10.0;
            EXHAUFAN.TEMPERATURE_ISCONNECTED = true;

        } catch (e) {
            EXHAUFAN.TEMPERATURE_ISCONNECTED = false;
//EXHAUFAN.TEMPERATURE = 0;
        }
    }
    else {
        try {
            await sleep(100);
            await session.setID(id);
            // read the 1 registers starting at address 0 (first register)
            let val = await session.readInputRegisters(1000, 1);
            // return the value
            EXHAUFAN.TEMPERATURE = val.data[0] / 10.0;
            EXHAUFAN.TEMPERATURE_ISCONNECTED = true;

        } catch (e) {
            EXHAUFAN.TEMPERATURE_ISCONNECTED = false;
//EXHAUFAN.TEMPERATURE = 0;
        }
    }

    PATCHupdate_server("http://127.0.0.1:3009/data/1", "{" + "\"" + EXHuaname + "\"" + ":" + JSON.stringify(EXHAUFAN) + "}");
}
async function READDATAREFLOW(session, id, fun1, SMT) {
    if (fun1 == '4x') {
        try {
            await sleep(100);
            await session.setID(id);
            // read the 1 registers starting at address 0 (first register)
            let val = await session.readHoldingRegisters(1, 1);
            // return the value
            SMT.REFLOW = val.data[0] / 10.0;
            SMT.REFLOW_ISCONNECTED = true;

        } catch (e) {
            SMT.REFLOW_ISCONNECTED = false;
//SMT.REFLOW = 0;
        }
    }
    else {
        try {
            await sleep(100);
            await session.setID(id);
            // read the 1 registers starting at address 0 (first register)
            let val = await session.readInputRegisters(1000, 1);
            // return the value
            SMT.REFLOW = val.data[0] / 10.0;
            SMT.REFLOW_ISCONNECTED = true;

        } catch (e) {
            SMT.REFLOW_ISCONNECTED = false;
//SMT.REFLOW = 0;
        }
    }
}
async function READDATAPRINTER(session, id, fun1, SMT) {
    if (fun1 == '4x') {
        try {
            await sleep(100);
            await session.setID(id);
            // read the 1 registers starting at address 0 (first register)
            let val = await session.readHoldingRegisters(1, 1);
            // return the value
            SMT.PRINTER = val.data[0] / 10.0;
            SMT.PRINTER_ISCONNECTED = true;

        } catch (e) {
            SMT.PRINTER_ISCONNECTED = false;
 //SMT.PRINTER =0;
        }
    }
    else {
        try {
            await sleep(100);
            await session.setID(id);
            // read the 1 registers starting at address 0 (first register)
            let val = await session.readInputRegisters(1000, 1);
            // return the value
            SMT.PRINTER = val.data[0] / 10.0;
            SMT.PRINTER_ISCONNECTED = true;

        } catch (e) {
            SMT.PRINTER_ISCONNECTED = false;
// SMT.PRINTER = 0;
        }
    }
}
const DATA_SMT = async (session, ID_reflow, fun1, ID_printer, fun2, SMT, SMTname) => {

    if (session.isOpen == true) {
        await READDATAREFLOW(session, ID_reflow, fun1, SMT);

        await READDATAPRINTER(session, ID_printer, fun2, SMT);
        console.log( SMT.REFLOW + " " + SMT.PRINTER);

        PATCHupdate_server("http://127.0.0.1:3009/data/1", "{" + "\"" + SMTname + "\"" + ":" + JSON.stringify(SMT) + "}");
    } else {
        console.log("m_plc is reconnect");
        try {
            await sleep(1000);
            if (session.isOpen != true)
                session.connectRTUoverTCP(session._port.connectOptions.host, { port: session._port.connectOptions.port });

        } catch (error) {
            //await sleep(1000);
        }
    }


}



const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// start get value
plc1();
setInterval(update, 1000);
async function update() {
    if (SECSIONRP1_7.isOpen == true) {
        _SMTMACHINE.PLC_isconnected1_7 = true;
    }
    else {
        _SMTMACHINE.PLC_isconnected1_7 = false;
    }

    if (SECSIONRP8_16.isOpen == true) {
        _SMTMACHINE.PLC_isconnected8_16 = true;
    }
    else {
        _SMTMACHINE.PLC_isconnected8_16 = false;
    }

    if (SECSIONREXHAUT.isOpen == true) {
        _SMTMACHINE.Exhaufan_isconnected = true;

    }
    else {
        _SMTMACHINE.Exhaufan_isconnected = false;
    }
    var dt = dateTime.create();
    var formatted = dt.format("Ymd-HMS");
    _SMTMACHINE.timestamp = formatted;

    var data = '{"timestamp":"' + _SMTMACHINE.timestamp + '",' +
        '"PLC_isconnected1_7":' + _SMTMACHINE.PLC_isconnected1_7 + ',' +
        '"PLC_isconnected8_16":' + _SMTMACHINE.PLC_isconnected8_16 + ',' +
        '"Exhaufan_isconnected":' + _SMTMACHINE.Exhaufan_isconnected +
        '}';
    PATCHupdate_server("http://127.0.0.1:3009/data/1", data);
    timer();
    sendMQTT(clientmqtt, datamqtt);


    await plc_exhau();


}

//setInterval(setalarm,1000);
function setalarm() {
    for (var i = 1; i < 16; i++) {
        _SMTMACHINE["SMTMACHINE" + i].ALarm = Getalarm(_SMTMACHINE["SMTMACHINE" + i]);
    };
}

function Getalarm(SMT) {
    var buf = 0;
    if (!SMT.REFLOW_DIS_BZ) {
        if (SMT.PRINTER > 70.0)
            buf++;
    }

    if (!SMT.PRINTER_DIS_BZ) {
        if (SMT.PRINTER > 26 | SMT.PRINTER < 20)
            buf++;
    }

    if (buf != 0)
        return true;
    else
        return false;
}
var datamqtt = [];
function timer() {

    getJSON("http://127.0.0.1:3009/data/1", function (err, data) {
        if (err != null) {
            console.error(err);
        } else {
            // console.log(data);
            datamqtt = data;
        }
    });
}
var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";

    xhr.onreadystatechange = function () {
        var status = xhr.status;
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {



                callback(null, xhr.response);
            } else {
                callback(status);
            }
        }
    };
    xhr.send();
};

async function PATCHupdate_server(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("PATCH", url); //PATCH//POST

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // console.log(xhr.status);
            // console.log(xhr.responseText);
        }
    };

    //var data = '{"abc":"sdfsdf"}';

    await xhr.send(data);
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
httpserver(3009, "db.json");