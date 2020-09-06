const midi = require('midi');

class MidiController{
    #Input = new midi.Input();
    #Output = new midi.Output();
    #Handlers = {
    };
    #driver;

    #InputOpen = false;
    #OutputOpen = false;

    getInputDevices(){
        let devices = {};
        for(let i = 0; i < this.#Input.getPortCount(); i++)
        {
            let name = this.#Input.getPortName(i);
            devices[name] = i;
        }
        return devices
    }

    getOutputDevices(){
        let devices = {};
        for(let i = 0; i < this.#Output.getPortCount(); i++)
        {
            let name = this.#Output.getPortName(i);
            devices[name] = i;
        }
        return devices
    }

    setSelectedInputDevice(device_id){
        try{
            this.#Input.openPort(device_id);
            this.#InputOpen = true;
            this.#Input.on('message', this.#messageRecived);
        }catch(ex){
            throw ex;
        }
    }
    
    setSelectedOutputDevice(device_id){
        try{
            this.#Output.openPort(device_id);
            this.#OutputOpen = true;
        }catch(ex){
            throw ex;
        }
    }

    #messageRecived = (dt, msg) => {
        if(this.#InputOpen){
            let type = this.#driver.getEventType(msg[0]);
            this.#Handlers[type].forEach(handler => {
                handler(msg[1], msg[2]);
            });
            if(type === "button_up"){
                this.#Handlers["button_tap"].forEach(handler => {
                    handler(msg[1], msg[2]);
                });
            }
        }
    }

    updateLight(btn, color){
        if(typeof color === "string" && isNaN(parseInt(color))){
            color = this.#driver.getColor(color);
        }
        this.sendMessage(parseInt(this.#driver.getActionCode("set_color"), 16), btn, parseInt("00", 16));
    }

    setDriver(driver){
        this.#driver = driver;
        if(!this.#driver.isLoaded()){
            this.#driver.load();
        }
    }
    
    addEventHandler(type, handler){
        if(this.#Handlers[type] === undefined){
            this.#Handlers[type] = [];
        }
        this.#Handlers[type].push(handler);
    }

    sendMessage(evt_id, hdwr_id, value){
        if(this.#OutputOpen){
            this.#Output.sendMessage([evt_id, hdwr_id, value]);
        }
    }

    closeInputDevice(){
        this.#Input.closePort();
        this.#InputOpen = false;
    }

    closeOutputDevice(){
        this.#Output.closePort();
        this.#OutputOpen = false;
    }
}

module.exports = MidiController;