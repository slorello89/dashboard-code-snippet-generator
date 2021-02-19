const https = require('https');
const fs = require('fs');
// const readline = require('readline');
const yaml = require('js-yaml');
const PRIMARY_BRANCH_NAME = 'master';

async function getJsonFromCodeSnippet(keys_to_replace_client, keys_to_replace_code){
    return new Promise(resolve=>{

        const file = fs.createWriteStream('./out/code-snippet.yaml')    
        const request = https.get('https://raw.githubusercontent.com/Nexmo/nexmo-developer/main/_examples/voice/make-an-outbound-call-with-ncco/csharp.yml', function(response){    
        response.pipe(file);
        file.on('finish', async function(){
            file.close();

            let fileContents = fs.readFileSync('./out/code-snippet.yaml');
            let data = yaml.load(fileContents);
            let obj = {};
            let top_level_syntax = "Bash"
            obj.sections = [];
            if(data.language == 'dotnet'){
                obj.syntax='Csharp';
                top_level_syntax = 'Csharp'
                obj.sections.push(
                    {
                        "header":"Install the library",
                        "code":"dotnet add package Vonage",
                        "keysToReplace":[],
                        "syntax":"Bash"
                    });
            }
            else if(data.language == 'curl'){
                obj.syntax='bash';
            }
            else if(data.language == 'java'){
                obj.syntax='java';
                top_level_syntax = 'java'
            }
            else if(data.language == 'node'){
                obj.syntax='javascript';
                top_level_syntax = 'node'
            }
            else if(data.language == 'ruby'){
                obj.syntax='Ruby';
                top_level_syntax = 'Ruby'
            }
            else if(data.language == 'python'){
                obj.syntax='Python';
                top_level_syntax = 'Python'
            }
            else if(data.language == 'php'){
                obj.syntax='PHP';
                top_level_syntax = 'PHP'
            }
            if (data.import_dependencies){
                let lines = await getLinesFromGithubFile(data.import_dependencies.source, data.import_dependencies.from_line, data.import_dependencies.to_line);
                import_section = {"header" : "Import Dependencies", "code" : lines, "keys_to_replace":[]}                
                sections.append(import_section);
            }
            if (data.client){
                let lines = await getLinesFromGithubFile(data.client.source, data.client.from_line, data.client.to_line);
                init_section = {
                    "header":"Initialize the Library",
                    "code":lines,
                    "keys_to_replace":keys_to_replace_client
                }
                sections.append(init_section)
            }
            if(data.code){
                let lines = await getLinesFromGithubFile(data.code.source, data.code.from_line, data.code.to_line);
                code_section = {
                    "header":"Write the code",
                    "code":lines,
                    "keys_to_replace":keys_to_replace_code
                };
            }
        });
    });
});    
}

async function getLinesFromGithubFile(pathToFile, fromLine, toLine){
    return new Promise(resolve=>{

        url = pathToFile.replace('.repos/','https://raw.githubusercontent.com/');
        url = url.replace('-snippets/', `-snippets/${PRIMARY_BRANCH_NAME}/`);
        
        https.get(url,(response)=>{
            stream = fs.createWriteStream('./out/.tmp')
            response.pipe(stream)
            stream.on("finish",()=>{
                stream.close();
                var f = fs.readFileSync('./out/.tmp', 'utf8');            
                var lines = f.split("\n").slice(fromLine-1,toLine-1);
                var ret = '';
                lines.forEach((element, index, theArray)=>{
                    ret += element.trim()+' \\n ';
                });
                resolve(ret)
            });
        });
    });
        
}

let d = getJsonFromCodeSnippet((yml)=>{
    // console.log(yml);
});


