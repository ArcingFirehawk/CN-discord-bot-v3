/**
 * @name: Unit.js
 * @description: Class to construct the units for units.js.
* @author: Anthony Choi. Debugging and refactoring by Anthony Choi.
 */



// IMPORTS
const cheerio = require('cheerio');


// CLASS
class Unit {
    constructor(name, semester, year, campus, creditPoints, overview) {
        // this.code = code;    // Unit's code.
        this.name = name;    // Unit's name.
        this.semester = semester;    // Semester unit is being offered.
        this.year = year;    // Year unit is being offered.
        this.campus = campus;    // Campus(s) where unit is offered.
        this.creditPoints = creditPoints;    // Unit's credit points.
        this.overview = overview;    // Unit's overview.
        // this.link = link;    // Unit's link.

        this.formatString();
    }


    // FUNCTIONS

    // Function that properly formats the unit's details.
    formatString()
    {
        // this.name = this.name.text();
        // this.semester = this.semester.text();
        // this.year = this.year.text();
        // this.campus = this.semester.text();
        // this.creditPoints = this.semester.text();
        // this.overview = this.semester.text();

        this.print();

        // !!! Switch case doesn't work.

        // switch (this.semester) {
        //     case this.semester.search("Semester 1") != -1:
        //         this.semester = "Sem1";
        //         break;
        //     case this.semester.search("Semester 2") != -1:
        //         this.semester = "Sem2";
        //         break;
        //     case this.semester.search("Semester 1, Semester 2") != -1:
        //         this.semester = "Sem1, Sem2";
        //         break;
        //     default:
        //         this.semester = "--";
        // }

        if (this.semester.search("Semester 1, Semester 2") != -1) {
            this.semester = "Sem1, Sem2";
        } else if (this.semester.search("Semester 1") != -1) {
            this.semester = "Sem1";
        } else if (this.semester.search("Semester 2") != -1) {
            this.semester = "Sem2";
        } else {
            this.semester = "--";
        }

        // !!! Switch case doesn't work.

        // switch (this.campus) {
        //     case this.campus.search("Gardens Point") != -1:
        //         this.campus = "GP";
        //         break;
        //     case this.campus.search("Kelvin Grove") != -1:
        //         this.campus = "KG";
        //         break;
        //     default:
        //         this.campus = "--";
        // }

        if (this.campus.search("Gardens Point") != -1) {
            this.campus = "GP";
        } else if (this.campus.search("Kelvin Grove") != -1) {
            this.campus = "KG";
        } else {
            this.campus = "--";
        }        

        // this.roomNumber = this.roomNumber.slice(0, 4) + "-" + this.roomNumber.slice(4);

        // if (this.booked == 1) {
        //     this.booked = "Yes";
        // } else {
        //     this.booked = "No";
        // }
    }

    // Method to print the room's details to console.
    print()
    {
        console.log(`Name: ${this.name}, Semester(s): ${this.semester}, Year: ${this.year}, Campus(es): ${this.campus}.`);
    }
}

module.exports = Unit;