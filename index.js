const url = "https://www.themealdb.com/api/json/v1/1/random.php";
const ingredientsDiv = document.getElementById("ingredients");
const searchedFood = document.getElementById("searched_food");

function getData(url) {
  axios
    .get(url)
    .then((res) => {
      console.log(res.data.meals[0]);
      let data = res.data.meals[0];
      let mealId = res.data.meals[0].idMeal;
      let output = `
        <div id="random1">
          <img src="${data.strMealThumb}" id="imgRandom" alt="">
          <div id="flex">
            <h2 id="randomName">${data.strMeal}</h2>
            <button class="detailBtn" data-mealid="${data.idMeal}">Details</button>
          </div>
        </div>`;

      document.getElementById("random").innerHTML += output;

      // event delegation for the "Details" button
      document.getElementById("random").addEventListener("click", (event) => {
        const clickedBtn = event.target.closest(".detailBtn");
        if (clickedBtn) {
          console.log(mealId);
          getIngredients(mealId);
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
}
getData(url)

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("search");

  searchBtn.addEventListener("click", getsearch);
  searchInput.addEventListener("keypress", onEnter);
});

function onEnter(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    getsearch();
  }
}

function getsearch() {
  const searchInput = document.getElementById("searchInput");
  const Value = searchInput.value;
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${Value}`;

  if (Value !== "") {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let output = "";
        for (let i = 0; i < data.meals.length; i++) {
          output += `
              <div id="search_div">
                <img id="imgCard" src="${data.meals[i].strMealThumb}" alt="${data.meals[i].strMeal}">
                <h3 id="meal_name">${data.meals[i].strMeal}</h3>
                <button class="cook-btn" data-mealid="${data.meals[i].idMeal}">Details</button>
              </div>
            `;
        }

        document.getElementById("searched_food").innerHTML = output;
      })
      .catch((error) => {
        console.error(error);
      });
       // Event delegation for "Details" button click
    searchedFood.addEventListener("click", (event) => {
      const detailBtn = event.target.closest(".cook-btn");
      if (detailBtn) {
        const mealId = detailBtn.getAttribute("data-mealid");
        getIngredients(mealId);
        searchedFood.style.filter = "blur(8px)";
        document.getElementById("random").style.filter = "blur(8px)";
      }
    });
  }
}

function getIngredients(mealId) {
  var url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  ingredientsDiv.style.display = "block";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      let ingrioutput = "";
      const mealThumbnail = meal.strMealThumb;
      const mealName = meal.strMeal;
      const instructions = meal.strInstructions;

      const image = `<img id="detailimg" src="${mealThumbnail}" alt="${mealName}"></img>`;

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient) {
          ingrioutput += `<div>${measure} ${ingredient}</div>`;
        } else {
          break;
        }
      }

      const combinedOutput = `
        <div id = detailpage>
          <div id="backbutton">
           <button id="Back">Back</button>
           <div>${image}</div>
          </div>
          <div id="detailingre">
           <div>Ingredients${ingrioutput}</div>
           <div><strong>Instructions:</strong> ${instructions}</div>
          </div>
        </div>`;

      ingredientsDiv.innerHTML = combinedOutput;

      const backBtn = document.getElementById("Back");
      backBtn.onclick = () => {
        ingredientsDiv.style.display = "none";
        searchedFood.style.filter = "blur(0px)";
        document.getElementById("random").style.filter = "blur(0px)";
      };
    })
    .catch((error) => {
      console.log(error);
    });
}
getIngredients(mealId)
