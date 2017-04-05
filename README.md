# alis-request
Scraper api to get book by years on alis library

## Installing

npm
```
npm install --save-dev alis-request
```

yarn 
```
yarn add alis-request
```

### API

* getAllBooksByYear - get all book by year
* sendInitialQuery - make initial http query
* getPageUrl - get page url
* getFirstTenPageUrls - get ten page urls
* run - recursive runner


### Examples

You can do what you want with books, for example save in database.
Next example return all books 2016 year.
```
const AlisRequest = require('alis-request');

AlisRequest.getAllBooksByYear({ year: 2016 }, (err, books) => {
  console.log(books.length);
});

```

## Built With

* [request](https://github.com/request/request) - Simplified HTTP client
* [cheerio](https://github.com/cheeriojs/cheerio) - Fast, flexible & lean implementation of core jQuery designed specifically for the server.

## Authors
* **Vadim Demyanchik** - [GitHub](https://github.com/DemyanchikVadim)

## License

[MIT License ](https://github.com/DemyanchikVadim/alis-request/blob/master/LICENSE) 
