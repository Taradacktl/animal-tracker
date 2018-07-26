const { AnimalTracker } = require('../trackers/model');

const testUtilSeedData = async (model, data) => {
    await model.remove({}) //remove all records
    const records = await Promise.all(data.map(item => model.create(item)))
    return records
}

module.exports = {
    testUtilSeedData
}
