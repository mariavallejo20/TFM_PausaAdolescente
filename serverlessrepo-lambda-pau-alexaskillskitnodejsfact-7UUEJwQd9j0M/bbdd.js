const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createUser(idUsuario, nombre) {
    const params = {
        TableName: 'Usuario',
        Item: {
            idUsuario: idUsuario,
            nombre: nombre
        }
    };

    await dynamoDB.put(params).promise();
}

module.exports = {
    createUser
};
