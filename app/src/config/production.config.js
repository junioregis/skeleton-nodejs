module.exports = {
  pg: {
    host: "srv-captain--skeleton-postgres",
    port: 5432,
    database: "db",
    username: "postgres",
    password: "postgres",
  },
  redis: {
    host: "srv-captain--skeleton-redis",
    port: 6379,
  },
  selenium: {
    host: "srv-captain--skeleton-selenium",
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
