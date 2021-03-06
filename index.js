// if it is a DOM Element I will always end the variable with 'El'



// localStorage.clear()
console.log('prefixName',JSON.parse(localStorage.getItem('prefixName')))
console.log('prefixIndex',JSON.parse(localStorage.getItem('prefixIndex')))
console.log('uriName',JSON.parse(localStorage.getItem('uriName')))
console.log('mintNumber',JSON.parse(localStorage.getItem('mintNumber')))
console.log('linkArr',JSON.parse(localStorage.getItem('linkArr')))

const button = document.querySelector('.btn--main')
const form = document.getElementById('form')
const counterText = document.getElementsByClassName('counterText')
console.log('counter text', counterText)

let mintNumber = '';

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

prefixEl.addEventListener('click', handlePrefix)
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
uriFormEl.addEventListener('change', handleUri)
uriFormEl.addEventListener('paste', handleUri)
let uriName = ''
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
    showWarningMessage()
    
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
    } else {
        if(uriName.match(/\d+.json$/)){
            uriName = uriName.replace(/\d+.json$/, mintNumber+'.json')
        } else if (uriName.match(/\d+$/)){
            uriName = uriName.replace(/\d+$/, mintNumber)
        }
    }
    
    uriTextEl.textContent = `Live URL = ${prefixName}${uriName}` //exactly the same thing that is 'displayed' when I search with form action attribute
}
urlFixer();


const warningTextEl = document.querySelector('.warning-text')
function showWarningMessage(){
    if(prefixName === `https://cloudflare-ipfs.com/`){
        warningTextEl.innerHTML = `The url will be autoformated. <b>":/" will be removed</b> from the start of the URi. The url <b>needs to end in a "number.json"</b> for the Mint# ${mintNumber} to work and increment +1 with each search`
    } else {
        warningTextEl.innerHTML =`The url <b>needs to strictly end with a digit or digit.json</b> for the Mint# ${mintNumber} to work and increment +1 with each search`
    }
}

// function enableButton() {
//     if(mintNumber && uriName || haveMintNumber && haveUri){
//         button.removeAttribute('disabled')
//         button.textContent = `Search +1 Mint`
//     } else {
//         button.setAttribute('disabled', '')
//         button.textContent = `Missing uri or #`
//     }
// }

document.querySelector('.btn--clear').addEventListener('click', () => {
    mintNumber = '';
    prefixName = `https://cloudflare-ipfs.com/`
    prefixIndex = 0
    uriName = ''
    localStorage.clear()
    window.location.reload()
})

showWarningMessage()
urlFixer()

/*ADD YOUR OWN QUICK LINKS SECTION*/
/*********************************/
const textareaCtr = document.querySelector('.textarea-container')
let textarea = document.querySelector('.textarea')
const textareaBtn = document.querySelector('.btn--comment')
const linkList = document.querySelector('.link-list')
let textareaValue = ''

let linkArr = []
if ('linkArr' in localStorage){
    linkArr = JSON.parse(localStorage.getItem('linkArr'))
}
//CREATE <li> ELEMENT FOR EACH LINK//
function createList() {
    linkArr.map(link => {
        const li = document.createElement('li')
        li.innerHTML = `<span class="XEmoji">???</span>` + " " + `<a class="quick-links" target="_blank" href=${link}>${link.replace(/https:../, '').replace(/\/.*/ig, '')}</a>`
        linkList.appendChild(li)
    })
}
createList()

//TEXT AREA INPUT captures textarea value//
textarea.addEventListener('keyup', function(e){
    textareaValue = e.target.value
})

//SUBMIT BUTTON also creates li items and saves them to local storage//
textareaBtn.addEventListener('click', function(){

    const li = document.createElement('li')
    li.innerHTML = `<span class="XEmoji">???</span>`+ " " + `<a class="quick-links" target="_blank" href=${textareaValue}>${textareaValue.replace(/https:../, '').replace(/\/.*/ig, '')}</a>`
    linkList.appendChild(li)

    linkArr.push(textareaValue)
    localStorage.setItem('linkArr', JSON.stringify(linkArr))
    textareaCtr.reset()
})

//have an array of values that I can map through. These values are in the array that is stored in local storage so I can use them any time.

/* Give the ability to delete links from list. I'm using event delegation by adding an event listener to the <ul>. This way with 1 event listener I control all <li>'s with event.target  */
linkList.addEventListener('dblclick', deleteLink)

/* always select the closest link even when your event.target is on <a> or <li> because .closest makes it move up the DOM tree. Then I remove from the DOM and use a callback function to remove it from localStorage. */
function deleteLink(e) {
    let link = e.target.closest('li');
    let linkText = link.textContent.slice(2)

    if(e.target.textContent === '???'){
        removeLinkFromLocalStorage(linkText);
        link.remove();
    } else {
        return;
    }
}

/* The linkText variable is textContent from the event.target before. This has to be exactly equal to the replaced link value we use. This way I can remove it from the original linkArr and set a new localStorage */
function removeLinkFromLocalStorage(linkText){
    for (let i=0; i < linkArr.length; i++){
        let replacedLink = linkArr[i].replace(/https:../, '').replace(/\/.*/ig, '')

        if(linkText === replacedLink){
            linkArr.splice(i, 1)
            localStorage.setItem('linkArr', JSON.stringify(linkArr))
            console.log(linkArr[i],'found and removed from array and localStoarge')
            return;
        }
    }
}