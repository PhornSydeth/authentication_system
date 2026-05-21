package com.springsecurity.authsystem.util;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

public class KeyGenerator {

    public static void main(String[] args) {
        try {
            // Generates keys in the standard Maven resource directory
            generateKeys("src/main/resources/keys");
        } catch (Exception e) {
            System.err.println("Failed to generate RSA keys: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static void generateKeys(String dirPath) throws NoSuchAlgorithmException, IOException {
        File dir = new File(dirPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        File privateKeyFile = new File(dir, "private_key.pem");
        File publicKeyFile = new File(dir, "public_key.pem");

        if (privateKeyFile.exists() && publicKeyFile.exists()) {
            System.out.println("RSA keys already exist at " + dir.getAbsolutePath() + ". Skipping generation.");
            return;
        }

        System.out.println("Generating secure RSA 2048-bit key pair...");
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair kp = kpg.generateKeyPair();

        PrivateKey privateKey = kp.getPrivate();
        PublicKey publicKey = kp.getPublic();

        // Private Key in PKCS8 format
        String privateKeyPem = "-----BEGIN PRIVATE KEY-----\n" +
                Base64.getMimeEncoder(64, new byte[]{'\n'}).encodeToString(privateKey.getEncoded()) +
                "\n-----END PRIVATE KEY-----\n";
        try (FileWriter fw = new FileWriter(privateKeyFile)) {
            fw.write(privateKeyPem);
        }

        // Public Key in X509 format
        String publicKeyPem = "-----BEGIN PUBLIC KEY-----\n" +
                Base64.getMimeEncoder(64, new byte[]{'\n'}).encodeToString(publicKey.getEncoded()) +
                "\n-----END PUBLIC KEY-----\n";
        try (FileWriter fw = new FileWriter(publicKeyFile)) {
            fw.write(publicKeyPem);
        }

        System.out.println("RSA key pair successfully generated at: " + dir.getAbsolutePath());
    }
}
