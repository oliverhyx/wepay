# @neuit/wepay

微信支付 Node.js SDK，用于对接微信支付的各种接口(适用于服务端)。提供简洁易用的API，帮助开发者快速集成微信支付功能。

## 目录

- [@neuit/wepay](#neuitwepay)
  - [目录](#目录)
  - [安装](#安装)
  - [配置](#配置)
    - [通过配置文件](#通过配置文件)
    - [直接传参使用](#直接传参使用)
  - [功能清单](#功能清单)
    - [基础功能](#基础功能)
    - [JSAPI支付](#jsapi支付)
    - [Native支付](#native支付)
  - [使用示例](#使用示例)
    - [JSAPI支付示例](#jsapi支付示例)
    - [Native支付示例](#native支付示例)
    - [回调解密示例](#回调解密示例)
  - [常见问题](#常见问题)
  - [许可证](#许可证)

## 安装

```bash
npm install @neuit/wepay
```

## 配置

该库支持多种方式配置：

### 通过配置文件

在项目根目录创建 `.neuit.config.json` 文件：

```json
{
  "mch_id": "你的商户号",
  "appid": "你的应用ID",
  "serial_no": "证书序列号",
  "api_v3_cert": "APIv3证书路径",
  "private_key": "商户私钥字符串",
  "public_key": "微信支付公钥字符串",
  "public_key_id": "微信支付公钥ID",
  "api_v3_key": "APIv3密钥"
}
```

### 直接传参使用

```javascript
const { setConfig } = require("@neuit/wepay");

const config = {
  mch_id: "你的商户号",
  appid: "你的应用ID",
  serial_no: "证书序列号",
  api_v3_cert: "APIv3证书路径",
  private_key: "商户私钥字符串",
  public_key: "微信支付公钥字符串",
  public_key_id: "微信支付公钥ID",
  api_v3_key: "APIv3密钥"
};

setConfig(config);
```

## 功能清单

### 基础功能

- 签名生成与验证
- 回调数据解密
- HTTP请求封装
- 配置管理

### JSAPI支付

- 下单接口（生成预支付交易会话标识）
- 支付签名生成
- 支付结果查询
- 订单关闭
- 退款申请
- 退款查询

### Native支付

- 下单接口（生成支付二维码链接）
- 支付结果查询
- 订单关闭
- 退款申请
- 退款查询

## 使用示例

### JSAPI支付示例

```javascript
const { JSApiV3 } = require("@neuit/wepay");

// 创建JSAPI支付实例
const jsApiV3 = new JSApiV3();

// 下单示例
async function createJsApiOrder() {
  try {
    const orderParams = {
      description: "Image形象店-深圳腾大-QQ公仔",
      out_trade_no: "1217752501201407033233368018",
      notify_url: "https://www.weixin.qq.com/wxpay/pay.php",
      amount: {
        total: 100,
        currency: "CNY"
      },
      payer: {
        openid: "oBP7_6jU45PW2Up6Gu0mx9yKp4ro"
      },
      scene_info: {
        payer_client_ip: "127.0.0.1"
      }
    };

    // 调用下单接口
    const orderData = await jsApiV3.orderQuery(orderParams);
    console.log("JSAPI下单成功:", orderData);

    // 生成支付签名
    const paySign = await jsApiV3.orderSign(`prepay_id=${orderData.prepay_id}`);
    console.log("支付签名:", paySign);

    // 将paySign返回给前端，用于调起微信支付
    return paySign;
  } catch (error) {
    console.error("JSAPI下单失败:", error);
    throw error;
  }
}

// 调用示例
createJsApiOrder();
```

### Native支付示例

```javascript
const { NativeV3 } = require("@neuit/wepay");

// 创建Native支付实例
const nativeV3 = new NativeV3();

// 下单示例
async function createNativeOrder() {
  try {
    const orderParams = {
      description: "Image形象店-深圳腾大-QQ公仔",
      out_trade_no: "1217752501201407033233368019",
      notify_url: "https://www.weixin.qq.com/wxpay/pay.php",
      amount: {
        total: 100,
        currency: "CNY"
      },
      scene_info: {
        payer_client_ip: "127.0.0.1",
        device_id: "123456",
        store_info: {
          id: "0001",
          name: "形象店",
          address: "深圳市南山区科技园"
        }
      }
    };

    // 调用下单接口
    const orderData = await nativeV3.createOrder(orderParams);
    console.log("Native下单成功:", orderData);
    console.log("二维码链接:", orderData.code_url);

    // 将code_url返回给前端，用于生成支付二维码
    return orderData.code_url;
  } catch (error) {
    console.error("Native下单失败:", error);
    throw error;
  }
}

// 调用示例
createNativeOrder();
```

### 回调解密示例

```javascript
const { Base } = require("@neuit/wepay");

// 创建基础实例
const base = new Base();

// 解密回调数据
function decryptCallbackData(encryptData) {
  try {
    const decrypted = base.decrypt({
      nonce: encryptData.resource.nonce,
      ciphertext: encryptData.resource.ciphertext,
      associated_data: encryptData.resource.associated_data
    });
    console.log("解密成功:", JSON.parse(decrypted));
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("解密失败:", error);
    throw error;
  }
}

// 示例回调数据
const encryptData = {
  "id": "ad3db7bd-6a70-5d3c-b88e-4769c0465477",
  "create_time": "2025-07-23T14:35:17+08:00",
  "resource_type": "encrypt-resource",
  "event_type": "TRANSACTION.SUCCESS",
  "summary": "支付成功",
  "resource": {
    "original_type": "transaction",
    "algorithm": "AEAD_AES_256_GCM",
    "ciphertext": "加密数据...",
    "associated_data": "transaction",
    "nonce": "pUdohsWGTw7G"
  }
};

// 调用解密
decryptCallbackData(encryptData);
```

## 常见问题

1. **如何获取商户号和应用ID？**
   商户号和应用ID可以在微信支付商户平台获取。

2. **APIv3密钥在哪里设置？**
   APIv3密钥需要在微信支付商户平台的API安全设置中设置。

3. **如何处理支付回调？**
   支付回调需要使用`decrypt`方法解密回调数据，然后根据解密后的内容进行业务处理。

4. **支持哪些支付方式？**
   目前支持JSAPI支付和Native支付，后续将添加更多支付方式。

## 许可证

MIT License

Copyright (c) 2025 宁波诺幺信息技术有限公司

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
