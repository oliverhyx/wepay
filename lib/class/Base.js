//#region 导入依赖
const request = require("request"); // HTTP请求库
const crypto = require("crypto"); // 加密库，用于生成签名
const config = require('../config'); // 配置文件
const path = require('path') // 路径处理
const fs = require('fs') // 文件系统操作
const xml2js = require('xml2js') // 将XML转换为JSON
const BASE_URL = "https://api.mch.weixin.qq.com"
//#endregion

/**
 * 微信支付API基础类
 */
class Base {

	constructor(data) {
		const {
			api_v3_cert,
			mch_id,
			appid,
			serial_no,
			private_key,
			public_key,
			public_key_id
		} = data || {}
		this.mch_id = mch_id || config.getConfig('mch_id'); // 企业ID
		this.appid = appid || config.getConfig('appid'); // 应用ID
		this.serial_no = serial_no || config.getConfig('serial_no'); // 序列号
		this.api_v3_cert = api_v3_cert || config.getConfig('api_v3_cert'); // 证书
		this.private_key = private_key || config.getConfig('private_key'); // 私钥
		this.public_key = public_key || config.getConfig('public_key'); // 公钥
		this.public_key_id = public_key_id || config.getConfig('public_key_id'); // 公钥ID
		console.log(this)
	}


	//#region 公开方法
	/**
	 * 获取V3签名
	 * @param {Object} params - 参数对象
	 * @param {string} params.url - 请求URL
	 * @param {string} params.method - 请求方法
	 * @returns {string} 签名
	 */
	getV3Sign(params) {
		const {
			url,
			method,
			body
		} = params;
		console.log(body)
		const nonce_str = Math.random().toString(36).slice(2, 17) //生成随机字符串
		const timestamp = Math.floor(Date.now() / 1000); // 时间戳， 注意服务器的时区
		const strSign = `${method.toUpperCase()}\n${url}\n${timestamp}\n${nonce_str}\n${method.toUpperCase()==='POST' ? JSON.stringify(body):''}\n`;
		console.log(strSign)
		const signature = crypto.createSign('RSA-SHA256').update(strSign).sign(this.private_key, "base64");
		console.log(url)
		return `WECHATPAY2-SHA256-RSA2048 mchid="${this.mch_id}",nonce_str="${nonce_str}",signature="${signature}",timestamp="${timestamp}",serial_no="${this.serial_no}"`;
	}
	/**
	 * 发送HTTP请求
	 * @param {string} _url - 请求地址
	 * @param {string} _method - 请求方法
	 * @param {Object} _params - 请求参数
	 * @param {string} _version - 请求版本 v3: 微信支付V3版本
	 * @returns {Promise<Object>} 响应结果
	 */
	async curl(_url, _method, _params, _version = 'v3') {

		const params = this.removeControlProperties({
			..._params
		});

		const headers = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
			'Content-Type': 'application/json',
			'Accept': 'application/json' // 接受所有类型的响应
		}

		if (_version === 'v3') {
			headers['Authorization'] = this.getV3Sign({
				url: _url,
				method: _method,
				body: params
			})
			headers['Wechatpay-Serial'] = this.public_key_id;
		}

		return new Promise((resolve, reject) => {
			const options = {
				method: _method,
				json: true,
				headers,
				cert: this.api_v3_cert,
			};

			const url = BASE_URL + _url;

			if (_method.toUpperCase() === 'GET') {
				// GET请求将参数添加到URL查询字符串
				const queryString = new URLSearchParams(params).toString();
				options.url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
			} else {
				// POST等其他方法将数据放在body中
				options.url = url;
				options.body = params;
			}

			console.log(options);
			request(options, (error, response, body) => {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
	}


	//#endregion

	//#region 内部方法

	/**
	 * 处理请求参数，移除空值属性
	 * @param {Object} obj - 原始参数对象
	 * @returns {Object} 处理后的参数对象
	 * @private
	 */
	removeControlProperties(obj) {
		const result = {};
		for (const key in obj) {
			// 过滤掉值为空字符串、null或undefined的属性
			if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
				result[key] = obj[key];
			}
		}
		return result;
	}
	//#endregion
}

module.exports = Base;