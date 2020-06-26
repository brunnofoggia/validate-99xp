import v from '../lib/validate-99xp.esm.js';
import v8n from 'v8n-99xp';

// simple
test('simple json > fullname sent > valid !', () => {
    var validations = { name: [ [v8n().fullname(), 'Enter your fullname'] ] }
    var json = { name: 'bruno foggia' }

    expect((v.validate(json, {validations}))===null).toBe(true);
});
test('simple json > first name sent > invalid !', () => {
    var validations = { name: [ [v8n().fullname(), 'Enter your fullname'] ] }
    var json = { name: 'bruno' }

    expect((v.validate(json, {validations}))===null).toBe(false);
});

// single complex 1
test('single complex 1 json > fullname and email sent > valid !', () => {
    var validations = { name: [], 'contacts[email]': [[v8n().email(), 'invalid email']] }
    var json = { name: 'bruno foggia', contacts: {
            email: 'team@99xp.org'
        }
    }

    expect((v.validate(json, {validations}))===null).toBe(true);
});

// single complex 2
test('single complex 2 json > fullname and email sent > valid !', () => {
    var validations = { name: [], 'contacts[email][home]': [[v8n().email(), 'invalid email']] }
    var json = { name: 'bruno foggia', contacts: {
            email: {home: 'team@99xp.org'}
        }
    }

    expect((v.validate(json, {validations}))===null).toBe(true);
});

// multiple
test('mix json > fullname and email sent > valid !', () => {
    var validations = { name: [], 'contacts[0][email]': [[v8n().email(), 'invalid email']] }
    var json = { name: 'bruno foggia', contacts: [
            {
                email: 'team@99xp.org'
            },
        ]
    }

    expect((v.validate(json, {validations}))===null).toBe(true);
});

// multiple 2
test('mix json 2 > partial validation with invalid email item on list sent > invalid !', () => {
    var validations = { name: [], 'contacts[][email]': [[v8n().email(), 'invalid email']] }
    var json = { name: 'bruno foggia', contacts: [
            {
                email: 'team@99xp.org'
            },
            {
                email: 'team@.org'
            }
        ]
    }
    delete json.contacts[0];
    var r = (v.validate(json, {validations}));
    console.log(json, r);
    expect(r!==null && r[0][2]==='1').toBe(true);
});

test('mix json 3 > fullname sent and email NOT sent > invalid !', () => {
    var validations = { name: [], 'contacts[0][email]': [] }
    var json = { name: 'bruno foggia', contacts: [
            {
            },
        ]
    }

    expect((v.validate(json, {validations}))===null).toBe(false);
});

test('mix json 4 > fullname sent and one of two contact emails NOT sent > invalid !', () => {
    var validations = {
        name: [], 
        'contacts[][email]': [ [v8n().email(), 'Enter a valid email'] ] 
    }
    var json = { name: 'bruno foggia', contacts: [
            {
                //email: 'team@99xp.org'
            },
            {
                email: 'admin@99xp.org'
            },
        ]
    }

    expect((v.validate(json, {validations}))===null).toBe(false);
});

test('mix json 5 > fullname sent and two contact emails sent > valid !', () => {
    var validations = {
        name: [], 
        'contacts[][email]': [ [v8n().email(), 'Enter a valid email'] ] 
    }
    var json = { name: 'bruno foggia', contacts: [
            {
                email: 'team@99xp.org'
            },
            {
                email: 'admin@99xp.org'
            },
        ]
    }

    expect((v.validate(json, {validations}))===null).toBe(true);
});

test('mix json 6 > fullname, two emails, address sent correctly > valid !', () => {
    var validations = {
        name: [], 
        'contacts[][email]': [ [v8n().email(), 'Enter a valid email'] ],
        'address[][location][street]': [ [v8n().string().minLength(1), 'Enter a valid address'] ],
    }
    var json = { name: 'bruno foggia', contacts: [
            {
                email: 'team@99xp.org'
            },
            {
                email: 'admin@99xp.org'
            },
        ],
        address: [
            {
                zipcode: '099012123',
                num: '123',
                location: {
                    zipcode: '099012123',
                    street: 'lorem ipsum',
                }
            }
        ],
    }

    expect((v.validate(json, {validations}))===null).toBe(true);
});

test('mix json 7 > fullname, two emails, address sent without street > invalid !', () => {
    var validations = {
        name: [], 
        'contacts[][email]': [ [v8n().email(), 'Enter a valid email'] ],
        'address[][location][street]': [ [v8n().string().minLength(1), 'Enter a valid address'] ],
    }
    var json = { name: 'bruno foggia', contacts: [
            {
                email: 'team@99xp.org'
            },
            {
                email: 'admin@99xp.org'
            },
        ],
        address: [
            {
                zipcode: '099012123',
                num: '123',
                location: {
                    zipcode: '099012123',
                }
            }
        ],
    }

    expect((v.validate(json, {validations}))===null).toBe(false);
});
