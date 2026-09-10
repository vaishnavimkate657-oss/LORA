package com.yourorg.appname.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Smart Database Configuration for Cloud Deployment (Render).
 * Active only when SPRING_PROFILES_ACTIVE=postgres.
 *
 * Automatically parses Render's injected DATABASE_URL (postgresql://user:pass@host:port/dbname)
 * and adapts it into standard JDBC format with credential extraction.
 */
@Configuration
@Profile("postgres")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    private final Environment env;

    public DatabaseConfig(Environment env) {
        this.env = env;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            databaseUrl = env.getProperty("DATABASE_URL");
        }

        if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
            try {
                log.info("Render DATABASE_URL detected. Parsing for PostgreSQL JDBC connection...");
                
                // Normalise URI scheme for java.net.URI
                String uriString = databaseUrl.trim();
                if (uriString.startsWith("postgres://")) {
                    uriString = "postgresql://" + uriString.substring("postgres://".length());
                }

                URI dbUri = new URI(uriString);

                String username = null;
                String password = null;
                String userInfo = dbUri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] credentials = userInfo.split(":", 2);
                    username = credentials[0];
                    password = credentials[1];
                } else if (userInfo != null) {
                    username = userInfo;
                }

                String host = dbUri.getHost();
                int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
                String path = dbUri.getPath(); // e.g. "/trippartner"
                if (path != null && path.startsWith("/")) {
                    path = path.substring(1);
                }

                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                        .append(host)
                        .append(":")
                        .append(port)
                        .append("/")
                        .append(path);

                String query = dbUri.getQuery();
                if (query != null && !query.trim().isEmpty()) {
                    jdbcUrl.append("?").append(query);
                    if (!query.contains("sslmode")) {
                        jdbcUrl.append("&sslmode=prefer");
                    }
                } else {
                    jdbcUrl.append("?sslmode=prefer");
                }

                log.info("Constructed PostgreSQL JDBC URL: jdbc:postgresql://{}:{}/{}", host, port, path);

                return DataSourceBuilder.create()
                        .driverClassName("org.postgresql.Driver")
                        .url(jdbcUrl.toString())
                        .username(username)
                        .password(password)
                        .build();

            } catch (Exception ex) {
                log.error("Failed to parse DATABASE_URL: {}. Falling back to standard properties.", ex.getMessage(), ex);
            }
        }

        // Fallback to standard application properties
        String driver = env.getProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
        String url = env.getProperty("spring.datasource.url");
        String user = env.getProperty("spring.datasource.username");
        String pass = env.getProperty("spring.datasource.password");

        log.info("Configuring PostgreSQL datasource from standard properties: {}", url);

        return DataSourceBuilder.create()
                .driverClassName(driver)
                .url(url)
                .username(user)
                .password(pass)
                .build();
    }
}
