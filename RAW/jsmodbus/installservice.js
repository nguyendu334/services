var Service = require("node-windows").Service; // npm install node-windows@1.0.0-beta.6
var dir = require("path").join(process.cwd(), "service.js");

// Create a new service object
var svc = new Service({
  name: "RAWSon",
  description: "The nodejs.org example web server.",
  script: require("path").join(process.cwd(), "service.js"),
  env: {
    name: "NODE_ENV",
    value: "production",
  },
});

svc.on("install", function () {
  svc.start();
  console.log("Run service");
});

svc.install();
