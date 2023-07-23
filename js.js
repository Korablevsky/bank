"use strict";

const account1 = {
    owner: "Dmitrii Fokeev",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    pin: 1111,
    movementsDates: [
        "2022-11-18T21:31:17.178Z",
        "2022-12-23T07:42:02.383Z",
        "2023-01-28T09:15:04.904Z",
        "2023-06-01T10:17:24.185Z",
        "2023-07-15T14:11:59.604Z",
        "2023-07-20T17:01:17.194Z",
        "2023-07-21T23:36:17.929Z",
        "2023-07-22T10:51:36.790Z",
    ],
    currency: "RUB",
    locale: "ru-RU",
};

const account2 = {
    owner: "Anna Filimonova",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    pin: 2222,

    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account3 = {
    owner: "Polina Filimonova",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    pin: 3333,

    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "EUR",
    locale: "es-PE",
};

const account4 = {
    owner: "Stanislav Ivanchenko",
    movements: [430, 1000, 700, 50, 90],
    pin: 4444,

    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
    ],
    currency: "USD",
    locale: "ru-RU",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const overlay = document.querySelector(".overlay"); // оверлей замыливание
const hidden = document.querySelectorAll(".hidden");
const modal = document.querySelector(".modal");
const modalError = document.querySelector(".modal--error");
const buttonCloseModal = document.querySelector(".close-modal");

// Даты
function formaMovementsDate(date) {
    const calcDaysPassed = function (date1, date2) {
        return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
    };
    const daysPassed = calcDaysPassed(new Date(), date);
    console.log(daysPassed);

    if (daysPassed === 0) return "Сегодня";
    if (daysPassed === 1) return "Вчера";
    if (daysPassed >= 2 && daysPassed <= 4) return `Прошло ${daysPassed} дня`;
    if (daysPassed <= 7) return `Прошло ${daysPassed} дней`;
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    const hours = `${date.getHours()}`.padStart(2, 0);
    const minutes = `${date.getMinutes()}`.padStart(2, 0);
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

//  ----  Modal window  ----
function modalWindowOpen(close) {
    overlay.classList.remove("hidden");
    close.classList.remove("hidden");
    buttonCloseModal.addEventListener("click", function () {
        overlay.classList.add("hidden");
        close.classList.add("hidden");
    });
    overlay.addEventListener("click", function () {
        overlay.classList.add("hidden");
        close.classList.add("hidden");
    });
}

// Вывод на страницу всех приходов и уходов
function displayMovements(acc, sort = false) {
    containerMovements.innerHTML = "";

    const movs = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements;

    movs.forEach(function (value, i) {
        const type = value > 0 ? "deposit" : "withdrawal";
        const typeMessage = value > 0 ? "внесение" : "перевод";
        const date = new Date(acc.movementsDates[i]);

        const displayDate = formaMovementsDate(date);

        const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${typeMessage}
          </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${Intl.NumberFormat(
              currentAccount.locale,
              currentAccount.currency
          ).format(value)} ${currentAccount.currency}</div>
        </div>
    `;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
}

// Создание логина из ФИО в объекте
function createLogIn(accs) {
    accs.forEach(function (acc) {
        acc.logIn = acc.owner
            .toLowerCase()
            .split(" ")
            .map(function (val) {
                return val[0];
            })
            .join("");
    });
}
createLogIn(accounts);

// Подсчет и вывод на страницу общего баланса
function calcPrintBalance(acc) {
    acc.balance = acc.movements.reduce(function (acc, val) {
        return acc + val;
    });

    labelBalance.textContent = `${Intl.NumberFormat(
        currentAccount.locale,
        currentAccount.currency
    ).format(acc.balance)} ${currentAccount.currency}`;
}

// Сумма и вывод на страницу прихода и ухода в footer
function calcDisplaySum(movements) {
    const incomes = movements
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${Intl.NumberFormat(
        currentAccount.locale,
        currentAccount.currency
    ).format(incomes)} ${currentAccount.currency}`;

    const out = movements
        .filter((mov) => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Intl.NumberFormat(
        currentAccount.locale,
        currentAccount.currency
    ).format(Math.abs(out))} ${currentAccount.currency}`;

    labelSumInterest.textContent = `${Intl.NumberFormat(
        currentAccount.locale,
        currentAccount.currency
    ).format(incomes + out)} ${currentAccount.currency}`;
}

//Обновление интерфейса сайта
function updateUi(acc) {
    displayMovements(acc);
    calcPrintBalance(acc);
    calcDisplaySum(acc.movements);
}

// таймер сессии
function startLogOut() {
    let time = 300;

    // сделали отдельную функцию, которая отвечает за отсчет посекундно
    function tick() {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const seconds = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${seconds}`;

        if (time === 0) {
            clearInterval(timer);
            containerApp.style.opacity = 0;
        }
        time--;
    }
    tick();

    const timer = setInterval(tick, 1000);
    return timer;
}

//Кнопка входа в аккаунт

let currentAccount;
let timer;
btnLogin.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Login");
    currentAccount = accounts.find(function (acc) {
        return acc.logIn === inputLoginUsername.value;
    });
    console.log(currentAccount);
    if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
        containerApp.style.opacity = 100;

        inputLoginPin.value = inputLoginUsername.value = "";

        // Обновление текущей даты

        const local = navigator.language;
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        };

        // команда которая до запуская таймера отображает время
        labelDate.textContent = Intl.DateTimeFormat(local, options).format(
            new Date()
        );

        // функция запуская и отображаения времени
        function tickTack() {
            labelDate.textContent = Intl.DateTimeFormat(
                "ru-RU",
                options
            ).format(new Date());
        }
        // запуск функции с периодичностью 1000 милисекунд
        setInterval(tickTack, 1000);

        // если таймер существует, то останавливаем его, это проверка после входа
        if (timer) {
            clearInterval(timer);
        }
        timer = startLogOut();
        updateUi(currentAccount);
    }
});

//Перевод денег на другой аккаунт
btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();
    const reciveAcc = accounts.find(function (acc) {
        return acc.logIn === inputTransferTo.value;
    });
    const amount = Number(inputTransferAmount.value);
    console.log(amount, reciveAcc);
    if (
        reciveAcc &&
        amount > 0 &&
        currentAccount.balance >= amount &&
        reciveAcc.logIn !== currentAccount.logIn
    ) {
        currentAccount.movements.push(-amount); // расходная операция отправителя
        reciveAcc.movements.push(amount); // приходная операция получателя

        reciveAcc.movementsDates.push(new Date().toISOString()); // дата операции получателя
        currentAccount.movementsDates.push(new Date().toISOString()); // дата операции отправителя

        clearInterval(timer); // сбрасываем таймер сессии
        timer = startLogOut(); // запускаем таймер сессии

        modalWindowOpen(modal);

        updateUi(currentAccount);
        inputTransferTo.value = inputTransferAmount.value = "";
    }
});

//Удаление аккаунта
btnClose.addEventListener("click", function (e) {
    e.preventDefault();
    if (
        inputCloseUsername.value === currentAccount.logIn &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        const index = accounts.findIndex(function (acc) {
            return acc.logIn === currentAccount.logIn;
        });
        console.log(index);
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
        console.log(accounts);
    }
    inputCloseUsername.value = inputClosePin.value = "";
});

//Внесение денег на счет
btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if (amount > 0) {
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());

        clearInterval(timer); //сбрасываем таймер сессии
        timer = startLogOut(); // запускаем таймер сессии

        modalWindowOpen(modal);

        updateUi(currentAccount);
    }
    inputLoanAmount.value = "";
});

// Общий баланс длинно
// const accMov = accounts.map(function (acc) {
//   return acc.movements;
// });
// const allMov = accMov.flat();

// const allBalance = allMov.reduce(function (acc, mov) {
//   return acc + mov;
// }, 0);
// console.log(allBalance);

// Общий баланс коротко
const overalBalance = accounts
    .map((acc) => acc.movements)
    .flat()
    .reduce((acc, mov) => acc + mov, 0);

//Сортировка по приходам и уходам
let sorted = false;
btnSort.addEventListener("click", function (e) {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});

//Изменение значка валюты
// labelBalance.addEventListener("click", function (e) {
//     e.preventDefault();

//     Array.from(
//         document.querySelectorAll(".movements__value"),
//         function (val, i) {
//             return (val.innerText = val.textContent.replace("₽", "RUB"));
//         }
//     );
// });

// function startTime() {
//     let realTime = new Date();

//     setInterval(function tick() {
//         let hour = String(realTime.getHours()).padStart(2, 0);
//         let minute = String(realTime.getMinutes()).padStart(2, 0);
//         let second = String(realTime.getSeconds()).padStart(2, 0);

//         console.log(hour, minute, second);
//     }, 1000);
// }

// let realDate = new Date();
// const options = {
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//     hour12: false,
// };

// const ru = Intl.DateTimeFormat("ru-RU", options).format(new Date());
// function tickTack() {
//     console.log(Intl.DateTimeFormat("ru-RU", options).format(new Date()));
// }
// setInterval(tickTack, 1000);
