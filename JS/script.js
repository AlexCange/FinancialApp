// Expenses 
class Expenses {
    constructor(
        ownerId = '',
        Date = '',
        Type = '',
        Description = '',
        Amount  = 0.00
    ) {
        this.ownerId = ownerId
        this.Date = Date
        this.Type = Type
        this.Description = Description
        this.Amount = Amount
    }
}
class ExpensesBook {
    constructor(){
        this.expense = []
    }

    addExpense(newExpense) {
        this.expense.push(newExpense)
    }
}

const expensesBook = new ExpensesBook()

// Incomes
class Incomes {
    constructor(
        ownerId = '',
        Amount = 0.00,
        Date = '',
        Type = ''
    ) {
        this.ownerId = ownerId
        this.Amount = Amount
        this.Date = Date
        this.Type = Type
    }
}

class IncomesBook {
    constructor(){
        this.income = []
    }

    addIncome(newIncome) {
        this.income.push(newIncome)
    }

    getIncome(Date) {
        return this.income.find((line) => line.Date == Date)
    }
}
const incomesBook = new IncomesBook()

//Savings
class Savings {
    constructor(
        ownerId = '',
        Amount = 0.00,
        Date = ''
    ) {
        this.ownerId = ownerId
        this.Amount = Amount
        this.Date = Date
    }
}

class SavingsBook {
    constructor(){
        this.saving = []
    }

    addSaving(newSaving) {
        this.saving.push(newSaving)
    }

    getSaving(Date) {
        return this.saving.find((line) => line.Date == Date)
    }
}
const savingsBook = new SavingsBook()


// -------------------- Auth -----------------------

// ---------- AUTH BTN -------------
const auth = firebase.auth();

const MainDiv = document.getElementById('AllContent')
const LogOptionsPage = document.getElementById('LogForm')

if (auth.currentUser) {
    console.log(auth.currentUser);
    LogOptionsPage.style.display = 'none'
}
else {
    console.log(101);
    LogOptionsPage.style.display = 'grid'
    MainDiv.style.display = 'none'
}


const LogInBtn = document.getElementById('LogInBtn')
const RegisterBtn = document.getElementById('RegisterBtn')

//LogIn
const LogInDiv = document.getElementById('LogInDiv')

LogInBtn.addEventListener('click', (e) => {
    e.preventDefault()
    LogOptionsPage.style.display = 'none'
    LogInDiv.style.display = 'grid'
})

const LogInEmail = document.getElementById('LogInemail')
const LogInPassword = document.getElementById('LogInPassword')
const LogInForm = document.getElementById('LogInForm')

let OnSubmitLogIn = async (e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(LogInEmail.value, LogInPassword.value).then((userCredential) => {
        let user = userCredential.user
        getExpenses()
        getIncomes()
        getSavings()
    }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
    })
    setTimeout(() => {
        UpdateAll()
    }, 1000)
    
}
LogInForm.onsubmit = OnSubmitLogIn

//Register
let RegisterDiv = document.getElementById('RegisterDiv')

RegisterBtn.addEventListener('click', (e) => {
    e.preventDefault()
    LogOptionsPage.style.display = 'none'
    RegisterDiv.style.display = 'grid'
})

const RegisterEmail = document.getElementById('Registeremail')
const RegisterPassword = document.getElementById('RegisterPassword')
const RegisterForm = document.getElementById('RegisterForm')

let OnSubmitRegister = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(RegisterEmail.value, RegisterPassword.value).then((userCredential) => {
        getExpenses()
        getIncomes()
        getSavings()
        UpdateAll()
    }).catch((error) => {
        document.getElementById('ErrorMsg').innerText = error.message
        document.getElementById('ErrorMsg').style.display = 'block'
        setTimeout(() => {
            document.getElementById('ErrorMsg').style.display = 'none'
        }, 5000)
    })
}
RegisterForm.onsubmit = OnSubmitRegister

const LogOutBtn = document.getElementById('LogOutBtn')
LogOutBtn.addEventListener('click', () => {
    auth.signOut()
    window.location.reload()
})

auth.onAuthStateChanged((user) => {
    if (user) {
        var uid = user.uid;
        LogInDiv.style.display = 'none'
        RegisterDiv.style.display = 'none'
        MainDiv.style.display = 'block'
        getExpenses();
        getIncomes();
        getSavings();
        CreateWelcomeMsg()
        UpdateAll();
    }
});

// ------------ FIREBASE CONNECT DATABASE -------------
const db = firebase.firestore()

let unsubscribe

// Expenses
const getExpenses = () => {
    unsubscribe = db
    .collection('Expenses')
    .where('ownerId', '==', auth.currentUser.uid)
    .onSnapshot((snapshot) => {
        expensesBook.expense = docsToExpenses(snapshot.docs)
    })
}

const addExpenseDB = (newExpense) => {
    db.collection('Expenses').add(ExpensetoDoc(newExpense))
}

const docsToExpenses = (docs) => {
    return docs.map((doc) => {
        return new Expenses(
            doc.data().ownerId,
            doc.data().Date,
            doc.data().Type,
            doc.data().Description,
            doc.data().Amount
        )
    })
}

const ExpensetoDoc = (expense) => {
    return {
        ownerId: auth.currentUser.uid,
        Date: expense.Date,
        Type: expense.Type,
        Description: expense.Description,
        Amount: expense.Amount
    }
}

// Incomes

const getIncomes = () => {
    unsubscribe = db
    .collection('Incomes')
    .where('ownerId', '==', auth.currentUser.uid)
    .onSnapshot((snapshot) => {
        incomesBook.income = docsToIncomes(snapshot.docs)
    })
}

const addIncomeDB = (newIncome) => {
    db.collection("Incomes").add(IncometoDoc(newIncome))
}

const docsToIncomes = (docs) => {
    return docs.map((doc) => {
        return new Incomes(
            doc.data().ownerId,
            doc.data().Amount,
            doc.data().Date,
            doc.data().Type
        )
    })
}

const IncometoDoc = (income) => {
    return {
        ownerId: auth.currentUser.uid,
        Amount: income.Amount,
        Date: income.Date,
        Type: income.Type
    }
}

// Savings
const getSavings = () => {
    unsubscribe = db
    .collection('Savings')
    .where('ownerId', '==', auth.currentUser.uid)
    .onSnapshot((snapshot) => {
        savingsBook.saving = docsToSavings(snapshot.docs)
    })
}

const addSavingDB = (newSaving) => {
    db.collection("Savings").add(SavingtoDoc(newSaving))
}

const docsToSavings = (docs) => {
    return docs.map((doc) => {
        return new Savings(
            doc.data().ownerId,
            doc.data().Amount,
            doc.data().Date
        )
    })
}

const SavingtoDoc = (saving) => {
    return {
        ownerId: auth.currentUser.uid,
        Date: saving.Date,
        Amount: saving.Amount
    }
}

// --------------- DISPLAY INFORMATIONS ---------------
const WelcomeDiv = document.getElementById('Welcome')

const BalanceDiv = document.getElementById('Balance')
const LatestSpendingsDiv = document.getElementById('LatestSpendings')
const LatestIncomesDiv = document.getElementById('LatestIncomes')
const SavingsDiv = document.getElementById('Savings')

let balance
let totalexpenses
let totalincomes
let totalsavings

const UpdateAll = () => {
    totalexpenses = 0
    totalincomes = 0
    totalsavings = 0
    expensesBook.expense.forEach((minus) => {
        totalexpenses -= parseFloat(minus.Amount)
    })
    incomesBook.income.forEach((plus) => {
        totalincomes += parseFloat(plus.Amount)
    })
    savingsBook.saving.forEach((save) => {
        totalsavings += parseFloat(save.Amount)
    })
    balance = (totalincomes + totalexpenses).toFixed(2)
    CreateContentBalance();
    CreateWelcomeMsg()
    CreateContentSpendings();
    CreateContentIncomes();
    CreateContentSavings();
    CreateChart();
}

// Balance Div
const CreateWelcomeMsg = () => {
    WelcomeDiv.innerHTML = ''
    Welcomemsg = document.createElement('p')
    if (auth.currentUser.displayName) {
        Welcomemsg.textContent = `Welcome ${auth.currentUser.displayName}`
    }
    else {
        Welcomemsg.textContent = 'Welcome!'
    }
    WelcomeDiv.appendChild(Welcomemsg)
}

const CreateContentBalance = () => {
    BalanceDiv.innerHTML = ''
    const balancemsg = document.createElement('h1')
    balancemsg.textContent = 'BALANCE'
    BalanceDiv.appendChild(balancemsg)

    const TotalBalance = document.createElement('p')
    TotalBalance.textContent = `${balance}€`
    BalanceDiv.appendChild(TotalBalance)

    let savetot = 0
    savingsBook.saving.forEach((save) => {
        savetot += parseFloat(save.Amount)
    })

    const TotalSavings = document.createElement('p')
    TotalSavings.textContent = `Your total Savings: ${savetot}€`
    BalanceDiv.appendChild(TotalSavings)
}

// Graph

const ctx = document.getElementById('myChart').getContext('2d'); // 2d context

const CreateChart = () => {new Chart(ctx, {
    type:"doughnut", 
    data: {
        labels: ['Incomes', 'Expenses', 'Savings'],
        datasets: [{
            backgroundColor: ['#adc6a8', '#e07389', '#8b9dbe'],
            data: [totalincomes, totalexpenses, totalsavings],
            borderColor: '#F8EAD8', 
        }], 
    }, 
    options: {
        title: {
            display:true,
            text:'My Balance'
        }, 
        legend: {
            display:true, 
            position:'left'
        }
    }
})}

// Spendings Div
const CreateContentSpendings = () => {
    LatestSpendingsDiv.innerHTML = ''

    const Spendingmsg = document.createElement('h1')
    Spendingmsg.textContent = 'YOUR LATEST SPENDINGS'
    LatestSpendingsDiv.appendChild(Spendingmsg)
    const SpendingsTable = document.createElement('table')
    expensesBook.expense.forEach((spending) => {
        let SpendingRow = document.createElement('tr')

        let SpendingDataDate = document.createElement('td')
        SpendingDataDate.innerHTML = Date(spending.Date.secondes).toString().substring(4,10);

        let SpendingDesc = document.createElement('td')
        SpendingDesc.textContent = `${spending.Description} - ${spending.Type}`

        let SpendingAmount = document.createElement('td')
        SpendingAmount.textContent = `${spending.Amount}€`

        SpendingRow.appendChild(SpendingDataDate)
        SpendingRow.appendChild(SpendingDesc)
        SpendingRow.appendChild(SpendingAmount)
        SpendingsTable.appendChild(SpendingRow)
    })
    LatestSpendingsDiv.appendChild(SpendingsTable)
}

// Incomes Div
const CreateContentIncomes = () => {
    LatestIncomesDiv.innerHTML = ''
    const Incomemsg = document.createElement('h1')
    Incomemsg.textContent = 'YOUR LATEST INCOMES'
    LatestIncomesDiv.appendChild(Incomemsg)

    const IncomesTable = document.createElement('table')
    incomesBook.income.forEach((income) => {
        let IncomeRow = document.createElement('tr')

        let IncomeDataDate = document.createElement('td')
        IncomeDataDate.textContent = Date(income.Date.seconds).toString().substring(4,10);

        let IncomeDesc = document.createElement('td')
        IncomeDesc.textContent = income.Type

        let IncomeAmount = document.createElement('td')
        IncomeAmount.textContent = `${income.Amount}€`

        IncomeRow.appendChild(IncomeDataDate)
        IncomeRow.appendChild(IncomeDesc)
        IncomeRow.appendChild(IncomeAmount)
        IncomesTable.appendChild(IncomeRow)
    })
    LatestIncomesDiv.appendChild(IncomesTable)
}

// Savings Div
const CreateContentSavings = () => {
    SavingsDiv.innerHTML = ''
    const savingsmsg = document.createElement('h1')
    savingsmsg.textContent = 'YOUR SAVINGS'
    SavingsDiv.appendChild(savingsmsg)
    const SavingsTable = document.createElement('table')
    savingsBook.saving.forEach((saving) => {
        let savingRow = document.createElement('tr')

        let SavingDate = document.createElement('td')
        SavingDate.textContent = Date(saving.Date.seconds).toString().substring(4,10)

        let SavingAmount = document.createElement('td')
        SavingAmount.textContent = `${saving.Amount}€`

        savingRow.appendChild(SavingDate)
        savingRow.appendChild(SavingAmount)
        SavingsTable.appendChild(savingRow)
    })
    SavingsDiv.appendChild(SavingsTable)
}


// ------------- ADD THINGS -----------------------
// Expenses
const AddExpensesBtn = document.getElementById('AddExpenseBtn')
const AddExpensesDiv = document.getElementById('AddExpenses')
const AddExpensesForm = document.getElementById('AddExpensesForm')

AddExpensesBtn.addEventListener('click', () => {
    AddExpensesDiv.style.display = 'block'
    AddIncomesDiv.style.display = 'none'
    AddSavingsDiv.style.display = 'none'
})

const getExpensesbyInput = () => {

    const Date = document.getElementById('EDate').value
    const Type = document.getElementById('EType').value
    const Description = document.getElementById('EDescription').value
    const Amount = parseFloat(document.getElementById('EAmount').value)
    const ownerId = auth.currentUser.uid

    return new Expenses(ownerId, Date, Type, Description, Amount)
}

const addExpense = (e) => {
    e.preventDefault()
    const newExpense = getExpensesbyInput()

    addExpenseDB(newExpense)
    expensesBook.addExpense(newExpense)
    setTimeout(() =>  {UpdateAll()}, 1000)
    AddExpensesForm.reset()
    AddExpensesDiv.style.display = 'none'
    AddIncomesDiv.style.display = 'none'
    AddSavingsDiv.style.display = 'none'
}

AddExpensesForm.onsubmit = addExpense

// Incomes

const AddIncomesBtn = document.getElementById('AddIncomesBtn')
const AddIncomesDiv = document.getElementById('AddIncomes')
const AddIncomesForm = document.getElementById('AddIncomesForm')

AddIncomesBtn.addEventListener('click', () => {
    AddIncomesDiv.style.display = 'block'
    AddExpensesDiv.style.display = 'none'
    AddSavingsDiv.style.display = 'none'
})

const getIncomesbyInput = () => {

    const Date = document.getElementById('IDate').value
    const Type = document.getElementById('IType').value
    const Amount = parseFloat(document.getElementById('IAmount').value)
    const ownerId = auth.currentUser.uid

    return new Incomes(ownerId, Amount, Date, Type)
}

const addIncome = (e) => {
    e.preventDefault()
    const newIncome = getIncomesbyInput()

    addIncomeDB(newIncome)
    incomesBook.addIncome(newIncome)
    setTimeout(() => {UpdateAll()}, 1000)
    AddIncomesForm.reset()
    AddExpensesDiv.style.display = 'none'
    AddIncomesDiv.style.display = 'none'
    AddSavingsDiv.style.display = 'none'
}

AddIncomesForm.onsubmit = addIncome

// Savings
const AddSavingsBtn = document.getElementById('AddSavingsBtn')
const AddSavingsDiv = document.getElementById('AddSavings')
const AddSavingsForm = document.getElementById('AddSavingsForm')

AddSavingsBtn.addEventListener('click', () => {
    AddSavingsDiv.style.display = 'block'
    AddIncomesDiv.style.display = 'none'
    AddExpensesDiv.style.display = 'none'
})

const getSavingsbyInput = () => {

    const Date = document.getElementById('SDate').value
    const Amount = parseFloat(document.getElementById('SAmount').value)
    const ownerId = auth.currentUser.uid
    return new Savings(ownerId, Amount, Date)
}

const addSaving = (e) => {
    e.preventDefault()
    const newSaving = getSavingsbyInput()

    addSavingDB(newSaving)
    savingsBook.addSaving(newSaving)
    setTimeout(() => {UpdateAll()}, 1000)
    AddSavingsForm.reset()
    AddExpensesDiv.style.display = 'none'
    AddIncomesDiv.style.display = 'none'
    AddSavingsDiv.style.display = 'none'

}

AddSavingsForm.onsubmit = addSaving

