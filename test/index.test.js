const assert = require('assert')
const { describe } = require('mocha')
const {filterConversionData, sumConversions, organizeDataByDate, averageDailyConversions} = require('../src/index.js')

const allConversions = new Promise((resolve,reject)=> {
	resolve([
  {
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "household_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 10,
    },
  },
  {
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "household_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },
  {
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "primary_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },
  {
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "primary_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 30,
    },
  },
  {
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "household_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 10,
    },
  },
  {
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "household_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },
  {
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "primary_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },
  {
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "primary_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 30,
    },
  },
])}) 
describe('Filter by fields work', function() {
	it('Filter by device type works', async function(){
		const actualPrimary = await filterConversionData(allConversions, (data)=>{return data.dimensions["Device Type"] === "primary_device"})
		const expectedPrimary = [{
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "primary_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },
  {
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "primary_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 30,
    },
  },{
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "primary_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },
  {
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "primary_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 30,
    },
  		}]
		const actualHousehold = await filterConversionData(allConversions, (data)=>{ return data.dimensions["Device Type"] === "household_device"})
		const expectedHousehold = [{
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "household_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 10,
    },
  },
  {
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "household_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },{
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "household_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 10,
    },
  },
  {
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "household_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },]
		assert.deepEqual(actualPrimary,expectedPrimary, "Primary filtering has failed")
		assert.deepEqual(actualHousehold,expectedHousehold, "Household filtering has failed")
	})
	it('Filter by conversion type works', async function(){
		const actualPixel = await filterConversionData(allConversions, (data)=>{ return data.dimensions["Conversion Type"] === "pixel"})
		const expectedPixel = [
			{
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "household_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 10,
    },
  },{
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "primary_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },{
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "household_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 10,
    },
  },{
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "primary_device",
      "Conversion Type": "pixel",
    },
    metrics: {
      "Conversion Count": 20,
    },
  }
		]
		const actualAudience = await filterConversionData(allConversions, (data)=>{ return data.dimensions["Conversion Type"] === "audience"})
		const expectedAudience = [{
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "household_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },{
    dimensions: {
      Date: "04-15-2022",
      "Device Type": "primary_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 30,
    },
  },{
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "household_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 20,
    },
  },{
    dimensions: {
      Date: "04-16-2022",
      "Device Type": "primary_device",
      "Conversion Type": "audience",
    },
    metrics: {
      "Conversion Count": 30,
    },
  	},]
		assert.deepEqual(actualPixel, expectedPixel, "Pixel filtering failed")
		assert.deepEqual(actualAudience,expectedAudience, "Audience filtering failed")
	})
})
describe('Sum Conversions works', function() { 
	it("SumConversions works correctly",async function(){
		const actualSum = await sumConversions(allConversions)
		assert.strictEqual(actualSum,160,"expected sumConversions to work")
	})
 })
describe('OrganizeDataByDate Works', function() {
	it("OrganizeDataByDate works correctly", async function(){
		const actualDate = await organizeDataByDate(allConversions)
		const expectedDate={
  "04-15-2022": [
    {
      dimensions: {
        Date: "04-15-2022",
        "Device Type": "household_device",
        "Conversion Type": "pixel",
      },
      metrics: {
        "Conversion Count": 10,
      },
    },
    {
      dimensions: {
        Date: "04-15-2022",
        "Device Type": "household_device",
        "Conversion Type": "audience",
      },
      metrics: {
        "Conversion Count": 20,
      },
    },
    {
      dimensions: {
        Date: "04-15-2022",
        "Device Type": "primary_device",
        "Conversion Type": "pixel",
      },
      metrics: {
        "Conversion Count": 20,
      },
    },
    {
      dimensions: {
        Date: "04-15-2022",
        "Device Type": "primary_device",
        "Conversion Type": "audience",
      },
      metrics: {
        "Conversion Count": 30,
      },
    },
  ],
  "04-16-2022": [
    {
      dimensions: {
        Date: "04-16-2022",
        "Device Type": "household_device",
        "Conversion Type": "pixel",
      },
      metrics: {
        "Conversion Count": 10,
      },
    },
    {
      dimensions: {
        Date: "04-16-2022",
        "Device Type": "household_device",
        "Conversion Type": "audience",
      },
      metrics: {
        "Conversion Count": 20,
      },
    },
    {
      dimensions: {
        Date: "04-16-2022",
        "Device Type": "primary_device",
        "Conversion Type": "pixel",
      },
      metrics: {
        "Conversion Count": 20,
      },
    },
    {
      dimensions: {
        Date: "04-16-2022",
        "Device Type": "primary_device",
        "Conversion Type": "audience",
      },
      metrics: {
        "Conversion Count": 30,
      },
    },
  ],
}
		assert.deepEqual(actualDate, expectedDate, "Organize by date fails")
	} )
})
describe('averageDailyConversions works', function() {
	it("averageDailyConversions averages correctly", async function(){
		const inputData = new Promise((resolve,reject) => {
			resolve({'4-15-2022':[
			{
      dimensions: {
        Date: "04-15-2022",
        "Device Type": "household_device",
        "Conversion Type": "pixel",
      },
      metrics: {
        "Conversion Count": 10,
      },
    },
		],
	'4-16-2022':[
			{
      dimensions: {
        Date: "04-15-2022",
        "Device Type": "household_device",
        "Conversion Type": "pixel",
      },
      metrics: {
        "Conversion Count": 30,
      },
    },
		]})
	})
		const actualDailyConversions = await averageDailyConversions(inputData);
		assert.deepEqual(actualDailyConversions, 20, "daily conversions failed")
	})
})