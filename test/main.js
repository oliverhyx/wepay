const {
  JSApiV3
} = require('../lib/main')


async function main() {
  const jsApiV3 = new JSApiV3();
  const data = await jsApiV3.orderQuery({
      "description" : "Image形象店-深圳腾大-QQ公仔",
      "out_trade_no" : "1217752501201407033233368018",
      "notify_url" : "https://www.weixin.qq.com/wxpay/pay.php",
      "amount" : {
        "total" : 100,
        "currency" : "CNY"
      },
      "payer" : {
        "openid" : "oBP7_6jU45PW2Up6Gu0mx9yKp4ro"
      },
  });
  console.log(data);
  const sign = await jsApiV3.orderSign(`prepay_id=${data.prepay_id}`);
  console.log(sign);
}
main()