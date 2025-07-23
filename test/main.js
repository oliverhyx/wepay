const {
  JSApiV3
} = require('../lib/main')

const encryptData = {"id":"ad3db7bd-6a70-5d3c-b88e-4769c0465477","create_time":"2025-07-23T14:35:17+08:00","resource_type":"encrypt-resource","event_type":"TRANSACTION.SUCCESS","summary":"支付成功","resource":{"original_type":"transaction","algorithm":"AEAD_AES_256_GCM","ciphertext":"9Jv4CHhSM9DxeDfncFKHKduEbi214uPCTN8F5yIXGzoVX5IfK+Nl2ZJ3rjm0ZTiTsnoDZKvdOPW7JLSkqaTVNApGLp6GkCPTGwrynDTEVWrG21/MCCh0sCthQNi4Sw7H1v4OgW6BtZrshFOvTO6L2C230xFonK/+iLbMLUW9DOUzuYBwKBAEZ+HQQ2GT5Zc2OthrFts+9NpOUDXM/xwvthy5iEoH2IBxD84r38MPQQ/U60xNBd5/iSP1meRmRPr5s9Jb7PZZpavDG7q/8vKPXfO3+zl45nRRZJFIuVTB6leqnVncbEoCSvvfKCViEX6xYHm6D0NlU/nWwCxlRmlCfEcrIKbOdjVKTazRG09qxz7dvm6tgrV5SvacCICSR2xzvsKseExk33/+1hPUnCCuaBkTR8lgjWBFPJW6OoEXte3d8kstxJWaqfCOdjJVxob5OQlt38+DSuvWHo3KHxOZgRhtzKtAIORPS4EH/HAvwOCel6dvFol3MkRdZyTGRi35cDh7j1dFF6EGgWR4gbQrmjXuHqQ1PfGkPRMSThU+sYPOZDuSPAkrUvaidU8Z8abTrm2Qu5EdOSLOGrIpVHQu","associated_data":"transaction","nonce":"pUdohsWGTw7G"}}
// {"mchid":"1670761559","appid":"wx8e27fb5064dd6f68","out_trade_no":"mi1tpz9ms91753235646059","transaction_id":"4200002737202507232719585747","trade_type":"JSAPI","trade_state":"SUCCESS","trade_state_desc":"支付成功","bank_type":"ICBC_DEBIT","attach":"","success_time":"2025-07-23T09:54:13+08:00","payer":{"openid":"oBP7_6jU45PW2Up6Gu0mx9yKp4ro"},"amount":{"total":400,"payer_total":400,"currency":"CNY","payer_currency":"CNY"}}
async function main() {
  const jsApiV3 = new JSApiV3();
  // const data = await jsApiV3.orderQuery({
  //     "description" : "Image形象店-深圳腾大-QQ公仔",
  //     "out_trade_no" : "1217752501201407033233368018",
  //     "notify_url" : "https://www.weixin.qq.com/wxpay/pay.php",
  //     "amount" : {
  //       "total" : 100,
  //       "currency" : "CNY"
  //     },
  //     "payer" : {
  //       "openid" : "oBP7_6jU45PW2Up6Gu0mx9yKp4ro"
  //     },
  // });
  // console.log(data);
  // const sign = await jsApiV3.orderSign(`prepay_id=${data.prepay_id}`);
  // console.log(sign);
  const data = jsApiV3.decrypt({
    nonce: encryptData.resource.nonce,
    ciphertext: encryptData.resource.ciphertext,
    associated_data: encryptData.resource.associated_data
  });
  console.log(data);
}
main()