-- Script para insertar clientes
USE tiquets_db;

-- Inserción de clientes
INSERT INTO usuarios (codcli, nombre, nif, direccion, email, password, rol) VALUES
('8', 'MARINA DE BONAIRE, S.L.', 'B-07289614', 'C/ PUERTO BONAIRE MAL PAS 07409 ALCUDIA', 'info@marinadebonaire.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('13', 'TRES JOTAS, S.L.', 'B-07134729', 'C/ FORMENTERA, 11 07530 SAN LORENZO (MALLORCA)', '3jotas@3jotas.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('14', 'SUMINISTROS SON AMONDA S.L.U.', 'B-07552029', 'CALLE VELAZQUEZ, N.ê 71 07300 INCA (MALLORCA)', 'administracion@sonamonda.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('20', 'FRIGORIFICOS SALOM, C.B.', 'E-07135098', 'AVDA. BAIX DES COS, 95 07500 MANACOR (MALLORCA)', 'frigorificossalom@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('38', 'GESTORIA JUAN AMER, S.L.', 'B-07483191', 'AVD. BAIX DES COS, 46 07500 MANACOR (MALLORCA)', 'gestoria.amer@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('56', 'PARC DE L''AUBA SA', 'A-07105430', 'PSEO. FERROCARRIL, 14 07500 MANACOR (MALLORCA)', 'administracio@parcdelauba.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('58', 'LACADOS FULLANA LLULL S.L.', 'B-07698350', 'C/ ARTA, 78 07500 MANACOR (MALLORCA)', 'fullanallull@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('59', 'SANTANDREU SUREDA S.L.', 'B-07545353', 'C/ XEREGALL, 24 07530 SAN LORENZO (MALLORCA)', 'joanaadela@santandreusureda.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('96', 'MAVERSA MARIMON, S.A.', 'A-07090889', 'PASSEIG FERROCARRIL, 60 07500 MANACOR (MALLORCA)', 'contabilidad@maversa.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('123', 'GASPAR AGUILO FUSTER', NULL, '07500 MANACOR (MALLORCA)', 'cliente-123@corsoft.auto', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('130', 'ALMENDRAS Y FRUTOS SECOS BONANY SL.', 'B-07702129', 'CRTA. PETRA-SANTA MARGARITA KM 1 07520 PETRA (MALLORCA)', 'info@almendrasbonany.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('162', 'CONSTRUCCION FERRER-FRANCO, S.L.', 'B-07938681', 'C/ VERGE DE SANT SALVADOR, 17 A 07550 SON SERVERA (MALLORCA)', 'loli@corsoft.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('163', 'POLPORT, S.L.', 'B-07751498', 'RONDA DEL PORT, 84 4êC 07500 MANACOR (MALLORCA)', 'masport.mallorca@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('173', 'EDYMA S''ILLOT, S.L.', 'B-07706484', 'AVDA. LLOP, 65 07687 S''ILLOT (MALLORCA)', 'edymasillotsl@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('175', 'TORRANDELL-CA''S SIULET, S.L.', 'B-07975410', 'CTRA. MURO, 21 07420 SA POBLA (MALLORCA)', 'cassiulet@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('176', 'SILLERIA LLEVANT 93, S.L.', 'B-07630643', 'C/ LLICENCIAT SEBASTIA PERELLO, 11 07500 MANACOR (MALLORCA)', 'contabilidad@silleriallevant.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('179', 'SEBASTIAN FRAU HIJOS, S.L.', 'B07752223', 'AVDA. MOSSEN ALCOVER, 36 07500 MANACOR (MALLORCA)', 'oficina@sebastianfrau.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('188', 'CONSTRUCCIONES NADAL-NEBOT, S.L.', 'B-07801228', 'C/ES RENTADORS, 6 07560 CALA MILLOR (MALLORCA)', 'info@nadalnebot.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('202', 'REUS MORRO, C.B.', 'E07763113', 'C/ CIRERS, 9 - 1ê 07313 SELVA', 'reusmorrocb@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('225', 'ANTONIO FULLANA DURAN', '78202164-W', 'C/ CARROTJA, 9 07680 PORTO CRISTO (MALLORCA)', 'angels.ma42@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('231', 'KM SEMPRE, S.L.', 'B-07793565', 'RONDA FELANITX, 5 LOCAL 1 07500 MANACOR (MALLORCA)', 'info@kmgrup.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('236', 'FRANCISCO OBRADOR SERVERA', '42959039-F', 'AVDA. COSTA I LLOBERA, 14-A BAJOS 07570 ARTA (MALLORCA)', 'canclaret@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('245', 'HERMANOS MIQUEL GRIMALT, S.L.', 'B-07576663', 'C/CAPDEPERA, 35-40 07500 MANACOR (MALLORCA)', 'hnosmiquelcorreu@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('246', 'JUAN PARERA FEMENIES', '43009430-M', 'PLAØA DE SANT JAUME, 10 07500 MANACOR (MALLORCA)', 'andreu.parera@kibuc.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('257', 'FILLS DE JUAN BISELLACH, S.L.', 'B-57071169', 'MIQUEL COSTA I LLOBERA, 20 07550 SON SERVERA (MALLORCA)', 'domingo@bisellach.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('264', 'DISTRIBUCIONES FORTEZA ARLANDIS SL.', 'B-07952997', 'C/ VILLAFRANCA, 13 07500 MANACOR', 'antonia@forlandis.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('268', 'CAMPO DE GOLF, S.A.', 'A-07166960', 'AP. 202 CTRA. ARTA-CAPDEPERA KM 3,5 07570 ARTA (MALLORCA)', 'antonia@golfcapdepera.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('269', 'APARTAMENTOS TULIPAN, S.A.', 'A-07023922', 'VIA MELESIGENI, S/N 07589 CANYAMEL (CAPDEPERA)', 'administracion@canyamel-classic.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('271', 'MIGUEL MATAMALAS MOREY', '18215552-N', 'C/ JORDI SUREDA, 124 07500 MANACOR (MALLORCA)', 'parquetmanacor@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('274', 'FERRETERIA FUSTER, S.L.', 'B-57111445', 'C/ CONQUISTADOR, S/N 07500 MANACOR (MALLORCA)', 'contabilidad@ferreteriafuster.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('286', 'MORLA-MASCARO,S.L.', 'B-57059008', 'JUAN ALCOVER, 5 POLIG. INDUSTRIAL 07550 SON SERVERA (MALLORCA)', 'info@morlamascaro.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('289', 'CAMP I JARDI VERD, S.L.', 'B-57203267', 'C/ SOLER, 2 07530 SAN LORENZO (MALLORCA)', 'info@campijardiverd.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('296', 'MATENIMIENTOS RAFAEL S.L.', 'B57280240', 'C/ CORB MARI, 4 07660 CALA D''OR', 'raesmu64@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('349', 'TOT BAUXA, S.L.', 'B-57040206', 'C/ CALA MURTA 39 07680 PORTO CRISTO', 'galmespep@hotmail.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('350', 'VIDRES XISCO, S.L.', 'B-57016644', 'C/. JOAN ALCOVER, 44 07200 FELANITX', 'vidresxisco@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('358', 'S''ILLOT PLATJA, S.A.', 'A-07190093', 'C/ ESPERANZA, 18 A 07500 MANACOR', 'info@arcosplaya.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('363', 'ALUMINIS MANACOR, S.L.', 'B-57347577', 'C/PARRES, 87 07500 MANACOR', 'guillem@aluminismanacor.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('370', 'MARIA ISABEL NOLLA MONSERRAT', '42998403-H', 'C/ MARINA, 12 07690 ES LLOMBARDS (SANTANYI)', 'aiguesmariabel@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('393', 'VOLARE, C.B.', 'E-57610700', 'AVDA. ENGINYER GRAU MULET, 22 CALA BONA', 'antoniodelucasantoro@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('405', 'VIDRES MATAMALAS, S.L.', 'B57458218', 'AVDA. FERROCARRIL 07500 MANACOR', 'contabilidad@vidresmatamalas.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('410', 'J. LLITERAS MULET, S.L.', 'B-57467441', 'CTRA. FELANITX, 10 07500 MANACOR', 'j.lliterasmulet@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('429', 'FORN C''AN TOFOL S.L.', 'B-57522062', 'RAMBLA REI EN JAUME Nê13 07500 MANACOR', 'padesauba@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('441', 'EBANISTERIA JARSU, S.L.', 'B07147820', 'C/ GUZMAN EL BUENO, 2 07500 MANACOR', 'barbararll@hotmail.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('446', 'BUILDIBERICA HOTELES S.L.', 'B57568354', 'C/SON MAS, S.N. 07689 CALA ROMANTICA (MANACOR)', 'mselvaggio@tiservinet.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('456', 'CONFECCIONS ESTRANY', '18224843B', 'C/MAR, 11 07540 SON CARRIO', 'confeccionsestrany@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('479', 'LLITERES I FILLS, S.L.U', 'B57229171', 'C/SES PARRES, 42 07500 MANACOR', 'info@transllite.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('483', 'TOLDOS Y CARPAS MANACOR', NULL, NULL, 'info@toldosycarpas.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('488', 'GERMANS BARCELO, C.B.', 'E-07207251', 'C/LLEVANT, 19 07691 S''ALQUERIA', 'tallerbarcelo@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('494', 'MUEBLES FONTANET, S.L.', 'B07620321', 'AVDA. JOAN ALCOVER, 10 07006 PALMA', 'monse@mueblesfontanet.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('499', 'GREGORIO SUAU I VIDAL', '41393842Y', 'CARRER DE CAS MAJORAL, 21 07650 SANTANYI', 'gsuauv@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('502', 'BINIMELIS GARCIAS S.L.', 'B57131021', 'C/ CAN GAYA, 39 07670 PORTO COLOM', 'info@mallorcafincarent.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('510', 'ALOMAR S.A.', 'A-07242464', 'PASEO PUNTA AMER, 26 07560 SA COMA', 'ajomar.admin@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('518', 'CASAL DE LA PAU S''ALTRA SENALLA', 'G07594633', 'POU FONDO, 2 07500 MANACOR', 'casaldelapau@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('527', 'FRANCISCO RODRIGUEZ OTERO', '52969496J', 'C/MARIANO AGUILI, 18 2ê B 07200 FELANITX', 'crispa2012@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('535', 'EBANISTERIA SERRALT, S.A.', 'A07132426', 'AVDA. MOSSEN ALCOVER, 75 07500 MANACOR', 'serralt@serralt.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('537', 'BALEARIC FASTENERS, S.L.', 'B-57466187', 'GREMIO HERREROS 48,NAVE E POLIGONO SON CASTELLO', 'maurits.stock@outloock.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('538', 'SUMMER YACHTS S.L.', 'B57764136', 'BARON DE PINOPAR, 22 , 5êB 07012 PALMA DE MALLORCA', 'contabilidad@summer-yachts.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('540', 'CARNES CAN GUIEM, S.L.', 'B57784241', 'C/CARROTJA, 2 07680 PORTO CRISTO', 'carnescanguiem@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('541', 'ECO SA TEULERA, S.L.', 'B57376576', 'ORTEGA Y GASSET, 13 BAIXOS 07500 MANACOR', 'comptabilitat@ecosateulera.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('545', 'INSTALACIONES SANITARIAS CADESA, SL', 'B57770927', 'C/MARE DE LES NEUS, 3 BAJOS 07500 MANACOR', 'lorena_r.n_tati@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('549', 'AZULEJOS AURORA, S.L.', 'B13139886', 'AVDA. JULIAN SAEZ, POL.SERYCAL 13620 PEDRO MUÚOZ', 'azulejosaurora@grupobdb.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('554', 'EDUARD F. GONZALEZ PORTE', '18225928S', 'C/ DALIES, 7 07560 SA COMA', 'info@contabilidadmallorca.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('563', 'MARIA JUANA PUIGROS LLULL', '18226544-X', 'CAMI DEL MAR, 5 07687 S''ILLLOT', 'antoniapll@msn.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('566', 'MARINES 2001 C.B.', 'E57754103', 'PLAØA SANT ISIDRE, 3 07669 S''HORTA', 'info@fincasamallorca.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('573', 'VUIT CAIXES I MITJA, S.L.', 'B57377764', 'C/ CONVENT, 41 07200 FELANITX', 'info@5caixesimitja.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('574', 'CONFIANZA YACHTING MALLORCA, S.L.', 'B57170755', 'C/PESCADORS, 6 07670 PORTOCOLOM', 'info@bootcharter-portocolom.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('578', 'PASE USTED, S.L.', 'B57692154', 'C/ MARQUES DE FUENTSANTA, 63 07005 PALMA', 'catalina@elaxtic.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('581', 'CA''N RITO C.B.', 'E57473498', 'C/ BASTERA Nê2, 4ê 07200 FELANITX', 'mm@arquitectosforteza.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('582', 'MIQUEL ANGEL FORTEZA ARTIGUES', '18218105N', 'C/ BASTERA Nê2, 2ê 07200 FELANITX', 'mm@arquitectosforteza.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('583', 'D.DISSENY ARQUITECTES FORTEZA, SLP.', 'B57564676', 'C/ BASTERA Nê2, 1ê 07200 FELANITX', 'mm@arquitectosforteza.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('590', 'RENT A CAR ARASH, S.L.', 'B07696628', 'CTRA ANDRATX, KM.10,LOCAL 26-6 07181 PORTALS NOUS', 'info@arashrentacar.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('592', 'JOAN ADROVER MAIMO', '41522994-J', 'C/ RAMON MONCADA, 20 LOCAL 3 07200 FELANITX', 'can_felia_felanitx@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('593', 'VANESSA LEBRON LOPEZ', '43182012-H', 'C/ RAMON MONCADA, 20 LOCAL 3 07200 FELANITX', 'mediterraneanlifesantaponsa@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('594', 'J. BAUZA GENOVART, S.L.', 'B-57756488', 'C/ POU,Nê 102 07530 SANT LLORENØ', 'jbmatcons@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('595', 'VICENTE GYSELS DECAMPS', '43465984-D', 'PASEO SIMON BOLIVAR, 10-C 07680 PORTO CRISTO NOVO', 'info@napkinspain.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('601', 'CATALINA BERGAS SOCIAS', '41518511S', 'PASSEIG D''ANTONI MAURA 29 07500 MANACOR', 'info@fincaholidaymallorca.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('602', 'FUSTERIA CA''N TERET S.L.', 'B57282014', 'CARRER JOAN ALCOVER 07550 SON SERVERA', 'info@fusteriacanteret.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('603', 'SUMINIST. HOTELEROS MALLORQUINES SL', 'B57935017', 'C/ PLAØA FONT VELLA, 26 07300 INCA', 'ventas@suhoma.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('606', 'THE HORSE SHOP, S.L.', 'B57940769', 'C/GREMI D''HORTOLANS, 3 POL. ROSSINY 07009 PALMA DE MALLORCA', 'thsthehorseshop@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('612', 'MIRABEMI 4 ALCUDIA, S.L.', 'B57249682', 'C/FORJA, 5 07400 PORT D''ALCUDIA', 'oficina.mirabemi.maria@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('617', 'MIQUEL FLORIT CAIMARI', '43002330N', 'JUAN LLITERES, 54 07500 MANACOR', 'floritmanacor@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('625', 'VIBRADOS Y PRETENSADOS MANACOR S.A.', 'A07018948', 'CTRA PALMA-ARTA KM 51,2 07500 MANACOR', 'joan@vipsa.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('627', 'DEBUT MALLORCA, S.L.', 'B57165425', 'C/ PERAL, 4 07500 MANACOR', 'accounts@abbacino.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('630', 'YESOS VYMA, S.L.', 'B57308108', 'C/ LLIRIS, 8 PUERTA 5 07560 CALA MILLOR', 'yesosvyma@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('631', 'ISCAR RENT A CAR, S.L.', 'B57651721', 'CTRA. PALMA-ANDRATX, 32 07181 PORTALS NOUS - CALVIA', 'reservas@iscarrentacar.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('632', 'MATIAS MARTORELL ALBONS', '37340695-B', 'C/ CAVALLERIA DE SA GALERA Nê 16 07208 CAS CONCOS', 'tallermartorellcasconcos@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('633', 'POCKET RENTACAR, S.L.', 'B-57069619', 'C/ ISABEL DE SABRAN,1 2êB 07010 PALMA DE MALLORCA', 'info@authomar.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('634', 'JAIME FERRER VIDAL', '43028099K', 'C/ SEBASTIANA CLAR, 20 07650 SANTANYI', 'ferrerjaume@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('639', 'RASUNA CALA MILLOR, S.L.', 'B57998536', 'C/ SON GALTA, 1 07560 CALA MILLOR', 'administracion@rasunasl.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('641', 'MOTORCAR LAGOON, S.L.', 'B07323363', 'AVDA. PEDRO MAS Y REUS, 18 07408 PTO. ALCUDIA', 'cm@autoslagoon.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('645', 'SPORT CENTER PAGUERA, S.L.', 'B57953887', 'AVDA. PAGUERA, 36 07160 CALVIA', 'port.mitja@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('646', 'MARIA ANTONIA MAS DE LA ROSA', '18222967K', 'FERRERS, 28 (POL.IND.MANACOR) 07500 MANACOR', 'info@ferreteriaelpalau.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('650', 'ANALITICA EMPRESARIAL BALEAR, S.L.', 'B-57319303', 'AV. DEL PARC, 74-B 07500 MANACOR (MALLORCA)', 'jgaya78@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('652', 'SILVIA VAN ESSEN', 'X6934873M', 'C/ MOSSÅN ALCOVER, 22 BAJOS 07540 SON CARRIO (MALLORCA)', 'silviavanessen@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('654', 'NURACAR S.L', 'B07702723', 'C/MALLORCA Nê 1 2ê,2à 07760 CIUTADELLA DE MENORCA', 'nuracaralquiler@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('655', 'MAHCIU,S.L.', 'B07283732', 'BOULEVAR DE PEGUERA, 39, Nê4 07160 PEGUERA', 'autosbalears@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('656', 'RENT A CAR BENNASAR SL.', 'B07452089', 'C/ CAMPOS, 33-35 07200 FELANITX', 'info@rentacarbennasar.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('657', 'REFORMAS Y CONST.RC SON SERVERA SLU', 'B57759904', 'C/ VINYA NOVA 5 BAJOS B 07550 SON SERVERA', 'info@todomontaje.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('658', 'SUN CAR DE SOLLER, S.L.', 'B57802183', 'PASEO LA PLAYA, 7 07108 PUERTO DE SOLLER', 'suncarportdesoller@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('660', 'DOBLEVIC PUBLICIDAD, C.B.', 'E16565020', 'C/ JUAN DE LA CIERVA, 2 3A 07500 MANACOR', 'comercial@doblevicpublicidad.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('661', 'THOMAS CAMMERER', 'X2504771W', 'C/DEL PORT, 18 07680 PORTO CRISTO', 'tipic.tc@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('662', 'FERNANDO ROQUERO, C.B.', 'E57671521', 'AVDA. PAGUERA, 30 LOCAL 9 07160 PAGUERA', 'autosroquero@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('663', 'TRIP CARS, S.L.', 'B07567886', 'AVDA. SA COMA, 24 07560 CALA MILLOR', 'tripmiquel@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('665', 'SUN & FUN RENT A CAR, S.L.', 'B57483448', 'CAMINO SON MOSSONS S/N 07611 PALMA (AEROPUERTO)', 'parkflydavid@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('666', 'EDGAR OVELAR', '55087383Z', 'C/ MANACOR, 23 07630 CAMPOS', 'meove@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('669', 'JOAN LLANERAS MESTRE', '41524499T', 'C/ AUSSIAS MARCH, 12 07570 ARTA (MALLORCA)', 'sanimetalarta@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('670', 'MOTOS FORMENTOR, S.L.', 'B07229966', 'PSO.SARALEGUI, 106 07470 PORT DE POLLENØA', 'gestio@formentor.rent', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('674', 'PROTUR CARS, S.L.', 'B57247595', 'AVDA. BELLAVISTA, 2 07560 CALA MILLOR', 'admon@proturcars.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('675', 'VIÚAS RENT A CAR, S.L.', 'B57060071', 'C/ MESTRAL, 1 07687 S''ILLOT', 'joanagelabertv@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('676', 'XOROI CARS S.L.', 'B07421043', 'C/ SANT MARC, 22 07679 COLONIA DE SANT PERE', 'xoroi@infoarta.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('677', 'ROSSLIND SANTA PONØA, S.L.', 'B07154636', 'C/PUIG DEL TEIX, 6 LOCAL 1 07180 SANTA PONSA', 'info@rosslind.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('682', 'SEBASTIA MOREY RIERA', '37342218Q', 'ECONOM PERE BONNIN, 27 07500 MANACOR', 'samallorquina.tia@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('684', 'JOAMAR RG INVERSIONS, S.L.', 'B07990567', 'PASSATJE CUADRANT I, 30 07250 VILAFRANCA', 'joamarsl@yahoo.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('686', 'VALLS ARENAL ALQUILER DE COCHES S.L', 'B16621815', 'C/ SANT BARTOMEU 49 07600 ARENAL', 'reservas@vallsmallorca.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('690', 'HERMANOS LLULL', NULL, 'C/PALMA-MANACOR, 9 07250 VILLAFRANCA', 'juanllull09@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('695', 'MAHCIU,S.L.', 'B07283732', 'BOULEVAR DE PEGUERA, 39, Nê4 07160 PEGUERA', 'autosbalears@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('696', 'TOT ALUMINI I FERRO, S.L.', 'B16650244', 'PASSEIG FERROCARRIL, 75 07500 MANACOR', 'totaluminiiferro@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('698', 'CONSTRUC. DEL SUR HNOS CORTES, SLU', 'B16591752', 'C/ SAN LLUIS, 9 07680 PORTO CRISTO', 'construccionesdelsur2017@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('699', 'BUSCANDO EL VINO, S.L.', 'B16656266', 'C/ JOANA ROCA, 1299 07560 SON SERVERA', 'administracion@microvinos.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('700', 'DIPERMA 2020,S.L.', 'B16658296', 'C/CAMPET, Nê2 BJOS 07200 FELANITX', 'diperma.2020sl@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('702', 'SA BALEAR MARBRES I PEDRES, S.L.', 'B07808033', 'CTRA. DE ALCUDIA S/N KM 0.1 07500 MANACOR', 'igalmes@sabalear.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('704', 'POLO EQUIPAMENT, S.L.', 'B57725335', 'C/ LLUM, 9 07560 CALA MILLOR', 'servetto10@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('706', 'FUNESPAÚA DOS, SLU', 'B88594478', 'C/ DOCTOR ESQUERDO, 138 5ê 28007 MADRID', 'tiyp@funespana.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('707', 'REFORM CENTRE PILATES', 'X0997893-S', 'C/RAMBAL REI EN JAUME 16 1ê B 07500 MANACOR', 'info@reformcentrepilates.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('708', 'COLONO HOME SL', 'B16668113', 'C/ SON MACIA, 4 07500 MANACOR', 'correo@colonomobiliario.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('709', 'KURT RENT A CAR, S.L.', 'B57279713', 'C/ CARROTJA, 43 07680 PORTO CRISTO', 'info@rentacarkurt.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('710', 'AUTOCENTER MALLORCA MEISTERBETRIEB, S.L.', 'B57251654', 'C/ SON BUGADELLES, 4 07180 POLIGONO SON BUGADELLES', 'admin@autocenter-mallorca.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('711', 'REYES GALEANO JAUME', '42959039-F', 'C/ PERE AMOROS, 19 BAIXOS B 07570 ARTA (MALLORCA)', 'reyesgaleano11@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('714', 'FRANMACAA 2003, S.L.', 'B57207862', 'C/ MURTA, 16 07560 SA COMA', 'info@contabilidadmallorca.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('715', 'CAN MARTI FRUTAS S.L.', 'B57112583', 'C/ JUAN RAMON JIMENEZ, 14 07500 PALMA', 'ggalmesmas@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('716', 'AUTOESCOLA CANOVAS, S.L.', 'B07650237', 'AVDA. ES PARC, 28 07500 MANACOR', 'info@centresmedicscanovas.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('717', 'JOAN BONET MASCARO', '41519259G', 'C/ SAN JORGE, 4 07680 PORTO CRISTO', 'totelec.info@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('719', 'LLORENØ BRUNET I ASSOCIATS S.L.', 'B57289399', 'RONDA DEL PORT 9 07500 MANACOR', 'info@brunetarquitectes.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('720', 'CALA PILOTA, S.L.', 'B16629156', 'POLIGONO 15, PARCELA 138. 07680 PORTO CRISTO', 'isabel@vermellpv.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('721', 'ACCES BALEAR, S.L.', 'B57971947', 'C/REI SANØ, 2 07200 FELANITX', 'jaume@accesbalear.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('722', 'ALMENDRAS Y FRUTOS SECOS BONANY SL.', 'B-07702129', 'CRTA PETRA-SANTA MARGARITA KM 1 07520 PETRA (MALLORCA)', 'info@almendrasbonany.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('724', 'LUCIA ARREDONDO ALISES', '43167731-C', 'C/RIU SIL, 10 BAJO 7 Y 8 07180 SANTA PONSA', 'info@centrosentia.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('725', 'HOS MALLORCA, S.L.', 'B05490081', 'CARRER DE SA LLUNA, 56 07100 SOLLER', 'info@hos-mallorca.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('727', 'CONTRATAS GAUDI, S.L.', 'B07659873', 'AV. SON CALIU, 4 SON CALIU', 'info@waypoint-palmanova.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('728', 'CARLAND AUTOMOCION, S.L.', 'B57837783', 'CTRA. VALLDEMOSA, 23 PALMA', 'carlandautomocion@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('731', 'ESTRUCTURAS SASTRE, SL', 'B57995961', 'PARCELA 678, POLIGONO 4 07550 SON SERVERA', 'estructuraspigros@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('732', 'ANTONIO RIDAO CARRION', '27855591-S', 'C/ MARBELLA, 20 - LOCAL 92 07610 CAN PASTILLA', 'info@rentacarsolymar.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('736', 'PLANETA RENT A CAR, S.L.', 'B57265928', 'COMPLEJO CASA PILA, 5 07689 CALAS DE MALLORCA', 'alengos1234@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('737', 'AUTOS CANYAMEL, S.L.', 'B07762875', 'C/ VIA DE LES COVES-CANYAMEL, S/N 07589 CAPDEPERA', 'autoscanyamel@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('738', 'JUAN CARLOS BASSA PASCUAL', '18216794N', 'C/ MALLORCA. 11-1êA 07500 MANACOR', 'info@bassapascual.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('739', 'INSTALACIONES MECANICAS MUÚOZ SLU', 'B57786907', 'AVD. DES PARC, 22 07500 MANACOR', 'alicia@imecaslu.net', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('742', 'MARIA ISABEL SANCHO FUSTER', '37342784F', 'C/ SAN ANDRES, 117 07590 CALA RAJADA', 'sanchofuster@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('744', 'JESUS ACEDO HERNANDEZ', '08870047M', 'C/HOSPITAL,2 07550 SON SERVERA', 'jesusacedo1980@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('747', 'RENT ME STELMAKH MALLORCA, S.L.', 'B57878894', 'GRAN VIA PUIG DE GALATZO, 16 07180 SANTA PONSA (CALVIA)', 'rentmemallorca@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('749', 'TALLER JUNAUTO, S.L.', 'B07770779', 'C/ CALA LLOMBARDS, 2 BAJOS 07009 PALMA', 'rentacar@junauto.es', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('750', 'A&J INSTALACIONES S.C', 'J16600314', 'AVDA. RONDA DEL OESTE, 101 07680 PORTO CRISTO', 'ayjinstalaciones2018@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('751', 'VERONICA SEBASTIANES NAVARRO', '37340485-P', 'C/ ARC DE SANT MARTI, 32 1ê 07400 ALCUDIA', 'vsebastianes@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('752', 'ARTAIMMOBILIEN GESTIONS ESMETRO SL', 'B72651243', 'CARRER CIUTAT, 44 LOCAL 1 07570 ARTA', 'info@artaimmobilien.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('755', 'FIVE POINT, S.L.', 'B72837743', 'C/ PRIMAVERA, 3 07560 CALA MILLOR', 'pablo_ciclon78@icloud.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('756', 'MEDITERRANI BAGS SLU', 'B07914732', 'C/BELLAVISTA, 27 07520 PETRA', 'accounts@bellavistasg.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('757', 'MARIA ANTONIA SUREDA NEGRE', '43024462H', 'AVDA. PROVENSALS, 14 07589 FONT DE SA CALA', 'suredanegre@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('758', 'CAROLINA M. ISAZA ARTEAGAE', '49865610T', 'C/.TEODORO CANET, 22-1-B 07400 PUERTO DE ALCUDIA', 'carolinaisaza6@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('759', 'RENT A CAR DE PROVES, S.L.', NULL, 'VIA PALMA, 100 07500 MANACOR', 'comercial@autocasionmallorca.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('760', 'AUTOS MAR AZUL, S.L.', 'B57096927', 'C/ ORQUIDEAS, 31 07193 PALMANYOLA', 'jaa.marazul@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('761', 'WORLDMOTION, S.L.', 'B57909749', 'CTRA. ARTA, 44 07400 PUERTO DE ALCUDIA', 'r.worldmotion@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('762', 'DISCONT RENT A CAR, S.L.', 'B07607807', 'C/ TARRAGONA, 8 PORTAL B BAJOS P.IZ 07817 SANT JOSEP DE LA TALAIA', 'agusibz@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('764', 'ECUS RENT A CAR, S.L.', 'B07716079', 'AVD. PEDRO VAQUER RAMIS, 12 07181 MAGALUF', 'ecusrentacar1@hotmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('766', 'CRONORENT MANACOR, S.L.', 'B44970473', 'C/ DOCTOR FLEMING, 13 07500 MANACOR', 'mcbcrono@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('767', 'FRANCISCO SUREDA SANCHO', '41370761V', 'VIA DE LES COVES, 52 07589 CANYAMEL', 'suredamas@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('769', 'ELISABETH DR.HOVESTADT', 'Z0793419Q', 'FAHRLOCH. 3 D-52146 WERSELEN', 'ubs@die-kinderarztpraxis-kleinmachnow.de', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('771', 'GUSTAVO LUCAS PASSOS', '52027257S', 'C/ RAMON NADAL, 17- 3A PALMA DE MALLORCA', 'cliente-771@corsoft.auto', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('772', 'INTER BALEAR ESPAÚOLA RENTAL AUTO, S.L.', 'B07560162', 'AVINGUDA DE GABRIEL ROCA, 13 07014 PALMA DE MALLORCA', 'iberautovan@iberautovan.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('773', 'CAN PARRIC LA VILA, SL', 'B16560567', 'CARRER DEN MARCH, 26 07450 SANTA MARGALIDA', 'canparriclavila@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('774', 'TRIPPLE A RENTALS, S.L.', 'B16602427', 'AVDA. CALA FIGUERA, 6 07181 PORTALS NOUS', 'info@avance-cars.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('776', 'SONAMAGAT, C.B.', 'E44906998', 'C/ MAJOR, 48 07520 PETRA', 'info@sonamagat.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('777', 'INDIGENAS DIGITALES, S.L.', 'B72848054', 'CALLE SELLERERS, 25 07300 INCA', 'jjcampos@indigenasdigitales.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('779', 'RAQUEL SABATER EKELSCHOT', '37340847W', 'C/ D''EL GALIO, 15 07660 CALA D''OR', 'rachelsabater77@gmail.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('780', 'MIGUEL ANGEL GARZA ALGAS', 'B56730658', 'AVDA DEL TREN,74 07500 MANACOR', 'info@fincaria.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario'),
('2005', 'ESPECIALIT. DE BALEARS BÅ DE SAL SL', 'B-57340192', 'C/VILAFRANCA, 13 07500 MANACOR', 'neus@forlandis.com', '$2a$10$Yiw5CbgxC.yGLvcZYUdq0.CgeaohuvOM9lV.PO0/kk19z9aFKWVGC', 'usuario');
