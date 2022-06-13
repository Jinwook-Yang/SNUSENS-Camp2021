const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const colors = require('colors');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
	{ name: 'port', alias: 'p', type: Number }
];
const options = commandLineArgs(optionDefinitions);
app.use(express.static('public'));

app.set('port', options.port | 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.get('/', (_req, res) => {
	res.render('index.html');
});

app.listen(app.get('port'), () => {
	console.log('Server Start ' + app.get('port'));
});
