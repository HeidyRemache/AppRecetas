document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('No hay un usuario logueado.');
        return;
    }

    const username = loggedInUser.name; // Nombre de usuario

    // Manejo del formulario de nutrición
    const nutritionForm = document.getElementById('nutrition-form');
    if (nutritionForm) {
        nutritionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const waterIntake = document.getElementById('water-intake').value;
            const caloriesIntake = document.getElementById('calories-intake').value;
            const protein = document.getElementById('protein').value;
            const carbs = document.getElementById('carbs').value;
            const fats = document.getElementById('fats').value;

            // Obtener o inicializar datos del usuario
            let waterData = JSON.parse(localStorage.getItem(`waterData_${username}`)) || [];
            let caloriesData = JSON.parse(localStorage.getItem(`caloriesData_${username}`)) || [];
            let proteinData = JSON.parse(localStorage.getItem(`proteinData_${username}`)) || [];
            let carbsData = JSON.parse(localStorage.getItem(`carbsData_${username}`)) || [];
            let fatsData = JSON.parse(localStorage.getItem(`fatsData_${username}`)) || [];

            // Agregar los nuevos datos
            waterData.push(Number(waterIntake));
            caloriesData.push(Number(caloriesIntake));
            proteinData.push(Number(protein));
            carbsData.push(Number(carbs));
            fatsData.push(Number(fats));

            // Guardar los datos en el almacenamiento local
            localStorage.setItem(`waterData_${username}`, JSON.stringify(waterData));
            localStorage.setItem(`caloriesData_${username}`, JSON.stringify(caloriesData));
            localStorage.setItem(`proteinData_${username}`, JSON.stringify(proteinData));
            localStorage.setItem(`carbsData_${username}`, JSON.stringify(carbsData));
            localStorage.setItem(`fatsData_${username}`, JSON.stringify(fatsData));

            // Limpiar los campos del formulario
            document.getElementById('water-intake').value = '';
            document.getElementById('calories-intake').value = '';
            document.getElementById('protein').value = '';
            document.getElementById('carbs').value = '';
            document.getElementById('fats').value = '';

            alert('Información nutricional guardada exitosamente.');
        });
    }

    // Función para cargar y mostrar los datos nutricionales en la página de información nutricional
    function loadNutritionData() {
        let waterData = JSON.parse(localStorage.getItem(`waterData_${username}`)) || [];
        let caloriesData = JSON.parse(localStorage.getItem(`caloriesData_${username}`)) || [];
        let proteinData = JSON.parse(localStorage.getItem(`proteinData_${username}`)) || [];
        let carbsData = JSON.parse(localStorage.getItem(`carbsData_${username}`)) || [];
        let fatsData = JSON.parse(localStorage.getItem(`fatsData_${username}`)) || [];

        // Actualizar gráficos de líneas
        new Chart(document.getElementById('waterChart'), {
            type: 'line',
            data: {
                labels: waterData.map((_, index) => `Día ${index + 1}`),
                datasets: [{
                    label: 'Vasos de Agua',
                    data: waterData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true
                }]
            }
        });

        new Chart(document.getElementById('caloriesChart'), {
            type: 'line',
            data: {
                labels: caloriesData.map((_, index) => `Día ${index + 1}`),
                datasets: [{
                    label: 'Calorías Consumidas',
                    data: caloriesData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true
                }]
            }
        });

        new Chart(document.getElementById('proteinChart'), {
            type: 'line',
            data: {
                labels: proteinData.map((_, index) => `Día ${index + 1}`),
                datasets: [{
                    label: 'Proteína Consumida',
                    data: proteinData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                }]
            }
        });

        new Chart(document.getElementById('carbsChart'), {
            type: 'line',
            data: {
                labels: carbsData.map((_, index) => `Día ${index + 1}`),
                datasets: [{
                    label: 'Carbohidratos Consumidos',
                    data: carbsData,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: true
                }]
            }
        });

        new Chart(document.getElementById('fatsChart'), {
            type: 'line',
            data: {
                labels: fatsData.map((_, index) => `Día ${index + 1}`),
                datasets: [{
                    label: 'Grasas Consumidas',
                    data: fatsData,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: true
                }]
            }
        });

        // Actualizar tabla resumen
        const summaryTable = document.getElementById('summaryTable');
        if (summaryTable) {
            summaryTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Total de Unidades</th>
                        <th>Promedio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Vasos de Agua</td>
                        <td>${waterData.reduce((a, b) => a + b, 0) || '0'} vasos</td>
                        <td>${waterData.length > 0 ? (waterData.reduce((a, b) => a + b, 0) / waterData.length).toFixed(2) : 'N/A'} vasos </td>
                    </tr>
                    <tr>
                        <td>Calorías Consumidas</td>
                        <td>${caloriesData.reduce((a, b) => a + b, 0) || '0'} kg</td>
                        <td>${caloriesData.length > 0 ? (caloriesData.reduce((a, b) => a + b, 0) / caloriesData.length).toFixed(2) : 'N/A'} kg</td>
                    </tr>
                    <tr>
                        <td>Proteína Consumida</td>
                        <td>${proteinData.reduce((a, b) => a + b, 0) || '0'} kg</td>
                        <td>${proteinData.length > 0 ? (proteinData.reduce((a, b) => a + b, 0) / proteinData.length).toFixed(2) : 'N/A'} kg</td>
                    </tr>
                    <tr>
                        <td>Carbohidratos Consumidos</td>
                        <td>${carbsData.reduce((a, b) => a + b, 0) || '0'} gr</td>
                        <td>${carbsData.length > 0 ? (carbsData.reduce((a, b) => a + b, 0) / carbsData.length).toFixed(2) : 'N/A'} gr</td>
                    </tr>
                    <tr>
                        <td>Grasas Consumidas</td>
                        <td>${fatsData.reduce((a, b) => a + b, 0) || '0'} gr</td>
                        <td>${fatsData.length > 0 ? (fatsData.reduce((a, b) => a + b, 0) / fatsData.length).toFixed(2) : 'N/A'} gr</td>
                    </tr>
                </tbody>
            `;
        }
    }

    // Cargar datos nutricionales al cargar la página de información nutricional
    loadNutritionData();
});
