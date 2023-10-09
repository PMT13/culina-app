<template>
    <div id="app">
        <div class="pure-g">
            <!-- <div class="pure-u-1"><h2>Grocery Builder</h2></div> -->
            <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2">
                <h3>Add recipes: </h3>
                <ul id="recipes">
                    <RecipePicker v-for="recipe in this.recipe_list" :key="recipe.id" :id="recipe.id"/>
                </ul>
            </div>
            <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2">
                <h3>Add ingredients: </h3>
                <ul id="ingredients">
                    <!-- <li v-for="ingredient in this.ingredient_list" :key="ingredient.id">{{ ingredient.name }}</li> -->
                    <IngredientPicker v-for="ingredient in this.ingredient_list" :key="ingredient.id" :id="ingredient.id"/>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import RecipePicker from '@/components/RecipePicker.vue'
import IngredientPicker from '@/components/IngredientPicker.vue'
import { db } from '@/firebaseConfig'

export default {
    name: 'GroceryBuilder',
    components: {
        RecipePicker,
        IngredientPicker
    },
    data: function(){
        return{
            grocery_list: [],
            recipe_list: [],
            ingredient_list: []
        }
    },
    props: {
        user: String
    },
    firestore: function() {
        return {
            grocery_list: db.collection('ingredients').where("user","==",this.user).where("onList", "==", true),
            recipe_list: db.collection('recipes').where("user","==",this.user),
            ingredient_list: db.collection('ingredients').where("user","==",this.user).orderBy("count", "desc")
        }
    },
    watch: {
        grocery_list: function() {

        }
    }
    // mounted(){
    //     // db.collection('grocery').where("user","==",this.user).get().then((querySnapshot) => {
    //     //     querySnapshot.forEach((doc) => {
    //     //         this.grocery_list = doc.data().ingredients;
    //     //     });
    //     // });
    //     db.collection('ingredients').where("user","==",this.user).where("onList", "==", true).get().then((querySnapshot) => {
    //         this.grocery_list = []
    //         querySnapshot.forEach((doc) => {
    //             this.grocery_list.push({
    //                 id: doc.id,
    //                 name: doc.data().name
    //             })
    //         });
    //     });
    //     db.collection('recipes').where("user","==",this.user).get().then((querySnapshot) => {
    //         this.recipe_list = [];
    //         querySnapshot.forEach((doc) => {
    //             this.recipe_list.push({
    //                 id: doc.id,
    //                 title: doc.data().title,
    //                 description: doc.data().description
    //             })
    //         });
    //     });
    //     db.collection('ingredients').where("user","==",this.user).orderBy("count", "desc").get().then((querySnapshot) => {
    //         this.ingredient_list = [];
    //         querySnapshot.forEach((doc) => {
    //             this.ingredient_list.push({
    //                 id: doc.id,
    //                 name: doc.data().name
    //             })
    //         });
    //     });
    // }
}
</script>

<style scoped>
#recipe_ingredients{
    text-align: left;
}
</style>

<style scoped>
    h2{
        width:fit-content;
        margin:auto;
        margin-top: 3%;
        margin-bottom: 3%;
        border: 1px solid black;
        border-radius:15px 15px 15px 15px;
        padding:5px;
        background-color: #781F19;
        color: white;
    }
</style>