const express = require('express');
const app = express();
const path = require('path');

const indexRouter = require('./routes/index');
const contactRouter = require('./routes/contact');
const subscriberRouter = require('./routes/subscriber');

// -- Allow cros origin requestes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end()
  next()
});

// -- Start app on localhost

var port = process.env.API_PORT;

console.log("api_port [", process.env.API_PORT, "]");

if (port === undefined)
    port = 8080;

app.listen(port, function() {
  console.log("[", Date(), '] app started on port: ', port);
});

// -- Views engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// -- Routes

app.use('/', indexRouter);
app.use('/contact', contactRouter);
app.use('/subscriber', subscriberRouter);

// -- Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;