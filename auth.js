const okta = require("@okta/okta-sdk-nodejs");

const client = new okta.Client({
    orgUrl: "https://dev-29442551.okta.com",
    token: "00BEO8hq0h7a0T4bhCT18u9qPO_pDI56Hy88oYOP6D"
});

module.exports = { client };