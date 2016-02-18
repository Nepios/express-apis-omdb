var express = require("express");
var router = express.Router();
var db = require('../models');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));

router.get("/", function(req, res){
	db.favorite.findAll().then(function(fave){
		res.render('favorite.ejs', {
			fave:fave});
		});
	});


router.post('/', function(req,res) {
	var title = req.body.title;
	var year = req.body.year;
	var imdbID = req.body.imdbID;
	db.favorite.create({
		title: title,
		year: year,
		imdbId: imdbID
	}).then(function(favorite){
		res.redirect('/results/'+ imdbID);
	})
});

router.get('/:id/comments', function(req, res){
	var id = req.params.id;
	db.favorite.find({
		where: {id: id},
		include: [db.comment]
	}).then(function(fav){
		res.render('comments.ejs', {favorite: fav, id:id})
		});
});


router.post('/:id/comments', function(req, res){
	var id = req.params.id;
	var comment = req.body.comment;
	var name = req.body.name;
	db.comment.create({
		comment: comment,
		name: name,
		favoriteId: id
	}).then(function(favorite){
		res.redirect('/favorites/' + req.params.id + '/comments');
	})
});

router.get('/:id/tags', function(req, res){
    db.favorite.find({
        where: {id: req.params.id},
        include: [db.tag]
    }).then(function(fav){
        res.render('tags.ejs', {favorite: fav});
    });
});

router.post('/:id/tags', function(req, res){
 	db.tag.findOrCreate({where: {tag:req.body.tag}}).spread(function(tag, created){
    	db.favorite.findById(req.params.id).then(function(favorite){
        favorite.addTag(tag).then(function(){
            res.redirect('/favorites/tags');
        });
    });
    });
});

router.get('/tags', function(req, res){
    db.tag.findAll().then(function(tags){
        res.render('tagsall', {tags: tags});ßß
    });
});

router.get('/tags/:id', function(req, res){
    db.tag.findById(req.params.id).then(function(tag){
        tag.getFavorites().then(function(favorites){
        res.render('tagsfilter', {tag: tag, favorites:favorites});
    });
    });
});



module.exports = router;