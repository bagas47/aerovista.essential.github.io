/**
 * AeroVista Tour & Travel — Contact & Booking Handler
 * Real-time validation and WhatsApp message pre-fill builder
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.querySelector('#contactBookingForm');
  if (!bookingForm) return;

  const waAdminNumber = '6281234567890'; // Official Webyr/AeroVista corporate WA

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.querySelector('#fullName');
    const waInput = document.querySelector('#waNumber');
    const packageSelect = document.querySelector('#packageChoice');
    const dateInput = document.querySelector('#travelDate');
    const paxInput = document.querySelector('#paxCount');
    const notesInput = document.querySelector('#specialNotes');
    const submitBtn = bookingForm.querySelector('button[type="submit"]');

    // Validation
    const name = nameInput?.value.trim() || '';
    const phone = waInput?.value.trim() || '';
    const selectedPkg = packageSelect?.value || '';
    const date = dateInput?.value || 'Segera didiskusikan';
    const pax = paxInput?.value || '1';
    const notes = notesInput?.value.trim() || 'Tidak ada catatan khusus';

    if (name.length < 3) {
      alert('Mohon masukkan nama lengkap Anda (minimal 3 karakter).');
      nameInput?.focus();
      return;
    }

    if (!phone || phone.length < 9) {
      alert('Mohon masukkan nomor WhatsApp aktif yang dapat dihubungi.');
      waInput?.focus();
      return;
    }

    if (!selectedPkg) {
      alert('Silakan pilih salah satu paket wisata yang diminati.');
      packageSelect?.focus();
      return;
    }

    // Disable button briefly to show state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Menghubungkan ke WhatsApp...
      `;
    }

    // Compose formatted WhatsApp message
    const message = 
      `Halo Tim Reservasi AeroVista Tour & Travel,\n` +
      `Saya ingin konsultasi & reservasi paket wisata dengan rincian berikut:\n\n` +
      `👤 *Data Pemesan:*\n` +
      `• Nama Lengkap: ${name}\n` +
      `• No. WhatsApp: ${phone}\n\n` +
      `✈️ *Rincian Liburan:*\n` +
      `• Pilihan Paket: *${selectedPkg}*\n` +
      `• Estimasi Tanggal: ${date}\n` +
      `• Jumlah Peserta: ${pax} Orang\n` +
      `• Catatan Khusus: ${notes}\n\n` +
      `Mohon informasikan ketersediaan kuota, fasilitas, dan detail penawarannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waAdminNumber}?text=${encodedMessage}`;

    // Redirect after slight natural delay
    setTimeout(() => {
      window.open(waUrl, '_blank');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"></path>
          </svg>
          Kirim via WhatsApp Resmi
        `;
      }
    }, 600);
  });
});
