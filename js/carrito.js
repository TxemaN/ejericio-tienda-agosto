document.addEventListener('DOMContentLoaded', () => {
    const productosSugeridos = document.querySelector("#productosSugeridos");
    const elegirProductos = document.querySelector("#elegirProductos");
    const espacioProductos = document.querySelector("#espacioProductos");
    const carritoVacio = document.querySelector("#carritoVacio");
    const precioTotal = document.querySelector("#precioTotal");
    const botonPagar = document.querySelector("#botonPagar")
    
    const urlBase = "https://dummyjson.com/products";

    const fragment = document.createDocumentFragment();

    let noPerderLocal = JSON.parse(localStorage.getItem("compradosArray")) || [];
    let precioFinal = JSON.parse(localStorage.getItem("sumaPrecios")) || [];
    let sumaPrecios=precioFinal
    elegirProductos.addEventListener('change', (ev) => {
        ev.preventDefault()
        let elegido = elegirProductos.value;
        let url = `${urlBase}/category/${elegido}`
        consulta(url);
        pintarProductos(url)


    })

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
    //PINTAR SUGERENCIAS EN LA PARTE SUPERIOR DE LA PÁGINA

    const pintarSugerencias = async () => {

        const sugerencias = [66, 67, 68, 69]
        sugerencias.forEach(async (item) => {
            const res = await fetch(`${urlBase}/${item}`)
            if (res.ok) {
                const sugerencia = await res.json();


                const cajaFoto = document.createElement('FIGURE');
                const foto = document.createElement('IMG');
                foto.classList.add("fotoSugerida")
                const descripcion = document.createElement("P")
                descripcion.textContent = "DECRIPCIÓN PRODUCTO:" + sugerencia.brand;

                const calificacion = document.createElement("P")
                calificacion.textContent = "CALIFICACIÓN DE LOS USUARIOS:" + sugerencia.rating;

                const precio = document.createElement("P")
                precio.textContent = "PRECIO: " + sugerencia.price;

                const descuento = document.createElement("P")
                descuento.textContent = "DESCUENTO EXCLUSIVO: " + sugerencia.discountPercentage + "%";

                const precioDescontado = document.createElement("P");
                const valorPrecioDescontado = (sugerencia.price - ((sugerencia.discountPercentage / 100) * sugerencia.price))
                precioDescontado.textContent = "PRECIO FINAL CON DESCUENTO: " + valorPrecioDescontado.toFixed(2)
                const botonAnyadir = document.createElement("BUTTON")
                botonAnyadir.classList.add("anyadir")

                botonAnyadir.value = sugerencia.id;
                botonAnyadir.value2 = valorPrecioDescontado;
                botonAnyadir.value3 = sugerencia.title;

                botonAnyadir.textContent = "AÑADIR AL CARRITO";

                foto.src = sugerencia.images[0];
                foto.id = sugerencia.title;
                cajaFoto.append(foto);
                cajaFoto.append(descripcion);
                cajaFoto.append(calificacion);
                cajaFoto.append(precio);
                cajaFoto.append(descuento);
                cajaFoto.append(precioDescontado);
                cajaFoto.append(botonAnyadir)
                fragment.append(cajaFoto);



            } productosSugeridos.append(fragment)
        })
    };





    //PINTAR LA LISTA DE OPCIONES 
    const pintarCategorias = async () => {
        try {
            const res = await fetch(`${urlBase}/categories`);
            if (res.ok) {
                const categorias = await res.json();


                categorias.forEach((element) => {
                    const opciones = document.createElement('OPTION');
                    opciones.value = element;
                    opciones.textContent = element;
                    elegirProductos.append(opciones);
                });
            } else {
                throw 'No se han cargado bien las categorías';
            }

        } catch (error) {
            console.log(error);
        }
    };


    //RECOGER PRODUCTOS UNA VEZ SE HA ELEGIDO LA CATEGORÍA
    const consulta = async (url) => {

        try {

            const res = await fetch(`${url}`)


            if (res.ok) {
                const datos = await res.json()
                console.log(res, "DATOS", datos.products)
                return {
                    ok: true,
                    datos: datos.products

                }



            }

            else {
                throw ('lo que pides no existe')

            }


        } catch (error) {
            return {
                ok: false,

                productos: error
            }
        }
    }

    const pintarProductos = async (url) => {

        const { ok, datos } = await consulta(url)


        if (ok) {

            espacioProductos.innerHTML = ""
            datos.forEach(({ images, title, description, rating, price, discountPercentage, id }) => {

                const nombreProducto = document.createElement("H2");
                nombreProducto.textContent = title;

                const espacioFoto = document.createElement('FIGURE');
                espacioFoto.classList.add('flexContainer');

                const foto = document.createElement('IMG');
                foto.classList.add("fotoCategoria")
                foto.src = images[0];
                foto.alt = title;

                const descripcion = document.createElement("P")
                descripcion.textContent = "DECRIPCIÓN PRODUCTO:" + description;

                const calificacion = document.createElement("P")
                calificacion.textContent = "CALIFICACIÓN DE LOS USUARIOS:" + rating;

                const precio = document.createElement("P")
                precio.textContent = "PRECIO: " + price;

                const descuento = document.createElement("P")
                descuento.textContent = "DESCUENTO EXCLUSIVO: " + discountPercentage + "%";

                const precioDescontado = document.createElement("P");
                const valorPrecioDescontado = (price - ((discountPercentage / 100) * price))
                precioDescontado.textContent = "PRECIO FINAL CON DESCUENTO: " + valorPrecioDescontado.toFixed(2)
                const botonAnyadir = document.createElement("BUTTON")
                botonAnyadir.classList.add("anyadir")
                const valores = { valorPrecioDescontado, id, title, images }
                botonAnyadir.value = valores.id;
                botonAnyadir.value2 = valores.valorPrecioDescontado;
                botonAnyadir.value3 = valores.title;


                botonAnyadir.textContent = "AÑADIR AL CARRITO";
                console.log(botonAnyadir.value)

                fragment.append(nombreProducto);
                espacioFoto.append(foto);
                fragment.append(espacioFoto);
                fragment.append(descripcion);
                fragment.append(calificacion);
                fragment.append(precio);
                fragment.append(descuento);
                fragment.append(precioDescontado);
                fragment.append(botonAnyadir)
                espacioProductos.append(fragment);


            });

            console.log(datos);
        } else {
            console.log(datos)
        }

    }
    //AÑADIR AL CARRITO

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
    //AÑADIR PRODUCTO DESDE BOTON MAS
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

    //QUITAR PRODUCTO

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


    //ACTUALIZAR PRECIO

    
    //LLENAR EL CARRITO

    const llenarVacia = () => {
        if(sumaPrecios<1) {
            sumaPrecios=0
          }
          if(sumaPrecios>0){
            botonPagar.classList.remove("ocultable")


        }
         if( sumaPrecios<1){

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
