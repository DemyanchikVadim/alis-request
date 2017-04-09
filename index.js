import cheerio from 'cheerio';
import request from 'request';
import Stream from 'stream';

export const ReadableStreamBooks = new Stream.Readable();
ReadableStreamBooks._read = () => {};

export function sendInitialQuery(query, callback) {
  if (!query.year) {
    return process.nextTick(callback, new Error('query.year is not provided'));
  }
  const j = request.jar();
  const INITIAL_URL = `http://${query.ip}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
  request({ url: INITIAL_URL, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, { page: body, jar: j });
  });
}

export function getPage(url, jug, callback) {
  request({ url, jar: jug }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
  });
}

export function getNextPageUrl($) {
  const pageLink = $('#Agt');
  const pageUrl = (`${$(pageLink).attr('href')}`);
  return pageUrl;
}

export function getBooks($) {
  $('.article').each(function () {
    ReadableStreamBooks.push($(this).text());
  });
}

export function getNumberedPageUrls(page, ip) {
  const $ = cheerio.load(page);
  const firstTenPageLinks = $('a[href^=\'do_other\']');
  const firstTenPageUrls = $(firstTenPageLinks).map((i, link) => `http://${ip}/alis/EK/${$(link).attr('href')}`).toArray();
  return firstTenPageUrls;
}

export function run(fn, q, ip, jar) {
  if (q.length === 0) {
    ReadableStreamBooks.push(null);
    return;
  }
  fn(q[0], jar, (err, page) => {
    if (err) {
      console.log(err);
      return;
    }
    const $ = cheerio.load(page);
    getBooks($);
    const nextPageUrl = getNextPageUrl($);
    if (nextPageUrl === 'undefined') {
      ReadableStreamBooks.push(null);
      return;
    }
    const remainingQueue = q.slice(1);
    if (q.length === 1) {
      remainingQueue.push(`http://${ip}/alis/EK/${nextPageUrl}`);
    }
    run(fn, remainingQueue, ip, jar);
  });
}
