const modal = {
    open() {
        let check = document.querySelector(".modal-overlay").classList
        check.add("active")
    },
    close() {
        let check = document.querySelector(".modal-overlay").classList
        check.remove("active")
    },
    tooGle() {
        let check = document.querySelector(".modal-overlay").classList
        if(check.value == "modal-overlay active") {
            this.close()
        } else {
            this.open()
        }
    } 
}
// Desafio: pesquisar a função toogle()
// {
//     description: "luz",
//     amount: -50000,
//     date: "23/01/2021"
// },
// {
//     description: "website",
//     amount: 500000,
//     date: "23/01/2021"
// },
// {
//     description: "internet",
//     amount: -20000,
//     date: "23/01/2021"
// }
const storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}
const transaction = {
    all: storage.get(),
    return: {},
    // essa nova função serve para quando alguem apagar uma transaction, eu salvo
    returnLastAction(retur) {
        this.return = retur
    },
    // e aqui quando alguem clicar no botão "-Desfazer" ela add essa transaction apagada novamente no
    addReturn() {
        const ar = document.querySelector(".button.return")
        if(ar == null) {
            const button = document.querySelector("#buttonsOfTransaction")
            const a = document.createElement("a");
            const html = `
            <a href="#" onclick="transaction.add(transaction.return)" class="button return">- Desfazer</a>
            `
            a.innerHTML = html
            button.appendChild(a)
        }
    },
    add(transaction) {
        const a = document.querySelector(".button.return")
        this.all.push(transaction)
        if(a != undefined) {
            a.remove()
        }
        app.reload()
    },
    remove(index) {
        this.returnLastAction(this.all[index])
        this.addReturn()
        this.all.splice(index, 1)
        app.reload()
    },
    income() {
        // algo aqui
        let sum = 0
        transaction.all.forEach(function(income) {
            if(income != undefined) {
                if(income.amount > 0) {
                    sum += income.amount;
                }
            }
        })
        return sum
    },
    expenses() {
        // somar as saídas
        let sum = 0
        transaction.all.forEach(function(expense) {
            if(expense != undefined) {
                if(expense.amount < 0) {
                    sum += expense.amount;
                }
            }
        })
        return sum
    },
    total() {
        // algo aqui
        sum = this.income() + this.expenses() 
        return sum
    }
}
const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction, index) {
        const tr = document.createElement("tr")
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) // o innerHTML ele serve pra me mostrar qual o HTML q tem dentro dele ou receber um HTML
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const cssClass = transaction.amount > 0 ? "income" : "expense" // ternário
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
        <td id="description${index}" class="description">${transaction.description}</td>
        <td id="amount${index}" class="${cssClass}">${amount}</td>
        <td id="date${index}" class="date">${transaction.date}</td>
        <td>
        <img onclick="transaction.remove(${index})" src="./assets (1)/assets/minus.svg" alt="Remover Transação">
        </td>
        <td>
        <div class="edite" onclick="editeTransaction.edite(${index})">
        =
        </div>
        </td>
            `
        return html
    },
    updateBalence() {
        document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(transaction.income())
        document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(transaction.expenses())
        document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}
const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        // value = string(value).replace("-", "") se fosse feito assim ele só iria trocar o primeiro -, mas se usarmos uma expressão regular como .replace(/-/g, "") ele vai pegar todos os 0 da string
        value = String(value).replace(/\D/g, "") // esse "/\D/" significa que ele vai substituir tudo que não é número e troque por nada
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        }) // vai transformar em moeda
        return signal + value
    },
    formatAmount(value) {
        value = value * 100
        return Math.round(value)
    },
    formatDate(value) {
        value = value.split("-")
        value = `${value[2]}/${value[1]}/${value[0]}`
        return value
    }
}
const form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),
    getValues() {
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value,
        }
    },
    validateFields() {
        // algo
        const { description, amount, date } = this.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("por favor, preencha todos os campos") // o throw é meio q cuspir, vomitar, jogar pra fora e o Error é um construtor e quando vc usa o new vc está criando uma copia do Error pra vc auterar os valores
        } // o trim faz uma limpeza de espaços vazios na sua string
    },
    formatValues() {
        let { description, amount, date } = this.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description, // quando o nome de uma "caracteristica" de um objeto é o mesmo nome doq ele vai receber podemos deixar dessa forma encurtada
            amount,
            date
        }
    },
    saveTransaction(transac) {
        transaction.add(transac)
    },
    clearFields() {
        this.description.value = ""
        this.amount.value = ""
        this.date.value = ""
    },
    submit(event) {
        event.preventDefault()
        try { // try significa tentar, ou seja vc vai realizar todas essas funções, se ouver algum error vai retornar o catch 
            // validar se os campos foram preenchidos
            this.validateFields()
            // formatar os dados
            const transaction = this.formatValues()
            // enviar para o "transactions"
            this.saveTransaction(transaction)
            // depois as informações do formulario devem ser apagadas
            this.clearFields()
            // fechar o modal
            modal.close()
            // atualizar a aplicação
        } catch (error) {
            alert(error.message)
        }
    }
}
const app = {
    init() {
        let index = 0;
        transaction.all.forEach((transaction) => {
            if(transaction != undefined) {
                DOM.addTransaction(transaction, index)
            }
            index += 1;
        })
        DOM.updateBalence()
        storage.set(transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        this.init()
    }
}
editeTransaction = {
    list: [],
    addEdite(description, amount, date, index) {
        this.list.forEach((item) => {
            if(item == index) {
                const des = document.getElementById(`des${index}`).value
                const amou = document.getElementById(`amou${index}`).value
                const dat = document.getElementById(`dat${index}`).value
                this.list.splice(index, 1)
                transaction.all[index].description = des
                transaction.all[index].amount = Utils.formatAmount(amou)
                transaction.all[index].date = Utils.formatDate(dat)
                console.log(transaction.all)
                description.innerHTML = transaction.all[index].description
                amount.innerHTML = transaction.all[index].amount
                date.innerHTML = transaction.all[index].date
            }
        })
    },
    edite(index) {
        const description = document.querySelector(`#description${index}`)
        const amount = document.querySelector(`#amount${index}`)
        const date = document.querySelector(`#date${index}`)
        const htmlToDescrition = `
        <input id="des${index}"class="input-description" type="text" value="${transaction.all[index].description}">
        `
        const htmlToAmount = `
        <input id="amou${index}"class="input-amount" type="number" step="0.01" value="${(transaction.all[index].amount) / 100}">
        `
        const htmlToDate = `
        <input id="dat${index}"class="input-date" type="date""> 
        `
        // placeholder="${transaction.all[index].date}
        description.innerHTML = htmlToDescrition
        amount.innerHTML = htmlToAmount
        date.innerHTML = htmlToDate
        editeTransaction.addEdite(description, amount, date, index)
        this.list.push(index)
    }
}
// área de inicialização
app.init()