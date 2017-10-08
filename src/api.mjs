const url = 'https://esi.tech.ccp.is/latest'

const api = {
    url,
    searchIt: (type, query) => `${url}/search?categories=${type}&search=${query}`,
    character: {
        location: (charId) => `${url}/characters/${charId}/location`,
        ship: (charId) => `${url}/characters/${charId}/ship`,
    },
    market: {
        orders: (regionId, page = 1, type = 'all') => `${url}/markets/${regionId}/orders?order_type=${type}&page=${page}`,
    },
    route: (origin, destination) => `${url}/route/${origin}/${destination}`,
    location: {
        system: (systemId) => `${url}/universe/systems/${systemId}`,
        station: (stationId) => `${url}/stations/${stationId}`
    },
    region: {
        search: query => `${url}/search?categories=region&search=${query}`,
        info: regionId => `${url}/universe/regions/${regionId}/`
    },
    constellations: constellationId => `${url}/universe/constellations/${constellationId}/`,
}

export default api