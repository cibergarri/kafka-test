const avro = require('avsc');

const Message = avro.Type.forSchema({
  type: 'record',
  fields: [{
    name: 'importance',
    type: {
      type: 'enum',
      symbols: ['HIGH', 'LOW']
    }},{
    name: 'text',
    type: 'string',
  }],
});

module.exports = {
  Message
};
