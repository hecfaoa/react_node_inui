function minDoctors(doctorsCapacities, attentionHours) {
    // Creamos un arreglo para almacenar el mínimo número de doctores para cada cantidad de horas
    const dp = new Array(attentionHours + 1).fill(Infinity);
    
    // Se necesitan 0 doctores para 0 horas
    dp[0] = 0;

    // Iterar sobre cada capacidad de doctor
    for (let capacity of doctorsCapacities) {
        // Actualizar el dp para cada cantidad de horas desde la capacidad del doctor hasta attentionHours
        for (let j = capacity; j <= attentionHours; j++) {
            dp[j] = Math.min(dp[j], dp[j - capacity] + 1);
        }
    }

    // Si dp[attentionHours] sigue siendo Infinity, significa que no se puede cubrir exactamente el objetivo
    return dp[attentionHours] === Infinity ? -1 : dp[attentionHours];
}

// Ejemplo de uso
const doctorsCapacities = [3, 9, 7];
const attentionHours = 21;
console.log(minDoctors(doctorsCapacities, attentionHours)); // Debería imprimir 3 dos doctores de 9 y uno de 3