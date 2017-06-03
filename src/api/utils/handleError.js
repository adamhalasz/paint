module.exports = function handleError(req, res){
    return function(err){
        var data = {};
        data.ok = false;
        data.error = err.message || err;
        res.json()
    }
}