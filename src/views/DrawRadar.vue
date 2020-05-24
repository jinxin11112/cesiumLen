<template>
    <div id="cesiumContainer"></div>
</template>

<script>
    import { ViewerEntity } from '../mapUtil'
    import { drawRadars } from '../test/RadarTest'

    export default {
        data () {
            return {
                viewer: null
            }
        },
        mounted () {
            this.viewer = new ViewerEntity('cesiumContainer');
            drawRadars(this.viewer);
        },
    }
</script>

<style scoped>
    #cesiumContainer {
        width: 100%;
        height: 100%;
    }
</style>
