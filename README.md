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

## API

* ReadableStreamBooks - read all book by year in stream
* sendInitialQuery - make initial http query
* getPage - get page body
* getNumberedPageUrls - get ten page urls
* run - recursive runner


## Examples

You can do what you want with books, for example save in database.
Next example return all books 2015 year in stream.
```js
import Stream from 'stream';
import { sendInitialQuery, getPage, getNumberedPageUrls, run, ReadableStreamBooks } from './index';

const WritableStreamBooks = new Stream.Writable();
ReadableStreamBooks.pipe(WritableStreamBooks);

const books = [];

const initParams = {
  year: 2015,
  ip: '86.57.174.45',
};

sendInitialQuery(initParams, (err, res) => {
  if (err) {
    console.log(err);
    return;
  }
  const firstTenPageUrls = getNumberedPageUrls(res.page, initParams.ip);
  run(getPage, firstTenPageUrls, initParams.ip, res.jar);
});

WritableStreamBooks._write = (book, encoding, done) => {
  books.push(book);
  console.log(`STREAM: ${books.length}`);
  // ready to process the next chunk
  done();
};

```

## Built With

* [request](https://github.com/request/request) - Simplified HTTP client
* [cheerio](https://github.com/cheeriojs/cheerio) - Fast, flexible & lean implementation of core jQuery designed specifically for the server.

## Authors
* **Vadim Demyanchik** - [GitHub](https://github.com/DemyanchikVadim)

## License

[MIT License ](https://github.com/DemyanchikVadim/alis-request/blob/master/LICENSE) 
