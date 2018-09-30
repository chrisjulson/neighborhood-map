class DBHelper {
    static getDatabaseURL() {
        let port = 3000; // default npm port number. Change this number for the dev server
        if(process.env.NODE_ENV === 'production')
            port = 5000; // default npm port number.  Change this port number for the production server
        return `http://localhost:${port}/places.json`;
    }

    /* Fetch all */ 
    static fetchPlaces() {
        return fetch(this.getDatabaseURL())
            .then(response => response.json());
    }
}
export default DBHelper;