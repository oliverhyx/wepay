const {
  JSApiV3
} = require('../lib/main')

const encryptData = {"id":"d82654b8-c708-5462-afa9-bdf0ed34ad2d","create_time":"2025-07-23T09:54:13+08:00","resource_type":"encrypt-resource","event_type":"TRANSACTION.SUCCESS","summary":"支付成功","resource":{"original_type":"transaction","algorithm":"AEAD_AES_256_GCM","ciphertext":"OqqEZ3yXEXot77MKog5uDRDUIrnZfC023riRjIjSmLM6+EkXfhQdba2uo4ncxpVFAgwSGcqBysj1WRQcCzpOjh3/h/u47OiOYwyXvj9HAD9iu9TMVXDgiQN3BSjmS3ef9bas5b//jQx74gFbrIPBcRSjzC14fxbGO2y1swVm8CYCzHOcCvPSx5Qe2MZHihWV4KjEvkW82vzJqKiPVWXaOs4mnqNfiXoA5YcqbHJ43wP0nLiY95T1KVar63y1tBNyYHjGRXcNniJZxi2wOaukE8K3fb9otn8Yqprzk7TlM2EVVO8pt2zDowxw2p9pYe4rCqTsxhNhkEUpmA0vYOXms4q3DeUM2ZNfGVrGJozR/6f2Zcp/E6aNwzkTWA7ivA1ggVRVcyBRAgHAZA1ocDS9RekoLbyQnAV3oAD/ovZaj7g1Ux9kOwINveuPXXRh3hGPw56ynsnYtO6a5cEcHopO/Mm7Uj56b0d3es0ZXBCxNcyUoq1L4+Lee5A7z0WJODbfyYoMMSTDx8cbTV/j2U0cx2c8SeH8Ip3XrJTudUjQINynEX/hz79mQllfops5s3Z0g7RScOo9+UmAiS949G0=","associated_data":"transaction","nonce":"8NWCKDdIBH1n"}}

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