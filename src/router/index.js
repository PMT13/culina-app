import Vue from 'vue'
import firebase from "firebase"
import VueRouter from 'vue-router'
import AllRecipes from '../views/AllRecipes.vue'
import RecipeView from '../views/RecipeView.vue'
import HomeView from '../views/HomeView.vue'
import AddRecipe from '../views/AddRecipe.vue'
import ErrorPage from '../views/ErrorPage.vue'
import EditRecipe from '../views/EditRecipe.vue'
import GroceryList from '../views/GroceryList.vue'
import AdminView from '@/views/AdminView.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      authRequired: false,
    }
  },
  {
    path: '/allRecipes',
    name: 'allRecipes',
    component: AllRecipes,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/recipe/:id',
    name: 'recipe',
    component: RecipeView,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/addRecipe',
    name: 'addRecipe',
    component: AddRecipe,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/edit/:id',
    name: 'editRecipe',
    component: EditRecipe,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/grocery',
    name: 'grocery',
    component: GroceryList,
    meta: {
      authRequired: true,
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
  },
  {
    path: '*',
    name: '404',
    component: ErrorPage,
    meta: {
      authRequired: false,
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.authRequired);
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user && requiresAuth) {
            next('/');
        } else {
            next();
        }
    });
})

export default router
