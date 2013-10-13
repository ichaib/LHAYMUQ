var _ = require('underscore');
var natural = require('natural');
var nlp = require('nlp-node-master');
var date_extractor = require('./date_extractor.js');
var util = require('util');
var obp = require('./obpdata.js');


function parse(query)
{
	//Initiate classifier
	classifier = new natural.BayesClassifier();
	init();
	var json;
	if (query){
		json = get_data(query);
	}
    return json;
}


function get_action(query){
	natural.PorterStemmer.attach();
	tokens = query.tokenizeAndStem();
	action = classifier.classify(tokens);
	console.log("=----------- action is: " + action);
	return action;
}

function get_other_account(query){
	tokenizer = new natural.WordTokenizer();
	tokens = tokenizer.tokenize(query);
	other_account = '';
	for (i=0;i<tokens.length;i++){
		token = tokens[i];
		if (token == "from"){
			if (i>=1 && tokens[i-1] == "payments"){
				if (i+1 < tokens.length){
					other_account = tokens[i+1];
					return other_account;
				}
			}
		}
	}

}


function get_timespan(query){
	timespan = date_extractor(query);
	from = new Date(timespan.from.year, timespan.from.month - 1, timespan.from.day);
	to = new Date(timespan.to.year, timespan.to.month - 1, timespan.to.day);
	console.log("=----------- from: " + from);
	console.log("=----------- to: " + to);
	return {"from":from, "to":to};
}


function get_data(query){
	var message = 'Ooups, I did not understand your request :(';
	other_account = get_other_account(query);
	console.log("Other account at get_data: " + other_account);
	timespan = get_timespan(query);
	switch (get_action(query)){
	//switch ('payment-from'){
		case "earn":
			result = obp.get_earning(timespan.from, timespan.to);
			message = "Your income: " + result.sum;
			break;
		case "spend":
			result = obp.get_spending(timespan.from, timespan.to);
			message = "You spent: " + result.sum;
			break;
		case "payment-from":
			result = obp.get_payments_from(timespan.from, timespan.to, other_account);
			message = "From " + other_account + " You have sent; " + result.sum;
			break;
		default:
			result = [];
			message = 'Ooups, I did not understand your request :(';
			console.log("Error while computing the data");
		//
	}
	return {"summary" : message, "transactions" : result.transactions};
}


//TODO: add training set
function init(){
	 
	classifier.addDocument(['how', 'much', 'money','I', 'have', 'spent'], 'spend');
    classifier.addDocument(['how', 'much', 'money','I', 'have', 'earned'], 'earn');
    classifier.addDocument(['my', 'payment', 'from'], 'payment-from');
    
    /*
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');
    classifier.addDocument('', 'spend');

    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');
    classifier.addDocument('', 'earn');

    classifier.addDocument('', 'payment-from');
    classifier.addDocument('', 'payment-from');
    classifier.addDocument('', 'payment-from');
	classifier.addDocument('', 'payment-from');
    classifier.addDocument('', 'payment-from');
    classifier.addDocument('', 'payment-from');
    classifier.addDocument('', 'payment-from');
    classifier.addDocument('', 'payment-from');
    classifier.addDocument('', 'payment-from');
    */
    classifier.train();
}

module.exports.parse = parse;