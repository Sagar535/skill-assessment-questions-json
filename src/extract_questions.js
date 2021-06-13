const fs = require('fs')
const fetch = require('node-fetch')
const resourceUrl = 'https://raw.githubusercontent.com/Ebazhanov/linkedin-skill-assessments-quizzes/master/'

const questionRegex = /#### /
const optionRegex = /- \[.+\]/
const trueOptionRegex = /- \[x\]/
const illustratorRegex = /```/

let skillList 

skillList = fs.readFileSync('./resources/skills.json','utf8')

console.log(typeof(skillList))
const skills = JSON.parse(skillList)
console.log(skills)

skills.forEach(({skill_name, skill_link}) => {
	// const prettySkill = skill.substring(1, skill.length-1).toLowerCase()
	// console.log(prettySkill)
	let questionText

	console.log(`${resourceUrl}${skill_link}`)

	fetch(`${resourceUrl}${skill_link}`)
            .then(response => response.text() )
            .then(data => (questionText = data))
            .then(() => {
            	const textLines = questionText.split('\n').filter(item => item) // since for '' item is falsey it will filter nicely

			    let same_question = false
			    let illContinue = false
			    let illustrator = []
				let quizes = []


			    // console.log(textLines)

			     textLines.forEach((item) => {
			        // first lets pickout the questions
			        if(questionRegex.test(item)) {
			            const question = item.substring(8, item.length)
			            // questions.push(question)
			            same_question = false
			            quizes.push({question, options: [], illustrator: ''})
			            illustrator = []
			        }
			        else if(illustratorRegex.test(item)) {
			            illContinue = !illContinue
			            illustrator.push(item)
			            if(!illContinue) { quizes[quizes.length-1].illustrator = (illustrator.join('\n')) }
			        }
			        else if(illContinue) {
			            illustrator.push(item)
			        }
			        else if(optionRegex.test(item)) {
			            // track if the option is for same question or new one
			            const correct = trueOptionRegex.test(item)
			            if(!same_question) {
			                quizes[quizes.length-1].options = [{text: item.substring(6, item.length), correct}]
			            } else {
			                quizes[quizes.length-1].options.push({text: item.substring(6, item.length), correct})
			            }
			            same_question = true
			            illustrator = []
			        }
			    })
				// console.log(quizes)
				fs.writeFile(`./resources/${skill_name}.json`, JSON.stringify(quizes), 'utf8', (err) => {
						if(err) console.log(err)

						console.log("skill_name " + skill_name + " saved to the file")
					})
            })
})
