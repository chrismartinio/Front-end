
let me = {lat: 3452.33, long:4112, Zip: 88371, Id: 87383, Age:25, gender:'M', LookingFor:'F'}
let allRegionalMatches = [{long:84375, lat:4895.43, ZipCode:7763, Id:8871, Age:25, gender:'M',LookingFor:'F'},{long:8437.5, lat:489.5, ZipCode:7763, Id:8871, Age:25, gender:'M',LookingFor:'F'},{long:84375, lat:4895, ZipCode:7763, Id:8871,Age:25, gender:'M',LookingFor:'F'}, {lat: 3452.33, long:4112, Zip: 88371, Id: 87383, Age:25, gender:'F', LookingFor:'M'}]

// target zip code too shallow of initial query:
  // Larger cover area: ie Greater La Area:[91741, 91740, etc]
  // greater bay area: [94102, idk]


const gatherRegionalMatches = (allMatches, targetZip) => {
  //zip code weird dynamics: findd more solid cover
    // Data driven: need a private api that we can change from the server side.
    //
  let regionalMatches = []
  for(let i = 0; i <= allMatches.length - 1; i++){
    if(allMatches[i].Zip === targetZip){
      regionalMatches.push(allMatches[i])
    }
  }
  //send regionalMatches to gatherPersonalMatches function
  return regionalMatches
}


//Gather All Selected Matches Algorithim
  // naive process is to use an array to iterate through. Really Bad time efficiency for scaling though
  // smart process would be to use a Graph Structure to iterate due to faster traversal times
///////////////////////////////FINISHED READY TO REVIEW//////////////////////////
const gatherPersonalMatches = (comparator, allRegionalMatches, maxDistance) => {
  let selectedMatches = [];
  // really bad efficiency problem here: better to use a graph rather than array
  for(let i = 0; i <= allRegionalMatches.length - 1; i++){
    let destructureDistObj = {lat1:comparator.lat, lat2:allRegionalMatches[i].lat, lon1: comparator.long, lon2: allRegionalMatches[i].long, maxDistance:maxDistance}
    let destructurePrefObj = {comparatorGender: comparator.gender, matchGender: allRegionalMatches[i].gender, comparatorPref: comparator.LookingFor, matchPref:allRegionalMatches[i].LookingFor}
    if(isWithinDistance(destructureDistObj) && satisfyBasicReq(destructurePrefObj)){
      selectedMatches.push(allRegionalMatches[i].Id)
    }
  }
  //after which we would run populate media function
  return selectedMatches;
}


///////////////////////////////FINISHED READY TO REVIEW///////////////////////////////////////////
//GeoLocation isWithinDistance Testing Algorithim

//[{long:84375, lat:4895, ZipCode:?, Id},{...},{...}]
const isWithinDistance = ({lat1, lat2, lon1, lon2, maxDistance}) => {

  const degreeToRad = (n) => {
    return n * (Math.PI/180)
  }

  let R = 6371e3; // metres
  let φ1 = degreeToRad(lat1)
  let φ2 = degreeToRad(lat2)
  let Δφ = degreeToRad(lat2-lat1);
  let Δλ = degreeToRad(lon2-lon1);

  let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  let d = R * c;


  if(d > maxDistance){
    return false
  } else if(d <= maxDistance) {
    //signals okay to send to matches page
    return true
  }
}
//had to add a negative sign to lat2 for any actual work. Maybe has to do with with E/W, S/N
//accuracy still off by at least 10 miles. Could have to do with innaccuracy of civilian satelites
// or it could be my code(?)

//Testing between my area and Yosemite.

///////////////////////////////////////////FINISHED READY TO REVIEW//////////////////////////////////////


const satisfyBasicReq = ({comparatorGender, matchGender, comparatorPref, matchPref}) => {
  //best case scenario would be if they both liked each other
  if(comparatorPref === matchGender && matchPref === comparatorGender){
    return true
  } else {
    return false
  }
}


/////////////////////////// NOT DONE YET ////////////////////////

const populateSelectedMatchesMedia = (arrayOfId) => {
  //need to transform the array of Ids into object with arrays;
  // will be doing all database calls here to populate selected users.
  // firebase calls to get the initmate data.
}

console.log(gatherPersonalMatches(me, allRegionalMatches,100))
