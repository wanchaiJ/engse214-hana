var dbconfig = {
  development: {
    server: "10.21.45.30",
    database: "team0_engce214_db",
    user: "team0",
    password: "P@ssw0rd",
    port: 1433,
    options: {
      encript: true,
      setTimeout: 12000,
      enableArithAbort: true,
      trustServerCertificate: true,
      trustedconnection: true,
      instancename: "10.21.45.30", // SQL Server instance name
    },
  },
  production: {
    server: "10.21.45.30",
    database: "team0_engce214_db",
    user: "team0",
    password: "P@ssw0rd",
    port: 1433,
    options: {
      encript: true,
      setTimeout: 12000,
      enableArithAbort: true,
      trustServerCertificate: true,
      trustedconnection: true,
      instancename: "10.21.45.30", // SQL Server instance name
    },
  },
};
module.exports = dbconfig;
