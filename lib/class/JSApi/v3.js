const Base = require('../Base');

class JSApiV3 extends Base {

	constructor() {
		super();
	}

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

}

module.exports = JSApiV3;