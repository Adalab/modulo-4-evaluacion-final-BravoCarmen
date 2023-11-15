CREATE DATABASE taller_db;
USE taller_db;

CREATE TABLE `taller_db`.`clientes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(45) NOT NULL,
  `Apellido` VARCHAR(45) NOT NULL,
  `Telefono` VARCHAR(45) NOT NULL,
  `Vehiculo` VARCHAR(45) NOT NULL,
  `Matricula` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
  
INSERT INTO `clientes` (`Nombre`, `Apellido`, `Telefono`, `Vehiculo`, `Matricula`) VALUES ('Antonio', 'Palacios', '666000666', 'BMW', '1234APV');
INSERT INTO `clientes` (`Nombre`, `Apellido`, `Telefono`, `Vehiculo`, `Matricula`) VALUES ('Carmen', 'Bravo', '600111333', 'Audi', '2922CBF');
INSERT INTO `clientes` (`Nombre`, `Apellido`, `Telefono`, `Vehiculo`, `Matricula`) VALUES ('Meri', 'Pitbull', '678992143', 'Fiat', '9001TTP');
INSERT INTO `clientes` (`Nombre`, `Apellido`, `Telefono`, `Vehiculo`, `Matricula`) VALUES ('Jack', 'Meyer', '621002104', 'Mercedes', '1104AJX');
        