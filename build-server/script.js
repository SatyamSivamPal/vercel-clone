const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const mime = require('mime-types');

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIA3FLD435BYOSAZU6H',
        secretAccessKey: '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',
    }
})

const PROJECT_ID = process.env.PROJECT_ID

async function init() {
    console.log('Executing script.js');

    //PATH OF OUTPUT FILE
    const outDirPath = path.join(__dirname, 'output')
    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    //OUTPUT - THE PROCESS
    p.stdout.on('data', function (data) {
        console.log(data.toString());
    })

    //OUTPUT - THE ERROR
    p.stdout.on('error', function (data) {
        console.log("Error", data.toString);
    })


    p.on('close', async function () {

        console.log("Build complete");

        //ALL THE STATIC FILE UPLOAD ON /dist
        const distFolderPath = path.join(__dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, {recursive: true});

        for( const file of distFolderContents)
        {
            const filePath = path.join(distFolderPath, file)
            if(fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading the file', filePath);

            //ON S3 ONLY FILE IS UPLOAD NOT THE FOLDER
            const command = new PutObjectCommand({
                Bucket: 'vercel-clone-satyam',
                Key: `__outputs/${PROJECT_ID}/${filePath}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            console.log('uploaded the file.', filePath);

            await s3Client.send(command);
        }

        console.log("Done ....");

    })
}

init();