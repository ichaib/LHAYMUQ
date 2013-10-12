var https = require('https');
var _ = require('underscore');

//store all the transactions in memory (and only for a single hardcoded account) for now
var obpData = [];

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
	console.log('some data...');
    });
    
    res.on('end', function() {
        var rawObpData = JSON.parse(data);
	obpData = _.map(rawObpData.transactions, simpleTransactionFormat);
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

module.exports.loadObpData = loadObpData;