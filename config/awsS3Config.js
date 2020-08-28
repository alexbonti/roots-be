"use strict";
var s3BucketCredentials = {
  projectFolder: "refugee",
  bucket: "roots-deakin-launchpad",
  endpoint: "s3.au-syd.cloud-object-storage.appdomain.cloud",
  apiKeyId: "iumd7hzzPsquU1aRyp3JzzhHNWnjAVj6rNKvVbzOB-AZ",
  serviceInstanceId:
    "crn:v1:bluemix:public:cloud-object-storage:global:a/3f6150e9065040f4b5fd0ac6bda85bbe:e0902e3c-1abb-460d-b6e3-9dc089f79556:bucket:roots-deakin-launchpad",
  folder: {
    profilePicture: "profilePicture",
    thumb: "thumb",
    original: "original",
    image: "image",
    docs: "docs",
    files: "files"
  },
  agentDefaultPicUrl:
    "http://instamow.s3.amazonaws.com/agent/profilePicture/default.png",
  fbUrl: "https://graph.facebook.com/"
};
module.exports = {
  s3BucketCredentials: s3BucketCredentials
};
