//////////////// Drop Upload Handling ////////////////////
const dropArea = document.getElementById("drop-zone");
const inputFile = document.getElementById('input-file');

dropArea.addEventListener("dragover",function(e) {
    e.preventDefault();
});
dropArea.addEventListener('drop',function(e) {
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
});
/////////////////////////////////////////////////////////

////// --------- Creating a line item ----------///////////
function CreateListLineItem (file){

    /*
    <div class="row">
        <div class="col-md-4 list-field">
            File name
        </div>
        <div class="col-md-1">
            file Id 
        </div>
        <div class="col-md-2">
            file type
        </div>
        <div class="col-md-1">
            file size
        </div>
        <div class="col-md-2">
            file time
        </div>
        <div class="col-md-2">
            <button class="download-button"> Download</button>
        </div>
    </div>
    */

    //creating a row
    const rowItem = document.createElement("div");
    rowItem.classList.add("row","list-item");

    //creating filename col
    const fileNameCol = document.createElement("div");
    fileNameCol.classList.add("col-md-4","list-field");
    fileNameCol.textContent = file.fileName;

    //craeting fileid col
    const fileIdCol = document.createElement("div");
    fileIdCol.classList.add("col-md-1","list-field");
    fileIdCol.textContent = file.fileId;

    //creating filetype col
    const fileTypeCol = document.createElement("div");
    fileTypeCol.classList.add("col-md-1","list-field");
    fileTypeCol.textContent = file.fileType;

    //creating filesize col
    const fileSizeCol = document.createElement("div");
    fileSizeCol.classList.add("col-md-1","list-field");
    fileSizeCol.textContent = file.fileSize ? file.fileSize : "-";   

    //creating filesize col
    const fileTimeCol = document.createElement("div");
    fileTimeCol.classList.add("col-md-3","list-field");
    fileTimeCol.textContent = file.updatedAt ? file.updatedAt : "-"; 

    //craeting download button
    const downloadCol = document.createElement('div');
    const downloadBtn = document.createElement('button');
    
    downloadCol.classList.add("col-md-2","list-field");
    downloadBtn.classList.add("download");
    downloadBtn.textContent = "Download";
    downloadBtn.id = file.fileId;
    downloadCol.appendChild(downloadBtn);

    rowItem.appendChild(fileNameCol);
    rowItem.appendChild(fileIdCol);
    rowItem.appendChild(fileTypeCol);
    rowItem.appendChild(fileSizeCol);
    rowItem.appendChild(fileTimeCol);
    rowItem.appendChild(downloadCol);
    return rowItem;
}


///////////////////////////////////////////////////////////

////// --------- GetFiles API Fetch ------------///////////
const GetFiles = async function FetchFiles() { 

    try{
        var response = await fetch('http://localhost:4000/files', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Error Getting files');
        }
        console.log(response);
        files = await response.json();
        console.log(files);
        const newList = document.getElementById('file-list');
        for(var i = 0;i < files.length; i++){

            const newItem = CreateListLineItem (files[i]);
            newList.appendChild(newItem);
        }

    } catch (error) {
        console.error(error);
        document.getElementById('result2').textContent = 'Error getting files';
    }
}
///////////////////////////////////////////////////////////

////// --------- Prepare the list of files  ------------///////////
async function PrepareList(){
    await GetFiles();
    const downloadBtns = document.querySelectorAll(".download");
    downloadBtns.forEach(downloadBtn => {
      downloadBtn.addEventListener('click', async function handleClick(event){
          try {

              const response = await fetch(`http://localhost:4000/files/getfile?fileid=${downloadBtn.id}`, {
              method: 'GET',
              });

              if (!response.ok) {
                  throw new Error('Error Getting file');
              }

              const filename = response.headers.get('filename');
              const streamSaver = window.streamSaver
              const fileStream = streamSaver.createWriteStream(filename);
              const writer = fileStream.getWriter();

              const reader = response.body.getReader();

              const pump = () => reader.read()
                .then(({ value, done }) => {
                  if (done) writer.close();
                  else {
                    writer.write(value);
                    return writer.ready.then(pump);
                  }
                });

              await pump()
                .then(() => console.log('Closed the stream, Done writing'))
                .catch(err => console.log(err));
              
          } catch (error) {
              console.error(error);
              document.getElementById('result').textContent = 'Error uploading file';
          }
      })
    });
}

PrepareList();


///////////////////////////////////////////////////////////

////// --------- Upload File API POST ------------///////////
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const fileInput = document.getElementById('input-file');
  const file = fileInput.files[0];
  const accessKey = document.getElementById('InputAccessKey');
  if (!file) {
    alert('Eh! Please select a file.');
    return;
  }
  if(!accessKey || accessKey.value == ""){
    alert("Eh! Please enter the access Key.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('accesskey',accessKey.value);
  document.querySelector('.upload-response').textContent = "Uploading...";
  try {
    var response = await fetch('http://localhost:4000/files', {
      method: 'POST',
      body: formData
    });

    response = await response.json();
    if (!response.ok) {
      throw new Error('Error uploading file');
    }
    PrepareList();
    document.querySelector('.upload-response').textContent = response.message;
  } catch (error) {
    console.error(error);
    document.querySelector('.upload-response').textContent = response.message;
  }
  
});
