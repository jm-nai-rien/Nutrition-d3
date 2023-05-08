const recipeNameInput = document.getElementById('recipe-name');
const searchButton = document.getElementById('get-nutrition-btn');
const resultsContainer = document.getElementById('results-container');

let selectedRecipeId = null;

async function fetchRecipes(query) {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?query=${query}&number=10`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '35c93bcd3bmsh812505908d611c5p1eee90jsn7b90d749f044',
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error(error);
  }
}

// async function searchRecipesByName(name) {
//   const results = await fetchRecipes(name);
//   return results;
// }

//Search Dropdown Menu
async function searchRecipesByName(name) {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?query=${name}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '35c93bcd3bmsh812505908d611c5p1eee90jsn7b90d749f044',
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error(error);
  }
}

async function searchRecipesById(id) {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=${id}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '35c93bcd3bmsh812505908d611c5p1eee90jsn7b90d749f044',
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

//Nutrition
async function getNutritionById(id) {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/nutritionWidget.json`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '35c93bcd3bmsh812505908d611c5p1eee90jsn7b90d749f044',
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}


//Ingredient
async function getIngredientByID(id) {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/ingredientWidget.json`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '35c93bcd3bmsh812505908d611c5p1eee90jsn7b90d749f044',
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.ingredients;
  } catch (error) {
    console.error(error);
  }
}


function updateDropdown(recipes) {
  const dropdown = document.getElementById('recipe-dropdown');
  dropdown.innerHTML = '';

  if (recipes.length > 0) {
    recipes.forEach(recipe => {
      const item = document.createElement('div');
      item.textContent = recipe.title;
      item.addEventListener('click', async () => {
        recipeNameInput.value = recipe.title;
        selectedRecipeId = recipe.id;
        // const nutrition = await getNutritionById(recipe.id);
        // const ingredients = await getIngredientByID(recipe.id);
        // displayResult(recipe, nutrition, ingredients);
        // Clear the dropdown and hide it
        dropdown.innerHTML = '';
        dropdown.classList.add('hidden');
      });
      dropdown.appendChild(item);
    });
    dropdown.classList.remove('hidden');
  } else {
    dropdown.classList.add('hidden');
  }
}



recipeNameInput.addEventListener('input', async () => {
  const query = recipeNameInput.value;
  if (query.length > 2) {
    const searchResults = await searchRecipesByName(query);
    updateDropdown(searchResults);
  } else {
    const dropdown = document.getElementById('recipe-dropdown');
    dropdown.classList.add('hidden');
  }
});




searchButton.addEventListener('click', () => {
  (async () => {
    if (selectedRecipeId) {
      const nutrition = await getNutritionById(selectedRecipeId);
      const ingredient = await getIngredientByID(selectedRecipeId);
      const recipe = (await searchRecipesById(selectedRecipeId))[0];
      displayResult(recipe, nutrition, ingredient);
    } else {
      resultsContainer.innerHTML = '<p>No results found.</p>';
    }
  })();
});

function displayResult(recipe, nutrition, ingredients) {
  resultsContainer.innerHTML = `
    <h2>${recipe.title}</h2>
    <h3>Nutrition Values</h3>
    <p>${nutrition.calories} Total Calories</p>
    <p>${nutrition.fat} Fat</p>
    <p>${nutrition.carbs} Carbohydrates</p>
    <p>${nutrition.protein} Protein</p>
    <h3>Ingredients</h3>
    <ul>
    ${ingredients.map(ingredient => `<li>${ingredient.name}</li>`).join('')}
    </ul>
  `;

  // Prepare the data
const data = [
//   {name: 'Calories', value: parseFloat(nutrition.calories)},
  {name: 'Fat', value: parseFloat(nutrition.fat) * 9},
  {name: 'Carbohydrates', value: parseFloat(nutrition.carbs) * 4},
  {name: 'Protein', value: parseFloat(nutrition.protein) * 4}
];

// Create the circular packing chart
const svg = d3.select('#nutrition-chart');
const width = parseInt(svg.attr('width'));
const height = parseInt(svg.attr('height'));

svg.selectAll('*').remove(); // Clear the previous chart

// Create a root node using d3.hierarchy and .sum to calculate the sum of the values
const root = d3.hierarchy({children: data})
  .sum(d => d.value);

// Create a pack layout with the desired size
const pack = d3.pack()
  .size([width, height])
  .padding(30);

// Apply the pack layout to the root node
const nodes = pack(root).descendants();

// Create a color scale
const color = d3.scaleOrdinal()
  .domain(data.map(d => d.name))
  .range(d3.schemeCategory10);

// Draw the circles
svg.selectAll('text')
  .data(nodes.filter(d => !d.children))
  .join('text')
  .attr('class', 'name')
  .attr('x', d => d.x)
  .attr('y', d => d.y)
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .text(d => d.data.name);

svg.selectAll('text.value')
.data(nodes.filter(d => !d.children))
.join('text')
.attr('class', 'value')
.attr('x', d => d.x)
.attr('y', d => d.y + 20) // Adjust the y position to display the value below the name
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.text(d => `${d.data.value} calories`);
}
