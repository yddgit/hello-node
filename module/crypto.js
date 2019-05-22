'use strict';

const crypto = require('crypto');

// MD5/SHA1，常用的哈希算法，用于给任意数据一个“签名”

const hash = crypto.createHash('md5'); // md5/sha1/sha256/sha512
// 可任意多次调用update()，默认字符编码为UTF-8，也可以传入Buffer
hash.update('Hello world!');
hash.update('Hello nodejs!');
console.log(hash.digest('hex')); // e7ccbe87d78713fb925afbb15a1f9485

// Hmac，也是一种哈希算法，与MD5/SHA1等不同的是，Hmac还需要一个密钥
// 只要密钥发生变化，同样的输入也会得到不同的签名，可以理解为用随机数“增强”的哈希算法

const hmac = crypto.createHmac('sha256', 'secret-key');
hmac.update('Hello world!');
hmac.update('Hello nodejs!');
console.log(hmac.digest('hex')); // 1b71dc8ab352f594ca1c6050976d4ab90677d377dee855d704c7b87cac871923

// AES，常用的对称加密算法
// AES有很多不同的算法：aes192, aes-128-ecb, aes-256-cbc
// AES除了密钥外，还可以指定IV（Initial Vector），不同的系统，IV不同，用相同密钥加密的结果也不同
// 加密结果通常有两种表示方法：hex和base64
// 如果无法正常解密，要确认是否使用同样的AES算法、字符串密钥和IV是否相同、加密后的数据是否统一为hex或base64格式

function aesEcrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

var data = 'Hello, this is a secret message';
var key = 'Password!';
var encrypted = aesEcrypt(data, key);
var decrypted = aesDecrypt(encrypted, key);
console.log('Plain text: ' + data);
console.log('Encrypted text: ' + encrypted);
console.log('Decrypted text: ' + decrypted);

// Diffie-Hellman，一种密钥交换协议，可以让双方不泄露密钥的情况下协商出一个密钥来
// DH算法基于数学原理：
// 1. 小明先选择一个素数和一个底数，如素数p=23，底数g=5(底数可以任选)，再选择一个秘密整数a=6，计算A=g^a mod p=8，然后大声告诉小红：p=23、g=5、A=8
// 2. 小红收到小明发来的p、g、A后，也选择一个秘密整数b=15，然后计算B=g^b mod p=19，并大声告诉小明：B=19
// 3. 小明自己计算出s=B^a mod p=2，小红也自己计算出s=A^b mod p=2，因此，最终协商的密钥s为2
// 整个过程，密钥2并不是小明告诉小红的，也不是小红告诉小明的，而是双方协商计算出来的
// 第三方只能知道p=23、g=5、A=8、B=19，由于不知道双方选的秘密整数a=6和b=15，因此无法计算出密钥2

var ming = crypto.createDiffieHellman(512);
var ming_keys = ming.generateKeys();

var prime = ming.getPrime();
var generator = ming.getGenerator();

console.log('Prime: ' + prime.toString('hex'));
console.log('Generator: ' + generator.toString('hex'));

var hong = crypto.createDiffieHellman(prime, generator);
var hong_keys = hong.generateKeys();

var ming_secret = ming.computeSecret(hong_keys);
var hong_secret = hong.computeSecret(ming_keys);

console.log('Secret of xiao ming: ' + ming_secret.toString('hex'));
console.log('Secret of xiao hong: ' + hong_secret.toString('hex'));

// RSA，一种非对称加密算法，一个私钥和一个公钥构成的密钥对。通过私钥加密，公钥解密，或者通过公钥加密，私钥解密。其中公钥可以公开，私钥必须保密

// 生成RSA密钥对：openssl genrsa -aes256 -out rsa-key.pem 2048
// 导出原始私钥：openssl rsa -in rsa-key.pem -outform PEM -out rsa-prv.pem
// 导出原始公钥：openssl rsa -in rsa-key.pem -outform PEM -pubout -out rsa-pub.pem

const fs = require('fs');

// 从文件加载key
function loadKey(file) {
    // key实际上就是PEM编码的字符串
    return fs.readFileSync(file, 'utf8');
}

let
    prvKey = loadKey('rsa-prv.pem'),
    pubKey = loadKey('rsa-pub.pem'),
    message = 'Hello, world';

// 使用私钥加密
let enc_by_prv = crypto.privateEncrypt(prvKey, Buffer.from(message, 'utf8'));
console.log('encrypted by private key: ' + enc_by_prv.toString('hex'));
let dec_by_pub = crypto.publicDecrypt(pubKey, enc_by_prv);
console.log('decrypted by public key: ' + dec_by_pub.toString('utf8'));

// 使用公钥加密
let enc_by_pub = crypto.publicEncrypt(pubKey, Buffer.from(message, 'utf8'));
console.log('encrypted by public key: ' + enc_by_pub.toString('hex'));
let dec_by_prv = crypto.privateDecrypt(prvKey, enc_by_pub);
console.log('decrypted by private key: ' + dec_by_prv.toString('utf8'));

// 如果把message字符串长度增加到很长，如1M，RSA加密会报错：data too large for key size
// 这是因为RSA加密的原始信息必须小于Key的长度。

// RSA并不适合加密大数据，而是先成一个随机的AES密码，用AES密码加密原始信息，然后用RSA加密AES口令
// 这样实际使用RSA时，给对方传的密文分两部分，一部分是AES加密的密文，另一部分是RSA加密的AES口令。
// 对方用RSA先解密出AES口令，再用AES解密密文，即可获得明文

// crypto模块也可以处理数字证书
