var express = require('express')
var router = express.Router()
var db = require('./server/db')

router.get("/", function (req, res) {
    const page = req.query.page
    const search = req.query.search
    let filter = []
    if (page != undefined){
        filter.push({$skip : (parseInt(page)-1)*10})
        filter.push({$limit : 10})
    }
    if (search != undefined) {
        filter.push({$match : {title : {$regex : search, $options : "i" }}})
    }

    db.article
      .aggregate(filter, (err, found) => {
        if (!err) {
          res.send(found);
        } else {
          console.log(err);
          res.send("error occured");
        }
      })
      .catch((err) => console.log("error occured, " + err));
    // res.send("hello world")
  });
router.post("/", function (req, res) {
    const test = new db.article({
      title: req.body.title,
      content: req.body.content,
      created_by: req.body.created_by,
      created_at: new Date(),
      // comment : []
    });
    test.save().then(
      (result) =>
        res.status(201).send({ message: "success added recors", data: result }),
      (err) => res.status(400).send("error insert")
    );
  });
  
  router.patch("/:id", function (req, res) {
    db.article.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content, updated_at : new Date(), updated_by : req.body.updated_by },
      function (err, result) {
        if (err) {
          res.status(400).send({ message: "Insert error" });
        } else {
          res.status(200).send({ message: "success update"});
        }
      }
    );
  });
  router.delete("/:id", function (req, res) {
      db.article.deleteOne(
        {_id :req.params.id}
        ,
        function (err, result) {
          if (err) {
            res.status(400).send({ message: "Insert error" });
          } else {
            res.status(200).send({ message: "success delete"});
          }
        }
      );
    });
  
  router.get("/:id", function (req, res) {
    db.article.findById(req.params.id, function (err, result) {
      if (err) {
        res.status(400).send("error insert");
      } else if (result) {
        res.status(200).send(result);
      } else {
          res.status(404).send('no result')
      }
    });
  });

  router.post('/:id/comment', async function(req,res) {
    const cm = new db.comment({
        body: req.body.body,
        created_by: req.body.created_by,
        created_at: new Date(),
        // comment : []
      });
      const data =await cm.save().then(
        (result) =>  result
        ,
        (err) => res.status(400).send("error insert")
      );
      db.article.findByIdAndUpdate({_id : req.params.id}, {$push : {comment : data}}, function(err, ress) {
        if (err) {
            res.status(400).send("error update");
          } else if (ress) {
            res.status(200).send("comment success");
          } else {
              res.status(404).send('no result')
          }
      })
      
  });
  router.delete("/:id/comment/:id_comment", function (req, res) {
    db.article.updateOne(
      {_id :req.params.id}
      ,{$pull : {comment : {_id : req.params.id_comment}}},
      function (err, result) {
        if (err) {
          res.status(400).send({ message: "Insert error" });
        } else {
          res.status(200).send({ message: "success delete"});
        }
      }
    );
  });
  router.patch("/:id/comment/:id_comment", function (req, res) {
    db.article.updateOne(
      {_id : req.params.id, "comment._id" : req.params.id_comment},
      { $set : {"comment.$.body": req.body.body, "comment.$.updated_at" : new Date(), "comment.$.updated_by" : req.body.updated_by} },
      function (err, result) {
        if (err) {
          res.status(400).send({ message: "Insert error" });
        } else {
          res.status(200).send({ message: "success update"});
        }
      }
    );
  });

  router.get("/:id/comment/", function (req, res) {
    db.article.findById(req.params.id, function (err, result) {
      if (err) {
        res.status(400).send("error insert");
      } else if (result) {
        res.status(200).send(result.comment);
      } else {
          res.status(404).send('no result')
      }
    });
  });

module.exports = router