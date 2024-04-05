const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Función para comprobar si un usuario existe en la base de datos en función de su "userId"
async function getUserById(userId) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': userId
            }
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item; // Retorna el usuario si existe, de lo contrario, será undefined
    } catch (error) {
        console.error('Error al obtener usuario de DynamoDB:', error);
        throw error;
    }
}

// Función para crear un usuario en la base de datos
async function createUser(idUsuario) {
    const params = {
        TableName: 'Usuario',
        Item: {
            idUsuario: idUsuario
        }
    };

    await dynamoDB.put(params).promise();
}

module.exports = {
    getUserById,
    createUser
};
