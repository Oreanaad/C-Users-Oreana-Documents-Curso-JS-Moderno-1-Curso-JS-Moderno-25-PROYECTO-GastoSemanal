//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//eventos
eventListeners()
function eventListeners(){

    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}


//clases //Metodos

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos  = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos)
        this.calcularRestante()
    }

    calcularRestante(){
      const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0) //. reduce() Aculuma los valores en un gran total
    this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
        }
}

class UI{
    InsertarPresupuesto ( cantidad){
        const {presupuesto, restante} = cantidad; //Distructuring extrayendo valor
        //agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){

        //Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert')

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }


        //Mensaje de error

        divMensaje.textContent = mensaje;

        //Insertar en el HTML

        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        //quitar el formulario

        setTimeout(() => {
            divMensaje.remove();
        },3000);
    }

    mostrarGastos(gastos) {
        this.limpiarHTML();  //Elimina HTML previo
        //iterar sobre los gastos

        gastos.forEach( gasto => {
            const { cantidad, nombre, id} = gasto;

            //Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between aling-items-center';
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML= `${nombre} <span class="badge badge-primary badge-square">$ ${cantidad}</span>
            `
            //Boton para borrar el gasto
             const btnBorrar = document.createElement('button');
             btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
             btnBorrar.innerHTML = 'Borrar &times;'
             btnBorrar.onclick = ()=>{  //Hasta que le demos clcik manda a llamar la funcion
                eliminarGasto(id)
             }
             nuevoGasto.appendChild(btnBorrar);


            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto)
        })
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const{presupuesto, restante} = presupuestObj;
        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%

        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menor

        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
}

}

// Instanciarlo
const ui = new UI();
let presupuesto

//Funciones
function preguntarPresupuesto(){
    const prespuestoUsuario = prompt( 'cual es tu presupuesto?')
    //console.log(prespuestoUsuario)

    if ( prespuestoUsuario === '' || prespuestoUsuario === null || isNaN(prespuestoUsuario) || prespuestoUsuario <= 0){  //Para validar que el prompt no envie formulario vacio, con string, que sea =< 0
        window.location.reload(); //Si validan con un sting vacio recarga la pagina y vuelve a preguntar

    }

    //presupuesto válido
    presupuesto = new Presupuesto(prespuestoUsuario);
    console.log(presupuesto)

    ui.InsertarPresupuesto(presupuesto)
}
//Agregar gasto

function agregarGasto(e){
    e.preventDefault(); //Previene acción por default

    //Leer atos del formulario

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number( document.querySelector('#cantidad').value);

    //Validar

    if(nombre === '' ||  cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;

    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error')
        return;
    }

    //Generar un objeto con el gasto

    const gasto = {nombre, cantidad, id: Date.now()} // Lo contrario a un distructuring, une nombre y cantidad a gasto
    //Usamos el date.now para entregarle un id unico a ese objeto, en proyectos mas avanzados ese id vendria de una base de datos
    //Creamos el objeto lineal ya que seria igual a :

    /*
    const gasto{
        nombre : nombre  // es por eso que se pone uno solo,ya que js lo toma asi
        id: Date.now()
    }
    */

    //Agregar un nuevo gasto
    presupuesto.nuevoGasto(gasto);
    //Mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente') //No se le pasa el tipo ya que se asume que no es error y cae en el else
    
    //Imprimir los gastos 
    const{gastos, restante} = presupuesto // distructuring para no pasar elobjeto completo
    
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    
    formulario.reset() // Reinicia l fomrulario
} 

function eliminarGasto(id){
    //Elimina los gatos de l clase 
    presupuesto.eliminarGasto(id)

    //Elimina los gatos del html
    const {gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}