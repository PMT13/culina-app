<template>
  <div>
      <input type="file" accept="image/*" @change="onFilePicked">
  </div>
</template>

<script>
//import { auth, storage } from '@/firebaseConfig';
export default {
    data(){
        return{
            image: null
        }
    },
    methods: {
        onFilePicked(event){
            this.$emit("image-selected", event.target.files[0]);
        }
    }
}
</script>

<style>

</style>