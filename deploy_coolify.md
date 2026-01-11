# Coolify'a Dağıtım

Bu rehber, **Vacant Crab** web uygulamasını kendi sunucunuzdaki Coolify örneğine nasıl dağıtacağınızı (deploy) açıklar.

## Ön Koşullar

1.  **Coolify Örneği**: Çalışan bir Coolify sunucunuz olmalıdır.
2.  **Git Deposu**: Proje, Coolify örneğiniz tarafından erişilebilen bir Git deposuna (GitHub, GitLab, vb.) yüklenmiş olmalıdır.
3.  **Dockerfile**: Proje, (doğrulanmış) bir üretime hazır `Dockerfile` içerir.

## Dağıtım Adımları (Git Kaynağı)

Çoğu dağıtım için önerilen yöntem budur.

1.  **Coolify'a Giriş Yapın**: Coolify kontrol panelinize erişin.
2.  **Yeni Kaynak Oluşturun**:
    *   **+ New** -> **Project** -> **New Project** tıklayın (veya mevcut bir projeyi seçin).
    *   **Production** (veya hedef ortamınızı) seçin.
    *   **New Resource**'a tıklayın.
3.  **Kaynak Seçin**:
    *   **Public Repository** (eğer deponuz herkese açıksa) veya **Private Repository** (GitHub App veya deploy key yapılandırmanız gerekir) seçeneğini seçin.
    *   Depo URL'nizi girin (örneğin, `https://github.com/kullaniciadi/antigravity-webapp`).
    *   **Branch**: `main` (veya hedef dalınız).
4.  **Derleme (Build) Yapılandırması**:
    *   Coolify, `Dockerfile` dosyasını otomatik olarak algılamalıdır.
    *   **Build Pack**: **Docker** seçili olduğundan emin olun.
    *   **Docker File Location**: `/Dockerfile` olarak bırakın.
5.  **Ağ Yapılandırması**:
    *   **Ports Exposes**: Dockerfile `80` portunu dışa açar. Coolify'ın bunu doğru eşlediğinden emin olun (genellikle otomatiktir, örn. `80:80`).
    *   **Domains**: Özel alan adınızı ayarlayın (örneğin, `https://benimuygulamam.com`).
6.  **Dağıt (Deploy)**:
    *   **Deploy** butonuna tıklayın.
    *   Derleme günlüklerini (build logs) izleyin. Şunları yapacaktır:
        1.  Depoyu klonlar.
        2.  Node.js uygulamasını derler (`npm install` -> `npm run build`).
        3.  Nginx imajını oluşturur.
7.  **Doğrulama**:
    *   Dağıtım "Healthy" (Sağlıklı) olduğunda, yapılandırdığınız alan adını ziyaret edin.

## Yöntem 2: Özel Docker Kayıt Defteri (Gelişmiş)

Eğer imajı yerel olarak derleyip (build) göndermeyi (push) tercih ederseniz:

1.  **İmajı Derleyin**:
    ```powershell
    docker build -t your-registry.com/webapp:latest .
    ```
2.  **İmajı Gönderin**:
    ```powershell
    docker push your-registry.com/webapp:latest
    ```
3.  **Coolify**: Kaynak olarak **Docker Image** seçin ve imaj etiketinizi girin.

## Sorun Giderme

-   **Derleme Başarısız mı Oldu?** Coolify'daki "Build Logs" kısmını kontrol edin. Yaygın sorunlar eksik ortam değişkenleri veya ağ zaman aşımlarıdır.
-   **404 Hatası mı Alıyorsunuz?** Dockerfile içinde `dist` klasörünün `/usr/share/nginx/html` konumuna doğru kopyalandığından emin olun (bu proje için halihazırda yapılandırılmıştır).
