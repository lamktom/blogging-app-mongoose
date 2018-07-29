'use strict'; 

const mongoose = require("mongoose");
mongoose.Promise = global.Promise; 

//define schema 
const blogPostSchema = mongoose.Schema({
	author: {
		firstName: String,
		lastName: String, 
	}, 
	title: {type: String, required: true}, 
	content: {type: String},
	created: {type: Date, default: Date.now}
});

//create virtual authorName
blogPostSchema.virtual('authorName').get(function() {
	return `${this.author.firstName} ${this.author.lastName}`.trim(); 
});

//specify how restaurants are represented outside of app via API
blogPostSchema.methods.serialize = function() {
	return {
		id: this._id,
		author: this.authorName,
		content: this.content, 
		title: this.title,
		created: this.created
	};
}; 

//create mongoose model 
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost}; 