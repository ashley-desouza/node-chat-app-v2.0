const expect = require('expect');
const {User} = require('./../utils/user');

let user;
// Seed data
let users = [{
	id: 1,
	username: 'Andy',
	room: 'room1'
}, {
	id: 2,
	username: 'Barry',
	room: 'room1'
}, {
	id: 3,
	username: 'Carry',
	room: 'room2'
}];

beforeEach(() => {
	user = new User();
	user.userList = users;
});

describe('User', () => {
	it('should add a user given a valid id', () => {
		let newUser = new User();
		let user = {
			id: 4, 
			username: 'John', 
			room: 'room2'
		};

		let result = newUser.addNewUser(user.id, user.username, user.room);

		expect(result).toExist();
		expect(result).toEqual(user);
	});

	// it('should not add a user given a invalid id', () => {
	// 	let newUser = new User();
	// 	let user = {
	// 		id: '', 
	// 		username: 'John', 
	// 		room: 'room2'
	// 	};

	// 	let result = newUser.addNewUser(user.id, user.username, user.room);

	// 	expect(result).toNotExist();
	// 	expect(newUser.users.length).toBe(0);
	// });

	it('should remove a user given a valid id', () => {
		let result = user.removeUser(3);

		expect(result.id).toBe(3);
		expect(user.userList.length).toBe(2);
	});

	it('should not remove a user given an invalid id', () => {
		let result = user.removeUser(99);

		expect(result).toNotExist();
	});
	
	it('should return a user given a valid id', () => {
		let result = user.getUser(2);

		expect(result).toExist();
		expect(result.id).toBe(2);
	});

	it('should not return a user given an invalid id', () => {
		let result = user.getUser(99);

		expect(result).toNotExist();
	});

	it('should return a list of users belonging to room1', () => {
		let result = user.getUserList('room1');

		expect(result).toExist();
		expect(result.length).toBeMoreThan(0);
		expect(result).toEqual([{
			id: 1,
			username: 'Andy',
			room: 'room1'
		}, {
			id: 2,
			username: 'Barry',
			room: 'room1'
		}]);
	});

	it('should return a list of users belonging to room2', () => {
		let result = user.getUserList('room2');

		expect(result).toExist();
		expect(result.length).toBe(1);
		expect(result).toEqual([{
			id: 3,
			username: 'Carry',
			room: 'room2'
		}]);
	});
});