-- Drop and recreate the transformers table
DROP TABLE IF EXISTS transformers;

CREATE TABLE transformers (
    id INTEGER PRIMARY KEY,
    TransformerName VARCHAR(255) NOT NULL,
    faction VARCHAR(255) NOT NULL
);

-- Insert or update data into the transformers table
MERGE transformers AS target
USING (VALUES
    (1, 'Optimus Prime', 'AutoBot'),
    (2, 'Megatron', 'Decepticon'),
    (3, 'BumbleBee', 'AutoBot'),
    (4, 'StarScream', 'Decepticon'),
    (5, 'IronHide', 'AutoBot'),
    (6, 'SoundWave', 'Decepticon'),
    (7, 'Rachet', 'AutoBot'),
    (8, 'ShockWave', 'Decepticon'),
    (9, 'Jazz', 'AutoBot'),
    (10, 'Galvatron', 'Decepticon'),
    (11, 'Sideswipe', 'AutoBot'),
    (12, 'Swindle', 'Decepticon'),
    (13, 'Arcee', 'AutoBot'),
    (14, 'Tarn', 'Decepticon'),
    (15, 'Elita-One', 'AutoBot'),
    (16, 'SkyWarp', 'Decepticon'),
    (17, 'Hot Rod', 'AutoBot'),
    (18, 'ThunderCracker', 'Decepticon'),
    (19, 'GrimLock', 'AutoBot'),
    (20, 'Bruticus', 'Decepticon')
) AS source (id, TransformerName, faction)
ON target.id = source.id
WHEN MATCHED THEN 
    UPDATE SET TransformerName = source.TransformerName, faction = source.faction
WHEN NOT MATCHED THEN
    INSERT (id, TransformerName, faction) 
    VALUES (source.id, source.TransformerName, source.faction);

-- Drop and recreate the description table
DROP TABLE IF EXISTS description;

CREATE TABLE description (
    id INTEGER,
    TransformersDescription TEXT NOT NULL  -- Changed to TEXT to allow longer descriptions
);

-- Insert data into the description table
INSERT INTO description (id, TransformersDescription) VALUES
    (1, 'Optimus Prime was originally orion pax. Turned into Optimus Prime due to a transformation by a previous prime Alpha Trion.'),
    (2, 'Megatron originally D-16 was gladiator fighter, turned evil due to his ideal of their being corruption within the council.'),
    (3, 'BumbleBee originally B-127 was a scout who was one of the last generation making him one of the youngest transformers.'),
    (4, 'StarScream originally Ulchtar was a scientest on cybertron before the war started.'),
    (5, 'IronHide was a weapons specialist before the war and a friend to Optimus Prime.'),
    (6, 'SoundWave was a personal assistant to a senator.'),
    (7, 'Rachet a medic before and during the war'),
    (8, 'ShockWave was a senator before the war.'),
    (9, 'Jazz was originally apart of a caste tasked with cultural observation and analysis.'),
    (10, 'Galvatron was originally Megatron, turned into galvatron by Unicron using power to grant him a new stronger body.'),
    (11, 'SideSwipe was a merchant before the war'),
    (12, 'Swindle was apart of a cybertron elite guard special ops unit'),
    (13, 'Arcee was a data clerk before the war'),
    (14, 'Tarn was created under Megatrons wishes to be one of his many invunerable and most durable decepticons'),
    (15, 'Elita-One was a scholar and maintained a strict adherence to the law'),
    (16, 'It is unknown when he was created and for what, and when he joined the decepticons'),
    (17, 'Hot Rod, cant find anything about his backstory.'),
    (18, 'ThunderCracker, cant find anything about his backstory'),
    (19, 'GrimLock was a gladiator from Kaon before the war'),
    (20, 'Bruticus was formed by combaticons when making a last effort on a mission');

SELECT 
    t.id,
    t.TransformerName,
    t.faction,
    d.TransformersDescription
FROM 
    transformers t
JOIN 
    description d ON t.id = d.id;


select * from tickets


SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tickets';
 