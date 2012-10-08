
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.stream = function(req, res){
    res.render('stream', {title: 'your webcam'});
};
