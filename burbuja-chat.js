// Manejar la burbuja de chat
document.getElementById('chat-bubble').addEventListener('click', () => {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.style.display = chatContainer.style.display === 'none' || chatContainer.style.display === '' ? 'flex' : 'none';
});

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

// Inicializar eventos específicos para el chat flotante
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chat-form')) {
        document.getElementById('chat-form').addEventListener('submit', handleChatForm);
    }
});
