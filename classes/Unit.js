/**
 * @name: Unit.js
 * @description: Class to construct the units for units.js.
 * @author: Anthony Choi.
 * 
 * ISSUES: No construtor overloading in JS, try default params.
 */



// CLASS
class Unit {
    constructor(title, year, semester, campus, creditPoints, overview) {
        this.code = title.slice(0, 6);    // Unit's code.
        this.name = title.slice(7);    // Unit's name.
        this.year = year;    // Year unit is being offered.
        this.semester = semester;    // Semester unit is being offered.
        this.campus = campus;    // Campus(s) where unit is offered.
        this.creditPoints = creditPoints;                                                  // Unit's number of credit points.
        this.overview = overview;                                                          // Unit's overview.
        this.link = `https://qutvirtual4.qut.edu.au/web/qut/unit?unitCode=${this.code}`    // Unit's link.

        
        console.log("\n\nBefore formatting:");
        this.print();

        this.formatObject();

        console.log("\n\nAfter formatting:");
        this.print();
    }


    // FUNCTIONS

    // Function that properly formats the object's details.
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
        console.log(`Code: ${this.code}; Name: ${this.name}; Year: ${this.year}; Semester(s): ${this.semester}; ` + 
                    `Campus(es): ${this.campus}; Credit Points: ${this.creditPoints}; \nLink: ${this.link}.\n\nOverview: ${this.overview}`);
    }
}

module.exports = Unit;