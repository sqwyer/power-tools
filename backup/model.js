let store = {};

const mongoose = require('mongoose');
const fs = require('fs');

function getStore() {
    return JSON.parse(fs.readFileSync(__dirname + '/store.json'));
}

function writeStore(j) {
    fs.writeFileSync(__dirname + '/store.json', JSON.stringify(j));
}

function model(schema, label) {
	return class {
  	constructor(props) {
      this.schema = schema;
      this.label = label;
      if(!store[label]) store[label] = [];
      this.doc = {_id: new mongoose.Types.ObjectId(),__v:-1};
      for(let k in schema) {
        if(typeof schema[k] == 'object' && schema[k].required === true && !props[k]) throw new Error("Missing field " + k);
        if(!props[k] && typeof schema != 'object') throw new Error("Missing field " + k);
        else if(!props[k] && typeof schema == 'object' && schema[k].default != undefined) this.doc[k] = schema[k].default;
        else this.doc[k] = props[k];
      }
    }
    save(next) {
        let store = getStore();
        this.doc.__v++;
    	store[this.label].push(this.doc);
        writeStore(store);
	  	if(next && typeof next == 'function') next(null);
    }
    static findOne(query) {
      return {
        exec: next => {
            let store = getStore();
        	let find = store[label].find(self => {
                for(let k in query) {
                if(self[k] != query[k]) {
                    return false;
                }
                }
                return true;
            });
            if(find) find.save = function () {
                store = getStore();
                let rep = this;
                delete rep.save;
                rep.__v++;
                store[label][store[label].indexOf(find)] = rep;
                writeStore(store);
            }
            if(next && typeof next == 'function') next(null, find);
        }
      }
    }
    static findById(query) {
        return {
            exec: next => {
                let store = getStore();
                let find = store[label].find(self => {
                    console.log(new mongoose.Types.ObjectId(self._id), new mongoose.Types.ObjectId(query))
                    return (new mongoose.Types.ObjectId(self._id).toString() == new mongoose.Types.ObjectId(query).toString());
                });
                // console.log(find, new mongoose.Types.ObjectId(query));
                if(find) find.save = function () {
                    let rep = this;
                    delete rep.save;
                    rep.__v++;
                    store[label][store[label].indexOf(find)] = rep;
                    writeStore(store);
                }
                if(next && typeof next == 'function') next(null, find);
            } 
        }
    }
  }
}
/* user.save(err => {
  if(err) console.error(err);
  else {
    UserModel.findOne({name: "John"}).exec((err2, user) => {
      if(err2) console.error(err);
      else if (!user) console.log('no.');
      else {
        user.e = 2;
        user.save();
        console.log(store);
      }
    })
  }
}) */
// user.save(err => {
// 	if(err) console.error(err);
// });
// UserModel.findById(1).exec((err, user) => {
// 	console.log(user);
// })

module.exports = { model };