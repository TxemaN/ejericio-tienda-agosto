document.addEventListener('DOMContentLoaded', () => {
  /** Estas son las varables para identificar los elementos del HTML por su ID. */
    const carritoVacio = document.querySelector("#carritoVacio");
    const precioTotal = document.querySelector("#precioTotal");
    const botonPagar = document.querySelector("#botonPagar")
    const fragment = document.createDocumentFragment();
    let noPerderLocal = JSON.parse(localStorage.getItem("compradosArray")) || [];
    let precioFinal = JSON.parse(localStorage.getItem("sumaPrecios")) || [];

      /** Aquí la suma de los precios será igual al precio final generado en el main.js */
    let sumaPrecios = precioFinal


    botonPagar.addEventListener('click', (ev) => {
        ev.preventDefault()

        window.location.href = "index.html";

        borrarTodo()
    })
    //BOTONES AÑADIR Y QUITAR
    document.addEventListener("click", ({ target }) => {

        if (target.classList.contains("anyadir")) {
            const valorIdObjeto = target.value;
            const valorPrecioObjeto = target.value2;
            const valorNombreObjeto = target.value3;



            subirArrayLocal(valorIdObjeto, valorPrecioObjeto, valorNombreObjeto)


        }
        if (target.classList.contains("btnSumar")) {
            const valorIdObjeto = target.value;
            const valorPrecioObjeto = target.value2;
            const valorNombreObjeto = target.value3;


            subirUnoArrayLocal(valorIdObjeto, valorPrecioObjeto, valorNombreObjeto)
            llenarVacia();

        }
        if (target.classList.contains("btnQuitar")) {

            const valorIdObjeto = target.value;
            const valorPrecioObjeto = target.value2;
            const valorPrecioObjetoInicial = target.value3;
            console.log(valorIdObjeto, valorPrecioObjeto, valorPrecioObjetoInicial)
            quitarArrayLocal(valorIdObjeto, valorPrecioObjeto, valorPrecioObjetoInicial);

            llenarVacia();
        }

    });


    /** Añade producto desde el botón "añadir" de cada uno de los productos. Pasa la id, el precio, el nombre, la cantidad y la url de la imagen */

    const subirArrayLocal = (valorIdObjeto, valorPrecioObjeto, valorNombreObjeto) => {

        const coincidencia = noPerderLocal.find((elemento) => elemento.producto == valorIdObjeto)

        if (!coincidencia) {
            noPerderLocal.push({
                nombreProducto: valorNombreObjeto,
                producto: valorIdObjeto,
                precioProducto: valorPrecioObjeto,
                precioProductoInicial: valorPrecioObjeto,

                cantidad: 1,

            })
            sumaPrecios += valorPrecioObjeto
            console.log("PRECIOS" + sumaPrecios)
            localStorage.setItem("compradosArray", JSON.stringify(noPerderLocal));
        }
        else {
            coincidencia.nombreProducto = valorNombreObjeto;
            coincidencia.cantidad++;
            coincidencia.precioProductoInicial = valorPrecioObjeto;
            coincidencia.precioProducto = valorPrecioObjeto * coincidencia.cantidad;

            localStorage.setItem("compradosArray", JSON.stringify(noPerderLocal));
            sumaPrecios += valorPrecioObjeto;
            console.log(coincidencia)
            console.log("PRECIOS" + sumaPrecios)
        }

    }
  /** Añade producto desde el botón con símbolo "+". modifica la cantidad en el carrto y la suma total del valor de las compras */
    const subirUnoArrayLocal = (valorIdObjeto, valorPrecioObjeto, valorPrecioObjetoInicial) => {
        const coincidencia = noPerderLocal.find((elemento) => elemento.producto == valorIdObjeto)

        if (coincidencia.cantidad > 0) {
            coincidencia.cantidad++;
            coincidencia.precioProducto = valorPrecioObjeto + valorPrecioObjetoInicial;
            console.log(coincidencia);
            sumaPrecios += valorPrecioObjetoInicial
            localStorage.setItem("compradosArray", JSON.stringify(noPerderLocal));
            console.log("PRECIOS" + sumaPrecios)
        }

        else {
            const posicionElemento = noPerderLocal.findIndex((elemento) => elemento.producto == valorIdObjeto)
            if (posicionElemento !== -1) {
                noPerderLocal.splice(posicionElemento, 1)
                localStorage.setItem("compradosArray", JSON.stringify(noPerderLocal));
            }
        }

    }

    /** Elimina un producto desde el botón con símbolo "-". modifica la cantidad en el carrto y la suma total del valor de las compras */

    const quitarArrayLocal = (valorIdObjeto, valorPrecioObjeto, valorPrecioObjetoInicial) => {
        const coincidencia = noPerderLocal.find((elemento) => elemento.producto == valorIdObjeto)

        if (coincidencia.cantidad > 1) {
            coincidencia.cantidad--;
            coincidencia.precioProducto = valorPrecioObjeto - valorPrecioObjetoInicial;
            console.log(coincidencia);
            sumaPrecios -= valorPrecioObjetoInicial
            localStorage.setItem("compradosArray", JSON.stringify(noPerderLocal));
            console.log("PRECIOS" + sumaPrecios)
        }

        else {
            sumaPrecios -= valorPrecioObjetoInicial
            const posicionElemento = noPerderLocal.findIndex((elemento) => elemento.producto == valorIdObjeto)
            if (posicionElemento !== -1) {
                noPerderLocal.splice(posicionElemento, 1)
                localStorage.setItem("compradosArray", JSON.stringify(noPerderLocal));

            }
        }

    }





 /** Representa en el HTML todas las variables que se han modificado en localStorage */

    const llenarVacia = () => {
        if (sumaPrecios < 1) {
            sumaPrecios = 0
        }
        if (sumaPrecios > 0) {
            botonPagar.classList.remove("ocultable")


        }
        if (sumaPrecios < 1) {

            botonPagar.classList.add("ocultable")
        }
        carritoVacio.innerHTML = ""
        precioTotal.innerHTML = ""
        const pagarTodo = document.createElement("TD");

        pagarTodo.textContent = sumaPrecios.toFixed(2)



        noPerderLocal.forEach((item) => {

            const nuevoArticulo = document.createElement("TR");




            const nombreProducto = document.createElement("TD");
            nombreProducto.textContent = item.nombreProducto;


            const imagenProducto = document.createElement("TD");
            imagenProducto.classList.add("numeros");
            const espacioFoto = document.createElement("FIGURE")

            const fotoProducto = document.createElement("IMG")

            fotoProducto.src = item.urlImagen;
            fotoProducto.classList.add("fotoPagar")

            const cantidadProducto = document.createElement("TD");
            cantidadProducto.classList.add("numeros");
            cantidadProducto.textContent = item.cantidad;

            const precioIndividual = document.createElement("TD");
            precioIndividual.classList.add("numeros");
            precioIndividual.textContent = item.precioProductoInicial.toFixed(2)

            const precioProducto = document.createElement("TD");
            precioProducto.classList.add("numeros");
            precioProducto.textContent = item.precioProducto.toFixed(2);

            const botones = document.createElement("TD");
            botones.classList.add("numeros");

            const botonQuitar = document.createElement("BUTTON")
            botonQuitar.classList.add("btnQuitar");
            botonQuitar.textContent = "-";
            botonQuitar.value = item.producto;
            botonQuitar.value2 = item.precioProducto;
            botonQuitar.value3 = item.precioProductoInicial;


            const botonSumar = document.createElement("BUTTON")
            botonSumar.classList.add("btnSumar");
            botonSumar.textContent = "+";
            botonSumar.value = item.producto;
            botonSumar.value2 = item.precioProducto;
            botonSumar.value3 = item.precioProductoInicial;

            botones.append(botonQuitar, botonSumar)
            espacioFoto.append(fotoProducto);
            imagenProducto.append(espacioFoto)
            fragment.append(nuevoArticulo, nombreProducto, imagenProducto, cantidadProducto, precioIndividual, precioProducto, botones);
            carritoVacio.append(fragment)

        })



        precioTotal.append(pagarTodo)
    };
    const borrarTodo = () => {

        localStorage.clear();
        noPerderLocal = [];

        llenarVacia();
    }


    llenarVacia()

    console.log(noPerderLocal)
    console.log(precioFinal)
})//LOAD
