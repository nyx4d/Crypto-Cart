async function fetchCryptoPrice(method) {
    const symbolMap = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        tether: 'USDT',
        litecoin: 'LTC',
        bitcoinsv: 'BSV',
        bitcoincash: 'BCH'
    };

    const symbol = symbolMap[method];

    if (!symbol) {
        console.error('Invalid payment method');
        return;
    }

    const response = await fetch(`https://api.coindesk.com/v1/bpi/currentprice/${symbol}.json`);
    const data = await response.json();
    return data.bpi.USD.rate_float;
}

async function getWalletAddress(method) {
    const response = await fetch('getCryptoPrice.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `method=${method}`
    });
    const data = await response.json();
    return data.walletAddress;
}

async function updateCryptoPrice(method, amount, cryptoAmountElement, walletAddressElement) {
    try {
        const price = await fetchCryptoPrice(method);
        const walletAddress = await getWalletAddress(method);
        const cryptoAmount = amount / price;
        cryptoAmountElement.innerText = cryptoAmount.toFixed(6);
        walletAddressElement.innerText = walletAddress;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    const paymentMethod = document.getElementById('payment-method');
    const getCryptoPriceButton = document.getElementById('get-crypto-price');
    const cryptoAmountElement = document.getElementById('crypto-amount');
    const walletAddressElement = document.getElementById('wallet-address');
    const initiatePaymentButton = document.getElementById('initiate-payment');

    let totalPrice = 0;
    let cart = [];

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const itemName = item.querySelector('h2').innerText;
            const itemPrice = parseFloat(item.getAttribute('data-price'));

            cart.push({ name: itemName, price: itemPrice });
            totalPrice += itemPrice;

            updateCart();
        });
    });

    getCryptoPriceButton.addEventListener('click', () => {
        const selectedPaymentMethod = paymentMethod.value;
        updateCryptoPrice(selectedPaymentMethod, totalPrice, cryptoAmountElement, walletAddressElement);
    });

    initiatePaymentButton.addEventListener('click', () => {
        initiatePayment();
    });

    function updateCart() {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerText = `${item.name} - $${item.price}`;
            cartItems.appendChild(li);
        });
        totalPriceElement.innerText = totalPrice.toFixed(2);
    }

    function initiatePayment() {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'initiatePayment.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (this.status === 200) {
                window.location.href = 'downloadPage.html';
            }
        };
        xhr.send(JSON.stringify(cart));
    }
});
