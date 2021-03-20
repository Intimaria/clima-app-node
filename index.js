const { leerInput, pausa, inquireMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('dotenv').config();



const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;
    
    do {

        opt = await inquireMenu();
        switch(opt){
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ');  
                
                // buscar los lugares
                const lugares = await busquedas.ciudad( termino );

                // seleccionar el lugar
                const id = await listarLugares(lugares);
                if ( id === '0') continue;

                const lugarSel = lugares.find( l => l.id === id )

                // Guardar en DB 
                busquedas.agregarHistorial( lugarSel.nombre );

                // clima
                const {desc, min, max, temp} = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre.green );
                console.log('Lat: ', lugarSel.lat );
                console.log('Lng: ', lugarSel.lng );
                console.log('Temperature: ', temp);
                console.log('Máxima: ', max);
                console.log('Mínima: ', min);
                console.log('El clima:', desc.green);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${idx} ${lugar}`)
                })
            break;

        }

        if ( opt !== 0 ) await pausa();
  
    } while (opt !== 0)


}

main();