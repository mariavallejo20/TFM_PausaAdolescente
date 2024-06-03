
const Alexa = require('ask-sdk-core');

// Constante para alamcenar el género del adolescente
let GENEROADOLESCENTE = '';

// Constante para almacenar el idUsuario del adolescente
let USERID = '';

// Constante para almacenar el nombre del adolescente
let NOMBREADOLESCENTE = '';

// ******************* FUNCIONES AUXILIARES *******************
const functions = require('./functions');
const bbdd = require('./bbdd');


//*****************************************************************************************************************/
//                              MANEJADORES INICIALES (CUESTIONARIO INICIAL)
//*****************************************************************************************************************/

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        let speakOutput = '';

        USERID = handlerInput.requestEnvelope.context.System.user.userId;

        // Comprobamos si el usuario está registrado en función del idUsuario
        const usuario = await bbdd.getUsuario(USERID);
        
        // Si no está registrado, creamos el usuario
        if(!usuario)
        {
            speakOutput = `Bienvenido a "Pausa Adolescente", soy tu compañero terapeútico. Antes de empezar, ¿Cúal es tu nombre?`;
            await bbdd.crearUsuario(USERID);

        }
        else
        {
            // Establecemos la respuesta según el género
            let sentimientosGenero;

            GENEROADOLESCENTE = await bbdd.getGeneroUsuario(USERID);
            NOMBREADOLESCENTE = await bbdd.getNombreUsuario(USERID);
            
            if (GENEROADOLESCENTE === 'masculino')
                sentimientosGenero = 'Feliz, Triste, Estresado, Motivado o Agotado.';
            else if (GENEROADOLESCENTE === 'femenino')
                sentimientosGenero = 'Feliz, Triste, Estresada, Motivada o Agotada.';
                
            speakOutput = `¡Hola de nuevo, ${NOMBREADOLESCENTE}! <break time="1s"/>`;

            const numInteracciones = await bbdd.getNumInteracciones(USERID);

            if (numInteracciones % 10 == 0) {
                // Obtenemos el objetivo del usuario
                const objetivoUsuario = await bbdd.getObjetivoUsuario(USERID);

                speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_bridge_01"/>`;
                speakOutput += `Quiero recordarte que tu objetivo al utilizar esta skill es: " ${objetivoUsuario}".<break time="1s"/> Espero que estés avanzando hacia esa meta y sintiéndote mejor cada día. <break time="1s"/>`;
                speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01"/>`;
            }

            speakOutput += `¿Cómo te sientes hoy?: ${sentimientosGenero}`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


// Manejador para obtener el nombre del adolescente
const obtenerNombreHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'obtenerNombre';
    },
    async handle(handlerInput) {
        const nombreAdolescente = handlerInput.requestEnvelope.request.intent.slots.nombre.value;
        
        if (nombreAdolescente) {
            const speakOutput = `¡${nombreAdolescente}, qué nombre más bonito! Ahora necesito conocerte un poco más. Vamos con algunas preguntas: <break time="1s"/> ¿Cómo quieres que me dirija a ti?: en género masculino o femenino `;
            
            // Añadimos el nombre del usuario en fucnión del idUsuario
            await bbdd.addNombreUsuario(USERID, nombreAdolescente);
            NOMBREADOLESCENTE = await bbdd.getNombreUsuario(USERID);

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Dime cómo te identificas: género masculino o femenino.')
                .getResponse();
        } else {
            const speakOutput = 'Lo siento, no he entendido tu nombre. ¿Puedes repetirlo?';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Por favor, dime tu nombre.')
                .getResponse();
        }
    }
};

// Manejador para obtener el género del adolescente
const obtenerGeneroHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'obtenerGenero';
    },
    async handle(handlerInput) {
        const generoAdolescente = handlerInput.requestEnvelope.request.intent.slots.genero.value;
        
        if (generoAdolescente) {
            const speakOutput = `¡${generoAdolescente}, de acuerdo! ¿Qué te gustaría conseguir utilizando "Pausa Adolescente"?`;

            // Añadimos el género del usuario en fucnión del idUsuario
            await bbdd.addGeneroUsuario(USERID, generoAdolescente);

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Dime cúal es tu objetivo al utiliza "Pausa Adolescente".')
                .getResponse();
        } else {
            const speakOutput = 'Lo siento, no he entendido el género elejido. ¿Puedes repetirlo?';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Por favor, dime tu género.')
                .getResponse();
        }
    }
};

// Manejador para obtener el objetivo del adolescente
const obtenerObjetivoHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'obtenerObjetivo';
    },
    async handle(handlerInput) {
        const objetivoAdolescente = handlerInput.requestEnvelope.request.intent.slots.objetivo.value;
        
        if (objetivoAdolescente) {
            const speakOutput = `¡Seguro que lo conseguimos juntos! ¿Cuánto tiempo al día te gustaría dedicar a "Pausa Adolescente"?`;

            // Añadimos el objetivo del usuario en fucnión del idUsuario
            await bbdd.addObjetivoUsuario(USERID, objetivoAdolescente);

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Dime cuánto tiempo diario quieres dedicar a "Pausa Adolescente".')
                .getResponse();
        } else {
            const speakOutput = 'Lo siento, no he entendido el objetivo, repítelo.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Por favor, dime el objetivo.')
                .getResponse();
        }
    }
};

// Manejador para obtener el objetivo del adolescente
const dedicacionDiariaHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'dedicacionDiaria';
    },
    async handle(handlerInput) {
        const dedicacionDiariaAdolescente = handlerInput.requestEnvelope.request.intent.slots.tiempo.value;

        const tiempoDia = functions.convertirDuracion(dedicacionDiariaAdolescente);
        
        // Establecemos la respuesta según el género
        let sentimientosGenero;

        GENEROADOLESCENTE = await bbdd.getGeneroUsuario(USERID);
        
        if (GENEROADOLESCENTE === 'masculino')
            sentimientosGenero = 'Feliz, Triste, Estresado, Motivado o Agotado.';
        else if (GENEROADOLESCENTE === 'femenino')
            sentimientosGenero = 'Feliz, Triste, Estresada, Motivada o Agotada.';
            
        
        if (dedicacionDiariaAdolescente) {
            const speakOutput = `¡${tiempoDia}, genial! Ya nos queda poco, ¿Cómo te sientes hoy?: ${sentimientosGenero} `;

            // Añadimos el tiempo de uso del usuario en fucnión del idUsuario
            await bbdd.addTiempoUsuario(USERID, tiempoDia);

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(`Dime como te sientes: ${sentimientosGenero}.`)
                .getResponse();
        } else {
            const speakOutput = 'Lo siento, no he entendido el tiempo diario. Puedes decir, por ejemplo: "20 minutos"';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Por favor, dime el tiempo.')
                .getResponse();
        }
    }
};

// Manejador para obtener el sentimiento del día
const obtenerSentimientoDiaHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'obtenerSentimientoDia';
    },
    async handle(handlerInput) {
        const sentimientoDia = handlerInput.requestEnvelope.request.intent.slots.sentimiento.value;
        
        if (sentimientoDia) {
            const speakOutput = `¡De acuerdo, añadiré ${sentimientoDia} a las estadísticas de la semana! <break time="1s"/> En una escala del 1 al 10, ¿Cuánta ansiedad o estrés experimentas en este momento? `;
            
            // Añadimos el sentimiendo del día del usuario en función del idUsuario
            await bbdd.addSentimientoDiaUsuario(USERID, sentimientoDia);

            // Guardar sentimientoDia en los atributos de sesión
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes.sentimientoDia = sentimientoDia;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Dime cuanto estrés experimentas del 1 al 10.')
                .getResponse();
        } else {
            const speakOutput = 'Lo siento, no he entendido tu cómo te sientes hoy: ¿Feliz, Triste, Estresado, Motivado o Agotado?.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Por favor, dime cómo te sientes hoy: ¿Feliz, Triste, Estresado, Motivado o Agotado?.')
                .getResponse();
        }
    }
};

// Manejador para obtener el nivel de ansiedad del día
const nivelAnsiedadDiaHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'nivelAnsiedadDia';
    },
    async handle(handlerInput) {
        const nivelAnsiedad = handlerInput.requestEnvelope.request.intent.slots.nivelAnsiedad.value;
        
        if (nivelAnsiedad) {
            let speakOutput = `${nivelAnsiedad}, entendido. Vamos a trabajar en ello juntos. <break time="1s"/> `;
            
            // Añadimos el nivel de ansiedad del usuario en función del idUsuario
            await bbdd.addnivelAnsiedadUsuario(USERID, nivelAnsiedad);

            // Recuperamos el sentimiento del día y guardamos ambos en la tabla Historial
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const sentimientoDia = sessionAttributes.sentimientoDia;

            // Guardamos el historial y añadimos una interacción al usuario
            await bbdd.addHistorial(USERID, nivelAnsiedad, sentimientoDia);
            await bbdd.actualizarNumInteracciones(USERID);

            //Contamos el número de interacciones para saber si mostrar el historial
            const numInteracciones = await bbdd.getNumInteracciones(USERID);

            if (numInteracciones % 7 == 0) {
                // Obtenemos el historial del usuario
                const historial = await bbdd.getHistorial(USERID);

                // Calculamos el sentimiento más frecuente y la media de ansiedad
                const sentimientoFrecuente = bbdd.calcularSentimientoMasFrecuente(historial);
                const ansiedadMedia = bbdd.calcularMediaNivelAnsiedad(historial);

                speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_bridge_01"/>`;
                speakOutput += `Aquí tienes un resumen de cómo te has sentido en tus últimas 7 interacciones conmigo: <break time="1s"/>
                                Te has sentido ${sentimientoFrecuente} con mayor frecuencia. <break time="1s"/>
                                Tu nivel medio de ansiedad ha sido de ${ansiedadMedia}, en una escala del 1 al 10. <break time="1s"/>
                                Recuerda, que es completamente normal tener altibajos, y que estoy aquí para ayudarte a reducir tu ansiedad y estrés siempre que lo necesites. <break time="1s"/>`;
                speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01"/>`;
            }

            speakOutput += '¿Qué necesitas?: respiración, meditación, diario de recuerdos o terapia con juegos.';
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Dime qué necesitas: respiración, meditación, diario de recuerdos o terapia con juegos.')
                .getResponse();
        } else {
            const speakOutput = 'Lo siento, no he entendido tu nivel de ansiedad. Dime un número del 1 al 10.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Por favor, dime tu nivel de ansiedad del 1 al 10.')
                .getResponse();
        }
    }
};


//*****************************************************************************************************************/
//                              MANEJADORES PARA SESIÓN DE RESPIRACIÓN
//*****************************************************************************************************************/


// Manejador para dar la bienvenida a la sesión de respiración y obtener la duración
const bienvenidaSesionRespiracionHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'bienvenidaSesionRespiracion';
    },
    async handle(handlerInput) {

        let speakOutput = '';

        const numSesUsuario = await bbdd.actualizarNumSesRespiracion(USERID);

        if (GENEROADOLESCENTE == 'masculino')
            speakOutput += `${NOMBREADOLESCENTE}, bienvenido a una sesión de respiración guiada <break time="1s"/> `;
        else if (GENEROADOLESCENTE == 'femenino')
            speakOutput += `${NOMBREADOLESCENTE}, bienvenida a una sesión de respiración guiada <break time="1s"/> `;

        if (numSesUsuario % 5 == 0) {
            speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_03"/>`;
            speakOutput += `¡Felicidades, vas a realizar tu sesión de respiración número ${numSesUsuario}! `;
            speakOutput += `<audio src="soundbank://soundlibrary/gameshow/gameshow_01"/>`;
        }
        
        speakOutput += 'Elige la duración de tu sesión, para ello puedes decir: "sesión de respiración corta", "sesión de respiración media" o, "sesión de respiración larga"';
        
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Dime qué necesitas: : "sesión de respiración corta", "sesión de respiración media" o, "sesión de respiración larga"')
                .getResponse();

    }
};


// Manejador para desarrollar la sesión de respiración
const sesionRespiracionHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'sesionRespiracion';
    },
    async handle(handlerInput) {

        const duracion = handlerInput.requestEnvelope.request.intent.slots.duracion.value;

        const sesion = await bbdd.getSesionRespiracion(duracion);
        const urlMusica = await bbdd.getMusicaSesionRespiracion(duracion);

        let speakOutput = '';

        if (GENEROADOLESCENTE == 'masculino')
            speakOutput += `¡Espero que estés preparado, vamos con una sesión de respiración ${duracion}! La sesión finalizará cuando se acabe la música o cuando digas: "Alexa para". <break time="1s"/>`;
        else if (GENEROADOLESCENTE == 'femenino')
            speakOutput += `¡Espero que estés preparada, vamos con una sesión de respiración ${duracion}! La sesión finalizará cuando se acabe la música o cuando digas: "Alexa para". <break time="1s"/>`;

        speakOutput += `<prosody rate="slow">${sesion}</prosody>`;

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .addAudioPlayerPlayDirective('REPLACE_ALL', urlMusica, '0', 0, null)
        .withShouldEndSession(true) // La sesión finaliza cuando se acaba la música
        .getResponse();

    }
};


//*****************************************************************************************************************/
//                              MANEJADORES PARA SESIÓN DE MEDITACIÓN
//*****************************************************************************************************************/


// Manejador para dar la bienvenida a la meditación y elegir la temática deseada
const bienvenidaSesionMeditacionHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'bienvenidaSesionMeditacion';
    },
    async handle(handlerInput) {

        const numSesUsuario = await bbdd.actualizarNumSesMeditacion(USERID);

        let speakOutput = '';

        if (GENEROADOLESCENTE == 'masculino')
            speakOutput += `${NOMBREADOLESCENTE}, bienvenido a tu sesión de meditación para reducir la ansiedad y el estrés.`;
        else if (GENEROADOLESCENTE == 'femenino')
            speakOutput += `${NOMBREADOLESCENTE}, bienvenida a tu sesión de meditación para reducir la ansiedad y el estrés. `;

        if (numSesUsuario % 5 == 0) {
            speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_03"/>`;
            speakOutput += `¡Felicidades, vas a realizar tu sesión de meditación número ${numSesUsuario}! `;
            speakOutput += `<audio src="soundbank://soundlibrary/gameshow/gameshow_01"/>`;
        }

        speakOutput += 'Elige la temática de tu sesión de meditación de hoy, puedes decir: "sesión de meditación de visualización, conexión con el cuerpo, gratitud, o calma"';

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt('Dime qué necesitas: : "sesión de meditación de visualización, conexión con el cuerpo, gratitud, o calma"')
        .getResponse();

    }
};


//Manejador para desarrollar la sesión de meditación
const sesionMeditacionHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'sesionMeditacion';
    },
    async handle(handlerInput) {

        const tema = handlerInput.requestEnvelope.request.intent.slots.tema.value;

        const sesion = await bbdd.getSesionMeditacion(tema);
        const { inicio, refuerzo, fin } = sesion;

        let speakOutput = `Genial, haremos una sesión de relajación sobre ${tema}. Antes de comenzar, asegúrate de estar en un lugar tranquilo donde puedas relajarte y estar en silencio. Te iré guiando por la sesión y dejándote tiempo para que sigas mis indicaciones. <break time="1s"/> Vamos a empezar: <break time="1s"/>`;

        speakOutput += `<prosody rate="slow">${inicio}</prosody>`;
        speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_waiting_loop_30s_01"/>`;
        speakOutput += `<prosody rate="slow">${refuerzo}</prosody>`;
        speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_waiting_loop_30s_01"/>`;
        speakOutput += `<prosody rate="slow">${fin}</prosody>`;
        speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_waiting_loop_30s_01"/>`;

        speakOutput += 'Fin de la sesión de meditación. Recuerda que siempre puedes regresar a este lugar de tranquilidad en cualquier momento que lo necesites. La paz está dentro de ti, esperando ser encontrada cada vez que busques en tu interior.';
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(true) // La sesión finaliza cuando se acaba la sesión de meditación
        .getResponse();

    }
};


//*****************************************************************************************************************/
//                              MANEJADORES PARA DIARIO DE RECUERDOS
//*****************************************************************************************************************/


// Manejador para dar la bienvenida al diario de recuerdos y elegir la acción deseada
const bienvenidaRecuerdosHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'bienvenidaRecuerdos';
    },
    async handle(handlerInput) {

        const numRecuerdos = await bbdd.getNumRecuerdos(USERID);

        let speakOutput = '';

        if (GENEROADOLESCENTE == 'masculino')
            speakOutput += `¡${NOMBREADOLESCENTE}, bienvenido a tu diario de recuerdos! `;
        else if (GENEROADOLESCENTE == 'femenino')
            speakOutput += `¡${NOMBREADOLESCENTE}, bienvenida a tu diario de recuerdos! `;

        if(numRecuerdos != 0)
            speakOutput += 'Recuerda que puedes guardar recuerdos relacionados con tus sentimientos y luego escuchar un recuerdo según cómo te sientas en el momento. ¿Qué te gustaría hacer?: "Guardar un recuerdo" o "Escuchar un recuerdo" ';
        else
            speakOutput += 'Este es un lugar especial donde puedes guardar pequeños momentos que te hagan sentir bien y te ayuden a combatir la ansiedad y el estrés. Puedes guardar recuerdos relacionados con tus sentimientos y luego escuchar un recuerdo según cómo te sientas en el momento. Solo di "Guardar un recuerdo" para añadir algo nuevo, o "Escuchar un recuerdo" para escuchar uno acorde a tu estado emocional actual. ¿Qué te gustaría hacer?';

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();

    }
};

// Manejador para dar guardar recuerdos
const guardarRecuerdosHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'guardarRecuerdos';
    },
    async handle(handlerInput) {

        let speakOutput = '¡Genial, vamos a añadir un nuevo recuerdo a tu diario de recuerdos! Para guardar un nuevo recuerdo a tu diario deberás indicar un título, su descripción y un sentimiento relacionado. ';

        speakOutput +=  'Para el título del recuerdo, por favor di: "El título de mi recuerdo es", seguido del título del recuerdo.';

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();

    }
};

// Manejador para dar titulo a los recuerdos
const capturarTituloRecuerdosHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'capturarTituloRecuerdos';
    },
    async handle(handlerInput) {

        const tituloRecuerdo = handlerInput.requestEnvelope.request.intent.slots.tituloRecuerdo.value;

        // Guardar el título en los atributos del handlerInput
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.tituloRecuerdo = tituloRecuerdo;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        let speakOutput = `¡Perfecto! ¿Cúal es la descripción para ${tituloRecuerdo}?. Para añadir la descripción debes decir: "La descripción de mi recuerdo es", seguido de la descripción del recuerdo.`;

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();

    }
};

// Manejador para dar descripcion a los recuerdos
const capturarDescripcionRecuerdosHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'capturarDescripcionRecuerdos';
    },
    async handle(handlerInput) {

        const descripcionRecuerdo = handlerInput.requestEnvelope.request.intent.slots.descripcionRecuerdo.value;

        // Guardar la descripción en los atributos del handlerInput
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.descripcionRecuerdo = descripcionRecuerdo;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        let speakOutput = `¡Perfecto, ya tenemos la descripción! Ahora solo di: "se relaciona con el sentimiento", seguido de: `;

        if (GENEROADOLESCENTE == 'masculino')
            speakOutput += `"feliz, triste, estresado, motivado o agotado", para guardar el recuerdo. `;
        else if (GENEROADOLESCENTE == 'femenino')
            speakOutput += `"feliz, triste, estresada, motivada o agotada", para guardar el recuerdo.`;

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();

    }
};

const capturarSentimientoRecuerdosHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'capturarSentimientoRecuerdos';
    },
    async handle(handlerInput) {

        // Recuperar el título y la descripción del manejador anterior de los atributos
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const tituloRecuerdo = attributes.tituloRecuerdo;
        const descripcionRecuerdo = attributes.descripcionRecuerdo;

        const sentimientoRecuerdo = handlerInput.requestEnvelope.request.intent.slots.sentimientoRecuerdo.value;

        await bbdd.guardarRecuerdo(USERID, tituloRecuerdo, descripcionRecuerdo, sentimientoRecuerdo);

        await bbdd.actualizarNumRecuerdos(USERID);

        let speakOutput = `¡Recuerdo guardado con éxito! Podrás eliminarlo en cualquier momento diciendo: 'Eliminar recuerdo', seguido del título del recuerdo. Para escuchar un recuerdo, simplemente di 'Escuchar un recuerdo'. `;

        speakOutput += '¿Qué necesitas ahora?: respiración, meditación, terapia con juegos o escuchar un recuerdo';

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();

    }
};

// Manejador para dar recuperar recuerdos
const recuperarRecuerdosHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'recuperarRecuerdos';
    },
    async handle(handlerInput) {

        const sentimientoActual = await bbdd.getSentimientoUsuario(USERID);

        const recuerdo = await bbdd.recuperarRecuerdoPorSentimiento(USERID, sentimientoActual);

        let speakOutput = '';

        if(recuerdo != null)
            speakOutput += `Para ayudarte con tu sentimiento actual, aquí tienes un recuerdo relacionado con ${sentimientoActual}. <break time="1s"/> El título es <prosody rate="slow">'${recuerdo.titulo}'</prosody> y la descripción es <prosody rate="slow">'${recuerdo.descripcion}'</prosody>. <break time="1s"/> Espero que este recuerdo te haya hecho sentir mejor.`;
        else
            speakOutput += `Aún no tienes ningún recuerdo relacionado con tu sentimiento actual ${sentimientoActual}. Para crear tu primer recuerdo debes decir "guardar un recuerdo". `;


        speakOutput += '¿Qué necesitas ahora?: respiración, meditación, terapia con juegos, guardar o escuchar un recuerdo.';

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();

    }
};

// Manejador para eliminar un recuerdo
const eliminarRecuerdoHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'eliminarRecuerdo';
    },
    async handle(handlerInput) {

        const recuerdoSeleccionado = handlerInput.requestEnvelope.request.intent.slots.recuerdo.value;

        const eliminado = await bbdd.eliminarRecuerdo(USERID, recuerdoSeleccionado);

        let speakOutput = '';

        if(eliminado)
            speakOutput = `Se ha eliminado con éxito el recuerdo: ${recuerdoSeleccionado}. ¿Qué necesitas ahora?: respiración, meditación, terapia con juegos, guardar o escuchar un recuerdo.`;
        else
            speakOutput = `Lo siento, no he podido eliminar el recuerdo ${recuerdoSeleccionado}. Inténtalo de nuevo.`;

        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();

    }
};

//*****************************************************************************************************************/
//                              MANEJADORES PARA TERAPIA CON JUEGOS
//*****************************************************************************************************************/


// Manejador para dar la bienvenida a la terapia con juegos
const bienvenidaTerapiaJuegosHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'bienvenidaTerapiaJuegos';
    },
    async handle(handlerInput) {

        const numJuegos = await bbdd.getNumJuegos(USERID);
        let speakOutput = '';

        if (numJuegos == 0)
            speakOutput += '¡Prepárate para una sesión de juegos terapéuticos, diseñada especialmente para ayudarte a reducir la ansiedad y el estrés! A través del juego, buscaremos juntos la calma y el bienestar. Cada vez que completes un juego, ganarás 1 punto, y por cada 5 puntos recibirás un valioso consejo como recompensa. ¡Vamos a empezar y disfrutar del camino hacia la tranquilidad! ';
        else
            speakOutput += '¡Vamos a por una sesión de juegos terapéuticos! Recuerda que cada 5 puntos obtendrás un consejo como recompensa. ';

        const juego = await bbdd.getJuego();
        const palabrasJuego = bbdd.seleccionarPalabrasJuego(juego.palabras, 4);
        const palabra1 = palabrasJuego[0];

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.ronda = 1;
        sessionAttributes.palabrasJuego = palabrasJuego;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_bridge_01"/>`;
        speakOutput += ` <break time="1s"/> ${juego.inicioJuego} <break time="1s"/> Para responder debes decir: "Mi respuesta es", seguido de tu respuesta.  <break time="1s"/>  Empecemos. La primera palabra es: "${palabra1}". `;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Cuál es tu palabra?')
            .getResponse();

    }
};

// Manejador para el desarrollo de los juegos
const terapiaJuegosHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'terapiaJuegos';
    },
    async handle(handlerInput) {

        const palabra = handlerInput.requestEnvelope.request.intent.slots.palabra.value;

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const ronda = sessionAttributes.ronda;
        const palabrasJuego = sessionAttributes.palabrasJuego;

        let speakOutput = '';

        if (ronda < 4) {
            const siguientePalabra = palabrasJuego[sessionAttributes.ronda];
            sessionAttributes.ronda += 1;
            if (sessionAttributes.ronda == 2)
                speakOutput += `${palabra}, bien hecho. <break time="1s"/> ¡Vamos con la ronda número ${sessionAttributes.ronda}! <break time="1s"/> La siguiente palabra es ${siguientePalabra}. ¿Cuál es tu respuesta?`;
            else if(sessionAttributes.ronda == 3)
                speakOutput += `${palabra}, excelente. <break time="1s"/> ¡Vamos con la ronda número ${sessionAttributes.ronda}! <break time="1s"/> La siguiente palabra es ${siguientePalabra}. ¿Cuál es tu respuesta?`;
            else
            speakOutput += `${palabra}, perfecto. <break time="1s"/> ¡Vamos con la ronda número ${sessionAttributes.ronda}! <break time="1s"/> La siguiente palabra es ${siguientePalabra}. ¿Cuál es tu respuesta?`;

        } else {
            speakOutput += '¡Excelente! Has completado las cuatro rondas y has ganado 1 punto. ¡Sigue así!';
            speakOutput += `<audio src="soundbank://soundlibrary/gameshow/gameshow_01"/>`;

            const numJuegos = await bbdd.actualizarNumJuegos(USERID);

            // Cada 5 juegos se obtiene una recompensa
            if(numJuegos % 5 == 0)
            {
                const recompensa = await bbdd.getRecompensaJuego(numJuegos);
                speakOutput += `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_03"/>`;
                speakOutput += `${recompensa} <break time="2s"/>`;
            }

            speakOutput += '¿Qué necesitas ahora?: respiración, meditación, diario de recuerdos o terapia con juegos.'
        }


    return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();

    }
};

//*****************************************************************************************************************/
//                                              MANEJADORES BASE
//*****************************************************************************************************************/

const PauseIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent';
    },
    handle(handlerInput) {
      // Aquí puedes agregar la lógica para pausar la reproducción de la sesión de respiración
      // Puedes detener la reproducción de audio, guardar el progreso actual, etc.
      const speechText = '¡Espero que hayas podido relajarte! Vuelve siempre que lo necesites.';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(true) // La sesión finaliza cuando se acaba la música
        .getResponse();
    },
  };

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = '¿Cómo puedo ayudarte?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = '¡Espero que hayas podido relajarte! Vuelve siempre que lo necesites.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Los siento, no sé responder. Inténtalo de nuevo.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Lo siento, ha ocurrido un ERROR. Inténtalo de nuevo.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


//*****************************************************************************************************************/
//                                          EXPORT DE LOS MANEJADORES
//*****************************************************************************************************************/

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        obtenerNombreHandler,
        obtenerGeneroHandler,
        obtenerObjetivoHandler,
        dedicacionDiariaHandler,
        obtenerSentimientoDiaHandler,
        nivelAnsiedadDiaHandler,
        bienvenidaSesionRespiracionHandler,
        sesionRespiracionHandler,
        bienvenidaSesionMeditacionHandler,
        sesionMeditacionHandler,
        bienvenidaRecuerdosHandler,
        guardarRecuerdosHandler,
        capturarTituloRecuerdosHandler,
        capturarDescripcionRecuerdosHandler,
        capturarSentimientoRecuerdosHandler,
        recuperarRecuerdosHandler,
        eliminarRecuerdoHandler,
        bienvenidaTerapiaJuegosHandler,
        terapiaJuegosHandler,
        PauseIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();