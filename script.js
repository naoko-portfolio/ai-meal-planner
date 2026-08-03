const button = document.getElementById("generateButton");
const API_URL = "https://fhih70x0r4.execute-api.us-east-2.amazonaws.com/mealplan"

button.addEventListener("click", function () {
    button.disabled = true;
    button.textContent = "Generating...";
    document.getElementById("mealPlan").innerHTML = `
    <div class="loading">
        <div class='spinner'></div>
        <h3>Generating your 7-day meal plan...</h3>
        <p>Please wait a moment.</p>
    </div>
`;


    const familySize = document.getElementById("familySize").value;
    const cookingTime = document.getElementById("cookingTime").value;
    const ingredients = document.getElementById("ingredients").value;
    if (ingredients.trim() === "") {
        document.getElementById("mealPlan").innerHTML =
            "<p>Please enter at least one ingredient.</p>";

        button.disabled = false;
        button.textContent = "Generate Meal Plan";
        return;
    }

    let cuisines = [];

    document.querySelectorAll('input[type="checkbox"]:checked').forEach(function (item) {
        cuisines.push(item.value);
    });
    const otherCuisine = document.getElementById("otherCuisine").value;

    if (otherCuisine !== "") {
        cuisines.push(otherCuisine);
    }

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            familySize: familySize,
            cookingTime: cookingTime,
            cuisines: cuisines,
            ingredients: ingredients
        })
    })
        .then(response => response.json())
        .then(data => {
            let mealPlan = data.mealPlan;

            mealPlan = mealPlan.replace(
                /Day \d+:.*$/gm,
                '<h3>$&</h3>'

            );


            mealPlan = mealPlan.replace(
                /Ingredients:/g,
                '<strong>Ingredients:</strong>'
            );

            mealPlan = mealPlan.replace(
                /Instructions:/g,
                '<strong>Instructions:</strong>'
            );

            mealPlan = mealPlan.replace(/\n\n/g, '\n');
            mealPlan = mealPlan.replace(/\n/g, '<br>');
            mealPlan = mealPlan.replace(/<\/h3>(<br>)+/g, '</h3>');

            const days = mealPlan.split(/(?=<h3>Day \d+:)/);
            const cards = days
                .filter(day => day.trim() !== '')
                .map(day => `
        <div style='
        background: white;
        border: 1px solid #dcdcdc;
        border-radius: 12px;
        padding: 8px 18px 18px;
        margin-bottom: 10px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        '>${day}</div>`)
                .join('');



            document.getElementById('mealPlan').innerHTML =
                `<div class='meal-output'>${cards}</div>`;
            button.disabled = false;
            button.textContent = "Generate Meal Plan";
            document.getElementById('mealPlan').scrollIntoView({

                behavior: 'smooth'
            });
            document.getElementById("familySize").value = "";
            document.getElementById("cookingTime").value = "";
            document.getElementById("ingredients").value = "";
            document.getElementById("otherCuisine").value = "";

            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });


        })
        .catch(error => {
            console.error(error);
            document.getElementById('mealPlan').innerHTML =
                '<p>Error generating meal plan.</p>';
            button.disabled = false;
            button.textContent = "Generate Meal Plan";
        });
});