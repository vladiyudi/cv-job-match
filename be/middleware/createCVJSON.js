const OpenAI = require('openai');
const JSONtemplate = require('../cvTemplates/cvJSON.js');
const cleanJsonString = require('../models/clearJsonString.js');
const trimSkills = require('../models/trimSkils');

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});



async function createCV(req, res, next) {
  try {
    const { cvRaw } = res.locals;  

    const prompt = `Restructure CV written as raw text into JSON format. Here is the raw CV:\n\n${cvRaw}. Here is example of JSON format:\n\n${JSON.stringify(JSONtemplate)}.  Omit preambule and postambule. The output should be only valid JSON`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',  
      messages: [
        {"role": "user", "content": prompt}
      ]
    });
    
    res.locals.cvJSON  =cleanJsonString(response.choices[0].message.content.trim())
    //  res.locals.cvJSON = trimSkills(cvJSON);

    next();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

module.exports = { createCV };  