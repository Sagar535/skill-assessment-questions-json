const fetch = require("node-fetch");
const fs = require('fs');

const extractRegex = /\[.*?\]/
const linkRegex = /\(.*?\)/
const resourceUrl = 'https://raw.githubusercontent.com/Ebazhanov/linkedin-skill-assessments-quizzes/master/README.md'

const manualSkillLinks = {
	'[C (Programming Language)]': 'c-(programming-language)/c-quiz.md',
	'[Search Engine Optimization (SEO)]': 'seo/search-engine-optimization-quiz.md',
	'[Transact-SQL (T-SQL)]':'t-sql/t-sql-quiz.md',
	'[Visual Basic for Applications (VBA)]':'vba/vba-quiz.md',
	'[.NET Framework]': 'dotnet-framework/dotnet-framework-quiz.md',
	'[Google Cloud Platform (GCP)]': 'google-cloud-platform/gcp-quiz.md',
	'[Microsoft Outlook]':'microsoft-outlook/microsoft-outlook-quiz.md'
}

// first get the raw markdown from the remote
const get_skill_titles = async () => {
	let rawText
	
	await fetch(resourceUrl)
			.then(response => response.text())
			.then(data => (rawText= data))

	const rawArray = rawText.split("\n")

	const links = rawArray.filter((item) => {
		if(item.match(extractRegex)) return item.match(extractRegex)[0]
	})

	// console.log(links)

	let skills = []
	let skill_names = []
	links.forEach((item) => {
		const skill_name = item.match(extractRegex)[0]
		skill_names.push(skill_name)
		skills.push({
			skill_name: skill_name.split(' ').join('-'),
			skill_link:  manualSkillLinks[skill_name] || item.match(linkRegex)[0].substring(1, item.match(linkRegex)[0].length - 1)
		})
	})
	// Filter out first 3 and last 4
	skills = skills.slice(3, skills.length-4)
	skill_names = skill_names.slice(3, skill_names.length-4)
	console.log(skills.slice(3, skills.length-4))
	// write just the list of skills name
	fs.writeFile("./resources/skill_names.json", JSON.stringify(skill_names), 'utf8', (err) => {
		if(err) console.log(err)

		console.log("List of skills saved to the file")
	})

	// write skills with name and link
	fs.writeFile("./resources/skills.json", JSON.stringify(skills), 'utf8', (err) => {
		if(err) console.log(err)

		console.log("List of skills saved to the file")
	})
}

get_skill_titles()
