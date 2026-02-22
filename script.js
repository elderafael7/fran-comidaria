const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address") 
const addressWarn = document.getElementById("address-warn")
const nomeInput = document.getElementById("nome")
const nomeWarn = document.getElementById("nome-warn")

let cart = []

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){4
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)

        //Adicionar no carrinho
    }
})

// Função para adicionar no carrinho

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item já existisse, aumenta apenas a quantidade + 1
        existingItem.quantity += 1
        Toastify({
            text: "Item adicionado ao carrinho",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#631812",
            },
        }).showToast()
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
        Toastify({
            text: "Item adicionado ao carrinho",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#631812",
            },
        }).showToast()
    }
    updateCartModal()
}


//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = ""
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        
        cartItemElement.classList.add("flex", "justify-content", "mb-4", "flex-col")
        
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium text-[#000000]">${item.name}</p>
                    <p class="text-[#000000]">Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2 text-[#000000]">R$ ${(item.price * item.quantity).toFixed(2).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}</p>
                </div>
                <div class="px-4 py-1 border-solid border-red-500 rounded" data-name="${item.name}">
                    <button class="remove-from-cart-btn text-[#631812] border-solid border-red-500" data-name="${item.name}">
                        <i class="fa-solid fa-trash text-[#631812]"></i>
                        Excluir
                    </button>
                </div>
            </div>
        `
        
        total += item.price * item.quantity;


        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

// Função para remover o item do carrinho

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal()
    }
}

//Limpar campo endereço
addressInput.addEventListener("input", function(event){
    let intputValue = event.target.value;

    if(intputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

//Limpar campo contato (phone)
nomeInput.addEventListener("input", function(event){
    let intputValue = event.target.value;

    if(intputValue !== ""){
        nomeInput.classList.remove("border-red-500")
        nomeWarn.classList.add("hidden")
    }

})


//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();

    if(!isOpen){
        Toastify({
            text: "Ops. o retaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#EF4444",
            },
        }).showToast()
        return;
    }
    
    if(cart.length === 0) return;
   
    /*if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }*/

    if(nomeInput.value === ""){
        nomeWarn.classList.remove("hidden")
        nomeInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whatsapp
    const cartItems = cart.map((item) =>{
        return(
            `*${item.name}*\n*Qtd:* ${item.quantity}  \n*Preço:* R$ ${(item.price * item.quantity).toFixed(2)}\n\n`
        )
    }).join("")

    const pedido = parseInt(Math.random() * 1000 + 1)
    const message = encodeURIComponent(`*------NOVO PEDIDO #${pedido}------*\n`+cartItems+`___________________\n`+`*Total:* ${cartTotal.textContent}\n`+`\n\n-------ENTREGA--------`+`\n*Cliente:* ${nomeInput.value}\n`+`*Obs:* \n${addressInput.value}`)
    const phone = "5592985873521"

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
});


//Verificar a hora e manipular o card horário
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    const day = data.getDay();
    if(day === 1) return false; // Segundas-feiras sempre fechado.
    return hora >= 17 && hora < 23; 
    //True = restaurante ta aberto.
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-500")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}