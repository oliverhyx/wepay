const Base = require('../Base');
const crypto = require("crypto"); // 加密库，用于生成签名

class JSApiV3 extends Base {

	constructor() {
		super();
	}

	/**
	 * JSAPI/小程序下单 - 生成预支付交易会话标识
	 * 
	 * 适用于微信内置浏览器网页支付或小程序支付场景，用于获取预支付交易会话标识(prepay_id)
	 * 更新时间：2025.03.31
	 * 
	 * 请求地址：POST /v3/pay/transactions/jsapi
	 * 主域名：https://api.mch.weixin.qq.com（就近接入点）
	 * 备域名：https://api2.mch.weixin.qq.com（异地接入点）
	 * 
	 * @param {Object} params - 下单参数
	 * @param {string} params.description - 商品描述，用户微信账单可见，不超过127字符
	 * @param {string} params.out_trade_no - 商户订单号，6-32字符，只能是数字、大小写字母_-|*，同一商户号下唯一
	 * @param {string} params.notify_url - 支付结果通知地址，必填，最大长度255
	 * @param {Object} params.amount - 订单金额信息，必填
	 * @param {number} params.amount.total - 订单金额，单位为分，整型，必填
	 * @param {string} [params.amount.currency='CNY'] - 货币类型，符合ISO 4217标准的三位字母代码，默认人民币：CNY
	 * @param {Object} params.payer - 支付者信息，必填
	 * @param {string} params.payer.openid - 用户在商户appid下的唯一标识，必填，最大长度128
	 * @param {string} [params.time_expire] - 支付超时时间，格式：yyyy-MM-DDTHH:mm:ss+TIMEZONE，如：2015-05-20T13:29:35+08:00
	 * @param {string} [params.attach] - 附加数据，在查询API和支付通知中原样返回，最大长度128字符
	 * @param {string} [params.goods_tag] - 订单优惠标记，用于代金券或立减优惠功能，最大长度32
	 * @param {boolean} [params.support_fapiao=false] - 电子发票入口开放标识，true表示开启
	 * @param {Object} [params.detail] - 优惠功能详情
	 * @param {number} [params.detail.cost_price] - 订单原价，单位为分，用于记录整张小票的交易金额
	 * @param {string} [params.detail.invoice_id] - 商品小票ID，最大长度32
	 * @param {Array<Object>} [params.detail.goods_detail] - 单品列表，条目个数限制：[1，6000]
	 * @param {string} params.detail.goods_detail[].merchant_goods_id - 商户侧商品编码，由商户自定义
	 * @param {string} [params.detail.goods_detail[].wechatpay_goods_id] - 微信支付商品编码，微信支付定义的统一商品编码
	 * @param {string} params.detail.goods_detail[].goods_name - 商品名称，商品的实际名称
	 * @param {number} params.detail.goods_detail[].quantity - 商品数量，用户购买的数量
	 * @param {number} params.detail.goods_detail[].unit_price - 商品单价，单位为分
	 * @param {Object} [params.scene_info] - 场景信息
	 * @param {string} params.scene_info.payer_client_ip - 用户终端IP，支持IPv4和IPv6，必填
	 * @param {string} [params.scene_info.device_id] - 商户端设备号（门店号或收银设备ID），最大长度32
	 * @param {Object} [params.scene_info.store_info] - 商户门店信息
	 * @param {string} params.scene_info.store_info.id - 门店编号，由商户自定义
	 * @param {string} params.scene_info.store_info.name - 门店名称，由商户自定义
	 * @param {string} [params.scene_info.store_info.area_code] - 地区编码，详见省市区编号对照表
	 * @param {string} params.scene_info.store_info.address - 详细地址
	 * @param {Object} [params.settle_info] - 结算信息
	 * @param {boolean} [params.settle_info.profit_sharing=false] - 分账标识，true表示支付完成后可以分账，false表示不分账
	 * 
	 * @returns {Promise<Object>} 预支付交易会话信息
	 * @returns {string} returns.prepay_id - 预支付交易会话标识，有效期为2小时
	 */
	async orderQuery(params) {
		const url = '/v3/pay/transactions/jsapi';
		const method = 'POST';
		const data = await this.curl(url, method, {
			...params,
			mchid: this.mch_id,
			appid: this.appid,
		});
		return data;
	}

	/**
	 * 生成微信支付JSAPI的支付签名
	 * 
	 * @param {string} _package - 预支付交易会话标识（如：prepay_id=xxx）
	 * @returns {Object} 签名对象，包含paySign、package、timeStamp、nonceStr、appId
	 */
	async orderSign(_package) {
		// 生成随机字符串，长度15位，用于签名中的nonceStr
		const nonceStr = Math.random().toString(36).slice(2, 17);
		// 获取当前时间戳（秒），用于签名中的timeStamp
		const timeStamp = Math.floor(Date.now() / 1000);
		// 构造签名字符串，格式为：appId\n时间戳\n随机串\npackage\n
		const data = `${this.appid}\n${timeStamp}\n${nonceStr}\n${_package}\n`;
		// 使用RSA-SHA256算法和商户私钥对数据进行签名，生成paySign
		const paySign = crypto.createSign('RSA-SHA256').update(data).sign(this.private_key, "base64");
		// 返回签名相关参数，供前端调起微信支付
		return {
			paySign,           // 支付签名
			package: _package, // 预支付交易会话标识
			timeStamp,         // 时间戳
			nonceStr,          // 随机字符串
			appId: this.appid, // 应用ID
		};
	}



}

module.exports = JSApiV3;