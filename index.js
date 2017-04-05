const cheerio = require('cheerio');
const request = require('request').defaults({ jar: true });

function getAllBooks(urls) {
  const promise = new Promise((resolve, reject) => {
    const books = [];
    function getNextUrl(q) {
      if (q[0] === 'undefined') {
        resolve(books);
        return;
      }
      console.log(q);
      request(q[0], (err, res, body) => {
        if (!err) {
          const $ = cheerio.load(body);
          const nextPageLink = $('a[id^=\'Agt\']');
          const nextPageUrl = `${$(nextPageLink).attr('href')}`;
          const remainingQueue = q.slice(1);

          $('.article').each(() => {
            books.push($(this).text());
          });

          console.log(books.length);

          if (nextPageUrl === 'undefined') {
            console.log('end of QUEUE');
            resolve(books);
            return;
          }

          if (q.length === 1) {
            remainingQueue.push(`http://86.57.174.45/alis/EK/${nextPageUrl}`);
          }
          getNextUrl(remainingQueue);
        }
      });
    }
    getNextUrl(urls);
  });
  return promise;
}

function getFirstTenPageUrls(html) {
  const $ = cheerio.load(html);
  const firstTenPageLinks = $('a[href^=\'do_other\']');
  const firstTenPageUrls = $(firstTenPageLinks).map((i, link) => `http://86.57.174.45/alis/EK/${$(link).attr('href')}`).toArray();
  return firstTenPageUrls;
}

function sendInitialQuery(query, callback) {
  const url = `http://86.57.174.45/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
  request(url, (err, response, html) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, html);
  });
}

function getAllBooksByYear(query) {
  const promise = new Promise((resolve, reject) => {
    sendInitialQuery(query, (err, html) => {
      const firstTenPageUrls = getFirstTenPageUrls(html);
      getAllBooks(firstTenPageUrls).then((allBooks) => {
        console.log(`Scrape alis over ${allBooks.length}`);
      });
    });
  });
  return promise;
}

export default getAllBooksByYear;

