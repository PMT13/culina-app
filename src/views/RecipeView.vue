<template>
    <div class="">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/grids-responsive-min.css" />
        <div class="pure-u-1" id="header">
            <h1 id="recipe_title">{{ this.recipe_info.title }}</h1>
            <font-awesome-icon id="editIcon" icon="fa-solid fa-pen-to-square" size="2x" @click="$router.push('/edit/' + $route.params.id + '/')"/>
            <font-awesome-icon id="deleteIcon" icon="fa-solid fa-trash" size="2x" @click="deleteRecipe()"/>
            <font-awesome-icon id="groceryIcon" icon="fas fa-shopping-cart" size="2x" @click="addToList()"/>
        </div>
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2" id="recipeInfo">
            <img v-if="recipe_info.imageURL" :src="recipe_info.imageURL" style="width:450px;">
            <img v-else src="https://i.pinimg.com/originals/ff/c3/d3/ffc3d3f7e25c28ea2d3fe42231736f00.png">
            <div id="recipe_info">
                <span>{{  this.recipe_info.time }} minutes</span>
                <span>{{ this.recipe_info.servings }} serving(s)</span>
            </div>
            <h3 id="description_header">Description:</h3>
            <p>{{ this.recipe_info.description }}</p>
        </div>
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2" id="tabs">
            <div class="w3-container">
                <div class="w3-row">
                    <div class="pure-g">
                        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2">
                            <a href="javascript:void(0)" @click="openTab('ingredients_tab', 'ingredients_content');">
                            <div class="w3-third tablink w3-bottombar w3-hover-light-grey w3-padding" id="ingredients_tab">Ingredients</div>
                            </a>
                        </div>
                        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2">
                            <a href="javascript:void(0)" @click="openTab('instructions_tab', 'instructions_content');">
                            <div class="w3-third tablink w3-bottombar w3-hover-light-grey w3-padding" id="instructions_tab">Instructions</div>
                            </a>
                        </div>
                    </div>
                </div>

                <div id="ingredients_content" class="w3-container tab" style="display:none">
                    <h2>Ingredients</h2>
                    <ul id="recipe_ingredients">
                        <li v-for="(ingredient, index) in this.recipe_info.ingredients" :key="index">{{ ingredient }} ({{recipe_info.quantities[index]}})</li>
                    </ul>
                </div>
                <div id="instructions_content" class="w3-container tab" style="display:none">
                    <h2>Instructions</h2>
                    <ol id="recipe_steps">
                        <li v-for="step in this.recipe_info.steps" :key="step">{{ step }}</li>
                    </ol>
                </div>
            </div>
        </div>  
    </div>
</template>

<script>
import { db } from '@/firebaseConfig'
export default {
    name: 'RecipeView',
    data: function(){
      return{
        recipe_info: {}
      }
    },
    props: {
        user: String
    },
    mounted(){
        db.collection('recipes').doc(this.$route.params.id).get().then((doc) => {
            if(doc.exists == false){
                this.$router.push('/404');
            }else{
                var ingredients = doc.get("ingredients");
                var quantities = doc.get("quantities"); 
                var combined = [];
                for(var i = 0; i < ingredients.length;i++){
                    combined.push(quantities[i] + " " + ingredients[i]);
                }
                // this.recipe_info = {
                //     id: doc.id,
                //     title: doc.get("title"),
                //     description: doc.get("description"),
                //     ingredients: combined,
                //     steps: doc.get("steps"),
                //     time: doc.get("time"),
                //     servings: doc.get("servings"),
                //     imageURL: doc.get("imageURL")
                // }
                this.recipe_info = doc.data()
            }
        })
        this.openTab('ingredients_tab', 'ingredients_content');
    },
    methods:{
        openTab(tabName,tabContent) {
            var i, x, tablinks;
            x = document.getElementsByClassName("tab");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablink");
            for (i = 0; i < x.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" w3-border-red", "");
            }
            document.getElementById(tabContent).style.display = "block";
            document.getElementById(tabName).className += " w3-border-red";
        },
        deleteRecipe(){
            if(confirm("Are you sure you want to delete this recipe?")){
                db.collection("recipes").doc(this.$route.params.id).get().then((recipeSnapshot) => {
                    var ingredientRefs = recipeSnapshot.data().ingredientRefs
                    console.log(ingredientRefs)
                    for (var i = 0; i< ingredientRefs.length; i++) {
                        // var newCount = ingredientRefs[i].get().data().count - 1

                        // var newCount = db.collection("ingredients").doc(ingredientRefs[i]).count - 1
                        // console.log(newCount)
                        // if (newCount < 1) {
                        //     ingredientRefs[i].delete();
                        // } else {
                        //     ingredientRefs[i].update({count: newCount})
                        // }

                        ingredientRefs[i].get().then((docSnapshot) => {
                            var newCount = docSnapshot.data().count - 1
                            
                            console.log(newCount)
                            if (newCount < 1) {
                                docSnapshot.ref.delete();
                            } else {
                                //remove reference to deleted recipe from ingredient
                                let recipes = docSnapshot.data().recipes
                                for (let j = 0; j < recipes.length; j++) {
                                    if (recipes[j].id == db.collection("recipes").doc(this.$route.params.id).id) {
                                        recipes.splice(j, 1)
                                    }
                                }
                                docSnapshot.ref.update({count: newCount, recipes: recipes})
                            }
                        })
                    }
                    db.collection("recipes").doc(this.$route.params.id).delete().then(() => {
                        this.$router.push('/allRecipes');
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                })
            }
        },
        addToGrocery(){
            db.collection('grocery').where("user","==",this.user).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // var old_grocery_list = doc.data().ingredients;
                    // var new_grocery_list = old_grocery_list.concat(this.recipe_info.ingredients);
                    // var grocerySet = new Set(new_grocery_list)      // get rid of duplicates 
                    // var groceryArray = Array.from(grocerySet)
                    var old_grocery_list = doc.data().recipes;
                    console.log(old_grocery_list[0].id);
                    // db.collection('grocery').doc(doc.id)
                    //     .update({ingredients: groceryArray}).then(() => {
                    //         this.$router.push('/grocery');
                    // }).catch((error) => {
                    //     console.log(error);
                    // });
                });
            })
        },
        addToList: function() {
            db.collection('recipes').doc(this.$route.params.id).update({onList: !this.recipe_info.onList})
            if (this.recipe_info.onList) { 
                return
            }
            db.collection('recipes').doc(this.$route.params.id).update({availableIngredients: this.recipe_info.ingredientRefs.length})
            for(let i = 0; i < this.recipe_info.ingredientRefs.length; i++) {
                var ingredientRef = this.recipe_info.ingredientRefs[i]
                db.collection("ingredients").doc(ingredientRef.id).update({onList: true})
            }
        }
    }
}
</script>

<style scoped>
    #header{
        /* background: transparent url(https://previews.123rf.com/images/magone/magone1602/magone160200057/52173195-fondo-de-cocci%C3%B3n-con-la-tabla-de-cortar-de-edad-vista-desde-arriba.jpg) 0 0 no-repeat fixed; */
        background: transparent url("/src/assets/wallpaperflare.com_wallpaper.jpg") 0 0 no-repeat fixed;
        text-align: center;
        background-size: cover;
        height: 300px;
        width: 100%;
        margin-top:1%;
        filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="/src/assets/wallpaperflare.com_wallpaper.jpg", sizingMethod='scale');
        /* filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='https://previews.123rf.com/images/magone/magone1602/magone160200057/52173195-fondo-de-cocci%C3%B3n-con-la-tabla-de-cortar-de-edad-vista-desde-arriba.jpg', sizingMethod='scale'); */
    }

    img{
        width:20em;
        height:20em;
        padding: 15px 15px 15px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(34, 25, 25, 0.4);
        border: 1px solid black;   
        object-fit: cover;
    }
    
    #recipeInfo, #tabs{
        margin-top:3%;
    }

    #editIcon{
        position: relative;
        color:rgb(13, 167, 238);
        background-color: transparent;
        cursor: pointer;
        margin-right: 2%;
        top: 25%;
    }

    #deleteIcon{
        position: relative;
        color: red;
        background-color: transparent;
        cursor: pointer;
        margin-right: 2%;
        top: 25%;
    }

    #groceryIcon{
        position: relative;
        color: green;
        background-color: transparent;
        cursor: pointer;
        top: 25%;
    }

    #recipe_info{
        text-align: center;
        padding-top: 20px;
        margin-top:2%;
    }

    span{
        width:fit-content;
        border: 1px solid black;
        border-radius:15px 15px 15px 15px;
        padding:10px;
        background-color: #781F19;
        color: white;
    }

    span + span {
        margin-left: 10%;
    }

    #recipe_title{
        top:20%;
        font-size: 5.2vmax;
        color:white;
        width:fit-content;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
        padding:10px;
        margin:auto;
        position:relative;
        overflow-x: hidden;
        -webkit-touch-callout: none;
        -webkit-user-select: none; 
        -khtml-user-select: none; 
        -moz-user-select: none;
        -ms-user-select: none; 
        user-select: none;
    }

    #description_header{
        text-decoration: underline;
        margin-top: 50px;
    }

    #ingredients_tab,#instructions_tab{
        background-color: #781F19;
        color: white;
    }

    #ingredients_content,#instructions_content{
        border: 1px solid black;
    }
    
    #recipe_ingredients,#recipe_steps{
        margin-left:5%;
        padding:0%;
    }

    .w3-row{
        text-align: center;
    }

    .w3-container{
        text-align: left;
    }

    .w3-third {
        width: 100%;
    }
    .w3-border-red{
        border-color: black!important;
    }
</style>
