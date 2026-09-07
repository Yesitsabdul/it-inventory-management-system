const { Category } = require('./dist/database/entities/category.entity');
const { classToPlain, instanceToPlain } = require('class-transformer');

const cat = new Category();
cat.id = 1;
cat.name = 'Test';
cat.referenceCount = 5;

console.log('Plain:', instanceToPlain(cat));
