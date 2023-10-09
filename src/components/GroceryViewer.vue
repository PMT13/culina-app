<template>
    <div>
        <div class="pure-g">
            <!-- <div class="pure-u-1"><h2>Grocery List</h2></div> -->
            <div class="pure-u-1-24 pure-u-lg-1-3"></div>
            <div class="pure-u-22-24 pure-u-md-1-3 pure-u-lg-1-3">
                <!-- <ul id="recipe_ingredients"> -->
                    <!-- <li v-for="ingredient in this.grocery_list" :key="ingredient.id">{{ ingredient.name }}</li> -->
                    <IngredientViewer v-for="ingredient in this.grocery_list" :key="ingredient.id" :id="ingredient.id"/>
                <!-- </ul> -->
            </div>
            <div class="pure-u-1-24 pure-u-lg-1-3"></div>
        </div>
    </div>
</template>

<script>
import {db} from "@/firebaseConfig";
import IngredientViewer from "@/components/IngredientViewer.vue";

export default {
    name: "GroceryViewer",
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
    components: {
        IngredientViewer
    }
}
</script>

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

    /* .list-holder {
        width: 
    } */
</style>