var _ = require('underscore');
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
		case "earn": // obp.earn.timespan(start, end)
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
	//TODO: search the data, or something
	return {"summary" : "Summary", "transactions" : ["transactions"]};
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