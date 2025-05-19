// DOM Elements
const app = document.getElementById('app');
const recipesContainer = document.getElementById('recipes-container');
const recipeDetail = document.getElementById('recipe-detail');
const backBtn = document.getElementById('back-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const bookmarkDetailBtn = document.getElementById('bookmark-detail-btn');
const homeLink = document.getElementById('home-link');
const bookmarksLink = document.getElementById('bookmarks-link');

// State
let currentUser = null;
let currentRecipeId = null;
let bookmarkedRecipes = [];
let isViewingBookmarks = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    loadBookmarks();
    fetchRandomRecipes();
    
    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    backBtn.addEventListener('click', () => {
        recipeDetail.classList.add('hidden');
        recipesContainer.classList.remove('hidden');
    });
    
    bookmarkDetailBtn.addEventListener('click', toggleBookmark);
    homeLink.addEventListener('click', () => {
        isViewingBookmarks = false;
        fetchRandomRecipes();
    });
    bookmarksLink.addEventListener('click', showBookmarkedRecipes);
});

// Check authentication state
function checkAuthState() {
    const user = getCurrentUser();
    if (user) {
        currentUser = user;
        app.classList.remove('hidden');
        document.getElementById('username-display').textContent = user.username;
        document.getElementById('profile-img').src = user.profileImage || 'assets/images/default-profile.png';
    } else {
        showLoginModal();
    }
}

// Fetch random recipes from TheMealDB
async function fetchRandomRecipes() {
    try {
        recipesContainer.innerHTML = '<div class="loading">Loading recipes...</div>';
        
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        
        if (data.meals) {
            displayRecipes(data.meals);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipesContainer.innerHTML = '<div class="error">Failed to load recipes. Please try again.</div>';
    }
}

// Search for recipes
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    try {
        recipesContainer.innerHTML = '<div class="loading">Searching recipes...</div>';
        
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        
        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            recipesContainer.innerHTML = '<div class="error">No recipes found. Try a different search term.</div>';
        }
    } catch (error) {
        console.error('Error searching recipes:', error);
        recipesContainer.innerHTML = '<div class="error">Failed to search recipes. Please try again.</div>';
    }
}

// Display recipes in the grid
function displayRecipes(meals) {
    recipesContainer.innerHTML = '';
    
    meals.forEach(meal => {
        const isBookmarked = bookmarkedRecipes.some(recipe => recipe.idMeal === meal.idMeal);
        
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-img">
            <div class="recipe-info">
                <h3 class="recipe-title">${meal.strMeal}</h3>
                <div class="recipe-meta">
                    <span>${meal.strArea}</span>
                    <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${meal.idMeal}">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
        
        recipeCard.addEventListener('click', () => showRecipeDetail(meal.idMeal));
        recipeCard.querySelector('.bookmark-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBookmark(meal.idMeal);
        });
        
        recipesContainer.appendChild(recipeCard);
    });
}

// Show recipe details
async function showRecipeDetail(mealId) {
    try {
        recipeDetail.classList.remove('hidden');
        recipesContainer.classList.add('hidden');
        currentRecipeId = mealId;
        
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
            const meal = data.meals[0];
            const isBookmarked = bookmarkedRecipes.some(recipe => recipe.idMeal === meal.idMeal);
            
            document.getElementById('detail-title').textContent = meal.strMeal;
            document.getElementById('detail-image').src = meal.strMealThumb;
            document.getElementById('detail-image').alt = meal.strMeal;
            
            // Set bookmark button state
            bookmarkDetailBtn.className = `bookmark-btn ${isBookmarked ? 'active' : ''}`;
            bookmarkDetailBtn.innerHTML = `<i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>`;
            
            // Set ingredients
            const ingredientsList = document.getElementById('ingredients-list');
            ingredientsList.innerHTML = '';
            
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                
                if (ingredient && ingredient.trim() !== '') {
                    const li = document.createElement('li');
                    li.textContent = `${measure ? measure : ''} ${ingredient}`;
                    ingredientsList.appendChild(li);
                }
            }
            
            // Set instructions
            document.getElementById('instructions-text').textContent = meal.strInstructions;
        }
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        recipeDetail.innerHTML = '<div class="error">Failed to load recipe details. Please try again.</div>';
    }
}

// Toggle bookmark
function toggleBookmark(mealId = null) {
    if (!currentUser) return;
    
    const idToToggle = mealId || currentRecipeId;
    if (!idToToggle) return;
    
    // Check if recipe is already bookmarked
    const index = bookmarkedRecipes.findIndex(recipe => recipe.idMeal === idToToggle);
    
    if (index === -1) {
        // Add to bookmarks
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idToToggle}`)
            .then(response => response.json())
            .then(data => {
                if (data.meals && data.meals.length > 0) {
                    const recipe = data.meals[0];
                    bookmarkedRecipes.push(recipe);
                    saveBookmarks();
                    updateBookmarkButtons(idToToggle, true);
                }
            });
    } else {
        // Remove from bookmarks
        bookmarkedRecipes.splice(index, 1);
        saveBookmarks();
        updateBookmarkButtons(idToToggle, false);
        
        // If we're viewing bookmarks, remove the card
        if (isViewingBookmarks) {
            const card = document.querySelector(`.recipe-card [data-id="${idToToggle}"]`)?.closest('.recipe-card');
            if (card) card.remove();
        }
    }
}

// Update bookmark buttons
function updateBookmarkButtons(mealId, isBookmarked) {
    // Update grid view buttons
    const gridButtons = document.querySelectorAll(`.bookmark-btn[data-id="${mealId}"]`);
    gridButtons.forEach(btn => {
        btn.classList.toggle('active', isBookmarked);
        btn.innerHTML = `<i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>`;
    });
    
    // Update detail view button if this is the current recipe
    if (currentRecipeId === mealId) {
        bookmarkDetailBtn.classList.toggle('active', isBookmarked);
        bookmarkDetailBtn.innerHTML = `<i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>`;
    }
}

// Load bookmarks from localStorage
function loadBookmarks() {
    if (!currentUser) return;
    
    const savedBookmarks = localStorage.getItem(`bookmarks_${currentUser.id}`);
    if (savedBookmarks) {
        bookmarkedRecipes = JSON.parse(savedBookmarks);
    }
}

// Save bookmarks to localStorage
function saveBookmarks() {
    if (!currentUser) return;
    localStorage.setItem(`bookmarks_${currentUser.id}`, JSON.stringify(bookmarkedRecipes));
}

// Show bookmarked recipes
function showBookmarkedRecipes(e) {
    e.preventDefault();
    isViewingBookmarks = true;
    
    if (bookmarkedRecipes.length > 0) {
        displayRecipes(bookmarkedRecipes);
    } else {
        recipesContainer.innerHTML = '<div class="error">You have no bookmarked recipes yet.</div>';
    }
}