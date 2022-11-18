const fs = require('fs');

const TOTAL = 650
const OFFSET = 10

function calculate(numbers) {
    if (numbers.length) numbers = numbers.map(num => Number(num)) // 命令行传入金额
    else numbers = getNumbersFromFile() // 读取默认文件
    const possibleLengths = numbers.map((_, index) => index + 1)
    const possibleGroups = possibleLengths.map(length => getPossibleGroups(numbers, length)).flat()
    return getMatchedGroup(possibleGroups)
}

module.exports = { calculate }

/**
 * 读取发票文件
 * @returns 金额数组
 */
function getNumbersFromFile() {
    const files = fs.readdirSync('F:/文件/发票')
    const numbers = files.map(file => parseFloat(file.split('-')[2]))
    return numbers
}

/**
 * 获取指定长度子数组的可能组合
 * @param {*} numbers 源数组
 * @param {*} length 指定长度
 * @returns 子数组集合
 */
function getPossibleGroups(numbers, length) {
    if (length === 1) return numbers.map(num => [num])
    if (numbers.length === length) return [numbers]
    if (numbers.length < length) return []
    const rawGroups = numbers.map((num, index) => {
        const lastGroups = getPossibleGroups(numbers.slice(index + 1), length - 1)
        const thisGroups = lastGroups.map(group => [num, ...group])
        return thisGroups
    })
    return rawGroups.flat()
}

/**
 * 筛选出符合条件的最小金额的组合
 * @param {*} groups 所有可能的组合
 * @returns 筛选出的组合
 */
function getMatchedGroup(groups) {
    const sumMap = groups.map(numbers => {
        return { sum: numbers.reduce((prev, curr) => prev + curr, 0), numbers }
    })
    const matchedGroups = sumMap.filter(({ sum }) => {
        return sum > TOTAL - OFFSET
    })
    if (!matchedGroups.length) return []
    const sortedMatchedGroups = matchedGroups.sort((prev, curr) => prev.sum - curr.sum)
    return sortedMatchedGroups[0]
}
