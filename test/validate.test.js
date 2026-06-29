// Unit tests for 3.js validation/validate.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('validationRegistrationForm', () => {
  let window, document;
  beforeAll(() => {
    const dom = new JSDOM(`
      <form>
        <input type="text" id="username" />
        <input type="email" id="email" />
        <input type="password" id="password" />
      </form>
    `);
    window = dom.window;
    document = dom.window.document;
    global.document = document;
    global.window = window;
    // Load the script
    const code = fs.readFileSync(path.resolve(__dirname, '../3.js validation/validate.js'), 'utf-8');
    eval(code); // defines validationRegistrationForm
  });

  afterAll(() => {
    delete global.document;
    delete global.window;
  });

  test('returns false if username is too short', () => {
    document.getElementById('username').value = 'abc';
    document.getElementById('email').value = 'user@example.com';
    document.getElementById('password').value = '123';
    window.alert = jest.fn();
    expect(validationRegistrationForm()).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Username must be at least 5 characters.');
  });

  test('returns false if email is invalid', () => {
    document.getElementById('username').value = 'validuser';
    document.getElementById('email').value = 'not-an-email';
    document.getElementById('password').value = '123';
    window.alert = jest.fn();
    expect(validationRegistrationForm()).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Please provide a valid email address.');
  });

  test('returns false if password is too short', () => {
    document.getElementById('username').value = 'validuser';
    document.getElementById('email').value = 'user@example.com';
    document.getElementById('password').value = '1';
    window.alert = jest.fn();
    expect(validationRegistrationForm()).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Password must be at least 3 characters.');
  });

  test('returns true if all fields are valid', () => {
    document.getElementById('username').value = 'validuser';
    document.getElementById('email').value = 'user@example.com';
    document.getElementById('password').value = '123456';
    window.alert = jest.fn();
    expect(validationRegistrationForm()).toBe(true);
    expect(window.alert).not.toHaveBeenCalled();
  });
});
