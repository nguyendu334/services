class SMT {
    PRINTER = 0.0;
    REFLOW = 0.0;
    PRINTER_ISCONNECTED = false;
    REFLOW_ISCONNECTED = false;
}
class SMT_Enable {
    LINE_ENABLE = true;
    PRINTER_DIS_BZ = false;
    REFLOW_DIS_BZ = false;
}

class EXHAUFAN {
    RUNNING = false;
    TEMPERATURE = 0.0;
    TEMPERATURE_ISCONNECTED = false;
}

class SMTMACHINE {

    // ALarm = false;

    SMTMACHINE1 = new SMT();
    SMTMACHINE1_Enable = new SMT_Enable();
    SMTMACHINE2 = new SMT();
    SMTMACHINE2_Enable = new SMT_Enable();
    SMTMACHINE3 = new SMT();
    SMTMACHINE3_Enable = new SMT_Enable();
    SMTMACHINE4 = new SMT();
    SMTMACHINE4_Enable = new SMT_Enable();
    SMTMACHINE5 = new SMT();
    SMTMACHINE5_Enable = new SMT_Enable();
    SMTMACHINE6 = new SMT();
    SMTMACHINE6_Enable = new SMT_Enable();
    SMTMACHINE7 = new SMT();
    SMTMACHINE7_Enable = new SMT_Enable();
    SMTMACHINE8 = new SMT();
    SMTMACHINE8_Enable = new SMT_Enable();
    SMTMACHINE9 = new SMT();
    SMTMACHINE9_Enable = new SMT_Enable();
    SMTMACHINE10 = new SMT();
    SMTMACHINE10_Enable = new SMT_Enable();
    SMTMACHINE11 = new SMT();
    SMTMACHINE11_Enable = new SMT_Enable();
    SMTMACHINE12 = new SMT();
    SMTMACHINE12_Enable = new SMT_Enable();
    SMTMACHINE13 = new SMT();
    SMTMACHINE13_Enable = new SMT_Enable();
    SMTMACHINE14 = new SMT();
    SMTMACHINE14_Enable = new SMT_Enable();
    SMTMACHINE15 = new SMT();
    SMTMACHINE15_Enable = new SMT_Enable();
    SMTMACHINE16 = new SMT();
    SMTMACHINE16_Enable = new SMT_Enable();

    EXHAUFAN1 = new EXHAUFAN();
    EXHAUFAN2 = new EXHAUFAN();
    EXHAUFAN3 = new EXHAUFAN();


    timestamp = '';
    PLC_isconnected1_7 = false;
    PLC_isconnected8_16 = false;
    Exhaufan_isconnected = false;

}
exports.SMTMACHINE = SMTMACHINE;