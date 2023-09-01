let cuerpoTabla = document.getElementById("cuerpoTabla"); //totalG
let totalisimo = document.getElementById("totalG"); //totalG
let cambioCantidad = document.getElementById("cambio"); //
let cantidadInv = document.getElementById("cantidadInv"); //cantidadInv
let tituloModal = document.getElementById("pagoTitulo"); //totalG
let tipoEntregaT = 0;
let btnTipoEntrega = document.getElementById("entregaDomicilio");
let productos = [];
let btnTipoPago = document.getElementById("pagoTipo");
let banderaTipoPago = true;
let entDomB = document.getElementById("opcionDireccion").value;
let idDireccionCliente = document.getElementById("idEmpleado").value; //
let botonP = document.getElementById("btnP");
let cerrarBtn = document.getElementById("cerrar");
let validadorv1Dom = document.getElementById("vv1");
let validadorv2Dom = document.getElementById("vv2");
let validadorv3Dom = document.getElementById("vv3");
let BtnTurno = document.getElementById("turnoId");
let ModalShowDom = true;
let SecuenciaTurno;
let banderaPagando = false;

function menos(id, precio, producto) {
  let trMas = document.getElementById(id);
  let cantidad = trMas.cells[1].innerText * 1 - 1;
  cantidad = cantidad <= 0 ? (cantidad = 1) : cantidad;
  trMas.innerHTML = `
    <tr id="${id}">
                                              
    <td><button onclick="menos(${id},${precio},'${producto}')" class="btn  btn-outline-orange btn-icon btn-xs" type="button">-</button></td>
    <td class="text-center">${cantidad}</td>
    <td><button onclick="mas(${id},${precio},'${producto}')" class="btn  btn-outline-orange btn-icon btn-xs" type="button">+</button></td>
    <td>${producto} </td>
    <td>$<input type="hidden" value="${precio}" id="pu${id}" /></td>
    <td>${precio * cantidad}</td>
    <td class="text-center" onclick="borrar1(${id})"><i class="fas fa-trash-alt"></i>    <input type="hidden" value="0" id="Cerveza${id}" />  <input type="hidden" value="0" id="CerNom${id}" /></td>
    </tr> 
    `;

  sumarTotal();
}

function mas(id, precio, producto) {
  let trMas = document.getElementById(id);
  let cantidad = trMas.cells[1].innerText * 1 + 1;
  trMas.innerHTML = `
     <tr id="${id}">
                                               
     <td><button onclick="menos(${id},${precio},'${producto}')" class="btn  btn-outline-orange btn-icon btn-xs" type="button">-</button></td>
     <td class="text-center">${cantidad}</td>
     <td><button onclick="mas(${id},${precio},'${producto}')" class="btn  btn-outline-orange btn-icon btn-xs" type="button">+</button></td>
     <td>${producto} </td>
     <td>$<input type="hidden" value="${precio}" id="pu${id}" /></td>
     <td>${precio * cantidad}</td>
     <td class="text-center" onclick="borrar1(${id})"><i class="fas fa-trash-alt"></i>  <input type="hidden" value="0" id="Cerveza${id}" />  <input type="hidden" value="0" id="CerNom${id}" /></td>
     </tr> 
     `;
  sumarTotal();
}

function agregar(producto, precio, id, pretempRes, preparado) {
  if (preparado == "1" || preparado == "2") {
    return false;
  }
  //busca elementos repetidos
  //let tempRes = pretempRes;
  //var elementR = document.getElementById(tempRes);
  //elementR.classList.add("efectoclick");
  //setTimeout(function () {
  //    clickB(tempRes);
  //}, 1000);
  //busca elementos repetidos
  const found = productos.find((element) => element == id);
  console.log(found);

  if (found == undefined || found == null) {
    console.log(producto, precio, id);
    productos.push(id);
    console.log(productos);
    cuerpoTabla.innerHTML += `
      <tr id="${id}">
                                                
      <td><button onclick="menos(${id},${precio},'${producto}')" class="btn  btn-outline-orange btn-icon btn-xs" type="button">-</button></td>
      <td class="text-center">1</td>
      <td><button onclick="mas(${id},${precio},'${producto}')" class="btn  btn-outline-orange btn-icon btn-xs" type="button">+</button></td>
      <td>${producto} </td>
       <td>$<input type="hidden" value="${precio}" id="pu${id}" /></td>
      <td>${precio}</td>
      <td class="text-center" onclick="borrar1(${id})"><i class="fas fa-trash-alt"></i>   <input type="hidden" value="0" id="Cerveza${id}" />  <input type="hidden" value="0" id="CerNom${id}" /></td>
    </tr> 
        
            <tr id="id2${id}">
              <td colspan='7' contenteditable='true'>...</td>
            </tr>
        
      `;
  } else {
    mas(id, precio, producto);
  }
  sumarTotal();
}

function sumarTotal() {
  let totalisimo2 = document.getElementById("totalG"); //totalG
  let max = cuerpoTabla.rows.length;
  let resTotalisimo = 0;
  for (let x = 0; x < max; x++) {
    // resTotalisimo += (cuerpoTabla.rows[x].cells[5].innerText * 1)

    if (cuerpoTabla.rows[x].cells.length == 7) {
      resTotalisimo += cuerpoTabla.rows[x].cells[5].innerText * 1;
    } else {
    }
  }
  totalisimo2.innerHTML = resTotalisimo.toFixed(2);
  totalisimo = totalisimo2;

  let ivas = resTotalisimo.toFixed(2) * 0.16;
  let subt = resTotalisimo.toFixed(2) - ivas;

  document.getElementById("subtotal").innerText = subt.toFixed(2);
  document.getElementById("ivas").innerText = ivas.toFixed(2);
}

$(function () {
  $("#modalCobro").on("shown.bs.modal", function (e) {
    banderaModal = true;
    // document.getElementById('pago').focus();//totalG
  });
});

function cobrarNormal() {
  if (totalisimo.innerText * 1 == 0) {
    return false;
  }
  tituloModal.innerHTML = `Agregar $${totalisimo.innerText}`;
  $("#modalCobro").modal("show");
}

function cambio() {
  let pago = document.getElementById("pago").value; //totalG
  let resTemp = pago - totalisimo.innerText * 1;
  console.log("cambio");
  cambioCantidad.innerHTML = resTemp;
  if (resTemp < 0) {
    console.log("-0");
    cantidadInv.style.display = "block";
    botonP.style.display = "none";
    document.getElementById("banderaEnter").value = "0";
    return false;
  } else {
    document.getElementById("banderaEnter").value = "1";
    cantidadInv.style.display = "none";
    botonP.style.display = "block";
    console.log("pvalido");
    enterValida(resTemp);
  }
}

function enterValida(valor) {
  if (valor < 0) {
    return;
  } else {
    let input = document.getElementById("pago");
    let banderaEnter = document.getElementById("banderaEnter").value;
    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13 && banderaEnter == 1) {
        event.preventDefault();
        document.getElementById("btnP").click();
        event.stopPropagation();
      } else {
        event.stopPropagation();
      }
    });
  }
}

function pagarT() {
  banderaPagando = true;
  botonP.style.disabled = true;
  botonP.innerHTML = "Espere...";
  cerrarBtn.style.display = "none";
  //let pagoT = document.getElementById('pago').value;
  let maxTabla = cuerpoTabla.rows.length;
  let preUrl = "";
  let preUrl2 = "";
  let preUrlObs = "";
  for (let i = 0; i < maxTabla; i++) {
    if (cuerpoTabla.rows[i].cells.length == 7) {
      let idProductoF = cuerpoTabla.rows[i].id;
      let cantidadF = cuerpoTabla.rows[i].cells[1].innerText;
      let descu = document.getElementById("pu" + idProductoF).value;
      let totalF = cuerpoTabla.rows[i].cells[5].innerText;
      let descProducto = cuerpoTabla.rows[i].cells[3].innerText;
      let preparadaId = document.getElementById("Cerveza" + idProductoF).value;
      let preparadaDe = document.getElementById("CerNom" + idProductoF).value;
      preUrl +=
        "&cantidad[" +
        i +
        "]=" +
        cantidadF +
        "&producto[" +
        i +
        "]=" +
        idProductoF +
        "&inventarioid[" +
        i +
        "]=" +
        idProductoF +
        "&total[" +
        i +
        "]=" +
        totalF +
        "&preparadaId[" +
        i +
        "]=" +
        preparadaId +
        "&preparadaDe[" +
        i +
        "]=" +
        preparadaDe;
    } else {
      let obssku = cuerpoTabla.rows[i].cells[0].innerText;
      preUrlObs += "&obssku[" + (i - 1) + "]=" + obssku;
    }
  }
  console.log(preUrl);
  let idCajero = document.getElementById("id_cajero").value;
  let idTienda = document.getElementById("tienda").value;
  let subtotal = document.getElementById("subtotal").innerText;
  let ivas = document.getElementById("ivas").innerText;
  let idFolio = document.getElementById("idFolio").value;
  let acumulado = document.getElementById("acumulado").value;

  preUrl2 += "&subtotal=" + subtotal;
  preUrl2 += "&iva=" + ivas;
  preUrl2 += "&acumulado=" + acumulado;
  preUrl2 += "&id_cajero=" + idCajero;
  preUrl2 += "&id_tienda=" + idTienda;
  preUrl2 += "&totalventa=" + totalisimo.innerText;
  preUrl2 += "&subt=" + totalisimo.innerText;
  preUrl2 += "&contadorTotal=" + maxTabla;
  preUrl2 += "&idFolio=" + idFolio;
  console.log(`../OvFetchRestaurant?turno=0${preUrl}${preUrl2}${preUrlObs}`);
  let urlfetch = `../OvFetchRestaurant?turno=0${preUrl}${preUrl2}${preUrlObs}`;
  console.log(urlfetch);

  let encoded1 = encodeURI(urlfetch);
  enviarSolicitud(encoded1);
}

let isFetchInProgress = false;

function enviarSolicitud(url) {
  if (!isFetchInProgress) {
    isFetchInProgress = true;

    fetch(url)
      .then((res) => res.text())
      .then((res) => {
        if (res.trim() == "error") {
          console.log("La session se termino");
          //   alert('La session se termino');
          Swal.fire(
            `   <div class="text-primary" >   Error intente de nuevo    </div>`
          );

          location.reload();
          return;
        }

        let arr = res.split("/*/");
        let arrURL = arr[1].split("-salto-");

        if (arrURL[0] !== "0") {
          comunica(arrURL[0]);
        }
        if (arrURL[1] !== "0") {
          comunica(arrURL[1]);
        }
        if (arrURL[2] !== "0") {
          comunica(arrURL[2]);
        }

        console.log(arr[1]);

        limpiar();
        console.log(res);
      })
      .catch((error) => {
        // Lógica de manejo de errores
        Swal.fire(
          `   <div class="text-primary" >   Error intente de nuevo    </div>`
        );
      })
      .finally(() => {
        isFetchInProgress = false;
      });
  }
}

function comunica(data) {
  var urlform = "10.81.44.131"; //document.getElementById("urlform").value;
  var impresora = "impreso"; // document.getElementById("impresora").value;
  console.log("data:" + data);
  let data1 =
    '{ "n_impresora":"' +
    impresora +
    '" , "folio":"5318" ,"fecha":"30/11/22 18:17" ,"mesa":"15" ,' +
    '"productos" : [' +
    '{ "cantidad":"1" , "producto":"AGUA DE CEBADA" , "observaciones":"Test"}' +
    '],"ip": "192.168"}';

  data = JSON.parse(data);
  console.log(data);
  const url = "https://" + urlform + ":8090/api/usuario/imprime";

  (async () => {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //mode: "no-cors",
      // dataType: "json",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }
        return response;
      })
      .then((returnedResponse) => {
        // Your response to manipulate
        ejecutaAlerta();
      })
      .catch((error) => {
        // Your error is here!
        alert(
          "No se pudo conectar a la impresora, revise que esta conectado a la misma red, la ip a la que se esta tratando de conectar es incorrecta"
        );
      });

    const content = await rawResponse;
    if (content.status == 500) {
      alert(
        "No se encontró la impresora, asegurate que estas conectado a la red local, si el problema persiste ponte en contacto con el administrador de sistemas"
      );
    }
    if (content.status == 400) {
      // alert(  "El servicio de la impresora no esta iniciado, ponte en contacto con el administrador de sistemas" );
    }
    console.log(content);
  })();
}

function popUpF(url) {
  console.log(url);
  // document.getElementById("frame1").src = url;
  window.open(
    url,
    "f1",
    "toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=300,height=200,left = 390,top = 50"
  );
}

function popUpC(url) {
  console.log(url);
  // document.getElementById("frame2").src = url;
  window.open(
    url,
    "f2",
    "toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=300,height=200,left = 390,top = 50"
  );
}

function popUpB(url) {
  console.log(url);
  //document.getElementById("frame3").src = url;
  window.open(
    url,
    "f3",
    "toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=300,height=200,left = 390,top = 50"
  );
}

function OpenEdit2(pagina, id) {
  console.log("tiket");
  window.open(
    pagina,
    "SelectValueWindow",
    "directories=no, location=no, top=60, left=450,menubar=no, scrollbars=yes, statusbar=no, tittlebar=yes, width=450, height=450"
  );
}

function limpiar() {
  Swal.fire(` 
        <div class="text-primary" >
          OK
        </div>`);
  location.href = "editComanda.jsp";
}

function borrar1(borrar) {
  let i = productos.indexOf(borrar);
  if (i !== -1) {
    productos.splice(i, 1);
  }
  document.getElementById(borrar).remove();
  let id2B = "id2" + borrar;
  document.getElementById(id2B).remove();
  sumarTotal();
}

function tpago() {
  banderaTipoPago = !banderaTipoPago;
  if (banderaTipoPago) {
    btnTipoPago.innerHTML = `<i class="mr-2" aria-hidden="true">$</i> Efectivo`;
  } else {
    btnTipoPago.innerHTML = `<i class="fa fa-credit-card mr-2" aria-hidden="true"></i> Tarjeta`;
  }
}

function tipoEntrega(valor) {
  if (valor == 1 || valor == 2) {
    // btnPagoDomicilio.innerHTML = '<button  class="btn btn-success btn-block"  style="height:  70px;font-size: 30px;"  onclick="cobrar()" >  Pagar $ <div id="totalG">0.00</div>   </button>';
    btnTipoEntrega.style.display = "none";
    sumarTotal();
  } else if (valor == 4) {
    // btnPagoDomicilio.innerHTML = '<button  class="btn btn-success btn-block"  style="height:  70px;font-size: 30px;"  onclick="cobrarDom()" >  Total $ <div id="totalG">0.00</div>   </button>';

    btnTipoEntrega.style.display = "block";
    cuerpoTabla.innerHTML += `
      <tr id="44276">
                                                
      <td>  </td>
      <td class="text-center">1</td>
      <td> </td>
      <td>Entrega a domicilio</td>
       <td>$<input type="hidden" value="15" id="pu44276" /></td>
      <td>15</td>
      <td class="text-center" onclick="borrar1('44276')"><i class="fas fa-trash-alt"></i></td>
    </tr> 
      `;
    sumarTotal();
  } else if (valor == 3) {
    btnTipoEntrega.style.display = "block";
  } else {
    sumarTotal();
  }
}

function buscaCliente(valor, opcion) {
  if (opcion == 0) {
    let encoded1 = encodeURI("../BuscarCliente?buscar=" + valor + "&op=0");
    fetch(encoded1)
      .then((res) => res.text())
      .then((res) => {
        if (res.trim() == "error") {
          console.log("La session se termino");
          //   alert('La session se termino');
          location.reload();
        }
        let partes = res.split("/-/");
        if (partes[0] == 0) {
          entDomB = 3;
          console.log(entDomB);
        } else if (partes[0] == 1) {
          if (ModalShowDom) {
            idDireccionCliente = partes[1];
            $("#ModalDireccion").modal("show");
            entDomB = 1;
            console.log(res);
            let direccionCon = document.getElementById("DireccionContenido");
            direccionCon.innerHTML = partes[2];
            ModalShowDom = false;
            console.log(entDomB);
          }
        }
        console.log(res);
      });
  }
}

function usarD(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12) {
  entDomB = 2;
  document.getElementById("nombre").value = v0;
  document.getElementById("paterno").value = v1;
  document.getElementById("materno").value = v2;
  document.getElementById("cp").value = v6;
  document.getElementById("colonia").value = v5;
  document.getElementById("calle").value = v4;
  document.getElementById("municipio").value = v7;
  document.getElementById("estado").value = v8;

  document.getElementById("numero").value = v10;
  document.getElementById("ciudad").value = v11;
  document.getElementById("obs").value = v12;

  document.getElementById("nombre").focus();
  $("#ModalDireccion").modal("hide");
  idDireccionCliente = v9;
  console.log(entDomB);
}

function cobrarAntes() {
  $("#aceptaVenta").modal("show");

  let maxTabla = cuerpoTabla.rows.length;

  let mixtabla = document.getElementById("tablaSolicitud");
  mixtabla.innerHTML = "";
  mixtabla.innerHTML += `<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Producto</th> 
    </tr>
  </thead>
  <tbody>`;
  for (let i = 0; i < maxTabla; i++) {
    if (cuerpoTabla.rows[i].cells.length == 7) {
      let cantidadF = cuerpoTabla.rows[i].cells[1].innerText;
      let descProducto = cuerpoTabla.rows[i].cells[3].innerText;

      // mixtabla.innerHTML+=cantidadF+'-'+descProducto;
      mixtabla.innerHTML += `<tr>
                <th scope="row">${cantidadF} - </th>
                <td>${descProducto}</td> 
              </tr><br>`;
    } else {
    }
  }

  mixtabla.innerHTML += `</tbody></table>`;

  return false;
}
function cobrar() {
  $("#aceptaVenta").modal("hide");
  cobrarNormal();
}

function borrar(valor) {
  let encoded1 = encodeURI("../BuscarCliente?op=2&id=" + valor);
  fetch(encoded1)
    .then((res) => res.text())
    .then((res) => {
      let idcarta = "idC" + valor;
      let cartaV = document.getElementById(idcarta);
      cartaV.style.display = "none";

      if (res.trim() == "error") {
        console.log("La session se termino");
        //   alert('La session se termino');
        location.reload();
      }
    });
  console.log(valor);
}

function agregarPreparado(
  producto,
  precio,
  id,
  pretempRes,
  preparado,
  valorCer,
  idSelect
) {
  let valorCer1 = valorCer.split("/");

  if (valorCer === "0/0") {
    return false;
  }
  document.getElementById(idSelect).value = "0/0";
  console.log(producto, precio, id);
  productos.push(id);
  cuerpoTabla.innerHTML += `
      <tr id="${id}">                                 
      <td> </td>
      <td class="text-center">1</td>
      <td> </td>
      <td>${producto} </td>
       <td>$<input type="hidden" value="${precio}" id="pu${id}" /></td>
      <td>${precio}</td>
      <td class="text-center"  >  <input type="hidden" value="${valorCer1[0]}" id="Cerveza${id}" /><input type="hidden" value="${valorCer1[1]}" id="CerNom${id}" />  </td>
       
    </tr>  
    
    <tr id="id2${id}">
      <td colspan='7' contenteditable='true'>${valorCer1[1]}</td>
    </tr>
      `;

  sumarTotal();
}

function agregarPreparado2(
  producto,
  precio,
  id,
  pretempRes,
  preparado,
  valorCer,
  idSelect
) {
  let valorCer1 = valorCer.split("/");

  if (valorCer === "0/0") {
    return false;
  }
  document.getElementById("opCer1BuscadorAguaC").value = "0/0";
  console.log(producto, precio, id);
  productos.push(id);
  cuerpoTabla.innerHTML += `
      <tr id="${id}">                                 
      <td> </td>
      <td class="text-center">1</td>
      <td> </td>
      <td>${producto} </td>
       <td>$<input type="hidden" value="${precio}" id="pu${id}" /></td>
      <td>${precio}</td>
      <td class="text-center"  >  <input type="hidden" value="${valorCer1[0]}" id="Cerveza${id}" /><input type="hidden" value="${valorCer1[1]}" id="CerNom${id}" />  </td>
       
    </tr>  
    
    <tr id="id2${id}">
      <td colspan='7' contenteditable='true'>${valorCer1[1]}</td>
    </tr>
      `;

  sumarTotal();
  $("#modalPrep").modal("hide");
  resultados.innerHTML = "";
  formulario.value = "";
}

const formulario = document.querySelector("#formulario");
//const btnbuscar=document.querySelector('#btnbuscar');
const resultados = document.querySelector("#resultados");

const filtrar = () => {
  console.log(productosB);
  console.log(formulario.value);
  resultados.innerHTML = "";
  const textos = formulario.value.toLowerCase();

  for (let producto of productosB) {
    let nombre = producto.nombre.toLowerCase();
    if (nombre.indexOf(textos) !== -1) {
      // valor:{ descripcion:'"+desc +"' ,precio: '"+precio+"',idp: '"+idP+"',p0: 'p0"+idCarta+"',prep: '"+prep+"' } },";

      resultados.innerHTML += ` 
                                                   <option class="transparente"  >${producto.valor.idp}..-${producto.nombre} -$ ${producto.valor.precio} </option >                  
                                                                     `;
    }
  }

  if (resultados.innerHTML === "") {
    resultados.innerHTML = ` 
                                                
                                                     <li>Producto no encontrado</li>                   
                                                       `;
  }
};
// btnbuscar.addEventListener('click',filtrar);
formulario.addEventListener("keyup", filtrar);

function agregarBuscador(descripcion, precio, idp, p0, prep) {
  console.log(descripcion, precio, idp, p0, prep);
  //('${producto.valor.descripcion}','${producto.valor.precio}','${producto.valor.idp},'${producto.valor.p0},'${producto.valor.prep}')
  agregar(descripcion, precio, idp, p0, prep);
  resultados.innerHTML = "";
  formulario.value = "";
}

function ejecutaAlerta() {
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
