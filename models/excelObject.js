var method = excelObj.prototype;

function excelObj(pi, createdAt, date, time) {
    this._pi = pi;
    this._createdAt = createdAt;
    this._date = date;
    this._time = time;
}

method.getthetime = function() {
    return this._time;
};

module.exports = excelObj;
//this._indoorTemp = indoorTemp;