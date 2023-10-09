<template>
    <div id="app">
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.1.0/build/pure-min.css" integrity="sha384-yHIFVG6ClnONEA5yB5DJXfW2/KC173DIQrYoZMEtBvGzmf0PKiGyNEqe9N6BNDBH" crossorigin="anonymous">
            <input v-model="online_recipe_link" id="online_recipe_link" type="text" placeholder="Or add an online recipe link">
            <button class="pure-button pure-button-primary" @click="getOnlineRecipe(online_recipe_link)" style="margin-left:1%;">  Submit link</button> <br>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/grids-responsive-min.css" />
        <div class="pure-u-1" id="header">
            <h1 id="recipe_title"><input id="recipe_name" type="text" placeholder="Recipe" maxlength="23"></h1>
        </div>    
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2" id="picture">
            <h3>Additional Info</h3>
            <img v-if="recipe_info.imageURL" :src="recipe_info.imageURL" style="width:450px;">
            <img v-else src="https://i.pinimg.com/originals/ff/c3/d3/ffc3d3f7e25c28ea2d3fe42231736f00.png"><br>
            <add-image @image-selected="storeImage"/>

            <div id="recipe_info">
                <input id="cooking_time" type="number" placeholder="Cooking Time">
                <input id="servings" type="number" placeholder="Servings">
            </div>
            <h3 id="description_header">Description</h3>
            <p><textarea id="description" type="textarea" placeholder="Description..." rows="10" cols="50" maxlength="385"></textarea></p>
        </div>  
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2">

            <h3>Ingredients</h3>
            <!-- <edit-lists newRecipe="true" :recipe="this.recipe_info" :user="this.user" list="ingredients"/> -->
            <input id="ingredient_amount" type="text" placeholder="Amount"><input id="ingredients" type="text" placeholder="Ingredient">
            <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToIngredientList()"/>
            <ul class="list" style="margin-left:15%;">
                <li v-for="(item,index) in ingredientObjects" :key="index">
                    <font-awesome-icon class="deleteItem" icon="fa-solid fa-circle-xmark" @click="deleteIngredient(index)" size="1x"/>
                    <input :id="item + 'qua' + index" v-model="recipe_info.quantities[index]">
                    <input :id="item + 'ing' + index" v-model="ingredientObjects[index].name">
                </li>
            </ul>

            <h3 style="margin-top: 180px;">Instructions</h3>
            <!-- <edit-lists newRecipe="true" :recipe="this.recipe_info" :user="this.user" list="steps"/> -->
            <input id="instruction_input" placeholder="Instruction">
            <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToSteps(recipe_info.steps.length -1)"/>
            <ol class="list" style="margin-left:15%;">
                <li v-for="(item,index) in recipe_info.steps" :key="index" :id="'step' + index">
                    <font-awesome-icon class="deleteItem" icon="fa-solid fa-circle-xmark" @click="deleteStep(index,'steps')" size="1x"/>
                    <input style="width:60%;" :id="index + 'Input'" v-model="recipe_info.steps[index]" class="steps">
                    <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToSteps(index)"/>
                </li>
            </ol>

        </div>  
        <!-- <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2" id="recipeInfo">
            <div id="recipe_info">
                <input id="cooking_time" type="number" placeholder="Cooking Time">
                <input id="servings" type="number" placeholder="Servings">
            </div>
            <h3 id="description_header">Description</h3>
            <p><textarea id="description" type="textarea" placeholder="Description..." rows="10" cols="50" maxlength="385"></textarea></p>
        </div> -->
        <!-- <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2">

            <h3>Instructions</h3>
            <edit-lists newRecipe="true" :recipe="this.recipe_info" :user="this.user" list="steps"/>
            <input id="instruction_input" placeholder="Instruction">
            <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToSteps(recipe_info.steps.length -1)"/>
            <ol class="list">
                <li v-for="(item,index) in recipe_info.steps" :key="index" :id="'step' + index">
                    <font-awesome-icon class="deleteItem" icon="fa-solid fa-circle-xmark" @click="deleteStep(index,'steps')" size="1x"/>
                    <input :id="index + 'Input'" v-model="recipe_info.steps[index]" class="steps">
                    <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToSteps(index)"/>
                </li>
            </ol>

        </div> -->

        <div v-if="isOnline" id="ingredientParser">
            <h3>Select ingredient names from list:</h3>
            <IngredientSelector2 v-for="(ingredient, index) in onlineIngredientsRaw" :key="index" :text="ingredient" v-model="onlineIngredientNames[index]"/>
            <br>
            <button @click="parseOnlineIngredients">Continue</button>
        </div>
        <button class="pure-button pure-button-primary" @click="submit()">Add Recipe</button> <br>
    </div>
</template>



<script>
import { db, storage, auth } from '@/firebaseConfig'
// import EditLists from '../views/EditLists.vue'
import AddImage from '@/components/AddImage.vue'
import IngredientSelector2 from '@/components/IngredientSelector2.vue'
import {v4 as uuidv4} from 'uuid'
import { parse, toSeconds } from "iso8601-duration"
import { test_recipe } from '@/main'

export default {
  name: 'AddRecipe',
  components: {AddImage, IngredientSelector2},
  props: {
        user: String,               // user that is signed in 
  },
  data: function(){
    return{
        image: null,
        recipe_info: 
        {
            title: "",
            description: "",
            availableIngredients: 0,
            ingredients: [],
            quantities: [],
            ingredientRefs: [],
            steps: [],
            time: 0,
            servings: 0,
            user: this.user,
            imageURL: "",
        },
        ingredientObjects: [],
        isOnline: false,
        online_recipe_link: "",
        onlineIngredientsRaw: [],
        onlineIngredientNames: []
        }
    },
    methods:{
        addIngredientToDb(i, recipeRef) {
            var name = this.ingredientObjects[i].name
            db.collection("ingredients").where("user", "==", this.user).where("name", "==", name).get().then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("new ingredient")
                    this.ingredientObjects[i].recipes.push(recipeRef);
                    db.collection('ingredients').add(this.ingredientObjects[i]).then((ingredientRef) => {
                        // add ingredient reference to recipe
                        this.recipe_info.ingredientRefs.push(ingredientRef);
                        recipeRef.update({ingredientRefs: this.recipe_info.ingredientRefs})
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    console.log("existing ingredient")
                    // increment count of ingredient
                    var newCount = querySnapshot.docs[0].data().count + 1
                    querySnapshot.docs[0].ref.update({count: newCount})
                    // add reference to new recipe to list
                    var newRecipes = querySnapshot.docs[0].data().recipes
                    newRecipes.push(recipeRef)
                    querySnapshot.docs[0].ref.update({recipes: newRecipes})
                    // add ingredient reference to recipe
                    this.recipe_info.ingredientRefs.push(querySnapshot.docs[0].ref);
                    recipeRef.update({ingredientRefs: this.recipe_info.ingredientRefs})
                }
            })
        }, 
        addToIngredientList(name = document.getElementById("ingredients").value, amount = document.getElementById("ingredient_amount").value){ 
                // var amount = document.getElementById("ingredient_amount").value;
                // var name = document.getElementById("ingredients").value;
                var ingredient_info = 
                    {
                        name: name,
                        availability: "unknown",
                        essential: false,
                        recipes: [],
                        user: this.user,
                        count: 1,
                        onList: false
                    }
                this.recipe_info.quantities.push(amount);
                // this.recipe_info.ingredients.push(ingredient_input);
                this.ingredientObjects.push(ingredient_info)
                document.getElementById("ingredients").value = "";
                document.getElementById("ingredient_amount").value = "";  
        },
        // addToInstructionList() {
        //     var instruction_input = document.getElementById("instructions").value;
        //     this.recipe_info.steps.push(instruction_input);
        //     document.getElementById("instructionsDiv").style.display = "none";
        // },
        addToSteps(index){
            var instruction_input = document.getElementById("instruction_input");
            if(instruction_input.value != ""){
                this.recipe_info.steps.splice(index + 1, 0, instruction_input.value);
                document.getElementById("instruction_input").value = "";
            }else{
                this.recipe_info.steps.splice(index + 1, 0, " ");
            }
        },
        deleteIngredient(index){
            this.ingredientObjects.splice(index,1);
            this.recipe_info.quantities.splice(index,1);
        },
        deleteStep(index){
            this.recipe_info.steps.splice(index,1);
        },
        submit(){
            //create UUID
            console.log("Submitting recipe")
            var recipe = this.recipe_info
            //var router = this.$router
            var tempID = uuidv4()
            //Upload Image

            var reference = null;
            if (this.image) {
                reference = storage.ref('users/' + auth.currentUser.uid + '/recipes/' + tempID + '/' + this.image.name)
            }

            if (reference) {
                reference.put(this.image)
                .then(function () {
                    reference.getDownloadURL()
                    .then((url) => {
                        // recipe.imageURL = url
                        this.recipe_info.imageURL = url
                    })
                    .catch((error) => {
                        console.log('url not found')
                        console.log(error)
                    })
                }).catch(error => {
                    console.log('image not found')
                    console.log(error.message);
                })
            } else {
                recipe.imageURL = this.recipe_info.imageURL;
            }

            var recipe_name = document.getElementById("recipe_name");
            var cooking_time = document.getElementById("cooking_time");
            var servings = document.getElementById("servings");
            var description = document.getElementById("description");
            if(recipe_name.value == "" || cooking_time.value == "" || servings.value == "" ||
                description.value == "" || recipe.ingredients == [] || recipe.steps == []){
                alert("Please fill in all fields!");
            }else{
                this.recipe_info.title = recipe_name.value;
                this.recipe_info.time = cooking_time.value;
                this.recipe_info.servings = servings.value;
                this.recipe_info.description = description.value;
                // Add ingredient names to recipe object
                for (let i = 0; i < this.ingredientObjects.length; i++) {
                    this.recipe_info.ingredients.push(this.ingredientObjects[i].name);
                }
                db.collection('recipes').add(this.recipe_info).then((docRef) => {
                //db.collection('recipes').doc(tempID).set(this.recipe_info).then((docRef) => {
                    for(var i = 0; i < this.ingredientObjects.length; i++){
                        console.log("Adding ingredient " + i)
                        this.addIngredientToDb(i, docRef)
                    }
                    console.log(this.recipe_info.ingredientRefs)
                    //docRef.update({ingredientRefs: this.recipe_info.ingredientRefs})
                    this.$router.push('/recipe/' + docRef.id);
                }).catch((error) => {
                    console.log(error);
                });
            }
            
        },
        storeImage(data){
            this.image = data;
            if(this.image) {
                this.recipe_info.imageURL = URL.createObjectURL(this.image);
            }
        },
        getOnlineRecipe(recipe_link){
            this.isOnline = true;
            // for testing purpose
            if (recipe_link === "test") {
                // change example between index 0 and 1 in test_recipe
                var online_recipe = test_recipe[1]
                // console.log(online_recipe)
                this.recipe_info.imageURL = online_recipe["new-images"][0].url
                document.getElementById("recipe_name").value = online_recipe.name
                document.getElementById("cooking_time").value = toSeconds(parse(online_recipe["total-time"]))/60
                document.getElementById("description").value = online_recipe.description
                if (isNaN(online_recipe.yield) === false) {
                    document.getElementById("servings").value = online_recipe.yield
                } else {
                    // regex time
                    var new_yield= online_recipe.yield.match(/([\d.]+) *serving/i)[1]
                    document.getElementById("servings").value = new_yield             
                }

                // this.recipe_info.ingredients = online_recipe.ingredients
                this.onlineIngredientsRaw = online_recipe.ingredients
                // for (var i = 0; i < online_recipe.ingredients.length; i ++) {
                //     this.recipe_info.quantities.push("...")
                // }
                this.recipe_info.steps = online_recipe.instructions[0].steps
            }
            else {
                const options = {
                    method: 'POST',
                    url: 'https://mycookbook-io1.p.rapidapi.com/recipes/rapidapi',
                    headers: {
                        'content-type': 'text/plain',
                        'X-RapidAPI-Host': 'mycookbook-io1.p.rapidapi.com',
                        'X-RapidAPI-Key': 'e4478ef29dmsh57c55cdf28fb3e8p1bec43jsnb4df8a3d91b7'
                    },
                    data: recipe_link
                };
                this.axios.request(options).then((response) => {
                    var online_recipe = response.data[0]
                    console.log(online_recipe)
                    this.recipe_info.imageURL = online_recipe["new-images"][0].url
                    document.getElementById("recipe_name").value = online_recipe.name
                    document.getElementById("cooking_time").value = toSeconds(parse(online_recipe["total-time"]))/60
                    document.getElementById("description").value = online_recipe.description
                    if (isNaN(online_recipe.yield) === false) {
                        document.getElementById("servings").value = online_recipe.yield
                    } else {
                        // regex time
                        var new_yield= online_recipe.yield.match(/([\d.]+) *serving/i)[1]
                        document.getElementById("servings").value = new_yield
                    }

                    // this.recipe_info.ingredients = online_recipe.ingredients
                    this.onlineIngredientsRaw = online_recipe.ingredients
                    // for (var i = 0; i < online_recipe.ingredients.length; i ++) {
                    //     this.recipe_info.quantities.push("...")
                    // }
                    this.recipe_info.steps = online_recipe.instructions[0].steps
                })
            }
            
        },
        parseOnlineIngredients() {
            for(let i = 0; i < this.onlineIngredientNames.length; i++) {
                let name = this.onlineIngredientNames[i].replace(",", '')
                name = name.replace(".", '')
                let details = this.onlineIngredientsRaw[i].replace(this.onlineIngredientNames[i], '')
                this.addToIngredientList(name, details)
            }
            this.isOnline = false;
        }
    }
}
</script>

<style scoped>
    #ingredientParser {
        background: white;
        position: fixed;
        left: 10vw;
        top: 10vh;
        width: 80vw;
        margin: auto;
        padding: 20px;
        border: 2px black solid;
        border-radius: 25px;
    }
    textarea{
        resize: none;
    }
    #header{
        background: transparent url(https://previews.123rf.com/images/magone/magone1602/magone160200057/52173195-fondo-de-cocci%C3%B3n-con-la-tabla-de-cortar-de-edad-vista-desde-arriba.jpg) 0 0 no-repeat fixed;
        text-align: center;
        background-size: cover;
        height: 300px;
        width: 100%;
        margin-top:1%;
        filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='https://previews.123rf.com/images/magone/magone1602/magone160200057/52173195-fondo-de-cocci%C3%B3n-con-la-tabla-de-cortar-de-edad-vista-desde-arriba.jpg', sizingMethod='scale');
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

    #recipe_info{
        text-align: center;
        padding-top: 20px;
        margin-top:2%;
    }

    h3{
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

    #recipe_title{
        top:20%;
        font-size: 48pt;
        color:white;
        width:fit-content;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
        padding:10px;
        margin:auto;
        position:relative;
    }
    #recipe_name{
        width:100%;
        text-align: center;
    }
    input + input{
        margin-left: 2%;
    }
    #online_recipe_link{
        margin-top: 1%;
        width: 60%;
    }
    .deleteItem{
        margin-right:1%;
    }

    .addIcon{
        margin-left:1%;
    }
    li{
        text-align:left;
        margin-bottom: 1%;
    }
    #instruction_input{
        width:60%;
    }
</style>

