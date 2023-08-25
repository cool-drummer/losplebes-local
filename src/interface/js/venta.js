let cuerpoTabla = document.getElementById("cuerpoTabla"); //totalG
let totalisimo = document.getElementById("totalG"); //totalG
let cambioCantidad = document.getElementById("cambio"); //
let cantidadInv = document.getElementById("cantidadInv"); //cantidadInv
let tituloModal = document.getElementById("pagoTitulo"); //totalG
let tipoEntregaT = 0;
let btnTipoEntrega = document.getElementById("entregaDomicilio");
//let btnPagoDomicilio = document.getElementById('btnP');
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
  //console.log((evento.path[2].cells[1].innerText * 1)-1);
  //let resultado=  (evento.path[2].cells[1].innerText * 1)-1;
  // resultado = resultado <= 0 ?resultado=1:resultado;
  //evento.path[2].cells[1].innerText =resultado;

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
    <td class="text-center" onclick="borrar1(${id})"><i class="fas fa-trash-alt"></i></td>
    <td><input type="hidden" value="0" id="Cerveza${id}" /><input type="hidden" value="0" id="CerNom${id}" /></td>
    </tr> 
   
    `;

  sumarTotal();
}

function mas(id, precio, producto) {
  //console.log((evento.path[2].cells[1].innerText * 1)+1);
  //let resultado=  (evento.path[2].cells[1].innerText * 1)+1;
  //evento.path[2].cells[1].innerText =resultado;

  let trMas = document.getElementById(id);
  let cantidad = trMas.cells[1].innerText * 1 + 1;
  trMas.innerHTML = `
     <tr id="${id}">
                                               
     <td><button onclick="menos(${id},${precio},'${producto}')" class="btn  btn-outline-orange btn-icon btn-xs" type="button">-</button></td>
     <td class="text-center">${cantidad}</td>
     <td><button onclick="mas(${id},${precio},'${producto}')" class="btn  btn-outline-orange btn-icon btn-xs" type="button">+</button></td>
     <td>${producto} </td>
     <td>$<input type="hidden" value="${precio}" id="pu${id}" />   </td>
     <td>${precio * cantidad}</td>
     <td class="text-center" onclick="borrar1(${id})"><i class="fas fa-trash-alt"></i></td>
    <td><input type="hidden" value="0" id="Cerveza${id}" /> <input type="hidden" value="0" id="CerNom${id}" /></td>
     </tr> 
    
     
     `;
  sumarTotal();
}

function agregar(producto, precio, id, pretempRes, preparado) {
  if (preparado == "1" || preparado == "2") {
    return false;
  }
  //busca elementos repetidos
  let tempRes = pretempRes;
  var elementR = document.getElementById(tempRes);
  elementR.classList.add("efectoclick");
  setTimeout(function () {
    clickB(tempRes);
  }, 1000);

  const found = productos.find((element) => element == id);
  console.log(found);
  console.log(productos.length);

  if (productos.length == 0) {
    comprobar();
  } else {
  }

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
      <td class="text-center" onclick="borrar1(${id})"><i class="fas fa-trash-alt"></i></td>
         <td><input type="hidden" value="0" id="Cerveza${id}" />  <input type="hidden" value="0" id="CerNom${id}" /> </td>
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

function agregarPreparado(
  producto,
  precio,
  id,
  pretempRes,
  preparado,
  valorCer,
  idSelect
) {
  if (valorCer === "0/0") {
    return false;
  }
  document.getElementById(idSelect).value = "0/0";
  let valorCer1 = valorCer.split("/");

  let tempRes = pretempRes;
  var elementR = document.getElementById(tempRes);
  elementR.classList.add("efectoclick");
  setTimeout(function () {
    clickB(tempRes);
  }, 1000);
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
      <td class="text-center"  > </td>
       <td><input type="hidden" value="${valorCer1[0]}" id="Cerveza${id}" /><input type="hidden" value="${valorCer1[1]}" id="CerNom${id}" /></td>
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
  if (valorCer === "0/0") {
    return false;
  }
  document.getElementById(idSelect).value = "0/0";
  let valorCer1 = valorCer.split("/");

  let tempRes = pretempRes;
  var elementR = document.getElementById(tempRes);
  //elementR.classList.add("efectoclick");
  setTimeout(function () {
    clickB2(tempRes);
  }, 1000);
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
      <td class="text-center"  > </td>
       <td><input type="hidden" value="${valorCer1[0]}" id="Cerveza${id}" /><input type="hidden" value="${valorCer1[1]}" id="CerNom${id}" /></td>
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

function clickB(val) {
  var elementR = document.getElementById(val);
  elementR.classList.remove("efectoclick");
}

function clickB2(val) {
  var elementR = document.getElementById(val);
  // elementR.classList.remove("efectoclick");
}
function sumarTotal() {
  console.log("suma");
  let propinisima = document.getElementById("totalPropina").innerText;
  let totalisimo2 = document.getElementById("totalG"); //totalG
  let max = cuerpoTabla.rows.length;
  console.log(max);
  let resTotalisimo = 0;
  for (let x = 0; x < max; x++) {
    if (cuerpoTabla.rows[x].cells.length == 8) {
      resTotalisimo += cuerpoTabla.rows[x].cells[5].innerText * 1;
      console.log("prcio " + cuerpoTabla.rows[x].cells[5].innerText);
    } else {
    }
  }
  console.log(resTotalisimo);
  resTotalisimo = resTotalisimo * 1 + propinisima * 1;
  totalisimo2.innerHTML = resTotalisimo.toFixed(2);
  totalisimo = totalisimo2;

  let ivas = resTotalisimo.toFixed(2) * 0.16;
  let subt = resTotalisimo.toFixed(2) - ivas;

  document.getElementById("subtotal").innerText = subt.toFixed(2);
  document.getElementById("ivas").innerText = ivas.toFixed(2);
}

function cobrarNormal() {
  if (totalisimo.innerText * 1 == 0) {
    return false;
  }
  tituloModal.innerHTML = `Total a Pagar  $${totalisimo.innerText}`;
  $("#modalCobro").modal("show");
}

$(function () {
  $("#modalCobro").on("shown.bs.modal", function (e) {
    banderaModal = true;
    document.getElementById("pago").focus(); //totalG
  });
});

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

function pagar(folioTik) {
  let pago3 = "0"; //document.getElementById('pago').value;//totalG
  let pagoT = 0;

  let banRestaurat = document.getElementById("entrega").value;

  if (banRestaurat == 3) {
    pago3 = 100000;
    pagoT = 0;
  } else {
    // pago3 = document.getElementById('pago').value;//totalG
    // pagoT = pago3
    pago3 = 100000;
    pagoT = 0;
  }

  let resTemp3 = pago3 - totalisimo.innerText * 1;

  console.log("pago3" + pago3);
  console.log(resTemp3);

  if (resTemp3 < 0) {
    console.log("menor");
    return false;
  }
  if (banderaPagando) {
    console.log("pagando espre..");
    return false;
  }

  banderaPagando = true;

  botonP.style.disabled = true;
  botonP.innerHTML = "Espere...";
  cerrarBtn.style.display = "none";

  let maxTabla = cuerpoTabla.rows.length;
  let cantidad = "";
  let productoId;
  let precioUnitario;
  let preUrl = "";
  let preUrl2 = "";
  let preUrlTiket = "";
  let preUrlObs = "";
  for (let i = 0; i < maxTabla; i++) {
    if (cuerpoTabla.rows[i].cells.length == 8) {
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
      preUrlTiket +=
        "&cantidad[" +
        i +
        "]=" +
        cantidadF +
        "&descP[" +
        i +
        "]=" +
        descProducto +
        "&cu[" +
        i +
        "]=" +
        descu +
        "&total[" +
        i +
        "]=" +
        totalF;
    } else {
      let obssku = cuerpoTabla.rows[i].cells[0].innerText;
      preUrlObs += "&obssku[" + (i - 1) + "]=" + obssku;
    }
  }
  console.log(preUrl);
  let idCajero = document.getElementById("id_cajero").value;
  let nomCajero = document.getElementById("nombre_persona").value;
  let name_store = document.getElementById("name_store").value;
  let idTienda = document.getElementById("tienda").value;
  let estat = document.getElementById("entrega").value;
  let clienteF = "0"; //document.getElementById('cliente').value;
  let dirEntrega = " ";

  if (estat == 4) {
    clienteF = document.getElementById("cliente2").value;
    dirEntrega = document.getElementById("domEntrega").innerText;
  } else {
    clienteF = document.getElementById("cliente").value;
  }

  //let Nomtik = document.getElementById('nombre').value;
  //let apatik = document.getElementById('paterno').value;
  //let amatik = document.getElementById('materno').value;
  let totalTiket = totalisimo.innerText;
  let cambioTiket = cambioCantidad.innerText;
  //let turnoTT = localStorage.getItem('turno');
  let fec2 = folioTik; // Date.now();
  let subtotal = document.getElementById("subtotal").innerText;
  let ivas = document.getElementById("ivas").innerText;
  let selectMesa = document.getElementById("selectMesa").value;
  let meseroA = document.getElementById("mesero").value;
  let meseroI = document.getElementById("identifiador").value;
  let idDomPersona = document.getElementById("idDomPersonas").value;
  let propina = document.getElementById("totalPropina").innerText;
  if (banderaTipoPago) {
    preUrl2 += "&tipopago=0";
  } else {
    preUrl2 += "&tipopago=1";
  }
  preUrl2 += "&idDomPersona=" + idDomPersona;
  preUrl2 += "&subtotal=" + subtotal;
  preUrl2 += "&iva=" + ivas;

  preUrl2 += "&estatus=" + estat;
  preUrl2 += "&id_cajero=" + idCajero;
  preUrl2 += "&id_tienda=" + idTienda;
  preUrl2 += "&totalventa=" + totalisimo.innerText;
  preUrl2 += "&subt=" + totalisimo.innerText;

  preUrl2 += "&contadorTotal=" + maxTabla;
  preUrl2 += "&cantidad_recibida=" + pagoT;
  preUrl2 += "&folioTiket=" + fec2;
  preUrl2 += "&cliente=" + clienteF;
  preUrl2 += "&selectMesa=" + selectMesa;
  preUrl2 += "&propina=" + propina;
  preUrl2 += "&mesero=" + meseroA;
  preUrl2 += "&identifiador=" + meseroI;

  let idTurno = document.getElementById("turnoId").innerText;

  console.log(`../OvFetch?turno=${idTurno}${preUrl}${preUrl2}${preUrlObs}`);
  let urlfetch = `../OvFetch?turno=${idTurno}${preUrl}${preUrl2}${preUrlObs}`;
  console.log(urlfetch);

  if (banRestaurat == 3) {
  } else {
    // cambioTiket = (cambioTiket * 1).toFixed(2)
    // pagoT = (pagoT * 1).toFixed(2)
    // let urlTik = "tiketjs.jsp?folio=" + fec2 + "&turno=" + idTurno + "&propina=" + propina + "&banD=0&max=" + maxTabla + "&totalisimo=" + totalTiket + "&cambio=" + cambioTiket + "&pago=" + pagoT + "&tienda=" + name_store + "&iva1=" + ivas + "&sub1=" + subtotal + "&dirEntrega=" + dirEntrega + "&banentrega=" + estat + "&nombre_persona=" + nomCajero + preUrlTiket;
    // OpenEdit2(urlTik)
  }

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
          Swal.fire(
            `   <div class="text-primary" >   Error intente de nuevo    </div>`
          );

          //   alert('La session se termino');
          location.reload();
          return;
        }
        console.log(res);
        let arr = res.split("/*/");

        console.info(arr[1]);
        let arrURL = arr[1].split("-salto-");
        //**COLOCAR SERVICIO JERRY
        //REGRESAR JSON
        if (arrURL[0] !== "0") {
          console.log("1a" + arrURL[0]);
          comunica(arrURL[0]);
        }
        if (arrURL[1] !== "0") {
          console.log("2a" + arrURL[1]);
          comunica(arrURL[1]);
        }
        if (arrURL[2] !== "0") {
          console.log("3a" + arrURL[2]);
          comunica(arrURL[2]);
        }
        limpiar();
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
      // body: JSON.stringify(data),
      body: JSON.stringify(data),
    });
    const content = await rawResponse;
    if (content.status == 500) {
      //  alert(
      //    "No se encontró la impresora, asegurate que estas conectado a la red local, si el problema persiste ponte en contacto con el administrador de sistemas"
      //  );
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
         Correcto 
        </div>`);
  banderaPagando = false;
  cerrarBtn.style.display = "block";
  botonP.style.disabled = false;
  botonP.innerHTML = "Aceptar";
  productos = [];
  totalisimo.innerHTML = 0.0;
  cuerpoTabla.innerHTML = "";
  tituloModal.innerText = "";
  document.getElementById("pago").value = "";
  $("#modalCobro").modal("hide");
  tipoEntregaT = 0;
  //banderaTipoPago = !banderaTipoPago;
  btnTipoEntrega.style.display = "none";
  btnTipoPago.innerHTML = `<i class="mr-2" aria-hidden="true">$</i> Efectivo`;
  banderaTipoPago = true;
  entDomB = 0;
  document.getElementById("nombre").value = "";
  document.getElementById("paterno").value = "";
  document.getElementById("materno").value = "";
  document.getElementById("calle").value = "";
  document.getElementById("colonia").value = "";
  document.getElementById("cp").value = "";
  document.getElementById("tel").value = "";
  document.getElementById("municipio").value = "";
  document.getElementById("estado").value = "";
  document.getElementById("numero").value = "";
  document.getElementById("ciudad").value = "";
  document.getElementById("obs").value = "";
  document.getElementById("selectMesa").value = 0;
  document.getElementById("cambio").innerText = "";
  document.getElementById("idDomPersonas").value = 0;
  document.getElementById("subtotal").innerText = "0.00";
  document.getElementById("ivas").innerText = "0.00";
  document.getElementById("totalPropina").innerText = "0";
  document.getElementById("banderaEnter").value = "0";
  ModalShowDom = true; //formCC
  document.getElementById("entrega").selectedIndex = 0;
  document.getElementById("formCC").reset();
  idDireccionCliente = 0;
  let turnoT2 = localStorage.getItem("turno");

  turnoT2 = turnoT2 * 1 + 1;
  localStorage.setItem("turno", turnoT2);
  BtnTurno.innerText = "Turno B-" + turnoT2;
  document.getElementById("btntot").disabled = false;
  //document.getElementById('entregaRest').style.display = 'none';
  document.getElementById("btnP").style.display = "none";
  mostrarPrecio(0);
  document.getElementById("cliente2").value = 0;
  document.getElementById("titulMesa").innerText = "0";

  document.getElementById("tipoValor1B").value = "0";

  abrirmesa();
}

function borrar1(borrar) {
  //let borrado=document.getElementById(borrar);
  //borrado.innerHTML='';
  console.log(productos);
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
    // document.getElementById('entregaRest').style.display = 'none';
    document.getElementById("tcliente").style.display = "block";
    document.getElementById("cliente2").value = 0;
    mostrarPrecio(0);
    sumarTotal();
    document.getElementById("tipoValor1B").value = "0";
  } else if (valor == 3) {
    btnTipoEntrega.style.display = "none";
    // document.getElementById('entregaRest').style.display = 'block';
    document.getElementById("tcliente").style.display = "block";
    document.getElementById("cliente2").value = 0;
    mostrarPrecio(0);
    document.getElementById("tipoValor1B").value = "0";
  } else if (valor == 4) {
    // btnPagoDomicilio.innerHTML = '<button  class="btn btn-success btn-block"  style="height:  70px;font-size: 30px;"  onclick="cobrarDom()" >  Total $ <div id="totalG">0.00</div>   </button>';
    //  document.getElementById('entregaRest').style.display = 'none';
    btnTipoEntrega.style.display = "block";
    document.getElementById("tcliente").style.display = "none";
    document.getElementById("cliente31_chosen").style.width = "100%";

    // cuerpoTabla.innerHTML += `
    //                         <tr id="44276">
    //                         <td>  </td>
    //                         <td class="text-center">1</td>
    //                         <td> </td>
    //                         <td>Entrega a domicilio</td>
    //                          <td>$<input type="hidden" value="15" id="pu44276" /></td>
    //                         <td>30</td>
    //                         <td class="text-center" onclick="borrar1('44276')"><i class="fas fa-trash-alt"></i></td>
    //                       </tr>
    //                         `;
    sumarTotal();
  } else {
    sumarTotal();
  }
}

function buscaCliente(valor, opcion) {
  if (valor == 0) {
    return;
  } else if (valor == -1) {
    $("#ModalDireccion0").modal("show");
    document.getElementById("estado_chosen").style.width = "100%";
  } else {
    let encoded1 = encodeURI("../BuscarCliente?buscar=" + valor + "&op=0");
    fetch(encoded1)
      .then((res) => res.text())
      .then((res) => {
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

        if (res.trim() == "error") {
          console.log("La session se termino");
          //   alert('La session se termino');
          location.reload();
        }
      });
  }
}

function usarD(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12) {
  entDomB = 2;
  //document.getElementById('nombre').value = v0;
  //document.getElementById('paterno').value = v1;
  //document.getElementById('materno').value = v2;
  //document.getElementById('cp').value = v6;
  //document.getElementById('colonia').value = v5;
  //document.getElementById('calle').value = v4;
  //document.getElementById('municipio').value = v7;
  //document.getElementById('estado').value = v8;
  //document.getElementById('numero').value = v10;
  //document.getElementById('ciudad').value = v11;
  //document.getElementById('obs').value = v12;
  //document.getElementById('nombre').focus();
  $("#ModalDireccion").modal("hide");
  document.getElementById(
    "domEntrega"
  ).innerHTML = `<spam>Domicilio: ${v5} ${v4} ${v10} ${v6} ${v7},
                                                             Cliente: ${v0} ${v1} ${v2} </spam>
        `;
  document.getElementById("idDomPersonas").value = v9;
  //idDireccionCliente = v9;
  //console.log(entDomB);
}

function turnoActivo() {
  tufoco();
  comprobar();

  let turnoT = 0; // localStorage.getItem('turno');
  console.log(turnoT);
  SecuenciaTurno;
  if (turnoT == null || turnoT == undefined) {
    localStorage.setItem("turno", "1");
    BtnTurno.innerText = "Turno B-1";
  } else {
    BtnTurno.innerText = "Turno B-" + turnoT;
  }

  abrirmesa();
}
function tufoco() {
  let temfoc = document.getElementById("entrega");
  temfoc.focus();
  // document.getElementById('t109Tab').click();
  document.getElementById("divPagoid").click();
  FuntionResize();
  // const boton = document.createElement("button");
  // boton.innerHTML = "Click aquí";
  // boton.style = "bottom:10px;right:10px;position:fixed;z-index:9999;"
  // document.body.appendChild(boton);
}

function addDir() {
  let v1Dom = document.getElementById("cp").value;
  let v2Dom = document.getElementById("colonia").value;
  let v3Dom = document.getElementById("calle").value;

  if (v1Dom == null || v1Dom == undefined || v1Dom == "") {
    validadorv1Dom.style.display = "block";
    return false;
  } else {
    validadorv1Dom.style.display = "none";
  }
  if (v2Dom == null || v2Dom == undefined || v2Dom == "") {
    validadorv2Dom.style.display = "block";
    return false;
  } else {
    validadorv2Dom.style.display = "none";
  }
  if (v3Dom == null || v3Dom == undefined || v3Dom == "") {
    validadorv3Dom.style.display = "block";
    return false;
  } else {
    validadorv3Dom.style.display = "none";
  }
  document.getElementById("btnAceptarDom").disabled = true;
  let Nomtik = document.getElementById("nombre").value;
  let apatik = document.getElementById("paterno").value;
  let amatik = document.getElementById("materno").value;
  let calleTik = document.getElementById("calle").value;
  let ColTik = document.getElementById("colonia").value;
  let cpTik = document.getElementById("cp").value;
  let celTik = document.getElementById("tel").value;
  let munTik = document.getElementById("municipio").value;
  let estTik = document.getElementById("estado").value;
  let numTik = document.getElementById("numero").value;
  let ciuTik = document.getElementById("ciudad").value;
  let obdTik = document.getElementById("obs").value;

  let encoded1 = encodeURI(
    "../BuscarCliente?op=1&nom=" +
      Nomtik +
      "&apa=" +
      apatik +
      "&ama=" +
      amatik +
      "&cel=" +
      celTik +
      "&cp=" +
      cpTik +
      "&col=" +
      ColTik +
      "&calle=" +
      calleTik +
      "&mun=" +
      munTik +
      "&est=" +
      estTik +
      "&num=" +
      numTik +
      "&ciu=" +
      ciuTik +
      "&obs=" +
      obdTik
  );
  fetch(encoded1)
    .then((res) => res.text())
    .then((res) => {
      console.log(res);
      $("#ModalDireccion0").modal("hide");
      document.getElementById(
        "domEntrega"
      ).innerHTML = `<spam>Domicilio: ${calleTik} ${ColTik} ${cpTik} ${numTik} ${munTik},
                                                                            Cliente: ${Nomtik} ${apatik}, ${celTik} </spam>
                             `;
      document.getElementById("idDomPersonas").value = res;
      document.getElementById("btnAceptarDom").disabled = false;

      if (res.trim() == "error") {
        console.log("La session se termino");
        //   alert('La session se termino');
        location.reload();
      }
    });
}

function cobrarDom() {
  let entrega2 = document.getElementById("entrega").value;

  Swal.fire({
    allowOutsideClick: false,
    icon: "info",
    title: "Espere...",
    text: "Guardando Informacion ....",
  });
  Swal.showLoading();

  let pagoT = 0;
  let maxTabla = cuerpoTabla.rows.length;

  let preUrl = "";
  let preUrl2 = "";
  let preUrlTiket = "";
  let preUrlObs = "";
  for (let i = 0; i < maxTabla; i++) {
    if (cuerpoTabla.rows[i].cells.length == 8) {
      let idProductoF = cuerpoTabla.rows[i].id;
      let cantidadF = cuerpoTabla.rows[i].cells[1].innerText;
      let descu = document.getElementById("pu" + idProductoF).value;
      let totalF = cuerpoTabla.rows[i].cells[5].innerText;
      let descProducto = cuerpoTabla.rows[i].cells[3].innerText;

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
        totalF;
      preUrlTiket +=
        "&cantidad[" +
        i +
        "]=" +
        cantidadF +
        "&descP[" +
        i +
        "]=" +
        descProducto +
        "&cu[" +
        i +
        "]=" +
        descu +
        "&total[" +
        i +
        "]=" +
        totalF;
    } else {
      let obssku = cuerpoTabla.rows[i].cells[0].innerText;
      preUrlObs += "&obssku[" + (i - 1) + "]=" + obssku;
    }
  }

  console.log(preUrl);

  let idCajero = document.getElementById("id_cajero").value;
  let nomCajero = document.getElementById("nombre_persona").value;
  let name_store = document.getElementById("name_store").value;
  let idTurno = document.getElementById("turnoId").innerText;
  let idTienda = document.getElementById("tienda").value;
  let clienteF = document.getElementById("cliente2").value;

  let totalTiket = totalisimo.innerText;
  let cambioTiket = 0;
  let fec2 = Date.now();
  let subtotal = document.getElementById("subtotal").innerText;
  let ivas = document.getElementById("ivas").innerText;
  let propina = document.getElementById("totalPropina").innerText;
  let meseroA = document.getElementById("mesero").value;
  let meseroI = document.getElementById("identifiador").value;
  preUrl2 += "&subtotal=" + subtotal;
  preUrl2 += "&iva=" + ivas;
  preUrl2 += "&estatus=4";
  preUrl2 += "&tipopago=0";
  preUrl2 += "&id_cajero=" + idCajero;
  preUrl2 += "&id_tienda=" + idTienda;
  preUrl2 += "&totalventa=" + totalisimo.innerText;
  preUrl2 += "&subt=" + totalisimo.innerText;
  preUrl2 += "&contadorTotal=" + maxTabla;
  preUrl2 += "&cantidad_recibida=0";
  preUrl2 += "&folioTiket=" + fec2;
  preUrl2 += "&cliente=" + clienteF;
  preUrl2 += "&propina=" + propina;
  preUrl2 += "&mesero=" + meseroA;
  preUrl2 += "&identifiador=" + meseroI;

  let turnoTT = localStorage.getItem("turno");
  console.log(`../OvFetch?turno=${idTurno}${preUrl}${preUrl2}${preUrlObs}`);
  let urlfetch = `../OvFetch?turno=${idTurno}${preUrl}${preUrl2}${preUrlObs}`;
  console.log(urlfetch);

  let banderaTikEnt = 1;

  //preUrlTiket += "&nomTik=" + Nomtik;
  //preUrlTiket += "&ap1="    + apatik
  //preUrlTiket += "&ap2="    + amatik
  //preUrlTiket += "&cel="    + celTik
  //preUrlTiket += "&cpTik="  + cpTik;
  //preUrlTiket += "&colTik=" + ColTik;
  //preUrlTiket += "&calleTik=" + calleTik;
  //preUrlTiket += "&mun=" + munTik;
  //preUrlTiket += "&est=" + estTik;
  //preUrlTiket += "&num=" + numTik;
  //preUrlTiket += "&ciu=" + ciuTik;
  //preUrlTiket += "&obs=" + obdTik;

  cambioTiket = (cambioTiket * 1).toFixed(2);
  pagoT = (pagoT * 1).toFixed(2);

  let urlTik =
    "tiketjs.jsp?folio=" +
    fec2 +
    "&turno=" +
    idTurno +
    "&propina=" +
    propina +
    "&banD=" +
    banderaTikEnt +
    "&max=" +
    maxTabla +
    "&totalisimo=" +
    totalTiket +
    "&cambio=" +
    cambioTiket +
    "&pago=" +
    pagoT +
    "&tienda=" +
    name_store +
    "&iva1=" +
    ivas +
    "&sub1=" +
    subtotal +
    "&nombre_persona=" +
    nomCajero +
    preUrlTiket;
  OpenEdit2(urlTik);
  let encoded1 = encodeURI(urlfetch);
  enviarSolicitud(encoded1);
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
    if (cuerpoTabla.rows[i].cells.length == 8) {
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
  let bandera = document.getElementById("entrega").value;

  if (bandera == 1 || bandera == 2) {
    // cobrarNormal();
    pdfs1();
    document.getElementById("btntot").disabled = true;
  } else if (bandera == 4) {
    //cobrarNormal();
    pdfs1();
    document.getElementById("btntot").disabled = true;
  } else if (bandera == 3) {
    pdfs1();
    document.getElementById("btntot").disabled = true;
  } else {
    cobrarNormal();
  }
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

  let temp = res.trim();
  if (temp == "error") {
    console.log("La session se termino");
    //   alert('La session se termino');
    location.reload();
  }
  console.log(valor);
}

function FuntionResize() {
  var widthBrowser = window.outerWidth;
  var heightBrowser = window.outerHeight;
  console.log(
    "Tamaño de la pantalla del navegador: width=" +
      widthBrowser +
      ", height=" +
      heightBrowser
  );
}

const formulario = document.querySelector("#formulario");
//const btnbuscar=document.querySelector('#btnbuscar');
const resultados = document.querySelector("#resultados");

const filtrar = () => {
  console.log(productosB);
  console.log(formulario.value);
  resultados.innerHTML = "";
  const textos = formulario.value.toLowerCase();
  let valorPrec1 = document.getElementById("tipoValor1B").value;
  let precio = "0";
  for (let producto of productosB) {
    let nombre = producto.nombre.toLowerCase();
    if (nombre.indexOf(textos) !== -1) {
      // valor:{ descripcion:'"+desc +"' ,precio: '"+precio+"',idp: '"+idP+"',p0: 'p0"+idCarta+"',prep: '"+prep+"' } },";
      if (valorPrec1 === "0") {
        precio = producto.valor.precio;
      } else if (valorPrec1 === "1") {
        precio = producto.valor.precio1;
      } else if (valorPrec1 === "2") {
        precio = producto.valor.precio2;
      } else if (valorPrec1 === "3") {
        precio = producto.valor.precio3;
      } else if (valorPrec1 === "4") {
        precio = producto.valor.precio4;
      } else if (valorPrec1 === "5") {
        precio = producto.valor.precio5;
      } else if (valorPrec1 === "6") {
        precio = producto.valor.precio6;
      } else if (valorPrec1 === "7") {
        precio = producto.valor.precio7;
      } else {
      }
      resultados.innerHTML += ` 
                                                   <option class="transparente"  >${producto.valor.idp}..-${producto.nombre} -$ ${precio} </option >                  
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
