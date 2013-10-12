var _ = require('underscore');
var https = require('https');
var natural = require('natural');

function parse(query)
{ 
	//Initiate classifier
	classifier = new natural.BayesClassifier();
	init();
	//Figure out what action should be taken and for which timespan by analysing the query string
	action = get_action(query);
	timespan = get_timespan(query);
	//Return appropriate dataset in the right json format
    json = get_data(action, timespan);
    return json;
}

function get_action(query){
	natural.PorterStemmer.attach();
	tokens = query.tokenizeAndStem();
	action = classifier.classify(tokens);
	console.log("=----------- action is: " + action);
	return action;
}

function get_timespan(query){
	natural.PorterStemmer.attach();
	tokens = query.tokenizeAndStem();
	//go through the tokens, find a month, translate it to a number
	timespan = 0;
	return timespan; 
}

function get_data(action, timespan){
	all_transactions = get_transactions();
	switch (action){
		case "earn": //
			break;
		case "spend": //
			break;
		case "payment-to": //
			break;
		case "payment-from": //
			break; 
		default:
		//
	}
	var array = null
	transactions = JSON.stringify({ summary: action, transactions: array});
	return transactions;
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

//TODO: add training set
function init(){
	classifier.addDocument(['how', 'much', 'money','I', 'have', 'spent'], 'spend');
    classifier.addDocument(['how', 'much', 'money','I', 'have', 'earned'], 'earn');
    classifier.addDocument(['my', 'payment', 'from'], 'payment-from');
    classifier.addDocument(['my', 'payment', 'to'], 'payment-to');
    classifier.addDocument('payment to qqqq', 'payment-to');
    classifier.train();
}

module.exports.parse = parse;