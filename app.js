var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');
// var mysql = require('mysql');
// var connection  = require('./lib/db');

var indexRouter = require('./routes/index');
var clientesRouter = require('./routes/clientes');
var usuariosRouter = require('./routes/usuarios');

var app = express();

// Configuração da engine que renderiza as páginas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(flash());

app.use('/', indexRouter);
app.use('/clientes', clientesRouter);
app.use('/usuarios', usuariosRouter);

// pega as páginas não encontradas e lida com isso
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // configura as mensagens de erro para serem exibidas somente em desenvolvimento
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // renderiza a página de erro
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;