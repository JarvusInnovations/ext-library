/**
 * Provides for encoding/decoding of encoded polylines
 *
 * See https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
Ext.define('Jarvus.util.Polyline', {
    singleton: true,
    
    decode: function (encoded) {
        var len = encoded.length,
            index = 0,
            latlngs = [],
            lat = 0,
            lng = 0,
            b, shift, result;
            
        while (index < len) {
        
            shift = 0;
            result = 0;
            
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            
            lat += ((result & 1) ? ~(result >> 1) : (result >> 1));


            shift = 0;
            result = 0;
            
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            
            lng += ((result & 1) ? ~(result >> 1) : (result >> 1));


            latlngs.push([lat * 1e-5, lng * 1e-5]);
        }

        return latlngs;
    }
});
