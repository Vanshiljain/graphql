#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const args = process.argv.splice(process.execArgv.length + 2);
const readline = require("readline");
const yaml = require("js-yaml");
const { exec, spawn, execSync } = require("child_process");
const treeKill = require("tree-kill");
const executedApplications = loadExecutedApplications();
const Table = require("cli-table");

const userCommand = args[0];
const executedApplicationsFile = path.join(
  __dirname,
  "executedApplications.json"
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!userCommand) {
  console.info(`Usage: wynn <command>

  Command List:
  1. init “ymlfilepath”
  2. ls  — this will list all configured apps
  3. start appId — this will start a configured app
  4. stop appId — this will stop a configured app
  5. delete appId — this will delete the app
  6. -help  — this will display all available cmds as help to developer
  7. log appId — this will display logs of process happening into app
  `);

  process.exit(1);
}

function loadExecutedApplications() {
  try {
    const data = fs.readFileSync("./executedApplications.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function generateAppId() {
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveExecutedApplications(applications) {
  const data = JSON.stringify(applications, null, 2);
  try {
    fs.writeFileSync(executedApplicationsFile, data, "utf-8");
    console.log("File written successfully");
  } catch (error) {
    console.error("Error writing to the file:", error);
  }
}

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function build(repoName, userName, startCommand, path) {
  process.chdir(path);

  const repoUrl = `https://github.com/${userName}/${repoName}`;

  console.log("Executing: git clone", repoUrl);
  const cloneResult = await executeCommand("git clone " + repoUrl);
  console.log("Clone Result:", cloneResult);

  process.chdir(repoName);

  //   console.log("Executing: git checkout", commitHash);
  //   const checkoutResult = await executeCommand("git checkout " + commitHash);
  //   console.log("Checkout Result:", checkoutResult);

  console.log("Installing project dependencies");
  const installResult = await executeCommand("npm install");
  console.log("Install Result:", installResult);

  //   console.log("Building the application using npm");
  //   const buildResult = await executeCommand("npm run build");
  const executedApp = {
    AppId: generateAppId(),
    Name: "Build",
    RepositoryName: repoName,
    UserName: userName,
    startCommand: startCommand,
    // commitHash: commitHash,
    status: "stopped",
    timestamp: new Date().toLocaleString(),
    path: path,
    pid: 0,
  };
  executedApplications.push(executedApp);
  saveExecutedApplications(executedApplications, executedApplicationsFile);
  // console.log("Build Result:", buildResult);
}

switch (userCommand) {
  case "init":
    const ymlPath = args[1];
    const fileContents = fs.readFileSync(ymlPath, "utf8");
    const data6 = yaml.load(fileContents);
    build(data6.mongoRepo.name, data6.githubUser.username, "nest start", "./");
    break;

  case "ls":
    const jsonData = loadExecutedApplications();
    if (jsonData.length === 0) {
      console.log("No data to display.");
      break;
    }
    const headerNames = Object.keys(jsonData[0]);
    const table = new Table({
      head: headerNames,
    });
    jsonData.forEach((item) => {
      table.push(headerNames.map((header) => item[header]));
    });
    console.log(table.toString());
    process.exit(0);

  case "start":
    const AppId = args[1];
    console.log("Application Id:", AppId);
    AppId;
    const data = loadExecutedApplications();
    process.chdir(data[0].path);

    if (data.length === 0) {
      console.log("No data to display.");
      rl.close();
    } else {
      const app = data.find((item) => item.AppId == AppId);
      console.log(app);

      if (!app) {
        console.log("No application found with the name:", AppId);
        rl.close();
      } else if (app.status === "active") {
        console.log("Application is already running.");
        rl.close();
      } else {
        process.chdir(app.RepositoryName);
        console.log("Current working directory:", process.cwd());

        const child = spawn("nohup", app.startCommand.split(" "), {
          shell: true,
          detached: true,
          stdio: "ignore",
        });
        child.unref();
        console.log("Child PID:", child.pid);

        const pid = child.pid;
        if (!isNaN(pid)) {
          console.log("Application started successfully with PID:", pid);
          app.status = "active";
          app.timestamp = new Date().toLocaleString();
          app.pid = pid;
          saveExecutedApplications(data);
          console.log("Updated JSON Data:", JSON.stringify(data, null, 2));
          rl.close();
          process.exit(0);
        }
      }
    }
    break;

  case "stop":
    const Appid = args[1];
    const data1 = loadExecutedApplications();
    const app = data1.find((item) => item.AppId == Appid);

    if (!app) {
      console.log("No application found with the name:", Appid);
    } else if (app.status === "stopped") {
      console.log("Application is already stopped.");
    } else {
      if (app.pid) {
        console.log("Stopping application with PID:", app.pid);
        try {
          // change termail to powershell
          treeKill(app.pid);
        } catch (error) {
          console.error("Error during process termination:", error);
        }

        app.status = "stopped";
        app.timestamp = new Date().toLocaleString();
        app.pid = "";
        saveExecutedApplications(data1);
        console.log("Updated JSON Data:", JSON.stringify(data1, null, 2));
      } else {
        console.log("Application is not running.");
      }
    }
    process.exit(0);

  case "delete":
    const AppToDelete = args[1];
    const data2 = loadExecutedApplications();
    const indexToDelete = data2.findIndex((item) => item.AppId == AppToDelete);

    if (indexToDelete === -1) {
      console.log("No application found with the name:", AppToDelete);
    } else {
      const appToDelete = data2[indexToDelete];
      console.log(appToDelete.RepositoryName);

      // Change the working directory to the path of the app to delete
      process.chdir(appToDelete.path);

      // Use the correct variable name for the repository name
      execSync(`rm -rf ${appToDelete.RepositoryName}`);
      console.log("Deleted repository folder");

      // Remove the app from the array
      data2.splice(indexToDelete, 1);

      // Save the updated JSON data to the file
      saveExecutedApplications(data2);

      console.log(
        "Deleted and updated JSON Data:",
        JSON.stringify(data2, null, 2)
      );
    }
    process.exit(0);

  case "-help":
    console.info(`Usage: wynn <command>

  Command List:

  1. wynn-cli init “ymlfilepath”
  2. wynn-cli ls  — this will list all configured  apps 
  3. wynn-cli start appId — this will start a configured  app 
  4. wynn-cli stop appId — this will stop a configured app
  5. wynn-cli delete appId — this will delete the app 
  6. wynn-cli -help  — this will display all available  cmds as help to developer
  7. wynn-cli log appId — this will display logs of process happening into app 

  `);
    process.exit(1);

  case "log":
    const Appp = args[1];
    const data3 = loadExecutedApplications();
    const Ap = data3.find((item) => item.AppId == Appp);
    const nohupOutFilePath = `${Ap.RepositoryName}/nohup.out`;
    const output = fs.readFileSync(nohupOutFilePath, "utf8");
    console.log(output);
    process.exit(0);

  default:
    console.log("Invalid command. Please specify a valid function to run.");
}
