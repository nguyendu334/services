/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.

Save the following server in example.js:
*/

//var net = require('net');

/*var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');*/

/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.

$ netcat 127.0.0.1 1337

You should see:
> Echo server

*/

/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */


//npm install -g mocha
//npm i node-datetime
//npm i mqtt
//npm i json-server
//npm i xhr2
var net = require('net');
const mqtt = require("mqtt");
const jsonServer = require("json-server");
var fs = require("fs");
var XMLHttpRequest = require("xhr2");



var dateTime = require("node-datetime");

var HVAC1_ip='192.168.111.2';
var HVAC1_port=27001;
var HVAC2_ip='192.168.111.144';
var HVAC2_port=502;
var Local_ip='127.0.0.1';
const pathlog = 'Logfile/';

//var data_realtime=[];
//var data_int32=[];
var dataon=[];
var dataon2=[];
var datalog1='';
var datalog2='';
//==========================mqtt==============================
const topic_mqtt1 = "SYNOPEXVINA2/IIOT/MQTT/SERVER_HVAC1";
const topic_mqtt2 = "SYNOPEXVINA2/IIOT/MQTT/SERVER_HVAC2";
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
//=========================tcp1===============================
var client = new net.Socket();
client.on('data', function(data) {
	System_data_HVAC1.bf=0;
	var dt = dateTime.create();
	System_data_HVAC1.DATAtime = dt.format("Y/m/d-H:M:S");
	dataon = data;
	console.log('Received1: ' + data.length);
	/*if(data.length==87)
	if(data[0] == 0x53)
	{
		data_realtime = [];
		data_int32 = [];
		var a = data[1];
		for(var i=3;i<data.length;i++)
		{
			data_realtime.push(data[i]);
		}
		for(var i=0;i<data_realtime.length;i++)
		{
			if(i%2==1)
			{
				data_int32.push(data_realtime[i-1] + data_realtime[i]*256);
			}
		}
		console.log(data_int32);
		console.log(data_realtime);

	}
	//client.destroy(); // kill client after server's response
	*/
});
client.on('close', function() {
	console.log('Connection closed');
	System_data_HVAC1.Server_isconnect = false;
});
client.on('error', function() {
	console.log('Connection erreo');
	//System_data_HVAC1.Server_isconnect = false;
});
//========================================================
var data_ghep=[];

//=========================tcp2===============================
var client2 = new net.Socket();
client2.on('data', function(data) {
	//data_ghep=[];
	System_data_HVAC2.bf=0;
	var dt = dateTime.create();
	System_data_HVAC2.DATAtime = dt.format("Y/m/d-H:M:S");
	if(data[0]==83 & data[1]==0 & data[2]==1)
	{
		data_ghep=[];
		//data_ghep = data;
	}

		for(var i=0;i<data.length;i++)
		{
			data_ghep.push(data[i]);
		}

	
if(data_ghep.length>80)
{
	dataon2 = data_ghep;
	console.log('Received2: ' + data.length +' -dataghep: '+data_ghep.length);
}
	/*if(data.length==87)
	if(data[0] == 0x53)
	{
		data_realtime = [];
		data_int32 = [];
		var a = data[1];
		for(var i=3;i<data.length;i++)
		{
			data_realtime.push(data[i]);
		}
		for(var i=0;i<data_realtime.length;i++)
		{
			if(i%2==1)
			{
				data_int32.push(data_realtime[i-1] + data_realtime[i]*256);
			}
		}
		console.log(data_int32);
		console.log(data_realtime);

	}
	//client.destroy(); // kill client after server's response
	*/
});
client2.on('close', function() {
	console.log('Connection2 closed');
	System_data_HVAC2.Server_isconnect = false;
});
client2.on('error', function() {
	console.log('Connection2 erreo');
	//System_data_HVAC1.Server_isconnect = false;
});
//========================================================
client.connect(HVAC1_port, HVAC1_ip, function() {
	console.log('Connected1');
	System_data_HVAC1.Server_isconnect = true;
	//client.write('Hello, server! Love, Client.');
});
client2.connect(HVAC2_port, HVAC2_ip, function() {
	console.log('Connected2');
	System_data_HVAC2.Server_isconnect = true;
	//client.write('Hello, server! Love, Client.');
});
/////////////////////////////////////////////////////////////////////////////////////////
class Data_Form{
	constructor(Value, Digit, Detail) {
		this._Value = Value;
		this._Digit = Digit;
		this._Detail = Detail;
	  }
}
class Data_Realtime {
	_ID_Number = new Data_Form(0,'','장비번호: số thiết bị');
	_Khoiphucmatdien = new Data_Form(0.0,'s','정전복귀: khôi phục mất điện');
	_Stop_Delay = new Data_Form(0.0,'s','정지지연: stopdelay');


	_Set_Temperature = new Data_Form(0.0,'C','설정온도: nhiệt độ cài đặt');
	_Set_Humidity = new Data_Form(0.0,'%','설정습도: độ ẩm cài đặt');
	_Set_dolech_Cool = new Data_Form(0.0,'C','');
	_Set_dolech_Heat = new Data_Form(0.0,'C','');
	_Set_dolect_Humi = new Data_Form(0.0,'%','');
	_Set_dolect_Dehumi =new Data_Form(0.0,'%','');

	_Runtime_Comp1 = new Data_Form(0.0,'','');
	_Runtime_Comp2 = new Data_Form(0.0,'','');
	_Runtime_Heater1 = new Data_Form(0.0,'','');
	_Runtime_Heater2 = new Data_Form(0.0,'','');
	_Runtime_Heater3 = new Data_Form(0.0,'','');
	_Runtime_Heater4 = new Data_Form(0.0,'','');
	_Runtime_Heater5 = new Data_Form(0.0,'','');
	_Runtime_Humidity1 = new Data_Form(0.0,'','');
	_Runtime_Humidity2 = new Data_Form(0.0,'','');


	_Set_Voltage = new Data_Form(380,'V','설정전압: điện áp cài đặt');
	_Set_Wattage = new Data_Form(0.0,'Kg/h','설정용량: công suất cài đặt');
	_Set_recovery_capacity =new Data_Form(0,'Time','배수회수: số lần xả nước');
	_Set_Comp_Alarm = new Data_Form(0,'s','콤프알람: comp alarm');
	_Comp_delay = new Data_Form(0,'s','콤프지연: delay comp');
	_Heat_delay = new Data_Form(0,'s','히팅지연: delay heating');
	_Set_high_temp = new Data_Form(0.0,'C','고온경보: cảnh báo nhiệt độ cao');


	_Temperature_Value = new Data_Form(0.0,'C','현재온도: nhiệt độ hiện tại');
	_Humididy_Value = new Data_Form(0.0,'%','현재습도: độ ẩm hiện tại');


  }
  class Data_DO {
	  _Fan_Blower = false;
	  _Solenoid_valve1 =false;
	  _COMP1=false;
	  _Solenoid_valve2 =false;
	  _COMP2=false;
	  _Heater1=false;
	  _Heater2=false;
	  _Heater3=false;
	  _Heater4=false;
	  _Heater5=false;
	  _Humidification1=false;
	  _Humidification2=false;
	  _Water_supply=false;
	  _Drainage =false;
	  _General_alarm = false;
	 
  }
  class Data_json {
	id = 1;
	timeStamp = "";
	DATAtime = "";
	bf=0;
	Data_Realtime = new Data_Realtime();
	Data_DO = new Data_DO();
	HVAC_isconnect = false;
	Server_isconnect = false;
  }
  function int32(a,b)
  {
	  return a + b*256;
  }
///////////////////////////////////////////////////////////////////////////////////////////
var System_data_HVAC1 = new Data_json();
var System_data_HVAC2 = new Data_json();
setInterval(timer, 3000);
var data_old1=[];
var data_old2=[];
function timer()
{
	
	updateDataHVAC(System_data_HVAC1,data_old1,dataon);
	updateDataHVAC(System_data_HVAC2,data_old2,dataon2);
	if(!System_data_HVAC1.Server_isconnect)
	{
		client.destroy();
		console.log('disconnecting');
		client.connect(HVAC1_port, HVAC1_ip, function() {
			console.log('Connected');
			System_data_HVAC1.Server_isconnect = true;
		});
	}
	if(!System_data_HVAC2.Server_isconnect)
	{
		client2.destroy();
		console.log('disconnecting');
		client2.connect(HVAC2_port, HVAC2_ip, function() {
			console.log('Connected');
			System_data_HVAC2.Server_isconnect = true;
		});
	}
	var dt = dateTime.create();
	System_data_HVAC1.timeStamp = dt.format("Y/m/d-H:M:S");
	System_data_HVAC2.timeStamp = dt.format("Y/m/d-H:M:S");

	System_data_HVAC1.id = 1;
	System_data_HVAC2.id = 2;
	datalog1 = System_data_HVAC1.Data_Realtime._Set_Temperature._Value + ',' +
	System_data_HVAC1.Data_Realtime._Set_Humidity._Value+ ',' +
	System_data_HVAC1.Data_Realtime._Humididy_Value._Value + ',' +
	System_data_HVAC1.Data_Realtime._Temperature_Value._Value + ',' +
	System_data_HVAC1.Data_DO._Fan_Blower + ',' +
	System_data_HVAC1.Data_DO._Solenoid_valve1 + ',' +
	System_data_HVAC1.Data_DO._COMP1 + ',' +
	System_data_HVAC1.Data_DO._Solenoid_valve2 + ',' +
	System_data_HVAC1.Data_DO._COMP2 + ',' +
	System_data_HVAC1.Data_DO._Heater1 + ',' +
	System_data_HVAC1.Data_DO._Heater2 + ',' +
	System_data_HVAC1.Data_DO._Heater3 + ',' +
	System_data_HVAC1.Data_DO._Heater4 + ',' +
	System_data_HVAC1.Data_DO._Heater5 + ',' +
	System_data_HVAC1.Data_DO._Humidification1 + ',' +
	System_data_HVAC1.Data_DO._Humidification2 + ',' +
	System_data_HVAC1.Data_DO._Water_supply + ',' +
	System_data_HVAC1.Data_DO._Drainage + ',' +
	System_data_HVAC1.Data_DO._General_alarm;
	datalog2 = System_data_HVAC2.Data_Realtime._Set_Temperature._Value + ',' +
	System_data_HVAC2.Data_Realtime._Set_Humidity._Value+ ',' +
	System_data_HVAC2.Data_Realtime._Humididy_Value._Value + ',' +
	System_data_HVAC2.Data_Realtime._Temperature_Value._Value + ',' +
	System_data_HVAC2.Data_DO._Fan_Blower + ',' +
	System_data_HVAC2.Data_DO._Solenoid_valve1 + ',' +
	System_data_HVAC2.Data_DO._COMP1 + ',' +
	System_data_HVAC2.Data_DO._Solenoid_valve2 + ',' +
	System_data_HVAC2.Data_DO._COMP2 + ',' +
	System_data_HVAC2.Data_DO._Heater1 + ',' +
	System_data_HVAC2.Data_DO._Heater2 + ',' +
	System_data_HVAC2.Data_DO._Heater3 + ',' +
	System_data_HVAC2.Data_DO._Heater4 + ',' +
	System_data_HVAC2.Data_DO._Heater5 + ',' +
	System_data_HVAC2.Data_DO._Humidification1 + ',' +
	System_data_HVAC2.Data_DO._Humidification2 + ',' +
	System_data_HVAC2.Data_DO._Water_supply + ',' +
	System_data_HVAC2.Data_DO._Drainage + ',' +
	System_data_HVAC2.Data_DO._General_alarm;

	update_server("http://"+Local_ip+":3000/data/1", JSON.stringify(System_data_HVAC1));
	update_server("http://"+Local_ip+":3000/data/2", JSON.stringify(System_data_HVAC2));
  if (clientmqtt.connected)
  {
    clientmqtt.publish(
      topic_mqtt1,
      JSON.stringify(System_data_HVAC1),
      { qos: 0, retain: true },
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
	clientmqtt.publish(
		topic_mqtt2,
		JSON.stringify(System_data_HVAC2),
		{ qos: 0, retain: true },
		(error) => {
		  if (error) {
			console.error(error);
		  }
		}
	  );
  }

  creatfile(datalog1, datalog2);
}
var timehientai1=0;
var timehientai2=0;
function creatfile(datalog1,datalog2) {
	var title =
	  "DATE,TIME," +
	  "Temp_SET,"+
	  "Humi_SET,"+
	  "Temperature,"+
	  "Humidity,"+
	  "Fan_Blower,"+
      "Solenoid_valve1,"+
      "COMP1,"+
      "Solenoid_valve2,"+
      "COMP2,"+
      "Heater1,"+
      "Heater2,"+
      "Heater3,"+
      "Heater4,"+
      "Heater5,"+
      "Humidification1,"+
      "Humidification2,"+
      "Water_supply,"+
      "Drainage,"+
      "General_alarm";
  
	var dt = dateTime.create();
	var formatted = dt.format("Ymd");
	var _date = dt.format("Y/m/d");
	var _time = dt.format("H:M:S");
	//const path_Event = pathlog + "/HVAC_Event_LOG_" + formatted + ".csv";
	const path_checksheet1 = pathlog + "/HVAC1_Checksheet_LOG_" + formatted + ".csv";
	const path_checksheet2 = pathlog + "/HVAC2_Checksheet_LOG_" + formatted + ".csv";
	if (datalog1 != '0,0,0,0,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false') {
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
	if (datalog2 !='0,0,0,0,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false') {
		if (timehientai2 != dt.format("H")) {
		  try {
			if (fs.existsSync(path_checksheet2)) {
			  //file exists
			} else {
			  fs.appendFile(path_checksheet2, title + "\r\n", function (err) {
				if (err) throw err;
				//console.log('Saved!');
			  });
			}
			fs.appendFile(
			  path_checksheet2,
			  "'" + _date + "," + "'" + _time + "," + datalog2 + "\r\n",
			  function (err) {
				// if (err) throw err;
				//console.log('Saved!');
			  }
			);
			timehientai2 = dt.format("H");
		  } catch (err) {
			console.error(err);
		  }
		}
	  }
  }
function updateDO(params,data) {
	var number = data.toString(2);
	var _m_digit='';
	for(var i=0;i<16-number.length;i++)
	{
		_m_digit += '0';
	}
	number = _m_digit + number;
	var array = []
            for (var i = 15; i > -1; --i) {
				if(number.charCodeAt(i)==0x30)
                array.push(false);
				else
				array.push(true);
            }
	params._Fan_Blower = array[0];
	params._Solenoid_valve1 =array[1];
	params._COMP1=array[2];
	params._Solenoid_valve2 =array[3];
	params._COMP2=array[4];
	params._Heater1=array[5];
	params._Heater2=array[6];
	params._Heater3=array[7];
	params._Heater4=array[8];
	params._Heater5=array[9];
	params._Humidification1=array[10];
	params._Humidification2=array[11];
	params._Water_supply=array[12];
	params._Drainage =array[13];
	params._General_alarm = array[14];
}
function updateDataHVAC(HVAC,databf_old,dataon) {
	HVAC.bf++;
	if(HVAC.bf>4)
	{
		HVAC.bf = 11;
		HVAC.HVAC_isconnect = false;
	}
	else
	HVAC.HVAC_isconnect = true;

	if(HVAC.HVAC_isconnect)
	{
		if(dataon.length>80)
		if(databf_old != dataon)
		{
			HVAC.Data_Realtime._Set_Temperature._Value = (int32(dataon[3],dataon[4])/10.0).toFixed(1);
			HVAC.Data_Realtime._Set_Humidity._Value = (int32(dataon[5],dataon[6])/10.0).toFixed(1);
			HVAC.Data_Realtime._Runtime_Humidity1._Value = (int32(dataon[45],dataon[46])).toFixed(0);
			HVAC.Data_Realtime._Runtime_Humidity2._Value = (int32(dataon[47],dataon[48])).toFixed(0);

			HVAC.Data_Realtime._Temperature_Value._Value = (int32(dataon[80],dataon[81])/10.0).toFixed(1);
			HVAC.Data_Realtime._Humididy_Value._Value = (int32(dataon[82],dataon[83])/10.0).toFixed(1);
			updateDO(HVAC.Data_DO,dataon[54]);

			HVAC.Data_Realtime._Khoiphucmatdien._Value = dataon[7];
			HVAC.Data_Realtime._Stop_Delay._Value = dataon[8];
			HVAC.Data_Realtime._Set_dolech_Cool._Value = (dataon[26]/10.0).toFixed(1);
			HVAC.Data_Realtime._Set_dolech_Heat._Value = (dataon[27]/10.0).toFixed(1);
			HVAC.Data_Realtime._Set_dolect_Humi._Value = (dataon[28]/10.0).toFixed(1);
			HVAC.Data_Realtime._Set_dolect_Dehumi._Value = (dataon[29]/10.0).toFixed(1);


			HVAC.Data_Realtime._Set_Wattage._Value = dataon[16];
			HVAC.Data_Realtime._Set_recovery_capacity._Value =dataon[17];
			HVAC.Data_Realtime._Set_Comp_Alarm._Value = dataon[9];
			HVAC.Data_Realtime._Comp_delay._Value =dataon[18];
			HVAC.Data_Realtime._Heat_delay._Value = dataon[19];
			HVAC.Data_Realtime._Set_high_temp._Value = (int32(dataon[49],dataon[50])/10.0).toFixed(1);

			HVAC.Data_Realtime._Runtime_Comp1._Value = (int32(dataon[31],dataon[32])).toFixed(0);
			HVAC.Data_Realtime._Runtime_Comp2._Value = (int32(dataon[33],dataon[34])).toFixed(0);
			HVAC.Data_Realtime._Runtime_Heater1._Value = (int32(dataon[35],dataon[36])).toFixed(0);
			HVAC.Data_Realtime._Runtime_Heater2._Value = (int32(dataon[37],dataon[38])).toFixed(0);
			HVAC.Data_Realtime._Runtime_Heater3._Value = (int32(dataon[39],dataon[40])).toFixed(0);
			HVAC.Data_Realtime._Runtime_Heater4._Value = (int32(dataon[41],dataon[42])).toFixed(0);
			HVAC.Data_Realtime._Runtime_Heater5._Value = (int32(dataon[43],dataon[44])).toFixed(0);
			databf_old = dataon;
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
  httpserver(3000, "db.json");

