window.onload = () => {
  createInputs(1, 5);
  createInputs(2, 6);
  createInputs(3, 6);
  showTab('donem1');
};

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
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

  const hamOrtalama = notlar.reduce((a, b) => a + b, 0) / komiteSayisi;
  const ortalamaYuvarlanmis = Math.round(hamOrtalama);
  const sonucDiv = document.getElementById(`sonuc${donem}`);
  sonucDiv.innerHTML = '';

  if (hamOrtalama >= 75) {
    sonucDiv.innerHTML = `
      <b>Ortalamanız: ${hamOrtalama.toFixed(2)}</b><br>
      🎉 Finalsiz geçtiniz!<br>
      <img src="finalsiz-gectiniz.jpg" alt="Finalsiz geçtiniz" style="width:200px;">
      <canvas id="confetti${donem}"></canvas>
    `;
    konfetiYagdir(`confetti${donem}`);
  } else {
    const yuzde60 = ortalamaYuvarlanmis * 0.6;
    const gerekliFinal = ((59.5 - yuzde60) / 0.4);
    const gerekliFinalYuvarlanmis = gerekliFinal.toFixed(2);

   if (gerekliFinal > 100) {
      sonucDiv.innerHTML = `
        <b>Ortalamanız: ${hamOrtalama.toFixed(2)}</b><br>
        <div style="font-size: 22px; color: #d9534f; margin-top: 10px;">
      😢 Ne yazık ki finalden <b>${gerekliFinalYuvarlanmis}</b> almanız gerekiyor.<br>
      Bu mümkün değil, <b>sınıfta kaldınız.</b>
        </div>
        <div style="font-size: 18px; margin-top: 15px; color: #a94442;">
      📚 Yeni bir yıl, yeni bir başlangıç seni bekliyor...<br>
      <i>Kendini toparla, seneye çok daha iyi olacak!</i>
        </div>
    <img src="uzgun-kedi.jpg" alt="Üzgün kedi" style="margin-top: 15px; width: 200px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      `;
    } else if (gerekliFinal <= 50) {
      sonucDiv.innerHTML = `
        <b>Ortalamanız: ${hamOrtalama.toFixed(2)}</b><br>
        Tebrikler! Finaliniz sadece <b>50</b>’ye kaldı. Başarılar! 🎉
      `;
    } else {
      sonucDiv.innerHTML = `
        <b>Ortalamanız: ${hamOrtalama.toFixed(2)}</b><br>
        Final sınavından geçmek için minimum <b>${gerekliFinalYuvarlanmis}</b> almanız gerekiyor.
      `;
    }
  }
}


function konfetiYagdir(canvasId) {
  const canvas = document.getElementById(canvasId);
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  let confetti = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    size: Math.random() * 5 + 2
  }));

  let gravity = 1;
  let angle = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(p => {
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

function toggleDestek() {
  const kutu = document.getElementById("destekKutusu");
  kutu.style.display = (kutu.style.display === "block") ? "none" : "block";
}

function kopyala(id) {
  const yazi = document.getElementById(id).innerText;
  navigator.clipboard.writeText(yazi)
    .then(() => alert("Kopyalandı: " + yazi))
    .catch(err => alert("Kopyalama başarısız: " + err));
}
