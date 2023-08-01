
var RawwaterTank = {
    id: 1,
    ConnectRawwaterTank: 1,
    dataRawwaterTank: {
      Level: 0,
    },
    dataPump:{
      RawPumpA :0,
      RawPumpC :0,
      RawPumpB :0
    }
  };
async function read3() {
    if (client3.connectionState == "online") {
      await client3
        .readHoldingRegisters(2, 2)
        .then(function (resp) {
          var data1 = resp.response.body.valuesAsArray;
          RawwaterTank.ConnectRawwaterTank = true;
          RawwaterTank.dataRawwaterTank.Level = data1[0];
        })
      await client3
        .readCoils(23, 3)
        .then(function (resp) {
          var data2 = resp.response.body.valuesAsArray;
          RawwaterTank.ConnectRawwaterTank = true;
          RawwaterTank.dataPump.RawPumpA = data2[0];
          RawwaterTank.dataPump.RawPumpC = data2[1];
          RawwaterTank.dataPump.RawPumpB = data2[2];
        })
        .catch(function () {
          console.error("timeout");
          RawwaterTank.ConnectRawwaterTank = false;
        });
    } else {
      console.log("Modbus is reconnect");
      socket3.connect(options3);
    }
    await Updatedata(RawwaterTank);
  }