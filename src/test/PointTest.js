import { getRandom } from '../util'

export function drawPoints (viewerEntity) {

    // 设置经纬度区域
    let minLat = 24.0
    let maxLat = 26.0
    let minLon = 116.0
    let maxLon = 119.0
    let ops = [];
    for (let i = 0; i < 100; ++i) {
        let op = {}
        op.name = i
        op.lat = getRandom(minLat, maxLat)
        op.lon = getRandom(minLon, maxLon)
        ops.push(op)
    }
    viewerEntity.drawEntity.drawPoints(ops)
    viewerEntity.showEntity()
}
