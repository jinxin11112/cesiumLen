import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

// 专门用于编写绘图相关方法
import { DrawEntity } from './drawEntity'

let viewer = null

/**
 * 使用时先实例化，传入divId生产viewer对象
 * 未经实例化的viewer对象为null
 */
export class ViewerEntity {

    // 绘图相关方法
    drawEntity = null

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
        this.drawEntity = new DrawEntity(viewer)
        // 去除cesium的logo
        viewer._cesiumWidget._creditContainer.innerHTML = ''
        this.setCenterPoint(centerPoint)
        this.showMousePosition()
        // 去除原有的单击和双击事件
        viewer.screenSpaceEventHandler.setInputAction(() => {
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        viewer.screenSpaceEventHandler.setInputAction(() => {
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    };

    // 设置地图中心点
    setCenterPoint (centerPoint) {
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
    }

    // 查看鼠标实时位置
    showMousePosition () {
        // 实现鼠标移动显示位置
        viewer._cesiumWidget._creditContainer.style.color = '#FFF'
        viewer.screenSpaceEventHandler.setInputAction((movement) => {
            let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
            if (!cartesian) return
            // 将笛卡尔三维坐标转为地图坐标（弧度）
            let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
            // 将地图坐标（弧度）转为十进制的度数
            let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4)
            let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4)
            let height = (viewer.camera.positionCartographic.height / 1000).toFixed(2)
            viewer._cesiumWidget._creditContainer.innerHTML = '经度：' + lon + ' 纬度：' + lat + ' 高度：' + height
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    // 销毁viewer
    destroy () {
        if (!viewer.isDestroyed()) viewer.destroy()
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

    // 清空viewer
    clearViewer () {
        viewer.entities.removeAll()
        viewer.dataSources.removeAll()
    }

    // 将绘制的entity至于viewer中心
    showEntity () {
        viewer.zoomTo(viewer.entities)
    }

}
