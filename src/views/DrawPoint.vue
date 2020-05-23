<template>
    <div id="cesiumContainer"></div>
</template>

<script>
    import { ViewerEntity } from '../mapUtil/viewerEntity'

    export default {
        name: 'CesiumContainer',
        data () {
            return {
                viewer: null
            }
        },
        mounted () {
            this.viewer = new ViewerEntity('cesiumContainer');
            this.viewer.drawRadar();
        },
        destroyed () {
            this.viewer.destroy();
        }
    }
</script>

<style scoped>
    #cesiumContainer {
        width: 100%;
        height: 100%;
    }
</style>
