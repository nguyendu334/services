class scrubber_s
{
    QHUT = false;
    Pump_TH_A = false;
    Pump_TH_B = false;
    Pump_chemical_A = false;
    Pump_chemical_B = false;
    Agigator = false;
    pH = 0;
}

class scrubber
{
    scrubber1 = new scrubber_s()
    scrubber2 = new scrubber_s()
    scrubber3= new scrubber_s()
    scrubber4 = new scrubber_s()
}
exports.scrubber = scrubber;