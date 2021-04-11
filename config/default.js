/* eslint-disable */

const path = require('path');

module.exports = {
  "DEBUG": "app:*",
  "DEBUG_MODE": false,
  // "STATIC_SERVER_URL": "http://localhost:3000",
  "STATIC_SERVER_URL": "http://172.16.210.165:3000",
  "TICKET_VERIFY_URL": "http://192.168.2.155:3002",
  "API": {
    "PORT": 4000,
    "ORIGIN": "http://localhost:4000",
    "SESSION_SECRET": "abc@123",
    "PASSWORD_SECRET": "abc@123",
    "GA_TRACKING_ID": null,
    "SESSION_TOKEN_EXPIRY": 60 * 60 * 24 * 7, // seconds // 7 days
    "ACCESS_TOKEN_EXPIRY": 60 * 60 * 24, // seconds // 24 hours
    "REQUEST_EXPIRY": 60, // seconds // 60 seconds
  },
  "ADMIN": {
    "PORT": 4001,
    "ORIGIN": "http://localhost:4001",
    "SESSION_SECRET": "abc@123",
    "PASSWORD_SECRET": "abc@123",
    "GA_TRACKING_ID": null,
    "SESSION_EXPIRY": 60 * 60 * 24 * 7, // seconds // 7 days
  },
  "DB": {
    "master": {
      "host": "165.22.251.49",
      "user": "timcheng",
      "password": "12345678",
      "database": "smart_ticket_api_dev"
    }
  },
  "TRUFFLE": {
    "PORT": 7545,
    "HOST": "165.22.251.49",
    "ORIGIN": "http://165.22.251.49:7545",
    "OWNER_ACCOUNT": {
      "PUBLIC_KEY": "0x19EE78BAC3D3b2f9f6c6d162f4347f763021C038",
      "PRIVATE_KEY": "0x999da71ecd57b14e49e398c7ff3f737295e5f85df17961fc22769fa15eae4089"
    }
  },
  "AUTH": {
    "USERNAME": "",
    "PASSWORD": null
  },
  "EMAIL": {
    "TO": "",
    "FROM": ""
  },
  "SENDGRID_API_KEY": null,
  "TWILIO": {
    "accountSid": "",
    "authToken": "",
    "from": ""
  },
  "FIREBASE": {
    "DATABASE_URL": "",
    "SERVICE_ACCOUNT_FILE": __dirname + ""
  },
  "MEDIA": {
    "PUBLIC": path.join(__dirname, "..", "data/public"),
    "PRIVATE": path.join(__dirname, "..", "data/private"),
    "QRCODE": path.join(__dirname, "..", "data/private", "qrcode"), // store controller passcode QR Code
  },
  "PASSCODE_ENCRYPTION_KEY": "",
  "API_PASSCODE_EXPIRY_TIME": 15 * 60, // seconds
};
