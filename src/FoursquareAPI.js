// lat lon reference 
export const getByLoc = (latlon) =>
  fetch('https://api.foursquare.com/v2/venues/explore?'+
  'limit=1'+
  '&ll='+latlon+
  '&client_id=DOI5A0G3SC1TMJ2MF4MC0CSIEKTDMJ5Q5OUBGM55UIDPFCZ4'+
  '&client_secret=LCNNMBYFKQ1RTAM2W0KHUV4EJOVJ2RFWSLMM3VYSQZPPE1Q0'+
  '&v=20140806')
  .then(response => response.json());

//unique id reference
export const getById = (venueId) =>
  fetch('https://api.foursquare.com/v2/venues/'+venueId+
    '?limit=1'+
    '&client_id=DOI5A0G3SC1TMJ2MF4MC0CSIEKTDMJ5Q5OUBGM55UIDPFCZ4'+
    '&client_secret=LCNNMBYFKQ1RTAM2W0KHUV4EJOVJ2RFWSLMM3VYSQZPPE1Q0'+
    '&v=20140806')
.then(response => response.json());