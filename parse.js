var nlp = require('natural');
var _ = require('underscore');
var https = require('https');
var natural = require('natural');

function parse(query)
{ 
    natural.PorterStemmer.attach();
    //tokens = natural.tokenizeAndStem();
    
    //just for debugging
    get_transactions(logData);
    
    json = JSON.stringify({ summary: "Summary", transactions: ["transactions"]});
    return json;
}

function classify(){
    classifier = new natural.BayesClassifier();
    classifier.addDocument([], 'spend');
    classifier.addDocument([], 'earn');
}

function get_data(action, timespan){
	//TODO: Something more interesting than logging
	 get_transactions(logData);
}

function logData(transactions) {
  _.each(simpleTransactionFormat(transactions), function(t) {
     console.log(JSON.stringify(t));
  });
}

function simpleTransactionFormat(obpTransactions) {    
    return _.map(obpTransactions, function(t) {
      return {
	'date' : t.details.completed,
	'amount' : t.details.value.amount,
	'currency' : t.details.value.currency,
	'otherParty' : t.other_account.holder.name
      };
    });
}

function get_transactions(callback){
  //Get transactions from Open Bank Project API
   var options = {
    hostname: 'demo.openbankproject.com',
    port: 443,
    path: '/sandbox/obp/v1.2/banks/rbs/accounts/main/public/transactions',
    method: 'GET',
    headers : { 'obp_limit': 500 }
  };
  
  https.get(options, function(res) {
    console.log('hello!');
    
    var obpData = '';
    
    res.on('data', function(d) {
	obpData += d;
	console.log('some data...');
    });
    
    res.on('end', function() {
        var json = JSON.parse(obpData);
	callback(json.transactions);
    });
    
  });
}

module.exports.parse = parse;