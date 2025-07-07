window.onload = () => {
  createInputs(1, 5);
  createInputs(2, 6);
  createInputs(3, 6);
  showTab('donem1');

  const darkModeToggle = document.getElementById('darkModeToggle');

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      darkModeToggle.textContent = '☀️ Gece Modu Kapat';
      localStorage.setItem('darkMode', 'enabled');
    } else {
      darkModeToggle.textContent = '🌙 Gece Modu Aç';
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ Gece Modu Kapat';
  }

  [1, 2, 3].forEach((donem) => gosterGecmis(donem));
};

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach((tab) => (tab.style.display = 'none'));
  document.getElementById(tabId).style.display = 'block';
}

function createInputs(donem, count) {
  const container = document.getElementById(`inputs${donem}`);
  container.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.max = 100;
    input.placeholder = `Komite ${i}`;
    input.id = `d${donem}_k${i}`;
    container.appendChild(input);
  }
}

function hesapla(donem, komiteSayisi) {
  let notlar = [];
  for (let i = 1; i <= komiteSayisi; i++) {
    let val = parseFloat(document.getElementById(`d${donem}_k${i}`).value);
    if (isNaN(val) || val < 0 || val > 100) {
      alert(`Komite ${i} için geçerli bir not girin (0-100 arası)`);
      return;
    }
    notlar.push(val);
  }

  let ortalama = notlar.reduce((a, b) => a + b, 0) / komiteSayisi;
  let yuvarlanmisOrtalama = Math.round(ortalama);

  const sonucDiv = document.getElementById(`sonuc${donem}`);
  sonucDiv.innerHTML = '';

  let sonucMetni = `Dönem ${donem} Yuvarlanmış Not Ortalaması: ${yuvarlanmisOrtalama}\n`;

  if (yuvarlanmisOrtalama >= 75) {
    sonucDiv.innerHTML = `
      <b>Yuvarlanmış Ortalama: ${yuvarlanmisOrtalama}</b><br>
      🎉 Finalsiz geçtiniz!<br>
      <img src="finalsiz-gectiniz.jpg" alt="Finalsiz geçtiniz" style="width:200px;">
      <canvas id="confetti${donem}"></canvas>
    `;
    konfetiYagdir(`confetti${donem}`);
    sonucMetni += "Finalsiz geçtiniz! 🎉";

    kaydetGecmis(donem, sonucMetni, notlar);
    gosterGecmis(donem);
    cizBarChart(donem, notlar);
    eklePaylasButonu(sonucDiv, sonucMetni);
    return;
  }

  const yuzde60 = yuvarlanmisOrtalama * 0.6;
  let gerekliFinal = (59.5 - yuzde60) / 0.4;
  let gerekliFinalYuvarlanmis = Math.ceil(gerekliFinal * 2) / 2;

  if (gerekliFinal > 100) {
    sonucDiv.innerHTML = `
      <b>Yuvarlanmış Ortalama: ${yuvarlanmisOrtalama}</b><br>
      <div style="font-size: 22px; color: #d9534f; margin-top: 10px;">
        😢 Ne yazık ki finalden <b>${gerekliFinalYuvarlanmis}</b> almanız gerekiyor.<br>
        Bu mümkün değil, <b>sınıfta kaldınız.</b>
      </div>
      <img src="uzgun-kedi.jpg" alt="Üzgün kedi" style="margin-top: 15px; width: 200px;">
    `;
    sonucMetni += `Final notu çok yüksek: ${gerekliFinalYuvarlanmis}. Sınıfta kaldınız.`;
  } else if (gerekliFinalYuvarlanmis <= 50) {
    sonucDiv.innerHTML = `
      <b>Yuvarlanmış Ortalama: ${yuvarlanmisOrtalama}</b><br>
      🎉 Tebrikler! Final notunuz <b>${gerekliFinalYuvarlanmis}</b>. Final barajı olan 50'yi geçerek dönemi geçebilirsiniz!
    `;
    sonucMetni += `Finalden almanız gereken not: ${gerekliFinalYuvarlanmis}. Final barajını geçtiniz!`;
  } else {
    sonucDiv.innerHTML = `
      <b>Yuvarlanmış Ortalama: ${yuvarlanmisOrtalama}</b><br>
      Final sınavından geçmek için minimum <b>${gerekliFinalYuvarlanmis}</b> almanız gerekiyor.
    `;
    sonucMetni += `Finalden almanız gereken minimum not: ${gerekliFinalYuvarlanmis}.`;
  }

  kaydetGecmis(donem, sonucMetni, notlar);
  gosterGecmis(donem);
  cizBarChart(donem, notlar);
  eklePaylasButonu(sonucDiv, sonucMetni);
}

function konfetiYagdir(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  let confetti = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    size: Math.random() * 5 + 2,
  }));

  let gravity = 1;
  let angle = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((p) => {
      p.y += gravity;
      p.x += Math.sin(angle) * 2;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.y > canvas.height) p.y = -10;
    });
    angle += 0.01;
    requestAnimationFrame(draw);
  }
  draw();
}

function kaydetGecmis(donem, sonucMetni, notlar) {
  let key = `odunot_gecmis_donem${donem}`;
  let gecmis = JSON.parse(localStorage.getItem(key)) || [];
  gecmis.unshift({ tarih: new Date().toLocaleString(), sonuc: sonucMetni, notlar: notlar });
  if (gecmis.length > 5) gecmis.pop();
  localStorage.setItem(key, JSON.stringify(gecmis));
}

function gosterGecmis(donem) {
  const sonucDiv = document.getElementById(`sonuc${donem}`);
  let key = `odunot_gecmis_donem${donem}`;
  let gecmis = JSON.parse(localStorage.getItem(key)) || [];

  let eskiListe = sonucDiv.querySelector('.gecmis-listesi');
  if (eskiListe) eskiListe.remove();

  if (gecmis.length === 0) return;

  let ul = document.createElement('ul');
  ul.className = 'gecmis-listesi';
  ul.style.textAlign = 'left';
  ul.style.marginTop = '20px';
  ul.style.maxHeight = '200px';
  ul.style.overflowY = 'auto';
  ul.style.paddingLeft = '15px';
  ul.style.borderTop = '1px solid #ccc';

  gecmis.forEach((item) => {
    let li = document.createElement('li');
    li.style.marginBottom = '8px';
    li.innerHTML = `<b>${item.tarih}</b>: ${item.sonuc.replace(/\n/g, '<br>')}`;
    ul.appendChild(li);
  });

  sonucDiv.appendChild(ul);
}

function cizBarChart(donem, notlar) {
  const sonucDiv = document.getElementById(`sonuc${donem}`);
  let eskiCanvas = document.getElementById(`barChart${donem}`);
  if (eskiCanvas) eskiCanvas.remove();

  const canvas = document.createElement('canvas');
  canvas.id = `barChart${donem}`;
  canvas.width = 300;
  canvas.height = 150;
  canvas.style.marginTop = '15px';
  sonucDiv.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const barWidth = 40;
  const gap = 20;
  const maxHeight = 100;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  notlar.forEach((not, i) => {
    let barHeight = (not / 100) * maxHeight;
    let x = gap + i * (barWidth + gap);
    let y = canvas.height - barHeight - 20;

    ctx.fillStyle = '#3498db';
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText(`K${i + 1}`, x + 12, canvas.height - 5);
    ctx.fillText(not.toFixed(1), x + 10, y - 5);
  });
}

function eklePaylasButonu(sonucDiv, sonucMetni) {
  let eskiButon = document.getElementById('paylasButon');
  if (eskiButon) eskiButon.remove();

  const btn = document.createElement('button');
  btn.id = 'paylasButon';
  btn.textContent = 'Sonucu Kopyala / Paylaş';
  btn.style.marginTop = '15px';
  btn.style.padding = '8px 16px';
  btn.style.cursor = 'pointer';

  btn.onclick = () => {
    navigator.clipboard.writeText(sonucMetni)
      .then(() => alert('Sonuç kopyalandı, istediğiniz platformda paylaşabilirsiniz!'))
      .catch(() => alert('Kopyalama başarısız oldu.'));
  };

  sonucDiv.appendChild(btn);
}
