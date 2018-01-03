import { Operations } from '/imports/collections/operations.js';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
	addRequest(amount,quantity,maxPrice){
		console.log(amount, quantity, maxPrice);
		var httpsHeader = this.connection.httpHeaders["x-forwarded-for"];
		var trueUserIp = this.connection.clientAddress;
		Operations.insert({'date': Date.now(), 'type': 'request', 'trueUserIp':trueUserIp, 'httpsHeader':httpsHeader, 'amount': amount, 'quantity':quantity, 'maxPrice':maxPrice});
		console.log('Request inserted! by User:', httpsHeader ,trueUserIp);
	},

	addResponse(data, priceDivided){
		var httpsHeader = this.connection.httpHeaders["x-forwarded-for"];
		var trueUserIp = this.connection.clientAddress;
		Operations.insert({'date': Date.now(), 'type': 'response', 'trueUserIp':trueUserIp, 'httpsHeader':httpsHeader, 'data':data, 'priceDivided':priceDivided});
		console.log('Result inserted! by User:', httpsHeader, trueUserIp);
	}
});