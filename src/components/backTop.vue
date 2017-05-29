<template>
    <div id="backtotop" style="display: block; top: 250px; right: 0px;" > 
        <a href="javascript:scroll(0,0)">回到顶部</a>
    </div>
</template>

<script>
import $ from 'n-zepto';
export default{
    mounted(){
        // if (document.documentElement.scrollTop + document.body.scrollTop > 0) {
        //     document.getElementById("backtotop").style.display = "block";
        // } else {
        //     document.getElementById("backtotop").style.display = "none";
        // }
    },
    methods:{
        // reset(){
        //     document.getElementById("backtotop").style.display = "none";
        // }
    }
}
</script>

<style scoped>
#backtotop {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-right: 0;
}

#backtotop {
    width: 24px;
    color: gray;
    padding: 12px 0 12px 5px;
    display: none;
    position: fixed;
    cursor: pointer;
    text-align: center;
    z-index: 20;
    background-color: #fff;
    border-radius: 12px 0 0 12px;
}
</style>

