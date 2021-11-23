const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");

const operations = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que deseja fazer?",
        choices: ["Criar Conta", "Checar Saldo", "Depositar", "Sacar", "Sair"],
      },
    ])
    .then((anw) => {
      console.log(anw["action"]);
      if (anw["action"] == "Criar Conta") {
        createAccount();
      }
      if (anw["action"] == "Checar Saldo") {
        balanceOf();
      }
      if (anw["action"] == "Depositar") {
        deposit();
      }
      if (anw["action"] == "Sacar") {
        withdraw();
      }
      if (anw["action"] == "Sair") {
        process.exit();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
operations();

const createAccount = () => {
  console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco!"));
  console.log(chalk.bgGreen.black("Defina as opções de sua conta a seguir"));
  buildAccount();
};

const checkAccount = (account) => {
  if (fs.existsSync(`accounts/${account}.json`)) {
    console.log("Conta Encontrada");
    return true;
  } else {
    console.log("Conta não encontrada")
    return false;
  }
};

const buildAccount = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "what´s your name?",
      },
    ])
    .then((answer) => {
      const account = answer["accountName"];
      console.log(account);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }
      if (checkAccount(account)) {
        buildAccount();
      } else {
        fs.writeFileSync(`accounts/${account}.json`, '{"balance":0}', (err) => {
          console.log(err);
        });
      }
      console.log("Parabens " + account + ", voce criou sua conta");
      operations();
    })
    .catch((err) => {
      console.log(err);
    });
};

const balanceOf = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (checkAccount(accountName)) {
        accountData = getAccount(accountName);
        console.log(
          chalk.bgGreen.black("Your balance is " + accountData.balance)
        );
        operations();
      } else {
        console.log("account not found");
        operations();
      }
    });
};

const deposit = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (checkAccount(accountName)) {
        inquirer
          .prompt([
            {
              name: "amount",
              message: "Quanto você deseja depositar?",
            },
          ])
          .then((answer) => {
            const amount = answer["amount"];

            addAmount(amount, accountName);
            operations();
          });
      } else {
        return deposit()
      }
    });
};

const getAccount = (accountName) => {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(accountJSON);
};

const addAmount = (amount, accountName) => {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    );
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
  );
};

const withdraw = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (checkAccount(accountName)) {
        inquirer
          .prompt([
            {
              name: "amount",
              message: "Quanto você deseja sacar?",
            },
          ])
          .then((answer) => {
            const amount = answer["amount"];

            withdrawA(amount, accountName);
            
          });
      } else {
        return withdraw()
      }
    });
};
const withdrawA = (amount, accountName) => {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    );
    return deposit();
  }
  if (Number(amount) <= accountData.balance) {
     parseFloat(accountData.balance) -=  parseFloat(amount);

    fs.writeFileSync(
      `accounts/${accountName}.json`,
      JSON.stringify(accountData),
      function (err) {
        console.log(err);
      }
    );

    console.log(chalk.green(`Foi Sacado o valor de R$${amount} na sua conta!`));
    operations();
  } else {
    console.log("Insufficient amount")
    return withdraw()
  }
};
