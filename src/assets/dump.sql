/*Tablas que se sincronizan con el movil*/

CREATE TABLE IF NOT EXISTS rk_hc_usuario(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    cedula VARCHAR (13),
    nombre VARCHAR (100),
    correo VARCHAR (100),
    clave VARCHAR (50),
    exportador_id INTEGER,
    ultimo_ingreso DATETIME,
    administrador CHAR(1) DEFAULT 'N',
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

CREATE TABLE IF NOT EXISTS rk_hc_hacienda(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    sigla VARCHAR (5),
    nombre VARCHAR (100),
    estado CHAR (1) DEFAULT 'A'
);

CREATE TABLE IF NOT EXISTS rk_hc_empresa(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    sigla VARCHAR (20),
    nombre VARCHAR (100),
    razon_social VARCHAR (100),
    ruc VARCHAR (13),
    direccion CHAR (20),
    telefono VARCHAR (30),
    numero CHAR (15),
    correo VARCHAR (100),
    estado CHAR (1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

CREATE TABLE IF NOT EXISTS rk_hc_persona_formulario_hacienda(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    usuario_id INTEGER,
    formulario_id INTEGER,
    hacienda_id INTEGER,
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

CREATE TABLE IF NOT EXISTS rk_hc_formulario(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    nombre VARCHAR(100),
    sigla VARCHAR(30),
    ruta VARCHAR(100),
    icono VARCHAR(100),
    color VARCHAR(100),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

CREATE TABLE IF NOT EXISTS rk_hc_tipo_formulario_cab(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    nombre_formulario VARCHAR (100),
    sigla VARCHAR (30),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

CREATE TABLE IF NOT EXISTS rk_hc_tipo_formulario_det(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    tipo_formulario_cab_id INTEGER,
    nombre VARCHAR(100),
    cuadrante CHAR(1),
    n_cuadrante INTEGER,
    rama CHAR(1),
    n_rama INTEGER,
    nota_min INTEGER,
    nota_max INTEGER,
    max_linea INTEGER,
    tipo VARCHAR(30),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

CREATE TABLE IF NOT EXISTS rk_hc_lote(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    hacienda_id INTEGER,
    lote VARCHAR (30),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

CREATE TABLE IF NOT EXISTS rk_hc_lote_det(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    lote_id INTEGER,
    modulo VARCHAR (30),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

CREATE TABLE IF NOT EXISTS rk_hc_lote_det(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    lote_id INTEGER,
    modulo VARCHAR (30),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);


CREATE TABLE IF NOT EXISTS rk_hc_tipo_muestra(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    nombre VARCHAR (100),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME
);

/*Tablas que se sincronizan con el servidor*/

CREATE TABLE IF NOT EXISTS rk_hc_form_cab(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    hacienda_id INTEGER,
    lote_id INTEGER,
    modulo_id INTEGER,
    empresa_id INTEGER,
    tipo_muestra_id INTEGER,
    observacion TEXT,
    estado CHAR(1) DEFAULT 'A',
    liquidado CHAR(1) DEFAULT 'N',
    tipo_form VARCHAR(10),
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME,
    sincronizado CHAR(1) DEFAULT 'N'
);


CREATE TABLE IF NOT EXISTS rk_hc_form_det(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    formulario_id INTEGER,
    linea INTEGER,
    nombre VARCHAR(30),
    valor INTEGER,
    nombre2 VARCHAR(30),
    valor2 INTEGER,
    tipo_pag VARCHAR(100),
    tipo_ubicacion CHAR(1),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME,
    sincronizado CHAR(1) DEFAULT 'N'
);

CREATE TABLE IF NOT EXISTS rk_hc_form_files(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    formulario_id INTEGER,
    linea INTEGER,
    cuadrante CHAR(2),
    rama CHAR(2),
    img TEXT,
    tipo_pag VARCHAR (10),
    tipo_ubicacion CHAR(1),
    estado CHAR(1) DEFAULT 'A',
    usuario_cre_id INTEGER,
    fecha_cre DATETIME,
    usuario_mod_id INTEGER,
    fecha_mod DATETIME,
    sincronizado CHAR(1) DEFAULT 'N'
);

