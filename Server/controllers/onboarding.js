//mock data
const places = {
    place1:'oregon',
    place2:'yo mama',
    place3:'fun st',
    place4:'lol',
    place5:'hahhaa',
    place6:'kdfngjkfd'
}


//========================================
// Spend a weekend
//========================================


function setUserLocation(request) {
    return {
        location: request.location,
        geoX: request.x,
        geoY: request.y,
    };
}


exports.spendAWeekend = function (req, res, next) {
    let userInfo = setUserLocation(req);
    // make google places api call

    //lets just send back basic data
    res.status(200).json(places)
}

//========================================
// Tell us more
//========================================


exports.tellUsMore = function(req, res){

    res.status(200).json(places)
}