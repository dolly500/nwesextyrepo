const swaggerAutogen = require('swagger-autogen')();



const doc = {
    info:{
        title: 'NWESEXTYREPO API',
        description: 'Here are the endpoints for the backend'
    },
    host:'localhost:4000',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']


swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./app.js')
})
