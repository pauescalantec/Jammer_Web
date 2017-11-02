CREATE DATABASE jammerDB;

CREATE TABLE Users (
	fName VARCHAR(30) NOT NULL,
    lName VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    gender VARCHAR(30) NOT NULL,
    country VARCHAR(30) NOT NULL,
    username VARCHAR(50) NOT NULL PRIMARY KEY,
    passwrd MEDIUMTEXT NOT NULL
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

CREATE TABLE Friendships (
    friend1 VARCHAR(50) NOT NULL,
    friend2 VARCHAR(50) NOT NULL,
    status VARCHAR(10) NOT NULL,
    PRIMARY KEY (friend1, friend2)
);

INSERT INTO Users(fName, lName, email, gender, country, username, passwrd)
VALUES  ('Paulina', 'Escalante', 'paulina@gmail.com', 'Female', 'Mexico', 'pecster', 'def502006803e7979b34c82e74530c5335aa4b8cc03fe43abe2971f8a2ede2ce420695a698af7397fb1f55f091e7e1e0794b66230387964ad0838333c4c639325ead2e44bf2746a143dd0ff142cccc8eec3d33c26e509c49be6356'),
        ('Jose', 'Benitez', 'benitez@gmail.com', 'Male', 'Brazil', 'benitez', 'def50200fc1768613dcc08dd36cc87c3b7efc8d4b343f391f72ad9a0b35a780ed27c33647a74f3dc3709bf8b3bcfd0eca6c8f0009a66dc16da83df05766a8649fd681075b2e96c2cbe23a6e8bcd45a71f8e7d3e9010b30cea2bfb9'),
        ('Lab6', 'Lab6', 'lab6@gmail.com', 'Male', 'United States', 'lab6', 'def50200826b49ddf65156f6741d9cabca5f4d9fc0bdb4c7aee56dbcbbb17ab4034f676c83747bd4a518caa05d86538c295550b8095ce3879d72e76deefe93a9c325f1a0f6132eee2772b44be5bcba2726983e8bd8d4b53f'),
        ('1', '1', '1@gmail.com', 'Male', 'Canada', '1', 'def50200bb9ec9825bfad2b137ff9cf3325de541459e5e1808ab2729e04f2a4dd9f96f9ed579c5607747bbabcac5c14e6cb14d9c1ef89e7536471aea238e74553e3fd00624593f6575db0349cd15030e27aca66a2d'),
        ('a', 'a', 'a', 'Female', 'Israel', 'a', 'def502002c2feda368fb002af9d0a625ada21c8f95b69acc22383aef4961ec4d8860ecec69d773dc666b4c5965575a2b44c4681add681eb7d364015b094c4306d2916d00d63e257081e36eca2b361d348ac8a93a52'),
        ('Isabela', 'Morales', 'morales@gmail.com', 'Female', 'Canada', 'isaM', 'def5020005d65530432ef32ceb8583fab6263a3ee2e7212b16e705f9e3fc55ee84c6444e5073cb66408f8aaccb95835696249d0a95cfddeb0e54dc36cb95be916fb01e80583b6a364c1fe7273144e0c4e4c3fb384ae81ca994cf60e3'),
        ('Diego', 'Garza', 'diegogza@gmail.com', 'Male', 'New Zealand', 'diegogo', 'def50200c8730fa581b3ba117e293474447de93c77e9a17284e4032cd7535c7cd516f1e6f2fd804921c4bc6363cd2d4f6fe5173d52cf617fd42bfa9ba59210a23729684395e70f60aed1f79b9f67a6f3ccfb7e6abf8a57cd'),
        ('Jose', 'Perez' 'jose@gmail.com', 'Male', 'Nicaragua', 'josejose', 'def502007de09d42eaa6b438dd2792d6505bfb5aa3e54a5df4a7296f17daedcfa21db508ee88cbaadd740d546c951bbfd4f991adf761b62cfe846f433d2e2e737ac71066b46ac309ac34396f68fafd2823a0a023e6538f2dab42d0ce'),
        ('Luis', 'Rodriguez', 'luisr@gmail.com', 'Male', 'Mexico', 'luisr', 'def502009d33a6dde3b300b24cb12e4508b3b088d6ff74068b5e1165bd9957f05f712d23f8ea104268906116f447fbb5f2e60f5a60d617ad63ff97754594ff28f55192371e785d8dafe9a5d0152ab429959e768b71c489c95058423e'),
		('Maria', 'Perez', 'maria@gmail.com', 'Female', 'Israel', 'mariap', 'def50200b04e8a17de2cc960dafe6895e58543723ac76c92803729ea53da64e89454d5e159dbb549df0b422db938188abd050764d8589bfafc2915dff3359cd9b804a04724b90972f7eceb2ece103a86d0ad4b135a68ab47');
        

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

INSERT INTO Friendships(friend1, friend2, status)
VALUES  ('mariap', 'pecster', 'P'),
        ('benitez', 'pecster', 'P'),
        ('pecster', '1', 'F'),
        ('1', 'pecster', 'F'),
        ('lab6', 'pecster', 'F'),
        ('diegogo', 'pecster', 'P'),
        ('luisr', 'pecster', 'P'),
        ('josejose', 'pecster', 'P'),
        ('pecster', 'lab6', 'F');