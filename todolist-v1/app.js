// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash'); 

const date = require(__dirname + '/date.js');
const app = express();

//	its going to use views/ by default
//	to avoid creating html recurisively
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// send the css
app.use(express.static('public'));

//	js feature, const array can be pushed new item
//	val cant be changed
// const items = ['Buy Food', 'Cook Food', 'Eat Food'];
// const workItems = [];

main().catch(err => console.log(err));

async function main() {

	await mongoose.connect('mongodb://localhost:27017/todolistDB');
	const itemsSchema = {
		name: String
	};

	const Item = mongoose.model('Item', itemsSchema);

	app.get('/', async function (req, res) {
		
		await mongoose.connect('mongodb://localhost:27017/todolistDB');

		const dbResult = await Item.find({});

		// looking inside folder called views/ 
		// and look for file called list
		res.render('list', {
			listTitle: date.getDate(),
			newListItem: dbResult
		});
	});

	const ListSchema = {
		name: String,
		items: [itemsSchema]
	}

	const ListModel = mongoose.model('customLists', ListSchema);


	app.get('/:customListName', async function(req, res) {

		await mongoose.connect('mongodb://localhost:27017/todolistDB');
		
		const customListName = _.capitalize(req.params.customListName);

		let foundList = await ListModel.findOne({name: customListName});
		
		if (!foundList) {
			const item1 = new Item({
				name:'Welcome to your ' + customListName + ' todoList!'
			});
	
			const item2 = new Item({
				name:'Hit the + button to add a new item.'
			});
	
			const item3 = new Item({
				name:'<-- Hit this to delete an item.'
			});
	
			const list = new ListModel({
				name: customListName,
				items: [item1, item2, item3]
			});
	
			await list.save();
			foundList = await ListModel.findOne({name: customListName});
			console.log('New list created: ' + customListName);
		}
		else {
			console.log(customListName + ' list found');
		}
		res.render('list', {listTitle: foundList.name, newListItem: foundList.items});
	});

	app.post('/', async function (req, res) {

		await mongoose.connect('mongodb://localhost:27017/todolistDB');
		
		const newItemName = req.body.newItem;
		const listToInsert = req.body.list;

		try {
			if (listToInsert === date.getDate()){
				await new Item({name: newItemName}).save();
				console.log('Successfully inserted new data.');
				res.redirect('/');
			} else {
				const foundList = await ListModel.findOne({name: listToInsert});
				console.log(foundList);
				foundList.items.push(new Item({name: newItemName}));
				foundList.save();
				res.redirect('/' + listToInsert);
			}
		} catch (error) {
			console.log('Failed to insert new data.', error.message);
		}
	});

	app.post('/delete', async function(req, res) {
		const id = req.body.checkbox;
		const listToInsert = req.body.list;
		
		console.log('listto insert : ',id);
		
		try {
			await mongoose.connect('mongodb://localhost:27017/todolistDB');
			if (listToInsert === date.getDate())
			{
				const dlt = await Item.findByIdAndDelete(id);
				console.log('Delete successfully.', dlt);
				res.redirect('/');
			}else {
				const msg =  await ListModel.findOneAndUpdate({name: listToInsert}, {$pull: {items: {_id: id}}});
				console.log('Delete successfully.', msg);
				res.redirect('/' + listToInsert);
			}
			
		} catch (error) {
			console.log('Delete unsuccessfully.', id);
		}
	});

	app.get('/about', function (req, res) {
		res.render('about');
	});

	app.listen(4000, function (){
		console.log('Server running on port 4000');
	});

	mongoose.disconnect();
}
