'use strict'; 

const express = require('express'); 
const morgan = require('morgan'); 
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; 

// importing certain things from certain files
const { DATABASE_URL, PORT } = require('./config');
const { BlogPost } = require('./models');

const app = express(); 

// use morgan to log requests
app.use(morgan('common'));
// use json parsing middleware 
app.use(express.json());

// get endpoint 
app.get('/posts', (req, res) => {
	BlogPost
		.find()
		.then(posts => {
			res.json(posts.map(post => post.serialize())); 
		})
		.catch(err => {
			console.error(err); 
			res.status(500).json({ error: 'Whoops, something went wrong' });
		}); 
}); 

app.get('/posts/:id', (req,res) =>{
	BlogPost
		.findById(req.params.id)
		.then(post => res.json(posts.serialize()));
		.catch(err => {
			console.log(err);
			res.status(500).json({message: "Internal server error"}); 
		});
}); 

// post endpoint 
app.post('/posts', (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`; 
			console.error(message); 
			return res.status(400).send(message); 
		}
	}
}); 

// put endpoint 
app.put('/posts/:id', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['title', 'content', 'author'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field]; 
		}
	});

	BlogPost
		.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
		.then(updatedPost => res.status(204).end())
		.catch(err => res.status(500).json({ message: 'Something went wrong' }));
}); 

// delete endpoint 
app.delete('/posts/:id', (req, res) => {
	BlogPost
		.findByIdAndRemove(req.params.id)
		.then(() => {
			console.log(`Deleted blog post with id \`${req.params.id}\``)
			// respond with 204 (success, no content returned) 
			res.status(204).end(); 
		});
});




















