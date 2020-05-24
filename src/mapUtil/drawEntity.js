import * as Cesium from 'cesium'

let viewer = null

export class DrawEntity {
    constructor (viewerIn) {
        viewer = viewerIn
    }

    /**
     *
     * 绘制雷达罩
     *
     * @param {Object} [point] 雷达相关信息
     * @param {String} [point.name] 实体的名称.
     * @param {Number} [point.lon] 雷达罩的经度.
     * @param {Number} [point.lat] 雷达罩的纬度.
     * @param {Number} [point.outerRadius] 雷达罩的外径.
     * @param {Number} [point.innerRadius] 雷达罩的内径.
     * @param {Number} [point.color] 雷达罩的颜色.
     * @param {Number} [point.lineColor] 雷达罩的线的颜色.
     */
    drawRadar (point) {
        let op = Object.assign({}, point)
        op.position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat)
        // 外半球半径
        let outerRadius = point.outerRadius
        op.outerradius = new Cesium.Cartesian3(outerRadius, outerRadius, outerRadius)
        // 内半球半径
        let innerRadius = point.innerRadius
        op.innerradius = new Cesium.Cartesian3(innerRadius, innerRadius, innerRadius)
        console.log(op)
        let entity = new Cesium.Entity({
            name: op.name,
            position: op.position,
            ellipsoid: {
                radii: op.outerradius,
                innerRadii: op.innerradius,
                minimumCone: Cesium.Math.toRadians(op.zmin),
                maximumCone: Cesium.Math.toRadians(op.zmax),
                material: op.color,
                outline: true,
                outlineColor: op.lineColor,
            },
        })
        viewer.entities.add(entity)
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

    drawPoints (point) {
        let dataSource = new Cesium.CustomDataSource('points')
        point.forEach(item => {
            dataSource.entities.add({
                position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, item.hei),
                point: {
                    color: Cesium.Color.RED,
                    pixelSize: 10,
                    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                }
            })
        })

        let dataSourcePromise = viewer.dataSources.add(dataSource)
        viewer.dataSources.zoomTo(dataSourcePromise)

        dataSourcePromise.then(function (dataSource) {
            let pixelRange = 15
            let minimumClusterSize = 3
            dataSource.clustering.enabled = true
            dataSource.clustering.pixelRange = pixelRange
            dataSource.clustering.minimumClusterSize = minimumClusterSize

            let removeListener

            let pinBuilder = new Cesium.PinBuilder()
            let pin50 = pinBuilder
                .fromText('50+', Cesium.Color.RED, 48)
                .toDataURL()
            let pin40 = pinBuilder
                .fromText('40+', Cesium.Color.ORANGE, 48)
                .toDataURL()
            let pin30 = pinBuilder
                .fromText('30+', Cesium.Color.YELLOW, 48)
                .toDataURL()
            let pin20 = pinBuilder
                .fromText('20+', Cesium.Color.GREEN, 48)
                .toDataURL()
            let pin10 = pinBuilder
                .fromText('10+', Cesium.Color.BLUE, 48)
                .toDataURL()

            let singleDigitPins = new Array(8)
            for (let i = 0; i < singleDigitPins.length; ++i) {
                singleDigitPins[i] = pinBuilder
                    .fromText('' + (i + 2), Cesium.Color.VIOLET, 48)
                    .toDataURL()
            }

            function customStyle () {
                if (Cesium.defined(removeListener)) {
                    removeListener()
                    removeListener = undefined
                } else {
                    removeListener = dataSource.clustering.clusterEvent.addEventListener(
                        function (clusteredEntities, cluster) {
                            cluster.label.show = false
                            cluster.billboard.show = true
                            cluster.billboard.id = cluster.label.id
                            cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM

                            if (clusteredEntities.length >= 50) {
                                cluster.billboard.image = pin50
                            } else if (clusteredEntities.length >= 40) {
                                cluster.billboard.image = pin40
                            } else if (clusteredEntities.length >= 30) {
                                cluster.billboard.image = pin30
                            } else if (clusteredEntities.length >= 20) {
                                cluster.billboard.image = pin20
                            } else if (clusteredEntities.length >= 10) {
                                cluster.billboard.image = pin10
                            } else {
                                cluster.billboard.image = singleDigitPins[clusteredEntities.length - 2]
                            }
                        }
                    )
                }

                // force a re-cluster with the new styling
                let pixelRange = dataSource.clustering.pixelRange
                dataSource.clustering.pixelRange = 0
                dataSource.clustering.pixelRange = pixelRange
            }

            // start with custom style
            customStyle()

            let viewModel = {
                pixelRange: pixelRange,
                minimumClusterSize: minimumClusterSize,
            }
            Cesium.knockout.track(viewModel)

            let toolbar = document.getElementById('toolbar')
            Cesium.knockout.applyBindings(viewModel, toolbar)

            function subscribeParameter (name) {
                Cesium.knockout
                    .getObservable(viewModel, name)
                    .subscribe(function (newValue) {
                        dataSource.clustering[name] = newValue
                    })
            }

            subscribeParameter('pixelRange')
            subscribeParameter('minimumClusterSize')

            let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
            handler.setInputAction(function (movement) {
                let pickedLabel = viewer.scene.pick(movement.position)
                if (Cesium.defined(pickedLabel)) {
                    let ids = pickedLabel.id
                    if (Array.isArray(ids)) {
                        for (let i = 0; i < ids.length; ++i) {
                            ids[i].billboard.color = Cesium.Color.RED
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        })
    }
}
