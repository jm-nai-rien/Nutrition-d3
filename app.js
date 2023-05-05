const recipeNameInput = document.getElementById('recipe-name');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');

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

function displayResult(recipe, nutrition) {
  resultsContainer.innerHTML = `
    <h2>${recipe.title}</h2>
    <h3>Nutrition Values</h3>
    <p>Calories: ${nutrition.calories}</p>
    <p>Fat: ${nutrition.fat}</p>
    <p>Carbohydrates: ${nutrition.carbs}</p>
    <p>Protein: ${nutrition.protein}</p>
  `;
}

searchButton.addEventListener('click', async () => {
  const recipeName = recipeNameInput.value;
  const searchResults = await searchRecipesByName(recipeName);

  if (searchResults.length > 0) {
    const firstRecipe = searchResults[0];
    const nutrition = await getNutritionById(firstRecipe.id);
    displayResult(firstRecipe, nutrition);
  } else {
    resultsContainer.innerHTML = '<p>No results found.</p>';
  }
});

function displayResult(recipe, nutrition) {
  resultsContainer.innerHTML = `
    <h2>${recipe.title}</h2>
    <h3>Nutrition Values</h3>
    <p>Calories: ${nutrition.calories}</p>
    <p>Fat: ${nutrition.fat}</p>
    <p>Carbohydrates: ${nutrition.carbs}</p>
    <p>Protein: ${nutrition.protein}</p>
  `;

  // Prepare the data
  const data = [
    {name: 'Calories', value: parseFloat(nutrition.calories)},
    {name: 'Fat', value: parseFloat(nutrition.fat)},
    {name: 'Carbohydrates', value: parseFloat(nutrition.carbs)},
    {name: 'Protein', value: parseFloat(nutrition.protein)}
  ];

  // Create the bar chart
  const svg = d3.select('#nutrition-chart');
  const width = parseInt(svg.attr('width'));
  const height = parseInt(svg.attr('height'));
  const margin = {top: 20, right: 20, bottom: 30, left: 40};

  svg.selectAll('*').remove(); // Clear the previous chart

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);

  // Draw the bars
  svg.append('g')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.value))
    .attr('height', d => y(0) - y(d.value))
    .attr('width', x.bandwidth())
    .attr('fill', 'steelblue');

  // Add x-axis
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  // Add y-axis
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));
}
