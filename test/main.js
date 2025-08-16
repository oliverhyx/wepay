const { runAllTests: runJsApiV3Tests } = require('./jsapi/v3.test');
const { runAllTests: runNativeV3Tests } = require('./native/v3.test');

/**
 * 测试入口函数
 * 可以通过传入参数来指定要运行的测试类型
 * @param {string} testType - 测试类型: 'jsapi', 'native', 'all'
 */
async function runTests(testType = 'all') {
  switch (testType) {
    case 'jsapi':
      await runJsApiV3Tests();
      break;
    case 'native':
      await runNativeV3Tests();
      break;
    case 'all':
    default:
      console.log('====================================');
      console.log('开始运行所有测试...');
      console.log('====================================');
      await runJsApiV3Tests();
      console.log('====================================');
      await runNativeV3Tests();
      console.log('====================================');
      console.log('所有测试运行完毕!');
      break;
  }
}

/**
 * 命令行参数处理
 */
function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return args[0];
  }
  return 'all';
}

// 运行测试
const testType = parseCommandLineArgs();
runTests(testType);
