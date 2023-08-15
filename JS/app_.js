// 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

const loginForm = document.getElementById("loginForm");
const atmContainer = document.getElementById("atm");

let loggedInUser = null;
let loginAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 3;

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    // Validación de usuario y contraseña
    const userRegex = /^[a-zA-Z\u00C0-\u00FF\s]{1,20}$/;
    const passRegex = /^[a-zA-Z0-9]{8,}$/;


    if (userRegex.test(username) && passRegex.test(password)) {
        // Aquí debes agregar la lógica para validar el inicio de sesión y bloquear después de tres intentos fallidos
        if (validarCredenciales(username, password)) {
            loggedInUser = username;
            displayATM();
        } else {
            loginAttempts++;
            if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                loginForm.innerHTML = "<p>Lo sentimmos. Has excedido el número máximo de intentos.</p>";
            } else {
                alert("Credenciales incorrectas. Intenta de nuevo.");
            }
        }
    } else {
        alert("Credenciales inválidas. Asegúrate de que el usuario cumpla con el formato alfabético y la contraseña contenga al menos 8 caracteres alfanuméricos.");
    }
});

function validarCredenciales(username, password) {
    // Aquí debes implementar la lógica para validar las credenciales con la base de datos u otra fuente de información
    // Retorna true si las credenciales son válidas, o false si no lo son
    // También puedes implementar el bloqueo después de tres intentos fallidos aquí
    // Ejemplo simplificado:
    return username === username && password === password;
}

// Resto del código...

function nombre_mayusculas(nombre) {
    const partes = nombre.split(' ');
    const nombreMayuscula = partes.map(part => part.slice(0, 1).toUpperCase() + part.slice(1)).join(' ');
    return nombreMayuscula;
}



function displayATM() {
    loginForm.style.display = "none";
    atmContainer.innerHTML = `
        <h2>Bienvenido, ${nombre_mayusculas(loggedInUser)}.</h2>
        <button id="withdraw">Retirar Dinero</button>
        <button id="deposit">Consignar Dinero</button>
        <button id="transfer">Transferir Dinero</button>
        <button id="balance">Consultar Saldo</button>
        <div id="transactions">
            <h3>Movimientos</h3>
            <ul id="transactionList"></ul>
        </div>
        <button id="logout">Cerrar Sesión</button>
    `;
    let saldoTotal = 1000000;
    sessionStorage.setItem('saldo', saldoTotal.toString());

    // Recuperar desde sessionStorage y convertir de vuelta a número
    let saldo = parseInt(sessionStorage.getItem('saldo'));

    const transactionList = document.getElementById("transactionList");

    const withdrawButton = document.getElementById("withdraw");
    const depositButton = document.getElementById("deposit");
    const transferButton = document.getElementById("transfer");
    const balanceButton = document.getElementById("balance");
    const logoutButton = document.getElementById("logout");



    //

    withdrawButton.addEventListener("click", () => {
        let horaActual = new Date();
        
        const amountToWithdraw = prompt("Ingrese el monto que desea retirar:");

        if (amountToWithdraw !== null && amountToWithdraw !== "") {
            const parsedAmount = parseInt(amountToWithdraw);

            if (!isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= saldo) {
                // Mostrar el mensaje de retiro realizado en la lista de transacciones
                transactionList.innerHTML += `<li>Retiro de COP $${parsedAmount} realizado. Su nuevo saldo es $${saldo - parsedAmount}. Hora del movimiento: ${horaActual.toLocaleTimeString()}</li>`;

                // Restar el monto retirado al saldo
                saldo -= parsedAmount;

                // Actualizar el párrafo del saldo con el nuevo saldo restante
                saldoParagraph.textContent = `Saldo: COP $${saldo}`;
            } else {
                // Mostrar un mensaje de error si el monto es inválido
                transactionList.innerHTML += "<li>Monto de retiro inválido.</li>";
            }
        }
    });




    depositButton.addEventListener("click", () => {
        let horaActual = new Date();
        // Preguntar al usuario cuánto desea depositar
        const amountToDeposit = prompt("Ingrese el monto que desea depositar:");
    
        // Validar que el monto sea un número positivo
        const validAmount = /^\d+$/.test(amountToDeposit);
    
        if (validAmount) {
            const parsedAmount = parseInt(amountToDeposit);
    
            if (!isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= saldo) {
                // Validar la referencia de pago
                const paymentReference = prompt("Ingrese la referencia de pago:");
    
                // Validar que la referencia tenga exactamente 4 dígitos
                const validReference = /^\d{4}$/.test(paymentReference);
    
                if (validReference) {
                    // Mostrar el mensaje de consignación realizada en la lista de transacciones
                    transactionList.innerHTML += `<li>Consignación de COP $${parsedAmount} realizada. Su nuevo saldo es $${saldo - parsedAmount}. Hora del movimiento: ${horaActual.toLocaleTimeString()}</li>`;
    
                    // Restar el monto consignado al saldo
                    saldo -= parsedAmount;
    
                    // Actualizar el párrafo del saldo con el nuevo saldo restante
                    saldoParagraph.textContent = `Saldo: COP $${saldo}`;
                    // Actualizar también el saldo en el sessionStorage
                    sessionStorage.setItem('saldo', saldo.toString());
                } else {
                    // Mostrar un mensaje de error si la referencia de pago es inválida
                    transactionList.innerHTML += "<li>Referencia de pago inválida. Debe tener 4 dígitos.</li>";
                }
            } else {
                // Mostrar un mensaje de error si el monto es inválido
                transactionList.innerHTML += "<li>Monto de consignación inválido.</li>";
            }
        } else {
            // Mostrar un mensaje de error si el monto no es válido
            transactionList.innerHTML += "<li>Por favor, ingrese un monto válido.</li>";
        }
    });
    


    transferButton.addEventListener("click", () => {
        let horaActual = new Date();
        const amountToTransfer = prompt("Ingrese el monto que desea transferir:");
        const account = prompt("Ingrese el número de cuenta:");
    
        // Validar que el monto sea un número positivo y que el número de cuenta cumpla con ciertos criterios
        const validAmount = /^\d+$/.test(amountToTransfer);
        const validAccount = /^[a-zA-Z0-9]{6,20}$/.test(account);
    
        if (validAmount && validAccount) {
            const parsedAmount = parseInt(amountToTransfer);
    
            if (!isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= saldo) {
                // Mostrar el mensaje de transferencia realizada en la lista de transacciones
                transactionList.innerHTML += `<li>Transferencia de COP $${parsedAmount} al número de cuenta ${account} realizada. Saldo restante: $${saldo - parsedAmount}. Hora del movimiento: ${horaActual.toLocaleTimeString()}</li>`;
    
                // Restar el monto transferido al saldo
                saldo -= parsedAmount;
    
                // Actualizar el párrafo del saldo con el nuevo saldo restante
                saldoParagraph.textContent = `Saldo: COP $${saldo}`;
                // Actualizar también el saldo en el sessionStorage
                sessionStorage.setItem('saldo', saldo.toString());
            } else {
                // Mostrar un mensaje de error si el monto es inválido
                transactionList.innerHTML += "<li>Monto de transferencia inválido.</li>";
            }
        } else {
            // Mostrar un mensaje de error si el monto o el número de cuenta no cumplen con los requisitos
            transactionList.innerHTML += "<li>Por favor, ingrese un monto válido y un número de cuenta no mayor ni menor a 8 dígitos.</li>";
        }
    });
    
    




    balanceButton.addEventListener("click", () => {
        let horaActual = new Date();
        const saldoParagraph = document.getElementById("saldo"); // Asume que tienes un elemento con el ID "saldo" para mostrar el saldo

        // Actualiza el párrafo del saldo y registra la consulta de saldo
        saldoParagraph.textContent = `Consulta de saldo: COP $${saldo}. Hora del movimiento: ${horaActual.toLocaleTimeString()}`;
        transactionList.innerHTML += "<li>Consulta de saldo realizada</li>";
    });


    logoutButton.addEventListener("click", () => {
        loggedInUser = null;
        loginAttempts = 0;
        atmContainer.innerHTML = "";
        loginForm.reset();
        document.getElementById("saldo").textContent = ""; // Limpia el contenido del elemento con ID "saldo"
        document.getElementById("transactionList").innerHTML = ""; // Limpia el contenido de la lista de transacciones
    });

}

