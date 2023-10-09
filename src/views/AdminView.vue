<template>
    <div>
        <button @click="initRecipesOnList">Initialize all recipes.onList to false</button>
        <button @click="initIngredientsOnList">Initialize all ingredients.onList to false</button>
        <button @click="clearRecipes">Clear Recipes</button>
        <button @click="clearIngredients">Clear Ingredients</button>
        <IngredientSelector2/>
        <IngredientSelector2/>
        <IngredientSelector2/>
    </div>
</template>

<script>
import {db} from "@/firebaseConfig.js"
import IngredientSelector2 from "@/components/IngredientSelector2"

export default {
    name: "AdminView",
    components: {
        IngredientSelector2
    },
    methods: {
        initRecipesOnList: function() {
            db.collection("recipes").get().then(collectionSnapshot => {
                collectionSnapshot.forEach(recipeSnapshot => {
                    recipeSnapshot.ref.update({onList: false});
                })
            })
        }, 
        initIngredientsOnList: function() {
            db.collection("ingredients").get().then(collectionSnapshot => {
                collectionSnapshot.forEach(recipeSnapshot => {
                    recipeSnapshot.ref.update({onList: false});
                })
            })
        }, 
        clearRecipes: function() {
            db.collection("recipes").get().then(collectionSnapshot => {
                collectionSnapshot.forEach(recipeSnapshot => {
                    recipeSnapshot.ref.delete();
                })
            })
        },
        clearIngredients: function() {
            db.collection("ingredients").get().then(collectionSnapshot => {
                collectionSnapshot.forEach(ingredientSnapshot => {
                    ingredientSnapshot.ref.delete();
                })
            })
        }
    }
}
</script>