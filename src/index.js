const { FilterCenterFocus } = require('@material-ui/icons')
const { assert } = require('console')

const url = 'https://gateway-service.revealmobile.com'
const email = 'engineering+bevan20220506@revealmobile.com'
const password = 'TApiNIi'
const sessionEndpoint = "/session"
const conversionDailyEndpoint = "/report/campaign/4521/conversion/daily"

const fetchToken = async () => {
	return fetch(url+sessionEndpoint,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'email_address': email,
			'password': password
		})
	}).then(res=>{
		return res.json()
	}).then(json=>{
		return json.data
	})
}
const fetchRetry = async(fetchFunc, token, n = 5) =>{
	for(let i=0;i < n;i++){
		try{
			return await fetchFunc(token);
		}catch(err){
			console.log("request failed retrying "+err)
			const isLastAttempt = i+1 === n
			if(isLastAttempt) throw err
		}
	}
}

//total conversions
//total conversions by device type(primary vs house)
//total conversions by conversions type(pixel vs audience)
//average daily conversions
//average daily conversions by device type(primary vs household)
//average daily conversions by conversion type(pixel vs audience)
function getAllConversions(tokenStuff) {
	return tokenStuff.then(token=>{
		console.log(`sending get to ${url+conversionDailyEndpoint}`)
		return fetch(url+conversionDailyEndpoint,{
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': token
		}
		})
	}).then(res=>res.json()).then(rows=>rows.data.rows)
}

 function sumConversions(conversionsData, logString=""){
	return conversionsData.then(data=>{
		const sum = data.reduce((total, row)=>total+=parseInt(row.metrics["Conversion Count"]),0);
		console.log(logString+" conversions: "+sum)
		return sum;
	})
 }
 function filterConversionData(conversionData,filterfunc){
	return conversionData.then(data=>data.filter(dataToFilter=>filterfunc(dataToFilter)))
 }

 function organizeDataByDate(conversionsData){
	return conversionsData.then(datum=>{
		let conversionsMap = {}
		datum.map(data=>{
			const date = data.dimensions.Date
			conversionsMap[date] ? conversionsMap[date].push(data) : conversionsMap[date] = [data]
		})
		return conversionsMap
	})
 }

 function averageDailyConversions(mapOfDates,logString=""){
	 return mapOfDates.then(mapDates=>{
		 const avPerDay = Object.values(mapDates).flatMap(i=>i).reduce((a,b)=>a + parseInt(b.metrics["Conversion Count"]),0)/(Object.values(mapDates).flatMap(i=>i).length)
		 console.log(`${logString} average daily conversion is ${avPerDay}`)
		 return avPerDay
	 })
 }

function main(){
	const token = fetchToken()
	const allConversions = fetchRetry(getAllConversions, token, 5)

	sumConversions(allConversions,"all")

	const filteredByPrimary = filterConversionData(allConversions, (data)=>{return data.dimensions["Device Type"] === "primary_device"})
	const filteredByHousehold = filterConversionData(allConversions, (data)=>{ return data.dimensions["Device Type"] === "household_device"})
	const filteredByPixel = filterConversionData(allConversions, (data)=>{ return data.dimensions["Conversion Type"] === "pixel"})
	const filteredByAudience = filterConversionData(allConversions, (data)=>{ return data.dimensions["Conversion Type"] === "audience"})

	sumConversions(filteredByPrimary,"primary")
	sumConversions(filteredByHousehold,"household")

	sumConversions(filteredByPixel,"pixel")
	sumConversions(filteredByAudience,"audience")
	averageDailyConversions(organizeDataByDate(allConversions),"all")
	averageDailyConversions(organizeDataByDate(filteredByHousehold),"household")
	averageDailyConversions(organizeDataByDate(filteredByPrimary),"primary")
	averageDailyConversions(organizeDataByDate(filteredByPixel),"pixel")
	averageDailyConversions(organizeDataByDate(filteredByAudience),"audience")
}

module.exports = { filterConversionData, sumConversions, organizeDataByDate, averageDailyConversions }

