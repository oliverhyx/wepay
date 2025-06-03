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
        "openid" : "ovqdowRIfstpQK_kYShFS2MSS9XS"
      },
  });
  console.log(data);
}
main()