//#region 导入依赖
const request = require("request"); // HTTP请求库
const crypto = require("crypto"); // 加密库，用于生成签名
const config = require('../config'); // 配置文件
const path = require('path') // 路径处理
const fs = require('fs') // 文件系统操作
const xml2js = require('xml2js') // 将XML转换为JSON
//#endregion

/**
 * 微信支付API基础类
 */
class Base {

	constructor() {
		this.corpid = config.getConfig('corpid'); // 企业ID
		this.corpsecret = config.getConfig('agent_secret'); // 应用密钥
		this.cache_mode = config.getConfig('cache_mode') || 'file'; // 缓存模式，默认为文件缓存
		if (this.cache_mode === 'file') {
			const path = require('path');
			// 设置token存储路径
			this.tokenDir = path.resolve(process.cwd(), '.neuit');
			this.tokenFile = path.join(this.tokenDir, `${this.corpsecret}_access_token.json`);
		}
	}



	//#region 公开方法

	/**
	 * 发送HTTP请求
	 * @param {string} _url - 请求地址
	 * @param {string} _method - 请求方法
	 * @param {Object} _params - 请求参数
	 * @param {string} _token_type - 请求类型 agent: 应用级, concat: 通讯录级 crop: 企业级
	 * @returns {Promise<Object>} 响应结果
	 */
	async curl(_url, _method, _params, _token_type = 'agent') {

		if (_url !== 'https://qyapi.weixin.qq.com/cgi-bin/gettoken') {
			// 设置请求类型
			this.setSecret(_token_type);
		}

		const data = {
			..._params
		};
		const access_token = await this.getAccessToken(_url); // 获取访问令牌
		const params = this.removeControlProperties(data); // 清理请求参数
		return new Promise((resolve, reject) => {
			const options = {
				url: _url,
				method: _method,
				json: true,
				headers: {
					'Content-Type': 'application/json',
					'Accept': '*/*' // 接受所有类型的响应
				}
			};

			const url = _url + '?access_token=' + access_token + '&debug=1';

			if (_method.toUpperCase() === 'GET') {
				// GET请求将参数添加到URL查询字符串
				const queryString = new URLSearchParams(params).toString();
				options.url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
			} else {
				// POST等其他方法将数据放在body中
				options.url = url;
				options.body = params;
			}

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