let response = {
    status: 200,
    success:true,
    data: [],
    message: null
};
const sendError = (err, res) => {
    response.status = 501;
    response.success = false;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};
const errorHandle = (err, req, res, next)=> {
    sendError(err,res);
}
const logErrors = (err, req, res, next) => {
    console.error('From Elog : ' + err.stack);
    next(err);
}
module.exports = { errorHandle, logErrors};