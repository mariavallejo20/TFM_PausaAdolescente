// Función para convertir la duración en formato ISO 8601 a texto legible
function convertirDuracion(duracionISO) {
    const duracion = duracionISO.match(/PT(\d+H)?(\d+M)?/);

    if (!duracion) {
        return 'Duración no válida';
    }

    let horas = 0;
    let minutos = 0;

    if (duracion[1]) {
        horas = parseInt(duracion[1].replace('H', ''));
    }

    if (duracion[2]) {
        minutos = parseInt(duracion[2].replace('M', ''));
    }

    if (horas === 0 && minutos === 0) {
        return 'Duración no válida';
    }

    const partes = [];

    if (horas > 0) {
        partes.push(`${horas} hora${horas !== 1 ? 's' : ''}`);
    }

    if (minutos > 0) {
        partes.push(`${minutos} minuto${minutos !== 1 ? 's' : ''}`);
    }

    return partes.join(' y ');
}

module.exports = {
    convertirDuracion
};