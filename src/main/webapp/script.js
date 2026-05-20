/**
 * 
 */
var ids = 1;
var pruebas = [];
var furia = false;
class examen{
	constructor(materia,observacion,duracion,fecha,id){
		this.suspensos=0;
		this.aprobados=0;
		this.materia=materia;
		this.info=observacion;
		this.duracion=duracion;
		this.fecha=fecha;
		this.id=id;
	}
	escribirFecha(){
		return this.fecha.getDate()+"/"+(this.fecha.getMonth()+1)+"/"+this.fecha.getFullYear();		
	}
	
	
}

//eventos
const btn1 = document.getElementById("btn1");
btn1.addEventListener("click",registrarPrueba);

const btn2 = document.getElementById("btn2");
btn2.addEventListener("click",()=>filtrar(0));
const btn3 = document.getElementById("btn3");
btn3.addEventListener("click",()=>filtrar(1));
const btn4 = document.getElementById("btn4");
btn4.addEventListener("click",()=>filtrar(2));
const btn5 = document.getElementById("btn5");
btn5.addEventListener("click",(e)=>{
	if(furia){
		furia=false;
		//no es necesario el color, se puede indicar con una frase "Modo furia: off"
		e.target.style.backgroundColor="green";
		document.querySelector("ul").innerHTML="";
	}
	else{
		furia=true;
		//no es necesario el color, se puede indicar con una frase "Modo furia: on"
		e.target.style.backgroundColor="red";
		escribirListado();
	}
})

//funciones
function registrarPrueba(){
	//lectura de valores
	const materia = document.getElementById("asignatura").value;
	const observacion = document.getElementById("info").value;
	const duracion = document.getElementById("min").value;
	const fecha = new Date(document.getElementById("fecha").value);
	
	//comprobaciones
	if(materia.trim()==="" || observacion.trim()==="" || duracion<=0 ){
		alert("Los valores introducidos no son correctos.");
		return;
	}
	if(pruebas.some(p=>p.fecha.getTime()==fecha.getTime())){
		alert("Los pobres alumnos ya tienen un examen ese dia");
		return;
	}
	
	
	//guardado
	let examenReg = new examen(materia,observacion,duracion,fecha,ids);
	ids++;
	pruebas.push(examenReg);
	//escritura
	escribirPruebas(pruebas);
	guardarCambios();
}



function filtrar(valor){
	let pruebasFiltradas;
	switch(valor){
		case 1:
			let hoy=new Date();
			let semana = new Date();
			semana.setDate(semana.getDate()+7);
			pruebasFiltradas=pruebas.filter(p=>p.fecha>hoy&&p.fecha<semana);
			escribirPruebas(pruebasFiltradas)
			break;
		case 2:
			pruebasFiltradas=pruebas.concat();
			pruebasFiltradas.sort(function(p,e){
				if(p.suspensos>e.suspensos){
					return -1;
				}
				else{
					return 1;
				}
			})
			while(pruebasFiltradas.length>10){
				pruebasFiltradas.pop();
			}
			escribirPruebas(pruebasFiltradas);
			break;
		default:
			escribirPruebas(pruebas);
			break;	
	}
}


function escribirPruebas(pr){
	const rutaTabla = document.querySelector("tbody");
	rutaTabla.innerHTML="";
	pr.forEach(function(prueba){
		let fila = document.createElement("tr");
		let celda1 = document.createElement("td");
		celda1.innerText=prueba.escribirFecha();
		let celda2 = document.createElement("td");
		celda2.innerText=prueba.materia;
		let celda3 = document.createElement("td");
		celda3.innerText=prueba.info;
		let celda4 = document.createElement("td");
		celda4.innerText=prueba.duracion;
		let celda5 = document.createElement("td");
		celda5.innerText=prueba.aprobados;
		let celda6 = document.createElement("td");
		celda6.innerText=prueba.suspensos;
		let celda7 = document.createElement("td");
		let btnAprob = document.createElement("button");
		btnAprob.innerText="A";
		btnAprob.dataset.id=prueba.id;
		//evento aprobados
		btnAprob.addEventListener("click",function(e){
			let mod = pruebas.find(p=>p.id==e.target.dataset.id);
			//localizamos
			let aprob = Number(prompt("¿Cuántos aprobados hubo?"));
			//revisamos
			if(aprob<0||isNaN(aprob)){
				alert("Valor incorrecto");
				return;
			}
			if(aprob+mod.suspensos>30){
				alert("Se supera el número de alumnos matriculados, 30");
				return;
			}
			//asignamos
			mod.aprobados=aprob;
			escribirPruebas(pr);
			guardarCambios();
		})
		let btnSusp = document.createElement("button");
		btnSusp.innerText="S";
		btnSusp.dataset.id=prueba.id;
		//eventos suspensos
		btnSusp.addEventListener("click",function(e){
			let mod = pruebas.find(p=>p.id==e.target.dataset.id);
			//localizamos
			let susp = Number(prompt("¿Cuántos suspensos hubo?"));
			//revisamos
			if(susp<0||isNaN(susp)){
				alert("Valor incorrecto");
				return;
			}
			if(susp+mod.aprobados>30){
				alert("Se supera el número de alumnos matriculados, 30");
				return;
			}
			//asignamos
			mod.suspensos=susp;
			escribirPruebas(pr);
			guardarCambios();
		});
		let btnEliminar = document.createElement("button");
		btnEliminar.innerText="X";
		btnEliminar.dataset.id=prueba.id;
		//eventos eliminar
		btnEliminar.addEventListener("click",function(e){
			
			//localizamos
			let mod = pruebas.findIndex(p=>p.id==e.target.dataset.id);
			//revisamos
			let fecha = prompt("Se va a eliminar la prueba del día "+pruebas[mod].escribirFecha()+"\nPara eliminar introduzca la fecha");
			//revisamos (lo mejor es hacerlo con el texto)
			if(fecha!=pruebas[mod].escribirFecha()){
				alert("Se ha cancelado");
				return;
			}
			//eliminamos
			pruebas.splice(mod,1);
			let modFiltrado = pr.findIndex(p=>p.id==e.target.dataset.id);
			pr.splice(modFiltrado,1);
			escribirPruebas(pr);
			guardarCambios();
		});
		celda7.appendChild(btnAprob);
		celda7.appendChild(btnSusp);
		celda7.appendChild(btnEliminar);
		fila.appendChild(celda1);
		fila.appendChild(celda2);
		fila.appendChild(celda3);
		fila.appendChild(celda4);
		fila.appendChild(celda5);
		fila.appendChild(celda6);
		fila.appendChild(celda7);
		rutaTabla.appendChild(fila);
	});
	escribirMedia(pr);
	if(furia){
		escribirListado();
	}
}

function escribirMedia(lista){
	const lugar = document.getElementById("total");
	let totalSus=0;
	if(lista.length==0){
		lugar.innerText="La media de suspensos es 0";
		return;
	}
	lista.forEach(function(pr){
		totalSus+=pr.suspensos;
	})
	lugar.innerText="La media de suspensos es "+(totalSus/lista.length);
}


//extra
function guardarCambios(){
	const texto = JSON.stringify(pruebas);
	localStorage.setItem("pruebas",texto);
}

cargarPruebas()
function cargarPruebas(){
	const texto = localStorage.getItem("pruebas");
	//paramos si no tenemos nada
	if(texto==null){
		return;
	}
	let pasoIntermedio = JSON.parse(texto);
	pasoIntermedio.forEach(function(valor){
		let fecha = new Date(valor.fecha);
		let ex = new examen(valor.materia, valor.info, valor.duracion, fecha, valor.id);
		ex.suspensos=valor.suspensos;
		ex.aprobados=valor.aprobados;
		pruebas.push(ex);
		if(valor.id>=ids){
			ids=valor.id+1;
		}
	});
	escribirPruebas(pruebas);
}


function escribirListado(){
	const lista = document.querySelector("ul");
	lista.innerHTML="";
	let listaFuriosa=[];
	pruebas.forEach(function(p){
		let alumnos = p.suspensos + p.aprobados;
		if(alumnos!=0){
			const mediaSus= p.suspensos/alumnos*100;
			if(mediaSus<75){
				let aux = listaFuriosa.find(pr=>pr[0]==p.materia)
				if(aux){
					if(aux[1]>mediaSus){
						aux[1]=mediaSus;
					}
				}
				else{
					let pack = [p.materia,mediaSus];
					listaFuriosa.push(pack);
				}
			}
		}
	});
	
	listaFuriosa.forEach(function(p){
		let punto = document.createElement("li");
		punto.innerText=p[0]+" ("+Math.trunc(p[1]*100)/100+"%)"
		lista.appendChild(punto);
	});
	
}


