<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $method = $_POST['method'];

    // Your wallet addresses
    $walletAddresses = [
        'bitcoin' => 'your_bitcoin_wallet_address',
        'ethereum' => 'your_ethereum_wallet_address',
        'tether' => 'your_tether_wallet_address',
        'litecoin' => 'your_litecoin_wallet_address',
        'bitcoinsv' => 'your_bitcoinsv_wallet_address',
        'bitcoincash' => 'your_bitcoincash_wallet_address'
    ];

    if (array_key_exists($method, $walletAddresses)) {
        $walletAddress = $walletAddresses[$method];
        echo json_encode(['walletAddress' => $walletAddress]);
    } else {
        echo json_encode(['error' => 'Invalid payment method']);
    }
}
?>
