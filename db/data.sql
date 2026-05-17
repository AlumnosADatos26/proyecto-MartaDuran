-- =============================================
-- Datos de prueba
-- En el punto 3.2.3 de la documentación del proyecto viene toda la explicación del proceso.

-- Ejecutar sobre la base de datos: moodfilm
-- Usuario de prueba:
--   Email:      test@moodfilm.com
--   Contraseña: 123456
-- =============================================

INSERT IGNORE INTO usuario (username, email, password, google_id, foto_perfil, bio, genero_favorito, proveedor, fecha_registro)
VALUES (
  'cinefilatest',
  'test@moodfilm.com',
  '$2a$10$PON_AQUI_TU_HASH_BCRYPT_DE_123456',
  NULL,
  'assets/avatars/avatar2.png',
  'Amante del cine y las noches de películas',
  'Drama',
  'LOCAL',
  NOW()
);

INSERT IGNORE INTO lista (nombre, usuario_id) VALUES ('Favoritas',     1);
INSERT IGNORE INTO lista (nombre, usuario_id) VALUES ('Por ver',       1);
INSERT IGNORE INTO lista (nombre, usuario_id) VALUES ('Vistas',        1);
INSERT IGNORE INTO lista (nombre, usuario_id) VALUES ('Mis thrillers', 1);

INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (550, 'Fight Club', '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 'Eufórico', NOW(), 1);
INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (157336, 'Interstellar', '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'Reflexivo', NOW(), 1);
INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (238, 'El Padrino', '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 'Tenso', NOW(), 1);

INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (438631, 'Dune', '/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg', NULL, NOW(), 2);
INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (872585, 'Oppenheimer', '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', NULL, NOW(), 2);
INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (313369, 'La La Land', '/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', NULL, NOW(), 2);

INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (115, 'El Gran Lebowski', '/3bv6WAp6BSxxYvB5ozKFUYuRA8C.jpg', 'Relajado', DATE_SUB(NOW(), INTERVAL 10 DAY), 3);
INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (680, 'Pulp Fiction', '/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 'Eufórico', DATE_SUB(NOW(), INTERVAL 20 DAY), 3);

INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (807, 'Se7en', '/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg', 'Tenso', NOW(), 4);
INSERT IGNORE INTO lista_pelicula (tmdb_id, titulo, poster_path, mood, `fecha_añadida`, lista_id)
VALUES (274, 'El Silencio de los Corderos', '/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', 'Tenso', NOW(), 4);

INSERT IGNORE INTO comentario (texto, fecha, es_publico, usuario_id, tmdb_id, titulo_pelicula)
VALUES ('Una película que te hace replantearte muchas cosas. La actuación de Brad Pitt es brutal.',
  DATE_SUB(NOW(), INTERVAL 3 DAY), 1, 1, 550, 'Fight Club');
INSERT IGNORE INTO comentario (texto, fecha, es_publico, usuario_id, tmdb_id, titulo_pelicula)
VALUES ('La banda sonora de Hans Zimmer es de otro planeta. La escena del agujero de gusano me dejó sin palabras.',
  DATE_SUB(NOW(), INTERVAL 8 DAY), 1, 1, 157336, 'Interstellar');
INSERT IGNORE INTO comentario (texto, fecha, es_publico, usuario_id, tmdb_id, titulo_pelicula)
VALUES ('Clásico imprescindible. Brando está increíble en cada escena.',
  DATE_SUB(NOW(), INTERVAL 15 DAY), 1, 1, 238, 'El Padrino');
INSERT IGNORE INTO comentario (texto, fecha, es_publico, usuario_id, tmdb_id, titulo_pelicula)
VALUES ('La vi en un momento en que necesitaba algo tranquilo y me encantó. Jeff Bridges es perfecto.',
  DATE_SUB(NOW(), INTERVAL 10 DAY), 1, 1, 115, 'El Gran Lebowski');
INSERT IGNORE INTO comentario (texto, fecha, es_publico, usuario_id, tmdb_id, titulo_pelicula)
VALUES ('Tarantino en estado puro. Los diálogos son lo mejor que he escuchado en una película.',
  DATE_SUB(NOW(), INTERVAL 20 DAY), 0, 1, 680, 'Pulp Fiction');