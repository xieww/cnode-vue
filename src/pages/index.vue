<template>
    <div>
        <load></load>
    </div>
</template>
<script>
import "../assets/css/github-markdown.css"

import Load  from '../components/loading.vue'
export default {
    components: {
        Load
    },
    mounted() {
        setTimeout(() => {
            this.$router.push({
                name: 'topicList'
            });
        }, 1000);
    }
};
</script>
<style lang="scss">
</style>