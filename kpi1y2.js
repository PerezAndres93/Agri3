// ********************************************************************************************* //
// ********************************************************************************************* //
// KPI1 DE PROYECTO AGRI3
// ELABORADO POR: Jorge Andres Perez Escobar
// FECHA: 04/20/2025
// CAMBIOS: 05/20/2025
// ********************************************************************************************* //
// ********************************************************************************************* //


// ---------------------------------------------------- //
// Parámetros
// ---------------------------------------------------- //
var periodo = 2022;
var proyecto_name = 'SaoManoel';
// 'Samuel_Locks'
// 'Scheffer'
// 'SaoManoel'

// ---------------------------------------------------- //
// Hansen
// ---------------------------------------------------- //


// ---------------------------------------------------- //
// MapBiomas
// ---------------------------------------------------- //
var MapBiomasLC_2022 = ee.Image("users/ingperezescobar/Agri3/MapBiomas/mapbiomas-brazil-collection-90-brasil-2022");
var MapBiomasLC_2023 = ee.Image("users/ingperezescobar/Agri3/MapBiomas/mapbiomas-brazil-collection-90-brasil-2023");
var MapBiomasAlerts = ee.Image("users/ingperezescobar/Agri3/MapBiomas/alerts_mapbiomas");


// ---------------------------------------------------- //
// Condiciones de año
// ---------------------------------------------------- //
if(periodo == 2022){
  var MapBiomasLC = MapBiomasLC_2022;
  print("===================== AÑO DE PROCESAMIENTO: 2022 =====================");
  }

if(periodo == 2023){
  var MapBiomasLC = MapBiomasLC_2023;
  print("===================== AÑO DE PROCESAMIENTO: 2023 =====================");
  }


// ---------------------------------------------------- //
// Límites de proyectos
// ---------------------------------------------------- //
if (proyecto_name == 'Samuel_Locks'){
  // ---------------------------------------------------- //
  // Límites geográficos de Samuel Locks
  // ---------------------------------------------------- //
  var Area_preservacion_permanente = ee.FeatureCollection("users/ingperezescobar/Agri3/SamuelLocks/area_de_preservacao_permanente");
  var Area_do_imovel = ee.FeatureCollection("users/ingperezescobar/Agri3/SamuelLocks/area_do_imovel");
  var Cobertura_do_solo = ee.FeatureCollection("users/ingperezescobar/Agri3/SamuelLocks/cobertura_do_solo");
  var Reserva_legal = ee.FeatureCollection("users/ingperezescobar/Agri3/SamuelLocks/reserva_legal");
}

if (proyecto_name == 'Scheffer'){
  // ---------------------------------------------------- //
  // Límites geográficos de Samuel Locks
  // ---------------------------------------------------- //
  var Area_preservacion_permanente = ee.FeatureCollection("users/ingperezescobar/Agri3/Scheffer/area_de_presercacao_permanente");
  var Area_do_imovel = ee.FeatureCollection("users/ingperezescobar/Agri3/Scheffer/area_do_imovel");
  var Cobertura_do_solo = ee.FeatureCollection("users/ingperezescobar/Agri3/Scheffer/cobertura_do_solo");
  var Reserva_legal = ee.FeatureCollection("users/ingperezescobar/Agri3/Scheffer/reserva_legal");
}

if (proyecto_name == 'SaoManoel'){
  // ---------------------------------------------------- //
  // Límites geográficos de Samuel Locks
  // ---------------------------------------------------- //
  var Area_preservacion_permanente = ee.FeatureCollection("users/ingperezescobar/Agri3/SaoManoel/area_de_preservacao_permanente");
  var Area_do_imovel = ee.FeatureCollection("users/ingperezescobar/Agri3/SaoManoel/area_do_imovel");
  var Cobertura_do_solo = ee.FeatureCollection("users/ingperezescobar/Agri3/SaoManoel/cobertura_do_solo");
}

if (proyecto_name == 'JCX'){
  // ---------------------------------------------------- //
  // Límites geográficos de JCX
  // ---------------------------------------------------- //
  var Area_preservacion_permanente = ee.FeatureCollection("users/jhoanse/Agri3/JCX/Area_de_Preservacao_Permanente");
  var Area_do_imovel = ee.FeatureCollection("users/jhoanse/Agri3/JCX/Area_do_Inmovel");
  var Cobertura_do_solo = ee.FeatureCollection("users/jhoanse/Agri3/JCX/Cobertura_do_Solo");
  var Reserva_legal = ee.FeatureCollection("users/jhoanse/Agri3/JCX/Reserva_Legal");
}


// ---------------------------------------------------- //
// Corte de MapBiomas con la finca
// ---------------------------------------------------- //
var MapBiomasLC_farm = MapBiomasLC.clip(Area_do_imovel);
var MapBiomasAlerts_farm = MapBiomasAlerts.clip(Area_do_imovel);


// ---------------------------------------------------- //
// Proyección de datos de entrada
// ---------------------------------------------------- //
var MapBiomasLCfarm = MapBiomasLC_farm.reproject({
  crs: 'EPSG:5880',
  scale: 30 
});

var MapBiomasAlertsfarm = MapBiomasAlerts_farm.reproject({
  crs: 'EPSG:5880',
  scale: 30 
});




// ================================================================== //
// ================================================================== //
// SECCIÓN DE COBERTURAS DE LA TIERRA
// ================================================================== //
// ================================================================== //
print("ÁREAS DE COBERTURAS DE LA TIERRA");
// ---------------------------------------------------- //
// Calculate area km2 whole area
// ---------------------------------------------------- //
var class_areas = ee.Image.pixelArea().addBands(MapBiomasLCfarm)
  .reduceRegion({
    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'LandCover',
    }),
    geometry: Area_do_imovel,
    crs: 'EPSG:5880',
    scale: 30,  
    maxPixels: 1e13
  })




// ---------------------------------------------------- //
// Calculate area km2 Area_preservacion_permanente
// ---------------------------------------------------- //
var class_areas_Area_preservacion_permanente = ee.Image.pixelArea().addBands(MapBiomasLCfarm.clip(Area_preservacion_permanente))
  .reduceRegion({
    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'LandCover',
    }),
    geometry: Area_preservacion_permanente,
    crs: 'EPSG:5880',
    scale: 30,  
    maxPixels: 1e13
  });


// ---------------------------------------------------- //
// Calculate area km2 Area_preservacion_permanente
// ---------------------------------------------------- //
if (proyecto_name != 'SaoManoel'){
var class_areas_Reserva_legal = ee.Image.pixelArea().addBands(MapBiomasLCfarm.clip(Reserva_legal))
  .reduceRegion({
    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'LandCover',
    }),
    geometry: Reserva_legal,
    crs: 'EPSG:5880',
    scale: 30,  
    maxPixels: 1e13
  });
}



// ================================================================== //
// ================================================================== //
// Deforestation area
// ================================================================== //
// ================================================================== //

// ---------------------------------------------------- //
// Calculate area km2 whole area
// ---------------------------------------------------- //
var class_areas_def = ee.Image.pixelArea().addBands(MapBiomasAlerts)
  .reduceRegion({
    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'Deforestacion',
    }),
    geometry: Area_do_imovel,
    crs: 'EPSG:5880',
    scale: 30,  
    maxPixels: 1e13
  });



// ---------------------------------------------------- //
// Calculate area km2 Area_preservacion_permanente
// ---------------------------------------------------- //
var class_areas_Area_preservacion_permanente_def = ee.Image.pixelArea().addBands(MapBiomasAlerts.clip(Area_preservacion_permanente))
  .reduceRegion({
    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'Deforestacion',
    }),
    geometry: Area_preservacion_permanente,
    crs: 'EPSG:5880',
    scale: 30,  
    maxPixels: 1e13
  });



// ---------------------------------------------------- //
// Calculate area km2 Area_preservacion_permanente
// ---------------------------------------------------- //
if (proyecto_name != 'SaoManoel'){
  var class_areas_Reserva_legal_def = ee.Image.pixelArea().addBands(MapBiomasAlerts.clip(Reserva_legal))
  .reduceRegion({
    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'Deforestacion',
    }),
    geometry: Reserva_legal,
    crs: 'EPSG:5880',
    scale: 30,  
    maxPixels: 1e13
  });
}



// ================================================================== //
// ================================================================== //
// Imprimiendo resultados
// ================================================================== //
// ================================================================== //
print("Area de coberturas en el Deal",class_areas);
print("Área de coberturas en sitios de preservacion permanente",class_areas_Area_preservacion_permanente);
print("Area de coberturas en sitios de reserva legal",class_areas_Reserva_legal);
print(" ");
print("ÁREAS DE DEFORESTACIÓN");
print("Areas de deforestacion por año", class_areas_def);
print("Areas de deforestacion en sitios de preservacion permanente ",class_areas_Area_preservacion_permanente_def);
print("Areas de deforestacion en sitios de reserva legal ",class_areas_Reserva_legal_def);




// ================================================================== //
// ================================================================== //
// Visualización de mapas
// ================================================================== //
// ================================================================== //

var fromList = [3, 4, 5, 6, 9, 11, 12, 15, 18, 19, 20, 21, 22, 23, 24, 25,
                26, 27, 29, 30, 31, 32, 33, 35, 36, 39, 40, 41, 46, 47, 48,
                49, 50, 62];

var toList =   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                32, 33, 34];


var imgRemap = MapBiomasLCfarm.remap({
  from: fromList,
  to: toList,
  //defaultValue: 0,
  bandName: 'classification_' + periodo
});

// ---------------------------------------------------- //
// Leyenda
// ---------------------------------------------------- //
var PaletteLC = [
  '#1f8d49', //3 Forest Formation
  '#7dc975', //4 Savanna Formation
  '#04381d', //5 Mangrove
  '#007785', //6 Floodable Forest
  '#7a5900', //9  Forest Plantation
  '#519799', //11 Wetland
  '#d6bc74', //12 Grassland
  '#edde8e', //15  Pasture
  '#E974ED', //18  Agriculture
  '#C27BA0', //19  Temporary Crop
  '#db7093', //20  Sugar cane
  '#ffefc3', //21  Mosaic of Uses
  '#d4271e', //22  Non vegetated area
  '#ffa07a', //23  Beach  Duna e Areal
  '#d4271e', //24  Urban Area
  '#db4d4f', //25  Other non Vegetated Areas
  '#0000FF', //26  Water
  '#ffffff', //27  Not Observed
  '#ffaa5f', //29  Rocky Outcrop
  '#9c0027', //30  Mining
  '#091077', //31  Aquaculture
  '#fc8114', //32  Hypersaline Tidal Flat
  '#25320000', //33  River  Lago e Oceano
  '#9065d0', //35  Palm Oil
  '#d082de', //36  Perennial Crop
  '#f5b3c8', //39  Soybean
  '#c71585', //40  Rice
  '#f54ca9', //41  Other Temporary Crops
  '#d68fe2', //46  Coffee
  '#9932cc', //47  Citrus
  '#e6ccff', //48  Other Perennial Crops
  '#02d659', //49 Wooded Sandbank Vegetation
  '#ad5100', //50  Herbaceous Sandbank Vegetation
  '#ff69b4', //62  Cotton (beta)  
];

var namesLC = [
  ' ',
  'Forest Formation',
  'Savanna Formation',
  'Mangrove',
  'Floodable Forest',
  'Forest Plantation',
  'Wetland',
  'Grassland',
  'Pasture',
  'Agriculture',
  'Temporary Crop',
  'Sugar cane',
  'Mosaic of Uses',
  'Non vegetated area',
  'Beach  Duna e Areal',
  'Urban Area',
  'Other non Vegetated Areas',
  'Water',
  'Not Observed',
  'Rocky Outcrop',
  'Mining',
  'Aquaculture',
  'Hypersaline Tidal Flat',
  'River  Lago e Oceano',
  'Palm Oil',
  'Perennial Crop',
  'Soybean',
  'Rice',
  'Other Temporary Crops',
  'Coffee',
  'Citrus',
  'Other Perennial Crops',
  'Wooded Sandbank Vegetation',
  'Herbaceous Sandbank Vegetation',
  'Cotton (beta)'
]


// ---------------------------------------------------- //
// Mostrar mapa
// ---------------------------------------------------- //
Map.setOptions('HYBRID')
var empty = ee.Image().byte();

Map.centerObject(Area_do_imovel,10);

Map.addLayer(MapBiomasLCfarm, {palette: PaletteLC, names: namesLC},'classification_' + periodo, false);
Map.addLayer(imgRemap, {palette: PaletteLC},'classification_' + periodo + '_remmaped', true);
print("imgRemap",imgRemap)

var Area_do_imovel_outline = empty.paint({
  featureCollection: Area_do_imovel,
  color: 1,
  width: 2
});
Map.addLayer(Area_do_imovel_outline, {palette: "white"}, 'Area_do_imovel', true); 



var Area_preservacion_permanente_outline = empty.paint({
  featureCollection: Area_preservacion_permanente,
  color: 1,
  width: 1.2
});
Map.addLayer(Area_preservacion_permanente_outline, {palette: "#006400"}, 'Area_preservacion_permanente_outline', false); 


if (proyecto_name != 'SaoManoel'){
var Reserva_legal_outline = empty.paint({
  featureCollection: Reserva_legal,
  color: 1,
  width: 1
});
Map.addLayer(Reserva_legal_outline, {palette: "#cfbe0e"}, 'Reserva_legal', false); 
}


// ================================================================== //
// ================================================================== //
// Exportar datos a tablas
// ================================================================== //
// ================================================================== //
if (proyecto_name != 'SaoManoel'){
var list_data_LC = [class_areas.set("name", "cobertura_areas_finca"),
                    class_areas_Area_preservacion_permanente.set("name", "cobertura_areas_app"),
                    class_areas_Reserva_legal.set("name", "cobertura_areas_reserva_legal")
                    ]
}

if (proyecto_name == 'SaoManoel'){
var list_data_LC = [class_areas.set("name", "cobertura_areas_finca"),
                    class_areas_Area_preservacion_permanente.set("name", "cobertura_areas_app")
                    ]
}

if (proyecto_name != 'SaoManoel'){
var list_data_Def = [class_areas_def.set("name", "deforestacion_areas_finca"),
                     class_areas_Area_preservacion_permanente_def.set("name", "deforestacion_areas_app"),
                     class_areas_Reserva_legal_def.set("name", "deforestacion_areas_reserva_legal")
                     ]
}

if (proyecto_name == 'SaoManoel'){
var list_data_Def = [class_areas_def.set("name", "deforestacion_areas_finca"),
                     class_areas_Area_preservacion_permanente_def.set("name", "deforestacion_areas_app")
                     ]
}


function exportar_tablas_LC(datos){
  var areaList = ee.List(datos.get('groups'));
  
  var features = areaList.map(function(item) {
    item = ee.Dictionary(item);
    var landCover = item.get('LandCover');
    var area_m2 = ee.Number(item.get('sum'));
    var area_ha = area_m2.divide(1e4);  // Convertir a ha
    
    return ee.Feature(null, {
      'LandCover': landCover,
      'Area_ha': area_ha
    });
  });
  
  var nombre = datos.get('name').getInfo()
  
  var areaFC = ee.FeatureCollection(features);
  
  Export.table.toDrive({
  collection: areaFC,
  folder: 'Agri3',
  description: proyecto_name + '_' + nombre + '_' + periodo,
  fileFormat: 'CSV'
});
}

var exportar_LC = list_data_LC.map(exportar_tablas_LC)


function exportar_tablas_Def(datos){
  var areaList = ee.List(datos.get('groups'));
  
  var features = areaList.map(function(item) {
    item = ee.Dictionary(item);
    var landCover = item.get('Deforestacion');
    var area_m2 = ee.Number(item.get('sum'));
    var area_ha = area_m2.divide(1e4);  // Convertir a ha
    
    return ee.Feature(null, {
      'Deforestacion': landCover,
      'Area_ha': area_ha
    });
  });
  
  var nombre = datos.get('name').getInfo()
  
  var areaFC = ee.FeatureCollection(features);
  
  Export.table.toDrive({
  collection: areaFC,
  folder: 'Agri3',
  description: proyecto_name + '_' + nombre + '_' + periodo,
  fileFormat: 'CSV'
});
}

var exportar_Def = list_data_Def.map(exportar_tablas_Def)



// ========================================================== //
// Extracción de nombre de cobertura
// ========================================================== //
// Evento de clic
Map.onClick(function(coords) {
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  var value = imgRemap.sample(point, 30).first().get('remapped');
  
  value.evaluate(function(val) {
    if (val !== null) {
      var name = namesLC[val] || 'Desconocido (' + val + ')';
      print('Cobertura en [' + coords.lon.toFixed(4) + ', ' + coords.lat.toFixed(4) + ']:', name);
    } else {
      print('No hay datos en ese punto.');
    }
  });
});



// TO DO
// ========================================================== //
// Mostrar los datos de deforestación de Hansen y MapBiomas
// ========================================================== //
Map.addLayer(MapBiomasAlertsfarm,{},"MapBiomasAlertsfarm");
// ---------------------------------------------------- //
// Mostrar mapa
// ---------------------------------------------------- //