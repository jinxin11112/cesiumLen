import * as Cesium from 'cesium'

let viewer = null

export class DrawEntity {
    constructor (viewerIn) {
        viewer = viewerIn
    }

    drawRadar (point) {
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.hei),
            ellipsoid: {
                radii: new Cesium.Cartesian3(point.maxRad, point.maxRad, point.maxRad),
                innerRadii: new Cesium.Cartesian3(point.minRad, point.minRad, point.minRad),
                minimumCone: Cesium.Math.toRadians(20.0),
                maximumCone: Cesium.Math.PI_OVER_TWO,
                material: Cesium.Color.YELLOW.withAlpha(0.3),
                outline: true,
            }
        })
    }

    drawPoint (point) {
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.hei),
            point: {
                color: Cesium.Color.RED,
                pixelSize: 15,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        })
    }

}
