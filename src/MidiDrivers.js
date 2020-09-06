const fs = require('fs');

class MidiDriver{
    #path;
    #data
    #evts;
    Name;

    constructor(path, name, version){
        this.#path = path;
        this.Name = name;
    }

    isLoaded(){
        return !(typeof this.#data === "undefined");
    }

    load(){
        this.#data = require(this.#path);
        this.#evts = [];
        for(let key in this.#data.events){
            let id = this.#data.events[key]
            this.#evts[id] = key;
        };
    }

    getEventType(code){
        return this.#evts[code];
    }

    getActionCode(name){
        return this.#data.actions[name];
    }

    getColor(name){
        return this.#data.colors[name];
    }
}

class MidiDrivers{

    getDriverList(){
        let files = fs.readdirSync('./drivers');
        let drivers = [];
        
        files.forEach(file => {
            if(file.substr(file.length-5, 5) === ".json"){
                drivers.push(new MidiDriver("../drivers/"+file, file.substr(0, file.length-5)));
            }
        })

        return drivers;
    }
}

module.exports = MidiDrivers;