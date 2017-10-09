# Redart

Working on a Service API to hit the [EVE ESI](https://esi.tech.ccp.is/latest/) to pull back all market orders, process them, and find profitable trade routes. Crunches through ~250mb of data. 

Still a work in progress. Currently just gathers and sorts all high sec market data from EVE. Still needs to find trade routes and probably a whole crap ton of optimization tweaks. 

Uses experimental .mjs files, [because Node](https://nodejs.org/api/esm.html).
