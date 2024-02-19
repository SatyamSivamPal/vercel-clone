const express = require('express');
const {generateSlug} = require('random-word-slugs');
const { RunTaskCommand, ECSClient} = require('@aws-sdk/client-ecs');

const app = express();
const PORT = 9000;

const ECSClient = new ECSClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIA3FLD435BYOSAZU6H',
        secretAccessKey: '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',
    }
})

const config = {
    CLUSTER: 'arn:aws:ecs:us-east-1:767398043459:cluster/builder-cluster',
    TASK: 'arn:aws:ecs:us-east-1:767398043459:task-definition/builder-task'
}

app.use(express.json());

app.use('/project', async (req, res) => {
    const {gitUrl} = req.body;
    const projectSlug = generateSlug();

    //ECS
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefintion: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-004adadb5dd9f989a', 'subnet-084f56bdf299a2966', 'subnet-0f2209f1ceea042ae', 'subnet-01cb2965236b39756', 'subnet-084cdd1afbd730091', 'subnet-01a6cfcfca7e86a18'],
                securityGroups: ['sg-05fb6cf373074550f']
            } 
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        {name: 'GIT_REPOSITORY__URL', value: gitUrl},
                        {name: 'PROJECT_ID', value: projectSlug}
                    ]
                }
            ]
        }
    })
    await ECSClient.send(command);
    return res.json({ status: 'queued', data: {projectSlug, url: `http://${projectSlug}.localhost:8000`}})
})

app.listen(PORT, () => console.log(`Reverse Proxy running at ... ${PORT}`));