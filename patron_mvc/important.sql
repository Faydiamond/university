#base de datos script 
#He finalizado la instancia de base de datos de mysql pq generaba cobro, puedes ejecutar este script en local y en el archivo config/db/key.js reemplazar por tu conexion local de mysql para probar la app
	
CREATE DATABASE universidad;
USE universidad;

create table ciudades(
	id_ciudad INT PRIMARY KEY AUTO_INCREMENT,
    ciudad VARCHAR(90) not null,
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE programas (
    id_programa INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estudiantes (
    id_estudiante INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) not null,
    apellido VARCHAR(50) not null,
    direccion TEXT,
    correo_electronico VARCHAR(100) not null,
    clave varchar(30) not null,
    fecha_nacimiento DATE,
    id_programa INT,
    id_ciudad INT,
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_programa) REFERENCES programas(id_programa)
    on DELETE SET NULL
	on update cascade,
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
    on DELETE SET NULL
	on update cascade
);


CREATE TABLE profesores (
    id_profesor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) not null,
    apellido VARCHAR(50),
    fecha_nacimiento DATE,
     correo_electronico VARCHAR(100) not null,
    clave  varchar(80) not null,
    id_ciudad INT,
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
    on DELETE SET NULL
	on update cascade
);

CREATE TABLE materias (
    id_materia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    num_creditos INT,
    costo_credito DECIMAL(5,2),
    id_profesor INT,
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_profesor) REFERENCES profesores(id_profesor)
    on DELETE SET NULL
	on update cascade
);


	CREATE TABLE inscripciones (
		id_inscripcion INT PRIMARY KEY AUTO_INCREMENT,
		id_estudiante INT,
		id_materia INT,
		fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante)
        on DELETE SET NULL
		on update cascade,
		FOREIGN KEY (id_materia) REFERENCES materias(id_materia)
        on DELETE SET NULL
		on update cascade
	);

Delimiter //
CREATE TRIGGER before_insert_inscripcion
BEFORE INSERT ON inscripciones
FOR EACH ROW
BEGIN
    DECLARE num_materias_inscritas INT;
    SELECT COUNT(*) INTO num_materias_inscritas
    FROM inscripciones
    WHERE id_estudiante = NEW.id_estudiante;

    IF num_materias_inscritas >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El estudiante ya está inscrito en el máximo número de materias';
    END IF;
END;
//

Delimiter //
CREATE TRIGGER before_insert_materias
BEFORE INSERT ON materias
FOR EACH ROW
BEGIN
    DECLARE profesor_materias INT;
    SELECT COUNT(*) INTO profesor_materias
    FROM materias
    WHERE id_profesor = NEW.id_profesor;

    IF profesor_materias >= 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El profesor solo puede tener una carga academica de 2 materias';
    END IF;
END;
//

DELIMITER //
CREATE TRIGGER exite_profesor_estudiante
BEFORE INSERT ON inscripciones
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inscripciones i
        JOIN materias m ON i.id_materia = m.id_materia
        WHERE i.id_estudiante = NEW.id_estudiante
          AND m.id_profesor = (SELECT id_profesor FROM materias WHERE id_materia = NEW.id_materia)
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El estudiante ya tiene una materia con este profesor';
    END IF;
END;
//

delimiter //

CREATE PROCEDURE insertar_inscripcion(IN p_id_estudiante INT, IN p_id_materia INT)
BEGIN
    INSERT INTO inscripciones (id_estudiante, id_materia)
    VALUES (p_id_estudiante, p_id_materia);
END 
//



DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InfoEstudiante`(
  in  _id_estudiante INT	--recibo un parametro
)
BEGIN
    WITH Estudiantes_Materias AS (
    SELECT
        e.nombre,
        e.apellido,
        JSON_ARRAYAGG(m.nombre) AS materias_inscritas, --creo una lista
        SUM(m.costo_credito) AS costo_total_dolares
    FROM
        estudiantes e
    INNER JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
    INNER JOIN materias m ON i.id_materia = m.id_materia
    WHERE e.id_estudiante = _id_estudiante
    GROUP BY
        e.nombre, e.apellido
)
SELECT
    nombre,
    apellido,
    materias_inscritas,  -- Aquí se devuelve el arreglo de materias
    costo_total_dolares
FROM
    Estudiantes_Materias;




END
//

///////////////////////////////////

stored procedure:

delimiter //

CREATE  PROCEDURE insertar_inscripcion
(IN p_id_estudiante INT, IN p_id_materia INT)
BEGIN
    INSERT INTO inscripciones (id_estudiante, id_materia)
    VALUES (p_id_estudiante, p_id_materia);
END
//


delimiter //
CREATE  PROCEDURE `sp_InsertarEstudiante`(
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(50),
    IN p_direccion VARCHAR(100),
    IN p_correo_electronico VARCHAR(100),
    IN p_clave VARCHAR(50),
    IN p_fecha_nacimiento DATE,
    IN p_id_programa INT,
    IN p_id_ciudad INT
)
BEGIN
    INSERT INTO estudiantes (nombre, apellido, direccion, correo_electronico, clave, fecha_nacimiento, id_programa, id_ciudad)
    VALUES (p_nombre, p_apellido, p_direccion, p_correo_electronico, p_clave, p_fecha_nacimiento, p_id_programa, p_id_ciudad);
END
//

delimiter //
CREATE  PROCEDURE sp_InsertarCiudad(IN p_ciudad VARCHAR(90))
BEGIN
  INSERT INTO ciudades (ciudad)
  VALUES (p_ciudad);
END

//


delimiter //
CREATE  PROCEDURE `sp_InsertarMateria`(
    IN p_nombre VARCHAR(100),
    IN p_num_creditos INT,
    IN p_costo_credito DECIMAL(5,2),
    IN p_id_profesor INT
)
BEGIN
    INSERT INTO materias (
        nombre, 
        num_creditos, 
        costo_credito,
        id_profesor
    )
    VALUES (
        p_nombre, 
        p_num_creditos, 
        p_costo_credito,
        p_id_profesor
    );
END

//



delimiter //
CREATE PROCEDURE sp_InsertarProfesor(
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(50),
    IN p_fecha_nacimiento DATE,
    IN p_clave VARCHAR(50),
    IN p_id_ciudad INT,
    IN p_correo VARCHAR(100)
)
BEGIN
    INSERT INTO profesores (
        nombre, 
        apellido, 
        fecha_nacimiento, 
        clave, 
        id_ciudad,
        correo
    )
    VALUES (
        p_nombre, 
        p_apellido, 
        p_fecha_nacimiento, 
        p_clave, 
        p_id_ciudad,
        p_correo
    );
END

//


delimiter //
CREATE PROCEDURE sp_InfoEstudiante (
  in  _id_estudiante INT
)
BEGIN
    WITH Estudiantes_Materias AS (
    SELECT
        e.nombre,
        e.apellido,
        JSON_ARRAYAGG(m.nombre) AS materias_inscritas,  -- Aquí se genera el arreglo de materias
        SUM(m.costo_credito) AS costo_total_dolares
    FROM
        estudiantes e
    INNER JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
    INNER JOIN materias m ON i.id_materia = m.id_materia
    WHERE e.id_estudiante = _id_estudiante
    GROUP BY
        e.nombre, e.apellido
)
SELECT
    nombre,
    apellido,
    materias_inscritas,  -- Aquí se devuelve el arreglo de materias
    costo_total_dolares
FROM
    Estudiantes_Materias;

END

//



delimiter //

CREATE  PROCEDURE sp_InsertarPrograma(
    IN p_nombre VARCHAR(100)
)
BEGIN
    INSERT INTO programas (
        nombre
        
    )
    VALUES ( p_nombre );
END


//



delimiter //
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerInformacionEstudiante`(
  in  id_estudiante INT
)
BEGIN
    WITH Estudiantes_Materias AS (
        SELECT 
            e.nombre,
            e.apellido,
            GROUP_CONCAT(m.nombre SEPARATOR ', ') AS materias_inscritas,
            SUM(m.costo_credito) AS costo_total_dolares
        FROM
            estudiantes e
        INNER JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
        INNER JOIN materias m ON i.id_materia = m.id_materia
        WHERE e.id_estudiante = @id_estudiante
        GROUP BY
            e.nombre, e.apellido
    )
    SELECT 
        nombre, 
        apellido, 
        materias_inscritas, 
        costo_total_dolares
    FROM 
        Estudiantes_Materias;
END


//


	
	
	
	
	
	
	
	
