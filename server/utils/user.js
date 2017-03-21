class User {
	constructor() {
		this.userList = [];
	}

	addNewUser(id, username, room) {
		let user = {id, username, room};
		this.userList.push(user);

		return user;
	}

	getUser(id) {
		return this.userList.find(user => user.id === id);
	}

	getUserList(room) {
		return this.userList.filter(user => user.room === room);
	}

	removeUser(id) {
		let user = this.getUser(id);

		if (user) {
			this.userList = this.userList.filter(user => user.id !== id);
		}

		return user;
	}
};

module.exports = {User};