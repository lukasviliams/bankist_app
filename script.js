"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

// display
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBlance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, dep) => acc + dep, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernNames(accounts);
const updateUI = function (acc) {
  // display and calc movements
  displayMovements(acc.movements);
  // display and calc balance
  calcDisplayBlance(currentAccount);
  // display and calc summary
  calcDisplaySummary(currentAccount);
};
// Event handlers
///////////////////sign in
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  //prevent form from submiting
  e.preventDefault();

  // get username
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and a welcome msg
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear the input fields
    inputLoginPin.value = "";
    inputLoginUsername.value = "";
    inputLoginPin.blur();
    // Update UI
    updateUI(currentAccount);
  }
});
////////////////////////////////////////
// transfer button
btnTransfer.addEventListener("click", function (e) {
  // prevent form from submiting
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  //Clear the input
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //Transfer money
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //UpdateUI
    updateUI(currentAccount);
  }
});
////////////////////////////////////////////////
//LOAN BUTTON
btnLoan.addEventListener("click", function (e) {
  //prevent form default behavior
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount >= 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //Add movements
    currentAccount.movements.push(amount);

    //UpdateUI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});
/////////////////////////////////////////////////

//CLOSE BUTTON
btnClose.addEventListener("click", function (e) {
  //prevent default form behavior
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === Number(currentAccount.pin)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // console.log(index);

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  //clear the input
  inputCloseUsername.value = "";
  inputClosePin.value = "";
});

//Sort button
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//Slice
/*
let arr = ["a", "b", "c", "d", "e"];

// let arr2 = arr.slice(2);
// console.log(arr2);

//Splice
// console.log(arr.splice(2));
arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

//Reverse
arr = ["a", "b", "c", "d", "e"];
const arr2 = ["j", "i", "h", "g", "f"];
console.log(arr2.reverse());
console.log(arr2);
//Concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);
//join
console.log(letters.join("/"));
*/
//for each
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const movement of movements)
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`movement ${i + 1}: You have deposited ${movement}`);
  } else {
    console.log(`movement ${i + 1}: you have withdraw ${Math.abs(movement)}`);
  }
}

console.log("----forEach-----\n-------");
movements.forEach(function (movement, i, array) {
  if (movement > 0) {
    console.log(`movement ${i + 1}: You have deposited ${movement}`);
  } else {
    console.log(`movement ${i + 1}: you have withdraw ${Math.abs(movement)}`);
  }
});
*/
//for each with maps and sets
//Map
/*
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//Set
const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR"]);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${key}: ${value}`);
});
*/

/*
Coding Challenge #1
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
about their dog's age, and stored the data into an array (one array for each). For
now, they are just interested in knowing whether a dog is an adult or a puppy.
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
old.
Your tasks:
Create a function 'checkDogs', which accepts 2 arrays of dog's ages
('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the first and the last two dogs actually have
cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
ages from that copied array (because it's a bad practice to mutate function
parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
🐶
")
4. Run the function for both test datasets
Test data:
§ Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
§ Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
Hints: Use tools from all lectures in this section so far 😉
GOOD LUCK 😀


const checkdogs = function (dogsJulia, dogsKate) {};

const dataJulia = [3, 5, 2, 12, 7];
const dataKate = [4, 1, 15, 8, 3];
const dataShalowJulia = [...dataJulia];
// console.log(dataShalowJulia);
dataShalowJulia.shift();
dataShalowJulia.pop();
dataShalowJulia.pop();
// console.log(dataShalowJulia);
const dataArrDogs = [...dataShalowJulia, ...dataKate];
dataArrDogs.forEach(function (data, i) {
  data >= 3
    ? console.log(`This ${i + 1} dog is ${data} years old and is adult dog`)
    : console.log(`This ${i + 1} dog is ${data} years old and is a puppy`);
});
*/

//////////////////////////////////////////////////////////////////////////////////////Maps//////////////////////////////////////
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
const movementsUsd = movements.map((mov) => Math.round(mov * eurToUsd));
// // movements.map(function (mov) {
//   return Math.round(mov * eurToUsd);
// return 23;
// });

console.log(movements);
console.log(movementsUsd);

// for (const mov of movements) {
//   const test = mov * eurToUsd;
//   console.log(test);
// }

const movementsDescriptions = movements.map((mov, i) => {
  if (mov > 0) {
    return `movement ${i + 1}: You have deposited ${mov}`;
  } else {
    return `movement ${i + 1}: you have withdraw ${Math.abs(mov)}`;
  }
});
console.log(movementsDescriptions);

*/
////////////////////////////////////////////////////////////////////////////////////////////Filter/////////////////////////////////
/*
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) depositsFor.push(mov);
}
console.log(depositsFor);

const withdrawals = movements.filter(function (wit) {
  return wit < 0;
});
console.log(withdrawals);
*/
//////////////////////////////////////////////////////////////////////////////////////////////////Reduce////////////////////////////
/*
console.log(movements);
//Accumulater is like a snowball
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + curr;
// }, 0);
// console.log(balance);

const balance = movements.reduce((acc, curr) => acc + curr, 0);
console.log(balance);

let balance2 = 0;
//For loop example of reduce
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);
//Maximum value of the array
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else {
    return mov;
  }
}, movements[0]);
console.log(max);
*/
/////////////////////////////////////////////////////////////////////////////////////Coding chalenge 2//////////////////////////////
/*
Let's go back to Julia and Kate's study about dogs. This time, they want to convert
dog ages to human ages and calculate the average age of the dogs in their study.
Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which is the same as
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know
from other challenges how we calculate averages 😉)
4. Run the function for both test datasets
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]


const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(humanAge);
  const excludeYungDogs = humanAge.filter((age) => age > 18);
  console.log(excludeYungDogs);

  const average = excludeYungDogs.reduce(function (acc, cur) {
    return acc + cur / excludeYungDogs.length;
  }, 0);
  console.log(average);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

*/
/////////////////////////////////////////////////////////////////////////////////////Coding chalenge 3//////////////////////////////
/*
// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]

const calcAverageHumanAge = (ages) =>
  ages
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age > 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, Math.round(avg2));
*/
//////////////////////////////////////////////////////////////////////////////////////////////Chainning methods////////////////////
/*
const eurToUsd = 1.1;
const movementsUsd = movements.map((mov) => Math.round(mov * eurToUsd));
// // movements.map(function (mov) {
//   return Math.round(mov * eurToUsd);
// return 23;
// });

const totalDepositUsd = movements
  .filter((mov) => mov > 0)
  // .map((mov) => mov * eurToUsd)
  .map((mov, i, arr) => {
    console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositUsd);
*/

////////////////////////////////////////////////////////////////////////////////////////////// Find Method ////////////////////
/*
const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);
// console.log(accounts);
const account = accounts.find((acc) => acc.owner === "Jessica Davis");
console.log(account);
*/
////////////////////////////////////////////////////////////////////////////////////////////// Some and every  ////////////////////
/*
// console.log(movements);
// //Equality
// console.log(movements.includes(-130));
// //conditions
// console.log(movements.some((MOV) => MOV === -130));
///////////////Some method
// const anyDeposits = movements.some((mov) => mov > 0);
// console.log(anyDeposits);
//////////////Every method
console.log(movements.every((mov) => mov > 0));
console.log(account4.movements.every((mov) => mov > 0));

//separate callback
const deposit = (mov) => mov > 0;
console.log(movements.some(deposit));
*/
////////////////////////////////////////////////////////////////////////////////////////////// Flat and flat map  //////////////////
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(1));
//flat
const accountMovements = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(accountMovements);
//flatMap
const accountMovements2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(accountMovements2);
*/
////////////////////////////////////////////////////////////////////////////////////////////// Sorting arrays  //////////////////
/*
///////////////strings
const owners = ["Jonas", "Lukas", "Zach", "Adam", "Martha"];
console.log(owners.sort());

/////////////numbers
console.log(movements);

// return < 0 ,a,b keep order
//return > 0,b,a switch order

//asscending order
movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
});
console.log(movements);
//descending order
movements.sort((a, b) => {
  if (a > b) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
});
console.log(movements);
//simplyfiing number sorting
movements.sort((a, b) => a - b);
console.log(movements);
*/
