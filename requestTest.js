process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const user = "Bearer ayJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmI2Zjk3ZC1iMDRlLTRhYmYtODc5NC04ZmEyYmM5ZjAwMzciLCJ1c2VybmFtZSI6InBhY2twdWIxQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbXSwic3Vic2NyaXB0aW9uIjpbImFsbCJdLCJwZXJtcyI6IkFBQUFBQUFBQUFBQUFBQUFBQUE9IiwiaWF0IjoxNTQ4NzQyNjI0LCJleHAiOjE1NDg3NDYyMjR9.zq3OOWSrkGr3EnnuZ3P7Fu4GWBJyqorDGZ_PecyM1gopQkP-e91g8woVz_EcDgzclLAV1TTUTIEmUXuw8iOUyAAwNMl2UQQRnPvx5bWN1O4Th2J1UZqTydzb7wwOrIT9VyFR0CQ9LviWLpk9IhVzAVq_PS3GIiZv1HivN3x1TXt2kD14mZ0CvfxhDt6tA_bkLmXZUhZgsa3NGcnobzHomgorF1XdaC4H0XfxCPYBDFimrog20SVt00igu0JDUYk5P-RSDMsTB1KVb0_rtpC8VPnVuWuth1SXayDklzjXeiyhh9GF9UD-wYJQXmgNFFYCyByaDmZAdD3ILNz8CSRvDw";
var request = require("sync-request");
// let awsdata = request("GET", "https://google.co.kr", {
//     headers: {
//         "Authorization" : user
// }});
let awsdata = request("GET", "https://services.packtpub.com/users-v1/users/me/metadata", {
    headers: {
        "Authorization" : user
}});

awsdata.getBody("utf-8");