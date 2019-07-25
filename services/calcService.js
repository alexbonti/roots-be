var Addition = function (a,b,callback)
{
    callback(null,a + b) 
}
var Subtraction = function (a,b,callback)
{
    callback(null,a - b) 
}
var Multiplication = function (a,b,callback)
{
    callback(null,a * b) 
}

var Division = function (a,b,callback)
{
    if(b != 0)
    {
        callback(null,a / b)  
    }
    else {
        callback(null, "Divisor can not be zero")
    }
     
}
module.exports = {
    Addition  : Addition,
    Subtraction : Subtraction,
    Multiplication : Multiplication,
    Division : Division
};