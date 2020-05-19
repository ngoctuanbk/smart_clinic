const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
const expressValidator = require('express-validator');
const defaultRouter = require('./routes/default/default');
const authRouter = require('./routes/auth/authRouter');
const apiRouter = require('./api/routes/auth/api');
const defaultApiRouter = require('./api/routes/default/default');
const { response404 } = require('./libs/httpResponse');

const app = express();

require('./api/database/config');
// view engine setup
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    partialsDir: `${__dirname}/views/partials`,
    layoutsDir: `${__dirname}/views/layouts/`,
    helpers,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    next();
});

app.use(expressValidator());

app.use(require('express-session')({
    secret: 'sale-fie',
    proxy: true,
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({
//     extended: true
// }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    // maxage: '24h',
    // etag: false
}));
app.use(express.static(path.join(__dirname, 'api/public'), {
    // maxage: '24h',
    // etag: false
}));

app.listen(process.env.PORT || 8000);
app.use('/', defaultRouter);
app.use('/admin', authRouter);
app.use('/api', apiRouter);
app.use('/login', defaultApiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.title = 'Page not found';
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    if (err.status === 404) {
        return response404(res);
    }
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
