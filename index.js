const cheerio = require('cheerio');
const request = require('request').defaults({ jar: true });

function getPageUrl(body) {
  const $ = cheerio.load(body);
  const pageLink = $('a[id^=\'Agt\']');
  const pageUrl = `${$(pageLink).attr('href')}`;
  return pageUrl;
}

function run(urlsQueue, callback) {
  const books = [];
  function fn(q) {
    if (q[0] === 'undefined') {
      callback(null, books);
      return;
    }
    request(q[0], (err, res, body) => {
      if (err) {
        callback(err);
      }
      const $ = cheerio.load(body);
      const nextPageUrl = getPageUrl(body);
      const remainingQueue = q.slice(1);
      console.log(books.length);

      $('.article').each(() => {
        books.push($(this).text());
      });


      if (nextPageUrl === 'undefined') {
        callback(null, books);
        return;
      }

      if (q.length === 1) {
        remainingQueue.push(`http://86.57.174.45/alis/EK/${nextPageUrl}`);
      }
      fn(remainingQueue);
    });
  }
  fn(urlsQueue);
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

function getAllBooksByYear(query, callback) {
  sendInitialQuery(query, (err, html) => {
    if (err) {
      callback(err);
    }
    const firstTenPageUrls = getFirstTenPageUrls(html);
    run(firstTenPageUrls, (error, books) => {
      if (error) {
        callback(error);
      }
      callback(null, books);
    });
  });
}

module.exports = {
  getAllBooksByYear,
  sendInitialQuery,
  getPageUrl,
  getFirstTenPageUrls,
  run,
};
