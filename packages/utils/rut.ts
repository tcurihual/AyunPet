
function verificarRut(_rut: string): boolean {
    let temp = 0;
    let dig = "";
    const tempRut = _rut.substring(0, 8); // Extrae los primeros 8 dígitos (sin el guion ni dígito verificador)

    for (let i = 0; i < 8; i++) {
        const digit = parseInt(tempRut.charAt(7 - i)); //Lee los numeros antes del guion en orden reverso
        if (i < 6) {
            temp += digit * (i + 2);
        } else {
            temp += digit * (i - 4);
        }
        console.log(temp);
    }

    //obtencion del ultimo digito
    const res = 11 - (temp % 11);
    if (res < 10) {
        dig = res.toString();
    } else {
        dig = "k";
    }

    console.log(res);
    return dig.toLowerCase() === _rut.charAt(_rut.length - 1).toLowerCase();
}