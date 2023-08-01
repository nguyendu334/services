module.exports = {
    UintToint: (values) => {
        if(values>= 32768){
            return values-65536
        }
        else
            return values
    }
}