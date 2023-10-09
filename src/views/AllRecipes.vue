<template>
    <div>
        <div class="pure-g">
            <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/grids-responsive-min.css" />
            <div class="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4 tile" @click="goToRecipe(recipe.id)" :id="recipe.id" v-for="recipe in recipe_list" :key="recipe.id">
                <img v-if="recipe.imageURL" :src="recipe.imageURL">
                <img v-else src="https://i.pinimg.com/originals/ff/c3/d3/ffc3d3f7e25c28ea2d3fe42231736f00.png">
                <div id="textContent">
                    <h1 id="recipe_title">{{ recipe.title }}</h1>
                    <h3 id="recipe_description">Description:</h3>
                </div>
                <p>{{ recipe.description }}</p>
            </div>
        </div>
        <font-awesome-icon id="addRecipe" icon="fa-solid fa-circle-plus" @click="addRecipe()" size="6x"/>
    </div>
</template>

<script>
// @ is an alias to /src
import { db } from '@/firebaseConfig'

export default {
    name: 'AllRecipes',
    data: function(){
    return{
        recipe_list: []
    }
    },
  props: {
    user: String
  },
  mounted(){
    db.collection('recipes').where("user","==",this.user).get().then((querySnapshot) => {
        this.recipe_list = [];
        querySnapshot.forEach((doc) => {
          this.recipe_list.push({
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              imageURL: doc.data().imageURL
          })
        });
    })
  },
  methods:{
        goToRecipe(recipeId){
            this.$router.push("/recipe/" + recipeId + "/");
        },
        addRecipe(){
            this.$router.push("/addRecipe");
        }
    }
}

</script>

<style scoped>
    .pure-g{
        justify-content: center;
    }
    #recipe_title{
        text-decoration:underline;
    }

    #recipe_description{
        text-align: left;
        margin-bottom: 0px;
    }

    img{
        object-fit: cover;
        width:100%;
        height:40%;
        border-radius: 20px 20px 0px 0px;
    }

    .tile:hover{
        cursor: pointer;
    }

    .tile{
        border:1px solid black;
        background-color:#781F19;
        border-radius: 20px;
        color:white;
        height:30em;
        margin:1%;
        width:400px;
    }

    #textContent{
        padding:3%;
    }

    #addRecipe{
        cursor: pointer;
        color: #194378;
        position: fixed;
        right:1.5%;
        top: 85%;
        z-index: 95;
    }
    p{
        height: 100px;
        width:auto;
        overflow-x: hidden;
    }
</style>
