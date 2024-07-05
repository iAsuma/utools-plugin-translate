export const isChinese = function (text) {
    return /[\u4e00-\u9fa5]/.test(text);
}

export const isEnglish = function (text) {
    return /^[A-Za-z]+$/.test(text);

}

let test = 1
let test2 =2

export default {test, test2}