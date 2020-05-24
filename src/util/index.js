// 生成制定范围随机数
export function getRandom (start, end, fixed = 5) {
    let differ = end - start
    let random = Math.random()
    return (start + differ * random).toFixed(fixed)
}
