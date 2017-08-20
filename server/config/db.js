// const mongoose = require('mongoose');
// 
// // To avoid error of mongoose mpromise DeprecationWarning
// mongoose.Promise = global.Promise;
// 
// // don't show the log when it is test
// // Connect to test db when it is test
// if (process.env.NODE_ENV !== 'test') {
//   // use morgan to log at command line
//   // app.use(morgan('dev'));
//   // Connect to read database
//   mongoose.connect(process.env.database);
// } else if (process.env.NODE_ENV === 'test') {
//   // Connect to test database
//   mongoose.connect(process.env.test_db);
// }


