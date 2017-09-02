/**
 * This js file provides function to send html files for response
 */

/*
 * Send html
 */
exports.sendHtml = ((req, res, fileName) => {
  const options = {
    root: `${__dirname}/../../`,
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  // const fileName = '/client/static/html/index.html';
  res.sendFile(`/client/static/html/${fileName}`, options);
});
