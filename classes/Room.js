/**
 * @description: Class to construct the rooms for library.js.
 */



class Room {
    constructor(roomNumber, timeSlot, maxCapacity, booked, link) {
        this.roomNumber = roomNumber;      // Campus, floor, and room number. e.g. GP-V-301
        this.timeSlot = timeSlot;          // Timeslot.
        this.maxCapacity = maxCapacity;    // Maximum capacity of room.
        this.booked = booked;              // Boolean; is room booked.
        this.link = link;                  // Web link

        
        //If these work, maybe put in method.
        this.roomNumber = this.roomNumber.slice(0, 4) + "-" + this.roomNumber.slice(4);

        // if-else statement that changes a binary value to be more human-readable.    !!! Don't know if works.
        // if (this.booked == 1)
        // {
        //     this.booked = "Yes";
        // } else {
        //     this.booked = "No";
        // }
    }


    // METHODS

    // Method to print the room's details.
    print()
    {
        console.log(`Room #: ${this.roomNumber}, Timeslot: ${this.timeSlot}, Max. Capacity: ${this.maxCapacity}, Booked: ${this.booked}, Link: ${this.link}.`);
    }

    // Method that properly formats the room number. !!! Necessary?
    fixString(Rooms)
    {
        let levelCap = 6;

        array.forEach(element => {
            element.roomNumber = element.roomNumber.slice(0, 4) + "-" + element.roomNumber.slice(4);
        });
        
    }    

    stringify(Rooms)
    {
        let roomString = "";
        let numBooked = 0;
        // Rooms.forEach (element => {
        //     roomString = roomString + `Room #: ${element.roomNumber}, Timeslot: ${element.timeSlot}, Max. Capacity: ${element.maxCapacity}, Booked: ${element.booked}, Link: ${element.link}.\n`;
        // });

        console.log(Rooms.length);

        Rooms.forEach(element => {
            if (element.booked == 1)
            {
                numBooked++;
            }
        });

        // for (let i = 0; i < 15; i++)
        // {
        //     roomString = roomString + `Room #: ${Rooms[i].roomNumber}, Timeslot: ${Rooms[i].timeSlot}, Max. Capacity: ${Rooms[i].maxCapacity}, Booked: ${Rooms[i].booked}, Link: ${Rooms[i].link}.\n`;
        // }
        

        // return roomString;
    

        return `The library's current individual room capacity at ${this.timeSlot} is ${(numBooked / Rooms.length) * 100}%.`;
    }
}

module.exports = Room;