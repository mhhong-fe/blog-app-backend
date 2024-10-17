// 转换函数
function toCamelCase(obj) {
    const newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 将中划线分隔的属性名转换为驼峰命名法
            const camelCaseKey = key.replace(
                /_([a-z])/g,
                function (match, group1) {
                    return group1.toUpperCase();
                }
            );
            newObj[camelCaseKey] = obj[key];
        }
    }
    return newObj;
}

// 对数组中的每个对象进行转换
function transformArray(arr) {
    return arr.map((item) => toCamelCase(item));
}

module.exports = {
    transformArray,
};
