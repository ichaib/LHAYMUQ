var https = require('https');
var _ = require('underscore');
var util = require('util');

//store all the transactions in memory (and only for a single hardcoded account) for now
var obpData = [];
var currency = "";

function loadObpData() {

  var options = {
    hostname: 'demo.openbankproject.com',
    port: 443,
    path: '/sandbox/obp/v1.2/banks/rbs/accounts/main/public/transactions',
    method: 'GET',
    headers : { 'obp_limit': 500 }
  };

  https.get(options, function(res) {
    
    var data = '';
    
    res.on('data', function(d) {
	data += d;
    });
    
    res.on('end', function() {
        var rawObpData = JSON.parse(data);
	obpData = _.map(rawObpData.transactions, simpleTransactionFormat);
  currency = obpData[0].currency;
  if (currency == 'GBP') currency = "£";
    });
    
  });

}

function simpleTransactionFormat(t) {    
    return {
	'date' : Date.parse(t.details.completed),
	'amount' : parseFloat(t.details.value.amount),
	'currency' : t.details.value.currency,
	'otherParty' : t.other_account.holder.name
    };
}

/**
 * @startDate a date, e.g. Date.parse("2012-10-29T00:00:00Z")
 * @endDate a date, e.g. Date.parse("2012-12-21T00:00:00Z")
 */
function withinDateRange(obpTransactions, startDate, endDate) {
  return _.filter(obpTransactions, function(t) {
    return t.date > startDate && t.date < endDate;
  });
}

/**
 * @amount number
 */
function greaterThan(obpTransactions, amount) {
  return _.filter(obpTransactions, function(t) {
    return t.amount > amount;
  });
}

/**
 * @amount number
 */
function lessThan(obpTransactions, amount) {
  return _.filter(obpTransactions, function(t) {
    return t.amount < amount;
  });
}

function to(obpTransactions, other_account) {
  console.log("Account to be searched: " + other_account);
  return _.filter(obpTransactions, function(t) {
    console.log("Other Party log: " + t.otherParty);
    return t.otherParty.toLowerCase().indexOf(other_account.toLowerCase())!= -1;
    //return _.contains(t.otherParty, other_account);
  });
}

function get_spending(startDate, endDate){
  transactions = withinDateRange(lessThan(obpData, 0), startDate, endDate);
  sum = _.reduce(transactions, function(a, b){  return a+ Math.abs(b.amount)}, 0);
  return {"sum":currency + sum.toFixed(2) , "transactions":transactions};
}

function get_earning(startDate, endDate){
  transactions = withinDateRange(greaterThan(obpData, 0), startDate, endDate);
  sum = _.reduce(transactions, function(a, b){  return a+ Math.abs(b.amount)}, 0);
  return {"sum":currency + sum.toFixed(2) , "transactions":transactions};
}

function get_payments_to(startDate, endDate, other_account){
  
  tr = withinDateRange(lessThan(obpData, 0), startDate, endDate);
  transactions = to(tr, other_account);
  sum = _.reduce(transactions, function(a, b){  return a+ Math.abs(b.amount)}, 0);
  return {"sum":currency + sum.toFixed(2) , "transactions":transactions};
}

function get_payments_from(startDate, endDate, other_account){
  
  tr = withinDateRange(greaterThan(obpData, 0), startDate, endDate);
  transactions = to(tr, other_account);
  console.log("XXXXXXXXXXXXX Transaction payment object : " + util.inspect(transactions));
  sum = _.reduce(transactions, function(a, b){  return a+ Math.abs(b.amount) }, 0);
  return {"sum": currency + sum.toFixed(2) , "transactions":transactions};
}



module.exports.loadObpData = loadObpData;
module.exports.get_spending = get_spending;
module.exports.get_earning = get_earning;
module.exports.get_payments_from = get_payments_from;
module.exports.get_payments_to = get_payments_to;
