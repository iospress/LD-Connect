# LD-Connect
LD Connect is a Linked Data portal for IOS Press scientometrics, consisting of all IOS Press bibliographic data enriched by geographic information. This is a work funded by IOS Press in collaboration with the STKO lab at UC Santa Barbara. A SPARQL endpoint for retrieving information in LD Connect is published as `http://ld.iospress.nl:7200/`.

## Ontology
The ontology file can be found at  `data/ontology/ontology.ttl`. Two schema diagrams below show ontology fragments of `iospress:Publication` and `iospress:Contributor` respectively.

<center class = 'half'>
<img src="data/ontology/schema/publication_onto.png" width='50%' height = '50%'><img src="data/ontology/schema/people_onto.png" width='50%' height = '50%'>
</center>

A sample SPARQL query is provided below, which is used to retrieve information about papers whose first author is from affiliations located in China.
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
A version of pre-trained embeddings are located in  `data/embeddings/`. Both document and knowledge graph embeddings are included. Document embeddings are provided in plain text formats along with its model format suitable for being used with gensim 3.3.0 library. More information about these embeddings can be found at `http://ld.iospress.nl/about/about-data/`.

## IOS Press scientometrics
IOS Press scientometrics can be accessed through `http://stko-roy.geog.ucsb.edu:7200/iospress_scientometrics/`. These scientometrics include Home (a choropleth map), Country Collaboration, Author Map, Author Similarity, Paper Similarity, Keyword Graph and Streamgraph. Please select a journal category first, and then a journal of interest for bibliographic analysis, visualization and embedding-based similarity search.