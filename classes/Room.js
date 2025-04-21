/**
 * @name: Room.js
 * @description: Class to construct the rooms for library.js.
* @author: Anthony Choi and Isaac Lee.
 */



class Room {
    constructor(roomNumber, timeSlot, maxCapacity, booked, link) {
        this.roomNumber = roomNumber;      // Campus, block, floor, and room number (e.g. GP-V-101).
        this.timeSlot = timeSlot;          // Start time.
        this.maxCapacity = maxCapacity;    // Maximum capacity of room.
        this.booked = booked;              // Boolean; is the room booked. 1 == Yes.
        this.link = link;                  // Web link

        this.formatString();
    }


    // METHODS

    // Method that properly formats the room number (e.g. GP-V101 to GP-V-101).
    formatString()
    {
        this.roomNumber = this.roomNumber.slice(0, 4) + "-" + this.roomNumber.slice(4);

        // if (this.booked == 1) {
        //     this.booked = "Yes";
        // } else {
        //     this.booked = "No";
        // }
    }

    // Method to print the room's details to console.
    print()
    {
        console.log(`Room #: ${this.roomNumber}, Timeslot: ${this.timeSlot}, Max. Capacity: ${this.maxCapacity}, Booked: ${this.booked}, Link: ${this.link}.`);
    }
}

module.exports = Room;