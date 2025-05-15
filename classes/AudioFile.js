/**
 * @name: AudioFile.js
 * @description: Class to construct audio objects for sfx.js.
 * @author: Anthony Choi.
 */



// IMPORTS
const path = require("path");


// CONSTRUCTOR
class AudioFile {
    constructor(filePath) {
        this.filePath = filePath;
        this.name = path.basename(filePath);
    }


    // FUNCTIONS

    // Function to print the object's details to console.
    print()
    {
        console.log(`File Name: ${this.name}; File Path: ${this.filePath}.`);
    }
}

module.exports = AudioFile;