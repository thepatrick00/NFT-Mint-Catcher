// if it is a DOM Element I will always end the variable with 'El'
// localStorage.clear();
console.log(JSON.parse(localStorage.getItem('prefixIndex')))
console.log(JSON.parse(localStorage.getItem('uriName')))
console.log(JSON.parse(localStorage.getItem('mintNumber')))

const button = document.querySelector('.btn')
const form = document.getElementById('form')
const counterText = document.getElementById('counterText')

let mintNumber = 1;

//if mintNumber is in local storage than all other's are too because enableButton() ensures that. I call function this at the very end so there are not initialization issues.
    if ("mintNumber" in localStorage){
        mintNumber = JSON.parse(localStorage.getItem('mintNumber'))
    }
    counterText.textContent = mintNumber

//SEARCH BUTTON -- 1. Set correct url path, 2.increment mintNumber, 3.Set all local storage on button click because
button.addEventListener('click', handleButton)
function handleButton() {
    mintNumber += 1
    counterText.textContent = mintNumber;
    localStorage.setItem('mintNumber', JSON.stringify(mintNumber))
    urlFixer()
    form.setAttribute("action", prefixName + uriName)
}   


//PREFIX Dropdown -- 1. select prefix <select>, 2. add event listener to prefix and use event, 3.Put this prefix value in a variable to use in search.
const prefixEl = document.getElementById('prefix')
let prefixName = `https://cloudflare-ipfs.com/`
let prefixIndex = 0;
if ('prefixIndex' in localStorage){
    prefixIndex = JSON.parse(localStorage.getItem('prefixIndex'))
}
prefixEl.selectedIndex = prefixIndex

prefixEl.addEventListener('change', handlePrefix)

function handlePrefix(event){
    prefixName = event.target.value
    prefixIndex = event.target.selectedIndex
    localStorage.setItem('prefixIndex', JSON.stringify(prefixIndex))
    urlFixer()
    showWarningMessage()
}



//URI Input -- listens for every keychange and runs a function, that changes the uri input automatically in the backend(here) for use for the search button.
const uriFormEl = document.getElementById('uri')
const uriTextEl = document.getElementById('uri-text')

uriFormEl.addEventListener('keyup', handleUri)
let uriName = 'ipfs/QmTWewjSwE7wNPKpKHK1frmiCXXmkvsFpSx8Wk7ms1UwMC/244.json'
let unchangedUri = '';

if("uriName" in localStorage){
    uriName = JSON.parse(localStorage.getItem('uriName'));
    urlFixer()
}

uriFormEl.setAttribute('value', uriName)

function handleUri(event){
    unchangedUri = event.target.value
    uriName = event.target.value
    localStorage.setItem('uriName', JSON.stringify(uriName))
    urlFixer()
    enableButton(uriName)
    
}

//STARTING NUBMER INPUT -- 1.select number input, 2.addEventListener for keyup so we can use access event data, 3.Each time there is a change clear local storage and set new local storage (only allow numbers), 4. Update new mintNumber on page
const numberInputEl = document.getElementById('uriNumber')
numberInputEl.addEventListener('change', handleNumberInput)
numberInputEl.addEventListener('keyup', handleNumberInput)

numberInputEl.setAttribute('value', mintNumber)

function handleNumberInput(event) {
    mintNumber = Number(event.target.value)
    localStorage.setItem('mintNumber', JSON.stringify(mintNumber))

    counterText.textContent = mintNumber;
    urlFixer()
    enableButton(mintNumber)
    
}

//function to make code more consise because I need to have this info ready to use in any order that the user presses the inputs. 
function urlFixer(){
    //this makes sure we use the original uri and not the uri version that changes everytime this function runs.
    if('uriName' in localStorage){
        uriName = JSON.parse(localStorage.getItem('uriName'))
    } else {
        uriName = unchangedUri 
    }

    if(prefixName === `https://cloudflare-ipfs.com/` && unchangedUri !== ''){
        uriName = uriName.replace(/:./, '')
        uriName = uriName.replace(/\d+.json$/, mintNumber+'.json')
    } else if(prefixName === `https://piniata.com/` && unchangedUri !== '') {
        uriName = uriName.replace(/\d+.json$/, mintNumber+'.json') 
    } else {
        uriName = uriName.replace(/\d+.json$/, mintNumber+'.json')
    }
    uriTextEl.innerHTML = `<p>New URL = ${prefixName}${uriName}</p>`
}
urlFixer();
// uriTextEl.innerHTML = `<p>New URL = ${prefixName}${uriName}</p>`


const warningTextEl = document.querySelector('.warning-text')
function showWarningMessage(){
    if(prefixName === `https://cloudflare-ipfs.com/`){
        warningTextEl.textContent = `Cloudflare prefix is autoformated. Auto removes ':/' and auto adds correct number.`
    } else {
        warningTextEl.textContent =''
    }
}

function enableButton() {
    if(mintNumber && uriName){
        button.removeAttribute('disabled')
    } else {
        button.setAttribute('disabled', '')
    }
}
enableButton()