if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
const productosJSON = localStorage.getItem("carrito");
let productos = JSON.parse(productosJSON);

function ready() {
  if (!JSON.parse(localStorage.getItem("carrito"))) {
    localStorage.setItem("carrito", JSON.stringify([]));
  }
  mostrarCarrito(productos);
}

function actualizarContadorCarrito() {
  // Obtén el arreglo desde el localStorage
  let productosCarrito = JSON.parse(localStorage.getItem("carrito"));

  // Verifica si productosCarrito es un arreglo y tiene elementos
  if (
    productosCarrito &&
    Array.isArray(productosCarrito) &&
    productosCarrito.length > 0
  ) {
    // Obtiene la longitud del arreglo
    let cantidadDePosiciones = productosCarrito.length;

    // Actualiza el contenido de todos los elementos con la clase "contador-carrito"
    let innerCarritos = document.querySelectorAll(".contador-carrito");
    innerCarritos.forEach((innerCarrito) => {
      innerCarrito.innerHTML = `<p class="contador-carrito-p">${cantidadDePosiciones}</p>`;
    });
  } else {
    // Si no hay elementos en el carrito, puedes mostrar "0" o un mensaje indicando que está vacío
    let innerCarritos = document.querySelectorAll(".contador-carrito");
    innerCarritos.forEach((innerCarrito) => {
      innerCarrito.innerHTML = `<p class="contador-carrito-p">0</p>`;
    });
  }
}

function borrarElemento(id) {
  // Filtrar los productos para eliminar el producto con el ID dado
  productos = productos.filter((row) => row.id != id);

  // Actualizar la lista de productos en el almacenamiento local
  localStorage.setItem("carrito", JSON.stringify(productos));

  // Mostrar el carrito actualizado
  mostrarCarrito(productos);
}

function vaciarCarrito() {
  const productosJSON = JSON.stringify([]);
  localStorage.setItem("carrito", productosJSON);
  mostrarCarrito([]);
}

async function finalizarCompra() {
  let data = {
    total: productos.reduce((acum, current) => acum + current.precio, 0),
    productos: productos,
  };
  let finalizarFetch = await fetch("/carrito/finalizar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  let response = await finalizarFetch.json();
  console.log(response);
}

function mostrarCarrito(productosCarrito) {
  let carritoProd = document.querySelector(".carrito-prod");
  if (productosCarrito.length > 0) {
    let subTotal = 0;
    carritoProd.innerHTML = ``;
    productosCarrito.forEach((element) => {
      subTotal = subTotal + parseFloat(element.precio);
      carritoProd.innerHTML += `<article>
                <div class="imagen-detalle-prod">
                    <img src="/img/products/${element.imagen}" alt="">
                </div>
                <div class="descripcion_search_prod2">
                    <h3>${element.nombre}</h3>
                    <h4 class="green">$${parseFloat(
                      element.precio
                    ).toLocaleString("es-ES")}</h4>
                    <div class="eliminar-edit">
                        <i class="fa-sharp fa-solid fa-trash eliminarCarrito" onClick="borrarElemento(${
                          element.id
                        })"></i>
                    </div>
                </div>
            </article>`;
      actualizarContadorCarrito();
    });
    console.log("Esta es el subtotal " + subTotal);
    document.querySelector(
      ".totalCart"
    ).innerHTML = `<h3 class="subtotal subtotal2">SubTotal: $${subTotal.toLocaleString(
      "es-ES"
    )}</h3>
            <h3 class="subtotal">Envio: $ 1.500</h3>
            <h2 class="total green">Total: $${(subTotal + 1500).toLocaleString(
              "es-ES"
            )}</h2>
            <button class="realizar-compra" onClick=finalizarCompra()>Realizar compra</button>
            <button class="realizar-compra" onClick=vaciarCarrito()>Vaciar carrito</button>`;
    actualizarContadorCarrito();
  } else {
    carritoProd.innerHTML = `<h2 class="carritoVacio">El carrito esta vacio <a href='/'>Compra ahora</a></h2>`;
    document.querySelector(".totalCart").innerHTML = ``;
    actualizarContadorCarrito();
  }
}
