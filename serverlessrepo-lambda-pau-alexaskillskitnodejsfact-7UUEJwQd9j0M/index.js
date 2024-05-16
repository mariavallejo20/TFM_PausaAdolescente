
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
                
            speakOutput = `¡Hola de nuevo, ${NOMBREADOLESCENTE}! <break time="1s"/>¿Cómo te sientes hoy?: ${sentimientosGenero}`;
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
            
            // Añadimos el sentimiendo del día del usuario en fucnión del idUsuario
            await bbdd.addSentimientoDiaUsuario(USERID, sentimientoDia);
            
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
            const speakOutput = `${nivelAnsiedad}, entendido. Vamos a trabajar en ello juntos. <break time="1s"/> ¿Qué necesitas?: respiración, meditación, juego o terapia`;
            
            // Añadimos el nivel de ansiedad del usuario en fucnión del idUsuario
            await bbdd.addnivelAnsiedadUsuario(USERID, nivelAnsiedad);
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Dime qué necesitas: : respiración, meditación, juego o terapia.')
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

        speakOutput += 'Elige la temática de tu sesión de meditación de hoy, puedes decir: "sesión de meditación de visualización, conexión con el cuerpo, gratitud, o calma"'

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