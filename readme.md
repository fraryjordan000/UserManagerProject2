# NOTES
Make sure you have node, npm, and mongo database. Linux-based system is recommended.
# How to use on a linux-based system
A note for Linux-Based system users: Make sure you save and close any "npm" or "mongo" processes on your system, as they will be cleaned up automatically after you terminate the script.

Simply run the "run.sh" bash file, and so long as the dependencies are met, it will launch both mongodb and the npm application.
Navigate to localhost:3000 in your browser.

# How to use on other systems
This was developed on a Macbook (A linux-based system), so it may be a bit more complicated for other systems.

I haven't tested it, but opening two terminals in the application folder and running each of the following commands should work.
({dir} == directory of application)
1: "mongod --dbpath {dir}/data/db"
2: npm start

If you got it working, navigate to localhost:3000 in your browser.