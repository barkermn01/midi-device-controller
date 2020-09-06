////
// Testing MidiController
////

const MidiController = require('./src/MidiController');

let test = new MidiController();
console.log(test.getInputDevices());
console.log(test.getOutputDevices());
test.setSelectedInputDevice(0);
test.setSelectedOutputDevice(1);

////
// Testing driver loading
////

const Drivers = require('./src/MidiDrivers');

const drivers = new Drivers();
let supported = drivers.getDriverList();

////
// test driver hooking
////

test.setDriver(supported[0])

test.addEventHandler('button_down', (btn) => {
    console.log('button down', btn);
    test.updateLight(btn, 'green');
});

test.addEventHandler('button_up', (btn) => {
    console.log('button up', btn);
    test.updateLight(btn, 'red');
});

test.addEventHandler('button_tap', (btn) => {
    console.log('button tapped', btn);
});

test.addEventHandler('slider_update', (slider, value) => {
    console.log('slider updated', slider, value);
});

process.on('exit', function(code) {
    test.closeInputDevice();
    test.closeOutputDevice();
    console.log("closed safly ", code);
});