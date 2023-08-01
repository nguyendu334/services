module.exports = {
    convertMeterLine1Cond12: (dataphantram) => {
        return (dataphantram * 350) / (100 * 100);
    },
    convertMeterLine1Cond34: (dataphantram) => {
        return (dataphantram * 40) / (100 * 100);
    },
    convertresistivity: (dataphantram) => {
        return (dataphantram * 10) / (100 * 100);
    },
    convertflow: (dataphantram) => {
        return (dataphantram * 15) / (100 * 100);
    },
    convertMeterLine2Cond56: (dataphantram) => {
        return dataphantram / 25;
    },
    convertMeterLine2Cond78: (dataphantram) => {
        return dataphantram / 2.85;
    },
    convert16to32: (data1, data2) => {
        var buf = new ArrayBuffer(4);
        var ints = new Uint16Array(buf);
        ints[0] = data1;
        ints[1] = data2;
        var floats = new Float32Array(buf);
        var num = floats[0];
        return num;
    }
}