<template>
    <div>
        <div class="nav">
            <h2 @click="build=true" class="tab" v-bind:class="{ active: build }">Build</h2> | 
            <h2 @click="build=false" class="tab" v-bind:class="{ active: !build }">View</h2>
        </div>
        <GroceryViewer v-if="!build" :user="user"/>
        <GroceryBuilder v-if="build" :user="user"/>
    </div>
</template>

<script>
import GroceryBuilder from "@/components/GroceryBuilder.vue";
import GroceryViewer from "@/components/GroceryViewer.vue";

export default {
    name: "GroceryList",
    components: {
        GroceryBuilder,
        GroceryViewer
    },
    props: {
        user: String
    },
    data: function() {
        return {
            build: true
        }
    }
}
</script>

<style scoped>
.nav {
    /* height: fit-content; */
    height: 5vh;
}

.tab {
    display: inline;
}

    h2{
        cursor: pointer;
        width:fit-content;
        margin:auto;
        margin-top: 3%;
        margin-bottom: 3%;
        border: 1px solid black;
        border-radius:15px 15px 15px 15px;
        padding:10px;
        background-color: #781F19;
        color: white;
    }

.active {
    background-color: #a42c23;
    border: 4px solid black;
}
</style>