const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

//*****************************************************************************************************************/
//                                  FUNCIONES PARA CREAR UN USUARIO COMPLETO
//*****************************************************************************************************************/
// Función para crear un usuario en la base de datos con idUsuario
async function crearUsuario(idUsuario) {
    const params = {
        TableName: 'Usuario',
        Item: {
            idUsuario: idUsuario
        }
    };

    await dynamoDB.put(params).promise();
}

// Función para añadir nombre a un usuario a partir de su idUsuario
async function addNombreUsuario(idUsuario, nombre) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'set nombre = :nombre',
            ExpressionAttributeValues: {
                ':nombre': nombre
            }
        };
        await dynamoDB.update(params).promise();
    } catch (error) {
        console.error('Error al añadir nombre al usuario en DynamoDB:', error);
        throw error;
    }
}

// Función para añadir género a un usuario a partir de su idUsuario
async function addGeneroUsuario(idUsuario, genero) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'set genero = :genero',
            ExpressionAttributeValues: {
                ':genero': genero
            }
        };
        await dynamoDB.update(params).promise();
    } catch (error) {
        console.error('Error al añadir genero al usuario en DynamoDB:', error);
        throw error;
    }
}

// Función para añadir objetivo a un usuario a partir de su idUsuario
async function addObjetivoUsuario(idUsuario, objetivo) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'set objetivo = :objetivo',
            ExpressionAttributeValues: {
                ':objetivo': objetivo
            }
        };
        await dynamoDB.update(params).promise();
    } catch (error) {
        console.error('Error al añadir objetivo al usuario en DynamoDB:', error);
        throw error;
    }
}

// Función para añadir tiempo de uso a un usuario a partir de su idUsuario
async function addTiempoUsuario(idUsuario, tiempo) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'set tiempo = :tiempo',
            ExpressionAttributeValues: {
                ':tiempo': tiempo
            }
        };
        await dynamoDB.update(params).promise();
    } catch (error) {
        console.error('Error al añadir tiempo al usuario en DynamoDB:', error);
        throw error;
    }
}

// Función para añadir sentimiento del día a un usuario a partir de su idUsuario
async function addSentimientoDiaUsuario(idUsuario, sentimientoDia) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'set sentimientoDia = :sentimientoDia',
            ExpressionAttributeValues: {
                ':sentimientoDia': sentimientoDia
            }
        };
        await dynamoDB.update(params).promise();
    } catch (error) {
        console.error('Error al añadir sentimientoDia al usuario en DynamoDB:', error);
        throw error;
    }
}

// Función para añadir nivel de ansiedad a un usuario a partir de su idUsuario
async function addnivelAnsiedadUsuario(idUsuario, nivelAnsiedad) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'set nivelAnsiedad = :nivelAnsiedad',
            ExpressionAttributeValues: {
                ':nivelAnsiedad': nivelAnsiedad
            }
        };
        await dynamoDB.update(params).promise();
    } catch (error) {
        console.error('Error al añadir nivelAnsiedad al usuario en DynamoDB:', error);
        throw error;
    }
}

//*****************************************************************************************************************/
//                              FUNCIONES PARA OBTENER INFORMACIÓN DE UN USUARIO
//*****************************************************************************************************************/

// Función para comprobar si un usuario existe en la base de datos en función de su "userId"
async function getUsuario(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            }
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item; // Retorna el usuario si existe, de lo contrario, será undefined
    } catch (error) {
        console.error('Error al obtener usuario de DynamoDB:', error);
        throw error;
    }
}

// Función para obtener el género de un usuario a partir de su idUsuario
async function getGeneroUsuario(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            ProjectionExpression: 'genero'
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item ? data.Item.genero : null;
    } catch (error) {
        console.error('Error al obtener género del usuario en DynamoDB:', error);
        throw error;
    }
}


//*****************************************************************************************************************/
//                              FUNCIONES PARA OBTENER SESIÓN DE RESPIRACIÓN
//*****************************************************************************************************************/

async function getSesionRespiracion() {
    try {
      // Obtiene un idSesion aleatorio
      const randomId = Math.floor(Math.random() * 3); // 3 elementos en la tabla
  
      // Realiza una operación de consulta en la tabla para obtener el elemento con el idSesion aleatorio
      const data = await dynamoDB.query({
        TableName: 'SesionRespiracion',
        KeyConditionExpression: 'idSesion = :id',
        ExpressionAttributeValues: {
          ':id': { N: randomId.toString() }
        }
      }).promise();
  
      // Obtiene los valores de inicio, refuerzo y final de la fila aleatoria
      const inicio = data.Items[0].inicio.S;
      const refuerzo = data.Items[0].refuerzo.S;
      const final = data.Items[0].final.S;
  
      // Devuelve los valores como strings
      return {
        inicio: inicio,
        refuerzo: refuerzo,
        final: final
      };
    } catch (error) {
      console.error("Error al obtener la sesión de respiración:", error);
      throw error;
    }
}

module.exports = {
    getUsuario,
    crearUsuario,
    addNombreUsuario,
    addGeneroUsuario,
    addObjetivoUsuario,
    addTiempoUsuario,
    addSentimientoDiaUsuario,
    addnivelAnsiedadUsuario,
    getGeneroUsuario,
    getSesionRespiracion,
    getSesionRespiracionPrueba
};
