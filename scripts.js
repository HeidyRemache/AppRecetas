// Añade tus Application ID y Application Key de Edamam
const EDAMAM_APP_ID = 'e5544cd2';
const EDAMAM_APP_KEY = 'f8be39ae52a7a25edfa040eccbefec55';

// Obtener el usuario actual del almacenamiento local
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('loggedInUser'));
};

// Función para hacer la solicitud a la API de Edamam
async function fetchRecipe(query) {
    const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`);
    const data = await response.json();
    return data.hits.map(hit => ({
        name: hit.recipe.label,
        image: hit.recipe.image,
        ingredients: hit.recipe.ingredientLines.join(', '),
        instructions: hit.recipe.url
    }));
}

// Array para almacenar las recetas del usuario
const getRecipes = () => {
    const user = getCurrentUser();
    return JSON.parse(localStorage.getItem(`recipes_${user.email}`)) || [];
};

const saveRecipes = (recipes) => {
    const user = getCurrentUser();
    localStorage.setItem(`recipes_${user.email}`, JSON.stringify(recipes));
};

let editIndex = null;

// Función para mostrar las recetas en el index
async function displayRecipes() {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    const recipes = getRecipes();

    // Obtener recetas de la API de Edamam
    const apiRecipes = await fetchRecipe(''); // Puedes cambiar la consulta para obtener recetas específicas
    recipes.push(...apiRecipes);

    saveRecipes(recipes);

    recipes.forEach((recipe, index) => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'col-md-3 mb-4';
        recipeCard.innerHTML = `
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.name}</h5>
                    <button class="btn btn-primary" onclick="viewRecipe(${index})">Ver receta</button>
                </div>
            </div>
        `;
        recipeList.appendChild(recipeCard);
    });
}

// Función para ver los detalles de la receta
function viewRecipe(index) {
    const recipes = getRecipes();
    const recipe = recipes[index];
    localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
    localStorage.setItem('selectedIndex', index);
    window.location.href = 'recipe.html';
}

// Función para mostrar los detalles de la receta en recipe.html
function displayRecipeDetails() {
    const recipe = JSON.parse(localStorage.getItem('selectedRecipe'));
    const recipeNameElement = document.getElementById('recipe-name');
    const recipeImageElement = document.getElementById('recipe-image');
    const recipeIngredientsElement = document.getElementById('recipe-ingredients');
    const recipeInstructionsElement = document.getElementById('recipe-instructions');

    if (recipe) {
        recipeNameElement.innerText = recipe.name;
        recipeImageElement.src = recipe.image;
        recipeIngredientsElement.innerHTML = recipe.ingredients.split(', ').map(ingredient => `<li>${ingredient}</li>`).join('');
        recipeInstructionsElement.innerHTML = `<a href="${recipe.instructions}" target="_blank">Ver receta completa</a>`;

        document.getElementById('edit-recipe-btn').addEventListener('click', () => {
            window.location.href = 'add-recipe.html?edit=true';
        });

        document.getElementById('delete-recipe-btn').addEventListener('click', () => {
            deleteRecipe(localStorage.getItem('selectedIndex'));
        });
    } else {
        recipeNameElement.innerText = 'Receta no encontrada';
        recipeImageElement.src = '';
        recipeIngredientsElement.innerHTML = '';
        recipeInstructionsElement.innerHTML = '';
    }
}

// Función para agregar o editar una receta
function handleRecipeForm(event) {
    event.preventDefault();
    const name = document.getElementById('recipe-name').value;
    const image = document.getElementById('recipe-image').value;
    const ingredients = document.getElementById('recipe-ingredients').value;
    const instructions = document.getElementById('recipe-instructions').value;

    const recipes = getRecipes();

    if (editIndex !== null) {
        recipes[editIndex] = { name, image, ingredients, instructions };
        editIndex = null;
    } else {
        recipes.push({ name, image, ingredients, instructions });
    }
    saveRecipes(recipes);
    window.location.href = 'index.html';
}

// Función para mostrar los detalles de la receta en el formulario de edición
function displayRecipeForEdit() {
    const recipe = JSON.parse(localStorage.getItem('selectedRecipe'));
    document.getElementById('form-title').innerText = 'Editar Receta';
    document.getElementById('submit-btn').innerText = 'Guardar Cambios';
    document.getElementById('recipe-name').value = recipe.name;
    document.getElementById('recipe-image').value = recipe.image;
    document.getElementById('recipe-ingredients').value = recipe.ingredients;
    document.getElementById('recipe-instructions').value = recipe.instructions;
    editIndex = localStorage.getItem('selectedIndex');
}

// Función para buscar recetas
function searchRecipes() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const recipes = getRecipes();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm)
    );
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    filteredRecipes.forEach((recipe, index) => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'col-md-3 mb-4';
        recipeCard.innerHTML = `
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.name}</h5>
                    <button class="btn btn-primary" onclick="viewRecipe(${index})">Ver receta</button>
                </div>
            </div>
        `;
        recipeList.appendChild(recipeCard);
    });
}

// Función para manejar el envío del formulario de chat y mostrar la respuesta
async function handleChatForm(event) {
    event.preventDefault();
    const query = document.getElementById('user-input').value;
    const recipes = await fetchRecipe(query);

    const chatResponse = document.getElementById('chat-response');
    chatResponse.innerHTML = '';

    if (recipes.length > 0) {
        recipes.forEach(recipeData => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe';
            recipeElement.innerHTML = `
                <h4>${recipeData.name}</h4>
                <img src="${recipeData.image}" alt="${recipeData.name}" class="img-fluid">
                <p><strong>Ingredientes:</strong> ${recipeData.ingredients}</p>
                <p><strong>Instrucciones:</strong> <a href="${recipeData.instructions}" target="_blank">Ver receta completa</a></p>
            `;
            chatResponse.appendChild(recipeElement);
        });
    } else {
        chatResponse.innerHTML = 'No se encontraron recetas para tu consulta.';
    }
}

// Función para eliminar una receta
function deleteRecipe(index) {
    const recipes = getRecipes();
    recipes.splice(index, 1);
    saveRecipes(recipes);
    window.location.href = 'index.html';
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recipe-list')) {
        displayRecipes();
        document.getElementById('search-bar').addEventListener('input', searchRecipes);
    }
    if (document.getElementById('add-recipe-form')) {
        document.getElementById('add-recipe-form').addEventListener('submit', handleRecipeForm);
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('edit') === 'true') {
            displayRecipeForEdit();
        }
    }
    if (document.getElementById('recipe-details')) {
        displayRecipeDetails();
    }
    if (document.getElementById('enter-button')) {
        document.getElementById('enter-button').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    if (document.getElementById('chat-form')) {
        document.getElementById('chat-form').addEventListener('submit', handleChatForm);
    }

    // Menu toggle
    document.getElementById("menu-toggle").addEventListener("click", function(e) {
        e.preventDefault();
        document.getElementById("wrapper").classList.toggle("toggled");
    });
});

// Función del login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const resetPasswordForm = document.getElementById('reset-password-form');

    // Manejo del formulario de inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                document.getElementById('login-error').classList.remove('d-none');
            }
        });
    }

    // Manejo del formulario de registro
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(user => user.email === email)) {
                document.getElementById('register-error').classList.remove('d-none');
            } else {
                users.push({ name, email, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registro exitoso. Por favor inicie sesión.');
                window.location.href = 'login.html';
            }
        });
    }

    // Manejo del formulario de restablecimiento de contraseña
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                document.getElementById('reset-password-error').innerText = 'Las contraseñas no coinciden.';
                document.getElementById('reset-password-error').classList.remove('d-none');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email);

            if (user) {
                user.password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
                alert('Contraseña restablecida con éxito. Por favor inicie sesión.');
                window.location.href = 'login.html';
            } else {
                document.getElementById('reset-password-error').innerText = 'Correo electrónico no encontrado.';
                document.getElementById('reset-password-error').classList.remove('d-none');
            }
        });
    }
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.getElementById('user-name').textContent = loggedInUser.name;
    }
});
