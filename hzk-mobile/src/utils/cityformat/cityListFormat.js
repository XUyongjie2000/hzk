const cityListFormat = (list) => {
  const cityList = {};
  //   const cityIndex = [];
  //遍历list数组
  list.forEach((item) => {
    // console.log(item);
    let firstLetter = item.short.substr(0, 1);
    // console.log(firstLetter);
    //判断cityList对象中是否含有某一个字母的键
    if (firstLetter in cityList) {
      //如果存在 把这个值添加到对应键的数组中就可以了
      cityList[firstLetter].push(item);
    } else {
      //如果不存在，创建一个键 并且把这个键对应的数据添加到这个键的值（数组）中
      cityList[firstLetter] = [item];
    }
  });
  //   for (const key in cityList) {
  //     console.log(key);
  //   }
  const cityIndex = Object.keys(cityList).sort();
  //   console.log("城市列表展示", cityList);
  return { cityList, cityIndex };
};

export default cityListFormat;
