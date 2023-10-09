<template>
    <div>
        <!-- <input type="text" value="1 cup test item" @select="changeSelection"> -->
        <p id="s" ref="s" @mouseup="changeSelection" @mousedown="clearSelection">1 cup test item</p>
    </div>
</template>

<script>
export default {
    name: "IngredientSelector",
    data: function() {
            return {
                text: "1 cup test item",
                startIndex: 0,
                endIndex: 0
            }
        },
    methods: {
        changeSelection: function() {
            // var txt = this.innerText;
            var selection = window.getSelection();
            // console.log(selection.toString())
            // console.log(selection)
            var start = selection.anchorOffset;
            var end = selection.focusOffset;
            if (start >= 0 && end >= 0){
                console.log("start: " + start);
                console.log("end: " + end);
            }
            // var text = this.$refs.s.innerHTML
            // console.log(text)
            // console.log(start + "," + end)
            console.log(this.text.slice(start,end))

            const openingTag = '<span style="color:red">'
            const closingTag = '</span>'

            //insert tags into article
            const newHTML 
            = this.text.slice(0, start) 
            + openingTag + this.text.slice(start, end) + closingTag 
            + this.text.slice(end);
            this.$refs.s.innerHTML = newHTML;
        },
        clearSelection: function() {
            this.$refs.s.innerHTML = this.text;
        }
    }
}
</script>