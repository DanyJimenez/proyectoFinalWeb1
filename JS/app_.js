
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
    return username === username && password === password;
}

//...

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
                transactionList.innerHTML += `<li>Retiro de COP $${parsedAmount} realizado. Su nuevo saldo es $${saldo - parsedAmount}. Hora del movimiento: ${horaActual.toLocaleTimeString()}</li>`;

                saldo -= parsedAmount;

                saldoParagraph.textContent = `Saldo: COP $${saldo}`;
            } else {
                transactionList.innerHTML += "<li>Monto de retiro inválido.</li>";
            }
        }
    });




    depositButton.addEventListener("click", () => {
        let horaActual = new Date();
        const amountToDeposit = prompt("Ingrese el monto que desea depositar:");
    
        const validAmount = /^\d+$/.test(amountToDeposit);
    
        if (validAmount) {
            const parsedAmount = parseInt(amountToDeposit);
    
            if (!isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= saldo) {
                const paymentReference = prompt("Ingrese la referencia de pago:");
    
                const validReference = /^\d{4}$/.test(paymentReference);
    
                if (validReference) {
                    transactionList.innerHTML += `<li>Consignación de COP $${parsedAmount} realizada. Su nuevo saldo es $${saldo - parsedAmount}. Hora del movimiento: ${horaActual.toLocaleTimeString()}</li>`;
    
                    saldo -= parsedAmount;
    
                    saldoParagraph.textContent = `Saldo: COP $${saldo}`;
                    sessionStorage.setItem('saldo', saldo.toString());
                } else {
                    transactionList.innerHTML += "<li>Referencia de pago inválida. Debe tener 4 dígitos.</li>";
                }
            } else {
                transactionList.innerHTML += "<li>Monto de consignación inválido.</li>";
            }
        } else {
            transactionList.innerHTML += "<li>Por favor, ingrese un monto válido.</li>";
        }
    });
    


    transferButton.addEventListener("click", () => {
        let horaActual = new Date();
        const amountToTransfer = prompt("Ingrese el monto que desea transferir:");
        const account = prompt("Ingrese el número de cuenta:");
    
        const validAmount = /^\d+$/.test(amountToTransfer);
        const validAccount = /^[a-zA-Z0-9]{6,20}$/.test(account);
    
        if (validAmount && validAccount) {
            const parsedAmount = parseInt(amountToTransfer);
    
            if (!isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= saldo) {
                transactionList.innerHTML += `<li>Transferencia de COP $${parsedAmount} al número de cuenta ${account} realizada. Saldo restante: $${saldo - parsedAmount}. Hora del movimiento: ${horaActual.toLocaleTimeString()}</li>`;
    
                saldo -= parsedAmount;
    
                saldoParagraph.textContent = `Saldo: COP $${saldo}`;
                sessionStorage.setItem('saldo', saldo.toString());
            } else {
                transactionList.innerHTML += "<li>Monto de transferencia inválido.</li>";
            }
        } else {
            transactionList.innerHTML += "<li>Por favor, ingrese un monto válido y un número de cuenta no mayor ni menor a 8 dígitos.</li>";
        }
    });
    
    




    balanceButton.addEventListener("click", () => {
        let horaActual = new Date();
        const saldoParagraph = document.getElementById("saldo"); 

        saldoParagraph.textContent = `Consulta de saldo: COP $${saldo}. Hora del movimiento: ${horaActual.toLocaleTimeString()}`;
        transactionList.innerHTML += "<li>Consulta de saldo realizada</li>";
    });


    logoutButton.addEventListener("click", () => {
        loggedInUser = null;
        loginAttempts = 0;
        atmContainer.innerHTML = "";
        loginForm.reset();
        document.getElementById("saldo").textContent = ""; 
        document.getElementById("transactionList").innerHTML = ""; 
    });

}

