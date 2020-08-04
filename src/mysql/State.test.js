const State = require('./State');

describe('Test the State object', () => {

    it('Should have four states', () => {
        expect(Object.keys(State).length).toBe(4);
    });

    it('Should have waiting set', () => {
        expect(State.WAITING).toBe("WAITING");
    });

    it('Should have pending set', () => {
        expect(State.PENDING).toBe("PENDING");
    });

    it('Should have success set', () => {
        expect(State.SUCCESS).toBe("SUCCESS");
    });

    it('Should have failure set', () => {
        expect(State.FAILURE).toBe("FAILURE");
    });
})
