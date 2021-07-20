//因为localstorage中的 键 是一个字符串 写错不报做 因此定义一个常量
const HZK_KEY = "hzk_key";

//获取localstorage中的值
export const getCity = () => {
  return JSON.parse(localStorage.getItem(HZK_KEY));
};

//设置localstorage中的值
export const setCity = (value) => {
  return localStorage.setItem(HZK_KEY, JSON.stringify(value));
};
