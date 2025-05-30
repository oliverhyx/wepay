# @neuit/wepay

微信支付 Node.js SDK，用于对接微信支付的各种接口(适用于服务端)。

## 目录

- [安装](#安装)
- [配置](#配置)
  - [通过配置文件](#通过配置文件)
  - [直接传参使用](#直接传参使用)
- [功能清单](#功能清单)
  - [基础](#基础)
  - [JSAPI支付](#jsapi支付)
- [许可证](#许可证)

## 安装

```bash
npm install @neuit/wecom
```

## 配置

该库支持多种方式配置：

### 通过配置文件

在项目根目录创建 `.neuit.config.json` 文件：

```json
{

}
```

### 直接传参使用

```javascript
const { setConfig } = require("@neuit/wepay");

const config = {

};

setConfig(config);
```

## 功能清单

### 基础

### JSAPI支付

## 许可证

MIT
