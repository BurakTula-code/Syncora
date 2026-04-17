# 🎵 Syncora Play

Tarayıcınızdaki (Google Chrome) medya akışını masaüstüne taşıyan ve oradan tam yetkiyle kontrol etmenizi sağlayan, Electron ve WebSocket tabanlı çift taraflı senkronizasyon ekosistemi.

## 🚀 Özellikler

* **Geniş Platform Desteği:** YouTube, YouTube Music ve Spotify (Web) ile tam uyumlu ve kesintisiz entegrasyon.
* **Anlık Veri Akışı:** Çalan şarkının adı, sanatçısı, albüm kapağı ve saniyelik ilerleme durumu anında masaüstü arayüzüne yansır.
* **Çift Yönlü Tam Kontrol:** Masaüstü uygulamasındaki butonları kullanarak tarayıcıdaki müziği durdurun, değiştirin, sesini ayarlayın veya zaman çizelgesinde (seek) ileri-geri sarın.
* **Kopmaz Bağlantı (Heartbeat):** Gelişmiş "Ping-Pong" altyapısı sayesinde eklenti ile uygulama arasındaki bağlantı asla uykuya dalmaz; olası bir kopmada sistem 3 saniye içinde otomatik yeniden bağlanır.
* **Dinamik Temalandırma:** Çalan platforma göre arayüz renkleri otomatik adapte olur (Örn: Spotify için yeşil, YouTube için kırmızı).
* **Akıllı Kayan Yazı:** Uzun şarkı veya sanatçı isimleri, şık bir "marquee" animasyonu ile arayüze sığdırılır.

## 🛠️ Sistem Mimarisi

Syncora Play, iki ana bileşenin kusursuz iletişiminden oluşur:

1. **Syncora Medya Ajansı (Chrome Eklentisi):** Tarayıcıdaki (DOM) medya verilerini (video/audio etiketleri ve özel platform butonları) okur ve tetikler.
2. **Syncora Masaüstü (Electron.js):** Arka planda Node.js ile 8091 portunda bir yerel WebSocket sunucusu ayağa kaldırır. Gelen verileri şık bir masaüstü penceresinde (`renderer.js`) işler ve kullanıcı komutlarını eklentiye geri gönderir.

## 📦 Kurulum ve Kullanım

Sistemi kullanmaya başlamak için her iki bileşeni de aktif etmeniz gerekmektedir.

### 1. Masaüstü Uygulamasının Kurulumu
En kolay yöntem, **Releases** (Sürümler) sekmesinden güncel `Syncora Play Setup.exe` dosyasını indirip kurmaktır.
*(Geliştiriciler için kaynak koddan derleme: `npm install` ardından `npm start` veya EXE çıktısı için `npm run build`)*

### 2. Tarayıcı Eklentisinin Kurulumu
Uygulamanın tarayıcınızla konuşabilmesi için Syncora Medya Ajansı eklentisini kurmalısınız:
1. Google Chrome'da `chrome://extensions` adresine gidin.
2. Sağ üst köşeden **"Geliştirici modu"** anahtarını açık konuma getirin.
3. Sol üstteki **"Paketlenmemiş öğe yükle"** butonuna tıklayın.
4. İndirdiğiniz proje dosyalarındaki eklenti klasörünü (içinde `manifest.json` bulunan klasör) seçin.

> **Not:** Sistem yüklendikten sonra, masaüstü uygulamasını çalıştırın ve tarayıcınızdan desteklenen bir platformda müzik açın. Bağlantı otomatik olarak kurulacaktır.

## 👨‍💻 Geliştirici

**Burak Tula** - *Syncora Project*