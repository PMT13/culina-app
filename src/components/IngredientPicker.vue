<template>
    <div class="picker">
        <div class="pure-g" v-if="ingredient_info">
            
            <div class="pure-u-1"><p><input type="checkbox" v-model="ingredient_info.onList" @click="updateList">{{this.ingredient_info.name}}</p></div>
        </div>
        <div v-else>
            LOADING
        </div>
    </div>
</template>

<script>
import {db} from "@/firebaseConfig.js"

export default {
    name: "IngredientPicker",
    data: function() {
        return {
            ingredient_info: false
        }
    },
    props: {
        id: String
    },
    methods: {
        updateList: function() {
            // This can be handled more elegantly in the computed property for RecipePicker, but it won't let the user deselect a recipe
            console.log(this.ingredient_info.recipes.length)
            for(let i = 0; i < this.ingredient_info.recipes.length; i++) {
                var recipeRef = this.ingredient_info.recipes[i];
                console.log(recipeRef)
                var newAvail
                if (!this.ingredient_info.onList) {
                    newAvail = recipeRef.availableIngredients + 1
                    console.log("newAvail: " + newAvail)
                    if (newAvail >= recipeRef.ingredients.length) {
                        db.collection("recipes").doc(recipeRef.id).update({onList: true})
                    }
                } else {
                    newAvail = recipeRef.availableIngredients - 1
                    if (newAvail <= recipeRef.ingredients.length) {
                        db.collection("recipes").doc(recipeRef.id).update({onList: false})
                    }
                }
                db.collection("recipes").doc(recipeRef.id).update({availableIngredients: newAvail})
            }
            //
            db.collection("ingredients").doc(this.id).update({onList: !this.ingredient_info.onList})
        }
    },
    firestore: function() {
        return {
             ingredient_info: db.collection("ingredients").doc(this.id)
        }
    }
}
</script>

<style scoped>
.picker {
    text-align: left;
}

input {
    vertical-align: right;
    margin-right: 20px;
}
</style>