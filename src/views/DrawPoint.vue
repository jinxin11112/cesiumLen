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
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    this.viewer.drawEntity.drawPoint({
                        lat: 23 + 0.7 * i,
                        lon: 121 + 0.7 * j,
                        hei: 0
                    });
                }
            }
        },
    }
</script>

<style scoped>
    #cesiumContainer {
        width: 100%;
        height: 100%;
    }
</style>
