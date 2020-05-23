import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

let viewer = null

export class ViewerEntity {

    // 构造函数, 获取viewer
    constructor (cesiumDivId, option, centerPoint) {
        option = Object.assign({
            fullscreenButton: false,
            animation: false,
            baseLayerPicker: false,
            geocoder: false,
            timeline: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            homeButton: false,
            selectionIndicator: false,
            sceneMode: Cesium.SceneMode.SCENE3D
        }, option)
        viewer = new Cesium.Viewer(cesiumDivId, option)
        // 去除cesium的logo,改为显示当前位置
        let infoDom = document.getElementsByClassName('cesium-viewer-bottom')[0]
        infoDom.style.color = '#FFF'
        infoDom.innerHTML = ''
        // 创建相机初始位置和朝向
        centerPoint = Object.assign({
            lon: 121,
            lat: 23,
            height: 3730460,
            heading: 0,
            pitch: 270,
            roll: 0
        }, centerPoint)
        let initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(centerPoint.heading, centerPoint.pitch, centerPoint.roll)
        viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3.fromDegrees(centerPoint.lon, centerPoint.lat, centerPoint.height),
            orientation: {
                heading: initialOrientation.heading,
                pitch: initialOrientation.pitch,
                roll: initialOrientation.roll
            }
        })
        // 实现鼠标移动显示位置
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handler.setInputAction((movement) => {
            let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
            if (!cartesian) return
            // 将笛卡尔三维坐标转为地图坐标（弧度）
            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
            // 将地图坐标（弧度）转为十进制的度数
            let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4)
            let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4)
            let height = (viewer.camera.positionCartographic.height / 1000).toFixed(2)
            infoDom.innerHTML = '经度：' + lon + ' 纬度：' + lat + ' 高度：' + height
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        // 去除原有的单击和双击事件
        viewer.screenSpaceEventHandler.setInputAction(() => {
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        viewer.screenSpaceEventHandler.setInputAction(() => {
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    };

    // 销毁viewer
    destroy () {
        if (viewer && !viewer.isDestroyed()) viewer.destroy()
    }

    // 获取摄像机当前位置
    getNowPosition () {
        let position = new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2)
        let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.pickEllipsoid(position))
        let lon = curPosition.longitude * 180 / Math.PI
        let lat = curPosition.latitude * 180 / Math.PI
        let height = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).height
        return {
            lon: lon.toFixed(4),
            lat: lat.toFixed(4),
            height: height.toFixed(2)
        }
    }

    // 添加雷达罩
    drawRadar () {
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(121, 23, 200.0),
            ellipsoid: {
                radii: new Cesium.Cartesian3(200000.0, 200000.0, 200000.0),
                innerRadii: new Cesium.Cartesian3(10.0, 10.0, 10.0),
                minimumCone: Cesium.Math.toRadians(20.0),
                maximumCone: Cesium.Math.PI_OVER_TWO,
                material: Cesium.Color.YELLOW.withAlpha(0.3),
                outline: true,
            }
        })
        viewer.zoomTo(viewer.entities)
    }
}
