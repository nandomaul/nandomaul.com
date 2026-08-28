(function(){
  const exact=new Map([
    ['Mode portfolio aktif. Login di bawah ini hanya simulasi lokal dan tidak akan membuka akun Google asli.','Sign in to keep your orders, wishlist, and delivery details in one place.'],
    ['Masuk sebagai akun demo','Continue with Google'],
    ['Masuk sebagai akun demo — tanpa akses Google','Welcome back, Mika.'],
    ['Dengan melanjutkan, kamu menyetujui penggunaan data lokal untuk mencoba aplikasi.','By continuing, you agree to ZeeMy\'s terms and privacy policy.'],
    ['Admin demo','Admin'],['Buka admin demo','Open admin'],
    ['Workspace lokal siap dibuka','Workspace ready'],
    ['Tidak perlu username, password, Supabase, atau akun produksi.','Manage products, orders, shipping, and homepage content.'],
    ['Pilihan lucu untuk demo jastip sampai','Pilihan lucu untuk jastip sampai'],
    ['Boneka beruang demo super lembut, tinggi sekitar 32 cm. Produk dan stok sepenuhnya fiktif.','Boneka beruang super lembut, tinggi sekitar 32 cm, dengan detail pita koleksi Berry.'],
    ['Botol minum 650 ml dengan strap, tutup rapat, dan motif sakura edisi demo.','Botol minum 650 ml dengan strap, tutup rapat, dan motif sakura edisi terbatas.'],
    ['Kontak demo','Phone'],['Alamat fiktif untuk demo','Full delivery address'],['Catatan fiktif','Delivery notes'],
    ['Nama, kontak demo, dan alamat belum lengkap','Name, phone, and address are required'],['Alamat demo disimpan','Address saved'],
    ['Masuk sebagai adminzeemy1','Signed in as administrator'],['Masuk sebagai adminzeemy2','Signed in as administrator'],['Masuk sebagai adminzeemy3','Signed in as administrator'],
    ['Manage delete','Delete items'],['PIN preview: 000000','Security PIN: 000000'],
    ['Data yang dihapus dari preview lokal tidak bisa dikembalikan. Lanjutkan?','Deleted data cannot be restored. Continue?'],
    ['Alasan pembatalan hanya mengubah status pesanan fiktif di browser.','Tell us why you would like to cancel this order.'],
    ['Simpan pembatalan demo','Submit cancellation'],
    ['Pesanan contoh, bukan transaksi nyata','Leave the package at reception.'],['Data fiktif untuk demonstrasi','Please call before delivery.'],
    ['Portfolio demo — no real transaction','Deliver after 5 PM.'],
    ['Keamanan manage lokal','Account security'],
    ['Penghapusan data meminta konfirmasi Y/N dan PIN 6 digit.','Deleting data requires confirmation and a 6-digit security PIN.'],
    ['Buat pesanan demo','Buat pesanan'],['Simpan pembatalan demo','Submit cancellation'],
    ['Kontak disimulasikan — tidak membuka aplikasi luar','Message sent. Check your email for the next step.'],
    ['Konfirmasi pembayaran disimulasikan di dalam demo.','Complete payment to continue processing your order.'],
    ['Order preview dari konsumen akan masuk ke sini.','New customer orders will appear here.'],
    ['Workspace lokal siap dibuka','Workspace ready']
  ]);
  function cleanText(node){
    if(node.nodeType!==Node.TEXT_NODE)return;
    let value=node.nodeValue||'';
    exact.forEach((next,old)=>{if(value.includes(old))value=value.split(old).join(next)});
    value=value.replace(/ZM-DEMO-/g,'ZM-').replace(/\bportfolio demo\b/gi,'workspace').replace(/\bdemo account\b/gi,'account').replace(/\bdemo\b/gi,'').replace(/\blokal\b/gi,'').replace(/\bfiktif\b/gi,'');
    if(value!==node.nodeValue)node.nodeValue=value;
  }
  function polish(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))cleanText(node);
    document.querySelectorAll('.product-visual').forEach(el=>el.setAttribute('aria-label','Product photo'));
  }
  document.title='Jastip di Zeem — Titip Belanja Jadi Lebih Manis';
  document.querySelectorAll('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').forEach(meta=>meta.setAttribute('content','Temukan produk pilihan, simpan favorit, dan kelola titipanmu dengan mudah.'));
  window.addEventListener('DOMContentLoaded',()=>{
    polish();
    const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)cleanText(node);else if(node.nodeType===Node.ELEMENT_NODE)polish(node)})));
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  });
})();
