# LD-Connect
[LD Connect](http://ld.iospress.nl/) is a Linked Data portal for [IOS Press scientometrics](http://stko-roy.geog.ucsb.edu:7200/iospress_scientometrics), consisting of all IOS Press bibliographic data enriched by geographic information. This is a work funded by [IOS Press](https://www.iospress.com/) in collaboration with the [STKO lab](https://github.com/stko-lab) at [UC Santa Barbara](https://www.ucsb.edu/). A SPARQL endpoint for retrieving information in LD Connect is published as [`http://ld.iospress.nl:7200/`]([http://ld.iospress.nl:7200). In this documentation, we provide descriptions about shared ontology, embeddings, the scientometric system along with instructions on how to reuse it.

## Ontology
The ontology file can be found at  [`data/ontology/ontology.ttl`](data/ontology/ontology.ttl). Two schema diagrams below show ontology fragments of [`iospress:Publication`](http://ld.iospress.nl/rdf/ontology/Publication) and [`iospress:Contributor`](http://ld.iospress.nl/rdf/ontology/Contributor) respectively.

<div align=center>
<img src="data/ontology/schema/publication_onto.png" width='80%' height = '80%'>
</div>

<div align=center>
<img src="data/ontology/schema/people_onto.png" width='80%' height = '80%'>
</div>


Semantic search is available at [`http://ld.iospress.nl/explore/semantic-search/`](http://ld.iospress.nl/explore/semantic-search/). A sample SPARQL query is provided below, which is used to retrieve information about papers whose first author is from affiliations located in China.
```SPARQL
select ?title (group_concat(?keyword; separator=',')
       as ?keywords) ?year ?journal ?first_author_name ?org_name 
{
    ?paper iospress:publicationTitle ?title;
           iospress:publicationIncludesKeyword ?keyword;
           iospress:publicationDate ?date;
           iospress:articleInIssue/iospress:issueInVolume/
           iospress:volumeInJournal ?journal;
           iospress:publicationAuthorList ?author_list.
    ?author_list rdf:_0 ?first_author.
    ?first_author iospress:contributorFullName ?first_author_name;
                  iospress:contributorAffiliation ?org.
    ?org iospress:geocodingInput ?org_name ;
		 iospress:geocodingOutput/
		 iospress-geocode:country ?org_country.    
    bind(year(?date) as ?year)
    values ?org_country {"China"@en}
} group by ?title ?year ?journal ?first_author_name ?org_name
```

## Embeddings
A version of pre-trained embeddings are located in  [`data/embeddings/`](data/embeddings/). Right now we have provided document embeddings in plain text format (see [`data/embeddings/IOS-Doc2Vec/model-txt/`](data/embeddings/IOS-Doc2Vec/model-txt/)). The [`doc2vec.txt`](data/embeddings/IOS-Doc2Vec/model-txt/doc2vec.txt) is the Doc2Vec model. The [`doc2vec_voc.txt`](data/embeddings/IOS-Doc2Vec/model-txt/doc2vec_voc.txt) contains a list of all the paper entity URLs of the document embedding model. The [`w2v.txt`](data/embeddings/IOS-Doc2Vec/model-txt/w2v.txt) is the corresponding Word2Vec model that has a vocabulary size of 105839. The [`w2v_voc.txt`](data/embeddings/IOS-Doc2Vec/model-txt/w2v_voc.txt) contains a list of the word vocabulary of the word embedding model. The dimension of both document and word embeddings is 200. 

After we upgraded the storage for this repository, we will continue uploading knowledge graph embeddings containing contributor information in plain text format and a JSON file about how same entities (e.g., contributors, affiliations, etc.) are linked after co-reference resolution. More information about these embeddings can be found at [`http://ld.iospress.nl/about/about-data`](http://ld.iospress.nl/about/about-data), which is also the download site in LD Connect.

## IOS Press scientometrics

### Getting started
IOS Press scientometrics can be downloaded from the [`scientometrics`](scientometrics/) folder, migrated to other academic knowledge graphs and reused for relevant applications and research. Follow the instructions below to set it up and run locally.

1. After cloning this repository, type the following commands in the terminal.
	```console
	$ cd scientometrics/
	$ npm install
	```
2. Create a folder `data/` within [`scientometrics/sites/`](`scientometrics/sites/`) with two subfolders called `IOS-Doc2Vec-TXT/` and `IOS-TransE/` respectively. Copy the pre-trained Doc2Vec model files to the `scientometrics/sites/data/IOS-Doc2Vec-TXT/` directory, and the pre-trained TransE model files to the `scientometrics/sites/data/IOS-TransE/` directory.
3. Launch the server on an open port:
	```console
	$ node src/server/server.js
	```
	You can modify the port by changing `N_PORT` in server.js. The default is set to be 7200.

4. Now, open a browser and navigate to `http://localhost:N_PORT/iospress_scientometrics`.


### Descriptions
IOS Press scientometrics can be accessed through [`http://stko-roy.geog.ucsb.edu:7200/iospress_scientometrics`](http://stko-roy.geog.ucsb.edu:7200/iospress_scientometrics) (*note that the HTTP header should be used instead of HTTPS). These scientometrics include Home (a choropleth map), Country Collaboration, Author Map, Author Similarity, Paper Similarity, Keyword Graph and Streamgraph. Please select a journal category first and then a journal of interest for bibliographic analysis, visualization and embedding-based similarity search. An example about how information is displayed for the Semantic Web journal are attached below.

<div align=center>
<img src="visualization/home.png" width='80%' height = '80%'>
</div>

<div align=center>
<img src="visualization/country_collab.png" width='80%' height = '80%'>
</div>

<div align=center>
<img src="visualization/author_map.png" width='80%' height = '80%'>
</div>

<div align=center>
<img src="visualization/author_sim.png" width='80%' height = '80%'>
</div>

<div align=center>
<img src="visualization/paper_sim.png" width='80%' height = '80%'>
</div>

<div align=center>
<img src="visualization/keyword_graph.png" width='80%' height = '80%'>
</div>

<div align=center>
<img src="visualization/streamgraph.png" width='80%' height = '80%'>
</div>