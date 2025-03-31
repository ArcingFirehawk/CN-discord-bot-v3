// Class to construct a room for library.js.


class Room {
    constructor(roomNumber, timeSlot, maxCapacity, booked, link) {
        this.roomNumber = roomNumber;      // Campus, floor, and room number. e.g. GP-V-301
        this.timeSlot = timeSlot;          // Timeslot.
        this.maxCapacity = maxCapacity;    // Maximum capacity of room.
        this.booked = booked;              // Boolean; is room booked.
        this.link = link;                  // Web link
    }


    // METHODS

    // Method to print the room'
    print() {
        console.log(`Room #: ${roomNumber}, Timeslot: ${timeSlot}, Max. Capacity: ${maxCapacity}, Booked: {$booked}, Link: ${link}.`)
    }
}

module.exports = Room;