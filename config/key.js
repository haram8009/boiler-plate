if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else { // development 라면
    module.exports = require('./dev');
}