import { Color } from 'cesium'
import { getRandom } from '../util'

export function drawRadars (viewerEntity) {
    // 设置经纬度区域
    let minLat = 24.0
    let maxLat = 26.0
    let minLon = 116.0
    let maxLon = 119.0
    // 雷达罩外球半径范围
    let minOuterRadius = 15000.0
    let maxOuterRadius = 25000.0
    // 雷达罩内球半径范围
    let minInnerRadius = 8000.0
    let maxInnerRadius = 10000.0
    // 竖直方向最小角度范围
    let minZ = [10, 45]
    // 竖直方向最大角度范围
    let maxZ = [50, 90]
    // 雷达罩颜色范围
    let color0 = new Color(0.7, 1.0, 1.0)
    let color1 = new Color(0.0, 1.0, 1.0)
    // 生成范围内6中颜色带
    let colors = gradientColor(color0, color1, 6)
    for (let i = 0; i < 40; ++i) {
        let op = {}
        op.name = i
        op.lat = getRandom(minLat, maxLat)
        op.lon = getRandom(minLon, maxLon)
        // 外半球半径
        op.outerRadius = getRandom(minOuterRadius, maxOuterRadius, 0)
        // 内半球半径
        op.innerRadius = getRandom(minInnerRadius, maxInnerRadius, 0)
        // 竖直方向最小角度
        op.zmin = getRandom(minZ[0], minZ[1], 1)
        // 竖直方向最大角度
        op.zmax = getRandom(maxZ[0], maxZ[1], 1)
        // 设置颜色
        let color = getColor(colors, minOuterRadius, maxOuterRadius, op.outerRadius)
        op.color = color.withAlpha(0.2)
        op.lineColor = color.withAlpha(0.3)
        viewerEntity.drawEntity.drawRadar(op)
    }
    viewerEntity.showEntity()
}

/*
// startColor：开始颜色Cesium.Color
// endColor：结束颜色Cesium.Color
// step:几个阶级（几步）
*/
function gradientColor (startColor, endColor, step) {
    let startR = startColor.red
    let startG = startColor.green
    let startB = startColor.blue

    let endR = endColor.red
    let endG = endColor.green
    let endB = endColor.blue

    let sR = (endR - startR) / step // 总差值
    let sG = (endG - startG) / step
    let sB = (endB - startB) / step

    let colorArr = []
    for (let i = 0; i < step; i++) {
        // 计算每一步的color值
        let color = new Color(sR * i + startR, sG * i + startG, sB * i + startB)
        colorArr.push(color)
    }
    return colorArr
}

function getColor (colors, min, max, num) {
    let n = colors.length
    let index = 0
    if (num !== min) {
        index = (num - min) * n / (max - min)
    }
    return colors[parseInt(index)]
}
