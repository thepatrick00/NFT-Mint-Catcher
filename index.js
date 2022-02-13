// if it is a DOM Element I will always end the variable with 'El'
// localStorage.clear();
console.log('prefixName',JSON.parse(localStorage.getItem('prefixName')))
console.log('prefixIndex',JSON.parse(localStorage.getItem('prefixIndex')))
console.log('uriName',JSON.parse(localStorage.getItem('uriName')))
console.log('mintNumber',JSON.parse(localStorage.getItem('mintNumber')))

const button = document.querySelector('.btn')
const form = document.getElementById('form')
const counterText = document.getElementsByClassName('counterText')
console.log(counterText)

let mintNumber = 1;

let haveMintNumber = false;
let haveUri = false;
//if mintNumber is in local storage than all other's are too because enableButton() ensures that. I call function this at the very end so there are not initialization issues.
    if ("mintNumber" in localStorage){
        mintNumber = JSON.parse(localStorage.getItem('mintNumber'))
        haveMintNumber = true;
    }
    counterText[0].textContent = mintNumber

//SEARCH BUTTON -- 1. Set correct url path, 2.increment mintNumber, 3.Set all local storage on button click because
button.addEventListener('click', handleButton)
function handleButton() {
    form.setAttribute("action", prefixName + uriName)
    mintNumber++
    counterText[0].textContent = mintNumber;
    localStorage.setItem('mintNumber', JSON.stringify(mintNumber))
    urlFixer()
}   


//PREFIX Dropdown -- 1. select prefix <select>, 2. add event listener to prefix and use event, 3.Put this prefix value in a variable to use in search.
const prefixEl = document.getElementById('prefix')
let prefixName = `https://cloudflare-ipfs.com/`
let prefixIndex = 0
if ('prefixName' in localStorage){
    prefixName = JSON.parse(localStorage.getItem('prefixName'))
}
if ('prefixIndex' in localStorage){
    prefixIndex = Number(JSON.parse(localStorage.getItem('prefixIndex')))
}

prefixEl.selectedIndex = prefixIndex

prefixEl.addEventListener('change', handlePrefix)
function handlePrefix(event){
    prefixName = event.target[event.target.selectedIndex].value
    localStorage.setItem('prefixName', JSON.stringify(prefixName))
    localStorage.setItem('prefixIndex', JSON.stringify(prefixEl.selectedIndex))
    urlFixer()
    showWarningMessage()
}


//URI Input -- listens for every keychange and runs a function, that changes the uri input automatically in the backend(here) for use for the search button.
const uriFormEl = document.getElementById('uri')
const uriTextEl = document.getElementById('uri-text')
uriTextEl.classList.add('uriTextEl')

uriFormEl.addEventListener('keyup', handleUri)
let uriName = 'ipfs/QmTWewjSwE7wNPKpKHK1frmiCXXmkvsFpSx8Wk7ms1UwMC/244.json'
let unchangedUri = '';

if("uriName" in localStorage){
    uriName = JSON.parse(localStorage.getItem('uriName'));
    haveUri = true;
    urlFixer();
}

uriFormEl.setAttribute('value', uriName)

function handleUri(event){
    unchangedUri = event.target.value
    uriName = event.target.value
    localStorage.setItem('uriName', JSON.stringify(uriName))
    urlFixer()
    enableButton()
    
}

//STARTING NUBMER INPUT -- 1.select number input, 2.addEventListener for keyup so we can use access event data, 3.Each time there is a change clear local storage and set new local storage (only allow numbers), 4. Update new mintNumber on page
const numberInputEl = document.getElementById('uriNumber')
numberInputEl.addEventListener('change', handleNumberInput)
numberInputEl.addEventListener('keyup', handleNumberInput)

numberInputEl.setAttribute('value', mintNumber)

function handleNumberInput(event) {
    mintNumber = Number(event.target.value)
    localStorage.setItem('mintNumber', JSON.stringify(mintNumber))

    counterText[0].textContent = mintNumber;
    urlFixer()
    enableButton()
    
}


function urlFixer(){
    if('uriName' in localStorage){
        uriName = JSON.parse(localStorage.getItem('uriName'))
    } else {
        uriName = unchangedUri //makes sure we use original uri each time I replace()
    }

    if(prefixName === `https://cloudflare-ipfs.com/`){
        uriName = uriName.replace(/:./, '')
        uriName = uriName.replace(/\d+.json$/, mintNumber+'.json')
    } else if(prefixName === `https://piniata.com/`) {
        uriName = uriName.replace(/\d+.json$/, mintNumber+'.json') 
    } else {
        if(uriName.match(/\d+.json$/)){
            uriName = uriName.replace(/\d+.json$/, mintNumber+'.json')
        } else if (uriName.match(/\d+$/)){
            uriName = uriName.replace(/\d+$/, mintNumber)
        }
    }
    
    uriTextEl.innerHTML = `Live URL = ${prefixName}${uriName}` //exactly the same thing that is 'displayed' when I search with form action attribute
}
urlFixer();


const warningTextEl = document.querySelector('.warning-text')
function showWarningMessage(){
    if(prefixName === `https://cloudflare-ipfs.com/`){
        warningTextEl.textContent = `Cloudflare prefix is autoformated. Auto removes ':/' and auto adds correct number.`
    } else {
        warningTextEl.textContent =''
    }
}

function enableButton() {
    if(mintNumber && uriName || haveMintNumber && haveUri){
        button.removeAttribute('disabled')
    } else {
        button.setAttribute('disabled', '')
    }
}
enableButton()
showWarningMessage()
urlFixer()