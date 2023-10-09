<template>
 <div>
    <div id="bg">
      <div id="crossfade">
        <img src="https://images.unsplash.com/photo-1506280679279-1553382399d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" alt="">
        <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" alt="">
        <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1310&q=80" alt="">
        <img src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=898&q=80" alt="">
        <img src="https://images.unsplash.com/photo-1569246294372-ed319c674f14?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" alt="">
      </div>
      
    </div>
    <div class="words">
      Start Creating Your Recipes Today
    </div>
    <button class="button" @click="getStarted()">Get Started</button>
 </div>
  
  
</template>

<script>
import { provider } from "@/firebaseConfig";
import firebase from "firebase";

export default {
    name: 'HomeView',
    props: {
        user: String
    },
    methods: {
        getStarted(){
            if(this.user){
                this.$router.push('/allRecipes');
            }else{
                firebase.auth().signInWithPopup(provider).then(() => {
                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    
                    console.log(errorCode)
                    console.log(errorMessage)
                });
            }
        }
    }
}
</script>

<style scoped>
.button{
    background-color:crimson; /* Green */
    border: none;
    color: white;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 18pt;
    margin: 2px 2px;
    margin-top: 5%;
    cursor: pointer;
    border-radius: 20px;

    -webkit-touch-callout: none;
    -webkit-user-select: none; 
    -khtml-user-select: none; 
    -moz-user-select: none;
    -ms-user-select: none; 
    user-select: none;
}
#bg {
  z-index: -10;
  position: fixed; 
  top: -50%; 
  left: -50%; 
  width: 200%; 
  height: 200%;
}
#bg img {
  z-index: -10;
  position: absolute; 
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0; 
  margin: auto; 
  min-width: 50%;
  min-height: 50%;
}

.words{
  text-align: center;
  vertical-align: middle;
  line-height: 40px;
  color:rgb(255, 255, 255);
  font-size: 2em;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  margin-top: 6em;
  -webkit-touch-callout: none;
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  -moz-user-select: none;
  -ms-user-select: none; 
  user-select: none;
}

#crossfade > img { 
    position: absolute;
    top: 0px;
    left: 0px;
    color: transparent;
    opacity: 0;
    z-index: 0;
    -webkit-backface-visibility: hidden;
    -webkit-animation: imageAnimation 40s linear infinite 0s;
    -moz-animation: imageAnimation 40s linear infinite 0s;
    -o-animation: imageAnimation 40s linear infinite 0s;
    -ms-animation: imageAnimation 40s linear infinite 0s;
    animation: imageAnimation 40s linear infinite 0s; 
}

#crossfade > img:nth-child(2)  {
    -webkit-animation-delay: 8s;
    -moz-animation-delay: 8s;
    -o-animation-delay: 8s;
    -ms-animation-delay: 8s;
    animation-delay: 8s; 
}
#crossfade > img:nth-child(3) {
    -webkit-animation-delay: 16s;
    -moz-animation-delay: 16s;
    -o-animation-delay: 16s;
    -ms-animation-delay: 16s;
    animation-delay: 16s; 
}
#crossfade > img:nth-child(4) {
    -webkit-animation-delay: 24s;
    -moz-animation-delay: 24s;
    -o-animation-delay: 24s;
    -ms-animation-delay: 24s;
    animation-delay: 24s; 
}
#crossfade > img:nth-child(5) {
    -webkit-animation-delay: 32s;
    -moz-animation-delay: 32s;
    -o-animation-delay: 32s;
    -ms-animation-delay: 32s;
    animation-delay: 32s; 
}

@-webkit-keyframes imageAnimation { 
    0% { opacity: 0;
    -webkit-animation-timing-function: ease-in; }
    8% { opacity: 1;
         -webkit-animation-timing-function: ease-out; }
    17% { opacity: 1 }
    25% { opacity: 0 }
    100% { opacity: 0 }
}

@-moz-keyframes imageAnimation { 
    0% { opacity: 0;
    -moz-animation-timing-function: ease-in; }
    8% { opacity: 1;
         -moz-animation-timing-function: ease-out; }
    17% { opacity: 1 }
    25% { opacity: 0 }
    100% { opacity: 0 }
}

@-o-keyframes imageAnimation { 
    0% { opacity: 0;
    -o-animation-timing-function: ease-in; }
    8% { opacity: 1;
         -o-animation-timing-function: ease-out; }
    17% { opacity: 1 }
    25% { opacity: 0 }
    100% { opacity: 0 }
}

@-ms-keyframes imageAnimation { 
    0% { opacity: 0;
    -ms-animation-timing-function: ease-in; }
    8% { opacity: 1;
         -ms-animation-timing-function: ease-out; }
    17% { opacity: 1 }
    25% { opacity: 0 }
    100% { opacity: 0 }
}

@keyframes imageAnimation { 
    0% { opacity: 0;
    animation-timing-function: ease-in; }
    8% { opacity: 1;
         animation-timing-function: ease-out; }
    17% { opacity: 1 }
    25% { opacity: 0 }
    100% { opacity: 0 }
}
</style>