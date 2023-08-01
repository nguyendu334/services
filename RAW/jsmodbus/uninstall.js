var Service = require("node-windows").Service;

// Create a new service object
var svc = new Service({
  name: "RAWSon",
  script: require("path").join(process.cwd(), "service.js"),
});

// Listen for the "uninstall" event so we know when it's done.
svc.on("uninstall", function () {
  console.log("Uninstall complete.");
});

// Uninstall the service.
svc.uninstall();
