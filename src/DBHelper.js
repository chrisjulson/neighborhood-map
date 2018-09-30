class DBHelper {
    static getDatabaseURL() {
        let port = 3000; // change this for development
        if(process.env.NODE_ENV === 'production')
            port = 5000;    // change this for production
        return `http://localhost:${port}/places.json`;
    }
  
    /**
     * Fetch all places.
     */
    static fetchPlaces() {
        return fetch(this.getDatabaseURL())
            .then(response => response.json());
    }
}
  
export default DBHelper;