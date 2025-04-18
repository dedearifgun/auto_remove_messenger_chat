function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findParentWithRoleRow(element) {
  while (element && element.getAttribute('role') !== 'row') {
    element = element.parentElement;
  }
  return element;
}

function openMenuFromRow(parentRow) {
  const gridCells = parentRow.querySelectorAll('div[role="gridcell"]');
  if (!gridCells[1]) return;
  const button = gridCells[1].querySelector("div[role=button]");
  if (button) {
    button.click();
    console.log("⋯ Menu dibuka");
  }
}

async function findMenuClickDelete() {
  let attempts = 0;
  while (attempts < 10) {
    const menuItems = [...document.querySelectorAll("div[role=menuitem]")];
    const target = menuItems.find(el => el.innerText.trim().includes("Hapus obrolan"));

    if (target) {
      target.click();
      console.log("✅ Klik 'Hapus obrolan'");
      return true;
    }

    await delay(300);
    attempts++;
  }

  console.log("❌ Gagal menemukan 'Hapus obrolan'");
  return false;
}

function confirmDelete() {
  const allButtons = [...document.querySelectorAll('div[role=dialog] [role=button]')];
  const confirmButton = allButtons.find(btn =>
    btn.innerText.includes("Hapus") || btn.innerText.includes("Delete")
  );
  if (confirmButton) {
    confirmButton.click();
    console.log("🗑️ Konfirmasi hapus diklik");
  } else {
    console.log("❌ Tombol konfirmasi tidak ditemukan");
  }
}

async function autoScrollToBottom() {
  return new Promise((resolve) => {
    let totalHeight = 0;
    let distance = 1000;
    let timer = setInterval(() => {
      window.scrollBy(0, distance);
      totalHeight += distance;
      if (totalHeight >= document.body.scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, 500);
  });
}

async function processChats() {
  await autoScrollToBottom();
  console.log("📜 Selesai scroll, mulai proses penghapusan...");

  const allATags = document.querySelectorAll('a[href^="/messages/t/"]');
  const uniqueATags = [...new Set(allATags)];

  for (let i = 0; i < uniqueATags.length; i++) {
    const aTag = uniqueATags[i];
    const parentRow = findParentWithRoleRow(aTag);
    if (!parentRow) continue;

    console.log(`🔁 Memproses chat ${i + 1} / ${uniqueATags.length}`);
    openMenuFromRow(parentRow);
    await delay(1500);

    const clicked = await findMenuClickDelete();
    if (clicked) {
      await delay(2000);
      confirmDelete();
      await delay(3000);
    } else {
      console.log("⏩ Skip, lanjut ke berikutnya");
    }

    await delay(2000);
  }

  console.log("✅ Semua chat telah diproses.");
}

processChats();
