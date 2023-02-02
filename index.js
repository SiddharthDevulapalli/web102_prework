/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(let game of games){

        // create a new div element, which will become the game card
        const gamediv = document.createElement("div");

        // add the class game-card to the list
        gamediv.classList.add("game-card");

        // set the inner HTML using a template literal to display some info
        // about each game
        const display =`
            <img class="game-img" src=${game.img} >
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p> Backers: ${game.backers}</p>
                
        `;

        gamediv.innerHTML = display;
        
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")


        // append the game to the games-container
        gamesContainer.append(gamediv)

    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers

const totalBackers = GAMES_JSON.reduce((acc, game) => {
    return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
const backersDisplay =`
    <h4>${totalBackers.toLocaleString('en-US')}</h4>
`;

contributionsCard.innerHTML = backersDisplay;
// contributionsCard.innerHTML(totalBackers.toLocaleString('en-US'));

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalPledges = GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged;
}, 0);

// set inner HTML using template literal
const pledgesDisplay =`
    <h4>$${totalPledges.toLocaleString('en-US')}</h4>
`;

raisedCard.innerHTML = pledgesDisplay;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.reduce((acc, game) => {
    return acc + 1;
}, 0);

const gamesDisplay =`
    <h4>${totalGames.toLocaleString('en-US')}</h4>
`;

gamesCard.innerHTML = gamesDisplay;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listOfUnfundedGames = GAMES_JSON.filter ( (game) => {
        return game.pledged < game.goal;
      });
    
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfUnfundedGames);
}
// filterUnfundedOnly();
// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfFundedGames = GAMES_JSON.filter ( (game) => {
        return game.pledged >= game.goal;
      });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfFundedGames);
}
// filterFundedOnly();
// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    let listOfAllGames = GAMES_JSON;
    addGamesToPage(listOfAllGames);

}

// added a search bar to search for games
function searchGames() {
    deleteChildElements(gamesContainer);
    let input = document.getElementById('searchbar').value
    input=input.toLowerCase();
    
    let searchedGames = GAMES_JSON.filter ( (game) => {
        return game.name.toLowerCase().includes(input);
      });
    // console.log(searchedGames);
    addGamesToPage(searchedGames);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");
const searchbar = document.getElementById("searchbar");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);
searchbar.addEventListener("keyup", searchGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
// const totalUnfundedGames = GAMES_JSON.reduce((acc, game) => {
//     return game.pledged < game.goal ? ++acc : acc;
// }, 0);

let totalUnfundedGames = GAMES_JSON.filter ( (game) => {
    return game.pledged < game.goal;
  }).length;

// console.log(totalUnfundedGames);
// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `
    A total of ${totalPledges.toLocaleString('en-US')} has been raised for ${totalGames.toLocaleString('en-US')} games. 
    Currently, ${totalUnfundedGames} ${totalUnfundedGames > 1 ? " games remain" : " game remains"} unfunded. 
    We need your help to fund these amazing games!`

// create a new DOM element containing the template string and append it to the description container
const para = document.createElement('p');
para.innerHTML = displayStr;

descriptionContainer.append(para);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games

let [first, second, ...others] = sortedGames;
// console.log(first, second);

// create a new element to hold the name of the top pledge game, then append it to the correct element
const mostFunded = document.createElement('p');
mostFunded.innerHTML = `${first.name}`;
firstGameContainer.append(mostFunded);

// do the same for the runner up item

const secondmostFunded = document.createElement('p');
secondmostFunded.innerHTML = `${second.name}`;
secondGameContainer.append(secondmostFunded);