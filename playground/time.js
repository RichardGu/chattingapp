

const moment = require('moment')

var date = moment();
date.add(100, 'year').subtract(9, 'months');
console.log(date.format('h:mm a MMM Do, YYYY'))
