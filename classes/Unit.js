/**
 * @name: Unit.js
 * @description: Class to construct the units for units.js.
* @author: Anthony Choi. Debugging and refactoring by Anthony Choi.
 */



// CLASS
class Unit {
    constructor(title, year, semester, campus, creditPoints, overview) {
    // constructor(title, year = null, semester = null, campus = null, creditPoints = null, overview = null) {
        this.code = title.slice(0, 6);    // Unit's code.

        this.name = title.slice(7);    // Unit's name.
        
        // if-else statement to get the unit's name depending on what was given to it.
        // if (this.title.search("-") == 7) {
        //     this.name = title.slice(9);
        // } else {
        //     this.name = title.slice(7);
        // }
        
        this.year = year;    // Year unit is being offered.
        this.semester = semester;    // Semester unit is being offered.
        this.campus = campus;    // Campus(s) where unit is offered.
        this.creditPoints = creditPoints;                                                  // Unit's credit points.
        this.overview = overview;                                                          // Unit's overview.
        this.link = `https://qutvirtual4.qut.edu.au/web/qut/unit?unitCode=${this.code}`    // Unit's link.

        this.formatString();
    }


    // FUNCTIONS

    // Function that properly formats the unit's details.
    formatString()
    {
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

    // Function to print the object's details to console.
    print()
    {
        console.log(`\n\nCode: ${this.code}; Name: ${this.name}; Year: ${this.year}; Semester(s): ${this.semester}; ` + 
                    `Campus(es): ${this.campus}; Credit Points: ${this.creditPoints}; \nLink: ${this.link}.\n\nOverview: ${this.overview}\n\n`);
    }
}

module.exports = Unit;