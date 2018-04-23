# Empire GUI
The Empire Multiuser GUI is a graphical interface to the Empire post-exploitation Framework. It was written in Electron and utilizes websockets (SocketIO) on the backend to support multiuser interaction. The main goal of this project is to enable red teams, or any other color team, to work together on engagements in a more seamless and integrated way than using Empire as a command line tool.

Read more about the [Empire Framework](https://github.com/EmpireProject/Empire)

### ** BETA NOTICE **
This is a BETA release and does not have all the functionality of the full Empire Framework. The goal is to get community involvement early on to help fix bugs before adding in many of the bells and whistles. The main interaction with Agents at this point is soley through a shell prompt. The next release will have Module support, etc.

### Features
- Multiplatorm Support (OSX,Window,Linux)
- Traffic over HTTPS
- User Authentication
- Multiuser Support
- Agent Shell Interaction

### Installation
1. Checkout this repo to a folder on your system
2. Install NodeJS (NPM) [here](https://nodejs.org/en/download/)
3. Start your Empire Server
    1. Install the Empire Framework
    2. Switch to the 3.0-Beta branch `git checkout 3.0-Beta`
    3. Setup your listeners and generate stagers (as this is not yet supported in the GUI)
    4. Start the server with your password `./empire --server --shared_password ILikePasswords --port 1337`
4. Run the following commands from your EmpireGUI directory
    1. `npm install`
    2. `npm start`
5. Login to the Empire!

### Screenshot
![Login](https://preview.ibb.co/nDtXMn/Screen_Shot_2018_04_20_at_2_24_38_PM.png)
![EmpireGUI](https://preview.ibb.co/nMQ8Yc/Screen_Shot_2018_04_23_at_9_15_38_AM.png)
