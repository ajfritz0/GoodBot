class RRoulette {
	cylinder: Array<number|void>;
	priorityPlayer: string | void;
	rounds: number;
	chamber: number;

	constructor() {
		this.cylinder = [0,0,0,0,0,0];
		this.rounds = 0;
		this.chamber = 0;
		this.priorityPlayer = undefined;
	}

	init(userID: string, rounds: number): void {
		/*
		set chambered rounds to user input number
		save user id
		*/
		this.cylinder = (new Array(rounds)).fill(1).concat((new Array(6-rounds)));
		this.spin();
		this.priorityPlayer = userID;
		this.rounds = rounds;
	}

	spin(): void{
		let idx = 5;
		while (idx > -1) {
			const rIdx = Math.floor(Math.random() * 6);
			[this.cylinder[idx], this.cylinder[rIdx]] = [this.cylinder[rIdx], this.cylinder[idx]];
			idx--;
		}
	}

	empty(): void {
		this.cylinder = [0,0,0,0,0,0]
		this.priorityPlayer = undefined;
		this.rounds = 0;
	}

	isEmpty(): boolean {
		return (this.rounds == 0);
	}

	fire(): boolean {
		if (this.isEmpty()) return false;

		if (this.chamber == 5) this.chamber = 0;
		else this.chamber += 1;
		
		if (this.cylinder[this.chamber] == 1) {
			this.rounds -= 1;
			return true;
		}
		else return false;
	}
}

export default RRoulette;