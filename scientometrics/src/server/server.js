const fs = require('fs');
const express = require('express');
const w2v = require("word2vec");
const path = require('path');

const R_SLUG = /^[a-z][a-z0-9_-]+$/;
const R_SLUG_PATH = /^\/[a-z][a-z0-9_-]+(\/|$)/;
const R_SLUG_ROOT = /^[a-z][a-z0-9_-]+\/$/;

const y_app = express();
const dotenv = require('dotenv').config()

console.log("Env")
console.log(dotenv)

// const N_PORT = 7200; // define N_PORT with your own available port number
const N_PORT = process.env.PORT; // define N_PORT with your own available port number
const DOC_2_VEC_PATH = process.env.DOC_2_VEC_PATH
const TRANSE_PATH = process.env.TRANSE_PATH
const ENTITY_MAPPING_PATH = process.env.ENTITY_MAPPING_PATH

y_app.set('view engine', 'pug');
y_app.set('views', 'src/_views');

y_app.use(express.urlencoded({
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


y_app.get('/sameAs_json', (req, res, next) => {
	fs.readFile(path.join(__dirname, ENTITY_MAPPING_PATH), function(err, data) {
		res.send(data);
	})
});

y_app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  next();
});

y_app.get('/d2v_sim', (req, res, next) => {
	
	var currentPaperURL = req.query.doc;

	var simDoc = d2v_model.mostSimilar(currentPaperURL, 10);
	res.json(simDoc);
});

y_app.get('/d2v_info', (req, res, next) => {
	var currentPaperURL = req.query.doc;

	var vecDoc = d2v_model.getVectors([ currentPaperURL ]);
	res.json(vecDoc);
});

y_app.get('/transE_sim', (req, res, next) => {
	var currentAuthorURL = req.query.author;

	var simAuthor = transE_model.mostSimilar(currentAuthorURL, 10);
	res.json(simAuthor);
});

y_app.get('/transE_info', (req, res, next) => {
	var currentAuthorURL = req.query.author;

	var vecAuthor = transE_model.getVectors([ currentAuthorURL ]);
	res.json(vecAuthor);
});


const A_STATICS = ['css', 'js', 'img', 'lib'];
for(let si_static of A_STATICS) {
	let pd_static = path.join(process.cwd(), 'src/static', si_static);
	y_app.use('/'+si_static, express.static(pd_static));
}

y_app.get(R_SLUG_PATH, (d_req, d_res, f_next) => {
	let s_path = d_req.path.slice(1);

	// root
	if(R_SLUG.test(s_path)) {
		return d_res.redirect(302, s_path+'/');
	}
	// index
	else if(R_SLUG_ROOT.test(s_path)) {
		// site dir
		let pd_site = path.join(process.cwd(), 'sites', s_path);

		// fetch config
		let s_site;
		try {
			s_site = fs.readFileSync(path.join(pd_site, 'site.json'));
		}
		catch(e_read) {
			return d_res.status(500).end('server failed to read site json');
		}

		// parse config
		let h_config;
		try {
			h_config = JSON.parse(s_site);
		}
		catch(e_parse) {
			return d_res.status(500).end('server failed to parse site json');
		}

		// render index
		d_res.render('site', {
			...h_config,
		});
	}
	else {
		f_next();
	}
});

y_app.use(express.static('sites'));

y_app.listen(N_PORT, '0.0.0.0', () => console.log(`App listening on port ${N_PORT}! - http://localhost:${N_PORT}/iospress_scientometrics`));