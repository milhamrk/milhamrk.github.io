function createDatabase(){
  if(!('indexedDB' in window)){
    console.log('ora cok');
    return;
  }
  var request = window.indexedDB.open('komsi');
  request.onerror = eReport;
  request.onupgradeneeded = function(e){
    var db = e.target.result;
    db.error = eReport;
    var objStore = db.createObjectStore('tebel',{
      keyPath: 'nim'
    });
    console.log("tebel genah crot");
  }
  request.onsuccess = function(e){
    db = e.target.result;
    db.onerror = eReport;
    console.log("tebel done");
    readDB();
  }
}

function eReport(err){
  console.log("Error:" + err.target.errorCode);
}

createDatabase();
var tabel = document.getElementById('tabel-mahasiswa'),
  form = document.getElementById('form-tambah'),
  nama = document.getElementById('nama'),
  nim = document.getElementById('nim'),
  gender = document.getElementById('gender');

form.addEventListener('submit',newColumn);

function newColumn(e){
  if(tabel.rows.namedItem(nim.value)){
    alert("NIM: Already registered");
    e.preventDefault();
    return;
  }
  insertDB({
    nim: nim.value,
    nama : nama.value,
    gender : gender.value
  });

  var baris = tabel.insertRow();
  baris.id = nim.value;
  baris.insertCell().appendChild(document.createTextNode(nim.value));
  baris.insertCell().appendChild(document.createTextNode(nama.value));
  baris.insertCell().appendChild(document.createTextNode(gender.value));

  var btn = document.createElement('input');
  btn.type = 'button';
  btn.value = 'Hapus';
  btn.id = nim.value;
  btn.className = 'btn btn-danger btn-sm';
  baris.insertCell().appendChild(btn);
  e.preventDefault();
}

function insertDB(data){
  var objStore = initTrc().objectStore('tebel');
  var request = objStore.add(data);
  request.onerror = eReport;
  request.onsuccess = console.log("Sukses cok");
}

function initTrc(){
  var transc = db.transaction(['tebel'],'readwrite');
  transc.onerror = eReport;
  transc.oncomplete = console.log("tebel done");
  return transc;
}

function readDB(){
  var obj = initTrc().objectStore('tebel');
  obj.openCursor().onsuccess = function(e){
    var result = e.target.result;
    if(result){
      console.log('kontol anjing!!!' + [result.value.nim]);
      var baris = tabel.insertRow();
      baris.id = result.value.nim;
      baris.insertCell().appendChild(document.createTextNode(result.value.nim));
      baris.insertCell().appendChild(document.createTextNode(result.value.nama));
      baris.insertCell().appendChild(document.createTextNode(result.value.gender));

      var btn = document.createElement('input');
      btn.type = 'button';
      btn.value = 'Hapus';
      btn.id = result.value.nim;
      btn.className = 'btn btn-danger btn-sm';
      baris.insertCell().appendChild(btn);
      result.continue();
    }
  }
}

tabel.addEventListener('click', remove);

function remove(e){
  if(e.target.type === "button"){
    var hapus = confirm("Are you sure?");
    if(hapus){
      tabel.deleteRow(tabel.rows.namedItem(e.target.id).sectionRowIndex);
      var objStore = initTrc().objectStore('tebel');
      var request = objStore.delete(e.target.id);
      request.onerror = eReport;
    }
  }
}