export const DOMINIOS_PERMITIDOS = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "live.com"
];

export function normalizarEmail(email) {
    return email.trim().toLowerCase();
}

export function emailTemDominioValido(email) {
    const partes = email.split("@");

    if (partes.length !== 2) {
        return false;
    }

    return DOMINIOS_PERMITIDOS.includes(partes[1]);
}
