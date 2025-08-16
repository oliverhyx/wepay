const { JSApiV3 } = require('../../lib/main');

const encryptData = {
  "id": "ad3db7bd-6a70-5d3c-b88e-4769c0465477",
  "create_time": "2025-07-23T14:35:17+08:00",
  "resource_type": "encrypt-resource",
  "event_type": "TRANSACTION.SUCCESS",
  "summary": "支付成功",
  "resource": {
    "original_type": "transaction",
    "algorithm": "AEAD_AES_256_GCM",
    "ciphertext": "9Jv4CHhSM9DxeDfncFKHKduEbi214uPCTN8F5yIXGzoVX5IfK+Nl2ZJ3rjm0ZTiTsnoDZKvdOPW7JLSkqaTVNApGLp6GkCPTGwrynDTEVWrG21/MCCh0sCthQNi4Sw7H1v4OgW6BtZrshFOvTO6L2C230xFonK/+iLbMLUW9DOUzuYBwKBAEZ+HQQ2GT5Zc2OthrFts+9NpOUDXM/xwvthy5iEoH2IBxD84r38MPQQ/U60xNBd5/iSP1meRmRPr5s9Jb7PZZpavDG7q/8vKPXfO3+zl45nRRZJFIuVTB6leqnVncbEoCSvvfKCViEX6xYHm6D0NlU/nWwCxlRmlCfEcrIKbOdjVKTazRG09qxz7dvm6tgrV5SvacCICSR2xzvsKseExk33/+1hPUnCCuaBkTR8lgjWBFPJW6OoEXte3d8kstxJWaqfCOdjJVxob5OQlt38+DSuvWHo3KHxOZgRhtzKtAIORPS4EH/HAvwOCel6dvFol3MkRdZyTGRi35cDh7j1dFF6EGgWR4gbQrmjXuHqQ1PfGkPRMSThU+sYPOZDuSPAkrUvaidU8Z8abTrm2Qu5EdOSLOGrIpVHQu",
    "associated_data": "transaction",
    "nonce": "pUdohsWGTw7G"
  }
};

/**
 * JSAPI V3 下单测试
 */
async function testOrderQuery() {
  const jsApiV3 = new JSApiV3();
  try {
    const data = await jsApiV3.orderQuery({
      "description": "Image形象店-深圳腾大-QQ公仔",
      "out_trade_no": "1217752501201407033233368018",
      "notify_url": "https://www.weixin.qq.com/wxpay/pay.php",
      "amount": {
        "total": 100,
        "currency": "CNY"
      },
      "payer": {
        "openid": "oBP7_6jU45PW2Up6Gu0mx9yKp4ro"
      },
    });
    console.log('JSAPI下单成功:', data);
    return data;
  } catch (error) {
    console.error('JSAPI下单失败:', error);
    throw error;
  }
}

/**
 * JSAPI V3 签名测试
 */
async function testOrderSign(prepayId) {
  const jsApiV3 = new JSApiV3();
  try {
    const sign = await jsApiV3.orderSign(`prepay_id=${prepayId}`);
    console.log('JSAPI签名成功:', sign);
    return sign;
  } catch (error) {
    console.error('JSAPI签名失败:', error);
    throw error;
  }
}

/**
 * JSAPI V3 解密测试
 */
async function testDecrypt() {
  const jsApiV3 = new JSApiV3();
  try {
    const data = jsApiV3.decrypt({
      nonce: encryptData.resource.nonce,
      ciphertext: encryptData.resource.ciphertext,
      associated_data: encryptData.resource.associated_data
    });
    console.log('JSAPI解密成功:', data);
    return data;
  } catch (error) {
    console.error('JSAPI解密失败:', error);
    throw error;
  }
}

/**
 * 运行所有JSAPI V3测试
 */
async function runAllTests() {
  console.log('开始运行JSAPI V3测试...');
  try {
    // 先运行解密测试
    await testDecrypt();
    
    // 再运行下单和签名测试
    const orderData = await testOrderQuery();
    await testOrderSign(orderData.prepay_id);
    
    console.log('JSAPI V3测试全部通过!');
  } catch (error) {
    console.error('JSAPI V3测试失败:', error);
  }
}

module.exports = {
  testOrderQuery,
  testOrderSign,
  testDecrypt,
  runAllTests
};