<template>
    <div>
        <div v-if="this.list == 'ingredients'">
            <input id="ingredient_amount" type="text" placeholder="Amount"><input id="ingredients" type="text" placeholder="Ingredient">
            <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToIngredients()"/>
            <ul class="list">
                <li v-for="(item,index) in recipe.ingredients" :key="index" >
                    <font-awesome-icon class="deleteItem" icon="fa-solid fa-circle-xmark" @click="deleteItem(index,'ingredients')" size="1x"/>
                    <input :id="item + 'qua' + index" :value="recipe.quantities[index]" @input="update(index,item + 'qua' + index,'quantities')">
                    <input :id="item + 'ing' + index" :value="item"  @input="update(index,item + 'ing' + index,'ingredients')">
                </li>
            </ul>
        </div>
        <div v-else>
            <input id="instruction_input" placeholder="Instruction">
            <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToSteps(recipe.steps.length -1)"/>
            <ol class="list">
                <li v-for="(item,index) in recipe.steps" :key="index" :id="'step' + index">
                    <font-awesome-icon class="deleteItem" icon="fa-solid fa-circle-xmark" @click="deleteItem(index,'steps')" size="1x"/>
                    <input :id="index + 'Input'" :value='item' class="steps" @input="update(index,index + 'Input','steps')">
                    <font-awesome-icon class="addIcon" icon="fa-solid fa-plus" @click="addToSteps(index)"/>
                </li>
            </ol>
        </div>
    </div>
</template>

<script>
import { db } from '@/firebaseConfig'

export default {
    name: 'EditLists',
    props: {
        user: String,               // user that is signed in 
        list: String,
        newRecipe: String,
        recipe: Object              // object that contains the original recipe information (before edits)
    },
    data() {
        return {
            itemValue: ''
        }
    },
    methods: {
        addToSteps(index){
            var instruction_input = document.getElementById("instruction_input");
            var stepsArray = this.recipe.steps; 
            if(instruction_input.value != ""){
                stepsArray.splice(index + 1, 0, instruction_input.value);
                document.getElementById("instruction_input").value = "";
            }else{
                stepsArray.splice(index + 1, 0, " ");
            }
            if(this.newRecipe == 'false'){
                db.collection('recipes').doc(this.$route.params.id)
                    .update({
                        steps: stepsArray
                }).then(() => {
                    this.$emit('clicked');
                }).catch((error) => {
                        console.log(error);
                });
            }
        },
        addToIngredients(){
            var ingredient_amount = document.getElementById("ingredient_amount").value;
            var ingredient_input = document.getElementById("ingredients").value;
            var ingredientsArray = this.recipe.ingredients; 
            var quantitiesArray = this.recipe.quantities;
            ingredientsArray.push(ingredient_input);
            quantitiesArray.push(ingredient_amount);
            if(this.newRecipe == 'false'){
                db.collection('recipes').doc(this.$route.params.id)
                    .update({
                        ingredients: ingredientsArray,
                        quantities: quantitiesArray
                }).then(() => {
                    this.$emit('clicked');
                }).catch((error) => {
                        console.log(error);
                });
            }
            document.getElementById("ingredients").value = "";
            document.getElementById("ingredient_amount").value = "";
        },
        update(index,input,list){
            if(list == "steps"){
                var stepsArray = this.recipe.steps;
                stepsArray[index] = document.getElementById(input).value;
                if(this.newRecipe == 'false'){
                    db.collection('recipes').doc(this.$route.params.id)
                    .update({
                        steps: stepsArray,
                    }).then(() => {
                        this.$emit('clicked');
                    }).catch((error) => {
                            console.log(error);
                    });
                }
            }else{
                if(list == "ingredients"){
                    var ingredientsArray = this.recipe.ingredients; 
                    ingredientsArray[index] = document.getElementById(input).value;
                    if(this.newRecipe == 'false'){
                        db.collection('recipes').doc(this.$route.params.id)
                            .update({
                                ingredients: ingredientsArray,
                        }).then(() => {
                            this.$emit('clicked');
                        }).catch((error) => {
                                console.log(error);
                        });
                    }
                }else{
                    var quantitiesArray = this.recipe.quantities;
                    quantitiesArray[index] = document.getElementById(input).value;
                    if(this.newRecipe == 'false'){
                        db.collection('recipes').doc(this.$route.params.id)
                            .update({
                                quantities: quantitiesArray
                        }).then(() => {
                            this.$emit('clicked');
                        }).catch((error) => {
                                console.log(error);
                        });
                    }
                }
            }
        },
        deleteItem(index,list){
            if(list == "ingredients"){
                var ingredientsArray = this.recipe.ingredients; 
                var quantitiesArray = this.recipe.quantities;
                ingredientsArray.splice(index,1);
                quantitiesArray.splice(index,1);
                if(this.newRecipe == 'false'){
                    db.collection('recipes').doc(this.$route.params.id)
                    .update({
                        ingredients: ingredientsArray,
                        quantities: quantitiesArray
                    }).then(() => {
                        this.$emit('clicked');
                    }).catch((error) => {
                            console.log(error);
                    });
                }
            }else{
                var stepsArray = this.recipe.steps;
                stepsArray.splice(index,1);
                if(this.newRecipe == 'false'){
                    db.collection('recipes').doc(this.$route.params.id)
                    .update({
                        steps: stepsArray,
                    }).then(() => {
                        this.$emit('clicked');
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        }
    }
}
</script>

<style scoped>
    ol{
        margin: auto;
        text-align: left;
    }
    ul{
        margin: auto;
        text-align: left;
    }
    .deleteItem{
        color: red;
        cursor: pointer;
        margin-right:1%;
    }
    .addIcon{
        color:green;
        margin-left:1%;
    }
    .list{
        margin-top:2%;
    }
    input + input{
        margin-left: 2%;
    }
    .steps{
        width:80%;
    }
    li{
        margin-top:1%;
    }
    #instruction_input{
        width:80%;
    }
</style>
