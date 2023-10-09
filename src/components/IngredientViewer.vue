<template>
    <div>

        <div class="pure-g picker">
            <div class="pure-u-7-8"><p><input type="checkbox">{{ingredient_info.name}}</p></div>
            <div v-if="!expand" class="pure-u-1-8 icon"><font-awesome-icon icon="fas fa-angle-down" @click="expand=!expand" /></div>
            <div v-else class="pure-u-1-8 icon"><font-awesome-icon icon="fas fa-angle-up"  @click="expand=!expand" /></div>
            <div v-if="expand">
                <ul class="pure-u-1" style="margin: 5px;">
                    <li v-for="(ingredient, index) in this.ingredientQuantities" :key="index">{{ingredient.recipe}}: {{ingredient.quant}}</li>
                </ul>
                <!-- <div class="pure-u-1" v-for="(ingredient, index) in this.ingredientQuantities" :key="index">{{ingredient.recipe}}: {{ingredient.quant}}</div> -->
            </div>            
        </div>
    </div>
</template>

<script>
import {db} from "@/firebaseConfig";

export default {
    name: "IngredientViewer",
    props: {
        id: String
    },
    data: function() {
        return {
            ingredient_info: false,
            expand: false
        }
    },
    firestore: function() {
        return {
            ingredient_info: db.collection("ingredients").doc(this.id)
        }
    },
    computed: {
        ingredientQuantities: function() {
            let ingredientQuantities = []
            for (let recipeIndex in this.ingredient_info.recipes) {
                let recipe = this.ingredient_info.recipes[recipeIndex]
                console.log(recipe)
                if (recipe.onList) {
                    console.log("on list")

                        for (let i = 0; i < recipe.ingredientRefs.length; i++) {
                            // if (recipe.ingredientRefs[i].id == this.id) {
                            if (recipe.ingredients[i] == this.ingredient_info.name) {
                                ingredientQuantities.push({recipe: recipe.title, quant: recipe.quantities[i]})
                            }
                        }

                }
            }
            return ingredientQuantities
        }
    }
}
</script>

<style scoped>
.picker {
    text-align: left;
    /* vertical-align: middle; */
    border: 1px solid black;
    border-radius: 10px;
    margin-top: 5px;
}

input {
    vertical-align: right;
    margin-right: 20px;
}

.icon{
  display:flex;
  align-items:center;
  justify-content:center;
 }

 p {
     margin: 10px;
 }
</style>