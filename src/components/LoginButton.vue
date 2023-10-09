<template>
    <div class="auth">
    <template v-if="!user">

        <button class="button" @click="signInWithGoogle"> Sign in </button>
    </template>
    <template v-if="user">
        <!-- google is real paranoid about hotlinking images I guess the referrerpolicy seems to fix it
        https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic -->
        <div><a class="button" @click="signOut">Sign Out</a></div>
    </template>
    <!-- <pre>{{ user }}</pre> -->
    </div>
</template>

<script>
import { auth, provider, db } from "@/firebaseConfig";
import firebase from "firebase";
export default {
    components: {},
    name: "LoginButton",
  data() {
    return {
      user: null
    };
  },
  beforeCreate: function() {
    auth.onAuthStateChanged(user => {
      if (user) {        
        this.user = user;
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    signInWithGoogle: function() {
      if(!firebase.auth().currentUser){
        firebase.auth().signInWithPopup(provider).then(() => {
        const user = firebase.auth().currentUser;
        var name = user.displayName;
        this.$emit('clicked', name);
        db.collection('grocery').where("user","==",user.displayName).get().then((querySnapshot) => {
            if(querySnapshot.empty){
                var newUser = {ingredients:[],user:user.displayName};
                db.collection('grocery').add(newUser).then({
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
          
            console.log(errorCode)
            console.log(errorMessage)
        });
      }
    },
    signOut: function() {
      auth.signOut()
        .then(() => {
          this.user = null;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
    .auth{
        display:inline;
    }

    .avatar {
        width: 2em; 
        height: 2em; 
        border-radius: 50%;
        margin-right:2.5%;
    }
    a{
        cursor:pointer;
    }
    .button {
      /* background-color:crimson; Green */
      background-color: #a42c23; /* Green */
      border: none;
      color: white;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 14pt;
      margin: 2px 2px;
      cursor: pointer;
      border-radius: 20px;
      -webkit-touch-callout: none;
      -webkit-user-select: none; 
      -khtml-user-select: none; 
      -moz-user-select: none;
      -ms-user-select: none; 
      user-select: none;
    }
</style>