# Midi Device Controller

This is a small project built ontop on top of the midi node module (https://github.com/justinlatimer/node-midi)

This package provides the start of an an easy to use interface for handling midi devices, via a simple and easy to controll Driver file that provides the information for the specific midi device.

# Driver Files
This plugin as it stands only ships with a driver for the AKAI APC mini, if you have another device you would like to support you will just need to create a driver file and load it apporiatly.

## Adding a Driver
I'm more than happy to work with anyone who wishes to add a driver to this repo, if you have a device you would like supported you can submit a pull request with the file, if your unsure how to create a driver file for your device open an issue and i will provide my tools to make it eaiser and work with you to make the driver.

I'm more than aware that as other midi devices get added the controller will need to do more, such as a device that supports setting a slider possition. or sending tones to another device however without the hardware to test and build with i'm unable to do so. hence why i will work with people to get more devices supported.

Device Manufactures are more than welcome to add support for there devices. via Pull Requests but note this project is BSD-3-Clause using it in your software is fine so long as Lisence is provided with the software.

```json
{
    "events" : {
        "button_down":144,
        "button_up":128,
        "slider_update": 176
    },
    "colors" : {
        "off":"00",
        "green": "01",
        "flash_green": "04",
        "red": "03",
        "flash_red": "04",
        "yellow": "05",
        "flash_yellow": "06"
    },
    "actions":{
        "set_color":"90"
    }
}
```

The above JSON is a driver, Event's are the names of the event you wish to allow binding to equalling the event id sent from the device E.G pushing a button down on an APC Mini will result in a id of 144, letting go of the button a id of 128.

Colors are the button colors the device support in this case

Actions are updates to be sent to the device in this case setting the color of a button

# API
test.js provides a complete and working test for controlling a midi device.

## MidiController
Create an instance of the midi controller allowing easy controll of the midi device
```js
const Midi = require('midi-device-controller');
let controller = new Midi.MidiController();
```

### getInputDrvices
gets a object of name=id of all connected Input midi devices
```js
controller.getInputDevices()
```

### getOutputDevices
gets a object of name=id of all connected Output midi devices
```js
controller.getOutputDevices()
```

### setSelectedInputDevice
selects an input device for the controller to use must be a device id, 
*note input device id may differ from the output device id*
 - *device_id* the internal id of the device as given from getInputDevices()
```js
controller.setSelectedInputDevice(device)
```

### setSelectedOutputDevice
selects an output device for the controller to use must be a device id, 
*note input device id may differ from the output device id*
 - *device_id* the internal id of the device as given from getOutputDevices()
```js
controller.setSelectedInputDevice(device_id)
```
### updateLight

Allows you to set a light color 
 - *color* can be a name of a color in the driver or the HEX code of a color supported by the device
```js
controller.updateLight(color)
```

### setDriver
Allows you to supply a driver so handled methods can be used without this you are using raw methods
 - *driver* the MidiDriver that is given from MidiDrivers object
```js
controller.setDriver(driver);
```

### addEventHandler
Allows you to bind to an event that is provided by the driver
*note this will only work when a driver is loaded into the controller*
 - *driver* the MidiDriver that is given from MidiDrivers object
```js
controller.addEventHandler('button_down', btn_id => {
    console.log(`button with id ${btn_id} has been pushed down`);
});
```

## MidiDrivers
Midi drivers the above JSON file kept in the drivers directory.
```js
const Midi = require('midi-device-controller');
let drivers = new Midi.MidiDrivers();
```

### getDriverList
Provides an array of MidiDriver object that provide the property name
*if you would like to add another driver please create it and submit a pull request*
```js
let supportedDevices = drivers.getDriverList();
```

## MidiDriver
midiDriver object can't be accessed without using the MidiDrivers getDriverList method
```js
let supportedDevices = drivers.getDriverList();
let device = supportedDrvice[0];
```
### isLoaded
has the driver been loaded
```js
device.isLoaded();
```

### load
Loads a driver into the object memory so it can be used
```js
device.load();
```

### getEventType
Proides the event name from the event decimal code given by the device
 - *event_code* the decimal code of the event
```js
device.getEventType(144); // returns 'button_down' with APC mini device
```

### getAllSupportedEvents
Provides an object of `event_name = event_code` for all supported events by the device
```js
device.getAllSupportedEvents();
```

### getActionCode
Provides the action HEX code for an action name
 - *action_name* the name of the action to get the code for
```js
device.getActionCode('set_color'); // returns the HEX code 90 for APC mini device
```

### getColor
Provides the HEX code for the data to set to the provided color by name
 - *color_name* the name of the color to get the HEX code for
```js
device.getColor('red'); // returns HEX code 03 with APC mini device
```

### getAllSupportedColors
Provides object of `color_name = color_hex_code`
```js
device.getAllSupportedColors(); // returns HEX code 03
```

# License 
Copyright 2020 Martin Barker

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.