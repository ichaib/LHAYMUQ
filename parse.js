function parse(query)
{ 
	transactions = get_transactions();
	if query.contains("how much money I"){
		if query.contains("spent") {
			// how much money I spent
		}
	}
    summary = "sum1";
    array = ["item1", "item2"];
    json = JSON.stringify({ summary: summary, transactions: array});
    return json;
}

function get_transactions(){
	//Get transactions from Open Bank Project API
}

module.exports.parse = parse;