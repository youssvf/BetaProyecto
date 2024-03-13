import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Swagger Demo Project',
        description: 'Implementation of Swagger with TypeScript'
    },
    servers: [
        {
            url: 'http://localhost:8080',
            description: ''
        },
    ],
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
'index.ts',
'./src/reserva/infrastructure/rest/ReservasRoute.ts',
'./src/usuarios/infrastructure/rest/Usuario.router.ts',
'./src/viajes/infrastructure/rest/ViajeRoute.ts'
];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);