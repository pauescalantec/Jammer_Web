CREATE DATABASE jammerDB;

CREATE TABLE Users (
	fName VARCHAR(30) NOT NULL,
    lName VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    gender VARCHAR(30) NOT NULL,
    country VARCHAR(30) NOT NULL,
    username VARCHAR(50) NOT NULL PRIMARY KEY,
    passwrd VARCHAR(50) NOT NULL
);

CREATE TABLE Notes (
	noteContent MEDIUMTEXT NOT NULL,
    ownerName VARCHAR(50) NOT NULL,
    noteKey VARCHAR(50) NOT NULL PRIMARY KEY
);

CREATE TABLE Posts (
    noteKey VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (noteKey, username)
);

INSERT INTO Users(fName, lName, email, gender, country, username, passwrd)
VALUES  ('Paulina', 'Escalante', 'paulina@gmail.com', 'Female', 'Mexico', 'pecster', 'pecster'),
        ('Lab6', 'Lab6', 'lab6@gmail.com', 'Male', 'United States', 'lab6', 'lab6'),
        ('1', '1', '1@gmail.com', 'Male', 'Canada', '1', '1'),
		('Maria', 'Perez', 'maria@gmail.com', 'Female', 'Israel', 'mariap', 'mape');

INSERT INTO Notes(noteContent, noteKey, ownerName)
VALUES  ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', 'Lorempecster1208', 'pecster'),
        ('Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan. Ut tellus elementum sagittis vitae et leo duis ut. Tellus id interdum velit laoreet id donec ultrices tincidunt.', 'Ullamcorperlab61012', 'lab6'),
        ('Risus ultricies tristique nulla aliquet enim tortor at. Donec pretium vulputate sapien nec sagittis aliquam malesuada.', 'Risus11104', '1'),
        ('Ultricies tristique nulla aliquet enim tortor at. Donec pretium vulputate sapien nec sagittis aliquam malesuada.', 'Ultriciespecster1104', 'pecster'),
		('Malesuada fames ac turpis egestas sed tempus urna et pharetra. Cras tincidunt lobortis feugiat vivamus at.', 'Malesuadamariap1306', 'mariap');


INSERT INTO Posts(username, noteKey)
VALUES  ('pecster', 'Lorempecster1208'),
        ('lab6', 'Ullamcorperlab61012'),
        ('pecster', 'Ultriciespecster1104'),
        ('1', 'Risus11104'),
        ('pecster', 'Malesuadamariap1306'),
		('mariap', 'Malesuadamariap1306');