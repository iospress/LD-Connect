# LD-Connect
LD Connect is a Linked Data portal for IOS Press scientometrics, consisting of all IOS Press bibliographic data enriched by geographic information. This is a work funded by IOS Press in collaboration with the STKO lab at UC Santa Barbara. A SPARQL endpoint for retrieving information in LD Connect is published as `http://ld.iospress.nl:7200/`.

## Ontology
The ontology file can be found at  `data/ontology/ontology.ttl`. Two schema diagrams below show ontology fragments of `iospress:Publication` and `iospress:Contributor` respectively.
![Main classes, relations for `iospress:Publication`](data/ontology/schema/publication_onto.png)
![Main classes, relations for `iospress:Contributor`](data/ontology/schema/people_onto.png)

## Embeddings
A version of pre-trained embeddings are located in  `data/embeddings/`. Both document and knowledge graph embeddings are included. Document embeddings are provided in plain text formats along with its model format suitable for being used with gensim 3.3.0 library. More information about these embeddings can be found at `http://ld.iospress.nl/about/about-data/`.

## IOS Press scientometrics
IOS Press scientometrics can be accessed through `http://stko-roy.geog.ucsb.edu:7200/iospress_scientometrics/`. These scientometrics include Home (a choropleth map), Country Collaboration, Author Map, Author Similarity, Paper Similarity, Keyword Graph and Streamgraph. Please select a journal category first, and then a journal of interest for bibliographic analysis, visualization and embedding-based similarity search.