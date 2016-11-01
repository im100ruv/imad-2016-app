var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
  	user: 'im100ruv',
  	database: 'im100ruv',
  	host: 'db.imad.hasura-app.io',
  	port: '5432',
  	password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var articles = {
	'article-one': {
		title: 'Article One | Saurabh Karna',
		heading: 'Article One',
		date: 'Oct 28, 2016',
		content: `
				<p>
					This is the first content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p>
				<p>
					This is the first content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p><p>
					This is the first content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p>`
	},
	'article-two': {
		title: 'Article Two | Saurabh Karna',
		heading: 'Article Two',
		date: 'Oct 29, 2016',
		content: `
				<p>
					This is the second content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p>
				<p>
					This is the second content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p><p>
					This is the second content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p>`
	},
	'article-three': {
		title: 'Article Three | Saurabh Karna',
		heading: 'Article Three',
		date: 'Oct 30, 2016',
		content: `
				<p>
					This is the third content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p>
				<p>
					This is the third content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p><p>
					This is the third content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. This is the content. 
				</p>`
	}
};

function createTemplate (data) {
	var title = data.title;
	var date = data.date;
	var heading = data.heading;
	var content = data.content;
	var htmlTemplate = `
		<html>
			<head>
				<title>
					${title}
				</title>
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<link href="/ui/style.css" rel="stylesheet" />
			</head>
			<body>
				<div class="container">
					<div>
						<a href="/">Home</a>
					</div>
					<hr/>
					<h3>
						${heading}
					</h3>
					<div>
						${date.toDateString()}
					</div>
					<div>
						${content}
					</div>
				</div>
			</body>
		</html>
	`;
	return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/myPic.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/images', 'myPic.jpg'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


var counter = 0;
app.get('/counter', function (req, res) {  // counter via url (or API) endpoint
  counter = counter + 1;
  res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req, res) {  //URL: /submit-name?name=xxxx
	//Get the name from the request
	var name = req.query.name;

	names.push(name);
	//JSON: JavaScript Object Notation
	res.send(JSON.stringify(names));
});

var pool = new Pool(config);
//Test the working of database
//this code is not required
app.get('/test-db', function (req, res) {
	//make a select request
	//return a response whth the results

	//testing the query on our test table
	pool.query('SELECT * FROM test', function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
			res.send(JSON.stringify(result.rows));
		}
	});
});

app.get('/articles/:articleName', function (req, res) {
	
	//SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
	pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
			if (result.rows.length === 0) {
				res.status(404).send('Article not found');
			} else {
				var articleData = result.rows[0];
  				res.send(createTemplate(articleData));
			}
		}
	});
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
