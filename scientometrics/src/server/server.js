const fs = require('fs');
const express = require('express');
const w2v = require("word2vec");
const path = require('path');

const app = express();
const dotenv = require('dotenv').config()

console.log("Env")
console.log(dotenv)

// const N_PORT = 7200; // define N_PORT with your own available port number
const N_PORT = process.env.PORT; // define N_PORT with your own available port number
const DOC_2_VEC_PATH = process.env.DOC_2_VEC_PATH
const TRANSE_PATH = process.env.TRANSE_PATH
const ENTITY_MAPPING_PATH = process.env.ENTITY_MAPPING_PATH
const ROOTPATH = process.env.ROOTPATH;

app.set('view engine', 'pug');
app.set('views', 'src/_views');

app.use(express.urlencoded({
	extended: true,
}));

// read the pre-trained Doc2Vec model
var d2v_model = {};
w2v.loadModel(path.join(__dirname, DOC_2_VEC_PATH), function( error, model ) {
	d2v_model = model;
});

// read the pre-trained TransE model
var transE_model = {};
w2v.loadModel(path.join(__dirname, TRANSE_PATH), function( error, model ) {
	transE_model = model;
});


app.get(ROOTPATH + 'sameAs_json', (req, res, next) => {
	fs.readFile(path.join(__dirname, ENTITY_MAPPING_PATH), function(err, data) {
		res.send(data);
	})
});

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  next();
});

app.get(ROOTPATH + 'd2v_sim', (req, res, next) => {
	
	var currentPaperURL = req.query.doc;

	var simDoc = d2v_model.mostSimilar(currentPaperURL, 10);
	res.json(simDoc);
});

app.get(ROOTPATH + 'd2v_info', (req, res, next) => {
	var currentPaperURL = req.query.doc;

	var vecDoc = d2v_model.getVectors([ currentPaperURL ]);
	res.json(vecDoc);
});

app.get(ROOTPATH + 'transE_sim', (req, res, next) => {
	var currentAuthorURL = req.query.author;

	var simAuthor = transE_model.mostSimilar(currentAuthorURL, 10);
	res.json(simAuthor);
});

app.get(ROOTPATH + 'transE_info', (req, res, next) => {
	var currentAuthorURL = req.query.author;

	var vecAuthor = transE_model.getVectors([ currentAuthorURL ]);
	res.json(vecAuthor);
});

app.use(ROOTPATH + 'css', express.static(path.join(process.cwd(), 'src/static/css')));
app.use(ROOTPATH + 'js', express.static(path.join(process.cwd(), 'src/static/js')));
app.use(ROOTPATH + 'img', express.static(path.join(process.cwd(), 'src/static/img')));
app.use(ROOTPATH + 'lib', express.static(path.join(process.cwd(), 'src/static/lib')));

app.get(ROOTPATH + '/', (req, res, next) => {
	res.render('site')
});

app.listen(N_PORT, '0.0.0.0', () => console.log(`App listening on port ${N_PORT}! - http://localhost:${N_PORT}${ROOTPATH}`));