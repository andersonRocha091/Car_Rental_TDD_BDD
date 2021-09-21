const { readFile } = require("fs/promises");
class BaseRepository {
  constructor({ file }) {
    this.file = file;
  }
  async find(ItemId) {
    const content = JSON.parse(await readFile(this.file));
    if (!ItemId) return content;

    return content.find(({ id }) => id === ItemId);
  }
}

module.exports = BaseRepository;
