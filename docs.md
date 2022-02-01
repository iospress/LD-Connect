## Improvements

- As we do most of the work on the client site (JavaScript/Browser) we are downloading a lot of data - see if we could leave it on the server/query as needed
- Caching opportunities: we need to query a good amount of info before being able to show a graph for a given Journal - maybe that data could be built server side for a given Journal and then just read. Depending on the structure needed it could even be pushed toward the triple instance
- Replace the popup box asking to select journal/category

