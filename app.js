// Sayfa yüklendiğinde çalışacak fonksiyon

window.onload = function () {

  // Firebase uygulama yapılandırması

  const firebaseConfig = {
    
  };

  // Firebase'i yapılandırma ile başlatma

  firebase.initializeApp(firebaseConfig);

  // Firebase veritabanı referansı

  var db = firebase.database();

  // Sohbet uygulamasının ana sınıfı

  class RealTimeChat {

    // Ana sayfayı oluşturma fonksiyonu

    home() {

      // Sayfanın içeriğini temizleme

      document.body.innerHTML = '';

      // Başlık ve katılma formu

      this.create_title();

      this.create_join_form();

    }

    // Sohbet sayfasını oluşturma fonksiyonu

    chat() {

      // Başlık ve sohbet alanı

      this.create_title();

      this.create_chat();

    }

    // Başlık oluşturma fonskiyonu

    create_title() {

      // Başlık container'ı

      var title_container = document.createElement('div');

      title_container.setAttribute('id', 'title_container');

      var title_inner_container = document.createElement('div');

      title_inner_container.setAttribute('id', 'title_inner_container');

      // Başlık metni

      var title = document.createElement('h1');

      title.setAttribute('id', 'title');

      title.textContent = 'Real Time Chat';

      // Başlık container'ını sayfaya ekleme

      title_inner_container.append(title);

      title_container.append(title_inner_container);

      document.body.append(title_container);

    }

    // Join formunu oluşturma fonksiyonu

    create_join_form() {

      var parent = this;

      // Join formu container'ı

      var join_container = document.createElement('div');

      join_container.setAttribute('id', 'join_container');

      var join_inner_container = document.createElement('div');

      join_inner_container.setAttribute('id', 'join_inner_container');

      // Join butonu container'ı

      var join_button_container = document.createElement('div');

      join_button_container.setAttribute('id', 'join_button_container');

      // Join butonu

      var join_button = document.createElement('button');

      join_button.setAttribute('id', 'join_button');

      join_button.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>';

      // Join input container'ı

      var join_input_container = document.createElement('div');

      join_input_container.setAttribute('id', 'join_input_container');

      // Join input

      var join_input = document.createElement('input');

      join_input.setAttribute('id', 'join_input');

      join_input.setAttribute('maxlength', 15);

      join_input.placeholder = 'Username';

      // Input alanına yazı yazılınca

      join_input.onkeyup = function () {

        // Input alanı boş değilse butonu aktifleştirme

        if (join_input.value.length > 0) {

          join_button.classList.add('enabled');

          // Butona tıklandığında çalışacak fonksiyon

          join_button.onclick = function () {

            // Kullanıcı adını kaydetme ve sohbet alanını oluşturma

            parent.save_name(join_input.value);

            join_container.remove();

            parent.create_chat();

          }

        } else {

          // Input alanı boşsa butonu devre dışı bırakma

          join_button.classList.remove('enabled');

        }

      };

      // Elementleri birbirine bağlama ve sayfaya ekleme

      join_button_container.append(join_button);

      join_input_container.append(join_input);

      join_inner_container.append(join_input_container, join_button_container);

      join_container.append(join_inner_container);

      document.body.append(join_container);

    }

    // Sohbet alanını oluşturma fonksiyonu

    create_load(container_id) {


      var parent = this;

      // Başlık container'ını ve başlığı sohbet moduna uygun hale getirme.

      var container = document.getElementById(container_id);

      container.innerHTML = '';

      var loader_container = document.createElement('div');

      loader_container.setAttribute('class', 'loader_container');

      var loader = document.createElement('div');

      loader.setAttribute('class', 'loader');

      loader_container.append(loader);

      container.append(loader_container);

    }

    // Sohbet container'ı ve diğer şeyler

    create_chat() {

      var parent = this;

      // Header

      var title_container = document.getElementById('title_container');

      var title = document.getElementById('title');

      title_container.classList.add('chat_title_container');

      // Başlığı küçültme

      title.classList.add('chat_title');

      var chat_container = document.createElement('div');

      chat_container.setAttribute('id', 'chat_container');

      var chat_inner_container = document.createElement('div');

      chat_inner_container.setAttribute('id', 'chat_inner_container');

      var chat_content_container = document.createElement('div');

      chat_content_container.setAttribute('id', 'chat_content_container');

      var chat_input_container = document.createElement('div');

      chat_input_container.setAttribute('id', 'chat_input_container');

      var chat_input_send = document.createElement('button');

      chat_input_send.setAttribute('id', 'chat_input_send');

      chat_input_send.setAttribute('disabled', true);

      chat_input_send.innerHTML = `<i class="far fa-paper-plane"></i>`;

      var chat_input = document.createElement('input');

      chat_input.setAttribute('id', 'chat_input');

      // Maksimum mesaj uzunluğunu ayarlama

      chat_input.setAttribute('maxlength', 1000);

      // Kullanıcı adını alma

      chat_input.placeholder = `${parent.get_name()}, say something.`;

      chat_input.onkeyup = function () {

        if (chat_input.value.length > 0) {

          chat_input_send.removeAttribute('disabled');

          chat_input_send.classList.add('enabled');

          chat_input_send.onclick = function () {

            chat_input_send.setAttribute('disabled', true);

            chat_input_send.classList.remove('enabled');

            if (chat_input.value.length <= 0) {

              return

            }

            // Loading circle ayarlama

            parent.create_load('chat_content_container');

            // Mesaj gönderme ve chat_input.value değerini iletme

            parent.send_message(chat_input.value);

            // Chat input box'ı temizleme

            chat_input.value = '';

            // Mesajdan sonra input'a odaklanma

            chat_input.focus();

          }

        } else {

          chat_input_send.classList.remove('enabled');

        }

      }

      var chat_logout_container = document.createElement('div');

      chat_logout_container.setAttribute('id', 'chat_logout_container');

      var chat_logout = document.createElement('button');

      chat_logout.setAttribute('id', 'chat_logout');

      chat_logout.textContent = `${parent.get_name()} • Log out`;

      // Log out ayarlama

      chat_logout.onclick = function () {

        localStorage.clear()

        // Ana sayfaya dönme

        parent.home()

      }

      chat_logout_container.append(chat_logout);

      chat_input_container.append(chat_input, chat_input_send);

      chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container);

      chat_container.append(chat_inner_container);

      document.body.append(chat_container);

      // Sohbet oluşturduktan sonra loading circle ayarlama

      parent.create_load('chat_content_container');

      // Sohbeti veri tabanından çekme

      parent.refresh_chat();

    }

    // İsmi localStorage'a kaydetme

    save_name(name) {

      localStorage.setItem('name', name);

    }

    // Mesajı gönderdikten sonra veri tabanına kaydetme

    send_message(message) {

      var parent = this;

      // Ad yoksa ve mesaj boşsa geri dönme ve mesajı göndermeme. Kullanıcı hacklemeye çalışıyor.

      if (parent.get_name() == null && message == null) {

        return;

      }

      // Veri tabanı değerlerini alma

      db.ref('chats/').once('value', function (message_object) {

        // Sohbeti sıraya göre düzenleme

        var index = parseFloat(message_object.numChildren()) + 1;

        db.ref('chats/' + `message_${index}`).set({

          name: parent.get_name(),

          message: message,

          index: index

        })

          .then(function () {

            // Mesaj gönderdikten sonra yenileme

            parent.refresh_chat();

          })

      })

    }

    // İsmi localStorage'dan alma

    get_name() {

      if (localStorage.getItem('name') != null) {

        return localStorage.getItem('name');

      } else {

        this.home();

        return null;

      }

    }

    // Veri tabanından chat'i çektikten sonra sohbeti yenileme

    refresh_chat() {

      var chat_content_container = document.getElementById('chat_content_container');

      // Sohbeti veri tabanından çekme

      db.ref('chats/').on('value', function (messages_object) {

        // Veriyi temizledikten sonra ekranın boşalması

        chat_content_container.innerHTML = '';

        // Chat'te mesaj yoksa boş döndürme

        if (messages_object.numChildren() == 0) {

          return;

        }

        // Mesaj değerlerini diziye çevirme

        var messages = Object.values(messages_object.val());

        var guide = []; // Mesajları organize etme rehberi

        var unordered = []; // Sırasız mesajlar

        var ordered = []; // Mesajları sıralama

        for (var i, i = 0; i < messages.length; i++) {

          // 0'dan messages.length'a kadar olan bir dizi

          guide.push(i + 1)

          // 'unordered' dizisi, her bir mesajın kendisi ve mesajın indeksini içerir.

          unordered.push([messages[i], messages[i].index]);

        }

        // Sırasız mesajları guide ile sıralama

        guide.forEach(function (key) {

          var found = false;

          unordered = unordered.filter(function (item) {

            if (!found && item[1] == key) {

              // Sıralı mesajları diziye sokma

              ordered.push(item[0]);

              found = true;

              return false;

            } else {

              return true;

            }

          })

        })

        let previousMessageUser = null; // Önceki mesajın kullanıcısını saklamak için değişken

        // Sıralı mesajları görüntüleme

        ordered.forEach(function (data) {

          var name = data.name;

          var message = data.message;

          var message_container = document.createElement('div');

          // Kullanıcı adı kontrolü

          if (name === localStorage.getItem('name')) {

            message_container.setAttribute('class', 'message_container_self');

          } else {

            message_container.setAttribute('class', 'message_container_other');

          }

          var message_inner_container = document.createElement('div');

          message_inner_container.setAttribute('class', 'message_inner_container');

          var message_user_container = document.createElement('div');

          message_user_container.setAttribute('class', 'message_user_container');

          var message_user = document.createElement('p');

          message_user.setAttribute('class', 'message_user');

          // Ana kullanıcıdan gelen mesajlarda kullanıcı adını gösterme
          
    if (name !== localStorage.getItem('name')) {

        // Eğer önceki mesaj aynı kullanıcıdan gelmiyorsa veya ana kullanıcı değilse, kullanıcı adını göster

        if (name !== previousMessageUser) {

            message_user.textContent = `${name}`;

        } else {

            // Aynı kullanıcıdan gelen ardışık mesajlarda kullanıcı adını gizle

            message_user_container.style.display = 'none';

        }

    } else {

        // Ana kullanıcı için kullanıcı adı alanını gizle

        message_user_container.style.display = 'none';

    }

          var message_content_container = document.createElement('div');

          message_content_container.setAttribute('class', 'message_content_container');

          var message_content = document.createElement('p');

          message_content.setAttribute('class', 'message_content');

          message_content.textContent = `${message}`;

          message_user_container.append(message_user);

          message_content_container.append(message_content);

          message_inner_container.append(message_user_container, message_content_container);

          message_container.append(message_inner_container);

          chat_content_container.append(message_container);

          // Bu mesajın kullanıcısını önceki mesaj kullanıcısı olarak sakla
          
          previousMessageUser = name;

        });

        // Son mesaja gitme

        chat_content_container.scrollTop = chat_content_container.scrollHeight;

      });

    }

  }

  var app = new RealTimeChat();

  // localStorage'da isim varsa çalıştır, yoksa ana sayfaya dön

  if (app.get_name() != null) {

    app.chat()

  }

}