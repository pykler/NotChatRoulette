
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.stream = function(req, res){
    res.render('stream', {title: 'your webcam'});
};

exports.st = function(req, res){
    res.render('socket_test');
};
