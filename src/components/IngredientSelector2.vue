<template>
    <div @touchmove="midSelectMobile" @mouseleave="endSelect">
        <span v-for="(word, index) in textWords" :key="index" :id="index" v-bind:class="{selected: selected[index]}" @mousedown="startSelect(index)" @mouseover="midSelect(index)" @mouseup="endSelect" @touchstart="startSelect(index)" @touchend="endSelect(index)">{{word}} </span>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    name: "IngredientSelector2",
    props: ["text", "value"],
    data: function() {
            return {
                selected: [],
                active: false,
                startIndex: 0,
                endIndex: 0
            }
        },
    computed: {
      // computed since we don't change this
      textWords: function() {
        return this.text.split(" ")
      },
      selection: function() {
        let selection = "";
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i] && selection.length == 0) {
            selection += this.textWords[i]
          } else if (this.selected[i]) {
            selection += " "
            selection += this.textWords[i]
          }
        }
        return selection
      }
    },
    watch: {
      // using a watch to keep selected up to date while still letting the user effect it
      textWords: {
        handler: function(newValue) {
          let newLen = newValue.length
          while (this.selected.length < newLen) {
            this.selected.push(false)
          }
          while (this.selected.length > newLen) {
            this.selected.pop()
          }
        }
      },
      // when value is changed externally reset selected
      value: function(newSelection) {
        // reset to empty
        this.selected.fill(false)
        
        // find if there's a match
        newSelection = newSelection.split(" ")
        let index = -1
        for (let i = 0; i < this.selected.length - newSelection.length+1; i++) {
          let match = true
          // check if index i starts a new match
          for (let k = 0; k < newSelection.length; k++) {
            if (newSelection[k] != this.textWords[k+i]) {
              match = false;
            }
          }
          if (match) {
            console.log(i)
            index = i
          }
        }
        // if there is a match set the match as selected.
        if (index>=0) {
          for(let i = index; i < index + newSelection.length; i++) {
            this.selected[i] = true;
          }
        }
        // reassigning selected -- seems I have to do this for vue to notice I changed it.
        this.selected = [... this.selected]
      }
    },
    methods: {
        startSelect: function(index) {
            this.active=true
            for (let i=0;i < this.selected.length; i++) {
                Vue.set(this.selected, i, false)
            }
            if (this.active) {
                Vue.set(this.selected, index, true)
                this.startIndex = index
            }
        },
        midSelect: function(index) {
            if (this.active) {
                for (let i=0;i < this.selected.length; i++) {
                    Vue.set(this.selected, i, false)
                }
                for(let i = Math.min(this.startIndex, index); i<=Math.max(this.startIndex, index); i++) {
                    Vue.set(this.selected, i, true)
                }
            }
        },
        endSelect: function() {
            if (this.active) {
                this.active = false
            }
            this.$emit("input", this.selection)
        },
        midSelectMobile: function(e) {
            let x = e.touches[0].clientX
            let y = e.touches[0].clientY
            let index = document.elementFromPoint(x, y).id
            this.midSelect(index)
        }
    }
}
</script>

<style scoped>
.selected {
    background-color: yellow;
}

span {
    user-select: none;
    -moz-user-select: none;
}
</style>