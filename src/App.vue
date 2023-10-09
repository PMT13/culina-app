<template>
    <div id="app">
        <head>
            <script src="https://kit.fontawesome.com/6265131818.js" crossorigin="anonymous" type="application/javascript"></script>
            <link rel="stylesheet" href="https://unpkg.com/purecss@2.1.0/build/pure-min.css" integrity="sha384-yHIFVG6ClnONEA5yB5DJXfW2/KC173DIQrYoZMEtBvGzmf0PKiGyNEqe9N6BNDBH" crossorigin="anonymous">
            <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/grids-responsive-min.css" />
        </head>
        <nav class="top-nav">
            <div class="pure-g">
                <div class="pure-u-1-3">
                    <input id="menu-toggle" type="checkbox" />
                    <label class='menu-button-container' for="menu-toggle">
                        <div class='menu-button'></div>
                    </label>
                    <ul v-if="this.user != ''" class="menu">
                        <li><router-link style="text-decoration:none;font-size:14pt;" to="/allRecipes">My Recipes</router-link> </li>
                        <li><router-link style="text-decoration:none;font-size:14pt;" to="/grocery">Grocery List</router-link></li>
                    </ul>
                </div>
                <div class="pure-u-1-3" id="culina" @click="goHome()">Culina</div>
                <div class="pure-u-1-3" id="login"><login-button id="login" @clicked="updateUser"/></div>
            </div>
        </nav>
        <router-view :user="this.user"/>
    </div>
</template>

<script>
import { auth } from "@/firebaseConfig";
import LoginButton from './components/LoginButton.vue'

export default {
    components: { LoginButton},
    data: function(){
        return{
        user: ""
        }
    },
    mounted(){
        if(auth.currentUser){
            this.user = auth.currentUser.displayName;
            if(this.$router.currentRoute.name == "home"){
            this.$router.push("/allRecipes");
            }
        }
    },
    methods:{
        updateUser(user){
            this.user = user;
        },
        goHome(){
            if(this.$router.currentRoute.fullPath != '/'){
                this.$router.push('/')
            }
        }
    }
}
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .pure-g{
        width:100%;
    }
    #login{
        margin-bottom: auto;
        margin-top:auto;
        text-align:right;
    }
    #culina{
        font-size:28pt;
        font-family:Brush Script MT;
        cursor:pointer;
        -webkit-touch-callout: none;
        -webkit-user-select: none; 
        -khtml-user-select: none; 
        -moz-user-select: none;
        -ms-user-select: none; 
        user-select: none;
    }
    .pure-u-1-3{
        margin-top:0%;
    }

    nav a.router-link-exact-active {
        color: #42b983;
    }

    a{
        color:white;
    }

    h2 {
        vertical-align: center;
        text-align: center;
    }

    html, body {
        margin: 0;
        height: 100%;
    }

    * {
        font-family: "Raleway";
        box-sizing: border-box;
    }

    .top-nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background: #194378;
        color: #FFF;
        height: 70px;
        padding: 1em;
    }

    .menu {
        display: flex;
        flex-direction: row;
        list-style-type: none;
        padding: 0;
    }

    .menu > li {
        margin: 0 1rem;
    }

    #menu-toggle:not(:checked) .menu-button-container {
        display: none;
        height: 100%;
        width: 30px;
        cursor: pointer;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .menu-button-container {
        display: none;
        height: 100%;
        width: 30px;
        cursor: pointer;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #menu-toggle {
        display: none;
    }

    .menu-button,
    .menu-button::before,
    .menu-button::after {
        display: block;
        background-color: #fff;
        position: absolute;
        height: 4px;
        width: 30px;
        transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
        border-radius: 2px;
    }

    .menu-button::before {
        content: '';
        margin-top: -8px;
    }

    .menu-button::after {
        content: '';
        margin-top: 8px;
    }

    #menu-toggle:checked + .menu-button-container .menu-button::before {
        margin-top: 0px;
        transform: rotate(405deg);
    }

    #menu-toggle:checked + .menu-button-container .menu-button {
        background: rgba(255, 255, 255, 0);
    }

    #menu-toggle:checked + .menu-button-container .menu-button::after {
        margin-top: 0px;
        transform: rotate(-405deg);
    }

    @media (max-width: 700px) {
    .menu-button-container {
        display: flex;
    }

    .menu {
        position: absolute;
        top: 0;
        margin-top:70px;
        left: 0;
        flex-direction: column;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
    
    #menu-toggle:not(:checked) ~ .menu li {
        height: 0;
        margin: 0;
        padding: 0;
        border: 0;
        display:none;
        transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    #menu-toggle:checked ~ .menu li {
        border: 1px solid #333;
        height: 2.5em;
        padding: 0.5em;
        transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    .menu > li {
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 0.5em 0;
        width: 100%;
        background-color: #222;
    }
    .menu > li:not(:last-child) {
        border-bottom: 1px solid #444;
    }
}
</style>
