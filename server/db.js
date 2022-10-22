const mongoose = require("mongoose");
const autoInc = require("mongoose-sequence")(mongoose);
require('dotenv').config()


const commentSchema = new mongoose.Schema({
  body: String,
  created_by: String,
  created_at: Date,
  updated_at : Date,
  updated_by : String,
});
const articleSchema = new mongoose.Schema({
    _id : Number,
    title: String,
  content: String,
  created_by: String,
  created_at: Date,
  updated_at : Date,
  updated_by : String,
  comment: [commentSchema],
},{ _id: false });
articleSchema.plugin(autoInc);
// commentSchema.plugin(autoInc);
// var CounterSchema = new mongoose.Schema({
//     _id: {type: String, required: true},
//     seq: { type: Number, default: 0 }
// });
// var Counter = mongoose.model('counter', CounterSchema)
const Article = mongoose.model("Article", articleSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
  connectToServer: function (callback) {
    mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (err, db) {
        if (err || !db) {
          return callback(err);
        }
        console.log("success connect to db");
        return callback();
      }
    );
  },
  article: Article,
  comment: Comment,
};
