<template>
    <div id="app">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/grids-responsive-min.css" />
        <div class="pure-u-1" id="header">
            <h1 id="recipe_title"><input id="recipe_name" type="text" placeholder="Recipe Name" :value="this.recipe_info.title" maxlength="23"></h1>
        </div>    
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2" id="picture">
            <h3>Additional Info</h3>
            <img v-if="recipe_info.imageURL" :src="recipe_info.imageURL" style="width:450px;">
            <img v-else src="https://i.pinimg.com/originals/ff/c3/d3/ffc3d3f7e25c28ea2d3fe42231736f00.png"><br>
            <add-image @image-selected="storeImage"/>
        </div>  
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2">

            <h3>Ingredients</h3>
            <!-- <edit-lists newRecipe="false" :recipe="this.recipe_info" :user="this.user" list="ingredients" id="ingredients_list" @clicked="update('editting')"/> -->
            <input id="ingredient_amount" type="text" placeholder="Amount"><input id="ingredients" type="text" placeholder="Ingredient">
            <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToIngredientList()"/>
            <ul class="list" style="margin-left:15%;">
                <li v-for="(item,index) in recipe_info.ingredients" :key="index">
                    <font-awesome-icon class="deleteItem" icon="fa-solid fa-circle-xmark" @click="deleteIngredient(index)" size="1x"/>
                    <!-- <input :id="item + 'qua' + index" v-model="recipe_info.quantities[index]" @change="">
                    <input :id="item + 'ing' + index" v-model="recipe_info.ingredients[index]"> -->
                    <input :id="item + 'qua' + index" v-model="recipe_info.quantities[index]">
                    <input :id="item + 'ing' + index" :value="recipe_info.ingredients[index]" @change="changeIngredient(index, $event)">
                </li>
            </ul>

        </div>  
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2" id="recipeInfo">
            <div id="recipe_info">
                <input id="cooking_time" type="number" placeholder="Cooking Time" :value="this.recipe_info.time">
                <input id="servings" type="number" placeholder="Servings" :value="this.recipe_info.servings">
            </div>
            <h3 id="description_header">Description</h3>
            <p><textarea id="description" type="textarea" placeholder="Description..." rows="10" cols="50" maxlength="385" :value="this.recipe_info.description"></textarea></p>
        </div>
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2">

            <h3>Instructions</h3>
            <!-- <edit-lists newRecipe="false" :recipe="this.recipe_info" :user="this.user" list="steps" @clicked="update('editting')"/> -->
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
        <button class="pure-button pure-button-primary" @click="update()">Update Recipe</button>

        <!-- <button id="start-camera">Start Camera</button>
        <video id="video" width="320" height="240" autoplay></video>
        <button id="click-photo">Take Photo</button>
        <canvas id="canvas" width="320" height="240"></canvas> -->
    </div>
</template>

<script>
import { db, auth, storage } from '@/firebaseConfig'
// import EditLists from '../views/EditLists.vue'
import AddImage from '@/components/AddImage.vue'

export default {
    name: 'EditRecipe',
    components: { AddImage },
    props: {
        user: String
    },
    data: function(){
        return{
            image: null,
            recipe_info: {}
        }
    },
    mounted(){
        // referenced from here https://medium.com/swlh/how-to-access-webcam-and-take-picture-with-javascript-b9116a983d78
        // let camera_button = document.querySelector("#start-camera");
        // let video = document.querySelector("#video");
        // let click_button = document.querySelector("#click-photo");
        // let canvas = document.querySelector("#canvas");

        // camera_button.addEventListener('click', async function() {
        //     let stream = await navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment'}, audio: false });
        //     video.srcObject = stream;
        // });

        // click_button.addEventListener('click', function() {
        //     canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        //     //let image_data_url = canvas.toDataURL('image/png');   <--- Data to be stored possibly
        // });
        db.collection('recipes').doc(this.$route.params.id).get().then((doc) => {
            if(doc.exists == false){
                this.$router.push('/404');
            }else{
                // this.recipe_info = {
                //     id: doc.id,
                //     title: doc.get("title"),
                //     description: doc.get("description"),
                //     ingredients: doc.get("ingredients"),
                //     quantities: doc.get("quantities"),
                //     steps: doc.get("steps"),
                //     time: doc.get("time"),
                //     servings: doc.get("servings"),
                //     imageURL: doc.get("imageURL")
                // }
                this.recipe_info = doc.data()
            }
        })
    },
    methods:{
        addToSteps(index){
            var instruction_input = document.getElementById("instruction_input");
            if(instruction_input.value != ""){
                this.recipe_info.steps.splice(index + 1, 0, instruction_input.value);
                document.getElementById("instruction_input").value = "";
            }else{
                this.recipe_info.steps.splice(index + 1, 0, " ");
            }
        },
        deleteStep(index){
            this.recipe_info.steps.splice(index,1);
        },
        deleteIngredient(index){
            console.log(this.recipe_info.ingredientRefs)
            let ingredientRef = this.recipe_info.ingredientRefs[index]
            ingredientRef.get().then(ingredientSnapshot => {
                let ingredientObj = ingredientSnapshot.data()
                if (ingredientObj.count == 1) { //this is the only recipe with this ingredient
                    ingredientRef.delete()
                } else {
                    ingredientObj.count--;
                    for (let i = 0; i < ingredientObj.recipes.length; i++) {
                        if (ingredientObj.recipes[i].isEqual(db.collection('recipes').doc(this.$route.params.id))) {
                            ingredientObj.recipes.splice(i, 1);
                        }
                    }
                    ingredientRef.update({count: ingredientObj.count, recipes: ingredientObj.recipes})
                }
            })
            
            this.recipe_info.quantities.splice(index,1);
            this.recipe_info.ingredients.splice(index,1);
            this.recipe_info.ingredientRefs.splice(index,1);
        },
        changeIngredient(index, event) {
            //let oldName = this.recipe_info.ingredients[index];
            let newName = event.target.value;

            let ingredientRef = this.recipe_info.ingredientRefs[index]
            ingredientRef.get().then(ingredientSnapshot => {
                let ingredientObj = ingredientSnapshot.data()
                if (ingredientObj.count == 1) { //this is the only recipe with this ingredient
                    ingredientRef.delete()
                } else {
                    ingredientObj.count--;
                    for (let i = 0; i < ingredientObj.recipes.length; i++) {
                        if (ingredientObj.recipes[i].isEqual(db.collection('recipes').doc(this.$route.params.id))) {
                            ingredientObj.recipes.splice(i, 1);
                        }
                    }
                    ingredientRef.update({count: ingredientObj.count, recipes: ingredientObj.recipes})
                }
            })

            this.recipe_info.ingredientRefs.splice(index,1);

            var ingredient_info = 
                    {
                        name: newName,
                        availability: "unknown",
                        essential: false,
                        recipes: [],
                        user: this.user,
                        count: 1,
                        onList: false
                    }
            this.addIngredientToDb(ingredient_info)

            this.recipe_info.ingredients[index] = newName;
        }, 
        addToIngredientList(name = document.getElementById("ingredients").value, amount = document.getElementById("ingredient_amount").value){ 
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
                this.recipe_info.ingredients.push(name);
                this.addIngredientToDb(ingredient_info)
                document.getElementById("ingredients").value = "";
                document.getElementById("ingredient_amount").value = "";  
        },
        addIngredientToDb(object) {
            var recipeRef = db.collection('recipes').doc(this.$route.params.id)
            var name = object.name
            db.collection("ingredients").where("user", "==", this.user).where("name", "==", name).get().then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("new ingredient")
                    object.recipes.push(recipeRef);
                    db.collection('ingredients').add(object).then((ingredientRef) => {
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
        update(str){


            var id = this.$route.params.id;
            var reference = null;
            var recipe_stuff = this.recipe_info;
            if(this.image){
                reference = storage.ref('users/' + auth.currentUser.uid + '/recipes/' + id + '/' + this.image.name);
            }

            var recipe_name = document.getElementById("recipe_name");
            if(recipe_name.value == ""){                                // these if statements make it so that if a input is left blank,
                recipe_name.value = this.recipe.title;                  //  the value defaults back to the original value it had
            }
            var cooking_time = document.getElementById("cooking_time");
            if(cooking_time.value == ""){
                cooking_time.value = this.recipe.time;
            }
            var servings = document.getElementById("servings");
            if(servings.value == ""){
                servings.value = this.recipe.servings;
            }
            var description = document.getElementById("description");
            if(description.value == ""){
                description.value = this.recipe.description;
            }
            
            const temp_router = this.$router;
            if(reference){
                reference.put(this.image)
                    .then(function () {
                        reference.getDownloadURL()
                            .then((url) => {
                                db.collection('recipes').doc(id)
                                    .update({
                                        title: recipe_name.value,
                                        time: cooking_time.value,
                                        servings: servings.value,
                                        description: description.value,
                                        steps: this.recipe_info.steps,
                                        ingredients: this.recipe_info.ingredients,
                                        ingredientRefs: this.recipe_info.ingredientRefs,
                                        quantities: this.recipe_info.quantities,
                                        imageURL: url
                                    }).then(() => {
                                        db.collection('recipes').doc(id).get().then((doc) => {
                                            if(doc.exists == false){
                                                temp_router.push('/404');
                                            }else{
                                                recipe_stuff = {
                                                    id: doc.id,
                                                    title: doc.get("title"),
                                                    description: doc.get("description"),
                                                    ingredients: doc.get("ingredients"),
                                                    quantities: doc.get("quantities"),
                                                    steps: doc.get("steps"),
                                                    time: doc.get("time"),
                                                    servings: doc.get("servings"),
                                                    imageURL: doc.get("imageURL")
                                                }
                                            }
                                        })
                                    }).catch((error) => {
                                        console.log('there was an error')
                                        console.log(error);
                                    });
                            }).catch((error) => {
                                console.log("Error getting url")
                                console.log(error)
                            })
                    })
                this.recipe_info = recipe_stuff;
            }
            else{
                db.collection('recipes').doc(this.$route.params.id)
                    .update({
                        title: recipe_name.value,
                        time: cooking_time.value,
                        servings: servings.value,
                        description: description.value,
                        ingredients: this.recipe_info.ingredients,
                        ingredientRefs: this.recipe_info.ingredientRefs,
                        quantities: this.recipe_info.quantities,
                        steps: this.recipe_info.steps
                    }).then(() => {
                        db.collection('recipes').doc(this.$route.params.id).get().then((doc) => {
                            if(doc.exists == false){
                                this.$router.push('/404');
                            }else{
                                this.recipe_info = {
                                    id: doc.id,
                                    title: doc.get("title"),
                                    description: doc.get("description"),
                                    ingredients: doc.get("ingredients"),
                                    quantities: doc.get("quantities"),
                                    steps: doc.get("steps"),
                                    time: doc.get("time"),
                                    servings: doc.get("servings"),
                                    imageURL: doc.get("imageURL")
                                }
                            }
                        })
                    }).catch((error) => {
                        console.log(error);
                    });
            }
            if(str != "editting"){
                this.$router.push("/recipe/" + this.$route.params.id + "/");
            }
            
            // db.collection('recipes').doc(this.$route.params.id)
            //     .update({
            //         title: recipe_name.value,
            //         time: cooking_time.value,
            //         servings: servings.value,
            //         description: description.value
            //     }).then(() => {
            //         db.collection('recipes').doc(this.$route.params.id).get().then((doc) => {
            //             if(doc.exists == false){
            //                 this.$router.push('/404');
            //             }else{
            //                 this.recipe_info = {
            //                     id: doc.id,
            //                     title: doc.get("title"),
            //                     description: doc.get("description"),
            //                     ingredients: doc.get("ingredients"),
            //                     quantities: doc.get("quantities"),
            //                     steps: doc.get("steps"),
            //                     time: doc.get("time"),
            //                     servings: doc.get("servings")
            //                 }
            //             }
            //         })
            //     }).catch((error) => {
            //         console.log(error);
            //     });
        },
        storeImage(data){
            this.image = data;
            if(this.image) {
                this.recipe_info.imageURL = URL.createObjectURL(this.image);
            }
        }
    }
}
</script>

<style scoped>
textarea{
        resize: none;
    }
    #header{
        /* background: transparent url(https://previews.123rf.com/images/magone/magone1602/magone160200057/52173195-fondo-de-cocci%C3%B3n-con-la-tabla-de-cortar-de-edad-vista-desde-arriba.jpg) 0 0 no-repeat fixed; */
        background: transparent url("/src/assets/wallpaperflare.com_wallpaper.jpg") 0 0 no-repeat fixed;
        text-align: center;
        background-size: cover;
        height: 300px;
        width: 100%;
        margin-top:1%;
        /* filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='https://previews.123rf.com/images/magone/magone1602/magone160200057/52173195-fondo-de-cocci%C3%B3n-con-la-tabla-de-cortar-de-edad-vista-desde-arriba.jpg', sizingMethod='scale'); */
        filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="/src/assets/wallpaperflare.com_wallpaper.jpg", sizingMethod='scale');
    }

    img{
        width:20em;
        height:20em;
        padding: 15px 15px 15px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(34, 25, 25, 0.4);
        border: 1px solid black;   
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
