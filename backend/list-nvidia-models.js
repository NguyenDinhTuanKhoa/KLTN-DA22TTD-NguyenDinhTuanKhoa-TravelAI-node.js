require('dotenv').config({ path: '.env' });
const OpenAI = require('openai');

const nvidiaClient = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

async function listModels() {
  console.log('📋 Fetching available models from NVIDIA API...\n');

  try {
    const models = await nvidiaClient.models.list();

    console.log('✅ Available models:\n');

    const modelList = [];
    for await (const model of models) {
      modelList.push(model);
    }

    // Filter for xiaomi, minimax, or chinese models
    const xiaomiModels = modelList.filter(m =>
      m.id.toLowerCase().includes('xiaomi') ||
      m.id.toLowerCase().includes('minimax') ||
      m.id.toLowerCase().includes('xai')
    );

    console.log('🔍 Xiaomi/Minimax/XAI related models:');
    if (xiaomiModels.length > 0) {
      xiaomiModels.forEach(m => {
        console.log(`  - ${m.id}`);
      });
    } else {
      console.log('  (none found)');
    }

    console.log('\n📊 All models (first 50):');
    modelList.slice(0, 50).forEach(m => {
      console.log(`  - ${m.id}`);
    });

    console.log(`\n📈 Total models: ${modelList.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

listModels();
