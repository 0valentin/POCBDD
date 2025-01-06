CREATE DATABASE formationDB;

USE formationDB;

CREATE TABLE formations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL
);

CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  formation_id INT NOT NULL,
  titre VARCHAR(255) NOT NULL,
  fichier_lien VARCHAR(255) NOT NULL,
  FOREIGN KEY (formation_id) REFERENCES formations(id)
);
