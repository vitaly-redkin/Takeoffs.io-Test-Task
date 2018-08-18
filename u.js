var takeoff_id = '1';
var page_number = 1;
var bboxes = [[0, 0, 10, 10], [10, 10, 20, 20]]

db.takeoff.update(
 {'_id': takeoff_id},
 {'$set':
  {'pages.$[elem].bboxes': bboxes}             
 },
 {'multi': true,
  'arrayFilters': [{'elem.page_number': page_number}]             
 }
)


var takeoff_id = '1';
var page_number = 1;
var bboxes = [[111110, 0, 10, 10], [10, 10, 20, 20]]

db.takeoff.update(
 {'_id': takeoff_id},
 {'$set':
  {'pages.$[elem].bboxes': bboxes}             
 },
 {'multi': false,
  'arrayFilters': [{'elem.page_number': {'$gt': page_number}}]             
 }
)
