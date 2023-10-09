<template>
    <div class="picker">
        <div class="pure-g" v-if="recipe_info">
            <div class="pure-u-3-4"><h3><input type="checkbox" v-model="recipe_info.onList" @click="addToList">{{this.recipe_info.title}}</h3></div>
            <div class="pure-u-1-4"><h3>{{availableIngredients}}/{{this.recipe_info.ingredients.length}}</h3></div>
        </div>
        <div v-else>
            LOADING
        </div>
    </div>
</template>

<script>
import {db} from '@/firebaseConfig.js'

export default {
    name: "RecipePicker",
    data: function(){
      return{
        recipe_info: false
      }
    },
    props: {
        id: String
    },
    firestore: function() {
        return {
            recipe_info: db.collection('recipes').doc(this.id)
        }
    },
    methods: {
        addToList: function() {
            db.collection('recipes').doc(this.id).update({onList: !this.recipe_info.onList})
            if (this.recipe_info.onList) { 
                return
            }
            db.collection('recipes').doc(this.id).update({availableIngredients: this.recipe_info.ingredientRefs.length})
            for(let i = 0; i < this.recipe_info.ingredientRefs.length; i++) {
                var ingredientRef = this.recipe_info.ingredientRefs[i]
                db.collection("ingredients").doc(ingredientRef.id).update({onList: true})
            }
        }
    },
    watch: {
        recipe_info: function() {
            console.log("watcher")
            let count = 0;
            for (let i = 0; i < this.recipe_info.ingredientRefs.length; i++) {
                let ingredient = this.recipe_info.ingredientRefs[i];
                if (ingredient.onList) { count++ }
            }
            //This is handled in IngredientPicker, allows user to deselect recipe 
            
            // if (count >= this.recipe_info.ingredientRefs.length) {
            //     db.collection('recipes').doc(this.id).update({onList: true})
            // } else {
            //     db.collection('recipes').doc(this.id).update({onList: false})
            // }
            db.collection('recipes').doc(this.id).update({availableIngredients: count})
            this.availableIngredients = count;
            // console.log(count)
        }
    },
    // computed: {
    //     availableIngredients: function() {
    //         console.log("computing available ingredients")
    //         let count = 0;
    //         for (let i = 0; i < this.recipe_info.ingredientRefs.length; i++) {
    //             let ingredient = this.recipe_info.ingredientRefs[i];
    //             if (ingredient.onList) { count++ }
    //         }
    //         //This is handled in IngredientPicker, allows user to deselect recipe 
            
    //         // if (count >= this.recipe_info.ingredientRefs.length) {
    //         //     db.collection('recipes').doc(this.id).update({onList: true})
    //         // } else {
    //         //     db.collection('recipes').doc(this.id).update({onList: false})
    //         // }
    //         db.collection('recipes').doc(this.id).update({availableIngredients: count})
    //         // console.log(count)

    //         return count
    //     }
    // }
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