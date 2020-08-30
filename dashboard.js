const closeBtn = document.querySelectorAll(".close-button");

const addBtn = document.getElementById("addBtn");
const ideaText = document.getElementById("ideaText");

const existsModal = document.getElementById("existsModal");

const suggestModal = document.getElementById("suggestModal");
const suggestionContent = document.getElementById("suggestionContent");
const yesSuggestionBtn = document.getElementById("yesSuggestion");
const noSuggestionBtn = document.getElementById("noSuggestion");

const addModal = document.getElementById("addModal");
const newIdeaHeader = document.getElementById("newIdeaHeader");
const cancelIdeaBtn = document.getElementById("cancelIdea");
const addNewIdeaBtn = document.getElementById("addNewIdea");
const addDropdowns = document.querySelectorAll(".dropdown");
const addDropdownOptions = document.querySelectorAll(".dropdown-option");
const addDropdownBtns = document.querySelectorAll(".dropdown-btn");
const addAddressInput = document.querySelector(".address-input");

const ideaAddedModal = document.getElementById("ideaAddedModal");

const generateBtn = document.getElementById("generateBtn");
const randomModal = document.getElementById("randomModal");
const ideaName = document.getElementById("ideaName");
const ideaType = document.getElementById("ideaType");
const address = document.getElementById("address");
const locationType = document.getElementById("locationType");
const priceRating = document.getElementById("priceRating");
const parking = document.getElementById("parking");
const filterOptions = document.querySelectorAll(".filter-option");
const filterBtn = document.querySelector(".filter-btn");
const filterDropdown = document.querySelector(".ideaType-filter");
var selectedFilter = "None";

/*************Modal*************/
const toggleDisplay = (element) => {
    if (element.style.display == ""){
        element.style.display = "block";
    }
    else {
        element.style.display = "";
    }
}

const windowClick = () => {
    if (event.target === randomModal){
        toggleDisplay(randomModal);
    }
    else if (event.target === existsModal){
        toggleDisplay(existsModal);
    }
    else if (event.target === suggestModal){
        toggleDisplay(suggestModal);
    }
}

const displayModal = (specificModal, data) => {
    if ((data != null || data != undefined) && specificModal === randomModal) {
        updateRandomModal(data);
        toggleDisplay(specificModal);
    }
}

/*************Add Idea Flow*************/
const submitIdea = async (event) => {
    const ideaInput = ideaText.value;
    if (!validateIdeaInput(event, ideaInput)) { return; }
    console.log("Idea Submitted: " + ideaInput);

    await checkIdeaExists(ideaInput);
}

const validateIdeaInput = (event, input) => {
    if (input === null || input.match(/^ *$/) !== null || input == undefined) { 
        resetTextBox(event); 
        return false; 
    }
    else if (input.length > 50) { 
        console.log("Idea cannot be more than 50 characters");
        alert("Idea cannot be more than 50 characters");
        return false; 
    }

    return true;
}

const resetTextBox = (event) => {
    ideaText.classList.add('error');
    addBtn.classList.add('error');
    ideaText.value = '';

    setTimeout(function() {
        ideaText.classList.remove('error');
        addBtn.classList.remove('error');
    }, 300);
  
    event.preventDefault();
}

const checkIdeaExists = async (ideaName) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/idea/exists/' + ideaName);
        const exists = await response.json();
        if (exists) {
            toggleDisplay(existsModal);
            console.log(`${ideaName} already exists`);
        }
        else {
            checkMatchingIdeas(ideaName);
        }
    }
    catch (error) {
        return console.log(error);
    }
}

const checkMatchingIdeas = async (ideaName) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/idea/matches/' + ideaName);
        const ideaList = await response.json();
        console.log(ideaList);
        if (ideaList.length > 0) {
            displaySuggestions(ideaList);
            toggleDisplay(suggestModal);
        }
        else {
            setupAddIdeaModal(ideaName);
            console.log("Idea is available");
        }
    }
    catch (error) {
        return console.log(error);
    }
}

/*****Idea Suggestion Modal*****/
const displaySuggestions = (ideas) => {
    deletePreviousSuggestions();
    createSuggestions(ideas);
}

const deletePreviousSuggestions = () => {
    let allSuggestions = document.querySelectorAll(".suggestion");
    if (allSuggestions.length == 0) return;
    allSuggestions.forEach(s => s.parentNode.removeChild(s));
}

const createSuggestions = (ideas) => {
    ideas.forEach(idea => {
        let p = document.createElement("p");
        p.classList.add("suggestion");
        p.innerText = idea.name;
        yesSuggestionBtn.parentNode.insertBefore(p, yesSuggestionBtn);
        console.log('Suggestion created: ' + idea.name);
    });
}

/*****Add Idea Modal*****/
const setupAddIdeaModal = (ideaName) => {
    newIdeaHeader.innerText = ideaName;
    resetAddModal();
    toggleDisplay(addModal);
}

const updateDropdownbBtnStyle = (event, element) => {
    if (element.classList.contains('open-dropdown')){
        element.classList.remove('open-dropdown');
    }
    else {
        element.classList.add('open-dropdown');
    }
    event.preventDefault();
}

const updateSelectedOption = (button, option) => {
    button.innerText = option.innerText;
}

const resetAddModal = () => {
    addDropdownBtns[0].innerText = "IDEA TYPE";
    addDropdownBtns[1].innerText = "LOCATION TYPE";
    addDropdownBtns[2].innerText = "PRICE RATING";
    addDropdownBtns[3].innerText = "PARKING";
    addAddressInput.value = ''
}

const validateAddData = () => {
    if (addDropdownBtns[0].innerText === "IDEA TYPE"
    || addDropdownBtns[1].innerText === "LOCATION TYPE" 
    || addDropdownBtns[2].innerText === "PRICE RATING"
    || addDropdownBtns[3].innerText === "PARKING"
    || addAddressInput.value.match(/^ *$/) !== null
    || addAddressInput.value.length > 255){
        return false;
    }
    return true;
}

const collectAddData = () => {
    let listOfIdeas = [];
    let idea = {
        name: ideaText.value,
        priceRating: addDropdownBtns[2].innerText,
        ideaType: addDropdownBtns[0].innerText,
        address: addAddressInput.value,
        locationType: addDropdownBtns[1].innerText,
        parkingAvailability: addDropdownBtns[3].innerText == "Free-Limited" ? "LimitedFree" : addDropdownBtns[3].innerText == "Paid-Limited"
                                                                            ? "LimitedPaid" : addDropdownBtns[3].innerText
    };
    listOfIdeas.push(idea);
    return listOfIdeas;
}

const addNewIdeaAsync = async (data) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/idea/add', {
            method: 'POST',
            headers: {  
                "Content-Type": "application/json",
                "Filter": false
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();
        console.log('Idea successfully added:\n', json);
        toggleDisplay(addModal);
        return toggleDisplay(ideaAddedModal);
    }
    catch (error) {
        return console.log(error); 
    }
}

/*************Random Idea Modal*************/

const getRandomIdeaAsync = async () => {
    try {
        let endpoint = window.selectedFilter == "None" ? "" : `/${window.selectedFilter}`;
        const response = await fetch('http://localhost:8080/api/v1/idea/random' + endpoint);
        const json = await response.json();
        return displayModal(randomModal, json);
    }
    catch (error) {
        return console.log(error);
    }
}

const updateRandomModal = (idea) => {
    ideaName.innerText = idea.name;
    ideaType.innerText = idea.ideaType;
    address.innerText = idea.address;
    locationType.innerText = idea.locationType;
    priceRating.innerText = idea.priceRating + " price";
    if (idea.parkingAvailability == "LimitedFree") {
        parking.innerText = "Free but limited parking";
    }
    else if (idea.parkingAvailability == "LimitedPaid") {
        parking.innerText = "Limited paid parking";
    }
    else if (idea.parkingAvailability == "None") {
        parking.innerText = "No parking";
    }
    else {
        parking.innerText = idea.parkingAvailability + " parking";
    }
    console.log("Idea Generated: " + idea.name);
}

/*************Event Listeners*************/
/*window.addEventListener("click", windowClick);*/

addBtn.addEventListener('click', async (event) => {
    await submitIdea(event);
});

generateBtn.addEventListener("click", () => {
    console.log(window.selectedFilter);
    getRandomIdeaAsync();
});

filterDropdown.addEventListener("click", () => {
    toggleDisplay(filterDropdown.lastElementChild);
});
[...filterOptions].forEach(option => option.addEventListener("click", () => {
    window.selectedFilter = option.innerText;
}))

closeBtn.forEach(btn => btn.addEventListener("click", () => {
    let modalElement = document.getElementById(btn.parentElement.parentElement.id);
    toggleDisplay(modalElement);
}));

yesSuggestionBtn.addEventListener('click', () => {
    toggleDisplay(suggestModal);
    toggleDisplay(existsModal);
});
noSuggestionBtn.addEventListener('click', () => {
    toggleDisplay(suggestModal);
    setupAddIdeaModal(ideaText.value);
})
addDropdowns.forEach(dropdown => dropdown.addEventListener("click", (event) => {
    updateDropdownbBtnStyle(event, dropdown);
    toggleDisplay(dropdown.lastElementChild);
}));
[...addDropdownOptions].forEach(option => option.addEventListener("click", () => {
    updateSelectedOption(option.parentElement.previousElementSibling, option.firstElementChild);
}))

cancelIdeaBtn.addEventListener('click', () => {
    toggleDisplay(addModal);
})

addNewIdeaBtn.addEventListener('click', async () => {
    let valid = validateAddData();
    if (!valid) { 
        console.log("Invalid data to add");
        addAddressInput.value.length > 255 ? alert("Address is too long") : alert("Please enter all required information"); 
    }
    let addData = valid ? collectAddData() : [];
    console.log("Data to be added:\n", addData);

    if (addData !== [] && addData.length > 0) {
        await addNewIdeaAsync(addData);
        console.log("New Idea Added");
    }
    else {
        console.log("New Idea Not Added");
    }
})