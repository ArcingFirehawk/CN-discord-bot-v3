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

        // this.formatObject();
    }


    // FUNCTIONS

    // Function that properly formats the object's details. !!! Not changed for this class.
    formatObject()
    {
        // if-else statement that checks if object is for selector menu or final response.
        if (this.semester == null || this.campus == null) {
            this.name = this.name.slice(2); 
        } else {
            // if-else statement to format the semester value.
            if (this.semester.search("Semester 1, Semester 2") != -1) {
                this.semester = "Sem1, Sem2";
            } else if (this.semester.search("Semester 1") != -1) {
                this.semester = "Sem1";
            } else if (this.semester.search("Semester 2") != -1) {
                this.semester = "Sem2";
            } else {
                if (this.semester.search("Summer") == -1)
                    this.semester = "--";
            }
            
            // if-else statement to format the campus value.
            if (this.campus.search("Gardens Point") != -1) {
                this.campus = "GP";
            } else if (this.campus.search("Kelvin Grove") != -1) {
                this.campus = "KG";
            } else {
                this.campus = "--";
            }
        }        
    }

    // Function to print the object's details to console.
    print()
    {
        console.log(`\nFile Name: ${this.name}; File Path: ${this.filePath}.`);
    }
}

module.exports = AudioFile;