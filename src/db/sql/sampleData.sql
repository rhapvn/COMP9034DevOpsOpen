INSERT INTO institutes (name, address)
VALUES
('Institute of NanoScience', '123 University Blvd, Adelaide, SA 5001'),
('Institute of Biomedical Research', '456 Science Way, Adelaide, SA 5002'),
('Institute of Environmental Science', '789 Eco Drive, Adelaide, SA 5003');

INSERT INTO research_centres (name, address, institute_id)
VALUES
-- Institute 1: NanoScience
('Centre for Quantum Materials', '789 Research Road, Adelaide, SA 5001', 1),
('Centre for Nanotechnology', '101 Nano Blvd, Adelaide, SA 5001', 1),
-- Institute 2: Biomedical Research
('Centre for Cancer Research', '101 Medical Ave, Adelaide, SA 5002', 2),
('Centre for Genetics', '102 Gene Way, Adelaide, SA 5002', 2),
-- Institute 3: Environmental Science
('Centre for Climate Change', '104 Climate Rd, Adelaide, SA 5003', 3),
('Centre for Water Resources', '105 Water Ln, Adelaide, SA 5003', 3);

INSERT INTO laboratories (name, address, centre_id)
VALUES
-- Research Centre 1: Quantum Materials
('Quantum Physics Lab', 'Lab 1, 789 Research Road, Adelaide, SA 5001', 1),
('Quantum Chemistry Lab', 'Lab 2, 789 Research Road, Adelaide, SA 5001', 1),
-- Research Centre 2: Nanotechnology
('Nano Materials Lab', 'Lab 1, 101 Nano Blvd, Adelaide, SA 5001', 2),
('Nano Fabrication Lab', 'Lab 2, 101 Nano Blvd, Adelaide, SA 5001', 2),
-- Research Centre 3: Cancer Research
('Oncology Research Lab', 'Lab 1, 101 Medical Ave, Adelaide, SA 5002', 3),
('Radiology Research Lab', 'Lab 2, 101 Medical Ave, Adelaide, SA 5002', 3),
-- Research Centre 4: Genetics
('Gene Sequencing Lab', 'Lab 1, 102 Gene Way, Adelaide, SA 5002', 4),
('Genomics Lab', 'Lab 2, 102 Gene Way, Adelaide, SA 5002', 4),
-- Research Centre 5: Climate Change
('Climate Modeling Lab', 'Lab 1, 104 Climate Rd, Adelaide, SA 5003', 5),
('Climate Data Lab', 'Lab 2, 104 Climate Rd, Adelaide, SA 5003', 5),
-- Research Centre 6: Water Resources
('Water Quality Lab', 'Lab 1, 105 Water Ln, Adelaide, SA 5003', 6),
('Hydrology Lab', 'Lab 2, 105 Water Ln, Adelaide, SA 5003', 6);

INSERT INTO storage_locations (storage_name, place_tag, place_tag_id, capacity, equipment)
VALUES
-- Institute-Level Storage Locations
('NanoScience Institute Central Storage', 'institute', 1, 500, 'Temperature Control, Ventilation System'),
('Biomedical Research Institute Central Storage', 'institute', 2, 400, 'Fire Suppression System, Ventilation System'),
('Environmental Science Institute Central Storage', 'institute', 3, 450, 'Humidity Control, Ventilation System'),
-- Research Centre-Level Storage Locations
('Quantum Materials Storage', 'researchCentre', 1, 350, 'Ventilation System, Hazardous Material Safety'),
('Nanotechnology Storage', 'researchCentre', 2, 330, 'Ventilation System, Humidity Control'),
('Cancer Research Storage', 'researchCentre', 3, 350, 'Fire Suppression System, Chemical Safety'),
('Genetics Storage', 'researchCentre', 4, 300, 'Ventilation System, Temperature Control'),
('Climate Change Research Storage', 'researchCentre', 5, 360, 'Humidity Control, Ventilation System'),
('Water Resources Storage', 'researchCentre', 6, 400, 'Ventilation System, Temperature Control'),
-- Laboratory-Level Storage Locations
('Quantum Physics Lab Storage', 'laboratory', 1, 300, 'Ventilation System'),
('Quantum Chemistry Lab Storage', 'laboratory', 2, 320, 'Temperature Control'),
('Nano Materials Lab Storage', 'laboratory', 3, 300, 'Humidity Control'),
('Nano Fabrication Lab Storage', 'laboratory', 4, 250, 'Ventilation System'),
('Oncology Research Lab Storage', 'laboratory', 5, 300, 'Fire Suppression System'),
('Radiology Research Lab Storage', 'laboratory', 6, 250, 'Ventilation System'),
('Gene Sequencing Lab Storage', 'laboratory', 7, 300, 'Temperature Control'),
('Genomics Lab Storage', 'laboratory', 8, 280, 'Humidity Control'),
('Climate Modeling Lab Storage', 'laboratory', 9, 340, 'Ventilation System'),
('Climate Data Lab Storage', 'laboratory', 10, 280, 'Temperature Control'),
('Water Quality Lab Storage', 'laboratory', 11, 330, 'Fire Suppression System'),
('Hydrology Lab Storage', 'laboratory', 12, 380, 'Humidity Control');

INSERT INTO chemical_data (common_name, systematic_name, risk_level, expiry_period)
VALUES
('Acetone', 'Propan-2-one', 2, 24),
('Sodium Chloride', 'NaCl', 1, 60),
('Benzene', 'Cyclohexatriene', 4, 12),
('Formaldehyde', 'Methanal', 5, 18),
('Hydrochloric Acid', 'HCl', 3, 36),
('Ethanol', 'C2H5OH', 2, 24),
('Sodium Hydroxide', 'NaOH', 3, 36),
('Phenol', 'C6H5OH', 4, 18),
('Chloroform', 'CHCl3', 5, 12),
('Ammonium Nitrate', 'NH4NO3', 5, 24);

INSERT INTO users (first_name, last_name, phone, email, role, status, created_by, place_tag, place_tag_id, username, password)
VALUES
-- Easy login for dev
('Re', 'researcher', '+61412345616', 're@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 1, 're', 're'),
('Su', 'supervisor', '+61412345617', 'su@flinders.edu.au', 'supervisor', 'active', 1, 'researchCentre', 1, 'su', 'su'),
('Ap', 'approver', '+61412345618', 'ap@flinders.edu.au', 'approver', 'active', 1, 'researchCentre', 1, 'ap', 'ap'),
('St', 'storage', '+61412345619', 'st@flinders.edu.au', 'storage', 'active', 1, 'institute', 1, 'st', 'st'),
('Ad', 'admin', '+61412345620', 'ad@flinders.edu.au', 'admin', 'active', 1, 'institute', 1, 'ad', 'ad'),

-- Quantum Physics Lab (Lab 1)
('Alice', 'Quantum', '0412000001', 'alice.quantum@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 1, 'alice', 'alice'),
('Bob', 'Wave', '0412000002', 'bob.wave@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 1, 'bob', 'bob'),
('Charlie', 'Particle', '0412000003', 'charlie.particle@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 1, 'charlie', 'charlie'),

-- Quantum Chemistry Lab (Lab 2)
('Diana', 'Photon', '0412000004', 'diana.photon@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 2, 'diana', 'diana'),
('Eve', 'Bond', '0412000005', 'eve.bond@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 2, 'eve', 'eve'),
('Frank', 'Molecule', '0412000006', 'frank.molecule@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 2, 'frank', 'frank'),


-- Nano Materials Lab (Lab 3)
('Grace', 'Nano', '0412000007', 'grace.nano@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 3, 'grace', 'grace'),
('Henry', 'Atom', '0412000008', 'henry.atom@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 3, 'henry', 'henry'),
('Isabel', 'Fabric', '0412000009', 'isabel.fabric@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 3, 'isabel', 'isabel'),

-- Nano Fabrication Lab (Lab 4)
('Jack', 'Nano', '0412000010', 'jack.nano@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 4, 'jack', 'jack'),
('Karen', 'Micro', '0412000011', 'karen.micro@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 4, 'karen', 'karen'),
('Liam', 'Build', '0412000012', 'liam.build@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 4, 'liam', 'liam'),

-- Oncology Research Lab (Lab 5)
('Mary', 'Onco', '0412000013', 'mary.onco@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 5, 'mary', 'mary'),
('Nina', 'Cell', '0412000014', 'nina.cell@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 5, 'nina', 'nina'),
('Oscar', 'Gene', '0412000015', 'oscar.gene@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 5, 'oscar', 'oscar'),

-- Radiology Research Lab (Lab 6)
('Peter', 'Rad', '0412000016', 'peter.rad@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 6, 'peter', 'peter'),
('Quincy', 'Scan', '0412000017', 'quincy.scan@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 6, 'quincy', 'quincy'),
('Rachel', 'Imaging', '0412000018', 'rachel.imaging@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 6, 'rachel', 'rachel'),

-- Gene Sequencing Lab (Lab 7)
('Sarah', 'Gene', '0412000019', 'sarah.gene@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 7, 'sarah', 'sarah'),
('Thomas', 'Sequence', '0412000020', 'thomas.sequence@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 7, 'thomas', 'thomas'),
('Umar', 'Genome', '0412000021', 'umar.genome@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 7, 'umar', 'umar'),

-- Genomics Lab (Lab 8)
('Vera', 'Gene', '0412000022', 'vera.gene@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 8, 'vera', 'vera'),
('Walter', 'DNA', '0412000023', 'walter.dna@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 8, 'walter', 'walter'),
('Xander', 'Code', '0412000024', 'xander.code@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 8, 'xander', 'xander'),

-- Climate Modeling Lab (Lab 9)
('Yasmin', 'Climate', '0412000025', 'yasmin.climate@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 9, 'yasmin', 'yasmin'),
('Zara', 'Weather', '0412000026', 'zara.weather@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 9, 'zara', 'zara'),
('Adam', 'Storm', '0412000027', 'adam.storm@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 9, 'adam', 'adam'),

-- Climate Data Lab (Lab 10)
('Brian', 'Climate', '0412000028', 'brian.climate@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 10, 'brian', 'brian'),
('Carla', 'Data', '0412000029', 'carla.data@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 10, 'carla', 'carla'),
('David', 'Wind', '0412000030', 'david.wind@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 10, 'david', 'david'),

-- Water Quality Lab (Lab 11)
('Eva', 'Water', '0412000031', 'eva.water@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 11, 'eva', 'eva'),
('Franklin', 'Pure', '0412000032', 'franklin.pure@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 11, 'franklin', 'franklin'),
('George', 'Aqua', '0412000033', 'george.aqua@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 11, 'george', 'george'),

-- Hydrology Lab (Lab 12)
('Helen', 'Hydro', '0412000034', 'helen.hydro@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 12, 'helen', 'helen'),
('Isaac', 'Flow', '0412000035', 'isaac.flow@flinders.edu.au', 'researcher', 'active', 1, 'laboratory', 12, 'isaac', 'isaac'),
('Jacks', 'River', '0412000036', 'jacks.river@flinders.edu.au', 'supervisor', 'active', 1, 'laboratory', 12, 'jacks', 'jacks'),

-- Quantum Materials Centre (Research Centre 1)
('Kathy', 'Field', '0412000037', 'kathy.field@flinders.edu.au', 'approver', 'active', 1, 'researchCentre', 1, 'kathy', 'kathy'),

-- Nanotechnology Centre (Research Centre 2)
('Larry', 'Tech', '0412000038', 'larry.tech@flinders.edu.au', 'approver', 'active', 1, 'researchCentre', 2, 'larry', 'larry'),

-- Cancer Research Centre (Research Centre 3)
('Monica', 'Onco', '0412000039', 'monica.onco@flinders.edu.au', 'approver', 'active', 1, 'researchCentre', 3, 'monica', 'monica'),

-- Genetics Centre (Research Centre 4)
('Nathan', 'Gene', '0412000040', 'nathan.gene@flinders.edu.au', 'approver', 'active', 1, 'researchCentre', 4, 'nathan', 'nathan'),

-- Climate Change Centre (Research Centre 5)
('Olivia', 'Climate', '0412000041', 'olivia.climate@flinders.edu.au', 'approver', 'active', 1, 'researchCentre', 5, 'olivia', 'olivia'),

-- Water Resources Centre (Research Centre 6)
('Paul', 'Water', '0412000042', 'paul.water@flinders.edu.au', 'approver', 'active', 1, 'researchCentre', 6, 'paul', 'paul');


INSERT INTO stock (storage_id, chemical_id, quantity, expiry_date, last_updated_by, last_updated_time, is_occupied)
VALUES
(1, 1, 50, '2025-01-01 00:00:00', 4, '2024-08-01 10:00:00', false),
(1, 2, 100, '2025-03-01 00:00:00', 4, '2024-08-05 12:00:00', false),
(1, 3, 120, '2024-11-15 00:00:00', 4, '2024-08-10 14:00:00', false),
(2, 4, 100, '2024-06-30 00:00:00', 4, '2024-08-12 09:00:00', false),
(2, 5, 80, '2025-07-22 00:00:00', 4, '2024-08-15 11:00:00', false),
(2, 6, 120, '2025-12-01 00:00:00', 4, '2024-08-18 16:00:00', false),
(3, 7, 150, '2026-08-20 00:00:00', 4, '2024-08-20 13:00:00', false),
(3, 8, 200, '2025-09-15 00:00:00', 4, '2024-08-22 15:00:00', false),
(3, 9, 50, '2024-03-11 00:00:00', 4, '2024-08-25 10:00:00', false),
(4, 1, 50, '2025-11-01 00:00:00', 4, '2024-08-28 12:00:00', false),
(4, 10, 150, '2026-03-05 00:00:00', 4, '2024-08-30 14:00:00', false),
(4, 3, 80, '2026-02-10 00:00:00', 4, '2024-09-01 09:00:00', false),
(5, 4, 60, '2024-09-10 00:00:00', 4, '2024-09-03 11:00:00', false),
(5, 5, 100, '2025-10-20 00:00:00', 4, '2024-09-05 13:00:00', false),
(5, 6, 90, '2026-01-15 00:00:00', 4, '2024-09-07 15:00:00', false),
(6, 7, 120, '2025-04-14 00:00:00', 4, '2024-09-10 10:00:00', false),
(6, 8, 140, '2026-07-29 00:00:00', 4, '2024-09-12 13:00:00', false),
(6, 9, 70, '2024-12-25 00:00:00', 4, '2024-09-15 15:00:00', false),
(7, 1, 50, '2025-05-10 00:00:00', 4, '2024-09-18 09:00:00', false),
(7, 10, 100, '2026-06-16 00:00:00', 4, '2024-09-20 12:00:00', false),
(7, 3, 50, '2024-09-12 00:00:00', 4, '2024-09-22 14:00:00', false),
(8, 4, 70, '2025-02-20 00:00:00', 4, '2024-09-25 11:00:00', false),
(8, 5, 50, '2024-11-11 00:00:00', 4, '2024-09-28 13:00:00', false),
(8, 6, 90, '2026-05-19 00:00:00', 4, '2024-10-01 15:00:00', false),
(9, 7, 150, '2026-07-30 00:00:00', 4, '2024-10-03 09:00:00', false),
(9, 8, 130, '2025-10-02 00:00:00', 4, '2024-10-05 12:00:00', false),
(10, 9, 100, '2025-12-15 00:00:00', 4, '2024-10-07 14:00:00', false),
(10, 10, 80, '2026-04-05 00:00:00', 4, '2024-10-09 16:00:00', false),
(6, 2, 60, '2026-11-11 00:00:00', 4, '2024-10-12 10:00:00', false),
(3, 1, 30, '2025-01-12 00:00:00', 4, '2024-10-15 11:00:00', false),
(2, 5, 50, '2024-12-01 00:00:00', 4, '2024-10-10 11:00:00', true),    -- Experiment 15 (risk 3 procured)
(3, 10, 90, '2024-11-20 00:00:00', 4, '2024-10-10 11:10:00', true),   -- Experiment 16 (risk 5 procured)
(2, 5, 40, '2024-09-01 00:00:00', 4, '2024-08-15 11:00:00', false),   -- DISPOSAL
(3, 8, 30, '2024-10-10 00:00:00', 4, '2024-09-05 12:00:00', false),   -- DISPOSAL
(7, 10, 50, '2024-11-20 00:00:00', 4, '2024-09-10 10:00:00', false),  -- DISPOSAL
(2, 6, 25, '2024-09-15 00:00:00', 4, '2024-09-12 14:00:00', false),   -- DISPOSAL
(3, 7, 35, '2024-10-15 00:00:00', 4, '2024-09-20 09:00:00', false),   -- DISPOSAL
(4, 9, 45, '2024-10-01 00:00:00', 4, '2024-09-25 15:00:00', false),   -- DISPOSAL
(7, 2, 20, '2024-09-22 00:00:00', 4, '2024-09-18 16:00:00', false),   -- DISPOSAL
(3, 4, 30, '2024-12-10 00:00:00', 4, '2024-09-28 10:00:00', false),   -- DISPOSAL
(4, 3, 60, '2024-11-05 00:00:00', 4, '2024-09-30 12:00:00', false),   -- DISPOSAL
(7, 1, 25, '2024-09-18 00:00:00', 4, '2024-09-19 13:00:00', false),   -- DISPOSAL
(2, 10, 70, '2024-11-11 00:00:00', 4, '2024-09-21 11:00:00', false),  -- DISPOSAL
(4, 5, 55, '2024-10-29 00:00:00', 4, '2024-09-25 17:00:00', false),   -- DISPOSAL
(3, 8, 80, '2024-11-30 00:00:00', 4, '2024-09-28 18:00:00', false),   -- DISPOSAL
(4, 7, 40, '2024-10-13 00:00:00', 4, '2024-10-01 14:00:00', false),   -- DISPOSAL
(3, 9, 60, '2024-12-25 00:00:00', 4, '2024-10-05 15:00:00', false);   -- DISPOSAL


-- Insert 3 experiments with the status 'submitted'
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id)
VALUES
('Study on quantum entanglement properties', true, 1, 'submitted', '2024-10-01 10:00:00', '2024-10-05 11:00:00', 1, 1),
('Nanoparticle drug delivery mechanism', true, 4, 'submitted', '2024-09-20 10:00:00', '2024-09-25 09:00:00', 6, 3),
('Genomic sequencing study', true, 5, 'submitted', '2024-09-15 12:00:00', '2024-09-20 16:00:00', 9, 7);

-- Assign chemicals to 'submitted' experiment
INSERT INTO chemical_assigning (experiment_id, chemical_id, stock_id, quantity)
VALUES
(1, 2, NULL, 50),
(2, 8, NULL, 75),
(2, 7, NULL, 60),
(3, 9, NULL, 40),
(3, 10, NULL, 50),
(3, 4, NULL, 60);

-- Insert 3 experiments with the status 'approved'
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id, first_approver_id, first_approval_time, first_approver_comments)
VALUES
('Advanced Quantum Material Analysis', true, 2, 'approved', '2024-09-01 09:00:00', '2024-09-05 11:00:00', 1, 1, 2, '2024-09-06 14:00:00', 'Approval based on safety compliance'),
('Nanotube Synthesis Study', true, 2, 'approved', '2024-09-12 10:00:00', '2024-09-15 12:00:00', 6, 3, 2, '2024-09-16 16:00:00', 'Initial assessment satisfactory'),
('Gene Editing Impact Study', true, 3, 'approved', '2024-09-20 08:00:00', '2024-09-25 14:00:00', 9, 7, 2, '2024-09-26 10:00:00', 'No major risks identified');

-- Assign chemicals to 'approved' experiment
INSERT INTO chemical_assigning (experiment_id, chemical_id, stock_id, quantity)
VALUES
(4, 6, NULL, 60),
(5, 2, NULL, 50),
(5, 1, NULL, 40),
(6, 2, NULL, 20),
(6, 6, NULL, 30),
(6, 5, NULL, 25);

-- Insert 3 experiments with the status 'escalated'
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id, first_approver_id, first_approval_time, first_approver_comments)
VALUES
('High-Pressure Synthesis of Nanomaterials', true, 4, 'escalated', '2024-09-25 10:00:00', '2024-09-30 11:00:00', 1, 2, 2, '2024-10-01 14:00:00', 'Escalated due to risk level'),
('Cancer Drug Trial with New Compounds', true, 5, 'escalated', '2024-10-01 09:00:00', '2024-10-04 15:00:00', 6, 3, 8, '2024-10-05 10:00:00', 'Escalated due to chemical risks'),
('Advanced Genetic Mutation Analysis', true, 5, 'escalated', '2024-10-05 08:00:00', '2024-10-08 16:00:00', 9, 7, 11, '2024-10-09 09:00:00', 'Additional safety precautions required');

-- Assign chemicals to 'escalated' experiment
INSERT INTO chemical_assigning (experiment_id, chemical_id, stock_id, quantity)
VALUES
(7, 8, NULL, 70),
(8, 9, NULL, 80),
(8, 6, NULL, 60),
(9, 10, NULL, 90),
(9, 4, NULL, 40),
(9, 3, NULL, 50);

-- Insert 2 experiments with the status 'approved' (approved by both approvers)
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id, first_approver_id, first_approval_time, first_approver_comments, second_approver_id, second_approval_time, second_approver_comments)
VALUES
('Synthesis of Nanotubes for Medical Application', true, 4, 'approved', '2024-09-20 10:00:00', '2024-09-25 14:00:00', 1, 2, 2, '2024-09-26 09:00:00', 'Approved based on compliance', 3, '2024-09-27 14:00:00', 'Final approval granted'),
('Genomic Mutation and Cancer Research', true, 5, 'approved', '2024-10-01 08:00:00', '2024-10-04 16:00:00', 6, 3, 8, '2024-10-05 10:00:00', 'Approved with safety measures', 3, '2024-10-06 12:00:00', 'Final approval granted');

-- Assign chemicals to 'approved' experiments
INSERT INTO chemical_assigning (experiment_id, chemical_id, stock_id, quantity)
VALUES
(10, 8, NULL, 65),
(10, 5, NULL, 50),
(11, 9, NULL, 75),
(11, 3, NULL, 40);

-- Insert 3 experiments with the status 'rejected'
-- 1. Rejected by first approver (user ID 2), risk level 2 chemical
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id, first_approver_id, first_approval_time, first_approver_comments)
VALUES
('Preliminary Analysis of Organic Compounds', true, 2, 'rejected', '2024-09-10 09:00:00', '2024-09-12 11:00:00', 1, 2, 2, '2024-09-13 14:00:00', 'Rejected due to insufficient safety precautions');

-- 2. Rejected by second approver (user ID 3), risk level 4 chemical, approved by first approver (user ID 2)
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id, first_approver_id, first_approval_time, first_approver_comments, second_approver_id, second_approval_time, second_approver_comments)
VALUES
('Advanced Synthesis of Carbon Nanotubes', true, 4, 'rejected', '2024-09-20 10:00:00', '2024-09-25 15:00:00', 6, 3, 2, '2024-09-26 10:00:00', 'First approval granted', 3, '2024-09-27 09:00:00', 'Rejected based on potential risks');

-- 3. Rejected by storage control (user ID 4), risk level 5 chemical, approved by first approver (user ID 2) and second approver (user ID 3)
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id, first_approver_id, first_approval_time, first_approver_comments, second_approver_id, second_approval_time, second_approver_comments, stock_control_id, stock_control_checked_time, stock_control_comments)
VALUES
('High-Risk Genetic Experiment on Mutation Effects', true, 5, 'rejected', '2024-10-01 08:00:00', '2024-10-03 13:00:00', 9, 7, 2, '2024-10-04 09:00:00', 'First approval granted', 3, '2024-10-05 12:00:00', 'Second approval granted', 4, '2024-10-06 15:00:00', 'Rejected due to insufficient handling precautions');

-- Assign chemicals to 'rejected' experiments
INSERT INTO chemical_assigning (experiment_id, chemical_id, stock_id, quantity)
VALUES
(12, 5, NULL, 45),
(13, 8, NULL, 70),
(14, 10, NULL, 85);

-- Insert 2 experiments with the status 'procured'
-- 1. Approved by first approver (user ID 2), checked by storage control (user ID 4), risk level 2 chemical
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id, first_approver_id, first_approval_time, first_approver_comments, stock_control_id, stock_control_checked_time, stock_control_comments)
VALUES
('Synthesis of Organic Compounds', true, 3, 'procured', '2024-09-15 09:00:00', '2024-09-18 11:00:00', 1, 2, 2, '2024-09-19 14:00:00', 'Approved by first approver', 4, '2024-09-20 10:00:00', 'Checked and procured by storage control');

-- 2. Approved by first approver (user ID 2) and second approver (user ID 3), checked by storage control (user ID 4), risk level 5 chemical
INSERT INTO experiments (experiment_details, is_risk_assessment_done, highest_risk_level, status, last_saved_date, submission_date, submitted_user_id, place_tag_id, first_approver_id, first_approval_time, first_approver_comments, second_approver_id, second_approval_time, second_approver_comments, stock_control_id, stock_control_checked_time, stock_control_comments)
VALUES
('Genetic Engineering on Plant Growth', true, 5, 'procured', '2024-10-01 10:00:00', '2024-10-04 15:00:00', 6, 3, 2, '2024-10-05 12:00:00', 'First approval granted', 3, '2024-10-06 09:00:00', 'Second approval granted', 4, '2024-10-07 11:00:00', 'Checked and procured by storage control');

-- Assign chemicals to 'procured' experiments
INSERT INTO chemical_assigning (experiment_id, chemical_id, stock_id, quantity)
VALUES
(15, 5, 33, 50),
(16, 10, 34, 90);

-- Insert 15 disposal records
INSERT INTO disposal_logs (chemical_id, stock_id, disposal_date, confirm_by)
VALUES
(5, 33, '2024-10-03 10:00:00', 1),
(8, 34, '2024-10-03 11:00:00', 4),
(10, 35, '2024-10-03 12:00:00', 4),
(6, 36, '2024-10-04 09:00:00', 1),
(7, 37, '2024-10-04 13:00:00', 4),
(9, 38, '2024-10-04 15:00:00', 1),
(2, 39, '2024-10-04 16:00:00', 1),
(4, 40, '2024-10-05 11:00:00', 4),
(3, 41, '2024-10-05 14:00:00', 1),
(1, 42, '2024-10-06 10:00:00', 4),
(10, 43, '2024-10-07 09:00:00', 1),
(5, 44, '2024-10-07 13:00:00', 4),
(8, 45, '2024-10-07 15:00:00', 1),
(7, 46, '2024-10-08 11:00:00', 4),
(9, 47, '2024-10-08 14:00:00', 1);



