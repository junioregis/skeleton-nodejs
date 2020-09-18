module.exports = {
  pg: {
    host: "db",
    port: 5432,
    database: "db",
    username: "postgres",
    password: "postgres",
  },
  redis: {
    host: "redis",
    port: 6379,
  },
  selenium: {
    host: "selenium",
    port: 4444,
  },
  slack: {
    webHook: "",
  },
  mailer: {
    host: "smtp.gmail.com",
    port: 465,
    user: "test@domain.com",
    pass: "",
    from: "Domain",
  },
};
