module.exports = function seedData(databaseUrl, modelPath, seedData, modelName) {

    console.log(`seeding db test data for ${modelName}...`);
    if (true || (process.env.NODE_ENV != 'production')) {
  
      const seeder = require('mongoose-seed');
     
  
      let resolved
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!resolved) {
            reject(new Error('SEED_ERROR_OR_TIMEOUT'))
          }
        }, 10000)
  
        // Connect to MongoDB via Mongoose
        seeder.connect(databaseUrl, function () {
  
          // Load Mongoose models
          seeder.loadModels([
           modelPath,            
          ]);
  
          // Clear specified collections
          seeder.clearModels([modelName], function () {
  
            // Callback to populate DB once collections have been cleared
            seeder.populateModels(seedData, function () {
              //seeder.disconnect();
              resolved = true
              resolve(true)
            });
  
          });
        });
      })
    }
  }
