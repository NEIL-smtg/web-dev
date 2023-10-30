//	jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

main().catch(err => console.log(err));

async function main()
{
	await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
	const articleSchema = {
		title: String,
		content: String
	};

	const articleCollection = mongoose.model('article', articleSchema);

	app.route('/articles')
		.get(async function(req, res) {
			try {
				await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
				const article = await articleCollection.find();
				res.send(article);
			} catch (error) {
				res.send(error);
			}
		})
		.post(async function(req, res) {
			const newArticle = new articleCollection({
				title: req.body.title,
				content: req.body.content
			});

			try {
				await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
				await newArticle.save();
				console.log('Succesfully inserted new article.');
				res.send('Succesfully inserted new article.');
			} catch (error) {
				console.error(error);
				res.send(error);
			}
		})
		.delete(async function(req, res) {
			try {
				await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
				await articleCollection.deleteMany();
				res.send('All articles are being deleted....');
			} catch (error) {
				console.log(error);
				res.send(error);
			}
		});
	
	app.route('/articles/:articleTitle')
		.get(async function (req, res) {
			try {
				const title = req.params.articleTitle;
				await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
				const result = await articleCollection.findOne({title: title});
				if (result)
					res.send(result);
				else
					res.send('No article found.');
			} catch (error) {
				res.send(error);
				console.error(error);
			}
		})
		.put(async function (req, res) {
			try {
				const title = req.params.articleTitle;
				await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
				
				await articleCollection.updateOne(
					{title: title},
					{title: req.body.title, content: req.body.content}
				);
				res.redirect('/articles/' + req.body.title);
			} catch (error) {
				res.send(error);
				console.error(error);
			}
		})
		.patch(async function (req, res) {
			try {
				const title = req.params.articleTitle;
				await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
				
				//	req.body is also an object...... doesnt matter
				//	it misses any of the keys
				await articleCollection.findOneAndUpdate(
					{title: title},
					{$set: req.body}
				);
				console.log(req.body.title);
				if (req.body.title != undefined)
					res.redirect('/articles/' + req.body.title);
				else
					res.redirect('/articles/' + title);
			} catch (error) {
				res.send(error);
				console.error(error);
			}
		});		

	app.listen(4000, function () {
		console.log('Running on port 4000');
	});
}
