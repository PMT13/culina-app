<template>
    <div>
        <h1>ERROR</h1>
        <p>404</p>
        <img src="https://cdn-icons-png.flaticon.com/512/1548/1548682.png">
        <p>Sorry, it looks like this page does not exist!</p>
    </div>
</template>

<script>
    export default {
        name: 'ErrorPage',
    }
</script>

<style scoped>
    h1{
       color: white; 
    }
    p{
        font-size:32px;
        color: white; 
    }
    img{
        width:20%;
    }
    div{
        background-color:#781F19 ;
        height: 90vh;
        padding:1px;
    }
</style>