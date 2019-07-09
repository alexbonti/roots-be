var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var Service = require('../../services');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

var calcFunction = function(payloadData,callback) {
    var sum, sub, product, division;
    Service.CalcService.Addition(payloadData.number1 , payloadData.number2, function(err,data){
        sum = data;
    })
    Service.CalcService.Subtraction(payloadData.number1 , payloadData.number2, function(err,data){
        sub = data;
    })
    Service.CalcService.Multiplication(payloadData.number1 , payloadData.number2, function(err,data){
        product = data;
    })
    Service.CalcService.Division(payloadData.number1 , payloadData.number2, function(err,data){
        division = data;
    })
    var data = {
        number1: payloadData.number1,
        number2: payloadData.number2,
        Sum:sum ,
        Subtraction : sub,
        Muliplication : product,
        Division : division
        //subtract:payloadData.number1 - payloadData.number2,
        //multiply:payloadData.number1 * payloadData.number2

    } 

  callback(null,data) ;
};

module.exports = {
    calcFunction: calcFunction
};
