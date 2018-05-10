/*const uuid = require('uuid');


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const AnimalTracker = {
  create: function(date, timeOfDay, species, activity, location) {
    console.log('Creating new post');

    const item = {
      date: date,
      id: uuid.v4(),
      timeOfDay: timeOfDay,
      species: species,
      activity: activity,
      location: location,
    };
    this.items[item.id] = item;
    return item;
  },
  get: function() {
    console.log('Retrieving post');
    return Object.keys(this.items).map(key => this.items[key]);
  },
  delete: function(id) {
    console.log(`Deleting post \`${id}\``);
    delete this.items[id];
  },
  update: function(updatedItem) {
    console.log(`Deleting post \`${updatedItem.id}\``);
    const {id} = updatedItem;
    if (!(id in this.items)) {
      throw StorageException(
        `Can't update post \`${id}\` because doesn't exist.`)
    }
    this.items[updatedItem.id] = updatedItem;
    return updatedItem;
  }
};

function createShoppingList() {
  const storage = Object.create(ShoppingList);
  storage.items = {};
  return storage;
}
module.exports = {
    ShoppingList: createShoppingList(),
  }*/