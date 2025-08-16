const { NativeV3 } = require('../../lib/main');

/**
 * Native V3 下单测试
 */
async function testCreateOrder() {
  const nativeV3 = new NativeV3();
  try {
    const data = await nativeV3.createOrder({
      "description": "Image形象店-深圳腾大-QQ公仔",
      "out_trade_no": "1217752501201407033233368019",
      "notify_url": "https://www.weixin.qq.com/wxpay/pay.php",
      "amount": {
        "total": 100,
        "currency": "CNY"
      }
    });
    console.log('Native下单成功:', data);
    console.log('二维码链接:', data.code_url);
    return data;
  } catch (error) {
    console.error('Native下单失败:', error);
    throw error;
  }
}

/**
 * 运行所有Native V3测试
 */
async function runAllTests() {
  console.log('开始运行Native V3测试...');
  try {
    await testCreateOrder();
    console.log('Native V3测试全部通过!');
  } catch (error) {
    console.error('Native V3测试失败:', error);
  }
}

module.exports = {
  testCreateOrder,
  runAllTests
};