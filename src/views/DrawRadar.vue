<template>
    <div id="cesiumContainer"></div>
</template>

<script>
    import { ViewerEntity } from '../mapUtil'

    export default {
        data () {
            return {
                viewer: null
            }
        },
        mounted () {
            this.viewer = new ViewerEntity('cesiumContainer');
            this.viewer.drawEntity.drawRadar();
        },
    }
</script>

<style scoped>
    #cesiumContainer {
        width: 100%;
        height: 100%;
    }
</style>
