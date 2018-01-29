class Elevator {
  constructor(){
	this.direction		= "up";
    this.floor			= 0;
    this.MAXFLOOR		= 10;
	this.interval		= 0;
	this.requests		= [];
	this.passengers		= [];
	this.waitingList	= [];
  }

  start() {
	  this.interval = setInterval(() => this.update(), 1000);
  }

  stop() {
	  clearInterval(this.interval);
	  this.interval = 0;
  }

  update() {
	  setTimeout(() => {
		  this.log();
		  if (this.requests.indexOf(this.floor) > -1) {
			  this._passengersLeave();
			  this._passengersEnter();
			  this.requests.splice(this.requests.indexOf(this.floor), 1);
		  }
		  if (this.requests.length > 0) {
			  if (this.direction === "up" && this.requests.some(request => request > this.floor)
				  || this.direction === "down" && !this.requests.some(request => request < this.floor)) {
				  this.direction = "up";
				  this.floorUp();
			  } else {
				  this.direction = "down";
				  this.floorDown();
			  }
		  } else {
			  this.stop();
		  }	  
	  }, 5000);
  }

  _passengersEnter() {
	  this.waitingList.forEach(person => {
		  if (person.originFloor === this.floor) {
			  this.passengers.push(person);
			  if (this.requests.indexOf(person.destinationFloor) < 0) {
				  this.requests.push(person.destinationFloor);
			  }
			  console.log(`${person.name} has enter the elevator`);
		  }
	  });
	  this.waitingList = this.waitingList.filter(person => person.originFloor !== this.floor);
  }

  _passengersLeave() {
	  this.passengers.forEach(person => {
		  if (person.destinationFloor === this.floor) {
			  console.log(`${person.name} has left the elevator`);
		  }
	  });
	  this.passengers = this.passengers.filter(person => person.destinationFloor !== this.floor);
  }

  floorUp() {
	  if (this.floor < this.MAXFLOOR) {
		  this.floor++;
	  } else {
		  throw new Error("OutOfBounds");
	  }
  }

  floorDown() {
	  if (this.floor > 0) {
		  this.floor--;
	  } else {
		  throw new Error("OutOfBounds");
	  }
  }

  call(person) {
	  if (this.requests.indexOf(person.originFloor) < 0) {
		  this.requests.push(person.originFloor);
	  }
	  this.waitingList.push(person);
	  if (!this.interval) {
		  this.start();
	  }
  }

  log() {
	  console.log(`Direction: ${this.direction} | Floor: ${this.floor}`);
  }
}

module.exports = Elevator;
