/**
 * @name: Room.js
 * @description: Class to construct the rooms for library.js.
 * @author: Anthony Choi and Isaac Lee.
 */



// CONSTRUCTOR
class Room {
    constructor(number, startTime, maxCapacity, isBooked, url) {
        this.number = number;              // Campus, block, floor, and room number (e.g. GP-V-101).
        this.startTime = startTime;        // Start time.
        this.maxCapacity = maxCapacity;    // Maximum capacity of room.
        this.isBooked = isBooked;          // Boolean; is the room booked?
        this.url = url;                    // Web link.

        this.formatObject();
    }


    // FUNCTIONS

    // Function that properly formats the room number (e.g. GP-V101 to GP-V-101).
    formatObject()
    {
        this.number = this.number.slice(0, 4) + "-" + this.number.slice(4);
    }

    // Function to print the object's details to console.
    print()
    {
        console.log(`Room #: ${this.number}; Timeslot: ${this.startTime}; Max. Capacity: `
                  + `${this.maxCapacity}; Booked: ${this.isBooked}; Link: ${this.url}.`);
    }
}


// EXPORTS
module.exports = Room;