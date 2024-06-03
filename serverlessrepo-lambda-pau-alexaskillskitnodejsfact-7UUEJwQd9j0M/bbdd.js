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
            idUsuario: idUsuario,
            numSesRespiracion: 0,
            numSesMeditacion: 0,
            numRecuerdos: 0,
            numInteracciones: 0,
            numJuegos: 0
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

// Función para obtener el género de un usuario a partir de su idUsuario
async function getNombreUsuario(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            ProjectionExpression: 'nombre'
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item ? data.Item.nombre : null;
    } catch (error) {
        console.error('Error al obtener nombre del usuario en DynamoDB:', error);
        throw error;
    }
}

// Función para obtener el sentimiento actual de un usuario a partir de su idUsuario
async function getSentimientoUsuario(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            ProjectionExpression: 'sentimientoDia'
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item ? data.Item.sentimientoDia : null;
    } catch (error) {
        console.error('Error al obtener sentimiento del usuario en DynamoDB:', error);
        throw error;
    }
}

async function getNumRecuerdos(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            ProjectionExpression: 'numRecuerdos'
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item ? data.Item.numRecuerdos : 0; // Retorna numRecuerdos o 0 si no existe
    } catch (error) {
        console.error('Error al obtener numRecuerdos de DynamoDB:', error);
        throw error;
    }
}

// Función para obtener el número de interacciones de un usuario
async function getNumInteracciones(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            ProjectionExpression: 'numInteracciones'
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item ? data.Item.numInteracciones : 0;
    } catch (error) {
        console.error('Error al obtener numInteracciones de DynamoDB:', error);
        throw error;
    }
}

async function getObjetivoUsuario(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            ProjectionExpression: 'objetivo'
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item ? data.Item.objetivo : 0;
    } catch (error) {
        console.error('Error al obtener objetivo de DynamoDB:', error);
        throw error;
    }
}

// Función para obtener el número de juegos jugados de un usuario
async function getNumJuegos(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            ProjectionExpression: 'numJuegos'
        };
        const data = await dynamoDB.get(params).promise();
        return data.Item ? data.Item.numJuegos : 0;
    } catch (error) {
        console.error('Error al obtener numJuegos de DynamoDB:', error);
        throw error;
    }
}

//*****************************************************************************************************************/
//                              FUNCIONES PARA OBTENER SESIÓN DE RESPIRACIÓN
//*****************************************************************************************************************/

// Función para obtener la sesión de respiracion en función de la duración
async function getSesionRespiracion(duracion) {
    const params = {
        TableName: 'SesionRespiracion',
        FilterExpression: 'duracion = :duracion',
        ProjectionExpression: 'sesion',
        ExpressionAttributeValues: {
            ':duracion': duracion
        }
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return data.Items.length > 0 ? data.Items[0].sesion : null;
    } catch (error) {
        throw error;
    }
}


// Función para obtener la musica en funcion de la duracion
async function getMusicaSesionRespiracion(duracion) {
    const params = {
        TableName: 'SesionRespiracion',
        FilterExpression: 'duracion = :duracion',
        ProjectionExpression: 'musica',
        ExpressionAttributeValues: {
            ':duracion': duracion
        }
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return data.Items.length > 0 ? data.Items[0].musica : null;
    } catch (error) {
        throw error;
    }
}


//*****************************************************************************************************************/
//                              FUNCIONES PARA OBTENER SESIÓN DE MEDITACION
//*****************************************************************************************************************/

async function getSesionMeditacion(tema) {
    const params = {
        TableName: 'SesionMeditacion',
        FilterExpression: 'tema = :tema',
        ProjectionExpression: 'inicio, refuerzo, fin',
        ExpressionAttributeValues: {
            ':tema': tema
        }
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        if (data.Items.length > 0) {
            const { inicio, refuerzo, fin } = data.Items[0];
            return { inicio, refuerzo, fin };
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

//*****************************************************************************************************************/
//                              FUNCIONES PARA RECUENTO DE SESIONES
//*****************************************************************************************************************/

async function actualizarNumSesRespiracion(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'SET numSesRespiracion = numSesRespiracion + :inc',
            ExpressionAttributeValues: {
                ':inc': 1
            },
            ReturnValues: 'ALL_NEW' // Para obtener el nuevo valor actualizado
        };
        const data = await dynamoDB.update(params).promise();
        return data.Attributes.numSesRespiracion; // Retorna el nuevo valor de numSesRespiracion
    } catch (error) {
        console.error('Error al actualizar numSesRespiracion en DynamoDB:', error);
        throw error;
    }
}

async function actualizarNumSesMeditacion(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'SET numSesMeditacion = numSesMeditacion + :inc',
            ExpressionAttributeValues: {
                ':inc': 1
            },
            ReturnValues: 'ALL_NEW' // Para obtener el nuevo valor actualizado
        };
        const data = await dynamoDB.update(params).promise();
        return data.Attributes.numSesMeditacion; // Retorna el nuevo valor de numSesMeditacion
    } catch (error) {
        console.error('Error al actualizar numSesMeditacion en DynamoDB:', error);
        throw error;
    }
}

// Función para actualizar el numero de recuerdos de un usuario
async function actualizarNumRecuerdos(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'SET numRecuerdos = numRecuerdos + :inc',
            ExpressionAttributeValues: {
                ':inc': 1
            }
        };
        const data = await dynamoDB.update(params).promise();
    } catch (error) {
        console.error('Error al actualizar numRecuerdos en DynamoDB:', error);
        throw error;
    }
}

// Función para actualizar el numero de interacciones con la skill de un usuario
async function actualizarNumInteracciones(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'SET numInteracciones = numInteracciones + :inc',
            ExpressionAttributeValues: {
                ':inc': 1
            }
        };
        const data = await dynamoDB.update(params).promise();
    } catch (error) {
        console.error('Error al actualizar numInteracciones en DynamoDB:', error);
        throw error;
    }
}

// Función para actualizar y devolver el numero de juegos completados por el usuario
async function actualizarNumJuegos(idUsuario) {
    try {
        const params = {
            TableName: 'Usuario',
            Key: {
                'idUsuario': idUsuario
            },
            UpdateExpression: 'SET numJuegos = numJuegos + :inc',
            ExpressionAttributeValues: {
                ':inc': 1
            },
            ReturnValues: 'ALL_NEW' // Para obtener el nuevo valor actualizado
        };
        const data = await dynamoDB.update(params).promise();
        return data.Attributes.numJuegos; // Retorna el nuevo valor de NumJuegos
    } catch (error) {
        console.error('Error al actualizar numJuegos en DynamoDB:', error);
        throw error;
    }
}

//*****************************************************************************************************************/
//                              FUNCIONES PARA DIARIO DE RECUERDOS
//*****************************************************************************************************************/

// Función para guardar un nuevo recuerdo en la base de datos
async function guardarRecuerdo (idUsuario, titulo, descripcion, sentimientoRelacionado)
{
   
    const params = {
        TableName: 'Recuerdo',
        Item: {
            idRecuerdo: Math.random().toString(36).substring(7), // ID único para cada recuerdo
            idUsuario: idUsuario,
            titulo: titulo,
            descripcion: descripcion,
            sentimientoRelacionado: sentimientoRelacionado
        }
    };

    try {
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error("Error al guardar el recuerdo:", error);
    }
}

// Función para recuperar la lista de recuerdos de un usuario
async function recuperarListaRecuerdos(idUsuario)
{
    const params = {
        TableName: 'Recuerdo',
        FilterExpression: 'idUsuario = :idUsuario',
        ProjectionExpression: 'titulo', 
        ExpressionAttributeValues: {
            ':idUsuario': idUsuario
        }
    };
    try {
        const data = await dynamoDB.scan(params).promise();
        if (data.Items && data.Items.length > 0) {
            const titles = data.Items.map(item => item.titulo);
            return titles.join(', ');
        } else
            return null;
    } catch (error) {
        console.error("Error al recuperar los recuerdos:", error);
        
    }
}

// Función para recuperar un recuerdo de la base de datos
async function recuperarRecuerdoPorSentimiento(idUsuario, sentimientoRelacionado) 
{
    const params = {
        TableName: 'Recuerdo',
        FilterExpression: 'sentimientoRelacionado = :sentimientoRelacionado AND idUsuario = :idUsuario',
        ExpressionAttributeValues: {
            ':sentimientoRelacionado': sentimientoRelacionado,
            ':idUsuario': idUsuario
        }
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        if (data.Items && data.Items.length > 0) {
            // Seleccionar un recuerdo aleatorio
            const recuerdoAleatorio = data.Items[Math.floor(Math.random() * data.Items.length)];
            return {
                titulo: recuerdoAleatorio.titulo,
                descripcion: recuerdoAleatorio.descripcion
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error al recuperar los recuerdos:", error);
    }
}

//Función para eliminar un recuerdo
async function eliminarRecuerdo(idUsuario, tituloSeleccionado) {
    const params = {
        TableName: 'Recuerdo',
        FilterExpression: 'titulo = :titulo AND idUsuario = :idUsuario',
        ExpressionAttributeValues: {
            ':titulo': tituloSeleccionado,
            ':idUsuario': idUsuario
        }
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        if (data.Items && data.Items.length > 0) {
            const idRecuerdo = data.Items[0].idRecuerdo; // Obtenemos el idRecuerdo del recuerdo seleccionado
            const deleteParams = {
                TableName: 'Recuerdo',
                Key: {
                    idRecuerdo: idRecuerdo
                }
            };

            await dynamoDB.delete(deleteParams).promise();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error al eliminar el recuerdo:", error);
        return false;
    }
}

//*****************************************************************************************************************/
//                              FUNCIONES PARA HISTORIAL DE SENTIMIENTOS
//*****************************************************************************************************************/

async function addHistorial (idUsuario, nivelAnsiedad, sentimientoDia) {
    try {
        const params = {
            TableName: 'Historial',
            Item: {
                'idHistorial': Math.random().toString(36).substring(7), // ID único para cada entrada del historial
                'idUsuario': idUsuario,
                'nivelAnsiedad': nivelAnsiedad,
                'sentimientoDia': sentimientoDia,
                'timestamp': new Date().toISOString()  // Añadimos un campo timestamp para mantener el historial ordenado por fecha
            }
        };
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error al añadir una nueva entrada a la tabla Historial en DynamoDB:', error);
        throw error;
    }
}

async function getHistorial (idUsuario) {
    try {
        const params = {
            TableName: 'Historial',
            FilterExpression: '#idUsuario = :idUsuario',
            ExpressionAttributeNames: {
                '#idUsuario': 'idUsuario',
                '#ts': 'timestamp' // Alias para la palabra reservada
            },
            ExpressionAttributeValues: {
                ':idUsuario': idUsuario
            },
            ProjectionExpression: 'sentimientoDia, nivelAnsiedad, #ts' // Usar el alias en la expresión
        };
        const data = await dynamoDB.scan(params).promise();
        
        // Ordenar por timestamp descendente y obtener las últimas 7 entradas
        const sortedItems = data.Items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const last7Entries = sortedItems.slice(0, 7).map(entry => ({
            sentimientoDia: entry.sentimientoDia,
            nivelAnsiedad: entry.nivelAnsiedad
        }));
        
        return last7Entries;
    } catch (error) {
        console.error('Error al recuperar las últimas 7 entradas de DynamoDB:', error);
        throw error;
    }
}

function calcularSentimientoMasFrecuente(historial) {
    if (!historial || historial.length === 0) return [];

    const sentimentCounts = historial.reduce((acc, entry) => {
        acc[entry.sentimientoDia] = (acc[entry.sentimientoDia] || 0) + 1;
        return acc;
    }, {});

    const maxCount = Math.max(...Object.values(sentimentCounts));
    const mostFrequentSentiments = Object.keys(sentimentCounts).filter(sentiment => sentimentCounts[sentiment] === maxCount);

    if (mostFrequentSentiments.length === 0) {
        return '';
    } else if (mostFrequentSentiments.length === 1) {
        return mostFrequentSentiments[0];
    } else {
        return mostFrequentSentiments.slice(0, -1).join(', ') + ' y ' + mostFrequentSentiments[mostFrequentSentiments.length - 1];
    }
}

function calcularMediaNivelAnsiedad(historial) {
    if (!historial || historial.length === 0) return null;

    const totalAnxietyLevel = historial.reduce((sum, entry) => sum + parseFloat(entry.nivelAnsiedad), 0);
    const averageAnxietyLevel = totalAnxietyLevel / historial.length;

    return Math.round(averageAnxietyLevel * 10) / 10;
}

//*****************************************************************************************************************/
//                              FUNCIONES PARA JUEGOS TERAPÉUTICOS
//*****************************************************************************************************************/

//Función para obtener un juego
async function getJuego() {

    const idJuego = Math.floor(Math.random() * 2) + 1;

    try {
        const params = {
            TableName: 'Juego',
            Key: {
                'idJuego': idJuego
            }
        };
        const result = await dynamoDB.get(params).promise();

        const { inicioJuego, palabras } = result.Item;

        return { inicioJuego, palabras };

    } catch (error) {
        console.error('Error al obtener el juego de DynamoDB:', error);
        throw error;
    }
}

// Función para seleccionar 4 palabras para jugar a un juego
function seleccionarPalabrasJuego(palabras, cantidad) {
    const palabrasAleatorias = [];
    const palabrasDisponibles = [...palabras]; // Copia para no modificar el array original

    for (let i = 0; i < cantidad; i++) {
        const indiceAleatorio = Math.floor(Math.random() * palabrasDisponibles.length);
        palabrasAleatorias.push(palabrasDisponibles[indiceAleatorio]);
        palabrasDisponibles.splice(indiceAleatorio, 1); // Elimina la palabra seleccionada
    }

    return palabrasAleatorias;
}

// Obtener la recompensa de un juego
async function getRecompensaJuego(puntuacion) {
    const params = {
        TableName: 'Recompensa',
        FilterExpression: 'puntuacion = :puntuacion',
        ExpressionAttributeValues: {
            ':puntuacion': puntuacion
        }
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        if (data.Items.length > 0) {
            return data.Items[0].recompensa;
        } else {
            // No se encontró la puntuación, devolver una recompensa aleatoria
            const randomParams = {
                TableName: 'Recompensa'
            };
            const allData = await dynamoDB.scan(randomParams).promise();
            const randomIndex = Math.floor(Math.random() * allData.Items.length);
            return allData.Items[randomIndex].recompensa;
        }
    } catch (error) {
        console.error("Error retrieving reward:", error);
        throw new Error('Error retrieving reward');
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
    getNombreUsuario,
    getSentimientoUsuario,
    getNumRecuerdos,
    getNumInteracciones,
    getObjetivoUsuario,
    getNumJuegos,
    getSesionRespiracion,
    getMusicaSesionRespiracion,
    getSesionMeditacion,
    actualizarNumSesRespiracion,
    actualizarNumSesMeditacion,
    actualizarNumRecuerdos,
    actualizarNumInteracciones,
    actualizarNumJuegos,
    guardarRecuerdo,
    recuperarListaRecuerdos,
    recuperarRecuerdoPorSentimiento,
    eliminarRecuerdo,
    addHistorial,
    getHistorial,
    calcularSentimientoMasFrecuente,
    calcularMediaNivelAnsiedad,
    getJuego,
    seleccionarPalabrasJuego,
    getRecompensaJuego

};
