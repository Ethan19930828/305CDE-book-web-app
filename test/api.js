var http = require('http')
var querystring = require('querystring')

var client = function(path, method, data) {
    var options = {
    hostname: '127.0.0.1',
    port: 4000,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length
    }
  };
  var res_data = '';
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      res_data += chunk;
    }).on('end', function (){
      res_data = JSON.parse(res_data);
      //console.log(res_data);
      console.log({status: res_data.status, message: res_data.message});
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(data);
  req.end();
}
// ********** test register ***********
var postData = querystring.stringify({
  'username' : 'ccc',
  'password' : 'bbb'
});
client('/api/account/register', 'POST', postData);
// to check the same account
client('/api/account/register', 'POST', postData);

// ********** test login **********
var postData = querystring.stringify({
  'username' : 'ccc',
  'password' : 'bbb'
});
client('/api/account/login', 'POST', postData);
// to check wrong password
var postData = querystring.stringify({
  'username' : 'ccc',
  'password' : 'ccc'
});
client('/api/account/login', 'POST', postData);

// ********** test search **********
var postData  = querystring.stringify({
  'query': 'js'
});
client('/api/book/search', 'POST', postData);
var postData  = querystring.stringify({
  'query': '8122409776'
});
client('/api/book/search', 'POST', postData);
// ********** add item **********
var postData  = querystring.stringify({
  'book': {
     "kind": "books#volume",
     "id": "BQS33CxGid4C",
     "etag": "RkQPhDS61Lg",
     "selfLink": "https://www.googleapis.com/books/v1/volumes/BQS33CxGid4C",
     "volumeInfo": {
      "title": "MongoDB: The Definitive Guide",
      "authors": [
       "Kristina Chodorow",
       "Michael Dirolf"
      ],
      "publisher": "\"O'Reilly Media, Inc.\"",
      "publishedDate": "2010-09-08",
      "description": "How does MongoDB help you manage a huMONGOus amount of data collected through your web application? With this authoritative introduction, you'll learn the many advantages of using document-oriented databases, and discover why MongoDB is a reliable, high-performance system that allows for almost infinite horizontal scalability. Written by engineers from 10gen, the company that develops and supports this open source database, MongoDB: The Definitive Guide provides guidance for database developers, advanced configuration for system administrators, and an overview of the concepts and use cases for other people on your project. Learn how easy it is to handle data as self-contained JSON-style documents, rather than as records in a relational database. Explore ways that document-oriented storage will work for your project Learn how MongoDB’s schema-free data model handles documents, collections, and multiple databases Execute basic write operations, and create complex queries to find data with any criteria Use indexes, aggregation tools, and other advanced query techniques Learn about monitoring, security and authentication, backup and repair, and more Set up master-slave and automatic failover replication in MongoDB Use sharding to scale MongoDB horizontally, and learn how it impacts applications Get example applications written in Java, PHP, Python, and Ruby",
      "industryIdentifiers": [
       {
        "type": "ISBN_13",
        "identifier": "9781449396985"
       },
       {
        "type": "ISBN_10",
        "identifier": "1449396984"
       }
      ],
      "readingModes": {
       "text": true,
       "image": true
      },
      "pageCount": 216,
      "printType": "BOOK",
      "categories": [
       "Computers"
      ],
      "averageRating": 4.0,
      "ratingsCount": 13,
      "maturityRating": "NOT_MATURE",
      "allowAnonLogging": false,
      "contentVersion": "0.4.3.0.preview.3",
      "imageLinks": {
       "smallThumbnail": "http://books.google.com/books/content?id=BQS33CxGid4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
       "thumbnail": "http://books.google.com/books/content?id=BQS33CxGid4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
      },
      "language": "en",
      "previewLink": "http://books.google.com/books?id=BQS33CxGid4C&printsec=frontcover&dq=mongodb&hl=&cd=1&source=gbs_api",
      "infoLink": "http://books.google.com/books?id=BQS33CxGid4C&dq=mongodb&hl=&source=gbs_api",
      "canonicalVolumeLink": "http://books.google.com/books/about/MongoDB_The_Definitive_Guide.html?hl=&id=BQS33CxGid4C"
     },
     "saleInfo": {
      "country": "CN",
      "saleability": "NOT_FOR_SALE",
      "isEbook": false
     },
     "accessInfo": {
      "country": "CN",
      "viewability": "PARTIAL",
      "embeddable": true,
      "publicDomain": false,
      "textToSpeechPermission": "ALLOWED",
      "epub": {
       "isAvailable": true
      },
      "pdf": {
       "isAvailable": true
      },
      "webReaderLink": "http://books.google.com/books/reader?id=BQS33CxGid4C&hl=&printsec=frontcover&output=reader&source=gbs_api",
      "accessViewStatus": "SAMPLE",
      "quoteSharingAllowed": false
     },
     "searchInfo": {
      "textSnippet": "Written by engineers from 10gen, the company that develops and supports this open source database, MongoDB: The Definitive Guide provides guidance for database developers, advanced configuration for system administrators, and an overview of ..."
     }
    }
});
client('/api/book/add', 'POST', postData);

// ********** delete item **********
var postData  = querystring.stringify({
  'book': 'PEDlBwAAQBAJ'
});
client('/api/book/delete', 'POST', postData);

// ********** list item **********
var getData  = querystring.stringify({
  
});
client('/api/book/list', 'GET', getData);
