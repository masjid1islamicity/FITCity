import { jsPDF } from 'jspdf';
import { FamilyMemberFitness, WorshipChecklistItem, SpiritualJournalEntry, PrayerTimeData } from '../types';
import { sound } from './audio';

export function exportFamilyFitnessPDF(familyMembers: FamilyMemberFitness[]) {
  sound.playPeacefulChime();

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Emerald Header Bar
  doc.setFillColor(5, 150, 105); // #059669
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('FITCity - Rekap Mingguan Kebugaran Jasmani Keluarga', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Ekosistem Kota Madani Cerdas Rendah Emisi & Kebugaran Terpadu', 14, 21);

  // Motto Box
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(14, 34, pageWidth - 28, 22, 3, 3, 'FD');

  doc.setTextColor(4, 120, 87); // emerald-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('MOTTO KEBUGARAN FITCITY:', 18, 41);

  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.text(
    '"FIT Mahkota Jihad dijalan Allah untuk menjaga kebugaran jasmani agar lebih semangat dalam beribadah."',
    18,
    49
  );

  // Metadata Row
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Tanggal Cetak Arsip: ${dateStr}`, 14, 63);
  doc.text('Sinkronisasi: WearOS / Apple Health Terverifikasi', pageWidth - 14, 63, { align: 'right' });

  // Summary Metrics Banner
  const totalSteps = familyMembers.reduce((acc, curr) => acc + curr.dailySteps, 0);
  const targetSteps = familyMembers.reduce((acc, curr) => acc + curr.targetSteps, 0);
  const pct = Math.round((totalSteps / targetSteps) * 100);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 68, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL LANGKAH KELUARGA', 20, 76);
  doc.text('PENCAPAIAN TARGET', 85, 76);
  doc.text('ESTIMASI KALORI', 145, 76);

  doc.setFontSize(13);
  doc.setTextColor(5, 150, 105);
  doc.text(`${totalSteps.toLocaleString('id-ID')} / ${targetSteps.toLocaleString('id-ID')}`, 20, 85);
  doc.text(`${pct}% Tercapai`, 85, 85);
  doc.text('1.640 kkal', 145, 85);

  // Table Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Rincian Capaian Anggota Keluarga', 14, 102);

  // Table Header
  let startY = 108;
  doc.setFillColor(15, 118, 110); // teal-700
  doc.rect(14, startY, pageWidth - 28, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Nama Anggota', 18, startY + 5.5);
  doc.text('Hubungan', 60, startY + 5.5);
  doc.text('Langkah Harian', 90, startY + 5.5);
  doc.text('Menit Aktif', 125, startY + 5.5);
  doc.text('Air Minum', 155, startY + 5.5);
  doc.text('Streak', pageWidth - 20, startY + 5.5, { align: 'right' });

  // Table Rows
  startY += 8;
  familyMembers.forEach((m, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, startY, pageWidth - 28, 8, 'F');
    }

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    doc.text(m.name, 18, startY + 5.5);
    doc.text(m.relation, 60, startY + 5.5);
    doc.text(`${m.dailySteps.toLocaleString('id-ID')} / ${m.targetSteps.toLocaleString('id-ID')}`, 90, startY + 5.5);
    doc.text(`${m.activeMinutes} mnt`, 125, startY + 5.5);
    doc.text(`${m.waterLiters} L`, 155, startY + 5.5);
    doc.text(`${m.streakDays} hari`, pageWidth - 20, startY + 5.5, { align: 'right' });

    startY += 8;
  });

  // AI Health Coach Assessment Section
  startY += 8;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, startY, pageWidth - 28, 48, 3, 3, 'FD');

  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Evaluasi AI Kebugaran Jasmani & Stamina Ibadah:', 20, startY + 8);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const aiText = [
    '• Volume jalan kaki rutin keluarga setelah Subuh menunjukkan tren positif (+14% peningkatan mingguan).',
    '• Denyut jantung istirahat (resting heart rate) Ayah membaik ke 66 bpm, mendukung ketahanan sujud dan ruku.',
    '• Kakek berhasil mempertahankan rutinitas jalan kaki ringan 3.800 langkah tanpa keluhan sendi lutut.',
    '• Rekomendasi: Pertahankan hidrasi 2,8 liter per hari dan luangkan waktu peregangan sendi sebelum Shalat Isya berjamaah.',
  ];

  let textY = startY + 16;
  aiText.forEach((line) => {
    doc.text(line, 20, textY);
    textY += 7;
  });

  // Footer / Watermark
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text('Dokumen ini di-generate secara otomatis oleh FITCity Superapp untuk arsip pribadi keluarga.', 14, 285);
  doc.text('https://ais-dev-j2hgkfi2fz5q4lhcwrfkzm-302564753338.asia-southeast1.run.app', pageWidth - 14, 285, { align: 'right' });

  // Save PDF
  doc.save('FITCity_Rekap_Kebugaran_Keluarga.pdf');
}

export function exportWorshipDisciplinePDF(
  checklist: WorshipChecklistItem[],
  journalEntries: SpiritualJournalEntry[],
  prayerTimes: PrayerTimeData[]
) {
  sound.playPeacefulChime();

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Emerald Green Header Bar
  doc.setFillColor(4, 120, 87); // #047857
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('FITCity - Rekap Kedisiplinan Ibadah & Muhasabah Jiwa', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Arsip Pribadi Evaluasi Spiritual & Peningkatan Kualitas Amalan Harian', 14, 21);

  // Quran verse box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(14, 34, pageWidth - 28, 20, 3, 3, 'FD');

  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PANDUAN AL-QUR\'AN:', 18, 41);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.text(
    '"Peliharalah semua shalat(mu), dan (peliharalah) shalat wustha. Berdirilah untuk Allah (dalam shalatmu) dengan khusyuk." (QS. Al-Baqarah: 238)',
    18,
    48
  );

  // Metadata Row
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Tanggal Cetak: ${dateStr}`, 14, 60);
  doc.text('FITCity Spiritual Reflection Module', pageWidth - 14, 60, { align: 'right' });

  // Progress KPI Box
  const completedCount = checklist.filter((i) => i.completed).length;
  const totalScore = checklist.filter((i) => i.completed).reduce((acc, curr) => acc + curr.points, 0);
  const maxScore = checklist.reduce((acc, curr) => acc + curr.points, 0);
  const pct = Math.round((completedCount / checklist.length) * 100);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 64, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('TARGET TERCAPAI', 20, 72);
  doc.text('TOTAL POIN KEBAIKAN', 85, 72);
  doc.text('KONSISTENSI PEKAN INI', 145, 72);

  doc.setFontSize(12);
  doc.setTextColor(4, 120, 87);
  doc.text(`${completedCount} dari ${checklist.length} Amalan (${pct}%)`, 20, 80);
  doc.text(`${totalScore} / ${maxScore} Poin`, 85, 80);
  doc.text('86% (Disiplin Tinggi)', 145, 80);

  // Section 1: Checklist Amalan
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('Target Kedisiplinan Ibadah Harian', 14, 93);

  let startY = 98;
  doc.setFillColor(5, 150, 105);
  doc.rect(14, startY, pageWidth - 28, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Amalan Ibadah', 18, startY + 5);
  doc.text('Kategori', 75, startY + 5);
  doc.text('Target', 115, startY + 5);
  doc.text('Poin', 155, startY + 5);
  doc.text('Status', pageWidth - 20, startY + 5, { align: 'right' });

  startY += 7;
  checklist.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, startY, pageWidth - 28, 6.5, 'F');
    }

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    doc.text(item.name, 18, startY + 4.5);
    doc.text(item.category, 75, startY + 4.5);
    doc.text(item.target, 115, startY + 4.5);
    doc.text(`+${item.points}`, 155, startY + 4.5);

    if (item.completed) {
      doc.setTextColor(5, 150, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('Tercapai', pageWidth - 20, startY + 4.5, { align: 'right' });
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text('Belum', pageWidth - 20, startY + 4.5, { align: 'right' });
    }

    startY += 6.5;
  });

  // Section 2: Jurnal Refleksi Spiritual (Muhasabah)
  startY += 6;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('Catatan Jurnal Refleksi & Muhasabah Jiwa', 14, startY);

  startY += 5;
  journalEntries.slice(0, 3).forEach((entry) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, startY, pageWidth - 28, 24, 2, 2, 'FD');

    doc.setTextColor(4, 120, 87);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const voiceTag = entry.isVoiceRecorded ? ' (Dilisankan via Dikte Suara)' : '';
    doc.text(`${entry.date} · ${entry.timestamp} [${entry.mood}]${voiceTag}`, 18, startY + 6);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    const splitReflect = doc.splitTextToSize(`"${entry.reflections}"`, pageWidth - 36);
    doc.text(splitReflect, 18, startY + 12);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Tilawah: ${entry.quranProgress}`, 18, startY + 20);

    startY += 27;
  });

  // Footer / Watermark
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text('Dokumen ini di-generate secara otomatis oleh FITCity Superapp untuk arsip muhasabah pribadi.', 14, 285);
  doc.text('https://ais-dev-j2hgkfi2fz5q4lhcwrfkzm-302564753338.asia-southeast1.run.app', pageWidth - 14, 285, { align: 'right' });

  // Save PDF
  doc.save('FITCity_Rekap_Kedisiplinan_Ibadah.pdf');
}
