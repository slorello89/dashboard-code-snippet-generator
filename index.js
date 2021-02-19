const https = require('https');
const fs = require('fs');
const readline = require('readline');
const yaml = require('js-yaml');
const PRIMARY_BRANCH_NAME = 'master';

function getJsonFromCodeSnippet(cb){
    const file = fs.createWriteStream('out/code-snippet.yaml')
    const request = https.get('https://raw.githubusercontent.com/Nexmo/nexmo-developer/main/_examples/voice/make-an-outbound-call-with-ncco/csharp.yml', function(response){
    response.pipe(file);
    file.on('finish', function(){            
            file.close();


            let fileContents = fs.readFileSync('./out/code-snippet.yaml');
            let data = yaml.load(fileContents);
            let obj = {};
            obj.sections = [];
            if(data.language == 'dotnet'){
                obj.syntax='Csharp';
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
            }
            else if(data.language == 'node'){
                obj.syntax='javascript';
            }
            else if(data.language == 'ruby'){
                obj.syntax='Ruby';
            }
            else if(data.language == 'python'){
                obj.syntax='Python';
            }
            else if(data.language == 'php'){
                obj.syntax='PHP';
            }
            if (data.import_dependencies){
                
            }
            getLinesFromGithubFile(data.code.source,data.code.from_line,data.code.to_line);
            cb(data);
        });
    });
}

function getLinesFromGithubFile(pathToFile, fromLine, toLine){
    url = pathToFile.replace('.repos/','https://raw.githubusercontent.com/');
    url = url.replace('-snippets/', `-snippets/${PRIMARY_BRANCH_NAME}/`);

    https.get(url,(response)=>{
        stream = fs.createWriteStream('.tmp')
        response.pipe(stream)
        stream.on("finish",()=>{
            stream.close();
            var f = fs.readFileSync('.tmp', 'utf8');            
            var lines = f.split("\n").slice(fromLine-1,toLine-1);
            var ret = '';
            lines.forEach((element, index, theArray)=>{
                ret += element.trim()+' \\n ';
            });
            console.log(ret);
        })        
    })    
}

let d = getJsonFromCodeSnippet((yml)=>{
    console.log(yml);
});


