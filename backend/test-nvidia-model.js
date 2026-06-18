require('dotenv').config({ path: '.env' });
const OpenAI = require('openai');

const nvidiaClient = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
  timeout: 60 * 1000,
});

async function testModel(modelName) {
  console.log(`\n🧪 Testing model: ${modelName}`);
  console.log('─'.repeat(60));

  try {
    const startTime = Date.now();
    const response = await nvidiaClient.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'user', content: 'Xin chào! Hãy giới thiệu ngắn gọn về bạn.' }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const duration = Date.now() - startTime;
    const content = response.choices[0]?.message?.content || 'No response';

    console.log('✅ SUCCESS');
    console.log(`⏱️  Response time: ${duration}ms`);
    console.log(`📝 Response:\n${content}`);
    console.log('─'.repeat(60));
    return true;
  } catch (error) {
    console.log('❌ FAILED');
    console.log(`Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Details: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    console.log('─'.repeat(60));
    return false;
  }
}

async function main() {
  console.log('🚀 NVIDIA Model Availability Test');
  console.log('═'.repeat(60));

  const modelsToTest = [
    'stepfun-ai/step-3.7-flash',
    'stepfun/step-3.7-flash',
    'mistralai/mistral-small-4-119b-2603', // current model
  ];

  const results = {};

  for (const model of modelsToTest) {
    results[model] = await testModel(model);
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s between tests
  }

  console.log('\n📊 SUMMARY');
  console.log('═'.repeat(60));
  for (const [model, success] of Object.entries(results)) {
    console.log(`${success ? '✅' : '❌'} ${model}`);
  }
}

main().catch(console.error);
