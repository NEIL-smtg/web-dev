const mongoose = require('mongoose');
const assert = require('assert');

const uri = "mongodb://localhost:27017/fruitsDB";

main().catch(err => console.log(err));

async function main() {
	await mongoose.connect(uri, {useNewUrlParser: true});

	const fruitSchema = new mongoose.Schema({
		name: {
			type: String,
			required: [true, 'GIVE ME A NAME!!'],
			uniqued: true
		},
		rating: {
			type: Number,
			min: 1,
			max: 10
		},
		review: String
	});
  
	//	first params = collection, second = vals
	const fruit = mongoose.model('fruits', fruitSchema);

	const newFruit = new fruit ({
		name: 'Apple',
		rating: 7,
		review: 'Pretty solid.'
	});
	
	// newFruit.save();

	const person = new mongoose.Schema({
		name: String,
		age: Number,
		favouriteFruit: fruitSchema
	});
	
	const pplModel = mongoose.model('person', person);

	const john = new pplModel({
		name: 'John',
		age: 37
	});

	// ppl.save();

	const banana = new fruit({
		name: 'banana',
		rating: 1,
		review: 'Best fruit.'
	});

	const pineapple = new fruit({
		name:'pineapple',
		rating: 2,
		review: 'love the taste',
	});

	const amy = new pplModel ({
		name: 'Amy',
		age: 22,
		favouriteFruit: pineapple
	});

	// await pineapple.save();
	// await amy.save();

	// await pplModel.updateOne({name:'John'}, {favouriteFruit: banana});
	mongoose.disconnect();
}
